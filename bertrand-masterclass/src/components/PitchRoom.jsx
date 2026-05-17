import React, { useState, useEffect, useRef } from 'react';

const intervals = [
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 }
];

const PitchRoom = () => {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [currentInterval, setCurrentInterval] = useState(null);
  const [options, setOptions] = useState([]);
  
  const audioCtxRef = useRef(null);

  useEffect(() => {
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

  const generateInterval = () => {
    // Pick a random base frequency between 220Hz (A3) and 440Hz (A4)
    const baseFreq = 220 * Math.pow(2, Math.random());
    
    // Pick a random interval (limit to easier ones initially or based on score, but for now completely random)
    const availableIntervals = intervals.slice(0, Math.min(3 + Math.floor(score/2), intervals.length));
    const target = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    
    // Calculate second frequency based on semitones
    const targetFreq = baseFreq * Math.pow(2, target.semitones / 12);

    setCurrentInterval({ baseFreq, targetFreq, name: target.name });

    // Generate 3 random options including the correct one
    let opts = [target];
    while(opts.length < 3) {
      const randOpt = intervals[Math.floor(Math.random() * intervals.length)];
      if(!opts.find(o => o.name === randOpt.name)) {
        opts.push(randOpt);
      }
    }
    // Shuffle
    opts.sort(() => Math.random() - 0.5);
    setOptions(opts);
    setFeedback('');
  };

  const playSynthesizedInterval = (baseFreq, targetFreq) => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

    setPlaying(true);

    const playTone = (freq, startTime, duration) => {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtxRef.current.currentTime;
    
    // Play notes sequentially (melodic interval)
    playTone(baseFreq, now, 1.0);
    playTone(targetFreq, now + 1.0, 1.0);

    setTimeout(() => {
      setPlaying(false);
    }, 2000);
  };

  const handlePlay = () => {
    if (!currentInterval) {
      generateInterval();
      // Need a slight delay to allow state update if we wanted to use the state directly, 
      // but generateInterval is async-ish with state. So we'll trigger generation and return.
      // Next click plays it. Let's fix this so the first click works:
    } else {
      playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq);
    }
  };

  // Helper effect to automatically play when a new interval is generated
  useEffect(() => {
    if (currentInterval) {
      playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq);
    }
  }, [currentInterval]);

  const handleGuess = (guessName) => {
    if (guessName === currentInterval.name) {
      setScore(s => s + 100);
      setFeedback('Excellent! Perfect pitch is teachable.');
      setTimeout(() => generateInterval(), 1500);
    } else {
      setScore(s => Math.max(0, s - 20));
      setFeedback('Not quite. Keep listening!');
      // Re-play the interval to let them hear it again
      setTimeout(() => playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq), 500);
    }
  };

  const roomStyle = {
    background: 'linear-gradient(135deg, #160a2b, #2b3a67)',
    borderRadius: '24px',
    padding: '4rem',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    textAlign: 'center',
    maxWidth: '800px',
    margin: '2rem auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  const buttonStyle = {
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    color: '#00f0ff',
    padding: '1.2rem 3rem',
    fontSize: '1.2rem',
    borderRadius: '50px',
    cursor: 'pointer',
    margin: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    boxShadow: '0 8px 32px rgba(0, 240, 255, 0.1)'
  };

  const optionStyle = {
    ...buttonStyle,
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '1rem',
    padding: '1rem 2rem',
    flex: '1 1 30%',
    minWidth: '150px'
  };

  return (
    <div style={roomStyle}>
      <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: '-webkit-linear-gradient(#fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
        The Pitch Room
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#a0a0c0' }}>
        Ear Training is a game you can win. Listen and identify the interval.
      </p>

      <div style={{ marginBottom: '3rem' }}>
        <button 
          style={{...buttonStyle, transform: playing ? 'scale(0.95)' : 'scale(1)', borderColor: playing ? '#ff8a00' : 'rgba(0, 240, 255, 0.3)', color: playing ? '#ff8a00' : '#00f0ff'}}
          onClick={handlePlay}
          disabled={playing}
        >
          {playing ? '🔊 Synthesizing...' : (!currentInterval ? '▶️ Start Challenge' : '▶️ Replay Interval')}
        </button>
      </div>

      <div style={{ 
        opacity: (!currentInterval || playing) ? 0.5 : 1, 
        pointerEvents: (!currentInterval || playing) ? 'none' : 'auto', 
        transition: 'all 0.3s ease',
        transform: (!currentInterval || playing) ? 'translateY(10px)' : 'translateY(0)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#00f0ff', fontWeight: '400', letterSpacing: '1px' }}>What did you hear?</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {options.map((opt, i) => (
            <button key={i} style={optionStyle} onClick={() => handleGuess(opt.name)}
              onMouseEnter={(e) => Object.assign(e.target.style, { background: 'rgba(0,240,255,0.1)', borderColor: '#00f0ff' })}
              onMouseLeave={(e) => Object.assign(e.target.style, { background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' })}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ 
          fontSize: '1.3rem', 
          color: feedback.includes('Excellent') ? '#2ee571' : '#ff4e50', 
          fontWeight: 'bold',
          background: feedback ? 'rgba(0,0,0,0.3)' : 'transparent',
          padding: '0.5rem 2rem',
          borderRadius: '20px'
        }}>
          {feedback}
        </p>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
        <p style={{ fontSize: '1.5rem', color: '#a0a0c0' }}>Score: <strong style={{ color: '#ff8a00', fontSize: '2rem' }}>{score}</strong></p>
      </div>
    </div>
  );
};

export default PitchRoom;
