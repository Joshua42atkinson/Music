import React, { useState, useCallback } from 'react';
import { Interval } from '@tonaljs/tonal';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAudio } from '../audio/audioEngine';

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
  perfect:    'var(--cf-gold)',
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
    <div className="text-[#e8edf2] font-body">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[0.8rem] text-[#5a90a0] font-mono tracking-[0.15em] uppercase mb-1.5">
          ©SHEARL · See Intervals
        </p>
        <h2 className="text-[1.6rem] font-heading text-[#e8edf2] mb-1">
          Interval Visualizer
        </h2>
        <p className="text-[0.85rem] text-white/40 leading-[1.6]">
          Tap any two notes on the fretboard — see and hear the interval between them.
        </p>
      </div>

      {/* Instruction / State indicator */}
      <div className="rounded-xl py-3 px-4 mb-4 flex justify-between items-center transition-all duration-300"
        style={{
          background: tappedNotes.length === 0 ? 'rgba(255,255,255,0.03)' : `${intervalColor}15`,
          border: `1px solid ${tappedNotes.length === 0 ? 'rgba(255,255,255,0.08)' : intervalColor + '50'}`,
        }}
      >
        {tappedNotes.length === 0 && (
          <span className="text-[0.85rem] text-white/35">① Tap your first note…</span>
        )}
        {tappedNotes.length === 1 && (
          <span className="text-[0.85rem] text-cf-gold">
            First: <strong>{tappedNotes[0].noteName}</strong> (Fret {tappedNotes[0].fret}) — now tap a second note
          </span>
        )}
        {tappedNotes.length === 2 && playedInterval && (
          <div className="flex-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[22px] font-heading font-bold" style={{ color: intervalColor }}>
                {playedInterval.label}
              </span>
              <span className="text-[0.8rem] font-mono opacity-70" style={{ color: intervalColor }}>
                {playedInterval.short} · {playedInterval.semitones} semitone{playedInterval.semitones !== 1 ? 's' : ''}
                {playedInterval.octaveDiff > 0 ? ` + ${playedInterval.octaveDiff} oct` : ''}
              </span>
            </div>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span className="text-[0.7rem] font-mono tracking-[0.12em] uppercase py-[3px] px-2 rounded"
                style={{ background: `${intervalColor}20`, border: `1px solid ${intervalColor}50`, color: intervalColor }}
              >
                {tappedNotes[0].noteName} → {tappedNotes[1].noteName}
              </span>
              <span className="text-[0.7rem] font-mono tracking-[0.12em] uppercase py-[3px] px-2 rounded bg-white/[0.04] border border-white/10 opacity-70"
                style={{ color: intervalColor }}
              >
                {playedInterval.consonance}
              </span>
            </div>
          </div>
        )}
        {tappedNotes.length > 0 && (
          <button
            onClick={reset}
            className="py-[5px] px-2.5 rounded-md text-[0.75rem] font-mono cursor-pointer border border-white/10 bg-white/[0.04] text-white/40 tracking-[0.1em] shrink-0 ml-2 hover:bg-white/[0.08] transition-colors"
          >
            RESET
          </button>
        )}
      </div>

      {/* Fretboard */}
      <div className="overflow-x-auto rounded-lg">
        <div className="rounded-lg border border-[rgba(74,51,36,0.6)] py-2 min-w-fit bg-[linear-gradient(180deg,#3d2b1a,#2c1e14,#3d2b1a)]">
          {fretboardGrid.map((row, sIdx) => {
            const thickness = 1 + sIdx * 0.4;
            const brightness = Math.max(100, 200 - sIdx * 20);
            return (
              <div key={sIdx} className="flex items-center h-9 relative">
                <div className="w-[22px] text-center text-[0.7rem] text-white/30 font-mono shrink-0">
                  {row.string.name}
                </div>
                {/* String line */}
                <div className="absolute top-1/2 left-[22px] right-0"
                  style={{ borderBottom: `${thickness}px solid rgba(${brightness},${brightness - 20},${brightness - 40},0.4)` }}
                />
                {row.notes.map(note => (
                  <div key={note.fret} className="flex items-center justify-center h-9 shrink-0 relative z-[1]"
                    style={{
                      width: note.fret === 0 ? 18 : 36,
                      borderRight: `2px solid rgba(212,175,55,${note.fret === 0 ? 0.5 : 0.12})`,
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleNoteClick(note.midi, note.stringIdx, note.fret)}
                      className="rounded-full cursor-pointer flex items-center justify-center text-[0.55rem] font-bold font-mono transition-all duration-150"
                      style={{
                        width: note.isFirst || note.isSecond ? 26 : 22,
                        height: note.isFirst || note.isSecond ? 26 : 22,
                        background: note.isFirst
                          ? 'var(--cf-gold)'
                          : note.isSecond
                          ? intervalColor
                          : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${note.isFirst ? 'var(--cf-gold)' : note.isSecond ? intervalColor : 'rgba(255,255,255,0.08)'}`,
                        color: note.isFirst || note.isSecond ? '#000' : 'rgba(255,255,255,0.2)',
                        boxShadow: note.isFirst ? '0 0 12px rgba(var(--cf-gold-rgb),0.6)' : note.isSecond ? `0 0 12px ${intervalColor}80` : 'none',
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
          <div className="flex pl-[22px] pt-1 pb-0.5">
            {Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => (
              <div key={f} className="flex justify-center shrink-0" style={{ width: f === 0 ? 18 : 36 }}>
                {DOT_FRETS.has(f) && <div className="w-[5px] h-[5px] rounded-full bg-cf-gold/25" />}
              </div>
            ))}
          </div>
        </div>

        {/* Fret numbers */}
        <div className="flex pl-[22px] mt-1">
          {Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => (
            <div key={f} className="text-center text-[0.7rem] text-white/20 font-mono shrink-0"
              style={{ width: f === 0 ? 18 : 36 }}
            >
              {f === 0 ? 'O' : f}
            </div>
          ))}
        </div>
      </div>

      {/* Interval reference table */}
      <div className="mt-5">
        <p className="text-[0.75rem] font-mono text-white/25 tracking-[0.15em] uppercase mb-2.5">
          Interval Reference
        </p>
        <div className="grid grid-cols-3 gap-1.5">
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
              <div key={row.st} className="py-1.5 px-2 rounded-md flex items-center gap-1.5 transition-all duration-200"
                style={{
                  background: isActive ? `${col}20` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? col + '60' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col }} />
                <div>
                  <div className="text-[0.7rem] font-mono" style={{ color: isActive ? col : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 700 : 400 }}>
                    {row.short} · {row.st}st
                  </div>
                  <div className="text-[0.65rem] text-white/25">{row.label}</div>
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
