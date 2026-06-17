import React, { useState, useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { resumeAudio } from '../audio/audioEngine';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

// ── YIN pitch detection (autocorrelation) ──────────────────────────────
function detectPitch(buffer, sampleRate) {
  const bufSize = buffer.length;
  const halfBuf = Math.floor(bufSize / 2);
  let diff = new Float32Array(halfBuf);
  let cumDiff = new Float32Array(halfBuf);

  for (let tau = 1; tau < halfBuf; tau++) {
    let d = 0;
    for (let i = 0; i < halfBuf; i++) {
      const delta = buffer[i] - buffer[i + tau];
      d += delta * delta;
    }
    diff[tau] = d;
  }

  cumDiff[0] = 1;
  let runSum = 0;
  for (let tau = 1; tau < halfBuf; tau++) {
    runSum += diff[tau];
    cumDiff[tau] = runSum === 0 ? diff[tau] : (diff[tau] * tau) / runSum;
  }

  const threshold = 0.15;
  let tau = 2;
  while (tau < halfBuf) {
    if (cumDiff[tau] < threshold) {
      while (tau + 1 < halfBuf && cumDiff[tau + 1] < cumDiff[tau]) tau++;
      // Parabolic interpolation
      const x0 = tau > 1 ? cumDiff[tau - 1] : cumDiff[tau];
      const x2 = tau < halfBuf - 1 ? cumDiff[tau + 1] : cumDiff[tau];
      const best = x0 < x2 ? tau - 0.5 : x2 < x0 ? tau + 0.5 : tau;
      return sampleRate / best;
    }
    tau++;
  }
  return null;
}

// ── Nearest note + cents deviation ─────────────────────────────────────
function freqToNoteAndCents(freq) {
  if (!freq || freq <= 0) return null;
  const midi = 12 * (Math.log2(freq / 440)) + 69;
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  const name = NOTE_NAMES[((roundedMidi % 12) + 12) % 12];
  const octave = Math.floor(roundedMidi / 12) - 1;
  return { name, octave, cents, midi: roundedMidi, freq };
}

// ── Cents needle SVG ───────────────────────────────────────────────────
const CentsNeedle = ({ cents }) => {
  const angle = (cents / 50) * 70; // ±70 degrees
  const clampedCents = Math.max(-50, Math.min(50, cents));
  const absCents = Math.abs(clampedCents);
  const color = absCents < 8 ? '#7aaa88' : absCents < 20 ? 'var(--cf-gold)' : '#e74c3c';

  return (
    <svg viewBox="-80 -70 160 90" style={{ width: 200, height: 120 }}>
      {/* Arc background */}
      <path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
      {/* Green zone (in-tune ±8¢) */}
      <path d="M -10 -70 A 70 70 0 0 1 10 -70" fill="none" stroke="rgba(122,170,136,0.3)" strokeWidth="20" />
      {/* Tick marks */}
      {[-50, -25, 0, 25, 50].map(c => {
        const a = (c / 50) * 70 * (Math.PI / 180);
        const x = 66 * Math.sin(a);
        const y = -66 * Math.cos(a);
        return <circle key={c} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.2)" />;
      })}
      {/* Labels */}
      <text x="-74" y="10" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">−50</text>
      <text x="74" y="10" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">+50</text>
      <text x="0" y="-74" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">0</text>
      {/* Needle */}
      <motion.line
        x1="0" y1="10"
        x2="0" y2="-58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={{ rotate: angle }}
        style={{ transformOrigin: '0 10px', originX: 0, originY: 10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
      {/* Pivot */}
      <circle cx="0" cy="10" r="5" fill={color} />
      {/* Cents readout */}
      <text x="0" y="22" fill={color} fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700">
        {clampedCents > 0 ? '+' : ''}{clampedCents}¢
      </text>
    </svg>
  );
};

// ── Vibrato history trace ───────────────────────────────────────────────
const HistoryTrace = ({ history }) => {
  if (history.length < 2) return null;
  const W = 280, H = 50;
  const points = history.map((c, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H / 2 - (c / 50) * (H / 2 - 4);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: H }}>
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,3" />
      <polyline points={points} fill="none" stroke="rgba(90,144,160,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

const MicrotonalTracker = () => {
  const [isListening, setIsListening] = useState(false);
  const [detected, setDetected] = useState(null);          // { name, octave, cents, freq }
  const [history, setHistory] = useState([]);              // last N cents values
  const [error, setError] = useState(null);

  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  const HISTORY_LEN = 60;

  const stop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = resumeAudio();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;
      setIsListening(true);

      const buf = new Float32Array(analyser.fftSize);
      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        // RMS level check — skip quiet frames
        const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
        if (rms > 0.01) {
          const freq = detectPitch(buf, ctx.sampleRate);
          if (freq && freq > 60 && freq < 1200) {
            const result = freqToNoteAndCents(freq);
            if (result) {
              setDetected(result);
              setHistory(prev => {
                const next = [...prev, result.cents];
                return next.length > HISTORY_LEN ? next.slice(-HISTORY_LEN) : next;
              });
            }
          }
        }
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      setError(err.name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow mic access in your browser settings.'
        : `Mic error: ${err.message}`);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const absCents = detected ? Math.abs(detected.cents) : null;
  const tuningLabel = absCents === null ? null : absCents < 5 ? 'In Tune ✓' : absCents < 15 ? 'Close' : 'Off';
  const tuningColor = absCents === null ? '#5a6a80' : absCents < 5 ? '#7aaa88' : absCents < 15 ? 'var(--cf-gold)' : '#e74c3c';

  return (
    <div className="text-[#e8edf2] font-sans">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[0.8rem] text-[#7b6aaa] font-mono tracking-[0.15em] uppercase mb-1.5">
          ©FHEAL · Feel Pitch Variance
        </p>
        <h2 className="text-[1.6rem] font-heading text-[#e8edf2] mb-1">
          Microtonal Tracker
        </h2>
        <p className="text-[0.85rem] text-white/40 leading-[1.6]">
          Sing or play a note. The tracker shows your cents deviation — perfect for vibrato, bends, and intonation work.
        </p>
      </div>

      {error && (
        <div className="bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] rounded-lg py-3 px-4 mb-4 text-[0.85rem] text-[#e74c3c]">
          {error}
        </div>
      )}

      {/* Start / Stop */}
      {!isListening ? (
        <button
          onClick={start}
          className="w-full py-3.5 rounded-xl text-[0.85rem] font-mono cursor-pointer tracking-[0.1em] uppercase border border-[rgba(123,106,170,0.4)] bg-[rgba(123,106,170,0.1)] text-[#7b6aaa] mb-5 transition-all duration-200"
        >
          🎙️ Start Listening
        </button>
      ) : (
        <button
          onClick={stop}
          className="w-full py-3.5 rounded-xl text-[0.85rem] font-mono cursor-pointer tracking-[0.1em] uppercase border border-[rgba(231,76,60,0.4)] bg-[rgba(231,76,60,0.1)] text-[#e74c3c] mb-5"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          ◼ Stop
        </button>
      )}

      {/* Main readout */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl py-5 px-4 text-center mb-4">
        {/* Note name */}
        <div className="mb-1">
          <span className="text-[3rem] font-heading font-bold transition-[color] duration-200" style={{ color: detected ? tuningColor : 'rgba(255,255,255,0.1)' }}>
            {detected ? detected.name : '—'}
          </span>
          {detected && (
            <span className="text-[1.1rem] text-white/30 ml-1">
              {detected.octave}
            </span>
          )}
        </div>

        {/* Cents needle */}
        <div className="flex justify-center mb-2">
          <CentsNeedle cents={detected?.cents || 0} />
        </div>

        {/* Tuning status */}
        <div className="inline-block py-1 px-3 rounded-[20px] text-[0.8rem] font-mono tracking-[0.1em]" style={{ background: `${tuningColor}15`, border: `1px solid ${tuningColor}40`, color: tuningColor }}>
          {detected ? tuningLabel : isListening ? 'Listening…' : 'Inactive'}
        </div>

        {detected && (
          <div className="mt-2 text-[0.75rem] text-white/25 font-mono">
            {detected.freq.toFixed(2)} Hz
          </div>
        )}
      </div>

      {/* Vibrato history trace */}
      {history.length > 4 && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl py-3 px-4">
          <p className="text-[0.75rem] font-mono text-white/20 tracking-[0.15em] uppercase mb-2">
            Pitch History (vibrato trace)
          </p>
          <HistoryTrace history={history} />
          <div className="flex justify-between mt-1">
            <span className="text-[0.7rem] text-white/20 font-mono">−50¢</span>
            <span className="text-[0.7rem] text-[rgba(122,170,136,0.6)] font-mono">0¢ (in tune)</span>
            <span className="text-[0.7rem] text-white/20 font-mono">+50¢</span>
          </div>
        </div>
      )}

      {/* Reference guide */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { range: '< 5¢',   label: 'In Tune',   color: '#7aaa88', desc: 'Perfect' },
          { range: '5–15¢',  label: 'Close',     color: 'var(--cf-gold)', desc: 'Acceptable' },
          { range: '> 15¢',  label: 'Off',       color: '#e74c3c', desc: 'Adjust pitch' },
        ].map(r => (
          <div key={r.label} className="py-2 px-2.5 rounded-lg text-center" style={{ background: `${r.color}10`, border: `1px solid ${r.color}30` }}>
            <div className="text-[0.75rem] font-mono font-bold" style={{ color: r.color }}>{r.range}</div>
            <div className="text-[0.7rem] mt-0.5" style={{ color: r.color }}>{r.label}</div>
            <div className="text-[0.7rem] text-white/25 mt-0.5">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicrotonalTracker;
