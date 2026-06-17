// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useMetronome.js                                      ║
// ║ WHAT    : Web Audio metronome hook with tap tempo              ║
// ║ WHY     : Extracted from TruebadourWidget to reduce monolith  ║
// ║ OWNS    : BPM, beats, volume, tap tempo, scheduler            ║
// ║ NEEDS   : audioEngine                                          ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                     ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState, useRef, useEffect, useCallback } from 'react';
import { getAudioContext, resumeAudio, playMetronomeClick } from '../audio/audioEngine';

export function useMetronome() {
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

export default useMetronome;
