// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : webllmEngine.js                                      ║
// ║ WHAT    : Singleton manager for the WebGPU SLM (WebLLM)        ║
// ║ WHY     : Prevents loading the 3GB model multiple times.       ║
// ║           Provides a globally accessible inference engine.     ║
// ╚════════════════════════════════════════════════════════════════╝
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import { devLog, devError } from './devLog';

let engineInstance = null;
let isInitializing = false;
let initPromise = null;

// Target the best reasoning-to-size model that WebLLM supports
// Llama-3.2-3B-Instruct-q4f32_1-MLC is the current gold standard for 3B WebGPU
const MODEL_ID = 'Llama-3.2-3B-Instruct-q4f32_1-MLC'; 

let progressListeners = [];

export function subscribeToWebLLMProgress(listener) {
  progressListeners.push(listener);
  return () => {
    progressListeners = progressListeners.filter(l => l !== listener);
  };
}

/**
 * Get or initialize the WebLLM engine singleton.
 * Uses a promise lock to prevent race conditions during the multi-gigabyte download.
 */
export async function getWebLLMEngine() {
  if (engineInstance) return engineInstance;

  if (isInitializing) {
    return initPromise;
  }

  isInitializing = true;
  
  initPromise = (async () => {
    try {
      devLog(`[WebLLM] Initializing engine with ${MODEL_ID}...`);
      const engine = await CreateMLCEngine(
        MODEL_ID,
        {
          initProgressCallback: (progress) => {
            progressListeners.forEach(l => l(progress));
          },
        }
      );
      engineInstance = engine;
      isInitializing = false;
      return engine;
    } catch (err) {
      devError('[WebLLM] Failed to initialize engine:', err);
      isInitializing = false;
      throw err;
    }
  })();

  return initPromise;
}

export function isWebLLMReady() {
  return engineInstance !== null;
}
