// ═══════════════════════════════════════════════════════════
// TRACTION STORE — LocalStorage-backed progress system
// Tracks per-chapter mastery, somatic readiness, and overall Bard Level
// Implements the Autopoietic Scaffolding Fade system
// ═══════════════════════════════════════════════════════════

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
  pitchRoomHighScore: 0,
  settings: {
    showNoteLabels: true,
    showFretNumbers: true,
    showMetronome: true,
    showCAGEDOverlay: true,
    scaffoldingLevel: 1.0 // 1.0 = full scaffolding, 0.0 = none
  }
};

function getDefaultFretState(fretId) {
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
    exercisesCompleted: []
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
  return state.frets[fretId] || getDefaultFretState(fretId);
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
    pitchRoomHighScore: Math.max(state.pitchRoomHighScore, newScore)
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
