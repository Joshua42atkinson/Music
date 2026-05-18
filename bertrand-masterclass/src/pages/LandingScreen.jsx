import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// LANDING SCREEN — "The Trinity"
// Three portals: The Song, The Guitar, The Player
// Voix Vive wordmark header + generated symbolic art cards
// ═══════════════════════════════════════════════════════════

const PORTALS = [
  {
    id: 'song',
    name: 'The Song',
    subtitle: '12-Fret Curriculum',
    path: '/song',
    color: '#c9a96e',
    image: '/assets/portal_song.png',
    description: 'The Monomyth Journey',
  },
  {
    id: 'guitar',
    name: 'The Guitar',
    subtitle: 'Fretboard Explorer',
    path: '/guitar',
    color: '#7aaa88',
    image: '/assets/portal_guitar.png',
    description: 'The Rosetta Stone',
  },
  {
    id: 'player',
    name: 'The Player',
    subtitle: 'Practice Tools',
    path: '/player',
    color: '#c07898',
    image: '/assets/portal_player.png',
    description: 'Body Intelligence',
  },
];

export default function LandingScreen() {
  const navigate = useNavigate();

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
          max-width: 480px;
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
          font-size: 0.55rem;
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
          max-width: 480px;
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
          font-size: 0.5rem;
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
          font-size: 0.7rem;
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
          font-size: 0.45rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.25);
        }

        @keyframes breath {
          0%, 100% { opacity: 0.5; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.03); }
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
        Choose your portal
      </motion.p>

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
              alt={portal.name}
              className="portal-art"
              draggable={false}
            />

            {/* Info overlay */}
            <div className="portal-info">
              <div className="portal-text">
                <span className="portal-tag">{portal.subtitle}</span>
                <span className="portal-name">{portal.name}</span>
                <span className="portal-desc">{portal.description}</span>
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
    </div>
  );
}
