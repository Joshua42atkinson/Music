import React, { useState, useEffect, useCallback, useRef } from 'react';
import { resumeAudio, initMicrophone, closeMicrophone, getAudioContext } from '../../audio/audioEngine';
import { detectPitch, getCentDifference } from '../../audio/pitchDetection';
import { useScaffolding } from '../../components/ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { useCosyVoice } from '../../hooks/useCosyVoice';
import { getVoicePrompt } from '../../data/voicePrompts';
import { vvGet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { Mic, MicOff } from 'lucide-react';

const intervals = [
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 }
];

const PitchRoom = () => {
  const { completePhase, passGate, traction } = useScaffolding();
  const { locale } = useLocale();
  const cosyvoice = useCosyVoice();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [currentInterval, setCurrentInterval] = useState(null);
  const [doMarked, setDoMarked] = useState(false);
  
  // Audiation Pause (Edwin Gordon)
  const [audiationActive, setAudiationActive] = useState(false);
  const [audiationReady, setAudiationReady] = useState(false);
  const [audiationSeconds, setAudiationSeconds] = useState(4);

  // Microphone State
  const [micEnabled, setMicEnabled] = useState(false);
  const [liveFreq, setLiveFreq] = useState(0);
  const [matchProgress, setMatchProgress] = useState(0); // 0 to 100
  
  const rafRef = useRef(null);
  const matchFramesRef = useRef(0);
  const liveFreqRef = useRef(0);
  const lastFreqUpdateRef = useRef(0);

  const activeFret = (() => {
    try {
      const last = vvGet(STORAGE_KEYS.LAST_TOOL_FRET);
      return last ? parseInt(last, 10) : 1;
    } catch { return 1; }
  })();
  const doNodeId = `fret-${activeFret}-class-do`;
  const fretState = traction?.frets?.[activeFret];
  const doAlreadyCompleted = !!fretState?.doCompleted;
  const doGatePassed = !!fretState?.doGatePassed;

  // Somatic DO Gate Voice Prompt
  useEffect(() => {
    cosyvoice.initTTS();
    return () => {
      cosyvoice.cancel();
    };
  }, [cosyvoice]);

  useEffect(() => {
    if (cosyvoice.isReady && activeFret) {
      const prompt = getVoicePrompt(activeFret, 'do', locale);
      if (prompt) {
        cosyvoice.speak(prompt, locale);
      }
    }
  }, [cosyvoice, activeFret, locale]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      closeMicrophone();
    };
  }, []);

  const handleMarkComplete = useCallback(() => {
    completePhase(doNodeId, 'do');
    setDoMarked(true);
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, [completePhase, doNodeId]);

  // Audiation countdown timer
  useEffect(() => {
    if (!audiationActive) return;
    const endTime = Date.now() + 4000;
    let localRafId;
    const tick = () => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setAudiationActive(false);
        setAudiationReady(true);
        setAudiationSeconds(0);
        return;
      }
      setAudiationSeconds(remaining);
      localRafId = requestAnimationFrame(tick);
    };
    localRafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(localRafId);
  }, [audiationActive]);

  const startAudiation = useCallback(() => {
    setAudiationActive(true);
    setAudiationReady(false);
    setAudiationSeconds(4);
  }, []);

  const generateInterval = useCallback(() => {
    setDoMarked(false);
    setAudiationReady(false);
    setAudiationActive(false);
    setAudiationSeconds(4);
    setFeedback('');
    setMatchProgress(0);
    matchFramesRef.current = 0;

    const baseFreq = 220 * Math.pow(2, Math.random());
    const availableIntervals = intervals.slice(0, Math.min(3 + Math.floor(score/2), intervals.length));
    const target = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    const targetFreq = baseFreq * Math.pow(2, target.semitones / 12);

    setCurrentInterval({ baseFreq, targetFreq, name: target.name });
  }, [score]);

  const playSynthesizedInterval = (baseFreq, targetFreq) => {
    const ctx = resumeAudio();
    if (!ctx) return;
    setPlaying(true);

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(baseFreq, now, 1.0);
    playTone(targetFreq, now + 1.0, 1.0);

    setTimeout(() => setPlaying(false), 2000);
  };

  const handlePlay = () => {
    if (!currentInterval) {
      generateInterval();
    } else {
      playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq);
    }
  };

  useEffect(() => {
    if (currentInterval) {
      const timer = setTimeout(() => {
        playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentInterval]);

  // ═══════════════════════════════════════════════════════════
  // MICROPHONE PITCH LOOP
  // ═══════════════════════════════════════════════════════════
  const toggleMicrophone = async () => {
    if (micEnabled) {
      closeMicrophone();
      setMicEnabled(false);
      setLiveFreq(0);
    } else {
      // AudioContext may be suspended due to autoplay policy —
      // resume requires a user gesture (this click event).
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (e) {
          setFeedback("Browser blocked audio. Click again to enable pitch detection.");
          return;
        }
      }

      const analyser = await initMicrophone();
      if (analyser) {
        setMicEnabled(true);
        setFeedback('');
        startPitchDetectionLoop(analyser);
      } else {
        setFeedback("Failed to access microphone.");
      }
    }
  };

  const startPitchDetectionLoop = (analyser) => {
    const ctx = getAudioContext();
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);

    const tick = () => {
      if (!currentInterval || playing) {
        setLiveFreq(0);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      analyser.getFloatTimeDomainData(buffer);
      
      // Calculate RMS volume to filter out room noise
      let rms = 0;
      for (let i = 0; i < buffer.length; i++) {
        rms += buffer[i] * buffer[i];
      }
      rms = Math.sqrt(rms / buffer.length);

      if (rms > 0.01) { // Noise gate
        const pitch = detectPitch(buffer, ctx.sampleRate);
        if (pitch) {
          liveFreqRef.current = pitch;
          checkPitchMatch(pitch, currentInterval.targetFreq);
          // Throttle UI updates to ~10fps to avoid 60fps re-renders
          const now = performance.now();
          if (now - lastFreqUpdateRef.current > 100) {
            setLiveFreq(pitch);
            lastFreqUpdateRef.current = now;
          }
        } else {
          liveFreqRef.current = 0;
          const now = performance.now();
          if (now - lastFreqUpdateRef.current > 100) {
            setLiveFreq(0);
            lastFreqUpdateRef.current = now;
          }
        }
      } else {
        setLiveFreq(0);
        // Decrease progress if silent
        matchFramesRef.current = Math.max(0, matchFramesRef.current - 1);
        setMatchProgress((matchFramesRef.current / 30) * 100);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const checkPitchMatch = (detected, target) => {
    if (feedback.includes('Excellent')) return; // Already passed

    // 25 cents tolerance for vocal matching
    const cents = getCentDifference(detected, target);
    if (cents < 25) {
      matchFramesRef.current += 1;
    } else {
      matchFramesRef.current = Math.max(0, matchFramesRef.current - 2); // Penalize instability
    }

    const progress = Math.min((matchFramesRef.current / 30) * 100, 100);
    setMatchProgress(progress);

    // If held for ~30 frames (0.5 seconds at 60fps), mark as success
    if (progress >= 100) {
      setScore(s => s + 100);
      setFeedback('Excellent! Perfect pitch matched.');
      // Haptic triple pulse + chord celebration
      if (navigator.vibrate) navigator.vibrate([30, 40, 50]);
      // Play a major triad arpeggio as celebration
      const now = getAudioContext()?.currentTime || 0;
      if (now) {
        [1, 1.25, 1.5].forEach((ratio, i) => {
          setTimeout(() => {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = currentInterval.targetFreq * ratio;
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.7);
          }, i * 120);
        });
      }
      passGate(activeFret, 'do');
      setTimeout(() => generateInterval(), 2500);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="rounded-3xl p-16 text-white font-sans text-center max-w-[800px] mx-auto my-8 border border-white/[0.05]" style={{ background: 'linear-gradient(135deg, #160a2b, #2b3a67)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-[3.5rem] mb-4 tracking-[-2px]" style={{ background: '-webkit-linear-gradient(#fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Pitch Room
        </h2>
        {micEnabled && (
          <button
            onClick={toggleMicrophone}
            className="bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] border border-[rgba(90,144,160,0.3)] text-[#5a90a0] rounded-[50px] cursor-pointer m-4 transition-all duration-300 backdrop-blur-[10px] font-extrabold uppercase tracking-[2px] shadow-[0_8px_32px_rgba(90,144,160,0.1)]"
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', borderColor: '#cc5555', color: '#cc5555' }}
          >
            <MicOff size={16} className="inline mb-[-3px]"/> Stop
          </button>
        )}
      </div>

      <p className="text-[1.2rem] mb-12 text-[#a0a0c0]">
        Listen to the interval, then sing or play the second note.
      </p>

      {!audiationReady && !audiationActive && (
        <div className="mb-8">
          <p className="text-[0.9rem] text-[#7aaa88] mb-4 italic">
            Before you listen, hear the silence. Close your eyes. Breathe.
          </p>
          <button className="bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] border border-[rgba(90,144,160,0.3)] text-[#5a90a0] py-5 px-12 text-[1.2rem] rounded-[50px] cursor-pointer m-4 transition-all duration-300 backdrop-blur-[10px] font-extrabold uppercase tracking-[2px] shadow-[0_8px_32px_rgba(90,144,160,0.1)]" style={{ borderColor: 'rgba(122,170,136,0.4)', color: '#7aaa88', fontSize: '1rem' }} onClick={startAudiation}>
            🧘 Begin Silent Space
          </button>
        </div>
      )}

      {audiationActive && (
        <div className="mb-8 p-8 rounded-2xl" style={{ background: 'rgba(122,170,136,0.08)', border: '1px solid rgba(122,170,136,0.2)' }}>
          <p className="text-[2.5rem] text-[#7aaa88] mb-2 font-heading">{audiationSeconds}</p>
          <p className="text-[0.85rem] text-[#7aaa88] tracking-[0.15em] uppercase">Breathe in... breathe out...</p>
        </div>
      )}

      <div className="mb-12">
        <button
          className="bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] border border-[rgba(90,144,160,0.3)] text-[#5a90a0] py-5 px-12 text-[1.2rem] rounded-[50px] cursor-pointer m-4 transition-all duration-300 backdrop-blur-[10px] font-extrabold uppercase tracking-[2px] shadow-[0_8px_32px_rgba(90,144,160,0.1)]"
          style={{ transform: playing ? 'scale(0.95)' : 'scale(1)', borderColor: playing ? 'var(--cf-gold)' : 'rgba(90, 144, 160, 0.3)', color: playing ? 'var(--cf-gold)' : '#5a90a0' }}
          onClick={async () => {
            if (!micEnabled) await toggleMicrophone();
            handlePlay();
          }}
          disabled={playing}
        >
          {playing ? '🔊 Synthesizing...' : (!currentInterval ? '🎤 Start Challenge' : '▶️ Replay Interval')}
        </button>
      </div>

      <div className="p-8 rounded-2xl" style={{ 
        opacity: (!currentInterval || playing) ? 0.3 : 1, 
        transition: 'all 0.3s ease',
        transform: (!currentInterval || playing) ? 'translateY(10px)' : 'translateY(0)',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <h3 className="mb-6 text-[#5a90a0] font-normal tracking-[1px]">
          {micEnabled ? 'Match the Target Pitch!' : 'Press Start Challenge to begin'}
        </h3>
        
        {/* ── Pitch Deviation Meter (competitor-grade visual) ── */}
        {currentInterval && (
          <div className="mb-6">
            <div className="flex justify-between text-[0.65rem] text-white/40 font-mono mb-1.5">
              <span>Flat (-50¢)</span>
              <span className="text-[#2ee571]">Perfect Pitch</span>
              <span>Sharp (+50¢)</span>
            </div>
            <div className="relative h-1.5 bg-white/[0.08] rounded-[3px] overflow-visible">
              {/* Safe zone */}
              <div className="absolute top-[-2px] bottom-[-2px] rounded" style={{ left: '35%', right: '35%', background: 'rgba(46,229,113,0.08)', border: '1px solid rgba(46,229,113,0.15)' }} />
              {/* Needle */}
              {liveFreq > 0 && (
                <div className="absolute top-[-5px] bottom-[-5px] w-[3px] rounded-[2px]" style={{
                  background: matchProgress >= 100 ? '#2ee571' : 'var(--cf-gold)',
                  boxShadow: `0 0 10px ${matchProgress >= 100 ? 'rgba(46,229,113,0.5)' : 'rgba(var(--cf-gold-rgb),0.4)'}`,
                  left: `${Math.max(5, Math.min(95, 50 + (liveFreq - currentInterval.targetFreq) / currentInterval.targetFreq * 600))}%`,
                  transition: 'left 0.15s ease-out, background 0.2s',
                }} />
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[0.8rem] text-white/40 m-0">LIVE FREQ</p>
            <p className="text-[2rem] m-0 font-mono" style={{ color: liveFreq > 0 ? '#fff' : 'rgba(255,255,255,0.2)' }}>
              {liveFreq > 0 ? `${liveFreq.toFixed(1)} Hz` : '--- Hz'}
            </p>
          </div>
          <div>
            <p className="text-[0.8rem] text-cf-gold m-0">TARGET FREQ</p>
            <p className="text-[2rem] m-0 text-cf-gold font-mono">
              {currentInterval ? `${currentInterval.targetFreq.toFixed(1)} Hz` : '--- Hz'}
            </p>
          </div>
        </div>

        {/* Progress Bar for sustained pitch matching */}
        <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
          <div className="h-full transition-[width,background] duration-100" style={{ 
            width: `${matchProgress}%`, 
            background: matchProgress >= 100 ? '#2ee571' : 'var(--cf-gold)'
          }} />
        </div>
      </div>

      <div className="mt-8 h-10 flex items-center justify-center">
        <p className="text-[1.3rem] font-bold" style={{
          color: feedback.includes('Excellent') ? '#2ee571' : '#ff4e50',
          background: feedback.includes('Excellent') ? 'rgba(46,229,113,0.12)' : feedback ? 'rgba(0,0,0,0.3)' : 'transparent',
          padding: '0.5rem 2rem',
          borderRadius: '20px',
          border: feedback.includes('Excellent') ? '1px solid rgba(46,229,113,0.3)' : '1px solid transparent',
          transform: feedback.includes('Excellent') ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease',
          boxShadow: feedback.includes('Excellent') ? '0 0 24px rgba(46,229,113,0.15)' : 'none',
        }}>
          {feedback.includes('Excellent') ? '✨ ' + feedback : feedback}
        </p>
      </div>

      <div className="mt-8 border-t border-white/[0.05] pt-8">
        <p className="text-[1.5rem] text-[#a0a0c0]">Score: <strong className="text-cf-gold text-[2rem]">{score}</strong></p>
      </div>

      {feedback.includes('Excellent') && (
        <div className="mt-6">
          <button
            onClick={handleMarkComplete}
            disabled={doAlreadyCompleted || doMarked || !doGatePassed}
            className="py-3 px-7 rounded-lg font-mono text-[0.85rem] uppercase transition-all duration-200"
            style={{
              background: (doAlreadyCompleted || doMarked) ? 'rgba(52,211,153,0.15)' : doGatePassed ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${(doAlreadyCompleted || doMarked) ? 'rgba(52,211,153,0.4)' : doGatePassed ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: (doAlreadyCompleted || doMarked) ? '#34d399' : doGatePassed ? '#a78bfa' : 'rgba(255,255,255,0.2)',
              cursor: (doAlreadyCompleted || doMarked || !doGatePassed) ? 'default' : 'pointer',
            }}
          >
            {(doAlreadyCompleted || doMarked) ? '✓ DO Phase Complete' : doGatePassed ? 'Mark DO Phase Complete' : '🔒 Gate Locked'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PitchRoom;
