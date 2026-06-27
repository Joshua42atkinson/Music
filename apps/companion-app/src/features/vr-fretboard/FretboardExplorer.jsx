import React, { useState, useEffect, useCallback } from 'react';
import { Scale, Interval } from '@tonaljs/tonal';
import { resumeAudio } from '../../audio/audioEngine';
import { TONAL_SCALES } from './scales';

// ═══════════════════════════════════════════════════════════
// FULL 12-FRET FRETBOARD EXPLORER
// Features: CAGED overlays, scale patterns, chapter-aware highlighting,
// Web Audio synthesis, landscape recommendation
// ═══════════════════════════════════════════════════════════

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

// Standard tuning: E2 A2 D3 G3 B3 E4
const STRING_TUNING = [
  { name: 'E', octave: 4, midiBase: 64 },  // High E
  { name: 'B', octave: 3, midiBase: 59 },
  { name: 'G', octave: 3, midiBase: 55 },
  { name: 'D', octave: 3, midiBase: 50 },
  { name: 'A', octave: 2, midiBase: 45 },
  { name: 'E', octave: 2, midiBase: 40 },  // Low E
];

const TOTAL_FRETS = 14; // 0 (open) through 14

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToNoteName(midi) {
  return NOTE_NAMES[midi % 12];
}

// CAGED shapes — which frets on which strings form each shape (relative to root)
const CAGED_SHAPES = {
  C: { label: 'C Shape', color: '#e74c3c', positions: [[0,0],[1,1],[0,2],[0,3],[1,4],[0,5]] },
  A: { label: 'A Shape', color: '#f39c12', positions: [[0,0],[2,1],[2,2],[2,3],[0,4],[-1,5]] },
  G: { label: 'G Shape', color: '#2ecc71', positions: [[3,0],[0,1],[0,2],[0,3],[2,4],[3,5]] },
  E: { label: 'E Shape', color: '#3498db', positions: [[0,0],[0,1],[1,2],[2,3],[2,4],[0,5]] },
  D: { label: 'D Shape', color: '#9b59b6', positions: [[-1,0],[3,1],[2,2],[0,3],[-1,4],[-1,5]] },
};



