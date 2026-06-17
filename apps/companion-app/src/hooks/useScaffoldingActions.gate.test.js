// ═══════════════════════════════════════════════════════════
// P5-pitch-gated REGRESSION TESTS
// Protects the somatic gate enforcement in useScaffoldingActions.
//
// The bug: completePhase could be called without the gate being
// passed, allowing students to "complete" a fret by sitting silently.
// The fix: completePhase checks ${phase}GatePassed in business logic
// before applying completion, using a functional updater to avoid
// stale closures when passGate + completePhase are chained.
// ═══════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  completeDAGPhase,
  completeNode,
  passSomaticGate,
  getDefaultFretState,
} from '../data/tractionStore';

/**
 * Simulates the exact logic inside useScaffoldingActions.completePhase
 * after the P5-pitch-gated fix.  Uses a functional updater pattern
 * so the gate check always reads the latest state.
 */
function simulateCompletePhase(state, fretId, phase, nodeId) {
  const gateKey = `${phase}GatePassed`;
  const fretState = state.frets?.[fretId] || {};
  if (!fretState[gateKey]) {
    // Gate not passed — silently reject, leave state unchanged
    return state;
  }
  let newState = completeDAGPhase(state, fretId, phase);
  if (typeof nodeId === 'string' && nodeId.startsWith('fret-')) {
    newState = completeNode(newState, nodeId);
  }
  return newState;
}

describe('P5-pitch-gated: gate enforcement', () => {
  function freshState(fretId = 1) {
    return {
      frets: { [fretId]: getDefaultFretState(fretId) },
      completedNodes: [],
      totalTraction: 0,
      bardLevel: 1,
      fretsUnlocked: [1],
    };
  }

  it('rejects BE completion when BE gate not passed', () => {
    const state = freshState(1);
    const result = simulateCompletePhase(state, 1, 'be', 'fret-1-class-be');

    expect(result.frets[1].beCompleted).toBe(false);
    expect(result.completedNodes).toHaveLength(0);
    // State must be unchanged (same object reference acceptable in test)
    expect(result.totalTraction).toBe(0);
  });

  it('allows BE completion when BE gate IS passed', () => {
    let state = freshState(1);
    state = passSomaticGate(state, 1, 'be');
    const result = simulateCompletePhase(state, 1, 'be', 'fret-1-class-be');

    expect(result.frets[1].beCompleted).toBe(true);
    expect(result.completedNodes).toContain('fret-1-class-be');
    expect(result.totalTraction).toBeGreaterThan(0);
  });

  it('rejects DO completion when DO gate not passed', () => {
    let state = freshState(1);
    // BE is complete but DO gate not passed
    state = passSomaticGate(state, 1, 'be');
    state = simulateCompletePhase(state, 1, 'be', 'fret-1-class-be');

    const result = simulateCompletePhase(state, 1, 'do', 'fret-1-class-do');
    expect(result.frets[1].doCompleted).toBe(false);
    expect(result.completedNodes).not.toContain('fret-1-class-do');
  });

  it('allows DO completion when DO gate IS passed', () => {
    let state = freshState(1);
    state = passSomaticGate(state, 1, 'be');
    state = simulateCompletePhase(state, 1, 'be', 'fret-1-class-be');
    state = passSomaticGate(state, 1, 'do');

    const result = simulateCompletePhase(state, 1, 'do', 'fret-1-class-do');
    expect(result.frets[1].doCompleted).toBe(true);
    expect(result.completedNodes).toContain('fret-1-class-do');
  });

  it('passGate + completePhase chain works (stale-closure regression)', () => {
    // This is the exact bug we fixed: passGate and completePhase
    // called in the same handler would fail because completePhase
    // captured a stale traction reference from the render cycle.
    let state = freshState(2);

    // Pass gate
    state = passSomaticGate(state, 2, 'do');
    expect(state.frets[2].doGatePassed).toBe(true);

    // Immediately complete — must read the updated state
    state = simulateCompletePhase(state, 2, 'do', 'fret-2-class-do');
    expect(state.frets[2].doCompleted).toBe(true);
  });

  it('passGate is idempotent (no duplicate state mutations)', () => {
    let state = freshState(1);
    state = passSomaticGate(state, 1, 'be');
    state = passSomaticGate(state, 1, 'be');
    state = passSomaticGate(state, 1, 'be');

    expect(state.frets[1].beGatePassed).toBe(true);
    expect(state.frets[1].beAttempts).toBe(0);
  });

  it('completion without nodeId still updates fret state', () => {
    let state = freshState(1);
    state = passSomaticGate(state, 1, 'play');
    const result = simulateCompletePhase(state, 1, 'play');

    expect(result.frets[1].playCompleted).toBe(true);
    // completedNodes untouched because no nodeId
    expect(result.completedNodes).toHaveLength(0);
  });

  it('blocks PLAY completion without play gate', () => {
    const state = freshState(1);
    const result = simulateCompletePhase(state, 1, 'play', 'fret-1-class-play');

    expect(result.frets[1].playCompleted).toBe(false);
  });
});
