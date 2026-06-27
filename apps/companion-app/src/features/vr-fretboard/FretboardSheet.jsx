import React, { useState, useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import FretboardExplorer from './FretboardExplorer';
import { TONAL_SCALES } from './scales';
import VRFretboardEngine from './VRFretboardEngine';
import { useLocale } from '../../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// FRETBOARD SHEET — Bottom-sheet overlay for in-slide practice
// Slides up from the bottom of the SlideViewer
// Three states: closed, peek (40vh), full (85vh)
// Chapter-aware: auto-configures root/scale/fret-range
// ═══════════════════════════════════════════════════════════

const SHEET_STATES = {
  closed: { height: 0, y: '100%' },
  peek: { height: '45vh', y: '55vh' },
  full: { height: '88vh', y: '12vh' },
};

// Map chapter note names to chromatic index (C=0)
const NOTE_TO_INDEX = {
  'Root': 4,       // E (guitar root)
  'C/C♯': 0,
  'D': 2,
  'D♯/E♭': 3,
  'E': 4,
  'F': 5,
  'F♯/G♭': 6,
  'G': 7,
  'G♯/A♭': 8,
  'A': 9,
  'A♯/B♭': 10,
  'Octave': 4,     // Back to E
};

// Map chapter patterns to scale names
const PATTERN_TO_SCALE = {
  'open-strings': null,
  'octave-e': null,
  'natural-notes': 'major',
  'minor-third': 'minor',
  'major-chord-tones': 'major',
  'caged-c-shape': 'major',
  'tritone': 'blues',
  'power-chord': null,
  'economy-picking': 'pentatonicMinor',
  'chord-progression': 'major',
  'full-scale': 'minor',
  'full-chromatic': 'chromatic',
};

const FretboardSheet = ({
  isOpen,
  onClose,
  fret,
  fretboardFocus,
}) => {
  const { locale } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (val[locale] || val['en']) : val);
  const [sheetState, setSheetState] = useState('peek');
  const [vrMode, setVrMode] = useState(false);
  const dragControls = useDragControls();
  const sheetRef = useRef(null);

  // Auto-derive presets from chapter data
  const rootNote = fret ? (NOTE_TO_INDEX[fret.note] ?? 0) : 0;
  const scaleName = fretboardFocus?.pattern
    ? (PATTERN_TO_SCALE[fretboardFocus.pattern] ?? null)
    : null;
  const maxFret = fretboardFocus?.endFret ?? 14;

  // Reset to peek when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSheetState('peek');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Haptic on open
  useEffect(() => {
    if (isOpen && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [isOpen]);

  const handleDragEnd = useCallback((e, info) => {
    const vy = info.velocity.y;
    const oy = info.offset.y;

    if (vy > 400 || oy > 120) {
      // Flung down — close or reduce
      if (sheetState === 'peek') {
        onClose();
      } else {
        setSheetState('peek');
      }
    } else if (vy < -400 || oy < -80) {
      // Flung up — expand
      if (sheetState === 'peek') {
        setSheetState('full');
      }
    }
  }, [sheetState, onClose]);

  const toggleExpand = () => {
    setSheetState(prev => prev === 'peek' ? 'full' : 'peek');
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .fbs-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .fbs-sheet {
          position: fixed; left: 0; right: 0; bottom: 0;
          z-index: 210;
          border-radius: 20px 20px 0 0;
          background: rgba(8, 8, 14, 0.97);
          backdrop-filter: blur(24px) saturate(1.5);
          -webkit-backdrop-filter: blur(24px) saturate(1.5);
          border-top: 1px solid rgba(201, 169, 110, 0.15);
          box-shadow: 0 -20px 60px rgba(0,0,0,0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          touch-action: none;
        }
        .fbs-handle-bar {
          display: flex; align-items: center; justify-content: center;
          padding: 12px 0 8px;
          cursor: grab; flex-shrink: 0;
        }
        .fbs-handle-bar:active { cursor: grabbing; }
        .fbs-handle-pill {
          width: 40px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.2);
          transition: background 0.2s;
        }
        .fbs-handle-bar:hover .fbs-handle-pill {
          background: rgba(201, 169, 110, 0.5);
        }
        .fbs-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .fbs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: #e8edf2; font-weight: 400;
        }
        .fbs-preset-badge {
          display: flex; align-items: center; gap: 8px;
        }
        .fbs-preset-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px; border-radius: 4px;
          background: rgba(var(--cf-gold-rgb),0.1);
          border: 1px solid rgba(var(--cf-gold-rgb),0.25);
          color: var(--cf-gold);
        }
        .fbs-close-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #8090a8; border-radius: 8px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem;
          transition: all 0.2s;
        }
        .fbs-close-btn:hover {
          color: var(--cf-gold);
          border-color: rgba(var(--cf-gold-rgb),0.3);
        }
        .fbs-body {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 8px 24px;
          -webkit-overflow-scrolling: touch;
        }
        .fbs-fret-info {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 16px 12px;
          flex-shrink: 0;
        }
        .fbs-fret-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: #5a6a80;
        }
        .fbs-fret-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; color: var(--cf-gold);
          padding: 3px 8px;
          background: rgba(var(--cf-gold-rgb),0.08);
          border-radius: 3px;
        }
        .fbs-expand-btn {
          background: none; border: none;
          color: #5a6a80; cursor: pointer;
          font-size: 0.9rem; padding: 4px 8px;
          transition: color 0.2s;
        }
        .fbs-expand-btn:hover { color: var(--cf-gold); }

        /* Landscape: full width */
        @media (orientation: landscape) and (max-height: 500px) {
          .fbs-sheet {
            border-radius: 0;
            height: 100vh !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <motion.div
        className="fbs-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        ref={sheetRef}
        className="fbs-sheet"
        initial={{ y: '100%' }}
        animate={{
          y: sheetState === 'full' ? '12%' : '48%',
          height: sheetState === 'full' ? '88vh' : '52vh',
        }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        dragListener={false}
        dragControls={dragControls}
      >
        {/* Drag Handle */}
        <div
          className="fbs-handle-bar"
          onPointerDown={(e) => dragControls.start(e)}
          onClick={toggleExpand}
        >
          <div className="fbs-handle-pill" />
        </div>

        {/* Header */}
        <div className="fbs-header">
          <div>
            <div className="fbs-title">🎸 Fretboard Explorer</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="fbs-preset-tag" 
              style={{ cursor: 'pointer', background: 'rgba(231,76,60,0.15)', color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)' }}
              onClick={() => setVrMode(true)}
            >
              <span className="mr-1">🥽</span> VR MODE
            </button>
            <button className="fbs-expand-btn" onClick={toggleExpand}>
              {sheetState === 'full' ? '▾' : '▴'}
            </button>
            <button className="fbs-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Chapter Context */}
        {fret && (
          <div className="fbs-fret-info">
            <span className="fbs-fret-label">
              Ch.{fret.id} · {localize(fret.title)}
            </span>
            <div className="fbs-preset-badge">
              {fretboardFocus && (
                <span className="fbs-fret-range">
                  Frets {fretboardFocus.startFret}–{fretboardFocus.endFret}
                </span>
              )}
              {scaleName && (
                <span className="fbs-preset-tag">{scaleName}</span>
              )}
            </div>
          </div>
        )}

        {/* Fretboard */}
        <div className="fbs-body">
          <FretboardExplorer
            maxFret={maxFret}
            fretLimit={fretboardFocus?.endFret}
            compact={true}
            presetRoot={rootNote}
            presetScale={scaleName}
          />
        </div>
      </motion.div>

      {/* VR Overlay Mode */}
      {vrMode && (
        <VRFretboardEngine 
          onClose={() => setVrMode(false)}
          presetRoot={rootNote}
          presetScale={TONAL_SCALES?.[scaleName]?.tonalName || scaleName}
        />
      )}
    </>
  );
};

export default FretboardSheet;
