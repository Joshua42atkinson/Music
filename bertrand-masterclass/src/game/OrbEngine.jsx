import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// PIECE 7: OrbEngine
// Manages descending note orbs for Phase 2 (©PLING! mode).
// Timing: requestAnimationFrame + AudioContext.currentTime
// NOT setInterval — this is sub-frame accurate.
//
// Orb lifecycle (with AUDIATION PAUSE):
//   DESCENDING      → orb appears, note name visible
//   AUDIATION_PAUSE → at 30% descent, "Hear it inside" prompt
//                     NO mic, NO reference pitch — pure imagination
//   GATE_OPEN       → at 50% descent, mic activates for pitch gate
//   TAP_WINDOW      → student taps fret; orb clears
//   MISSED          → orb reaches bottom; miss logged
//
// The AUDIATION PAUSE is the pedagogical core. Without it,
// this is Guitar Hero. With it, this trains audiation.
// (Edwin Gordon, MLT — Music Learning Theory)
// ═══════════════════════════════════════════════════════════

const ORB_HEIGHT_PX = 36;
const LANE_HEIGHT   = 280; // px — visual descent distance
const AUDIATION_POSITION = 0.30; // 30% of descent triggers audiation pause
const GATE_POSITION      = 0.50; // 50% of descent opens mic gate

const bpmToMs = (bpm) => 60000 / bpm;

import { playPling } from '../audio/audioEngine';

// Difficulty presets (never called Easy/Medium/Hard)
export const DIFFICULTY_PRESETS = {
  awakening: { bpm: 80,  tolerance: 35, beatsPerOrb: 4, label: 'Kinesthetic Awakening' },
  practice:  { bpm: 120, tolerance: 20, beatsPerOrb: 2, label: 'Applied Practice' },
  flow:      { bpm: 160, tolerance: 10, beatsPerOrb: 1, label: 'Flow State' },
};

let _orbId = 0;
function makeOrb(note, stringIdx, fret) {
  return {
    id: ++_orbId,
    note,       // { name, midi, freq }
    stringIdx,
    fret,
    spawnTime: null,      // AudioContext.currentTime at spawn
    durationMs: null,     // total descent time in ms
    audiating: false,     // true during audiation pause (30-50%)
    gateOpened: false,    // true when mic gate is open (50%+)
    gateResult: null,     // 'passed' | 'failed' | null
    tapped: false,
    missed: false,
  };
}

