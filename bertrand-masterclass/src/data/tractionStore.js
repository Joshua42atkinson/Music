// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : tractionStore.js                                   ║
// ║ WHAT    : Read/write student progress in localStorage        ║
// ║ WHY     : Fast sync state — components read this on render   ║
// ║ WHO     : No UI — called by providers, game, and textbook    ║
// ║ OWNS    : bardLevel, totalTraction, streak, per-fret flags   ║
// ║ NEEDS   : Nothing — no imports, pure localStorage functions  ║
// ║ RULES   : bardLevel must always derive from totalTraction    ║
// ║           Never remove yinCompleted or yangCompleted flags   ║
// ║           “traction” = guitar practice only, not Great Game  ║
// ║ FIX AT  : Check localStorage key 'bard_traction' in DevTools ║
// ║           then localDatabase.js if IndexedDB backup is stale ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                   ║
// ╚═══════════════════════════════════════════════════════════════╝

const STORAGE_KEY = 'bard_traction';

const DEFAULT_STATE = {
  bardLevel: 1,
  totalTraction: 0,
  practiceMinutes: 0,
  fretsUnlocked: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  frets: {},
  breathingSessions: 0,
  lastPracticeDate: null,
  streak: 0,
  pitchRoomScore: 0,
  pitchRoomBestAccuracy: 0,
  // DAG Navigation
  currentNodeId: 'fret-1-class-be', // Everyone starts here
  completedNodes: [],
  settings: {
    showNoteLabels: true,
    showFretNumbers: true,
    showMetronome: true,
    showCAGEDOverlay: true,
    sandboxMode: false,
    aiEnabled: true,
    scaffoldingLevel: 1.0 // 1.0 = full scaffolding, 0.0 = none
  }
};

export function getDefaultFretState(fretId) {
  return {
    id: fretId,
    yinCompleted: false,
    yangCompleted: false,
    breathingGateCleared: false,
    traction: 0,        // 0-100
    pitchAccuracy: 0,   // 0-100
    tensionScore: 100,   // 100 = max tension (beginner), 0 = fully relaxed
    attempts: 0,
    lastAccessed: null,
    meditationSeconds: 0,
    exercisesCompleted: [],
    // DAG Phase Tracking (BE → DO → PLAY)
    beCompleted: false,
    doCompleted: false,
    playCompleted: false,
    beAttempts: 0,
    doAttempts: 0,
    playAttempts: 0,
    // 4-Level Mastery per phase (ported from Day Dream)
    // 0 = Encountered, 1 = Experienced, 2 = Owned, 3 = Mastered
    beMastery: 0,
    doMastery: 0,
    playMastery: 0,
    depthExplored: false,   // true if student clicked "Go Deeper"
    timeSpentSeconds: 0,    // cumulative time on this fret
    // Cross-pillar resonance (Day Dream synergy system)
    // Unlocked when same phase is completed across multiple pillars of this fret
    beResonance: false,
    doResonance: false,
    playResonance: false,
    // Somatic Gate (pitch/performance demonstration required before marking complete)
    // BE gate: read all slides (auto-set by SlideViewer)
    // DO gate: successful pitch match (set by PitchRoom/PlingTrainer)
    // PLAY gate: successful performance (set by video/audio submission)
    beGatePassed: false,
    doGatePassed: false,
    playGatePassed: false,
  };
}

// ── Core CRUD ──

export function loadTraction() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveTraction(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[TractionStore] Failed to save:', e);
  }
}

export function resetTraction() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_STATE };
}

// ── Chapter Progress ──

export function getFretState(state, fretId) {
  const existing = state.frets[fretId];
  const defaults = getDefaultFretState(fretId);
  if (!existing) return defaults;
  // Merge: existing values override defaults, but new fields from defaults
  // are included (prevents undefined for fields added after student's first session)
  return { ...defaults, ...existing };
}

export function updateFretTraction(state, fretId, updates) {
  const current = getFretState(state, fretId);
  const updated = { ...current, ...updates, lastAccessed: new Date().toISOString() };
  
  const newState = {
    ...state,
    frets: { ...state.frets, [fretId]: updated }
  };
  
  // Recalculate total traction and bard level
  const allFrets = Object.values(newState.frets);
  const totalTraction = allFrets.reduce((sum, ch) => sum + (ch.traction || 0), 0);
  newState.totalTraction = totalTraction;
  newState.bardLevel = Math.max(1, Math.floor(totalTraction / 100) + 1);
  
  // Auto-unlock next chapter when traction >= 60
  if (updated.traction >= 60 && !newState.fretsUnlocked.includes(fretId + 1) && fretId < 12) {
    newState.fretsUnlocked = [...newState.fretsUnlocked, fretId + 1];
  }
  
  // Recalculate scaffolding
  newState.settings = calculateScaffolding(newState);
  
  saveTraction(newState);
  return newState;
}

