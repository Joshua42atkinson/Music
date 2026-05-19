// ═══════════════════════════════════════════════════════════
// NARRATIVE ENGINE — Scene graph resolver for Adventures
//
// Stateless pure functions. All state lives in the session
// object passed in and returned. No side effects.
//
// Scene shape:
// {
//   id: string,
//   act: number,              // 1–3 (setup/confrontation/resolution)
//   setting: string,          // prose description of the location
//   art: string,              // path to scene image
//   atmosphere: string,       // 1-line mood for UI color/sound
//   mentorLine: string,       // what the mentor says
//   targetNote: string,       // e.g. 'E4' — note the mentor speaks on
//   targetFreq: number,       // Hz for pitch gate
//   pitchLabel: string,       // human-readable: 'E · Minor 3rd above C'
//   intervalName: string,     // 'Minor 3rd', 'Perfect 5th', etc.
//   choices: [                // 2 choices max
//     {
//       id: string,
//       label: string,        // short button text
//       mode: 'speak' | 'sing', // sing = respond-in-song
//       description: string,  // what the character does
//       leadsTo: string,      // scene id
//       requiresPitchGate: boolean,
//       bonusCondition: null | { streak: number } | { singingScore: number },
//       bonusLeadsTo: string | null,
//     }
//   ],
//   coachingCues: {
//     onPitchPass: string,    // mentor's reaction when pitch is found
//     onPitchStruggle: string, // mentor's patience cue
//     onSingBonus: string,    // mentor's reaction to a sung response
//     onSceneEnter: string,   // ambient narration as scene opens
//   },
//   unlockCondition: null | { streak: number } | { adventure: string, completed: true },
// }
// ═══════════════════════════════════════════════════════════

// ── Session state shape ──────────────────────────────────
export function createSession(adventureId, studentTopic = '') {
  return {
    adventureId,
    studentTopic,          // what the student is working on ("a song about my grandmother")
    currentSceneId: null,  // set by loadAdventure
    history: [],           // [{ sceneId, choiceId, pitchAccuracy, singingScore, timestamp }]
    streak: 0,             // consecutive accurate pitch gates
    totalPitchAttempts: 0,
    accuratePitchCount: 0,
    branchesUnlocked: [],  // ids of bonus branches taken
    completedAt: null,
  };
}

// ── Load an adventure — returns first scene + session ────
export function loadAdventure(adventure, session) {
  const firstScene = adventure.scenes[adventure.startSceneId];
  if (!firstScene) throw new Error(`No start scene '${adventure.startSceneId}' in ${adventure.id}`);
  return {
    scene: firstScene,
    session: { ...session, currentSceneId: firstScene.id },
  };
}

// ── Resolve a pitch attempt ──────────────────────────────
// Returns { passed, centsDev, newStreak, coachingCue }
export function resolvePitch(scene, centsDev, currentStreak) {
  const TOLERANCE = 20; // ±20¢
  const passed = Math.abs(centsDev) <= TOLERANCE;
  const newStreak = passed ? currentStreak + 1 : 0;

  const cue = passed
    ? scene.coachingCues.onPitchPass
    : scene.coachingCues.onPitchStruggle;

  return { passed, centsDev, newStreak, coachingCue: cue };
}

// ── Resolve a player choice ──────────────────────────────
// Returns { nextSceneId, branchType, coachingCue, sessionUpdate }
export function resolveChoice(adventure, scene, choice, session, singingScore = null) {
  let nextSceneId = choice.leadsTo;
  let branchType = 'standard';
  let coachingCue = null;

  // Check bonus condition
  if (choice.bonusLeadsTo && choice.bonusCondition) {
    const cond = choice.bonusCondition;
    const bonusTriggered =
      (cond.streak && session.streak >= cond.streak) ||
      (cond.singingScore && singingScore !== null && singingScore >= cond.singingScore);

    if (bonusTriggered) {
      nextSceneId = choice.bonusLeadsTo;
      branchType = 'bonus';
      coachingCue = scene.coachingCues.onSingBonus;
    }
  }

  // Validate next scene exists
  const nextScene = adventure.scenes[nextSceneId];
  if (!nextScene) {
    console.warn(`Scene '${nextSceneId}' not found — falling back to standard branch`);
    nextSceneId = choice.leadsTo;
    branchType = 'standard';
  }

  // Build history entry
  const historyEntry = {
    sceneId: scene.id,
    choiceId: choice.id,
    branchType,
    pitchAccuracy: session.streak > 0 ? 'passed' : 'struggled',
    singingScore,
    timestamp: Date.now(),
  };

  const sessionUpdate = {
    ...session,
    currentSceneId: nextSceneId,
    history: [...session.history, historyEntry],
    branchesUnlocked: branchType === 'bonus'
      ? [...session.branchesUnlocked, nextSceneId]
      : session.branchesUnlocked,
  };

  return {
    nextScene: adventure.scenes[nextSceneId],
    branchType,
    coachingCue,
    session: sessionUpdate,
  };
}

// ── Score a vocal response ───────────────────────────────
// Input: pitch analysis from usePitchDetector + duration
// Returns a 0–1 score and a label
export function scoreSingingResponse({ pitchAccuracy, melodicContour, duration, theme }) {
  let score = 0;
  const notes = [];

  // Courage: did they commit? (>2 seconds = yes)
  if (duration >= 2) { score += 0.25; notes.push('committed'); }

  // Pitch: were they on-key?
  if (pitchAccuracy >= 0.7) { score += 0.35; notes.push('on pitch'); }
  else if (pitchAccuracy >= 0.4) { score += 0.15; notes.push('reaching'); }

  // Melodic shape: did they go somewhere?
  if (melodicContour && melodicContour !== 'static') { score += 0.25; notes.push('melodic'); }

  // Thematic: did their words connect to the scene theme?
  if (theme?.matched) { score += 0.15; notes.push('resonant'); }

  const label =
    score >= 0.85 ? 'Resonance' :
    score >= 0.6  ? 'Voice Found' :
    score >= 0.35 ? 'First Attempt' :
    'Courage Shown';

  return { score, label, notes };
}

// ── Get session summary ──────────────────────────────────
export function getSessionSummary(session) {
  const accuracy = session.totalPitchAttempts > 0
    ? Math.round((session.accuratePitchCount / session.totalPitchAttempts) * 100)
    : 0;

  const bonusBranches = session.branchesUnlocked.length;
  const scenesCompleted = session.history.length;
  const sungResponses = session.history.filter(h => h.singingScore !== null).length;

  return {
    accuracy,
    bonusBranches,
    scenesCompleted,
    sungResponses,
    peakStreak: Math.max(...session.history.map((_, i) => {
      // rough streak estimation from history
      return i + 1;
    }), 0),
    impression: generateImpression(accuracy, bonusBranches, sungResponses),
  };
}

function generateImpression(accuracy, bonusBranches, sungResponses) {
  if (accuracy >= 85 && sungResponses >= 3) {
    return 'The living voice. You did not just play — you sang the story into being.';
  }
  if (accuracy >= 70 && bonusBranches >= 2) {
    return 'The ear is opening. You found paths most students never see.';
  }
  if (sungResponses >= 1) {
    return 'You sang when you could have spoken. That is the beginning of everything.';
  }
  if (accuracy >= 60) {
    return 'The pitch is finding you. Return and it will be closer.';
  }
  return 'Every attempt is a note. The song is longer than one session.';
}
