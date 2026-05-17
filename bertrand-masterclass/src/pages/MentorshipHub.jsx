import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, MessageSquare, Upload, CheckCircle2, PlayCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MentorshipHub() {
  const navigate = useNavigate();
  // Mock role state (would come from Supabase Auth in the future)
  const [role, setRole] = useState('student'); // 'student' or 'instructor'
  const [activeTab, setActiveTab] = useState('assignments');

  return (
    <div className="min-h-screen bg-cf-void text-cf-ink relative overflow-hidden flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cf-void via-[#1a120b] to-[#0a192f] opacity-80" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#b87d3b]/10 via-transparent to-transparent opacity-50" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-6xl w-full mx-auto p-6 md:p-12">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-cf-gold/20 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-light text-cf-gold tracking-widest uppercase"
            >
              Mentorship Hub
            </motion.h1>
            <p className="text-cf-slate mt-2 text-lg italic font-serif">
            {role === 'student' ? "Your path to mastery, guided by The Bard." : "The Bard's Voix Vive: Apprentice Overview"}
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Dev toggle for role testing */}
            <button 
              onClick={() => setRole(r => r === 'student' ? 'instructor' : 'student')}
              className="px-4 py-2 rounded-full border border-cf-gold/30 text-cf-gold text-xs uppercase tracking-wider hover:bg-cf-gold/10 transition-colors"
            >
              Toggle Role (Dev)
            </button>
            <button 
              onClick={() => navigate('/resonance-room')}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-cf-gold text-cf-void font-semibold uppercase tracking-wider hover:bg-white transition-colors"
            >
              <Video size={18} />
              <span>Enter Resonance Room</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {role === 'student' ? <StudentDashboard activeTab={activeTab} setActiveTab={setActiveTab} /> : <InstructorDashboard />}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Direct Messages Widget */}
            <div className="bg-cf-ink/5 border border-cf-gold/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col h-full min-h-[400px]">
              <div className="flex items-center gap-3 mb-6 border-b border-cf-gold/10 pb-4">
                <MessageSquare className="text-cf-gold" />
                <h2 className="text-xl font-light text-cf-gold tracking-wide uppercase">Direct Channel</h2>
              </div>
              
              <div className="flex-grow flex flex-col justify-end gap-4 overflow-y-auto mb-4">
                {/* Mock Messages */}
                <div className="bg-cf-gold/10 p-3 rounded-lg rounded-tl-none self-start max-w-[85%] border border-cf-gold/20">
                  <p className="text-sm text-cf-silver">I reviewed your PLING! submission. The pitch is perfect, but watch the tension in your jaw.</p>
                  <span className="text-[10px] text-cf-slate block mt-1">Bertrand • 2h ago</span>
                </div>
                <div className="bg-blue-900/20 p-3 rounded-lg rounded-tr-none self-end max-w-[85%] border border-blue-500/20">
                  <p className="text-sm text-cf-silver">Thanks! I'll try the jaw release exercise before I record the next one.</p>
                  <span className="text-[10px] text-cf-slate block mt-1 text-right">You • 1h ago</span>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Send a message..." 
                  className="w-full bg-cf-void border border-cf-gold/20 rounded-xl py-3 px-4 text-sm text-cf-silver focus:outline-none focus:border-cf-gold transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Student View
// ----------------------------------------------------------------------
function StudentDashboard({ activeTab, setActiveTab }) {
  return (
    <>
      {/* Tabs */}
      <div className="flex gap-4 border-b border-cf-gold/20">
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 px-2 text-sm uppercase tracking-wider transition-colors ${activeTab === 'assignments' ? 'text-cf-gold border-b-2 border-cf-gold' : 'text-cf-slate hover:text-cf-silver'}`}
        >
          My Assignments
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-2 text-sm uppercase tracking-wider transition-colors ${activeTab === 'feedback' ? 'text-cf-gold border-b-2 border-cf-gold' : 'text-cf-slate hover:text-cf-silver'}`}
        >
          Instructor Feedback
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'assignments' && (
          <motion.div 
            key="assignments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* Active Assignment Card */}
            <div className="bg-gradient-to-r from-cf-gold/10 to-transparent border border-cf-gold/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cf-gold/5 rounded-full blur-3xl" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl text-white font-light">Chapter 7: The PLING! Protocol</h3>
                  <p className="text-cf-slate mt-1 text-sm">Due in 3 days</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs uppercase tracking-wide border border-red-900/50">Action Required</span>
              </div>
              <p className="text-cf-silver font-serif italic mb-6">
                Record yourself executing the PLING! protocol on the A string. Focus on matching the pitch internally before playing the note.
              </p>
              
              {/* Mock Upload Component */}
              <div className="border-2 border-dashed border-cf-gold/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cf-gold/50 hover:bg-cf-gold/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-cf-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="text-cf-gold" />
                </div>
                <p className="text-cf-gold font-medium">Click to upload video submission</p>
                <p className="text-cf-slate text-xs mt-1">MP4 or WebM, max 100MB</p>
              </div>
            </div>

            {/* Completed Assignment */}
            <div className="bg-cf-ink/5 border border-cf-gold/10 rounded-2xl p-6 backdrop-blur-sm opacity-70">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-green-500" />
                  <div>
                    <h3 className="text-lg text-white font-light">Chapter 6: The Fretboard Map</h3>
                    <p className="text-cf-slate text-xs">Submitted on May 15</p>
                  </div>
                </div>
                <button className="text-cf-gold text-sm hover:underline">View Feedback</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-cf-ink/5 border border-cf-gold/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-cf-gold/20 flex items-center justify-center">
                  <PlayCircle className="text-cf-gold" />
                </div>
                <div>
                  <h3 className="text-lg text-white font-light">Feedback on Chapter 6</h3>
                  <p className="text-cf-slate text-xs">From Bertrand • 2 days ago</p>
                </div>
              </div>
              <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-cf-gold/10">
                <PlayCircle size={48} className="text-cf-gold/50 hover:text-cf-gold cursor-pointer transition-colors" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ----------------------------------------------------------------------
// Instructor View
// ----------------------------------------------------------------------
function InstructorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI Cards */}
        <div className="bg-cf-ink/5 border border-cf-gold/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-cf-slate uppercase tracking-wider text-xs">Active Students</h3>
            <Users size={16} className="text-cf-gold" />
          </div>
          <p className="text-3xl text-white font-light">12</p>
        </div>
        <div className="bg-gradient-to-br from-cf-gold/20 to-cf-gold/5 border border-cf-gold/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-cf-gold uppercase tracking-wider text-xs">Pending Reviews</h3>
            <Video size={16} className="text-cf-gold" />
          </div>
          <p className="text-3xl text-white font-light">4</p>
        </div>
      </div>

      {/* Review Queue */}
      <h2 className="text-xl font-light text-cf-silver mt-4 border-b border-cf-gold/10 pb-2">Submission Queue</h2>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-cf-ink/5 border border-cf-gold/10 rounded-xl p-4 flex justify-between items-center hover:bg-cf-gold/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                S{i}
              </div>
              <div>
                <h4 className="text-white font-medium">Student Name {i}</h4>
                <p className="text-cf-slate text-xs">Chapter {i + 5}: Video Submission</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-full bg-cf-gold/10 text-cf-gold text-xs uppercase tracking-wider hover:bg-cf-gold hover:text-cf-void transition-colors border border-cf-gold/30">
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