// ── Breathing Gate ──

export function recordBreathingSession(state, fretId) {
  const fretState = getFretState(state, fretId);
  const newState = updateFretTraction(state, fretId, {
    breathingGateCleared: true,
    meditationSeconds: fretState.meditationSeconds + 60
  });
  newState.breathingSessions = (newState.breathingSessions || 0) + 1;
  saveTraction(newState);
  return newState;
}

// ── Practice Logging ──

export function logPracticeMinutes(state, minutes) {
  const today = new Date().toISOString().split('T')[0];
  const isConsecutive = state.lastPracticeDate === today ||
    isYesterday(state.lastPracticeDate);
  
  const newState = {
    ...state,
    practiceMinutes: state.practiceMinutes + minutes,
    lastPracticeDate: today,
    streak: isConsecutive ? state.streak + (state.lastPracticeDate !== today ? 1 : 0) : 1
  };
  saveTraction(newState);
  return newState;
}

// ── Pitch Room ──

export function updatePitchScore(state, points) {
  const newScore = Math.max(0, state.pitchRoomScore + points);
  const newState = {
    ...state,
    pitchRoomScore: newScore,
    pitchRoomBestAccuracy: Math.max(state.pitchRoomBestAccuracy, newScore)
  };
  saveTraction(newState);
  return newState;
}

// ── Scaffolding Fade Calculator ──
// As traction increases, visual aids automatically reduce

function calculateScaffolding(state) {
  const avgTraction = state.totalTraction / Math.max(Object.keys(state.frets).length, 1);
  const level = Math.max(0, 1 - (avgTraction / 100));
  
  return {
    ...state.settings,
    scaffoldingLevel: level,
    showNoteLabels: avgTraction < 40,
    showFretNumbers: avgTraction < 60,
    showMetronome: avgTraction < 80,
    showCAGEDOverlay: true // Always available as a toggle
  };
}

// ── Utility ──

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export function getScaffoldingLevel(state) {
  return state.settings?.scaffoldingLevel ?? 1.0;
}

export function isChapterUnlocked(state, fretId) {
  return state.fretsUnlocked.includes(fretId);
}

// ── DAG Navigation ──

/**
 * Mark a BE/DO/PLAY phase as completed for a fret.
 * @param {Object} state
 * @param {number} fretId
 * @param {'be'|'do'|'play'} phase
 * @returns {Object} Updated state
 */
export function completeDAGPhase(state, fretId, phase) {
  const fretState = getFretState(state, fretId);
  const phaseKey = `${phase}Completed`;
  const attemptKey = `${phase}Attempts`;

  // Sync DAG phase completion to legacy traction metric
  // This prevents dual-metric divergence where QuestLog and BEWorkbook
  // show different completion status for the same fret.
  const phaseTraction = { be: 33, do: 66, play: 100 };
  const targetTraction = phaseTraction[phase] || 0;
  const syncedTraction = Math.max(fretState.traction || 0, targetTraction);

  // 4-level mastery: first completion = Owned (2), depth explored = Mastered (3)
  const masteryKey = `${phase}Mastery`;
  const currentMastery = fretState[masteryKey] || 0;
  const newMastery = (currentMastery >= 2)
    ? currentMastery  // already Owned/Mastered, don't downgrade
    : (fretState.depthExplored ? 3 : 2);  // Mastered if depth explored, else Owned

  // Cross-pillar resonance detection (Day Dream synergy)
  // A resonance unlocks when the SAME phase is completed across
  // multiple pillars of the same fret. For now we track class/guitar/workbook
  // as a single "cross-pillar" completion since tractionStore is per-fret.
  // In full implementation, pillars are tracked separately.
  const resonanceKey = `${phase}Resonance`;
  const hasResonance = !!fretState[resonanceKey];
  // Simple heuristic: if student has attempted this phase 2+ times
  // across different contexts, they have "cross-pillar" understanding
  const attempts = (fretState[attemptKey] || 0) + 1;
  const newResonance = hasResonance || (attempts >= 2 && newMastery >= 2);

  const updatedFret = {
    ...fretState,
    [phaseKey]: true,
    [attemptKey]: attempts,
    [masteryKey]: newMastery,
    [resonanceKey]: newResonance,
    traction: syncedTraction,
    lastAccessed: new Date().toISOString(),
  };

  const newState = {
    ...state,
    frets: { ...state.frets, [fretId]: updatedFret },
  };

  // Recalculate totals (copied from updateFretTraction)
  const allFrets = Object.values(newState.frets);
  const totalTraction = allFrets.reduce((sum, ch) => sum + (ch.traction || 0), 0);
  newState.totalTraction = totalTraction;
  newState.bardLevel = Math.max(1, Math.floor(totalTraction / 100) + 1);

  // Auto-unlock next chapter when traction >= 60
  if (syncedTraction >= 60 && !newState.fretsUnlocked.includes(fretId + 1) && fretId < 12) {
    newState.fretsUnlocked = [...newState.fretsUnlocked, fretId + 1];
  }

  // Recalculate scaffolding
  newState.settings = calculateScaffolding(newState);

  saveTraction(newState);
  return newState;
}

