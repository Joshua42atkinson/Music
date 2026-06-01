import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';
import AuthButton from '../components/AuthButton';
import CoachingPortal from '../components/CoachingPortal';
import { useLocale } from '../hooks/useLocale';
import { useAuth } from '../hooks/useAuth';
import { useScaffolding } from '../components/ScaffoldingProvider';

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
    name: { en: 'The Song', fr: 'Le Chant' },
    subtitle: { en: 'Read & Learn', fr: 'Lire & Apprendre' },
    path: '/song',
    color: '#c9a96e',
    image: '/assets/portal_song.png',
    description: { en: 'Discover the story behind the music', fr: 'Découvrez l’histoire derrière la chanson' },
  },
  {
    id: 'guitar',
    name: { en: 'The Guitar', fr: 'La Guitare' },
    subtitle: { en: 'Play & Practice', fr: 'Jouer & S’entraîner' },
    path: '/guitar',
    color: '#7aaa88',
    image: '/assets/portal_guitar.png',
    description: { en: 'Train your memory with fretboard games', fr: 'Entraînez votre mémoire avec des jeux de frette' },
  },
  {
    id: 'player',
    name: { en: 'The Player', fr: 'Le Joueur' },
    subtitle: { en: 'Record & Reflect', fr: 'Enregistrer & Réfléchir' },
    path: '/player',
    color: '#c07898',
    image: '/assets/portal_player.png',
    description: { en: 'Submit practice videos to Bertrand and browse the video library', fr: 'Soumettez des vidéos de pratique à Bertrand et parcourez la bibliothèque vidéo' },
  },
  {
    id: 'playbook',
    name: { en: 'The Playbook', fr: 'Le Grimoire' },
    subtitle: { en: 'Your Hero\'s Guide', fr: 'Guide du Héros' },
    path: '/playbook',
    color: '#7b6aaa',
    image: '/assets/portal_playbook.png',
    description: { en: 'Character sheet, quests, journal & songwriting', fr: 'Fiche de personnage, quêtes, journal & écriture' },
  },
];

