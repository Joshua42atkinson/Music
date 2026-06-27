import { devWarn } from '../lib/devLog';
import { useState, useCallback, useRef } from 'react';
import { getAudioContext, resumeAudio } from '../audio/audioEngine';
import { devError } from '../lib/devLog';

// ═══════════════════════════════════════════════════════════════════
// useKokoroTTS — In-browser neural TTS via Kokoro-82M
// #1 on TTS Arena. 82M params. WebGPU/WASM. French + English.
// This IS the Living Voice (Voix Vive).
//
// FRENCH TTS STATUS (June 2026):
//   Kokoro-82M: 1 French voice (SIWIS, <11hrs training) — thin but functional
//   Voxtral 4B: 20 voices, 9 languages, CC BY-NC 4.0 — license blocks commercial
//   StepAudio TTS 3B: Apache 2.0, but 9.26 GB BF16 — server-only, no in-browser
//   Future: fine-tune Kokoro French voice on Bertrand's recordings
//
// Architecture: Kokoro is the in-browser TTS for Voix tier.
//   Chant tier uses StepAudio R1.1 33B (server-side, already working).
// ═══════════════════════════════════════════════════════════════════

const KOKORO_MODEL_ID = 'models/kokoro';

// Voice IDs — Kokoro uses hash-based voice IDs
// French: SIWIS dataset (lang_code 'f') — only 1 French voice, <11hrs training
// English: Multiple voices (lang_code 'a' American, 'b' British)
//
// FRENCH LIMITATION: Only 1 French voice. Quality is acceptable but not
// mentor-grade. Future path: fine-tune a custom French mentor voice
// using Bertrand's actual speech patterns + Kokoro's StyleTTS2 architecture.
const VOICE_MAP = {
  'en': { langCode: 'a', voiceId: 'am_adam' },      // Default English, male mentor (was af_bella)
  'fr': { langCode: 'f', voiceId: 'ff_siwis' },     // Custom Bertrand Voice (overwriting SIWIS slot)
  'en-mentor': { langCode: 'a', voiceId: 'am_adam' }, // American English, male mentor
  'en-warm': { langCode: 'a', voiceId: 'af_nicole' }, // Warm, thoughtful female
  'en-calm': { langCode: 'b', voiceId: 'bf_alice' },  // British English, calm
};

export function useKokoroTTS() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [speechSpeed, setSpeechSpeed] = useState(0.95);
  const ttsRef = useRef(null);

  const initTTS = useCallback(async () => {
    if (ttsRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLoadProgress(0);

    try {
      const { KokoroTTS } = await import('kokoro-js');
      const { env } = await import('@huggingface/transformers');
      
      env.allowLocalModels = true;
      env.allowRemoteModels = false;
      env.localModelPath = '/';

      const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
        dtype: 'q8',            // q8 = good quality/size balance (~300MB)
        device: 'webgpu',       // Prefer WebGPU, falls back to WASM
        progress_callback: ({ progress }) => {
          if (progress !== undefined) {
            setLoadProgress(Math.round(progress * 100));
          }
        },
      });

      ttsRef.current = tts;
      setIsReady(true);
    } catch (err) {
      devError('[KokoroTTS] Init failed:', err);
      // Try WASM fallback if WebGPU failed
      try {
        const { KokoroTTS } = await import('kokoro-js');
        const { env } = await import('@huggingface/transformers');
        env.allowLocalModels = true;
        env.allowRemoteModels = false;
        env.localModelPath = '/';
        const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: ({ progress }) => {
            if (progress !== undefined) {
              setLoadProgress(Math.round(progress * 100));
            }
          },
        });
        ttsRef.current = tts;
        setIsReady(true);
      } catch (fallbackErr) {
        devError('[KokoroTTS] WASM fallback also failed:', fallbackErr);
        setError(fallbackErr.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const speak = useCallback(async (text, locale = 'en', voiceOverride = null) => {
    if (!ttsRef.current) return false;

    try {
      const langPrefix = locale.startsWith('fr') ? 'fr' : 'en';
      const voiceConfig = voiceOverride
        ? VOICE_MAP[voiceOverride] || VOICE_MAP[langPrefix]
        : VOICE_MAP[langPrefix] || VOICE_MAP['en'];

      // Generate audio waveform
      const audio = await ttsRef.current.generate(text, {
        voice: voiceConfig.voiceId,
        speed: speechSpeed,
      });

      // Play via shared Web Audio API
      const ctx = resumeAudio();
      if (!ctx) return false;

      const buffer = ctx.createBuffer(1, audio.audio.length, audio.sampling_rate);
      buffer.getChannelData(0).set(audio.audio);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      return true;
    } catch (err) {
      devError('[KokoroTTS] Speak failed:', err);
      return false;
    }
  }, [speechSpeed]);

  const generateBlob = useCallback(async (text, locale = 'en', voiceOverride = null) => {
    if (!ttsRef.current) return null;

    try {
      const langPrefix = locale.startsWith('fr') ? 'fr' : 'en';
      const voiceConfig = voiceOverride
        ? VOICE_MAP[voiceOverride] || VOICE_MAP[langPrefix]
        : VOICE_MAP[langPrefix] || VOICE_MAP['en'];

      const audio = await ttsRef.current.generate(text, {
        voice: voiceConfig.voiceId,
        speed: speechSpeed,
      });

      // Return Blob directly — caller must manage URL lifecycle
      return audioToWav(audio.audio, audio.sampling_rate);
    } catch (err) {
      devError('[KokoroTTS] Generate failed:', err);
      return null;
    }
  }, [speechSpeed]);

  const initAndSpeak = useCallback(async (text, locale = 'en', voiceOverride = null) => {
    // 1. Ensure shared AudioContext is resumed upon user interaction
    const ctx = resumeAudio();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 2. Init TTS if needed
    if (!ttsRef.current) {
      await initTTS();
    }
    
    // 3. Wait for TTS to be ready (if it was already loading)
    let attempts = 0;
    while (!ttsRef.current && attempts < 100) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }

    if (!ttsRef.current) {
      devWarn('[KokoroTTS] Timeout waiting for TTS initialization');
      return false;
    }

    // 4. Speak
    return speak(text, locale, voiceOverride);
  }, [initTTS, speak]);

  const unload = useCallback(async () => {
    ttsRef.current = null;
    setIsReady(false);
    setLoadProgress(0);
    // Don't close the shared AudioContext — other consumers may need it
  }, []);

  return {
    isReady,
    isLoading,
    error,
    loadProgress,
    initTTS,
    initAndSpeak,
    speak,
    generateBlob,
    unload,
    VOICE_MAP, // expose for UI voice selection
    speechSpeed,
    setSpeechSpeed,
  };
}

// ── WAV encoder (raw Float32 → WAV blob) ───────────────────────
function audioToWav(samples, sampleRate) {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);         // PCM
  view.setUint16(22, 1, true);         // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);         // block align
  view.setUint16(34, 16, true);        // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Float32 → Int16
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
