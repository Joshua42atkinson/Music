import React, { useState, useEffect, useRef, useCallback } from 'react';
import usePitchDetector from '../hooks/usePitchDetector';
import { getAudioContext, resumeAudio } from '../audio/audioEngine';

export default function ResonantMirrorPOC() {
  const [phase, setPhase] = useState('IDLE'); // IDLE -> RECORDING_HUM -> LISTENING_GUITAR -> PLAYING
  const [humBuffer, setHumBuffer] = useState(null);
  
  // We use your existing pitch detector to listen for the guitar pluck
  const { isListening, pitch, volume, startListening, stopListening } = usePitchDetector();
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Phase 1: Record the voice hum (2 seconds)
  const startRecordingHum = async () => {
    setPhase('RECORDING_HUM');
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const ctx = resumeAudio();
        
        try {
          // Decode the raw mic data into a Web Audio API buffer
          const decodedData = await ctx.decodeAudioData(arrayBuffer);
          setHumBuffer(decodedData);
          setPhase('LISTENING_GUITAR');
          // Now turn on the pitch detector to wait for the guitar pluck
          startListening();
        } catch (err) {
          console.error("Failed to decode audio:", err);
          setPhase('IDLE');
        }
      };
      
      mediaRecorder.start();
      
      // Auto-stop after 2 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 2000);
      
    } catch (err) {
      console.error("Mic access denied for recording:", err);
      setPhase('IDLE');
    }
  };

  const triggerChoir = useCallback(() => {
    if (!humBuffer) return;
    setPhase('PLAYING');
    stopListening(); // Stop mic analysis while playing so it doesn't feedback
    
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = humBuffer;
    
    // THIS IS THE MAGIC: Pitch shift up by a Perfect Fifth (Ratio 3:2 = 1.5)
    // For a major third it would be 5:4 (1.25), etc.
    source.playbackRate.value = 1.5; 
    
    // Add a slight fade in/out so it doesn't click
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + humBuffer.duration - 0.1);
    
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start();
    
    source.onended = () => {
      setPhase('LISTENING_GUITAR');
      startListening(); // Go back to listening for the next pluck
    };
  }, [humBuffer, stopListening, startListening]);

  // Phase 2: Detect the pluck and trigger the Pitch-Shifted playback
  useEffect(() => {
    // If we are listening for guitar, and we detect a solid pitch and volume spike
    if (phase === 'LISTENING_GUITAR' && pitch > 0 && volume > 15) {
      triggerChoir();
    }
  }, [pitch, volume, phase, triggerChoir]);

  const reset = () => {
    stopListening();
    setPhase('IDLE');
    setHumBuffer(null);
  };

  return (
    <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 text-center max-w-md mx-auto mt-10 shadow-2xl">
      <h2 className="text-2xl font-bold text-amber-500 mb-2">Voix Vive Engine</h2>
      <p className="text-slate-400 text-sm mb-8">Proof of Concept: Voice Buffer + Perfect Fifth Pitch Shift</p>
      
      {phase === 'IDLE' && (
        <div className="space-y-4">
          <p className="text-slate-300">Step 1: Record a 2-second sustained "Ommm" or hum.</p>
          <button 
            onClick={startRecordingHum}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors"
          >
            Start Humming (2s)
          </button>
        </div>
      )}
      
      {phase === 'RECORDING_HUM' && (
        <div className="py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500 rounded-full mb-4 shadow-[0_0_20px_rgba(239,68,68,0.6)]"></div>
            <p className="text-red-400 font-bold">Recording Voice...</p>
          </div>
        </div>
      )}
      
      {phase === 'LISTENING_GUITAR' && (
        <div className="py-8 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-400 font-bold">Waiting for Guitar Pluck...</p>
          <p className="text-slate-400 text-sm">Pluck any string clearly.</p>
          
          <div className="mt-4 p-4 bg-slate-800 rounded-lg flex justify-between text-xs text-slate-300">
            <span>Vol: {Math.round(volume)}</span>
            <span>Hz: {pitch ? Math.round(pitch) : '--'}</span>
          </div>
        </div>
      )}

      {phase === 'PLAYING' && (
        <div className="py-8">
          <div className="flex justify-center mb-4">
            {/* Somatic visual feedback */}
            <div className="w-24 h-24 bg-amber-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <p className="text-amber-300 font-bold text-xl">✨ Perfect Fifth Choir ✨</p>
          <p className="text-slate-400 text-sm mt-2">Playing your voice shifted by 3:2 ratio</p>
        </div>
      )}

      {phase !== 'IDLE' && phase !== 'RECORDING_HUM' && (
        <button 
          onClick={reset}
          className="mt-8 text-slate-500 hover:text-slate-300 text-sm underline"
        >
          Reset Engine
        </button>
      )}
    </div>
  );
}
