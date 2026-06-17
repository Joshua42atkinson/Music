import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Wind, Flame, Activity, Music, Circle, Square, Heart,
  ArrowRight, RotateCcw, Send, X, CheckCircle, Loader,
} from 'lucide-react';
import { uploadVideo, saveVideoMetadata } from '../lib/driveService';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// STRUCTURED PRACTICE RECORDER — 15-minute guided session
// Phase-based recording: breathing → warm-up → practice → free play → emotional capture → save
// All phases recorded as ONE continuous video, uploaded to student's Google Drive.
// ═══════════════════════════════════════════════════════════

const PHASES = [
  {
    id: 'breathing',
    label: 'Breathing Gate',
    duration: 120, // 2 min
    icon: Wind,
    color: '#7aaa88',
    prompts: [
      'Place your hand on your belly. Feel it rise and fall.',
      'Inhale for 4 counts... hold... exhale for 6.',
      'Let the breath arrive before the note.',
      'No urgency. The guitar will wait for you.',
    ],
  },
  {
    id: 'warmup',
    label: 'Warm-Up',
    duration: 180, // 3 min
    icon: Flame,
    color: 'var(--cf-gold)',
    prompts: [
      'Open A string — let it ring fully.',
      'Chapter 2 (B) — feel the resistance under your finger.',
      'Chapter 3 (C) — notice the interval change.',
      'Chapter 5 (D) — Perfect 4th. The door opens.',
      'Slide back to open. One breath per note.',
    ],
  },
  {
    id: 'practice',
    label: 'Practice Session',
    duration: 480, // 8 min
    icon: Activity,
    color: '#5a90a0',
    prompts: [
      'Play the passage you are working on.',
      'If you make a mistake, do not stop. Breathe and continue.',
      'Feel the string under your fingertip.',
      'Listen to the decay of each note.',
      'Where is the tension? Release it.',
      'Let the music breathe through you.',
      'One more time. Slower this time.',
    ],
  },
  {
    id: 'freeplay',
    label: 'Free Play',
    duration: 60, // 1 min
    icon: Music,
    color: '#7b6aaa',
    prompts: [], // blank screen, just play
    isFree: true,
  },
  {
    id: 'emotional',
    label: 'Emotional State',
    duration: 30, // 30s
    icon: Heart,
    color: '#cc5555',
    prompts: [
      'Speak aloud: What are you feeling right now?',
      'Name one sensation in your body.',
      'Name one sound you noticed during practice.',
    ],
    isVoicePrompt: true,
  },
];

const TOTAL_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0); // 870s ≈ 14.5 min

