import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameFretboard from './GameFretboard';
import OrbEngine from './OrbEngine';
import PitchGateUI from './PitchGateUI';
import useFlashTimer, { FLASH_STATES } from '../hooks/useFlashTimer';
import usePitchDetector from '../hooks/usePitchDetector';
import { computePhase1Score, computeSustainScore, computePhase2Score, checkStreakEligible, computePhaseUnlock } from './scoreCalculator';
import { computeVertiscale, NOTE_NAMES, STRING_TUNING, midiToFreq } from '../data/vertiscalePatterns';
import NeckMenu from '../components/NeckMenu';
import AdventurePlayer from './AdventurePlayer';

// ── Inline progress helpers (localStorage, replaces sessionLogger until tractionStore is built) ──
const VS_KEY = 'voixvive_vertiscale_progress';
function getVertiscaleProgress() {
  try { return JSON.parse(localStorage.getItem(VS_KEY) || '{}'); }
  catch { return {}; }
}
function logVertiscaleSession(data) {
  const progress = getVertiscaleProgress();
  const key = data.phase === 1 ? 'phase1Sessions' : data.phase === 2 ? 'phase2Sessions' : 'phase3Sessions';
  if (!progress[key]) progress[key] = [];
  progress[key].push({ ...data, mode: data.mode || 'flash', timestamp: Date.now() });
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
  MENU:      'menu',      // Key/root selection
  PHASE1:    'phase1',    // SHEARL Flash rounds
  PHASE2:    'phase2',    // PLING! Orbs
  PHASE3:    'phase3',    // FHEAL summary
  ADVENTURE: 'adventure', // Narrative adventure mode
  COMPLETE:  'complete',  // Session done
};

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function VertiscaleEngine({ onClose }) {
  const navigate = useNavigate();
  // ── Global state ──
  const [engineState, setEngineState] = useState(ENGINE_STATES.MENU);
  const [rootNote, setRootNote]       = useState('E');
  const [gameMode, setGameMode]       = useState('flash'); // 'flash' | 'imagine'
  const [round, setRound]            = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [playerTaps, setPlayerTaps]   = useState([]);
  const [breathSamples, setBreathSamples] = useState([]);
  const [sessionLog, setSessionLog]   = useState([]);
  const [phaseUnlock, setPhaseUnlock] = useState({ phase1Unlocked: true, phase2Unlocked: true, phase3Unlocked: true });
  const [holdStartTime, setHoldStartTime] = useState(null);

  // ── Pitch detector ──
  const {
    isListening, pitch, noteInfo, volume, breathState, error: micError,
    startListening, stopListening, audioCtxRef,
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
    flashState, tapProgressPct, holdProgressPct, flashDurationMs, holdDurationMs,
    startRound: startFlash, startHoldRound, submitTaps, submitHold, reset: resetFlash,
  } = useFlashTimer({
    consistencyScore,
    onResultEnd: () => advanceRound('flash'),
    onHoldComplete: () => { /* hold timer elapsed — scoring happens in advanceRound */ },
    onHoldResultEnd: () => advanceRound('imagine'),
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
  const startPhase = useCallback((phase, mode) => {
    if (mode) setGameMode(mode);
    setEngineState(phase);
    setRound(0);
    setRoundScores([]);
    setSessionLog([]);
    setPlayerTaps([]);
    setBreathSamples([]);
    if (phase === ENGINE_STATES.PHASE1) {
      const useMode = mode || gameMode;
      if (useMode === 'imagine') {
        setTimeout(() => startHoldRound(), 500);
      } else {
        setTimeout(() => startFlash(), 500);
      }
    }
  }, [startFlash, startHoldRound, gameMode]);

  // ── Advance round ──
  const advanceRound = useCallback((mode) => {
    const currentMode = mode || gameMode;
    let score;
    if (currentMode === 'imagine') {
      const holdRatio = holdProgressPct;
      score = computeSustainScore({
        correctPositions: pattern,
        playerTaps,
        holdRatio,
        breathEvents: breathSamples,
        recentRoundScores: roundScores,
      });
    } else {
      score = computePhase1Score({
        correctPositions: pattern,
        playerTaps,
        breathEvents: breathSamples,
        recentRoundScores: roundScores,
      });
    }

    setRoundScores(prev => [...prev, score.composite]);
    setSessionLog(prev => [...prev, { round, mode: currentMode, ...score }]);
    setPlayerTaps([]);
    setBreathSamples([]);

    const nextRound = round + 1;
    if (nextRound >= 8) {
      setEngineState(ENGINE_STATES.PHASE3);
      return;
    }

    setRound(nextRound);
    if (currentMode === 'imagine') {
      setTimeout(() => startHoldRound(), 800);
    } else {
      setTimeout(() => startFlash(), 800);
    }
  }, [gameMode, pattern, playerTaps, breathSamples, roundScores, round, startFlash, startHoldRound, holdProgressPct]);

  // ── Submit taps early ──
  const handleSubmit = useCallback(() => {
    if (flashState === FLASH_STATES.TAP) submitTaps();
    if (flashState === FLASH_STATES.HOLD) submitHold();
  }, [flashState, submitTaps, submitHold]);

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
      {engineState !== ENGINE_STATES.MENU && engineState !== ENGINE_STATES.ADVENTURE && (
        <div style={{ flexShrink: 0, zIndex: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            background: 'rgba(8,8,14,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
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

          {/* XP Progress Bar */}
          {roundScores.length > 0 && (
            <div style={{
              height: 3, background: 'rgba(255,255,255,0.03)',
              position: 'relative', overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${avgScore * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: avgScore >= 0.85
                    ? 'linear-gradient(90deg, #2ed573, #7aff9a)'
                    : avgScore >= 0.5
                      ? 'linear-gradient(90deg, #c9a96e, #e8c84a)'
                      : 'linear-gradient(90deg, #cc5555, #c9a96e)',
                  boxShadow: `0 0 8px ${avgScore >= 0.85 ? 'rgba(46,213,115,0.4)' : 'rgba(201,169,110,0.3)'}`,
                  borderRadius: '0 2px 2px 0',
                }}
              />
            </div>
          )}
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
                }}>{gameMode === 'imagine' ? '🫁 IMAGINE' : '⚡ FLASH'} · STAGE {currentStage}/4 · {rootNote} Vertiscale</p>
                <p style={{ fontSize: '0.8rem', color: '#5a6a80', marginTop: 4 }}>
                  {gameMode === 'imagine'
                    ? (flashState === FLASH_STATES.REVEAL ? 'Study the pattern...' :
                       flashState === FLASH_STATES.HOLD ? 'Hold your placement. Breathe.' :
                       'Verifying your inner fretboard...')
                    : (currentStage === 1 ? 'Starting with the bass strings...' :
                       currentStage === 2 ? 'Adding the G string...' :
                       currentStage === 3 ? 'Adding the B string offset...' :
                       'Full 6-string pattern!')}
                </p>
              </div>

              {/* Timer bar — flash mode shows countdown, imagine mode shows hold progress */}
              {flashState === FLASH_STATES.TAP && (
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <motion.div initial={{ width: '100%' }} animate={{ width: `${tapProgressPct * 100}%` }} style={{ height: '100%', background: '#c9a96e', borderRadius: 2 }} />
                </div>
              )}
              {flashState === FLASH_STATES.HOLD && (
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${holdProgressPct * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #2ed573, #c9a96e)', borderRadius: 2, transition: 'width 100ms linear' }} />
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${round}-${currentStage}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GameFretboard
                    correctPositions={pattern}
                    playerTaps={playerTaps}
                    flashState={flashState}
                    onTap={handleTap}
                    maxFret={7}
                    holdProgressPct={holdProgressPct}
                    breathState={breathState}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Submit button — works for both TAP and HOLD */}
              {(flashState === FLASH_STATES.TAP || flashState === FLASH_STATES.HOLD) && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  style={{
                    display: 'block', width: '100%', maxWidth: 300,
                    margin: '16px auto 0', padding: '14px 24px',
                    background: flashState === FLASH_STATES.HOLD ? 'rgba(46,213,115,0.1)' : 'rgba(46,213,115,0.15)',
                    border: '1px solid rgba(46,213,115,0.4)',
                    color: '#2ed573', borderRadius: 8,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  {flashState === FLASH_STATES.HOLD ? `🫁 Release (${playerTaps.length} placed)` : `✓ Submit (${playerTaps.length} taps)`}
                </motion.button>
              )}

              {/* Score display — both modes */}
              {(flashState === FLASH_STATES.RESULT || flashState === FLASH_STATES.HOLD_RESULT) && roundScores.length > 0 && (
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
            <Phase2Screen
              key="phase2"
              pattern={pattern}
              rootNote={rootNote}
              pitch={pitch}
              noteInfo={noteInfo}
              breathState={breathState}
              isListening={isListening}
              audioCtxRef={audioCtxRef}
              onSessionLog={(entry) => setSessionLog(prev => [...prev, entry])}
              onComplete={(orbScores) => {
                setRoundScores(orbScores);
                setEngineState(ENGINE_STATES.PHASE3);
              }}
              onBack={() => setEngineState(ENGINE_STATES.MENU)}
            />
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

          {engineState === ENGINE_STATES.ADVENTURE && (
            <AdventurePlayer
              key="adventure"
              onClose={() => setEngineState(ENGINE_STATES.MENU)}
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
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase', margin: '0 0 4px' }}>THE INNER FRETBOARD</p>
        <PhaseButton
          label="⚡ FLASH · Quick Recall"
          desc="See it → lose it → recreate from imagination"
          unlocked={phaseUnlock.phase1Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE1, 'flash')}
        />
        <PhaseButton
          label="🫁 IMAGINE · Sustained Hold"
          desc="Study it → hold placement → breathe into it"
          unlocked={phaseUnlock.phase1Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE1, 'imagine')}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase', margin: '12px 0 4px' }}>THE INNER EAR</p>
        <PhaseButton
          label="🎵 AUDIATE · Pling! Orbs"
          desc="Hear the note inside, sing it, verify on the fretboard"
          unlocked={phaseUnlock.phase2Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE2)}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase', margin: '12px 0 4px' }}>THE INNER VOICE</p>
        <PhaseButton
          label="📝 REFLECT · Session Journal"
          desc="What did your hands remember that your mind forgot?"
          unlocked={phaseUnlock.phase3Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE3)}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase', margin: '12px 0 4px' }}>THE LIVING STORY</p>
        <PhaseButton
          label="🏰 ADVENTURE · The Troubadour"
          desc="Eleanor's court, Poitiers, 1165 CE — a pitch-gated narrative"
          unlocked={true}
          onClick={() => onStart(ENGINE_STATES.ADVENTURE)}
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
        headerSubtitle="Train the imagination. The fingers follow."
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

// ── Phase 2 Screen — PLING! Orbs ──
function Phase2Screen({ pattern, rootNote, pitch, noteInfo, breathState, isListening, audioCtxRef, onSessionLog, onComplete, onBack }) {
  const [orbActive, setOrbActive] = React.useState(false);
  const [orbScores, setOrbScores] = React.useState([]);
  const [currentTarget, setCurrentTarget] = React.useState(null);
  const [gateState, setGateState] = React.useState('waiting');

  // Transform pattern array into orbSequence format for OrbEngine
  const orbSequence = React.useMemo(() => {
    return pattern.map(p => {
      const midi = STRING_TUNING[p.stringIdx].midiBase + p.fret;
      return {
        note: { name: p.noteName, midi, freq: midiToFreq(midi) },
        stringIdx: p.stringIdx,
        fret: p.fret,
      };
    });
  }, [pattern]);

  // Auto-start orbs after a brief delay
  React.useEffect(() => {
    const timer = setTimeout(() => setOrbActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Complete session when all orbs are processed
  React.useEffect(() => {
    if (orbScores.length > 0 && orbScores.length >= orbSequence.length) {
      setOrbActive(false);
      setTimeout(() => onComplete(orbScores.map(o => o.composite || 0)), 1500);
    }
  }, [orbScores, orbSequence.length, onComplete]);

  return (
    <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
          letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase',
        }}>🎵 THE INNER EAR · {rootNote} Vertiscale</p>
        <p style={{ fontSize: '0.8rem', color: '#5a6a80', marginTop: 4 }}>
          Hear the note inside before you sing it. Audiate, then verify.
        </p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#5a6a80', marginTop: 8 }}>
          {orbScores.length}/{orbSequence.length} notes completed
        </p>
      </div>

      <OrbEngine
        orbSequence={orbSequence}
        difficulty="awakening"
        pitch={pitch}
        noteInfo={noteInfo}
        breathState={breathState}
        active={orbActive}
        audioCtxRef={audioCtxRef}
        onGateOpen={(orbId, targetNote) => {
          setCurrentTarget(targetNote);
          setGateState('open');
        }}
        onGateResult={(orbId, result, centsDev) => {
          setGateState(result);
        }}
        onOrbTap={(orbId, result) => {
          const score = computePhase2Score({
            correctPositions: [{ stringIdx: result.stringIdx, fret: result.fret }],
            playerTaps: result.correct ? [{ stringIdx: result.stringIdx, fret: result.fret }] : [],
            centsDev: result.centsDev,
            pitchTolerance: 35,
            breathEvents: [breathState],
            recentRoundScores: orbScores.map(s => s.composite),
          });
          setOrbScores(prev => [...prev, score]);
          onSessionLog({ phase: 2, ...score, orbId });
          setGateState('waiting');
          setCurrentTarget(null);
        }}
        onOrbMiss={(orbId) => {
          const missScore = { composite: 0, breakdown: { placement: 0, pitch: 0, breath: 0, consistency: 0 } };
          setOrbScores(prev => [...prev, missScore]);
          onSessionLog({ phase: 2, ...missScore, orbId, missed: true });
          setGateState('waiting');
          setCurrentTarget(null);
        }}
      />

      {isListening && (
        <PitchGateUI
          targetNote={currentTarget || { name: rootNote }}
          noteInfo={noteInfo}
          pitch={pitch}
          breathState={breathState}
          gateState={gateState}
          tolerance={35}
        />
      )}

      {/* Score tally */}
      {orbScores.length > 0 && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {orbScores.map((s, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.composite >= 0.7 ? 'rgba(46,213,115,0.2)' : s.composite > 0 ? 'rgba(201,169,110,0.15)' : 'rgba(255,71,87,0.15)',
              border: `1px solid ${s.composite >= 0.7 ? 'rgba(46,213,115,0.4)' : s.composite > 0 ? 'rgba(201,169,110,0.3)' : 'rgba(255,71,87,0.3)'}`,
              fontSize: '0.5rem', fontFamily: 'JetBrains Mono', color: '#e0e0ff',
            }}>
              {Math.round(s.composite * 100)}
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} style={{
        marginTop: 12, padding: '10px 20px', borderRadius: 8, alignSelf: 'center',
        background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
        color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
      }}>← Back to Menu</button>
    </motion.div>
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
  const [journal, setJournal] = React.useState('');
  const journalKey = `voixvive_journal_${Date.now()}`;

  // Dynamic coaching cue based on performance
  const getCoachingCue = () => {
    const avgPlacement = sessionLog.reduce((sum, l) => sum + (l.breakdown?.placement || 0), 0) / Math.max(1, sessionLog.length);
    const avgBreath = sessionLog.reduce((sum, l) => sum + (l.breakdown?.breath || 0), 0) / Math.max(1, sessionLog.length);
    if (avgPlacement < 0.4) return { text: 'Feel the wood under your fingers. Where is the tension?', focus: 'placement' };
    if (avgBreath < 0.3) return { text: 'Follow the breath. The music lives in the exhale.', focus: 'breath' };
    if (avgScore > 0.8) return { text: 'You are finding your voice. What story did your hands tell?', focus: 'mastery' };
    if (avgScore > 0.5) return { text: 'The pattern is becoming yours. Can you see it with your eyes closed?', focus: 'imagination' };
    return { text: 'Every attempt is a note. The song is longer than one session.', focus: 'persistence' };
  };
  const coaching = getCoachingCue();

  const saveJournal = () => {
    if (!journal.trim()) return;
    const entries = JSON.parse(localStorage.getItem('voixvive_journals') || '[]');
    entries.push({ rootNote, avgScore, text: journal, coaching: coaching.text, timestamp: Date.now() });
    localStorage.setItem('voixvive_journals', JSON.stringify(entries));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase' }}>THE INNER VOICE</p>

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
        <StatCard label="Best" value={`${Math.round(Math.max(...(roundScores.length ? roundScores : [0])) * 100)}%`} />
        <StatCard label="Streak" value={streakEligible ? '✓ Yes' : 'Not yet'} />
      </div>

      {/* Round history */}
      {roundScores.length > 0 && (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#5a6a80', letterSpacing: '0.15em', marginBottom: 8 }}>ROUND HISTORY</p>
          <div style={{ display: 'flex', gap: 4 }}>
            {roundScores.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${s * 100}%`, background: s >= 0.85 ? 'rgba(46,213,115,0.4)' : 'rgba(201,169,110,0.3)', borderRadius: '0 0 4px 4px' }} />
                <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', fontSize: '0.5rem', color: '#8090a8', fontFamily: 'JetBrains Mono' }}>{Math.round(s * 100)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching cue */}
      <div style={{
        padding: '16px 20px', borderRadius: 12,
        background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)',
        width: '100%', maxWidth: 300,
      }}>
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', fontStyle: 'italic', color: '#c9a96e', lineHeight: 1.7 }}>
          "{coaching.text}"
        </p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#5a6a80', marginTop: 8, letterSpacing: '0.1em' }}>
          — BERTRAND · {coaching.focus.toUpperCase()}
        </p>
      </div>

      {/* Journal textarea */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#5a6a80', marginBottom: 12, textAlign: 'center' }}>FHEAL REFLECTION</p>
        <div style={{ position: 'relative' }}>
          <textarea
            className="fheal-textarea"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="What did your hands remember that your mind forgot?&#10;Where was the gap between imagination and reality?&#10;What surprised you?"
            style={{
              width: '100%', minHeight: 120, padding: 16, borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8edf2', fontFamily: 'EB Garamond, serif', fontSize: '1.05rem',
              lineHeight: 1.8, resize: 'vertical', outline: 'none', transition: 'all 0.3s ease',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
            }}
          />
          <style>{`
            .fheal-textarea::placeholder {
              color: #5a6a80;
              font-style: italic;
              opacity: 0.7;
            }
            .fheal-textarea:focus {
              background: rgba(255,255,255,0.04) !important;
              border-color: rgba(201,169,110,0.4) !important;
              box-shadow: inset 0 2px 10px rgba(0,0,0,0.2), 0 0 15px rgba(201,169,110,0.15) !important;
            }
          `}</style>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 320, marginTop: 8 }}>
        <button onClick={() => { saveJournal(); onRestart(); }} style={{
          flex: 1, padding: '14px', borderRadius: 8,
          background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
          color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
        }}>↻ Again</button>
        {onClose && (
          <button onClick={() => { saveJournal(); onClose(); }} style={{
            flex: 1, padding: '14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#8090a8', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
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
