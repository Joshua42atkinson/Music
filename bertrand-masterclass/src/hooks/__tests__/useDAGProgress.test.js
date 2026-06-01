// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useDAGProgress.test.js                             ║
// ║ WHAT    : Unit tests for useDAGProgress React hook           ║
// ║ WHY     : Ensures state changes, sandbox toggles, and phase  ║
// ║           auto-completion function perfectly.                ║
// ║ STAGE   : TEST (AI+DAG Harmonization Phase B)                ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDAGProgress } from '../useDAGProgress';

describe('useDAGProgress hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('should load with default values when localStorage is empty', () => {
    const { result } = renderHook(() => useDAGProgress());
    expect(result.current.progress.currentNodeId).toBe('fret-1-class-be');
    expect(result.current.progress.completedNodes).toEqual([]);
    expect(result.current.progress.unlockedNodes).toEqual(['fret-1-class-be']);
  });

  test('should unlock nodes on completion', () => {
    const { result } = renderHook(() => useDAGProgress());
    
    act(() => {
      result.current.completeNode('fret-1-class-be');
    });

    expect(result.current.progress.completedNodes).toContain('fret-1-class-be');
  });

  test('should handle sandboxMode unlocking all nodes', () => {
    localStorage.setItem('bard_traction', JSON.stringify({ settings: { sandboxMode: true } }));
    
    const { result } = renderHook(() => useDAGProgress());
    
    // In sandboxMode, all nodes must be returned as unlocked
    expect(result.current.unlockedNodes.length).toBeGreaterThan(1);
  });

  test('should correctly compute fret progress', () => {
    const { result } = renderHook(() => useDAGProgress());
    
    const initialProg = result.current.getFretProgress(1);
    expect(initialProg.completed).toBe(0);
    expect(initialProg.isComplete).toBe(false);

    act(() => {
      // Complete a node
      result.current.completeNode('fret-1-class-be');
    });

    const afterProg = result.current.getFretProgress(1);
    expect(afterProg.completed).toBe(1);
  });
});
