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
    title: 'Welcome to Your Practice Room',
    subtitle: 'A safe, private space to learn guitar',
    body: 'This app is your personal practice space. There are no tests you can fail, no timers pushing you, and no one watching you make mistakes. Explore at your own pace — there is no wrong way to start.',
    accent: '#c9a96e',
  },
  {
    id: 1,
    icon: '🗺️',
    title: 'Three Rooms to Explore',
    subtitle: 'Each room teaches a different part of music.',
    body: '🎵 The Song — Read and learn the story behind the music.\n\n🎸 The Guitar — Play games that train your memory of the fretboard.\n\n🧘 The Player — Practice tools for breathing, pitch, and rhythm.',
    accent: '#7aaa88',
  },
  {
    id: 2,
    icon: '🫁',
    title: 'Start Simple',
    subtitle: 'Pick any room. Try anything.',
    body: 'If you\'re brand new, go to The Guitar and play one round of FLASH — it takes about 5 minutes. Gold dots will appear on a guitar neck. Study them, then tap where they were. That\'s it!',
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
          font-size: 1rem;
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
          font-size: 0.9rem;
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
