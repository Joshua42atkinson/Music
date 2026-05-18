import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// WELCOME ONBOARDING — 3-slide introduction for new students
// Replaces the old ConnectionManager modal as the first-run experience.
// Shows once, then stores a flag in localStorage so it never reappears.
// ═══════════════════════════════════════════════════════════

const ONBOARDING_KEY = 'voix_vive_onboarded';

const slides = [
  {
    id: 0,
    icon: '🎸',
    title: 'Bienvenue to Voix Vive',
    subtitle: 'My Living Guitar Textbook',
    body: 'A body-centered approach to guitar mastery. Here, breathing comes before playing, and understanding comes before memorizing. You are an instrument playing an instrument.',
    accent: '#c9a96e',
  },
  {
    id: 1,
    icon: '🗺️',
    title: 'The Fretboard is a Map',
    subtitle: 'Each fret is a chapter. Each chapter has two sides.',
    body: '☽ Yin — Philosophy, meditation, and ear training. Slow down. Listen deeply.\n\n☀ Yang — Physical exercises, fretboard patterns, and technique. Pick up the guitar and move.',
    accent: '#7aaa88',
  },
  {
    id: 2,
    icon: '🫁',
    title: 'Breathe First, Then Play',
    subtitle: 'Start with Chapter 1: The Root Note',
    body: 'Every session begins with a body scan and a breath override. Tune your body before you tune the wood.\n\nSwipe through the slides at your own pace. Il n\'y a pas de mauvaises notes ici. (There are no wrong notes here.)',
    accent: '#7b6aaa',
  },
];

export default function WelcomeOnboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setShouldShow(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShouldShow(false);
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      handleComplete();
    } else {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!shouldShow) return null;

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="welcome-overlay">
      <style>{`
        .welcome-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(3, 3, 6, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 24px;
        }
        .welcome-card {
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
        }
        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 30px rgba(201,169,110,0.3));
        }
        .welcome-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 8vw, 2.6rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        .welcome-subtitle {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: #7aaa88;
          margin: 0 0 28px;
        }
        .welcome-body {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #b0b8c8;
          text-align: left;
          margin-bottom: 40px;
          white-space: pre-line;
        }
        .welcome-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .welcome-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: all 0.3s;
        }
        .welcome-dot.active {
          width: 24px;
          border-radius: 4px;
          background: #c9a96e;
        }
        .welcome-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .welcome-btn {
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 48px;
          border: none;
        }
        .welcome-btn-primary {
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.4);
          color: #c9a96e;
          flex: 1;
        }
        .welcome-btn-primary:hover {
          background: rgba(201,169,110,0.25);
        }
        .welcome-btn-primary:active {
          transform: scale(0.97);
        }
        .welcome-btn-primary.begin {
          background: #c9a96e;
          color: #0d0d14;
          font-weight: 700;
          border: none;
          box-shadow: 0 0 24px rgba(201,169,110,0.3);
        }
        .welcome-btn-primary.begin:hover {
          background: #e0d0aa;
        }
        .welcome-btn-skip {
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          color: #5a6a80;
          padding: 14px 20px;
        }
        .welcome-btn-skip:hover {
          color: #8090a8;
          border-color: rgba(255,255,255,0.15);
        }
        .welcome-slide-content {
          position: relative;
        }
      `}</style>

      <div className="welcome-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            className="welcome-slide-content"
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.35 }}
          >
            <div className="welcome-icon">{slide.icon}</div>
            <h1 className="welcome-title">{slide.title}</h1>
            <p className="welcome-subtitle">{slide.subtitle}</p>
            <p className="welcome-body">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="welcome-dots">
          {slides.map((_, i) => (
            <div key={i} className={`welcome-dot ${i === currentSlide ? 'active' : ''}`} />
          ))}
        </div>

        {/* Actions */}
        <div className="welcome-actions">
          {currentSlide > 0 && (
            <button className="welcome-btn welcome-btn-skip" onClick={handlePrev}>
              ← Back
            </button>
          )}
          {currentSlide === 0 && (
            <button className="welcome-btn welcome-btn-skip" onClick={handleSkip}>
              Skip
            </button>
          )}
          <button
            className={`welcome-btn welcome-btn-primary ${isLast ? 'begin' : ''}`}
            onClick={handleNext}
          >
            {isLast ? '🎸 Begin Your Journey' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
