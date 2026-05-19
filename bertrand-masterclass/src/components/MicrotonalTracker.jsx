import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const color = absCents < 8 ? '#7aaa88' : absCents < 20 ? '#c9a96e' : '#e74c3c';

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
  const tuningColor = absCents === null ? '#5a6a80' : absCents < 5 ? '#7aaa88' : absCents < 15 ? '#c9a96e' : '#e74c3c';

  return (
    <div style={{ color: '#e8edf2', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '0.8rem', color: '#7b6aaa', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
          ©FHEAL · Feel Pitch Variance
        </p>
        <h2 style={{ fontSize: '1.6rem', fontFamily: 'Cormorant Garamond, serif', color: '#e8edf2', marginBottom: 4 }}>
          Microtonal Tracker
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          Sing or play a note. The tracker shows your cents deviation — perfect for vibrato, bends, and intonation work.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          fontSize: '0.85rem', color: '#e74c3c',
        }}>
          {error}
        </div>
      )}

      {/* Start / Stop */}
      {!isListening ? (
        <button
          onClick={start}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, fontSize: '0.85rem',
            fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', letterSpacing: '0.1em',
            textTransform: 'uppercase', border: '1px solid rgba(123,106,170,0.4)',
            background: 'rgba(123,106,170,0.1)', color: '#7b6aaa', marginBottom: 20,
            transition: 'all 0.2s',
          }}
        >
          🎙️ Start Listening
        </button>
      ) : (
        <button
          onClick={stop}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, fontSize: '0.85rem',
            fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', letterSpacing: '0.1em',
            textTransform: 'uppercase', border: '1px solid rgba(231,76,60,0.4)',
            background: 'rgba(231,76,60,0.1)', color: '#e74c3c', marginBottom: 20,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          ◼ Stop
        </button>
      )}

      {/* Main readout */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '20px 16px', textAlign: 'center', marginBottom: 16,
      }}>
        {/* Note name */}
        <div style={{ marginBottom: 4 }}>
          <span style={{
            fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif',
            color: detected ? tuningColor : 'rgba(255,255,255,0.1)',
            fontWeight: 700, transition: 'color 0.2s',
          }}>
            {detected ? detected.name : '—'}
          </span>
          {detected && (
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>
              {detected.octave}
            </span>
          )}
        </div>

        {/* Cents needle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <CentsNeedle cents={detected?.cents || 0} />
        </div>

        {/* Tuning status */}
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
          background: `${tuningColor}15`, border: `1px solid ${tuningColor}40`, color: tuningColor,
        }}>
          {detected ? tuningLabel : isListening ? 'Listening…' : 'Inactive'}
        </div>

        {detected && (
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
            {detected.freq.toFixed(2)} Hz
          </div>
        )}
      </div>

      {/* Vibrato history trace */}
      {history.length > 4 && (
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '12px 16px',
        }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            Pitch History (vibrato trace)
          </p>
          <HistoryTrace history={history} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>−50¢</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(122,170,136,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>0¢ (in tune)</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>+50¢</span>
          </div>
        </div>
      )}

      {/* Reference guide */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { range: '< 5¢',   label: 'In Tune',   color: '#7aaa88', desc: 'Perfect' },
          { range: '5–15¢',  label: 'Close',     color: '#c9a96e', desc: 'Acceptable' },
          { range: '> 15¢',  label: 'Off',       color: '#e74c3c', desc: 'Adjust pitch' },
        ].map(r => (
          <div key={r.label} style={{
            padding: '8px 10px', borderRadius: 8, textAlign: 'center',
            background: `${r.color}10`, border: `1px solid ${r.color}30`,
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: r.color, fontWeight: 700 }}>{r.range}</div>
            <div style={{ fontSize: '0.7rem', color: r.color, marginTop: 2 }}>{r.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicrotonalTracker;
