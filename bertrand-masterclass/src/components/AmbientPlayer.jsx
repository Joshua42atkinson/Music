import React, { useState, useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Disc3, SkipForward, Music, Minus, Plus, Square } from 'lucide-react';
import { getAudioContext, resumeAudio, playMetronomeClick } from '../audio/audioEngine';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// AMBIENT PLAYER — Music + Metronome, globally persistent
// Fully localized and animated with a slow pulsating glow
// ═══════════════════════════════════════════════════════════

const TRACKS = [
  { id: 'houlton-skies', title: 'Houlton Skies',  artist: 'Bertrand Laurence', src: '/assets/houlton_skies.m4a' },
  { id: 'home-ambient',  title: { en: 'Home Sessions', fr: 'Sessions Maison' }, artist: 'Bertrand Laurence', src: '/assets/home_audio.m4a' },
];

// ── Metronome Web Audio engine ──────────────────────────────────────────
function useMetronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm]             = useState(120);
  const [beats, setBeats]         = useState(4);
  const [currentBeat, setBeat]    = useState(0);
  const [volume, setVolume]       = useState(0.5);
  const [lastTap, setLastTap]     = useState(null);
  const [tapHistory, setTapHistory] = useState([]);

  const nextRef  = useRef(0);
  const beatRef  = useRef(0);
  const timerRef = useRef(null);
  const bpmRef    = useRef(bpm);
  const beatsRef  = useRef(beats);
  const volRef    = useRef(volume);
  const playRef   = useRef(isPlaying);

  useEffect(() => { bpmRef.current = bpm; },       [bpm]);
  useEffect(() => { beatsRef.current = beats; },   [beats]);
  useEffect(() => { volRef.current = volume; },     [volume]);
  useEffect(() => { playRef.current = isPlaying; }, [isPlaying]);

  const initCtx = () => {
    resumeAudio();
  };

  const scheduleNote = useCallback((beat, time) => {
    playMetronomeClick(beat === 0, time, volRef.current);
  }, []);

  const schedulerRef = useRef();

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !playRef.current) return;
    while (nextRef.current < ctx.currentTime + 0.1) {
      scheduleNote(beatRef.current, nextRef.current);
      nextRef.current += 60 / bpmRef.current;
      beatRef.current  = (beatRef.current + 1) % beatsRef.current;
      setBeat(beatRef.current);
    }
    timerRef.current = setTimeout(schedulerRef.current, 25);
  }, [scheduleNote]);

  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

  useEffect(() => {
    if (isPlaying) {
      initCtx();
      beatRef.current = 0;
      const ctx = getAudioContext();
      nextRef.current = (ctx ? ctx.currentTime : 0) + 0.05;
      scheduler();
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, scheduler]);

  const tap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 3000) {
      const updated = [...tapHistory.slice(-4), Math.round(60000 / (now - lastTap))];
      setTapHistory(updated);
      setBpm(Math.max(40, Math.min(240, Math.round(updated.reduce((a, b) => a + b, 0) / updated.length))));
    } else { setTapHistory([]); }
    setLastTap(now);
  };

  const stop = useCallback(() => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  return { isPlaying, setIsPlaying, stop, bpm, setBpm, beats, setBeats, currentBeat, volume, setVolume, tap };
}

