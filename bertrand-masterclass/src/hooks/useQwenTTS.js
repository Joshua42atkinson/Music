import { useState, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// useQwenTTS — Browser client for local Qwen3-TTS server
// Connects to localhost:9999 for voice-cloned neural TTS
// Fallback to Kokoro if server unreachable
// ═══════════════════════════════════════════════════════════════════

const SERVER_URL = 'http://localhost:9999';

export function useQwenTTS() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(false);
  const abortRef = useRef(null);
  const audioCtxRef = useRef(null);

  // ── Health check on mount ──────────────────────────────────────
  const checkServer = useCallback(async () => {
    try {
      const resp = await fetch(`${SERVER_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      if (resp.ok) {
        const data = await resp.json();
        setServerAvailable(true);
        setIsReady(data.model_loaded);
        return data;
      }
    } catch {
      setServerAvailable(false);
      setIsReady(false);
    }
    return null;
  }, []);

  // ── Generate speech from server ────────────────────────────────
  const speak = useCallback(async (text, locale = 'en', options = {}) => {
    if (!text || !text.trim()) return false;

    // Cancel previous generation
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);

    try {
      const payload = {
        model: 'qwen3-tts-0.6b',
        input: text,
        voice: options.voice || (locale.startsWith('fr') ? 'bertrand' : 'default'),
        speed: options.speed || 1.0,
        response_format: 'wav',
        emotion: options.emotion || null,
        reference_audio: options.referenceAudio || null,
      };

      const resp = await fetch(`${SERVER_URL}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        throw new Error(`TTS server error: ${resp.status}`);
      }

      const audioBlob = await resp.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play via Web Audio API for control
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtxRef.current.destination);

      // Resume context if suspended (browser autoplay policy)
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      return new Promise((resolve) => {
        source.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };
        source.start(0);
      });

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[QwenTTS] Cancelled');
        return false;
      }
      console.warn('[QwenTTS] Server TTS failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Cancel current playback ────────────────────────────────────
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // ── Upload voice reference ─────────────────────────────────────
  const uploadReference = useCallback(async (name, audioBlob) => {
    const reader = new FileReader();
    const base64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(audioBlob);
    });

    const resp = await fetch(
      `${SERVER_URL}/v1/references/upload?name=${encodeURIComponent(name)}&audio_b64=${encodeURIComponent(base64)}`,
      { method: 'POST' }
    );
    return resp.ok;
  }, []);

  return {
    isReady,
    isLoading,
    serverAvailable,
    checkServer,
    speak,
    cancel,
    uploadReference,
  };
}
