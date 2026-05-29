import { describe, it, expect } from 'vitest';
import { completeDAGPhase, completeNode, getDefaultFretState } from '../tractionStore.js';
import { isNodeUnlocked, getNodeById } from '../dag/dagEdges.js';

describe('completePhase chain', () => {
  it('marks BE phase and node, unlocking DO', () => {
    // Fresh state
    let state = {
      frets: {},
      completedNodes: [],
      totalTraction: 0,
      bardLevel: 1,
    };

    // Simulate reaching last slide (auto-marks yin + gate)
    state = {
      ...state,
      frets: {
        ...state.frets,
        1: { ...getDefaultFretState(1), yinCompleted: true, beGatePassed: true }
      }
    };

    // Simulate clicking "Mark BE Phase Complete"
    state = completeDAGPhase(state, 1, 'be');
    state = completeNode(state, 'fret-1-class-be');

    // Verify state
    expect(state.frets[1].beCompleted).toBe(true);
    expect(state.completedNodes).toContain('fret-1-class-be');

    // Verify DO unlocks
    const doUnlocked = isNodeUnlocked('fret-1-class-do', state.completedNodes);
    expect(doUnlocked).toBe(true);
  });
});
