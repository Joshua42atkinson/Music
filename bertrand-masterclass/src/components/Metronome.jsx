import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Settings, Volume2, Plus, Minus } from 'lucide-react';
import { getAudioContext, resumeAudio, playMetronomeClick } from '../audio/audioEngine';

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef(null);
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  const initAudio = () => {
    resumeAudio();
  };

  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTimeRef.current += secondsPerBeat;
    currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
    // Update state for visual sync (approximate, since React state is async)
    setCurrentBeat(currentBeatRef.current);
  }, [bpm, beatsPerMeasure]);

  const scheduleNote = useCallback((beatNumber, time) => {
    playMetronomeClick(beatNumber === 0, time, volume);
  }, [volume]);

  const scheduler = useCallback(() => {
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    const ctx = getAudioContext();
    if (!ctx) return;
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    timerIDRef.current = setTimeout(scheduler, lookahead);
  }, [nextNote, scheduleNote]);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (!timerIDRef.current) {
        currentBeatRef.current = 0;
        setCurrentBeat(0);
        const ctx = getAudioContext();
        nextNoteTimeRef.current = (ctx ? ctx.currentTime : 0) + 0.05;
        scheduler();
      }
    } else {
      clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    return () => {
      clearTimeout(timerIDRef.current);
    };
  }, [isPlaying, scheduler]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const adjustBpm = (amount) => {
    setBpm(prev => Math.max(40, Math.min(240, prev + amount)));
  };

  return (
    <div className="bg-[#030306] border border-white/10 rounded-2xl p-6 text-white font-inter w-full max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-cf-gold" size={20} />
        <h2 className="text-xl font-cormorant font-bold text-cf-ink-bright">Metronome</h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center mb-6 relative overflow-hidden">
        {/* Visualizer dots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-75 ${
                currentBeat === i && isPlaying
                  ? i === 0 ? 'bg-cf-gold scale-125 shadow-[0_0_10px_rgba(201,169,110,0.8)]' : 'bg-cf-sage scale-110 shadow-[0_0_8px_rgba(122,170,136,0.6)]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="text-6xl font-bold font-mono tracking-tighter text-white mb-2">
          {bpm}
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-cf-gold/70">BPM</p>
      </div>

      <div className="space-y-6">
        {/* BPM Slider */}
        <div className="flex items-center gap-4">
          <button onClick={() => adjustBpm(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <Minus size={16} />
          </button>
          <input 
            type="range" 
            min="40" 
            max="240" 
            value={bpm} 
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="flex-1 accent-cf-gold"
          />
          <button onClick={() => adjustBpm(1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <Plus size={16} />
          </button>
        </div>

        {/* Time Signature */}
        <div className="flex justify-between items-center bg-white/5 rounded-lg p-1 border border-white/10">
          {[2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => setBeatsPerMeasure(num)}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${beatsPerMeasure === num ? 'bg-cf-gold text-[#030306]' : 'text-white/50 hover:text-white'}`}
            >
              {num}/4
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Volume2 size={16} className="text-white/40" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-white/50"
          />
        </div>

        {/* Play Button */}
        <button 
          onClick={togglePlay}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
            isPlaying 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
              : 'bg-cf-gold text-[#030306] hover:bg-white shadow-[0_0_15px_rgba(201,169,110,0.2)]'
          }`}
        >
          {isPlaying ? <><Square size={20} fill="currentColor" /> Stop</> : <><Play size={20} fill="currentColor" /> Start Metronome</>}
        </button>
      </div>
    </div>
  );
};

export default Metronome;
