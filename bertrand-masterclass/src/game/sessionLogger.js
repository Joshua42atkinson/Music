// ═══════════════════════════════════════════════════════════
// PIECE 8: sessionLogger
// Persists Vertiscale session data to tractionStore + Dexie.
// Computes phase unlock eligibility after each session.
// ═══════════════════════════════════════════════════════════

import { loadTraction, saveTraction, updateFretTraction } from '../data/tractionStore';
import { db } from '../data/localDatabase';
import { computeConsistencyRatio, computePhaseUnlock, PHASE_CONSISTENCY_MINIMUM } from './scoreCalculator';

const FRET_ID = 9; // Vertiscale Engine lives at Fret 9

// ─────────────────────────────────────────────────────────────
// Log a completed Phase 1 or Phase 2 session
//
// sessionData: {
//   phase: 1 | 2,
//   patternId: string,
//   rounds: RoundScore[],      // array of composite scores from scoreCalculator
//   breathEvents: string[],    // all breath samples across the session
// }
// ─────────────────────────────────────────────────────────────

export async function logVertiscaleSession(sessionData) {
  const { phase, patternId, rounds, breathEvents } = sessionData;

  const compositeScores = rounds.map(r => r.composite);
  const consistencyRatio = computeConsistencyRatio(compositeScores);
  const avgPlacement = avg(rounds.map(r => r.breakdown.placement));
  const avgBreath    = avg(rounds.map(r => r.breakdown.breath));
  const successful   = consistencyRatio >= PHASE_CONSISTENCY_MINIMUM;

  const sessionRecord = {
    phase,
    patternId,
    timestamp: new Date().toISOString(),
    consistencyRatio,
    avgPlacement,
    avgBreath,
    roundCount: rounds.length,
    successful,
  };

  // ── Write to Dexie (durable) ──
  try {
    await db.vertiscaleSessions.add({
      ...sessionRecord,
      rounds: JSON.stringify(rounds),
    });
  } catch (e) {
    console.warn('[sessionLogger] Dexie write failed:', e);
  }

  // ── Write to tractionStore (fast localStorage) ──
  let state = loadTraction();

  // Ensure vertiscale sub-object exists
  const fretState = state.frets[FRET_ID] || {};
  const vs = fretState.vertiscale || { phase1Sessions: [], phase2Sessions: [], phaseUnlocked: 1 };

  if (phase === 1) vs.phase1Sessions = [...vs.phase1Sessions, sessionRecord];
  if (phase === 2) vs.phase2Sessions = [...vs.phase2Sessions, sessionRecord];

  // Recompute unlock
  const unlock = computePhaseUnlock(vs);
  vs.phaseUnlocked = unlock.phase3Unlocked ? 3 : unlock.phase2Unlocked ? 2 : 1;

  // Update fret traction (placement accuracy drives overall bard level)
  state = updateFretTraction(state, FRET_ID, {
    ...fretState,
    vertiscale: vs,
    traction: Math.round(avgPlacement * 100),
    pitchAccuracy: Math.round((avg(rounds.map(r => r.breakdown.pitch ?? r.breakdown.placement))) * 100),
    tensionScore: Math.round((1 - avgBreath) * 100),
    attempts: (fretState.attempts || 0) + 1,
    exercisesCompleted: [...(fretState.exercisesCompleted || []), `phase${phase}-${patternId}`],
  });

  return { sessionRecord, unlock, state };
}

// ─────────────────────────────────────────────────────────────
// Log a Phase 3 (Freeplay) session impression
//
// freeplayData: {
//   patternId: string,
//   durationMs: number,
//   notesPlayed: { noteName, fret, stringIdx, durationMs }[],
//   inKeyRatio: number,         // 0–1
//   registerDistribution: {},   // {low, mid, high} percentages
//   restRatio: number,          // fraction of time spent resting
// }
// ─────────────────────────────────────────────────────────────

export async function logFreeplaySession(freeplayData) {
  const impression = generateImpression(freeplayData);
  const record = {
    phase: 3,
    timestamp: new Date().toISOString(),
    ...freeplayData,
    impression,
  };

  try {
    await db.vertiscaleSessions.add(record);
  } catch (e) {
    console.warn('[sessionLogger] Dexie freeplay write failed:', e);
  }

  // Freeplay unlocks Phase 3 on tractionStore
  let state = loadTraction();
  const fretState = state.frets[FRET_ID] || {};
  const vs = fretState.vertiscale || { phase1Sessions: [], phase2Sessions: [], phaseUnlocked: 1 };
  vs.phaseUnlocked = 3;
  vs.lastFreeplayImpression = impression;

  state = updateFretTraction(state, FRET_ID, { ...fretState, vertiscale: vs });
  return { impression, state };
}

// ─────────────────────────────────────────────────────────────
// Get current unlock status for display in the UI
// ─────────────────────────────────────────────────────────────

export function getVertiscaleProgress() {
  const state = loadTraction();
  const vs = state.frets?.[FRET_ID]?.vertiscale;
  if (!vs) return { phaseUnlocked: 1, phase1Sessions: [], phase2Sessions: [], phase1Progress: 0, phase2Progress: 0 };

  const unlock = computePhaseUnlock(vs);
  return { ...vs, ...unlock };
}

// ─────────────────────────────────────────────────────────────
// Piece 9: Impression Generator (Phase 3 only)
// ─────────────────────────────────────────────────────────────

function generateImpression({ notesPlayed = [], inKeyRatio = 1, registerDistribution = {}, restRatio = 0, durationMs = 0 }) {
  const noteCount = notesPlayed.length;
  const inKeyCount = Math.round(noteCount * inKeyRatio);
  const chromaticCount = noteCount - inKeyCount;

  const { low = 0, mid = 0, high = 0 } = registerDistribution;
  const dominantRegister = [['lower', low], ['middle', mid], ['upper', high]]
    .sort((a, b) => b[1] - a[1])[0][0];

  const sessionMinutes = Math.round(durationMs / 60000);

  // Register observation
  let registerLine = `You spent most of this session in the ${dominantRegister} register.`;

  // Note count + key adherence
  let noteLine = '';
  if (noteCount === 0) {
    noteLine = 'You played in silence. That is also music.';
  } else if (chromaticCount === 0) {
    noteLine = `You played ${noteCount} notes — all of them in key.`;
  } else {
    noteLine = `You played ${noteCount} notes — ${inKeyCount} in key, ${chromaticCount} chromatic. That's interesting.`;
  }

  // Rest observation
  let restLine = '';
  if (restRatio > 0.5) restLine = ' You gave the music a lot of space to breathe.';
  else if (restRatio < 0.1) restLine = ' Your phrases were close together — very little silence.';

  // Reflection prompt — rotates based on inKeyRatio
  const prompts = [
    'Which moment felt the most like music to you?',
    'Was there a phrase you wanted to play again?',
    'Where did you feel most at ease?',
    'What surprised you in this session?',
    `You were in key ${Math.round(inKeyRatio * 100)}% of the time. What did the other ${Math.round((1 - inKeyRatio) * 100)}% feel like?`,
  ];
  const promptIdx = Math.floor(inKeyRatio * (prompts.length - 1));
  const reflectionPrompt = prompts[promptIdx];

  return {
    paragraphs: [`${registerLine} ${noteLine}${restLine}`],
    bertrandPrompt: reflectionPrompt,
    sessionMinutes,
    stats: { noteCount, inKeyCount, chromaticCount, inKeyRatio },
  };
}

// ─────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + (b ?? 0), 0) / arr.length;
}
