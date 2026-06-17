import React, { useState } from 'react';
import DigitalBinder from '../components/DigitalBinder';
import FretboardExplorer from '../components/FretboardExplorer';
import PitchRoom from '../components/PitchRoom';
import ModulePlayer from '../components/ModulePlayer';
import PlayerHandbook from '../components/PlayerHandbook';
import About from '../components/About';

const OrientationHub = () => {
  // null means showing the dashboard hub
  const [activeTab, setActiveTab] = useState(null);

  const hubStyle = {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    padding: activeTab ? '1rem' : '3rem 1rem'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '1rem'
  };

  const cardStyle = {
    background: '#11111a',
    borderRadius: '16px',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    padding: '2.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const backButtonStyle = {
    background: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    color: '#00f0ff',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease'
  };

  const modules = [
    {
      id: 'slides',
      title: "The Bard's Handbook",
      desc: "Deep-dive curriculum and the neuroscience of flow state.",
      icon: "📖"
    },
    {
      id: 'video',
      title: "Masterclass Video",
      desc: "Cinematic, slow-web presentation player.",
      icon: "🎥"
    },
    {
      id: 'binder',
      title: "Digital Binder",
      desc: "Interactive practice log and attention manager.",
      icon: "📓"
    },
    {
      id: 'fretboard',
      title: "Vertiscape Map",
      desc: "Audio-reactive fretboard and CAGED explorer.",
      icon: "🎸"
    },
    {
      id: 'pitch',
      title: "The Pitch Room",
      desc: "Gamified ear training and interval recognition.",
      icon: "🎵"
    },
    {
      id: 'about',
      title: "About Bertrand",
      desc: "Meet the instructor and explore his other works.",
      icon: "👤"
    }
  ];

  return (
    <div style={hubStyle}>
      <div style={containerStyle}>
        
        {/* DASHBOARD VIEW */}
        {!activeTab && (
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <div style={headerStyle}>
              <h1 style={{ 
                fontSize: '4.5rem', 
                marginBottom: '1rem', 
                background: '-webkit-linear-gradient(#ffffff, #00f0ff)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
                fontWeight: '900'
              }}>
                The Foundation
              </h1>
              <p style={{ fontSize: '1.4rem', color: '#a0a0c0', fontWeight: '300', letterSpacing: '2px' }}>
                BERTRAND LAURENCE MASTERCLASS
              </p>
            </div>

            <div style={gridStyle}>
              {modules.map((mod) => (
                <div 
                  key={mod.id} 
                  style={cardStyle}
                  onClick={() => setActiveTab(mod.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 240, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                  }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{mod.icon}</div>
                  <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>
                    {mod.title}
                  </h2>
                  <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE MODULE VIEW */}
        {activeTab && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <button 
              style={backButtonStyle} 
              onClick={() => setActiveTab(null)}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
            >
              &larr; Back to Dashboard
            </button>
            
            <div style={{ marginTop: '1rem' }}>
              {activeTab === 'slides' && <PlayerHandbook />}
              {activeTab === 'video' && <ModulePlayer />}
              {activeTab === 'binder' && <DigitalBinder />}
              {activeTab === 'fretboard' && <FretboardExplorer />}
              {activeTab === 'pitch' && <PitchRoom />}
              {activeTab === 'about' && <About />}
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrientationHub;
