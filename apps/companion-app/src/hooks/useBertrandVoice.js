import { useState, useCallback } from 'react';
import { useStudioAudio } from './useStudioAudio';
import { devError } from '../lib/devLog';

const PIPER_SERVER = import.meta.env.VITE_PIPER_API_URL || 'http://localhost:8001';

export function useBertrandVoice() {
  const [isReady, setIsReady] = useState(true); // Assuming the server is always ready for now
  const [isLoading] = useState(false);
  const { playStudioAudio, stopStudioAudio } = useStudioAudio();

  const initTTS = useCallback(async () => {
    setIsReady(true);
  }, []);

  const speak = useCallback(async (text, _locale = 'en') => {
    try {
      const res = await fetch(`${PIPER_SERVER}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15000), // 15s max for generation
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      // Server returns WAV audio
      const audioBuffer = await res.arrayBuffer();
      const audioData = new Float32Array(audioBuffer.byteLength / 4);

      // Parse WAV: skip 44-byte header, read PCM data
      const dataView = new DataView(audioBuffer);
      const headerSize = 44;
      for (let i = 0; i < audioData.length && (headerSize + i * 2) < audioBuffer.byteLength; i++) {
        // 16-bit PCM to float
        audioData[i] = dataView.getInt16(headerSize + i * 2, true) / 32768;
      }

      // Get sample rate from WAV header (bytes 24-27)
      const sampleRate = dataView.getUint32(24, true);

      return playStudioAudio(audioData, sampleRate);
    } catch (err) {
      devError('[BertrandVoice] Server speak failed:', err);
      return false;
    }
  }, [playStudioAudio]);

  const generateBlob = useCallback(async (text, _locale = 'en') => {
    try {
      const res = await fetch(`${PIPER_SERVER}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      // Return Blob directly — caller must manage URL lifecycle
      return await res.blob();
    } catch (err) {
      devError('[BertrandVoice] Server generateBlob failed:', err);
      return null;
    }
  }, []);

  const cancel = useCallback(() => {
    stopStudioAudio();
  }, [stopStudioAudio]);

  return { isReady, isLoading, initTTS, speak, generateBlob, cancel, loadProgress: 100 };
}
