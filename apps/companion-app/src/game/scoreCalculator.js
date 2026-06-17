// ═══════════════════════════════════════════════════════════
// PIECE 4: scoreCalculator
// Pure functions — no side effects, no UI, no state.
// All scoring for Phase 1 and Phase 2.
//
// Scoring weights (from design doc):
//   Placement Accuracy  35%
//   Pitch Accuracy      25% (Phase 2 only)
//   Breath Continuity   20%
//   Consistency Ratio   20%
//
// Speed is never scored.
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Phase 1 — Placement Accuracy
// correctPositions: [{stringIdx, fret}]
// playerTaps:       [{stringIdx, fret}]
// ─────────────────────────────────────────────────────────────

export function computePlacementAccuracy(correctPositions, playerTaps) {
  if (!correctPositions || correctPositions.length === 0) return 0;

  const hits = correctPositions.filter(correct =>
    playerTaps.some(tap => tap.stringIdx === correct.stringIdx && tap.fret === correct.fret)
  );

  // Penalise phantom taps (taps on wrong positions)
  const phantoms = playerTaps.filter(tap =>
    !correctPositions.some(c => c.stringIdx === tap.stringIdx && c.fret === tap.fret)
  );

  const rawAccuracy = hits.length / correctPositions.length;
  const phantomPenalty = Math.min(0.3, phantoms.length * 0.05); // max 30% penalty
  return Math.max(0, rawAccuracy - phantomPenalty);
}

// ─────────────────────────────────────────────────────────────
// Phase 2 — Pitch Accuracy from cents deviation
// centsDev: absolute cents deviation (0 = perfect)
// tolerance: the current threshold (35 | 20 | 10)
// ─────────────────────────────────────────────────────────────

