import React, { useState, useCallback } from 'react';
import { Interval } from '@tonaljs/tonal';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioContext, resumeAudio } from '../audio/audioEngine';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

const STRING_TUNING = [
  { name: 'E', midiBase: 64 },
  { name: 'B', midiBase: 59 },
  { name: 'G', midiBase: 55 },
  { name: 'D', midiBase: 50 },
  { name: 'A', midiBase: 45 },
  { name: 'E', midiBase: 40 },
];

const TOTAL_FRETS = 12;
const DOT_FRETS = new Set([3, 5, 7, 9, 12]);

function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

// Compute interval between two midi notes
function intervalBetween(midiA, midiB) {
  const semitones = Math.abs(midiB - midiA) % 12;
  const names = [
    { label: 'Unison',          short: 'P1',  quality: 'perfect',     consonance: 'perfect' },
    { label: 'Minor 2nd',       short: 'm2',  quality: 'dissonant',   consonance: 'dissonant' },
    { label: 'Major 2nd',       short: 'M2',  quality: 'dissonant',   consonance: 'dissonant' },
    { label: 'Minor 3rd',       short: 'm3',  quality: 'minor',       consonance: 'consonant' },
    { label: 'Major 3rd',       short: 'M3',  quality: 'major',       consonance: 'consonant' },
    { label: 'Perfect 4th',     short: 'P4',  quality: 'perfect',     consonance: 'consonant' },
    { label: 'Tritone',         short: 'TT',  quality: 'dissonant',   consonance: 'dissonant' },
    { label: 'Perfect 5th',     short: 'P5',  quality: 'perfect',     consonance: 'perfect' },
    { label: 'Minor 6th',       short: 'm6',  quality: 'minor',       consonance: 'consonant' },
    { label: 'Major 6th',       short: 'M6',  quality: 'major',       consonance: 'consonant' },
    { label: 'Minor 7th',       short: 'm7',  quality: 'minor',       consonance: 'consonant' },
    { label: 'Major 7th',       short: 'M7',  quality: 'major',       consonance: 'consonant' },
  ];
  return { semitones, ...names[semitones], octaveDiff: Math.floor(Math.abs(midiB - midiA) / 12) };
}

const CONSONANCE_COLORS = {
  perfect:    '#c9a96e',
  consonant:  '#7aaa88',
  dissonant:  '#e74c3c',
};

