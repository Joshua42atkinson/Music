import React, { useState, useMemo, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Circle, X, Compass } from 'lucide-react';
import AuthButton from '../components/AuthButton';
import CoachingPortal from '../components/CoachingPortal';
import { useLocale } from '../hooks/useLocale';
import { useAuth } from '../hooks/useAuth';
import { useScaffolding } from '../components/ScaffoldingProvider';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { Skeleton, CardSkeleton } from '../components/Skeleton';
import LearningPathModal from '../components/LearningPathModal';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : LandingScreen.jsx                                   ║
// ║ WHAT    : Renders the central hub routing to Song, Guitar,    ║
// ║           Player, and Playbook portals with dynamic language. ║
// ║ WHY     : Acts as the Boethian "Trinity" entry point for all  ║
// ║           students entering the platform.                     ║
// ║ WHO     : Student — first screen they see upon load.          ║
// ║ OWNS    : The portal routing grid, Academy Manifesto, and     ║
// ║           global layout wrapper for the root path.            ║
// ║ NEEDS   : AuthButton, CoachingPortal, useLocale, useAuth      ║
// ║ RULES   : Do not add a fifth portal without pedagogical logic.║
// ║           Must remain visually distinct from standard UI.     ║
// ║ FIX AT  : App.jsx route '/' → LandingScreen.jsx               ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝
const PORTALS = [
  {
    id: 'song',
    name: { en: 'Song', fr: 'Chanson' },
    subtitle: { en: 'Read & Learn', fr: 'Lire & Apprendre' },
    path: '/song',
    color: 'var(--cf-gold)',
    image: '/assets/portal_song.png',
    description: { en: 'Discover the story behind the music', fr: 'Découvrez l’histoire derrière la musique' },
  },
  {
    id: 'player',
    name: { en: 'Play', fr: 'Jouer' },
    subtitle: { en: 'Watch & Connect', fr: 'Regarder & Se connecter' },
    path: '/player',
    color: '#c07898',
    image: '/assets/portal_player.png',
    description: { en: 'Browse resources, watch videos and record submissions', fr: 'Parcourez les ressources, regardez les vidéos et enregistrez' },
  },
  {
    id: 'binder',
    name: { en: 'Study', fr: 'Étudier' },
    subtitle: { en: 'Notes & Growth', fr: 'Notes & Croissance' },
    path: '/binder',
    color: '#7aaa88',
    image: '/assets/portal_playbook.png',
    description: { en: 'Fret timeline, practice tools & character progression', fr: 'Ligne de temps des quêtes, outils de pratique & progression' },
  },
  {
    id: 'riff',
    name: { en: 'Riff', fr: 'Riff' },
    subtitle: { en: 'Practice & Explore', fr: 'Pratiquer & Explorer' },
    path: '/riff',
    color: '#e0834a',
    image: '/assets/portal_guitar.png',
    description: { en: 'Interactive fretboard, scales, and deep practice', fr: 'Manche interactif, gammes et pratique approfondie' },
  },
];

