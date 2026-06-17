import { useState, useCallback, useRef } from 'react';
import { Wllama } from '@wllama/wllama/esm';
import { vvGet, vvSet, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// Wllama 3.4.1 expects an AssetsPathConfig object with a 'default' property pointing to the .wasm file.
// We use a public CDN to avoid heavy local bundling.
const WASM_PATHS = {
  'default': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/esm/wasm/wllama.wasm'
};

// ═══════════════════════════════════════════════════════════════════
// useWllamaTruebadour — In-browser GGUF inference for the Truebadour
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  MINI TRINITY — Voix Vive's In-Browser AI Stack (DECIDED)       │
// │                                                                  │
// │  1. LLM:   Liquid AI LFM2.5-1.2B-Instruct-Q4_K_M  (~700 MB)   │
// │     → Teaching, coaching, lyrics, tool dispatch                  │
// │     → 32K context, fine-tunable, runs on any modern browser      │
// │                                                                  │
// │  2. TTS:   Kokoro-82M ONNX (q8 WASM)               (~82 MB)    │
// │     → Neural voice synthesis — "Voix Vive" = "Living Voice"     │
// │                                                                  │
// │  3. STT:   Web Speech API (browser-native)          (0 MB)      │
// │     → Hands-free voice input, no download                       │
// │                                                                  │
// │  Decision: Instruct over Thinking model because:                 │
// │  - Clean [TOOL:...] tag dispatch (no thinking traces in UI)     │
// │  - Lower latency (critical for voice-first UX)                  │
// │  - All 32K context goes to curriculum + history, not traces     │
// │  - Fine-tuning uses clean input→output pairs                    │
// │                                                                  │
// │  The 8B model is kept as an optional power tier for high-RAM    │
// │  devices but is NEVER auto-selected. The 1.2B is the universal  │
// │  standard for all web, Android NDK, and Tauri desktop ports.    │
// └──────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

// ── THE MODEL — Single Source of Truth ─────────────────────────────
// LFM2.5-1.2B-Instruct-Q4_K_M is the ONLY model for Voix Vive.
// No tiers. No fallbacks. No selection logic.
// One model to maintain, improve, and fine-tune.
const MODEL = {
  url: '/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf',
  id: 'LFM2.5-1.2B-Instruct-Q4',
  size: '~700 MB',
  params: '1.17B',
  layers: 16,            // 10 LIV conv + 6 GQA
  vocab: 65536,
  context: 32768,        // 32K tokens
  nGpuLayers: 99,        // offload all layers
};

const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 2000;

function getCacheMarker() {
  try { return JSON.parse(vvGet(STORAGE_KEYS.WLLAMA_CACHED) || '{}'); }
  catch { return {}; }
}

function setCacheMarker() {
  try { vvSet(STORAGE_KEYS.WLLAMA_CACHED, JSON.stringify({ model: MODEL.id, ts: Date.now() })); }
  catch { /* ignore */ }
}

function getRetryCount() {
  try { return parseInt(vvGet(STORAGE_KEYS.WLLAMA_RETRIES) || '0', 10); }
  catch { return 0; }
}

function bumpRetryCount() {
  try { vvSet(STORAGE_KEYS.WLLAMA_RETRIES, String(getRetryCount() + 1)); }
  catch { /* ignore */ }
}

function resetRetryCount() {
  try { vvRemove(STORAGE_KEYS.WLLAMA_RETRIES); }
  catch { /* ignore */ }
}

export function useWllamaTruebadour() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isCached, setIsCached] = useState(() => !!getCacheMarker().model);
  const wllamaRef = useRef(null);
  const retryCountRef = useRef(getRetryCount());
  const isLoadingRef = useRef(false);

  const initEngine = useCallback(async () => {
    // Guard 1: already loaded in this session
    if (wllamaRef.current) return;
    // Guard 2: already loading (ref-based to avoid stale closure)
    if (isLoadingRef.current) return;
    // Guard 3: retry limit exceeded
    if (retryCountRef.current >= MAX_RETRIES) {
      setError(`Max retries (${MAX_RETRIES}) reached. Refresh to reset.`);
      return;
    }

    isLoadingRef.current = true;
    const wasCached = getCacheMarker().model === MODEL.id;

    setIsLoading(true);
    setError(null);
    setLoadProgress(wasCached ? 100 : 0);

    try {
      const wllama = new Wllama(WASM_PATHS);

      // Wllama runs inside a Blob worker, which means relative URLs like '/models/...' 
      // will fail to parse. We MUST provide a fully qualified absolute URL.
      const absoluteModelUrl = new URL(MODEL.url, window.location.origin).href;

      await wllama.loadModelFromUrl(absoluteModelUrl, {
        progressCallback: ({ loaded, total }) => {
          if (!wasCached || loaded < total) {
            setLoadProgress(Math.round((loaded / total) * 100));
          }
        },
        n_ctx: MODEL.context,        // 32K — USE THE FULL CONTEXT WINDOW
        n_gpu_layers: MODEL.nGpuLayers,
      });

      wllamaRef.current = wllama;
      wllamaRef.current.modelId = MODEL.id;
      setIsReady(true);
      setIsCached(true);
      setCacheMarker();
      resetRetryCount();
      retryCountRef.current = 0;
    } catch (err) {
      console.error('[Wllama] Init failed:', err);
      setError(err.message);
      bumpRetryCount();
      retryCountRef.current = getRetryCount();
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const chatCompletion = useCallback(async (messages, options = {}) => {
    if (!wllamaRef.current) {
      throw new Error('Wllama not initialized. Call initEngine() first.');
    }

    try {
      const response = await wllamaRef.current.createChatCompletion({
        messages,
        max_tokens: options.max_tokens || 512,
        // ── Liquid AI manufacturer-recommended inference params ──
        // Source: https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct
        temperature: options.temperature ?? 0.1,
        top_k: options.top_k || 50,
        min_p: options.min_p ?? 0.15,
        top_p: options.top_p ?? 0.9,
        penalty_repeat: options.penalty_repeat ?? 1.05,
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
      } catch {
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
    modelId: MODEL.id,
    MODEL,
    initEngine,
    chatCompletion,
    unload,
  };
}
