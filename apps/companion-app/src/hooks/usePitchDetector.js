// ═══════════════════════════════════════════════════════════
// usePitchDetector — Shared microphone + pitch detection hook
//
// Extracted from PlingTrainer's core logic and made reusable.
// Uses a singleton AudioContext pattern to prevent duplicate
// contexts when both PlingTrainer and VertiscaleEngine are
// mounted in the same session.
//
// Provides:
//   isListening, pitch (Hz), noteInfo {name, cents, octave},
//   volume (0–100), breathState ('free' | 'held' | 'shallow'),
//   startListening(), stopListening(), error
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';
import { getAudioContext, resumeAudio } from '../audio/audioEngine';
import { emitNotePlayed } from '../lib/bevyEventBus';

// ── Shared singleton mic stream (module-level) ──
// We keep the stream and analyser shared to avoid multiple mic prompts.
// The AudioContext itself is managed by audioEngine.js.
let _sharedAnalyser = null;
let _sharedStream = null;
let _refCount = 0;

// ── MIDI throttle state (replaces window.__LAST_SENT_MIDI / __MIDI_RESET) ──
let _lastSentMidi = null;
let _midiResetTimeout = null;

function acquireContext() {
  const ctx = getAudioContext();
  if (_sharedAnalyser && ctx.state !== 'closed') {
    _refCount++;
    return { ctx, analyser: _sharedAnalyser };
  }
  return null;
}

// ── Pitch math helpers ──

function noteFromPitch(frequency) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

// Autocorrelation pitch detection (same algorithm as PlingTrainer)
function autoCorrelate(buf, sampleRate) {
  let SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.002) return -1;

  let r1 = 0, r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] += buf[j] * buf[j + i];

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }

  let T0 = maxpos;
  
  // Harmonic correction: check if twice the period (lower octave) also has a strong correlation peak.
  // This is extremely effective for low pitch signals (under ~200Hz) where the 2nd harmonic is dominant.
  const freqEstimate = sampleRate / T0;
  if (freqEstimate < 300) { 
    const doublePeriod = Math.round(T0 * 2);
    if (doublePeriod < SIZE) {
      let localMax = -1;
      let localMaxPos = doublePeriod;
      const searchWindow = 4; // search +/- 4 samples for subharmonic peak
      for (let i = doublePeriod - searchWindow; i <= doublePeriod + searchWindow; i++) {
        if (i >= 0 && i < SIZE && c[i] > localMax) {
          localMax = c[i];
          localMaxPos = i;
        }
      }
      // If the correlation at the double period is at least 80% as strong as the first peak,
      // it means the true fundamental is the lower octave.
      if (localMax > maxval * 0.8) {
        T0 = localMaxPos;
      }
    }
  }

  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BREATH_HELD_THRESHOLD = 0.008;  // amplitude; below this = held breath
const BREATH_HELD_DURATION  = 1000;   // ms sustained below threshold = 'held'

