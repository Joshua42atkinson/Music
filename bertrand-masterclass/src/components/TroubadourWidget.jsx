import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music, Minus, Plus, Square, HelpCircle, MessageSquare, Send, Wifi, WifiOff, Mic, MicOff, Settings, Download, Upload, User, Compass } from 'lucide-react';
import { Guitar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exportVoixViveFile, importVoixViveFile } from '../data/saveState';
import { useLocale } from '../hooks/useLocale';
import { useTroubadourAI } from '../hooks/useTroubadourAI';
import { useKokoroTTS } from '../hooks/useKokoroTTS';
import { useWllamaTroubadour } from '../hooks/useWllamaTroubadour';
import { useQwenTTS } from '../hooks/useQwenTTS';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useScaffolding } from './ScaffoldingProvider';
import { useMetronome } from '../hooks/useMetronome';
import { buildChatPrompt, buildTroubadourPrompt, enforceOver } from '../data/troubadourPrompt';
import { searchChunks, buildContextBlock } from '../data/ragStore';
import HelpMenu from './HelpMenu';

// ── Server status dot ─────────────────────────────────────────────────
function ServerLight({ connected, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: connected ? color : 'rgba(255,255,255,0.15)',
        boxShadow: connected ? `0 0 4px ${color}` : 'none',
        transition: 'all 0.3s',
      }} />
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TROUBADOUR WIDGET — AI companion + Music + Metronome
// Globally persistent, voice-first, AI-driven interface
// ═══════════════════════════════════════════════════════════

const TRACKS = [
  { id: 'houlton-skies', title: 'Houlton Skies',  artist: 'Bertrand Laurence', src: '/assets/houlton_skies.m4a' },
  { id: 'home-ambient',  title: { en: 'Home Sessions', fr: 'Sessions Maison' }, artist: 'Bertrand Laurence', src: '/assets/home_audio.m4a' },
];

