import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, UploadCloud, Play, Calendar, Music, Video, Clock, Send, Wrench, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PracticeRecorder from './PracticeRecorder';
import { TOOLS_CATALOG } from '../data/toolsData';
import RhythmEngine from './RhythmEngine';
import FretboardExplorer from './FretboardExplorer';
import PlingTrainer from './PlingTrainer';
import PitchRoom from './PitchRoom';
import BreathingGate from './BreathingGate';
import Metronome from './Metronome';
import PracticeTimer from './PracticeTimer';

const DigitalBinder = () => {
  const [activeTab, setActiveTab] = useState('log');
  const [activeToolId, setActiveToolId] = useState(null);
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

  const [showRecorder, setShowRecorder] = useState(false);
  const [submissions, setSubmissions] = useState(() => {
    return JSON.parse(localStorage.getItem('voixvive_submissions') || '[]');
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

  const handleRecorderClose = () => {
    setShowRecorder(false);
    // Refresh submissions from localStorage
    setSubmissions(JSON.parse(localStorage.getItem('voixvive_submissions') || '[]'));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#030306] text-white font-inter pb-32">
      
      {/* Practice Recorder Overlay */}
      <AnimatePresence>
        {showRecorder && (
          <PracticeRecorder 
            onClose={handleRecorderClose} 
            exerciseName="PLING! Protocol — Minor 3rd" 
          />
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="pt-safe p-6 bg-cf-surface border-b border-cf-border">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-cf-gold" size={24} />
          <h1 className="text-2xl font-cormorant font-bold text-cf-ink-bright">Digital Binder</h1>
        </div>
        <p className="text-sm text-cf-whisper mb-4">Track your practice, submit homework, and view Bertrand's feedback.</p>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
          <button 
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'log' ? 'bg-cf-gold text-[#030306]' : 'text-white/60 hover:text-white'}`}
          >
            Practice Log
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'tools' ? 'bg-cf-gold text-[#030306]' : 'text-white/60 hover:text-white'}`}
          >
            The 12 Tools
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {activeTab === 'log' && (
          <div className="space-y-6">
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
                    <button 
                      onClick={() => setShowRecorder(true)}
                      className="flex-1 py-3 rounded-xl bg-cf-sage text-cf-deep font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors"
                    >
                      <Video size={18} /> Record & Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* My Submissions */}
            {submissions.length > 0 && (
              <div>
                <h2 className="text-sm font-mono tracking-widest text-white/40 uppercase mb-4 px-2">My Submissions</h2>
                <div className="space-y-2">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        sub.status === 'reviewed' ? 'bg-green-500/20' : 
                        sub.status === 'sent' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {sub.status === 'reviewed' ? <CheckCircle size={16} className="text-green-400" /> :
                         sub.status === 'sent' ? <Send size={16} className="text-blue-400" /> :
                         <Clock size={16} className="text-yellow-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{sub.exerciseName}</h4>
                        <p className="text-xs text-white/50">
                          {sub.mediaType === 'video' ? '📹' : '🎙️'} {formatTime(sub.duration)} · {
                            new Date(sub.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          }
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
                        sub.status === 'reviewed' ? 'bg-green-500/20 text-green-400' :
                        sub.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {sub.status === 'reviewed' ? 'Reviewed' :
                         sub.status === 'sent' ? 'Sent' : 'Queued'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        )}

        {activeTab === 'tools' && (
          <div className="space-y-4">
            <p className="text-xs text-white/50 px-2 text-center">
              The 12 tools correspond to the 12 frets and chapters of the Hero's Journey.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 px-2">
              {TOOLS_CATALOG.map((tool) => (
                <div 
                  key={tool.id} 
                  className={`relative p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all ${
                    tool.status === 'available' 
                      ? 'bg-gradient-to-br from-cf-surface to-black/40 border-cf-gold/30 hover:border-cf-gold/60 cursor-pointer shadow-[0_4px_20px_rgba(201,169,110,0.05)] hover:-translate-y-1' 
                      : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (tool.status === 'available') {
                      setActiveToolId(tool.id);
                    }
                  }}
                >
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-cf-gold/50 bg-cf-gold/10 px-1.5 rounded">
                    FRET {tool.id}
                  </div>
                  
                  <div className={`p-3 rounded-full mt-4 ${tool.status === 'available' ? 'bg-cf-gold/10 text-cf-gold' : 'bg-white/5 text-white/30'}`}>
                    {tool.icon}
                  </div>

                  <div className="w-full">
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{tool.name}</h4>
                    <p className="text-[10px] text-white/40 line-clamp-2 leading-tight">{tool.telemetry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool Render Overlay */}
        <AnimatePresence>
          {activeToolId && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 bg-[#030306] flex flex-col overflow-y-auto pt-safe"
            >
              <div className="p-4 flex justify-between items-center bg-cf-surface border-b border-cf-border sticky top-0 z-10">
                <h2 className="text-xl font-bold font-cormorant text-cf-gold">
                  {TOOLS_CATALOG.find(t => t.id === activeToolId)?.name}
                </h2>
                <button 
                  onClick={() => setActiveToolId(null)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  Close Tool
                </button>
              </div>
              <div className="p-4 flex-1">
                {activeToolId === 1 && <BreathingGate />}
                {activeToolId === 2 && <PracticeTimer />}
                {activeToolId === 3 && <PitchRoom />}
                {activeToolId === 4 && <Metronome />}
                {activeToolId === 6 && <FretboardExplorer compact={false} />}
                {activeToolId === 7 && <PlingTrainer />}
                {activeToolId === 10 && <PracticeRecorder onClose={() => setActiveToolId(null)} exerciseName="Async Assessor" />}
                {activeToolId === 12 && <RhythmEngine />}
                {![1, 2, 3, 4, 6, 7, 10, 12].includes(activeToolId) && (
                  <div className="text-center mt-20">
                    <p className="text-white/50 mb-2">Tool UI placeholder...</p>
                    <p className="text-xs text-cf-gold/50 font-mono">{TOOLS_CATALOG.find(t => t.id === activeToolId)?.telemetry}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default DigitalBinder;