export default function usePitchDetector() {
  const [isListening, setIsListening]   = useState(false);
  const [pitch,       setPitch]         = useState(null);
  const [noteInfo,    setNoteInfo]      = useState({ name: '--', cents: 0, octave: 0 });
  const [volume,      setVolume]        = useState(0);
  const [breathState, setBreathState]   = useState('free');
  const [error,       setError]         = useState(null);

  const ctxRef      = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef    = useRef(null);
  const ownedCtx    = useRef(false); // true if we created the ctx (not borrowed)

  // Breath hold tracking
  const breathLowSince = useRef(null);

  // Memoization refs — prevent 60fps over-rendering
  const pitchRef       = useRef(null);
  const noteInfoRef    = useRef(null);
  const volumeRef      = useRef(0);
  const breathStateRef = useRef('free');

  const tick = useCallback(() => {
    const runTick = () => {
      const analyser = analyserRef.current;
      const ctx      = ctxRef.current;
      if (!analyser || !ctx || ctx.state === 'closed') return;

      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);

      // Volume (RMS)
      let rmsSum = 0;
      for (let i = 0; i < buffer.length; i++) rmsSum += buffer[i] * buffer[i];
      const rms = Math.sqrt(rmsSum / buffer.length);
      const vol = Math.min(100, rms * 1500);
      if (vol !== volumeRef.current) {
        volumeRef.current = vol;
        setVolume(vol);
      }

      // ── Breath state detection ──
      if (rms < BREATH_HELD_THRESHOLD) {
        if (!breathLowSince.current) breathLowSince.current = performance.now();
        const elapsed = performance.now() - breathLowSince.current;
        const newBreathState = elapsed >= BREATH_HELD_DURATION ? 'held' : elapsed >= 300 ? 'shallow' : null;
        if (newBreathState && newBreathState !== breathStateRef.current) {
          breathStateRef.current = newBreathState;
          setBreathState(newBreathState);
        }
      } else {
        breathLowSince.current = null;
        if (breathStateRef.current !== 'free') {
          breathStateRef.current = 'free';
          setBreathState('free');
        }
      }

      // ── Pitch detection ──
      const freq = autoCorrelate(buffer, ctx.sampleRate);
      if (freq !== -1) {
        const noteNum  = noteFromPitch(freq);
        const noteName = NOTE_STRINGS[noteNum % 12];
        const octave   = Math.floor(noteNum / 12) - 1;
        const cents    = centsOffFromPitch(freq, noteNum);
        if (freq !== pitchRef.current) {
          pitchRef.current = freq;
          setPitch(freq);
        }
        
        const newNoteInfo = { name: noteName, cents, octave, midi: noteNum };
        if (!noteInfoRef.current || noteInfoRef.current.midi !== noteNum || noteInfoRef.current.cents !== cents) {
          noteInfoRef.current = newNoteInfo;
          setNoteInfo(newNoteInfo);
        }

        // ── Throttle sending to Bevy IPC via event bus ──
        if (_lastSentMidi !== noteNum) {
          emitNotePlayed({ ...newNoteInfo, frequency: freq, volume: vol });
          _lastSentMidi = noteNum;
          clearTimeout(_midiResetTimeout);
          _midiResetTimeout = setTimeout(() => { _lastSentMidi = null; }, 300);
        }

      } else {
        if (pitchRef.current !== null) {
          pitchRef.current = null;
          setPitch(null);
        }
      }

      rafIdRef.current = requestAnimationFrame(runTick);
    };
    runTick();
  }, []);

  const startListening = useCallback(async () => {
    try {
      // AudioContext may be suspended due to autoplay policy —
      // resume requires a user gesture (caller must trigger from a click handler).
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        try { await ctx.resume(); } catch (e) {
          setError('Click to enable pitch detection — browser autoplay policy requires a user gesture.');
          return;
        }
      }

      // Try to reuse an existing shared context first
      const existing = acquireContext();
      if (existing) {
        ctxRef.current      = existing.ctx;
        analyserRef.current = existing.analyser;
        ownedCtx.current    = false;
      } else {
        // Create a fresh stream and analyser
        const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
        const resumedCtx = resumeAudio();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        // Register as singleton
        _sharedAnalyser = analyser;
        _sharedStream  = stream;
        _refCount      = 1;

        ctxRef.current      = ctx;
        analyserRef.current = analyser;
        ownedCtx.current    = true;
      }

      setIsListening(true);
      setError(null);
      rafIdRef.current = requestAnimationFrame(tick);
    } catch (err) {
      console.error('[usePitchDetector] Mic access failed:', err);
      setError('Please allow microphone access to use this feature.');
    }
  }, [tick]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;

    _refCount = Math.max(0, _refCount - 1);

    if (ownedCtx.current && _refCount === 0) {
      // We created it and no one else is using it — close the stream
      _sharedStream?.getTracks().forEach(t => t.stop());
      _sharedAnalyser = null;
      _sharedStream = null;
    }

    ctxRef.current      = null;
    analyserRef.current = null;
    ownedCtx.current    = false;

    setIsListening(false);
    setPitch(null);
    setVolume(0);
    setBreathState('free');
    breathLowSince.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (isListening) stopListening();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isListening,
    pitch,
    noteInfo,
    volume,
    breathState,
    error,
    startListening,
    stopListening,
    audioCtxRef: ctxRef,
  };
}
