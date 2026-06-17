import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { VIDEO_META } from './VideoHub';
import { STAGE_DATA } from '../data/videoData';
import ReflectionJournal from '../components/ReflectionJournal';

/**
 * Click-through delivery: each stage has discrete steps the user advances through.
 * Steps: Power Word → Tao Quote → Set & Setting → Scenario → Meditation 1 → Meditation 2
 */

const STEP_LABELS = [
  'Power Word',
  'Tao Te Ching',
  'Set & Setting',
  'The Scenario',
  'Socratic Meditation 1',
  'Socratic Meditation 2',
];

export default function StagePage() {
  const { videoId, stageNumber } = useParams();
  const num = parseInt(stageNumber, 10);
  const [step, setStep] = useState(0);
  
  // Media States
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);

  const video = VIDEO_META[videoId];
  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-cf-ink-bright mb-4">Class Not Found</h1>
          <Link to="/" className="text-cf-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const stage = video.stages.find(s => s.number === num);
  if (!stage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-cf-ink-bright mb-4">Stage Not Found</h1>
          <Link to={`/video/${videoId}`} className="text-cf-gold hover:underline">Return to {video.title}</Link>
        </div>
      </div>
    );
  }

  // Get rich content data
  const stageDataArray = STAGE_DATA[videoId];
  const data = stageDataArray ? stageDataArray.find(s => s.number === num) : null;

  const prevStage = num > 1 ? num - 1 : null;
  const nextStage = num < 12 ? num + 1 : null;
  const videoOrder = ['impact', 'authority', 'the-self'];
  const currentVideoIndex = videoOrder.indexOf(videoId);
  const nextVideoId = currentVideoIndex < 2 ? videoOrder[currentVideoIndex + 1] : null;

  const totalSteps = STEP_LABELS.length;
  const isLastStep = step >= totalSteps - 1;
  const isFirstStep = step === 0;

  const goNext = () => {
    if (!isLastStep) setStep(step + 1);
  };
  const goPrev = () => {
    if (!isFirstStep) setStep(step - 1);
  };

  // Render the current step content
  const renderStep = () => {
    if (!data) {
      return (
        <div className="text-center py-16">
          <p className="text-cf-whisper text-lg">Content is being prepared.</p>
        </div>
      );
    }

    switch (step) {
      // Step 0: Power Word
      case 0:
        return (
          <motion.div
            key="power-word"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-center py-12 md:py-20"
          >
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-cf-muted mb-8">
              Stage {String(num).padStart(2, '0')} · {stage.title}
            </p>
            <h1 className={`text-6xl md:text-8xl font-heading font-light mb-8 ${video.colorClass}`}>
              {stage.power}
            </h1>
            <p className="text-xl md:text-2xl text-cf-whisper font-quote italic max-w-2xl mx-auto leading-relaxed">
              {data.context}
            </p>
          </motion.div>
        );

      // Step 1: Tao Quote
      case 1:
        return (
          <motion.div
            key="tao-quote"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="text-center py-12 md:py-20 max-w-2xl mx-auto"
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cf-muted mb-8">
              Chapter {data.taoChapter} — {data.taoChapterName}
            </p>
            <blockquote className="text-xl md:text-2xl font-quote italic text-cf-ink-bright leading-relaxed mb-8">
              {data.taoQuote}
            </blockquote>
            <p className="text-sm text-cf-muted">
              — {data.taoSource}
            </p>
          </motion.div>
        );

      // Step 2: Set & Setting
      case 2:
        return (
          <motion.div
            key="set-setting"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="py-12 md:py-16 max-w-3xl mx-auto"
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cf-muted mb-8 text-center">
              Set & Setting
            </p>
            {data.setAndSetting.imagePath && (
              <div className="mb-8 rounded-sm overflow-hidden border border-cf-border">
                <img
                  src={data.setAndSetting.imagePath}
                  alt={`Stage ${num}: ${stage.power}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
            <p className="text-lg md:text-xl text-cf-whisper leading-relaxed font-quote italic text-center">
              {data.setAndSetting.description}
            </p>
          </motion.div>
        );

      // Step 3: Scenario
      case 3:
        return (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="py-12 md:py-16 max-w-2xl mx-auto"
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cf-muted mb-4 text-center">
              The Scenario
            </p>
            <h3 className="text-2xl font-heading text-cf-ink-bright mb-8 text-center">
              {data.scenario.title}
            </h3>
            <div className="scenario-reading-text">
              {data.scenario.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i} className="text-lg md:text-xl text-cf-ink leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        );

      // Steps 4-5: Meditations
      case 4:
      case 5: {
        const meditationIndex = step - 4;
        const meditation = data.meditations[meditationIndex];
        if (!meditation) return null;
        return (
          <motion.div
            key={`meditation-${meditationIndex}`}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="py-12 md:py-20 max-w-2xl mx-auto text-center w-full"
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cf-muted mb-8">
              Socratic Meditation {meditationIndex + 1}
            </p>
            <blockquote className="text-xl md:text-2xl font-quote italic text-cf-ink-bright leading-relaxed mb-8">
              {meditation.question}
            </blockquote>
            
            <ReflectionJournal 
              stageId={`${videoId}-${num}`} 
              questionId={`meditation-${meditationIndex}`}
              question={meditation.question}
            />
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={`${videoId}-${num}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <Helmet>
        <title>{`Stage ${num}: ${stage.power} — ${video.title} — The Conscious Framework`}</title>
      </Helmet>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-cf-void/90 backdrop-blur-md border-b border-cf-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to={`/video/${videoId}`}
            className="text-cf-whisper hover:text-cf-gold transition-colors text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            {video.title}
          </Link>

          {/* Progress dots — stages */}
          <div className="flex items-center gap-1">
            {video.stages.map((s) => (
              <Link
                key={s.number}
                to={`/video/${videoId}/${s.number}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s.number === num
                    ? 'bg-cf-gold w-6'
                    : s.number < num
                    ? 'bg-cf-gold/40'
                    : 'bg-cf-border'
                }`}
                title={`Stage ${s.number}: ${s.power}`}
                onClick={() => setStep(0)}
              />
            ))}
          </div>

          <span className={`font-mono text-xs ${video.colorClass}`}>
            {num}/12
          </span>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="fixed top-[52px] left-0 right-0 z-40">
        <div className="h-0.5 bg-cf-border">
          <motion.div
            className="h-full bg-cf-gold"
            initial={false}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pt-16 pb-32 px-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Media Bar */}
      <motion.div 
        className="fixed bottom-24 right-6 z-40 flex flex-col gap-2"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {/* Ambient Music Toggle */}
        <div 
          className="flex items-center justify-between gap-4 bg-cf-surface/90 backdrop-blur-md border border-cf-border/50 p-2 rounded-full shadow-2xl cursor-pointer hover:bg-cf-surface transition-colors w-64"
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-cf-void transition-colors shrink-0 ${isMusicPlaying ? 'bg-cf-gold animate-pulse' : 'bg-cf-border'}`}>
            {isMusicPlaying ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
               </svg>
            )}
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[10px] font-mono tracking-widest uppercase text-cf-gold-dim leading-tight">Background</p>
            <p className="text-sm text-cf-whisper font-medium leading-tight">Ambient Music</p>
          </div>
        </div>

        {/* Narration Toggle */}
        <div 
          className="flex items-center justify-between gap-4 bg-cf-surface/90 backdrop-blur-md border border-cf-border/50 p-2 rounded-full shadow-2xl cursor-pointer hover:bg-cf-surface transition-colors w-64"
          onClick={() => setIsNarrationPlaying(!isNarrationPlaying)}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-cf-void transition-colors shrink-0 ${isNarrationPlaying ? 'bg-cf-gold animate-pulse' : 'bg-cf-border'}`}>
            {isNarrationPlaying ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line>
               </svg>
            )}
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[10px] font-mono tracking-widest uppercase text-cf-gold-dim leading-tight">Masterclass</p>
            <p className="text-sm text-cf-whisper font-medium leading-tight">Audio Narration</p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation — click-through controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-cf-void/90 backdrop-blur-md border-t border-cf-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Back */}
          {isFirstStep ? (
            prevStage ? (
              <Link
                to={`/video/${videoId}/${prevStage}`}
                className="flex items-center gap-2 text-cf-whisper hover:text-cf-gold transition-colors text-sm"
                onClick={() => setStep(0)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
                <span className="hidden sm:inline">Previous Stage</span>
              </Link>
            ) : (
              <Link
                to={`/video/${videoId}`}
                className="flex items-center gap-2 text-cf-whisper hover:text-cf-gold transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
                <span className="hidden sm:inline">Overview</span>
              </Link>
            )
          ) : (
            <button
              onClick={goPrev}
              className="flex items-center gap-2 text-cf-whisper hover:text-cf-gold transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Center: Step label */}
          <span className="font-mono text-xs text-cf-muted">
            {STEP_LABELS[step]}
          </span>

          {/* Right: Next */}
          {isLastStep ? (
            nextStage ? (
              <Link
                to={`/video/${videoId}/${nextStage}`}
                className="flex items-center gap-2 text-cf-gold hover:text-cf-gold/80 transition-colors text-sm font-medium"
                onClick={() => setStep(0)}
              >
                <span className="hidden sm:inline">Next Stage</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            ) : nextVideoId ? (
              <Link
                to={`/video/${nextVideoId}`}
                className="flex items-center gap-2 text-cf-gold hover:text-cf-gold/80 transition-colors text-sm font-medium"
              >
                <span className="hidden sm:inline">Next Class</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 text-cf-gold hover:text-cf-gold/80 transition-colors text-sm font-medium"
              >
                <span className="hidden sm:inline">Complete</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 text-cf-gold hover:text-cf-gold/80 transition-colors text-sm font-medium"
            >
              <span className="hidden sm:inline">Continue</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
