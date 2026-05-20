import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DigitalBinder from './DigitalBinder';
import StudioPage from '../pages/StudioPage';
import MentorDashboard from './MentorDashboard';
import { Shield } from 'lucide-react';

export default function MentorTools() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="mentor-tools-wrapper bg-cf-void w-full relative">
      {/* Home Button with Branding */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Return to home"
        >
          <img
            src="/assets/wordmark.png"
            alt="Voix Vive"
            className="h-8 w-auto"
            draggable={false}
          />
        </button>
        <button
          onClick={() => setShowDashboard(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-widest uppercase text-cf-gold bg-cf-gold/10 hover:bg-cf-gold/20 border border-cf-gold/20 hover:border-cf-gold/40 rounded-xl transition-all"
        >
          <Shield size={14} className="animate-pulse" /> Seeker Coach Portal
        </button>
      </div>

      {showDashboard && <MentorDashboard onClose={() => setShowDashboard(false)} />}
      
      {/* The Tools (The Sword) */}
      <div className="tools-section">
        <DigitalBinder />
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-cf-gold/30 to-transparent my-12" />

      {/* The Mentorship (How to wield the Sword) */}
      <div className="mentorship-section">
        <StudioPage />
      </div>
    </div>
  );
}
