import React from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResonanceRoom() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-cf-ink relative overflow-hidden flex flex-col font-sans">
      
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-2xl font-light text-cf-gold tracking-widest uppercase">The Resonance Room</h1>
        <button 
          onClick={() => navigate('/mentorship')}
          className="text-cf-slate hover:text-white transition-colors uppercase tracking-wider text-sm border border-cf-slate/30 rounded-full px-4 py-1"
        >
          Return to Hub
        </button>
      </header>

      {/* Main Video Area (Mockup for Daily.co or WebRTC) */}
      <div className="flex-grow flex relative pt-20 pb-24 px-6 gap-6">
        
        {/* Remote Video (Instructor) */}
        <div className="flex-grow bg-cf-void/80 rounded-2xl border border-cf-gold/20 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Mock Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a120b] to-[#0a192f] opacity-80" />
          <Users size={64} className="text-cf-gold/20 mb-4 relative z-10" />
          <p className="text-cf-gold/50 font-light relative z-10">Waiting for Bertrand to join...</p>
          
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10 text-white text-sm">
            Bertrand Laurence
          </div>
        </div>

        {/* Local Video (Student) - PIP Style on large screens */}
        <div className="absolute bottom-32 right-12 w-64 aspect-video bg-gray-900 rounded-xl border-2 border-cf-gold shadow-2xl overflow-hidden flex items-center justify-center z-10">
          <p className="text-cf-slate text-xs">Your Camera</p>
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-white text-xs">
            You
          </div>
        </div>
      </div>

      {/* Controls Footer */}
      <footer className="absolute bottom-0 w-full p-6 flex justify-center items-center gap-6 z-20 bg-gradient-to-t from-black to-transparent">
        <button className="w-14 h-14 rounded-full bg-cf-ink/20 flex items-center justify-center text-white hover:bg-cf-ink/40 transition-colors backdrop-blur-md border border-white/10">
          <Mic size={24} />
        </button>
        <button className="w-14 h-14 rounded-full bg-cf-ink/20 flex items-center justify-center text-white hover:bg-cf-ink/40 transition-colors backdrop-blur-md border border-white/10">
          <Video size={24} />
        </button>
        <button className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <PhoneOff size={28} />
        </button>
        <button className="w-14 h-14 rounded-full bg-cf-ink/20 flex items-center justify-center text-white hover:bg-cf-ink/40 transition-colors backdrop-blur-md border border-white/10">
          <Settings size={24} />
        </button>
      </footer>
      
    </div>
  );
}
