import React, { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { useCosyVoice } from '../hooks/useCosyVoice';
import { getVoicePrompt } from '../data/voicePrompts';
import { recordBreathingSession } from '../data/tractionStore';

const PHASES = [
  { name: 'Inhale', duration: 4000, instruction: 'Breathe in through your nose', scale: 1.4 },
  { name: 'Hold', duration: 4000, instruction: 'Hold gently', scale: 1.4 },
  { name: 'Exhale', duration: 6000, instruction: 'Slowly release through your mouth', scale: 0.8 }
];

const BODY_SCAN_ITEMS = [
  { id: 'forehead', label: 'Forehead — release the furrow', icon: '🧠' },
  { id: 'jaw', label: 'Jaw — unclench completely', icon: '😌' },
  { id: 'shoulders', label: 'Shoulders — drop them away from your ears', icon: '🫁' },
  { id: 'hands', label: 'Hands — open and soften your grip', icon: '🤲' },
  { id: 'breath', label: 'Breath — deep, slow, and steady', icon: '🌬️' }
];

const GATE_DURATION = 60; // seconds before chapter unlocks

const BreathingGate = ({ fretTitle, onComplete }) => {
  const { currentNodeId, traction, updateTraction } = useScaffolding();
  const { locale } = useLocale();
  const cosyvoice = useCosyVoice();
  
  const [phase, setPhase] = useState('intro'); // intro | breathing | bodyscan | complete
  const [breathPhaseIdx, setBreathPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);
  
  // Somatic BE Gate Voice Prompt (Fret 1)
  useEffect(() => {
    cosyvoice.initTTS();
    return () => {
      cosyvoice.cancel();
    };
  }, [cosyvoice]);

  // Voice integration for 'BE' gate
  useEffect(() => {
    if (phase === 'intro' && cosyvoice.isReady) {
      const match = currentNodeId?.match(/fret-(\d+)/);
      const fretNum = match ? parseInt(match[1], 10) : 1;
      const prompt = getVoicePrompt(fretNum, 'be', locale);
      if (prompt) cosyvoice.speak(prompt, locale);
    }
  }, [phase, currentNodeId, cosyvoice, locale]);

  // Elapsed timer
  useEffect(() => {
    if (phase === 'breathing' || phase === 'bodyscan') {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Breathing cycle
  const advanceBreath = useCallback(() => {
    setBreathPhaseIdx(prev => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase !== 'breathing') return;
    const currentPhaseDuration = PHASES[breathPhaseIdx].duration;
    breathTimerRef.current = setTimeout(advanceBreath, currentPhaseDuration);
    return () => clearTimeout(breathTimerRef.current);
  }, [phase, breathPhaseIdx, advanceBreath]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allChecked = checkedItems.size === BODY_SCAN_ITEMS.length;
  const gateReady = elapsed >= GATE_DURATION && allChecked;
  const currentBreathPhase = PHASES[breathPhaseIdx];

  const handleEnterFret = () => {
    // Parse fret number from node id (e.g. "fret-1-class-be" → 1)
    const match = currentNodeId?.match(/fret-(\d+)/);
    const fretId = match ? parseInt(match[1], 10) : 1;

    // Record progress in traction store
    if (traction && updateTraction) {
      const newState = recordBreathingSession(traction, fretId);
      updateTraction(() => newState);
    }

    setPhase('complete');
    if (onComplete) onComplete();
  };

  if (phase === 'complete') return null;

  return (
    <div className="breathing-gate">
      <style>{`
        .breathing-gate {
          position: relative;
          background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a14 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #e0e0ff; font-family: 'Inter', sans-serif;
          padding: 2rem; overflow-y: auto;
          min-height: 100%;
        }
        .breath-circle-outer {
          width: 240px; height: 240px; border-radius: 50%;
          border: 2px solid rgba(122, 170, 136, 0.2);
          display: flex; align-items: center; justify-content: center;
          position: relative; margin: 2rem 0;
        }
        .breath-circle-inner {
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, rgba(122, 170, 136, 0.4) 0%, rgba(122, 170, 136, 0.05) 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: #7aaa88; font-weight: 600;
        }
        .breath-glow {
          position: absolute; inset: -20px; border-radius: 50%;
          background: radial-gradient(circle, rgba(122, 170, 136, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .scan-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.5rem; border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer; transition: all 0.3s ease;
          margin-bottom: 0.75rem; max-width: 480px; width: 100%;
        }
        .scan-item:hover { background: rgba(122, 170, 136, 0.08); }
        .scan-item.checked {
          border-color: rgba(122, 170, 136, 0.3);
          background: rgba(122, 170, 136, 0.06);
        }
        .scan-check {
          width: 24px; height: 24px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease; flex-shrink: 0;
        }
        .scan-check.done {
          border-color: #7aaa88; background: #7aaa88;
        }
        .gate-btn {
          background: rgba(122, 170, 136, 0.15);
          border: 1px solid rgba(122, 170, 136, 0.4);
          color: #7aaa88; padding: 1rem 3rem; border-radius: 4px;
          font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s ease;
          font-family: 'JetBrains Mono', monospace; margin-top: 2rem;
        }
        .gate-btn:hover { background: rgba(122, 170, 136, 0.25); transform: translateY(-2px); }
        .gate-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
        .gate-timer {
          font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;
          color: #5a6a80; letter-spacing: 0.1em; margin-top: 1rem;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center max-w-[560px]">
            <p className="font-mono text-[0.85rem] tracking-[0.2em] text-cf-gold-dim uppercase mb-8">
              SOMATIC PREREQUISITE
            </p>
            <h2 className="font-heading text-[2.5rem] text-[#e8edf2] mb-4 font-normal">
              Before You Enter
            </h2>
            <p className="text-[1.1rem] leading-[1.8] text-[#8090a8] mb-4">
              <em>"{fretTitle || 'The Root Note'}"</em> awaits. But the music cannot begin until the body is ready.
            </p>
            <p className="text-base leading-[1.8] text-[#5a6a80] mb-8">
              Take a moment to breathe and center yourself before we begin.
            </p>
            <button className="gate-btn" onClick={() => setPhase('breathing')}>
              Begin the Breath Override
            </button>

            <button
              onClick={() => {
                setPhase('complete');
                if (onComplete) onComplete();
              }}
              className="bg-transparent border-none cursor-pointer mt-6 font-body transition-colors duration-300 hover:text-[#a090b0] group"
            >
              <span className="text-[#5a6a80] text-[0.75rem] underline group-hover:text-[#a090b0]">
                too busy
              </span>
              <span className="text-[#4a5a70] text-[0.55rem] ml-1 italic">
                (for self care)
              </span>
              <span className="text-[#5a6a80] text-[0.75rem]"> →</span>
            </button>
          </motion.div>
        )}

        {/* ── BREATHING ── */}
        {phase === 'breathing' && (
          <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center">
            <p className="font-mono text-[0.85rem] tracking-[0.2em] text-cf-gold-dim uppercase mb-4">
              BREATH OVERRIDE · CYCLE {cycles + 1}
            </p>

            <div className="breath-circle-outer">
              <div className="breath-glow" />
              <motion.div className="breath-circle-inner"
                animate={{ scale: currentBreathPhase.scale }}
                transition={{ duration: currentBreathPhase.duration / 1000, ease: 'easeInOut' }}>
                {currentBreathPhase.name}
              </motion.div>
            </div>

            <p className="text-[#7aaa88] text-[1.1rem] italic mb-2">
              {currentBreathPhase.instruction}
            </p>

            <div className="gate-timer">
              {elapsed}s elapsed · {Math.max(0, GATE_DURATION - elapsed)}s remaining
            </div>

            {cycles >= 2 && (
              <button className="gate-btn mt-8" onClick={() => setPhase('bodyscan')}>
                Proceed to Body Scan
              </button>
            )}

            <button
              onClick={() => {
                setPhase('complete');
                if (onComplete) onComplete();
              }}
              className="bg-transparent border-none cursor-pointer mt-6 font-body transition-colors duration-300 hover:text-[#a090b0] group"
            >
              <span className="text-[#5a6a80] text-[0.75rem] underline group-hover:text-[#a090b0]">
                too busy
              </span>
              <span className="text-[#4a5a70] text-[0.55rem] ml-1 italic">
                (for self care)
              </span>
              <span className="text-[#5a6a80] text-[0.75rem]"> →</span>
            </button>
          </motion.div>
        )}

        {/* ── BODY SCAN ── */}
        {phase === 'bodyscan' && (
          <motion.div key="bodyscan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center flex flex-col items-center">
            <p className="font-mono text-[0.85rem] tracking-[0.2em] text-cf-gold-dim uppercase mb-4">
              BODY SCAN · PRE-FLIGHT CHECK
            </p>
            <h3 className="font-heading text-[1.8rem] text-[#e8edf2] mb-8 font-normal">
              Scan from crown to fingertips
            </h3>

            {BODY_SCAN_ITEMS.map(item => (
              <div key={item.id} className={`scan-item ${checkedItems.has(item.id) ? 'checked' : ''}`}
                onClick={() => toggleCheck(item.id)}>
                <div className={`scan-check ${checkedItems.has(item.id) ? 'done' : ''}`}>
                  {checkedItems.has(item.id) && <span className="text-black text-sm font-bold">✓</span>}
                </div>
                <span className="text-[1.2rem] shrink-0">{item.icon}</span>
                <span className="text-[0.95rem] text-left" style={{ color: checkedItems.has(item.id) ? '#7aaa88' : '#b0b0c0' }}>
                  {item.label}
                </span>
              </div>
            ))}

            <div className="gate-timer">
              {elapsed}s · {allChecked ? '✓ Body scan complete' : `${BODY_SCAN_ITEMS.length - checkedItems.size} remaining`}
            </div>

            <button className="gate-btn" disabled={!gateReady} onClick={handleEnterFret}>
              {gateReady ? 'Enter the Fret' : `Hold space... ${Math.max(0, GATE_DURATION - elapsed)}s`}
            </button>

            <button
              onClick={() => {
                setPhase('complete');
                if (onComplete) onComplete();
              }}
              className="bg-transparent border-none cursor-pointer mt-4 font-body transition-colors duration-300 hover:text-[#a090b0] group"
            >
              <span className="text-[#5a6a80] text-[0.75rem] underline group-hover:text-[#a090b0]">
                too busy
              </span>
              <span className="text-[#4a5a70] text-[0.55rem] ml-1 italic">
                (for self care)
              </span>
              <span className="text-[#5a6a80] text-[0.75rem]"> →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingGate;
