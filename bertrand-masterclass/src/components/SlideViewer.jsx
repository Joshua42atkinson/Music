import React, { useState, useCallback, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import frets from '../data/chapterData';
import { generateSlides } from '../data/slideGenerator';
import FretboardSheet from './FretboardSheet';
import PlingTrainer from './PlingTrainer';
import { TOOLS_CATALOG } from '../data/toolsData';
import { saveSlidePosition, getSlidePosition } from '../data/localDatabase';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// SLIDE VIEWER — Phone-native swipeable chapter reader
// Portrait: image top, text bottom
// Landscape: image left, text right
// Swipe left/right to navigate slides
// Integrated FretboardSheet bottom-sheet overlay
// ═══════════════════════════════════════════════════════════

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 300;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 })
};

const SlideViewer = ({ fretId = 1, onBack, onFretChange }) => {
  const { locale, isFrench } = useLocale();

  const localize = useCallback((val) => {
    if (!val) return '';
    if (typeof val === 'object') {
      return val[locale] || val['en'] || '';
    }
    return val;
  }, [locale]);

  const fret = frets.find(c => c.id === fretId) || frets[0];
  const slides = useMemo(() => generateSlides(fret), [fret]);
  // Initialize from the student's last saved position for this fret
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = getSlidePosition(fretId);
    // Clamp to valid range in case slide count changed
    return Math.min(saved, slides.length - 1);
  });
  const [direction, setDirection] = useState(0);
  const [fretboardOpen, setFretboardOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(() => {
    try {
      return !localStorage.getItem('voix_vive_swipe_hint_seen');
    } catch {
      return true;
    }
  });
  const slide = slides[currentIdx];

  // Show swipe hint only once, ever
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem('voix_vive_swipe_hint_seen', '1');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  const goTo = useCallback((idx, dir) => {
    if (idx < 0 || idx >= slides.length) return;
    setDirection(dir);
    setCurrentIdx(idx);
    // Persist position so student can resume where they left off
    saveSlidePosition(fretId, idx);
  }, [slides, fretId]);

  const handleNext = () => goTo(currentIdx + 1, 1);
  const handlePrev = () => goTo(currentIdx - 1, -1);

  const handleDragEnd = (e, info) => {
    // Don't process slide swipes if fretboard is open
    if (fretboardOpen) return;
    // Dismiss swipe hint on first swipe
    if (showSwipeHint) {
      setShowSwipeHint(false);
      localStorage.setItem('voix_vive_swipe_hint_seen', '1');
    }
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY) handleNext();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY) handlePrev();
  };

  const goNextFret = () => {
    const nextId = fretId < 12 ? fretId + 1 : 1;
    setCurrentIdx(0);
    if (onFretChange) onFretChange(nextId);
  };

  const openFretboard = () => {
    setFretboardOpen(true);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  return (
    <div className="sv-wrapper">
      <div className="sv-container">
      <style>{`
        .sv-wrapper {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .sv-wrapper {
            background: rgba(3, 3, 6, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            pointer-events: auto;
          }
        }
        .sv-container {
          position: absolute; inset: 0;
          background: #030306;
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
          color: #e0e0ff;
          overflow: hidden;
          touch-action: pan-y;
          pointer-events: auto;
        }
        @media (min-width: 768px) {
          .sv-container {
            position: relative; inset: auto;
            width: 100%; max-width: 440px;
            height: 90vh; max-height: 900px;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 40px 80px rgba(0,0,0,0.8);
          }
        }
        .sv-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          padding-top: max(12px, env(safe-area-inset-top));
          background: rgba(8,8,14,0.7);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          z-index: 10; flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sv-back {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          color: #a0aab8; border-radius: 8px;
          font-size: 0.8rem; cursor: pointer; padding: 8px 14px;
          font-family: 'JetBrains Mono', monospace;
          display: flex; align-items: center; gap: 6px; transition: all 0.2s;
          min-height: 44px;
        }
        .sv-back:hover { color: #c9a96e; border-color: rgba(201,169,110,0.3); }
        .sv-back:active { transform: scale(0.95); }
        .sv-chapter-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: #5a6a80;
          max-width: 40%; text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .sv-page-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px;
        }
        .sv-progress { height: 3px; background: rgba(255,255,255,0.03); flex-shrink: 0; }
        .sv-progress-fill {
          height: 100%; transition: width 0.3s ease; border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px currentColor;
        }
        .sv-slide-area { flex: 1; position: relative; overflow: hidden; }
        .sv-slide { position: absolute; inset: 0; display: flex; flex-direction: column; cursor: grab; }
        .sv-slide:active { cursor: grabbing; }
        .sv-image-zone {
          flex-shrink: 0; height: 38vh; min-height: 200px; max-height: 340px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .sv-image-zone img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.9;
          transition: opacity 1.5s ease-in-out;
        }
        .sv-image-gradient {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .sv-image-icon {
          font-size: 4.5rem; opacity: 0.5;
          filter: drop-shadow(0 0 40px rgba(255,255,255,0.1));
        }
        .sv-image-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(transparent, #030306);
        }
        .sv-text-zone {
          flex: 1; overflow-y: auto; padding: 28px 24px 120px;
          -webkit-overflow-scrolling: touch;
          background: rgba(6,6,12,0.8);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .sv-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.22em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .sv-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 7vw, 2.8rem);
          font-weight: 400; color: #e8edf2;
          margin-bottom: 16px; line-height: 1.1;
        }
        .sv-subtitle {
          font-size: 0.95rem; color: #5a6a80;
          font-style: italic; margin-bottom: 8px;
        }
        .sv-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          letter-spacing: 0.1em; margin-bottom: 20px;
        }
        .sv-body {
          font-size: 1.05rem; line-height: 1.85;
          color: #b0b8c8;
        }
        .sv-body p { margin-bottom: 1.2em; }

        /* ── Quote Slide ── */
        .sv-quote {
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.3rem, 5vw, 1.8rem);
          font-style: italic; color: #7aaa88;
          line-height: 1.7; text-align: center;
          padding: 0 8px;
        }
        .sv-author {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          text-align: center; margin-top: 20px;
          letter-spacing: 0.1em;
        }

        /* ── Concept Slide ── */
        .sv-concept-term {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400;
          color: #e8edf2; margin-bottom: 16px;
        }
        .sv-concept-def {
          font-size: 1.1rem; line-height: 1.85;
          color: #b0b8c8;
        }

        /* ── Meditation Slide ── */
        .sv-meditation-prompt {
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem; font-style: italic;
          color: #e8edf2; line-height: 1.8;
          text-align: center; padding: 0 8px;
        }
        .sv-duration {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #7b6aaa;
          text-align: center; margin-top: 20px;
          letter-spacing: 0.15em;
        }

        /* ── Exercise Slide ── */
        .sv-step {
          display: flex; gap: 12px; align-items: flex-start;
          margin-bottom: 16px;
        }
        .sv-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
        }
        .sv-step-text {
          font-size: 1rem; line-height: 1.7; color: #b0b8c8;
        }

        /* ── End Slide ── */
        .sv-end-icon { font-size: 4rem; text-align: center; margin-bottom: 20px; }
        .sv-end-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; text-align: center;
          color: #e8edf2; margin-bottom: 12px;
        }
        .sv-end-body {
          font-size: 1rem; color: #8090a8;
          text-align: center; line-height: 1.7; margin-bottom: 30px;
        }
        .sv-next-btn {
          display: block; width: 100%; max-width: 300px;
          margin: 0 auto; padding: 14px 24px;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.35);
          color: #c9a96e; border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s; min-height: 48px;
        }
        .sv-next-btn:hover { background: rgba(201,169,110,0.22); }
        .sv-next-btn:active { transform: scale(0.97); }

        /* ── Fretboard FAB ── */
        .sv-fretboard-fab {
          display: flex; align-items: center; gap: 8px;
          margin-top: 20px; padding: 14px 20px;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.25);
          border-radius: 12px; cursor: pointer;
          transition: all 0.25s; color: #c9a96e;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.08em;
          min-height: 48px;
        }
        .sv-fretboard-fab:hover {
          background: rgba(201,169,110,0.2);
          border-color: rgba(201,169,110,0.45);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,169,110,0.15);
        }
        .sv-fretboard-fab:active { transform: scale(0.97); }
        .sv-fretboard-fab-icon { font-size: 1.4rem; }
        .sv-fretboard-fab-text {
          flex: 1; text-align: left;
        }
        .sv-fretboard-fab-arrow { opacity: 0.5; }

        /* ── Persistent fretboard toggle in nav ── */
        .sv-fret-toggle {
          background: rgba(201,169,110,0.08);
          border: 1px solid rgba(201,169,110,0.2);
          color: #c9a96e; width: 44px; height: 44px;
          border-radius: 50%; font-size: 1.2rem;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .sv-fret-toggle:hover, .sv-fret-toggle.active {
          background: rgba(201,169,110,0.2);
          border-color: rgba(201,169,110,0.5);
          box-shadow: 0 0 12px rgba(201,169,110,0.2);
        }

        /* ── Bottom Nav Dots ── */
        .sv-nav {
          position: absolute; bottom: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          background: linear-gradient(transparent, rgba(3,3,6,0.97));
          z-index: 10;
        }
        .sv-nav-btn {
          background: rgba(255,255,255,0.06); border: none;
          color: #8090a8; width: 44px; height: 44px;
          border-radius: 50%; font-size: 1.2rem;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .sv-nav-btn:hover { background: rgba(201,169,110,0.15); color: #c9a96e; }
        .sv-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .sv-nav-btn:active:not(:disabled) { transform: scale(0.9); }
        .sv-dots {
          display: flex; gap: 4px; align-items: center;
          max-width: 45%; overflow: hidden;
        }
        .sv-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: all 0.3s; flex-shrink: 0;
          cursor: pointer;
        }
        .sv-dot.active {
          width: 20px; border-radius: 3px;
        }

        /* ── Landscape ── */
        @media (orientation: landscape) and (max-height: 500px) {
          .sv-slide { flex-direction: row; }
          .sv-image-zone {
            height: auto; min-height: auto; max-height: none;
            width: 40%; flex-shrink: 0;
          }
          .sv-image-overlay {
            height: auto; width: 40px;
            top: 0; left: auto; right: 0; bottom: 0;
            background: linear-gradient(to left, #030306, transparent);
          }
          .sv-text-zone { padding: 20px 20px 80px; }
        }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="sv-topbar">
        <button className="sv-back" onClick={onBack}>{isFrench ? '← Retour' : '← Back'}</button>
        <span className="sv-chapter-label">{isFrench ? 'Ch.' : 'Ch.'}{fret.id} · {localize(fret.title)}</span>
        <span className="sv-page-num">{currentIdx + 1}/{slides.length}</span>
      </div>

      {/* ── Progress Bar ── */}
      <div className="sv-progress">
        <div className="sv-progress-fill" style={{
          width: `${((currentIdx + 1) / slides.length) * 100}%`,
          background: slide.accent,
          color: slide.accent
        }} />
      </div>

      {/* ── Slide Area ── */}
      <div className="sv-slide-area">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            className="sv-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 1.2 }}
            drag={fretboardOpen ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Image Zone */}
            <div className="sv-image-zone">
              {slide.image ? (
                <img src={slide.image} alt="" draggable={false} />
              ) : (
                <div className="sv-image-gradient" style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${slide.accent}20 0%, ${slide.accent}08 40%, #030306 100%)`
                }}>
                  {slide.icon && <span className="sv-image-icon">{slide.icon}</span>}
                </div>
              )}
              <div className="sv-image-overlay" />
            </div>

            {/* Text Zone */}
            <div className="sv-text-zone">
              <SlideContent
                slide={slide}
                onOpenFretboard={openFretboard}
                onNextFret={goNextFret}
                localize={localize}
                isFrench={isFrench}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint — shown only once on first-ever chapter view */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute', bottom: 80, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20,
              }}
            >
              <div style={{
                background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)',
                borderRadius: 20, padding: '10px 24px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: '#c9a96e', letterSpacing: '0.05em',
                backdropFilter: 'blur(8px)',
              }}>
                <motion.span
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  style={{ display: 'inline-block' }}
                >
                  {isFrench ? '← Balayez pour lire →' : '← Swipe to read →'}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Navigation ── */}
        <div className="sv-nav">
          <button className="sv-nav-btn" onClick={handlePrev} disabled={currentIdx === 0}>‹</button>

          {/* Fretboard toggle — always available */}
          <button
            className={`sv-fret-toggle ${fretboardOpen ? 'active' : ''}`}
            onClick={() => fretboardOpen ? setFretboardOpen(false) : openFretboard()}
            title={isFrench ? 'Ouvrir la touche' : 'Open Fretboard'}
          >
            🎸
          </button>

          <div className="sv-dots">
            {slides.map((_, i) => (
              <div key={i} className={`sv-dot ${i === currentIdx ? 'active' : ''}`}
                style={i === currentIdx ? { background: slide.accent } : {}}
                onClick={() => goTo(i, i > currentIdx ? 1 : -1)} />
            ))}
          </div>
          <button className="sv-nav-btn"
            onClick={currentIdx === slides.length - 1 ? goNextFret : handleNext}>
            ›
          </button>
        </div>
      </div>

      {/* ── Fretboard Bottom Sheet ── */}
      <AnimatePresence>
        {fretboardOpen && (
          <FretboardSheet
            isOpen={fretboardOpen}
            onClose={() => setFretboardOpen(false)}
            fret={fret}
            fretboardFocus={slide.fretboardFocus || fret.yang?.fretboardFocus}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

// ── Slide Content Renderer ──

function SlideContent({ slide, onOpenFretboard, onNextFret, localize, isFrench }) {
  switch (slide.type) {
    case 'title':
      return (
        <>
          <p className="sv-label" style={{ color: slide.accent }}>{localize(slide.label)}</p>
          <h1 className="sv-title">{localize(slide.title)}</h1>
          <p className="sv-subtitle">{localize(slide.subtitle)}</p>
          <p className="sv-meta">{localize(slide.meta)}</p>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'yin-philosophy':
      return (
        <>
          <p className="sv-label" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
          {slide.title && <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>}
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'yin-quote':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p className="sv-label" style={{ color: '#7b6aaa', textAlign: 'center' }}>{localize(slide.label)}</p>
          <p className="sv-quote">"{localize(slide.quote)}"</p>
          <p className="sv-author">— {localize(slide.author)}</p>
        </div>
      );

    case 'yin-concept':
      return (
        <>
          <p className="sv-label" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
          <h2 className="sv-concept-term">{localize(slide.title)}</h2>
          <p className="sv-concept-def">{localize(slide.body)}</p>
        </>
      );

    case 'yin-meditation':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p className="sv-label" style={{ color: '#7b6aaa', textAlign: 'center' }}>{localize(slide.label)}</p>
          <p className="sv-meditation-prompt">{localize(slide.body)}</p>
          {slide.duration && <p className="sv-duration">⏱ {slide.duration} {isFrench ? 'secondes' : 'seconds'}</p>}
        </div>
      );

    case 'yang-instruction':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'yang-theory':
      return (
        <>
          <p className="sv-label" style={{ color: '#0abde3' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>
          
          <div className="mb-6 p-4 rounded-xl bg-[#0abde3]/10 border border-[#0abde3]/30">
            <h3 className="font-bold text-[#0abde3] text-sm mb-2 font-mono uppercase tracking-wider">
              {isFrench ? 'Comment fonctionne la musique' : 'How Music Works'}
            </h3>
            <p className="sv-body text-sm">{localize(slide.musicGrammar)}</p>
          </div>
          
          <div className="mb-6 p-4 rounded-xl bg-cf-gold/10 border border-cf-gold/30">
            <h3 className="font-bold text-cf-gold text-sm mb-2 font-mono uppercase tracking-wider">
              {isFrench ? 'Comment fonctionne la guitare' : 'How Guitar Works'}
            </h3>
            <p className="sv-body text-sm">{localize(slide.guitarGrammar)}</p>
          </div>
        </>
      );

    case 'yang-exercise':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div>
            {slide.steps?.map((step, i) => (
              <div key={i} className="sv-step">
                <span className="sv-step-num" style={{
                  background: `${slide.accent}20`,
                  color: slide.accent
                }}>{i + 1}</span>
                <span className="sv-step-text">{localize(step)}</span>
              </div>
            ))}
          </div>
          
          {/* Inject PLING Trainer for specific exercises (Legacy mapping) */}
          {(slide.id === '4-exercise-0' || slide.id === '7-exercise-0') && (
            <PlingTrainer />
          )}

          {/* Mapped Chapter Tool */}
          {(() => {
            const activeTool = TOOLS_CATALOG.find(t => t.id === slide.fretId);
            if (!activeTool) return null;
            return (
              <div className="mt-4 mb-4 p-4 rounded-xl bg-cf-gold/10 border border-cf-gold/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cf-gold">{activeTool.icon}</span>
                  <h3 className="font-bold text-cf-gold text-sm">{activeTool.name}</h3>
                </div>
                <p className="text-xs text-white/70 mb-3">{activeTool.desc}</p>
                <button 
                  className={`w-full py-2 rounded text-xs font-bold transition-colors ${activeTool.status === 'available' ? 'bg-cf-gold text-[#030306] hover:bg-white' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                  onClick={() => {
                    if (activeTool.status === 'available') {
                      alert(`Opening ${activeTool.name}... (Routing to be connected)`);
                    }
                  }}
                >
                  {activeTool.status === 'available' ? (isFrench ? 'Lancer l\'Outil' : 'Launch Tool') : (isFrench ? 'À Venir' : 'Coming Soon')}
                </button>
              </div>
            );
          })()}

          {/* Inline fretboard access from exercises */}
          <button className="sv-fretboard-fab" onClick={onOpenFretboard}>
            <span className="sv-fretboard-fab-icon">🎸</span>
            <span className="sv-fretboard-fab-text">{isFrench ? 'Pratiquer sur la touche' : 'Practice on Fretboard'}</span>
            <span className="sv-fretboard-fab-arrow">↑</span>
          </button>
        </>
      );

    case 'yang-fretboard':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
          {/* Main fretboard CTA */}
          <button className="sv-fretboard-fab" onClick={onOpenFretboard}>
            <span className="sv-fretboard-fab-icon">🎸</span>
            <span className="sv-fretboard-fab-text">
              {isFrench ? 'Ouvrir la touche — Frettes' : 'Open Fretboard — Frets'} {slide.fretboardFocus?.startFret}–{slide.fretboardFocus?.endFret}
            </span>
            <span className="sv-fretboard-fab-arrow">↑</span>
          </button>
        </>
      );

    case 'fret-end':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
          <div className="sv-end-icon">{slide.icon}</div>
          <h2 className="sv-end-title">{localize(slide.title)}</h2>
          <p className="sv-end-body">{localize(slide.body)}</p>
          {slide.fretId < 12 && (
            <button className="sv-next-btn" onClick={onNextFret}>
              {isFrench ? 'Frette Suivante →' : 'Next Fret →'}
            </button>
          )}
        </div>
      );

    case 'timeless-song':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Label + ratio badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="sv-label" style={{ color: '#c9a96e', margin: 0 }}>{localize(slide.label)}</p>
            {slide.ratio && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: '#c9a96e', background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.25)',
                padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em',
              }}>
                {slide.ratio}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
            fontWeight: 400, color: '#e8edf2', lineHeight: 1.15, margin: 0,
          }}>
            {localize(slide.title)}
          </h2>

          {/* POV body — split by \n\n into paragraphs */}
          <div style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b0b8c8' }}>
            {(localize(slide.body) || '').split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1em' }}>{para}</p>
            ))}
          </div>

          {/* Historical subtext provenance */}
          {slide.subtext && (
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
              color: '#5a6a80', letterSpacing: '0.12em', textTransform: 'uppercase',
              borderLeft: '2px solid rgba(201,169,110,0.3)', paddingLeft: '0.75rem',
            }}>
              {localize(slide.subtext)}
            </p>
          )}

          {/* Quote */}
          {slide.quote && (
            <div style={{
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 10, padding: '1rem 1.2rem',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '1.05rem',
                fontStyle: 'italic', color: '#c9a96e', lineHeight: 1.7, margin: 0,
              }}>
                "{localize(slide.quote)}"
              </p>
              {slide.author && (
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                  color: '#5a6a80', marginTop: '0.5rem', letterSpacing: '0.1em',
                }}>
                  — {localize(slide.author)}
                </p>
              )}
            </div>
          )}

          {/* References panel — expandable */}
          {slide.references?.length > 0 && (
            <ReferencesPanel references={slide.references} isFrench={isFrench} />
          )}
        </div>
      );

    default:
      return <p className="sv-body">{localize(slide.body)}</p>;
  }
}

// ── References Panel — Expandable citations ──
function ReferencesPanel({ references, isFrench }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '8px 14px',
          color: '#5a6a80', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', textAlign: 'left',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>📚</span>
        <span style={{ flex: 1 }}>
          {open ? (isFrench ? 'MASQUER' : 'HIDE') : (isFrench ? 'VOIR' : 'VIEW')} {isFrench ? 'LES RÉFÉRENCES' : 'REFERENCES'} ({references.length})
        </span>
        <span style={{ opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          marginTop: 8, padding: '12px 14px',
          background: 'rgba(201,169,110,0.04)',
          border: '1px solid rgba(201,169,110,0.12)',
          borderRadius: 8,
        }}>
          {references.map((ref, i) => (
            <div key={i} style={{
              marginBottom: i < references.length - 1 ? 12 : 0,
              paddingBottom: i < references.length - 1 ? 12 : 0,
              borderBottom: i < references.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '0.95rem',
                fontStyle: 'italic', color: '#c9a96e', margin: 0,
              }}>
                {ref.title}
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: '#5a6a80', margin: '2px 0 4px', letterSpacing: '0.08em',
              }}>
                {ref.author} · {ref.date}
              </p>
              <p style={{
                fontSize: '0.8rem', color: '#8090a8', lineHeight: 1.6, margin: 0,
              }}>
                {ref.context}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SlideViewer;
