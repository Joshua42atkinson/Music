import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle, Coffee } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// PRACTICE TIMER — Bertrand's "TooSLow" Practice Method
//
// Based directly on "How to Learn & Practice (Part 1)" blog post
// by Bertrand Laurence (Mar 2022):
//
// "Practice TOO SLOW. Slow way the f#$%^kdown. Your impatience
//  is your worst enemy."
//
// "One hour of this mindful, deliberate practice will be worth
//  4 mindless practice."
//
// "The other secret weapon... is Deep Sleep."
// ═══════════════════════════════════════════════════════════

const FOCUS_TIPS = [
  'Practice TOO SLOW — way too slow.',
  'Analyse movements step by step, "under a microscope."',
  'Look at the dance between fretting and striking fingers.',
  'Check your body — any zones of tension? Release them.',
  'Loop a small piece. Make it musical, even at this slow tempo.',
  'What is the mood? What story does this fragment tell?',
  'Let "wrong" notes exist without flinching.',
];

const PracticeTimer = () => {
  const [minutes, setMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [completionMessage, setCompletionMessage] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle tips every 30 seconds while timer is running
  useEffect(() => {
    if (!isActive || mode !== 'focus') return;
    const tipTimer = setInterval(() => {
      setTipIndex(i => (i + 1) % FOCUS_TIPS.length);
    }, 30000);
    return () => clearInterval(tipTimer);
  }, [isActive, mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimeout(() => {
        setIsActive(false);
        if (mode === 'focus') {
          setCompletionMessage({
            icon: '✓',
            title: 'Session complete.',
            body: 'Take a moment to breathe and integrate. Deep sleep consolidates what you just practiced.',
            color: 'text-cf-gold',
          });
          setMode('break');
          setTimeLeft(5 * 60);
        } else {
          setCompletionMessage({
            icon: '♫',
            title: 'Break over.',
            body: 'Ready to dive back into the microscopic dance?',
            color: 'text-cf-sage',
          });
          setMode('focus');
          setTimeLeft(minutes * 60);
        }
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, minutes]);

  const toggleTimer = () => {
    setCompletionMessage(null);
    setIsActive(prev => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setMode('focus');
    setCompletionMessage(null);
  };

  const adjustTime = (newMinutes) => {
    if (isActive) return;
    setMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
    setCompletionMessage(null);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'focus' ? minutes * 60 : 5 * 60;
  const progress = 100 - (timeLeft / totalDuration) * 100;
  const isFocus = mode === 'focus';

  return (
    <div className="bg-[#030306] border border-white/10 rounded-2xl p-6 text-white font-inter w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-cf-gold" size={20} />
          <h2 className="text-xl font-cormorant font-bold text-cf-ink-bright">Practice Timer</h2>
        </div>
        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border ${
          isFocus
            ? 'bg-cf-gold/10 text-cf-gold border-cf-gold/30'
            : 'bg-cf-sage/10 text-cf-sage border-cf-sage/30'
        }`}>
          {isFocus ? 'Focus Session' : 'Integration Break'}
        </span>
      </div>

      {/* Timer Display */}
      <div className="bg-cf-deep border border-cf-border rounded-xl p-8 text-center mb-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
        {/* Radial progress fill */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          background: `conic-gradient(from 180deg at 50% 100%, ${isFocus ? '#c9a96e' : '#7aaa88'} ${progress}%, transparent ${progress}%)`
        }} />

        <div className="relative z-10">
          <div className={`text-6xl font-bold font-mono tracking-tighter mb-2 ${!isFocus ? 'text-cf-sage' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>

          {/* Completion message replaces the tip while idle */}
          {completionMessage ? (
            <div className={`${completionMessage.color} text-center`}>
              <div className="text-2xl mb-1">{completionMessage.icon}</div>
              <p className="text-sm font-bold">{completionMessage.title}</p>
              <p className="text-xs text-white/50 mt-1 max-w-[200px]">{completionMessage.body}</p>
            </div>
          ) : isActive && isFocus ? (
            /* Cycling tip while timer runs */
            <p className="text-[11px] font-mono text-cf-gold/80 italic text-center max-w-[200px] leading-relaxed transition-all duration-700">
              {FOCUS_TIPS[tipIndex]}
            </p>
          ) : (
            <p className="text-xs font-mono uppercase tracking-widest text-white/30">
              {isFocus ? 'Mindful · Deliberate · TooSLow' : 'Resting Fascia · Deep Integration'}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
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

        {/* Bertrand's deep sleep footnote */}
        <p className="text-[10px] text-white/25 font-mono text-center italic">
          "Deep sleep consolidates kinesthetic knowledge." — Bertrand Laurence
        </p>

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
