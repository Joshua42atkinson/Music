// ═══════════════════════════════════════════════════════════
// VIDEO RECORDER — Browser-based practice recording
// Uses MediaRecorder API. Records from webcam/mic.
// Uploads to STUDENT'S Google Drive (free, student-owned).
// Supabase stores only metadata (file IDs, not bytes).
// ═══════════════════════════════════════════════════════════

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadVideo, saveVideoMetadata } from '../../lib/driveService';

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
      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start(1000);
    setStatus('recording');
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const uploadToDrive = useCallback(async () => {
    if (!recordedBlob) return;

    // Not logged in: download locally
    if (!user) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voix-vive-practice-fret${fretId}-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('done');
      return;
    }

    setStatus('uploading');
    setUploadError(null);

    try {
      // 1. Upload to student's Google Drive
      const driveData = await uploadVideo(recordedBlob, {
        fretId,
        entryType: 'practice',
      });

      // 2. Save metadata to Supabase (tiny, stays free)
      await saveVideoMetadata(user.id, driveData, {
        fretId,
        entryType: 'practice',
      });

      setStatus('done');
      onRecordingComplete?.(driveData.webViewLink, driveData.fileName);
    } catch (err) {
      console.error('[VideoRecorder] Upload failed:', err);
      const msg = err.message || '';
      if (msg.includes('No Google Drive token')) {
        setUploadError(
          'Google Drive access needed. Please sign out and sign in again to grant permission.'
        );
      } else {
        setUploadError(msg || 'Upload failed');
      }
      setStatus('recorded');
    }
  }, [recordedBlob, user, fretId, onRecordingComplete]);

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
          📹 Record Practice Video
        </button>
        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
          {user 
            ? 'Saved to your Google Drive. Shared with mentor.' 
            : 'Recorded locally. Sign in to save to Google Drive.'}
        </p>
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={reset} style={btnStyle('rgba(255,255,255,0.2)')}>
            ↺ Retake
          </button>
          <button onClick={uploadToDrive} style={btnStyle(user ? '#7aaa88' : 'rgba(201,169,110,0.3)')}>
            {user ? '⬆ Save to Drive' : '⬇ Download Recording'}
          </button>
        </div>
      )}

      {status === 'uploading' && (
        <p style={{ fontSize: '0.75rem', color: '#c9a96e' }}>Uploading to your Google Drive...</p>
      )}

      {status === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#7aaa88' }}>
            {user ? '✓ Saved to your Google Drive!' : '✓ Recording saved to your device'}
          </p>
          <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            {user ? 'Your mentor can now review it.' : 'Sign in anytime to upload to Google Drive.'}
          </p>
        </div>
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
