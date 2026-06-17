import React, { useState, useEffect, useRef } from 'react';
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
      ctx.strokeStyle = 'rgba(var(--cf-gold-rgb),0.04)';
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
      ctx.strokeStyle = 'rgba(var(--cf-gold-rgb),0.85)';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'var(--cf-gold)';
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

  // Hiding stub for v1.0-beta release
  return null;
}
