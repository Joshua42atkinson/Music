import React, { useState, useEffect, useRef } from 'react';

const FretboardExplorer = () => {
  const [activeNote, setActiveNote] = useState(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API on mount
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playNote = (frequency) => {
    if (!audioCtxRef.current) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const oscillator = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();

    oscillator.type = 'triangle'; // Gives a slightly plucked/mellow tone
    oscillator.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

    // Simple envelope for a "pluck" sound
    gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtxRef.current.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    oscillator.start();
    oscillator.stop(audioCtxRef.current.currentTime + 1.5);
  };

  const handleNoteInteraction = (noteName, freq) => {
    setActiveNote(noteName);
    playNote(freq);
  };

  const containerStyle = {
    background: 'rgba(15, 15, 19, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '3rem',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    fontFamily: "'Outfit', sans-serif",
    color: '#fff',
    maxWidth: '900px',
    margin: '2rem auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  };

  const stringStyle = {
    height: '6px',
    background: 'linear-gradient(180deg, #888, #ccc, #666)',
    width: '100%',
    margin: '35px 0',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.6)',
    borderRadius: '3px'
  };

  const fretStyle = {
    width: '4px',
    height: '120%',
    background: 'linear-gradient(90deg, #d4af37, #b8860b, #d4af37)', // Brass fret color
    position: 'absolute',
    top: '-10%',
    zIndex: -1,
    boxShadow: '2px 0 4px rgba(0,0,0,0.5)'
  };

  const noteStyle = (isActive) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: isActive ? '#00f0ff' : 'rgba(0, 0, 0, 0.6)',
    border: isActive ? '2px solid #fff' : '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: isActive ? '0 0 20px #00f0ff, inset 0 0 10px rgba(255,255,255,0.5)' : 'none',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '800',
    color: isActive ? '#000' : 'rgba(255,255,255,0.3)',
    transform: isActive ? 'scale(1.2)' : 'scale(1)'
  });

  // Frequencies mapped approximately (just for prototype demonstration)
  const strings = [
    { name: 'E', notes: [{n:'E', f:329.63}, {n:'F', f:349.23}, {n:'F#', f:369.99}, {n:'G', f:392.00}, {n:'G#', f:415.30}] },
    { name: 'B', notes: [{n:'B', f:246.94}, {n:'C', f:261.63}, {n:'C#', f:277.18}, {n:'D', f:293.66}, {n:'D#', f:311.13}] },
    { name: 'G', notes: [{n:'G', f:196.00}, {n:'G#', f:207.65}, {n:'A', f:220.00}, {n:'A#', f:233.08}, {n:'B', f:246.94}] },
    { name: 'D', notes: [{n:'D', f:146.83}, {n:'D#', f:155.56}, {n:'E', f:164.81}, {n:'F', f:174.61}, {n:'F#', f:185.00}] },
    { name: 'A', notes: [{n:'A', f:110.00}, {n:'A#', f:116.54}, {n:'B', f:123.47}, {n:'C', f:130.81}, {n:'C#', f:138.59}] },
    { name: 'E', notes: [{n:'E', f:82.41}, {n:'F', f:87.31}, {n:'F#', f:92.50}, {n:'G', f:98.00}, {n:'G#', f:103.83}] }
  ];

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#00f0ff', fontSize: '2.5rem', letterSpacing: '-1px' }}>The Vertiscape Map</h2>
      <p style={{ textAlign: 'center', color: '#a0a0c0', marginBottom: '4rem', fontSize: '1.1rem' }}>
        Learn two things at once. Click a node to synthesize the pitch and visualize the architecture.
      </p>

      <div style={{ position: 'relative', padding: '0 40px', background: '#2c1e16', borderRadius: '8px', paddingBottom: '10px', paddingTop: '10px', border: '1px solid #4a3324', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' }}>
        {/* Frets */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', zIndex: 0, padding: '0 40px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={fretStyle} />
          ))}
        </div>

        {/* Strings */}
        {strings.map((str, i) => (
          <div key={i} style={stringStyle}>
            <span style={{ position: 'absolute', left: '-35px', color: '#e0e0e0', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 2px 4px #000' }}>{str.name}</span>
            {str.notes.map((note, j) => (
              <div 
                key={j} 
                style={noteStyle(activeNote === note.n)}
                onClick={() => handleNoteInteraction(note.n, note.f)}
              >
                {note.n}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '4rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
        <p style={{ color: activeNote ? '#00f0ff' : '#666', fontSize: '1.5rem', margin: 0, fontWeight: 'bold', transition: 'color 0.3s ease' }}>
          {activeNote ? `Playing: ${activeNote}` : 'Select a note'}
        </p>
      </div>
    </div>
  );
};

export default FretboardExplorer;
