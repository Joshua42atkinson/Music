import React, { useState } from 'react';

const slidesData = [
  {
    title: "The Myth of 10,000 Hours",
    subtitle: "Quantity vs. Quality in Practice",
    image: "/assets/slides/turtle.png", // Will use a placeholder if not present, but we have turtle!
    voiceover: "We've all heard it takes 10,000 hours to master a skill. But quantity without quality is just spinning your wheels. Mindless practice fosters mistakes and negative self-judgment. We are here to practice mindfully."
  },
  {
    title: "Practice TOO SLOW",
    subtitle: "Teaching the Nervous System",
    image: "/assets/slides/turtle.png",
    voiceover: "The secret to mastering the guitar? Practice slow. Slow way the f*** down. Impatience is your worst enemy. Teach your nervous system to relax. Make your muscles heavy and lazy to teach your mind to slow down."
  },
  {
    title: "The Microscopic Dance",
    subtitle: "Analyzing the Movements",
    image: "/assets/slides/caged_system.png", // Reusing caged for mechanical dance representation
    voiceover: "Analyze your movements under a microscope. Look at the relationship—the dance—between your fretting hand and your striking fingers."
  },
  {
    title: "Deep Sleep & Kinesthetic Knowledge",
    subtitle: "The Anatomy of Learning",
    image: "/assets/slides/brain.png",
    voiceover: "How do you improve motor skills the fastest? Sleep. Kinesthetic knowledge—body mechanics—is consolidated during deep sleep. A one-hour mindful practice followed by rest is worth four hours of frustrated noodling."
  },
  {
    title: "The Practice Nook & Binder Control",
    subtitle: "Preparing the Environment",
    image: "/assets/slides/desk.png",
    voiceover: "Create a dedicated Practice Nook. Your environment dictates your focus. Use a physical Binder to track your progress, organize your sheet music, and log your mindful repetition."
  },
  {
    title: "The Vertiscape & CAGED System",
    subtitle: "Learn Two Things at Once",
    image: "/assets/slides/vertiscales.png",
    voiceover: "You aren't just memorizing songs; you are learning the architecture of the fretboard. We use visual maps—like the CAGED system and Vertiscales—to show you how chords and scales interlock across the neck."
  },
  {
    title: "Notes → Chords → Songs",
    subtitle: "The Foundation",
    image: "/assets/slides/blues_map.png",
    voiceover: "Don't just rush to play the song. Learn the notes that make the chord, understand why the chord fits the map, and only then, build the song. Welcome to The Foundation."
  }
];

const SlideViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, slidesData.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentSlide = slidesData[currentIndex];

  const containerStyle = {
    maxWidth: '1000px',
    margin: '2rem auto',
    fontFamily: "'Inter', sans-serif"
  };

  const slideWrapperStyle = {
    position: 'relative',
    background: '#050508',
    borderRadius: '16px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    aspectRatio: '16/9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.4,
    zIndex: 0
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    padding: '3rem',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(5px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    maxWidth: '80%'
  };

  const progressStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00f0ff, #ff8a00)',
    width: `${((currentIndex + 1) / slidesData.length) * 100}%`,
    transition: 'width 0.3s ease',
    zIndex: 2
  };

  const teleprompterStyle = {
    marginTop: '2rem',
    background: '#1a1a24',
    padding: '2rem',
    borderRadius: '12px',
    borderLeft: '4px solid #00f0ff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  };

  const buttonStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '30px',
    transition: 'all 0.2s',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      {/* Slide Screen */}
      <div style={slideWrapperStyle}>
        <div style={progressStyle} />
        <img src={currentSlide.image} alt={currentSlide.title} style={imageStyle} />
        
        <div style={contentStyle}>
          <h2 style={{ fontSize: '3.5rem', color: '#fff', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
            {currentSlide.title}
          </h2>
          <p style={{ fontSize: '1.5rem', color: '#00f0ff', fontWeight: '500', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {currentSlide.subtitle}
          </p>
        </div>
        
        {/* Navigation Overlays */}
        <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '1rem', zIndex: 2 }}>
          <button onClick={prevSlide} disabled={currentIndex === 0} style={{...buttonStyle, opacity: currentIndex === 0 ? 0.3 : 1}}>
            &larr; Prev
          </button>
          <div style={{ padding: '1rem', color: '#888', fontWeight: 'bold' }}>
            {currentIndex + 1} / {slidesData.length}
          </div>
          <button onClick={nextSlide} disabled={currentIndex === slidesData.length - 1} style={{...buttonStyle, opacity: currentIndex === slidesData.length - 1 ? 0.3 : 1}}>
            Next &rarr;
          </button>
        </div>
      </div>

      {/* AI Voiceover Teleprompter */}
      <div style={teleprompterStyle}>
        <h4 style={{ color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
          AI Voiceover Script (Google Vids)
        </h4>
        <p style={{ fontSize: '1.3rem', color: '#e0e0ff', lineHeight: '1.6', fontWeight: '300' }}>
          "{currentSlide.voiceover}"
        </p>
      </div>
    </div>
  );
};

export default SlideViewer;
