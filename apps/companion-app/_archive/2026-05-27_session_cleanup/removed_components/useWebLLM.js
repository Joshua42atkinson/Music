import { useState, useCallback, useEffect, useRef } from 'react';
import { Wllama } from '@wllama/wllama';

// ═══════════════════════════════════════════════════════════
// useWebLLM — In-browser GGUF inference for Troubadour's Quill
// Loads the quantized troubadour-q4.gguf model via WebAssembly
// ═══════════════════════════════════════════════════════════

export function useWebLLM() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const wllamaRef = useRef(null);

  // Initialize Wllama engine
  const initEngine = useCallback(async () => {
    if (wllamaRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLoadProgress(0);

    try {
      // Create Wllama instance with local WASM files
      const wllama = new Wllama({
        default: 'https://cdn.jsdelivr.net/npm/@wllama/wllama@latest/dist/wllama.wasm',
      });
      
      // Progress callback for model loading
      const progressCallback = ({ loaded, total }) => {
        const progressPercentage = Math.round((loaded / total) * 100);
        setLoadProgress(progressPercentage);
      };

      // Load GGUF model from public directory
      await wllama.loadModelFromUrl(
        '/models/troubadour-q4.gguf',
        {
          progressCallback,
          n_gpu_layers: 20, // Offload 20 layers to GPU if WebGPU available
        }
      );

      wllamaRef.current = wllama;
      setIsReady(true);
      setHasInitialized(true);
    } catch (err) {
      console.error('[Wllama] Initialization failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Generate completion
  const askBertrand = useCallback(async (messages) => {
    if (!wllamaRef.current) {
      throw new Error('Wllama engine not initialized. Call initEngine() first.');
    }

    try {
      const response = await wllamaRef.current.createChatCompletion({
        messages: messages,
        max_tokens: 512,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
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

  // Initialize on mount - REMOVED to require manual consent
  // useEffect(() => {
  //   initEngine();
  // }, [initEngine]);

  return {
    isReady,
    isLoading,
    error,
    loadProgress,
    hasInitialized,
    askBertrand,
    initEngine,
  };
}
