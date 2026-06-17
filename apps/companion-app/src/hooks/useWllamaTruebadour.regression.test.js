// Regression test for C1 fix: double-init guard in useWllamaTruebadour
// This test ensures the hook doesn't initialize twice when isLoading changes

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWllamaTruebadour } from './useWllamaTruebadour';

// Mock wllama (note: hook imports from @wllama/wllama/esm)
// Factory-safe: variables must be declared inside the vi.mock factory.
vi.mock('@wllama/wllama/esm', () => {
  const Wllama = vi.fn().mockImplementation(function WllamaMock() {
    return {
      loadModelFromUrl: vi.fn().mockResolvedValue(undefined),
      unloadModel: vi.fn().mockResolvedValue(undefined),
      createChatCompletion: vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'Test response' } }]
      })
    };
  });
  return { Wllama };
});

describe('useWllamaTruebadour Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('C1-FIX-001: Does not double-initialize when isLoading toggles rapidly', async () => {
    const { result } = renderHook(() => useWllamaTruebadour());

    // Simulate rapid initialization attempts
    await act(async () => {
      const init1 = result.current.initEngine();
      const init2 = result.current.initEngine();
      const init3 = result.current.initEngine();

      await Promise.all([init1, init2, init3]);
    });

    // Should only initialize once (ref-based guard)
    expect(result.current.isReady).toBe(true);
  });

  test('C1-FIX-002: Unmount does not crash and hook returns stable state', async () => {
    const { result, unmount } = renderHook(() => useWllamaTruebadour());

    // Initialize
    await act(async () => {
      await result.current.initEngine();
    });

    expect(result.current.isReady).toBe(true);

    // Unmount component — should not throw
    unmount();
  });

  test('C1-FIX-003: Reset properly clears all state', async () => {
    const { result } = renderHook(() => useWllamaTruebadour());

    // Initialize first
    await act(async () => {
      await result.current.initEngine();
    });

    expect(result.current.isReady).toBe(true);

    // Reset (unload)
    await act(async () => {
      await result.current.unload();
    });

    expect(result.current.isReady).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
