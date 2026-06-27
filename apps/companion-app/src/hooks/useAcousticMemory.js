// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useAcousticMemory.js                                ║
// ║ WHAT    : A sliding-window memory of acoustic events (pitch)  ║
// ║ WHY     : To inject real-world context into the AI prompt     ║
// ║           (e.g., "Student just played C, then Eb")            ║
// ╚═══════════════════════════════════════════════════════════════╝
import { useState, useEffect, useRef } from 'react';
import usePitchDetector from './usePitchDetector';

export function useAcousticMemory(windowMs = 15000) {
  const [memory, setMemory] = useState([]);
  const pitchDetector = usePitchDetector();
  const lastNoteRef = useRef(null);

  // Expose the underlying detector methods
  const startListening = pitchDetector.startListening;
  const stopListening = pitchDetector.stopListening;
  const isListening = pitchDetector.isListening;

  useEffect(() => {
    if (!pitchDetector.noteInfo || pitchDetector.noteInfo.name === '--') return;

    const note = pitchDetector.noteInfo.name;
    const now = Date.now();

    // Only record if it's a new note or hasn't been played in 2 seconds
    if (lastNoteRef.current && lastNoteRef.current.note === note) {
      if (now - lastNoteRef.current.time < 2000) return;
    }

    const event = { note, time: now, cents: pitchDetector.noteInfo.cents };
    lastNoteRef.current = event;

    setMemory(prev => {
      const updated = [...prev, event];
      // Filter out events older than windowMs
      return updated.filter(e => now - e.time <= windowMs);
    });
  }, [pitchDetector.noteInfo, windowMs]);

  const clearMemory = () => setMemory([]);

  const getMemoryString = () => {
    if (memory.length === 0) return null;
    const notes = memory.map(m => m.note).join(', ');
    return `[Acoustic Sensor Memory (last ${Math.round(windowMs/1000)}s): Student played notes: ${notes}]`;
  };

  return {
    memory,
    getMemoryString,
    clearMemory,
    startListening,
    stopListening,
    isListening,
    pitchDetector
  };
}
