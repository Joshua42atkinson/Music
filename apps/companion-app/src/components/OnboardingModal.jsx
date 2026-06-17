// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : OnboardingModal.jsx                                  ║
// ║ WHAT    : 3-step first-run welcome flow — shows once, stores   ║
// ║           flag in localStorage ('voixvive_onboarded')          ║
// ║ WHY     : New users need a PEARL moment — app wraps around     ║
// ║           them immediately. No cold-start confusion.           ║
// ║ STEPS   : 1) Who you are + language pick                       ║
// ║           2) Choose your starting fret (1-3)                   ║
// ║           3) "The Truebadour awaits" — open AI guide           ║
// ║ RULES   : Shows ONCE. Stores locale + fret in localStorage.    ║
// ║           Links to TutorialMenu for the full guide.            ║
// ║           No auth required — works anonymous.                  ║
// ╚═════════════════════════════════════════════════════════════════╝

import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Guitar, Globe, BookOpen, X } from 'lucide-react';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { useLocale } from '../hooks/useLocale';
import { loadTraction, saveTraction } from '../data/tractionStore';

function getFrets(t) {
  return [
    { n: 1, label: t('fretBeginner'), sub: t('fretBeginnerSub'), icon: '🌱' },
    { n: 2, label: t('fretSomeExp'),   sub: t('fretSomeExpSub'),   icon: '🌿' },
    { n: 3, label: t('fretReturning'),  sub: t('fretReturningSub'), icon: '🌳' },
  ];
}

function getSteps(t) {
  return [
    {
      id: 'welcome',
      title: t('welcomeToVoixVive'),
      subtitle: t('theLivingVoice'),
      body: t('onboardingModalBody'),
      detail: t('onboardingModalDetail'),
    },
    {
      id: 'path',
      title: t('choosePath') || 'Choose Your Path',
      subtitle: t('learningStyle') || 'How do you want to learn?',
      body: t('pathBody') || 'The Apprenticeship guides you step-by-step to prevent overwhelm. The Open Sandbox gives you the keys to the entire library.',
      detail: null,
    },
    {
      id: 'fret',
      title: t('whereDoYouBegin'),
      subtitle: t('chooseStartingFret'),
      body: t('startingFretBody'),
      detail: null,
    },
    {
      id: 'ready',
      title: t('truebadourAwaits'),
      subtitle: t('aiGuideReady'),
      body: t('readyBody'),
      detail: t('readyDetail'),
    },
  ];
}

