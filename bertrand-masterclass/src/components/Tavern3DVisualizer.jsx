import React, { useRef, useEffect } from 'react';
import { useLocale } from '../hooks/useLocale';

/**
 * Tavern3DVisualizer
 * A high-fidelity, real-time responsive HTML5 Canvas generative environment.
 * Renders a gorgeous stone-arch medieval fantasy tavern with animated fireplace,
 * flickering candles, and dynamic particle systems (embers/notes) that adapt
 * in color, speed, and density to real-time mic volume and pitch cents deviation.
 */
export default function Tavern3DVisualizer({
  pitch = 0,
  cents = 0,
  volume = 0,
  gateState = 'waiting', // waiting | open | passed | failed
  atmosphere = 'amber-dusk',
  flowIndex = 1.0,
  stressLevel = 0.0,
  hrv = 50,
}) {
  const canvasRef = useRef(null);
  const { isFrench } = useLocale();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Particle system for embers
    const particles = [];
    const maxParticles = 120;

    // Fire flame segments
    let flameTime = 0;

    // Ambient candle flicker states
    let candle1Flicker = 1.0;
    let candle2Flicker = 1.0;

    // Setup Canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 800;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particle helper
    const createParticle = (x, y, isPling = false) => {
      return {
        x,
        y,
        size: isPling ? Math.random() * 4 + 3 : Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 1,
        alpha: 1.0,
        color: isPling ? '#c9a96e' : '#f08a24',
        decay: Math.random() * 0.015 + 0.005,
        isPling,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.05,
      };
    };

    // Main render loop
    const render = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // ── Atmospheric Color Logic ──
      // Dynamic responsiveness based on voice volume and pitch gate status
      // ── Atmospheric Color Logic ──
      // Dynamic responsiveness based on voice volume, pitch gate, and biometric stress
      let fireBaseColor = 'rgba(230, 95, 20, 0.8)';   // Ember Orange
      let fireGlowColor = 'rgba(240, 140, 30, 0.25)';
      let wallColor = '#0b0b12';
      let archColor = '#181822';

      const volumeMultiplier = Math.min(1.0, volume * 15); // Scale volume
      const isPerfectPling = gateState === 'passed' || (pitch > 0 && Math.abs(cents) <= 15);
      const isTenseSharp = (pitch > 0 && cents > 15) || (stressLevel > 0.4);

      if (isPerfectPling) {
        // Glowing gold ©PLING! state
        fireBaseColor = 'rgba(201, 169, 110, 0.9)';
        fireGlowColor = 'rgba(201, 169, 110, 0.4)';
        wallColor = '#110e08';
        archColor = '#241e12';
      } else if (isTenseSharp) {
        // Tensed violet state (indicating physical constriction or autonomic stress)
        fireBaseColor = 'rgba(123, 106, 170, 0.8)';
        fireGlowColor = 'rgba(123, 106, 170, 0.35)';
        wallColor = '#0d0b14';
        archColor = '#1c1828';
      }

      // Background clear
      ctx.fillStyle = wallColor;
      ctx.fillRect(0, 0, width, height);

      // ── Draw Stone Archways (Pseudo 3D Depth) ──
      ctx.fillStyle = archColor;
      // Left Pillar
      ctx.fillRect(0, 0, width * 0.08, height);
      // Right Pillar
      ctx.fillRect(width * 0.92, 0, width * 0.08, height);

      // Large central arch curve
      ctx.beginPath();
      ctx.strokeStyle = '#222230';
      ctx.lineWidth = 12;
      ctx.arc(width / 2, height * 0.4, width * 0.45, Math.PI, 0);
      ctx.stroke();

      // ── Draw Biometric Golden Auroral Focus Veil ──
      if (flowIndex > 1.0) {
        const flowFactor = Math.min(2.0, flowIndex - 1.0); // scale up to 1.0
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(201, 169, 110, ' + (0.18 * flowFactor) + ')';
        ctx.lineWidth = 20 * flowFactor;
        ctx.arc(width / 2, height * 0.4, width * 0.45, Math.PI, 0);
        ctx.stroke();

        // Shimmering outer pulsing halo
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(201, 169, 110, ' + (0.06 * flowFactor * Math.sin(flameTime * 0.5) + 0.06) + ')';
        ctx.lineWidth = 36 * flowFactor;
        ctx.arc(width / 2, height * 0.4, width * 0.45, Math.PI, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Stone brick seams
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width * 0.08, i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width * 0.92, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // ── Tavern Fireplace (Hearth) ──
      const hearthX = width / 2;
      const hearthY = height * 0.72;
      const hearthW = width * 0.35;
      const hearthH = height * 0.22;

      // Fireplace backing
      ctx.fillStyle = '#050508';
      ctx.beginPath();
      ctx.arc(hearthX, hearthY + 10, hearthW * 0.5, Math.PI, 0);
      ctx.fill();

      // Stone arch above hearth
      ctx.strokeStyle = '#2d2d38';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(hearthX, hearthY + 10, hearthW * 0.5, Math.PI, 0);
      ctx.stroke();

      // ── Fireplace embers & flame animation ──
      flameTime += 0.05 + volumeMultiplier * 0.05;
      const flameHeight = hearthH * 0.65 + (volumeMultiplier * 35) + (isPerfectPling ? 20 : 0);

      // Dynamic ambient flame glow
      const glowGrad = ctx.createRadialGradient(hearthX, hearthY, 10, hearthX, hearthY, hearthW * 1.2);
      glowGrad.addColorStop(0, fireGlowColor);
      glowGrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(hearthX - hearthW * 1.5, hearthY - hearthH * 2, hearthW * 3, hearthH * 3);

      // Render Fire base logs
      ctx.fillStyle = '#1c0f08';
      ctx.fillRect(hearthX - hearthW * 0.3, hearthY - 4, hearthW * 0.6, 12);
      ctx.fillStyle = '#100804';
      ctx.fillRect(hearthX - hearthW * 0.2, hearthY - 12, hearthW * 0.4, 8);

      // Main inner flames (bezier curves)
      ctx.fillStyle = fireBaseColor;
      ctx.beginPath();
      ctx.moveTo(hearthX - hearthW * 0.25, hearthY);
      
      // Left flame curve
      const leftControlX = hearthX - hearthW * 0.15 + Math.sin(flameTime) * 12;
      const leftControlY = hearthY - flameHeight * 0.5;
      const peakX = hearthX + Math.sin(flameTime * 1.5) * 16;
      const peakY = hearthY - flameHeight;
      ctx.quadraticCurveTo(leftControlX, leftControlY, peakX, peakY);

      // Right flame curve
      const rightControlX = hearthX + hearthW * 0.15 + Math.cos(flameTime) * 12;
      const rightControlY = hearthY - flameHeight * 0.5;
      ctx.quadraticCurveTo(rightControlX, rightControlY, hearthX + hearthW * 0.25, hearthY);
      ctx.fill();

      // Flickering yellow core
      ctx.fillStyle = isPerfectPling ? 'rgba(255, 230, 160, 0.95)' : 'rgba(255, 200, 40, 0.9)';
      ctx.beginPath();
      ctx.moveTo(hearthX - hearthW * 0.15, hearthY);
      ctx.quadraticCurveTo(
        hearthX + Math.sin(flameTime * 2) * 6,
        hearthY - flameHeight * 0.4,
        hearthX + Math.cos(flameTime) * 8,
        hearthY - flameHeight * 0.7
      );
      ctx.quadraticCurveTo(
        hearthX + hearthW * 0.1,
        hearthY - flameHeight * 0.3,
        hearthX + hearthW * 0.15,
        hearthY
      );
      ctx.fill();

      // ── Candlesticks on both sides ──
      candle1Flicker += (Math.random() - 0.5) * 0.08;
      candle1Flicker = Math.max(0.8, Math.min(1.2, candle1Flicker));

      candle2Flicker += (Math.random() - 0.5) * 0.08;
      candle2Flicker = Math.max(0.8, Math.min(1.2, candle2Flicker));

      const drawCandle = (cx, cy, flicker) => {
        // Candle Stand
        ctx.fillStyle = '#222228';
        ctx.fillRect(cx - 6, cy, 12, 4);
        ctx.fillRect(cx - 2, cy - 24, 4, 24);
        // Wax Pillar
        ctx.fillStyle = '#c9c2b3';
        ctx.fillRect(cx - 4, cy - 36, 8, 12);
        // Candle flame
        const flameY = cy - 40;
        const candleGlow = ctx.createRadialGradient(cx, flameY, 2, cx, flameY, 15 * flicker);
        candleGlow.addColorStop(0, 'rgba(240,160,40,0.9)');
        candleGlow.addColorStop(0.5, 'rgba(240,160,40,0.2)');
        candleGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = candleGlow;
        ctx.beginPath();
        ctx.arc(cx, flameY, 12 * flicker, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCandle(width * 0.18, hearthY + 20, candle1Flicker);
      drawCandle(width * 0.82, hearthY + 20, candle2Flicker);

      // ── Particles System (Embers and Floating Music Notes) ──
      // Spawn new particles — rate modulated by flow index and HRV (vagal tone)
      const spawnRate = isPerfectPling ? 3 : 1;
      const hrvFactor = Math.max(0.2, Math.min(3.0, hrv / 50.0));
      if (particles.length < maxParticles && Math.random() < 0.4 * spawnRate * hrvFactor) {
        // Spawn from center logs
        const sx = hearthX + (Math.random() - 0.5) * hearthW * 0.4;
        const sy = hearthY - 10;
        particles.push(createParticle(sx, sy, isPerfectPling));
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + (isPerfectPling ? Math.sin(p.angle) * 1.2 : 0);
        p.y += p.vy;
        p.alpha -= p.decay;
        p.angle += p.angularSpeed;

        if (p.alpha <= 0 || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.isPling && Math.random() < 0.15) {
          // Shimmering Golden Notes
          ctx.font = 'bold 12px serif';
          const notes = ['♩', '♪', '♫', '♬', '𝄢', '𝄞'];
          const noteChar = notes[Math.floor(p.x + p.y) % notes.length];
          ctx.fillText(noteChar, p.x, p.y);
        } else {
          // Regular glowing ember spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // ── Foreground Vignette (Cozy Tavern Atmosphere) ──
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.65);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(3, 3, 6, 0.92)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // ── Subtle UI HUD display when gate is active ──
      if (gateState === 'open' || gateState === 'passed') {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(width / 2 - 120, 16, 240, 24);
        ctx.strokeStyle = isPerfectPling ? '#c9a96e' : 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(width / 2 - 120, 16, 240, 24);

        // Vocal tracking stats
        ctx.fillStyle = isPerfectPling ? '#c9a96e' : '#8090a8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        
        let hudText = isFrench ? '🎤 À L’ÉCOUTE DE LA HAUTEUR...' : '🎤 LISTENING FOR PITCH...';
        if (isPerfectPling) hudText = isFrench ? '✨ OR RÉSONNANT ©PLING! VERROUILLÉ' : '✨ RESONANT GOLD ©PLING! LOCKED';
        else if (isTenseSharp) hudText = isFrench ? '⚠️ TENSION DU COU DÉTECTÉE (+cents)' : '⚠️ NECK TENSION DETECTED (+cents)';
        
        ctx.fillText(hudText, width / 2, 31);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Start animation loop
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pitch, cents, volume, gateState, atmosphere, flowIndex, hrv, isFrench, stressLevel]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '12px 12px 0 0',
        }}
      />
    </div>
  );
}
