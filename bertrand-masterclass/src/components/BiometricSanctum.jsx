import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// BIOMETRIC SANCTUM — Simplified Simulation Stub
// 
// FUTURE SCOPE: Hardware BLE (Muse EEG, Heart Rate straps)
// and webcam rPPG cardiac extraction are planned features.
// For now, this provides a simple simulated biometric
// visualization to demonstrate the somatic pedagogy concept.
// ═══════════════════════════════════════════════════════════

const PRESETS = {
  flow: { hr: 68, hrv: 85, alpha: 1.9, beta: 0.35, theta: 1.3 },
  tension: { hr: 95, hrv: 22, alpha: 0.5, beta: 1.85, theta: 0.6 },
  rest: { hr: 62, hrv: 74, alpha: 1.5, beta: 0.4, theta: 0.9 },
};

export default function BiometricSanctum({ onBiometricsChange }) {
  const { locale, t } = useLocale();
  const canvasRef = useRef(null);
  const [preset, setPreset] = useState('flow');
  const { hr, hrv, alpha, beta, theta } = PRESETS[preset];

  const flowIndex = (alpha + theta) / Math.max(0.1, beta);
  const stressLevel = Math.max(0, Math.min(1, (beta * 1.5) - (hrv / 120)));

  // Stream metrics to parent
  useEffect(() => {
    onBiometricsChange?.({
      flowIndex, stressLevel, hrv, hr,
      alphaPower: alpha, betaPower: beta, thetaPower: theta,
      isSimulating: true, museConnected: false, pulseConnected: false
    });
  }, [preset, flowIndex, stressLevel, hrv, hr, alpha, beta, theta, onBiometricsChange]);

  // Scrolling waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let tick = 0;
    const history = Array.from({ length: 150 }, () => 0);

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 100;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#060504';
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(201,169,110,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      tick += 0.15;
      const brainAmp = (alpha + theta) * 12;
      const noiseAmp = beta * 8;
      history.push(Math.sin(tick) * brainAmp + Math.sin(tick * 3.4) * noiseAmp);
      if (history.length > w / 3) history.shift();

      // EEG trace
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(201,169,110,0.85)';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#c9a96e';
      for (let i = 0; i < history.length; i++) {
        const xPos = i * 3.2;
        const yPos = h / 2 + history[i];
        i === 0 ? ctx.moveTo(xPos, yPos) : ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Heartbeat blip
      const isBeat = Math.floor(tick * 0.4) % Math.floor((60 / (hr / 60)) * 2) === 0;
      ctx.fillStyle = isBeat ? '#ff6a88' : '#735058';
      ctx.beginPath();
      ctx.arc(w - 20, 20, isBeat ? 4 : 2, 0, Math.PI * 2);
      ctx.fill();

      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', resize); };
  }, [hr, alpha, beta, theta]);

  const presetLabels = {
    flow: t('flowZone'),
    tension: t('tensionSpike'),
    rest: t('somaticRest'),
  };

  return (
    <div className="bg-[#100e0b]/90 border border-cf-gold/20 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cf-gold/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold font-mono tracking-wider text-white flex items-center gap-2">
            <Sparkles size={16} className="text-cf-gold animate-pulse" />
            {t('somaticSanctum')}
          </h3>
          <p className="text-[10px] text-cf-slate uppercase tracking-wider font-mono">
            {t('somaticSanctumSub')}
          </p>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-cf-gold/20 text-cf-gold border border-cf-gold/30 uppercase tracking-widest">
          SIM
        </span>
      </div>

      {/* Waveform */}
      <div className="w-full bg-black rounded-xl overflow-hidden border border-white/5 relative mb-4">
        <canvas ref={canvasRef} className="block w-full h-[100px]" />
        <div className="absolute bottom-2 left-3 flex gap-3 text-[10px] font-mono">
          <span className="text-[#ff6a88] flex items-center gap-1">
            <Heart size={10} /> {hr} BPM
          </span>
          <span className="text-cf-gold">HRV: {hrv} ms</span>
        </div>
        <div className="absolute bottom-2 right-3 text-right">
          <span className="text-[8px] font-mono text-cf-slate block uppercase tracking-wider">
            {t('flowIndex')}
          </span>
          <span className={`text-xl font-bold font-mono tracking-tighter ${
            flowIndex > 3.0 ? 'text-cf-gold' : flowIndex > 1.5 ? 'text-cf-sage' : 'text-white/40'
          }`}>
            {flowIndex.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(presetLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPreset(key)}
            className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
              preset === key
                ? key === 'tension'
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 font-bold'
                  : key === 'rest'
                  ? 'bg-[#5a90a0]/20 border-[#5a90a0]/40 text-[#5a90a0] font-bold'
                  : 'bg-cf-gold text-[#030306] font-bold border-cf-gold shadow-[0_0_12px_rgba(201,169,110,0.2)]'
                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Future scope note */}
      <p className="text-[9px] text-white/20 font-mono text-center mt-3 uppercase tracking-wider">
        {t('simulationMode')}
      </p>
    </div>
  );
}
