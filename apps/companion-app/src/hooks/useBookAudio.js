// ═══════════════════════════════════════════════════════════
// useBookAudio — Encapsulates BookWidget audio player state
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const TRACKS = [
  { id: 'houlton-skies', title: 'Houlton Skies',  artist: 'Bertrand Laurence', src: '/assets/houlton_skies.m4a' },
  { id: 'home-ambient',  title: { en: 'Home Sessions', fr: 'Sessions Maison' }, artist: 'Bertrand Laurence', src: '/assets/home_audio.m4a' },
];

export default function useBookAudio({ metroIsPlaying, onMetroConflict }) {
  const [trackIdx, setTrackIdx]       = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isMuted, setIsMuted]         = useState(false);
  const [volume, setVolume]           = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [hasAudioError, setHasAudioError] = useState(false);

  const audioRef  = useRef(null);
  const volumeRef = useRef(volume);

  const track = TRACKS[trackIdx];

  // Keep ref in sync
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  // Build / teardown audio element on track change
  useEffect(() => {
    let mounted = true;
    const audio = new Audio(track.src);
    audio.volume  = volumeRef.current;
    audio.loop    = true;
    audio.preload = 'auto';

    const onTime  = () => { if (mounted) setCurrentTime(audio.currentTime); };
    const onMeta  = () => { if (mounted) setDuration(audio.duration); };
    const onPlayE = () => { if (mounted) setIsPlaying(true); };
    const onPause = () => { if (mounted) setIsPlaying(false); };
    const onErr   = () => { if (mounted) setHasAudioError(true); };

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play',           onPlayE);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('error',          onErr);
    audioRef.current = audio;

    return () => {
      mounted = false;
      audio.pause();
      audio.src = '';
    };
  }, [track.src, trackIdx]);

  // Metronome mutual exclusion
  useEffect(() => {
    if (metroIsPlaying) audioRef.current?.pause();
  }, [metroIsPlaying]);

  useEffect(() => {
    if (isPlaying && onMetroConflict) onMetroConflict();
  }, [isPlaying, onMetroConflict]);

  // Listen for ambient events
  useEffect(() => {
    const onPause  = () => audioRef.current?.pause();
    const onResume = () => { if (!metroIsPlaying) audioRef.current?.play().catch(() => {}); };
    window.addEventListener('ambient:pause',  onPause);
    window.addEventListener('ambient:resume', onResume);
    return () => {
      window.removeEventListener('ambient:pause',  onPause);
      window.removeEventListener('ambient:resume', onResume);
    };
  }, [metroIsPlaying]);

  // ── Controls ──────────────────────────────────────────────
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const next = !isMuted;
    audioRef.current.muted = next;
    setIsMuted(next);
  }, [isMuted]);

  const handleVol = useCallback((v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const skipTrack = useCallback(() => {
    audioRef.current?.pause();
    setTrackIdx(i => (i + 1) % TRACKS.length);
  }, []);

  const formatTime = useCallback((s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }, []);

  const progress = useMemo(() =>
    duration > 0 ? (currentTime / duration) * 100 : 0,
  [currentTime, duration]);

  const localize = useCallback((val, locale) => {
    if (!val) return '';
    if (typeof val === 'object') return val[locale] || val['en'] || '';
    return val;
  }, []);

  return {
    track, trackIdx, setTrackIdx,
    isPlaying, isMuted, volume,
    currentTime, duration, hasAudioError,
    progress,
    toggleMusic, toggleMute, handleVol, skipTrack,
    formatTime, localize,
  };
}