export default function LandingScreen() {
  const navigate = useNavigate();
  const { locale, toggleLocale, t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (val[locale] || val['en']) : val);

  const [showCoaching, setShowCoaching] = useState(false);
  const [manifestoExpanded, setManifestoExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { traction, updateTraction, loading: scaffoldingLoading } = useScaffolding();
  const hasOnboarded = !!vvGet(STORAGE_KEYS.ONBOARDED);

  const sandboxMode = traction?.settings?.sandboxMode;
  const showLearningPathModal = sandboxMode === undefined;
  const aiEnabled = traction?.settings?.aiEnabled !== false;
  const { voixReady, voixLoading, loadVoix, unloadVoix, loadProgress } = useTruebadour();

  const currentMode = useMemo(() => {
    if (!sandboxMode && aiEnabled) return { label: t('modeApprenticeshipLabel'), color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)', desc: t('modeApprenticeshipDesc') };
    if (!sandboxMode && !aiEnabled) return { label: t('modeSelfStudyLabel'), color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)', desc: t('modeSelfStudyDesc') };
    if (sandboxMode && aiEnabled) return { label: t('modeExplorationLabel'), color: '#fbbf24', background: 'rgba(251,191,38,0.1)', borderColor: 'rgba(251,191,38,0.25)', desc: t('modeExplorationDesc') };
    return { label: t('modeLibraryReferenceLabel'), color: '#9ca3af', background: 'rgba(156,163,175,0.1)', borderColor: 'rgba(156,163,175,0.25)', desc: t('modeLibraryReferenceDesc') };
  }, [sandboxMode, aiEnabled, t]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handlePathSelect = (isSandbox) => {
    updateTraction({ settings: { ...traction?.settings, sandboxMode: isSandbox } });
  };

  const activePortals = sandboxMode === false 
    ? PORTALS.filter(p => p.id === 'player') 
    : PORTALS;

  // Show skeleton while loading
  if (isLoading || authLoading || scaffoldingLoading) {
    return (
      <div className="landing-hub">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-hub">
      <LearningPathModal 
        isOpen={showLearningPathModal && !isLoading && !authLoading && !scaffoldingLoading} 
        onSelect={handlePathSelect} 
      />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-hub {
          min-height: 100svh;
          width: 100%;
          background: #050508;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px 48px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Ambient radial glow */
        .landing-hub::before {
          content: '';
          position: fixed;
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          width: 100vw; height: 100vw;
          max-width: 700px; max-height: 700px;
          background: radial-gradient(circle,
            rgba(var(--cf-gold-rgb),0.06) 0%,
            rgba(100,80,160,0.04) 40%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── WORDMARK HEADER ── */
        .wordmark-wrap {
          width: 100%;
          max-width: 540px;
          padding-top: max(32px, env(safe-area-inset-top));
          position: relative;
          z-index: 1;
          margin-bottom: 8px;
        }

        .wordmark-img {
          width: 100%;
          border-radius: 20px;
          display: block;
        }

        /* ── TRINITY LABEL ── */
        .trinity-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(var(--cf-gold-rgb),0.45);
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        /* ── ACADEMY MANIFESTO ── */
        .manifesto-section {
          width: 100%;
          max-width: 540px;
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
          padding: 0 4px;
        }
        .manifesto-card {
          background: linear-gradient(160deg, rgba(var(--cf-gold-rgb),0.04) 0%, rgba(122,170,136,0.03) 50%, rgba(123,106,170,0.03) 100%);
          border: 1px solid rgba(var(--cf-gold-rgb),0.1);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
        }
        .manifesto-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--cf-gold-rgb),0.3), rgba(122,170,136,0.2), transparent);
        }
        .manifesto-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(var(--cf-gold-rgb),0.55);
          text-align: center;
          margin-bottom: 16px;
        }
        .manifesto-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 5vw, 1.8rem);
          font-weight: 300;
          color: #f0e6d2;
          text-align: center;
          line-height: 1.4;
          margin-bottom: 20px;
        }
        .manifesto-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.05rem;
          color: rgba(210,210,218,0.75);
          text-align: center;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .manifesto-pillars {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .manifesto-pillar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .manifesto-pillar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 8px rgba(var(--cf-gold-rgb),0.15));
        }
        .manifesto-pillar-icon svg {
          width: 100%;
          height: 100%;
        }
        .manifesto-pillar-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #f0e6d2;
          font-weight: 500;
        }
        .manifesto-pillar-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(var(--cf-gold-rgb),0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .manifesto-free-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          padding: 10px 18px;
          border-radius: 10px;
          background: rgba(122,170,136,0.06);
          border: 1px solid rgba(122,170,136,0.15);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(122,170,136,0.75);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.4;
        }

        /* ── PORTALS GRID ── */
        .portals-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 540px;
          position: relative;
          z-index: 1;
        }

        .portal-card {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          background: #0a0a0f;
          display: flex;
          flex-direction: column;
        }

        .portal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        }

        .portal-card:active {
          transform: scale(0.98);
        }

        /* Art fills the card */
        .portal-art {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s;
          opacity: 0.88;
        }

        .portal-card:hover .portal-art {
          transform: scale(1.04);
          opacity: 1;
        }

        /* Color accent line at top */
        .portal-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--portal-color);
          opacity: 0.7;
          z-index: 3;
          transition: opacity 0.3s;
        }
        .portal-card:hover::before {
          opacity: 1;
        }

        /* Text separated on small screens, overlaid on large */
        .portal-info {
          position: relative;
          padding: 16px 20px;
          background: #0a0a0f;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        @media (min-width: 600px) {
          .portal-info {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 20px 20px 18px;
            background: linear-gradient(transparent 0%, rgba(5,5,8,0.92) 50%);
            align-items: flex-end;
          }
        }

        .portal-text {}

        .portal-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--portal-color);
          opacity: 0.8;
          margin-bottom: 4px;
          display: block;
        }

        .portal-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem;
          font-weight: 400;
          color: #f0e6d2;
          line-height: 1.1;
          text-shadow: 0 2px 12px rgba(0,0,0,0.8);
          display: block;
        }

        .portal-desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
          display: block;
          font-style: italic;
        }

        .portal-arrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.4rem;
          color: var(--portal-color);
          opacity: 0.5;
          transition: all 0.3s;
          flex-shrink: 0;
          margin-left: 12px;
          margin-bottom: 2px;
        }

        .portal-card:hover .portal-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* ── MOBILE: bump ALL text for readability ── */
        @media (max-width: 599px) {
          .manifesto-card {
            padding: 28px 20px;
          }
          .manifesto-kicker {
            font-size: 0.8rem;
            letter-spacing: 0.15em;
          }
          .manifesto-body {
            font-size: 1.1rem;
            line-height: 1.65;
          }
          .manifesto-pillar-icon {
            width: 64px;
            height: 64px;
          }
          .manifesto-pillar-label {
            font-size: 1.2rem;
          }
          .manifesto-pillar-sub {
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          .manifesto-free-badge {
            font-size: 0.8rem;
            padding: 12px 16px;
            line-height: 1.5;
          }
          .trinity-label {
            font-size: 0.9rem;
            letter-spacing: 0.2em;
          }
          .portal-info {
            padding: 14px 16px;
          }
          .portal-tag {
            font-size: 0.85rem;
            letter-spacing: 0.15em;
            margin-bottom: 6px;
          }
          .portal-name {
            font-size: 1.6rem;
            margin-bottom: 4px;
          }
          .portal-desc {
            font-size: 1rem;
            line-height: 1.5;
            color: rgba(255,255,255,0.55);
          }
          .portal-arrow {
            font-size: 1.6rem;
          }
        }

        /* ── TABLET+: stronger overlay gradient for text contrast ── */
        @media (min-width: 600px) {
          .portal-info {
            background: linear-gradient(transparent 0%, rgba(5,5,8,0.95) 45%);
          }
        }

        /* ── LANDSCAPE PHONE: cards side-by-side ── */
        @media (orientation: landscape) and (max-height: 600px) {
          .landing-hub { padding: 8px 16px 24px; }
          .wordmark-wrap { max-width: 260px; padding-top: max(6px, env(safe-area-inset-top)); margin-bottom: 4px; }
          .trinity-label { margin-bottom: 8px; font-size: 0.5rem; }
          .portals-grid { flex-direction: row; gap: 10px; max-width: 100%; }
          .portal-card { flex: 1; min-width: 0; }
          .portal-art { aspect-ratio: 4 / 3; }
          .portal-info { padding: 10px 10px 8px; }
          .portal-name { font-size: 1.05rem; }
          .portal-tag, .portal-desc { display: none; }
          .thumb-anchor { margin-top: 10px; }
        }

        /* ── DESKTOP: wider layout ── */
        @media (min-width: 768px) {
          .portals-grid { max-width: 600px; }
          .wordmark-wrap { max-width: 600px; }
          .bertrand-banner { max-width: 600px; }
        }

        /* ── BERTRAND MARKETING BANNER ── */
        .bertrand-banner {
          width: 100%;
          max-width: 540px;
          padding: 14px 20px;
          margin-bottom: 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.06) 0%, rgba(160,130,80,0.02) 100%);
          border: 1px solid rgba(var(--cf-gold-rgb),0.18);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .bertrand-banner:hover {
          border-color: rgba(var(--cf-gold-rgb),0.35);
          box-shadow: 0 4px 24px rgba(var(--cf-gold-rgb),0.08);
        }
        .bertrand-banner-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .bertrand-banner-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: #f0e6d2;
          font-weight: 500;
        }
        .bertrand-banner-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: rgba(var(--cf-gold-rgb),0.45);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .bertrand-banner-btn {
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.18), rgba(var(--cf-gold-rgb),0.05));
          border: 1px solid rgba(var(--cf-gold-rgb),0.3);
          color: var(--cf-gold);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