// ── Main component ──────────────────────────────────────────────────────
export default function TroubadourWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, t } = useLocale();
  const { chatStream, backend: aiBackend, wllamaRef, kokoroRef, qwenRef, voiceRef, speakText } = useTroubadourAI();
  const kokoro = useKokoroTTS();
  const wllama = useWllamaTroubadour();
  const qwen = useQwenTTS();
  const voiceInput = useVoiceInput();
  const { isDaaSConnected, isLMStudioConnected } = useBackendBridge();
  const { traction, updateTraction, bardLevel, practiceMinutes, streak, currentNodeId, currentNode, currentFret, currentPhase, completedNodes, nextRecommended } = useScaffolding();
  const [mode, setMode]           = useState('music');
  const [showControls, setShowControls] = useState(false);
  const [showHelp, setShowHelp]   = useState(false);

  // Guide (AI chat) state
  const [guideInput, setGuideInput]   = useState('');
  const [guideMessages, setGuideMessages] = useState([]);
  const [guideStreaming, setGuideStreaming] = useState(false);
  const guideEndRef = useRef(null);
  const guideInputRef = useRef(null);

  // Voice mode state (StepAudio 2.5 integration)
  const [voiceConnected, setVoiceConnected] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const voiceServiceRef = useRef(null);

  // ── Wire AI hooks to useTroubadourAI refs ──────────────────────
  useEffect(() => { kokoroRef.current = kokoro; }, [kokoro]);
  useEffect(() => { wllamaRef.current = wllama; }, [wllama]);
  useEffect(() => { qwenRef.current = qwen; }, [qwen]);
  useEffect(() => { voiceRef.current = voiceInput; }, [voiceInput]);

  // ── Voix tier load state ───────────────────────────────────────
  const [voixLoading, setVoixLoading] = useState(false);
  const [voixReady, setVoixReady] = useState(false);

  // ── Notification Hub ──────────────────────────────────────────
  // Derive actionable notifications from traction state
  const notifications = useMemo(() => {
    const items = [];
    const now = new Date();
    const lastPractice = traction.lastPracticeDate ? new Date(traction.lastPracticeDate) : null;
    const daysSincePractice = lastPractice
      ? Math.floor((now - lastPractice) / (1000 * 60 * 60 * 24))
      : Infinity;

    // Practice reminder
    if (daysSincePractice >= 2) {
      items.push({
        id: 'practice-reminder',
        type: 'reminder',
        icon: '🎸',
        title: locale === 'fr' ? 'Temps de pratique' : 'Practice Time',
        message: daysSincePractice === Infinity
          ? (locale === 'fr' ? 'Commencez votre parcours musical.' : 'Begin your musical journey.')
          : (locale === 'fr' ? `Dernier entraînement il y a ${daysSincePractice} jours.` : `Last practice was ${daysSincePractice} days ago.`),
        action: () => navigate('/guitar'),
        actionLabel: locale === 'fr' ? 'Aller au Workbench' : 'Open Workbench',
      });
    }

    // Orientation recommendation (new student)
    if (!traction.onboardingComplete && daysSincePractice === Infinity) {
      items.push({
        id: 'orientation',
        type: 'suggestion',
        icon: '🧭',
        title: locale === 'fr' ? 'Orientation guidée' : 'Guided Orientation',
        message: locale === 'fr'
          ? 'Un parcours de 2 minutes pour configurer votre rythme.'
          : 'A 2-minute walkthrough to set your pace.',
        action: () => navigate('/onboarding'),
        actionLabel: locale === 'fr' ? 'Commencer' : 'Start',
      });
    }

    // Streak at risk
    if (streak > 0 && daysSincePractice >= 1) {
      items.push({
        id: 'streak-risk',
        type: 'alert',
        icon: '🔥',
        title: locale === 'fr' ? 'Série en danger' : 'Streak at Risk',
        message: locale === 'fr'
          ? `Votre série de ${streak} jours risque de se briser.`
          : `Your ${streak}-day streak is about to break.`,
        action: () => navigate('/guitar'),
        actionLabel: locale === 'fr' ? 'Pratiquer maintenant' : 'Practice Now',
      });
    }

    return items;
  }, [traction, streak, locale, navigate]);

  const hasNotifications = notifications.length > 0;

  const loadVoixTier = async () => {
    if (voixLoading || voixReady) return;
    setVoixLoading(true);
    try {
      // Load Kokoro TTS first (lighter, ~300 MB)
      await kokoro.initTTS();
      // Then load wllama LLM (~700 MB for 1.2B Instruct)
      await wllama.initEngine('1.2b-instruct');
      setVoixReady(true);
    } catch (err) {
      console.error('[VoixVive] Voix tier load failed:', err);
    } finally {
      setVoixLoading(false);
    }
  };
  
  // Paralinguistics & Net Protocol State
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [netProtocolState, setNetProtocolState] = useState('idle'); // idle, listening, over_expected, ready_expected

  useEffect(() => {
    guideEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guideMessages]);

  // Cleanup voice service on unmount
  useEffect(() => {
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.disconnect();
      }
    };
  }, []);

  // Auto-focus chat input when opened with focusChat
  useEffect(() => {
    if (showControls && mode === 'music') {
      // Small delay to allow animation
      const t = setTimeout(() => guideInputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [showControls, mode]);

  // ═══════════════════════════════════════════════════════════
  // PROMPT — Natural chat mode for the chat widget
  // Uses buildChatPrompt for conversation, buildTroubadourPrompt
  // for game/somatic moments (triggered separately).
  // ═══════════════════════════════════════════════════════════

  // Memoize base prompt — only rebuilds when student context changes
  const baseSystemPrompt = useMemo(() => buildChatPrompt({
    traction,
    bardLevel,
    currentFret,
    currentPhase,
    locale,
  }), [traction, bardLevel, currentFret, currentPhase, locale]);

  const buildSystemPrompt = useCallback((ragContext = '') => {
    // Inject RAG context into the {{RAG_CONTEXT}} placeholder
    return ragContext
      ? baseSystemPrompt.replace('{{RAG_CONTEXT}}', ragContext)
      : baseSystemPrompt.replace('{{RAG_CONTEXT}}', 'No specific curriculum entries retrieved for this query. Answer from general knowledge.');
  }, [baseSystemPrompt]);

  const sendGuideMessage = async () => {
    const text = guideInput.trim();
    if (!text || guideStreaming) return;
    setGuideInput('');
    const userMsg = { role: 'user', content: text };
    setGuideMessages(prev => [...prev, userMsg]);
    setGuideStreaming(true);
    const placeholder = { role: 'assistant', content: '' };
    setGuideMessages(prev => [...prev, placeholder]);
    try {
      // Retrieve relevant curriculum context
      const ragChunks = await searchChunks(text, {
        topK: 3,
        locale,
        filter: { fret: currentFret },
      });
      const ragContext = buildContextBlock(ragChunks);

      const history = [...guideMessages, userMsg].slice(-8);
      await chatStream(
        [{ role: 'system', content: buildSystemPrompt(ragContext) }, ...history],
        (chunk, full) => {
          setGuideMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: full },
          ]);
        },
        {
          max_tokens: 256,
          temperature: 0.7,
          mode: 'chat',
          locale,
          traction,
          bardLevel,
          currentFret,
          currentPhase,
        }
      );
    } catch {
      setGuideMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: locale === 'fr'
          ? 'Je suis en mode hors ligne. Posez-moi une question sur la guitare et je ferai de mon mieux.'
          : 'I\'m in offline mode. Ask me anything about guitar and I\'ll do my best.'
        },
      ]);
    } finally {
      setGuideStreaming(false);
    }
  };

  // ── Voice input: local STT (Voix tier) or StepAudio (Chant tier) ──
  const toggleVoice = async () => {
    // If already recording, stop
    if (voiceRecording) {
      // Try local voice input first
      if (voiceInput.isAvailable && voiceInput.isListening) {
        voiceInput.stopListening();
        setVoiceRecording(false);
        return;
      }
      // Try StepAudio voice service
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopRecording();
        setVoiceRecording(false);
        return;
      }
    }

    // ── Try local voice input (Voix tier: Web Speech Recognition) ──
    if (voiceInput.isAvailable) {
      // Cancel any playing TTS so user can speak without hearing themselves echoed
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      setVoiceRecording(true);
      voiceInput.startListening(async (transcript, confidence) => {
        setVoiceRecording(false);
        setGuideInput(transcript);

        const userMsg = { role: 'user', content: transcript };
        setGuideMessages(prev => [...prev, userMsg]);
        setGuideStreaming(true);
        const placeholder = { role: 'assistant', content: '' };
        setGuideMessages(prev => [...prev, placeholder]);

        try {
          // Retrieve RAG context for voice input too
          const ragChunks = await searchChunks(transcript, {
            topK: 3, locale, filter: { fret: currentFret },
          });
          const ragContext = buildContextBlock(ragChunks);

          await chatStream(
            [{ role: 'system', content: buildSystemPrompt(ragContext) }, ...guideMessages.slice(-10), userMsg],
            (chunk, full) => {
              setGuideMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: full }]);
            },
            {
              max_tokens: 512, temperature: 0.1, mode: 'chat', locale,
              traction, bardLevel, currentFret, currentPhase,
            }
          );
        } catch {
          setGuideMessages(prev => [...prev.slice(0, -1), {
            role: 'assistant',
            content: locale === 'fr'
              ? 'Je ne comprends pas bien. Essayez de reformuler.'
              : 'I didn\'t catch that. Try rephrasing.',
          }]);
        } finally {
          setGuideStreaming(false);
        }
      }, locale);
      return;
    }

    // ── Fallback: StepAudio 2.5 voice service (Chant tier) ──
    try {
      const { getAudioStreamingService } = await import('../lib/audioStreamingService.js');
      const svc = getAudioStreamingService();
      voiceServiceRef.current = svc;

      if (!voiceConnected) {
        await svc.connect();
        svc.onConnectionChange = (connected) => setVoiceConnected(connected);
        svc.onTextReceived = (text) => {
          setGuideMessages(prev => [...prev, { role: 'assistant', content: text }]);
        };
        svc.onAudioReceived = () => { setVoicePlaying(true); };
        svc.onParalinguistic = (evt) => {
          console.log('[Troubadour] Paralinguistic:', evt.emotion, evt.confidence);
          setDetectedEmotion(evt.emotion);
          if (evt.emotion === 'frustrated') {
            handleModeSwitchRef.current?.('music');
            audioRef.current?.play().catch(() => {});
          }
        };
        svc.onError = (err) => {
          console.error('[Troubadour Voice] Error:', err);
          setVoiceConnected(false);
        };
        setVoiceConnected(true);
      }

      await svc.startRecording();
      setVoiceRecording(true);
    } catch (err) {
      console.warn('[Troubadour Voice] All voice methods failed:', err);
      setVoiceRecording(false);
    }
  };

  // Track if the player has ever been opened to stop the slow, elegant breathing glow
  const [hasClickedOnce, setHasClickedOnce] = useState(() => 
    localStorage.getItem('voix_vive_ambient_clicked') === '1'
  );

  // Music state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted]     = useState(false);
  const [volume, setVolume]       = useState(0.3);
  const [trackIdx, setTrackIdx]   = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]   = useState(0);
  const [hasError, setHasError]   = useState(false);
  const audioRef = useRef(null);
  const track    = TRACKS[trackIdx];
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const metro = useMetronome();
  const handleModeSwitchRef = useRef(null);

  const handleModeSwitch = useCallback((newMode) => {
    if (newMode === mode) return;
    audioRef.current?.pause();
    metro.stop();
    setMode(newMode);
  }, [mode, metro]);

  useEffect(() => { handleModeSwitchRef.current = handleModeSwitch; }, [handleModeSwitch]);

  useEffect(() => {
    if (metro.isPlaying) audioRef.current?.pause();
  }, [metro.isPlaying]);

  useEffect(() => {
    if (isPlaying) metro.stop();
  }, [isPlaying, metro]);

  useEffect(() => {
    let mounted = true;
    const audio = new Audio(track.src);
    audio.volume = volumeRef.current;
    audio.loop   = true;
    audio.preload = 'auto';

    const onTimeUpdate  = () => { if (mounted) setCurrentTime(audio.currentTime); };
    const onMeta        = () => { if (mounted) setDuration(audio.duration); };
    const onPlay        = () => { if (mounted) setIsPlaying(true); };
    const onPause       = () => { if (mounted) setIsPlaying(false); };
    const onError       = (e) => {
      if (!mounted) return;
      console.warn('Audio error:', e, audio.error?.message);
      setHasError(true);
    };

    audio.addEventListener('timeupdate',    onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play',          onPlay);
    audio.addEventListener('pause',         onPause);
    audio.addEventListener('error',         onError);

    audioRef.current = audio;
    setTimeout(() => {
      if (mounted) setHasError(false);
    }, 0);

    return () => {
      mounted = false;
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, [track.src, trackIdx]);

  useEffect(() => {
    const onPause  = () => audioRef.current?.pause();
    const onResume = () => { if (!metro.isPlaying) audioRef.current?.play().catch(() => {}); };
    const onOpen   = (e) => {
      handleModeSwitchRef.current?.(e.detail?.mode || 'music');
      setShowControls(true);
      if (e.detail?.focusChat) {
        setTimeout(() => guideInputRef.current?.focus(), 350);
      }
      if (!hasClickedOnce) {
        setHasClickedOnce(true);
        localStorage.setItem('voix_vive_ambient_clicked', '1');
      }
    };
    const onAsk = (e) => {
      const text = e.detail?.text;
      if (!text) return;
      setShowControls(true);
      handleModeSwitchRef.current?.('music');
      setTimeout(() => {
        setGuideInput(text);
        guideInputRef.current?.focus();
      }, 300);
    };
    window.addEventListener('ambient:pause',  onPause);
    window.addEventListener('ambient:resume', onResume);
    window.addEventListener('ambient:open',   onOpen);
    window.addEventListener('ambient:ask',    onAsk);
    return () => {
      window.removeEventListener('ambient:pause',  onPause);
      window.removeEventListener('ambient:resume', onResume);
      window.removeEventListener('ambient:open',   onOpen);
      window.removeEventListener('ambient:ask',    onAsk);
    };
  }, [hasClickedOnce, metro.isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  };
  const toggleMute  = () => { audioRef.current.muted = !isMuted; setIsMuted(m => !m); };
  const handleVol   = (v) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v; };
  const skipTrack   = () => { audioRef.current?.pause(); setTrackIdx(i => (i + 1) % TRACKS.length); };
  const formatTime  = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const isActive = mode === 'music' ? isPlaying : metro.isPlaying;

  const localize = (val) => {
    if (!val) return '';
    if (typeof val === 'object') return val[locale] || val['en'] || '';
    return val;
  };

  const handleButtonClick = () => {
    setShowControls(v => !v);
    if (!hasClickedOnce) {
      setHasClickedOnce(true);
      localStorage.setItem('voix_vive_ambient_clicked', '1');
    }
  };

  const activeProfile = localStorage.getItem('active_student_profile');

  const exportVoixVive = async () => {
    await exportVoixViveFile('adventurer');
  };

  const importVoixVive = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importVoixViveFile(file);
      window.location.reload();
    } catch (err) {
      alert(locale === 'fr' ? "Fichier invalide." : "Invalid save file.");
    }
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex items-start gap-2">

        {/* Floating button — glows until first clicked */}
        <button
          onClick={handleButtonClick}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border-2 shadow-lg transition-all ${
            isActive
              ? 'bg-violet-500/25 border-violet-400/60 shadow-[0_0_24px_rgba(139,92,246,0.5)]'
              : !hasClickedOnce
                ? 'bg-[#1a1815]/95 animate-pulse-purple border-violet-400/60'
                : 'bg-[#1a1815]/80 border-violet-500/40 hover:border-violet-400/70'
          }`}
          title="Troubadour"
        >
          {activeProfile ? (
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold font-serif text-2xl uppercase shadow-inner">
              {activeProfile.charAt(0)}
            </div>
          ) : (
            <Guitar size={30} className={isPlaying ? 'text-violet-400 animate-pulse' : 'text-violet-400/70'} />
          )}
          {/* Notification badge */}
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#050508] flex items-center justify-center">
              <span className="text-xs font-bold text-[#050508] font-mono">
                {notifications.length}
              </span>
            </span>
          )}
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className="bg-[#12100e]/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-4 shadow-2xl"
              style={{ width: 'calc(100vw - 80px)', maxWidth: 420, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}
            >
              {/* Mode toggle + help */}
              <div className="flex items-center gap-1 mb-4">
                <div className="flex gap-1 p-1 bg-black/40 rounded-lg flex-1">
                  <button
                    onClick={() => handleModeSwitch('music')}
                    className={`flex-1 py-1.5 text-base font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'music' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Music size={15} /> {t('music')}
                  </button>
                  <button
                    onClick={() => handleModeSwitch('click')}
                    className={`flex-1 py-1.5 text-base font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'click' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="5,3 19,3 15,21 9,21" fill="currentColor" opacity="0.3" />
                      <line x1="12" y1="10" x2="16" y2="5" />
                    </svg>
                    {t('click')}
                  </button>
                  <button
                    onClick={() => handleModeSwitch('system')}
                    className={`flex-1 py-1.5 text-base font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'system' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Settings size={15} /> SYS
                  </button>
                  <button
                    onClick={() => handleModeSwitch('portal')}
                    className={`flex-1 py-1.5 text-base font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'portal' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Compass size={15} /> NAV
                  </button>
                </div>
                <button
                  onClick={() => setShowHelp(true)}
                  className="ml-1 px-2 py-1 rounded-lg flex items-center gap-1 text-base font-mono uppercase tracking-wider text-violet-300 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all flex-shrink-0"
                  title={t('help')}
                >
                  <HelpCircle size={18} /> {t('help') || 'Help'}
                </button>
              </div>

              {/* ── NOTIFICATION HUB ── */}
              {hasNotifications && (
                <div className="mb-3 space-y-2">
                  <div className="text-base font-mono uppercase tracking-widest text-amber-400/60 mb-1.5">
                    {locale === 'fr' ? 'Notifications' : 'Notifications'}
                  </div>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all active:scale-95 ${
                        n.type === 'alert'
                          ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                          : n.type === 'reminder'
                            ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'
                            : 'bg-violet-500/5 border-violet-500/20 hover:bg-violet-500/10'
                      }`}
                      onClick={n.action}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg leading-none mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-mono font-bold text-white/80 uppercase tracking-wide">
                            {n.title}
                          </p>
                          <p className="text-base text-white/40 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-sm font-mono text-violet-400/70 mt-1 uppercase tracking-wider">
                            {n.actionLabel} ›
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── MUSIC MODE ── */}
              {mode === 'music' && (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-violet-500/20 pb-2">
                    <span className="text-base font-mono uppercase tracking-widest text-violet-400">
                      {t('nowPlaying')}
                    </span>
                    <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={21} /> : <Volume2 size={21} />}
                    </button>
                  </div>

                  {hasError ? (
                    <p className="text-base text-white/30 text-center py-4 font-mono">
                      {t('noAudioFile')}
                    </p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <div className="text-lg text-white font-medium truncate">{localize(track.title)}</div>
                        <div className="text-base text-cf-slate font-mono uppercase tracking-wider">{track.artist}</div>
                      </div>
                      <div className="mb-3">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-violet-400/70 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-sm text-cf-slate font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button onClick={toggleMusic}
                          className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 border border-violet-500/35 hover:bg-violet-500/25 transition-all">
                          {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
                        </button>
                        {TRACKS.length > 1 && (
                          <button onClick={skipTrack}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white transition-colors">
                            <SkipForward size={21} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Music size={15} className="text-cf-slate flex-shrink-0" />
                        <input type="range" min="0" max="1" step="0.05" value={volume}
                          onChange={e => handleVol(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
                        />
                        <span className="text-sm text-cf-slate font-mono w-6 text-right">{Math.round(volume * 100)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── CLICK MODE ── */}
              {mode === 'click' && (
                <div>
                  <div className="border-b border-violet-500/20 pb-2 mb-4">
                    <span className="text-base font-mono uppercase tracking-widest text-violet-400">
                      {t('metronome')}
                    </span>
                  </div>

                  {/* Beat dots */}
                  <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: metro.beats }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-75 ${
                        metro.currentBeat === i && metro.isPlaying
                          ? i === 0
                            ? 'bg-violet-400 scale-125 shadow-[0_0_8px_rgba(167,139,250,0.8)]'
                            : 'bg-violet-300 scale-110 shadow-[0_0_6px_rgba(196,181,253,0.6)]'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>

                  {/* BPM */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold font-mono text-white">{metro.bpm}</div>
                    <div className="text-sm font-mono uppercase tracking-widest text-violet-400/60">BPM</div>
                  </div>

                  {/* BPM slider */}
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => metro.setBpm(b => Math.max(40, b - 1))}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <Minus size={18} />
                    </button>
                    <input type="range" min="40" max="240" value={metro.bpm}
                      onChange={e => metro.setBpm(parseInt(e.target.value))}
                      className="flex-1 accent-violet-400 h-1" />
                    <button onClick={() => metro.setBpm(b => Math.min(240, b + 1))}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Time signature */}
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-0.5 border border-white/10 mb-3">
                    {[2, 3, 4, 5, 6].map(n => (
                      <button key={n} onClick={() => metro.setBeats(n)}
                        className={`flex-1 py-1.5 text-base font-bold rounded-md transition-colors ${
                          metro.beats === n ? 'bg-violet-500 text-white' : 'text-white/40 hover:text-white'
                        }`}>
                        {n}/4
                      </button>
                    ))}
                  </div>

                  {/* Click volume */}
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 size={16} className="text-white/30 flex-shrink-0" />
                    <input type="range" min="0" max="1" step="0.05" value={metro.volume}
                      onChange={e => metro.setVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-white/50 h-1" />
                    <span className="text-sm text-white/30 font-mono w-6 text-right">{Math.round(metro.volume * 100)}</span>
                  </div>

                  {/* Tap + Start/Stop */}
                  <div className="flex gap-2">
                    <button onClick={metro.tap}
                      className="flex-1 py-2.5 rounded-xl text-base font-mono uppercase tracking-wider border border-violet-500/30 bg-violet-500/5 text-violet-400/80 hover:bg-violet-500/15 hover:text-violet-300 transition-all active:scale-95">
                      {t('tap')}
                    </button>
                    <button onClick={() => metro.setIsPlaying(v => !v)}
                      className={`flex-1 py-2.5 rounded-xl text-base font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        metro.isPlaying
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      }`}>
                      {metro.isPlaying ? <><Square size={18} fill="currentColor" /> {t('stop')}</> : <><Play size={18} fill="currentColor" /> {t('start')}</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ── PORTAL NAVIGATION ── */}
              {mode === 'portal' && (
                <div>
                  {/* Game Mode Tracker */}
                  <div className="mb-4 p-3 bg-white/5 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                      <span className="text-base font-mono uppercase tracking-widest text-amber-400">
                        Apprentice Status
                      </span>
                      <span className="text-base bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                        Lv.{bardLevel}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-mono text-white/60 mb-3 px-1">
                      <div className="flex flex-col items-center">
                        <span className="text-white text-base mb-0.5">{streak || 0}</span>
                        <span className="text-white/40">Streak</span>
                      </div>
                      <div className="flex flex-col items-center border-l border-white/10 pl-4">
                        <span className="text-white text-base mb-0.5">{practiceMinutes || 0}</span>
                        <span className="text-white/40">Minutes</span>
                      </div>
                      <div className="flex flex-col items-center border-l border-white/10 pl-4">
                        <span className="text-white text-base mb-0.5">{completedNodes.length}</span>
                        <span className="text-white/40">Frets</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/song')} 
                      className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-base font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Play size={18} fill="currentColor" /> Resume Journey
                    </button>
                  </div>

                  <div className="border-b border-violet-500/20 pb-2 mb-3 mt-4">
                    <span className="text-base font-mono uppercase tracking-widest text-violet-400/60">
                      All Portals
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => navigate('/')} 
                      className={`py-2 px-3 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                        location.pathname === '/' ? 'border-amber-500/50 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <User size={21} /> Home Portal
                    </button>

                    <button 
                      onClick={() => navigate('/song')} 
                      className={`py-2 px-3 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                        location.pathname === '/song' ? 'border-amber-500/50 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Music size={21} /> Orientation Hub
                    </button>

                    <button 
                      onClick={() => navigate('/guitar')} 
                      className={`py-2 px-3 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                        location.pathname === '/guitar' ? 'border-amber-500/50 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Guitar size={21} /> Guitar Workbench
                    </button>

                    <button 
                      onClick={() => navigate('/player')} 
                      className={`py-2 px-3 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                        location.pathname === '/player' ? 'border-amber-500/50 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Play size={21} /> Audio & Videos
                    </button>

                    <button 
                      onClick={() => navigate('/guitar/map')} 
                      className={`py-2 px-3 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                        location.pathname === '/guitar/map' ? 'border-amber-500/50 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Compass size={21} /> Maturation Map
                    </button>
                  </div>
                </div>
              )}

              {/* ── SYSTEM MODE ── */}
              {mode === 'system' && (
                <div>
                  <div className="border-b border-violet-500/20 pb-2 mb-4">
                    <span className="text-base font-mono uppercase tracking-widest text-violet-400">
                      System & Identity
                    </span>
                  </div>
                  
                  {activeProfile ? (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold font-serif text-3xl uppercase shadow-inner">
                        {activeProfile.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{activeProfile}</div>
                        <div className="text-base text-violet-400 font-mono uppercase tracking-wider">Bard Level {bardLevel}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="text-lg text-white/50 italic">Unregistered</div>
                        <div className="text-base text-white/30 font-mono uppercase tracking-wider">Local play only</div>
                      </div>
                    </div>
                  )}

                  <div className="text-base text-white/70 mb-2 font-serif italic">
                    The Memory Card
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={exportVoixVive}
                      className="flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Save State
                    </button>
                    
                    <label className="flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Upload size={18} /> Load State
                      <input 
                        type="file" 
                        accept=".voixvive,.json"
                        onChange={importVoixVive}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
                    Curriculum Rules
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: false } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        !traction?.settings?.sandboxMode 
                          ? 'border-violet-500 bg-violet-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Guided Path
                    </button>
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: true } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.sandboxMode 
                          ? 'border-amber-500 bg-amber-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Open Book
                    </button>
                  </div>
                  <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
                    Audience Focus
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, kidMode: false } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        !traction?.settings?.kidMode 
                          ? 'border-violet-500 bg-violet-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Masterclass
                    </button>
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, kidMode: true } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.kidMode 
                          ? 'border-amber-500 bg-amber-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Apprentice
                    </button>
                  </div>

                  <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
                    AI Guidance
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: true } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.aiEnabled !== false
                          ? 'border-violet-500 bg-violet-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Troubadour
                    </button>
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: false } }))}
                      className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.aiEnabled === false
                          ? 'border-amber-500 bg-amber-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Silent
                    </button>
                  </div>
                </div>
              )}

              {/* ── VOIX TIER LOAD + SERVER STATUS ── */}
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {/* Load Living Voice button */}
                {!voixReady && (
                  <button
                    onClick={loadVoixTier}
                    disabled={voixLoading}
                    className="w-full py-2 mb-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all flex items-center justify-center gap-2 active:scale-95"
                    style={{
                      background: voixLoading ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.15)',
                      borderColor: voixLoading ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.35)',
                      color: voixLoading ? 'rgba(167,139,250,0.5)' : '#c4b5fd',
                    }}
                  >
                    {voixLoading ? (
                      <>
                        <span className="animate-spin">⏳</span> Loading Living Voice… {kokoro.loadProgress || wllama.loadProgress || 0}%
                      </>
                    ) : (
                      <>
                        <Download size={18} /> Load Living Voice (~1 GB)
                      </>
                    )}
                  </button>
                )}
                {voixReady && (
                  <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-base font-mono text-emerald-400 uppercase tracking-widest">✓ Voix Active</span>
                    <span className="text-sm font-mono text-emerald-400/50">{wllama.modelId}</span>
                  </div>
                )}
                {/* Server status lights */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ServerLight connected={kokoro.isReady} label="Kokoro" color="#a78bfa" />
                    <ServerLight connected={wllama.isReady} label="Wllama" color="#7aaa88" />
                    <ServerLight connected={isLMStudioConnected} label="LM" color="#a78bfa" />
                    <ServerLight connected={isDaaSConnected} label="DaaS" color="#7aaa88" />
                    <ServerLight connected={voiceConnected} label="Voice" color="#cc5555" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {voixReady ? 'Voix' : isLMStudioConnected || isDaaSConnected || voiceConnected ? 'Chant' : 'Souffle'}
                  </span>
                </div>
              </div>

              {/* ── AI CHAT (always visible) ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <div className="border-b border-violet-500/20 pb-2 mb-1 flex justify-between items-center">
                  <span className="text-base font-mono uppercase tracking-widest text-violet-400">
                    {locale === 'fr' ? 'Le Troubadour' : 'The Troubadour'}
                  </span>
                  {detectedEmotion && (
                    <span className="text-sm font-mono uppercase px-2 py-0.5 rounded-full border border-violet-500/30 text-violet-300">
                      State: {detectedEmotion}
                    </span>
                  )}
                </div>
                {/* Message history */}
                <div style={{
                  maxHeight: 180, overflowY: 'auto', display: 'flex',
                  flexDirection: 'column', gap: 6,
                  paddingRight: 4,
                }}>
                  {guideMessages.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.5, fontStyle: 'italic' }}>
                        {locale === 'fr'
                          ? 'Je suis le Troubadour — guide de Voix Vive. Demandez-moi n\'importe quoi.'
                          : 'I am the Troubadour — guide of Voix Vive. Ask me anything.'}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
                        {locale === 'fr'
                          ? 'Pratique · Pédagogie · Psychologie · Business · Tech'
                          : 'Practice · Pedagogy · Psychology · Business · Tech'}
                      </p>
                    </div>
                  )}
                  {/* AI Disclosure */}
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.2)',
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: 'center',
                    marginTop: 4,
                    letterSpacing: '0.05em',
                  }}>
                    {locale === 'fr'
                      ? 'Assistant IA basé sur la pédagogie de Bertrand Laurence'
                      : 'AI assistant trained on Bertrand Laurence\'s pedagogy — not Bertrand himself'}
                  </p>
                  {guideMessages.map((msg, i) => (
                    <div key={i} style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '90%',
                      background: msg.role === 'user' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 8, padding: '6px 10px',
                      fontSize: '1.08rem', lineHeight: 1.5,
                      color: msg.role === 'user' ? '#c4b5fd' : 'rgba(255,255,255,0.75)',
                      fontFamily: msg.role === 'user' ? 'JetBrains Mono, monospace' : 'Cormorant Garamond, serif',
                      fontStyle: msg.role === 'assistant' ? 'italic' : 'normal',
                    }}>
                      {msg.content || (guideStreaming && i === guideMessages.length - 1 ? '…' : '')}
                    </div>
                  ))}
                  <div ref={guideEndRef} />
                </div>
                {/* Input */}
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input
                    type="text"
                    ref={guideInputRef}
                    value={guideInput}
                    onChange={e => setGuideInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendGuideMessage()}
                    placeholder={voiceRecording
                      ? (locale === 'fr' ? 'Écoute…' : 'Listening…')
                      : (locale === 'fr' ? 'Votre question au Troubadour…' : 'Ask the Troubadour…')}
                    disabled={guideStreaming || voiceRecording}
                    style={{
                      flex: 1, background: voiceRecording ? 'rgba(204,85,85,0.06)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${voiceRecording ? 'rgba(204,85,85,0.2)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 8, padding: '6px 10px',
                      color: voiceRecording ? 'rgba(204,85,85,0.6)' : 'rgba(255,255,255,0.8)',
                      fontSize: '1.08rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none',
                    }}
                  />
                  {/* Mic button — voice mode */}
                  <button
                    onClick={toggleVoice}
                    title={voiceRecording ? 'Stop listening' : 'Speak to the Troubadour'}
                    style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: voiceRecording ? 'rgba(204,85,85,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${voiceRecording ? 'rgba(204,85,85,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      color: voiceRecording ? '#cc5555' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      animation: voiceRecording ? 'pulseMic 1.5s ease-in-out infinite' : 'none',
                    }}
                  >
                    {voiceRecording ? <Mic size={21} /> : <MicOff size={21} />}
                  </button>
                  <button
                    onClick={sendGuideMessage}
                    disabled={guideStreaming || !guideInput.trim() || voiceRecording}
                    style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: guideStreaming || !guideInput.trim() || voiceRecording ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.2)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      color: '#c4b5fd', cursor: guideStreaming || !guideInput.trim() || voiceRecording ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                {/* ── Net Protocol HUD ── */}
                {voiceRecording && (
                  <div className="mt-2 p-2 rounded-lg bg-black/40 border border-red-500/20 flex flex-col items-center gap-1">
                    <span className="text-sm text-red-400/80 font-mono uppercase tracking-widest">
                      Net Protocol Active
                    </span>
                    <div className="flex gap-2 w-full mt-1">
                      <div className="flex-1 h-1 bg-red-500/20 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-red-500/50 animate-[pulseMic_1.5s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <span className="text-base text-red-300 font-serif italic mt-1">
                      Always end your transmission with "Over."
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes pulseGold {
          0%, 100% {
            box-shadow: 0 0 4px rgba(201,169,110,0.2), inset 0 0 2px rgba(201,169,110,0.1);
            border-color: rgba(201,169,110,0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(201,169,110,0.65), inset 0 0 6px rgba(201,169,110,0.3);
            border-color: rgba(201,169,110,0.85);
          }
        }
        .animate-pulse-gold {
          animation: pulseGold 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes pulsePurple {
          0%, 100% {
            box-shadow: 0 0 6px rgba(139,92,246,0.3), inset 0 0 3px rgba(139,92,246,0.15);
            border-color: rgba(139,92,246,0.4);
          }
          50% {
            box-shadow: 0 0 24px rgba(139,92,246,0.7), inset 0 0 8px rgba(139,92,246,0.35);
            border-color: rgba(167,139,250,0.9);
          }
        }
        .animate-pulse-purple {
          animation: pulsePurple 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes pulseMic {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>

      {/* Help Menu */}
      {showHelp && (
        <HelpMenu onClose={() => setShowHelp(false)} />
      )}
    </>
  );
}
