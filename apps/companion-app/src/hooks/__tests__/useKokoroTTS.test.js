import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useKokoroTTS } from '../useKokoroTTS';

// Mock audioEngine
const mockCreateBuffer = vi.fn(() => ({
  getChannelData: vi.fn(() => new Float32Array(10)),
}));
const mockCreateBufferSource = vi.fn(() => ({
  connect: vi.fn(),
  start: vi.fn(),
}));

vi.mock('../../audio/audioEngine', () => ({
  getAudioContext: vi.fn(() => ({
    createBuffer: mockCreateBuffer,
    createBufferSource: mockCreateBufferSource,
    destination: {},
    state: 'running',
    resume: vi.fn(),
  })),
  resumeAudio: vi.fn(() => ({
    createBuffer: mockCreateBuffer,
    createBufferSource: mockCreateBufferSource,
    destination: {},
    state: 'running',
    resume: vi.fn(),
  })),
}));

// Mock transformers and kokoro-js
const mockGenerate = vi.fn();
const mockFromPretrained = vi.fn(() => ({
  generate: mockGenerate,
}));

vi.mock('kokoro-js', () => ({
  KokoroTTS: {
    from_pretrained: mockFromPretrained,
  },
}));

vi.mock('@huggingface/transformers', () => ({
  env: {},
}));

describe('useKokoroTTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initTTS is idempotent', async () => {
    mockFromPretrained.mockResolvedValue({ generate: mockGenerate });
    
    const { result } = renderHook(() => useKokoroTTS());
    
    await act(async () => {
      await result.current.initTTS();
    });
    
    await waitFor(() => expect(result.current.isReady).toBe(true));
    
    // Second call should be ignored
    await act(async () => {
      await result.current.initTTS();
    });
    
    expect(mockFromPretrained).toHaveBeenCalledTimes(1);
  });

  it('speak lifecycle works when initialized', async () => {
    mockFromPretrained.mockResolvedValue({ generate: mockGenerate });
    mockGenerate.mockResolvedValue({
      audio: new Float32Array(10),
      sampling_rate: 24000,
    });
    
    const { result } = renderHook(() => useKokoroTTS());
    
    await act(async () => {
      await result.current.initTTS();
    });
    
    await waitFor(() => expect(result.current.isReady).toBe(true));
    
    let success = false;
    await act(async () => {
      success = await result.current.speak('Hello World');
    });
    
    expect(success).toBe(true);
    expect(mockGenerate).toHaveBeenCalled();
    expect(mockCreateBuffer).toHaveBeenCalled();
    expect(mockCreateBufferSource).toHaveBeenCalled();
  });

  it('generateBlob creates a Blob directly', async () => {
    mockFromPretrained.mockResolvedValue({ generate: mockGenerate });
    mockGenerate.mockResolvedValue({
      audio: new Float32Array(10),
      sampling_rate: 24000,
    });
    
    const { result } = renderHook(() => useKokoroTTS());
    
    await act(async () => {
      await result.current.initTTS();
    });
    
    await waitFor(() => expect(result.current.isReady).toBe(true));
    
    let blob;
    await act(async () => {
      blob = await result.current.generateBlob('Test');
    });
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('audio/wav');
  });

  it('unload resets state', async () => {
    mockFromPretrained.mockResolvedValue({ generate: mockGenerate });
    
    const { result } = renderHook(() => useKokoroTTS());
    
    await act(async () => {
      await result.current.initTTS();
    });
    
    await waitFor(() => expect(result.current.isReady).toBe(true));
    
    await act(async () => {
      await result.current.unload();
    });
    
    expect(result.current.isReady).toBe(false);
  });
});
