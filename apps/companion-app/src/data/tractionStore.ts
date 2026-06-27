import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : tractionStore.ts                                   ║
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

// @ts-ignore
import { vvGet, vvSet, vvSetJSON, vvRemove } from '../lib/storage';
// @ts-ignore
import { STORAGE_KEYS } from '../lib/storageKeys';

export type CommitmentTier = 'gentle' | 'committed' | 'intensive';
export type GlobalMode = 'truebadour_trial' | 'open_book';
export type PromptVerbosity = 'full' | 'reduced' | 'minimal' | 'silent';

export interface SongEntry {
  submitted: boolean;
  date: string | null;
}

export interface Settings {
  showNoteLabels: boolean;
  showFretNumbers: boolean;
  showMetronome: boolean;
  showCAGEDOverlay: boolean;
  sandboxMode: boolean;
  aiEnabled: boolean;
  gameEnabled: boolean;
  disableBreathingGates: boolean;
  scaffoldingLevel: number;
  globalMode: GlobalMode;
  promptVerbosity: PromptVerbosity;
}

export interface Garden {
  trees: unknown[];
  nightGateTime: string;
  livingVoiceActive: boolean;
}

export interface FretState {
  id: number;
  yinCompleted: boolean;
  yangCompleted: boolean;
  breathingGateCleared: boolean;
  traction: number;
  pitchAccuracy: number;
  tensionScore: number;
  attempts: number;
  lastAccessed: string | null;
  meditationSeconds: number;
  exercisesCompleted: string[];
  beCompleted: boolean;
  doCompleted: boolean;
  playCompleted: boolean;
  beAttempts: number;
  doAttempts: number;
  playAttempts: number;
  beMastery: number;
  doMastery: number;
  playMastery: number;
  depthExplored: boolean;
  timeSpentSeconds: number;
  beResonance: boolean;
  doResonance: boolean;
  playResonance: boolean;
  beGatePassed: boolean;
  doGatePassed: boolean;
  playGatePassed: boolean;
  [key: string]: unknown;
}

export const CURRENT_TRACTION_SCHEMA = 2;

export interface TractionState {
  _schemaVersion: number;
  _persistedAt: number; // Unix timestamp ms — for dual-write freshness resolution
  somaticDepth: number;
  bardLevel: number;
  totalTraction: number;
  practiceMinutes: number;
  fretsUnlocked: number[];
  frets: Record<string, FretState>;
  breathingSessions: number;
  rhythmSessions: number;
  pitchSessions: number;
  journalEntries: number;
  songsWritten: number;
  xp: number;
  lastPracticeDate: string | null;
  lastPracticeTimestamp: number;
  resonanceCycles: number;
  pitchRoomScore: number;
  pitchRoomBestAccuracy: number;
  gameMode: boolean;
  onboardingComplete: boolean;
  commitmentTier: CommitmentTier | null;
  journeyStartDate: string | null;
  songs: Record<number, SongEntry>;
  currentNodeId: string;
  currentPillar: 'BE' | 'DO' | 'PLAY' | 'PRODUCE';
  completedNodes: string[];
  settings: Settings;
  garden: Garden;
  streak?: number;
}


