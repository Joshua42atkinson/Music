// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : DailyCalibration.jsx                                ║
// ║ WHAT    : The bio-mechanical calibration gate (tuner + hum)    ║
// ║ WHY     : To ground the player and ensure physical readiness   ║
// ║ WHO     : Student (must perform daily before unlocking lessons)║
// ║ OWNS    : 6-string tuner, laryngeal voice check, stability algorithm ║
// ║ NEEDS   : usePitchDetector, playPling, playReferenceTone        ║
// ║ RULES   : Mechanical terminology only (e.g., "diaphragmatic")   ║
// ║           Must have a bypass option for seamless offline testing║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ShieldAlert, CheckCircle, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import usePitchDetector from '../hooks/usePitchDetector';
import { playPling, playReferenceTone } from '../audio/audioEngine';
import { useScaffolding } from '../components/ScaffoldingProvider';

const STRINGS = [
  { note: 'E', freq: 82.41, label: '6th String (Low E2)', targetMidi: 40 },
  { note: 'A', freq: 110.00, label: '5th String (A2)', targetMidi: 45 },
  { note: 'D', freq: 146.83, label: '4th String (D3)', targetMidi: 50 },
  { note: 'G', freq: 196.00, label: '3rd String (G3)', targetMidi: 55 },
  { note: 'B', freq: 246.94, label: '2nd String (B3)', targetMidi: 59 },
  { note: 'E', freq: 329.63, label: '1st String (High E4)', targetMidi: 64 },
];

