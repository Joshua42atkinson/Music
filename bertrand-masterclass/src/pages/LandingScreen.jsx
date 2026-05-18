import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Hexagon, Sword, Circle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// LANDING SCREEN — "The Thumb / The Observer"
// Zen Constructivism: Show, don't tell.
// ═══════════════════════════════════════════════════════════

const PORTALS = [
  {
    id: 'song',
    icon: <Compass size={48} strokeWidth={1} />,
    path: '/song',
    color: '#c9a96e', // Gold
  },
  {
    id: 'guitar',
    icon: <Hexagon size={48} strokeWidth={1} />,
    path: '/guitar',
    color: '#7aaa88', // Sage
  },
  {
    id: 'player',
    icon: <Sword size={48} strokeWidth={1} />,
    path: '/player',
    color: '#aa5a7a', // Rose
  },
];

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-hub">
      <style>{`
        .landing-hub {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(180deg, #050508 0%, #12100e 50%, #050508 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 26px; /* Golden Ratio proximity math */
          position: relative;
          overflow: hidden;
        }

        /* Ambient glowing orb in the center (The Palm) */
        .landing-hub::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw; height: 90vw;
          max-width: 600px; max-height: 600px;
          background: radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* Trinity Layout for the 3 portals */
        .portals-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px; /* CRAP: Proximity */
          width: 100%;
          max-width: 200px;
          position: relative;
          z-index: 1;
          margin-bottom: 64px; /* Golden ratio spacing before the thumb */
        }

        .portal-card {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px; /* Golden math curve */
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }

        .portal-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--portal-color);
          opacity: 0.6;
          transition: height 0.4s, opacity 0.4s;
        }

        .portal-card:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.1);
        }

        .portal-card:hover::before {
          height: 100%;
          opacity: 0.08;
        }

        .portal-card:active {
          transform: scale(0.96);
        }

        .portal-icon {
          color: var(--portal-color);
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
          transition: all 0.4s ease;
        }

        .portal-card:hover .portal-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 16px var(--portal-color));
        }

        /* The Thumb / Observer anchoring the bottom */
        .thumb-anchor {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          color: rgba(201,169,110,0.4);
          animation: breath 4s ease-in-out infinite;
        }

        @keyframes breath {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

      `}</style>

      {/* The 4 Horses / 4 Fingers */}
      <div className="portals-grid">
        {PORTALS.map((portal, idx) => (
          <motion.div
            key={portal.id}
            className="portal-card"
            style={{ '--portal-color': portal.color }}
            onClick={() => navigate(portal.path)}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 + (idx * 0.1), duration: 0.6, ease: "easeOut" }}
          >
            <div className="portal-icon">{portal.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* The Charioteer / The Thumb */}
      <motion.div 
        className="thumb-anchor"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      >
        <Circle size={32} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
