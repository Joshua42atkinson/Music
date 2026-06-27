import React, { useState, useCallback } from 'react';
import { useLocale } from '../hooks/useLocale';
import { Scale, Interval } from '@tonaljs/tonal';
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

const SCALE_TYPES = [
  { key: 'major',           label: 'Major',            color: '#3498db', tonalName: 'major' },
  { key: 'minor',           label: 'Natural Minor',    color: '#e74c3c', tonalName: 'minor' },
  { key: 'pentatonicMajor', label: 'Major Penta',      color: '#2ecc71', tonalName: 'major pentatonic' },
  { key: 'pentatonicMinor', label: 'Minor Penta',      color: '#f39c12', tonalName: 'minor pentatonic' },
  { key: 'blues',           label: 'Blues',            color: '#9b59b6', tonalName: 'minor blues' },
  { key: 'dorian',          label: 'Dorian',           color: '#1abc9c', tonalName: 'dorian' },
  { key: 'mixolydian',      label: 'Mixolydian',       color: '#e67e22', tonalName: 'mixolydian' },
];

function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
function noteClass(midi) { return midi % 12; }

const FRETS = 12;
const DOT_FRETS = new Set([3, 5, 7, 9, 12]);

const MiniNeck = ({ rootIdx, scaleType, color, onPlay }) => {
  const scaleInfo = SCALE_TYPES.find(s => s.key === scaleType);
  const rootName = NOTE_NAMES[rootIdx].replace('♯', '#');
  const scaleData = scaleInfo ? Scale.get(`${rootName} ${scaleInfo.tonalName}`) : null;
  const scaleSemitones = scaleData?.intervals?.map(i => Interval.semitones(i)) || [];

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      {/* Neck */}
      <div style={{
        background: 'linear-gradient(180deg, #3d2b1a, #2c1e14)',
        borderRadius: 4,
        border: '1px solid rgba(74,51,36,0.6)',
        minWidth: 'fit-content',
        position: 'relative',
      }}>
        {STRING_TUNING.map((str, sIdx) => (
          <div key={sIdx} style={{ display: 'flex', alignItems: 'center', height: 20, position: 'relative' }}>
            {/* String line */}
            <div style={{
              position: 'absolute', top: '50%', left: 16, right: 0,
              height: 1 + sIdx * 0.3, background: 'rgba(200,180,140,0.3)',
            }} />
            {/* Open */}
            <div style={{ width: 16, flexShrink: 0, zIndex: 1 }} />
            {Array.from({ length: FRETS + 1 }, (_, f) => {
              const midi = str.midiBase + f;
              const nc = noteClass(midi);
              const rel = ((nc - rootIdx) % 12 + 12) % 12;
              const isRoot = nc === rootIdx;
              const inScale = scaleSemitones.includes(rel);
              return (
                <div key={f} style={{
                  width: f === 0 ? 14 : 22,
                  height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRight: `1px solid rgba(212,175,55,${f === 0 ? 0.5 : 0.15})`,
                  flexShrink: 0, zIndex: 1, position: 'relative',
                }}>
                  {(isRoot || inScale) && (
                    <div
                      onClick={() => onPlay && onPlay(midiToFreq(midi))}
                      style={{
                        width: isRoot ? 10 : 8,
                        height: isRoot ? 10 : 8,
                        borderRadius: '50%',
                        background: isRoot ? color : `${color}60`,
                        border: `1px solid ${color}`,
                        boxShadow: isRoot ? `0 0 6px ${color}` : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {/* Fret dots */}
        <div style={{ display: 'flex', paddingLeft: 16, paddingTop: 2, paddingBottom: 2 }}>
          {Array.from({ length: FRETS + 1 }, (_, f) => (
            <div key={f} style={{
              width: f === 0 ? 14 : 22, display: 'flex',
              justifyContent: 'center', flexShrink: 0,
            }}>
              {DOT_FRETS.has(f) && (
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(var(--cf-gold-rgb),0.3)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MultiKeyHub = () => {
  const { t } = useLocale();
  const [scaleType, setScaleType] = useState('pentatonicMinor');
  const [selectedKey, setSelectedKey] = useState(null);

  const playNote = useCallback((freq) => {
    const ctx = resumeAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }, []);

  const currentScale = SCALE_TYPES.find(s => s.key === scaleType);
  const color = currentScale?.color || '#7b6aaa';

  // Build scale notes for the selected key (for the detail panel)
  const getScaleNotes = (rootIdx) => {
    if (!currentScale) return [];
    const rootName = NOTE_NAMES[rootIdx].replace('♯', '#');
    const sd = Scale.get(`${rootName} ${currentScale.tonalName}`);
    return sd?.notes?.map(n => n.replace('#', '♯')) || [];
  };

  return (
    <div className="text-[#e8edf2] font-sans">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[0.8rem] text-[#7b6aaa] font-mono tracking-[0.15em] uppercase mb-2">
          {t('multiKeySubtitle')}
        </p>
        <h2 className="font-heading text-[1.6rem] text-[#e8edf2] mb-1">
          {t('multiKeyTitle')}
        </h2>
        <p className="text-[0.85rem] text-white/45 leading-[1.6]">
          {t('multiKeyDesc')}
        </p>
      </div>

      {/* Scale type picker */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {SCALE_TYPES.map(s => (
          <button
            key={s.key}
            onClick={() => setScaleType(s.key)}
            className="py-1 px-3 rounded-full text-[0.8rem] font-mono cursor-pointer border transition-all duration-200"
            style={{
              borderColor: scaleType === s.key ? s.color : 'rgba(255,255,255,0.1)',
              background: scaleType === s.key ? `${s.color}20` : 'transparent',
              color: scaleType === s.key ? s.color : 'rgba(255,255,255,0.4)',
            }}
          >
            {t(`scale_${s.key}`)}
          </button>
        ))}
      </div>

      {/* 12-key grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {NOTE_NAMES.map((note, idx) => {
          const isSelected = selectedKey === idx;
          const scaleNotes = getScaleNotes(idx);
          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedKey(isSelected ? null : idx)}
              className="rounded-xl py-2.5 px-3 cursor-pointer transition-all duration-200"
              style={{
                background: isSelected ? `${color}18` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? color : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isSelected ? `0 0 20px ${color}20` : 'none',
              }}
            >
              {/* Key name + scale notes */}
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-base font-heading font-bold" style={{ color: isSelected ? color : '#e8edf2' }}>
                  {note}
                </span>
                <span className="text-[0.7rem] font-mono text-white/25 tracking-[0.1em]">
                  {scaleNotes.slice(0, 4).join(' ')}…
                </span>
              </div>

              {/* Mini neck */}
              <MiniNeck
                rootIdx={idx}
                scaleType={scaleType}
                color={isSelected ? color : 'rgba(var(--cf-gold-rgb),0.5)'}
                onPlay={playNote}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel for selected key */}
      <AnimatePresence>
        {selectedKey !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-xl p-4"
            style={{ background: `${color}12`, border: `1px solid ${color}40` }}
          >
            <p className="text-[0.75rem] font-mono tracking-[0.15em] uppercase mb-2" style={{ color }}>
              {NOTE_NAMES[selectedKey]} {t(`scale_${currentScale?.key}`)}
            </p>
            <div className="flex gap-2 flex-wrap">
              {getScaleNotes(selectedKey).map((n, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border flex items-center justify-center text-[0.8rem] font-mono font-bold cursor-pointer"
                  style={{
                    background: i === 0 ? color : `${color}30`,
                    borderColor: color,
                    color: i === 0 ? '#000' : color,
                  }}
                  onClick={() => {
                    const midi = 60 + NOTE_NAMES.findIndex(x => x.replace('♯','#') === n.replace('♯','#')) + (i > 0 && NOTE_NAMES.findIndex(x => x.replace('♯','#') === n.replace('♯','#')) <= selectedKey ? 12 : 0);
                    playNote(midiToFreq(midi));
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiKeyHub;