function OrbEngine({
  // Pattern: array of {note, stringIdx, fret} entries to queue
  orbSequence     = [],
  difficulty      = 'awakening',
  // Live pitch data from usePitchDetector
  pitch           = null,
  noteInfo        = null,
  breathState     = 'free',
  // Callbacks
  onOrbTap,       // (orbId, {correct, centsDev, breathState}) => void
  onOrbMiss,      // (orbId) => void
  onAudiateStart, // (orbId, targetNote) => void — audiation pause begins
  onGateOpen,     // (orbId, targetNote) => void — mic gate opens
  onGateResult,   // (orbId, 'passed' | 'failed', centsDev) => void
  active          = false,
  audioCtxRef,    // shared AudioContext ref from usePitchDetector
}) {
  const [orbs, setOrbs] = useState([]);         // active orbs on screen
  const [progress, setProgress] = useState({}); // orbId → 0.0–1.0
  const [bursts, setBursts] = useState([]);     // visual bursts on tap
  const seqIdxRef     = useRef(0);
  const rafRef        = useRef(null);
  const spawnTimerRef = useRef(null);
  const preset        = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.awakening;
  const descentMs     = bpmToMs(preset.bpm) * preset.beatsPerOrb * 4; // 4 beats of descent

  // ── Spawn next orb from sequence ──
  const spawnNext = useCallback(() => {
    if (!active || seqIdxRef.current >= orbSequence.length) return;
    const entry = orbSequence[seqIdxRef.current];
    seqIdxRef.current++;

    const ctx = audioCtxRef?.current;
    const orb = makeOrb(entry.note, entry.stringIdx, entry.fret);
    orb.spawnTime  = ctx?.currentTime ?? performance.now() / 1000;
    orb.durationMs = descentMs;

    setOrbs(prev => [...prev, orb]);

    // Schedule next spawn
    const msPerOrb = bpmToMs(preset.bpm) * preset.beatsPerOrb;
    spawnTimerRef.current = setTimeout(spawnNext, msPerOrb);
  }, [active, orbSequence, descentMs, preset, audioCtxRef]);

  // ── rAF loop: update orb positions + gate logic ──
  const tick = useCallback(() => {
    const ctx = audioCtxRef?.current;
    const nowSec = ctx?.currentTime ?? performance.now() / 1000;

    setOrbs(prev => {
      const next = [];
      const newProgress = {};

      for (const orb of prev) {
        const elapsedMs = (nowSec - orb.spawnTime) * 1000;
        const p = Math.min(1, elapsedMs / orb.durationMs);
        newProgress[orb.id] = p;

        // ── AUDIATION PAUSE at 30% — "Hear it inside" ──
        // No mic, no reference pitch — pure internal imagination
        if (!orb.audiating && p >= AUDIATION_POSITION && p < GATE_POSITION) {
          orb.audiating = true;
          onAudiateStart?.(orb.id, orb.note);
        }

        // ── GATE OPEN at 50% — mic activates ──
        if (!orb.gateOpened && p >= GATE_POSITION) {
          orb.gateOpened = true;
          onGateOpen?.(orb.id, orb.note);
        }

        // Evaluate gate while open (pitch must be detected)
        if (orb.gateOpened && !orb.gateResult && pitch && noteInfo) {
          const centsDev = noteInfo.cents ?? 0;
          if (Math.abs(centsDev) <= preset.tolerance) {
            orb.gateResult = 'passed';
            onGateResult?.(orb.id, 'passed', centsDev);
          }
          // Failed gate: evaluated at tap time (not during descent)
        }

        // Miss: reached bottom without tap
        if (p >= 1 && !orb.tapped) {
          orb.missed = true;
          onOrbMiss?.(orb.id);
          continue; // Remove from array
        }

        // Remove tapped orbs
        if (orb.tapped) continue;

        next.push(orb);
      }

      setProgress(newProgress);
      return next;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [pitch, noteInfo, preset, onAudiateStart, onGateOpen, onGateResult, onOrbMiss, audioCtxRef]);

  useEffect(() => {
    if (active) {
      seqIdxRef.current = 0;
      spawnNext();
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      clearTimeout(spawnTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Player taps an orb ──
  const handleOrbTap = useCallback((orb) => {
    if (orb.tapped || orb.missed) return;
    const centsDev = noteInfo?.cents ?? 100; // large miss if no pitch
    const gateResult = orb.gateResult ?? (Math.abs(centsDev) <= preset.tolerance ? 'passed' : 'failed');

    // Finalise failed gate result
    if (!orb.gateResult) onGateResult?.(orb.id, gateResult, centsDev);

    onOrbTap?.(orb.id, { correct: gateResult === 'passed', centsDev, breathState, fret: orb.fret, stringIdx: orb.stringIdx });

    // Visual burst + Audio if passed
    if (gateResult === 'passed') {
      playPling(orb.note?.freq);
      setBursts(prev => [...prev, {
        id: Date.now() + Math.random(),
        stringIdx: orb.stringIdx,
        p: progress[orb.id] ?? 0
      }]);
    }

    setOrbs(prev => prev.map(o => o.id === orb.id ? { ...o, tapped: true } : o));
  }, [noteInfo, preset, breathState, onOrbTap, onGateResult, audioCtxRef, progress]);

  if (!active || orbs.length === 0) return null;

  return (
    <div style={{ position: 'relative', height: LANE_HEIGHT, overflow: 'hidden', borderRadius: 8, background: 'rgba(0,0,0,0.2)' }}>
      <AnimatePresence>
        {orbs.map(orb => {
          const p    = progress[orb.id] ?? 0;
          const top  = p * (LANE_HEIGHT - ORB_HEIGHT_PX);

          // Visual states: audiating (purple/pulse), gate open (gold), passed (green), failed (amber)
          const isAudiating = orb.audiating && !orb.gateOpened;
          const col  = orb.gateResult === 'passed' ? '#2ed573'
                     : orb.gateResult === 'failed' ? '#ffab00'
                     : isAudiating ? '#9b7acc'   // Purple during audiation pause
                     : '#c9a96e';
          const glow = orb.gateResult === 'passed' ? 'rgba(46,213,115,0.5)'
                     : orb.gateResult === 'failed' ? 'rgba(255,171,0,0.3)'
                     : isAudiating ? 'rgba(155,122,204,0.5)'  // Purple glow during audiation
                     : 'rgba(201,169,110,0.3)';

          // Audiation progress within the pause window (0→1 during 30%→50%)
          const audiateProgress = isAudiating
            ? Math.min(1, (p - AUDIATION_POSITION) / (GATE_POSITION - AUDIATION_POSITION))
            : 0;

          return (
            <motion.div
              key={orb.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              style={{
                position: 'absolute',
                top,
                // Horizontal position based on string index (6 strings across lane)
                left: `${(orb.stringIdx / 5) * 85 + 5}%`,
                width: ORB_HEIGHT_PX, height: ORB_HEIGHT_PX,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), ${col}88)`,
                border: `2px solid ${col}`,
                boxShadow: `0 0 16px ${glow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'top 16ms linear, border-color 0.2s, box-shadow 0.2s',
              }}
              onClick={() => handleOrbTap(orb)}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                {orb.note?.name ?? '?'}
              </span>

              {/* AUDIATION PAUSE — breathing ring + "hear it inside" */}
              {isAudiating && (
                <>
                  {/* Progress ring showing audiation countdown */}
                  <svg
                    width={ORB_HEIGHT_PX + 16} height={ORB_HEIGHT_PX + 16}
                    style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none' }}
                  >
                    <circle
                      cx={(ORB_HEIGHT_PX + 16) / 2} cy={(ORB_HEIGHT_PX + 16) / 2} r={(ORB_HEIGHT_PX + 12) / 2}
                      fill="none" stroke="rgba(155,122,204,0.2)" strokeWidth={2.5}
                    />
                    <circle
                      cx={(ORB_HEIGHT_PX + 16) / 2} cy={(ORB_HEIGHT_PX + 16) / 2} r={(ORB_HEIGHT_PX + 12) / 2}
                      fill="none" stroke="#9b7acc" strokeWidth={2.5}
                      strokeDasharray={`${audiateProgress * 151} 151`}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${(ORB_HEIGHT_PX + 16) / 2} ${(ORB_HEIGHT_PX + 16) / 2})`}
                      style={{ transition: 'stroke-dasharray 100ms linear' }}
                    />
                  </svg>
                  {/* Slow breathing pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: -10, borderRadius: '50%',
                      border: '1.5px solid #9b7acc', pointerEvents: 'none',
                    }}
                  />
                </>
              )}

              {/* Gate indicator pulse when gate is open (mic active) */}
              {orb.gateOpened && !orb.gateResult && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `1.5px solid ${col}`, pointerEvents: 'none',
                  }}
                />
              )}
            </motion.div>
          );
        })}
        {/* Render Visual Bursts */}
        {bursts.map(burst => {
          const top = burst.p * (LANE_HEIGHT - ORB_HEIGHT_PX);
          const left = `${(burst.stringIdx / 5) * 85 + 5}%`;
          return (
            <motion.div
              key={burst.id}
              initial={{ opacity: 0.8, scale: 1, borderWidth: '2px' }}
              animate={{ opacity: 0, scale: 2.5, borderWidth: '0px' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationComplete={() => setBursts(prev => prev.filter(b => b.id !== burst.id))}
              style={{
                position: 'absolute',
                top, left,
                width: ORB_HEIGHT_PX, height: ORB_HEIGHT_PX,
                borderRadius: '50%',
                borderColor: '#2ed573',
                borderStyle: 'solid',
                boxShadow: '0 0 20px rgba(46,213,115,0.8)',
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Audiation zone indicator — horizontal line at 30% */}
      <div style={{
        position: 'absolute',
        top: `${AUDIATION_POSITION * 100}%`,
        left: 0, right: 0,
        height: 1,
        background: 'rgba(155,122,204,0.3)',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <span style={{
          position: 'absolute', right: 4, top: -14,
          fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(155,122,204,0.5)', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>hear it inside</span>
      </div>

      {/* Gate line — horizontal line at 50% */}
      <div style={{
        position: 'absolute',
        top: `${GATE_POSITION * 100}%`,
        left: 0, right: 0,
        height: 1,
        background: 'rgba(201,169,110,0.3)',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <span style={{
          position: 'absolute', right: 4, top: -14,
          fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(201,169,110,0.5)', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>🎤 sing it</span>
      </div>

      {/* Lane label */}
      <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {preset.label}
      </div>
    </div>
  );
}

export default OrbEngine;
