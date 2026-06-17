// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useTruebadourAI.js                                   ║
// ║ WHAT    : React hook managing AI chat state, TTS, voice input, ║
// ║           and backend selection for the Truebadour agent       ║
// ║ WHY     : Centralizes all AI logic so UI components stay simple║
// ║           and students hear a consistent Bertrand voice         ║
// ║ WHO     : developer (consumed by TruebadourWidget)             ║
// ║ OWNS    : isReady, isLoading, error, backend state + AI refs   ║
// ║ NEEDS   : buildCompressedPrompt, buildChatPrompt, enforceOver  ║
// ║           from ../data/truebadourPrompt                        ║
// ║ RULES   : Never expose raw API keys. Read from import.meta.env.║
// ║           Always fallback to offline mode if remote fails.     ║
// ║ ARCH    : Mini Trinity — LFM2.5-1.2B (LLM) + Kokoro (TTS)     ║
// ║           + Web Speech API (STT). See useWllamaTruebadour.js   ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioQueue } from './useAudioQueue';
import { useTruebadourChat } from './useTruebadourChat';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ═══════════════════════════════════════════════════════════════════
// useTruebadourAI — Unified AI hook for the Truebadour
//
// TTS: Exclusive Piper TTS (Baked-in Bertrand Voice)
// Voice Input: Web Speech Recognition (now)
// The voice IS the product. "Voix Vive" = "Living Voice."
// ═══════════════════════════════════════════════════════════════════

const REMOTE_URL   = import.meta.env.VITE_TRUEBADOUR_API_URL;

export function useTruebadourAI() {
  const [isReady, setIsReady]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [backend, setBackend]   = useState(null); // 'remote' | 'local' | 'wllama' | 'offline'
  const abortRef    = useRef(null);
  const wllamaRef   = useRef(null);
  const kokoroRef   = useRef(null);
  const voiceRef    = useRef(null);
  const bertrandRef = useRef(null);
  // LM Studio / OpenAI-compatible local endpoint
  const lmStudioRef = useRef({
    url: import.meta.env.VITE_LM_STUDIO_URL
      ? `${import.meta.env.VITE_LM_STUDIO_URL}/v1`
      : 'http://localhost:1234/v1',
    connected: false,
    model: null,
  });

  // ── Voice Preferences ─────────────────────────────────────────
  const [voiceId] = useState(() => vvGet(STORAGE_KEYS.VOICE_ID) || 'am_adam');
  const [ttsSpeed] = useState(() => parseFloat(vvGet(STORAGE_KEYS.TTS_SPEED)) || 1.0);

  useEffect(() => {
    vvSet(STORAGE_KEYS.VOICE_ID, voiceId);
  }, [voiceId]);

  useEffect(() => {
    vvSet(STORAGE_KEYS.TTS_SPEED, ttsSpeed.toString());
  }, [ttsSpeed]);

  // ── Internal TTS implementation ────────────────────────────────
  const speakTextInternal = useCallback(async (text, locale = 'en') => {
    if (kokoroRef.current?.isReady) {
      try {
        const spoke = await kokoroRef.current.speak(text, { voice: voiceId, speed: ttsSpeed });
        if (spoke) return true;
      } catch (e) {
        console.warn('[VoixVive] Kokoro TTS failed, falling back to Web Speech', e);
      }
    }

    // Web Speech API fallback (zero download, OS-dependent quality)
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const isFrench = locale.startsWith('fr');

      let attempts = 0;
      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          if (++attempts >= 50) { // 50 × 100ms = 5s max wait
            resolve(false);
            return;
          }
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
  }, [voiceId, ttsSpeed]);

  const { speakText, clearQueue } = useAudioQueue(speakTextInternal);

  // ── Detect which backend is alive ──────────────────────────────
  const detectBackend = useCallback(async () => {
    setError(null);
    try {
      const raw = vvGet(STORAGE_KEYS.TRACTION);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings?.aiEnabled === false) {
          setIsReady(true); setBackend('offline');
          return { connected: true, backend: 'offline', model: { id: 'truebadour-offline-static' } };
        }
      }
    } catch { /* proceed */ }

    // ── 1. Try LM Studio (localhost:1234) ────────────────────────
    try {
      const res = await fetch(`${lmStudioRef.current.url}/models`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.length > 0) {
          lmStudioRef.current.connected = true;
          lmStudioRef.current.model = data.data[0].id;
          setIsReady(true);
          setBackend('lmstudio');
          return { connected: true, backend: 'lmstudio', model: data.data[0] };
        }
      }
    } catch { /* LM Studio not running */ }

    // ── 2. Try wllama (in-browser GGUF) ─────────────────────────
    if (wllamaRef.current?.isReady) {
      setIsReady(true); setBackend('wllama');
      return { connected: true, backend: 'wllama', model: { id: wllamaRef.current.modelId || 'LFM2.5-1.2B-Q4' } };
    }

    setIsReady(false); setBackend('loading');
    return { connected: false, backend: 'loading', model: null };
  }, []);

  const { chatStream } = useTruebadourChat({
    backend, lmStudioRef, wllamaRef, speakText, setIsLoading,
  });

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    clearQueue();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (bertrandRef.current?.cancel) bertrandRef.current.cancel();
  }, [clearQueue]);

  return {
    isReady,
    isLoading,
    error,
    backend,
    detectBackend,
    chatStream,
    speakText,
    cancel,
    wllamaRef,
    kokoroRef,
    voiceRef,
    bertrandRef,
  };
}
