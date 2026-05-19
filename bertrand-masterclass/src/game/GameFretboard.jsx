import React, { useCallback } from 'react';
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
// ═══════════════════════════════════════════════════════════

const CELL_W = 48;
const CELL_H = 42;
const NUT_W  = 32;

function GameFretboard({
  correctPositions = [],  // [{stringIdx, fret, noteName, isRoot}]
  playerTaps       = [],  // [{stringIdx, fret}]
  flashState,             // FLASH_STATES value
  onTap,                  // (stringIdx, fret) => void
  maxFret          = 7,
  disabled         = false,
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
        if (isCorrect && isTapped)  return 'hit';
        if (isCorrect && !isTapped) return 'missed';
        if (!isCorrect && isTapped) return 'phantom';
        return 'idle';
      default:
        return 'idle';
    }
  }, [correctPositions, playerTaps, flashState]);

  const handleCellClick = useCallback((stringIdx, fret) => {
    if (disabled || flashState !== FLASH_STATES.TAP) return;
    onTap?.(stringIdx, fret);
    if (navigator.vibrate) navigator.vibrate(8);
  }, [disabled, flashState, onTap]);

  const cellStyle = (state, stringIdx) => {
    const thickness = 0.8 + stringIdx * 0.35;
    const base = {
      width: CELL_W, height: CELL_H,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
      borderRight: '1.5px solid rgba(201,169,110,0.12)',
      cursor: flashState === FLASH_STATES.TAP && !disabled ? 'pointer' : 'default',
    };
    return base;
  };

  const dotStyle = (state, isRoot) => {
    const styles = {
      idle:     { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.06)', color: 'transparent' },
      dark:     { background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.03)', color: 'transparent' },
      tappable: { background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',  color: 'rgba(255,255,255,0.15)' },
      pattern:  { background: isRoot ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)', border: `1.5px solid rgba(201,169,110,${isRoot ? '1' : '0.6'})`, color: '#fff', boxShadow: `0 0 ${isRoot ? 18 : 10}px rgba(201,169,110,${isRoot ? 0.7 : 0.4})` },
      hit:      { background: 'rgba(46,213,115,0.35)',  border: '1.5px solid #2ed573', color: '#2ed573', boxShadow: '0 0 14px rgba(46,213,115,0.5)' },
      missed:   { background: 'rgba(255,171,0,0.2)',    border: '1.5px solid #ffab00', color: '#ffab00' },
      phantom:  { background: 'rgba(255,71,87,0.2)',    border: '1.5px solid #ff4757', color: '#ff4757' },
    };
    return styles[state] || styles.idle;
  };

  const getNoteName = (stringIdx, fret) => {
    const midi = STRING_TUNING[stringIdx].midiBase + fret;
    return NOTE_NAMES[midi % 12];
  };

  const showLabel = (state) => ['pattern', 'hit', 'missed'].includes(state);

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
            <div style={{ width: NUT_W, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#8090a8', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, borderRight: '3px solid rgba(201,169,110,0.5)' }}>
              {str.name}
            </div>

            {/* String line */}
            <div style={{ position: 'absolute', top: '50%', left: NUT_W, right: 0, borderBottom: `${thickness}px solid rgba(${brightness},${brightness-20},${brightness-40},0.45)`, zIndex: 0, pointerEvents: 'none' }} />

            {/* Fret cells */}
            {Array.from({ length: fretCount }, (_, fret) => {
              const state = getCellState(sIdx, fret);
              const isRoot = correctPositions.some(p => p.stringIdx === sIdx && p.fret === fret && p.isRoot);
              const ds = dotStyle(state, isRoot);
              return (
                <div key={fret} style={cellStyle(state, sIdx)} onClick={() => handleCellClick(sIdx, fret)}>
                  <motion.div
                    animate={state === 'pattern' ? { scale: [1, 1.15, 1] } : state === 'phantom' ? { scale: [1, 1.2, 0.9, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
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

      {/* Fret numbers */}
      <div style={{ display: 'flex', paddingLeft: NUT_W, marginTop: 4 }}>
        {Array.from({ length: fretCount }, (_, f) => (
          <div key={f} style={{ width: CELL_W, flexShrink: 0, textAlign: 'center', fontSize: '0.5rem', color: '#3a4a5a', fontFamily: 'JetBrains Mono, monospace' }}>
            {f === 0 ? 'Open' : f}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameFretboard;
