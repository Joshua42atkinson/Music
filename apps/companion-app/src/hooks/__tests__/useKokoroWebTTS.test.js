import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKokoroWebTTS } from '../useKokoroWebTTS';

// ── Mock variables (must be declared BEFORE vi.mock calls) ──────
const mockGenerate = vi.fn();
const mockFromPretrained = vi.fn();
const mockAudioContext = {
  state: 'running',
  destination: {},
  sampleRate: 44100,
  createBuffer: vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(100)),
    length: 100,
    numberOfChannels: 1,
    sampleRate: 44100,
  })),
  createBufferSource: vi.fn(() => {
    const source = {
      buffer: null,
      detune: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(function() {
        // Simulate playback completion by triggering onended in a microtask
        Promise.resolve().then(() => {
          if (source.onended) source.onended();
        });
      }),
      stop: vi.fn(function() {
        // Cancel the scheduled onended if stopped early
      }),
      onended: null,
    };
    return source;
  }),
  createGain: vi.fn(() => ({
    gain: { value: 1 },
    connect: vi.fn(),
  })),
  resume: vi.fn().mockResolvedValue(undefined),
};

// Mock audioEngine (hoisted, uses pre-declared mockAudioContext)
vi.mock('../../audio/audioEngine', () => ({
  getAudioContext: vi.fn(() => mockAudioContext),
  resumeAudio: vi.fn(() => mockAudioContext),
}));

// Mock KokoroTTS (hoisted, uses pre-declared mockFromPretrained)
vi.mock('kokoro-js', () => ({
  KokoroTTS: {
    from_pretrained: (...args) => mockFromPretrained(...args),
  },
}));

// Setup / teardown
beforeEach(() => {
  vi.clearAllMocks();
  mockFromPretrained.mockResolvedValue({
    generate: mockGenerate,
  });
  mockGenerate.mockResolvedValue({
    audio: new Float32Array(100),
    sampling_rate: 44100,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useKokoroWebTTS', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useKokoroWebTTS());
    expect(result.current.isReady).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('init is idempotent — double call initializes once', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    await act(async () => {
      await result.current.init();
    });

    expect(result.current.isReady).toBe(true);
    expect(mockFromPretrained).toHaveBeenCalledTimes(1);

    // Second init should be a no-op
    await act(async () => {
      await result.current.init();
    });

    expect(mockFromPretrained).toHaveBeenCalledTimes(1);
  });

  it('init respects in-progress guard', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    // Start first init but don't await
    act(() => {
      result.current.init();
    });

    expect(result.current.isLoading).toBe(true);

    // Second concurrent init should be blocked
    await act(async () => {
      await result.current.init();
    });

    expect(mockFromPretrained).toHaveBeenCalledTimes(1);
  });

  it('speak lifecycle sets isSpeaking and resolves', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    await act(async () => {
      await result.current.init();
    });

    expect(result.current.isReady).toBe(true);

    let speakResult;
    await act(async () => {
      speakResult = await result.current.speak('Hello world');
    });

    expect(speakResult).toBe(true);
    expect(mockGenerate).toHaveBeenCalledWith('Hello world', { voice: 'am_adam', speed: 1.0 });
  });

  it('cancel stops playback and resets isSpeaking', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    await act(async () => {
      await result.current.init();
    });

    // Start speaking (but don't await completion)
    act(() => {
      result.current.speak('Hello world');
    });

    expect(result.current.isSpeaking).toBe(true);

    // Cancel immediately
    act(() => {
      result.current.cancel();
    });

    expect(result.current.isSpeaking).toBe(false);
  });

  it('speak with empty text returns false', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    let speakResult;
    await act(async () => {
      speakResult = await result.current.speak('');
    });

    expect(speakResult).toBe(false);
  });

  it('generateBlob returns a Blob when ready', async () => {
    const { result } = renderHook(() => useKokoroWebTTS());

    await act(async () => {
      await result.current.init();
    });

    let blob;
    await act(async () => {
      blob = await result.current.generateBlob('Test audio');
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('audio/wav');
    expect(mockGenerate).toHaveBeenCalledWith('Test audio', { voice: 'am_adam', speed: 1.0 });
  });
});
