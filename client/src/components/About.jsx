import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '3rem',
    background: '#11111a',
    borderRadius: '16px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    color: '#e0e0ff',
    fontFamily: "'Inter', sans-serif",
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '4rem',
    alignItems: 'start'
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    position: 'sticky',
    top: '2rem'
  };

  const imageWrapperStyle = {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // The user will save their image to this path
  const imagePath = "/assets/bertrand_profile.jpg";

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem'
  };

  const h1Style = {
    fontSize: '3.5rem',
    margin: '0',
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    lineHeight: '1.1'
  };

  const h2Style = {
    color: '#00f0ff',
    fontSize: '2rem',
    margin: '0 0 1rem 0',
    fontFamily: "'Outfit', sans-serif",
    borderBottom: '1px solid rgba(0,240,255,0.2)',
    paddingBottom: '0.5rem'
  };

  const pStyle = {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    color: '#b0b0c0',
    margin: '0 0 1.5rem 0'
  };

  const linkButtonContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const linkBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  };

  const blockquoteStyle = {
    borderLeft: '4px solid #ff8a00',
    paddingLeft: '1.5rem',
    margin: '0',
    fontStyle: 'italic',
    fontSize: '1.4rem',
    color: '#fff'
  };

  return (
    <div style={containerStyle}>
      {/* LEFT COLUMN: Image & Contact */}
      <div style={leftColumnStyle}>
        <div style={imageWrapperStyle}>
          {/* We use an img tag pointing to the public assets folder */}
          <img 
            src={imagePath} 
            alt="Bertrand Laurence" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback if the user hasn't saved the image yet
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Please save the photo as<br/><code>client/public/assets/bertrand_profile.jpg</code></div>';
            }}
          />
        </div>
        
        <div style={linkButtonContainer}>
          <a href="http://bertrandlaurence.net/" target="_blank" rel="noopener noreferrer" style={linkBtnStyle}
             onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
             onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <span>Official Website</span> <span>&rarr;</span>
          </a>
          <a href="mailto:BertLarryMusic@gmail.com" style={linkBtnStyle}
             onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
             onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <span>Email Bertrand</span> <span>&rarr;</span>
          </a>
          <a href="https://bertrandguitarstudio.duetpartner.com/" target="_blank" rel="noopener noreferrer" style={linkBtnStyle}
             onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
             onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <span>Student Portal</span> <span>&rarr;</span>
          </a>
          <div style={{ ...linkBtnStyle, background: 'transparent', border: 'none', color: '#ff8a00' }}>
            <span>Free Consultation:</span>
            <span>617 447 5575</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Bio & Philosophy */}
      <div style={rightColumnStyle}>
        <div>
          <h1 style={h1Style}>Bertrand Laurence</h1>
          <h3 style={{ fontSize: '1.4rem', color: '#ff8a00', margin: '1rem 0 0 0', fontWeight: '400', letterSpacing: '1px' }}>
            MASTER INSTRUCTOR & MUSICIAN
          </h3>
        </div>

        <blockquote style={blockquoteStyle}>
          "Not just quality guitar lessons—professional music lessons on the guitar."
        </blockquote>

        <div>
          <h2 style={h2Style}>The Philosophy</h2>
          <p style={pStyle}>
            <strong>How:</strong> Learn two things at once: how music works, and how guitars work. In a friendly, relaxed atmosphere, we explore the wonder-world of the fingerboard with easy-to-read maps derived directly from the songs you pick. Harmony, Ear Training, and Technique are covered in games that actually teach. <em>Notes &rarr; Chords &rarr; Songs.</em>
          </p>
          <p style={pStyle}>
            <strong>Why:</strong> Because it is so much easier to remember something when you fundamentally understand it. When you choose the songs or styles you love, learning how your favorite music is made becomes an exciting challenge rather than a chore. We work to release your own creativity, grow your overall musicianship, and organize your ideas into actual songs and compositions.
          </p>
        </div>

        <div>
          <h2 style={h2Style}>Specializations</h2>
          <p style={pStyle}>
            Bertrand specializes across a wide array of genres including <strong>Blues, Folk, Swing, Classical, Rock, and elements of Jazz.</strong> 
            <br/><br/>
            Beyond standard instruction, he offers songwriter arrangements, accompaniment training, and vocal warm-ups/work-outs specifically designed for the guitarist. He provides comprehensive creativity and performance coaching for both Acoustic and Electric players.
          </p>
        </div>
        
        <div style={{ padding: '2rem', background: '#0a0a0f', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <p style={{ color: '#888', fontStyle: 'italic', margin: 0, textAlign: 'center', fontSize: '1.1rem' }}>
            "Illness is the most heeded of doctors: to goodness and wisdom we only make promises; pain we obey."<br/>
            <span style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>– Marcel Proust</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
