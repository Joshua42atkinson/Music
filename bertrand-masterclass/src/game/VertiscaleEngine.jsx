import React, { useState, useCallback, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameFretboard from './GameFretboard';
import OrbEngine from './OrbEngine';
import PitchGateUI from './PitchGateUI';
import useFlashTimer, { FLASH_STATES } from '../hooks/useFlashTimer';
import usePitchDetector from '../hooks/usePitchDetector';
import { computePhase1Score, computeSustainScore, computePhase2Score, checkStreakEligible, computePhaseUnlock } from './scoreCalculator';
import { computeVertiscale, NOTE_NAMES, STRING_TUNING, midiToFreq, VERTISCALE_PATTERNS } from '../data/vertiscalePatterns';
import NeckMenu from '../components/NeckMenu';
import AdventurePlayer from './AdventurePlayer';
import Glossary from '../components/Glossary';
import { getVertiscaleProgress, logVertiscaleSession } from './sessionLogger';
import BiometricSanctum from '../components/BiometricSanctum';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { db } from '../data/localDatabase';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// VERTISCALE ENGINE — State Machine
//
// Assembles all 9 game engine pieces into a playable loop.
//
// Phase 1 (SHEARL Flash):
//   REVEAL pattern → DARK → TAP from imagination → RESULT diff → score
//
// Phase 2 (PLING! Orbs):
//   Descending orbs + pitch gate → sing → tap → score
//
// Phase 3 (FHEAL Impression):
//   Session summary + journaling prompt
// ═══════════════════════════════════════════════════════════

const ENGINE_STATES = {
  MENU:      'menu',      // Key/root selection
  BE_STEP:   'be_step',   // BE > DO > HAVE — breath intention before Phase 1
  PHASE1:    'phase1',    // SHEARL Flash rounds
  PHASE2:    'phase2',    // PLING! Orbs
  PHASE3:    'phase3',    // FHEAL summary
  ADVENTURE: 'adventure', // Narrative adventure mode
  COMPLETE:  'complete',  // Session done
};

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function VertiscaleEngine({ onClose }) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();

  // ── Global state ──
  const [engineState, setEngineState] = useState(ENGINE_STATES.MENU);
  const [rootNote, setRootNote]       = useState('E');
  const [gameMode, setGameMode]       = useState('flash');
  const [scaleType, setScaleType]     = useState('minor pentatonic'); // tonalName from vertiscalePatterns
  const [difficulty, setDifficulty]   = useState('beginner'); // 'beginner' | 'standard' | 'challenge'
  const [round, setRound]            = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [playerTaps, setPlayerTaps]   = useState([]);
  const [breathSamples, setBreathSamples] = useState([]);
  const [sessionLog, setSessionLog]   = useState([]);
  const [phaseUnlock] = useState(() => {
    try {
      const progress = getVertiscaleProgress();
      if (progress && (progress.phase1Sessions || progress.phase2Sessions)) {
        return computePhaseUnlock(progress);
      }
    } catch (e) {
      console.warn('[VertiscaleEngine] Could not load progress:', e);
    }
    return { phase1Unlocked: true, phase2Unlocked: true, phase3Unlocked: true };
  });

  
  // Calculate current stage (1 to 4) based on round (0 to 7)
  const currentStage = Math.floor(round / 2) + 1;

  // ── Biometric and Backend states ──
  useBackendBridge(); // DaaS connection maintained for desktop app sync
  const [activeBiometrics, setActiveBiometrics] = useState(null);
  const [biometricsHistory, setBiometricsHistory] = useState([]);
  const [centsDeviations, setCentsDeviations] = useState([]);

  // ── Unified Session Completion & Persistence ──
  const handleSessionComplete = useCallback(async (scores, logs) => {
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    const avgHrv = biometricsHistory.length > 0
      ? Math.round(biometricsHistory.reduce((sum, b) => sum + b.hrv, 0) / biometricsHistory.length)
      : (activeBiometrics ? Math.round(activeBiometrics.hrv) : 85);
      
    const avgStress = biometricsHistory.length > 0
      ? biometricsHistory.reduce((sum, b) => sum + b.stressLevel, 0) / biometricsHistory.length
      : (activeBiometrics ? activeBiometrics.stressLevel : 0.12);

    const avgFlow = biometricsHistory.length > 0
      ? biometricsHistory.reduce((sum, b) => sum + b.flowIndex, 0) / biometricsHistory.length
      : (activeBiometrics ? activeBiometrics.flowIndex : 1.5);

    const deviations = centsDeviations.length > 0 ? centsDeviations : [0];

    // ── Log session to tractionStore + Dexie via sessionLogger ──
    const phase = engineState === ENGINE_STATES.PHASE1 ? 1 : 2;
    try {
      await logVertiscaleSession({
        phase,
        patternId: scaleType,
        rounds: logs || scores.map(composite => ({
          composite,
          breakdown: { placement: composite, breath: 1 - avgStress, pitch: composite },
        })),
      });
    } catch (e) {
      console.warn('[VertiscaleEngine] sessionLogger failed:', e);
    }

    setRoundScores(scores);
    if (logs) setSessionLog(logs);
    setEngineState(ENGINE_STATES.PHASE3);
  }, [engineState, scaleType, biometricsHistory, centsDeviations, activeBiometrics]);

  // ── Pitch detector ──
  const {
    isListening, pitch, noteInfo, volume, breathState, error: micError,
    startListening, audioCtxRef,
  } = usePitchDetector();

  // ── Vertiscale pattern (with progressive difficulty) ──
  const rootIndex = rootNote ? ROOT_NOTES.indexOf(rootNote) : 0;
  const activePattern = VERTISCALE_PATTERNS.find(p => p.tonalName === scaleType && p.rootIndex === Math.max(0, rootIndex));
  const maxFret = activePattern?.maxFret || 7;
  const rawPattern = computeVertiscale({ rootIndex: Math.max(0, rootIndex), tonalName: scaleType, minFret: activePattern?.minFret || 0, maxFret });
  
  // minStringIdx calculation (currentStage is declared at the top of the component)
  const minStringIdx = 4 - currentStage; // Stage 1: >=3, Stage 2: >=2, Stage 3: >=1, Stage 4: >=0

  // Transform per-string output into flat array GameFretboard expects
  const pattern = rawPattern
    .map((hit, stringIdx) => hit ? { stringIdx, fret: hit.fret, noteName: hit.noteName, isRoot: hit.isRoot } : null)
    .filter(hit => hit && hit.stringIdx >= minStringIdx);

  // ── Flash timer (Phase 1) ──
  // Difficulty multiplier: beginner = 0.0, standard = 0.4, challenge = 0.8
  const difficultyMultiplier = difficulty === 'challenge' ? 0.8 : difficulty === 'standard' ? 0.4 : 0.0;
  const consistencyScore = roundScores.length > 0
    ? Math.max(difficultyMultiplier, roundScores.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, roundScores.length))
    : difficultyMultiplier;

  const {
    flashState, tapProgressPct, holdProgressPct,
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



  // ── Fret tap handler ──
  const handleTap = useCallback((stringIdx, fret) => {
    setPlayerTaps(prev => {
      const exists = prev.some(t => t.stringIdx === stringIdx && t.fret === fret);
      if (exists) return prev.filter(t => !(t.stringIdx === stringIdx && t.fret === fret));
      return [...prev, { stringIdx, fret }];
    });
  }, []);

  const startPhase = useCallback((phase, mode) => {
    if (mode) setGameMode(mode);
    setRound(0);
    setRoundScores([]);
    setSessionLog([]);
    setPlayerTaps([]);
    setBreathSamples([]);
    // Route Phase 1 through the BE_STEP breath screen first
    if (phase === ENGINE_STATES.PHASE1) {
      setEngineState(ENGINE_STATES.BE_STEP);
    } else {
      setEngineState(phase);
    }
  }, [gameMode]);

  const proceedFromBeStep = useCallback(() => {
    setEngineState(ENGINE_STATES.PHASE1);
    const useMode = gameMode;
    if (useMode === 'imagine') {
      setTimeout(() => startHoldRound(), 500);
    } else {
      setTimeout(() => startFlash(), 500);
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

    // Accumulate biometrics and cents deviations
    if (activeBiometrics) {
      setBiometricsHistory(prev => [...prev, {
        hrv: activeBiometrics.hrv,
        stressLevel: activeBiometrics.stressLevel,
        flowIndex: activeBiometrics.flowIndex,
      }]);
    }
    if (noteInfo?.cents !== undefined) {
      setCentsDeviations(prev => [...prev, noteInfo.cents]);
    }

    const newScores = [...roundScores, score.composite];
    const newLogs = [...sessionLog, { round, mode: currentMode, ...score }];

    setRoundScores(newScores);
    setSessionLog(newLogs);
    setPlayerTaps([]);
    setBreathSamples([]);

    const nextRound = round + 1;
    if (nextRound >= 8) {
      handleSessionComplete(newScores, newLogs);
      return;
    }

    setRound(nextRound);
    if (currentMode === 'imagine') {
      setTimeout(() => startHoldRound(), 800);
    } else {
      setTimeout(() => startFlash(), 800);
    }
  }, [gameMode, pattern, playerTaps, breathSamples, roundScores, round, startFlash, startHoldRound, holdProgressPct, activeBiometrics, noteInfo, handleSessionComplete, sessionLog]);

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
      fontFamily: 'Inter, sans-serif', color: '#e8edf2',
      overflow: 'hidden',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }}>
      {/* ── Top Bar ── */}
      {engineState !== ENGINE_STATES.MENU && engineState !== ENGINE_STATES.ADVENTURE && engineState !== ENGINE_STATES.BE_STEP && (
        <div style={{ flexShrink: 0, zIndex: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            background: 'rgba(8,8,14,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: '52px' }}>
              <button onClick={() => navigate(-1)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                color: '#8090a8', borderRadius: 8, fontSize: '0.9rem',
                cursor: 'pointer', padding: '10px 16px',
                fontFamily: 'JetBrains Mono, monospace',
                display: 'flex', alignItems: 'center', gap: 6,
              }}><ArrowLeft size={16} /> {t('ve_back')}</button>
              {onClose ? (
                <button onClick={onClose} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#8090a8', borderRadius: 8, fontSize: '0.9rem',
                  cursor: 'pointer', padding: '10px 16px',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>{t('ve_exit')}</button>
              ) : (
                <button onClick={() => navigate('/')} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#8090a8', borderRadius: 8, fontSize: '0.9rem',
                  cursor: 'pointer', padding: '10px 16px',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>{t('ve_home')}</button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: '#c9a96e',
              }}>
                ⚡ VERTISCALE ENGINE
              </span>
              
              {activeBiometrics && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(201, 169, 110, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  padding: '4px 10px', borderRadius: '12px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem'
                }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#ff4757', animation: 'breath 2s infinite' }} />
                  <span style={{ color: '#c9a96e' }}>🫁 FLOW: {(activeBiometrics.flowIndex || 0).toFixed(2)}</span>
                  <span style={{ color: '#5a6a80' }}>|</span>
                  <span style={{ color: '#ff6a88' }}>HRV: {Math.round(activeBiometrics.hrv || 0)} ms</span>
                </div>
              )}
            </div>

            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.85rem', color: '#5a6a80',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {`R${round + 1}/8`}
              <Glossary />
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
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              scaleType={scaleType}
              setScaleType={setScaleType}
            />
          )}

          {engineState === ENGINE_STATES.PHASE1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Phase header */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                  letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase',
                }}>{gameMode === 'imagine' ? (locale === 'fr' ? '🪁 IMAGINATION' : '🪁 IMAGINE') : '⚡ FLASH'} · {t('ve_stage')} {currentStage}/4 · {locale === 'fr' ? `Vertiscale de ${rootNote}` : `${rootNote} Vertiscale`}</p>
                <p style={{ fontSize: '1rem', color: '#8090a8', marginTop: 8, lineHeight: 1.6 }}>
                  {gameMode === 'imagine'
                    ? (flashState === FLASH_STATES.REVEAL 
                        ? t('ve_studyGoldDots')
                        : flashState === FLASH_STATES.HOLD 
                          ? (() => {
                              const holdCues = locale === 'fr' ? [
                                'Maintenez vos pressions et respirez calmement.',
                                'Suivez la forme des yeux — observez la géométrie.',
                                'Fermez les yeux un instant — voyez-vous encore le motif ?',
                                'Ressentez où vos doigts se poseraient sur une vraie touche.',
                                'Inspirez par le nez, expirez par la bouche.',
                                'Imaginez entendre chaque note, de la plus grave à la plus aiguë.',
                              ] : [
                                'Hold your taps in place and breathe steadily.',
                                'Trace the shape with your eyes — see the geometry.',
                                'Close your eyes for a moment — can you still see the pattern?',
                                'Feel where your fingers would go on a real fretboard.',
                                'Breathe in through the nose, out through the mouth.',
                                'Imagine hearing each note, from low string to high.',
                              ];
                              const idx = round % holdCues.length;
                              return holdCues[idx];
                            })()
                          : t('ve_checkingAccuracy'))
                    : (flashState === FLASH_STATES.REVEAL
                        ? t('ve_studyPattern')
                        : flashState === FLASH_STATES.DARK
                          ? t('ve_patternVanished')
                          : flashState === FLASH_STATES.TAP
                            ? t('ve_tapNotes')
                            : locale === 'fr' 
                              ? (currentStage === 1 ? `Manche ${round+1} : Concentrez-vous sur les 2 cordes du bas. Un motif va clignoter — absorbez-le !` :
                                 currentStage === 2 ? `Manche ${round+1} : Maintenant avec 3 cordes. Le motif s'agrandit !` :
                                 currentStage === 3 ? `Manche ${round+1} : 4 cordes maintenant — attention au décalage de la corde de Si !` :
                                 `Manche ${round+1} : Motif complet sur 6 cordes — vous pouvez le faire !`)
                              : (currentStage === 1 ? `Round ${round+1}: Focus on the bottom 2 strings. A pattern will flash — absorb it!` :
                                 currentStage === 2 ? `Round ${round+1}: Now including 3 strings. The pattern is growing!` :
                                 currentStage === 3 ? `Round ${round+1}: 4 strings now — watch for the B string offset!` :
                                 `Round ${round+1}: Full 6-string pattern — you've got this!`))}
                </p>
              </div>

              {/* First-round tutorial overlay */}
              {round === 0 && flashState === FLASH_STATES.REVEAL && (
                <div style={{
                  background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)',
                  borderRadius: 12, padding: '14px 18px', marginBottom: 14, lineHeight: 1.7,
                }}>
                  <p style={{ fontSize: '0.85rem', color: '#c9a96e', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {t('ve_howToPlay')}
                  </p>
                  <p style={{ fontSize: '1rem', color: '#d0d8e0', marginBottom: 6 }}>
                    {gameMode === 'imagine'
                      ? t('ve_howToPlayImagine')
                      : t('ve_howToPlayFlash')}
                  </p>
                </div>
              )}

              {/* Hold progress — imagine mode only. TAP has no timer (student-paced). */}
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
                    maxFret={maxFret}
                    holdProgressPct={holdProgressPct}
                    breathState={breathState}
                    detectedNoteName={noteInfo?.name || null}
                    cents={noteInfo?.cents || 0}
                    pitch={pitch || 0}
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
                    margin: '16px auto 0', padding: '16px 24px',
                    background: flashState === FLASH_STATES.HOLD ? 'rgba(46,213,115,0.1)' : 'rgba(46,213,115,0.15)',
                    border: '1px solid rgba(46,213,115,0.4)',
                    color: '#2ed573', borderRadius: 8,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  {flashState === FLASH_STATES.HOLD 
                    ? (locale === 'fr' ? `🫁 Relâcher (${playerTaps.length} placés)` : `🫁 Release (${playerTaps.length} placed)`)
                    : (locale === 'fr' ? `✓ Soumettre (${playerTaps.length} taps)` : `✓ Submit (${playerTaps.length} taps)`)}
                </motion.button>
              )}

              {/* Score display — both modes */}
              {(flashState === FLASH_STATES.RESULT || flashState === FLASH_STATES.HOLD_RESULT) && roundScores.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <p style={{ fontSize: '2.2rem', color: '#c9a96e', fontWeight: 300 }}>
                    {Math.round(roundScores[roundScores.length - 1] * 100)}%
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#5a6a80' }}>
                    {t('ve_preparingRound')}
                  </p>
                </div>
              )}

              {/* Breath indicator */}
              {isListening && (
                <BreathIndicator breathState={breathState} volume={volume} />
              )}
            </motion.div>
          )}

          {engineState === ENGINE_STATES.BE_STEP && (
            <BeStepScreen
              key="be_step"
              gameMode={gameMode}
              rootNote={rootNote}
              onReady={proceedFromBeStep}
              onBack={() => setEngineState(ENGINE_STATES.MENU)}
            />
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
                handleSessionComplete(orbScores);
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

      {/* Headless Biometric Feedback System */}
      <div style={{ display: 'none' }}>
        <BiometricSanctum onBiometricsChange={setActiveBiometrics} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════

function MenuScreen({ rootNote, setRootNote, phaseUnlock, onStart, micError, isListening, onStartMic, onClose, difficulty, setDifficulty, scaleType, setScaleType }) {
  const { locale, t } = useLocale();
  const mappedRoots = ROOT_NOTES.map((note, idx) => ({
    id: note,
    fret: idx + 1,
    title: locale === 'fr' ? `Vertiscale de ${note}` : `${note} Vertiscale`,
    subtitle: t('ve_menuVertiscaleSubtitle'),
    symbol: note,
    color: '#c9a96e',
  }));

  const renderContent = () => (
    <div style={{ padding: '24px 16px', color: '#e8edf2' }}>
      {/* What is a Vertiscale? — Expandable explainer for novices */}
      <details style={{
        marginBottom: 20, background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.15)', borderRadius: 12,
        overflow: 'hidden',
      }}>
        <summary style={{
          padding: '14px 18px', cursor: 'pointer', listStyle: 'none',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
          letterSpacing: '0.1em', color: '#c9a96e', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>❓</span> {t('ve_whatIsVertiscale')} <span style={{ marginLeft: 'auto', opacity: 0.5 }}>▼</span>
        </summary>
        <div style={{ padding: '0 18px 16px', lineHeight: 1.8 }}>
          <p style={{ fontSize: '1rem', color: '#d0d8e0', marginBottom: 10 }}>
            {t('ve_vertiscaleDesc1')}
          </p>
          <p style={{ fontSize: '1rem', color: '#d0d8e0', marginBottom: 10 }}>
            {t('ve_vertiscaleDesc2')}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#8090a8', fontStyle: 'italic' }}>
            {t('ve_vertiscaleDesc3')}
          </p>
        </div>
      </details>

      {/* Safety reassurance — calms anxious adult learners */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center',
        padding: '10px 16px', marginBottom: 16,
        background: 'rgba(46,213,115,0.04)', borderRadius: 8,
        border: '1px solid rgba(46,213,115,0.08)',
      }}>
        {(locale === 'fr' ? ['🛡️ Pas de score de vitesse', '🚫 Pas de classements', '✓ Les erreurs sont OK', '🔒 Pratique privée'] : ['🛡️ No speed scoring', '🚫 No leaderboards', '✓ Mistakes are OK', '🔒 Your practice is private']).map(item => (
          <span key={item} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
            color: '#5a8a68', letterSpacing: '0.03em',
          }}>{item}</span>
        ))}
      </div>

      {/* Difficulty selector */}
      <div style={{
        display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20,
        padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
          color: '#5a6a80', letterSpacing: '0.1em', textTransform: 'uppercase',
          margin: '0 8px 0 0', display: 'flex', alignItems: 'center',
        }}>{t('ve_speed')}</p>
        {[
          { key: 'beginner', label: t('ve_slow'), desc: t('ve_slowDesc') },
          { key: 'standard', label: t('ve_medium'), desc: t('ve_mediumDesc') },
          { key: 'challenge', label: t('ve_fast'), desc: t('ve_fastDesc') },
        ].map(d => (
          <button key={d.key} onClick={() => setDifficulty(d.key)} title={d.desc} style={{
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
            background: difficulty === d.key ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${difficulty === d.key ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.06)'}`,
            color: difficulty === d.key ? '#c9a96e' : '#5a6a80',
            transition: 'all 0.2s',
          }}>{d.label}</button>
        ))}
      </div>

      {/* Scale type selector */}
      <div style={{
        display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20,
        padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
          color: '#5a6a80', letterSpacing: '0.1em', textTransform: 'uppercase',
          margin: '0 8px 0 0', display: 'flex', alignItems: 'center', width: '100%',
          justifyContent: 'center', marginBottom: 4,
        }}>{t('ve_scaleType')}</p>
        {[
          { key: 'minor pentatonic', label: t('ve_pentatonic') },
          { key: 'major', label: t('ve_major') },
          { key: 'minor', label: t('ve_minor') },
          { key: 'dorian', label: t('ve_dorian') },
          { key: 'mixolydian', label: t('ve_mixolydian') },
          { key: 'minor blues', label: t('ve_blues') },
        ].map(s => (
          <button key={s.key} onClick={() => setScaleType(s.key)} style={{
            padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
            background: scaleType === s.key ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${scaleType === s.key ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.06)'}`,
            color: scaleType === s.key ? '#c9a96e' : '#5a6a80',
            transition: 'all 0.2s',
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {!isListening ? (
          <button onClick={onStartMic} style={{
            padding: '14px 24px', borderRadius: 8,
            background: 'rgba(46,213,115,0.1)', border: '1px solid rgba(46,213,115,0.3)',
            color: '#2ed573', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}>{t('ve_enableMic')}</button>
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#2ed573' }}>{t('ve_micActive')}</p>
        )}
        {micError && <p style={{ fontSize: '0.9rem', color: '#e74c3c', marginTop: 8 }}>{micError}</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase', margin: '0 0 2px' }}>
          {t('ve_innerFretboard')}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#8090a8', margin: '0 0 8px', lineHeight: 1.6 }}>
          {t('ve_innerFretboardDesc')}
        </p>
        <PhaseButton
          label={t('ve_flashLabel')}
          desc={t('ve_flashDesc')}
          unlocked={phaseUnlock.phase1Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE1, 'flash')}
        />
        <PhaseButton
          label={t('ve_imagineLabel')}
          desc={t('ve_imagineDesc')}
          unlocked={phaseUnlock.phase1Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE1, 'imagine')}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase', margin: '16px 0 2px' }}>
          {t('ve_innerEar')}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#8090a8', margin: '0 0 8px', lineHeight: 1.6 }}>
          {t('ve_innerEarDesc')}
        </p>
        <PhaseButton
          label={t('ve_audiateLabel')}
          desc={t('ve_audiateDesc')}
          unlocked={phaseUnlock.phase2Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE2)}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase', margin: '16px 0 2px' }}>
          {t('ve_innerVoice')}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#8090a8', margin: '0 0 8px', lineHeight: 1.6 }}>
          {t('ve_innerVoiceDesc')}
        </p>
        <PhaseButton
          label={t('ve_reflectLabel')}
          desc={t('ve_reflectDesc')}
          unlocked={phaseUnlock.phase3Unlocked}
          onClick={() => onStart(ENGINE_STATES.PHASE3)}
        />

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase', margin: '16px 0 2px' }}>
          {t('ve_livingStory')}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#8090a8', margin: '0 0 8px', lineHeight: 1.6 }}>
          {t('ve_livingStoryDesc')}
        </p>
        <PhaseButton
          label={t('ve_adventureLabel')}
          desc={t('ve_adventureDesc')}
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
        headerTitle={t('ve_menuTitle')}
        headerSubtitle={t('ve_menuSubtitle')}
        showBackButton={!onClose} // Only show Home button if not embedded
      >
        {onClose && (
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
             <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#8090a8', borderRadius: 8, fontSize: '0.8rem',
              cursor: 'pointer', padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{t('ve_close')}</button>
          </div>
        )}
      </NeckMenu>
    </div>
  );
}

// ── BE Step Screen — BE > DO > HAVE breath intention ──
function BeStepScreen({ gameMode, rootNote, onReady, onBack }) {
  const { locale } = useLocale();
  const modeLabel = gameMode === 'imagine'
    ? (locale === 'fr' ? 'IMAGINATION' : 'IMAGINATION')
    : (locale === 'fr' ? 'FLASH' : 'FLASH');

  const breathCues = locale === 'fr' ? [
    'Posez une main sur votre poitrine.',
    'Inspirez lentement par le nez...',
    'Expirez par la bouche.',
    'Vous êtes déjà musicien.',
  ] : [
    'Place one hand on your chest.',
    'Breathe in slowly through the nose...',
    'Breathe out through the mouth.',
    'You are already a musician.',
  ];

  const [cueIdx, setCueIdx] = React.useState(0);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (ready) return;
    const t = setInterval(() => {
      setCueIdx(prev => {
        if (prev >= breathCues.length - 1) { clearInterval(t); setReady(true); return prev; }
        return prev + 1;
      });
    }, 2200);
    return () => clearInterval(t);
  }, [ready, breathCues.length]);

  return (
    <motion.div
      key="be_step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', gap: 28, padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
        letterSpacing: '0.2em', color: '#5a6a80', textTransform: 'uppercase',
      }}>
        {locale === 'fr' ? `AVANT · ${modeLabel} · Vertiscale de ${rootNote}` : `BEFORE · ${modeLabel} · ${rootNote} Vertiscale`}
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={cueIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'Cormorant Garamond, EB Garamond, serif',
            fontSize: '1.6rem', fontWeight: 300,
            color: '#e8edf2', lineHeight: 1.6, maxWidth: 320,
          }}
        >
          {breathCues[cueIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Breathing pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.25)',
          }}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        onClick={ready ? onReady : undefined}
        style={{
          padding: '16px 40px', borderRadius: 8,
          background: ready ? 'rgba(201,169,110,0.12)' : 'transparent',
          border: `1px solid ${ready ? 'rgba(201,169,110,0.4)' : 'transparent'}`,
          color: '#c9a96e', cursor: ready ? 'pointer' : 'default',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'all 0.5s ease',
        }}
      >
        {locale === 'fr' ? "Je suis prêt" : "I'm ready"}
      </motion.button>

      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: '#5a6a80',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
        cursor: 'pointer', letterSpacing: '0.08em',
      }}>
        {locale === 'fr' ? '← Retour' : '← Back'}
      </button>
    </motion.div>
  );
}

