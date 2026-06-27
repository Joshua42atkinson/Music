import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import usePitchDetector from '../hooks/usePitchDetector';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import { useCScaleProgress } from '../features/c-scale/useCScaleProgress';
import PitchDetectorHUD from '../features/c-scale/PitchDetectorHUD';
import ChapterSidebar from '../features/c-scale/ChapterSidebar';
import StageHeader from '../features/c-scale/StageHeader';
import FretboardPanel from '../features/c-scale/FretboardPanel';
import HandsFreeCoachBar from '../components/handsfree/HandsFreeCoachBar';
import { droneEngine } from '../lib/audio/GenerativeDroneEngine';

// ═══════════════════════════════════════════════════════════
// MAIN HUB
// ═══════════════════════════════════════════════════════════
export default function CScaleHub() {
  const [activeStage, setActiveStage] = useState(C_SCALE_CHAPTERS[0].id);
  const [resonanceMode, setResonanceMode] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const { progress, markComplete } = useCScaleProgress();
  const navigate = useNavigate();

  const completedCount = useMemo(() => Object.keys(progress).length, [progress]);

  const { isListening, noteInfo, volume, error, startListening, stopListening } = usePitchDetector();

  const currentChapter = C_SCALE_CHAPTERS.find(s => s.id === activeStage);
  const currentStageIndex = C_SCALE_CHAPTERS.findIndex(s => s.id === activeStage);

  const goToChapter = useCallback((direction) => {
    const newIndex = currentStageIndex + direction;
    if (newIndex >= 0 && newIndex < C_SCALE_CHAPTERS.length) {
      setActiveStage(C_SCALE_CHAPTERS[newIndex].id);
    }
  }, [currentStageIndex]);

  const voiceHandlers = useMemo(() => ({
    next: () => goToChapter(1),
    previous: () => goToChapter(-1),
    repeat: () => window.dispatchEvent(new CustomEvent('voixvive:repeat_chapter')),
    menu: () => navigate('/'),
    ask: () => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour')),
    practice: () => setPracticeMode(true),
    close: () => setPracticeMode(false),
    play: () => { if (!isListening) startListening(); },
    stop: () => { if (isListening) stopListening(); droneEngine.stopAll(); setResonanceMode(false); },
    record: () => { if (isListening) stopListening(); else startListening(); },
    slower: () => window.dispatchEvent(new CustomEvent('voixvive:slower')),
    faster: () => window.dispatchEvent(new CustomEvent('voixvive:faster')),
  }), [goToChapter, navigate, isListening, startListening, stopListening]);

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Handle Drone Engine state when stage changes or resonance mode toggles
  useEffect(() => {
    if (resonanceMode) {
      droneEngine.startDrone(activeStage);
    } else {
      droneEngine.stopAll();
    }
    return () => droneEngine.stopAll();
  }, [activeStage, resonanceMode]);

  return (
    <div className={`mesh-bg min-h-[100svh] text-[var(--vv-text)] font-body pt-16 md:pt-20 pb-24 md:pb-10 flex flex-col transition-colors duration-1000 ${resonanceMode ? 'bg-[#030201] shadow-[inset_0_0_150px_rgba(204,153,51,0.05)]' : 'bg-transparent'} ${practiceMode ? 'pb-20' : ''}`}>
      {/* ── Header: responsive (hidden in practice mode) ── */}
      {!practiceMode && (
      <div className="px-4 md:px-10 mb-4 md:mb-6 flex justify-between items-center flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="m-0 font-heading text-[1.5rem] md:text-[2.5rem] font-normal text-[var(--vv-cream)] truncate">The C Scale Journey</h1>
          <p className="mt-1 md:mt-2 font-mono text-[0.65rem] md:text-[0.8rem] tracking-[0.1em] uppercase text-[var(--vv-gold)]/60">The Matrix of the Fretboard (12 Chapters)</p>
        </div>

      </div>
      )}

      {/* ── Practice mode exit button ── */}
      {practiceMode && (
        <div className="px-4 md:px-10 py-3 flex items-center justify-between">
          <span className="font-mono text-[0.7rem] text-white/40 uppercase tracking-[0.1em]">
            {currentChapter.title}
          </span>
          <button
            onClick={() => setPracticeMode(false)}
            className="px-3 py-1.5 rounded-lg border border-white/20 text-white/50 hover:text-white/80 hover:border-white/40 font-mono text-[0.7rem] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Minimize2 size={14} /> Exit
          </button>
        </div>
      )}

      {error && (
        <div className="mx-4 md:mx-10 mb-4 px-4 py-2.5 rounded-lg bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] text-[var(--vv-red)] text-[0.85rem]">
          {error}
        </div>
      )}

      {/* ── Chapter strip (mobile) / sidebar (desktop) + content ── */}
      <div className={`flex flex-col md:flex-row gap-4 md:gap-8 px-4 md:px-10 flex-1 min-h-0 ${practiceMode ? '!p-0' : ''}`}>
        {!practiceMode && (
        <ChapterSidebar
          activeStage={activeStage}
          onSelectStage={setActiveStage}
          progress={progress}
          onEnterStudio={() => navigate('/studio/prompter')}
        />
        )}

        <div className={`glass-card flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0 ${practiceMode ? '!rounded-none !border-0' : ''}`}>
          {!practiceMode && <StageHeader chapter={currentChapter} />}

          {/* Minimalist Chapter Focus Area */}
          <div className="px-4 md:px-8 py-10 md:py-20 border-b border-white/5 flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="m-0 mb-4 font-heading text-3xl md:text-5xl text-[var(--vv-cream)] drop-shadow-md">
              {currentChapter.title}
            </h2>
            <p className="max-w-xl mx-auto m-0 mb-8 text-base md:text-lg text-white/60 leading-relaxed font-light">
              Speak to Bertrand to begin this session. He will guide your fretboard exploration.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour'))}
              className="px-8 py-4 rounded-full bg-[rgba(204,51,51,0.15)] border border-[rgba(204,51,51,0.4)] text-[#ff6666] font-mono text-[0.9rem] uppercase tracking-[0.15em] hover:bg-[rgba(204,51,51,0.25)] transition-all cursor-pointer shadow-[0_0_20px_rgba(204,51,51,0.2)]"
            >
              Summon Mentor
            </button>
          </div>

          {!practiceMode && (
          <div className="hidden md:block">
            <FretboardPanel threeDMode={false} activeStage={activeStage} />
          </div>
          )}
        </div>
      </div>

      {/* ── Mobile sticky bottom bar (hidden in practice mode) ── */}
      {!practiceMode && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[rgba(8,8,14,0.9)] backdrop-blur-lg border-t border-white/10">
        <button
          onClick={() => setResonanceMode(!resonanceMode)}
          className={`px-3 py-2 rounded-lg border font-mono text-[0.7rem] flex items-center gap-1.5 shrink-0 ${resonanceMode ? 'border-[#34d399] text-[#34d399] bg-[#34d399]/5' : 'border-cf-gold/40 text-cf-gold'}`}
        >
          〰️
        </button>
        
        <PitchDetectorHUD
          isListening={isListening}
          noteInfo={noteInfo}
          volume={volume}
          onToggle={toggleMic}
        />

        <button
          onClick={() => setPracticeMode(true)}
          className="px-3 py-2 rounded-lg border border-white/20 text-white/50 font-mono text-[0.7rem] flex items-center gap-1.5 shrink-0"
        >
          <Maximize2 size={12} />
        </button>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour'))}
          className="px-3 py-2 rounded-lg border border-[rgba(167,139,250,0.4)] text-[#a78bfa] bg-[rgba(167,139,250,0.1)] font-mono text-[0.7rem] flex items-center gap-1.5 shrink-0"
        >
          🎸
        </button>
      </div>
      )}

      {/* ── Hands-free coach bar (continuous listening) ── */}
      <HandsFreeCoachBar handlers={voiceHandlers} />
    </div>
  );
}