const DEFAULT_STATE: TractionState = {
  _schemaVersion: CURRENT_TRACTION_SCHEMA,
  _persistedAt: 0,
  somaticDepth: 1,
  bardLevel: 1,
  totalTraction: 0,
  practiceMinutes: 0,
  fretsUnlocked: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  frets: {},
  breathingSessions: 0,
  rhythmSessions: 0,
  pitchSessions: 0,
  journalEntries: 0,
  songsWritten: 0,
  xp: 0,
  lastPracticeDate: null,
  lastPracticeTimestamp: 0,
  resonanceCycles: 0,
  pitchRoomScore: 0,
  pitchRoomBestAccuracy: 0,
  // Game Progression
  gameMode: true,             // true = Guided (gated), false = Free Play (unlocked)
  onboardingComplete: false,
  commitmentTier: null,       // 'gentle' | 'committed' | 'intensive'
  journeyStartDate: null,     // ISO date string — set during onboarding
  songs: {},                  // { 1: { submitted: false, date: null }, 2: ..., 3: ... }
  // DAG Navigation
  currentNodeId: 'fret-1-class-be', // Everyone starts here
  currentPillar: 'BE',
  completedNodes: [],
  settings: {
    showNoteLabels: true,
    showFretNumbers: true,
    showMetronome: true,
    showCAGEDOverlay: true,
    sandboxMode: false,
    aiEnabled: true,
    gameEnabled: true,
    disableBreathingGates: false,
    scaffoldingLevel: 1.0, // 1.0 = full scaffolding, 0.0 = none
    globalMode: 'truebadour_trial', // 'truebadour_trial' | 'open_book'
    promptVerbosity: 'full'
  },
  // Practice Garden — notification trees
  garden: {
    trees: [],
    nightGateTime: '22:30',    // user-set bedtime for Night Gate
    livingVoiceActive: false,  // true when background practice is self-sustaining
  }
};