export default function LandingScreen() {
  const navigate = useNavigate();
  const { locale, toggleLocale, t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (val[locale] || val['en']) : val);

  const [showCoaching, setShowCoaching] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show welcome popup on first visit only
    return localStorage.getItem('voixvive_welcome_seen') !== '1';
  });
  const { user } = useAuth();
  const { traction } = useScaffolding();

  const sandboxMode = traction?.settings?.sandboxMode;
  const aiEnabled = traction?.settings?.aiEnabled !== false;

  const currentMode = useMemo(() => {
    if (!sandboxMode && aiEnabled) return { label: locale === 'fr' ? 'Apprentissage' : 'Apprenticeship', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)', desc: locale === 'fr' ? 'Parcours guidé + Mentorat IA' : 'Guided Path + AI Somatic Mentorship' };
    if (!sandboxMode && !aiEnabled) return { label: locale === 'fr' ? 'Auto-apprentissage' : 'Self-Study', color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)', desc: locale === 'fr' ? 'Parcours guidé (Silencieux)' : 'Guided Path (Silent)' };
    if (sandboxMode && aiEnabled) return { label: locale === 'fr' ? 'Exploration' : 'Exploration', color: '#fbbf24', background: 'rgba(251,191,38,0.1)', borderColor: 'rgba(251,191,38,0.25)', desc: locale === 'fr' ? 'Bac à sable + Mentorat IA' : 'Open Book Sandbox + AI Somatic Mentorship' };
    return { label: locale === 'fr' ? 'Référence' : 'Library Reference', color: '#9ca3af', background: 'rgba(156,163,175,0.1)', borderColor: 'rgba(156,163,175,0.25)', desc: locale === 'fr' ? 'Bac à sable (Silencieux)' : 'Open Book Sandbox (Silent)' };
  }, [traction, sandboxMode, locale]);

  const dismissWelcome = () => {
    localStorage.setItem('voixvive_welcome_seen', '1');
    setShowWelcome(false);
  };

  return (
    <div className="landing-hub">
      {/* ── Welcome Popup (first visit only, dismissible) ── */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) dismissWelcome(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full max-w-md rounded-2xl border border-amber-500/20 bg-[#0a0a14] p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={dismissWelcome}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="text-4xl mb-3">♾️</div>
              <h2 className="font-serif text-2xl text-[#f0e6d2] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome to Voix Vive
              </h2>
              <p className="text-white/50 text-sm mb-1 leading-relaxed">
                A journey of twelve frets. Three original songs. One breath at a time.
              </p>
              <p className="text-white/40 text-xs mb-6 leading-relaxed">
                This platform teaches you to hear, imagine, and express music — through Bertrand Laurence's pedagogy and an AI guide who walks beside you.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { dismissWelcome(); navigate('/onboarding'); }}
                  className="w-full py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Compass size={14} /> Begin Guided Orientation
                </button>
                <button
                  onClick={dismissWelcome}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all active:scale-95"
                >
                  Explore on My Own
                </button>
              </div>

              <p className="text-white/20 text-[10px] mt-4 font-mono">
                Everything is optional. You choose your pace.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

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
            rgba(201,169,110,0.06) 0%,
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
          color: rgba(201,169,110,0.45);
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
          background: linear-gradient(160deg, rgba(201,169,110,0.04) 0%, rgba(122,170,136,0.03) 50%, rgba(123,106,170,0.03) 100%);
          border: 1px solid rgba(201,169,110,0.1);
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
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), rgba(122,170,136,0.2), transparent);
        }
        .manifesto-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.55);
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
          filter: drop-shadow(0 0 8px rgba(201,169,110,0.15));
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
          color: rgba(201,169,110,0.5);
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
          background: linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(160,130,80,0.02) 100%);
          border: 1px solid rgba(201,169,110,0.18);
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
          border-color: rgba(201,169,110,0.35);
          box-shadow: 0 4px 24px rgba(201,169,110,0.08);
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
          color: rgba(201,169,110,0.45);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .bertrand-banner-btn {
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.05));
          border: 1px solid rgba(201,169,110,0.3);
          color: #c9a96e;
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
  color: rgba(201,169,110,0.3);
  cursor: pointer;
  transition: all 0.3s;
}
.thumb-anchor:hover {
  color: rgba(201,169,110,0.6);
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
          alt="Voix Vive — You are an instrument playing an instrument"
          className="wordmark-img"
          draggable={false}
        />
      </motion.div>

      {/* ── Academy Manifesto ── */}
      <motion.div
        className="manifesto-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      >
        <div className="manifesto-card">
          <p className="manifesto-kicker">
            {locale === 'fr' ? 'Une académie de la personne entière' : 'A whole-person academy'}
          </p>
          
          <h1 className="manifesto-tagline" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
            fontWeight: "400",
            color: "#c9a96e",
            textAlign: "center",
            lineHeight: "1.2",
            marginBottom: "24px",
            fontStyle: "italic",
            textShadow: "0 2px 12px rgba(201,169,110,0.15)"
          }}>
            {locale === 'fr' 
              ? 'Vous êtes un instrument qui joue d\u2019un instrument.' 
              : 'You are an instrument playing an instrument.'}
          </h1>

          <h2 className="manifesto-title" style={{ marginTop: '12px' }}>
            {locale === 'fr'
              ? 'Ce n\u2019est pas un cours de guitare.'
              : 'This is not a guitar course.'}
          </h2>
          <p className="manifesto-body">
            {locale === 'fr'
              ? 'Voix Vive est un voyage de 12 frettes à travers le silence, le son et la chanson \u2014 guidé par l\u2019IA, ancré par un maître. Chaque intervalle chromatique enseigne quelque chose que les livres ne peuvent pas.'
              : 'Voix Vive is a 12-fret journey from silence to song \u2014 AI-guided, master-anchored. Each chromatic interval teaches something that books cannot.'}
          </p>
          <div className="manifesto-pillars">
            <div className="manifesto-pillar">
              <span className="manifesto-pillar-icon">
                {/* BE — Triskelion Spiral: breath, being, stillness */}
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="beGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(201,169,110,0.15)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="beStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c9a96e" />
                      <stop offset="50%" stopColor="#e8d5a8" />
                      <stop offset="100%" stopColor="#c9a96e" />
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="25" fill="url(#beGlow)" />
                  {/* Triple spiral — triskelion */}
                  <path d="M26 26 C26 20, 20 16, 18 20 C16 24, 20 26, 26 26" stroke="url(#beStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
                  <path d="M26 26 C30 30, 36 28, 34 24 C32 20, 28 22, 26 26" stroke="url(#beStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
                  <path d="M26 26 C22 30, 22 36, 26 34 C30 32, 28 28, 26 26" stroke="url(#beStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
                  {/* Outer breath rings */}
                  <circle cx="26" cy="26" r="18" stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.25" strokeDasharray="3 5" />
                  <circle cx="26" cy="26" r="23" stroke="#c9a96e" strokeWidth="0.4" fill="none" opacity="0.12" strokeDasharray="2 6" />
                  {/* Center dot */}
                  <circle cx="26" cy="26" r="2" fill="#c9a96e" opacity="0.6" />
                </svg>
              </span>
              <span className="manifesto-pillar-label">{locale === 'fr' ? 'Être' : 'Be'}</span>
              <span className="manifesto-pillar-sub">{locale === 'fr' ? 'Respirer · Écouter' : 'Breathe · Listen'}</span>
            </div>
            <div className="manifesto-pillar">
              <span className="manifesto-pillar-icon">
                {/* DO — Vibrating Strings: practice, tension, craft */}
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="doGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(122,170,136,0.12)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="doStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7aaa88" />
                      <stop offset="50%" stopColor="#b8d4be" />
                      <stop offset="100%" stopColor="#7aaa88" />
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="25" fill="url(#doGlow)" />
                  {/* Five vibrating strings */}
                  <path d="M14 10 Q26 24, 14 42" stroke="url(#doStroke)" strokeWidth="1" fill="none" opacity="0.4" />
                  <path d="M20 8 Q30 22, 20 44" stroke="url(#doStroke)" strokeWidth="1.2" fill="none" opacity="0.55" />
                  <path d="M26 7 Q34 26, 26 45" stroke="url(#doStroke)" strokeWidth="1.5" fill="none" opacity="0.8" />
                  <path d="M32 8 Q38 22, 32 44" stroke="url(#doStroke)" strokeWidth="1.2" fill="none" opacity="0.55" />
                  <path d="M38 10 Q44 24, 38 42" stroke="url(#doStroke)" strokeWidth="1" fill="none" opacity="0.4" />
                  {/* Bridge lines */}
                  <line x1="12" y1="14" x2="40" y2="14" stroke="#7aaa88" strokeWidth="0.6" opacity="0.3" />
                  <line x1="12" y1="38" x2="40" y2="38" stroke="#7aaa88" strokeWidth="0.6" opacity="0.3" />
                  {/* Resonance dot */}
                  <circle cx="26" cy="26" r="2" fill="#7aaa88" opacity="0.5" />
                </svg>
              </span>
              <span className="manifesto-pillar-label">{locale === 'fr' ? 'Faire' : 'Do'}</span>
              <span className="manifesto-pillar-sub">{locale === 'fr' ? 'Pratiquer · Construire' : 'Practice · Build'}</span>
            </div>
            <div className="manifesto-pillar">
              <span className="manifesto-pillar-icon">
                {/* PLAY — Radiating Resonance: creation, performance, expression */}
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="playGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(192,120,152,0.12)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="playStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c07898" />
                      <stop offset="50%" stopColor="#e0a8c0" />
                      <stop offset="100%" stopColor="#c07898" />
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="25" fill="url(#playGlow)" />
                  {/* Radiating sound waves */}
                  <path d="M26 18 Q32 22, 26 26 Q20 30, 26 34" stroke="url(#playStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                  <path d="M20 14 Q28 20, 20 26 Q12 32, 20 38" stroke="#c07898" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
                  <path d="M32 14 Q40 20, 32 26 Q24 32, 32 38" stroke="#c07898" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
                  {/* Outer resonance arcs */}
                  <path d="M14 12 Q22 18, 14 26 Q6 34, 14 40" stroke="#c07898" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.2" />
                  <path d="M38 12 Q46 18, 38 26 Q30 34, 38 40" stroke="#c07898" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.2" />
                  {/* Center tone point */}
                  <circle cx="26" cy="26" r="2.5" fill="#c07898" opacity="0.6" />
                  <circle cx="26" cy="26" r="5" stroke="#c07898" strokeWidth="0.5" fill="none" opacity="0.3" />
                </svg>
              </span>
              <span className="manifesto-pillar-label">{locale === 'fr' ? 'Jouer' : 'Play'}</span>
              <span className="manifesto-pillar-sub">{locale === 'fr' ? 'Créer · Performer' : 'Create · Perform'}</span>
            </div>
          </div>
          <div className="manifesto-free-badge">
            <span>✦</span>
            <span>{locale === 'fr'
              ? '132 leçons · outils de pratique · IA Troubadour — tout gratuit'
              : '132 lessons · practice tools · Troubadour AI — all free'}</span>
          </div>
        </div>
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
          <AuthButton />
          <button
            onClick={toggleLocale}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#c9a96e',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(201,169,110,0.1)'}
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
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.12)',
            color: 'rgba(201,169,110,0.7)',
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            maxWidth: 400,
            textAlign: 'center',
            cursor: 'default',
          }}
        >
          <span>💾</span>
          <span>{locale === 'fr'
            ? 'Connectez-vous pour sauvegarder votre progression sur tous vos appareils'
            : 'Sign in to save your progress across all your devices'}</span>
        </motion.div>
      )}

      {/* ── Three Portal Cards ── */}
      <div className="portals-grid">
        {PORTALS.map((portal, idx) => (
          <motion.div
            key={portal.id}
            className="portal-card"
            style={{ '--portal-color': portal.color }}
            onClick={() => navigate(portal.path)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
          >
            {/* Art */}
            <img
              src={portal.image}
              alt={localize(portal.name)}
              className="portal-art"
              draggable={false}
            />

            {/* Info overlay */}
            <div className="portal-info">
              <div className="portal-text">
                <span className="portal-tag">{localize(portal.subtitle)}</span>
                <span className="portal-name">{localize(portal.name)}</span>
                <span className="portal-desc">{localize(portal.description)}</span>
              </div>
              <span className="portal-arrow">›</span>
            </div>
          </motion.div>
        ))}
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
        style={{ textAlign: 'center', marginTop: 32, marginBottom: 32 }}
      >
        <a
          href="/studio"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            color: 'rgba(201,169,110,0.5)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.8)'}
          onMouseLeave={e => e.target.style.color = 'rgba(201,169,110,0.5)'}
        >
          {t('learnWithBertrand')}
        </a>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(201,169,110,0.3)',
          marginTop: 8,
          letterSpacing: '0.1em',
        }}>
          {locale === 'fr' ? 'Mentorat privé · Critique vidéo · Cercle intérieur' : 'Private mentorship · Video critique · Inner Circle'}
        </p>
      </motion.div>

      {/* ── Creator Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: 48,
          marginBottom: 24,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(201,169,110,0.25)',
          letterSpacing: '0.15em',
          lineHeight: 1.8,
        }}>
          Built by{' '}
          <a
            href="https://LDTAtkinson.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(201,169,110,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(201,169,110,0.4)'}
          >
            Joshua Atkinson &middot; LDTAtkinson.com
          </a>
          <br />
          Pedagogy by{' '}
          <a
            href="https://bertrandguitarstudio.duetpartner.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(201,169,110,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(201,169,110,0.4)'}
          >
            Bertrand Laurence
          </a>
          <br />
          <a
            href="/guitar/map"
            style={{
              color: 'rgba(201,169,110,0.25)',
              textDecoration: 'none',
              fontSize: '0.55rem',
              transition: 'color 0.3s',
              marginRight: 12,
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.5)'}
            onMouseLeave={e => e.target.style.color = 'rgba(201,169,110,0.25)'}
          >
            Maturation Map
          </a>
          <span style={{ color: 'rgba(201,169,110,0.15)', marginRight: 12 }}>&middot;</span>
          <a
            href="/mentor"
            style={{
              color: 'rgba(201,169,110,0.25)',
              textDecoration: 'none',
              fontSize: '0.55rem',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.5)'}
            onMouseLeave={e => e.target.style.color = 'rgba(201,169,110,0.25)'}
          >
            Mentor Portal
          </a>
          <span style={{ color: 'rgba(201,169,110,0.15)', margin: '0 12px' }}>&middot;</span>
          <a
            href="/poc"
            style={{
              color: 'rgba(239,68,68,0.4)',
              textDecoration: 'none',
              fontSize: '0.55rem',
              fontWeight: 'bold',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(239,68,68,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(239,68,68,0.4)'}
          >
            Engine POC
          </a>
          <span style={{ color: 'rgba(201,169,110,0.15)', margin: '0 12px' }}>&middot;</span>
          <a
            href="/walking"
            style={{
              color: 'rgba(56,189,248,0.4)',
              textDecoration: 'none',
              fontSize: '0.55rem',
              fontWeight: 'bold',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(56,189,248,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(56,189,248,0.4)'}
          >
            Voix Vive Engine →
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