// ── Phase 2 Screen — PLING! Orbs (with Audiation Pause) ──
function Phase2Screen({ pattern, rootNote, pitch, noteInfo, breathState, isListening, audioCtxRef, onSessionLog, onComplete, onBack }) {
  const { locale, t } = useLocale();
  const [orbActive, setOrbActive] = React.useState(false);
  const [orbScores, setOrbScores] = React.useState([]);
  const [currentTarget, setCurrentTarget] = React.useState(null);
  const [gateState, setGateState] = React.useState('waiting');
  const [audiatePhase, setAudiatePhase] = React.useState(null); // null | { note }
  const [hitCelebration, setHitCelebration] = React.useState(null); // null | { noteName }

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
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
          letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase',
        }}>{locale === 'fr' ? `🎵 L’OREILLE INTÉRIEURE · Vertiscale de ${rootNote}` : `🎵 THE INNER EAR · ${rootNote} Vertiscale`}</p>
        <p style={{ fontSize: '1rem', color: '#8090a8', marginTop: 8, lineHeight: 1.6 }}>
          {locale === 'fr' ? (
            <>Les notes descendent sur l'écran. Quand une note atteint la <span style={{ color: '#9b7acc' }}>ligne violette</span>, <strong>imaginez le son dans votre esprit</strong> — ne chantez pas encore. Quand elle traverse la <span style={{ color: '#c9a96e' }}>ligne dorée</span>, chantez dans le micro. Tapez sur l'orbe quand vous êtes prêt.</>
          ) : (
            <>Notes descend the screen. When a note hits the <span style={{ color: '#9b7acc' }}>purple line</span>, <strong>imagine the sound in your mind</strong> — don't sing yet. When it crosses the <span style={{ color: '#c9a96e' }}>gold line</span>, sing it into your mic. Tap the orb when you're ready.</>
          )}
        </p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#5a6a80', marginTop: 8 }}>
          {locale === 'fr' ? `${orbScores.length}/${orbSequence.length} notes complétées` : `${orbScores.length}/${orbSequence.length} notes completed`}
        </p>
      </div>

      {/* SING NOW pulse — at gate-open, explicit vocal cue (Bertrand's PLING! protocol) */}
      <AnimatePresence>
        {gateState === 'open' && !audiatePhase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              textAlign: 'center', padding: '12px 20px', borderRadius: 10,
              background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.35)',
              marginBottom: 4,
            }}
          >
            <p style={{
              fontFamily: 'Cormorant Garamond, EB Garamond, serif',
              fontSize: '1.8rem', fontWeight: 300,
              color: '#c9a96e', margin: 0, letterSpacing: '0.05em',
            }}>
              {locale === 'fr' ? 'Chantez.' : 'Sing it.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Somatic hit celebration — note name + grounding cue */}
      <AnimatePresence>
        {hitCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center', padding: '10px 20px', borderRadius: 10,
              background: 'rgba(46,213,115,0.08)', border: '1px solid rgba(46,213,115,0.25)',
              marginBottom: 4,
            }}
          >
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem',
              color: '#2ed573', margin: 0, letterSpacing: '0.12em',
            }}>
              {hitCelebration.noteName || '✓'}
            </p>
            <p style={{
              fontFamily: 'Cormorant Garamond, EB Garamond, serif',
              fontSize: '0.95rem', fontStyle: 'italic',
              color: '#7aaa88', margin: '4px 0 0', letterSpacing: '0.03em',
            }}>
              {locale === 'fr' ? 'Sentez où elle vit.' : 'Feel where it lives.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audiation status indicator */}
      {audiatePhase && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center', padding: '10px 16px', borderRadius: 8,
            background: 'rgba(155,122,204,0.08)', border: '1px solid rgba(155,122,204,0.2)',
          }}
        >
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
            letterSpacing: '0.12em', color: '#9b7acc', textTransform: 'uppercase', margin: 0,
          }}>{locale === 'fr' ? `🧠 AUDIATION — ${audiatePhase.note?.name}` : `🧠 AUDIATING — ${audiatePhase.note?.name}`}</p>
          <p style={{ fontSize: '0.9rem', color: '#8090a8', margin: '4px 0 0', fontStyle: 'italic' }}>
            {t('ve_hearInMind')}
          </p>
        </motion.div>
      )}

      <OrbEngine
        orbSequence={orbSequence}
        difficulty="awakening"
        pitch={pitch}
        noteInfo={noteInfo}
        breathState={breathState}
        active={orbActive}
        audioCtxRef={audioCtxRef}
        onAudiateStart={(orbId, targetNote) => {
          // Audiation pause begins — show "imagine the sound" prompt
          setAudiatePhase({ note: targetNote });
          setGateState('waiting');
        }}
        onGateOpen={(orbId, targetNote) => {
          // Audiation pause ends — mic gate opens
          setAudiatePhase(null);
          setCurrentTarget(targetNote);
          setGateState('open');
        }}
        onGateResult={(orbId, result) => {
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
          // Somatic hit celebration — Bertrand's 3rd Ear protocol: celebrate the connection
          if (result.correct) {
            setHitCelebration({ noteName: result.noteName || currentTarget?.name });
            setTimeout(() => setHitCelebration(null), 1800);
          }
          setGateState('waiting');
          setCurrentTarget(null);
          setAudiatePhase(null);
        }}
        onOrbMiss={(orbId) => {
          const missScore = { composite: 0, breakdown: { placement: 0, pitch: 0, breath: 0, consistency: 0 } };
          setOrbScores(prev => [...prev, missScore]);
          onSessionLog({ phase: 2, ...missScore, orbId, missed: true });
          setGateState('waiting');
          setCurrentTarget(null);
          setAudiatePhase(null);
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
              width: 34, height: 34, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.composite >= 0.7 ? 'rgba(46,213,115,0.2)' : s.composite > 0 ? 'rgba(201,169,110,0.15)' : 'rgba(255,71,87,0.15)',
              border: `1px solid ${s.composite >= 0.7 ? 'rgba(46,213,115,0.4)' : s.composite > 0 ? 'rgba(201,169,110,0.3)' : 'rgba(255,71,87,0.3)'}`,
              fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: '#e8edf2',
            }}>
              {Math.round(s.composite * 100)}
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} style={{
        marginTop: 12, padding: '12px 24px', borderRadius: 8, alignSelf: 'center',
        background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
        color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
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
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
        letterSpacing: '0.1em', color: unlocked ? '#c9a96e' : '#5a6a80',
        margin: '0 0 6px',
      }}>{unlocked ? '✦' : '🔒'} {label}</p>
      <p style={{ fontSize: '1rem', color: '#8090a8', margin: 0, lineHeight: 1.6 }}>{desc}</p>
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
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
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

