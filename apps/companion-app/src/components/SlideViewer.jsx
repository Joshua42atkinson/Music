import { devWarn } from '../lib/devLog';
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import frets from '../data/chapterData';
import { SLIDE_DECKS } from '../data/slideDecks';
import FretboardSheet from '../features/vr-fretboard/FretboardSheet';
import PlingTrainer from './PlingTrainer';
import PracticeRecorder from './PracticeRecorder';
import { TOOLS_CATALOG } from '../data/toolsData';
import { saveSlidePosition, getSlidePosition } from '../data/localDatabase';
import { useLocale } from '../hooks/useLocale';
import { useScaffolding } from './ScaffoldingProvider';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { getFretState, getDefaultFretState } from '../data/tractionStore';
import { useCosyVoice } from '../hooks/useCosyVoice';
import { getVoicePrompt } from '../data/voicePrompts';
import './SlideViewer.css';
import { devError } from '../lib/devLog';

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
  const { locale, t } = useLocale();
  const { updateTraction } = useScaffolding();
  const cosyvoice = useCosyVoice();

  // Somatic BE Gate Voice Prompt
  useEffect(() => {
    cosyvoice.initTTS();
  }, [cosyvoice]);

  useEffect(() => {
    if (cosyvoice.isReady && fretId >= 2 && fretId <= 12) {
      const prompt = getVoicePrompt(fretId, 'be', locale);
      if (prompt) {
        cosyvoice.speak(prompt, locale);
      }
    }
    return () => {
      cosyvoice.cancel();
    };
  }, [cosyvoice, fretId, locale]);

  const localize = useCallback((val) => {
    if (!val) return '';
    if (typeof val === 'object') {
      return val[locale] || val['en'] || '';
    }
    return val;
  }, [locale]);

  const fret = frets.find(c => c.id === fretId) || frets[0];
  const slides = useMemo(() => SLIDE_DECKS[fret.id] || [], [fret]);
  // Initialize from the student's last saved position for this fret
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = getSlidePosition(fretId);
    // Clamp to valid range in case slide count changed
    return Math.min(saved, slides.length - 1);
  });
  const [direction, setDirection] = useState(0);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [fretboardOpen, setFretboardOpen] = useState(false);
  const [recordingExercise, setRecordingExercise] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(() => {
    try {
      return !vvGet(STORAGE_KEYS.SWIPE_HINT_SEEN);
    } catch {
      return true;
    }
  });
  const slide = slides[currentIdx];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const getReadableText = useCallback((s) => {
    let text = "";
    if (s.title) text += localize(s.title) + ". ";
    if (s.subtitle) text += localize(s.subtitle) + ". ";
    if (s.body) text += localize(s.body) + ". ";
    if (s.quote) text += localize(s.quote) + ". ";
    if (s.musicGrammar) text += localize(s.musicGrammar) + ". ";
    if (s.guitarGrammar) text += localize(s.guitarGrammar) + ". ";
    return text.replace(/<[^>]+>/g, '');
  }, [localize]);

  const speakSlide = useCallback((s) => {
    if (!synth) return;
    synth.cancel();
    const text = getReadableText(s);
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    const isFrench = locale === 'fr';
    utterance.lang = isFrench ? 'fr-FR' : 'en-US';
    
    const voices = synth.getVoices();
    let voice = voices.find(v => isFrench ? v.lang.toLowerCase().includes('fr') : v.lang.toLowerCase().includes('en'));
    if (!isFrench) {
      const frenchAccent = voices.find(v => v.lang.toLowerCase().includes('en') && v.name.includes('French'));
      if (frenchAccent) voice = frenchAccent;
    }
    if (voice) utterance.voice = voice;
    
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  }, [getReadableText, synth, locale]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      speakSlide(slide);
    }
  };

  useEffect(() => {
    if (isSpeaking) {
      speakSlide(slide);
    }
  }, [currentIdx, slide, isSpeaking, speakSlide]); 

  useEffect(() => {
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  // Show swipe hint only once, ever
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
        vvSet(STORAGE_KEYS.SWIPE_HINT_SEEN, '1');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);


  const goTo = useCallback((idx, dir) => {
    if (idx < 0 || idx >= slides.length) return;
    setDirection(dir);
    setCurrentIdx(idx);
    saveSlidePosition(fretId, idx);
    // Wire 3: mark yinCompleted + pass BE Somatic Gate when student reaches last slide
    if (idx === slides.length - 1) {
      updateTraction(prev => {
        const fretState = getFretState(prev, fretId);
        if (fretState.yinCompleted) return prev; // already marked
        // Single merged state update (avoid triple-save from calling helpers)
        const merged = {
          ...prev,
          frets: {
            ...prev.frets,
            [fretId]: {
              ...getDefaultFretState(fretId),
              ...prev.frets[fretId],
              yinCompleted: true,
              beGatePassed: true,
              lastAccessed: new Date().toISOString(),
            }
          }
        };
        return merged;
      });
    }
  }, [slides, fretId, updateTraction]);

  const handleNext = useCallback(() => goTo(currentIdx + 1, 1), [currentIdx, goTo]);
  const handlePrev = useCallback(() => goTo(currentIdx - 1, -1), [currentIdx, goTo]);

  // ── AI hands-free slide navigation via custom events ────────
  useEffect(() => {
    window.addEventListener('voixvive:next_slide', handleNext);
    window.addEventListener('voixvive:prev_slide', handlePrev);
    return () => {
      window.removeEventListener('voixvive:next_slide', handleNext);
      window.removeEventListener('voixvive:prev_slide', handlePrev);
    };
  }, [handleNext, handlePrev]);

  const goNextFret = useCallback(() => {
    const nextId = fretId < 12 ? fretId + 1 : 1;
    setCurrentIdx(0);
    if (onFretChange) onFretChange(nextId);
  }, [fretId, onFretChange]);

  const openFretboard = useCallback(() => {
    setFretboardOpen(true);
    if (navigator.vibrate) navigator.vibrate(15);
  }, []);

  const handleDragEnd = (e, info) => {
    // Don't process slide swipes if fretboard is open
    if (fretboardOpen) return;
    // Dismiss swipe hint on first swipe
    if (showSwipeHint) {
      setShowSwipeHint(false);
      vvSet(STORAGE_KEYS.SWIPE_HINT_SEEN, '1');
    }
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY) handleNext();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY) handlePrev();
  };

  // Web Speech API Voice Commands
  const recognitionRef = useRef(null);
  const [isListeningForCommands, setIsListeningForCommands] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isListeningForCommands) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        
        if (command.includes('next') || command.includes('suivant') || command.includes('avance')) {
          if (currentIdx === slides.length - 1) goNextFret();
          else handleNext();
        } else if (command.includes('back') || command.includes('retour') || command.includes('précédent') || command.includes('previous')) {
          handlePrev();
        } else if (command.includes('fretboard') || command.includes('guitare') || command.includes('manche')) {
          openFretboard();
        } else if (command.includes('exit') || command.includes('quitter')) {
          if (onBack) onBack();
        } else if (command.includes('read') || command.includes('lire')) {
          speakSlide(slide);
        }
      };

      recognition.onerror = (event) => {
        devError('Speech recognition error', event.error);
        setIsListeningForCommands(false);
      };

      recognition.onend = () => {
        if (isListeningForCommands) {
          try { recognition.start(); } catch { /* ignore */ }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

      return () => {
        recognition.stop();
      };
    }
  }, [isListeningForCommands, locale, handleNext, handlePrev, openFretboard, onBack, speakSlide, slide, currentIdx, slides.length, goNextFret]);

  const toggleCommandListening = () => {
    setIsListeningForCommands(prev => !prev);
  };

  return (
    <div className="sv-wrapper">
      <div className="sv-container">

      {/* Top bar removed as requested, using PrimaryNav instead */}



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
              {slide.image && !imageErrors.has(slide.id) ? (
                <img
                  src={slide.image}
                  alt=""
                  draggable={false}
                  onError={() => {
                    devWarn('Slide image failed to load:', slide.image);
                    setImageErrors(prev => {
                      const next = new Set(prev);
                      next.add(slide.id);
                      return next;
                    });
                  }}
                />
              ) : (
                <div
                  className="sv-missing-image-container w-full h-full flex items-center justify-center bg-[#050508]"
                >
                  <p style={{ color: 'rgba(var(--cf-gold-rgb),0.5)', fontFamily: 'monospace', fontSize: '12px' }}>
                    [{slide.id} — Missing Image]
                  </p>
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
                onRecordPractice={() => setRecordingExercise(`Fret ${fretId} Practice`)}
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
                position: 'absolute', bottom: 120, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20,
              }}
            >
              <div style={{
                background: 'rgba(var(--cf-gold-rgb),0.15)', border: '1px solid rgba(var(--cf-gold-rgb),0.3)',
                borderRadius: 20, padding: '10px 24px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: 'var(--cf-gold)', letterSpacing: '0.05em',
                backdropFilter: 'blur(8px)',
              }}>
                <motion.span
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  style={{ display: 'inline-block' }}
                >
                  {t('swipeToRead')}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Navigation ── */}
        <div className="sv-nav">
          {/* Top row: Chapter, Page, and Progress Bar */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="sv-chapter-label text-left max-w-[70%]">Ch.{fret.id} · {localize(fret.title)}</span>
              <span className="sv-page-num">{currentIdx + 1}/{slides.length}</span>
            </div>
            {/* ── Progress Bar ── */}
            <div className="sv-progress w-full">
              <div className="sv-progress-fill" style={{
                width: `${((currentIdx + 1) / slides.length) * 100}%`,
                background: slide.accent,
                color: slide.accent
              }} />
            </div>
          </div>

          {/* Bottom row: Controls and Accessability Toggles */}
          <div className="flex justify-between items-center w-full">
            <button className="sv-nav-btn" onClick={handlePrev} disabled={currentIdx === 0}>‹</button>

            {/* Toggles Container */}
            <div className="flex gap-3 items-center">
              {/* Ear (Listen / Commands) */}
              <button 
                onClick={toggleCommandListening}
                className={`sv-fret-toggle text-[1.4rem] ${isListeningForCommands ? 'active' : ''}`}
                title={isListeningForCommands ? "Stop Listening" : "Voice Commands"}
              >
                {isListeningForCommands ? '👂' : '👂'}
              </button>
              {/* TTS Mouth */}
              <button 
                onClick={toggleSpeech}
                className={`sv-fret-toggle text-[1.4rem] ${isSpeaking ? 'active' : ''}`}
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
              >
                {isSpeaking ? '🗣️' : '👄'}
              </button>
              {/* Fretboard toggle — always available */}
              <button
                className={`sv-fret-toggle ${fretboardOpen ? 'active' : ''}`}
                onClick={() => fretboardOpen ? setFretboardOpen(false) : openFretboard()}
                title={t('openFretboard')}
              >
                🎸
              </button>
            </div>

            <button className="sv-nav-btn"
              onClick={currentIdx === slides.length - 1 ? goNextFret : handleNext}>
              ›
            </button>
          </div>
        </div>
      </div>

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

      {/* ── Practice Recorder Overlay ── */}
      <AnimatePresence>
        {recordingExercise && (
          <PracticeRecorder
            exerciseName={recordingExercise}
            onClose={() => setRecordingExercise(null)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

// ── Slide Content Renderer ──

function SlideContent({ slide, onOpenFretboard, onNextFret, localize, onRecordPractice }) {
  const { t } = useLocale();
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

    case 'pythagorean-legacy':
      return (
        <>
          <p className="sv-label" style={{ color: 'var(--cf-gold)' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p style={{ fontStyle: 'italic', opacity: 0.85 }}>{localize(slide.hook)}</p></div>
          <div className="flex gap-3 mt-6 justify-center">
            <div className="py-2.5 px-[18px] rounded-xl bg-[rgba(var(--cf-gold-rgb),0.08)] border border-[rgba(var(--cf-gold-rgb),0.2)] font-mono text-[0.85rem] text-cf-gold">
              Ratio: {slide.ratio}
            </div>
            <div className="py-2.5 px-[18px] rounded-xl bg-[rgba(var(--cf-gold-rgb),0.08)] border border-[rgba(var(--cf-gold-rgb),0.2)] font-mono text-[0.85rem] text-cf-gold">
              {slide.cents} cents
            </div>
          </div>
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
        <div className="flex flex-col justify-center h-full">
          <p className="sv-label text-center" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
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

    case 'yin-shedding':
      return (
        <div className="flex flex-col justify-center h-full">
          <p className="sv-label text-center" style={{ color: 'var(--cf-gold)' }}>{localize(slide.label)}</p>
          <p className="sv-quote text-[#e8edf2]">{localize(slide.body)}</p>
        </div>
      );

    case 'yin-meditation':
      return (
        <div className="flex flex-col justify-center h-full">
          <p className="sv-label text-center" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
          <p className="sv-meditation-prompt">{localize(slide.body)}</p>
          {slide.duration && <p className="sv-duration">⏱ {slide.duration} {t('seconds')}</p>}
        </div>
      );

    case 'yang-instruction':
      return (
        <>
          <p className="sv-label" style={{ color: 'var(--cf-gold)' }}>{localize(slide.label)}</p>
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
              {t('howMusicWorks')}
            </h3>
            <p className="sv-body text-sm">{localize(slide.musicGrammar)}</p>
          </div>
          
          <div className="mb-6 p-4 rounded-xl bg-cf-gold/10 border border-cf-gold/30">
            <h3 className="font-bold text-cf-gold text-sm mb-2 font-mono uppercase tracking-wider">
              {t('howGuitarWorks')}
            </h3>
            <p className="sv-body text-sm">{localize(slide.guitarGrammar)}</p>
          </div>
        </>
      );

    case 'yang-exercise':
      return (
        <>
          <p className="sv-label" style={{ color: 'var(--cf-gold)' }}>{localize(slide.label)}</p>
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
                  {activeTool.status === 'available' ? t('launchTool') : t('comingSoon')}
                </button>
              </div>
            );
          })()}

          {/* Inline fretboard access from exercises */}
          <button className="sv-fretboard-fab" onClick={onOpenFretboard}>
            <span className="sv-fretboard-fab-icon">🎸</span>
            <span className="sv-fretboard-fab-text">{t('practiceOnFretboard')}</span>
            <span className="sv-fretboard-fab-arrow">↑</span>
          </button>
          
          <button className="sv-fretboard-fab" onClick={onRecordPractice} style={{ marginTop: 12, background: 'rgba(232,85,85,0.1)', borderColor: 'rgba(232,85,85,0.25)', color: '#e85555' }}>
            <span className="sv-fretboard-fab-icon">📹</span>
            <span className="sv-fretboard-fab-text">Record Practice</span>
            <span className="sv-fretboard-fab-arrow">↑</span>
          </button>
        </>
      );

    case 'yang-fretboard':
      return (
        <>
          <p className="sv-label" style={{ color: 'var(--cf-gold)' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
          {/* Main fretboard CTA */}
          <button className="sv-fretboard-fab" onClick={onOpenFretboard}>
            <span className="sv-fretboard-fab-icon">🎸</span>
            <span className="sv-fretboard-fab-text">
              {t('openFretboardFrets')} {slide.fretboardFocus?.startFret}–{slide.fretboardFocus?.endFret}
            </span>
            <span className="sv-fretboard-fab-arrow">↑</span>
          </button>
        </>
      );

    case 'fret-end':
      return (
        <FretEndSlide
          slide={slide}
          onNextFret={onNextFret}
          localize={localize}
          t={t}
        />
      );

    case 'timeless-song':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Label + ratio badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="sv-label" style={{ color: 'var(--cf-gold)', margin: 0 }}>{localize(slide.label)}</p>
            {slide.ratio && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: 'var(--cf-gold)', background: 'rgba(var(--cf-gold-rgb),0.1)',
                border: '1px solid rgba(var(--cf-gold-rgb),0.25)',
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
              borderLeft: '2px solid rgba(var(--cf-gold-rgb),0.3)', paddingLeft: '0.75rem',
            }}>
              {localize(slide.subtext)}
            </p>
          )}

          {/* Quote */}
          {slide.quote && (
            <div style={{
              background: 'rgba(var(--cf-gold-rgb),0.06)', border: '1px solid rgba(var(--cf-gold-rgb),0.15)',
              borderRadius: 10, padding: '1rem 1.2rem',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '1.05rem',
                fontStyle: 'italic', color: 'var(--cf-gold)', lineHeight: 1.7, margin: 0,
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
            <ReferencesPanel references={slide.references} />
          )}
        </div>
      );

    default:
      return <p className="sv-body">{localize(slide.body)}</p>;
  }
}

// ── Fret End Slide with Mark Complete ──
function FretEndSlide({ slide, onNextFret, localize, t }) {
  const { completePhase, traction } = useScaffolding();
  const [marked, setMarked] = useState(false);
  const fretId = slide.fretId;
  // Map legacy fret to DAG class-BE node
  const nodeId = `fret-${fretId}-class-be`;
  // Check if this fret's BE phase is already completed in traction
  const fretState = traction?.frets?.[fretId];
  const alreadyCompleted = !!fretState?.beCompleted;
  const beGatePassed = !!fretState?.beGatePassed;

  const handleMarkComplete = useCallback(() => {
    // Mark DAG phase complete
    completePhase(nodeId, 'be');
    setMarked(true);
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, [completePhase, nodeId]);

  const isAlreadyCompleted = alreadyCompleted || marked;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
      <div className="sv-end-icon">{slide.icon}</div>
      <h2 className="sv-end-title">{localize(slide.title)}</h2>
      <p className="sv-end-body">{localize(slide.body)}</p>

      {/* Somatic Gate status */}
      {!beGatePassed && !isAlreadyCompleted && (
        <p style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.05em',
        }}>
          🔒 Read all slides to unlock
        </p>
      )}

      {/* Mark Complete button — the bridge from legacy slides to DAG */}
      <button
        className="sv-next-btn"
        onClick={handleMarkComplete}
        disabled={isAlreadyCompleted || !beGatePassed}
        style={{
          background: isAlreadyCompleted
            ? 'rgba(52,211,153,0.15)'
            : beGatePassed
              ? 'rgba(var(--cf-gold-rgb),0.12)'
              : 'rgba(255,255,255,0.03)',
          borderColor: isAlreadyCompleted
            ? 'rgba(52,211,153,0.4)'
            : beGatePassed
              ? 'rgba(var(--cf-gold-rgb),0.35)'
              : 'rgba(255,255,255,0.08)',
          color: isAlreadyCompleted ? '#34d399' : beGatePassed ? 'var(--cf-gold)' : 'rgba(255,255,255,0.2)',
          marginBottom: 12,
          cursor: beGatePassed && !isAlreadyCompleted ? 'pointer' : 'default',
        }}
      >
        {isAlreadyCompleted ? '✓ BE Phase Complete' : beGatePassed ? 'Mark BE Phase Complete' : '🔒 Gate Locked'}
      </button>

      {slide.fretId < 12 && (
        <button className="sv-next-btn" onClick={onNextFret}>
          {t('nextFret')}
        </button>
      )}
    </div>
  );
}

// ── References Panel — Expandable citations ──
function ReferencesPanel({ references }) {
  const { t } = useLocale();
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
          {open ? t('hideReferences') : t('viewReferences')} {t('references')} ({references.length})
        </span>
        <span style={{ opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          marginTop: 8, padding: '12px 14px',
          background: 'rgba(var(--cf-gold-rgb),0.04)',
          border: '1px solid rgba(var(--cf-gold-rgb),0.12)',
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
                fontStyle: 'italic', color: 'var(--cf-gold)', margin: 0,
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
