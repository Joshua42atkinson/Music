import { devWarn, devLog } from '../lib/devLog';
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
import { isWebLLMReady, getWebLLMEngine, subscribeToWebLLMProgress } from '../lib/webllmEngine';

// ═══════════════════════════════════════════════════════════════════
// useTruebadourAI — Unified AI hook for the Truebadour
//
// TTS: Exclusive Piper TTS (Baked-in Bertrand Voice)
// Voice Input: Web Speech Recognition (now)
// The voice IS the product. "Voix Vive" = "Living Voice."
// ═══════════════════════════════════════════════════════════════════

export function useTruebadourAI({ accessToken = null } = {}) {
  const [isReady, setIsReady]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [backend, setBackend]   = useState(null); // 'google-oauth' | 'google' | 'offline' | 'webgpu' | 'nano'
  const [webLLMProgress, setWebLLMProgress] = useState(null);
  const abortRef    = useRef(null);
  const kokoroRef   = useRef(null);
  const voiceRef    = useRef(null);
  const bertrandRef = useRef(null);

  // ── Voice Preferences ─────────────────────────────────────────
  const [voiceId] = useState(() => vvGet(STORAGE_KEYS.VOICE_ID) || 'am_adam');
  const [ttsSpeed] = useState(() => parseFloat(vvGet(STORAGE_KEYS.TTS_SPEED)) || 1.0);

  useEffect(() => {
    vvSet(STORAGE_KEYS.VOICE_ID, voiceId);
  }, [voiceId]);

  useEffect(() => {
    vvSet(STORAGE_KEYS.TTS_SPEED, ttsSpeed.toString());
  }, [ttsSpeed]);

  // Subscribe to WebLLM download progress
  useEffect(() => {
    const unsubscribe = subscribeToWebLLMProgress((progress) => {
      setWebLLMProgress(progress);
    });
    return unsubscribe;
  }, []);

  // ── Internal TTS implementation ────────────────────────────────
  const speakTextInternal = useCallback(async (text, locale = 'en') => {
    if (kokoroRef.current?.isReady) {
      try {
        const spoke = await kokoroRef.current.speak(text, { voice: voiceId, speed: ttsSpeed });
        if (spoke) return true;
      } catch (e) {
        devWarn('[VoixVive] Kokoro TTS failed, falling back to Web Speech', e);
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

    // ── 0. Student Google OAuth Gemini — best path for logged-in students ──
    // When a student logs in with Google, their OAuth token can call the Gemini API
    // directly. The student's own Google AI quota pays for the request — zero API
    // cost for us. This is the "MCP for Gemini" pattern.
    if (accessToken) {
      try {
        const { canUseGeminiOAuth } = await import('../lib/geminiOAuth');
        const canUse = await canUseGeminiOAuth(accessToken);
        if (canUse) {
          setIsReady(true);
          setBackend('google-oauth');
          devLog('[VoixVive] Using student Google OAuth for Gemini — zero API cost');
          return { connected: true, backend: 'google-oauth', model: { id: 'gemini-2.5-flash-student-oauth' } };
        }
      } catch (err) {
        devWarn('[VoixVive] Student OAuth Gemini check failed, trying other backends', err);
      }
    }

    // ── 1. Try Google Gemini Nano (Local Edge via window.ai) ─────
    try {
      if (typeof window !== 'undefined' && window.ai) {
        const canCreate = await window.ai.canCreateTextSession();
        if (canCreate === 'readily' || canCreate === 'after-download') {
          setIsReady(true);
          setBackend('nano');
          return { connected: true, backend: 'nano', model: { id: 'gemini-nano-local' } };
        }
      }
    } catch (err) {
      devWarn('[VoixVive] Nano check failed, falling back to WebGPU/Cloud', err);
    }

    // ── 1.5 Try WebGPU (WebLLM - Llama 3.2 3B) ───────────────────
    try {
      if (typeof navigator !== 'undefined' && navigator.gpu) {
        setIsReady(true);
        setBackend('webgpu');
        return { connected: true, backend: 'webgpu', model: { id: 'Llama-3.2-3B-Instruct' } };
      }
    } catch (err) {
      devWarn('[VoixVive] WebGPU not supported, falling back to cloud', err);
    }

    // ── 2. Fallback to Firebase Vertex AI (Google Gemini Cloud) ──
    try {
      const { isAiAvailable } = await import('../lib/firebaseAI');
      if (isAiAvailable) {
        setIsReady(true);
        setBackend('google');
        return { connected: true, backend: 'google', model: { id: 'gemini-2.5-flash-latest' } };
      }
    } catch { /* Firebase AI not available */ }

    setIsReady(false); setBackend('loading');
    return { connected: false, backend: 'loading', model: null };
  }, [accessToken]);

  const { chatStream } = useTruebadourChat({
    backend, speakText, setIsLoading, accessToken,
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
    kokoroRef,
    voiceRef,
    bertrandRef,
    webLLMProgress,
    accessToken,
  };
}