const IntervalVisualizer = () => {
  const [tappedNotes, setTappedNotes] = useState([]); // [{midi, stringIdx, fret, noteName}]
  const [playedInterval, setPlayedInterval] = useState(null);

  const playNote = useCallback((freq, duration = 1.2) => {
    const ctx = resumeAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }, []);

  const handleNoteClick = (midi, stringIdx, fret) => {
    const noteName = NOTE_NAMES[midi % 12];
    const freq = midiToFreq(midi);
    playNote(freq);
    if (navigator.vibrate) navigator.vibrate(10);

    setTappedNotes(prev => {
      if (prev.length === 0) {
        return [{ midi, stringIdx, fret, noteName }];
      } else if (prev.length === 1) {
        const newNote = { midi, stringIdx, fret, noteName };
        const ivl = intervalBetween(prev[0].midi, midi);
        setPlayedInterval(ivl);
        // Play both notes with a short gap
        setTimeout(() => playNote(midiToFreq(prev[0].midi), 0.8), 100);
        setTimeout(() => playNote(freq, 0.8), 600);
        return [...prev, newNote];
      } else {
        // Reset on third tap
        setPlayedInterval(null);
        return [{ midi, stringIdx, fret, noteName }];
      }
    });
  };

  const reset = () => { setTappedNotes([]); setPlayedInterval(null); };

  // Build fretboard grid
  const fretboardGrid = STRING_TUNING.map((str, stringIdx) => ({
    string: str,
    notes: Array.from({ length: TOTAL_FRETS + 1 }, (_, fret) => {
      const midi = str.midiBase + fret;
      const isTapped = tappedNotes.some(n => n.midi === midi && n.stringIdx === stringIdx);
      const isFirst = tappedNotes[0]?.midi === midi && tappedNotes[0]?.stringIdx === stringIdx;
      const isSecond = tappedNotes[1]?.midi === midi && tappedNotes[1]?.stringIdx === stringIdx;
      return { midi, fret, stringIdx, noteName: NOTE_NAMES[midi % 12], isTapped, isFirst, isSecond };
    }),
  }));

  const intervalColor = playedInterval ? CONSONANCE_COLORS[playedInterval.consonance] : 'rgba(255,255,255,0.1)';

  return (
    <div style={{ color: '#e8edf2', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#5a90a0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
          ©SHEARL · See Intervals
        </p>
        <h2 style={{ fontSize: '1.6rem', fontFamily: 'Cormorant Garamond, serif', color: '#e8edf2', marginBottom: 4 }}>
          Interval Visualizer
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          Tap any two notes on the fretboard — see and hear the interval between them.
        </p>
      </div>

      {/* Instruction / State indicator */}
      <div style={{
        background: tappedNotes.length === 0 ? 'rgba(255,255,255,0.03)' : `${intervalColor}15`,
        border: `1px solid ${tappedNotes.length === 0 ? 'rgba(255,255,255,0.08)' : intervalColor + '50'}`,
        borderRadius: 12, padding: '12px 16px', marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.3s',
      }}>
        {tappedNotes.length === 0 && (
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>① Tap your first note…</span>
        )}
        {tappedNotes.length === 1 && (
          <span style={{ fontSize: 13, color: '#c9a96e' }}>
            First: <strong>{tappedNotes[0].noteName}</strong> (Fret {tappedNotes[0].fret}) — now tap a second note
          </span>
        )}
        {tappedNotes.length === 2 && playedInterval && (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 22, fontFamily: 'Cormorant Garamond, serif', color: intervalColor, fontWeight: 700 }}>
                {playedInterval.label}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: intervalColor, opacity: 0.7 }}>
                {playedInterval.short} · {playedInterval.semitones} semitone{playedInterval.semitones !== 1 ? 's' : ''}
                {playedInterval.octaveDiff > 0 ? ` + ${playedInterval.octaveDiff} oct` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                background: `${intervalColor}20`, border: `1px solid ${intervalColor}50`, color: intervalColor,
              }}>
                {tappedNotes[0].noteName} → {tappedNotes[1].noteName}
              </span>
              <span style={{
                fontSize: 9, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: intervalColor, opacity: 0.7,
              }}>
                {playedInterval.consonance}
              </span>
            </div>
          </div>
        )}
        {tappedNotes.length > 0 && (
          <button
            onClick={reset}
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', flexShrink: 0, marginLeft: 8,
            }}
          >
            RESET
          </button>
        )}
      </div>

      {/* Fretboard */}
      <div style={{ overflowX: 'auto', borderRadius: 8 }}>
        <div style={{
          background: 'linear-gradient(180deg, #3d2b1a, #2c1e14, #3d2b1a)',
          borderRadius: 8, border: '1px solid rgba(74,51,36,0.6)',
          padding: '8px 0', minWidth: 'fit-content',
        }}>
          {fretboardGrid.map((row, sIdx) => {
            const thickness = 1 + sIdx * 0.4;
            const brightness = Math.max(100, 200 - sIdx * 20);
            return (
              <div key={sIdx} style={{ display: 'flex', alignItems: 'center', height: 36, position: 'relative' }}>
                <div style={{ width: 22, textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                  {row.string.name}
                </div>
                {/* String line */}
                <div style={{
                  position: 'absolute', top: '50%', left: 22, right: 0,
                  borderBottom: `${thickness}px solid rgba(${brightness},${brightness - 20},${brightness - 40},0.4)`,
                }} />
                {row.notes.map(note => (
                  <div key={note.fret} style={{
                    width: note.fret === 0 ? 18 : 36,
                    height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRight: `2px solid rgba(212,175,55,${note.fret === 0 ? 0.5 : 0.12})`,
                    flexShrink: 0, zIndex: 1, position: 'relative',
                  }}>
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleNoteClick(note.midi, note.stringIdx, note.fret)}
                      style={{
                        width: note.isFirst || note.isSecond ? 26 : 22,
                        height: note.isFirst || note.isSecond ? 26 : 22,
                        borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                        transition: 'all 0.15s',
                        background: note.isFirst
                          ? '#c9a96e'
                          : note.isSecond
                          ? intervalColor
                          : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${note.isFirst ? '#c9a96e' : note.isSecond ? intervalColor : 'rgba(255,255,255,0.08)'}`,
                        color: note.isFirst || note.isSecond ? '#000' : 'rgba(255,255,255,0.2)',
                        boxShadow: note.isFirst ? '0 0 12px rgba(201,169,110,0.6)' : note.isSecond ? `0 0 12px ${intervalColor}80` : 'none',
                      }}
                    >
                      {(note.isFirst || note.isSecond) ? note.noteName : note.noteName}
                    </motion.div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Dot markers */}
          <div style={{ display: 'flex', paddingLeft: 22, paddingTop: 4, paddingBottom: 2 }}>
            {Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => (
              <div key={f} style={{ width: f === 0 ? 18 : 36, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                {DOT_FRETS.has(f) && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(201,169,110,0.25)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Fret numbers */}
        <div style={{ display: 'flex', paddingLeft: 22, marginTop: 4 }}>
          {Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => (
            <div key={f} style={{
              width: f === 0 ? 18 : 36, textAlign: 'center', fontSize: 9,
              color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
            }}>
              {f === 0 ? 'O' : f}
            </div>
          ))}
        </div>
      </div>

      {/* Interval reference table */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
          Interval Reference
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { label: 'Unison',     short: 'P1', st: 0, c: 'perfect' },
            { label: 'min 2nd',    short: 'm2', st: 1, c: 'dissonant' },
            { label: 'Maj 2nd',    short: 'M2', st: 2, c: 'dissonant' },
            { label: 'min 3rd',    short: 'm3', st: 3, c: 'consonant' },
            { label: 'Maj 3rd',    short: 'M3', st: 4, c: 'consonant' },
            { label: 'Perf 4th',   short: 'P4', st: 5, c: 'consonant' },
            { label: 'Tritone',    short: 'TT', st: 6, c: 'dissonant' },
            { label: 'Perf 5th',   short: 'P5', st: 7, c: 'perfect' },
            { label: 'min 6th',    short: 'm6', st: 8, c: 'consonant' },
            { label: 'Maj 6th',    short: 'M6', st: 9, c: 'consonant' },
            { label: 'min 7th',    short: 'm7', st: 10, c: 'consonant' },
            { label: 'Maj 7th',    short: 'M7', st: 11, c: 'consonant' },
          ].map(row => {
            const col = CONSONANCE_COLORS[row.c];
            const isActive = playedInterval?.semitones === row.st;
            return (
              <div key={row.st} style={{
                padding: '6px 8px', borderRadius: 6,
                background: isActive ? `${col}20` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isActive ? col + '60' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: col, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: isActive ? col : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 700 : 400 }}>
                    {row.short} · {row.st}st
                  </div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{row.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IntervalVisualizer;