const FretboardExplorer = ({ maxFret, fretLimit, compact = false, presetRoot, presetScale }) => {
  const [activeNote, setActiveNote] = useState(null);
  const [activeScale, setActiveScale] = useState(presetScale || null);
  const [rootNote, setRootNote] = useState(presetRoot ?? 0);
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [showDots] = useState(true);
  // Orientation: 'auto' detects portrait/landscape; can be manually overridden
  const [orientation, setOrientation] = useState('auto');
  const isPortrait = typeof window !== 'undefined'
    ? window.matchMedia('(orientation: portrait)').matches
    : false;
  const [portraitMedia, setPortraitMedia] = useState(isPortrait);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const handler = (e) => setPortraitMedia(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // vertical = true when portrait phone (or manually forced)
  const isVertical = orientation === 'vertical' || (orientation === 'auto' && portraitMedia);
  const effectiveFrets = maxFret || TOTAL_FRETS;


  // Sync presets when they change (e.g. switching chapters)
  useEffect(() => {
    if (presetRoot != null) {
      const timer = setTimeout(() => {
        setRootNote(presetRoot);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [presetRoot]);
  useEffect(() => {
    if (presetScale !== undefined) {
      const timer = setTimeout(() => {
        setActiveScale(presetScale);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [presetScale]);

  const playNote = useCallback((freq) => {
    const ctx = resumeAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.5);
  }, []);

  const handleNoteClick = (midi, stringIdx, fret) => {
    const freq = midiToFreq(midi);
    const name = midiToNoteName(midi);
    setActiveNote({ midi, name, freq, stringIdx, fret });
    playNote(freq);
    // Haptic feedback for phone
    if (navigator.vibrate) navigator.vibrate(10);
  };

  // Build the full fretboard grid
  const fretboardGrid = STRING_TUNING.map((str, stringIdx) => {
    const notes = [];
    for (let fret = 0; fret <= effectiveFrets; fret++) {
      const midi = str.midiBase + fret;
      const noteName = midiToNoteName(midi);
      const noteClass = midi % 12;

      // Is this note in the active scale?
      let inScale = false;
      if (activeScale && TONAL_SCALES[activeScale]) {
        const rootName = midiToNoteName(rootNote).replace('♯', '#');
        const scaleData = Scale.get(`${rootName} ${TONAL_SCALES[activeScale].tonalName}`);
        if (scaleData && scaleData.intervals) {
          const scaleSemitones = scaleData.intervals.map(ivl => Interval.semitones(ivl));
          const relativeToRoot = ((noteClass - rootNote) % 12 + 12) % 12;
          inScale = scaleSemitones.includes(relativeToRoot);
        }
      }

      // Is this the root?
      const isRoot = noteClass === rootNote;

      // Chapter-aware dimming
      const inFretRange = fretLimit == null || fret <= fretLimit;

      notes.push({ midi, noteName, noteClass, fret, stringIdx, inScale, isRoot, inFretRange });
    }
    return { string: str, notes };
  });

  // Fret marker dots (standard acoustic pattern)
  const dotFrets = [3, 5, 7, 9, 12];
  const doubleDotFrets = [12];

  return (
    <div className={`fretboard-explorer-v2 ${compact ? 'fb-compact' : ''} ${isVertical ? 'fb-vertical' : 'fb-horizontal'}`}>
      <style>{`
        .fretboard-explorer-v2 {
          background: rgba(20, 20, 25, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px; 
          padding: max(1.5rem, 2vw);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          font-family: 'Inter', sans-serif; 
          color: #e0e0ff;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02);
          overflow-x: auto;
          transition: all 0.3s ease;
        }
        .fb-compact {
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          border: none;
          box-shadow: none;
          background: transparent;
        }
        .fb-compact .fb-header { margin-bottom: 0.75rem; }
        .fb-compact .fb-title { font-size: 1.1rem; }
        .fb-compact .fb-note-cell { width: 44px; height: 44px; }
        .fb-compact .fb-note-cell:first-child { width: 36px; }
        .fb-compact .fb-note { width: 32px; height: 32px; font-size: 0.85rem; }
        .fb-compact .fb-string-row { height: 44px; }
        .fb-compact .fb-dot-cell { width: 44px; }
        .fb-compact .fb-dot-cell:first-child { width: 36px; }
        .fb-compact .fb-fret-num { width: 44px; }
        .fb-compact .fb-fret-num:first-child { width: 36px; }
        .fb-compact .fb-status { margin-top: 0.75rem; padding: 0.75rem; }
        .fb-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .fb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem); 
          color: #e8edf2; 
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .fb-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
        .fb-select, .fb-toggle {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #b0b8c8; padding: 0.4rem 0.8rem; border-radius: 6px;
          font-size: 0.9rem; font-family: 'JetBrains Mono', monospace;
          cursor: pointer; transition: all 0.2s;
        }
        .fb-select:hover, .fb-toggle:hover { border-color: rgba(var(--cf-gold-rgb),0.3); }
        .fb-toggle.active { background: rgba(var(--cf-gold-rgb),0.15); border-color: rgba(var(--cf-gold-rgb),0.4); color: var(--cf-gold); }
        .fb-select option { background: #0a0a0f; color: #b0b8c8; }
        .fb-landscape-hint {
          display: none; background: rgba(var(--cf-gold-rgb),0.1);
          border: 1px solid rgba(var(--cf-gold-rgb),0.3); color: var(--cf-gold);
          padding: 0.75rem 1rem; border-radius: 8px; text-align: center;
          font-size: 0.85rem; margin-bottom: 1rem;
        }
        @media (max-width: 768px) and (orientation: portrait) {
          .fb-landscape-hint { display: block; }
        }
        /* ── VERTICAL MODE (portrait phone) ── */
        /* Rotate the entire neck 90° so strings run left-right, frets run top-bottom */
        .fb-vertical .fb-neck-wrap {
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 70vh;
        }
        .fb-vertical .fb-neck {
          /* Transpose: rotate the grid so it reads like a vertical guitar neck */
          writing-mode: initial;
          transform: rotate(90deg);
          transform-origin: top left;
          /* After rotation, the width becomes the height — set to viewport width */
          width: calc(100vh - 120px);
          position: absolute;
          left: 0; top: 0;
        }
        .fb-vertical .fb-neck-outer {
          position: relative;
          /* Height = rotated width of the neck */
          min-height: 200px;
          overflow: hidden;
          width: 100%;
        }
        /* Horizontal mode — default, no changes */
        .fb-horizontal .fb-neck-outer {
          overflow-x: auto;
          overflow-y: hidden;
        }
        /* Orientation toggle button */
        .fb-orient-btn {
          background: rgba(var(--cf-gold-rgb),0.08);
          border: 1px solid rgba(var(--cf-gold-rgb),0.2);
          color: var(--cf-gold);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 5px;
        }
        .fb-orient-btn:hover {
          background: rgba(var(--cf-gold-rgb),0.18);
          border-color: rgba(var(--cf-gold-rgb),0.4);
        }
        .fb-neck {
          position: relative; 
          background: linear-gradient(to right, rgba(61, 43, 26, 0.95), rgba(44, 30, 20, 0.8), rgba(61, 43, 26, 0.95));
          border-radius: 8px; 
          padding: 12px 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 0 30px rgba(0,0,0,0.8), 0 10px 25px rgba(0,0,0,0.5);
          min-width: fit-content;
        }
        .fb-fret-markers {
          display: flex; position: absolute; bottom: -28px; left: 0; width: 100%;
          pointer-events: none;
        }
        .fb-string-row {
          display: flex; align-items: center; position: relative;
          height: 38px; border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .fb-string-row:last-child { border-bottom: none; }
        .fb-string-label {
          width: 28px; text-align: center; font-weight: 700;
          font-size: 0.8rem; color: #a0a0b0; flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .fb-string-line {
          position: absolute; top: 50%; left: 28px; right: 0;
          border-bottom: 2px solid; z-index: 0;
        }
        .fb-note-cell {
          width: clamp(48px, 6vw, 64px); 
          height: clamp(34px, 4vw, 44px);
          display: flex; align-items: center;
          justify-content: center; position: relative; z-index: 1; flex-shrink: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        .fb-note-cell:first-child {
          width: clamp(36px, 4vw, 48px); 
          border-right: 4px solid rgba(255, 255, 255, 0.25);
        }
        .fb-note {
          width: clamp(26px, 3.5vw, 32px);
          height: clamp(26px, 3.5vw, 32px);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: clamp(0.75rem, 1vw, 0.85rem);
          font-weight: 700; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }
        .fb-note.in-scale {
          background: rgba(201, 169, 110, 0.2);
          border-color: rgba(201, 169, 110, 0.5);
          color: var(--cf-gold);
        }
        .fb-note.root-note {
          background: rgba(201, 169, 110, 0.5) !important;
          border-color: var(--cf-gold) !important;
          color: #000 !important;
          box-shadow: 0 0 10px rgba(201, 169, 110, 0.4);
          font-weight: 900;
        }
        .fb-note.dim { opacity: 0.15; pointer-events: none; }
        .fb-note.idle {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
        }
        .fb-note:hover:not(.dim) {
          transform: scale(1.25);
          background: rgba(var(--cf-gold-rgb),0.3);
          border-color: var(--cf-gold);
          color: #fff;
          box-shadow: 0 0 12px rgba(var(--cf-gold-rgb),0.3);
        }
        .fb-note.playing {
          background: var(--cf-gold) !important; color: #000 !important;
          border-color: #fff !important;
          box-shadow: 0 0 20px rgba(var(--cf-gold-rgb),0.6);
          transform: scale(1.3);
        }
        .fb-dot-row {
          display: flex; padding-left: 28px; margin-top: 8px;
        }
        .fb-dot-cell {
          width: clamp(48px, 6vw, 64px); 
          display: flex; justify-content: center; flex-shrink: 0;
        }
        .fb-dot-cell:first-child { width: clamp(36px, 4vw, 48px); }
        .fb-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
        }
        .fb-dot.double { width: 8px; height: 8px; box-shadow: -12px 0 0 rgba(255, 255, 255, 0.15), inset 0 1px 2px rgba(0,0,0,0.5); }
        .fb-fret-num {
          width: clamp(48px, 6vw, 64px); text-align: center; font-size: 0.85rem;
          color: #5a6a80; font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
        }
        .fb-fret-num:first-child { width: clamp(36px, 4vw, 48px); }
        .fb-status {
          margin-top: 1.5rem; display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
          padding: 1rem 1.25rem; 
          background: rgba(0,0,0,0.15); 
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
        }
        .fb-playing-label {
          font-size: 1.1rem; font-weight: 600;
          color: ${activeNote ? 'var(--cf-gold)' : '#5a6a80'};
          font-family: 'JetBrains Mono', monospace;
        }
        .fb-scale-legend {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }
        .fb-legend-item {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.85rem; color: #8090a8;
        }
        .fb-legend-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }
      `}</style>

      {!compact && (
        <div className="fb-header">
          <h2 className="fb-title">Playable Guitar</h2>
          <div className="fb-controls">
            <select className="fb-select" value={rootNote} onChange={e => setRootNote(parseInt(e.target.value))}>
              {NOTE_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
            <select className="fb-select" value={activeScale || ''} onChange={e => setActiveScale(e.target.value || null)}>
              <option value="">No Scale</option>
              {Object.entries(TONAL_SCALES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <button className={`fb-toggle ${showNoteNames ? 'active' : ''}`}
              onClick={() => setShowNoteNames(!showNoteNames)}>
              {showNoteNames ? 'Notes' : 'Notes'}
            </button>
            {/* Orientation toggle — only show when not compact */}
            <button
              className="fb-orient-btn"
              onClick={() => {
                if (orientation === 'auto') setOrientation(isVertical ? 'horizontal' : 'vertical');
                else setOrientation('auto');
              }}
              title={isVertical ? 'Switch to horizontal' : 'Switch to vertical'}
            >
              {isVertical ? '↔ Horizontal' : '↕ Vertical'}
            </button>
          </div>
        </div>
      )}
      {compact && (
        <div className="fb-header" style={{ marginBottom: '0.5rem' }}>
          <div className="fb-controls" style={{ width: '100%', justifyContent: 'space-between' }}>
            <select className="fb-select" value={rootNote} onChange={e => setRootNote(parseInt(e.target.value))}>
              {NOTE_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
            <select className="fb-select" value={activeScale || ''} onChange={e => setActiveScale(e.target.value || null)}>
              <option value="">No Scale</option>
              {Object.entries(TONAL_SCALES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <button className={`fb-toggle ${showNoteNames ? 'active' : ''}`}
              onClick={() => setShowNoteNames(!showNoteNames)}>
              {showNoteNames ? '♪' : '·'}
            </button>
          </div>
        </div>
      )}

      {/* THE NECK — wrapped for orientation control */}
      <div className="fb-neck-outer">
        <div className="fb-neck-wrap">
          <div className="fb-neck">
        {fretboardGrid.map((row, sIdx) => {
          // String thickness varies (thicker for bass strings)
          const thickness = 1 + (sIdx * 0.4);
          const brightness = Math.max(100, 200 - sIdx * 20);
          const isPothole = sIdx === 2; // Between G (2) and B (1)

          return (
            <React.Fragment key={sIdx}>
            {isPothole && (
              <div className="h-3 bg-[rgba(243,156,18,0.05)] border-t border-b border-dashed border-[rgba(243,156,18,0.2)] flex items-center pl-7">
                <span className="text-[0.5rem] text-[#f39c12] font-mono tracking-[0.1em]">⚠️ THE POTHOLE (MAJOR 3RD INTERVAL)</span>
              </div>
            )}
            <div className="fb-string-row">
              <span className="fb-string-label">{row.string.name}</span>
              <div className="fb-string-line" style={{
                borderBottomWidth: `${thickness}px`,
                borderColor: `rgba(${brightness}, ${brightness - 20}, ${brightness - 40}, 0.5)`
              }} />
              {row.notes.map(note => (
                <div key={note.fret} className="fb-note-cell">
                  <div
                    className={`fb-note ${
                      !note.inFretRange ? 'dim' :
                      activeNote?.midi === note.midi && activeNote?.stringIdx === sIdx ? 'playing' :
                      note.isRoot && activeScale ? 'root-note' :
                      note.inScale ? 'in-scale' :
                      'idle'
                    }`}
                    onClick={() => handleNoteClick(note.midi, sIdx, note.fret)}
                  >
                    {showNoteNames ? note.noteName : ''}
                  </div>
                </div>
              ))}
            </div>
            </React.Fragment>
          );
        })}

        {/* Fret dots */}
        {showDots && (
          <div className="fb-dot-row">
            {Array.from({ length: effectiveFrets + 1 }, (_, f) => (
              <div key={f} className="fb-dot-cell">
                {dotFrets.includes(f) && (
                  <div className={`fb-dot ${doubleDotFrets.includes(f) ? 'double' : ''}`} />
                )}
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Fret numbers */}
      <div className="flex pl-0 mt-1">
        <div className="w-7 shrink-0" />
        {Array.from({ length: effectiveFrets + 1 }, (_, f) => (
          <div key={f} className="fb-fret-num">{f === 0 ? 'Open' : f}</div>
        ))}
      </div>

      {/* Status bar */}
      <div className="fb-status">
        <span className="fb-playing-label">
          {activeNote
            ? `${activeNote.name} · Fret ${activeNote.fret} · ${activeNote.freq.toFixed(1)} Hz`
            : 'Tap a note to begin'}
        </span>
        {activeScale && (
          <div className="fb-scale-legend">
            <div className="fb-legend-item">
              <div className="fb-legend-dot !bg-[rgba(var(--cf-gold-rgb),0.5)]" />
              Root
            </div>
            <div className="fb-legend-item">
              <div className="fb-legend-dot !bg-[rgba(var(--cf-gold-rgb),0.2)] border border-[rgba(var(--cf-gold-rgb),0.5)]" />
              Scale Tone
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FretboardExplorer;
