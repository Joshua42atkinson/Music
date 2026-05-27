import { useState, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════
// useLMStudio — Direct LM Studio OpenAI-compatible API hook
// Connects to LM Studio's local server (default: localhost:1234)
// Optimized for Qwen Coder with full GPU offload
// ═══════════════════════════════════════════════════════════

const LMSTUDIO_DEFAULT_URL = 'http://localhost:1234/v1';

export function useLMStudio() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const abortControllerRef = useRef(null);

  // Check LM Studio server health and get loaded model info
  const checkConnection = useCallback(async (baseUrl = LMSTUDIO_DEFAULT_URL) => {
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`LM Studio responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setModelInfo(data.data[0]);
        setIsReady(true);
        setError(null);
        return { connected: true, model: data.data[0] };
      } else {
        throw new Error('No model loaded in LM Studio');
      }
    } catch (err) {
      setIsReady(false);
      setError(err.message);
      return { connected: false, error: err.message };
    }
  }, []);

  // Send chat completion request to LM Studio
  const chatCompletion = useCallback(async (messages, options = {}) => {
    const baseUrl = options.baseUrl || LMSTUDIO_DEFAULT_URL;
    const model = options.model || 'loaded';
    
    // Default optimized settings for Qwen Coder
    const defaults = {
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      stream: false,
      // Qwen Coder optimized context
      n_ctx: options.maxContext || 32768,
      n_gpu_layers: options.gpuLayers || 999, // Max GPU offload
      stop: options.stop || null,
    };

    const payload = {
      model,
      messages,
      ...defaults,
      ...options,
    };

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      if (err.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw err;
    }
  }, []);

  // Streaming chat completion for real-time responses
  const chatCompletionStream = useCallback(async (messages, onChunk, options = {}) => {
    const baseUrl = options.baseUrl || LMSTUDIO_DEFAULT_URL;
    const model = options.model || 'loaded';

    const payload = {
      model,
      messages,
      max_tokens: options.max_tokens || 4096,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 0.9,
      top_k: options.top_k ?? 40,
      n_ctx: options.maxContext || 32768,
      n_gpu_layers: options.gpuLayers || 999,
      stream: true,
      stop: options.stop || null,
    };

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onChunk?.(content, fullContent);
              }
            } catch (e) {
              // Ignore parse errors for malformed chunks
            }
          }
        }
      }

      setIsLoading(false);
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: fullContent,
          }
        }]
      };
    } catch (err) {
      setIsLoading(false);
      if (err.name === 'AbortError') {
        throw new Error('Stream was cancelled');
      }
      throw err;
    }
  }, []);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    isReady,
    isLoading,
    error,
    modelInfo,
    checkConnection,
    chatCompletion,
    chatCompletionStream,
    cancelRequest,
  };
}
