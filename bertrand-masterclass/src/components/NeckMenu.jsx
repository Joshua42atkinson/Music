import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';

const DOT_FRETS = [3, 5, 7, 9];
const DOUBLE_DOT_FRETS = [12];

const NeckMenu = ({ 
  items, 
  activeId, 
  onItemClick, 
  renderContent, 
  headerTitle, 
  headerSubtitle, 
  headerContent,
  showBackButton = true,
  children
}) => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? (val[locale] || val['en']) : val);

  return (
    <div className="neck-container">
      <style>{`
        .neck-container {
          min-height: 100vh;
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          background: linear-gradient(180deg,
            #0d0d14 0%,
            #12100e 8%,
            #1a1510 20%,
            #1a1510 80%,
            #12100e 95%,
            #0d0d14 100%
          );
        }
        @media (min-width: 768px) {
          .neck-container {
            max-width: 600px;
          }
        }

        /* ═══════ THE NUT / HEADSTOCK ═══════ */
        .neck-nut {
          position: relative;
          padding: 44px 24px 32px;
          padding-top: max(44px, calc(env(safe-area-inset-top) + 24px));
          text-align: center;
          z-index: 5;
          background: radial-gradient(
            ellipse at 50% 80%,
            rgba(201, 169, 110, 0.08) 0%,
            transparent 60%
          );
        }
        .neck-nut::after {
          content: '';
          position: absolute;
          bottom: 0; left: 6%; right: 6%;
          height: 5px;
          background: linear-gradient(90deg,
            rgba(120,100,60,0.2),
            rgba(200,180,130,0.7),
            rgba(240,230,200,0.95),
            rgba(200,180,130,0.7),
            rgba(120,100,60,0.2)
          );
          border-radius: 2px;
          box-shadow:
            0 0 8px rgba(212,175,55,0.3),
            0 2px 4px rgba(0,0,0,0.5);
        }
        .neck-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 8vw, 2.8rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 6px;
          line-height: 1.1;
          text-shadow: 0 2px 12px rgba(201,169,110,0.3);
        }
        .neck-tagline {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: #7aaa88;
          margin: 0 0 20px;
          text-shadow: 0 1px 8px rgba(122,170,136,0.2);
        }

        /* ═══════ THE NECK ═══════ */
        .neck-board {
          position: relative;
          padding: 0 16px 120px;
        }

        /* Wood grain texture */
        .neck-board::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          left: 16px; right: 16px;
          background:
            repeating-linear-gradient(180deg,
              rgba(80, 55, 30, 0.06) 0px,
              transparent 2px,
              transparent 8px,
              rgba(80, 55, 30, 0.04) 10px
            ),
            linear-gradient(180deg,
              rgba(58, 40, 24, 0.3) 0%,
              rgba(42, 28, 16, 0.25) 30%,
              rgba(52, 36, 22, 0.28) 60%,
              rgba(42, 28, 16, 0.25) 100%
            );
          pointer-events: none;
          z-index: 0;
          border-left: 2px solid rgba(90, 65, 35, 0.25);
          border-right: 2px solid rgba(90, 65, 35, 0.25);
        }

        /* Strings — 6 vertical metallic lines */
        .neck-strings {
          position: absolute;
          top: 0; bottom: 0;
          left: 36px; right: 36px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 1;
        }
        .neck-string {
          height: 100%;
          background: linear-gradient(180deg,
            rgba(220, 200, 160, 0.25),
            rgba(200, 180, 140, 0.15),
            rgba(220, 200, 160, 0.25)
          );
          box-shadow: 0 0 2px rgba(220, 200, 160, 0.1);
        }
        .neck-string:nth-child(1) { width: 3px; opacity: 0.35; }
        .neck-string:nth-child(2) { width: 2.5px; opacity: 0.3; }
        .neck-string:nth-child(3) { width: 2px; opacity: 0.25; }
        .neck-string:nth-child(4) { width: 1.5px; opacity: 0.25; }
        .neck-string:nth-child(5) { width: 1px; opacity: 0.22; }
        .neck-string:nth-child(6) { width: 0.5px; opacity: 0.2; }

        /* ═══════ ACT LABEL ═══════ */
        .neck-act {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8a7a5a;
          padding: 20px 8px 8px;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* ═══════ FRET CARD ═══════ */
        .neck-fret {
          position: relative;
          z-index: 2;
          margin-bottom: 0;
        }
        /* Fret wire — thin metallic bar between cards */
        .neck-fret::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -4px; right: -4px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(140,120,80,0.05),
            rgba(190,170,120,0.35),
            rgba(230,220,190,0.55),
            rgba(190,170,120,0.35),
            rgba(140,120,80,0.05)
          );
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          z-index: 3;
        }

        .neck-fret-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 12px;
          background: rgba(35, 25, 15, 0.35);
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          border-left: 1px solid rgba(120, 90, 50, 0.08);
          border-right: 1px solid rgba(120, 90, 50, 0.08);
        }
        .neck-fret-card:hover {
          background: rgba(50, 35, 20, 0.5);
        }
        .neck-fret-card:active {
          transform: scale(0.98);
        }
        .neck-fret-card.active {
          background: rgba(80, 60, 30, 0.4);
          border-color: rgba(201,169,110,0.4);
        }

        /* Subtle colored glow from the left for each fret */
        .neck-fret-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Fret number badge */
        .neck-fret-num {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.4rem;
          position: relative;
          z-index: 1;
        }
        /* Glow ring around the icon */
        .neck-fret-num::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0.2;
          transition: opacity 0.3s;
        }
        .neck-fret-card:hover .neck-fret-num::after,
        .neck-fret-card.active .neck-fret-num::after {
          opacity: 0.5;
        }

        .neck-fret-info {
          flex: 1;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        .neck-fret-interval {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 3px;
          font-weight: 600;
        }
        .neck-fret-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #f0e6d2;
          line-height: 1.2;
          margin-bottom: 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .neck-fret-sub {
          font-size: 0.9rem;
          color: #8a7a60;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .neck-fret-arrow {
          font-family: 'JetBrains Mono', monospace;
          color: #5a4a30;
          font-size: 1rem;
          flex-shrink: 0;
          transition: all 0.2s;
          z-index: 1;
        }
        .neck-fret-card:hover .neck-fret-arrow,
        .neck-fret-card.active .neck-fret-arrow {
          color: #c9a96e;
          transform: translateX(2px) rotate(90deg);
        }

        /* ═══════ INLAY DOTS ═══════ */
        .neck-dot-row {
          display: flex;
          justify-content: center;
          gap: 14px;
          padding: 6px 0;
          position: relative;
          z-index: 2;
        }
        .neck-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(240, 230, 200, 0.3),
            rgba(201, 169, 110, 0.12) 60%,
            rgba(160, 140, 100, 0.08) 100%
          );
          box-shadow:
            inset 0 1px 2px rgba(255,255,255,0.15),
            0 0 6px rgba(201, 169, 110, 0.15);
          border: 1px solid rgba(201, 169, 110, 0.08);
        }

        /* ═══════ 12TH FRET ═══════ */
        .neck-fret-12 {
          margin-top: 4px;
        }
        .neck-fret-12 .neck-fret-card {
          background: linear-gradient(135deg,
            rgba(0, 210, 211, 0.06) 0%,
            rgba(35, 25, 15, 0.3) 50%,
            rgba(0, 210, 211, 0.04) 100%
          );
          border: 1px solid rgba(0, 210, 211, 0.12);
          border-radius: 12px;
        }
        .neck-fret-12::after { display: none; }

        .back-to-portal {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: max(16px, env(safe-area-inset-right));
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(201,169,110,0.7);
          cursor: pointer;
          background: rgba(201,169,110,0.06);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.2s;
          min-height: 36px;
        }
        .back-to-portal:hover {
          color: #c9a96e;
          background: rgba(201,169,110,0.12);
          border-color: rgba(201,169,110,0.35);
        }

        .neck-content-wrapper {
          position: relative;
          z-index: 10;
          background: rgba(10, 10, 15, 0.95);
          border-left: 1px solid rgba(201,169,110,0.2);
          border-right: 1px solid rgba(201,169,110,0.2);
          border-bottom: 1px solid rgba(201,169,110,0.2);
          margin: 0 16px;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* ═══════ THE NUT / HEADSTOCK ═══════ */}
      <div className="neck-nut">
        {showBackButton && (
          <button className="back-to-portal" onClick={() => navigate('/')} aria-label="Return to portal">
            <img
              src="/assets/wordmark.png"
              alt="Voix Vive"
              className="h-8 w-auto"
              draggable={false}
            />
          </button>
        )}
        <motion.h1
          className="neck-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {headerTitle}
        </motion.h1>
        {headerSubtitle && (
          <motion.p
            className="neck-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {headerSubtitle}
          </motion.p>
        )}
        {headerContent && (
          <div style={{ marginTop: 16 }}>
            {headerContent}
          </div>
        )}
      </div>

      <div className="neck-board">
        {/* 6 Strings */}
        <div className="neck-strings">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="neck-string" />
          ))}
        </div>

        {/* Frets */}
        {items.map((item, idx) => {
          const currentAct = localize(item.act);
          const prevAct = idx > 0 ? localize(items[idx - 1].act) : null;
          const showAct = currentAct && currentAct !== prevAct;
          const hasDot = DOT_FRETS.includes(item.fret);
          const hasDoubleDot = DOUBLE_DOT_FRETS.includes(item.fret);
          const isOctave = item.fret === 12;
          const isActive = activeId === item.id;

          return (
            <React.Fragment key={item.id}>
              {showAct && <div className="neck-act">{currentAct}</div>}

              <div className={`neck-fret ${isOctave ? 'neck-fret-12' : ''}`}>
                <motion.div
                  className={`neck-fret-card ${isActive ? 'active' : ''}`}
                  onClick={() => onItemClick(item.id)}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  style={{ '--fret-color': item.color }}
                >
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 50,
                    background: `linear-gradient(90deg, ${item.color}12, transparent)`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }} />

                  <div
                    className="neck-fret-num"
                    style={{
                      background: `radial-gradient(circle at 40% 40%, ${item.color}30, ${item.color}10 70%)`,
                      boxShadow: `0 0 12px ${item.color}15, inset 0 1px 2px rgba(255,255,255,0.1)`,
                    }}
                  >
                    <span style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}>
                      {item.symbol}
                    </span>
                    <div style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '50%',
                      border: `1px solid ${item.color}25`,
                    }} />
                  </div>

                  <div className="neck-fret-info">
                    <div className="neck-fret-interval" style={{ color: item.color }}>
                      Fret {item.fret} {item.interval ? `· ${localize(item.interval)}` : ''}
                    </div>
                    <div className="neck-fret-title">{localize(item.title)}</div>
                    <div className="neck-fret-sub">{localize(item.subtitle)}</div>
                  </div>

                  <span className="neck-fret-arrow">›</span>
                </motion.div>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {isActive && renderContent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="neck-content-wrapper"
                  >
                    {renderContent(item)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inlay dots */}
              {hasDot && !isOctave && (
                <div className="neck-dot-row">
                  <div className="neck-dot" />
                </div>
              )}
              {hasDoubleDot && (
                <div className="neck-dot-row">
                  <div className="neck-dot" />
                  <div className="neck-dot" />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Custom children (like Practice Log) */}
        {children && (
          <div style={{ position: 'relative', zIndex: 10, padding: '20px 16px' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeckMenu;
