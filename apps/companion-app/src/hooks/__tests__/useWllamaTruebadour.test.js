import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWllamaTruebadour } from '../useWllamaTruebadour';

// Mock storage with in-memory store
const storageStore = new Map();
vi.mock('../../lib/storage', () => ({
  vvGet: vi.fn((key) => storageStore.get(key) || null),
  vvSet: vi.fn((key, value) => storageStore.set(key, value)),
  vvRemove: vi.fn((key) => storageStore.delete(key)),
}));

// Mock Wllama
const mockUnloadModel = vi.fn();
const mockLoadModelFromUrl = vi.fn();
const mockCreateChatCompletion = vi.fn();

function MockWllama() {
  return {
    loadModelFromUrl: mockLoadModelFromUrl,
    unloadModel: mockUnloadModel,
    createChatCompletion: mockCreateChatCompletion,
  };
}

vi.mock('@wllama/wllama/esm', () => ({
  Wllama: MockWllama,
}));

describe('useWllamaTruebadour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageStore.clear();
    mockLoadModelFromUrl.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useWllamaTruebadour());
    expect(result.current.isReady).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.loadProgress).toBe(0);
    expect(result.current.modelId).toBe('LFM2.5-1.2B-Instruct-Q4');
  });

  it('initEngine is idempotent — double call loads once', async () => {
    const { result } = renderHook(() => useWllamaTruebadour());

    await act(async () => {
      await result.current.initEngine();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    // Second call should be guarded
    await act(async () => {
      await result.current.initEngine();
    });

    expect(mockLoadModelFromUrl).toHaveBeenCalledTimes(1);
  });

  it('initEngine respects retry limit', async () => {
    mockLoadModelFromUrl.mockRejectedValue(new Error('Network fail'));
    const { result } = renderHook(() => useWllamaTruebadour());

    // Fail 3 times
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await result.current.initEngine();
      });
    }

    // After 3 failures, the 4th call should be blocked immediately
    await act(async () => {
      await result.current.initEngine();
    });

    expect(result.current.error).toContain('Max retries (3) reached');
    expect(mockLoadModelFromUrl).toHaveBeenCalledTimes(3);
  });

  it('unload resets state', async () => {
    const { result } = renderHook(() => useWllamaTruebadour());

    await act(async () => {
      await result.current.initEngine();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    await act(async () => {
      await result.current.unload();
    });

    expect(result.current.isReady).toBe(false);
    expect(result.current.loadProgress).toBe(0);
    expect(mockUnloadModel).toHaveBeenCalled();
  });

  it('chatCompletion throws when not initialized', async () => {
    const { result } = renderHook(() => useWllamaTruebadour());

    await act(async () => {
      await expect(result.current.chatCompletion([])).rejects.toThrow('Wllama not initialized');
    });
  });

  it('chatCompletion returns formatted response when ready', async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{ message: { role: 'assistant', content: 'Hello' } }],
    });

    const { result } = renderHook(() => useWllamaTruebadour());

    await act(async () => {
      await result.current.initEngine();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    let response;
    await act(async () => {
      response = await result.current.chatCompletion([{ role: 'user', content: 'Hi' }]);
    });

    expect(response.choices[0].message.content).toBe('Hello');
    expect(mockCreateChatCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: 'user', content: 'Hi' }],
        temperature: 0.1,
      })
    );
  });
});
