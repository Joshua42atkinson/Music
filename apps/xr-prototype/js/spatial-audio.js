// ════════════════════════════════════════════════════════════
// spatial-audio.js
// Spatial Audio Feedback System
// Uses Web Audio API with PannerNode for 3D positioned audio.
// When a note is detected, plays a tone at the fretboard position.
// ════════════════════════════════════════════════════════════

import * as THREE from 'three';

export class SpatialAudio {
  constructor() {
    this._ctx = null;
    this._listener = null;
    this._enabled = false;
    this._lastPlayTime = 0;
    this._minInterval = 80; // ms between plays
  }

  async init() {
    if (this._ctx) return;

    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this._ctx.state === 'suspended') {
      await this._ctx.resume();
    }

    this._listener = this._ctx.listener;

    // Default listener position (will be updated in AR mode)
    if (this._listener.positionX) {
      this._listener.positionX.value = 0;
      this._listener.positionY.value = 0;
      this._listener.positionZ.value = 0;
    } else {
      // Fallback for older browsers
      this._listener.setPosition(0, 0, 0);
      this._listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    this._enabled = true;
  }

  /**
   * Play a spatialized tone at a 3D position.
   * @param {number} freq - Frequency in Hz
   * @param {THREE.Vector3} position - World position for spatial panning
   * @param {number} duration - Duration in seconds (default 0.3)
   */
  playNote(freq, position, duration = 0.3) {
    if (!this._enabled || !this._ctx) return;

    const now = this._ctx.currentTime;
    if (now * 1000 - this._lastPlayTime < this._minInterval) return;
    this._lastPlayTime = now * 1000;

    // Oscillator (sine wave for clean tone)
    const osc = this._ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Gain envelope (attack + decay)
    const gain = this._ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Spatial panner
    const panner = this._ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10;
    panner.rolloffFactor = 0.5;

    if (panner.positionX) {
      panner.positionX.value = position.x;
      panner.positionY.value = position.y;
      panner.positionZ.value = position.z;
    } else {
      panner.setPosition(position.x, position.y, position.z);
    }

    // Connect: osc → gain → panner → destination
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this._ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Update listener position and orientation (for AR mode).
   * @param {THREE.Vector3} position - Listener position
   * @param {THREE.Quaternion} quaternion - Listener orientation
   */
  updateListener(position, quaternion) {
    if (!this._listener) return;

    if (this._listener.positionX) {
      this._listener.positionX.value = position.x;
      this._listener.positionY.value = position.y;
      this._listener.positionZ.value = position.z;
    } else {
      this._listener.setPosition(position.x, position.y, position.z);
    }

    // Calculate forward and up vectors from quaternion
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);

    if (this._listener.forwardX) {
      this._listener.forwardX.value = forward.x;
      this._listener.forwardY.value = forward.y;
      this._listener.forwardZ.value = forward.z;
      this._listener.upX.value = up.x;
      this._listener.upY.value = up.y;
      this._listener.upZ.value = up.z;
    } else {
      this._listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }
  }

  dispose() {
    if (this._ctx) {
      this._ctx.close();
      this._ctx = null;
    }
    this._enabled = false;
  }
}
