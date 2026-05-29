import React, { useState, useEffect, useCallback } from 'react';
import { resumeAudio } from '../audio/audioEngine';
import { useScaffolding } from './ScaffoldingProvider';

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
  const { completePhase, passGate, traction } = useScaffolding();
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [currentInterval, setCurrentInterval] = useState(null);
  const [options, setOptions] = useState([]);
  const [doMarked, setDoMarked] = useState(false);
  // Audiation Pause (Edwin Gordon): mandatory silent space before vocalization
  const [audiationActive, setAudiationActive] = useState(false);
  const [audiationReady, setAudiationReady] = useState(false);
  const [audiationSeconds, setAudiationSeconds] = useState(4);

  // Determine which fret this PitchRoom session maps to
  const activeFret = (() => {
    try {
      const last = localStorage.getItem('voixvive_last_tool_fret');
      return last ? parseInt(last, 10) : 1;
    } catch { return 1; }
  })();
  const doNodeId = `fret-${activeFret}-class-do`;
  const fretState = traction?.frets?.[activeFret];
  const doAlreadyCompleted = !!fretState?.doCompleted;
  const doGatePassed = !!fretState?.doGatePassed;


  const handleMarkComplete = useCallback(() => {
    completePhase(doNodeId, 'do');
    setDoMarked(true);
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, [completePhase, doNodeId]);

  // Audiation countdown timer — single timeout, no interval restarts
  useEffect(() => {
    if (!audiationActive) return;
    const endTime = Date.now() + 4000;
    let rafId;
    const tick = () => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setAudiationActive(false);
        setAudiationReady(true);
        setAudiationSeconds(0);
        return;
      }
      setAudiationSeconds(remaining);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [audiationActive]);

  const startAudiation = useCallback(() => {
    setAudiationActive(true);
    setAudiationReady(false);
    setAudiationSeconds(4);
  }, []);

  const generateInterval = useCallback(() => {
    // Reset mark state for new challenge
    setDoMarked(false);
    // Reset audiation for new challenge
    setAudiationReady(false);
    setAudiationActive(false);
    setAudiationSeconds(4);
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
  }, [score]);

  const playSynthesizedInterval = (baseFreq, targetFreq) => {
    const ctx = resumeAudio();
    if (!ctx) return;

    setPlaying(true);

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
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
      const timer = setTimeout(() => {
        playSynthesizedInterval(currentInterval.baseFreq, currentInterval.targetFreq);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentInterval]);

  const handleGuess = (guessName) => {
    if (guessName === currentInterval.name) {
      setScore(s => s + 100);
      setFeedback('Excellent! Perfect pitch is teachable.');
      // Pass DO Somatic Gate: successful pitch match unlocks DO phase completion
      passGate(activeFret, 'do');
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
    border: '1px solid rgba(255,255,255,0.05)',
  };

  const buttonStyle = {
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    border: '1px solid rgba(90, 144, 160, 0.3)',
    color: '#5a90a0',
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
    boxShadow: '0 8px 32px rgba(90, 144, 160, 0.1)'
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

      {/* Audiation Pause (Edwin Gordon) — Silent Space before listening */}
      {!audiationReady && !audiationActive && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#7aaa88', marginBottom: '1rem', fontStyle: 'italic' }}>
            Before you listen, hear the silence. Close your eyes. Breathe.
          </p>
          <button
            style={{
              ...buttonStyle,
              borderColor: 'rgba(122,170,136,0.4)',
              color: '#7aaa88',
              fontSize: '1rem',
            }}
            onClick={startAudiation}
          >
            🧘 Begin Silent Space
          </button>
        </div>
      )}

      {audiationActive && (
        <div style={{
          marginBottom: '2rem',
          padding: '2rem',
          background: 'rgba(122,170,136,0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(122,170,136,0.2)',
        }}>
          <p style={{ fontSize: '2.5rem', color: '#7aaa88', margin: '0 0 0.5rem', fontFamily: "'Cormorant Garamond', serif" }}>
            {audiationSeconds}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#7aaa88', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Breathe in... breathe out...
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
            Imagine the interval in your mind before it plays
          </p>
        </div>
      )}

      {audiationReady && (
        <p style={{ fontSize: '0.85rem', color: '#7aaa88', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
          ✓ Silent Space complete. Ready to listen.
        </p>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <button
          style={{...buttonStyle, transform: playing ? 'scale(0.95)' : 'scale(1)', borderColor: playing ? '#c9a96e' : 'rgba(90, 144, 160, 0.3)', color: playing ? '#c9a96e' : '#5a90a0'}}
          onClick={handlePlay}
          disabled={playing || !audiationReady}
        >
          {playing ? '🔊 Synthesizing...' : (!currentInterval ? '▶️ Start Challenge' : '▶️ Replay Interval')}
        </button>
        {!audiationReady && (
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem' }}>
            Complete the Silent Space first
          </p>
        )}
      </div>

      <div style={{ 
        opacity: (!currentInterval || playing) ? 0.5 : 1, 
        pointerEvents: (!currentInterval || playing) ? 'none' : 'auto', 
        transition: 'all 0.3s ease',
        transform: (!currentInterval || playing) ? 'translateY(10px)' : 'translateY(0)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#5a90a0', fontWeight: '400', letterSpacing: '1px' }}>What did you hear?</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {options.map((opt, i) => (
            <button key={i} style={optionStyle} onClick={() => handleGuess(opt.name)}
              onMouseEnter={(e) => Object.assign(e.target.style, { background: 'rgba(90,144,160,0.1)', borderColor: '#5a90a0' })}
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
        <p style={{ fontSize: '1.5rem', color: '#a0a0c0' }}>Score: <strong style={{ color: '#c9a96e', fontSize: '2rem' }}>{score}</strong></p>
      </div>

      {/* Mark DO Phase Complete — appears after correct answer */}
      {feedback.includes('Excellent') && (
        <div style={{ marginTop: '1.5rem' }}>
          {!doGatePassed && !doAlreadyCompleted && !doMarked && (
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.05em',
            }}>
              🔒 Match the pitch to unlock marking complete
            </p>
          )}
          <button
            onClick={handleMarkComplete}
            disabled={doAlreadyCompleted || doMarked || !doGatePassed}
            style={{
              background: (doAlreadyCompleted || doMarked)
                ? 'rgba(52,211,153,0.15)'
                : doGatePassed
                  ? 'rgba(167,139,250,0.12)'
                  : 'rgba(255,255,255,0.03)',
              border: `1px solid ${(doAlreadyCompleted || doMarked)
                ? 'rgba(52,211,153,0.4)'
                : doGatePassed
                  ? 'rgba(167,139,250,0.35)'
                  : 'rgba(255,255,255,0.08)'}`,
              color: (doAlreadyCompleted || doMarked)
                ? '#34d399'
                : doGatePassed
                  ? '#a78bfa'
                  : 'rgba(255,255,255,0.2)',
              padding: '12px 28px',
              borderRadius: 8,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: (doAlreadyCompleted || doMarked || !doGatePassed) ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {(doAlreadyCompleted || doMarked)
              ? '✓ DO Phase Complete'
              : doGatePassed
                ? 'Mark DO Phase Complete'
                : '🔒 Gate Locked'}
          </button>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.25)',
            marginTop: '8px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Fret {activeFret} · Interval Training
          </p>
        </div>
      )}
    </div>
  );
};

export default PitchRoom;
