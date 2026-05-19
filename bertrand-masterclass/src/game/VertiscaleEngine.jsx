import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameFretboard from './GameFretboard';
import OrbEngine from './OrbEngine';
import PitchGateUI from './PitchGateUI';
import useFlashTimer, { FLASH_STATES } from '../hooks/useFlashTimer';
import usePitchDetector from '../hooks/usePitchDetector';
import { computePhase1Score, computePhase2Score, checkStreakEligible, computePhaseUnlock } from './scoreCalculator';
import { computeVertiscale, NOTE_NAMES } from '../data/vertiscalePatterns';
import NeckMenu from '../components/NeckMenu';

// ── Inline progress helpers (localStorage, replaces sessionLogger until tractionStore is built) ──
const VS_KEY = 'voixvive_vertiscale_progress';
function getVertiscaleProgress() {
  try { return JSON.parse(localStorage.getItem(VS_KEY) || '{}'); }
  catch { return {}; }
}
function logVertiscaleSession(data) {
  const progress = getVertiscaleProgress();
  const key = data.phase === 1 ? 'phase1Sessions' : 'phase2Sessions';
  if (!progress[key]) progress[key] = [];
  progress[key].push({ ...data, timestamp: Date.now() });
  localStorage.setItem(VS_KEY, JSON.stringify(progress));
}

// ═══════════════════════════════════════════════════════════
// VERTISCALE ENGINE — State Machine
//
// Assembles all 9 game engine pieces into a playable loop.
//
// Phase 1 (SHEARL Flash):
//   REVEAL pattern → DARK → TAP from memory → RESULT diff → score
//
// Phase 2 (PLING! Orbs):
//   Descending orbs + pitch gate → sing → tap → score
//
// Phase 3 (FHEAL Impression):
//   Session summary + journaling prompt
// ═══════════════════════════════════════════════════════════

