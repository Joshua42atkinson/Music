/**
 * YIN Autocorrelation Pitch Detection Algorithm
 * 
 * This is a highly efficient, pure JavaScript implementation of the YIN algorithm.
 * It takes a time-domain audio buffer (Float32Array) and returns the fundamental frequency (Hz).
 * Used by the Pitch Room to score the user's vocal/guitar performance against a synthesized tone.
 */

export function detectPitch(buffer, sampleRate) {
  const threshold = 0.15;
  const bufferSize = buffer.length;
  const yinBuffer = new Float32Array(bufferSize / 2);

  // Step 1: Calculate difference function
  for (let t = 0; t < yinBuffer.length; t++) {
    yinBuffer[t] = 0;
    for (let i = 0; i < yinBuffer.length; i++) {
      const delta = buffer[i] - buffer[i + t];
      yinBuffer[t] += delta * delta;
    }
  }

  // Step 2: Cumulative mean normalized difference
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let t = 1; t < yinBuffer.length; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] = yinBuffer[t] * t / runningSum;
  }

  // Step 3: Absolute threshold
  let tau = -1;
  for (let t = 2; t < yinBuffer.length; t++) {
    if (yinBuffer[t] < threshold) {
      while (t + 1 < yinBuffer.length && yinBuffer[t + 1] < yinBuffer[t]) {
        t++;
      }
      tau = t;
      break;
    }
  }

  // If no pitch found, return null
  if (tau === -1) {
    // Check if we have an absolute minimum anyway (if the signal is strong but noisy)
    let minVal = 1;
    let minTau = -1;
    for (let t = 2; t < yinBuffer.length; t++) {
      if (yinBuffer[t] < minVal) {
        minVal = yinBuffer[t];
        minTau = t;
      }
    }
    // Only accept it if it's somewhat close to the threshold to prevent garbage noise matches
    if (minTau !== -1 && minVal < 0.3) {
      tau = minTau;
    } else {
      return null; 
    }
  }

  // Step 4: Parabolic interpolation for better precision
  let betterTau = tau;
  if (tau > 0 && tau < yinBuffer.length - 1) {
    const s0 = yinBuffer[tau - 1];
    const s1 = yinBuffer[tau];
    const s2 = yinBuffer[tau + 1];
    const adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    if (Math.abs(adjustment) < 1) {
      betterTau = tau + adjustment;
    }
  }

  return sampleRate / betterTau;
}

/**
 * Helper: Convert Frequency (Hz) to MIDI note number (0-127)
 */
export function freqToMidi(freq) {
  if (!freq || freq <= 0) return 0;
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

/**
 * Helper: Calculate absolute cent difference between two frequencies.
 * 100 cents = 1 semitone.
 */
export function getCentDifference(freq1, freq2) {
  if (!freq1 || !freq2) return 9999;
  return Math.abs(1200 * Math.log2(freq1 / freq2));
}
