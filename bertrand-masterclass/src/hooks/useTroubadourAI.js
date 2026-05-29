import { useState, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// useTroubadourAI — Unified AI hook for the Troubadour
// Priority: 1) Hosted vLLM (GMKtek)  2) llama.cpp Nemotron  3) StepAudio  4) LM Studio  5) Offline
// ═══════════════════════════════════════════════════════════════════

const REMOTE_URL   = import.meta.env.VITE_TROUBADOUR_API_URL;        // e.g. https://troubadour.yourdomain.com/v1
const LOCAL_URL    = 'http://localhost:1234/v1';                     // LM Studio dev
const STEP_URL     = 'http://localhost:9998/v1';                     // StepAudio local
const LLAMA_URL    = 'http://localhost:8080/v1';                     // llama.cpp Nemotron Super (1M context)
const API_KEY      = import.meta.env.VITE_TROUBADOUR_API_KEY || '';

export function useTroubadourAI() {
  const [isReady, setIsReady]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [backend, setBackend]   = useState(null); // 'remote' | 'local' | 'offline'
  const abortRef = useRef(null);

  // ── Detect which backend is alive ──────────────────────────────
  const detectBackend = useCallback(async () => {
    setError(null);

    // 1. Try hosted vLLM (production)
    if (REMOTE_URL) {
      try {
        const resp = await fetch(`${REMOTE_URL}/models`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
          },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.data?.length > 0) {
            setIsReady(true);
            setBackend('remote');
            return { connected: true, backend: 'remote', model: data.data[0] };
          }
        }
      } catch (e) {
        // Remote not reachable
      }
    }

    // 2. Try StepAudio (localhost:9998)
    try {
      const resp = await fetch(`${STEP_URL}/models`, { method: 'GET' });
      if (resp.ok) {
        const data = await resp.json();
        if (data.data?.length > 0) {
          setIsReady(true);
          setBackend('local');
          return { connected: true, backend: 'local-stepaudio', model: data.data[0] };
        }
      }
    } catch (e) {
      // StepAudio not running
    }

    // 3. Try llama.cpp Nemotron Super (localhost:8080)
    try {
      const resp = await fetch(`${LLAMA_URL}/models`, { method: 'GET' });
      if (resp.ok) {
        const data = await resp.json();
        if (data.data?.length > 0) {
          setIsReady(true);
          setBackend('local');
          return { connected: true, backend: 'local-llama', model: data.data[0] };
        }
      }
    } catch (e) {
      // llama.cpp not running
    }

    // 4. Try LM Studio (localhost:1234)
    try {
      const resp = await fetch(`${LOCAL_URL}/models`, { method: 'GET' });
      if (resp.ok) {
        const data = await resp.json();
        if (data.data?.length > 0) {
          setIsReady(true);
          setBackend('local');
          return { connected: true, backend: 'local-lmstudio', model: data.data[0] };
        }
      }
    } catch (e) {
      // LM Studio not running
    }

    // 5. Offline
    setIsReady(false);
    setBackend('offline');
    return { connected: false, backend: 'offline' };
  }, []);

  // ── Streaming chat completion ────────────────────────────────────
  const chatStream = useCallback(async (messages, onChunk, options = {}) => {
    const baseUrl = options.baseUrl
      || (backend === 'remote' ? REMOTE_URL : null)
      || LLAMA_URL
      || STEP_URL
      || LOCAL_URL;

    if (!baseUrl) {
      throw new Error('No AI backend available. Try starting LM Studio locally.');
    }

    const payload = {
      model: options.model || 'loaded',
      messages,
      max_tokens: options.max_tokens || 512,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 0.9,
      stream: true,
    };

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      setIsLoading(true);
      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(l => l.trim())) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              full += content;
              onChunk?.(content, full);
            }
          } catch (e) { /* ignore malformed */ }
        }
      }

      setIsLoading(false);
      return { choices: [{ message: { role: 'assistant', content: full } }] };
    } catch (err) {
      setIsLoading(false);
      if (err.name === 'AbortError') throw new Error('Cancelled');
      throw err;
    }
  }, [backend]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  return {
    isReady,
    isLoading,
    error,
    backend,
    detectBackend,
    chatStream,
    cancel,
  };
}
