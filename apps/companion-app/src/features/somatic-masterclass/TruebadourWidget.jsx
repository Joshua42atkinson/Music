import { devLog, devWarn } from '../../lib/devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TruebadourWidget.jsx                                 ║
// ║ WHAT    : The Red Pill — AI Truebadour (chat + voice)          ║
// ║ WHY     : The truebadour is the AI soul of the app. Voice-     ║
// ║           first, somatic, Socratic. The guitar is its icon.    ║
// ║ POSITION: top-4 left-4                                         ║
// ║ PAIR    : BookWidget.jsx lives top-4 right-4                   ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Guitar, Download, HelpCircle, Mic, MicOff, X, MessageSquare, Inbox, Activity,
  Maximize, Minimize, Gamepad, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';
import { useTruebadour } from '../../hooks/TruebadourProvider';

import { useScaffolding } from '../../components/ScaffoldingProvider';
import { buildRiftPrompt } from '../../data/truebadourPrompt';
import { searchChunks, buildContextBlock } from '../../data/ragStore';
import { useTruebadourInbox } from '../../hooks/useTruebadourInbox';
import { useAcousticMemory } from '../../hooks/useAcousticMemory';
import HelpMenu from '../../components/HelpMenu';
import { vvGet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import VoiceSettingsPanel from '../../components/VoiceSettingsPanel';
import { useBevyIPC } from '../../hooks/useBevyIPC';

import { useConversationalPracticeEngine } from './truebadour/useConversationalPracticeEngine';
const RiffChat = React.lazy(() => import('./truebadour/RiffChat'));

// ── Tiny status pip ────────────────────────────────────────────────
function ServerLight({ connected, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: connected ? color : 'rgba(255,255,255,0.12)',
        boxShadow: connected ? `0 0 5px ${color}` : 'none',
        transition: 'all 0.3s',
      }} />
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RED GUITAR WIDGET — AI Truebadour
// ═══════════════════════════════════════════════════════════

import ErrorBoundary from '../../components/ErrorBoundary';
import { devError } from '../../lib/devLog';

// Navigation tools auto-execute immediately (hands-free)
// Audio/metronome tools still require confirmation (safety)
const AUTO_EXEC_TOOLS = new Set([
  'NEXT_SLIDE', 'PREV_SLIDE',
  'NAVIGATE_SONG', 'NAVIGATE_PRACTICE', 'NAVIGATE_HOME',
  'NAVIGATE_NEXT', 'START_MEDITATION',
]);

function TruebadourWidgetInner() {
  const navigate = useNavigate();
  const { locale } = useLocale();

  // ── AI wiring ──────────────────────────────────────────────
  const { ai, player, bertrand, kokoro, voiceInput, voixLoading, voixReady, loadVoix, loadProgress, activeWidget, openRift, closeAll, voicePrefs } = useTruebadour();
  const { chatStream, webLLMProgress, backend } = ai;
  const {
    traction, bardLevel, currentFret, currentPhase,
    nextRecommended, streak: _streak, practiceMinutes: _practiceMinutes,
    promptVerbosity,
  } = useScaffolding();
  
  const { lastMessage } = useBevyIPC();
  
  const { isEyesFree, engineState, toggleEyesFree } = useConversationalPracticeEngine({ activeFretId: currentFret });

  const maxTokens = useMemo(() => {
    switch (promptVerbosity) {
      case 'silent': return 24;
      case 'minimal': return 48;
      case 'reduced': return 96;
      case 'full':
      default: return 256;
    }
  }, [promptVerbosity]);

  // ── UI state ───────────────────────────────────────────────
  const open = activeWidget === 'riff';
  const setOpen = useCallback((val) => val ? openRift() : closeAll(), [openRift, closeAll]);
  const [, setDetectedEmotion] = useState(null);
  const [pendingTool, setPendingTool]     = useState(null);
  const [isFullScreen, setIsFullScreen]   = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleOpen = () => openRift();
    window.addEventListener('voixvive:open_truebadour', handleOpen);
    return () => window.removeEventListener('voixvive:open_truebadour', handleOpen);
  }, [openRift]);

  const showNav = !['/', '/onboarding'].includes(location.pathname);

  // ── Chat / Inbox state ─────────────────────────────────────
  const [guideInput, setGuideInput]       = useState('');
  const { inbox, addSubmission, completeReview } = useTruebadourInbox();
  const [guideStreaming, setGuideStreaming] = useState(false);
  const guideEndRef   = useRef(null);
  const guideInputRef = useRef(null);
  const acousticMemory = useAcousticMemory(15000);

  // ── Voice state ────────────────────────────────────────────
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceConnected, setVoiceConnected] = useState(false);
  const voiceServiceRef = useRef(null);

  // ── Voice Settings Menu ────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  // voicePrefs comes from TruebadourProvider — all settings live there

  // Auto-scroll inbox
  useEffect(() => {
    guideEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inbox]);

  // Cleanup voice service
  useEffect(() => {
    return () => { voiceServiceRef.current?.disconnect?.(); };
  }, []);

  // Open from ambient events
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true);
      if (e.detail?.focusChat) {
        setTimeout(() => guideInputRef.current?.focus(), 350);
      }
    };
    const onAsk = (e) => {
      const text = e.detail?.text;
      if (!text) return;
      setOpen(true);
      setTimeout(() => {
        setGuideInput(text);
        guideInputRef.current?.focus();
      }, 300);
    };
    window.addEventListener('ambient:open', onOpen);
    window.addEventListener('ambient:ask',  onAsk);
    return () => {
      window.removeEventListener('ambient:open', onOpen);
      window.removeEventListener('ambient:ask',  onAsk);
    };
  }, [setOpen]);

  // ── Hardware Sensor Fusion ─────────────────────────────────
  useEffect(() => {
    if (lastMessage?.event === 'FUSION_SCORE') {
      const tension = lastMessage.score;
      if (tension === "Aggressive Strike" || tension === "Muted Strike") {
        if (import.meta.env.DEV) devLog('[Truebadour] Hardware detected tension:', tension);
        setOpen(true);
        // Automatically inject a system reflection prompt into the user input
        // and let them send it (or we could auto-send, but putting it in the input 
        // lets them read the AI's observation first).
        setGuideInput(`The hardware sensors noticed I played with an '${tension}'. Can you give me a 1-sentence somatic reminder to help me release this physical tension?`);
        setTimeout(() => guideInputRef.current?.focus(), 300);
      }
    }
  }, [lastMessage, setOpen]);


  // loadVoix is now provided by TruebadourProvider

  // ── System prompt ──────────────────────────────────────────
  const baseSystemPrompt = useMemo(() => buildRiftPrompt({
    traction, bardLevel, currentFret, currentPhase, locale,
  }), [traction, bardLevel, currentFret, currentPhase, locale]);

  const buildSystemPrompt = useCallback((ragContext = '') =>
    ragContext
      ? baseSystemPrompt.replace('{{RAG_CONTEXT}}', ragContext)
      : baseSystemPrompt.replace('{{RAG_CONTEXT}}', 'No specific curriculum entries retrieved. Answer from general knowledge.'),
  [baseSystemPrompt]);

  // ── Send chat message ──────────────────────────────────────
  const _sendGuideMessage = async () => {
    const text = guideInput.trim();
    if (!text || guideStreaming) return;
    setGuideInput('');
    
    // Add to Inbox as pending
    const submissionId = addSubmission(text);
    setGuideStreaming(true);

    try {
      const ragChunks = await searchChunks(text, { topK: 3, locale, filter: { fret: currentFret } });
      const ragContext = buildContextBlock(ragChunks);
      
      // We don't have full chat history anymore since it's an inbox, 
      // but we can pass the last 2 completed reviews for context if needed.
      const history = inbox
        .filter(i => i.status === 'ready')
        .slice(0, 2)
        .flatMap(i => [
          { role: 'user', content: i.prompt },
          { role: 'assistant', content: i.response }
        ]);

      const messages = [
        { role: 'system', content: buildSystemPrompt(ragContext) },
        ...history,
        { role: 'user', content: acousticMemory.getMemoryString() ? `${acousticMemory.getMemoryString()}\n\n${text}` : text }
      ];

      acousticMemory.clearMemory();

      // Request stream, but tell it not to auto-play audio
      const result = await chatStream(
        messages,
        null, // No chunk update needed for the UI, wait for full text
        { autoPlay: false, max_tokens: maxTokens, temperature: 0.7, mode: 'chat', locale, traction, bardLevel, currentFret, currentPhase, playerModifier: player.getTruebadourModifier(), onToolCall: handleToolCall }
      );
      
      // Extract the final text from the stream result
      const fullText = result?.choices?.[0]?.message?.content || (locale === 'fr' ? 'Évaluation terminée.' : 'Review complete.');

      // Simulate an intentional time gap (5 seconds) so the user feels Bertrand is thinking
      await new Promise(r => setTimeout(r, 5000));

      completeReview(submissionId, fullText);
      
      // Optional: We can add an audio "ding" or system notification here.
      // (The inbox UI will automatically show the "Play Review" button).

    } catch (err) {
      devError("Review generation failed:", err);
      completeReview(submissionId, locale === 'fr'
        ? "Je suis hors ligne. L'évaluation n'a pas pu être générée."
        : "I'm offline. Could not generate evaluation.");
    } finally {
      setGuideStreaming(false);
    }
  };

  const _handleDownloadReview = async (text) => {
    if (!bertrand.isReady) {
      devWarn('[Truebadour] Bertrand Voice not ready. Please load the Brain first.');
      return;
    }
    const blob = await bertrand.generateBlob(text, locale);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `bertrand_review_${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    }
  };

  // ── Voice input ────────────────────────────────────────────
  const toggleVoice = async () => {
    if (voiceRecording) {
      if (voiceInput.isAvailable && voiceInput.isListening) {
        voiceInput.stopListening(); setVoiceRecording(false); return;
      }
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopRecording(); setVoiceRecording(false); return;
      }
    }

    if (voiceInput.isAvailable) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setVoiceRecording(true);
      voiceInput.startListening(async (transcript) => {
        setVoiceRecording(false);
        setGuideInput(transcript);
        
        // Auto-send voice submissions
        const submissionId = addSubmission(transcript);
        setGuideStreaming(true);
        try {
          const ragChunks = await searchChunks(transcript, { topK: 3, locale, filter: { fret: currentFret } });
          const ragContext = buildContextBlock(ragChunks);
          const history = inbox.filter(i => i.status === 'ready').slice(0, 2).flatMap(i => [
            { role: 'user', content: i.prompt }, { role: 'assistant', content: i.response }
          ]);
          
          const result = await chatStream(
            [{ role: 'system', content: buildSystemPrompt(ragContext) }, ...history, { role: 'user', content: transcript }],
            null,
            { autoPlay: false, max_tokens: maxTokens * 2, temperature: 0.1, mode: 'chat', locale, traction, bardLevel, currentFret, currentPhase, playerModifier: player.getTruebadourModifier(), onToolCall: handleToolCall }
          );
          
          const fullText = result?.choices?.[0]?.message?.content || (locale === 'fr' ? 'Évaluation terminée.' : 'Review complete.');
          
          await new Promise(r => setTimeout(r, 5000));
          completeReview(submissionId, fullText);
        } catch {
          completeReview(submissionId, locale === 'fr' ? 'Erreur de transcription.' : "Transcription error.");
        } finally {
          setGuideStreaming(false);
        }
      }, locale);
      return;
    }

    // Fallback: StepAudio
    try {
      const { getAudioStreamingService } = await import('../../lib/audioStreamingService.js');
      const svc = getAudioStreamingService();
      voiceServiceRef.current = svc;
      if (!voiceConnected) {
        await svc.connect();
        svc.onConnectionChange = (c) => setVoiceConnected(c);
        svc.onTextReceived = (text) => {
          // Wrap text in a direct review completion
          const id = addSubmission('Voice Submission');
          completeReview(id, text);
        };
        svc.onParalinguistic = (evt) => {
          setDetectedEmotion(evt.emotion);
        };
        svc.onError = () => setVoiceConnected(false);
        setVoiceConnected(true);
      }
      await svc.startRecording();
      setVoiceRecording(true);
    } catch (err) {
      devWarn('[Truebadour] All voice methods failed:', err);
      setVoiceRecording(false);
    }
  };

  // ── Tool calls ─────────────────────────────────────────────
  const playReferencePitch = useCallback((fretNum) => {
    try {
      const HZ_MAP = { 1:82.41,2:87.31,3:92.50,4:98,5:103.83,6:110,7:116.54,8:123.47,9:130.81,10:138.59,11:146.83,12:155.56 };
      const hz  = HZ_MAP[fretNum] || 82.41;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 2.6);
    } catch (e) { devWarn('Pitch play failed', e); }
  }, []);

  const executeToolAction = useCallback((toolName) => {
    switch (toolName) {
      case 'PLAY_PITCH':
        playReferencePitch(currentFret);
        window.dispatchEvent(new CustomEvent('voixvive:play_pitch'));
        break;
      case 'START_METRONOME':
        window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: 'metronome' } }));
        break;
      case 'START_MEDITATION':
        window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: 'meditation' } }));
        break;
      case 'NAVIGATE_NEXT':
        navigate('/dashboard');
        break;
      // ── Hands-free slide navigation ──
      case 'NEXT_SLIDE':
        window.dispatchEvent(new CustomEvent('voixvive:next_slide'));
        break;
      case 'PREV_SLIDE':
        window.dispatchEvent(new CustomEvent('voixvive:prev_slide'));
        break;
      // ── Hands-free app navigation ──
      case 'NAVIGATE_SONG':
        navigate('/song');
        break;
      case 'NAVIGATE_PRACTICE':
        navigate('/guitar');
        break;
      case 'NAVIGATE_HOME':
        navigate('/');
        break;
      default: break;
    }
  }, [currentFret, playReferencePitch, nextRecommended, navigate]);

  const handleToolCall = useCallback((toolName) => {
    if (AUTO_EXEC_TOOLS.has(toolName)) {
      // Auto-execute navigation tools immediately (hands-free mode)
      executeToolAction(toolName);
    } else {
      // Gate behind confirmation UI (audio tools)
      setPendingTool(toolName);
    }
  }, [executeToolAction]);

  const _confirmToolCall = useCallback(() => {
    if (!pendingTool) return;
    executeToolAction(pendingTool);
    setPendingTool(null);
  }, [pendingTool, executeToolAction]);

  const _cancelToolCall = useCallback(() => setPendingTool(null), []);

  // ── Colours ────────────────────────────────────────────────
  const RED     = '#cc3333';
  const RED_LT  = '#ff6666';
  const RED_DIM = 'rgba(204,51,51,0.4)';
  const BG      = '#12100e';

  const activeProfile = vvGet(STORAGE_KEYS.ACTIVE_PROFILE);

  return (
    <>
      <div role="complementary" aria-label="Truebadour AI Companion" className="fixed top-4 left-4 z-[2001] flex items-start gap-2">

        {/* ── Floating red button removed in favor of UnifiedAssistantMenu ── */}

        {/* ── Expanded panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="truebadour-widget-panel"
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: -10, scale: 0.95 }}
              animate={isMobile ? { opacity: 1, y: 0, width: '100vw', height: isFullScreen ? '100vh' : 'auto' } : { opacity: 1, x: 0, scale: 1, width: isFullScreen ? '100vw' : 'min(100vw - 32px, 500px)', height: isFullScreen ? '100vh' : 'auto' }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, x: -10, scale: 0.95 }}
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
                borderTop: `1px solid rgba(204,51,51,0.38)`,
                borderTopLeftRadius: isFullScreen ? 0 : 24,
                borderTopRightRadius: isFullScreen ? 0 : 24,
                padding: '16px 16px max(20px, env(safe-area-inset-bottom))',
                boxShadow: `0 -8px 40px rgba(0,0,0,0.7)`,
              } : {
                position: isFullScreen ? 'fixed' : 'relative',
                top: isFullScreen ? -16 : 'auto',
                left: isFullScreen ? -16 : 'auto',
                zIndex: 60,
                maxHeight: isFullScreen ? '100vh' : 'calc(100vh - 40px)', 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: `${BG}f5`,
                backdropFilter: 'blur(20px)',
                border: isFullScreen ? 'none' : `1px solid rgba(204,51,51,0.22)`,
                borderRadius: isFullScreen ? 0 : 18,
                padding: '16px 16px 20px',
                boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(204,51,51,0.08)`,
              }}
            >
              {/* ── Header ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: RED,
                }}>
                  {locale === 'fr' ? 'Votre Mentor IA' : 'Your AI Mentor'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                      padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: showSettings ? 'rgba(204,51,51,0.2)' : 'rgba(255,255,255,0.05)',
                      color: showSettings ? '#ff8888' : 'rgba(255,255,255,0.4)',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', gap: 5,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    title="Voice Settings"
                  >
                    <Settings size={14} />
                    {locale === 'fr' ? 'Voix' : 'Voice'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15, color: 'rgba(255,255,255,0.8)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: 4 }}
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, background: 'rgba(224, 131, 74, 0.25)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setOpen(false); setIsFullScreen(false); }}
                    style={{ background: 'rgba(224, 131, 74, 0.15)', border: '1px solid rgba(224, 131, 74, 0.4)', color: '#e0834a', cursor: 'pointer', padding: 4, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Close"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {/* ── WebLLM Download Progress ── */}
              {webLLMProgress && webLLMProgress.progress < 1 && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(204,51,51,0.05)', borderRadius: 12, border: '1px solid rgba(204,51,51,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#ff8888', textTransform: 'uppercase' }}>
                      Synching Neural Weights...
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                      {Math.round(webLLMProgress.progress * 100)}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${webLLMProgress.progress * 100}%` }}
                      style={{ height: '100%', background: RED, boxShadow: `0 0 10px ${RED_LT}` }}
                    />
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {webLLMProgress.text}
                  </div>
                </div>
              )}

              {/* ── Voice Settings Panel ── */}
              <AnimatePresence>
                {showSettings && (
                  <VoiceSettingsPanel
                    {...voicePrefs}
                    saving={voicePrefs.saving}
                    onPreview={(text, voice, speed) =>
                      kokoro.speak(text, {
                        voice,
                        speed,
                        pitch:  voicePrefs.pitch,
                        volume: voicePrefs.volume,
                      })
                    }
                    locale={locale}
                  />
                )}
              </AnimatePresence>

              {/* ── AI Chat Area ── */}
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 4 }}>
                <Suspense fallback={
                  <div style={{ color: 'rgba(204,51,51,0.6)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', padding: 12 }}>
                    Loading…
                  </div>
                }>
                  <RiffChat
                    locale={locale}
                    chatStream={chatStream}
                    buildSystemPrompt={buildSystemPrompt}
                    traction={traction}
                    somaticDepth={bardLevel}
                    currentFret={currentFret}
                    currentPhase={currentPhase}
                    playerModifier={player.getTruebadourModifier()}
                    voiceRecording={voiceRecording}
                    toggleVoice={toggleVoice}
                    voiceInputText={guideInput}
                  />
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulseMic {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 6px rgba(204,51,51,0.3); border-color: rgba(204,51,51,0.4); }
          50%       { box-shadow: 0 0 22px rgba(204,51,51,0.65); border-color: rgba(255,102,102,0.85); }
        }
        #truebadour-widget-toggle:hover { filter: brightness(1.12); }
      `}</style>

    </>
  );
}

export default function TruebadourWidget(props) {
  return (
    <ErrorBoundary fallbackMessage="The Truebadour voice engine encountered an error. Reverting to text-only mode.">
      <TruebadourWidgetInner {...props} />
    </ErrorBoundary>
  );
}
