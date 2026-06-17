import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTruebadourAI } from './useTruebadourAI';
import { useWllamaTruebadour } from './useWllamaTruebadour';
import { useVoiceInput } from './useVoiceInput';
import { useKokoroWebTTS } from './useKokoroWebTTS';
import { useVoicePreferences } from './useVoicePreferences';
import { useAuth } from './useAuth';
import { usePlayerState } from './usePlayerState';

const TruebadourContext = createContext(null);

export function TruebadourProvider({ children }) {
  const ai          = useTruebadourAI();
  const wllama      = useWllamaTruebadour();
  const kokoro      = useKokoroWebTTS();
  const voiceInput  = useVoiceInput();
  const { user }    = useAuth();
  const player      = usePlayerState(); // ← guitar economy engine

  // ── Voice preferences (persisted + Supabase-synced) ──────────
  const voicePrefs = useVoicePreferences({ user });

  // ── Centralized voice loading state ──────────────────────────
  const [voixLoading, setVoixLoading] = useState(false);
  const [voixReady,   setVoixReady]   = useState(false);

  // ── Mutual exclusion: only one widget open at a time ─────────
  const [activeWidget, setActiveWidget] = useState(null); // 'riff' | 'binder' | null
  const openRift   = useCallback(() => setActiveWidget('riff'),   []);
  const openBinder = useCallback(() => setActiveWidget('binder'), []);
  const closeAll   = useCallback(() => setActiveWidget(null),     []);

  // ── Auto-detect backend on mount ─────────────────────────────
  useEffect(() => {
    ai.detectBackend();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Wire refs so useTruebadourAI can call back into the engines
  useEffect(() => { ai.bertrandRef.current = kokoro;     }, [kokoro,     ai.bertrandRef]);
  useEffect(() => { ai.kokoroRef.current   = kokoro;     }, [kokoro,     ai.kokoroRef]);
  useEffect(() => { ai.wllamaRef.current   = wllama;     }, [wllama,     ai.wllamaRef]);
  useEffect(() => { ai.voiceRef.current    = voiceInput; }, [voiceInput, ai.voiceRef]);

  // ── Centralized "Load AI Brain" ───────────────────────────────
  const loadVoix = useCallback(async () => {
    if (voixLoading || voixReady) return;
    setVoixLoading(true);
    try {
      // Load LLM and TTS in parallel — don't let one block the other
      const results = await Promise.allSettled([
        wllama.initEngine(),
        kokoro.init(),
      ]);
      // Log individual results
      if (results[0].status === 'rejected') {
        console.error('[VoixVive] LLM load failed:', results[0].reason);
      }
      if (results[1].status === 'rejected') {
        console.warn('[VoixVive] Kokoro TTS load failed (text chat still works):', results[1].reason);
      }
      // LLM is enough for text chat — TTS is a bonus layer
      if (results[0].status === 'fulfilled') {
        setVoixReady(true);
      }
    } catch (err) {
      console.error('[VoixVive] Voice load failed:', err);
    } finally {
      setVoixLoading(false);
    }
  }, [voixLoading, voixReady, kokoro, wllama]);

  const unloadVoix = useCallback(() => {
    if (wllama.unload) wllama.unload();
    kokoro.cancel();
    setVoixReady(false);
  }, [wllama, kokoro]);

  // Track readiness — LLM alone is enough for text chat
  // Re-detect backend when Wllama comes online so chatStream routes to it
  useEffect(() => {
    if (wllama.isReady) {
      setVoixReady(true);
      ai.detectBackend(); // critical: update backend from 'loading' → 'wllama'
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wllama.isReady]);

  // ── Convenience speak — uses prefs automatically ──────────────
  const speak = useCallback(async (text) => {
    if (!text?.trim()) return;
    if (!kokoro.isReady) await kokoro.init();
    return kokoro.speak(text, {
      voice:  voicePrefs.voiceId,
      speed:  voicePrefs.speed,
      pitch:  voicePrefs.pitch,
      volume: voicePrefs.volume,
    });
  }, [kokoro, voicePrefs]);

  const cancelSpeech = useCallback(() => kokoro.cancel(), [kokoro]);

  const loadProgress = wllama.loadProgress || kokoro.progress || 0;

  return (
    <TruebadourContext.Provider value={{
      ai, kokoro, wllama, voiceInput,
      voixLoading, voixReady, loadVoix, unloadVoix, loadProgress,
      activeWidget, openRift, openBinder, closeAll,
      // Voice preferences
      voicePrefs,
      // Convenience
      speak, cancelSpeech,
      // Keep bertrand alias so old code doesn't break
      bertrand: { ...kokoro, speak, cancel: cancelSpeech, initTTS: kokoro.init },
      // ── Guitar economy (engine-only, invisible to learner) ──────────────
      // Tone · Resonance · Buzz · Voice · Distortion
      player,
    }}>
      {children}
    </TruebadourContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTruebadour() {
  const context = useContext(TruebadourContext);
  if (!context) throw new Error('useTruebadour must be used within a TruebadourProvider');
  return context;
}