export default function StructuredPracticeRecorder({ onClose, fretId = 1, completePhase, passGate }) {
  const { t } = useLocale();
  const { user } = useAuth();
  const [stage, setStage] = useState('intro'); // intro | recording-phase-{n} | emotional-input | uploading | done
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(TOTAL_DURATION);
  const [promptIndex, setPromptIndex] = useState(0);
  const [emotionalState, setEmotionalState] = useState('');
  const [uploadError, setUploadError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoLiveRef = useRef(null);
  const blobRef = useRef(null);
  const phaseTimeRef = useRef(0);
  const totalTimeRef = useRef(TOTAL_DURATION);
  const phaseIndexRef = useRef(0);

  const currentPhase = PHASES[currentPhaseIndex];

  // ── Format MM:SS ──
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Start the full session recording ──
  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
        videoLiveRef.current.play();
      }

      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, { type: mime });
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };

      recorder.start(1000);
      phaseIndexRef.current = 0;
      phaseTimeRef.current = PHASES[0].duration;
      totalTimeRef.current = TOTAL_DURATION;
      setStage('recording-phase-0');
      setCurrentPhaseIndex(0);
      setPhaseTimeLeft(PHASES[0].duration);
      setTotalTimeLeft(TOTAL_DURATION);
      setPromptIndex(0);
    } catch (err) {
      console.error('[SPR] Camera error:', err);
      alert('Camera access needed for structured practice recording. Please allow access.');
    }
  };

  // ── Stop recording early ──
  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Finish session → emotional input → upload ──
  const finishSession = useCallback(() => {
    stopRecording();
    setStage('emotional-input');
  }, [stopRecording]);

  // ── Timer engine (uses refs to avoid React state race conditions) ──
  useEffect(() => {
    if (!stage.startsWith('recording-phase')) return;

    timerRef.current = setInterval(() => {
      totalTimeRef.current -= 1;
      phaseTimeRef.current -= 1;
      setTotalTimeLeft(totalTimeRef.current);
      setPhaseTimeLeft(phaseTimeRef.current);

      if (totalTimeRef.current <= 0) {
        clearInterval(timerRef.current);
        finishSession();
        return;
      }

      if (phaseTimeRef.current <= 0) {
        const next = phaseIndexRef.current + 1;
        if (next >= PHASES.length) {
          clearInterval(timerRef.current);
          finishSession();
          return;
        }
        phaseIndexRef.current = next;
        phaseTimeRef.current = PHASES[next].duration;
        setCurrentPhaseIndex(next);
        setPhaseTimeLeft(PHASES[next].duration);
        setPromptIndex(0);
        setStage(`recording-phase-${next}`);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [stage, finishSession]);


  // ── Prompt rotation (every 20s) ──
  useEffect(() => {
    if (!currentPhase?.prompts?.length) return;
    const interval = setInterval(() => {
      setPromptIndex(i => (i + 1) % currentPhase.prompts.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [currentPhaseIndex, currentPhase]);

  // ── Submit emotional state + upload ──
  const submitSession = async () => {
    if (!blobRef.current) {
      setUploadError('No recording available. Please try again.');
      return;
    }

    // Not logged in: save locally as download
    if (!user) {
      const url = URL.createObjectURL(blobRef.current);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voix-vive-practice-fret${fretId}-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      if (typeof passGate === 'function') passGate(fretId, 'play');
      if (typeof completePhase === 'function') completePhase(fretId, 'play');
      setStage('done');
      return;
    }

    setStage('uploading');
    setUploadError(null);

    try {
      const driveData = await uploadVideo(blobRef.current, {
        fretId,
        entryType: 'structured-practice',
        emotionalState: emotionalState.trim() || undefined,
        fileName: `voix-vive-structured-fret${fretId}-${Date.now()}.webm`,
      });

      await saveVideoMetadata(user.id, driveData, {
        fretId,
        entryType: 'structured-practice',
        emotionalState: emotionalState.trim() || null,
      });

      if (typeof passGate === 'function') passGate(fretId, 'play');
      if (typeof completePhase === 'function') completePhase(fretId, 'play');
      setStage('done');
    } catch (err) {
      console.error('[SPR] Upload failed:', err);
      const msg = err.message || '';
      if (msg.includes('No Google Drive token')) {
        setUploadError('Google Drive access needed. Sign out and sign in again to grant permission.');
      } else {
        setUploadError(msg || 'Upload failed');
      }
      setStage('emotional-input');
    }
  };

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <motion.div
      className="spr-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <style>{`
        .spr-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: #050508; color: #e8dcc8;
          font-family: 'Inter', sans-serif;
          display: flex; flex-direction: column;
        }
        .spr-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .spr-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #f0e6d2; }
        .spr-close { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: none; color: #8a9aaa; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .spr-body {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 20px; gap: 20px; position: relative; overflow: hidden;
        }

        /* Video viewfinder */
        .spr-viewfinder {
          width: 100%; max-width: 360px; aspect-ratio: 9/16; max-height: 45vh;
          border-radius: 16px; overflow: hidden; background: #0a0a14;
          border: 2px solid rgba(var(--cf-gold-rgb),0.2); position: relative;
        }
        .spr-viewfinder video { width: 100%; height: 100%; object-fit: cover; }

        /* Progress bar */
        .spr-progress-track { width: 100%; max-width: 320px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .spr-progress-fill { height: 100%; background: linear-gradient(90deg, #7aaa88, var(--cf-gold), #5a90a0, #7b6aaa, #cc5555); border-radius: 2px; transition: width 1s linear; }

        /* Phase label */
        .spr-phase-badge { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }

        /* Timer */
        .spr-timer { font-family: 'JetBrains Mono', monospace; font-size: 2.2rem; color: #f0e6d2; letter-spacing: 0.05em; }
        .spr-timer-small { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.3); }

        /* Prompt text */
        .spr-prompt { text-align: center; max-width: 320px; font-size: 1rem; color: #e8dcc8; line-height: 1.6; font-family: 'EB Garamond', serif; font-style: italic; min-height: 60px; }

        /* Breathing animation */
        @keyframes breathe {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 0.4; }
        }
        .spr-breath-circle {
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, rgba(122,170,136,0.2), transparent 70%);
          border: 2px solid rgba(122,170,136,0.3);
          display: flex; align-items: center; justify-content: center;
          animation: breathe 5s ease-in-out infinite;
          margin: 0 auto;
        }

        /* Buttons */
        .spr-btn { display: flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; transition: all 0.2s; }
        .spr-btn:active { transform: scale(0.97); }
        .spr-btn-primary { background: var(--cf-gold); color: #0d0d14; }
        .spr-btn-primary:hover { background: #e0d0aa; }
        .spr-btn-danger { background: rgba(232,85,85,0.15); color: #e85555; border: 1px solid rgba(232,85,85,0.3); }
        .spr-btn-secondary { background: rgba(255,255,255,0.08); color: #8a9aaa; border: 1px solid rgba(255,255,255,0.1); }

        /* Emotional input */
        .spr-emotional-input { width: 100%; max-width: 320px; padding: 14px 16px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #e8dcc8; font-family: 'EB Garamond', serif; font-size: 1rem; outline: none; resize: none; }
        .spr-emotional-input:focus { border-color: rgba(var(--cf-gold-rgb),0.4); }

        /* Phase dots */
        .spr-dots { display: flex; gap: 6px; justify-content: center; }
        .spr-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); transition: all 0.3s; }
        .spr-dot.active { background: var(--cf-gold); box-shadow: 0 0 8px rgba(var(--cf-gold-rgb),0.4); }
        .spr-dot.done { background: #7aaa88; }

        /* Done state */
        .spr-done { text-align: center; padding: 40px; }
        .spr-done-icon { width: 80px; height: 80px; border-radius: 50%; background: rgba(122,170,136,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }

        /* Error */
        .spr-error { background: rgba(232,85,85,0.1); border: 1px solid rgba(232,85,85,0.3); border-radius: 12px; padding: 12px; color: #e88888; font-size: 0.8rem; text-align: center; max-width: 320px; }
      `}</style>

      {/* HEADER */}
      <div className="spr-header">
        <span className="spr-title">
          {stage === 'intro' && t('spr_title')}
          {stage === 'emotional-input' && t('spr_whatAreYouFeeling')}
          {stage === 'uploading' && t('spr_uploadingDrive')}
          {stage === 'done' && t('spr_sessionSaved')}
          {stage.startsWith('recording-phase') && currentPhase?.label}
        </span>
        <button className="spr-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="spr-body">
        {/* ═══ INTRO ═══ */}
        {stage === 'intro' && (
          <>
            <div className="text-center max-w-[340px]">
              <p className="font-heading text-[1.4rem] text-vv-text m-0 mb-3">
                {t('spr_guidedPractice')}
              </p>
              <p className="text-[0.85rem] text-white/40 leading-[1.6] mb-6">
                {t('spr_guidedPracticeDesc')}
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {PHASES.map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/[0.03]">
                    <p.icon size={16} style={{ color: p.color }} />
                    <span className="text-[0.8rem] text-[#e8dcc8] flex-1">{p.label}</span>
                    <span className="text-[0.7rem] text-white/30 font-mono">{fmt(p.duration)}</span>
                  </div>
                ))}
              </div>
              <button className="spr-btn spr-btn-primary" onClick={startSession}>
                <Circle size={16} /> {t('spr_beginSession')}
              </button>
              <p className="text-[0.7rem] text-white/30 mt-2">
                {user 
                  ? t('spr_savedDriveDesc')
                  : t('spr_localRecordingDesc')}
              </p>
            </div>
          </>
        )}

        {/* ═══ RECORDING PHASES ═══ */}
        {stage.startsWith('recording-phase') && (
          <>
            {/* Phase dots */}
            <div className="spr-dots">
              {PHASES.map((p, i) => (
                <div
                  key={p.id}
                  className={`spr-dot ${i === currentPhaseIndex ? 'active' : ''} ${i < currentPhaseIndex ? 'done' : ''}`}
                />
              ))}
            </div>

            {/* Phase badge */}
            <div className="spr-phase-badge" style={{ borderColor: currentPhase?.color + '30', color: currentPhase?.color }}>
              <currentPhase.icon size={14} />
              {currentPhase?.label}
            </div>

            {/* Video viewfinder */}
            <div className="spr-viewfinder">
              <video ref={videoLiveRef} autoPlay muted playsInline className="-scale-x-100" />
            </div>

            {/* Breathing animation (phase 0) */}
            {currentPhaseIndex === 0 && (
              <div className="spr-breath-circle">
                <Wind size={32} className="text-[#7aaa88] opacity-60" />
              </div>
            )}

            {/* Prompt text */}
            {currentPhase?.prompts?.length > 0 && (
              <motion.p
                className="spr-prompt"
                key={promptIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentPhase.prompts[promptIndex]}
              </motion.p>
            )}

            {currentPhase?.isFree && (
              <p className="spr-prompt" style={{ color: 'rgba(255,255,255,0.2)' }}>—</p>
            )}

            {/* Timer */}
            <div className="text-center">
              <div className="spr-timer">{fmt(phaseTimeLeft)}</div>
              <div className="spr-timer-small">{t('spr_phaseTime')}</div>
            </div>

            {/* Progress bar */}
            <div className="spr-progress-track">
              <div
                className="spr-progress-fill"
                style={{ width: `${((TOTAL_DURATION - totalTimeLeft) / TOTAL_DURATION) * 100}%` }}
              />
            </div>
            <div className="spr-timer-small">{t('spr_totalRemaining', { time: fmt(totalTimeLeft) })}</div>

            {/* Stop button */}
            <button className="spr-btn spr-btn-danger" onClick={stopRecording}>
              <Square size={14} /> {t('spr_endSessionEarly')}
            </button>
          </>
        )}

        {/* ═══ EMOTIONAL INPUT ═══ */}
        {stage === 'emotional-input' && (
          <>
            <div className="spr-done-icon" style={{ background: 'rgba(204,85,85,0.15)' }}>
              <Heart size={32} className="text-[#cc5555]" />
            </div>
            <h2 className="font-heading text-[1.5rem] text-vv-text m-0">
              {t('spr_whatAreYouFeeling')}
            </h2>
            <p className="text-[0.85rem] text-white/40 text-center max-w-[300px] leading-[1.6]">
              {t('spr_emotionCaptureDesc')}
            </p>
            <textarea
              className="spr-emotional-input"
              rows={3}
              placeholder={t('spr_iFeelPlaceholder')}
              value={emotionalState}
              onChange={(e) => setEmotionalState(e.target.value)}
            />
            {uploadError && <div className="spr-error">{uploadError}</div>}
            <div className="flex gap-2.5">
              <button className="spr-btn spr-btn-secondary" onClick={() => { stopRecording(); onClose(); }}>
                <X size={14} /> {t('spr_discard')}
              </button>
              <button className="spr-btn spr-btn-primary" onClick={submitSession}>
                <Send size={14} /> {user ? t('spr_saveSession') : t('spr_downloadRecording')}
              </button>
            </div>
          </>
        )}

        {/* ═══ UPLOADING ═══ */}
        {stage === 'uploading' && (
          <>
            <Loader size={48} className="text-cf-gold animate-spin" />
            <p className="text-[0.9rem] text-cf-gold">{t('spr_uploadingDrive')}</p>
            <p className="text-[0.75rem] text-white/30 max-w-[280px] text-center">
              {t('spr_uploadingDesc')}
            </p>
          </>
        )}

        {/* ═══ DONE ═══ */}
        {stage === 'done' && (
          <motion.div
            className="spr-done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="spr-done-icon">
              <CheckCircle size={40} className="text-[#7aaa88]" />
            </div>
            <h2 className="font-heading text-[1.6rem] text-vv-text m-0 mb-2">
              {user ? t('spr_sessionSaved') : t('spr_sessionSavedLocally')}
            </h2>
            <p className="text-white/40 text-[0.85rem] leading-[1.6] mb-2">
              {user 
                ? t('spr_savedDriveSuccess')
                : t('spr_savedLocalSuccess')}
            </p>
            {emotionalState && (
              <p className="text-white/30 text-[0.8rem] italic mb-2">
                "{emotionalState}"
              </p>
            )}
            <p className="text-white/30 text-[0.75rem]">
              {user ? t('spr_review48h') : t('spr_noLoginWarning')}
            </p>
            <button className="spr-btn spr-btn-primary mt-6" onClick={onClose}>
              <CheckCircle size={14} /> {t('pr_done')}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
