import React from 'react';
import { Minus, Plus, Square, Play } from 'lucide-react';

export default function TruebadourClick({ t, metro }) {
  return (
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

      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-mono text-white font-light tracking-tighter">
          {metro.bpm} <span className="text-base text-cf-slate tracking-widest">BPM</span>
        </div>
        
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => metro.setBpm(b => Math.max(40, b - 5))} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white hover:bg-white/10 transition-all">
            <Minus size={20} />
          </button>
          
          <input 
            type="range" min="40" max="208" value={metro.bpm}
            onChange={e => metro.setBpm(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
          />
          
          <button onClick={() => metro.setBpm(b => Math.min(208, b + 5))} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white hover:bg-white/10 transition-all">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => metro.setBeats(b => (b === 4 ? 3 : 4))} 
            className="px-4 py-2 rounded-lg bg-white/5 text-cf-slate font-mono text-sm hover:text-white transition-colors">
            {metro.beats}/4
          </button>
          <button onClick={() => metro.setIsPlaying(!metro.isPlaying)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              metro.isPlaying 
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
            {metro.isPlaying ? <Square size={20} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
