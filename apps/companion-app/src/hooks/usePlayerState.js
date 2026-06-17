// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : usePlayerState.js                                    ║
// ║ WHAT    : Tracks the four invisible engine metrics:            ║
// ║           Tone · Resonance · Buzz · Voice                     ║
// ║ WHY     : Gives the Truebadour context without exposing        ║
// ║           complexity to the learner. ZEN Law: learner only     ║
// ║           sees BE→DO→PLAY and 12 frets. This runs underneath. ║
// ║ WHO     : consumed by TruebadourProvider, injected into        ║
// ║           system prompt via getTruebadourModifier()           ║
// ║ PERSISTS: localStorage voixvive_player_state                  ║
// ╚════════════════════════════════════════════════════════════════╝
import { useState, useCallback, useEffect } from 'react';
import { vvGet, vvGetJSON, vvSetJSON } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ─── Tone Levels (set by BE check-in) ───────────────────────────
// 1 = low (tired/anxious)   → gentle Truebadour, shorter prompts
// 2 = mid (okay)            → balanced
// 3 = high (focused/ready)  → full depth, challenge mode
const TONE = { LOW: 1, MID: 2, HIGH: 3 };

// ─── BE check-in answer → Tone mapping ──────────────────────────
// These match the somatic options in OnboardingModal / session start
const BE_TO_TONE = {
  // Low tone states
  tired: TONE.LOW,
  anxious: TONE.LOW,
  overwhelmed: TONE.LOW,
  sad: TONE.LOW,
  // Mid tone states
  okay: TONE.MID,
  distracted: TONE.MID,
  curious: TONE.MID,
  // High tone states
  focused: TONE.HIGH,
  energized: TONE.HIGH,
  excited: TONE.HIGH,
  ready: TONE.HIGH,
};

// ─── Distortion thresholds ──────────────────────────────────────
// Like a guitar signal: clean tone can break up under pressure.
// At full distortion the Truebadour shifts to reflection mode.
const DISTORTION_BREAKING = 1; // 1 abandoned session → signal breaking up
const DISTORTION_FULL     = 3; // 3 consecutive → fully distorted (reflect first)

const STORAGE_KEY = STORAGE_KEYS.PLAYER_STATE;

function loadPersistedState() {
  try {
    return vvGetJSON(STORAGE_KEY, null);
  } catch { /* ignore */ }
  return null;
}

function saveState(state) {
  try {
    vvSetJSON(STORAGE_KEY, state);
  } catch { /* ignore */ }
}

// ─── Default state ───────────────────────────────────────────────
function defaultState() {
  return {
    tone: TONE.MID,           // Set fresh each session by BE check-in
    resonance: 0,             // 0–100: builds with streak + completions
    buzz: 0,                  // 0–100: friction (resets on completion)
    voice: 0,                 // 0–∞: long-horizon mastery (never resets)
    distortion: 'clean',      // 'clean' | 'breaking up' | 'distorted' | 'dialed in'
    negativeStreak: 0,        // consecutive rough sessions
    lastBEAnswer: null,       // most recent check-in answer
    sessionCount: 0,          // total sessions started
    completedSessions: 0,     // sessions that reached PLAY phase
    currentStreak: 0,         // practice day streak (from localStorage)
  };
}

