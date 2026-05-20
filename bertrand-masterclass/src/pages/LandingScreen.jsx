import React, { useState, useEffect, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';
import CoachingPortal from '../components/CoachingPortal';
import ProfileModal from '../components/ProfileModal';
const AdventurePlayer = React.lazy(() => import('../game/AdventurePlayer'));
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// LANDING SCREEN — "The Trinity"
// Three portals: The Song, The Guitar, The Player
// Voix Vive wordmark header + generated symbolic art cards
// ═══════════════════════════════════════════════════════════

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
    subtitle: { en: 'Breathe & Record', fr: 'Respirer & Enregistrer' },
    path: '/player',
    color: '#c07898',
    image: '/assets/portal_player.png',
    description: { en: 'Take care of yourself as a musician', fr: 'Prenez soin de vous en tant que musicien' },
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
  const [showCoaching, setShowCoaching] = useState(false);
  const { isFrench, toggleLocale, t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (isFrench ? val.fr : val.en) : val);

  const { 
    getProfiles, upsertProfile
  } = useBackendBridge();
  
  const [profiles, setProfiles] = useState([]);
  const [activeProfileName, setActiveProfileName] = useState(() => {
    return localStorage.getItem('active_student_profile') || 'Jean-Luc';
  });
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileStyle, setNewProfileStyle] = useState('Acoustic');
  const [newProfilePin, setNewProfilePin] = useState('');

  // Adventure state
  const [showAdventure, setShowAdventure] = useState(false);

  useEffect(() => {
    const syncProfiles = async () => {
      try {
        let list = await getProfiles();
        
        if (list.length === 0) {
          const defaultProfiles = [
            { id: 'jean-luc', name: 'Jean-Luc', current_chapter: 1, xp: 120, coaching_tier: 'premium', florins: 150 },
            { id: 'clara-laurent', name: 'Dr. Clara Laurent', current_chapter: 3, xp: 350, coaching_tier: 'premium', florins: 420 },
            { id: 'marcellus', name: 'Marcellus Henderson', current_chapter: 2, xp: 210, coaching_tier: 'free', florins: 80 }
          ];
          for (const p of defaultProfiles) {
            await upsertProfile(p);
          }
          list = await getProfiles();
        }
        setProfiles(list);

        const found = list.find(p => p.name === activeProfileName);
        if (!found && list.length > 0) {
          setActiveProfileName(list[0].name);
          localStorage.setItem('active_student_profile', list[0].name);
        }
      } catch (error) {
        console.error('[LandingScreen] Profile sync failed:', error);
        // Use local fallback profiles if backend fails
        const fallbackProfiles = [
          { id: 'jean-luc', name: 'Jean-Luc', current_chapter: 1, xp: 120, coaching_tier: 'premium', florins: 150 },
          { id: 'clara-laurent', name: 'Dr. Clara Laurent', current_chapter: 3, xp: 350, coaching_tier: 'premium', florins: 420 },
          { id: 'marcellus', name: 'Marcellus Henderson', current_chapter: 2, xp: 210, coaching_tier: 'free', florins: 80 }
        ];
        setProfiles(fallbackProfiles);
      }
    };

    syncProfiles();
  }, [getProfiles, upsertProfile, activeProfileName]);


  return (
    <div className="landing-hub">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-hub {
          min-height: 100vh;
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

        /* Text overlay pinned to bottom */
        .portal-info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 20px 18px;
          background: linear-gradient(transparent 0%, rgba(5,5,8,0.92) 50%);
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
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
          flex-shrink: 0;
        }
        .bertrand-banner-btn:hover {
          background: linear-gradient(135deg, rgba(201,169,110,0.3), rgba(201,169,110,0.1));
          box-shadow: 0 4px 16px rgba(201,169,110,0.15);
        }

        /* ── THUMB ANCHOR ── */
        .thumb-anchor {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
          margin-top: 32px;
          color: rgba(201,169,110,0.3);
          animation: breath 5s ease-in-out infinite;
        }

        .thumb-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.25);
        }

        @keyframes breath {
          0%, 100% { opacity: 0.5; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        /* ── PROFILE SWITCHER HEADER ── */
        .profile-switcher-bar {
          width: 100%;
          max-width: 540px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          margin-top: 4px;
          margin-bottom: 20px;
          border-radius: 12px;
          background: rgba(201, 169, 110, 0.03);
          border: 1px solid rgba(201, 169, 110, 0.15);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 100;
        }
        .profile-selector-dropdown {
          background: #0d0d14;
          border: 1px solid rgba(201, 169, 110, 0.25);
          color: #c9a96e;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .profile-selector-dropdown:hover {
          border-color: #c9a96e;
          box-shadow: 0 0 10px rgba(201, 169, 110, 0.2);
        }
        .profile-info-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(201,169,110,0.55);
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

      {/* ── Trinity label ── */}
      <motion.p
        className="trinity-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {t('choosePortal')}
      </motion.p>

      {/* ── Zen Student Profile Switcher Header ── */}
      <motion.div
        className="profile-switcher-bar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="profile-info-label">{t('studentProfile')}</span>
          <select
            className="profile-selector-dropdown"
            value={activeProfileName}
            onChange={(e) => {
              if (e.target.value === 'NEW') {
                setShowProfileModal(true);
              } else {
                setActiveProfileName(e.target.value);
                localStorage.setItem('active_student_profile', e.target.value);
              }
            }}
          >
            {profiles.map(p => (
              <option key={p.id} value={p.name}>
                ⚜️ {p.name} ({isFrench ? (p.coaching_tier === 'Acoustic' ? 'Acoustique' : p.coaching_tier === 'Classical' ? 'Classique' : p.coaching_tier) : p.coaching_tier})
              </option>
            ))}
            <option value="NEW">{t('createNewProfile')}</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowAdventure(true)}
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #a3844d 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#050508',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(201, 169, 110, 0.25)',
              transition: 'all 0.3s'
            }}
          >
            {t('playAdventure')}
          </button>

          <button
            onClick={toggleLocale}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#f0e6d2',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            🌐 {isFrench ? 'EN' : 'FR'}
          </button>
        </div>
      </motion.div>

      {/* ── Bertrand Marketing Banner (always visible) ── */}
      <motion.div
        className="bertrand-banner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="bertrand-banner-text">
          <span className="bertrand-banner-title">
            {isFrench ? 'Apprenez avec Bertrand →' : 'Learn with Bertrand →'}
          </span>
          <span className="bertrand-banner-sub">
            {t('privateLessons')}
          </span>
        </div>
        <button
          className="bertrand-banner-btn"
          onClick={() => setShowCoaching(true)}
        >
          {isFrench ? '⚜️ Coaching' : '⚜️ Book a Lesson'}
        </button>
      </motion.div>



      {/* ── Create Profile Modal ── */}
      <ProfileModal
        show={showProfileModal}
        newProfileName={newProfileName}
        setNewProfileName={setNewProfileName}
        newProfileStyle={newProfileStyle}
        setNewProfileStyle={setNewProfileStyle}
        newProfilePin={newProfilePin}
        setNewProfilePin={setNewProfilePin}
        onClose={() => { setShowProfileModal(false); setNewProfilePin(''); setNewProfileName(''); }}
        onCreate={async () => {
          if (!newProfileName.trim()) return;
          const id = newProfileName.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const profileObj = {
            id,
            name: newProfileName.trim(),
            current_chapter: 1,
            xp: 0,
            coaching_tier: newProfileStyle,
            pin: newProfilePin || null
          };
          await upsertProfile(profileObj);
          const list = await getProfiles();
          setProfiles(list);
          setActiveProfileName(profileObj.name);
          localStorage.setItem('active_student_profile', profileObj.name);
          setShowProfileModal(false);
          setNewProfileName('');
          setNewProfilePin('');
        }}
      />

      {/* ── Troubadour Adventure (full-screen overlay) ── */}
      <AnimatePresence>
        {showAdventure && (
          <Suspense fallback={
            <div style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: '#030306', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: '1px solid rgba(201,169,110,0.3)',
                animation: 'breatheLoad 3s ease-in-out infinite',
              }} />
              <style>{`@keyframes breatheLoad { 0%,100%{opacity:.3;transform:scale(.95)} 50%{opacity:1;transform:scale(1.05)} }`}</style>
            </div>
          }>
            <AdventurePlayer onClose={() => setShowAdventure(false)} />
          </Suspense>
        )}
      </AnimatePresence>

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

      {/* ── Studio Doorway ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ textAlign: 'center', marginTop: 24, marginBottom: 32 }}
      >
        <a
          href="/studio"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.05rem',
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
          color: 'rgba(201,169,110,0.2)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 6,
        }}>
          {t('privateLessons')}
        </p>

        {/* Somatic Onboarding Trigger */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowCoaching(true)}
            style={{
              padding: '12px 28px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.02))',
              border: '1px solid rgba(201,169,110,0.25)',
              color: '#c9a96e',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(201,169,110,0.05)',
              transition: 'all 0.3s',
            }}
          >
            {t('privateCoachingIntake')}
          </button>
        </div>
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
