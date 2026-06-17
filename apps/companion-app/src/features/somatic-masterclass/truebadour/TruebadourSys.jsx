import React from 'react';
import { User, Download, Upload } from 'lucide-react';

export default function TruebadourSys({
  activeProfile, bardLevel, exportVoixVive, importVoixVive, traction, updateTraction
}) {
  return (
    <div>
      <div className="border-b border-violet-500/20 pb-2 mb-4">
        <span className="text-base font-mono uppercase tracking-widest text-violet-400">
          System & Identity
        </span>
      </div>
      
      {activeProfile ? (
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold font-serif text-3xl uppercase shadow-inner">
            {activeProfile.charAt(0)}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{activeProfile}</div>
            <div className="text-base text-violet-400 font-mono uppercase tracking-wider">Bard Level {bardLevel}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40">
            <User size={24} />
          </div>
          <div>
            <div className="text-lg text-white/50 italic">Unregistered</div>
            <div className="text-base text-white/30 font-mono uppercase tracking-wider">Local play only</div>
          </div>
        </div>
      )}

      <div className="text-base text-white/70 mb-2 font-serif italic">
        The Memory Card
      </div>
      <div className="flex gap-2">
        <button 
          onClick={exportVoixVive}
          className="flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Download size={18} /> Save State
        </button>
        
        <label className="flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={18} /> Load State
          <input 
            type="file" 
            accept=".voixvive,.json"
            onChange={importVoixVive}
            className="hidden" 
          />
        </label>
      </div>

      <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
        Curriculum Rules
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: false } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            !traction?.settings?.sandboxMode 
              ? 'border-violet-500 bg-violet-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Guided Path
        </button>
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, sandboxMode: true } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            traction?.settings?.sandboxMode 
              ? 'border-amber-500 bg-amber-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Open Book
        </button>
      </div>
      <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
        Audience Focus
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, kidMode: false } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            !traction?.settings?.kidMode 
              ? 'border-violet-500 bg-violet-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Masterclass
        </button>
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, kidMode: true } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            traction?.settings?.kidMode 
              ? 'border-amber-500 bg-amber-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Apprentice
        </button>
      </div>

      <div className="text-base text-white/70 mb-2 mt-4 font-serif italic">
        AI Guidance
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: true } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            traction?.settings?.aiEnabled !== false
              ? 'border-violet-500 bg-violet-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Truebadour
        </button>
        <button 
          onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, aiEnabled: false } }))}
          className={`flex-1 py-2 rounded-lg text-base font-mono uppercase tracking-wider border transition-all ${
            traction?.settings?.aiEnabled === false
              ? 'border-amber-500 bg-amber-500/20 text-white' 
              : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Silent
        </button>
      </div>
    </div>
  );
}
