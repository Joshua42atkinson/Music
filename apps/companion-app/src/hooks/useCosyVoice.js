import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudioAudio } from './useStudioAudio';

// ═══════════════════════════════════════════════════════════
// useCosyVoice — Bertrand's Living Voice (CosyVoice2 0.5B)
//
// Two-layer architecture for app health:
//   1. Python Server (primary) — sub-second voice clone via local GPU
//   2. WebGPU Worker (fallback) — in-browser ONNX for offline/edge
//
// The voice is FREE for all users. "Information is free,
// transformation is paid." — 12M Bible
//
// Bertrand's voice IS the brand. Every user hears the truebadour.
// ═══════════════════════════════════════════════════════════

const COSYVOICE_SERVER = import.meta.env.VITE_COSYVOICE_API_URL || 'http://localhost:8000';

export function useCosyVoice() {
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mode, setMode] = useState(null); // 'server' | 'webgpu' | null
  const workerRef = useRef(null);
  const { playStudioAudio, stopStudioAudio } = useStudioAudio();
  const [referenceAudio, setReferenceAudio] = useState(null);
  const serverAvailableRef = useRef(null); // cached server check

  // ── Probe the CosyVoice Python server ──────────────────────
  const checkServer = useCallback(async () => {
    if (serverAvailableRef.current !== null) return serverAvailableRef.current;
    try {
      const res = await fetch(`${COSYVOICE_SERVER}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      const ok = res.ok;
      serverAvailableRef.current = ok;
      return ok;
    } catch {
      // Server not running — try the old /tts endpoint as a ping
      try {
        const res = await fetch(`${COSYVOICE_SERVER}/tts`, {
          method: 'OPTIONS',
          signal: AbortSignal.timeout(1500),
        });
        serverAvailableRef.current = res.ok || res.status === 405;
        return serverAvailableRef.current;
      } catch {
        serverAvailableRef.current = false;
        return false;
      }
    }
  }, []);

  // ── Load reference audio for voice cloning ────────────────
  useEffect(() => {
    fetch('/assets/bertrand_ref_best.wav')
      .then(res => res.arrayBuffer())
      .then(data => setReferenceAudio(data))
      .catch(err => {
        if (import.meta.env.DEV) console.warn("[CosyVoice] No reference audio:", err);
      });
  }, []);

  // ── Initialize: try server first, then WebGPU worker ──────
  const initTTS = useCallback(async () => {
    if (isReady) return;

    // Strategy 1: Check for Python server (instant, no download)
    const serverOk = await checkServer();
    if (serverOk) {
      setMode('server');
      setLoadProgress(100);
      setIsReady(true);
      if (import.meta.env.DEV) console.log('[CosyVoice] Server mode active');
      return;
    }

    // Strategy 2: WebGPU ONNX worker (requires model download)
    if (import.meta.env.DEV) console.log('[CosyVoice] No server, trying WebGPU worker...');
    try {
      workerRef.current = new Worker(
        new URL('../workers/cosyVoiceWorker.js', import.meta.url),
        { type: 'module' }
      );

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebGPU load timeout'));
        }, 120000); // 2 min timeout for large model download

        workerRef.current.onmessage = (e) => {
          const { status, progress, error } = e.data;
          if (status === 'progress') {
            setLoadProgress(progress);
          } else if (status === 'ready') {
            clearTimeout(timeout);
            setMode('webgpu');
            setIsReady(true);
            if (import.meta.env.DEV) console.log('[CosyVoice] WebGPU mode active');
            resolve();
          } else if (status === 'error') {
            clearTimeout(timeout);
            console.error('[CosyVoice] WebGPU error:', error);
            reject(new Error(error));
          }
        };

        workerRef.current.postMessage({ type: 'load' });
      });
    } catch (err) {
      console.warn('[CosyVoice] WebGPU init failed:', err);
      // Neither server nor WebGPU available — cascade will fall through to Kokoro
    }
  }, [isReady, checkServer]);

  // ── Speak via server ─────────────────────────────────────
  const speakViaServer = useCallback(async (text, locale = 'en') => {
    try {
      const body = {
        text,
        prompt_text: locale === 'fr'
          ? "Bonjour, je suis Bertrand, votre guide truebadour."
          : "Hello, I am Bertrand, your truebadour guide.",
      };

      const res = await fetch(`${COSYVOICE_SERVER}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000), // 15s max for generation
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      // Server returns WAV audio
      const audioBuffer = await res.arrayBuffer();
      const audioData = new Float32Array(audioBuffer.byteLength / 4);

      // Parse WAV: skip 44-byte header, read PCM data
      const dataView = new DataView(audioBuffer);
      const headerSize = 44;
      for (let i = 0; i < audioData.length && (headerSize + i * 2) < audioBuffer.byteLength; i++) {
        // 16-bit PCM to float
        audioData[i] = dataView.getInt16(headerSize + i * 2, true) / 32768;
      }

      // Get sample rate from WAV header (bytes 24-27)
      const sampleRate = dataView.getUint32(24, true);

      return playStudioAudio(audioData, sampleRate);
    } catch (err) {
      console.warn('[CosyVoice] Server speak failed:', err);
      // Mark server as unavailable so next call tries WebGPU
      serverAvailableRef.current = false;
      return false;
    }
  }, [playStudioAudio]);

  // ── Speak via WebGPU worker ──────────────────────────────
  const speakViaWorker = useCallback(async (text, locale = 'en') => {
    if (!workerRef.current) return false;

    return new Promise((resolve) => {
      const onMessage = (e) => {
        const { status, audio, sampling_rate, error } = e.data;
        if (status === 'complete' && audio) {
          workerRef.current.removeEventListener('message', onMessage);
          playStudioAudio(audio, sampling_rate).then(resolve);
        } else if (status === 'error') {
          workerRef.current.removeEventListener('message', onMessage);
          console.warn('[CosyVoice] Worker generation error:', error);
          resolve(false);
        }
      };

      workerRef.current.addEventListener('message', onMessage);
      workerRef.current.postMessage({
        type: 'generate',
        text,
        locale,
        referenceAudio,
      });
    });
  }, [referenceAudio, playStudioAudio]);

  // ── Main speak function — routes to best available ───────
  const speak = useCallback(async (text, locale = 'en') => {
    if (!isReady) {
      if (import.meta.env.DEV) console.warn("[CosyVoice] Not ready yet");
      return false;
    }

    // Try server first (even if we loaded via WebGPU, server may have come online)
    if (mode === 'server' || serverAvailableRef.current) {
      const result = await speakViaServer(text, locale);
      if (result) return true;
    }

    // Fall back to WebGPU worker
    if (mode === 'webgpu' && workerRef.current) {
      return speakViaWorker(text, locale);
    }

    return false;
  }, [isReady, mode, speakViaServer, speakViaWorker]);

  // ── Generate Blob ──────────────────────────────────────────
  const generateBlob = useCallback(async (text, locale = 'en') => {
    if (!isReady) return null;

    if (mode === 'server' || serverAvailableRef.current) {
      try {
        const body = {
          text,
          prompt_text: locale === 'fr'
            ? "Bonjour, je suis Bertrand, votre guide truebadour."
            : "Hello, I am Bertrand, your truebadour guide.",
        };
        const res = await fetch(`${COSYVOICE_SERVER}/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const blob = await res.blob();
        // Return Blob directly — caller must manage URL lifecycle
        return blob;
      } catch (err) {
        console.warn('[CosyVoice] Server generateBlob failed:', err);
        return null;
      }
    }

    if (mode === 'webgpu' && workerRef.current) {
      return new Promise((resolve) => {
        const onMessage = (e) => {
          const { status, audio, sampling_rate } = e.data;
          if (status === 'complete' && audio) {
            workerRef.current.removeEventListener('message', onMessage);
            const wavBlob = audioToWav(audio, sampling_rate);
            // Return Blob directly — caller must manage URL lifecycle
            resolve(wavBlob);
          } else if (status === 'error') {
            workerRef.current.removeEventListener('message', onMessage);
            resolve(null);
          }
        };
        workerRef.current.addEventListener('message', onMessage);
        workerRef.current.postMessage({ type: 'generate', text, locale, referenceAudio });
      });
    }

    return null;
  }, [isReady, mode, referenceAudio]);

  // ── Cancel ───────────────────────────────────────────────
  const cancel = useCallback(() => {
    stopStudioAudio();
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'cancel' });
    }
  }, [stopStudioAudio]);

  // ── Cleanup ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { isReady, loadProgress, mode, initTTS, speak, generateBlob, cancel };
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
