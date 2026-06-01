import { useState, useCallback, useRef } from 'react';
import { getOfflineResponse, getFretAwareFallback } from '../data/troubadourOffline';
import { buildCompressedPrompt, buildChatPrompt, enforceOver } from '../data/troubadourPrompt';

// ═══════════════════════════════════════════════════════════════════
// useTroubadourAI — Unified AI hook for the Troubadour
// Three-layer architecture: Souffle → Voix → Chant
//   0) aiEnabled=false → Souffle (offline prompts + best available TTS)
//   1) wllama loaded    → Voix   (LFM2.5-1.2B-Instruct in-browser LLM)
//   2) Remote vLLM      → Chant  (full model)
//   3) StepAudio :9998  → Chant  (33B + voice stream)
//   4) llama.cpp :8080  → Chant  (Nemotron fallback)
//   5) LM Studio :1234 → Chant  (dev fallback)
//   6) Offline fallback → Souffle
//
// TTS Priority: Qwen3-TTS 0.6B (future) → Kokoro-82M → Web Speech API
// Voice Input: Web Speech Recognition (now) → Whisper Base ONNX (future)
// The voice IS the product. "Voix Vive" = "Living Voice."
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
  const [backend, setBackend]   = useState(null); // 'remote' | 'local' | 'wllama' | 'offline'
  const abortRef = useRef(null);
  const wllamaRef = useRef(null); // { chatCompletion, isReady, modelId } from useWllamaTroubadour
  const kokoroRef = useRef(null); // { speak, isReady } from useKokoroTTS
  const qwenRef  = useRef(null); // { speak, isReady, cancel } from useQwenTTS (server)
  const voiceRef = useRef(null); // { startListening, stopListening, isAvailable } from useVoiceInput

  // ── Audio queue state (prevents overlapping speech) ──────────
  const audioQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  // ── Internal TTS implementation ────────────────────────────────
  const speakTextInternal = useCallback(async (text, locale = 'en') => {
    // 1. Try Qwen3-TTS 0.6B (10 languages, voice cloning, 97ms streaming)
    if (qwenRef.current?.isReady) {
      try {
        const spoke = await qwenRef.current.speak(text, locale);
        if (spoke) return true;
      } catch (e) {
        console.warn('[VoixVive] Qwen3-TTS failed, falling back to Kokoro', e);
      }
    }

    // 2. Try Kokoro neural TTS (#1 TTS Arena, 82M params, in-browser)
    if (kokoroRef.current?.isReady) {
      try {
        const spoke = await kokoroRef.current.speak(text, locale);
        if (spoke) return true;
      } catch (e) {
        console.warn('[VoixVive] Kokoro TTS failed, falling back to Web Speech', e);
      }
    }

    // 3. Web Speech API fallback (zero download, OS-dependent quality)
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const isFrench = locale.startsWith('fr');

      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // Voices not loaded yet — retry after a short delay
          setTimeout(trySpeak, 100);
          return;
        }

        utterance.lang = isFrench ? 'fr-FR' : 'en-US';

        let voice = voices.find(v => isFrench ? v.lang.toLowerCase().includes('fr') : v.lang.toLowerCase().includes('en'));
        if (!isFrench) {
          const frenchAccent = voices.find(v => v.lang.toLowerCase().includes('en') && v.name.includes('French'));
          if (frenchAccent) voice = frenchAccent;
        }

        if (voice) utterance.voice = voice;
        utterance.rate = 0.95;
        utterance.pitch = 0.95;

        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);

        window.speechSynthesis.speak(utterance);
      };

      trySpeak();
    });
  }, []);

  // ── Queue processor ────────────────────────────────────────────
  const processAudioQueue = useCallback(async () => {
    if (isSpeakingRef.current || audioQueueRef.current.length === 0) return;
    isSpeakingRef.current = true;

    while (audioQueueRef.current.length > 0) {
      const { text, locale } = audioQueueRef.current[0];
      const spoke = await speakTextInternal(text, locale);
      audioQueueRef.current.shift();
      if (!spoke) break; // If TTS fails, drain queue to avoid spam
    }

    isSpeakingRef.current = false;
  }, [speakTextInternal]);

  // ── Public TTS API: queues text, returns after processing ─────
  const speakText = useCallback(async (text, locale = 'en') => {
    audioQueueRef.current.push({ text, locale });
    // If nothing is speaking, process immediately. Otherwise it queues.
    if (!isSpeakingRef.current) {
      await processAudioQueue();
    }
  }, [processAudioQueue]);

  // ── Detect which backend is alive ──────────────────────────────
  const detectBackend = useCallback(async () => {
    setError(null);

    // 0. Check Offline Override (AI Guidance setting)
    try {
      const raw = localStorage.getItem('bard_traction');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings?.aiEnabled === false) {
          setIsReady(true);
          setBackend('offline');
          return { connected: true, backend: 'offline', model: { id: 'troubadour-offline-static' } };
        }
      }
    } catch (e) {
      // proceed if parsing fails
    }

    // 0.5. Try in-browser wllama (Layer 2: Voix)
    // In-browser AI preferred over network — no latency, no server dependency.
    if (wllamaRef.current?.isReady) {
      setIsReady(true);
      setBackend('wllama');
      return { connected: true, backend: 'wllama', model: { id: wllamaRef.current.modelId || 'LFM2.5-1.2B-Q4' } };
    }

    // 1. Try hosted vLLM (production — Layer 3: Chant)
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

    // 2. Try StepAudio (localhost:9998 — Layer 3: Chant)
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

    // 3. Try llama.cpp Nemotron Super (localhost:8080 — Layer 3: Chant)
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

    // 4. Try LM Studio (localhost:1234 — Layer 3: Chant, dev fallback)
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

    // 5. Souffle fallback (Layer 1: offline + best available TTS)
    setIsReady(true);
    setBackend('offline');
    return { connected: true, backend: 'offline', model: { id: 'troubadour-souffle' } };
  }, []);

  // ── Streaming chat completion ────────────────────────────────────
  const chatStream = useCallback(async (messages, onChunk, options = {}) => {
    const baseUrl = options.baseUrl
      || (backend === 'remote' ? REMOTE_URL : null)
      || (backend === 'local' ? (STEP_URL || LLAMA_URL || LOCAL_URL) : null);

    // ── wllama in-browser (Layer 2: Voix) ───────────────────────
    if (backend === 'wllama' && wllamaRef.current) {
      try {
        setIsLoading(true);
        const isChatMode = options.mode === 'chat';
        const systemMsg = isChatMode
          ? buildChatPrompt({
              traction: options.traction,
              bardLevel: options.bardLevel,
              currentFret: options.currentFret,
              currentPhase: options.currentPhase,
              locale: options.locale || 'en',
            })
          : buildCompressedPrompt({
              traction: options.traction,
              bardLevel: options.bardLevel,
              currentFret: options.currentFret,
              currentPhase: options.currentPhase,
            });
        const wllamaMessages = [
          { role: 'system', content: systemMsg },
          ...messages.slice(-10), // keep last 10 messages (32K context available)
        ];
        const result = await wllamaRef.current.chatCompletion(wllamaMessages, {
          max_tokens: options.max_tokens || 512,
          temperature: options.temperature ?? 0.1,     // LFM2.5 spec: 0.1
          top_k: 50,                                     // LFM2.5 spec
          penalty_repeat: 1.05,                          // LFM2.5 spec: repetition penalty
        });
        const rawContent = result.choices[0].message.content;
        const content = isChatMode ? rawContent : enforceOver(rawContent, 'troubadour');
        setIsLoading(false);
        speakText(content, options.locale || 'en');
        // Simulate streaming by yielding the full response
        onChunk?.(content, content);
        return { choices: [{ message: { role: 'assistant', content } }] };
      } catch (err) {
        console.warn('[VoixVive] wllama generation failed.', err);
        // If server backends are available, continue to server path below.
        // Otherwise fall through to offline fallback.
      }
    }

    // ── Offline / Souffle (Layer 1) ─────────────────────────────
    if (!baseUrl) {
      const userMsg = messages[messages.length - 1]?.content || '';
      const isChatMode = options.mode === 'chat';
      let finalResponse;

      if (isChatMode) {
        // Chat mode: more conversational fallback, no Over protocol
        const { matched, response } = getOfflineResponse(userMsg);
        if (matched) {
          // Strip "Over." from offline responses in chat mode
          finalResponse = response.replace(/\s*Over\.$/i, '').replace(/\s*Over$/i, '');
        } else {
          // Conversational fallback that acknowledges the user's input
          const userQuestion = userMsg.slice(0, 60);
          finalResponse = options.locale === 'fr'
            ? `Je ne suis pas sûr de comprendre : "${userQuestion}". Essayez de me demander des conseils sur la guitare, un accord spécifique, ou la posture. Je suis là pour vous aider.`
            : `I'm not sure I understand: "${userQuestion}". Try asking me about guitar technique, a specific chord, or your posture. I'm here to help.`;
        }
      } else {
        // Troubadour mode: original keyword fallback
        const { matched, response } = getOfflineResponse(userMsg);
        finalResponse = matched ? response : getFretAwareFallback(options.currentFret);
      }

      setIsLoading(true);
      const words = finalResponse.split(' ');
      let full = '';
      for (const word of words) {
        const chunk = full ? ' ' + word : word;
        full += chunk;
        onChunk?.(chunk, full);
        await new Promise(r => setTimeout(r, 30));
      }
      setIsLoading(false);
      speakText(full, options.locale || 'en');
      return { choices: [{ message: { role: 'assistant', content: full } }] };
    }

    const payload = {
      model: options.model || 'loaded',
      messages,
      max_tokens: options.max_tokens || 512,
      temperature: options.temperature ?? 0.1,     // LFM2.5 manufacturer spec
      top_p: options.top_p ?? 0.9,
      top_k: 50,
      repetition_penalty: 1.05,
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

      const finalContent = options.mode === 'chat' ? full : enforceOver(full, 'troubadour');
      setIsLoading(false);
      speakText(finalContent, options.locale || 'en');
      return { choices: [{ message: { role: 'assistant', content: finalContent } }] };
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Cancelled');

      // FALLBACK TO OFFLINE if the request fails (e.g. LLM crashed/stopped)
      console.warn('[VoixVive] AI Backend fetch failed. Falling back to offline responses.', err);
      const userMsg = messages[messages.length - 1]?.content || '';
      const isChatMode = options.mode === 'chat';
      let responseText;
      if (isChatMode) {
        const { matched, response } = getOfflineResponse(userMsg);
        responseText = matched
          ? response.replace(/\s*Over\.$/i, '').replace(/\s*Over$/i, '')
          : (options.locale === 'fr'
            ? `Je ne suis pas sûr de comprendre. Essayez de me demander des conseils sur la guitare.`
            : `I'm not sure I understand. Try asking me about guitar technique.`);
      } else {
        const { response } = getOfflineResponse(userMsg);
        responseText = response;
      }
      const words = responseText.split(' ');
      let full = '';
      for (const word of words) {
        const chunk = full ? ' ' + word : word;
        full += chunk;
        onChunk?.(chunk, full);
        await new Promise(r => setTimeout(r, 30)); // natural pacing
      }
      setIsLoading(false);
      speakText(full, options.locale || 'en');
      return { choices: [{ message: { role: 'assistant', content: full } }] };
    }
  }, [backend]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    // Cancel ALL audio: queued + currently playing
    audioQueueRef.current = [];
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (kokoroRef.current?.cancel) kokoroRef.current.cancel();
    if (qwenRef.current?.cancel) qwenRef.current.cancel();
    isSpeakingRef.current = false;
  }, []);

  return {
    isReady,
    isLoading,
    error,
    backend,
    detectBackend,
    chatStream,
    speakText,
    cancel,
    wllamaRef,  // expose for wiring useWllamaTroubadour
    kokoroRef,  // expose for wiring useKokoroTTS
    qwenRef,   // expose for wiring useQwenTTS (server: localhost:9999)
    voiceRef,  // expose for wiring useVoiceInput
  };
}