const ENGINE_STATES = {
  MENU:     'menu',      // Key/root selection
  PHASE1:   'phase1',    // SHEARL Flash rounds
  PHASE2:   'phase2',    // PLING! Orbs
  PHASE3:   'phase3',    // FHEAL summary
  COMPLETE: 'complete',  // Session done
};

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function VertiscaleEngine({ onClose }) {
  const navigate = useNavigate();
  // ── Global state ──
  const [engineState, setEngineState] = useState(ENGINE_STATES.MENU);
  const [rootNote, setRootNote]       = useState('E');
  const [round, setRound]            = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [playerTaps, setPlayerTaps]   = useState([]);
  const [breathSamples, setBreathSamples] = useState([]);
  const [sessionLog, setSessionLog]   = useState([]);
  const [phaseUnlock, setPhaseUnlock] = useState({ phase1Unlocked: true, phase2Unlocked: true, phase3Unlocked: true });

  // ── Pitch detector ──
  const {
    isListening, pitch, noteInfo, volume, breathState, error: micError,
    startListening, stopListening,
  } = usePitchDetector();

  // ── Vertiscale pattern (with progressive difficulty) ──
  const rootIndex = ROOT_NOTES.indexOf(rootNote);
  const rawPattern = computeVertiscale({ rootIndex, tonalName: 'minor pentatonic', minFret: 0, maxFret: 7 });
  
  // Calculate current stage (1 to 4) based on round (0 to 7)
  const currentStage = Math.floor(round / 2) + 1;
  const minStringIdx = 4 - currentStage; // Stage 1: >=3, Stage 2: >=2, Stage 3: >=1, Stage 4: >=0

  // Transform per-string output into flat array GameFretboard expects
  const pattern = rawPattern
    .map((hit, stringIdx) => hit ? { stringIdx, fret: hit.fret, noteName: hit.noteName, isRoot: hit.isRoot } : null)
    .filter(hit => hit && hit.stringIdx >= minStringIdx);

  // ── Flash timer (Phase 1) ──
  const consistencyScore = roundScores.length > 0
    ? roundScores.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, roundScores.length)
    : 0;

  const {
    flashState, tapProgressPct, flashDurationMs,
    startRound: startFlash, submitTaps, reset: resetFlash,
  } = useFlashTimer({
    consistencyScore,
    onResultEnd: () => advanceRound(),
  });

  // ── Breath sampling ──
  const breathIntervalRef = useRef(null);
  useEffect(() => {
    if (isListening && (engineState === ENGINE_STATES.PHASE1 || engineState === ENGINE_STATES.PHASE2)) {
      breathIntervalRef.current = setInterval(() => {
        setBreathSamples(prev => [...prev, breathState]);
      }, 500);
    }
    return () => clearInterval(breathIntervalRef.current);
  }, [isListening, engineState, breathState]);

  // ── Load progress on mount ──
  useEffect(() => {
    // Phases are now permanently unlocked by default since gated content is still under construction.
  }, []);

  // ── Fret tap handler ──
  const handleTap = useCallback((stringIdx, fret) => {
    setPlayerTaps(prev => {
      const exists = prev.some(t => t.stringIdx === stringIdx && t.fret === fret);
      if (exists) return prev.filter(t => !(t.stringIdx === stringIdx && t.fret === fret));
      return [...prev, { stringIdx, fret }];
    });
  }, []);

  // ── Start session ──
  const startPhase = useCallback((phase) => {
    setEngineState(phase);
    setRound(0);
    setRoundScores([]);
    setSessionLog([]);
    setPlayerTaps([]);
    setBreathSamples([]);
    if (phase === ENGINE_STATES.PHASE1) {
      setTimeout(() => startFlash(), 500);
    }
  }, [startFlash]);

  // ── Advance round (Phase 1) ──
  const advanceRound = useCallback(() => {
    // Score current round
    const score = computePhase1Score({
      correctPositions: pattern,
      playerTaps,
      breathEvents: breathSamples,
      recentRoundScores: roundScores,
    });

    setRoundScores(prev => [...prev, score.composite]);
    setSessionLog(prev => [...prev, { round, ...score }]);
    setPlayerTaps([]);
    setBreathSamples([]);

    const nextRound = round + 1;
    if (nextRound >= 8) {
      // Session complete after 8 rounds
      setEngineState(ENGINE_STATES.PHASE3);
      return;
    }

    setRound(nextRound);
    setTimeout(() => startFlash(), 800);
  }, [pattern, playerTaps, breathSamples, roundScores, round, startFlash]);

  // ── Submit taps early ──
  const handleSubmit = useCallback(() => {
    if (flashState === FLASH_STATES.TAP) submitTaps();
  }, [flashState, submitTaps]);

  // ── Computed session stats ──
  const avgScore = roundScores.length > 0
    ? roundScores.reduce((a, b) => a + b, 0) / roundScores.length
    : 0;
  const streakEligible = checkStreakEligible(
    sessionLog.map(l => ({ breakdown: l.breakdown }))
  );

  return (
    <div style={{
      ...(onClose ? { position: 'fixed', inset: 0, zIndex: 200 } : { position: 'relative', minHeight: 'calc(100vh - 64px)' }),
      background: '#030306',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif', color: '#e0e0ff',
      overflow: 'hidden',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }}>
      {/* ── Top Bar ── */}
      {engineState !== ENGINE_STATES.MENU && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          background: 'rgba(8,8,14,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          zIndex: 10, flexShrink: 0,
        }}>
          {onClose ? (
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#a0aab8', borderRadius: 8, fontSize: '0.8rem',
              cursor: 'pointer', padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>← Exit</button>
          ) : (
            <button onClick={() => navigate('/')} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#a0aab8', borderRadius: 8, fontSize: '0.8rem',
              cursor: 'pointer', padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>← Home</button>
          )}

          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#c9a96e',
          }}>
            ⚡ VERTISCALE ENGINE
          </span>

          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem', color: '#5a6a80',
          }}>
            {`R${round + 1}/8`}
          </span>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: engineState === ENGINE_STATES.MENU ? 0 : '20px 16px 100px' }}>
        <AnimatePresence mode="wait">
          {engineState === ENGINE_STATES.MENU && (
            <MenuScreen
              key="menu"
              rootNote={rootNote}
              setRootNote={setRootNote}
              phaseUnlock={phaseUnlock}
              onStart={startPhase}
              micError={micError}
              isListening={isListening}
              onStartMic={startListening}
              onClose={onClose}
            />
          )}

          {engineState === ENGINE_STATES.PHASE1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Phase header */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
                  letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase',
                }}>PHASE 1 · STAGE {currentStage}/4 · {rootNote} Vertiscale</p>
                <p style={{ fontSize: '0.8rem', color: '#5a6a80', marginTop: 4 }}>
                  {currentStage === 1 && "Starting with the bass strings..."}
                  {currentStage === 2 && "Adding the G string..."}
                  {currentStage === 3 && "Adding the B string offset..."}
                  {currentStage === 4 && "Full 6-string pattern!"}
                </p>
              </div>

              {/* Flash timer bar */}
              {flashState === FLASH_STATES.TAP && (
                <div style={{
                  height: 4, background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2, marginBottom: 12, overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${tapProgressPct * 100}%` }}
                    style={{ height: '100%', background: '#c9a96e', borderRadius: 2 }}
                  />
                </div>
              )}

              {/* Game fretboard */}
              <GameFretboard
                correctPositions={pattern}
                playerTaps={playerTaps}
                flashState={flashState}
                onTap={handleTap}
                maxFret={7}
              />

              {/* Submit button */}
              {flashState === FLASH_STATES.TAP && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  style={{
                    display: 'block', width: '100%', maxWidth: 300,
                    margin: '16px auto 0', padding: '14px 24px',
                    background: 'rgba(46,213,115,0.15)',
                    border: '1px solid rgba(46,213,115,0.4)',
                    color: '#2ed573', borderRadius: 8,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  ✓ Submit ({playerTaps.length} taps)
                </motion.button>
              )}

              {/* Score display */}
              {flashState === FLASH_STATES.RESULT && roundScores.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <p style={{ fontSize: '2rem', color: '#c9a96e', fontWeight: 300 }}>
                    {Math.round(roundScores[roundScores.length - 1] * 100)}%
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#5a6a80' }}>Preparing next round...</p>
                </div>
              )}

              {/* Breath indicator */}
              {isListening && (
                <BreathIndicator breathState={breathState} volume={volume} />
              )}
            </motion.div>
          )}

          {engineState === ENGINE_STATES.PHASE2 && (
            <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', gap: 16 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#c9a96e', margin: 0 }}>Phase 2: Pling! Orbs</h2>
              <p style={{ color: '#5a6a80', fontSize: '0.9rem', textAlign: 'center', maxWidth: 300 }}>
                This gated content is currently under construction.
              </p>
              <button onClick={() => setEngineState(ENGINE_STATES.MENU)} style={{
                marginTop: 20, padding: '10px 20px', borderRadius: 8,
                background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
                color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
              }}>← Back to Menu</button>
            </motion.div>
          )}

          {engineState === ENGINE_STATES.PHASE3 && (
            <SummaryScreen
              key="phase3"
              roundScores={roundScores}
              sessionLog={sessionLog}
              rootNote={rootNote}
              avgScore={avgScore}
              streakEligible={streakEligible}
              onClose={onClose}
              onRestart={() => { resetFlash(); setEngineState(ENGINE_STATES.MENU); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════

function MenuScreen({ rootNote, setRootNote, phaseUnlock, onStart, micError, isListening, onStartMic, onClose }) {
  const mappedRoots = ROOT_NOTES.map((note, idx) => ({
    id: note,
    fret: idx + 1,
    title: `${note} Vertiscale`,
    subtitle: 'Train vertical scale patterns',
    symbol: note,
    color: '#c9a96e',
  }));

  const renderContent = (item) => (
    <div style={{ padding: '24px 16px', color: '#e0e0ff' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {!isListening ? (
          <button onClick={onStartMic} style={{
            padding: '12px 24px', borderRadius: 8,
            background: 'rgba(46,213,115,0.1)', border: '1px solid rgba(46,213,115,0.3)',
            color: '#2ed573', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
            letterSpacing: '0.05em'
          }}>🎤 Enable Microphone (optional)</button>
        ) : (
          <p style={{ fontSize: '0.75rem', color: '#2ed573' }}>🎤 Mic active — breath tracking enabled</p>
        )}
        {micError && <p style={{ fontSize: '0.7rem', color: '#ff4757', marginTop: 8 }}>{micError}</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, margin: '0 auto' }}>
        <PhaseButton
          label="PHASE 1 · SHEARL FLASH"
          desc="Evolve the pattern over 4 stages, then tap"
          unlocked={phaseUnlock.phase1Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE1)}
        />
        <PhaseButton
          label="PHASE 2 · PLING! ORBS"
          desc="Sing + tap descending note orbs"
          unlocked={phaseUnlock.phase2Unlocked}
          progress={phaseUnlock.phase1Progress}
          onClick={() => onStart(ENGINE_STATES.PHASE2)}
        />
        <PhaseButton
          label="PHASE 3 · FHEAL IMPRESSION"
          desc="Session journaling & somatic reflection"
          unlocked={phaseUnlock.phase3Unlocked}
          progress={phaseUnlock.phase2Progress}
          onClick={() => {}}
        />
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <NeckMenu
        items={mappedRoots}
        activeId={rootNote}
        onItemClick={(id) => setRootNote(id === rootNote ? null : id)}
        renderContent={renderContent}
        headerTitle="Vertiscale"
        headerSubtitle="See it. Remember it. Play it."
        showBackButton={!onClose} // Only show Home button if not embedded
      >
        {onClose && (
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
             <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#a0aab8', borderRadius: 8, fontSize: '0.8rem',
              cursor: 'pointer', padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>Close</button>
          </div>
        )}
      </NeckMenu>
    </div>
  );
}

function PhaseButton({ label, desc, unlocked, progress, onClick }) {
  return (
    <button onClick={unlocked ? onClick : undefined} style={{
      padding: '16px 20px', borderRadius: 12, textAlign: 'left',
      background: unlocked ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${unlocked ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.05)'}`,
      cursor: unlocked ? 'pointer' : 'not-allowed',
      opacity: unlocked ? 1 : 0.5,
      transition: 'all 0.2s', width: '100%',
    }}>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
        letterSpacing: '0.15em', color: unlocked ? '#c9a96e' : '#5a6a80',
        margin: '0 0 4px',
      }}>{unlocked ? '✦' : '🔒'} {label}</p>
      <p style={{ fontSize: '0.8rem', color: '#8090a8', margin: 0 }}>{desc}</p>
      {!unlocked && progress !== undefined && (
        <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{
            height: '100%', width: `${(progress || 0) * 100}%`,
            background: '#c9a96e', borderRadius: 2, transition: 'width 0.3s',
          }} />
        </div>
      )}
    </button>
  );
}

