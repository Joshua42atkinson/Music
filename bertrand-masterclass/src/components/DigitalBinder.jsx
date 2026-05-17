import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, UploadCloud, Play, Calendar, Music } from 'lucide-react';

const DigitalBinder = () => {
  const [practiceTime, setPracticeTime] = useState(() => {
    const saved = localStorage.getItem('bertrand_practice_time');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('bertrand_habits');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Checked Shoulder Posture", completed: false },
      { id: 2, name: "Tuned Guitar", completed: false },
      { id: 3, name: "Reviewed CAGED Maps", completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bertrand_practice_time', practiceTime.toString());
  }, [practiceTime]);

  useEffect(() => {
    localStorage.setItem('bertrand_habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const resetDaily = () => {
    setHabits(habits.map(h => ({ ...h, completed: false })));
  };

  return (
    <div className="min-h-screen bg-[#030306] text-white font-inter pb-32">
      
      {/* Header */}
      <div className="pt-safe p-6 bg-cf-surface border-b border-cf-border">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-cf-gold" size={24} />
          <h1 className="text-2xl font-cormorant font-bold text-cf-ink-bright">Digital Binder</h1>
        </div>
        <p className="text-sm text-cf-whisper">Track your practice, submit homework, and view Bertrand's feedback.</p>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Practice Timer */}
        <div className="bard-card bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-cf-gold mb-2">Total Mindful Repetition</h3>
          <div className="text-5xl font-bold font-inter text-white mb-1">
            {practiceTime} <span className="text-lg text-white/40">MIN</span>
          </div>
          <p className="text-xs text-white/50 mb-6">You are myelinating the correct pathways.</p>
          
          <button 
            onClick={() => setPracticeTime(t => t + 5)}
            className="w-full max-w-xs mx-auto py-3 rounded-full bg-cf-gold/20 text-cf-gold font-bold border border-cf-gold/40 hover:bg-cf-gold/30 transition-colors"
          >
            + Log 5 Minutes
          </button>
        </div>

        {/* Assignments Section */}
        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-lg font-bold">Active Assignments</h2>
            <span className="text-xs text-cf-sage">1 Due</span>
          </div>

          <div className="bg-cf-deep border border-cf-border rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <UploadCloud size={80} />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 rounded bg-cf-sage/20 text-cf-sage text-[10px] font-mono tracking-widest mb-3 uppercase">Due Thursday</span>
              <h3 className="text-lg font-bold text-white mb-2">Record PLING! Protocol</h3>
              <p className="text-sm text-cf-whisper mb-6">
                Record a 2-minute audio clip of yourself singing the minor 3rd interval and finding it on the A string.
              </p>
              
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-cf-sage text-cf-deep font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors">
                  <UploadCloud size={18} /> Submit Audio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Checklist */}
        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-lg font-bold">Pre-Practice Ritual</h2>
            <button onClick={resetDaily} className="text-xs text-cf-gold hover:underline">Reset Daily</button>
          </div>

          <div className="space-y-2">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  habit.completed 
                    ? 'bg-green-500/10 border-green-500/20 opacity-70' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                  habit.completed ? 'bg-green-500 border-green-500 text-[#030306]' : 'border-white/20'
                }`}>
                  {habit.completed && <CheckCircle size={16} />}
                </div>
                <span className={`text-sm ${habit.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Past Feedback */}
        <div className="opacity-80">
          <h2 className="text-sm font-mono tracking-widest text-white/40 uppercase mb-4 px-2">Bertrand's Feedback</h2>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cf-gold/30 flex-shrink-0">
                <img src="/assets/bertrand_profile.jpg" alt="Bertrand" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold">CAGED Map Submission</h4>
                <p className="text-xs text-white/50">May 12, 2026</p>
              </div>
            </div>
            <p className="text-sm text-cf-ink-bright italic border-l-2 border-cf-gold/50 pl-3">
              "Your transition from the C-shape to the A-shape is much smoother. Keep watching that left thumb."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalBinder;
