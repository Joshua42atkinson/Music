import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Square, Play, Pause, RotateCcw, Send, X, 
  CheckCircle, Loader, Camera, Sparkles, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { vvGet, vvSetJSON } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

const PROMPT_STEPS = [
  { word: "Be: Somatic Centering", duration: 120, description: "Focus on deep breathing, release neck and shoulder tension.", color: "var(--cf-gold)" }, // Gold
  { word: "Do: Active Imagination", duration: 180, description: "Pause. Close your eyes and hear the note sounding in your inner ear.", color: "#e05a47" }, // Red/Orange
  { word: "Do: Pling! Protocol", duration: 180, description: "Sing the pitch first, then translate it to the fretboard.", color: "#4caf50" }, // Green
  { word: "Play: Unscripted Fun", duration: 300, description: "Let go of rules. Jam freely without boundary.", color: "#2196f3" }, // Blue
  { word: "Produce: Share & Reflect", duration: 90, description: "Express your somatic experience and save to your library.", color: "#9c27b0" } // Purple
];

export default function SomaticStudioPrompter({ onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState('intro'); // intro | recording | preview | uploading | done

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PROMPT_STEPS[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPausedForTransition, setIsPausedForTransition] = useState(false);
  const [reflection, setReflection] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const durationTimerRef = useRef(null);
  const videoLiveRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const blobRef = useRef(null);

  const step = PROMPT_STEPS[currentStep];

  // ── Format MM:SS ──
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStepComplete = () => {
    if (currentStep < PROMPT_STEPS.length - 1) {
      setIsRunning(false);
      setIsPausedForTransition(true);
    } else {
      finishRecording();
    }
  };

  // ── Step Timer ──
  useEffect(() => {
    if (stage === 'recording' && isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleStepComplete();
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, isRunning, timeLeft]);

  // ── Recording Duration Timer ──
  useEffect(() => {
    if (stage === 'recording' && isRunning) {
      durationTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(durationTimerRef.current);
  }, [stage, isRunning]);

  // ── Start Recording Session ──
  const startSession = async () => {
    try {
      setUploadError(null);
      chunksRef.current = [];
      setRecordingDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });

      streamRef.current = stream;
      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
        videoLiveRef.current.play();
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.src = URL.createObjectURL(blob);
        }
      };

      recorder.start(1000);
      setStage('recording');
      setCurrentStep(0);
      setTimeLeft(PROMPT_STEPS[0].duration);
      setIsRunning(true);
      setIsPausedForTransition(false);

    } catch (err) {
      console.error('[SomaticPrompter] Error starting camera:', err);
      setUploadError('Camera and microphone access are required to record a somatic session.');
    }
  };

  // ── Stop/Finish Recording ──
  const finishRecording = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    clearInterval(durationTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setStage('preview');
  };

  const reRecord = () => {
    blobRef.current = null;
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = '';
    }
    setStage('intro');
  };

  const handleClose = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    clearInterval(durationTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (onClose) {
      onClose();
    } else {
      navigate('/studio');
    }
  };

  // ── Upload Submission ──
  const submitSession = async () => {
    if (!blobRef.current) return;

    // Offline / guest mode: download directly
    if (!user) {
      const url = URL.createObjectURL(blobRef.current);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voix-vive-somatic-session-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setStage('done');
      return;
    }

    setStage('uploading');
    setUploadError(null);

    try {
      const submissionId = Date.now();
      const exerciseName = `Somatic Prompter: ${reflection.substring(0, 30) || 'Continuous Session'}`;
      const timestamp = new Date().toISOString();

      // 1. Save to IndexedDB outbox FIRST (instant safety)
      const { db } = await import('../../data/localDatabase');
      await db.outbox.add({
        fretId: exerciseName,
        blob: blobRef.current,
        status: 'queued',
        submissionId,
        mediaType: 'video',
        duration: recordingDuration,
        timestamp: timestamp,
        size: blobRef.current.size,
      });

      await db.recordings.add({
        exerciseName: exerciseName,
        timestamp: timestamp,
        duration: recordingDuration,
        blobUrl: null, // Will be updated by R2 sync
        reviewed: false,
        feedback: reflection,
        mediaType: 'video',
        size: blobRef.current.size,
      });

      // 2. Trigger background R2 sync (fire and forget to prevent UI block)
      import('../../lib/r2Service').then(({ syncOutboxToR2 }) => {
        syncOutboxToR2(user.id).catch(err => console.warn('[Background R2 Sync] Failed:', err));
      });

      // 3. Save placeholder to local storage for instant UI updates (DigitalBinder)
      const submission = {
        id: submissionId,
        exerciseName,
        mediaType: 'video',
        duration: recordingDuration,
        timestamp,
        size: blobRef.current.size,
        status: 'syncing', // indicates it is currently moving to R2
        fretId: null,
      };

      const existing = JSON.parse(vvGet(STORAGE_KEYS.SUBMISSIONS) || '[]');
      existing.unshift(submission);
      vvSetJSON(STORAGE_KEYS.SUBMISSIONS, existing);

      setStage('done');
    } catch (err) {
      console.error('[SomaticPrompter] Save failed:', err);
      setUploadError(err.message || 'Save failed. Make sure you have local storage space.');
      setStage('preview');
    }
  };

  const nextStep = () => {
    if (currentStep < PROMPT_STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      setTimeLeft(PROMPT_STEPS[nextIndex].duration);
      setIsPausedForTransition(false);
      setIsRunning(true);
    } else {
      finishRecording();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      setTimeLeft(PROMPT_STEPS[prevIndex].duration);
      setIsPausedForTransition(false);
      setIsRunning(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100 font-sans bg-[#040408]">
      {/* Dynamic Header color bar */}
      <div 
        className="h-2 w-full transition-colors duration-500" 
        style={{ backgroundColor: stage === 'recording' ? step.color : 'var(--cf-gold)' }} 
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h1 className="font-serif text-lg tracking-wide text-amber-100">Somatic Studio Prompter</h1>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* ═══ INTRO STAGE ═══ */}
          {stage === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-md flex flex-col items-center text-center space-y-6"
            >
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
                <Camera className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-amber-100">Continuous Somatic Capture</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Record your practice session continuously as you walk through the five core somatic steps. 
                  Your video will be saved directly to R2 and logged for Bertrand's review.
                </p>
              </div>

              <div className="w-full space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
                {PROMPT_STEPS.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900/50 last:border-0">
                    <span className="font-medium text-slate-300" style={{ color: p.color }}>{p.word}</span>
                    <span className="font-mono text-slate-500">{formatTime(p.duration)}</span>
                  </div>
                ))}
              </div>

              {uploadError && (
                <div className="p-3 text-xs bg-red-950/40 border border-red-900/50 text-red-400 rounded-lg text-center w-full">
                  {uploadError}
                </div>
              )}

              <button 
                onClick={startSession}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" /> Start Studio Session
              </button>
            </motion.div>
          )}

          {/* ═══ RECORDING STAGE ═══ */}
          {stage === 'recording' && (
            <motion.div 
              key="recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Prompter Content (Left) */}
              <div className="flex-1 flex flex-col space-y-6 text-center md:text-left">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                  Somatic Recording Session Active
                </span>
                
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight transition-colors duration-500" style={{ color: step.color }}>
                    {step.word}
                  </h2>
                  <p className="text-slate-400 mt-4 text-base leading-relaxed md:max-w-md">
                    {isPausedForTransition ? "Take a breath. When ready, proceed to next step." : step.description}
                  </p>
                </div>

                {/* Local instruction depending on status */}
                {isPausedForTransition && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-sm inline-block animate-pulse">
                    Bertrand is riffing... session paused for transition.
                  </div>
                )}

                {/* Step Navigation Controls */}
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {isRunning ? (
                    <button 
                      onClick={() => setIsRunning(false)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors font-mono tracking-wide"
                    >
                      PAUSE STEP
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsRunning(true);
                        setIsPausedForTransition(false);
                      }}
                      className="px-6 py-3 text-slate-950 font-semibold rounded-xl transition-colors font-mono tracking-wide"
                      style={{ backgroundColor: step.color }}
                    >
                      RESUME STEP
                    </button>
                  )}

                  <button 
                    onClick={nextStep}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Continuous Session Duration: <span className="text-amber-400">{formatTime(recordingDuration)}</span>
                </div>
              </div>

              {/* Viewfinder (Right) */}
              <div className="w-full max-w-[320px] flex flex-col items-center space-y-4">
                <div className="w-full aspect-[9/16] bg-slate-950 rounded-3xl border-2 border-slate-800/80 overflow-hidden relative shadow-2xl">
                  <video 
                    ref={videoLiveRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                  {/* Floating Record dot */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-800">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono tracking-wider text-slate-200">REC</span>
                  </div>

                  {/* Floating Step Timer */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center bg-slate-950/85 py-3 rounded-2xl border border-slate-800/50 backdrop-blur-md">
                    <div className="text-2xl font-mono font-bold tracking-tight text-amber-200">
                      {isPausedForTransition ? "HOLD" : formatTime(timeLeft)}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">Step Time Remaining</span>
                  </div>
                </div>

                <button 
                  onClick={finishRecording}
                  className="w-full py-3 bg-slate-900 hover:bg-red-950/30 hover:border-red-900/60 border border-slate-800 text-slate-200 hover:text-red-400 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" /> Stop & Review
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ PREVIEW STAGE ═══ */}
          {stage === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Submission review inputs */}
              <div className="flex-1 flex flex-col space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-serif text-amber-100">Review Somatic Session</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Continuous practice: {formatTime(recordingDuration)} saved.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-mono tracking-wider text-slate-400 uppercase">Somatic Reflection</label>
                  <textarea 
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={4}
                    placeholder="Describe how your body felt during the session. (e.g. Tension dissolved in warm-up, Pling! protocol triggered a breakthrough...)"
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 text-sm font-serif leading-relaxed resize-none"
                  />
                </div>

                {uploadError && (
                  <div className="p-3 text-xs bg-red-950/40 border border-red-900/50 text-red-400 rounded-lg">
                    {uploadError}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button 
                    onClick={reRecord}
                    className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-colors border border-slate-800 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Re-record
                  </button>
                  <button 
                    onClick={submitSession}
                    className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> {user ? 'Upload to R2' : 'Download Video'}
                  </button>
                </div>
              </div>

              {/* Viewfinder Preview */}
              <div className="w-full max-w-[300px]">
                <div className="w-full aspect-[9/16] bg-slate-950 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
                  <video 
                    ref={videoPreviewRef} 
                    controls 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ UPLOADING STAGE ═══ */}
          {stage === 'uploading' && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-4 py-12"
            >
              <Loader className="w-12 h-12 text-amber-500 animate-spin" />
              <p className="text-amber-100 font-medium">Bypassing constraints...</p>
              <p className="text-xs text-slate-500 max-w-xs text-center leading-relaxed">
                Uploading raw binary video directly to Cloudflare R2 bucket via pre-signed URL to bypass serverless size limits.
              </p>
            </motion.div>
          )}

          {/* ═══ DONE STAGE ═══ */}
          {stage === 'done' && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm flex flex-col items-center text-center space-y-6 py-8"
            >
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-emerald-100">Session Sovereignly Logged</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Your somatic recording has been uploaded directly to the R2 edge bucket. Bertrand has been notified for async review.
                </p>
              </div>

              <button 
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition-all"
              >
                Back to Studio
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
