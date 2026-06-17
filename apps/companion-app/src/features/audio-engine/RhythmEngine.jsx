import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Settings, Music } from 'lucide-react';
import { getAudioContext, resumeAudio, playPluckedString, playMetronomeClick } from '../../audio/audioEngine';

// A sample JS-Hero style track mapping
const SAMPLE_TRACK = [
  { measure: 1, beat: 0, fret: 3, string: 0 },
  { measure: 1, beat: 1, fret: 5, string: 0 },
  { measure: 1, beat: 2, fret: 7, string: 0 },
  { measure: 1, beat: 3, fret: 5, string: 0 },
  { measure: 2, beat: 0, fret: 3, string: 0 },
  { measure: 2, beat: 1.5, fret: 0, string: 0 },
  { measure: 2, beat: 2.5, fret: 3, string: 0 },
  { measure: 3, beat: 0, fret: 3, string: 1 },
  { measure: 3, beat: 1, fret: 3, string: 1 },
  { measure: 3, beat: 2, fret: 5, string: 1 },
  { measure: 3, beat: 3, fret: 5, string: 1 },
];

const RhythmEngine = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [currentMeasure, setCurrentMeasure] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(0);

  const nextNoteTimeRef = useRef(0);
  const currentTickRef = useRef({ measure: 1, beat: 0 }); // 0 to 3.75 (sixteenth notes)
  const timerIDRef = useRef(null);
  const schedulerRef = useRef(null);
  
  const lookahead = 25.0; 
  const scheduleAheadTime = 0.1; 

  const initAudio = () => {
    resumeAudio();
  };

  const nextTick = useCallback(() => {
    // Advance by a 16th note (0.25 of a beat)
    const secondsPerBeat = 60.0 / bpm;
    const secondsPerTick = secondsPerBeat * 0.25;
    
    nextNoteTimeRef.current += secondsPerTick;
    
    let { measure, beat } = currentTickRef.current;
    beat += 0.25;
    if (beat >= 4) {
      beat = 0;
      measure += 1;
    }
    currentTickRef.current = { measure, beat };
    
    // Update visual state every full beat for the metronome UI
    if (beat % 1 === 0) {
      setCurrentMeasure(measure);
      setCurrentBeat(beat);
    }
  }, [bpm]);

  const scheduleNote = useCallback((measure, beat, time) => {
    // Check if there is a note in the track at this exact measure/beat
    const note = SAMPLE_TRACK.find(n => n.measure === measure && n.beat === beat);
    
    if (note) {
      const freq = 220.0 * Math.pow(2, (note.fret + (note.string * 5)) / 12);
      playPluckedString(freq, time);
    } else if (beat % 1 === 0) {
      // Metronome click
      playMetronomeClick(beat === 0, time);
    }
  }, []);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      scheduleNote(currentTickRef.current.measure, currentTickRef.current.beat, nextNoteTimeRef.current);
      nextTick();
    }
    timerIDRef.current = setTimeout(() => {
      if (schedulerRef.current) schedulerRef.current();
    }, lookahead);
  }, [nextTick, scheduleNote]);

  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (!timerIDRef.current) {
        currentTickRef.current = { measure: 1, beat: 0 };
        setTimeout(() => {
          setCurrentMeasure(1);
          setCurrentBeat(0);
          scheduler();
        }, 0);
        const ctx = getAudioContext();
        nextNoteTimeRef.current = (ctx ? ctx.currentTime : 0) + 0.05;
      }
    } else {
      clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    return () => clearTimeout(timerIDRef.current);
  }, [isPlaying, scheduler]);

  return (
    <div className="bg-[#030306] border border-white/10 rounded-2xl p-6 text-white font-inter w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Music className="text-cf-gold" size={20} />
        <h2 className="text-xl font-cormorant font-bold text-cf-ink-bright">Rhythm Engine</h2>
      </div>

      <div className="flex gap-4 justify-between items-center mb-6 bg-white/5 p-4 rounded-xl">
        <div className="text-sm font-mono text-cf-gold">M: {currentMeasure} | B: {Math.floor(currentBeat) + 1}</div>
        <div className="flex items-center gap-2">
          <input 
            type="range" 
            min="40" 
            max="200" 
            value={bpm} 
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-24 accent-cf-gold"
          />
          <span className="font-mono text-sm">{bpm} BPM</span>
        </div>
      </div>

      {/* Visual Timeline (Scrolling Highway) */}
      <div className="relative h-64 bg-black border border-white/10 rounded-lg overflow-hidden mb-6 flex">
        {/* Render 4 strings / lanes */}
        {[0, 1, 2, 3].map(stringIdx => (
          <div key={stringIdx} className="flex-1 border-r border-white/5 relative">
            {/* The Hit Bar */}
            <div className="absolute bottom-4 left-0 w-full h-8 border-t-2 border-b-2 border-cf-gold/30 bg-cf-gold/10 z-10" />
            
            {/* Falling Notes */}
            {SAMPLE_TRACK.filter(n => n.string === stringIdx).map((note, i) => {
              // Calculate Y position based on current time
              // A note at M:1 B:0 should be at bottom-4 when current is M:1 B:0
              const noteTotalBeats = (note.measure - 1) * 4 + note.beat;
              const currentTotalBeats = (currentMeasure - 1) * 4 + currentBeat;
              
              // If note is in the past, hide it
              if (currentTotalBeats > noteTotalBeats + 0.5) return null;
              
              // If note is too far in future, hide it (show 4 beats ahead max)
              if (noteTotalBeats > currentTotalBeats + 4) return null;

              // 0% (top) to 100% (bottom hit bar)
              const distanceBeats = noteTotalBeats - currentTotalBeats;
              const topPos = 100 - (distanceBeats * 25); // 25% height per beat

              return (
                <div 
                  key={i}
                  className="absolute w-8 h-8 rounded-full bg-cf-gold text-black flex items-center justify-center font-bold text-xs left-1/2 -translate-x-1/2 z-20 transition-all duration-75 ease-linear"
                  style={{ top: `calc(${topPos}% - 3rem)` }}
                >
                  {note.fret}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            isPlaying 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-cf-gold text-black hover:bg-[#d4b985]'
          }`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? 'STOP TRACK' : 'PLAY TRACK'}
        </button>
      </div>
    </div>
  );
};

export default RhythmEngine;
