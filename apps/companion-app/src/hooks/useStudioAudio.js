import { useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// useStudioAudio — The Truebadour's Vocal Booth
//
// A professional-grade audio processing chain that makes
// AI-generated speech sound warm, present, and human.
//
// Chain: Input → Low-Cut → De-Esser → EQ (Warmth + Presence)
//        → Compressor → (Dry + Reverb) → Stereo Widener → Output
//
// "The voice IS the product." — 12M Bible
// ═══════════════════════════════════════════════════════════
export function useStudioAudio() {
  const audioContextRef = useRef(null);
  const chainEntryRef = useRef(null); // First node in the chain (connect source here)
  const isPlayingRef = useRef(false);
  const sourceNodeRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Generate a synthetic Impulse Response for a warm vocal booth
  const generateReverbIR = (ctx) => {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 1.2; // 1.2s tail — intimate, not cavernous
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      // Early reflections (first 30ms) + diffuse tail
      const earlyDecay = t < 0.03 ? 1 : 0;
      const lateDecay = Math.exp(-t / 0.25); // 250ms RT60 — tight booth
      const decay = earlyDecay * 0.3 + lateDecay;

      // Subtle modulation for natural character
      const mod = Math.sin(i * 0.003) * 0.08 + 0.92;

      left[i] = (Math.random() * 2 - 1) * decay * mod;
      right[i] = (Math.random() * 2 - 1) * decay * mod;
    }
    return impulse;
  };

  const initChain = useCallback(() => {
    if (isInitializedRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;

    // ── 1. Low-Cut Filter (80Hz HPF — removes rumble) ────────
    const lowCut = ctx.createBiquadFilter();
    lowCut.type = 'highpass';
    lowCut.frequency.value = 80;
    lowCut.Q.value = 0.7; // Gentle slope

    // ── 2. De-Esser (tame sibilance at 5-8kHz) ──────────────
    // Implemented as a narrow-band compressor via biquad + gain
    const deEsser = ctx.createBiquadFilter();
    deEsser.type = 'peaking';
    deEsser.frequency.value = 6500; // Sibilance center
    deEsser.Q.value = 2.0; // Narrow band
    deEsser.gain.value = -4.0; // Attenuate 4dB

    // ── 3. EQ: Warmth (low shelf boost) ──────────────────────
    const eqLow = ctx.createBiquadFilter();
    eqLow.type = 'lowshelf';
    eqLow.frequency.value = 160; // Warmth — chest resonance
    eqLow.gain.value = 2.5; // +2.5dB warmth

    // ── 4. EQ: Presence (high shelf boost) ───────────────────
    const eqHigh = ctx.createBiquadFilter();
    eqHigh.type = 'highshelf';
    eqHigh.frequency.value = 3500; // Presence — intelligibility
    eqHigh.gain.value = 1.5; // +1.5dB clarity

    // ── 5. EQ: Body (mid dip to reduce boxiness) ─────────────
    const eqMid = ctx.createBiquadFilter();
    eqMid.type = 'peaking';
    eqMid.frequency.value = 400; // Boxy frequencies
    eqMid.Q.value = 1.0;
    eqMid.gain.value = -2.0; // -2dB to open up

    // ── 6. Dynamics Compressor (even out levels) ─────────────
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 10;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003; // Fast attack for speech
    compressor.release.value = 0.15;

    // ── 7. Reverb (convolver with dry/wet mix) ───────────────
    const convolver = ctx.createConvolver();
    convolver.buffer = generateReverbIR(ctx);

    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.12; // 12% wet — intimate, not washy

    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.92;

    // ── 8. Stereo Widener (subtle stereo image) ──────────────
    // Done via a very short delay on one channel
    const widenerDelay = ctx.createDelay();
    widenerDelay.delayTime.value = 0.0003; // 0.3ms — Haas effect

    const widenerGain = ctx.createGain();
    widenerGain.gain.value = 0.08; // Very subtle

    // ── 9. Output Limiter (prevent clipping) ─────────────────
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -1;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.01;

    // ── Wire the chain ───────────────────────────────────────
    // Main path: LowCut → DeEsser → EQ → Compressor → split
    lowCut.connect(deEsser);
    deEsser.connect(eqLow);
    eqLow.connect(eqHigh);
    eqHigh.connect(eqMid);
    eqMid.connect(compressor);

    // Dry path: Compressor → dryGain → limiter → output
    compressor.connect(dryGain);
    dryGain.connect(limiter);

    // Wet path: Compressor → reverb → wetGain → limiter → output
    compressor.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(limiter);

    // Widener: limiter → widener → output (subtle stereo)
    limiter.connect(ctx.destination);
    limiter.connect(widenerDelay);
    widenerDelay.connect(widenerGain);
    widenerGain.connect(ctx.destination);

    chainEntryRef.current = lowCut;
    isInitializedRef.current = true;
  }, []);

  // Lazy init on first use
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playStudioAudio = useCallback((audioData, samplingRate) => {
    // Lazy-init the audio chain
    if (!isInitializedRef.current) {
      initChain();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return Promise.resolve(false);

    // Ensure context is running
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop any currently playing audio
    if (sourceNodeRef.current && isPlayingRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch { /* ignore */ }
    }

    // Convert raw Float32 array to AudioBuffer
    const buffer = ctx.createBuffer(1, audioData.length, samplingRate);
    buffer.getChannelData(0).set(audioData);

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Connect to the start of the studio chain
    source.connect(chainEntryRef.current);
    sourceNodeRef.current = source;

    return new Promise((resolve) => {
      source.onended = () => {
        isPlayingRef.current = false;
        resolve(true);
      };

      isPlayingRef.current = true;
      source.start(0);
    });
  }, [initChain]);

  const stopStudioAudio = useCallback(() => {
    if (sourceNodeRef.current && isPlayingRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch { /* ignore */ }
      isPlayingRef.current = false;
    }
  }, []);

  return { playStudioAudio, stopStudioAudio };
}
