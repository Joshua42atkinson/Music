import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLASH_STATES } from '../hooks/useFlashTimer';
import { STRING_TUNING, NOTE_NAMES } from '../data/vertiscalePatterns';

// ═══════════════════════════════════════════════════════════
// PIECE 1: GameFretboard
// The fretboard in "game mode" — not FretboardExplorer.
// Accepts: correctPositions, playerTaps, flashState, onTap
//
// Visual states per cell:
//   REVEAL  → show pattern (gold glow)
//   DARK    → all cells neutral
//   TAP     → interactive — green on correct, red pulse on wrong
//   RESULT  → diff overlay: green = hit, amber = missed, red = phantom
//   HOLD    → pattern visible + breathing pulse + progress ring
//   HOLD_RESULT → diff overlay for sustain mode
// ═══════════════════════════════════════════════════════════

const CELL_W = 56;   // wider for touch targets
const CELL_H = 50;   // taller for readability
const NUT_W  = 38;   // nut column width
const INLAY_FRETS = [3, 5, 7];
const DOUBLE_INLAY = [12];

function GameFretboard({
  correctPositions = [],  // [{stringIdx, fret, noteName, isRoot}]
  playerTaps       = [],  // [{stringIdx, fret}]
  flashState,             // FLASH_STATES value
  onTap,                  // (stringIdx, fret) => void
  maxFret          = 7,
  disabled         = false,
  holdProgressPct  = 0,   // 0.0 → 1.0 for sustain mode progress ring
  breathState      = 'free', // for breathing pulse sync
}) {
  const fretCount = maxFret + 1; // 0 = open

  const getCellState = useCallback((stringIdx, fret) => {
    const isCorrect = correctPositions.some(p => p.stringIdx === stringIdx && p.fret === fret);
    const isTapped  = playerTaps.some(p => p.stringIdx === stringIdx && p.fret === fret);

    switch (flashState) {
      case FLASH_STATES.REVEAL:
        return isCorrect ? 'pattern' : 'idle';
      case FLASH_STATES.DARK:
        return 'dark';
      case FLASH_STATES.TAP:
        if (isTapped && isCorrect) return 'hit';
        if (isTapped && !isCorrect) return 'phantom';
        return 'tappable';
      case FLASH_STATES.RESULT:
      case FLASH_STATES.HOLD_RESULT:
        if (isCorrect && isTapped)  return 'hit';
        if (isCorrect && !isTapped) return 'missed';
        if (!isCorrect && isTapped) return 'phantom';
        return 'idle';
      case FLASH_STATES.HOLD:
        // In HOLD mode: pattern stays visible, correctly placed dots breathe
        if (isCorrect && isTapped)  return 'hold-hit';
        if (isCorrect && !isTapped) return 'hold-pattern';
        if (!isCorrect && isTapped) return 'hold-phantom';
        return 'hold-idle';
      default:
        return 'idle';
    }
  }, [correctPositions, playerTaps, flashState]);

  const isTappable = flashState === FLASH_STATES.TAP || flashState === FLASH_STATES.HOLD;

  const handleCellClick = useCallback((stringIdx, fret) => {
    if (disabled || !isTappable) return;
    onTap?.(stringIdx, fret);
    if (navigator.vibrate) navigator.vibrate(8);
  }, [disabled, isTappable, onTap]);

  // Tap ripple state
  const [ripple, setRipple] = useState(null);
  const triggerRipple = useCallback((sIdx, fret) => {
    const key = `${sIdx}-${fret}-${Date.now()}`;
    setRipple({ key, sIdx, fret });
    setTimeout(() => setRipple(null), 500);
  }, []);

  const cellStyle = (state, stringIdx) => {
    const base = {
      width: CELL_W, height: CELL_H,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
      borderRight: '1.5px solid rgba(201,169,110,0.12)',
      cursor: isTappable && !disabled ? 'pointer' : 'default',
    };
    return base;
  };

  const dotStyle = (state, isRoot) => {
    const styles = {
      idle:         { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.06)', color: 'transparent' },
      dark:         { background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.03)', color: 'transparent' },
      tappable:     { background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',  color: 'rgba(255,255,255,0.15)' },
      pattern:      { background: isRoot ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)', border: `1.5px solid rgba(201,169,110,${isRoot ? '1' : '0.6'})`, color: '#fff', boxShadow: `0 0 ${isRoot ? 18 : 10}px rgba(201,169,110,${isRoot ? 0.7 : 0.4})` },
      hit:          { background: 'rgba(46,213,115,0.35)',  border: '1.5px solid #2ed573', color: '#2ed573', boxShadow: '0 0 14px rgba(46,213,115,0.5)' },
      missed:       { background: 'rgba(255,171,0,0.2)',    border: '1.5px solid #ffab00', color: '#ffab00' },
      phantom:      { background: 'rgba(255,71,87,0.2)',    border: '1.5px solid #ff4757', color: '#e74c3c' },
      // Sustain / Hold states
      'hold-idle':    { background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.05)', color: 'transparent' },
      'hold-pattern': { background: isRoot ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.15)', border: `1.5px solid rgba(201,169,110,${isRoot ? '0.8' : '0.4'})`, color: 'rgba(255,255,255,0.7)', boxShadow: `0 0 ${isRoot ? 14 : 8}px rgba(201,169,110,${isRoot ? 0.5 : 0.25})` },
      'hold-hit':     { background: 'rgba(46,213,115,0.3)',  border: '1.5px solid rgba(46,213,115,0.7)', color: '#2ed573', boxShadow: '0 0 16px rgba(46,213,115,0.4)' },
      'hold-phantom': { background: 'rgba(255,71,87,0.15)', border: '1.5px solid rgba(255,71,87,0.4)', color: '#e74c3c' },
    };
    return styles[state] || styles.idle;
  };

  const getNoteName = (stringIdx, fret) => {
    const midi = STRING_TUNING[stringIdx].midiBase + fret;
    return NOTE_NAMES[midi % 12];
  };

  const showLabel = (state) => ['pattern', 'hit', 'missed', 'hold-pattern', 'hold-hit'].includes(state);

  // Breathing animation for hold states
  const getBreathAnimation = (state) => {
    if (state === 'hold-hit') {
      return { scale: [1, 1.12, 1], opacity: [1, 0.85, 1] };
    }
    if (state === 'hold-pattern') {
      return { scale: [1, 1.08, 1], opacity: [0.7, 0.5, 0.7] };
    }
    if (state === 'pattern') {
      return { scale: [1, 1.15, 1] };
    }
    if (state === 'phantom' || state === 'hold-phantom') {
      return { scale: [1, 1.2, 0.9, 1] };
    }
    return { scale: 1 };
  };

  const getBreathTransition = (state) => {
    if (state.startsWith('hold-')) {
      // Slow breathing pulse synchronized with breath state
      const speed = breathState === 'free' ? 3.5 : breathState === 'shallow' ? 2 : 1.2;
      return { duration: speed, repeat: Infinity, ease: 'easeInOut' };
    }
    return { duration: 0.3 };
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #2a1a0e 0%, #1e1208 50%, #2a1a0e 100%)',
      borderRadius: 12,
      padding: '12px 0',
      border: '1px solid rgba(74,51,36,0.6)',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
      overflowX: 'auto',
      userSelect: 'none',
    }}>
      {STRING_TUNING.map((str, sIdx) => {
        const thickness = 0.8 + sIdx * 0.35;
        const brightness = Math.max(90, 180 - sIdx * 18);
        return (
          <div key={sIdx} style={{ display: 'flex', alignItems: 'center', height: CELL_H, position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
            {/* String label */}
            <div style={{ width: NUT_W, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#8090a8', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, borderRight: '3px solid rgba(201,169,110,0.5)' }}>
              {str.name}
            </div>

            {/* String line */}
            <div style={{ position: 'absolute', top: '50%', left: NUT_W, right: 0, borderBottom: `${thickness}px solid rgba(${brightness},${brightness-20},${brightness-40},0.45)`, zIndex: 0, pointerEvents: 'none' }} />

            {/* Fret cells */}
            {Array.from({ length: fretCount }, (_, fret) => {
              const state = getCellState(sIdx, fret);
              const isRoot = correctPositions.some(p => p.stringIdx === sIdx && p.fret === fret && p.isRoot);
              const ds = dotStyle(state, isRoot);
              const breathAnim = getBreathAnimation(state);
              const breathTrans = getBreathTransition(state);
              return (
                <div key={fret} style={cellStyle(state, sIdx)} onClick={() => { handleCellClick(sIdx, fret); triggerRipple(sIdx, fret); }}>
                  {/* Tap ripple */}
                  {ripple && ripple.sIdx === sIdx && ripple.fret === fret && (
                    <motion.div
                      key={ripple.key}
                      initial={{ scale: 0.3, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', width: 30, height: 30, borderRadius: '50%',
                        border: '2px solid rgba(201,169,110,0.5)', pointerEvents: 'none', zIndex: 3,
                      }}
                    />
                  )}
                  {/* Progress ring for hold-hit state */}
                  {state === 'hold-hit' && holdProgressPct > 0 && (
                    <svg
                      width={36} height={36}
                      style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none' }}
                    >
                      <circle
                        cx={18} cy={18} r={16}
                        fill="none"
                        stroke="rgba(46,213,115,0.2)"
                        strokeWidth={2}
                      />
                      <circle
                        cx={18} cy={18} r={16}
                        fill="none"
                        stroke="#2ed573"
                        strokeWidth={2}
                        strokeDasharray={`${holdProgressPct * 100.5} 100.5`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                        style={{ transition: 'stroke-dasharray 100ms linear' }}
                      />
                    </svg>
                  )}
                  <motion.div
                    animate={breathAnim}
                    transition={breathTrans}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                      zIndex: 1, position: 'relative', transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                      ...ds,
                    }}
                  >
                    {showLabel(state) ? getNoteName(sIdx, fret) : ''}
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Fret numbers + inlay dots */}
      <div style={{ display: 'flex', paddingLeft: NUT_W, marginTop: 4 }}>
        {Array.from({ length: fretCount }, (_, f) => {
          const hasInlay = INLAY_FRETS.includes(f);
          const hasDouble = DOUBLE_INLAY.includes(f);
          return (
            <div key={f} style={{ width: CELL_W, flexShrink: 0, textAlign: 'center', position: 'relative' }}>
              <span style={{ fontSize: '0.7rem', color: '#5a6a80', fontFamily: 'JetBrains Mono, monospace' }}>
                {f === 0 ? 'Open' : f}
              </span>
              {hasInlay && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', margin: '3px auto 0',
                  background: 'radial-gradient(circle at 35% 35%, rgba(240,230,200,0.25), rgba(201,169,110,0.1))',
                  boxShadow: '0 0 4px rgba(201,169,110,0.15)',
                  border: '0.5px solid rgba(201,169,110,0.1)',
                }} />
              )}
              {hasDouble && (
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(240,230,200,0.25), rgba(201,169,110,0.1))', border: '0.5px solid rgba(201,169,110,0.1)' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(240,230,200,0.25), rgba(201,169,110,0.1))', border: '0.5px solid rgba(201,169,110,0.1)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Color Legend — helps novices understand dot colors */}
      {(flashState === FLASH_STATES.TAP || flashState === FLASH_STATES.RESULT || flashState === FLASH_STATES.HOLD_RESULT) && (
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          padding: '8px 12px', marginTop: 6,
          background: 'rgba(255,255,255,0.02)', borderRadius: 6,
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a6a80',
        }}>
          <span><span style={{ color: '#c9a96e' }}>●</span> Note</span>
          <span><span style={{ color: '#2ed573' }}>●</span> Correct</span>
          <span><span style={{ color: '#e74c3c' }}>●</span> Wrong</span>
          <span><span style={{ color: '#ffa502' }}>●</span> Missed</span>
        </div>
      )}
    </div>
  );
}

export default GameFretboard;
