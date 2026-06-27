import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAcousticMemory } from '../useAcousticMemory';
import usePitchDetector from '../usePitchDetector';

// Mock the pitch detector
vi.mock('../usePitchDetector', () => ({
  default: vi.fn(),
}));

describe('useAcousticMemory Hook', () => {
  let mockPitchDetector;

  beforeEach(() => {
    vi.useFakeTimers();
    mockPitchDetector = {
      noteInfo: null,
      startListening: vi.fn(),
      stopListening: vi.fn(),
      isListening: false,
    };
    usePitchDetector.mockReturnValue(mockPitchDetector);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with an empty memory and null summary', () => {
    const { result } = renderHook(() => useAcousticMemory());
    expect(result.current.memory).toEqual([]);
    expect(result.current.getMemoryString()).toBeNull();
  });

  it('adds events to memory correctly based on pitchDetector', () => {
    const { result, rerender } = renderHook(() => useAcousticMemory());
    
    // Simulate detecting a note
    act(() => {
      mockPitchDetector.noteInfo = { name: 'C4', cents: 5, midi: 60 };
      rerender();
    });

    expect(result.current.memory.length).toBe(1);
    expect(result.current.memory[0].note).toBe('C4');
    expect(result.current.memory[0].time).toBeDefined();
  });

  it('generates a summary string correctly and clears memory', () => {
    const { result, rerender } = renderHook(() => useAcousticMemory());
    
    act(() => {
      mockPitchDetector.noteInfo = { name: 'C4', cents: 5 };
      rerender();
    });

    act(() => {
      // Must advance timer by more than 2 seconds (the debounce in the hook)
      vi.advanceTimersByTime(2500);
      mockPitchDetector.noteInfo = { name: 'E4', cents: -2 };
      rerender();
    });

    const summary = result.current.getMemoryString();
    expect(summary).toContain('C4');
    expect(summary).toContain('E4');

    act(() => {
      result.current.clearMemory();
    });
    
    expect(result.current.memory.length).toBe(0);
    expect(result.current.getMemoryString()).toBeNull();
  });

  it('prunes old events outside the window', () => {
    const { result, rerender } = renderHook(() => useAcousticMemory(5000));
    
    act(() => {
      mockPitchDetector.noteInfo = { name: 'C4', cents: 0 };
      rerender();
    });

    expect(result.current.memory.length).toBe(1);

    act(() => {
      vi.advanceTimersByTime(6000);
      mockPitchDetector.noteInfo = { name: 'G4', cents: 0 };
      rerender();
    });

    // C4 should be pruned, only G4 should remain
    expect(result.current.memory.length).toBe(1);
    expect(result.current.memory[0].note).toBe('G4');
  });
});
