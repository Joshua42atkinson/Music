// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : BookWidget.jsx                                       ║
// ║ WHAT    : The Blue Pill — Audio Suite + Navigation + Save      ║
// ║ WHY     : Separates the utility/sound layer from the AI layer. ║
// ║           The Book holds the map, the music, and the memory.   ║
// ║ POSITION: top-4 right-4  (opposite the red guitar widget)      ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useCallback, useMemo, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Music, Play, Pause, SkipForward, Volume2, VolumeX,
  Download, Upload, Compass, Square, Minus, Plus, Settings,
  Guitar, User, X, HelpCircle, Library, BookText, MessageSquare, Maximize, Minimize
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { useMetronome } from '../hooks/useMetronome';
import { useScaffolding } from './ScaffoldingProvider';
import useMobileDetect from '../hooks/useMobileDetect';
import useBookAudio from '../hooks/useBookAudio';
import { exportVoixViveFile, importVoixViveFile } from '../data/saveState';
import HelpMenu from './HelpMenu';
import TutorialMenu from './TutorialMenu';
import { buildChatPrompt } from '../data/truebadourPrompt';

const StudyChat = React.lazy(() => import('../features/somatic-masterclass/truebadour/StudyChat'));

// ── Music tracks ──────────────────────────────────────────────────
const TRACKS = [
  { id: 'houlton-skies', title: 'Houlton Skies',  artist: 'Bertrand Laurence', src: '/assets/houlton_skies.m4a' },
  { id: 'home-ambient',  title: { en: 'Home Sessions', fr: 'Sessions Maison' }, artist: 'Bertrand Laurence', src: '/assets/home_audio.m4a' },
];

// ── Tab IDs ────────────────────────────────────────────────────────
const TABS = [
  { id: 'study',   label: 'Binder',   icon: MessageSquare },
  { id: 'sound',   label: 'Sound',    icon: Music   },
  { id: 'nav',     label: 'Navigate', icon: Compass },
  { id: 'library', label: 'Library',  icon: Library },
  { id: 'save',    label: 'Settings', icon: Settings },
];

// ── Thin status light ──────────────────────────────────────────────
function Pip({ on, color = '#4488ff' }) {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      background: on ? color : 'rgba(255,255,255,0.12)',
      boxShadow: on ? `0 0 5px ${color}` : 'none',
      transition: 'all 0.3s',
      flexShrink: 0,
    }} />
  );
}

