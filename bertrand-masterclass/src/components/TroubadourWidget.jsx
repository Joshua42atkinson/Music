import React, { useState, useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music, Minus, Plus, Square, HelpCircle, MessageSquare, Send, Wifi, WifiOff, Mic, MicOff, Settings, Download, Upload, User } from 'lucide-react';
import { Guitar } from 'lucide-react';
import { exportVoixViveFile, importVoixViveFile } from '../data/saveState';
import { useLocale } from '../hooks/useLocale';
import { useTroubadourAI } from '../hooks/useTroubadourAI';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useScaffolding } from './ScaffoldingProvider';
import { useMetronome } from '../hooks/useMetronome';
import { buildTroubadourPrompt, enforceOver } from '../data/troubadourPrompt';
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
      <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
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
  const { locale, t } = useLocale();
  const { chatStream, backend: aiBackend } = useTroubadourAI();
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
  // PROMPT v4 — DAG-aware system prompt with Net Protocol
  // ═══════════════════════════════════════════════════════════

  const buildSystemPrompt = () => buildTroubadourPrompt({
    traction,
    bardLevel,
    practiceMinutes,
    streak,
    currentFret,
    currentNode,
    currentPhase,
    completedNodes,
    nextRecommended,
  });

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
      const history = [...guideMessages, userMsg].slice(-8);
      await chatStream(
        [{ role: 'system', content: buildSystemPrompt() }, ...history],
        (chunk, full) => {
          setGuideMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: full },
          ]);
        },
        { max_tokens: 256, temperature: 0.7 }
      );
    } catch {
      setGuideMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: locale === 'fr' ? 'Le Troubadour est hors ligne. Lancez LM Studio pour continuer.' : 'The Troubadour is offline. Start LM Studio to continue.' },
      ]);
    } finally {
      setGuideStreaming(false);
    }
  };

  // ── Voice mode toggle (StepAudio 2.5) ──
  const toggleVoice = async () => {
    const { getAudioStreamingService } = await import('../lib/audioStreamingService.js');
    const svc = getAudioStreamingService();
    voiceServiceRef.current = svc;

    if (voiceRecording) {
      svc.stopRecording();
      setVoiceRecording(false);
      return;
    }

    if (!voiceConnected) {
      try {
        await svc.connect();
        svc.onConnectionChange = (connected) => setVoiceConnected(connected);
        svc.onTextReceived = (text) => {
          setGuideMessages(prev => [...prev, { role: 'assistant', content: text }]);
        };
        svc.onAudioReceived = () => { setVoicePlaying(true); };
        svc.onParalinguistic = (evt) => {
          console.log('[Troubadour] Paralinguistic:', evt.emotion, evt.confidence);
          setDetectedEmotion(evt.emotion);
          // If frustrated, switch mode to music and auto-play the ambient track
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
      } catch (err) {
        console.warn('[Troubadour Voice] Connect failed:', err);
        return;
      }
    }

    await svc.startRecording();
    setVoiceRecording(true);
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
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border-2 shadow-lg transition-all ${
            isActive
              ? 'bg-violet-500/25 border-violet-400/60 shadow-[0_0_24px_rgba(139,92,246,0.5)]'
              : !hasClickedOnce
                ? 'bg-[#1a1815]/95 animate-pulse-purple border-violet-400/60'
                : 'bg-[#1a1815]/80 border-violet-500/40 hover:border-violet-400/70'
          }`}
          title="Troubadour"
        >
          {activeProfile ? (
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold font-serif text-lg uppercase shadow-inner">
              {activeProfile.charAt(0)}
            </div>
          ) : (
            <Guitar size={20} className={isPlaying ? 'text-violet-400 animate-pulse' : 'text-violet-400/70'} />
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
              style={{ minWidth: 300, maxWidth: 340 }}
            >
              {/* Mode toggle + help */}
              <div className="flex items-center gap-1 mb-4">
                <div className="flex gap-1 p-1 bg-black/40 rounded-lg flex-1">
                  <button
                    onClick={() => handleModeSwitch('music')}
                    className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'music' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Music size={10} /> {t('music')}
                  </button>
                  <button
                    onClick={() => handleModeSwitch('click')}
                    className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
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
                    className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                      mode === 'system' ? 'bg-violet-500 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Settings size={10} /> SYS
                  </button>
                </div>
                <button
                  onClick={() => setShowHelp(true)}
                  className="ml-1 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-violet-300 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all flex-shrink-0"
                  title={t('help')}
                >
                  <HelpCircle size={12} /> {t('help') || 'Help'}
                </button>
              </div>

              {/* ── MUSIC MODE ── */}
              {mode === 'music' && (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-violet-500/20 pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
                      {t('nowPlaying')}
                    </span>
                    <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>

                  {hasError ? (
                    <p className="text-xs text-white/30 text-center py-4 font-mono">
                      {t('noAudioFile')}
                    </p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <div className="text-sm text-white font-medium truncate">{localize(track.title)}</div>
                        <div className="text-[10px] text-cf-slate font-mono uppercase tracking-wider">{track.artist}</div>
                      </div>
                      <div className="mb-3">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-violet-400/70 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-cf-slate font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button onClick={toggleMusic}
                          className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 border border-violet-500/35 hover:bg-violet-500/25 transition-all">
                          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                        </button>
                        {TRACKS.length > 1 && (
                          <button onClick={skipTrack}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white transition-colors">
                            <SkipForward size={14} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Music size={10} className="text-cf-slate flex-shrink-0" />
                        <input type="range" min="0" max="1" step="0.05" value={volume}
                          onChange={e => handleVol(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
                        />
                        <span className="text-[9px] text-cf-slate font-mono w-6 text-right">{Math.round(volume * 100)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── CLICK MODE ── */}
              {mode === 'click' && (
                <div>
                  <div className="border-b border-violet-500/20 pb-2 mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
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
                    <div className="text-[9px] font-mono uppercase tracking-widest text-violet-400/60">BPM</div>
                  </div>

                  {/* BPM slider */}
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => metro.setBpm(b => Math.max(40, b - 1))}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <Minus size={12} />
                    </button>
                    <input type="range" min="40" max="240" value={metro.bpm}
                      onChange={e => metro.setBpm(parseInt(e.target.value))}
                      className="flex-1 accent-violet-400 h-1" />
                    <button onClick={() => metro.setBpm(b => Math.min(240, b + 1))}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Time signature */}
                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-0.5 border border-white/10 mb-3">
                    {[2, 3, 4, 5, 6].map(n => (
                      <button key={n} onClick={() => metro.setBeats(n)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                          metro.beats === n ? 'bg-violet-500 text-white' : 'text-white/40 hover:text-white'
                        }`}>
                        {n}/4
                      </button>
                    ))}
                  </div>

                  {/* Click volume */}
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 size={11} className="text-white/30 flex-shrink-0" />
                    <input type="range" min="0" max="1" step="0.05" value={metro.volume}
                      onChange={e => metro.setVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-white/50 h-1" />
                    <span className="text-[9px] text-white/30 font-mono w-6 text-right">{Math.round(metro.volume * 100)}</span>
                  </div>

                  {/* Tap + Start/Stop */}
                  <div className="flex gap-2">
                    <button onClick={metro.tap}
                      className="flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider border border-violet-500/30 bg-violet-500/5 text-violet-400/80 hover:bg-violet-500/15 hover:text-violet-300 transition-all active:scale-95">
                      {t('tap')}
                    </button>
                    <button onClick={() => metro.setIsPlaying(v => !v)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        metro.isPlaying
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      }`}>
                      {metro.isPlaying ? <><Square size={12} fill="currentColor" /> {t('stop')}</> : <><Play size={12} fill="currentColor" /> {t('start')}</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ── SYSTEM MODE ── */}
              {mode === 'system' && (
                <div>
                  <div className="border-b border-violet-500/20 pb-2 mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
                      System & Identity
                    </span>
                  </div>
                  
                  {activeProfile ? (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold font-serif text-xl uppercase shadow-inner">
                        {activeProfile.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{activeProfile}</div>
                        <div className="text-[10px] text-violet-400 font-mono uppercase tracking-wider">Bard Level {bardLevel}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-sm text-white/50 italic">Unregistered</div>
                        <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Local play only</div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-white/70 mb-2 font-serif italic">
                    The Memory Card
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={exportVoixVive}
                      className="flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={12} /> Save State
                    </button>
                    
                    <label className="flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Upload size={12} /> Load State
                      <input 
                        type="file" 
                        accept=".voixvive,.json"
                        onChange={importVoixVive}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="text-xs text-white/70 mb-2 mt-4 font-serif italic">
                    Curriculum Rules
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: false } }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        !traction?.settings?.sandboxMode 
                          ? 'border-violet-500 bg-violet-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Guided Path
                    </button>
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: true } }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.sandboxMode 
                          ? 'border-amber-500 bg-amber-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Open Book
                    </button>
                  </div>
                  <div className="text-xs text-white/70 mb-2 mt-4 font-serif italic">
                    AI Guidance
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: true } }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        traction?.settings?.aiEnabled !== false
                          ? 'border-violet-500 bg-violet-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      Troubadour
                    </button>
                    <button 
                      onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: false } }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
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

              {/* ── SERVER STATUS ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ServerLight connected={isLMStudioConnected} label="LM Studio" color="#a78bfa" />
                  <ServerLight connected={isDaaSConnected} label="DaaS" color="#7aaa88" />
                  <ServerLight connected={voiceConnected} label="Voice" color="#cc5555" />
                </div>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {isLMStudioConnected || isDaaSConnected || voiceConnected ? 'AI Ready' : 'AI Offline'}
                </span>
              </div>

              {/* ── AI CHAT (always visible) ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <div className="border-b border-violet-500/20 pb-2 mb-1 flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
                    {locale === 'fr' ? 'Le Troubadour' : 'The Troubadour'}
                  </span>
                  {detectedEmotion && (
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border border-violet-500/30 text-violet-300">
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
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>
                      {locale === 'fr'
                        ? 'Demandez au Troubadour…'
                        : 'Ask the Troubadour about your practice, the curriculum, or your next step…'}
                    </p>
                  )}
                  {/* AI Disclosure */}
                  <p style={{
                    fontSize: '0.6rem',
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
                      fontSize: '0.72rem', lineHeight: 1.5,
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
                      fontSize: '0.72rem',
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
                    {voiceRecording ? <Mic size={14} /> : <MicOff size={14} />}
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
                    <Send size={12} />
                  </button>
                </div>
                
                {/* ── Net Protocol HUD ── */}
                {voiceRecording && (
                  <div className="mt-2 p-2 rounded-lg bg-black/40 border border-red-500/20 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-red-400/80 font-mono uppercase tracking-widest">
                      Net Protocol Active
                    </span>
                    <div className="flex gap-2 w-full mt-1">
                      <div className="flex-1 h-1 bg-red-500/20 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-red-500/50 animate-[pulseMic_1.5s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <span className="text-[10px] text-red-300 font-serif italic mt-1">
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
