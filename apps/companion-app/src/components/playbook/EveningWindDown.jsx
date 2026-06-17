import React, { useState, useEffect } from 'react';
import { useBertrandVoice } from '../../hooks/useBertrandVoice';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : EveningWindDown.jsx                                  ║
// ║ WHAT    : A 3-minute somatic wind-down routine for bedtime.    ║
// ║ WHY     : Integrates practice into sleep, tuning the self.     ║
// ╚════════════════════════════════════════════════════════════════╝

export default function EveningWindDown({ onComplete }) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute per step
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { initTTS, speak, isLoading, loadProgress } = useBertrandVoice();

  // 3-minute Kriya-inspired (but Bertrand-branded) routine
  const steps = [
    {
      title: 'Breathe',
      instruction: 'Inhale for 4 seconds. Hold for 4. Exhale for 4. Hold for 4. Let the tension in your body dissolve with every exhale.',
      icon: '🫁',
      duration: 60
    },
    {
      title: 'Replay',
      instruction: 'Recall your best musical moment from today. Hear it in your Inner Ear. Feel the resonance in your body.',
      icon: '🎵',
      duration: 60
    },
    {
      title: 'Intention',
      instruction: 'Set your intention for tomorrow. What somatic gate will you open next? Drift to sleep holding this frequency.',
      icon: '✨',
      duration: 60
    }
  ];

  const speakCurrentStep = async (stepIndex) => {
    if (isMuted) return;
    const text = steps[stepIndex]?.instruction;
    if (text) {
      await initTTS();
      await speak(text, 'en');
    }
  };

  useEffect(() => {
    if (!hasStarted || step >= steps.length) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (step < steps.length - 1) {
            const nextStep = step + 1;
            setStep(nextStep);
            speakCurrentStep(nextStep);
            return steps[nextStep].duration;
          } else {
            clearInterval(timer);
            if (onComplete) onComplete();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, onComplete, hasStarted, isMuted, speak, initTTS]);

  const handleStart = async () => {
    setHasStarted(true);
    speakCurrentStep(0);
  };

  const currentStep = steps[step];

  if (!hasStarted) {
    return (
      <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 text-[#f0e6d2] text-center mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-heading text-[1.4rem] m-0 font-semibold">Evening Wind-Down</h3>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-[30px] border border-white/[0.05] mb-4">
          <div className="text-[3rem] mb-4">🌙</div>
          <h4 className="font-heading text-[1.5rem] m-0 mb-3 text-white">Prepare for Sleep</h4>
          <p className="text-[0.95rem] leading-[1.6] text-white/70 m-0">
            Take 3 minutes to tune your self before rest. <br/>
            <strong>Ensure your volume is up</strong> to hear Bertrand's guidance.
          </p>
          {isLoading && <p className="text-[0.8rem] text-[#a78bfa] mt-2.5">Initializing Voice... {loadProgress}%</p>}
        </div>
        <button
          className="bg-[#a78bfa] text-[#1a1a24] font-bold py-3 px-6 rounded-lg cursor-pointer disabled:opacity-50"
          onClick={handleStart}
          disabled={isLoading}
        >
          {isLoading ? 'Loading Voice...' : 'Begin Wind-Down'}
        </button>
      </div>
    );
  }

  if (step >= steps.length) {
    return (
      <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 text-[#f0e6d2] text-center mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="text-[3.5rem] mb-4">🌙</div>
        <h3 className="font-heading text-[1.4rem] m-0 font-semibold">Wind-Down Complete</h3>
        <p className="text-white/60">Your self is tuned. Sleep well.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 text-[#f0e6d2] text-center mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-heading text-[1.4rem] m-0 font-semibold">Evening Wind-Down</h3>
        <div className="flex gap-3 items-center">
          <button
            className="bg-transparent border-none cursor-pointer text-[1.2rem]"
            style={{ opacity: isMuted ? 0.5 : 1 }}
            onClick={() => setIsMuted(!isMuted)}
            title="Toggle Voice"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <span className="font-mono text-base text-[#a78bfa] bg-[#a78bfa]/15 py-1 px-2.5 rounded-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ease ${i === step ? 'bg-[#a78bfa] scale-[1.2]' : ''} ${i < step ? 'bg-[#34d399]' : 'bg-white/20'}`} />
        ))}
      </div>

      <div className="bg-white/[0.03] rounded-xl p-[30px] border border-white/[0.05] mb-4">
        <div className="text-[3rem] mb-4">{currentStep.icon}</div>
        <h4 className="font-heading text-[1.5rem] m-0 mb-3 text-white">{currentStep.title}</h4>
        <p className="text-[0.95rem] leading-[1.6] text-white/70 m-0">{currentStep.instruction}</p>
      </div>

      <button
        className="bg-transparent border-none text-white/40 font-mono text-[0.75rem] cursor-pointer py-2 px-4 hover:text-white/60 transition-colors"
        onClick={() => {
          if (step < steps.length - 1) {
            const nextStep = step + 1;
            setStep(nextStep);
            setTimeLeft(steps[nextStep].duration);
            speakCurrentStep(nextStep);
          } else {
            setStep(s => s + 1);
            if (onComplete) onComplete();
          }
        }}
      >
        Skip to next
      </button>
    </div>
  );
}
