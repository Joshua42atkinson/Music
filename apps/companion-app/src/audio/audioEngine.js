import { devWarn } from '../lib/devLog';
import { devError } from '../lib/devLog';
/**
 * Voix Vive Audio Engine
 * Centralized Web Audio API manager to prevent "Hardware Context Exhaustion".
 * Browsers strictly limit the number of active AudioContexts (usually 6 max).
 * Sharing a single context across all components ensures stability.
 */

let sharedCtx = null;

/**
 * Returns the singleton AudioContext, creating it if it doesn't exist.
 */
export function getAudioContext() {
  if (!sharedCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      sharedCtx = new AC();
    }
  }
  return sharedCtx;
}

/**
 * Resumes the AudioContext if it was suspended (due to browser autoplay policies).
 * Call this immediately before synthesizing any sound.
 */
export function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/**
 * Returns true if the AudioContext is suspended and requires a user gesture
 * to resume. Use this to show a "Click to enable audio" prompt.
 */
export function isAudioPermissionNeeded() {
  const ctx = getAudioContext();
  return !!ctx && ctx.state === 'suspended';
}

/**
 * Closes the shared context (useful for cleanup, though rarely needed in SPAs).
 */
export function closeAudioContext() {
  if (sharedCtx && sharedCtx.state !== 'closed') {
    sharedCtx.close();
    sharedCtx = null;
  }
}

// ═══════════════════════════════════════════════════════════
// SHARED SYNTHESIZERS
// ═══════════════════════════════════════════════════════════

/**
 * The signature "PLING!" sound used when hitting an orb.
 */
export function playPling(freq) {
  const ctx = resumeAudio();
  if (!ctx || !freq) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Triangle wave adds a bit of harmonic richness
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) {
    devWarn('playPling failed', e);
  }
}

/**
 * A sustained reference tone used in the Adventure Player.
 */
export function playReferenceTone(freq) {
  const ctx = resumeAudio();
  if (!ctx || !freq) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) {
    devWarn('playReferenceTone failed', e);
  }
}

/**
 * A plucked string synthesis for the Rhythm Engine.
 */
export function playPluckedString(freq, time) {
  const ctx = resumeAudio();
  if (!ctx || !freq) return;
  try {
    const t = time !== undefined ? time : ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc2.type = 'sine'; // Add body

    osc.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, t);
    filter.frequency.exponentialRampToValueAtTime(freq, t + 0.5);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(envelope);
    envelope.connect(ctx.destination);
    
    envelope.gain.setValueAtTime(0, t);
    envelope.gain.linearRampToValueAtTime(0.7, t + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 1.0);
    osc2.stop(t + 1.0);
  } catch (e) {
    devWarn('playPluckedString failed', e);
  }
}

/**
 * Metronome click sound.
 */
export function playMetronomeClick(isDownbeat, time, volume = 1.0) {
  const ctx = resumeAudio();
  if (!ctx) return;
  try {
    const t = time !== undefined ? time : ctx.currentTime;
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();
    
    osc.connect(envelope);
    envelope.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(isDownbeat ? 880.0 : 440.0, t);
    
    const peak = 0.05 * volume;
    envelope.gain.setValueAtTime(0, t);
    envelope.gain.linearRampToValueAtTime(peak, t + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.start(t);
    osc.stop(t + 0.05);
  } catch (e) {
    devWarn('playMetronomeClick failed', e);
  }
}

// ═══════════════════════════════════════════════════════════
// MICROPHONE INGESTION (WEB AUDIO API)
// ═══════════════════════════════════════════════════════════

let micStream = null;
let micSource = null;
let micAnalyser = null;
let micRefCount = 0;

/**
 * Initializes the microphone and returns an AnalyserNode.
 * Disables processing (echoCancellation, etc.) to get clean raw audio.
 */
export async function initMicrophone() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  if (!micStream) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });
      micSource = ctx.createMediaStreamSource(micStream);
      micAnalyser = ctx.createAnalyser();
      micAnalyser.fftSize = 2048;
      micSource.connect(micAnalyser);
    } catch (err) {
      devError("[AudioEngine] Microphone access failed:", err);
      return null;
    }
  }

  // Each caller gets its own analyser so multiple consumers (pitch detector,
  // hands-free VAD, etc.) can read the microphone independently.
  const callerAnalyser = ctx.createAnalyser();
  callerAnalyser.fftSize = 2048;
  micSource.connect(callerAnalyser);

  micRefCount++;
  return { stream: micStream, analyser: callerAnalyser };
}

/**
 * Returns the active AnalyserNode if initialized.
 */
export function getMicrophoneAnalyser() {
  return micAnalyser;
}

/**
 * Returns the active MediaStream if initialized.
 */
export function getMicrophoneStream() {
  return micStream;
}

/**
 * Decrements the reference count and closes the microphone stream if no consumers remain.
 */
export function closeMicrophone(force = false) {
  if (!force && micRefCount > 0) {
    micRefCount--;
  }
  
  if (force || micRefCount === 0) {
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
    if (micAnalyser) {
      micAnalyser.disconnect();
      micAnalyser = null;
    }
    micRefCount = 0;
  }
}

