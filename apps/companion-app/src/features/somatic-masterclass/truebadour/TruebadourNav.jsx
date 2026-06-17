import React from 'react';
import { Play, Music, User, Compass, Guitar } from 'lucide-react';

export default function TruebadourNav({ bardLevel, streak, practiceMinutes, completedNodes, nextRecommended, navigate, location }) {
  return (
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
          onClick={() => {
            if (nextRecommended) navigate(`/class/${nextRecommended}`);
            else navigate('/song');
          }} 
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
  );
}
