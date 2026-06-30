// ════════════════════════════════════════════════════════════
// pitch-detection.js
// YIN Autocorrelation Pitch Detection Algorithm
// Ported from the Voix Vive companion app (production-tested)
// ════════════════════════════════════════════════════════════

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * YIN pitch detection algorithm.
 * Takes a time-domain audio buffer and returns the fundamental frequency (Hz).
 * @param {Float32Array} buffer - Audio samples
 * @param {number} sampleRate - AudioContext sample rate
 * @returns {number|null} - Frequency in Hz, or null if no pitch detected
 */
function detectPitch(buffer, sampleRate) {
  const threshold = 0.15;
  const bufferSize = buffer.length;
  const yinBuffer = new Float32Array(Math.floor(bufferSize / 2));

  // Step 1: Difference function
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

  if (tau === -1) {
    let minVal = 1;
    let minTau = -1;
    for (let t = 2; t < yinBuffer.length; t++) {
      if (yinBuffer[t] < minVal) {
        minVal = yinBuffer[t];
        minTau = t;
      }
    }
    if (minTau !== -1 && minVal < 0.3) {
      tau = minTau;
    } else {
      return null;
    }
  }

  // Step 4: Parabolic interpolation
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
 * Convert frequency to MIDI note number.
 */
function freqToMidi(freq) {
  if (!freq || freq <= 0) return 0;
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

/**
 * Convert frequency to note info { name, octave, cents, midi, freq }.
 */
function freqToNoteInfo(freq) {
  if (!freq || freq <= 0) return null;
  const midi = 12 * Math.log2(freq / 440) + 69;
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  const name = NOTE_NAMES[((roundedMidi % 12) + 12) % 12];
  const octave = Math.floor(roundedMidi / 12) - 1;
  return { name, octave, cents, midi: roundedMidi, freq };
}

/**
 * PitchDetector — manages microphone input and real-time pitch detection.
 * Calls onNote callback whenever a new note is detected.
 */
export class PitchDetector {
  constructor(onNote, onVolume) {
    this.onNote = onNote;
    this.onVolume = onVolume;
    this.isListening = false;
    this._audioCtx = null;
    this._analyser = null;
    this._stream = null;
    this._rafId = null;
    this._lastMidi = null;
    this._midiResetTimeout = null;
    this._buffer = null;
  }

  async start() {
    if (this.isListening) return;

    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this._audioCtx.state === 'suspended') {
        await this._audioCtx.resume();
      }

      const source = this._audioCtx.createMediaStreamSource(this._stream);
      this._analyser = this._audioCtx.createAnalyser();
      this._analyser.fftSize = 2048;
      source.connect(this._analyser);

      this._buffer = new Float32Array(this._analyser.fftSize);
      this.isListening = true;
      this._tick();
    } catch (err) {
      console.error('[PitchDetector] Microphone access failed:', err);
      this.isListening = false;
      throw err;
    }
  }

  stop() {
    if (!this.isListening) return;

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    if (this._stream) {
      this._stream.getTracks().forEach((t) => t.stop());
      this._stream = null;
    }

    if (this._audioCtx) {
      this._audioCtx.close();
      this._audioCtx = null;
    }

    this._analyser = null;
    this.isListening = false;
    this._lastMidi = null;

    if (this.onNote) this.onNote(null);
    if (this.onVolume) this.onVolume(0);
  }

  _tick = () => {
    if (!this._analyser || !this._audioCtx) return;

    this._analyser.getFloatTimeDomainData(this._buffer);

    // RMS volume
    let rms = 0;
    for (let i = 0; i < this._buffer.length; i++) {
      rms += this._buffer[i] * this._buffer[i];
    }
    rms = Math.sqrt(rms / this._buffer.length);
    const volume = Math.min(100, rms * 1500);

    if (this.onVolume) this.onVolume(volume);

    // Pitch detection
    if (rms > 0.002) {
      const freq = detectPitch(this._buffer, this._audioCtx.sampleRate);

      if (freq && freq > 60 && freq < 1200) {
        const noteInfo = freqToNoteInfo(freq);

        if (noteInfo) {
          // Throttle: only emit when the note changes
          if (this._lastMidi !== noteInfo.midi) {
            this._lastMidi = noteInfo.midi;
            clearTimeout(this._midiResetTimeout);
            this._midiResetTimeout = setTimeout(() => {
              this._lastMidi = null;
            }, 300);

            if (this.onNote) this.onNote(noteInfo);
          }
        }
      }
    } else {
      // Signal too quiet — clear note
      if (this._lastMidi !== null) {
        this._lastMidi = null;
        if (this.onNote) this.onNote(null);
      }
    }

    this._rafId = requestAnimationFrame(this._tick);
  };
}
