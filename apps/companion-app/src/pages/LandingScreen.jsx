import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';
import AuthButton from '../components/AuthButton';
import CoachingPortal from '../components/CoachingPortal';
import { useLocale } from '../hooks/useLocale';
import { useAuth } from '../hooks/useAuth';
import { useScaffolding } from '../components/ScaffoldingProvider';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// Decomposed components
import AcademyManifesto from './landing-components/AcademyManifesto';
import PortalGrid from './landing-components/PortalGrid';
import './LandingScreen.css';

export default function LandingScreen() {
  const navigate = useNavigate();
  const { locale, toggleLocale, t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (val[locale] || val['en']) : val);

  const [showCoaching, setShowCoaching] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { traction, loading: scaffoldingLoading } = useScaffolding();

  const aiEnabled = traction?.settings?.aiEnabled !== false;
  const { voixReady, voixLoading, loadVoix, unloadVoix, loadProgress } = useTruebadour();

  const currentMode = useMemo(() => {
    if (aiEnabled) return { label: t('modeApprenticeshipLabel'), color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)', desc: t('modeApprenticeshipDesc') };
    return { label: t('modeSelfStudyLabel'), color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)', desc: t('modeSelfStudyDesc') };
  }, [aiEnabled, t]);

  return (
    <div className="min-h-[100svh] w-full bg-[#050508] flex flex-col items-center px-5 pb-12 relative overflow-hidden font-sans before:content-[''] before:fixed before:top-[40%] before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[100vw] before:h-[100vw] before:max-w-[700px] before:max-h-[700px] before:bg-[radial-gradient(circle,rgba(var(--cf-gold-rgb),0.06)_0%,rgba(100,80,160,0.04)_40%,transparent_70%)] before:pointer-events-none before:z-0">
      {/* ── Voix Vive Wordmark ── */}
      <motion.div
        className="w-full max-w-[540px] pt-[max(32px,env(safe-area-inset-top))] relative z-10 mb-2 md:max-w-[600px] landscape:max-w-[260px] landscape:pt-[max(6px,env(safe-area-inset-top))] landscape:mb-1"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img
          src="/assets/wordmark.png"
          alt="Voix Vive"
          className="w-full rounded-[20px] block"
          draggable={false}
        />
      </motion.div>

      {/* ── Academy Manifesto ── */}
      <AcademyManifesto />

      {/* ── Begin Journey CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="w-full max-w-[540px] flex justify-center mb-5 relative z-10 mx-auto"
      >
        <button
          onClick={() => {
            const onboarded = vvGet(STORAGE_KEYS.ONBOARDED);
            navigate(onboarded ? '/c-scale' : '/start');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const onboarded = vvGet(STORAGE_KEYS.ONBOARDED);
              navigate(onboarded ? '/c-scale' : '/start');
            }
          }}
          className="premium-button flex items-center justify-center gap-2.5 px-8 py-3 rounded-[14px]"
        >
          <span className="text-base">🎸</span>
          {t('beginJourney') || 'Begin Your Journey'}
        </button>
      </motion.div>

      {/* ── Trinity label ── */}
      <motion.p
        className="font-mono text-[0.8rem] tracking-[0.3em] uppercase text-cf-gold/45 text-center mb-6 relative z-10 max-sm:text-[0.9rem] max-sm:tracking-[0.2em] landscape:mb-2 landscape:text-[0.5rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {t('choosePortal')}
      </motion.p>

      {/* ── Language Toggle + Auth ── */}
      <motion.div
        className="flex justify-between items-center w-full max-w-[540px] gap-2.5 mb-4 relative z-10 mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {/* Dynamic Mode Pill */}
        <div 
          className="flex flex-col items-start gap-0.5 px-3 py-1.5 rounded-xl backdrop-blur-md"
          style={{
            background: currentMode.background,
            borderColor: currentMode.borderColor,
            borderWidth: '1px',
            boxShadow: `0 0 12px ${currentMode.background}`
          }} 
          title={currentMode.desc}
        >
          <div 
            className="font-mono text-[0.6rem] font-bold tracking-[0.08em] uppercase"
            style={{ color: currentMode.color }}
          >
            ● {currentMode.label}
          </div>
        </div>

        <div className="flex gap-2.5 items-center">
          {/* AI On/Off Toggle */}
          <button
            onClick={() => voixReady ? unloadVoix() : loadVoix('standard')}
            onKeyDown={(e) => e.key === 'Enter' && (voixReady ? unloadVoix() : loadVoix('standard'))}
            disabled={voixLoading}
            className={`
              rounded-lg px-3.5 py-2 font-mono text-[0.65rem] font-bold flex items-center gap-1.5 min-w-[80px] transition-all duration-300
              ${voixReady 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-pointer' 
                : voixLoading 
                  ? 'bg-[rgba(var(--cf-gold-rgb),0.08)] border border-[rgba(var(--cf-gold-rgb),0.2)] text-cf-gold cursor-wait' 
                  : 'bg-white/5 border border-white/10 text-white/40 cursor-pointer hover:bg-white/10'
              }
            `}
          >
            {voixReady ? '🧠 AI On' : voixLoading ? `⏳ ${Math.round(loadProgress)}%` : '🧠 AI Off'}
          </button>
          <AuthButton />
          <button
            onClick={toggleLocale}
            onKeyDown={(e) => e.key === 'Enter' && toggleLocale()}
            className="rounded-lg px-4 py-2 font-mono text-[0.7rem] font-bold cursor-pointer transition-all duration-300 bg-white/5 border border-cf-gold/20 text-cf-gold hover:bg-cf-gold/10"
          >
            🌐 {locale === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>
      </motion.div>

      {/* ── Anonymous mode banner ── */}
      {!user && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded-lg bg-[rgba(var(--cf-gold-rgb),0.06)] border border-[rgba(var(--cf-gold-rgb),0.12)] text-[rgba(var(--cf-gold-rgb),0.7)] text-[0.7rem] font-mono max-w-[400px] text-center cursor-default mx-auto"
        >
          <span>💾</span>
          <span>{t('signInToSaveProgress')}</span>
        </motion.div>
      )}

      {/* ── Portal Grid ── */}
      <PortalGrid localize={localize} />

      {/* ── Breathing Thumb Anchor ── */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cf-gold/30 cursor-pointer transition-all duration-300 hover:text-cf-gold/60 landscape:mt-2.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
      >
        <Circle size={28} strokeWidth={1} />
        <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase">Voix Vive</span>
      </motion.div>

      {/* ── Studio Doorway ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
        className="text-center mt-8 mb-8"
      >
        <a
          href="/studio"
          className="font-heading text-base text-[rgba(var(--cf-gold-rgb),0.5)] no-underline tracking-[0.04em] transition-colors duration-300 hover:text-[rgba(var(--cf-gold-rgb),0.8)]"
        >
          {t('learnWithBertrand')}
        </a>
        <p className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.3)] mt-2 tracking-[0.1em]">
          {t('privateMentorshipCercle')}
        </p>
      </motion.div>

      {/* ── Creator Footer ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center mt-12 mb-6 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <p className="font-mono text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.25)] tracking-[0.15em] leading-[1.8]">
          Built by{' '}
          <a
            href="https://LDTAtkinson.com" target="_blank" rel="noopener noreferrer"
            className="text-[rgba(var(--cf-gold-rgb),0.4)] no-underline transition-colors duration-300 hover:text-[rgba(var(--cf-gold-rgb),0.7)]"
          >
            Joshua Atkinson
          </a>
          <br />
          Teaching Method by{' '}
          <a
            href="https://bertrandguitarstudio.duetpartner.com/" target="_blank" rel="noopener noreferrer"
            className="text-[rgba(var(--cf-gold-rgb),0.4)] no-underline transition-colors duration-300 hover:text-[rgba(var(--cf-gold-rgb),0.7)]"
          >
            Bertrand Laurence
          </a>
        </p>
      </motion.div>

      {/* Somatic Practice Portal Modal Overlay */}
      <AnimatePresence>
        {showCoaching && (
          <CoachingPortal onClose={() => setShowCoaching(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
