import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TROUBADOUR } from '../data/adventures/troubadour';
import {
  createSession, loadAdventure, resolvePitch,
  resolveChoice, scoreSingingResponse, getSessionSummary,
} from './narrativeEngine';
import usePitchDetector from '../hooks/usePitchDetector';
import PitchGateUI from './PitchGateUI';
import { playReferenceTone } from '../audio/audioEngine';

// ═══════════════════════════════════════════════════════════
// ADVENTURE PLAYER — Narrative game mode
// Renders troubadour.js scenes as a playable pitch-gated
// branching story with the PLING! protocol:
//   Hear it → Sing it → Choose
// ═══════════════════════════════════════════════════════════

const ATMOSPHERE_COLORS = {
  'amber-dusk':      { bg: 'rgba(180,120,40,0.08)',  accent: '#c9a96e', glow: 'rgba(201,169,110,0.12)' },
  'cool-stone':      { bg: 'rgba(80,100,140,0.08)',  accent: '#7a9ab8', glow: 'rgba(122,154,184,0.10)' },
  'warm-gold':       { bg: 'rgba(200,160,80,0.10)',  accent: '#d4a855', glow: 'rgba(212,168,85,0.15)' },
  'deep-violet':     { bg: 'rgba(100,60,160,0.10)',  accent: '#9b7acc', glow: 'rgba(155,122,204,0.12)' },
  'amber-intimate':  { bg: 'rgba(180,120,40,0.12)',  accent: '#c9a96e', glow: 'rgba(201,169,110,0.18)' },
  'cool-night':      { bg: 'rgba(40,50,80,0.12)',    accent: '#6a8ab0', glow: 'rgba(106,138,176,0.10)' },
  'red-tension':     { bg: 'rgba(160,40,40,0.08)',   accent: '#cc5555', glow: 'rgba(204,85,85,0.12)' },
  'deep-gold':       { bg: 'rgba(180,140,40,0.10)',  accent: '#c9a96e', glow: 'rgba(201,169,110,0.15)' },
  'warm-firelight':  { bg: 'rgba(200,120,40,0.12)',  accent: '#d4a855', glow: 'rgba(212,168,85,0.18)' },
  'ember-warm':      { bg: 'rgba(160,80,30,0.10)',   accent: '#c98a4e', glow: 'rgba(201,138,78,0.12)' },
  'luminous-gold':   { bg: 'rgba(220,180,60,0.12)',  accent: '#e8c44a', glow: 'rgba(232,196,74,0.18)' },
};

const ACT_LABELS = { 1: 'ACT I · THE ARRIVAL', 2: 'ACT II · THE TEACHING', 3: 'ACT III · THE PERFORMANCE' };

