import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, Square, Play, Pause, RotateCcw, Send, X, Clock, CheckCircle } from 'lucide-react';
import { db } from '../data/localDatabase';

// ═══════════════════════════════════════════════════════════
// PRACTICE RECORDER — Async Video Coaching MVP
// 
// Students record themselves practicing, submit to Bertrand,
// and receive personalized video feedback within 48 hours.
// 
// Revenue: $35/review, $150/5-pack, $250/10-pack
// Bertrand's effective rate: $420/hr (5 min per review)
// ═══════════════════════════════════════════════════════════

const MAX_DURATION = 90; // seconds

export default function PracticeRecorder({ onClose, exerciseName = 'Practice Recording' }) {
  const [stage, setStage] = useState('ready'); // ready | recording | preview | submitted
  const [duration, setDuration] = useState(0);
  const [mediaType, setMediaType] = useState('video'); // video | audio
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const videoLiveRef = useRef(null);
  const blobRef = useRef(null);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopStream();
      clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // ── Start Recording ──
  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    
    try {
      const constraints = mediaType === 'video' 
        ? { video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } }, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Show live preview for video
      if (mediaType === 'video' && videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
        videoLiveRef.current.play();
      }

      const mimeType = mediaType === 'video'
        ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm')
        : (MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm');

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        
        // Set preview source
        if (videoPreviewRef.current) {
          videoPreviewRef.current.src = URL.createObjectURL(blob);
        }
        
        stopStream();
        setStage('preview');
      };

      recorder.start(1000); // Collect chunks every second
      setStage('recording');
      setDuration(0);

      // Timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera/microphone access denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Try switching to audio-only mode.');
      } else {
        setError(`Recording failed: ${err.message}`);
      }
    }
  };

  // ── Stop Recording ──
  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Re-record ──
  const reRecord = () => {
    blobRef.current = null;
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = '';
    }
    setDuration(0);
    setStage('ready');
  };

  // ── Submit ──
  const submitRecording = async () => {
    if (!blobRef.current) return;

    const submissionId = Date.now();
    const submission = {
      id: submissionId,
      exerciseName,
      mediaType,
      duration,
      timestamp: new Date().toISOString(),
      size: blobRef.current.size,
      status: 'pending', // pending | sent | reviewed
    };

    try {
      // Persist the actual blob to IndexedDB outbox (survives refresh)
      await db.outbox.add({
        fretId: exerciseName,
        blob: blobRef.current,
        status: 'queued',
        submissionId,
        mediaType,
        duration,
        timestamp: submission.timestamp,
        size: blobRef.current.size,
      });
    } catch (err) {
      console.warn('IndexedDB save failed, falling back to metadata only:', err);
    }

    // Also save metadata to localStorage for quick UI access
    const existing = JSON.parse(localStorage.getItem('voixvive_submissions') || '[]');
    existing.unshift(submission);
    localStorage.setItem('voixvive_submissions', JSON.stringify(existing));
    
    setStage('submitted');
  };

  // ── Format time ──
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="practice-recorder-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <style>{`
        .practice-recorder-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          color: #e8dcc8;
          font-family: 'Inter', sans-serif;
        }

        .pr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .pr-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #f0e6d2;
        }
        .pr-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: none;
          color: #8a9aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pr-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 24px;
        }

        /* ── Video Preview Area ── */
        .pr-viewfinder {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 9 / 16;
          max-height: 50vh;
          border-radius: 16px;
          overflow: hidden;
          background: #0a0a14;
          border: 2px solid rgba(201,169,110,0.2);
          position: relative;
        }
        .pr-viewfinder video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pr-viewfinder-audio {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(201,169,110,0.1), rgba(122,170,136,0.1));
          border: 2px solid rgba(201,169,110,0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        /* ── Timer ── */
        .pr-timer {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.5rem;
          color: #f0e6d2;
          letter-spacing: 0.05em;
        }
        .pr-timer.recording {
          color: #e85555;
        }
        .pr-timer-bar {
          width: 100%;
          max-width: 300px;
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .pr-timer-fill {
          height: 100%;
          background: linear-gradient(90deg, #c9a96e, #e85555);
          border-radius: 2px;
          transition: width 1s linear;
        }

        /* ── Controls ── */
        .pr-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }
        .pr-btn-record {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 4px solid #e85555;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .pr-btn-record:hover {
          background: rgba(232,85,85,0.1);
        }
        .pr-btn-record-inner {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e85555;
          transition: all 0.2s;
        }
        .pr-btn-record.recording .pr-btn-record-inner {
          width: 28px;
          height: 28px;
          border-radius: 6px;
        }

        .pr-btn-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.2s;
        }
        .pr-btn-action:active {
          transform: scale(0.97);
        }
        .pr-btn-submit {
          background: #c9a96e;
          color: #0d0d14;
        }
        .pr-btn-submit:hover {
          background: #e0d0aa;
          box-shadow: 0 0 30px rgba(201,169,110,0.3);
        }
        .pr-btn-secondary {
          background: rgba(255,255,255,0.08);
          color: #8a9aaa;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .pr-btn-secondary:hover {
          background: rgba(255,255,255,0.12);
        }

        /* ── Mode Toggle ── */
        .pr-mode-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          margin-bottom: 8px;
        }
        .pr-mode-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #6a7a8a;
          font-size: 0.9rem;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .pr-mode-btn.active {
          background: rgba(201,169,110,0.15);
          color: #c9a96e;
        }

        /* ── Info Text ── */
        .pr-info {
          text-align: center;
          color: #5a6a7a;
          font-size: 0.8rem;
          max-width: 300px;
          line-height: 1.6;
        }
        .pr-exercise-name {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          color: #7aaa88;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        /* ── Submitted State ── */
        .pr-submitted {
          text-align: center;
          padding: 40px;
        }
        .pr-submitted-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(122,170,136,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .pr-submitted h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          color: #f0e6d2;
          margin: 0 0 8px;
        }
        .pr-submitted p {
          color: #6a7a8a;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        /* ── Error ── */
        .pr-error {
          background: rgba(232,85,85,0.1);
          border: 1px solid rgba(232,85,85,0.3);
          border-radius: 12px;
          padding: 16px;
          color: #e88888;
          font-size: 0.85rem;
          text-align: center;
          max-width: 350px;
        }

        /* ── Pulse animation for recording ── */
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(232,85,85,0.4); }
          70% { box-shadow: 0 0 0 15px rgba(232,85,85,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,85,85,0); }
        }
        .pr-btn-record.recording {
          animation: pulse-ring 1.5s infinite;
        }
      `}</style>

      {/* Header */}
      <div className="pr-header">
        <span className="pr-title">
          {stage === 'submitted' ? 'Submitted!' : '📹 Record Practice'}
        </span>
        <button className="pr-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="pr-body">
        {/* ═══ READY STATE ═══ */}
        {stage === 'ready' && (
          <>
            <p className="pr-exercise-name">{exerciseName}</p>

            {/* Mode Toggle */}
            <div className="pr-mode-toggle">
              <button
                className={`pr-mode-btn ${mediaType === 'video' ? 'active' : ''}`}
                onClick={() => setMediaType('video')}
              >
                <Video size={14} /> Video
              </button>
              <button
                className={`pr-mode-btn ${mediaType === 'audio' ? 'active' : ''}`}
                onClick={() => setMediaType('audio')}
              >
                <Mic size={14} /> Audio Only
              </button>
            </div>

            {/* Viewfinder placeholder */}
            {mediaType === 'video' ? (
              <div className="pr-viewfinder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={48} style={{ color: 'rgba(201,169,110,0.2)' }} />
              </div>
            ) : (
              <div className="pr-viewfinder-audio">
                <Mic size={48} style={{ color: 'rgba(201,169,110,0.3)' }} />
                <span style={{ color: '#5a6a7a', fontSize: '0.9rem' }}>Audio Mode</span>
              </div>
            )}

            <p className="pr-info">
              Record up to {MAX_DURATION} seconds of your practice. 
              Bertrand will review and send personalized feedback within 48 hours.
            </p>

            {error && <div className="pr-error">{error}</div>}

            {/* Record Button */}
            <button className="pr-btn-record" onClick={startRecording}>
              <div className="pr-btn-record-inner" />
            </button>

            <span style={{ color: '#5a6a7a', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace" }}>
              TAP TO RECORD
            </span>
          </>
        )}

        {/* ═══ RECORDING STATE ═══ */}
        {stage === 'recording' && (
          <>
            {mediaType === 'video' ? (
              <div className="pr-viewfinder">
                <video ref={videoLiveRef} autoPlay muted playsInline style={{ transform: 'scaleX(-1)' }} />
              </div>
            ) : (
              <div className="pr-viewfinder-audio" style={{ borderColor: 'rgba(232,85,85,0.4)' }}>
                <Mic size={48} style={{ color: '#e85555' }} />
                <span style={{ color: '#e85555', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  ● RECORDING
                </span>
              </div>
            )}

            <div className={`pr-timer recording`}>{formatTime(duration)}</div>
            
            <div className="pr-timer-bar">
              <div className="pr-timer-fill" style={{ width: `${(duration / MAX_DURATION) * 100}%` }} />
            </div>

            <button className="pr-btn-record recording" onClick={stopRecording}>
              <div className="pr-btn-record-inner" />
            </button>

            <span style={{ color: '#e85555', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace" }}>
              TAP TO STOP
            </span>
          </>
        )}

        {/* ═══ PREVIEW STATE ═══ */}
        {stage === 'preview' && (
          <>
            <p className="pr-exercise-name">{exerciseName}</p>

            {mediaType === 'video' ? (
              <div className="pr-viewfinder">
                <video ref={videoPreviewRef} controls playsInline style={{ transform: 'scaleX(-1)' }} />
              </div>
            ) : (
              <div className="pr-viewfinder-audio">
                <Mic size={48} style={{ color: '#c9a96e' }} />
                <audio ref={videoPreviewRef} controls style={{ width: '180px' }} />
              </div>
            )}

            <div className="pr-timer">{formatTime(duration)}</div>

            <div className="pr-controls">
              <button className="pr-btn-action pr-btn-secondary" onClick={reRecord}>
                <RotateCcw size={14} /> Re-record
              </button>
              <button className="pr-btn-action pr-btn-submit" onClick={submitRecording}>
                <Send size={14} /> Submit to Bertrand
              </button>
            </div>

            <p className="pr-info">
              Review your recording. When you're happy, submit it for Bertrand's feedback.
            </p>
          </>
        )}

        {/* ═══ SUBMITTED STATE ═══ */}
        {stage === 'submitted' && (
          <motion.div
            className="pr-submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="pr-submitted-icon">
              <CheckCircle size={40} style={{ color: '#7aaa88' }} />
            </div>
            <h2>Submitted!</h2>
            <p style={{ marginBottom: 8 }}>
              Your {formatTime(duration)} recording has been saved.
            </p>
            <p>
              Bertrand will review your practice and send personalized 
              video feedback within 48 hours. Check your Binder for updates.
            </p>

            <button
              className="pr-btn-action pr-btn-submit"
              onClick={onClose}
              style={{ marginTop: 28 }}
            >
              <CheckCircle size={14} /> Done
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
