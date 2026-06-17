import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function PracticeRecorder({ chapterId, onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Request camera and microphone access on mount
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setHasPermission(false);
      }
    };
    initStream();

    return () => {
      // Cleanup stream when unmounting
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setVideoUrl(null);
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  };

  return (
    <div className="bg-black/40 border border-[#9b59b6]/30 p-4 rounded-xl flex flex-col gap-4">
      {!hasPermission && !videoUrl ? (
        <div className="p-8 text-center text-white/50 font-mono text-sm uppercase">
          Camera & Microphone access required to record your practice.
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          )}
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full border border-red-500/50 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold">Recording</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!videoUrl ? (
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!hasPermission}
            className={`flex-1 py-3 rounded-lg font-mono font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${
              isRecording 
                ? 'bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30' 
                : 'bg-[#9b59b6]/20 border border-[#9b59b6] text-[#e0b0ff] hover:bg-[#9b59b6]/40 shadow-[0_0_15px_rgba(155,89,182,0.3)] disabled:opacity-50'
            }`}
          >
            {isRecording ? <><Square size={18} /> Stop Recording</> : <><Video size={18} /> Record Attempt</>}
          </button>
        ) : (
          <>
            <button
              onClick={handleRetake}
              className="flex-1 py-3 rounded-lg font-mono font-bold uppercase tracking-widest transition-all bg-black/50 border border-white/20 text-white/70 hover:border-white/50 flex justify-center items-center gap-2"
            >
              <RefreshCw size={18} /> Retake
            </button>
            <a
              href={videoUrl}
              download={`Bertrand_Homework_Ch${chapterId}.webm`}
              onClick={onComplete}
              className="flex-[2] py-3 rounded-lg font-mono font-bold uppercase tracking-widest transition-all bg-[#9b59b6] text-black hover:bg-[#b57ee0] shadow-[0_0_20px_rgba(155,89,182,0.4)] flex justify-center items-center gap-2"
            >
              <Download size={18} /> Save & Send to Bertrand
            </a>
          </>
        )}
      </div>
    </div>
  );
}
