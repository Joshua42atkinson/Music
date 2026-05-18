import React from 'react';

const ModulePlayer = ({ title, description, videoUrl }) => {
  const containerStyle = {
    background: 'rgba(10, 10, 15, 0.95)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    marginBottom: '3rem',
    fontFamily: "'Inter', sans-serif"
  };

  const videoWrapperStyle = {
    position: 'relative',
    paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
    height: 0,
    overflow: 'hidden',
    borderRadius: '16px',
    background: '#000',
    boxShadow: 'inset 0 0 50px rgba(0,0,0,1)'
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  };

  const titleStyle = {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: '800',
    marginTop: '2rem',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  };

  const descStyle = {
    color: '#a0a0c0',
    fontSize: '1.1rem',
    lineHeight: '1.6'
  };

  return (
    <div style={containerStyle}>
      <div style={videoWrapperStyle}>
        {/* Placeholder for actual Bertrand video URL */}
        {videoUrl ? (
          <iframe 
            style={iframeStyle} 
            src={videoUrl} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        ) : (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#666', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>▶</span>
            <p style={{ marginTop: '1rem' }}>Module Video Content</p>
          </div>
        )}
      </div>
      <h2 style={titleStyle}>{title || "Module 1: Set & Setting"}</h2>
      <p style={descStyle}>{description || "Explore the fundamentals of the Practice Nook and Binder Control. Prepare the environment before you prepare the mind."}</p>
    </div>
  );
};

export default ModulePlayer;
