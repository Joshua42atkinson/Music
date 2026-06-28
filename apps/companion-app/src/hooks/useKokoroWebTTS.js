// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useKokoroWebTTS.js                                   ║
// ║ WHAT    : Kokoro-82M WASM TTS engine hook — generates audio    ║
// ║           from text with full voice/speed/pitch/volume control ║
// ║ WHY     : In-browser neural TTS, no server required.           ║
// ║           Works offline after model download (~82M params)     ║
// ║ WHO     : TruebadourProvider (via bertrandRef)                 ║
// ║ OWNS    : KokoroTTS instance lifecycle, AudioContext, GainNode ║
// ║ NEEDS   : kokoro-js npm package, wasm files in public/         ║
// ║ RULES   : Always cancel previous source before starting new.   ║
// ║           Pitch via detune (cents), volume via GainNode.       ║
// ║           Lazy init — only loads model after user gesture.     ║
// ║ FIX AT  : SharedArrayBuffer errors → need COOP/COEP headers.   ║
// ║           AudioContext suspended → call resume() on click.     ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝
import { useState, useCallback, useRef } from 'react';
import { getAudioContext, resumeAudio } from '../audio/audioEngine';
import { devError } from '../lib/devLog';

export function useKokoroWebTTS() {
  const [isReady, setIsReady]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress]   = useState(0);

  const ttsRef          = useRef(null);
  const gainNodeRef     = useRef(null);
  const currentSourceRef = useRef(null); // so we can cancel mid-play
  const isLoadingRef    = useRef(false);

  // ── Lazy model init ──────────────────────────────────────────
  const init = useCallback(async () => {
    if (ttsRef.current || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const { KokoroTTS } = await import('kokoro-js');
      const { env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;
      env.allowRemoteModels = true;
      ttsRef.current = await KokoroTTS.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        { dtype: 'q8', device: 'wasm' }
      );
      setIsReady(true);
      setProgress(100);
    } catch (e) {
      devError('[Kokoro] Failed to init:', e);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // ── Ensure shared AudioContext + gain node ─────────────────
  const ensureContext = useCallback(async () => {
    const ctx = resumeAudio();
    if (!ctx) return null;
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) { devError('[Kokoro] Resume failed:', e); }
    }
    return ctx;
  }, []);

  // ── Cancel any current playback ──────────────────────────────
  const cancel = useCallback(() => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch { /* already stopped */ }
      currentSourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // ── Main speak function ──────────────────────────────────────
  const speak = useCallback(async (text, {
    voice  = 'am_adam',
    speed  = 1.0,
    pitch  = 1.0,    // 1.0 = natural; mapped to detune cents (±1200 = ±1 octave)
    volume = 1.0,    // 0.0–1.0
  } = {}) => {
    if (!text?.trim()) return false;

    // Lazy init if needed
    if (!ttsRef.current) await init();
    if (!ttsRef.current) return false;

    cancel(); // stop any previous
    setIsSpeaking(true);
    const ctx = await ensureContext();
    if (!ctx) {
      setIsSpeaking(false);
      return false;
    }

    try {
      const audioData = await ttsRef.current.generate(text, { voice, speed });

      // Build buffer
      const buffer = ctx.createBuffer(1, audioData.audio.length, audioData.sampling_rate);
      buffer.getChannelData(0).set(audioData.audio);

      // Source node
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      // Pitch via detune: semitones * 100 cents; map pitch 0.5–1.5 → -1200 to +1200 cents
      source.detune.value = (pitch - 1.0) * 1200;

      // Volume via gain
      if (gainNodeRef.current) gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));

      source.connect(gainNodeRef.current || ctx.destination);
      currentSourceRef.current = source;

      return new Promise((resolve) => {
        source.onended = () => {
          currentSourceRef.current = null;
          setIsSpeaking(false);
          resolve(true);
        };
        source.start(0);
      });
    } catch (e) {
      devError('[Kokoro] Speech generation failed:', e);
      setIsSpeaking(false);
      return false;
    }
  }, [init, cancel, ensureContext]);

  // ── Generate blob (for download) ────────────────────────────
  const generateBlob = useCallback(async (text, { voice = 'am_adam', speed = 1.0 } = {}) => {
    if (!ttsRef.current) await init();
    if (!ttsRef.current) return null;
    try {
      const audioData = await ttsRef.current.generate(text, { voice, speed });
      const rate = audioData.sampling_rate;
      const pcm = audioData.audio;
      const wavBuffer = float32ToWav(pcm, rate);
      // Return Blob directly — caller must manage URL lifecycle
      return new Blob([wavBuffer], { type: 'audio/wav' });
    } catch (e) {
      devError('[Kokoro] generateBlob failed:', e);
      return null;
    }
  }, [init]);

  return { isReady, isLoading, isSpeaking, progress, speak, init, cancel, generateBlob };
}

// ── Float32 PCM → WAV ArrayBuffer helper ────────────────────────
function float32ToWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view   = new DataView(buffer);
  const writeString = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1,  true);  // PCM
  view.setUint16(22, 1,  true);  // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let o = 44;
  for (let i = 0; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}