function SomaticProgressionChart({ sessions }) {
  const data = sessions.length > 0 ? sessions : [
    { timestamp: '1', hrv: 72, flowIndex: 1.2, stressLevel: 0.28, successful: true },
    { timestamp: '2', hrv: 78, flowIndex: 1.6, stressLevel: 0.22, successful: true },
    { timestamp: '3', hrv: 86, flowIndex: 2.1, stressLevel: 0.14, successful: true },
    { timestamp: '4', hrv: 94, flowIndex: 2.6, stressLevel: 0.08, strokeDasharray: '3,3', successful: true },
  ];

  const width = 300;
  const height = 120;
  const padding = 15;

  const getPoints = (valSelector, minVal, maxVal) => {
    return data.map((d, index) => {
      const val = valSelector(d);
      const x = padding + (index / Math.max(1, data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - minVal) / Math.max(0.1, maxVal - minVal)) * (height - 2 * padding);
      return { x, y };
    });
  };

  const hrvPoints = getPoints(d => d.hrv || 65, 50, 110);
  const flowPoints = getPoints(d => d.flowIndex || 1.0, 0.5, 3.5);
  const stressPoints = getPoints(d => d.stressLevel || 0.2, 0.0, 0.5);

  const getPathString = (points) => {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  return (
    <div style={{
      width: '100%', maxWidth: 300,
      background: 'rgba(201, 169, 110, 0.02)',
      border: '1px solid rgba(201, 169, 110, 0.12)',
      borderRadius: 16, padding: '16px',
      display: 'flex', flexDirection: 'column', gap: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#c9a96e', letterSpacing: '0.05em' }}>SOMATIC COHERENCE HISTORY</span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(201,169,110,0.5)', fontFamily: 'JetBrains Mono' }}>{sessions.length > 0 ? `${sessions.length} sessions` : 'simulation'}</span>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" />

        <path d={getPathString(hrvPoints)} fill="none" stroke="#ff6a88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {hrvPoints.map((p, i) => (
          <circle key={`hrv-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#ff6a88" stroke="#030306" strokeWidth="1" />
        ))}

        <path d={getPathString(flowPoints)} fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {flowPoints.map((p, i) => (
          <circle key={`flow-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#c9a96e" stroke="#030306" strokeWidth="1" />
        ))}

        <path d={getPathString(stressPoints)} fill="none" stroke="#7aaa88" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff6a88' }} />
          <span style={{ color: '#ff6a88' }}>HRV</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e' }} />
          <span style={{ color: '#c9a96e' }}>Flow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 1, borderTop: '2px dashed #7aaa88' }} />
          <span style={{ color: '#7aaa88' }}>Stress</span>
        </div>
      </div>
    </div>
  );
}