function AdventurePlayer({ onClose }) {
  const {
    isListening, pitch, noteInfo, volume, breathState, error: micError,
    startListening, stopListening,
  } = usePitchDetector();

  const [session, setSession] = useState(() => createSession('troubadour-occitania'));
  const [scene, setScene] = useState(null);
  const [phase, setPhase] = useState('intro'); // intro | listening | gate | choose | transition | singing | ending | summary
  const [gateState, setGateState] = useState('waiting');
  const [coachingCue, setCoachingCue] = useState('');
  const [singingStart, setSingingStart] = useState(null);
  const [activeChoice, setActiveChoice] = useState(null);
  const [showArt, setShowArt] = useState(true);
  const [artError, setArtError] = useState(false);
  const [showSkipGate, setShowSkipGate] = useState(false);
  const skipTimerRef = useRef(null);

  // Load adventure on mount
  useEffect(() => {
    const { scene: firstScene, session: newSession } = loadAdventure(TROUBADOUR, session);
    setScene(firstScene);
    setSession(newSession);
    setCoachingCue(firstScene.coachingCues.onSceneEnter);
  }, []); // eslint-disable-line

  // Auto-advance from intro to listening after delay
  useEffect(() => {
    if (phase === 'intro' && scene) {
      const t = setTimeout(() => setPhase('listening'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase, scene]);

  // Pitch gate evaluation
  useEffect(() => {
    if (phase !== 'gate' || !pitch || !noteInfo || !scene) return;
    const { passed, newStreak, coachingCue: cue } = resolvePitch(scene, noteInfo.cents, session.streak);
    if (passed) {
      setGateState('passed');
      setCoachingCue(cue);
      setSession(prev => ({
        ...prev,
        streak: newStreak,
        totalPitchAttempts: prev.totalPitchAttempts + 1,
        accuratePitchCount: prev.accuratePitchCount + 1,
      }));
      setTimeout(() => setPhase('choose'), 1500);
    }
  }, [phase, pitch, noteInfo, scene]); // eslint-disable-line

  // Gate timeout — auto-advance after 15s even if pitch not found
  useEffect(() => {
    if (phase !== 'gate') return;
    // Show skip button after 8s
    skipTimerRef.current = setTimeout(() => setShowSkipGate(true), 8000);
    const t = setTimeout(() => {
      if (gateState !== 'passed') {
        setGateState('failed');
        setCoachingCue(scene?.coachingCues?.onPitchStruggle || '');
        setSession(prev => ({ ...prev, streak: 0, totalPitchAttempts: prev.totalPitchAttempts + 1 }));
        setTimeout(() => setPhase('choose'), 2000);
      }
    }, 15000);
    return () => { clearTimeout(t); clearTimeout(skipTimerRef.current); setShowSkipGate(false); };
  }, [phase, gateState, scene]);

  const handleStartGate = useCallback(() => {
    if (!isListening) startListening();
    setGateState('open');
    setShowSkipGate(false);
    setPhase('gate');
    
    // Play the reference tone so the user knows what to sing
    if (scene?.targetFreq) {
      playReferenceTone(scene.targetFreq);
    }
  }, [isListening, startListening, scene]);

  const handleSkipGate = useCallback(() => {
    setGateState('skipped');
    setShowSkipGate(false);
    setCoachingCue('No worries — you can always come back to practice this pitch later.');
    setSession(prev => ({ ...prev, streak: 0 }));
    setTimeout(() => setPhase('choose'), 1000);
  }, []);

  const handleChoice = useCallback((choice) => {
    if (choice.mode === 'sing') {
      setActiveChoice(choice);
      setSingingStart(Date.now());
      setPhase('singing');
      if (!isListening) startListening();
      return;
    }
    // Speak mode — resolve immediately
    executeChoice(choice, null);
  }, [isListening, startListening]); // eslint-disable-line

  const handleSingComplete = useCallback(() => {
    if (!activeChoice) return;
    const duration = (Date.now() - (singingStart || Date.now())) / 1000;
    const pitchAcc = session.totalPitchAttempts > 0
      ? session.accuratePitchCount / session.totalPitchAttempts : 0.5;
    const { score } = scoreSingingResponse({
      pitchAccuracy: pitchAcc,
      melodicContour: duration > 3 ? 'ascending' : 'static',
      duration,
      theme: { matched: duration > 2 },
    });
    executeChoice(activeChoice, score);
  }, [activeChoice, singingStart, session]); // eslint-disable-line

  const executeChoice = useCallback((choice, singingScore) => {
    setPhase('transition');
    const result = resolveChoice(TROUBADOUR, scene, choice, session, singingScore);

    if (result.coachingCue) setCoachingCue(result.coachingCue);

    setTimeout(() => {
      setSession(result.session);
      setScene(result.nextScene);
      setGateState('waiting');
      setActiveChoice(null);
      setArtError(false);
      setShowSkipGate(false);

      // Save progress for resume
      try {
        localStorage.setItem('voix_vive_adventure_session', JSON.stringify({
          adventureId: result.session.adventureId,
          currentSceneId: result.nextScene?.id,
          session: result.session,
          timestamp: Date.now(),
        }));
      } catch (e) { /* non-critical */ }

      if (result.nextScene?.isEnding) {
        setPhase('ending');
        setCoachingCue(result.nextScene.mentorLine);
      } else {
        setPhase('intro');
        setCoachingCue(result.nextScene?.coachingCues?.onSceneEnter || '');
      }
    }, 1200);
  }, [scene, session]);

  const handleFinish = useCallback(() => {
    setPhase('summary');
  }, []);

  if (!scene) return null;

  const atmo = ATMOSPHERE_COLORS[scene.atmosphere] || ATMOSPHERE_COLORS['amber-dusk'];
  const summary = phase === 'summary' ? getSessionSummary(session) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: '#030306', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif', color: '#e8edf2', overflow: 'hidden',
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', paddingTop: 'max(12px, env(safe-area-inset-top))',
        background: 'rgba(8,8,14,0.95)', borderBottom: `1px solid ${atmo.accent}20`,
        zIndex: 10, flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          color: '#8090a8', borderRadius: 8, fontSize: '1rem', cursor: 'pointer',
          padding: '8px 14px', fontFamily: 'JetBrains Mono, monospace',
        }}>← Exit</button>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: atmo.accent,
        }}>{ACT_LABELS[scene.act] || 'ADVENTURE'}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#5a6a80',
        }}>🔥 {session.streak}</span>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 0 100px' }}>
        <AnimatePresence mode="wait">
          {phase === 'summary' ? (
            <SummaryView key="summary" summary={summary} session={session} onClose={onClose} />
          ) : phase === 'transition' ? (
            <motion.div key="transition" initial={{ opacity: 1 }} animate={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${atmo.accent}`,
                borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            </motion.div>
          ) : (
            <motion.div key={scene.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column' }}>

              {/* Scene Art */}
              <div style={{
                width: '100%', aspectRatio: '16/9', position: 'relative',
                background: `linear-gradient(135deg, ${atmo.bg}, #030306)`, overflow: 'hidden',
              }}>
                {!artError && (
                  <img src={scene.art} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7,
                  }} onError={() => setArtError(true)} />
                )}
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(transparent 40%, #030306 100%)`,
                }} />
                {/* Interval badge */}
                <div style={{
                  position: 'absolute', top: 16, left: 16, padding: '6px 14px',
                  background: 'rgba(0,0,0,0.6)', borderRadius: 6,
                  border: `1px solid ${atmo.accent}40`,
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                    letterSpacing: '0.12em', color: atmo.accent,
                  }}>{scene.intervalName} · {scene.pitchLabel}</span>
                </div>
              </div>

              {/* Scene Content */}
              <div style={{ padding: '0 20px', maxWidth: 520, margin: '0 auto', width: '100%' }}>
                {/* Setting */}
                <p style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '1.05rem', lineHeight: 1.8,
                  color: '#d0d8e0', marginTop: -20, position: 'relative', zIndex: 2,
                }}>{scene.setting}</p>

                {/* Mentor Line */}
                <div style={{
                  padding: '16px 20px', borderRadius: 10, marginTop: 16,
                  background: `${atmo.accent}0a`, border: `1px solid ${atmo.accent}20`,
                }}>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem',
                    letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase',
                    marginBottom: 8,
                  }}>BERNARD DE VENTADORN</p>
                  <p style={{
                    fontFamily: 'EB Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic',
                    color: atmo.accent, lineHeight: 1.7, margin: 0,
                  }}>"{scene.mentorLine}"</p>
                </div>

                {/* Coaching Cue */}
                {coachingCue && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
                      color: '#5a6a80', fontStyle: 'italic', marginTop: 12, textAlign: 'center',
                    }}>— {coachingCue}</motion.p>
                )}

                {/* Phase: Listening — prompt to start gate */}
                {phase === 'listening' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 24, textAlign: 'center' }}>
                    {!isListening && (
                      <button onClick={startListening} style={{
                        padding: '12px 24px', borderRadius: 8, marginBottom: 12,
                        background: 'rgba(46,213,115,0.1)', border: '1px solid rgba(46,213,115,0.3)',
                        color: '#2ed573', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.9rem',
                      }}>🎤 Enable Microphone</button>
                    )}
                    <button onClick={handleStartGate} style={{
                      display: 'block', width: '100%', maxWidth: 300, margin: '0 auto',
                      padding: '16px 24px', borderRadius: 10,
                      background: `${atmo.accent}18`, border: `1px solid ${atmo.accent}40`,
                      color: atmo.accent, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>🎵 Find the {scene.targetNote}</button>
                  </motion.div>
                )}

                {/* Phase: Gate — PitchGateUI */}
                {phase === 'gate' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 20 }}>
                    <PitchGateUI
                      targetNote={{ name: scene.targetNote, freq: scene.targetFreq }}
                      noteInfo={noteInfo}
                      pitch={pitch}
                      breathState={breathState}
                      gateState={gateState}
                      tolerance={20}
                    />
                    {showSkipGate && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginTop: 16 }}>
                        <button onClick={handleSkipGate} style={{
                          padding: '10px 20px', borderRadius: 8,
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                          color: '#5a6a80', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.85rem',
                        }}>Skip this pitch →</button>
                        <p style={{ fontSize: '0.8rem', color: '#5a6a80', marginTop: 6, fontStyle: 'italic' }}>
                          No penalty — the story continues
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Phase: Choose */}
                {phase === 'choose' && scene.choices && scene.choices.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                      letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase',
                      textAlign: 'center', marginBottom: 4,
                    }}>YOUR RESPONSE</p>
                    {scene.choices.map(choice => (
                      <button key={choice.id} onClick={() => handleChoice(choice)} style={{
                        padding: '16px 20px', borderRadius: 10, textAlign: 'left',
                        background: choice.mode === 'sing' ? `${atmo.accent}10` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${choice.mode === 'sing' ? `${atmo.accent}35` : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                          letterSpacing: '0.1em', color: choice.mode === 'sing' ? atmo.accent : '#8090a8',
                          margin: '0 0 4px',
                        }}>{choice.label}</p>
                        <p style={{ fontSize: '1rem', color: '#8090a8', margin: 0 }}>{choice.description}</p>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Phase: Singing */}
                {phase === 'singing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginTop: 24, textAlign: 'center' }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                      background: `radial-gradient(circle, ${atmo.accent}30, transparent)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'breathe 3s ease-in-out infinite',
                    }}>
                      <span style={{ fontSize: '2rem' }}>🎵</span>
                    </div>
                    <p style={{
                      fontFamily: 'EB Garamond, serif', fontSize: '1rem', fontStyle: 'italic',
                      color: atmo.accent, marginBottom: 16,
                    }}>Sing your response...</p>
                    {isListening && pitch && (
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
                        color: '#2ed573',
                      }}>♪ {noteInfo?.name} ({Math.round(pitch)} Hz)</p>
                    )}
                    <button onClick={handleSingComplete} style={{
                      marginTop: 20, padding: '14px 28px', borderRadius: 8,
                      background: 'rgba(46,213,115,0.15)', border: '1px solid rgba(46,213,115,0.4)',
                      color: '#2ed573', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>✓ Complete Response</button>
                  </motion.div>
                )}

                {/* Phase: Ending */}
                {phase === 'ending' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 24, textAlign: 'center' }}>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                      letterSpacing: '0.2em', color: atmo.accent, textTransform: 'uppercase',
                      marginBottom: 16,
                    }}>{scene.endingType === 'commission' ? '★ THE COMMISSION' : 'THE PATRONAGE'}</p>
                    <p style={{
                      fontFamily: 'EB Garamond, serif', fontSize: '1.1rem', lineHeight: 1.7,
                      color: '#d0d8e0',
                    }}>{scene.setting}</p>
                    <button onClick={handleFinish} style={{
                      marginTop: 24, padding: '14px 28px', borderRadius: 8,
                      background: `${atmo.accent}18`, border: `1px solid ${atmo.accent}40`,
                      color: atmo.accent, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '1rem', letterSpacing: '0.1em',
                    }}>View Journey Summary</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Summary View ──