// ── Main component ──────────────────────────────────────────────────────
export default function AmbientPlayer() {
  const { locale, isFrench } = useLocale();
  const [mode, setMode]           = useState('music');
  const [showControls, setShowControls] = useState(false);
  
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
      if (!hasClickedOnce) {
        setHasClickedOnce(true);
        localStorage.setItem('voix_vive_ambient_clicked', '1');
      }
    };
    window.addEventListener('ambient:pause',  onPause);
    window.addEventListener('ambient:resume', onResume);
    window.addEventListener('ambient:open',   onOpen);
    return () => {
      window.removeEventListener('ambient:pause',  onPause);
      window.removeEventListener('ambient:resume', onResume);
      window.removeEventListener('ambient:open',   onOpen);
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

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex items-start gap-2">

        {/* Floating button — glows until first clicked */}
        <button
          onClick={handleButtonClick}
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border-2 shadow-lg transition-all ${
            isActive
              ? 'bg-cf-gold/20 border-cf-gold/50 shadow-[0_0_20px_rgba(201,169,110,0.4)]'
              : !hasClickedOnce
                ? 'bg-[#1a1815]/95 animate-pulse-gold border-cf-gold/50'
                : 'bg-[#1a1815]/80 border-cf-gold/30 hover:border-cf-gold/50'
          }`}
          title={mode === 'music' ? (isFrench ? '♫ Musique Ambiante' : '♫ Ambient Music') : (isFrench ? '♩ Métronome' : '♩ Metronome')}
        >
          {mode === 'click' ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
              stroke={isActive ? '#c9a96e' : 'rgba(201,169,110,0.5)'}
              strokeWidth="1.8" strokeLinecap="round">
              <polygon points="5,3 19,3 15,21 9,21" opacity="0.3" fill="rgba(201,169,110,0.1)" stroke="rgba(201,169,110,0.4)" strokeWidth="1"/>
              <line x1="12" y1="21" x2="12" y2="10" />
              <line x1="12" y1="10" x2={metro.isPlaying && metro.currentBeat === 0 ? 17 : 7} y2="5"
                style={{ transition: 'all 0.09s ease-out' }} />
              <circle cx={metro.isPlaying && metro.currentBeat === 0 ? 17 : 7} cy="5" r="1.5"
                fill={metro.isPlaying ? '#c9a96e' : 'rgba(201,169,110,0.4)'} stroke="none"
                style={{ transition: 'all 0.09s ease-out' }} />
            </svg>
          ) : (
            <Disc3 size={20} className={isPlaying ? 'text-cf-gold animate-spin-slow' : 'text-cf-gold/60'} />
          )}
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className="bg-[#12100e]/95 backdrop-blur-xl border border-cf-gold/20 rounded-2xl p-4 shadow-2xl"
              style={{ minWidth: 260 }}
            >
              {/* Mode toggle */}
              <div className="flex gap-1 p-1 bg-black/40 rounded-lg mb-4">
                <button
                  onClick={() => handleModeSwitch('music')}
                  className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'music' ? 'bg-cf-gold text-[#030306] font-bold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Music size={11} /> {isFrench ? 'Musique' : 'Music'}
                </button>
                <button
                  onClick={() => handleModeSwitch('click')}
                  className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'click' ? 'bg-cf-gold text-[#030306] font-bold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="5,3 19,3 15,21 9,21" fill="currentColor" opacity="0.3" />
                    <line x1="12" y1="10" x2="16" y2="5" />
                  </svg>
                  {isFrench ? 'Métronome' : 'Click'}
                </button>
              </div>

              {/* ── MUSIC MODE ── */}
              {mode === 'music' && (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-cf-gold/10 pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-cf-gold">
                      {isFrench ? '♫ En Lecture' : '♫ Now Playing'}
                    </span>
                    <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>

                  {hasError ? (
                    <p className="text-xs text-white/30 text-center py-4 font-mono">
                      {isFrench ? 'Aucun fichier audio trouvé' : 'No audio file found'}
                    </p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <div className="text-sm text-white font-medium truncate">{localize(track.title)}</div>
                        <div className="text-[10px] text-cf-slate font-mono uppercase tracking-wider">{track.artist}</div>
                      </div>
                      <div className="mb-3">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-cf-gold/60 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-cf-slate font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button onClick={toggleMusic}
                          className="w-12 h-12 rounded-full bg-cf-gold/10 flex items-center justify-center text-cf-gold border border-cf-gold/30 hover:bg-cf-gold/20 transition-all">
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
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cf-gold"
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
                  <div className="border-b border-cf-gold/10 pb-2 mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-cf-gold">
                      {isFrench ? '♩ Métronome' : '♩ Metronome'}
                    </span>
                  </div>

                  {/* Beat dots */}
                  <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: metro.beats }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-75 ${
                        metro.currentBeat === i && metro.isPlaying
                          ? i === 0
                            ? 'bg-cf-gold scale-125 shadow-[0_0_8px_rgba(201,169,110,0.8)]'
                            : 'bg-cf-sage scale-110 shadow-[0_0_6px_rgba(122,170,136,0.6)]'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>

                  {/* BPM */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold font-mono text-white">{metro.bpm}</div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-cf-gold/60">BPM</div>
                  </div>

                  {/* BPM slider */}
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => metro.setBpm(b => Math.max(40, b - 1))}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <Minus size={12} />
                    </button>
                    <input type="range" min="40" max="240" value={metro.bpm}
                      onChange={e => metro.setBpm(parseInt(e.target.value))}
                      className="flex-1 accent-cf-gold h-1" />
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
                          metro.beats === n ? 'bg-cf-gold text-[#030306]' : 'text-white/40 hover:text-white'
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
                      className="flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider border border-cf-gold/30 bg-cf-gold/5 text-cf-gold/70 hover:bg-cf-gold/15 hover:text-cf-gold transition-all active:scale-95">
                      {isFrench ? 'Taper' : 'Tap'}
                    </button>
                    <button onClick={() => metro.setIsPlaying(v => !v)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        metro.isPlaying
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-cf-gold text-[#030306] shadow-[0_0_12px_rgba(201,169,110,0.2)]'
                      }`}>
                      {metro.isPlaying ? <><Square size={12} fill="currentColor" /> {isFrench ? 'Arrêter' : 'Stop'}</> : <><Play size={12} fill="currentColor" /> {isFrench ? 'Lancer' : 'Start'}</>}
                    </button>
                  </div>
                </div>
              )}
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
      `}</style>
    </>
  );
}
