import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// PIECE 6: PitchGateUI
// Shows a pitch needle + pass/fail state for Phase 2.
// Receives live pitch data from usePitchDetector.
//
// Props:
//   targetNote   — { name, midi, freq } — the orb's target
//   noteInfo     — live { name, cents } from usePitchDetector
//   pitch        — live Hz (null = no signal)
//   breathState  — 'free' | 'shallow' | 'held'
//   gateState    — 'waiting' | 'open' | 'passed' | 'failed'
//   tolerance    — cents threshold (35 | 20 | 10)
// ═══════════════════════════════════════════════════════════

const GATE_COLORS = {
  waiting: { needle: '#5a6a80', bg: 'rgba(90,106,128,0.1)',  border: 'rgba(90,106,128,0.3)',  label: 'Waiting…' },
  open:    { needle: '#c9a96e', bg: 'rgba(201,169,110,0.1)', border: 'rgba(201,169,110,0.4)', label: 'Sing it now' },
  passed:  { needle: '#2ed573', bg: 'rgba(46,213,115,0.15)', border: 'rgba(46,213,115,0.5)',  label: 'Gate passed ✓' },
  failed:  { needle: '#ffab00', bg: 'rgba(255,171,0,0.1)',   border: 'rgba(255,171,0,0.4)',   label: 'Penalty — tap anyway' },
};

const BREATH_INDICATORS = {
  free:    { color: '#2ed573', label: '✦ Breathing' },
  shallow: { color: '#ffab00', label: '~ Shallow breath' },
  held:    { color: '#ff4757', label: '✕ Breath held' },
};

function PitchGateUI({ targetNote, noteInfo, pitch, breathState = 'free', gateState = 'waiting', tolerance = 35 }) {
  const colors = GATE_COLORS[gateState] || GATE_COLORS.waiting;
  const breath = BREATH_INDICATORS[breathState] || BREATH_INDICATORS.free;

  // Needle position: map cents [-50, +50] to [0%, 100%]
  const centsRaw   = pitch ? (noteInfo?.cents ?? 0) : 0;
  const centsClamped = Math.max(-50, Math.min(50, centsRaw));
  const needlePct  = 50 + centsClamped; // 0–100

  const inZone = pitch && Math.abs(centsRaw) <= tolerance;

  return (
    <div style={{
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: '1rem',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', color: colors.needle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            Target Note
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: colors.needle, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>
            {targetNote?.name ?? '—'}
          </div>
        </div>

        {/* Live detected note */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', color: '#5a6a80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            Detecting
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1, color: inZone ? '#2ed573' : (pitch ? '#c9a96e' : '#3a4a5a') }}>
            {pitch ? noteInfo?.name : '—'}
          </div>
        </div>
      </div>

      {/* Pitch needle bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontFamily: 'JetBrains Mono, monospace', color: '#5a6a80', marginBottom: 4 }}>
          <span>−50¢ Flat</span>
          <span style={{ color: colors.needle }}>In Tune</span>
          <span>+50¢ Sharp</span>
        </div>

        {/* Tolerance zone + needle */}
        <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'visible' }}>
          {/* Tolerance band */}
          <div style={{
            position: 'absolute',
            left:  `${50 - tolerance}%`,
            width: `${tolerance * 2}%`,
            top: 0, bottom: 0,
            background: inZone ? 'rgba(46,213,115,0.25)' : 'rgba(201,169,110,0.15)',
            borderRadius: 3,
            transition: 'background 0.2s',
          }} />

          {/* Centre line */}
          <div style={{ position: 'absolute', left: '50%', top: -2, bottom: -2, width: 1.5, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />

          {/* Needle */}
          {pitch && (
            <motion.div
              style={{
                position: 'absolute',
                top: -4, bottom: -4, width: 4, borderRadius: 2,
                background: inZone ? '#2ed573' : '#c9a96e',
                boxShadow: `0 0 8px ${inZone ? '#2ed573' : '#c9a96e'}`,
                left: `${needlePct}%`,
                translateX: '-50%',
              }}
              animate={{ left: `${needlePct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
        </div>
      </div>

      {/* Gate status + breath indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={gateState}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.needle }}
          >
            {colors.label}
          </motion.span>
        </AnimatePresence>

        <span style={{ fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', color: breath.color }}>
          {breath.label}
        </span>
      </div>

      {/* Cents deviation text */}
      {pitch && gateState === 'open' && (
        <div style={{ textAlign: 'center', marginTop: '0.25rem', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: inZone ? '#2ed573' : '#c9a96e' }}>
          {centsRaw > 0 ? '+' : ''}{Math.round(centsRaw)}¢
          {inZone ? ' — within tolerance' : ` — need ±${tolerance}¢`}
        </div>
      )}
    </div>
  );
}

export default PitchGateUI;
