// ═══════════════════════════════════════════════════════════
// VIDEO RECORDER — Browser-based practice recording
// Uses MediaRecorder API. Records from webcam/mic.
// Uploads to Supabase Storage when logged in.
// ═══════════════════════════════════════════════════════════

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function VideoRecorder({ fretId, onRecordingComplete }) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [status, setStatus] = useState('idle'); // idle | preview | recording | recorded | uploading | done
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const startPreview = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus('preview');
    } catch (err) {
      console.warn('[VideoRecorder] Camera access denied:', err);
      alert('Camera access is needed for video recording. Please allow camera access and try again.');
    }
  }, []);

  const startRecording = useCallback(() => {
    const stream = videoRef.current?.srcObject;
    if (!stream) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setStatus('recorded');
      // Stop camera stream
      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start(1000); // Collect chunks every 1s
    setStatus('recording');
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const uploadToSupabase = useCallback(async () => {
    if (!recordedBlob || !user) return;
    setStatus('uploading');
    setUploadError(null);

    try {
      const fileName = `practice-${user.id}-${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from('student-videos')
        .upload(fileName, recordedBlob, {
          contentType: 'video/webm',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('student-videos')
        .getPublicUrl(fileName);

      setStatus('done');
      onRecordingComplete?.(urlData.publicUrl, fileName);
    } catch (err) {
      console.error('[VideoRecorder] Upload failed:', err);
      setUploadError(err.message || 'Upload failed');
      setStatus('recorded');
    }
  }, [recordedBlob, user, onRecordingComplete]);

  const reset = useCallback(() => {
    setRecordedBlob(null);
    setVideoUrl(null);
    setUploadError(null);
    setStatus('idle');
    chunksRef.current = [];
  }, []);

  // ── UI ──
  if (status === 'idle') {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <button
          onClick={startPreview}
          style={{
            padding: '12px 24px',
            borderRadius: 12,
            background: 'rgba(201,169,110,0.12)',
            border: '1px solid rgba(201,169,110,0.3)',
            color: '#c9a96e',
            fontSize: '0.85rem',
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          📹 {user ? 'Record Practice Video' : 'Sign in to record video'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 12 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={status !== 'recorded'}
        src={status === 'recorded' ? videoUrl : undefined}
        controls={status === 'recorded'}
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 12,
          background: '#0a0a10',
          border: status === 'recording' ? '2px solid #cc5555' : '1px solid rgba(255,255,255,0.08)',
        }}
      />

      {status === 'preview' && (
        <button onClick={startRecording} style={btnStyle('#cc5555')}>
          ● Start Recording
        </button>
      )}

      {status === 'recording' && (
        <button onClick={stopRecording} style={btnStyle('#cc5555')}>
          ■ Stop Recording
        </button>
      )}

      {status === 'recorded' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reset} style={btnStyle('rgba(255,255,255,0.2)')}>
            ↺ Retake
          </button>
          {user ? (
            <button onClick={uploadToSupabase} style={btnStyle('#7aaa88')}>
              ⬆ Upload
            </button>
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>
              Sign in to save
            </span>
          )}
        </div>
      )}

      {status === 'uploading' && (
        <p style={{ fontSize: '0.75rem', color: '#c9a96e' }}>Uploading...</p>
      )}

      {status === 'done' && (
        <p style={{ fontSize: '0.75rem', color: '#7aaa88' }}>✓ Video saved!</p>
      )}

      {uploadError && (
        <p style={{ fontSize: '0.7rem', color: '#cc5555', maxWidth: 300, textAlign: 'center' }}>
          {uploadError}
        </p>
      )}
    </div>
  );
}

function btnStyle(color) {
  return {
    padding: '10px 20px',
    borderRadius: 10,
    background: typeof color === 'string' && color.startsWith('#') ? `${color}20` : color,
    border: `1px solid ${typeof color === 'string' && color.startsWith('#') ? `${color}60` : color}`,
    color: typeof color === 'string' && color.startsWith('#') ? color : '#c9a96e',
    fontSize: '0.75rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
  };
}