export default function DailyCalibration({ onClose }) {
  const [step, setStep] = useState('intro'); // intro | tuning | breath | success
  const [currentStringIdx, setCurrentStringIdx] = useState(0);
  const [tunedStrings, setTunedStrings] = useState(new Array(6).fill(false));
  const [breathSeconds, setBreathSeconds] = useState(0);
  const [isStable, setIsStable] = useState(true);
  const [somaticStatus, setSomaticStatus] = useState('Hum a steady "A" (110Hz) to measure tension');
  const [volumeWindow, setVolumeWindow] = useState([]);
  
  const { isListening, pitch, volume, noteInfo, startListening, stopListening } = usePitchDetector();
  const { updateTraction } = useScaffolding();

  const stabilityTimerRef = useRef(null);
  const consecutiveInTuneFrames = useRef(0);
  const volumeHistory = useRef([]);
  const lastTimeRef = useRef(0);

  // ── Start/Stop listening based on steps ──
  useEffect(() => {
    if (step === 'tuning' || step === 'breath') {
      startListening();
    } else {
      stopListening();
    }
    return () => stopListening();
  }, [step, startListening, stopListening]);

  // ── Step 1: 6-String Tuner Engine ──
  useEffect(() => {
    if (step !== 'tuning') return;

    const target = STRINGS[currentStringIdx];
    if (!pitch || volume < 8) {
      consecutiveInTuneFrames.current = 0;
      return;
    }

    // Standard cents calculation or MIDI note distance
    const centsOffset = noteInfo?.cents ?? 0;
    const isCorrectNote = noteInfo?.name === target.note;

    // Tolerance is +/- 25 cents
    const inTune = isCorrectNote && Math.abs(centsOffset) <= 25;

    if (inTune) {
      consecutiveInTuneFrames.current += 1;
      // Need 8 consecutive frames in-tune to lock
      if (consecutiveInTuneFrames.current >= 8) {
        playPling(target.freq);
        setTunedStrings(prev => {
          const next = [...prev];
          next[currentStringIdx] = true;
          return next;
        });

        consecutiveInTuneFrames.current = 0;
        
        // Auto-advance strings
        if (currentStringIdx < 5) {
          setCurrentStringIdx(prev => prev + 1);
        } else {
          // Play complete chime
          setTimeout(() => {
            playPling(440);
            setStep('breath');
          }, 600);
        }
      }
    } else {
      consecutiveInTuneFrames.current = 0;
    }
  }, [pitch, volume, noteInfo, currentStringIdx, step]);

  const handleSuccess = useCallback(() => {
    // Unlock curriculum in global state
    const today = new Date().toISOString().split('T')[0];
    updateTraction(prev => ({
      ...prev,
      lastCalibrationDate: today,
      streaks: (prev.streaks || 0) + 1,
    }));
    playPling(440);
    setTimeout(() => playPling(554.37), 150); // Major 3rd
    setTimeout(() => playPling(659.25), 300); // Perfect 5th
    setStep('success');
  }, [updateTraction]);

  // ── Step 2: Somatic Voice Breath Stability Engine ──
  useEffect(() => {
    if (step !== 'breath') return;

    if (!pitch || volume < 10) {
      // No vocalization or too quiet
      volumeHistory.current = [];
      setIsStable(true);
      setSomaticStatus('Vocalize an "A" (110Hz or octave) at a comfortable volume.');
      return;
    }

    // Check if pitch is an octave of A (55Hz, 110Hz, 220Hz, 440Hz)
    const isA = noteInfo?.name === 'A';

    if (!isA) {
      setSomaticStatus('Centering fundamental pitch... Sing a steady "A" tone.');
      return;
    }

    // ── Bio-mechanical Tension Detection ──
    // Record current volume
    volumeHistory.current.push(volume);
    if (volumeHistory.current.length > 20) {
      volumeHistory.current.shift();
    }

    // Compute successive amplitude variance (tension shaking index)
    if (volumeHistory.current.length >= 10) {
      let sumSuccessiveDiffs = 0;
      for (let i = 1; i < volumeHistory.current.length; i++) {
        sumSuccessiveDiffs += Math.abs(volumeHistory.current[i] - volumeHistory.current[i - 1]);
      }
      const meanSuccessiveDiff = sumSuccessiveDiffs / (volumeHistory.current.length - 1);
      
      // If volume fluctuates rapidly (amplitude modulation/tremor), raise tension alert
      const tensionDetected = meanSuccessiveDiff > 3.2; 
      
      if (tensionDetected) {
        setIsStable(false);
        setSomaticStatus('Tremor detected. Lower shoulders, open throat, ground breath.');
        // Don't accumulate time if breathing is tense/shaking
        return;
      } else {
        setIsStable(true);
        setSomaticStatus('Mechanical resonance stable. Core support engaged.');
      }
    }

    // Accumulate calibrated seconds of steady hum
    const now = performance.now();
    if (now - lastTimeRef.current >= 1000) {
      lastTimeRef.current = now;
      setBreathSeconds(prev => {
        const next = prev + 1;
        if (next >= 4) {
          handleSuccess();
          return 4;
        }
        return next;
      });
    }
  }, [pitch, volume, noteInfo, step, handleSuccess]);

  // ── Fast forward bypasses for Friday dev testing ──
  const bypassTuning = () => {
    playPling(220);
    setTunedStrings(new Array(6).fill(true));
    setStep('breath');
  };

  const bypassSomatic = () => {
    handleSuccess();
  };

  const handleDone = () => {
    onClose?.();
  };

  // ── Needle calculations for the tuner ──
  const currentTarget = STRINGS[currentStringIdx];
  const cents = noteInfo?.cents ?? 0;
  const needlePct = Math.max(0, Math.min(100, 50 + cents));

  return (
    <div className="fixed inset-0 z-[2000] bg-cf-void/98 backdrop-blur-xl flex flex-col justify-between p-6 md:p-8 text-cf-ink font-body">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-cf-border/40 pb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cf-gold animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-cf-gold">Daily Calibration Gate</span>
        </div>
        <h2 className="font-heading text-xl md:text-2xl text-cf-ink-bright italic">Tuning the Wood & Player</h2>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full bg-cf-surface border border-cf-border hover:bg-cf-surface-raised transition-colors text-cf-whisper hover:text-cf-ink-bright"
          aria-label="Exit Calibration"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Sandbox Workspace Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-xl w-full mx-auto py-8 z-10">
        <AnimatePresence mode="wait">
          
          {/* ═══ STEP 0: INTRO STATE ═══ */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-cf-gold/10 border border-cf-gold/30 flex items-center justify-center text-cf-gold shadow-[0_0_30px_rgba(201,169,110,0.1)]">
                <Volume2 size={32} />
              </div>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl text-cf-ink-bright mb-3">Initialize Somatic Sensors</h3>
                <p className="text-sm md:text-base text-cf-whisper leading-relaxed max-w-md">
                  Before launching the main curriculum, calibrate your acoustic framework. We check physical mechanical state: first your instrument, then your voice support.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
                <button
                  onClick={() => setStep('tuning')}
                  className="py-3 px-6 bg-cf-gold text-cf-void rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e0d0aa] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cf-gold/10 flex items-center justify-center gap-2"
                >
                  <Play size={14} fill="currentColor" /> Begin Calibration
                </button>
                
                <button
                  onClick={bypassSomatic}
                  className="py-2.5 px-6 bg-cf-surface border border-cf-border/60 hover:border-cf-gold/40 text-cf-whisper hover:text-cf-gold rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  [DEV] Bypass Entire Gate
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 1: TUNING THE WOOD (GUITAR TUNER) ═══ */}
          {step === 'tuning' && (
            <motion.div
              key="tuning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="text-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-cf-gold bg-cf-gold/10 border border-cf-gold/20 px-2.5 py-1 rounded-full">Phase 1: Tuning the Wood</span>
                <h3 className="font-heading text-xl md:text-2xl text-cf-ink-bright mt-3">Resonate Fretboard Strings</h3>
                <p className="text-xs text-cf-whisper mt-1">Pluck each string. Adjust pegs until within mechanical envelope.</p>
              </div>

              {/* Six Strings Visualizer */}
              <div className="bg-cf-deep border border-cf-border/50 rounded-2xl p-4 md:p-6 flex flex-col gap-3">
                <div className="grid grid-cols-6 gap-2">
                  {STRINGS.map((str, idx) => {
                    const isCurrent = idx === currentStringIdx;
                    const isTuned = tunedStrings[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentStringIdx(idx)}
                        className={`py-3 rounded-lg font-mono text-sm font-bold border transition-all ${
                          isTuned 
                            ? 'bg-cf-sage/20 border-cf-sage text-cf-sage'
                            : isCurrent
                              ? 'bg-cf-gold/10 border-cf-gold text-cf-gold shadow-[0_0_12px_rgba(201,169,110,0.15)]'
                              : 'bg-cf-surface/40 border-cf-border/40 text-cf-muted hover:border-cf-border/80'
                        }`}
                      >
                        {str.note}
                        <div className="text-[9px] font-normal text-cf-whisper mt-1">{6 - idx} String</div>
                      </button>
                    );
                  })}
                </div>

                {/* Tuner Needle Ring */}
                <div className="bg-cf-void border border-cf-border/30 rounded-xl p-4 flex flex-col gap-4 mt-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-mono text-cf-muted uppercase block">Current Target</span>
                      <span className="font-heading text-lg text-cf-gold italic font-bold">{currentTarget.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-cf-muted uppercase block">Detected Pitch</span>
                      <span className="font-mono text-sm text-cf-ink-bright font-bold">
                        {pitch ? `${Math.round(pitch)} Hz` : 'No Signal'}
                      </span>
                    </div>
                  </div>

                  {/* Pitch deviation needle */}
                  <div className="relative py-4">
                    <div className="flex justify-between font-mono text-[9px] text-cf-muted mb-2">
                      <span>Flat (-50¢)</span>
                      <span className="text-cf-gold">Perfect Pitch</span>
                      <span>Sharp (+50¢)</span>
                    </div>
                    <div className="relative h-2 bg-cf-surface rounded-full overflow-visible">
                      {/* Safe target zone band */}
                      <div className="absolute left-[37.5%] right-[37.5%] top-0 bottom-0 bg-cf-sage/10 border-x border-cf-sage/20" />
                      
                      {/* Needle indicator */}
                      {pitch && (
                        <motion.div
                          className="absolute top-[-6px] bottom-[-6px] w-1 bg-cf-gold shadow-[0_0_10px_#c9a96e] rounded"
                          style={{ left: `${needlePct}%` }}
                          animate={{ left: `${needlePct}%` }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-cf-whisper">
                    <span>Cents Deviation: {pitch ? `${cents > 0 ? '+' : ''}${cents}¢` : '—'}</span>
                    <span className={noteInfo?.name === currentTarget.note && Math.abs(cents) <= 25 ? 'text-cf-sage' : 'text-cf-gold'}>
                      {pitch 
                        ? noteInfo?.name === currentTarget.note 
                          ? Math.abs(cents) <= 25 ? 'Acceptable stability' : 'Adjust tension'
                          : 'Frequency mismatch'
                        : 'Awaiting pluck...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tuner Actions */}
              <div className="flex justify-between gap-4 mt-2">
                <button
                  onClick={bypassTuning}
                  className="py-2 px-4 bg-cf-surface border border-cf-border/60 text-cf-whisper hover:text-cf-gold rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  [DEV] Bypass String Tuning
                </button>
                <button
                  onClick={() => setStep('breath')}
                  className="py-2.5 px-4 bg-cf-surface border border-cf-gold/30 text-cf-gold hover:bg-cf-gold hover:text-cf-void rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-1.5"
                >
                  Voice Check <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: TUNING THE PLAYER (VOICE HUM STABILITY) ═══ */}
          {step === 'breath' && (
            <motion.div
              key="breath"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="text-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#5a90a0] bg-[#5a90a0]/10 border border-[#5a90a0]/20 px-2.5 py-1 rounded-full">Phase 2: Tuning the Player</span>
                <h3 className="font-heading text-xl md:text-2xl text-cf-ink-bright mt-3">Laryngeal Breath Stability</h3>
                <p className="text-xs text-cf-whisper mt-1">Hum a steady "A" (110Hz / octave) to analyze respiratory tension.</p>
              </div>

              {/* Hum Stability Visualizer */}
              <div className="bg-cf-deep border border-cf-border/50 rounded-2xl p-6 flex flex-col gap-5 items-center">
                
                {/* 4-Second Countdown Circles */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-cf-surface"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Active stability progress circle */}
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-cf-gold"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="402"
                      strokeDashoffset={402 - (402 * (breathSeconds / 4))}
                      transition={{ duration: 0.3 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Countdown number or lock icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-mono font-bold text-cf-ink-bright">{breathSeconds}s</span>
                    <span className="text-[9px] font-mono text-cf-whisper uppercase tracking-widest">Steady Target: 4s</span>
                  </div>
                </div>

                {/* Tension / Shaking Detector Dashboard */}
                <div className="w-full bg-cf-void border border-cf-border/30 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cf-whisper">Laryngeal State:</span>
                    <span className={`font-bold flex items-center gap-1.5 ${
                      !isStable 
                        ? 'text-red-400' 
                        : pitch && noteInfo?.name === 'A' 
                          ? 'text-cf-sage' 
                          : 'text-cf-gold'
                    }`}>
                      {!isStable && <AlertTriangle size={12} />}
                      {!isStable 
                        ? 'amplitude modulations (shaking)' 
                        : pitch && noteInfo?.name === 'A'
                          ? 'Optimal Diaphragmatic Balance' 
                          : 'Calibrating laryngeal coordinates...'}
                    </span>
                  </div>

                  {/* Volume signal meter */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-cf-muted w-16 uppercase">Breath Level</span>
                    <div className="flex-1 h-3 bg-cf-surface rounded-md overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-[#5a90a0] transition-all duration-75"
                        style={{ width: `${Math.min(100, volume * 1.5)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-cf-whisper font-medium italic mt-1 leading-normal">
                    "{somaticStatus}"
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={bypassSomatic}
                  className="py-2 px-4 bg-cf-surface border border-cf-border/60 text-cf-whisper hover:text-cf-gold rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  [DEV] Bypass Somatic Check
                </button>
                <button
                  onClick={() => setStep('tuning')}
                  className="py-2 px-4 bg-cf-surface border border-cf-border/60 text-cf-whisper hover:text-cf-gold rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  Back to Tuner
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 3: SUCCESS STATE ═══ */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-cf-sage/10 border border-cf-sage/30 flex items-center justify-center text-cf-sage shadow-[0_0_30px_rgba(122,170,136,0.15)] animate-bounce">
                <CheckCircle size={36} />
              </div>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl text-cf-ink-bright mb-2">Calibration Successful</h3>
                <p className="text-sm text-cf-whisper max-w-sm leading-relaxed">
                  Laryngeal muscle group relaxed. Acoustic instruments aligned. Your biometric resonance meets standards. Curricula open for execution.
                </p>
              </div>
              <button
                onClick={handleDone}
                className="py-3 px-8 bg-cf-sage text-cf-void rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#92bfa0] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cf-sage/10 flex items-center gap-2 mt-2"
              >
                Enter Fretboard <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="relative text-center border-t border-cf-border/30 pt-4 font-mono text-[9px] text-cf-muted z-10">
        Voix Vive Somatic Mechanics v2.0 // Offline Bio-Acoustic Calibration Gate
      </div>
    </div>
  );
}