function SummaryView({ summary, session, onClose }) {
  if (!summary) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 20, padding: '40px 20px',
      }}>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
        letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase',
      }}>ADVENTURE COMPLETE</p>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem',
        fontWeight: 300, color: '#e8edf2', textAlign: 'center',
      }}>The Troubadour of Occitania</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 300 }}>
        <StatBox label="Pitch Accuracy" value={`${summary.accuracy}%`} />
        <StatBox label="Scenes" value={summary.scenesCompleted} />
        <StatBox label="Bonus Paths" value={summary.bonusBranches} />
        <StatBox label="Sung Responses" value={summary.sungResponses} />
      </div>

      {/* Impression */}
      <div style={{
        padding: '16px 20px', borderRadius: 12, maxWidth: 300, width: '100%',
        background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)',
      }}>
        <p style={{
          fontFamily: 'EB Garamond, serif', fontSize: '1rem', fontStyle: 'italic',
          color: '#c9a96e', lineHeight: 1.7, margin: 0,
        }}>"{summary.impression}"</p>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
          color: '#5a6a80', marginTop: 8, letterSpacing: '0.1em',
        }}>— BERNARD DE VENTADORN</p>
      </div>

      <button onClick={onClose} style={{
        padding: '14px 28px', borderRadius: 8, marginTop: 8,
        background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
        color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.9rem',
      }}>Return to Menu</button>
    </motion.div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{
      padding: '12px', borderRadius: 8, textAlign: 'center',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem',
        color: '#5a6a80', letterSpacing: '0.12em', marginBottom: 4,
      }}>{label}</p>
      <p style={{ fontSize: '1.1rem', color: '#e8edf2', fontWeight: 300, margin: 0 }}>{value}</p>
    </div>
  );
}

export default AdventurePlayer;
