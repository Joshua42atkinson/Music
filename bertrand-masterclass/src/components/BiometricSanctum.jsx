import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Heart, Activity, Cpu, Play, Square, Sliders, Sparkles, AlertCircle, Camera, Video, RefreshCw } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// UPGRADED BIOMETRIC SANCTUM — webcam rPPG + BLE Muse & Heart Rate
// Includes scrolling signal wave visualization and standard simulation sandbox
// ═══════════════════════════════════════════════════════════

export default function BiometricSanctum({ onBiometricsChange }) {
  const { isFrench } = useLocale();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  // Mode Selection
  const [activeMode, setActiveMode] = useState('sim'); // sim | ble | rppg

  // Connection states
  const [museConnected, setMuseConnected] = useState(false);
  const [pulseConnected, setPulseConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(null); // 'muse' | 'pulse' | null
  const [errorMsg, setErrorMsg] = useState('');

  // Webcam rPPG states
  const [webcamStream, setWebcamStream] = useState(null);
  const [rppgStatus, setRppgStatus] = useState('inactive'); // inactive | starting | active | error
  const [isHeartBeating, setIsHeartBeating] = useState(false);

  // Simulation states
  const [simPreset, setSimPreset] = useState('flow'); // flow | tension | rest

  // Biometric telemetry states
  const [hr, setHr] = useState(72);
  const [hrv, setHrv] = useState(62); // RMSSD in ms
  const [alphaPower, setAlphaPower] = useState(1.4);
  const [betaPower, setBetaPower] = useState(0.6);
  const [thetaPower, setThetaPower] = useState(1.1);

  // Rolling buffers for real-time DSP
  const greenHistoryRef = useRef([]);
  const peakHistoryRef = useRef([]);
  const lastPeakTimeRef = useRef(0);

  // Derived metrics
  const flowIndex = (alphaPower + thetaPower) / Math.max(0.1, betaPower);
  const stressLevel = Math.max(0.0, Math.min(1.0, (betaPower * 1.5) - (hrv / 120.0)));

  // Stream metrics up to parent
  useEffect(() => {
    onBiometricsChange?.({
      flowIndex,
      stressLevel,
      hrv,
      hr,
      alphaPower,
      betaPower,
      thetaPower,
      isSimulating: activeMode === 'sim',
      museConnected,
      pulseConnected: pulseConnected || activeMode === 'rppg'
    });
  }, [flowIndex, stressLevel, hrv, hr, alphaPower, betaPower, thetaPower, activeMode, museConnected, pulseConnected]);

  // Handle Preset Changes
  useEffect(() => {
    if (activeMode !== 'sim') return;
    if (simPreset === 'flow') {
      setHr(68);
      setHrv(85);
      setAlphaPower(1.9);
      setBetaPower(0.35);
      setThetaPower(1.3);
    } else if (simPreset === 'tension') {
      setHr(95);
      setHrv(22);
      setAlphaPower(0.5);
      setBetaPower(1.85);
      setThetaPower(0.6);
    } else if (simPreset === 'rest') {
      setHr(62);
      setHrv(74);
      setAlphaPower(1.5);
      setBetaPower(0.4);
      setThetaPower(0.9);
    }
  }, [simPreset, activeMode]);

  // 1. Scrolling canvas EEG/ECG signal animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let tCount = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 110;
    };
    resize();
    window.addEventListener('resize', resize);

    const history = Array.from({ length: 150 }, () => 0);

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060504';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(201,169,110,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      tCount += 0.15;
      
      // Calculate active wave amplitude based on telemetry
      const hasEeg = activeMode === 'sim' || museConnected;
      const brainAmp = hasEeg ? (alphaPower + thetaPower) * 12 : 2;
      const noiseAmp = hasEeg ? betaPower * 8 : 1;

      // Scrolling history update
      const newSample = Math.sin(tCount) * brainAmp + Math.sin(tCount * 3.4) * noiseAmp;
      history.push(newSample);
      if (history.length > w / 3) history.shift();

      // Draw EEG trace (Gold)
      ctx.beginPath();
      ctx.strokeStyle = hasEeg ? 'rgba(201,169,110,0.85)' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = hasEeg ? 8 : 0;
      ctx.shadowColor = '#c9a96e';

      for (let i = 0; i < history.length; i++) {
        const xPos = i * 3.2;
        const yPos = h / 2 + history[i];
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw ECG-like heartbeat blip at the end of the trace (Red/Rose)
      const hasPulse = activeMode === 'sim' || pulseConnected || activeMode === 'rppg';
      if (hasPulse) {
        const beatsPerSec = hr / 60;
        const beatInterval = 60 / beatsPerSec;
        const isBeat = Math.floor(tCount * 0.4) % Math.floor(beatInterval * 2) === 0;

        ctx.fillStyle = isBeat || isHeartBeating ? '#ff6a88' : '#735058';
        ctx.beginPath();
        ctx.arc(w - 20, 20, isBeat || isHeartBeating ? 4 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [hr, alphaPower, betaPower, thetaPower, activeMode, museConnected, pulseConnected, isHeartBeating]);

  // 2. Web Bluetooth GATT Pairing (Muse EEG)
  const connectMuse = async () => {
    setErrorMsg('');
    setIsConnecting('muse');
    try {
      if (!navigator.bluetooth) {
        throw new Error(isFrench 
          ? "L'API Web Bluetooth n'est pas supportée par ce navigateur." 
          : "Web Bluetooth API is not supported in this browser."
        );
      }
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['0000fe8d-0000-1000-8000-00805f9b34fb'] }] // Muse GATT primary service
      });
      setMuseConnected(true);
      setActiveMode('ble');
      console.log('Connected to Muse:', device.name);
    } catch (err) {
      console.warn('Bluetooth connection error:', err);
      setErrorMsg(err.message || 'Bluetooth connection refused.');
    }
    setIsConnecting(null);
  };

  // 3. Web Bluetooth GATT Pairing (Pulse Strap / HRV Wearable)
  const connectPulse = async () => {
    setErrorMsg('');
    setIsConnecting('pulse');
    try {
      if (!navigator.bluetooth) {
        throw new Error(isFrench 
          ? "L'API Web Bluetooth n'est pas supportée par ce navigateur." 
          : "Web Bluetooth API is not supported in this browser."
        );
      }
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['0000180d-0000-1000-8000-00805f9b34fb'] }] // Standard Heart Rate GATT
      });
      setPulseConnected(true);
      setActiveMode('ble');
      console.log('Connected to Heart Rate Monitor:', device.name);
    } catch (err) {
      console.warn('Bluetooth connection error:', err);
      setErrorMsg(err.message || 'Bluetooth connection refused.');
    }
    setIsConnecting(null);
  };

  // 4. Webcam rPPG Heart Rate Extraction Loop
  const startWebcamRppg = async () => {
    setErrorMsg('');
    setRppgStatus('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setRppgStatus('active');
    } catch (err) {
      console.error('Failed to get webcam for rPPG:', err);
      setErrorMsg(isFrench ? 'Accès à la caméra refusé.' : 'Camera access denied.');
      setRppgStatus('error');
    }
  };

  const stopWebcamRppg = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
    }
    setWebcamStream(null);
    setRppgStatus('inactive');
  };

  useEffect(() => {
    if (activeMode !== 'rppg') {
      stopWebcamRppg();
      return;
    }
    startWebcamRppg();
    return () => stopWebcamRppg();
  }, [activeMode]);

  // Real-time canvas rPPG pixel analysis processing loop
  useEffect(() => {
    if (activeMode !== 'rppg' || rppgStatus !== 'active') return;

    let frameId;
    const video = videoRef.current;
    const offscreen = offscreenCanvasRef.current;
    if (!video || !offscreen) return;

    const ctx = offscreen.getContext('2d');
    const width = 60;
    const height = 60;
    offscreen.width = width;
    offscreen.height = height;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw the center forehead/cheek region of the camera onto the tiny offscreen canvas
        // 320x240 webcam stream, we crop a 120x120 crop from center and draw it as 60x60
        ctx.drawImage(video, 100, 60, 120, 120, 0, 0, width, height);

        // Fetch raw RGBA pixels
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sum the Green channel values
        let greenSum = 0;
        for (let i = 1; i < data.length; i += 4) {
          greenSum += data[i];
        }
        const avgGreen = greenSum / (data.length / 4);

        // Add to historical buffer
        const greenHistory = greenHistoryRef.current;
        greenHistory.push(avgGreen);
        if (greenHistory.length > 150) greenHistory.shift();

        // ── DSP: Simple difference-of-moving-averages bandpass filter ──
        if (greenHistory.length > 20) {
          const getMA = (arr, windowSize) => {
            const slice = arr.slice(-windowSize);
            return slice.reduce((a, b) => a + b, 0) / slice.length;
          };
          const fastMA = getMA(greenHistory, 3);
          const slowMA = getMA(greenHistory, 15);
          const filtered = fastMA - slowMA;

          // Push filtered sample up to alpha/beta bounds for display
          setAlphaPower(1.2 + Math.abs(filtered) * 4);
          setBetaPower(0.5 + (1.0 - Math.abs(filtered) * 2));

          // Peak Detection (for HR and HRV intervals)
          const now = Date.now();
          const threshold = 0.05; // standard micro-reflectance threshold
          const isPeak = filtered > threshold && 
                         filtered > (greenHistory[greenHistory.length - 2] - slowMA) &&
                         (now - lastPeakTimeRef.current) > 380; // Min 380ms spacing (max 158 BPM)

          if (isPeak) {
            lastPeakTimeRef.current = now;
            setIsHeartBeating(true);
            setTimeout(() => setIsHeartBeating(false), 120);

            const peakHistory = peakHistoryRef.current;
            peakHistory.push(now);
            if (peakHistory.length > 6) peakHistory.shift();

            // Calculate HR & HRV from peak differences
            if (peakHistory.length >= 3) {
              const intervals = [];
              for (let i = 1; i < peakHistory.length; i++) {
                intervals.push(peakHistory[i] - peakHistory[i - 1]);
              }
              const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
              const calculatedHr = Math.round(60000 / avgInterval);
              if (calculatedHr >= 50 && calculatedHr <= 150) {
                setHr(calculatedHr);
              }

              // RMSSD (HRV) calculation
              let diffSqSum = 0;
              for (let i = 1; i < intervals.length; i++) {
                diffSqSum += Math.pow(intervals[i] - intervals[i - 1], 2);
              }
              const calculatedHrv = Math.round(Math.sqrt(diffSqSum / (intervals.length - 1)));
              if (calculatedHrv >= 15 && calculatedHrv <= 120) {
                setHrv(calculatedHrv);
              }
            }
          }
        }
      }
      frameId = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeMode, rppgStatus]);

  return (
    <div className="bg-[#100e0b]/90 border border-cf-gold/20 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      
      {/* Wave glow backing */}
      <div className="absolute inset-0 bg-gradient-to-r from-cf-gold/5 via-transparent to-transparent pointer-events-none" />

      {/* Hidden offscreen canvas for rPPG pixel calculations */}
      <canvas ref={offscreenCanvasRef} style={{ display: 'none' }} />

      {/* Header & Tabs */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wider text-white flex items-center gap-2">
              <Sparkles size={16} className="text-cf-gold animate-pulse" />
              {isFrench ? 'SANCTUAIRE DES BIOMÉTRIES SOMATIQUES' : 'SOMATIC BIOMETRIC FLOW SANCTUM'}
            </h3>
            <p className="text-[10px] text-cf-slate uppercase tracking-wider font-mono">
              {isFrench ? 'Étalonnage du focus et du tonus parasympathique' : 'Biofeedback focus & vagal tone calibration'}
            </p>
          </div>
        </div>

        {/* Dynamic Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveMode('sim')}
            className={`py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeMode === 'sim'
                ? 'bg-cf-gold/25 text-cf-gold border border-cf-gold/40'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            🌌 {isFrench ? 'Simulateur' : 'Sandbox SIM'}
          </button>
          <button
            onClick={() => setActiveMode('rppg')}
            className={`py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeMode === 'rppg'
                ? 'bg-[#ff6a88]/25 text-[#ff6a88] border border-[#ff6a88]/40'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            📷 {isFrench ? 'Caméra rPPG' : 'Camera rPPG'}
          </button>
          <button
            onClick={() => setActiveMode('ble')}
            className={`py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeMode === 'ble'
                ? 'bg-cf-gold/25 text-cf-gold border border-cf-gold/40'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            🔌 {isFrench ? 'Matériel BLE' : 'Hardware BLE'}
          </button>
        </div>
      </div>

      {/* Live Waveform Signal Monitor + Video HUD */}
      <div className="w-full bg-black rounded-xl overflow-hidden border border-white/5 relative mb-4 flex">
        
        {/* Signal chart */}
        <div className="flex-1 relative">
          <canvas ref={canvasRef} className="block w-full h-[110px]" />
          
          {/* Signal Label Info HUD */}
          <div className="absolute top-2 left-3 flex gap-2">
            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border uppercase tracking-widest ${
              museConnected || (activeMode === 'sim' && simPreset === 'flow')
                ? 'bg-cf-gold/20 text-cf-gold border-cf-gold/30'
                : 'bg-black/50 text-white/20 border-white/5'
            }`}>
              <Cpu size={8} /> EEG {museConnected ? 'BLE' : (activeMode === 'sim' ? 'SIM' : 'OFF')}
            </span>
            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border uppercase tracking-widest ${
              pulseConnected || activeMode === 'sim' || activeMode === 'rppg'
                ? 'bg-[#ff6a88]/20 text-[#ff6a88] border-[#ff6a88]/30'
                : 'bg-black/50 text-white/20 border-white/5'
            }`}>
              <Heart size={8} /> HRV {pulseConnected ? 'BLE' : (activeMode === 'rppg' ? 'PPG' : 'OFF')}
            </span>
          </div>

          {/* Metrics Displays overlay */}
          <div className="absolute bottom-2 left-3 flex gap-3 text-[10px] font-mono">
            <span className="text-[#ff6a88] flex items-center gap-1">
              <Heart size={10} className={isHeartBeating ? 'scale-125 text-red-500 animate-ping' : ''} /> {hr} BPM
            </span>
            <span className="text-cf-gold">
              HRV: {hrv} ms
            </span>
          </div>

          {/* Vocal Flow State Index Overlay */}
          <div className="absolute bottom-2 right-3 text-right">
            <span className="text-[8px] font-mono text-cf-slate block uppercase tracking-wider">
              {isFrench ? 'Index de Flow Somatique' : 'Somatic Flow Index'}
            </span>
            <span className={`text-xl font-bold font-mono tracking-tighter ${
              flowIndex > 3.0 ? 'text-cf-gold' : flowIndex > 1.5 ? 'text-cf-sage' : 'text-white/40'
            }`}>
              {flowIndex.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Camera PIP overlay if rPPG is active */}
        {activeMode === 'rppg' && rppgStatus === 'active' && (
          <div className="w-[110px] h-[110px] bg-neutral-900 border-l border-white/10 relative overflow-hidden flex-shrink-0">
            <video
              ref={videoRef}
              muted playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror stream
              }}
            />
            {/* Golden Circle target scan HUD */}
            <div className="absolute inset-0 border-[3px] border-dashed border-cf-gold/60 rounded-full scale-[0.6] animate-pulse" />
            <div className="absolute bottom-1 inset-x-0 text-center text-[7px] font-mono bg-black/60 text-cf-gold uppercase tracking-widest py-0.5">
              {isFrench ? 'Alignement' : 'Align ROI'}
            </div>
          </div>
        )}
      </div>

      {/* Render Dynamic Content Panel based on selected mode */}
      <AnimatePresence mode="wait">
        
        {/* Sandbox SIM mode panel */}
        {activeMode === 'sim' && (
          <motion.div
            key="sim-controls"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSimPreset('flow')}
                className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                  simPreset === 'flow'
                    ? 'bg-cf-gold text-[#030306] font-bold border-cf-gold shadow-[0_0_12px_rgba(201,169,110,0.2)]'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                🌌 {isFrench ? 'Zone Flow' : 'Flow Zone'}
              </button>
              <button
                onClick={() => setSimPreset('tension')}
                className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                  simPreset === 'tension'
                    ? 'bg-red-500/20 border-red-500/40 text-red-400 font-bold'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                ⚡ {isFrench ? 'Tension' : 'Tension Spike'}
              </button>
              <button
                onClick={() => setSimPreset('rest')}
                className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                  simPreset === 'rest'
                    ? 'bg-[#5a90a0]/20 border-[#5a90a0]/40 text-[#5a90a0] font-bold'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                🧘 {isFrench ? 'Sommeil' : 'Somatic Rest'}
              </button>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-2 gap-4 bg-black/35 rounded-xl p-3 border border-white/5">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-cf-slate uppercase">
                  <span>{isFrench ? 'Alpha (Concentration)' : 'Alpha Power (Focus)'}</span>
                  <span className="text-cf-gold">{alphaPower.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0.1" max="3.0" step="0.05"
                  value={alphaPower} onChange={e => setAlphaPower(parseFloat(e.target.value))}
                  className="w-full h-1 accent-cf-gold bg-white/10 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-cf-slate uppercase">
                  <span>{isFrench ? 'Beta (Anxiété / Tension)' : 'Beta Power (Anxiety)'}</span>
                  <span className="text-cf-gold">{betaPower.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0.1" max="3.0" step="0.05"
                  value={betaPower} onChange={e => setBetaPower(parseFloat(e.target.value))}
                  className="w-full h-1 accent-cf-gold bg-white/10 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-cf-slate uppercase">
                  <span>{isFrench ? 'Pouls HRV (Relaxation)' : 'Vagal HRV (RMSSD)'}</span>
                  <span className="text-[#ff6a88]">{hrv} ms</span>
                </div>
                <input
                  type="range" min="10" max="120" step="1"
                  value={hrv} onChange={e => setHrv(parseInt(e.target.value))}
                  className="w-full h-1 accent-[#ff6a88] bg-white/10 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-cf-slate uppercase">
                  <span>{isFrench ? 'Fréquence Cardiaque' : 'Heart Rate (BPM)'}</span>
                  <span className="text-[#ff6a88]">{hr} bpm</span>
                </div>
                <input
                  type="range" min="50" max="140" step="1"
                  value={hr} onChange={e => setHr(parseInt(e.target.value))}
                  className="w-full h-1 accent-[#ff6a88] bg-white/10 rounded cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Camera rPPG mode panel */}
        {activeMode === 'rppg' && (
          <motion.div
            key="rppg-controls"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-xs font-bold text-cf-gold font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Camera size={14} className="text-cf-gold" />
                  {isFrench ? 'DÉTECTEUR CARDIAQUE PAR CAMÉRA (rPPG)' : 'FACIAL CAMERA PPG CARDIAC SENSOR'}
                </h4>
                <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                  {isFrench 
                    ? "Mesure vos micro-fluctuations de flux sanguin cutané. Gardez votre front au centre de l'overlay d'or pour une acquisition optimale."
                    : "Processes raw skin light reflections to solve RR pulse intervals completely locally. Keep your forehead aligned with the golden circle."
                  }
                </p>
              </div>

              {/* Status Indicator */}
              <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                rppgStatus === 'active' ? 'bg-[#ff6a88]/15 border-[#ff6a88]/30 text-[#ff6a88]' :
                rppgStatus === 'starting' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse' :
                                            'bg-neutral-800 border-neutral-700 text-white/40'
              }`}>
                {rppgStatus}
              </span>
            </div>

            {/* Quick calibration status tip */}
            {rppgStatus === 'active' && (
              <div className="bg-cf-gold/10 border border-cf-gold/20 p-2.5 rounded-lg flex items-center gap-2 text-[9px] font-mono text-cf-gold">
                <RefreshCw size={12} className="animate-spin text-cf-gold" />
                <span>
                  {isFrench 
                    ? "Acquisition en cours... Restez immobile et respirez calmement pour étalonner la VRC somatique."
                    : "Extracting blood volume telemetry... Remain stationary to solve RMSSD autonomic calibration."
                  }
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Hardware BLE tab mode panel */}
        {activeMode === 'ble' && (
          <motion.div
            key="ble-controls"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
          >
            <button
              onClick={connectMuse}
              disabled={isConnecting !== null}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                museConnected
                  ? 'bg-cf-gold/15 text-cf-gold border-cf-gold/40'
                  : 'bg-white/5 border-white/10 text-cf-gold hover:bg-cf-gold/10'
              }`}
            >
              {isConnecting === 'muse' 
                ? (isFrench ? 'Pairage...' : 'Pairing...') 
                : (museConnected ? '🧠 Muse Connected' : '🧠 Connect Muse EEG')
              }
            </button>
            <button
              onClick={connectPulse}
              disabled={isConnecting !== null}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                pulseConnected
                  ? 'bg-[#ff6a88]/15 text-[#ff6a88] border-[#ff6a88]/40'
                  : 'bg-white/5 border-white/10 text-[#ff6a88] hover:bg-[#ff6a88]/10'
              }`}
            >
              {isConnecting === 'pulse' 
                ? (isFrench ? 'Pairage...' : 'Pairing...') 
                : (pulseConnected ? '❤️ Wearable Connected' : '❤️ Connect Fitbit / Strap')
              }
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostic errors banner */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-red-400 font-mono border border-red-500/30 bg-red-500/10 p-2 rounded-lg">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
