// Regression test for C2 fix: double-init guard in useKokoroWebTTS
// This test ensures the hook doesn't initialize TTS engine twice

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useKokoroWebTTS } from './useKokoroWebTTS';

// Mock kokoro-js package (heavy WASM module — must be mocked to avoid worker crash)
const mockGenerate = vi.fn().mockResolvedValue({
  audio: new Float32Array([0, 0.5, 1]),
  sampling_rate: 24000
});

const mockFromPretrained = vi.fn().mockResolvedValue({
  generate: mockGenerate
});

vi.mock('kokoro-js', () => ({
  KokoroTTS: {
    from_pretrained: (...args) => mockFromPretrained(...args)
  }
}));

// Mock audio engine
vi.mock('../audio/audioEngine', () => ({
  getAudioContext: vi.fn(() => ({
    createBuffer: vi.fn(() => ({
      getChannelData: vi.fn(() => new Float32Array([0, 0.5, 1]))
    })),
    createBufferSource: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null,
      detune: { value: 0 },
      buffer: null
    })),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: { value: 1 }
    })),
    destination: {},
    state: 'running',
    resume: vi.fn().mockResolvedValue(undefined)
  })),
  resumeAudio: vi.fn(() => ({
    createBuffer: vi.fn(() => ({
      getChannelData: vi.fn(() => new Float32Array([0, 0.5, 1]))
    })),
    createBufferSource: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null,
      detune: { value: 0 },
      buffer: null
    })),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: { value: 1 }
    })),
    destination: {},
    state: 'running',
    resume: vi.fn().mockResolvedValue(undefined)
  }))
}));

describe('useKokoroWebTTS Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('C2-FIX-001: Does not double-initialize TTS engine', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    // Simulate rapid initialization attempts
    await act(async () => {
      const init1 = result.current.init();
      const init2 = result.current.init();
      const init3 = result.current.init();

      await Promise.all([init1, init2, init3]);
    });

    // Should only initialize once
    expect(mockFromPretrained).toHaveBeenCalledTimes(1);
    expect(result.current.isReady).toBe(true);
  });

  test('C2-FIX-002: Unmount does not crash and hook returns stable state', async () => {
    const { result, unmount } = renderHook(() => useKokoroWebTTS());

    // Initialize
    await act(async () => {
      await result.current.init();
    });

    expect(result.current.isReady).toBe(true);

    // Unmount component — should not throw
    unmount();
  });

  test('C2-FIX-003: Cancel resets isSpeaking state', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    // Initialize
    await act(async () => {
      await result.current.init();
    });

    expect(result.current.isSpeaking).toBe(false);

    // Cancel should safely reset state even when nothing is playing
    act(() => {
      result.current.cancel();
    });

    expect(result.current.isSpeaking).toBe(false);
  });
});