export function computePitchAccuracy(centsDev, tolerance) {
  if (centsDev === null || centsDev === undefined) return 0;
  const abs = Math.abs(centsDev);
  if (abs <= tolerance) {
    // Linear scale within tolerance: 0¢ = 1.0, at threshold = 0.6
    return 1.0 - (abs / tolerance) * 0.4;
  }
  // Outside tolerance — partial credit up to 2x tolerance
  if (abs <= tolerance * 2) return 0.3 * (1 - (abs - tolerance) / tolerance);
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Breath Continuity Score
// breathEvents: array of breathState values sampled during round
//   ('free' | 'shallow' | 'held')
// ─────────────────────────────────────────────────────────────

export function computeBreathContinuity(breathEvents) {
  if (!breathEvents || breathEvents.length === 0) return 1.0; // no mic = full score
  const freeCount = breathEvents.filter(e => e === 'free').length;
  return freeCount / breathEvents.length;
}

// ─────────────────────────────────────────────────────────────
// Consistency Ratio — rolling 5-round window
// roundScores: array of recent compositeScores (0–1)
// Returns: 1 - normalised std-deviation (1.0 = perfectly consistent)
// ─────────────────────────────────────────────────────────────

export function computeConsistencyRatio(roundScores) {
  const window = roundScores.slice(-5);
  if (window.length < 2) return 0;

  const mean = window.reduce((a, b) => a + b, 0) / window.length;
  const variance = window.reduce((sum, s) => sum + (s - mean) ** 2, 0) / window.length;
  const stdDev = Math.sqrt(variance);

  // Normalise: stdDev of 0 = 1.0 consistency, stdDev of 0.5 = 0.0
  return Math.max(0, 1 - stdDev * 2);
}

// ─────────────────────────────────────────────────────────────
// Phase 1 Composite Score
// ─────────────────────────────────────────────────────────────

export function computePhase1Score({
  correctPositions,
  playerTaps,
  breathEvents,
  recentRoundScores,
}) {
  const placement    = computePlacementAccuracy(correctPositions, playerTaps);
  const breath       = computeBreathContinuity(breathEvents);
  const consistency  = computeConsistencyRatio(recentRoundScores);

  const composite = (placement * 0.35) + (breath * 0.20) + (consistency * 0.20)
    + (placement * 0.25); // placement fills pitch slot for Phase 1 (no mic required)

  return {
    composite: Math.min(1, composite),
    breakdown: { placement, breath, consistency, pitch: null },
  };
}

// ─────────────────────────────────────────────────────────────
// Sustain Mode Composite Score
// holdRatio: fraction of target hold duration actually sustained (0–1)
// ─────────────────────────────────────────────────────────────

export function computeSustainScore({
  correctPositions,
  playerTaps,
  holdRatio,
  breathEvents,
  recentRoundScores,
}) {
  const placement    = computePlacementAccuracy(correctPositions, playerTaps);
  const breath       = computeBreathContinuity(breathEvents);
  const consistency  = computeConsistencyRatio(recentRoundScores);
  const hold         = Math.max(0, Math.min(1, holdRatio || 0));

  // Sustain weights: placement 35%, hold duration 25%, breath 25%, consistency 15%
  const composite = (placement * 0.35) + (hold * 0.25) + (breath * 0.25) + (consistency * 0.15);

  return {
    composite: Math.min(1, composite),
    breakdown: { placement, hold, breath, consistency, pitch: null },
  };
}

// ─────────────────────────────────────────────────────────────
// Phase 2 Composite Score
// ─────────────────────────────────────────────────────────────

export function computePhase2Score({
  correctPositions,
  playerTaps,
  centsDev,
  pitchTolerance,
  breathEvents,
  recentRoundScores,
}) {
  const placement   = computePlacementAccuracy(correctPositions, playerTaps);
  const pitch       = computePitchAccuracy(centsDev, pitchTolerance);
  const breath      = computeBreathContinuity(breathEvents);
  const consistency = computeConsistencyRatio(recentRoundScores);

  const composite = (placement * 0.35) + (pitch * 0.25) + (breath * 0.20) + (consistency * 0.20);

  return {
    composite: Math.min(1, composite),
    breakdown: { placement, pitch, breath, consistency },
  };
}

// ─────────────────────────────────────────────────────────────
// Streak Check
// Returns true if the last 3 rounds all cleared the myelination threshold
// ─────────────────────────────────────────────────────────────

export const STREAK_BREATH_THRESHOLD    = 0.80;
export const STREAK_PLACEMENT_THRESHOLD = 0.85;
export const STREAK_WINDOW              = 3;

export function checkStreakEligible(roundHistory) {
  const recent = roundHistory.slice(-STREAK_WINDOW);
  if (recent.length < STREAK_WINDOW) return false;
  return recent.every(r =>
    r.breakdown.breath      >= STREAK_BREATH_THRESHOLD &&
    r.breakdown.placement   >= STREAK_PLACEMENT_THRESHOLD
  );
}

// ─────────────────────────────────────────────────────────────
// Phase Unlock Eligibility
// ─────────────────────────────────────────────────────────────

export const PHASE2_UNLOCK_SESSIONS     = 5;
export const PHASE3_UNLOCK_SESSIONS     = 3;
export const PHASE_CONSISTENCY_MINIMUM  = 0.85;

export function computePhaseUnlock(vertiscaleProgress) {
  const { phase1Sessions = [], phase2Sessions = [] } = vertiscaleProgress || {};

  const successfulP1 = phase1Sessions.filter(s =>
    s.consistencyRatio >= PHASE_CONSISTENCY_MINIMUM
  ).length;

  const successfulP2 = phase2Sessions.filter(s =>
    s.consistencyRatio >= PHASE_CONSISTENCY_MINIMUM
  ).length;

  return {
    phase1Unlocked: true,
    phase2Unlocked: successfulP1 >= PHASE2_UNLOCK_SESSIONS,
    phase3Unlocked: successfulP2 >= PHASE3_UNLOCK_SESSIONS,
    phase1Progress: Math.min(1, successfulP1 / PHASE2_UNLOCK_SESSIONS),
    phase2Progress: Math.min(1, successfulP2 / PHASE3_UNLOCK_SESSIONS),
  };
}
