import { devWarn } from '../lib/devLog';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Play, Pause, ArrowLeft, UploadCloud, RefreshCw, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../hooks/useLocale';

const MAX_DURATION = 60; // 60 seconds max for the feed

export default function HumanOctaveLibrary() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recording state
  const [stage, setStage] = useState('browse'); // browse | recording | preview
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const blobRef = useRef(null);
  const audioPreviewRef = useRef(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from Supabase (assuming table is 'human_octave_tracks')
      // If the table doesn't exist yet, we catch the error and show an empty feed.
      const { data, error: sbError } = await supabase
        .from('human_octave_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        if (sbError.code === '42P01') {
          // Table does not exist (expected during initial mock phase)
          setTracks([]);
        } else {
          throw sbError;
        }
      } else {
        setTracks(data || []);
      }
    } catch (err) {
      devWarn('Could not fetch tracks (mock mode):', err);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
    return () => stopStream();
  }, [fetchTracks]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    clearInterval(timerRef.current);
  };

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        
        if (audioPreviewRef.current) {
          audioPreviewRef.current.src = URL.createObjectURL(blob);
        }
        stopStream();
        setStage('preview');
      };

      recorder.start(1000);
      setStage('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);

    } catch {
      setError(t('octaveMicError'));
    }
  };

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const uploadRecording = async () => {
    if (!blobRef.current) return;
    setUploading(true);
    setError(null);

    try {
      const fileName = `track_${Date.now()}.webm`;
      
      // Upload to bucket
      const { data: _uploadData, error: uploadError } = await supabase.storage
        .from('human_octave_audio')
        .upload(fileName, blobRef.current, { contentType: 'audio/webm' });

      if (uploadError) {
        throw new Error('Failed to upload audio to bucket. Check Supabase RLS policies.');
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('human_octave_audio')
        .getPublicUrl(fileName);

      const audioUrl = publicUrlData.publicUrl;

      // Insert into table
      const { error: insertError } = await supabase
        .from('human_octave_tracks')
        .insert([{ audio_url: audioUrl }]);

      if (insertError) {
        throw new Error('Failed to insert track record into database.');
      }

      // Success
      setStage('browse');
      fetchTracks();
    } catch (err) {
      devWarn('Upload failed (this is expected if Supabase bucket/table is not fully set up):', err);
      // Mock success for demonstration
      alert('Mock Mode: Your track was recorded, but Supabase tables/buckets are not fully configured yet to save it. Set up "human_octave_audio" bucket and "human_octave_tracks" table.');
      setStage('browse');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-cf-void text-[#e8edf2] font-body flex flex-col">
      {/* Header */}
      <div className="flex items-center p-5 border-b border-white/[0.05]">
        <button onClick={() => navigate('/guitar/map')} className="w-10 h-10 rounded-xl bg-white/5 border-none text-cf-gold flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="m-0 font-heading text-[1.4rem] text-vv-text">{t('octaveTitle')}</h1>
          <p className="m-0 font-mono text-[0.65rem] text-cf-gold tracking-[0.1em] uppercase">{t('octaveSubtitle')}</p>
        </div>
        <button onClick={fetchTracks} className="w-10 h-10 rounded-xl bg-white/5 border-none text-cf-gold flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors" disabled={loading}>
          <RefreshCw size={18} className={loading ? 'opacity-50' : 'opacity-100'} />
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 py-3 px-5 text-[0.8rem] border-b border-red-500/20">{error}</div>}

      {/* Main Feed */}
      {stage === 'browse' && (
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 font-quote text-[1.2rem] gap-2">{t('octaveListening')}</div>
          ) : tracks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 font-quote text-[1.2rem] gap-2">
              <div className="text-[2rem]">🌌</div>
              <p>{t('octaveSilent')}</p>
              <p className="text-[0.7rem] opacity-50">{t('octavePushFirst')}</p>
            </div>
          ) : (
            tracks.map(track => (
              <div key={track.id} className="bg-white/[0.03] rounded-xl p-4 border-l-2 border-cf-gold">
                <audio controls src={track.audio_url} className="w-full h-10 outline-none" />
                <div className="font-mono text-[0.65rem] text-white/30 mt-3 text-right">
                  {new Date(track.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}

          {/* Floating Action Button */}
          <button className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-cf-gold text-cf-void border-none flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(var(--cf-gold-rgb),0.3)] hover:scale-105 transition-transform" onClick={() => setStage('recording')}>
            <Mic size={24} />
          </button>
        </div>
      )}

      {/* Recording Stage */}
      {stage === 'recording' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-cf-void p-5">
          <div className="w-full max-w-[400px] flex flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-[60px] bg-red-500/20 border-2 border-red-500 mb-[1.875rem] animate-pulse" />
            <div className="font-mono text-[2rem] text-red-500 mb-10">{formatTime(duration)} / {formatTime(MAX_DURATION)}</div>

            <div className="flex gap-5 items-center">
              <button className="w-[50px] h-[50px] rounded-[25px] bg-white/10 text-[#e8edf2] border-none flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => { stopStream(); setStage('browse'); }}>
                <X size={24} />
              </button>
              {duration === 0 ? (
                <button className="w-20 h-20 rounded-[40px] bg-red-500 text-white border-none flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(231,76,60,0.4)] hover:scale-105 transition-transform" onClick={startRecording}>
                  <Mic size={32} />
                </button>
              ) : (
                <button className="w-20 h-20 rounded-[40px] bg-red-500/20 text-red-500 border-2 border-red-500 flex items-center justify-center cursor-pointer hover:bg-red-500/30 transition-colors" onClick={stopRecording}>
                  <Square size={24} fill="currentColor" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Stage */}
      {stage === 'preview' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-cf-void p-5">
          <div className="w-full max-w-[400px] flex flex-col items-center">
            <h2 className="font-heading text-[#e8edf2]">{t('octavePreview')}</h2>

            <audio ref={audioPreviewRef} controls className="w-full mt-5 mb-10" />

            <div className="flex gap-5 items-center">
              <button className="w-[50px] h-[50px] rounded-[25px] bg-white/10 text-[#e8edf2] border-none flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setStage('recording')} disabled={uploading}>
                <RefreshCw size={24} />
              </button>
              <button className="py-0 px-6 h-[50px] rounded-[25px] bg-cf-gold text-cf-void border-none flex gap-2 items-center justify-center cursor-pointer font-body font-semibold hover:bg-cf-gold/90 transition-colors" onClick={uploadRecording} disabled={uploading}>
                {uploading ? t('octavePushing') : <><UploadCloud size={20} /> {t('octavePush')}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