/**
 * Record an attempt on a phase without completing it.
 * @param {Object} state
 * @param {number} fretId
 * @param {'be'|'do'|'play'} phase
 * @returns {Object} Updated state
 */
export function attemptDAGPhase(state, fretId, phase) {
  const fretState = getFretState(state, fretId);
  const attemptKey = `${phase}Attempts`;
  const masteryKey = `${phase}Mastery`;
  const currentMastery = fretState[masteryKey] || 0;

  const updatedFret = {
    ...fretState,
    [attemptKey]: (fretState[attemptKey] || 0) + 1,
    // First attempt without completion = Experienced (1)
    [masteryKey]: currentMastery >= 1 ? currentMastery : 1,
    lastAccessed: new Date().toISOString(),
  };

  const newState = {
    ...state,
    frets: { ...state.frets, [fretId]: updatedFret },
  };

  saveTraction(newState);
  return newState;
}

/**
 * Mark that the student explored the depth prompt for a fret.
 * This upgrades any completed phases from Owned (2) to Mastered (3).
 * @param {Object} state
 * @param {number} fretId
 * @returns {Object} Updated state
 */
export function markDepthExplored(state, fretId) {
  const fretState = getFretState(state, fretId);
  const updatedFret = {
    ...fretState,
    depthExplored: true,
    // Upgrade any completed phases to Mastered
    ...(fretState.beCompleted && fretState.beMastery < 3 ? { beMastery: 3 } : {}),
    ...(fretState.doCompleted && fretState.doMastery < 3 ? { doMastery: 3 } : {}),
    ...(fretState.playCompleted && fretState.playMastery < 3 ? { playMastery: 3 } : {}),
    lastAccessed: new Date().toISOString(),
  };

  const newState = {
    ...state,
    frets: { ...state.frets, [fretId]: updatedFret },
  };

  saveTraction(newState);
  return newState;
}

/**
 * Pass the Somatic Gate for a specific phase on a fret.
 * The student must demonstrate the skill before they can mark complete.
 * BE gate: read all slides (auto-set by SlideViewer reaching last slide)
 * DO gate: successful pitch match (set by PitchRoom/PlingTrainer)
 * PLAY gate: successful performance (set by video/audio submission)
 * @param {Object} state
 * @param {number} fretId
 * @param {'be'|'do'|'play'} phase
 * @returns {Object} Updated state
 */
export function passSomaticGate(state, fretId, phase) {
  const fretState = getFretState(state, fretId);
  const gateKey = `${phase}GatePassed`;

  if (fretState[gateKey]) return state; // already passed

  const updatedFret = {
    ...fretState,
    [gateKey]: true,
    lastAccessed: new Date().toISOString(),
  };

  const newState = {
    ...state,
    frets: { ...state.frets, [fretId]: updatedFret },
  };

  saveTraction(newState);
  return newState;
}

/**
 * Get the current phase for a fret (which phase is in-progress).
 * Returns 'be', 'do', 'play', or 'complete' if all done.
 * @param {Object} state
 * @param {number} fretId
 * @returns {'be'|'do'|'play'|'complete'}
 */
export function getCurrentPhase(state, fretId) {
  const fretState = getFretState(state, fretId);
  if (!fretState.beCompleted) return 'be';
  if (!fretState.doCompleted) return 'do';
  if (!fretState.playCompleted) return 'play';
  return 'complete';
}

/**
 * Set the current DAG node the student is working on.
 * @param {Object} state
 * @param {string} nodeId
 * @returns {Object} Updated state
 */
export function setCurrentNode(state, nodeId) {
  const newState = {
    ...state,
    currentNodeId: nodeId,
  };
  saveTraction(newState);
  return newState;
}

/**
 * Mark a DAG node as completed.
 * @param {Object} state
 * @param {string} nodeId
 * @returns {Object} Updated state
 */
export function completeNode(state, nodeId) {
  const completed = state.completedNodes || [];
  if (completed.includes(nodeId)) return state;
  
  const newState = {
    ...state,
    completedNodes: [...completed, nodeId],
  };
  saveTraction(newState);
  return newState;
}
