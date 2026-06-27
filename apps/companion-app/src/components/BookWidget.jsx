import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Music, Compass, Settings, Library, MessageSquare, Maximize, Minimize, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { useMetronome } from '../hooks/useMetronome';
import { useScaffolding } from './ScaffoldingProvider';
import useMobileDetect from '../hooks/useMobileDetect';
import useBookAudio from '../hooks/useBookAudio';
import HelpMenu from './HelpMenu';
import TutorialMenu from './TutorialMenu';
import { buildChatPrompt } from '../data/truebadourPrompt';

// ── Decomposed Tabs ──
import SoundTab from './book-widget/SoundTab';
import NavigateTab from './book-widget/NavigateTab';
import SettingsTab from './book-widget/SettingsTab';
import LibraryTab from './book-widget/LibraryTab';

const StudyChat = React.lazy(() => import('../features/somatic-masterclass/truebadour/StudyChat'));

const TRACKS = [
  { id: 'houlton-skies', title: 'Houlton Skies',  artist: 'Bertrand Laurence', src: '/assets/houlton_skies.m4a' },
  { id: 'home-ambient',  title: { en: 'Home Sessions', fr: 'Sessions Maison' }, artist: 'Bertrand Laurence', src: '/assets/home_audio.m4a' },
];

const TABS = [
  { id: 'study',   label: 'Binder',   icon: MessageSquare },
  { id: 'sound',   label: 'Sound',    icon: Music   },
  { id: 'nav',     label: 'Navigate', icon: Compass },
  { id: 'library', label: 'Library',  icon: Library },
  { id: 'save',    label: 'Settings', icon: Settings },
];

const BLUE = '#4488ff';
const BLUE_DIM = 'rgba(34,85,204,0.45)';
const BG = '#12100e';

export default function BookWidget() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { locale } = useLocale();
  const metro      = useMetronome();
  const { traction, updateTraction, bardLevel, streak, practiceMinutes, completedNodes, nextRecommended, currentFret, currentPhase } = useScaffolding();

  const { ai, player, voiceInput, activeWidget, openBinder, closeAll } = useTruebadour();
  const { chatStream } = ai;
  const buildSystemPrompt = useCallback((ragContext = '') => {
    const base = buildChatPrompt({ traction, bardLevel, currentFret, currentPhase, locale });
    return ragContext ? base.replace('{{RAG_CONTEXT}}', ragContext) : base.replace('{{RAG_CONTEXT}}', 'Answer from general knowledge.');
  }, [traction, bardLevel, currentFret, currentPhase, locale]);

  const open = activeWidget === 'binder';
  const setOpen = (val) => val ? openBinder() : closeAll();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tab, setTab]         = useState('study');
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const isMobile = useMobileDetect();
  const showNav = !['/', '/onboarding'].includes(location.pathname);

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

  const audio = useBookAudio({
    metroIsPlaying: metro.isPlaying,
    onMetroConflict: useCallback(() => metro.stop(), [metro]),
  });

  React.useEffect(() => {
    const onOpen = (e) => {
      if (e.detail?.mode === 'metronome') {
        setOpen(true);
        setTab('sound');
      }
    };
    window.addEventListener('ambient:open', onOpen);
    return () => window.removeEventListener('ambient:open', onOpen);
  }, []);

  const isActive = useMemo(() => audio.isPlaying || metro.isPlaying, [audio.isPlaying, metro.isPlaying]);

  return (
    <>
      <div role="complementary" aria-label="Study Binder" className="fixed top-4 right-4 z-[2001] flex flex-row-reverse items-start gap-2">
        {/* ── Floating blue button removed in favor of UnifiedAssistantMenu ── */}

        <AnimatePresence>
          {open && (
            <motion.div
              id="book-widget-panel"
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: 10, scale: 0.95 }}
              animate={isMobile ? { opacity: 1, y: 0, width: '100vw', height: isFullScreen ? '100vh' : 'auto' } : { opacity: 1, x: 0, scale: 1, width: isFullScreen ? '100vw' : 'min(100vw - 32px, 500px)', height: isFullScreen ? '100vh' : 'auto' }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col overflow-hidden bg-[#12100e]/95 backdrop-blur-[20px] ${
                isMobile
                  ? `fixed bottom-0 left-0 right-0 z-[1050] w-screen shadow-[0_-8px_40px_rgba(0,0,0,0.7)] border-t border-[#4488ff]/35 px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] ${isFullScreen ? 'rounded-none' : 'rounded-t-[24px]'}`
                  : `z-60 shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(34,85,204,0.12)] p-4 ${
                      isFullScreen 
                        ? 'fixed top-0 right-0 border-none rounded-none' 
                        : 'relative border border-[#4488ff]/25 rounded-[18px]'
                    }`
              }`}
              style={{
                maxHeight: isFullScreen ? '100vh' : (isMobile ? '85svh' : 'calc(100vh - 40px)'),
              }}
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-[#4488ff]">
                  {locale === 'fr' ? 'Bibliothèque' : 'Academy Library'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsFullScreen(!isFullScreen)} className="bg-transparent border-0 text-white/30 cursor-pointer p-1">
                    {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                  <button onClick={() => { setOpen(false); setIsFullScreen(false); }} className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(34,85,204,0.15)] border border-[rgba(34,85,204,0.4)] cursor-pointer p-1 text-[#4488ff]">
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-1">
                <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-[10px] p-1">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-[7px] px-1 rounded-lg border-0 cursor-pointer font-mono text-[0.65rem] tracking-[0.08em] uppercase transition-all duration-150 ${
                        tab === id
                          ? 'bg-[#2255cc]/30 text-[#4488ff] shadow-[0_0_10px_rgba(34,85,204,0.2)]'
                          : 'bg-transparent text-white/35'
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>

                {tab === 'study' && (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <Suspense fallback={<div>Loading Binder...</div>}>
                      <StudyChat
                        locale={locale} chatStream={chatStream} buildSystemPrompt={buildSystemPrompt}
                        traction={traction} bardLevel={bardLevel} currentFret={currentFret} currentPhase={currentPhase}
                        playerModifier={player.getTruebadourModifier()} voiceRecording={voiceRecording}
                        toggleVoice={toggleVoice} voiceInputText={guideInput}
                      />
                    </Suspense>
                  </div>
                )}

                {tab === 'sound' && <SoundTab audio={audio} metro={metro} locale={locale} tracks={TRACKS} />}
                
                {tab === 'nav' && (
                  <NavigateTab 
                    bardLevel={bardLevel} streak={streak} practiceMinutes={practiceMinutes}
                    completedNodes={completedNodes} nextRecommended={nextRecommended} setOpen={setOpen}
                  />
                )}
                
                {tab === 'save' && (
                  <SettingsTab locale={locale} traction={traction} updateTraction={updateTraction} />
                )}
                
                {tab === 'library' && (
                  <LibraryTab setShowTutorial={setShowTutorial} setShowHelp={setShowHelp} setOpen={setOpen} />
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
      `}</style>
      {showHelp && <HelpMenu onClose={() => setShowHelp(false)} />}
      {showTutorial && <TutorialMenu onClose={() => setShowTutorial(false)} />}
    </>
  );
}