// ═══════════════════════════════════════════════════════════
// BOOK WIDGET
// ═══════════════════════════════════════════════════════════
export default function BookWidget() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { locale } = useLocale();
  const metro      = useMetronome();
  const { traction, updateTraction, bardLevel, streak, practiceMinutes, completedNodes, nextRecommended, currentFret, currentPhase } = useScaffolding();

  // ── AI wiring ──────────────────────────────────────────────
  const { ai, player, voiceInput, activeWidget, openBinder, closeAll } = useTruebadour();
  const { chatStream } = ai;
  const buildSystemPrompt = useCallback((ragContext = '') => {
    const base = buildChatPrompt({ traction, bardLevel, currentFret, currentPhase, locale });
    return ragContext ? base.replace('{{RAG_CONTEXT}}', ragContext) : base.replace('{{RAG_CONTEXT}}', 'Answer from general knowledge.');
  }, [traction, bardLevel, currentFret, currentPhase, locale]);

  // ── UI state ───────────────────────────────────────────────
  const open = activeWidget === 'binder';
  const setOpen = (val) => val ? openBinder() : closeAll();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tab, setTab]         = useState('study');
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const isMobile = useMobileDetect();
  const showNav = !['/', '/onboarding'].includes(location.pathname);

  // ── Voice state ────────────────────────────────────────────
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [guideInput, setGuideInput] = useState('');

  const toggleVoice = () => {
    if (voiceRecording) {
      if (voiceInput.isAvailable && voiceInput.isListening) voiceInput.stopListening();
      setVoiceRecording(false);
    } else if (voiceInput.isAvailable) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setVoiceRecording(true);
      voiceInput.startListening((transcript) => {
        setVoiceRecording(false);
        setGuideInput(transcript);
      }, locale);
    }
  };

  // ── Audio player ───────────────────────────────────────────
  const audio = useBookAudio({
    metroIsPlaying: metro.isPlaying,
    onMetroConflict: useCallback(() => metro.stop(), [metro]),
  });

  // ── Ambient events (widget-level, not audio-specific) ──────
  React.useEffect(() => {
    const onOpen = (e) => {
      if (e.detail?.mode === 'metronome') {
        setOpen(true);
        setTab('sound');
      }
    };
    window.addEventListener('ambient:open', onOpen);
    return () => window.removeEventListener('ambient:open', onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived ────────────────────────────────────────────────
  const isActive = useMemo(() => audio.isPlaying || metro.isPlaying, [audio.isPlaying, metro.isPlaying]);

  // ── Save / Load ────────────────────────────────────────────
  const exportSave = async () => { await exportVoixViveFile('adventurer'); };
  const importSave = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importVoixViveFile(file);
      window.location.reload();
    } catch {
      alert(locale === 'fr' ? 'Fichier invalide.' : 'Invalid save file.');
    }
  };

  // ── Colours ────────────────────────────────────────────────
  const BLUE    = '#4488ff';
  const BLUE_DIM = 'rgba(34,85,204,0.45)';
  const BG      = '#12100e';

  return (
    <>
      <div role="complementary" aria-label="Study Binder" className="fixed top-4 right-4 z-[2001] flex flex-row-reverse items-start gap-2">

        {/* ── Floating blue button ── */}
        {!(isMobile && showNav) && (
        <button
          id="book-widget-toggle"
          onClick={() => setOpen(v => !v)}
          className="flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md transition-all shrink-0"
          style={{
            width: open ? 'auto' : 44, height: 44, borderRadius: open ? 22 : '50%',
            padding: open ? '0 16px' : 0,
            background: open ? `rgba(34,85,204,0.25)` : `${BG}cc`,
            border: `2px solid ${open ? 'rgba(68,136,255,0.7)' : 'rgba(68,136,255,0.35)'}`,
            boxShadow: isActive
              ? `0 0 24px ${BLUE_DIM}, 0 0 8px ${BLUE_DIM}`
              : open ? `0 0 14px ${BLUE_DIM}` : 'none',
          }}
          title={locale === 'fr' ? 'Le Livre' : 'The Book'}
          aria-label="Open Book Widget"
        >
          <BookOpen
            size={22}
            style={{
              color: isActive ? BLUE : 'rgba(68,136,255,0.75)',
              animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
          {open && <X size={18} color="#e0834a" strokeWidth={3} />}
          {/* Playing indicator pip */}
          {isActive && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#050508]"
              style={{
                background: audio.isPlaying ? BLUE : '#7aaa88',
                boxShadow: `0 0 6px ${audio.isPlaying ? BLUE : '#7aaa88'}`,
              }}
            />
          )}
        </button>
        )}

        {/* ── Expanded panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="book-widget-panel"
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: 10, scale: 0.95 }}
              animate={isMobile ? { opacity: 1, y: 0, width: '100vw', height: isFullScreen ? '100vh' : 'auto' } : { opacity: 1, x: 0, scale: 1, width: isFullScreen ? '100vw' : 'min(100vw - 32px, 500px)', height: isFullScreen ? '100vh' : 'auto' }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={isMobile ? {
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                zIndex: 1050,
                maxHeight: isFullScreen ? '100vh' : '85svh',
                height: isFullScreen ? '100vh' : '85svh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: `${BG}f5`,
                backdropFilter: 'blur(20px)',
                borderTop: `1px solid rgba(68,136,255,0.35)`,
                borderTopLeftRadius: isFullScreen ? 0 : 24,
                borderTopRightRadius: isFullScreen ? 0 : 24,
                padding: '16px 16px max(20px, env(safe-area-inset-bottom))',
                boxShadow: `0 -8px 40px rgba(0,0,0,0.7)`,
              } : {
                position: isFullScreen ? 'fixed' : 'relative',
                top: isFullScreen ? -16 : 'auto',
                right: isFullScreen ? -16 : 'auto',
                zIndex: 60,
                maxHeight: isFullScreen ? '100vh' : 'calc(100vh - 40px)', 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: `${BG}f5`,
                backdropFilter: 'blur(20px)',
                border: isFullScreen ? 'none' : `1px solid rgba(68,136,255,0.25)`,
                borderRadius: isFullScreen ? 0 : 18,
                padding: '16px 16px 20px',
                boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(34,85,204,0.12)`,
              }}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-[#4488ff]">
                  {locale === 'fr' ? 'Bibliothèque' : 'Academy Library'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="bg-transparent border-0 text-white/30 cursor-pointer p-1"
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                  <button
                    onClick={() => { setOpen(false); setIsFullScreen(false); }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(34,85,204,0.15)] border border-[rgba(34,85,204,0.4)] cursor-pointer p-1 transition-all duration-200 text-[#4488ff]"
                    aria-label="Close"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* ── Content Area ── */}
              <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-1">
                {/* ── Tab bar ── */}
              <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-[10px] p-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-[7px] px-1 rounded-lg border-0 cursor-pointer font-mono text-[0.65rem] tracking-[0.08em] uppercase transition-all duration-150"
                    style={{
                      background: tab === id ? `rgba(34,85,204,0.3)` : 'transparent',
                      color: tab === id ? BLUE : 'rgba(255,255,255,0.35)',
                      boxShadow: tab === id ? `0 0 10px rgba(34,85,204,0.2)` : 'none',
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ══════════════════════════════════════════
                  TAB: STUDY — AI School Mode / Binder
              ══════════════════════════════════════════ */}
              {tab === 'study' && (
                <div className="flex-1 min-h-0 flex flex-col">
                  <Suspense fallback={<div>Loading Binder...</div>}>
                    <StudyChat
                      locale={locale}
                      chatStream={chatStream}
                      buildSystemPrompt={buildSystemPrompt}
                      traction={traction}
                      bardLevel={bardLevel}
                      currentFret={currentFret}
                      currentPhase={currentPhase}
                      playerModifier={player.getTruebadourModifier()}
                      voiceRecording={voiceRecording}
                      toggleVoice={toggleVoice}
                      voiceInputText={guideInput}
                    />
                  </Suspense>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  TAB: SOUND — Music + Metronome
              ══════════════════════════════════════════ */}
              {tab === 'sound' && (
                <div>
                  {/* Music player */}
                  <div
                    className="rounded-[14px] p-3.5 px-4 mb-3 bg-[rgba(68,136,255,0.06)] border border-[rgba(68,136,255,0.15)]"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(68,136,255,0.7)]">
                        Now Playing
                      </span>
                      <button onClick={audio.toggleMute} className="bg-transparent border-0 cursor-pointer" style={{ color: audio.isMuted ? 'rgba(255,255,255,0.3)' : BLUE }}>
                        {audio.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>

                    {audio.hasAudioError ? (
                      <p className="text-white/25 text-[0.75rem] text-center py-3 font-mono">
                        No audio file found
                      </p>
                    ) : (
                      <>
                        <div className="mb-2.5">
                          <div className="text-[0.9rem] text-[#f0e6d2] font-medium mb-0.5">{audio.localize(audio.track.title, locale)}</div>
                          <div className="text-[0.65rem] text-white/35 font-mono tracking-[0.08em] uppercase">{audio.track.artist}</div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-2.5">
                          <div className="h-[3px] bg-white/[0.08] rounded overflow-hidden mb-1">
                            <div
                              className="h-full rounded transition-[width] duration-1000 linear"
                              style={{ width: `${audio.progress}%`, background: `linear-gradient(90deg, rgba(34,85,204,0.8), ${BLUE})` }}
                            />
                          </div>
                          <div className="flex justify-between text-[0.6rem] text-white/25 font-mono">
                            <span>{audio.formatTime(audio.currentTime)}</span>
                            <span>{audio.formatTime(audio.duration)}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <button
                            onClick={audio.toggleMusic}
                            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                            style={{
                              background: `rgba(34,85,204,0.2)`,
                              border: `1px solid rgba(68,136,255,0.4)`,
                              color: BLUE,
                              boxShadow: audio.isPlaying ? `0 0 16px rgba(34,85,204,0.4)` : 'none',
                            }}
                          >
                            {audio.isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                          </button>
                          {TRACKS.length > 1 && (
                            <button onClick={audio.skipTrack} className="bg-transparent border-0 text-white/30 cursor-pointer">
                              <SkipForward size={18} />
                            </button>
                          )}
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-2">
                          <Music size={12} className="text-white/20 shrink-0" />
                          <input
                            type="range" min={0} max={1} step={0.05} value={audio.volume}
                            onChange={e => audio.handleVol(parseFloat(e.target.value))}
                            className="flex-1 cursor-pointer accent-[#4488ff]"
                          />
                          <span className="text-[0.6rem] text-white/20 font-mono w-[22px] text-right">
                            {Math.round(audio.volume * 100)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Metronome */}
                  <div
                    className="rounded-[14px] p-3.5 px-4 bg-[rgba(122,170,136,0.06)] border border-[rgba(122,170,136,0.15)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(122,170,136,0.7)]">
                        Metronome
                      </span>
                      {/* Beat dots */}
                      <div className="flex gap-1">
                        {Array.from({ length: metro.beats }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full transition-all duration-75"
                            style={{
                              background: metro.currentBeat === i && metro.isPlaying
                                ? (i === 0 ? '#7aaa88' : 'rgba(122,170,136,0.6)')
                                : 'rgba(255,255,255,0.1)',
                              boxShadow: metro.currentBeat === i && metro.isPlaying ? '0 0 6px rgba(122,170,136,0.7)' : 'none',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-[2rem] font-mono text-[#f0e6d2] font-light mb-2.5">
                      {metro.bpm} <span className="text-[0.7rem] text-white/30 tracking-[0.1em]">BPM</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <button onClick={() => metro.setBpm(b => Math.max(40, b - 5))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 cursor-pointer flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <input
                        type="range" min={40} max={208} value={metro.bpm}
                        onChange={e => metro.setBpm(parseInt(e.target.value))}
                        className="flex-1 cursor-pointer accent-[#7aaa88]"
                      />
                      <button onClick={() => metro.setBpm(b => Math.min(208, b + 5))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 cursor-pointer flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => metro.setBeats(b => b === 4 ? 3 : 4)} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/50 text-[0.75rem] font-mono cursor-pointer">
                        {metro.beats}/4
                      </button>
                      <button
                        onClick={() => metro.setIsPlaying(!metro.isPlaying)}
                        className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                        style={{
                          background: metro.isPlaying ? 'rgba(122,170,136,0.2)' : 'rgba(255,255,255,0.08)',
                          border: `1px solid ${metro.isPlaying ? 'rgba(122,170,136,0.4)' : 'rgba(255,255,255,0.15)'}`,
                          color: metro.isPlaying ? '#7aaa88' : '#f0e6d2',
                          boxShadow: metro.isPlaying ? '0 0 14px rgba(122,170,136,0.3)' : 'none',
                        }}
                      >
                        {metro.isPlaying ? <Square size={18} /> : <Play size={20} className="ml-0.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  TAB: NAVIGATE — Portal map
              ══════════════════════════════════════════ */}
              {tab === 'nav' && (
                <div>
                  {/* Apprentice status card */}
                  <div
                    className="rounded-[14px] p-3 px-3.5 mb-3.5 bg-cf-gold/[0.06] border border-cf-gold/18"
                  >
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(var(--cf-gold-rgb),0.7)]">
                        Apprentice Status
                      </span>
                      <span className="font-mono text-[0.65rem] bg-cf-gold/15 text-cf-gold px-2 py-0.5 rounded-md">
                        Lv.{bardLevel}
                      </span>
                    </div>
                    <div className="flex justify-around mb-3">
                      {[
                        { val: streak || 0, label: 'Streak' },
                        { val: practiceMinutes || 0, label: 'Minutes' },
                        { val: completedNodes?.length || 0, label: 'Frets' },
                      ].map(({ val, label }) => (
                        <div key={label} className="text-center">
                          <div className="text-[1.1rem] text-[#f0e6d2] font-[Cormorant_Garamond]">{val}</div>
                          <div className="text-[0.5rem] text-white/30 font-mono tracking-[0.08em] uppercase">{label}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { if (nextRecommended) navigate(`/class/${nextRecommended}`); else navigate('/song'); setOpen(false); }}
                      className="w-full py-2 rounded-lg bg-cf-gold/10 border border-cf-gold/30 text-cf-gold cursor-pointer font-mono text-[0.65rem] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5"
                    >
                      <Play size={12} fill="currentColor" /> Resume Journey
                    </button>
                  </div>

                  {/* Portal links */}
                  <div className="flex flex-col gap-1.5">
                    {[
                      { path: '/',          icon: User,     label: 'Home Portal' },
                      { path: '/song',      icon: Music,    label: 'Orientation Hub' },
                      { path: '/guitar',    icon: Guitar,   label: 'Guitar Workbench' },
                      { path: '/player',    icon: Play,     label: 'Audio & Videos' },
                      { path: '/guitar/map',icon: Compass,  label: 'Maturation Map' },
                    ].map(({ path, icon: Icon, label }) => {
                      const active = location.pathname === path;
                      return (
                        <button
                          key={path}
                          onClick={() => { navigate(path); setOpen(false); }}
                          className="flex items-center gap-2 py-2 px-3 rounded-[10px] cursor-pointer font-mono text-[0.7rem] tracking-[0.08em] uppercase text-left transition-all duration-150"
                          style={{
                            background: active ? 'rgba(68,136,255,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(68,136,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                            color: active ? BLUE : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  TAB: SAVE — Save / Load / Settings
              ══════════════════════════════════════════ */}
              {tab === 'save' && (
                <div>
                  {/* Save / Load */}
                  <div
                    className="rounded-[14px] p-3.5 px-4 mb-3.5 bg-[rgba(68,136,255,0.04)] border border-[rgba(68,136,255,0.12)]"
                  >
                    <div className="font-[EB_Garamond] italic text-white/50 text-[0.85rem] mb-2.5">
                      The Memory Card
                    </div>
                    <div className="flex gap-2 mb-2.5">
                      <button
                        onClick={exportSave}
                        className="flex-1 py-2.5 rounded-[10px] bg-cf-sage/10 border border-cf-sage/30 text-cf-sage cursor-pointer font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center justify-center gap-1.5"
                      >
                        <Download size={14} /> Save State
                      </button>
                      <label className="flex-1 py-2.5 rounded-[10px] bg-cf-gold/10 border border-cf-gold/30 text-cf-gold cursor-pointer font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center justify-center gap-1.5">
                        <Upload size={14} /> Load State
                        <input type="file" accept=".voixvive,.json" onChange={importSave} className="hidden" />
                      </label>
                    </div>
                    <p className="text-[0.6rem] text-white/20 font-mono leading-[1.5]">
                      Your progress is saved locally. Export a <code>.voixvive</code> file to back up or transfer between devices.
                    </p>
                  </div>

                  {/* Curriculum settings */}
                  <div
                    className="rounded-[14px] p-3.5 px-4 mb-3.5 bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="font-[EB_Garamond] italic text-white/50 text-[0.85rem] mb-2.5">
                      Curriculum Rules
                    </div>
                    {[
                      {
                        label: 'Path',
                        opts: [
                          { val: false, key: 'sandboxMode', label: 'Guided Path', color: BLUE },
                          { val: true,  key: 'sandboxMode', label: 'Open Book',   color: 'var(--cf-gold)' },
                        ],
                      },
                      {
                        label: 'Mode',
                        opts: [
                          { val: false, key: 'kidMode', label: 'Masterclass', color: BLUE },
                          { val: true,  key: 'kidMode', label: 'Apprentice',  color: 'var(--cf-gold)' },
                        ],
                      },
                      {
                        label: 'AI',
                        opts: [
                          { val: true,  key: 'aiEnabled', label: 'Truebadour', color: '#cc3333' },
                          { val: false, key: 'aiEnabled', label: 'Silent',     color: '#7aaa88' },
                        ],
                      },
                    ].map(({ label, opts }) => (
                      <div key={label} className="mb-2.5">
                        <div className="text-[0.55rem] text-white/25 font-mono tracking-[0.1em] uppercase mb-1">{label}</div>
                        <div className="flex gap-1.5">
                          {opts.map(({ val, key, label: optLabel, color }) => {
                            const active = traction?.settings?.[key] === val || (key === 'aiEnabled' && val === true && traction?.settings?.aiEnabled !== false);
                            return (
                              <button
                                key={optLabel}
                                onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, [key]: val } }))}
                                className="flex-1 py-[7px] rounded-lg cursor-pointer font-mono text-[0.6rem] tracking-[0.06em] uppercase transition-all duration-150"
                                style={{
                                  background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                                  color: active ? color : 'rgba(255,255,255,0.35)',
                                }}
                              >
                                {optLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={exportSave}
                    className="w-full py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-white/40 font-mono text-[0.65rem] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} /> Export Save Data
                  </button>
                </div>
              )}

              {/* ══════════════════════════════════════════
                  TAB: LIBRARY — Tutorial, Help, Bible
              ══════════════════════════════════════════ */}
              {tab === 'library' && (
                <div className="flex flex-col gap-2.5">

                  {/* ── PRIMARY: How This Works guide ── */}
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="w-full p-4 rounded-[14px] border border-cf-gold/40 text-left cursor-pointer transition-all duration-200 hover:from-[rgba(var(--cf-gold-rgb),0.22)] hover:to-[rgba(var(--cf-gold-rgb),0.1)] bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.15)] to-[rgba(var(--cf-gold-rgb),0.06)]"
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[20px]">♾️</span>
                      <span className="text-cf-gold font-[Cormorant_Garamond] text-[1rem] font-semibold">How This Works</span>
                    </div>
                    <p className="m-0 ml-[30px] text-[rgba(var(--cf-gold-rgb),0.6)] font-mono text-[0.6rem] tracking-[0.08em] uppercase">Start here · 7-step guided tour</p>
                  </button>

                  <div className="p-4 rounded-[14px] bg-white/[0.02] border border-white/[0.05]">
                    <h3 className="text-white/50 font-[Cormorant_Garamond] text-[1rem] mb-2.5 mt-0">
                      More Resources
                    </h3>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setShowHelp(true)}
                        className="w-full py-3 rounded-[10px] bg-white/[0.05] border border-white/[0.1] text-white/70 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 text-left cursor-pointer"
                      >
                        <HelpCircle size={16} /> Academy Philosophy
                      </button>
                      <button
                        onClick={() => setShowHelp(true)}
                        className="w-full py-3 rounded-[10px] bg-white/[0.05] border border-white/[0.1] text-white/70 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 cursor-pointer"
                      >
                        <HelpCircle size={16} /> Academy Help & Philosophy
                      </button>
                      <button
                        onClick={() => { navigate('/12m'); setOpen(false); }}
                        className="w-full py-3 rounded-[10px] bg-white/[0.02] border border-white/[0.05] text-white/50 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 cursor-pointer"
                      >
                        <BookText size={16} /> Open the 12M Bible
                      </button>
                    </div>
                  </div>
                </div>
              )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      <style>{`
        @media (max-width: 768px) {
           .panel-container { height: 85svh !important; display: flex; flex-direction: column; }
        }
        #book-widget-toggle:hover { filter: brightness(1.15); }
      `}</style>
      {showHelp && <HelpMenu onClose={() => setShowHelp(false)} />}
      {showTutorial && <TutorialMenu onClose={() => setShowTutorial(false)} />}
    </>
  );
}
