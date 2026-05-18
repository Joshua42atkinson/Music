import React from 'react';
import DigitalBinder from './DigitalBinder';
import StudioPage from '../pages/StudioPage';

export default function MentorTools() {
  return (
    <div className="mentor-tools-wrapper bg-cf-void w-full">
      {/* 
        This is The Sword: 
        The top half is the Binder (The daily practice tools).
        The bottom half is the Studio (The mentorship storefront).
        This solves the traffic problem: students use the tools daily,
        and naturally scroll down to see the mentorship options.
      */}
      
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
