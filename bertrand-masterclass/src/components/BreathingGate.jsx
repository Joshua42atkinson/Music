import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const BreathingGate = ({ fretTitle, onComplete, isCleared = false }) => {
  const [phase, setPhase] = useState('intro'); // intro | breathing | bodyscan | complete
  const [breathPhaseIdx, setBreathPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // If already cleared, skip the gate
  useEffect(() => {
    if (isCleared) setPhase('complete');
  }, [isCleared]);

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
    setPhase('complete');
    if (onComplete) onComplete();
  };

  if (phase === 'complete') return null;

  return (
    <div className="breathing-gate">
      <style>{`
        .breathing-gate {
          position: fixed; inset: 0; z-index: 1000;
          background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a14 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #e0e0ff; font-family: 'Inter', sans-serif;
          padding: 2rem; overflow-y: auto;
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
          font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
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
          font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
          color: #5a6a80; letter-spacing: 0.1em; margin-top: 1rem;
        }
        .gate-skip {
          background: none; border: none; color: #5a6a80;
          font-size: 0.75rem; cursor: pointer; margin-top: 1.5rem;
          text-decoration: underline; font-family: 'Inter', sans-serif;
        }
        .gate-skip:hover { color: #8090a8; }
      `}</style>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', maxWidth: 560 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8b7d5a', textTransform: 'uppercase', marginBottom: '2rem' }}>
              SOMATIC PREREQUISITE
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#e8edf2', marginBottom: '1rem', fontWeight: 400 }}>
              Before You Enter
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#8090a8', marginBottom: '1rem' }}>
              <em>"{fretTitle || 'The Root Note'}"</em> awaits. But the music cannot begin until the body is ready.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#5a6a80', marginBottom: '2rem' }}>
              You are an instrument playing an instrument. Let us first tune the biological one.
            </p>
            <button className="gate-btn" onClick={() => setPhase('breathing')}>
              Begin the Breath Override
            </button>
          </motion.div>
        )}

        {/* ── BREATHING ── */}
        {phase === 'breathing' && (
          <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8b7d5a', textTransform: 'uppercase', marginBottom: '1rem' }}>
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

            <p style={{ color: '#7aaa88', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
              {currentBreathPhase.instruction}
            </p>

            <div className="gate-timer">
              {elapsed}s elapsed · {Math.max(0, GATE_DURATION - elapsed)}s remaining
            </div>

            {cycles >= 2 && (
              <button className="gate-btn" onClick={() => setPhase('bodyscan')} style={{ marginTop: '2rem' }}>
                Proceed to Body Scan
              </button>
            )}
          </motion.div>
        )}

        {/* ── BODY SCAN ── */}
        {phase === 'bodyscan' && (
          <motion.div key="bodyscan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8b7d5a', textTransform: 'uppercase', marginBottom: '1rem' }}>
              BODY SCAN · PRE-FLIGHT CHECK
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#e8edf2', marginBottom: '2rem', fontWeight: 400 }}>
              Scan from crown to fingertips
            </h3>

            {BODY_SCAN_ITEMS.map(item => (
              <div key={item.id} className={`scan-item ${checkedItems.has(item.id) ? 'checked' : ''}`}
                onClick={() => toggleCheck(item.id)}>
                <div className={`scan-check ${checkedItems.has(item.id) ? 'done' : ''}`}>
                  {checkedItems.has(item.id) && <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: checkedItems.has(item.id) ? '#7aaa88' : '#b0b0c0', fontSize: '0.95rem', textAlign: 'left' }}>
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

            <button className="gate-skip" onClick={handleEnterFret}>
              Skip for now →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingGate;
