// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : GenerativeDroneEngine.js                           ║
// ║ WHAT    : Generates continuous Pythagorean harmonic drones   ║
// ║ WHY     : Provides an acoustic bed for freestyle practice    ║
// ║           so students can feel the interval ratios.          ║
// ╚═══════════════════════════════════════════════════════════════╝

import { getHarmonicData } from '../../data/harmonicData';

class GenerativeDroneEngine {
  constructor() {
    this.ctx = null;
    this.rootFreq = 65.41; // C2
    this.masterGain = null;
    this.activeNodes = new Map();
    this.isActive = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    // Default low volume to keep it as a background drone
    this.masterGain.gain.value = 0.15;
    
    // Add some soft compression
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
    compressor.knee.setValueAtTime(30, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain.connect(compressor);
    compressor.connect(this.ctx.destination);
  }

  _parseRatio(ratioStr) {
    if (ratioStr === '√2:1') return Math.SQRT2;
    const parts = ratioStr.split(':');
    if (parts.length !== 2) return 1.0;
    return parseFloat(parts[0]) / parseFloat(parts[1]);
  }

  startDrone(fretId) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isActive = true;

    // FretId 1 = Unison, FretId 2 = Minor 2nd, etc.
    const intervalSemitones = fretId - 1;
    const harmonicInfo = getHarmonicData(intervalSemitones);
    const ratioMultiplier = this._parseRatio(harmonicInfo.ratio);
    
    const targetFreq = this.rootFreq * ratioMultiplier;

    // If we are already droning this interval, do nothing
    if (this.activeNodes.has(fretId)) return;

    const osc = this.ctx.createOscillator();
    // Triangle wave gives a softer, warmer drone than pure sine, better for backing
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);

    // Subtle LFO for breathing effect (somatic tie-in)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s breathing cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(5, this.ctx.currentTime); // 5Hz vibrato/chorus variation
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    // Volume envelope (fade in gently)
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0, this.ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 3.0); // 3s fade in

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();

    this.activeNodes.set(fretId, { osc, oscGain, lfo });

    // Ensure the Root (1:1) is always playing beneath everything as the foundation
    if (fretId !== 1 && !this.activeNodes.has(1)) {
      this.startDrone(1);
    }
  }

  stopDrone(fretId) {
    if (!this.ctx || !this.activeNodes.has(fretId)) return;
    const { osc, oscGain, lfo } = this.activeNodes.get(fretId);
    
    // Fade out
    oscGain.gain.cancelScheduledValues(this.ctx.currentTime);
    oscGain.gain.setValueAtTime(oscGain.gain.value, this.ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0); // 2s fade out
    
    setTimeout(() => {
      osc.stop();
      lfo.stop();
      osc.disconnect();
      oscGain.disconnect();
      this.activeNodes.delete(fretId);
    }, 2100);
  }

  stopAll() {
    this.isActive = false;
    for (const fretId of this.activeNodes.keys()) {
      this.stopDrone(fretId);
    }
  }
}

// Export singleton instance
export const droneEngine = new GenerativeDroneEngine();
