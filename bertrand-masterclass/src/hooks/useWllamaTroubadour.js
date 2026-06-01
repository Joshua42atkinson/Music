import { useState, useCallback, useRef } from 'react';
import { Wllama } from '@wllama/wllama/esm';

// WASM assets loaded from CDN — no local bundling needed
const WASM_PATHS = {
  'single-thread/wllama.wasm': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.wasm',
  'single-thread/wllama.js': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.js',
};

// ═══════════════════════════════════════════════════════════════════
// useWllamaTroubadour — In-browser GGUF inference for the Troubadour
// LAYER 2: VOIX — The In-Browser Troubadour
//
// LLM OPTIONS (4 GB budget):
//   LFM2.5-1.2B-Instruct Q4 (~700 MB) — RECOMMENDED, outperforms Qwen3-1.7B
//   LFM2.5-350M Q4 (~229 MB) — lightweight fallback
//   Qwen3-1.7B-Instruct Q4 (~1.0 GB) — alternative
//
// Default: LFM2.5-1.2B-Instruct (best quality per byte, instruct-tuned)
// ═══════════════════════════════════════════════════════════════════

const MODELS = {
  '1.2b-instruct': {
    url: '/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf',
    id: 'LFM2.5-1.2B-Instruct-Q4',
    size: '~700 MB',
    nGpuLayers: 25,
  },
  '350m': {
    url: '/models/LFM2.5-350M-Q4_K_M.gguf',
    id: 'LFM2.5-350M-Q4',
    size: '~229 MB',
    nGpuLayers: 20,
  },
};

const DEFAULT_MODEL = '1.2b-instruct';
const CACHE_KEY = 'vv_wllama_cached';
const RETRY_KEY = 'vv_wllama_retries';
const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 2000;

function getCacheMarker(modelKey) {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}

function setCacheMarker(modelKey) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ modelKey, ts: Date.now() })); }
  catch { /* ignore */ }
}

function getRetryCount() {
  try { return parseInt(localStorage.getItem(RETRY_KEY) || '0', 10); }
  catch { return 0; }
}

function bumpRetryCount() {
  try { localStorage.setItem(RETRY_KEY, String(getRetryCount() + 1)); }
  catch { /* ignore */ }
}

function resetRetryCount() {
  try { localStorage.removeItem(RETRY_KEY); }
  catch { /* ignore */ }
}

export function useWllamaTroubadour() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isCached, setIsCached] = useState(() => !!getCacheMarker(DEFAULT_MODEL).modelKey);
  const wllamaRef = useRef(null);
  const retryCountRef = useRef(getRetryCount());

  const initEngine = useCallback(async (modelKey = DEFAULT_MODEL) => {
    // Guard 1: already loaded in this session
    if (wllamaRef.current) return;
    // Guard 2: already loading
    if (isLoading) return;
    // Guard 3: retry limit exceeded
    if (retryCountRef.current >= MAX_RETRIES) {
      setError(`Max retries (${MAX_RETRIES}) reached. Refresh to reset.`);
      return;
    }

    const modelConfig = MODELS[modelKey] || MODELS[DEFAULT_MODEL];
    const cacheMarker = getCacheMarker(modelKey);
    const wasCached = cacheMarker.modelKey === modelKey;

    setIsLoading(true);
    setError(null);
    setLoadProgress(wasCached ? 100 : 0);

    try {
      const wllama = new Wllama(WASM_PATHS);

      await wllama.loadModelFromUrl(modelConfig.url, {
        progressCallback: ({ loaded, total }) => {
          // Skip UI updates if model was already cached and loaded instantly
          if (!wasCached || loaded < total) {
            setLoadProgress(Math.round((loaded / total) * 100));
          }
        },
        n_gpu_layers: modelConfig.nGpuLayers,
      });

      wllamaRef.current = wllama;
      wllamaRef.current.modelId = modelConfig.id;
      setIsReady(true);
      setIsCached(true);
      setCacheMarker(modelKey);
      resetRetryCount();
      retryCountRef.current = 0;
    } catch (err) {
      console.error('[Wllama] Init failed:', err);
      setError(err.message);
      bumpRetryCount();
      retryCountRef.current = getRetryCount();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const chatCompletion = useCallback(async (messages, options = {}) => {
    if (!wllamaRef.current) {
      throw new Error('Wllama not initialized. Call initEngine() first.');
    }

    try {
      const response = await wllamaRef.current.createChatCompletion({
        messages,
        max_tokens: options.max_tokens || 512,
        temperature: options.temperature ?? 0.1,     // LFM2.5 manufacturer spec
        top_k: options.top_k || 50,                    // LFM2.5 manufacturer spec
        top_p: options.top_p ?? 0.9,
        penalty_repeat: options.penalty_repeat ?? 1.05, // LFM2.5 manufacturer spec
      });

      return {
        choices: [{
          message: {
            role: 'assistant',
            content: response.choices[0].message.content,
          }
        }]
      };
    } catch (err) {
      console.error('[Wllama] Generation failed:', err);
      throw err;
    }
  }, []);

  const unload = useCallback(async () => {
    if (wllamaRef.current) {
      try {
        await wllamaRef.current.unloadModel();
      } catch (e) {
        // ignore
      }
      wllamaRef.current = null;
      setIsReady(false);
      setLoadProgress(0);
    }
  }, []);

  return {
    isReady,
    isLoading,
    error,
    loadProgress,
    isCached,
    modelId: wllamaRef.current?.modelId || MODELS[DEFAULT_MODEL].id,
    MODELS,
    initEngine,
    chatCompletion,
    unload,
  };
}
