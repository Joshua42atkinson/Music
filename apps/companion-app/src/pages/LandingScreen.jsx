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
    <div className="landing-hub">
      {/* ── Voix Vive Wordmark ── */}
      <motion.div
        className="wordmark-wrap"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img
          src="/assets/wordmark.png"
          alt="Voix Vive"
          className="wordmark-img"
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
          <span style={{ fontSize: 16 }}>🎸</span>
          {t('beginJourney') || 'Begin Your Journey'}
        </button>
      </motion.div>

      {/* ── Trinity label ── */}
      <motion.p
        className="trinity-label"
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
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '6px 12px',
          borderRadius: '12px', background: currentMode.background, border: `1px solid ${currentMode.borderColor}`,
          backdropFilter: 'blur(10px)', boxShadow: `0 0 12px ${currentMode.background}`
        }} title={currentMode.desc}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', fontWeight: 700,
            color: currentMode.color, letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            ● {currentMode.label}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* AI On/Off Toggle */}
          <button
            onClick={() => voixReady ? unloadVoix() : loadVoix('standard')}
            onKeyDown={(e) => e.key === 'Enter' && (voixReady ? unloadVoix() : loadVoix('standard'))}
            disabled={voixLoading}
            style={{
              background: voixReady ? 'rgba(16,185,129,0.12)' : voixLoading ? 'rgba(var(--cf-gold-rgb),0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${voixReady ? 'rgba(16,185,129,0.3)' : voixLoading ? 'rgba(var(--cf-gold-rgb),0.2)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px', padding: '8px 14px', color: voixReady ? '#a7f3d0' : voixLoading ? 'var(--cf-gold)' : 'rgba(255,255,255,0.4)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 'bold',
              cursor: voixLoading ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 6, minWidth: 80,
            }}
          >
            {voixReady ? '🧠 AI On' : voixLoading ? `⏳ ${Math.round(loadProgress)}%` : '🧠 AI Off'}
          </button>
          <AuthButton />
          <button
            onClick={toggleLocale}
            onKeyDown={(e) => e.key === 'Enter' && toggleLocale()}
            style={{
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 169, 110, 0.2)',
              borderRadius: '8px', padding: '8px 16px', color: 'var(--cf-gold)', fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(var(--cf-gold-rgb),0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
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
        className="thumb-anchor"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
      >
        <Circle size={28} strokeWidth={1} />
        <span className="thumb-label">Voix Vive</span>
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
