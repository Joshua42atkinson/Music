import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Square, X, CheckCircle, Send, RotateCcw } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';
import { devError } from '../lib/devLog';

export default function MentorVideoRecorder({ submissionId, onCancel, onSave }) {
  const { t } = useLocale();
  const [stage, setStage] = useState('ready'); // ready | recording | preview
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoLiveRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const blobRef = useRef(null);
  
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
        videoLiveRef.current.play();
      }
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.src = URL.createObjectURL(blob);
        }
        stopStream();
        setStage('preview');
      };
      
      recorder.start(1000);
      setStage('recording');
    } catch (err) {
      devError(err);
      alert(t('cameraAccessDenied'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSave = () => {
    if (blobRef.current) {
      onSave(blobRef.current);
    }
  };

  return (
    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10 mt-3">
      <div className="flex justify-between mb-3">
        <h4 className="m-0 text-vv-text font-heading">{t('recordFeedbackVideo')}</h4>
        <button onClick={onCancel} className="bg-transparent border-none text-[#8a9aaa] cursor-pointer"><X size={16} /></button>
      </div>

      {stage === 'ready' && (
        <div className="text-center">
           <button onClick={startRecording} className="bg-[#e85555] text-white border-none py-2.5 px-5 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:bg-[#e85555]/90 transition-colors">
             <Video size={16} /> {t('startRecording')}
           </button>
        </div>
      )}

      {stage === 'recording' && (
        <div className="text-center">
          <video ref={videoLiveRef} muted autoPlay playsInline className="w-full max-w-[300px] rounded-lg" style={{ transform: 'scaleX(-1)' }} />
          <div className="mt-3">
            <button onClick={stopRecording} className="bg-red-500/20 text-[#e85555] border border-[#e85555] py-2.5 px-5 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:bg-red-500/30 transition-colors">
              <Square size={16} fill="currentColor" /> {t('stop')}
            </button>
          </div>
        </div>
      )}

      {stage === 'preview' && (
        <div className="text-center">
          <video ref={videoPreviewRef} controls playsInline className="w-full max-w-[300px] rounded-lg" style={{ transform: 'scaleX(-1)' }} />
          <div className="mt-3 flex gap-3 justify-center">
             <button onClick={() => setStage('ready')} className="bg-white/10 text-white border-none py-2 px-4 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:bg-white/15 transition-colors">
               <RotateCcw size={14} /> {t('retake')}
             </button>
             <button onClick={handleSave} className="bg-[#7aaa88] text-black border-none py-2 px-4 rounded-lg cursor-pointer inline-flex items-center gap-2 font-bold hover:bg-[#7aaa88]/90 transition-colors">
               <CheckCircle size={14} /> {t('attachVideo')}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