export function getDefaultFretState(fretId: number): FretState {
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

export function migrateTractionState(state: Record<string, unknown>): TractionState {
  const version = (state._schemaVersion as number) || 0;

  if (version >= CURRENT_TRACTION_SCHEMA) {
    return { ...DEFAULT_STATE, ...state } as TractionState;
  }

  // Schema v0 → v1: Add onboarding fields, garden
  if (version < 1) {
    state.onboardingComplete = state.onboardingComplete ?? false;
    state.commitmentTier = state.commitmentTier ?? null;
    state.journeyStartDate = state.journeyStartDate ?? null;
    state.garden = state.garden ?? { trees: [], nightGateTime: '22:30', livingVoiceActive: false };
    state._persistedAt = state._persistedAt ?? 0;
  }

  // Schema v1 → v2: Add DAG navigation fields
  if (version < 2) {
    state.currentNodeId = state.currentNodeId ?? 'fret-1-class-be';
    state.currentPillar = state.currentPillar ?? 'BE';
    state.completedNodes = state.completedNodes ?? [];
    // Ensure every existing fret has new DAG fields
    const frets = (state.frets as Record<string, Record<string, unknown>>) || {};
    Object.keys(frets).forEach(id => {
      const f = frets[id];
      f.beCompleted = f.beCompleted ?? false;
      f.doCompleted = f.doCompleted ?? false;
      f.playCompleted = f.playCompleted ?? false;
      f.beAttempts = f.beAttempts ?? 0;
      f.doAttempts = f.doAttempts ?? 0;
      f.playAttempts = f.playAttempts ?? 0;
      f.beMastery = f.beMastery ?? 0;
      f.doMastery = f.doMastery ?? 0;
      f.playMastery = f.playMastery ?? 0;
      f.beResonance = f.beResonance ?? false;
      f.doResonance = f.doResonance ?? false;
      f.playResonance = f.playResonance ?? false;
      f.beGatePassed = f.beGatePassed ?? false;
      f.doGatePassed = f.doGatePassed ?? false;
      f.playGatePassed = f.playGatePassed ?? false;
      f.depthExplored = f.depthExplored ?? false;
      f.timeSpentSeconds = f.timeSpentSeconds ?? 0;
    });
  }

  state._schemaVersion = CURRENT_TRACTION_SCHEMA;
  return { ...DEFAULT_STATE, ...state } as TractionState;
}

export function loadTraction(): TractionState {
  try {
    const raw = vvGet(STORAGE_KEYS.TRACTION);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return migrateTractionState(parsed);
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveTraction(state: TractionState): void {
  try {
    const stamped = { ...state, _persistedAt: Date.now() };
    vvSetJSON(STORAGE_KEYS.TRACTION, stamped);
  } catch (e) {
    devWarn('[TractionStore] Failed to save:', e);
  }
}

export function resetTraction(): TractionState {
  vvRemove(STORAGE_KEYS.TRACTION);
  return { ...DEFAULT_STATE };
}

// ── Chapter Progress ──

export function getFretState(state: TractionState, fretId: number): FretState {
  const existing = state.frets[fretId];
  const defaults = getDefaultFretState(fretId);
  if (!existing) return defaults;
  // Merge: existing values override defaults, but new fields from defaults
  // are included (prevents undefined for fields added after student's first session)
  return { ...defaults, ...existing };
}

export function updateFretTraction(state: TractionState, fretId: number, updates: Partial<FretState>): TractionState {
  const current = getFretState(state, fretId);
  const updated = { ...current, ...updates, lastAccessed: new Date().toISOString() };
  
  const newState: TractionState = {
    ...state,
    frets: { ...state.frets, [fretId]: updated }
  };

  // Recalculate total traction and bard level
  const allFrets = Object.values(newState.frets);
  const totalTraction = allFrets.reduce((sum, ch) => sum + ((ch as FretState).traction || 0), 0);
  newState.totalTraction = totalTraction;
  newState.somaticDepth = Math.max(1, Math.floor(totalTraction / 100) + 1);
  newState.bardLevel = newState.somaticDepth;

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

export function recordBreathingSession(state: TractionState, fretId: number): TractionState {
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

export function logPracticeMinutes(state: TractionState, minutes: number): TractionState {
  const today = new Date().toISOString().split('T')[0];
  const isConsecutive = state.lastPracticeDate === today ||
    isYesterday(state.lastPracticeDate);
  
  const newState = {
    ...state,
    practiceMinutes: state.practiceMinutes + minutes,
    lastPracticeDate: today,
    resonanceCycles: isConsecutive ? state.resonanceCycles + (state.lastPracticeDate !== today ? 1 : 0) : 1
  };
  saveTraction(newState);
  return newState;
}

// ── Pitch Room ──

export function updatePitchScore(state: TractionState, points: number): TractionState {
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

function calculateScaffolding(state: TractionState): Settings {
  const avgTraction = state.totalTraction / Math.max(Object.keys(state.frets).length, 1);
  const level = Math.max(0, 1 - (avgTraction / 100));
  
  // Calculate promptVerbosity based on average student traction/mastery
  let promptVerbosity: PromptVerbosity = 'full';
  if (avgTraction >= 75) {
    promptVerbosity = 'silent';
  } else if (avgTraction >= 50) {
    promptVerbosity = 'minimal';
  } else if (avgTraction >= 25) {
    promptVerbosity = 'reduced';
  }
  
  return {
    ...state.settings,
    scaffoldingLevel: level,
    showNoteLabels: avgTraction < 40,
    showFretNumbers: avgTraction < 60,
    showMetronome: avgTraction < 80,
    showCAGEDOverlay: true, // Always available as a toggle
    promptVerbosity
  };
}

// ── Utility ──

function isYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export function getScaffoldingLevel(state: TractionState): number {
  return state.settings?.scaffoldingLevel ?? 1.0;
}

export function isChapterUnlocked(state: TractionState, fretId: number): boolean {
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
export function completeDAGPhase(state: TractionState, fretId: number, phase: 'be' | 'do' | 'play'): TractionState {
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
  const currentMastery = (fretState[masteryKey] as number) || 0;
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
  const attempts = ((fretState[attemptKey] as number) || 0) + 1;
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

  const newState: TractionState = {
    ...state,
    frets: { ...state.frets, [fretId]: updatedFret },
  };

  // Recalculate totals (copied from updateFretTraction)
  const allFrets = Object.values(newState.frets);
  const totalTraction = allFrets.reduce((sum, ch) => sum + ((ch as FretState).traction || 0), 0);
  newState.totalTraction = totalTraction;
  newState.somaticDepth = Math.max(1, Math.floor(totalTraction / 100) + 1);
  newState.bardLevel = newState.somaticDepth;

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
export function attemptDAGPhase(state: TractionState, fretId: number, phase: 'be' | 'do' | 'play'): TractionState {
  const fretState = getFretState(state, fretId);
  const attemptKey = `${phase}Attempts`;
  const masteryKey = `${phase}Mastery`;
  const currentMastery = (fretState[masteryKey] as number) || 0;

  const updatedFret = {
    ...fretState,
    [attemptKey]: ((fretState[attemptKey] as number) || 0) + 1,
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
export function markDepthExplored(state: TractionState, fretId: number): TractionState {
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
export function passSomaticGate(state: TractionState, fretId: number, phase: 'be' | 'do' | 'play'): TractionState {
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
export function getCurrentPhase(state: TractionState, fretId: number): 'be' | 'do' | 'play' | 'complete' {
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
export function setCurrentNode(state: TractionState, nodeId: string): TractionState {
  const newState = {
    ...state,
    currentNodeId: nodeId,
  };
  saveTraction(newState);
  return newState;
}

/**
 * Set the current pillar.
 * @param {Object} state
 * @param {'BE' | 'DO' | 'PLAY' | 'PRODUCE'} pillar
 * @returns {Object} Updated state
 */
export function setCurrentPillar(state: TractionState, pillar: 'BE' | 'DO' | 'PLAY' | 'PRODUCE'): TractionState {
  const newState = {
    ...state,
    currentPillar: pillar,
  };
  saveTraction(newState);
  return newState;
}

/**
 * Advance to the next pillar.
 * @param {Object} state
 * @returns {Object} Updated state
 */
export function advancePillar(state: TractionState): TractionState {
  const order: Array<'BE' | 'DO' | 'PLAY' | 'PRODUCE'> = ['BE', 'DO', 'PLAY', 'PRODUCE'];
  const currentIndex = order.indexOf(state.currentPillar);
  if (currentIndex < order.length - 1) {
    return setCurrentPillar(state, order[currentIndex + 1]);
  }
  return state;
}

/**
 * Mark a DAG node as completed.
 * @param {Object} state
 * @param {string} nodeId
 * @returns {Object} Updated state
 */
export function completeNode(state: TractionState, nodeId: string): TractionState {
  const completed = state.completedNodes || [];
  if (completed.includes(nodeId)) return state;
  
  const newState = {
    ...state,
    completedNodes: [...completed, nodeId],
  };
  saveTraction(newState);
  return newState;
}

/**
 * Merge local and cloud traction states intelligently.
 * Combines progress, counts, and takes the best results without overwriting offline progress.
 * @param {Object} local
 * @param {Object} cloud
 * @returns {Object} Merged state
 */
export function mergeTractionStates(local: TractionState | null, cloud: TractionState | null): TractionState {
  if (!local) return cloud || { ...DEFAULT_STATE };
  if (!cloud) return local || { ...DEFAULT_STATE };

  const merged = { ...DEFAULT_STATE };

  // Booleans and primitives
  merged.onboardingComplete = !!(local.onboardingComplete || cloud.onboardingComplete);
  merged.commitmentTier = local.commitmentTier || cloud.commitmentTier || null;
  merged.journeyStartDate = local.journeyStartDate || cloud.journeyStartDate || null;

  // Simple numeric max
  merged.practiceMinutes = Math.max(local.practiceMinutes || 0, cloud.practiceMinutes || 0);
  merged.resonanceCycles = Math.max(local.resonanceCycles || 0, cloud.resonanceCycles || 0);
  merged.breathingSessions = Math.max(local.breathingSessions || 0, cloud.breathingSessions || 0);
  merged.rhythmSessions = Math.max(local.rhythmSessions || 0, cloud.rhythmSessions || 0);
  merged.pitchSessions = Math.max(local.pitchSessions || 0, cloud.pitchSessions || 0);
  merged.journalEntries = Math.max(local.journalEntries || 0, cloud.journalEntries || 0);
  merged.songsWritten = Math.max(local.songsWritten || 0, cloud.songsWritten || 0);
  merged.xp = Math.max(local.xp || 0, cloud.xp || 0, local.totalTraction || 0, cloud.totalTraction || 0);
  merged.pitchRoomScore = Math.max(local.pitchRoomScore || 0, cloud.pitchRoomScore || 0);
  merged.pitchRoomBestAccuracy = Math.max(local.pitchRoomBestAccuracy || 0, cloud.pitchRoomBestAccuracy || 0);
  merged.streak = Math.max(local.streak || 0, cloud.streak || 0);

  // Arrays
  const completedLocal = local.completedNodes || [];
  const completedCloud = cloud.completedNodes || [];
  merged.completedNodes = [...new Set([...completedLocal, ...completedCloud])];

  const unlockedLocal = local.fretsUnlocked || [];
  const unlockedCloud = cloud.fretsUnlocked || [];
  merged.fretsUnlocked = [...new Set([...unlockedLocal, ...unlockedCloud])];
  if (merged.fretsUnlocked.length === 0) {
    merged.fretsUnlocked = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  // Dates/timestamps
  if ((local.lastPracticeTimestamp || 0) >= (cloud.lastPracticeTimestamp || 0)) {
    merged.lastPracticeDate = local.lastPracticeDate || cloud.lastPracticeDate;
    merged.lastPracticeTimestamp = local.lastPracticeTimestamp || cloud.lastPracticeTimestamp;
  } else {
    merged.lastPracticeDate = cloud.lastPracticeDate || local.lastPracticeDate;
    merged.lastPracticeTimestamp = cloud.lastPracticeTimestamp || local.lastPracticeTimestamp;
  }

  // Current node priority: use the one with more completed nodes overall
  if (completedLocal.length >= completedCloud.length) {
    merged.currentNodeId = local.currentNodeId || cloud.currentNodeId || 'fret-1-class-be';
    merged.currentPillar = local.currentPillar || cloud.currentPillar || 'BE';
  } else {
    merged.currentNodeId = cloud.currentNodeId || local.currentNodeId || 'fret-1-class-be';
    merged.currentPillar = cloud.currentPillar || local.currentPillar || 'BE';
  }

  // Settings
  const localSettings = local.settings || {};
  const cloudSettings = cloud.settings || {};
  merged.settings = {
    showNoteLabels: localSettings.showNoteLabels !== false && cloudSettings.showNoteLabels !== false,
    showFretNumbers: localSettings.showFretNumbers !== false && cloudSettings.showFretNumbers !== false,
    showMetronome: localSettings.showMetronome !== false && cloudSettings.showMetronome !== false,
    showCAGEDOverlay: localSettings.showCAGEDOverlay !== false && cloudSettings.showCAGEDOverlay !== false,
    sandboxMode: !!(localSettings.sandboxMode || cloudSettings.sandboxMode),
    aiEnabled: localSettings.aiEnabled !== false && cloudSettings.aiEnabled !== false,
    gameEnabled: localSettings.gameEnabled !== false && cloudSettings.gameEnabled !== false,
    disableBreathingGates: !!(localSettings.disableBreathingGates || cloudSettings.disableBreathingGates),
    scaffoldingLevel: Math.min(localSettings.scaffoldingLevel ?? 1.0, cloudSettings.scaffoldingLevel ?? 1.0),
    globalMode: cloudSettings.globalMode || localSettings.globalMode || 'truebadour_trial',
    promptVerbosity: cloudSettings.promptVerbosity || localSettings.promptVerbosity || 'full',
  };

  // Garden
  merged.garden = {
    trees: cloud.garden?.trees || local.garden?.trees || [],
    nightGateTime: cloud.garden?.nightGateTime || local.garden?.nightGateTime || '22:30',
    livingVoiceActive: !!(cloud.garden?.livingVoiceActive || local.garden?.livingVoiceActive),
  };

  // Frets
  const allFretIds = new Set([
    ...Object.keys(local.frets || {}),
    ...Object.keys(cloud.frets || {})
  ]);

  merged.frets = {};
  allFretIds.forEach(id => {
    const fId = parseInt(id, 10);
    const lFret = local.frets?.[id] || {};
    const cFret = cloud.frets?.[id] || {};

    merged.frets[id] = {
      id: fId,
      yinCompleted: !!(lFret.yinCompleted || cFret.yinCompleted),
      yangCompleted: !!(lFret.yangCompleted || cFret.yangCompleted),
      breathingGateCleared: !!(lFret.breathingGateCleared || cFret.breathingGateCleared),
      traction: Math.max(lFret.traction || 0, cFret.traction || 0),
      pitchAccuracy: Math.max(lFret.pitchAccuracy || 0, cFret.pitchAccuracy || 0),
      tensionScore: Math.min(lFret.tensionScore ?? 100, cFret.tensionScore ?? 100),
      attempts: Math.max(lFret.attempts || 0, cFret.attempts || 0),
      lastAccessed: lFret.lastAccessed && cFret.lastAccessed
        ? (new Date(lFret.lastAccessed) >= new Date(cFret.lastAccessed) ? lFret.lastAccessed : cFret.lastAccessed)
        : (lFret.lastAccessed || cFret.lastAccessed || null),
      meditationSeconds: Math.max(lFret.meditationSeconds || 0, cFret.meditationSeconds || 0),
      exercisesCompleted: [...new Set([...(lFret.exercisesCompleted || []), ...(cFret.exercisesCompleted || [])])],
      
      // DAG properties
      beCompleted: !!(lFret.beCompleted || cFret.beCompleted),
      doCompleted: !!(lFret.doCompleted || cFret.doCompleted),
      playCompleted: !!(lFret.playCompleted || cFret.playCompleted),
      beAttempts: Math.max(lFret.beAttempts || 0, cFret.beAttempts || 0),
      doAttempts: Math.max(lFret.doAttempts || 0, cFret.doAttempts || 0),
      playAttempts: Math.max(lFret.playAttempts || 0, cFret.playAttempts || 0),
      beMastery: Math.max(lFret.beMastery || 0, cFret.beMastery || 0),
      doMastery: Math.max(lFret.doMastery || 0, cFret.doMastery || 0),
      playMastery: Math.max(lFret.playMastery || 0, cFret.playMastery || 0),
      depthExplored: !!(lFret.depthExplored || cFret.depthExplored),
      timeSpentSeconds: Math.max(lFret.timeSpentSeconds || 0, cFret.timeSpentSeconds || 0),
      beResonance: !!(lFret.beResonance || cFret.beResonance),
      doResonance: !!(lFret.doResonance || cFret.doResonance),
      playResonance: !!(lFret.playResonance || cFret.playResonance),
      beGatePassed: !!(lFret.beGatePassed || cFret.beGatePassed),
      doGatePassed: !!(lFret.doGatePassed || cFret.doGatePassed),
      playGatePassed: !!(lFret.playGatePassed || cFret.playGatePassed),
    };
  });

  // Re-calculate derived values
  const allFrets = Object.values(merged.frets);
  const totalTraction = allFrets.reduce((sum, ch) => sum + (ch.traction || 0), 0);
  merged.totalTraction = totalTraction;
  merged.somaticDepth = Math.max(local.somaticDepth || 1, cloud.somaticDepth || 1, Math.floor(totalTraction / 100) + 1);
  merged.bardLevel = merged.somaticDepth;

  return merged;
}
