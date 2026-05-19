import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// PIECE 7: OrbEngine
// Manages descending note orbs for Phase 2 (©PLING! mode).
// Timing: requestAnimationFrame + AudioContext.currentTime
// NOT setInterval — this is sub-frame accurate.
//
// Orb lifecycle:
//   DESCENDING → at 50% descent, gate opens (mic window)
//   GATE_OPEN  → pitch gate fires; orb turns green or amber
//   TAP_WINDOW → student taps fret; orb clears
//   MISSED     → orb reaches bottom; miss logged
// ═══════════════════════════════════════════════════════════

const ORB_HEIGHT_PX = 36;
const LANE_HEIGHT   = 280; // px — visual descent distance
const GATE_POSITION = 0.5; // 50% of descent triggers mic gate

// BPM → ms per beat
const bpmToMs = (bpm) => 60000 / bpm;

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
    gateOpened: false,
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
  onGateOpen,     // (orbId, targetNote) => void
  onGateResult,   // (orbId, 'passed' | 'failed', centsDev) => void
  active          = false,
  audioCtxRef,    // shared AudioContext ref from usePitchDetector
}) {
  const [orbs, setOrbs] = useState([]);         // active orbs on screen
  const [progress, setProgress] = useState({}); // orbId → 0.0–1.0
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

        // Open gate at 50%
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
  }, [pitch, noteInfo, preset, onGateOpen, onGateResult, onOrbMiss, audioCtxRef]);

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

    setOrbs(prev => prev.map(o => o.id === orb.id ? { ...o, tapped: true } : o));
  }, [noteInfo, preset, breathState, onOrbTap, onGateResult]);

  if (!active || orbs.length === 0) return null;

  return (
    <div style={{ position: 'relative', height: LANE_HEIGHT, overflow: 'hidden', borderRadius: 8, background: 'rgba(0,0,0,0.2)' }}>
      <AnimatePresence>
        {orbs.map(orb => {
          const p    = progress[orb.id] ?? 0;
          const top  = p * (LANE_HEIGHT - ORB_HEIGHT_PX);
          const col  = orb.gateResult === 'passed' ? '#2ed573' : orb.gateResult === 'failed' ? '#ffab00' : '#c9a96e';
          const glow = orb.gateResult === 'passed' ? 'rgba(46,213,115,0.5)' : orb.gateResult === 'failed' ? 'rgba(255,171,0,0.3)' : 'rgba(201,169,110,0.3)';

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
              <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                {orb.note?.name ?? '?'}
              </span>
              {/* Gate indicator pulse when gate is open */}
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
      </AnimatePresence>

      {/* Lane label */}
      <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '0.55rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {preset.label}
      </div>
    </div>
  );
}

export default OrbEngine;
