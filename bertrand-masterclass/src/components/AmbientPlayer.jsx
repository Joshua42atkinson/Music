import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Disc3, SkipForward, Music } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// AMBIENT PLAYER — Bertrand's Music as Background
//
// Primary track: "Houlton Skies" (demo) by Bertrand Laurence
// This sets the contemplative, somatic pacing for the
// e-learning experience. Quiet by default (30% volume).
//
// Uses HTML5 Audio for reliability instead of YouTube embed.
// Falls back to YouTube embed if local audio is unavailable.
// ═══════════════════════════════════════════════════════════

const TRACKS = [
  {
    id: 'houlton-skies',
    title: 'Houlton Skies',
    artist: 'Bertrand Laurence',
    src: '/assets/houlton_skies.m4a',
    youtubeId: 'eoxfY1WrKJQ',
  },
  {
    id: 'home-ambient',
    title: 'Home Sessions',
    artist: 'Bertrand Laurence',
    src: '/assets/home_audio.m4a',
    youtubeId: null,
  },
];

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // 30% — ambient, not dominant
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // ── Initialize audio ──
  useEffect(() => {
    const audio = new Audio(currentTrack.src);
    audio.volume = volume;
    audio.loop = TRACKS.length === 1; // Loop if single track
    audio.preload = 'metadata';
    
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleTrackEnd);
      audio.src = '';
    };
  }, [currentTrackIndex]);

  // ── Global pause listener ──
  useEffect(() => {
    const handleGlobalPause = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
      }
    };
    const handleGlobalResume = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('ambient:pause', handleGlobalPause);
    window.addEventListener('ambient:resume', handleGlobalResume);
    return () => {
      window.removeEventListener('ambient:pause', handleGlobalPause);
      window.removeEventListener('ambient:resume', handleGlobalResume);
    };
  }, [isPlaying]);

  const handleTrackEnd = () => {
    if (TRACKS.length > 1) {
      setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        // Autoplay may be blocked — user needs to interact first
        console.log('Playback requires user interaction:', err.message);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const skipTrack = () => {
    if (audioRef.current) audioRef.current.pause();
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Floating Tuning Peg UI */}
      <div className="fixed top-4 left-4 z-50 flex items-start gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border-2 shadow-lg transition-all ${
            isPlaying 
              ? 'bg-cf-gold/20 border-cf-gold/50 shadow-[0_0_20px_rgba(201,169,110,0.4)]' 
              : 'bg-[#1a1815]/80 border-cf-gold/30 hover:border-cf-gold/50 hover:bg-[#1a1815]'
          }`}
          title="♫ Play Ambient Music — Bertrand Laurence"
        >
          <Disc3 size={20} className={`${isPlaying ? 'text-cf-gold animate-spin-slow' : 'text-cf-gold/60'}`} />
        </button>

        {/* Expanded Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className="bg-[#12100e]/95 backdrop-blur-xl border border-cf-gold/20 rounded-2xl p-4 shadow-2xl min-w-[240px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 border-b border-cf-gold/10 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cf-gold">♫ Now Playing</span>
                <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>

              {/* Track Info */}
              <div className="mb-3">
                <div className="text-sm text-white font-medium truncate">{currentTrack.title}</div>
                <div className="text-[10px] text-cf-slate font-mono uppercase tracking-wider">{currentTrack.artist}</div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-cf-gold/60 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-cf-slate font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-cf-gold/10 flex items-center justify-center text-cf-gold border border-cf-gold/30 hover:bg-cf-gold/20 transition-all"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
                {TRACKS.length > 1 && (
                  <button
                    onClick={skipTrack}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white transition-colors"
                  >
                    <SkipForward size={14} />
                  </button>
                )}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <Music size={10} className="text-cf-slate flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cf-gold"
                />
                <span className="text-[9px] text-cf-slate font-mono w-6 text-right">{Math.round(volume * 100)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </>
  );
}
