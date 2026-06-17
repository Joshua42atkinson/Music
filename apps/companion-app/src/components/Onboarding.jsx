// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : Onboarding.jsx                                      ║
// ║ WHAT    : Optional guided orientation for new students        ║
// ║ WHY     : Consent-based entry. The student CHOOSES every step.║
// ║           Nothing is forced. Nothing is assumed.              ║
// ║ WHO     : Optional at /onboarding. Skippable anytime.         ║
// ║ OWNS    : Welcome, consent-gated breathing, commitment tier,  ║
// ║           journey start date, orientation recommendations       ║
// ║ NEEDS   : ScaffoldingProvider (updateTraction), gameProgression║
// ║ RULES   : CONSENT FIRST. Every exercise is opt-in.            ║
// ║           The home screen is NEVER gated.                     ║
// ║           Breathing requires explicit consent.                ║
// ║           Commitment tier can be changed later.                ║
// ║           Sets journeyStartDate which drives graduation ETA   ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { COMMITMENT_TIERS } from '../data/gameProgression';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateTraction } = useScaffolding();
  const { t, locale: lang } = useLocale();
  const [step, setStep] = useState(0); // 0=welcome, 1=consent, 2=breath, 3=tier, 4=ready
  const [selectedTier, setSelectedTier] = useState(null);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const [, setBreathConsent] = useState(false);
  const breathRef = useRef(null);

  // ── Complete onboarding and go home ──
  const handleComplete = (tierId) => {
    updateTraction(prev => ({
      ...prev,
      onboardingComplete: true,
      commitmentTier: tierId,
      journeyStartDate: new Date().toISOString(),
      breathingSessions: (prev.breathingSessions || 0) + 1,
    }));
    navigate('/');
  };

  // ── Skip onboarding anytime ──
  const handleSkip = () => {
    updateTraction(prev => ({
      ...prev,
      onboardingComplete: true, // Mark as seen so we don't nag
    }));
    navigate('/');
  };

  // ── Breathing animation (step 1) ──
  useEffect(() => {
    if (step !== 1) return;
    let frame;
    let startTime = Date.now();
    const cycleDuration = 6000; // 6 seconds per breath cycle

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % cycleDuration) / cycleDuration;

      if (progress < 0.4) {
        // Inhale (0-40%)
        setBreathPhase('inhale');
        setBreathScale(1 + (progress / 0.4) * 0.3);
      } else if (progress < 0.5) {
        // Hold (40-50%)
        setBreathPhase('hold');
        setBreathScale(1.3);
      } else if (progress < 0.9) {
        // Exhale (50-90%)
        setBreathPhase('exhale');
        setBreathScale(1.3 - ((progress - 0.5) / 0.4) * 0.3);
      } else {
        // Rest (90-100%)
        setBreathPhase('rest');
        setBreathScale(1);
      }

      // Count completed cycles
      const cycles = Math.floor(elapsed / cycleDuration);
      setBreathCount(cycles);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  // ── Step 0: Welcome ──
  if (step === 0) {
    return (
      <div className="min-h-svh bg-cf-void flex items-center justify-center px-4 py-6 text-vv-text relative">
        <button onClick={handleSkip} className="absolute top-5 right-5 flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg py-2 px-3.5 text-white/40 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 transition-all z-10" aria-label={t('skipOnboarding')}>
          <X size={20} /> {t('skip')}
        </button>
        <div className="max-w-[440px] w-full flex flex-col items-center gap-5 text-center">
          <div className="text-[2.5rem] mb-2">♾️</div>
          <h1 className="font-heading text-[clamp(1.6rem,5vw,2.2rem)] font-semibold text-vv-text m-0 leading-[1.2]">{t('welcomeToVoixVive')}</h1>
          <p className="font-quote text-[clamp(1rem,3vw,1.2rem)] text-white/55 italic m-0 leading-[1.5]">
            {t('onboardingSubtitle')}
          </p>
          <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-white/50 m-0 leading-[1.6] max-w-[360px]">
            {t('onboardingBody')}
          </p>
          <button onClick={() => setStep(1)} className="mt-3 py-3.5 px-8 rounded-xl bg-cf-gold/12 border border-cf-gold/35 text-cf-gold font-heading text-[1.1rem] font-semibold cursor-pointer transition-all tracking-[0.03em] hover:bg-cf-gold/20">
            {t('continue')}
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: Consent for centering exercise ──
  if (step === 1) {
    return (
      <div className="min-h-svh bg-cf-void flex items-center justify-center px-4 py-6 text-vv-text relative">
        <button onClick={handleSkip} className="absolute top-5 right-5 flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg py-2 px-3.5 text-white/40 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 transition-all z-10" aria-label={t('skipOnboarding')}>
          <X size={20} /> {t('skip')}
        </button>
        <div className="max-w-[440px] w-full flex flex-col items-center gap-5 text-center">
          <div className="text-[2.5rem] mb-2">🌬️</div>
          <h2 className="font-heading text-[clamp(1.2rem,4vw,1.6rem)] font-semibold text-vv-text m-0">{t('centeringExercise')}</h2>
          <p className="text-[0.9rem] text-white/40 m-0">
            {t('tensionEnemy')}
          </p>
          <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-white/50 m-0 leading-[1.6] max-w-[360px]">
            {t('breathingIntro')}
          </p>
          <div className="flex gap-3 w-full max-w-[360px]">
            <button
              onClick={() => { setBreathConsent(true); setStep(2); }}
              className="mt-3 flex-1 py-3.5 px-8 rounded-xl bg-cf-gold/12 border border-cf-gold/35 text-cf-gold font-heading text-[1.1rem] font-semibold cursor-pointer transition-all tracking-[0.03em] hover:bg-cf-gold/20"
            >
              {t('yesCenterMe')}
            </button>
            <button
              onClick={() => { setBreathConsent(false); setStep(3); }}
              className="mt-3 py-3.5 px-7 rounded-xl border border-white/15 bg-white/[0.04] text-white/50 font-mono text-[0.85rem] tracking-[0.08em] cursor-pointer transition-all min-h-12 hover:bg-white/10"
            >
              {t('skipToSettings')}
            </button>
          </div>
          <p className="text-[0.75rem] text-white/50 m-0 leading-[1.6] max-w-[360px] mt-2">
            {t('breathingToolsPortal')}
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: First Breath (consent required) ──
  if (step === 2) {
    const phaseText = {
      inhale: t('breatheIn'),
      hold: t('hold'),
      exhale: t('breatheOut'),
      rest: '…',
    };
    const canAdvance = breathCount >= 3;

    return (
      <div className="min-h-svh bg-cf-void flex items-center justify-center px-4 py-6 text-vv-text relative">
        <button onClick={handleSkip} className="absolute top-5 right-5 flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg py-2 px-3.5 text-white/40 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 transition-all z-10" aria-label={t('skipOnboarding')}>
          <X size={20} /> {t('skip')}
        </button>
        <div className="max-w-[440px] w-full flex flex-col items-center gap-5 text-center">
          <p className="font-quote text-[clamp(1.1rem,3vw,1.4rem)] text-white/50 m-0 min-h-8 italic">{phaseText[breathPhase]}</p>
          <div
            ref={breathRef}
            className="w-[120px] h-[120px] rounded-full border-2 my-5 transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${breathScale})`,
              borderColor: breathPhase === 'inhale' ? 'rgba(96,165,250,0.5)' :
                           breathPhase === 'exhale' ? 'rgba(52,211,153,0.5)' :
                           'rgba(var(--cf-gold-rgb),0.3)',
            }}
          />
          <p className="font-mono text-[0.75rem] text-white/35 m-0">
            {canAdvance
              ? t('breathsComplete')
              : t('breathCounter', { current: Math.min(breathCount + 1, 3), total: 3 })
            }
          </p>
          {canAdvance && (
            <button onClick={() => setStep(3)} className="mt-3 py-3.5 px-8 rounded-xl bg-cf-gold/12 border border-cf-gold/35 text-cf-gold font-heading text-[1.1rem] font-semibold cursor-pointer transition-all tracking-[0.03em] hover:bg-cf-gold/20">
              {t('continue')}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step 3: Commitment Tier ──
  if (step === 3) {
    return (
      <div className="min-h-svh bg-cf-void flex items-center justify-center px-4 py-6 text-vv-text relative">
        <button onClick={handleSkip} className="absolute top-5 right-5 flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg py-2 px-3.5 text-white/40 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 transition-all z-10" aria-label={t('skipOnboarding')}>
          <X size={20} /> {t('skip')}
        </button>
        <div className="max-w-[520px] w-full flex flex-col items-center gap-5 text-center">
          <h2 className="font-heading text-[clamp(1.2rem,4vw,1.6rem)] font-semibold text-vv-text m-0">{t('choosePath')}</h2>
          <p className="text-[0.9rem] text-white/40 m-0">
            {t('choosePathSubtitle')}
          </p>
          <div className="flex flex-col gap-3 w-full mt-2">
            {Object.values(COMMITMENT_TIERS).map(tier => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className="w-full py-4.5 px-5 rounded-xl border cursor-pointer text-left flex flex-col gap-1 transition-all duration-250"
                style={{
                  borderColor: selectedTier === tier.id ? tier.color : 'rgba(255,255,255,0.08)',
                  background: selectedTier === tier.id
                    ? `${tier.color}10`
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                <span className="text-[1.5rem]">{tier.icon}</span>
                <h3 className="font-heading text-[1.1rem] font-semibold m-0" style={{ color: selectedTier === tier.id ? tier.color : '#f0e6d2' }}>
                  {tier.name[lang]}
                </h3>
                <p className="font-mono text-[0.7rem] text-white/40 m-0">{tier.subtitle[lang]}</p>
                <p className="font-mono text-[0.65rem] text-amber-400 m-0 mt-1">
                  {t('weeksToGraduation', { weeks: tier.totalWeeks })}
                </p>
                <p className="text-[0.8rem] text-white/35 m-0 mt-1 leading-[1.4]">{tier.description[lang]}</p>
              </button>
            ))}
          </div>
          {selectedTier && (
            <button onClick={() => setStep(4)} className="mt-3 py-3.5 px-8 rounded-xl bg-cf-gold/12 border border-cf-gold/35 text-cf-gold font-heading text-[1.1rem] font-semibold cursor-pointer transition-all tracking-[0.03em] hover:bg-cf-gold/20">
              {t('chooseTier', { name: COMMITMENT_TIERS[selectedTier].name[lang] })}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step 4: Ready ──
  if (step === 4) {
    const tier = COMMITMENT_TIERS[selectedTier];
    const graduationDate = new Date();
    graduationDate.setDate(graduationDate.getDate() + tier.totalWeeks * 7);
    const gradFormatted = graduationDate.toLocaleDateString(undefined, {
      month: 'long', year: 'numeric',
    });

    return (
      <div className="min-h-svh bg-cf-void flex items-center justify-center px-4 py-6 text-vv-text relative">
        <button onClick={handleSkip} className="absolute top-5 right-5 flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg py-2 px-3.5 text-white/40 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 transition-all z-10" aria-label={t('skipOnboarding')}>
          <X size={20} /> {t('skip')}
        </button>
        <div className="max-w-[440px] w-full flex flex-col items-center gap-5 text-center">
          <div className="text-[2.5rem] mb-2">🎸</div>
          <h2 className="font-heading text-[clamp(1.2rem,4vw,1.6rem)] font-semibold text-vv-text m-0">{t('journeyBegins')}</h2>
          <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-white/50 m-0 leading-[1.6] max-w-[360px]">
            {t('threeOriginalSongsGoal')}
          </p>
          <div className="flex flex-col gap-3 w-full text-left my-2">
            <div className="flex items-start gap-3.5 py-3.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="font-heading text-[1.4rem] font-bold text-cf-gold min-w-7 text-center leading-none pt-0.5">1</span>
              <div>
                <p className="font-heading text-[1rem] font-semibold text-vv-text m-0">{t('goalRoot')}</p>
                <p className="text-[0.8rem] text-white/40 m-0 mt-0.5 leading-[1.4]">{t('goalRootSub')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 py-3.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="font-heading text-[1.4rem] font-bold text-cf-gold min-w-7 text-center leading-none pt-0.5">2</span>
              <div>
                <p className="font-heading text-[1rem] font-semibold text-vv-text m-0">{t('goalBridge')}</p>
                <p className="text-[0.8rem] text-white/40 m-0 mt-0.5 leading-[1.4]">{t('goalBridgeSub')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 py-3.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="font-heading text-[1.4rem] font-bold text-cf-gold min-w-7 text-center leading-none pt-0.5">3</span>
              <div>
                <p className="font-heading text-[1rem] font-semibold text-vv-text m-0">{t('goalReturn')}</p>
                <p className="text-[0.8rem] text-white/40 m-0 mt-0.5 leading-[1.4]">{t('goalReturnSub')}</p>
              </div>
            </div>
          </div>
          <p className="text-[0.85rem] text-white/45 m-0">
            {t('graduationETA', { tier: tier.name[lang], date: gradFormatted })}
          </p>
          <button
            onClick={() => handleComplete(selectedTier)}
            className="mt-3 py-3.5 px-8 rounded-xl bg-cf-gold/12 border border-cf-gold/35 text-cf-gold font-heading text-[1.1rem] font-semibold cursor-pointer transition-all tracking-[0.03em] hover:bg-cf-gold/20"
          >
            {t('letsBegin')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