export function usePlayerState() {
  const [state, setState] = useState(() => {
    const persisted = loadPersistedState();
    return persisted ? { ...defaultState(), ...persisted } : defaultState();
  });

  // Persist whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // ── Sync streak from existing voixvive_last_practice key ────────
  useEffect(() => {
    try {
      const last = vvGet(STORAGE_KEYS.LAST_PRACTICE);
      if (!last) return;
      const days = Math.floor((Date.now() - parseInt(last, 10)) / 86400000);
      const streakRaw = vvGet(STORAGE_KEYS.STREAK);
      const streak = streakRaw ? parseInt(streakRaw, 10) : 0;
      if (days <= 1 && streak > 0) {
        setState(s => ({ ...s, currentStreak: streak }));
      }
    } catch { /* ignore */ }
  }, []);

  // ── BE check-in: learner answers "how am I today?" ───────────
  const recordBECheckIn = useCallback((answer) => {
    const tone = BE_TO_TONE[answer?.toLowerCase()] ?? TONE.MID;
    setState(s => ({
      ...s,
      tone,
      lastBEAnswer: answer,
      sessionCount: s.sessionCount + 1,
      // Reset buzz slightly each new session start
      buzz: Math.max(0, s.buzz - 10),
    }));
  }, []);

  // ── Session completed (reached PLAY phase) ────────────────────
  const recordSessionComplete = useCallback(() => {
    setState(s => {
      const resonance    = Math.min(100, s.resonance + 8 + (s.currentStreak > 6 ? 4 : 0));
      const buzz         = Math.max(0, s.buzz - 15);
      const voice        = s.voice + 1;
      const negativeStreak = 0;
      const distortion   = 'clean'; // completing a session clears the signal
      return { ...s, resonance, buzz, voice, negativeStreak, distortion, completedSessions: s.completedSessions + 1 };
    });
  }, []);

  // ── Session abandoned (opened but didn't reach PLAY) ─────────
  const recordSessionAbandoned = useCallback(() => {
    setState(s => {
      const buzz           = Math.min(100, s.buzz + 12);
      const negativeStreak = s.negativeStreak + 1;
      const distortion     = negativeStreak >= DISTORTION_FULL     ? 'distorted'
                           : negativeStreak >= DISTORTION_BREAKING ? 'breaking up'
                           : s.distortion;
      const resonance      = Math.max(0, s.resonance - 3);
      return { ...s, buzz, negativeStreak, distortion, resonance };
    });
  }, []);

  // ── Reflection journal saved: processes dissonance ───────────
  // recordReflection: student wrote in journal / took a breath
  // Signal goes from distorted → dialed in → clean
  const recordReflection = useCallback(() => {
    setState(s => ({
      ...s,
      distortion: 'dialed in',
      negativeStreak: 0,
      buzz: Math.max(0, s.buzz - 20),
    }));
    // After cool-down period, fully clean tone
    setTimeout(() => {
      setState(s => ({ ...s, distortion: s.distortion === 'dialed in' ? 'clean' : s.distortion }));
    }, 30000);
  }, []);

  // ── Mastery star awarded on a fret ────────────────────────────
  const recordMasteryGain = useCallback(() => {
    setState(s => ({
      ...s,
      resonance: Math.min(100, s.resonance + 5),
      voice: s.voice + 3,
      buzz: Math.max(0, s.buzz - 5),
    }));
  }, []);

  // ── getTruebadourModifier ──────────────────────────────────────
  // Returns a terse string injected into the Truebadour system prompt.
  // The learner NEVER sees this. It shapes how the Truebadour speaks.
  const getTruebadourModifier = useCallback(() => {
    const { tone, resonance, distortion, currentStreak } = state;

    const toneLabel = tone === TONE.HIGH ? 'focused and ready'
                    : tone === TONE.LOW  ? 'tired or anxious'
                    : 'present but casual';

    const momentumNote = resonance > 60
      ? `They have strong momentum (${currentStreak}-day streak).`
      : resonance < 20
      ? 'Their momentum is low — this may be a restart.'
      : '';

    // Guitar signal metaphor: is the tone clean or distorted?
    const signalNote = distortion === 'distorted'
      ? 'IMPORTANT: This student has had a rough few sessions. Do NOT drill technique. Ask one open question about how music feels right now. Give them space.'
      : distortion === 'breaking up'
      ? 'This student seems a little stuck lately. Stay warm and curious — no pressure.'
      : '';

    return [
      `[Student tone: ${toneLabel}.]`,
      momentumNote,
      signalNote,
    ].filter(Boolean).join(' ');
  }, [state]);

  return {
    // State (engine internal — don't expose raw to UI)
    tone: state.tone,
    resonance: state.resonance,
    buzz: state.buzz,
    voice: state.voice,
    distortion: state.distortion, // 'clean' | 'breaking up' | 'distorted' | 'dialed in'
    currentStreak: state.currentStreak,

    // Actions
    recordBECheckIn,
    recordSessionComplete,
    recordSessionAbandoned,
    recordReflection,
    recordMasteryGain,

    // Truebadour injection
    getTruebadourModifier,

    // Constants (for any UI that needs them, e.g. legend)
    TONE,
  };
}
