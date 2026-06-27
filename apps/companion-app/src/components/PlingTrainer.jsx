import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';
import { devError } from '../lib/devLog';

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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

// Autocorrelation algorithm to find the fundamental frequency
function autoCorrelate(buf, sampleRate) {
  let SIZE = buf.length;
  let rms = 0;
  
  for (let i = 0; i < SIZE; i++) {
    let val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.002) return -1; // Lowered threshold for laptop mics

  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  let c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buf[j] * buf[j + i];

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export default function PlingTrainer() {
  const { t } = useLocale();
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [noteInfo, setNoteInfo] = useState({ name: "--", cents: 0, octave: 0 });
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioCtxRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);
      setError(null);
      updatePitch();
    } catch (err) {
      devError("Microphone access denied:", err);
      setError(t('plingMicError'));
    }
  };

  const stopListening = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsListening(false);
    setPitch(null);
    setVolume(0);
    setNoteInfo({ name: "--", cents: 0, octave: 0 });
  };

  const updatePitch = () => {
    if (!analyserRef.current || !isListening) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    let currentRms = 0;
    for (let i = 0; i < buffer.length; i++) {
      currentRms += buffer[i] * buffer[i];
    }
    currentRms = Math.sqrt(currentRms / buffer.length);
    setVolume(Math.min(100, currentRms * 1500)); // Scale to 0-100 for UI

    const acFreq = autoCorrelate(buffer, audioCtxRef.current.sampleRate);

    if (acFreq !== -1) {
      const noteNum = noteFromPitch(acFreq);
      const noteName = NOTE_STRINGS[noteNum % 12];
      const octave = Math.floor(noteNum / 12) - 1;
      const cents = centsOffFromPitch(acFreq, noteNum);
      
      setPitch(acFreq);
      setNoteInfo({ name: noteName, cents, octave });
    } else {
      // Not enough volume, decay the visual
      setPitch(null);
    }

    rafIdRef.current = requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    return () => stopListening(); // Cleanup on unmount
  }, []);

  // Visual calculations
  const centsDisplay = pitch ? Math.abs(noteInfo.cents) : 0;
  const isTuned = pitch && Math.abs(noteInfo.cents) < 10;

  return (
    <div className="bard-card my-6 relative overflow-hidden backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-6 text-center">
      {/* Background glow when tuned */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isTuned ? 'opacity-20' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle at center, #2ecc71 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        <h3 className="text-xl font-cormorant font-bold mb-2 flex items-center justify-center gap-2">
          <Activity size={20} className={isListening ? "animate-pulse text-cf-gold" : "text-white/50"} />
          {t('plingTitle')}
        </h3>
        <p className="text-sm text-white/70 mb-6 font-inter">
          {t('plingDesc')}
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* The Tuning Interface */}
        <div className="flex flex-col items-center justify-center space-y-8 mb-8 w-full max-w-sm mx-auto">
          
          {/* Volume Meter */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-white/40 mb-1 font-mono uppercase">
              <span>{t('plingMicInput')}</span>
              {volume > 5 ? <span className="text-cf-gold animate-pulse">{t('plingDetecting')}</span> : <span>{t('plingWaiting')}</span>}
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cf-gold transition-all duration-75 ease-out"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>

          {/* Center Note Display */}
          <div className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-colors duration-300 ${
            !pitch ? 'border-white/20 bg-black/20' : 
            isTuned ? 'border-green-400 bg-green-400/20 shadow-[0_0_30px_rgba(46,204,113,0.4)]' : 
            'border-cf-gold bg-cf-gold/20'
          }`}>
            <span className="text-5xl font-bold font-inter text-white">{noteInfo.name}</span>
            <span className="text-sm text-white/60">{pitch ? `${t('plingOctave')} ${noteInfo.octave}` : '--'}</span>
          </div>

          {/* Horizontal Tuning Bar */}
          <div className="w-full relative">
            {/* The scale markers */}
            <div className="flex justify-between w-full text-[10px] text-white/40 mb-2 font-mono">
              <span>{t('plingFlat50')}</span>
              <span>{t('plingInTune')}</span>
              <span>{t('plingSharp50')}</span>
            </div>
            
            {/* The bar background */}
            <div className="relative h-3 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden flex items-center">
              {/* Center target line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2 z-10" />
              
              {/* Tuning Indicator */}
              {pitch && (
                <div 
                  className={`absolute h-full w-4 rounded-full -translate-x-1/2 transition-all duration-100 ease-out shadow-[0_0_10px_currentColor] ${
                    isTuned ? 'bg-green-400 text-green-400' : 'bg-cf-gold text-cf-gold'
                  }`}
                  style={{ 
                    left: `${50 + noteInfo.cents}%`, // Map -50..50 to 0%..100%
                  }}
                />
              )}
            </div>
          </div>

          {/* Cents / Tuning status text */}
          <div className="h-6">
            {pitch ? (
              <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${isTuned ? 'text-green-400' : 'text-cf-gold'}`}>
                {isTuned ? t('plingPerfect') : noteInfo.cents < 0 ? t('plingFlat') : t('plingSharp')} 
                {!isTuned && <span className="ml-2 opacity-70">({centsDisplay} {t('plingCents')})</span>}
              </span>
            ) : (
              <span className="text-sm text-white/40 tracking-widest uppercase">{t('plingWaitingPitch')}</span>
            )}
          </div>
        </div>

        <button 
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full font-bold transition-all ${
            isListening 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          }`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          {isListening ? t('plingStopMic') : t('plingStartMic')}
        </button>
      </div>
    </div>
  );
}
