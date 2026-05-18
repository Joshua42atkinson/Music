import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, AlertCircle, RotateCcw } from 'lucide-react';

const PracticeTimer = () => {
  const [minutes, setMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        alert("Practice session complete! Take a moment to breathe and integrate.");
        setMode('break');
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        alert("Break is over. Ready to dive back into the microscopic dance?");
        setMode('focus');
        setTimeLeft(minutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, minutes]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setMode('focus');
  };

  const adjustTime = (newMinutes) => {
    if (isActive) return;
    setMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 100 - (timeLeft / (mode === 'focus' ? minutes * 60 : 5 * 60)) * 100;

  return (
    <div className="bg-[#030306] border border-white/10 rounded-2xl p-6 text-white font-inter w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-cf-gold" size={20} />
          <h2 className="text-xl font-cormorant font-bold text-cf-ink-bright">Practice Timer</h2>
        </div>
        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border ${
          mode === 'focus' ? 'bg-cf-gold/10 text-cf-gold border-cf-gold/30' : 'bg-cf-sage/10 text-cf-sage border-cf-sage/30'
        }`}>
          {mode === 'focus' ? 'Focus Session' : 'Integration Break'}
        </span>
      </div>

      <div className="bg-cf-deep border border-cf-border rounded-xl p-8 text-center mb-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
        {/* Progress Arc background placeholder */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          background: `conic-gradient(from 180deg at 50% 100%, ${mode === 'focus' ? '#c9a96e' : '#7aaa88'} ${progress}%, transparent ${progress}%)`
        }} />

        <div className="relative z-10">
          <div className={`text-6xl font-bold font-mono tracking-tighter mb-2 ${mode === 'break' ? 'text-cf-sage' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
            {mode === 'focus' ? 'Myelinating Pathways' : 'Resting Fascia'}
          </p>

          {mode === 'focus' && isActive && (
            <div className="flex items-center justify-center gap-2 text-cf-gold animate-pulse">
              <AlertCircle size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Practice TOO SLOW</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Time Presets */}
        <div className="flex justify-between items-center bg-white/5 rounded-lg p-1 border border-white/10">
          {[5, 15, 25, 45].map(preset => (
            <button
              key={preset}
              onClick={() => adjustTime(preset)}
              disabled={isActive}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
                minutes === preset ? 'bg-cf-gold text-[#030306]' : 'text-white/50 hover:text-white'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {preset}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border ${
              isActive 
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                : 'bg-cf-gold text-[#030306] border-cf-gold hover:bg-white shadow-[0_0_15px_rgba(201,169,110,0.2)]'
            }`}
          >
            {isActive ? <><Pause size={20} fill="currentColor" /> Pause</> : <><Play size={20} fill="currentColor" /> Start Focus</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTimer;
