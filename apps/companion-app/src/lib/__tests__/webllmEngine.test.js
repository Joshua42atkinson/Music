import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWebLLMEngine, isWebLLMReady, subscribeToWebLLMProgress } from '../webllmEngine';
import * as webllm from '@mlc-ai/web-llm';

// Mock the web-llm module
vi.mock('@mlc-ai/web-llm', () => {
  return {
    CreateMLCEngine: vi.fn(),
  };
});

describe('WebLLM Engine Singleton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initially reports not ready', () => {
    expect(isWebLLMReady()).toBe(false);
  });

  it('can subscribe to progress updates', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToWebLLMProgress(callback);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('handles successful engine creation', async () => {
    const mockEngine = { chat: { completions: { create: vi.fn() } } };
    webllm.CreateMLCEngine.mockResolvedValueOnce(mockEngine);

    const engine = await getWebLLMEngine();
    expect(engine).toBe(mockEngine);
    expect(isWebLLMReady()).toBe(true);

    // Should return same instance on second call
    const engine2 = await getWebLLMEngine();
    expect(engine2).toBe(mockEngine);
    expect(webllm.CreateMLCEngine).toHaveBeenCalledTimes(1);
  });

  it('handles engine creation failure gracefully', async () => {
    webllm.CreateMLCEngine.mockRejectedValueOnce(new Error('Init failed'));

    try {
      await getWebLLMEngine();
    } catch (err) {
      expect(err.message).toBe('Init failed');
    }
  });
});
