// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useAudioQueue.js                                     ║
// ║ WHAT    : Non-overlapping speech queue for TTS playback        ║
// ║ WHY     : Prevents multiple utterances from talking over each  ║
// ║           other; drains safely on failure                      ║
// ║ WHO     : useTruebadourAI (or any TTS consumer)                ║
// ║ OWNS    : audioQueueRef, isSpeakingRef, processAudioQueue    ║
// ║ NEEDS   : speakImpl(text, locale) => Promise<boolean>          ║
// ║ RULES   : If speakImpl returns false, drain queue to avoid spam ║
// ╚════════════════════════════════════════════════════════════════╝
import { useCallback, useRef } from 'react';

export function useAudioQueue(speakImpl) {
  const audioQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  const processAudioQueue = useCallback(async () => {
    if (isSpeakingRef.current || audioQueueRef.current.length === 0) return;
    isSpeakingRef.current = true;

    while (audioQueueRef.current.length > 0) {
      const { text, locale } = audioQueueRef.current[0];
      const spoke = await speakImpl(text, locale);
      audioQueueRef.current.shift();
      if (!spoke) break; // If TTS fails, drain queue to avoid spam
    }

    isSpeakingRef.current = false;
  }, [speakImpl]);

  const speakText = useCallback(async (text, locale = 'en') => {
    audioQueueRef.current.push({ text, locale });
    if (!isSpeakingRef.current) {
      await processAudioQueue();
    }
  }, [processAudioQueue]);

  const clearQueue = useCallback(() => {
    audioQueueRef.current = [];
    isSpeakingRef.current = false;
  }, []);

  return { speakText, clearQueue, isSpeakingRef };
}