function BreathIndicator({ breathState, volume }) {
  const colors = { free: '#2ed573', shallow: '#ffab00', held: '#ff4757' };
  const labels = { free: 'Breathing freely', shallow: 'Breath shallow', held: 'Breath held' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      margin: '16px auto 0', padding: '8px 14px',
      background: `${colors[breathState]}10`,
      border: `1px solid ${colors[breathState]}30`,
      borderRadius: 8, maxWidth: 280,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: colors[breathState],
        boxShadow: `0 0 8px ${colors[breathState]}`,
      }} />
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
        color: colors[breathState], letterSpacing: '0.08em',
      }}>{labels[breathState]}</span>
      <div style={{
        flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2,
      }}>
        <div style={{
          height: '100%', width: `${Math.min(100, volume)}%`,
          background: colors[breathState], borderRadius: 2,
          transition: 'width 50ms',
        }} />
      </div>
    </div>
  );
}

function SummaryScreen({ roundScores, sessionLog, rootNote, avgScore, streakEligible, onClose, onRestart }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem',
        fontWeight: 300, color: '#e8edf2',
      }}>Session Complete</h2>

      {/* Score ring */}
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: `conic-gradient(#c9a96e ${avgScore * 360}deg, rgba(255,255,255,0.05) 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: '#030306', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '2rem', fontWeight: 300, color: '#c9a96e' }}>
            {Math.round(avgScore * 100)}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem',
            color: '#5a6a80', letterSpacing: '0.1em',
          }}>AVG SCORE</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 300 }}>
        <StatCard label="Root" value={rootNote} />
        <StatCard label="Rounds" value={roundScores.length} />
        <StatCard label="Best" value={`${Math.round(Math.max(...roundScores) * 100)}%`} />
        <StatCard label="Streak" value={streakEligible ? '✓ Yes' : 'Not yet'} />
      </div>

      {/* Round history */}
      <div style={{ width: '100%', maxWidth: 300 }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
          color: '#5a6a80', letterSpacing: '0.15em', marginBottom: 8,
        }}>ROUND HISTORY</p>
        <div style={{ display: 'flex', gap: 4 }}>
          {roundScores.map((s, i) => (
            <div key={i} style={{
              flex: 1, height: 40,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 4, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: 0, width: '100%',
                height: `${s * 100}%`,
                background: s >= 0.85 ? 'rgba(46,213,115,0.4)' : 'rgba(201,169,110,0.3)',
                borderRadius: '0 0 4px 4px',
              }} />
              <span style={{
                position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                fontSize: '0.5rem', color: '#8090a8', fontFamily: 'JetBrains Mono',
              }}>{Math.round(s * 100)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Journaling prompt */}
      <div style={{
        padding: '16px 20px', borderRadius: 12,
        background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.12)',
        width: '100%', maxWidth: 300,
      }}>
        <p style={{
          fontFamily: 'EB Garamond, serif', fontSize: '1rem',
          fontStyle: 'italic', color: '#c9a96e', lineHeight: 1.7,
        }}>
          "What did my hands remember that my mind forgot?"
        </p>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem',
          color: '#5a6a80', marginTop: 8, letterSpacing: '0.1em',
        }}>FHEAL REFLECTION PROMPT</p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 300 }}>
        <button onClick={onRestart} style={{
          flex: 1, padding: '14px', borderRadius: 8,
          background: 'rgba(201,169,110,0.12)',
          border: '1px solid rgba(201,169,110,0.3)',
          color: '#c9a96e', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
        }}>↻ Again</button>
        {onClose && (
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8090a8', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
          }}>Done</button>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      padding: '12px', borderRadius: 8,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem',
        color: '#5a6a80', letterSpacing: '0.12em', marginBottom: 4,
      }}>{label}</p>
      <p style={{ fontSize: '1.1rem', color: '#e8edf2', fontWeight: 300 }}>{value}</p>
    </div>
  );
}

export default VertiscaleEngine;
