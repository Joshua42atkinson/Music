---
title: impl_02_rift_hub
status: archive
tags: []
date: 2026-06-14
---
# IMPL 02: RiftHub.jsx

// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : RiftHub.jsx                                         ║
// ║ WHAT    : Landing page for the RIFT destination showing hero and four sub-experience cards. 
// ║ WHY     : Provides a beautiful entry point to the RIFT creative hub, guiding users to Game Mode, Adventure, Somatic Studio, and Theory Map.
// ║ WHO     : student
// ║ OWNS    : UI state for hover effects on cards (via CSS) and layout responsiveness.
// ║ NEEDS   : react-router-dom Link for navigation.
// ║ RULES   : Must maintain dark aesthetic (#050508 background, #c9a96e gold accents) and be fully responsive down to 375px width.
// ║ FIX AT  : Check responsiveness on mobile devices; ensure hover animations work without causing layout shifts.
// ║ STAGE   : IMPLEMENT
// ╚═══════════════════════════════════════════════════════════════╝

import { Link } from 'react-router-dom';

const RiftHub = () => {
  return (
    <div style={{ 
      backgroundColor: '#050508', 
      minHeight: '100vh', 
      padding: '2rem',
      color: 'white',
      fontFamily: "'Cormorant Garamond', serif"
    }}>
      <style>{`
        .rift-hub-card {
          background-color: rgba(255,255,255,0.03);
          border: 1px solid #c9a96e;
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          flex: 1 1 200px;
          max-width: 300px;
        }
        .rift-hub-card:hover {
          transform: scale(1.02);
          background-color: rgba(201, 169, 110, 0.05);
        }
        .rift-hub-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .rift-hub-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #c9a96e;
        }
        .rift-hub-description {
          font-size: 0.9rem;
          color: #ccc;
          line-height: 1.4;
        }
        .rift-hub-cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2.5rem;
        }
        @media (max-width: 639px) {
          .rift-hub-card {
            flex: 1 1 100%;
            max-width: none;
          }
        }
      `}</style>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, #c9a96e, #ffffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          RIFT
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#ccc', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Where individual riffs become collective harmony
        </p>
      </div>

      <div className="rift-hub-cards-container">
        <Link to="/rift/game" className="rift-hub-card">
          <span className="rift-hub-icon">🎮</span>
          <h3 className="rift-hub-title">Game Mode</h3>
          <p className="rift-hub-description">VertiscaleEngine</p>
        </Link>
        
        <Link to="/rift/adventure" className="rift-hub-card">
          <span className="rift-hub-icon">🗺️</span>
          <h3 className="rift-hub-title">Adventure</h3>
          <p className="rift-hub-description">AdventurePlayer</p>
        </Link>
        
        <Link to="/rift/prompter" className="rift-hub-card">
          <span className="rift-hub-icon">🎬</span>
          <h3 className="rift-hub-title">Somatic Studio</h3>
          <p className="rift-hub-description">SomaticStudioPrompter</p>
        </Link>
        
        <Link to="/rift/theory" className="rift-hub-card">
          <span className="rift-hub-icon">🌐</span>
          <h3 className="rift-hub-title">Theory Map</h3>
          <p className="rift-hub-description">MaturationMap</p>
        </Link>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '4rem', 
        paddingTop: '2rem',
        borderTop: '1px solid rgba(201,169,110,0.2)'
      }}>
        <h2 style={{ 
          color: '#c9a96e', 
          marginBottom: '1rem',
          fontSize: '1.75rem'
        }}>
          Community Jam (Coming Soon)
        </p>
        <p style={{ 
          color: '#ccc', 
          maxWidth: '500px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Stay tuned for live jam sessions, duet challenges, and global musical conversations.
        </p>
      </div>
    </div>
  );
};

export default RiftHub;