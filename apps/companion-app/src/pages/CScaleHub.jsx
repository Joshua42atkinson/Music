import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
import usePitchDetector from '../hooks/usePitchDetector';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import { useCScaleProgress } from '../features/c-scale/useCScaleProgress';
import { useTruebadour } from '../hooks/TruebadourProvider';
import PitchDetectorHUD from '../features/c-scale/PitchDetectorHUD';
import ChapterSidebar from '../features/c-scale/ChapterSidebar';
import StageHeader from '../features/c-scale/StageHeader';
import FretboardPanel from '../features/c-scale/FretboardPanel';
import ChapterContentPanel from '../features/c-scale/ChapterContentPanel';
import HandsFreeCoachBar from '../components/handsfree/HandsFreeCoachBar';
import { droneEngine } from '../lib/audio/GenerativeDroneEngine';
import { devLog } from '../lib/devLog';

// ═══════════════════════════════════════════════════════════
// MAIN HUB
// ═══════════════════════════════════════════════════════════
export default function CScaleHub() {
  const [activeStage, setActiveStage] = useState(C_SCALE_CHAPTERS[0].id);
  const [resonanceMode, setResonanceMode] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const { progress, markComplete } = useCScaleProgress();
  const navigate = useNavigate();
  const { speak: ttsSpeak, ai } = useTruebadour();
  const handsFreeActiveRef = useRef(false);
  const aiBusyRef = useRef(false);

  const { isListening, noteInfo, volume, error, startListening, stopListening } = usePitchDetector();

  const currentChapter = C_SCALE_CHAPTERS.find(s => s.id === activeStage);
  const currentStageIndex = C_SCALE_CHAPTERS.findIndex(s => s.id === activeStage);

  const goToChapter = useCallback((direction) => {
    const newIndex = currentStageIndex + direction;
    if (newIndex >= 0 && newIndex < C_SCALE_CHAPTERS.length) {
      setActiveStage(C_SCALE_CHAPTERS[newIndex].id);
    }
  }, [currentStageIndex]);

  // ── Read chapter content aloud (audio snippet or TTS) ──────
  const readChapterAloud = useCallback((chapter) => {
    if (!chapter?.bePhase) return;
    if (chapter.bePhase.audioSnippet) {
      const audio = new Audio(chapter.bePhase.audioSnippet);
      audio.play().catch(() => {
        // Audio failed, fall back to TTS
        const text = `${chapter.bePhase.title}. ${chapter.bePhase.content} ${chapter.bePhase.action || ''}`;
        ttsSpeak(text);
      });
    } else {
      const text = `${chapter.bePhase.title}. ${chapter.bePhase.content} ${chapter.bePhase.action || ''}`;
      ttsSpeak(text);
    }
  }, [ttsSpeak]);

  // ── Speak chapter info ("where am I?") ─────────────────────
  const speakChapterInfo = useCallback((chapter, index) => {
    const text = `Chapter ${index + 1} of ${C_SCALE_CHAPTERS.length}. ${chapter.title}. ${chapter.subtitle || ''}`;
    ttsSpeak(text);
  }, [ttsSpeak]);

  // ── Auto-speak on chapter change (only if hands-free active) ──
  useEffect(() => {
    if (handsFreeActiveRef.current && currentChapter) {
      devLog('[CScaleHub] Auto-speaking chapter intro for:', currentChapter.title);
      const intro = `Chapter ${currentStageIndex + 1}. ${currentChapter.title}.`;
      ttsSpeak(intro);
    }
  }, [activeStage, currentChapter, currentStageIndex, ttsSpeak]);

  // ── Map AI [TOOL:XXX] tags to UI actions ─────────────────────
  const TOOL_MAP = {
    PLAY_PITCH: 'play',
    START_METRONOME: 'play',
    START_MEDITATION: 'practice',
    NAVIGATE_NEXT: 'next',
    NEXT_SLIDE: 'next',
    PREV_SLIDE: 'previous',
    NAVIGATE_SONG: 'menu',
    NAVIGATE_PRACTICE: 'practice',
    NAVIGATE_HOME: 'home',
  };

  const executeTool = useCallback((toolName) => {
    const action = TOOL_MAP[toolName];
    if (action) {
      devLog('[CScaleHub] Executing AI tool:', toolName, '→ action:', action);
      window.dispatchEvent(new CustomEvent('voixvive:ai_command', { detail: { action } }));
    } else {
      devLog('[CScaleHub] Unknown AI tool:', toolName);
    }
  }, []);

  // ── Listen for AI-driven UI commands (Truebadour → UI) ──────
  useEffect(() => {
    const handleAICommand = (e) => {
      const { action } = e.detail;
      devLog('[CScaleHub] AI command received:', action);
      switch (action) {
        case 'next': goToChapter(1); break;
        case 'previous': goToChapter(-1); break;
        case 'practice': setPracticeMode(true); break;
        case 'close': setPracticeMode(false); break;
        case 'play': startListening(); break;
        case 'stop': stopListening(); droneEngine.stopAll(); setResonanceMode(false); break;
        case 'read': readChapterAloud(currentChapter); break;
        case 'complete': markComplete(currentChapter.id); break;
        case 'home': navigate('/dashboard'); break;
        case 'menu': navigate('/dashboard'); break;
        default: break;
      }
    };
    window.addEventListener('voixvive:ai_command', handleAICommand);
    return () => window.removeEventListener('voixvive:ai_command', handleAICommand);
  }, [goToChapter, startListening, stopListening, readChapterAloud, markComplete, currentChapter, navigate]);

  // ── AI intent interpretation for unhandled transcripts ──────
  // When no keyword matches, pipe the transcript to the Truebadour AI
  // with full context (current chapter, pitch state, practice mode).
  // The AI can respond conversationally AND emit [TOOL:XXX] tags to
  // drive the UI — true hands-free AI-driven navigation.
  const handleUnhandledTranscript = useCallback(async (transcript) => {
    if (aiBusyRef.current) {
      devLog('[CScaleHub] AI busy, skipping unhandled transcript');
      return;
    }
    if (!ai.chatStream) {
      devLog('[CScaleHub] No AI backend available, falling back to unknown response');
      return;
    }

    aiBusyRef.current = true;
    devLog('[CScaleHub] AI interpreting transcript:', transcript);

    const chapterNum = currentStageIndex + 1;
    const chapterTitle = currentChapter?.title || 'Unknown';
    const phase = practiceMode ? 'PLAY' : 'BE';
    const pitchState = isListening ? `Pitch detector active. Current note: ${noteInfo?.note || 'detecting...'}` : 'Pitch detector off';

    const contextMsg = `[HANDS-FREE CONTEXT] Student is on Chapter ${chapterNum}: ${chapterTitle}. Phase: ${phase}. ${pitchState}. Practice mode: ${practiceMode ? 'on' : 'off'}.\n\nStudent said: "${transcript}"`;

    const messages = [
      { role: 'user', content: contextMsg },
    ];

    try {
      const result = await ai.chatStream(messages, null, {
        mode: 'chat',
        currentFret: chapterNum,
        currentPhase: phase.toLowerCase(),
        autoPlay: true,
        onToolCall: (toolName) => executeTool(toolName),
      });

      const responseText = result?.choices?.[0]?.message?.content || '';
      devLog('[CScaleHub] AI responded:', responseText.substring(0, 100));

      // Also parse any tools that weren't caught by onToolCall
      const toolMatches = responseText.match(/\[TOOL:([A-Z_]+)\]/g) || [];
      toolMatches.forEach((m) => {
        const toolName = m.replace(/\[TOOL:|\]/g, '');
        executeTool(toolName);
      });
    } catch (err) {
      devLog('[CScaleHub] AI interpretation failed:', err);
    } finally {
      aiBusyRef.current = false;
    }
  }, [ai, currentStageIndex, currentChapter, practiceMode, isListening, noteInfo, executeTool]);

  const voiceHandlers = useMemo(() => ({
    next: () => goToChapter(1),
    previous: () => goToChapter(-1),
    repeat: () => readChapterAloud(currentChapter),
    read: () => readChapterAloud(currentChapter),
    menu: () => navigate('/dashboard'),
    home: () => navigate('/dashboard'),
    ask: () => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour')),
    practice: () => setPracticeMode(true),
    close: () => setPracticeMode(false),
    play: () => { if (!isListening) startListening(); },
    stop: () => { if (isListening) stopListening(); droneEngine.stopAll(); setResonanceMode(false); },
    record: () => { if (isListening) stopListening(); else startListening(); },
    where: () => speakChapterInfo(currentChapter, currentStageIndex),
    resonance: () => setResonanceMode(prev => !prev),
    complete: () => { markComplete(currentChapter.id); ttsSpeak('Chapter marked complete.'); },
    slower: () => window.dispatchEvent(new CustomEvent('voixvive:slower')),
    faster: () => window.dispatchEvent(new CustomEvent('voixvive:faster')),
    help: () => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour')),
  }), [goToChapter, navigate, isListening, startListening, stopListening, currentChapter, currentStageIndex, readChapterAloud, speakChapterInfo, markComplete, ttsSpeak]);

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
      <div className="px-4 md:px-10 mb-3 md:mb-[18px] flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80 hover:border-white/20 cursor-pointer transition-all"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="m-0 font-heading text-[1.5rem] md:text-[2.5rem] font-normal text-[var(--vv-cream)] truncate">The C Scale Journey</h1>
            <p className="mt-1 md:mt-2 font-mono text-[0.65rem] md:text-[0.8rem] tracking-[0.1em] uppercase text-[var(--vv-gold)]/60">The Matrix of the Fretboard (12 Chapters)</p>
          </div>
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
      <div className={`flex flex-col md:flex-row gap-3 md:gap-[27px] px-4 md:px-10 flex-1 min-h-0 ${practiceMode ? '!p-0' : ''}`}>
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

          <ChapterContentPanel chapter={currentChapter} />

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
      <HandsFreeCoachBar
        handlers={voiceHandlers}
        onActiveChange={(active) => { handsFreeActiveRef.current = active; }}
        onUnhandledTranscript={handleUnhandledTranscript}
      />
    </div>
  );
}
