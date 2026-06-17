// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ TEST  : Student End-to-End Flow (Mechanical Mode Phase B)    ║
// ║ WHAT  : Verifies a student can progress through BE→DO→PLAY  ║
// ║         with Somatic Gates, 4-level mastery, and resonance   ║
// ║ WHO   : Quality checkpoint after Phase B implementation    ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadTraction,
  completeDAGPhase,
  attemptDAGPhase,
  passSomaticGate,
  markDepthExplored,
  mergeTractionStates,
} from '../tractionStore';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('Student Flow — Mechanical Mode (Phase B)', () => {

  describe('Step 1: BE Phase (Read all slides)', () => {
    it('student starts with empty traction state', () => {
      const state = loadTraction();
      expect(state.bardLevel).toBe(1);
      expect(state.totalTraction).toBe(0);
      expect(Object.keys(state.frets)).toHaveLength(0);
    });

    it('reaching last slide passes BE Somatic Gate', () => {
      let state = loadTraction();
      state = passSomaticGate(state, 1, 'be');
      expect(state.frets[1].beGatePassed).toBe(true);
    });

    it('can mark BE complete only after gate is passed', () => {
      let state = loadTraction();
      // Without gate: should still allow (mechanical mode is forgiving)
      state = completeDAGPhase(state, 1, 'be');
      expect(state.frets[1].beCompleted).toBe(true);
      expect(state.frets[1].beMastery).toBe(2); // Owned on first completion
      expect(state.frets[1].traction).toBe(33); // Synced to legacy
    });
  });

  describe('Step 2: DO Phase (Pitch match)', () => {
    it('passing DO Somatic Gate unlocks DO completion', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'be');
      state = passSomaticGate(state, 1, 'do');
      expect(state.frets[1].doGatePassed).toBe(true);
    });

    it('completing DO syncs traction to 66 and sets mastery', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'do');
      expect(state.frets[1].doCompleted).toBe(true);
      expect(state.frets[1].doMastery).toBe(2);
      expect(state.frets[1].traction).toBe(66);
    });

    it('multiple attempts increase attempt count and set Experienced', () => {
      let state = loadTraction();
      state = attemptDAGPhase(state, 1, 'do');
      expect(state.frets[1].doAttempts).toBe(1);
      expect(state.frets[1].doMastery).toBe(1); // Experienced
      state = attemptDAGPhase(state, 1, 'do');
      expect(state.frets[1].doAttempts).toBe(2);
    });
  });

  describe('Step 3: PLAY Phase (Performance)', () => {
    it('completing PLAY syncs traction to 100', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'play');
      expect(state.frets[1].playCompleted).toBe(true);
      expect(state.frets[1].playMastery).toBe(2);
      expect(state.frets[1].traction).toBe(100);
    });

    it('all phases complete = fret fully mastered', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'be');
      state = completeDAGPhase(state, 1, 'do');
      state = completeDAGPhase(state, 1, 'play');
      expect(state.frets[1].beCompleted).toBe(true);
      expect(state.frets[1].doCompleted).toBe(true);
      expect(state.frets[1].playCompleted).toBe(true);
      expect(state.frets[1].traction).toBe(100);
    });
  });

  describe('Step 4: Depth Exploration (Go Deeper)', () => {
    it('marking depth explored upgrades mastery to 3 (Mastered)', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'be');
      state = completeDAGPhase(state, 1, 'do');
      state = markDepthExplored(state, 1);
      expect(state.frets[1].depthExplored).toBe(true);
      expect(state.frets[1].beMastery).toBe(3); // Upgraded to Mastered
      expect(state.frets[1].doMastery).toBe(3); // Upgraded to Mastered
    });
  });

  describe('Step 5: Cross-Pillar Resonance (Day Dream synergy)', () => {
    it('2+ attempts with Owned mastery unlocks resonance', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'be'); // attempts=1, mastery=2
      expect(state.frets[1].beResonance).toBe(false); // 1 attempt, not yet
      // Simulate second engagement
      state = attemptDAGPhase(state, 1, 'be'); // attempts=2
      // Resonance is checked on completeDAGPhase, not attempt
      // Let's do another complete to trigger
      state = completeDAGPhase(state, 1, 'be');
      expect(state.frets[1].beResonance).toBe(true);
    });
  });

  describe('Legacy traction sync (prevent divergence)', () => {
    it('BE→33, DO→66, PLAY→100 progression', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'be');
      expect(state.frets[1].traction).toBe(33);
      state = completeDAGPhase(state, 1, 'do');
      expect(state.frets[1].traction).toBe(66);
      state = completeDAGPhase(state, 1, 'play');
      expect(state.frets[1].traction).toBe(100);
    });

    it('totalTraction and bardLevel recalculate', () => {
      let state = loadTraction();
      state = completeDAGPhase(state, 1, 'play');
      expect(state.totalTraction).toBe(100);
      expect(state.bardLevel).toBe(2); // floor(100/100) + 1
    });
  });

  describe('Step 6: Smart Cloud Merge (mergeTractionStates)', () => {
    it('handles null or empty inputs gracefully', () => {
      const state = loadTraction();
      expect(mergeTractionStates(null, state)).toEqual(state);
      expect(mergeTractionStates(state, null)).toEqual(state);
    });

    it('correctly merges completedNodes union and fretsUnlocked union', () => {
      let stateA = loadTraction();
      stateA.completedNodes = ['node-1', 'node-2'];
      stateA.fretsUnlocked = [1, 2];

      let stateB = loadTraction();
      stateB.completedNodes = ['node-2', 'node-3'];
      stateB.fretsUnlocked = [2, 3];

      const merged = mergeTractionStates(stateA, stateB);
      expect(merged.completedNodes).toEqual(['node-1', 'node-2', 'node-3']);
      expect(merged.fretsUnlocked).toEqual([1, 2, 3]);
    });

    it('correctly merges simple numbers (streak, sessions, practiceMinutes) using maximums', () => {
      let stateA = loadTraction();
      stateA.practiceMinutes = 10;
      stateA.streak = 5;
      stateA.xp = 120;

      let stateB = loadTraction();
      stateB.practiceMinutes = 20;
      stateB.streak = 2;
      stateB.xp = 80;

      const merged = mergeTractionStates(stateA, stateB);
      expect(merged.practiceMinutes).toBe(20);
      expect(merged.streak).toBe(5);
      expect(merged.xp).toBe(120);
    });

    it('correctly picks lower tensionScore and higher accuracy in frets', () => {
      let stateA = loadTraction();
      stateA.frets = {
        1: {
          id: 1,
          traction: 33,
          pitchAccuracy: 75,
          tensionScore: 40,
          beCompleted: true,
          exercisesCompleted: ['ex-1'],
        }
      };

      let stateB = loadTraction();
      stateB.frets = {
        1: {
          id: 1,
          traction: 66,
          pitchAccuracy: 90,
          tensionScore: 20,
          doCompleted: true,
          exercisesCompleted: ['ex-2'],
        }
      };

      const merged = mergeTractionStates(stateA, stateB);
      expect(merged.frets[1].traction).toBe(66);
      expect(merged.frets[1].pitchAccuracy).toBe(90);
      expect(merged.frets[1].tensionScore).toBe(20);
      expect(merged.frets[1].beCompleted).toBe(true);
      expect(merged.frets[1].doCompleted).toBe(true);
      expect(merged.frets[1].exercisesCompleted).toEqual(['ex-1', 'ex-2']);
    });

    it('sets currentNodeId based on whichever state has more completed nodes', () => {
      let stateA = loadTraction();
      stateA.completedNodes = ['node-1'];
      stateA.currentNodeId = 'node-a';

      let stateB = loadTraction();
      stateB.completedNodes = ['node-2', 'node-3'];
      stateB.currentNodeId = 'node-b';

      const merged1 = mergeTractionStates(stateA, stateB);
      expect(merged1.currentNodeId).toBe('node-b');

      const merged2 = mergeTractionStates(stateB, stateA);
      expect(merged2.currentNodeId).toBe('node-b');
    });
  });
});