function SummaryScreen({ roundScores, sessionLog, rootNote, avgScore, streakEligible, onClose, onRestart }) {
  const { locale, t } = useLocale();
  const [journal, setJournal] = React.useState('');
  const [pastSessions, setPastSessions] = React.useState([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const list = await db.vertiscaleSessions.toArray();
        const sorted = list.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setPastSessions(sorted);
      } catch (e) {
        console.warn('Failed to load past sessions from IndexedDB:', e);
      }
    };
    fetchHistory();
  }, []);

  // Dynamic coaching cue based on performance
  const getCoachingCue = () => {
    const avgPlacement = sessionLog.reduce((sum, l) => sum + (l.breakdown?.placement || 0), 0) / Math.max(1, sessionLog.length);
    const avgBreath = sessionLog.reduce((sum, l) => sum + (l.breakdown?.breath || 0), 0) / Math.max(1, sessionLog.length);
    
    if (locale === 'fr') {
      if (avgPlacement < 0.4) return { text: 'Sentez le bois sous vos doigts. Où réside la tension ?', focus: 'placement' };
      if (avgBreath < 0.3) return { text: 'Suivez le souffle. La musique vit dans l’expiration.', focus: 'breath' };
      if (avgScore > 0.8) return { text: 'Vous trouvez votre voix. Quelle histoire racontent vos mains ?', focus: 'maîtrise' };
      if (avgScore > 0.5) return { text: 'Le motif devient vôtre. Pouvez-vous le voir les yeux fermés ?', focus: 'imagination' };
      return { text: 'Chaque tentative est une note. Le chant est plus long qu’une seule séance.', focus: 'persévérance' };
    } else {
      if (avgPlacement < 0.4) return { text: 'Feel the wood under your fingers. Where is the tension?', focus: 'placement' };
      if (avgBreath < 0.3) return { text: 'Follow the breath. The music lives in the exhale.', focus: 'breath' };
      if (avgScore > 0.8) return { text: 'You are finding your voice. What story did your hands tell?', focus: 'mastery' };
      if (avgScore > 0.5) return { text: 'The pattern is becoming yours. Can you see it with your eyes closed?', focus: 'imagination' };
      return { text: 'Every attempt is a note. The song is longer than one session.', focus: 'persistence' };
    }
  };
  const coaching = getCoachingCue();

  const saveJournal = React.useCallback(() => {
    if (!journal.trim()) return;
    const entries = JSON.parse(localStorage.getItem('voixvive_journals') || '[]');
    entries.push({ rootNote, avgScore, text: journal, coaching: coaching.text, timestamp: Date.now() });
    localStorage.setItem('voixvive_journals', JSON.stringify(entries));
  }, [journal, rootNote, avgScore, coaching.text]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase' }}>
        {t('ve_innerVoice')}
      </p>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem',
        fontWeight: 300, color: '#e8edf2',
      }}>{t('ve_summaryTitle')}</h2>

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
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
            color: '#5a6a80', letterSpacing: '0.1em',
          }}>{t('ve_avgScore')}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 300 }}>
        <StatCard label={t('ve_statRoot')} value={rootNote} />
        <StatCard label={t('ve_statRounds')} value={roundScores.length} />
        <StatCard label={t('ve_statBest')} value={`${Math.round(Math.max(...(roundScores.length ? roundScores : [0])) * 100)}%`} />
        <StatCard label={t('ve_statStreak')} value={streakEligible ? t('ve_streakYes') : t('ve_streakNo')} />
      </div>

      {/* Somatic Progression Chart */}
      <SomaticProgressionChart sessions={pastSessions} />

      {/* Round history */}
      {roundScores.length > 0 && (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#5a6a80', letterSpacing: '0.1em', marginBottom: 8 }}>
            {t('ve_roundHistory')}
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            {roundScores.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 48, background: 'rgba(255,255,255,0.03)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${s * 100}%`, background: s >= 0.85 ? 'rgba(46,213,115,0.4)' : 'rgba(201,169,110,0.3)', borderRadius: '0 0 4px 4px' }} />
                <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#8090a8', fontFamily: 'JetBrains Mono' }}>{Math.round(s * 100)}</span>
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
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#5a6a80', marginTop: 8, letterSpacing: '0.1em' }}>
          — BERTRAND · {coaching.focus.toUpperCase()}
        </p>
      </div>

      {/* Journal textarea */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.1em', color: '#c9a96e', marginBottom: 12, textAlign: 'center', textTransform: 'uppercase' }}>
          {t('ve_fhealReflection')}
        </p>
        <div style={{ position: 'relative' }}>
          <textarea
            className="fheal-textarea"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder={t('ve_fhealPlaceholder')}
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
          flex: 1, padding: '16px', borderRadius: 8,
          background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
          color: '#c9a96e', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
        }}>{t('ve_again')}</button>
        {onClose && (
          <button onClick={() => { saveJournal(); onClose(); }} style={{
            flex: 1, padding: '16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#8090a8', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
          }}>{t('ve_done')}</button>
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
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
        color: '#5a6a80', letterSpacing: '0.12em', marginBottom: 4,
      }}>{label}</p>
      <p style={{ fontSize: '1.2rem', color: '#e8edf2', fontWeight: 300 }}>{value}</p>
    </div>
  );
}

export default VertiscaleEngine;