.bertrand-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(5,5,8,0.95);
  backdrop-filter: blur(8px);
  overflow-y: auto;
}
.bertrand-modal-content {
  max-width: 100%;
  margin: 0;
}
.bertrand-modal-close {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1001;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}
.bertrand-modal-close:hover {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
}

.thumb-anchor {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(var(--cf-gold-rgb),0.3);
  cursor: pointer;
  transition: all 0.3s;
}
.thumb-anchor:hover {
  color: rgba(var(--cf-gold-rgb),0.6);
}
.thumb-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
        }
      `}</style>

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


      {/* ── Academy Manifesto — collapsed teaser by default ── */}
      <motion.div
        className="manifesto-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      >
        <div className="manifesto-card">
          {/* Always-visible tagline */}
          <h1 className="manifesto-tagline" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
            fontWeight: "400",
            color: "var(--cf-gold)",
            textAlign: "center",
            lineHeight: "1.25",
            marginBottom: "16px",
            fontStyle: "italic",
            textShadow: "0 2px 12px rgba(var(--cf-gold-rgb),0.15)"
          }}>
            {t('manifestoTagline')}
          </h1>

          {/* Short hook */}
          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '1rem',
            color: 'rgba(210,210,218,0.65)',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            {t('manifestoHook')}
          </p>

          {/* Expand toggle */}
          <button
            onClick={() => setManifestoExpanded(v => !v)}
            onKeyDown={(e) => e.key === 'Enter' && setManifestoExpanded(v => !v)}
            style={{
              display: 'block', margin: '0 auto',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(var(--cf-gold-rgb),0.45)',
              padding: '4px 0 2px',
              transition: 'color 0.2s',
            }}
          >
            {manifestoExpanded
              ? t('manifestoLess')
              : t('manifestoMore')}
          </button>

          {/* Expanded content — pillars + body */}
          <AnimatePresence>
            {manifestoExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <p className="manifesto-kicker" style={{ marginTop: 20 }}>
                  {t('manifestoKicker')}
                </p>
                <h2 className="manifesto-title">
                  {t('manifestoTitle')}
                </h2>
                <p className="manifesto-body">
                  {t('manifestoBody')}
                </p>
                <div className="manifesto-pillars">
                  {[
                    { label: t('manifestoPillarBeLabel'), sub: t('manifestoPillarBeSub'), color: 'var(--cf-gold)' },
                    { label: t('manifestoPillarDoLabel'), sub: t('manifestoPillarDoSub'), color: '#7aaa88' },
                    { label: t('manifestoPillarPlayLabel'), sub: t('manifestoPillarPlaySub'), color: '#c07898' },
                  ].map(({ label, sub, color }) => (
                    <div key={label} className="manifesto-pillar">
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifycontent: 'center', marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color }}>{label[0]}</span>
                      </div>
                      <span className="manifesto-pillar-label" style={{ color: '#f0e6d2' }}>{label}</span>
                      <span className="manifesto-pillar-sub" style={{ color: `${color}90` }}>{sub}</span>
                    </div>
                  ))}
                </div>
                <div className="manifesto-free-badge" style={{ marginTop: 20 }}>
                  <span>✦</span>
                  <span>{t('manifestoFreeBadge')}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>


      {/* ── Begin Journey CTA (voluntary onboarding) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: 540,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 20,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={() => navigate('/onboarding')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding')}
          style={{
            padding: '12px 32px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.2) 0%, rgba(var(--cf-gold-rgb),0.08) 100%)',
            border: '1px solid rgba(var(--cf-gold-rgb),0.45)',
            color: 'var(--cf-gold)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.3) 0%, rgba(var(--cf-gold-rgb),0.15) 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.2) 0%, rgba(var(--cf-gold-rgb),0.08) 100%)'}
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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '540px',
          gap: 10,
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {/* Dynamic Mode Pill */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          padding: '6px 12px',
          borderRadius: '12px',
          background: currentMode.background,
          border: `1px solid ${currentMode.borderColor}`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 0 12px ${currentMode.background}`
        }} title={currentMode.desc}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            fontWeight: 700,
            color: currentMode.color,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
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
              borderRadius: '8px',
              padding: '8px 14px',
              color: voixReady ? '#a7f3d0' : voixLoading ? 'var(--cf-gold)' : 'rgba(255,255,255,0.4)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 'bold',
              cursor: voixLoading ? 'wait' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: 6,
              minWidth: 80,
            }}
          >
            {voixReady ? '🧠 AI On' : voixLoading ? `⏳ ${Math.round(loadProgress)}%` : '🧠 AI Off'}
          </button>
          <AuthButton />
          <button
            onClick={toggleLocale}
            onKeyDown={(e) => e.key === 'Enter' && toggleLocale()}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'var(--cf-gold)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '8px 16px',
            marginBottom: 12,
            borderRadius: 8,
            background: 'rgba(var(--cf-gold-rgb),0.06)',
            border: '1px solid rgba(var(--cf-gold-rgb),0.12)',
            color: 'rgba(var(--cf-gold-rgb),0.7)',
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            maxWidth: 400,
            textAlign: 'center',
            cursor: 'default',
          }}
        >
          <span>💾</span>
          <span>{t('signInToSaveProgress')}</span>
        </motion.div>
      )}

      {/* ── Portals / Apprenticeship Gate ── */}
      <div className="portals-grid">
        {!sandboxMode && hasOnboarded ? (
          <motion.div
            className="portal-card"
            style={{ '--portal-color': 'var(--cf-gold)' }}
            onClick={() => navigate('/dashboard')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard')}
            tabIndex={0}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            <img src="/assets/portal_song.png" alt="Apprenticeship" className="portal-art" draggable={false} />
            <div className="portal-info">
              <div className="portal-text">
                <span className="portal-tag">Guided Path</span>
                <span className="portal-name">Continue Apprenticeship</span>
                <span className="portal-desc">Return to your focused journey</span>
              </div>
              <span className="portal-arrow">›</span>
            </div>
          </motion.div>
        ) : (
          PORTALS.map((portal, idx) => (
            <motion.div
              key={portal.id}
              className="portal-card"
              style={{ '--portal-color': portal.color }}
              onClick={() => navigate(portal.path)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(portal.path)}
              tabIndex={0}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={portal.image}
                alt={localize(portal.name)}
                className="portal-art"
                draggable={false}
              />
              <div className="portal-info">
                <div className="portal-text">
                  <span className="portal-tag">{localize(portal.subtitle)}</span>
                  <span className="portal-name">{localize(portal.name)}</span>
                  <span className="portal-desc">{localize(portal.description)}</span>
                </div>
                <span className="portal-arrow">›</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── Breathing Thumb Anchor ── */}
      <motion.div
        className="thumb-anchor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <Circle size={28} strokeWidth={1} />
        <span className="thumb-label">Voix Vive</span>
      </motion.div>

      {/* ── Studio Doorway (simplified) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-center mt-8 mb-8"
      >
        <a
          href="/studio"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            color: 'rgba(var(--cf-gold-rgb),0.5)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.8)'}
          onMouseLeave={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.5)'}
        >
          {t('learnWithBertrand')}
        </a>
        <p className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.3)] mt-2 tracking-[0.1em]">
          {t('privateMentorshipCercle')}
        </p>
      </motion.div>

      {/* ── Creator Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center mt-12 mb-6 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <p className="font-mono text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.25)] tracking-[0.15em] leading-[1.8]">
          Built by{' '}
          <a
            href="https://LDTAtkinson.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(var(--cf-gold-rgb),0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.4)'}
          >
            Joshua Atkinson
          </a>
          <br />
          Teaching Method by{' '}
          <a
            href="https://bertrandguitarstudio.duetpartner.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(var(--cf-gold-rgb),0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(var(--cf-gold-rgb),0.4)'}
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