// ── Dot progress ─────────────────────────────────────────────────
function Dots({ total, current }) {
  return (
    <div className="flex gap-1.5 justify-center mt-6">
      {Array.from({length: total}).map((_,i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6, borderRadius: 3,
          background: i === current ? 'var(--cf-gold)' : 'rgba(255,255,255,0.15)',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function OnboardingModal({ onClose }) {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [step, setStep]       = useState(0);
  const [locale, setLocale]   = useState('en');
  const [fret, setFret]       = useState(1);

  const [sandboxMode, setSandboxMode] = useState(false);

  const STEPS = useMemo(() => getSteps(t), [t]);
  const FRETS = useMemo(() => getFrets(t), [t]);
  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  const finish = () => {
    vvSet(STORAGE_KEYS.ONBOARDED, '1');
    vvSet(STORAGE_KEYS.LOCALE, locale);
    vvSet(STORAGE_KEYS.STARTING_FRET, String(fret));
    
    // Save the path selection to traction store
    const tr = loadTraction();
    tr.settings.sandboxMode = sandboxMode;
    saveTraction(tr);

    // Open Truebadour widget via custom event
    window.dispatchEvent(new CustomEvent('voixvive:open-truebadour'));
    onClose();
    // Only navigate to dashboard if accessed via /onboarding route (has its own page)
    // When used as overlay widget, just close — don't force-navigate away
    if (window.location.pathname === '/onboarding') {
      navigate('/dashboard');
    }
  };

  const next = () => {
    if (isLast) { finish(); return; }
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-[100svh] flex items-center justify-center p-4 bg-[#050508]">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity:0, y:16, scale:0.96 }}
          animate={{ opacity:1, y:0,  scale:1    }}
          exit={{    opacity:0, y:-10, scale:0.97 }}
          transition={{ duration:0.25 }}
          className="relative w-full max-w-[440px] bg-[#0a0a14] border border-cf-gold/35 rounded-[22px] p-8 pt-7 shadow-[0_0_80px_rgba(var(--cf-gold-rgb),0.12),0_24px_64px_rgba(0,0,0,0.7)]"
        >
          {/* Dismiss / Skip — always visible, user can skip at any time */}
          <button
            onClick={finish}
            aria-label={t('skipOnboarding')}
            className="absolute top-3.5 right-3.5 bg-transparent border-none cursor-pointer text-white/20 p-1 flex items-center justify-center transition-colors duration-200 hover:text-white/50"
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div className="text-center mb-5">
            <div className="text-[42px] mb-2.5">
              {step === 0 ? '♾️' : step === 1 ? '🧭' : step === 2 ? '🎸' : '🔴'}
            </div>
            <h2 className="font-heading text-[1.55rem] font-semibold text-vv-text m-0 mb-1">
              {current.title}
            </h2>
            <p className="font-mono text-[10px] text-cf-gold tracking-[0.12em] uppercase m-0">
              {current.subtitle}
            </p>
          </div>

          {/* Body card */}
          <div className="bg-cf-gold/[0.05] border border-cf-gold/15 rounded-xl p-[1.1rem] mb-5">
            <p className="m-0 text-[0.9rem] leading-[1.65] text-white/72">
              {current.body}
            </p>
            {current.detail && (
              <p className="mt-3 text-[0.78rem] leading-[1.5] text-cf-gold/60 italic">
                {current.detail}
              </p>
            )}
          </div>

          {/* Step-specific content */}

          {/* STEP 0 — Language chooser */}
          {step === 0 && (
            <div className="flex gap-2 mb-4">
              {['en','fr'].map(l => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className="flex-1 py-2.5 px-2.5 rounded-[10px] cursor-pointer font-mono text-xs tracking-[0.1em] uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                  style={{
                    border:`1px solid ${locale === l ? 'var(--cf-gold)' : 'rgba(255,255,255,0.1)'}`,
                    background: locale === l ? 'rgba(var(--cf-gold-rgb),0.12)' : 'rgba(255,255,255,0.03)',
                    color: locale === l ? 'var(--cf-gold)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <Globe size={13} />
                  {l === 'en' ? t('english') : t('francais')}
                </button>
              ))}
            </div>
          )}

          {/* STEP 1 — Path chooser */}
          {step === 1 && (
            <div className="flex flex-col gap-2 mb-4">
              {[
                { val: false, label: 'Guided Apprenticeship', sub: 'Recommended. Step-by-step focus.', icon: '🧭' },
                { val: true, label: 'Open Sandbox', sub: 'Library mode. No locks.', icon: '🗝️' }
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => setSandboxMode(p.val)}
                  className="py-3 px-3.5 rounded-[11px] cursor-pointer text-white/80 transition-all duration-200 flex items-center gap-2.5 text-left"
                  style={{
                    border:`1px solid ${sandboxMode === p.val ? 'var(--cf-gold)' : 'rgba(255,255,255,0.08)'}`,
                    background: sandboxMode === p.val ? 'rgba(var(--cf-gold-rgb),0.1)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <span className="text-[20px]">{p.icon}</span>
                  <div>
                    <div className="font-heading text-[0.95rem]"
                      style={{ color: sandboxMode === p.val ? 'var(--cf-gold)' : '#f0e6d2' }}>
                      {p.label}
                    </div>
                    <div className="font-mono text-[10px] text-white/40">
                      {p.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2 — Fret chooser */}
          {step === 2 && (
            <div className="flex flex-col gap-2 mb-4">
              {FRETS.map(f => (
                <button
                  key={f.n}
                  onClick={() => setFret(f.n)}
                  className="py-3 px-3.5 rounded-[11px] cursor-pointer text-white/80 transition-all duration-200 flex items-center gap-2.5 text-left"
                  style={{
                    border:`1px solid ${fret === f.n ? 'var(--cf-gold)' : 'rgba(255,255,255,0.08)'}`,
                    background: fret === f.n ? 'rgba(var(--cf-gold-rgb),0.1)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <span className="text-[20px]">{f.icon}</span>
                  <div>
                    <div className="font-heading text-[0.95rem]"
                      style={{ color: fret === f.n ? 'var(--cf-gold)' : '#f0e6d2' }}>
                      {f.label}
                    </div>
                    <div className="font-mono text-[10px] text-white/40">
                      {f.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3 — Ready state — show binder hint */}
          {step === 3 && (
            <div className="flex items-center gap-2 py-2.5 px-3 rounded-[10px] mb-4 bg-[rgba(59,130,246,0.07)] border border-[rgba(59,130,246,0.2)]">
              <BookOpen size={15} className="text-[#60a5fa] shrink-0" />
              <p className="m-0 text-[0.75rem] text-white/55 font-mono leading-[1.45]">
                {t('binderHint')}
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={next}
            className="w-full py-3.5 rounded-xl cursor-pointer text-cf-gold font-mono text-xs tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all duration-200 min-h-[44px]"
            style={{
              background:'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.25) 0%, rgba(var(--cf-gold-rgb),0.1) 100%)',
              border:'1px solid rgba(var(--cf-gold-rgb),0.5)',
            }}
            onMouseEnter={e => e.currentTarget.style.background='linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.35) 0%, rgba(var(--cf-gold-rgb),0.18) 100%)'}
            onMouseLeave={e => e.currentTarget.style.background='linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.25) 0%, rgba(var(--cf-gold-rgb),0.1) 100%)'}
          >
            {isLast
              ? <><Guitar size={14} /> {t('beginMyJourney')}</>
              : <>{t('continue')} <ChevronRight size={14} /></>
            }
          </button>

          <Dots total={STEPS.length} current={step} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Hook — call in App.jsx to decide whether to show onboarding */
// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !vvGet(STORAGE_KEYS.ONBOARDED);
  });
  const dismiss = () => setShow(false);
  return { show, dismiss };
}
