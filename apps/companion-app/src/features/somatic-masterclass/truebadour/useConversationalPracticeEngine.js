// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useConversationalPracticeEngine.js                 ║
// ║ WHAT    : STT ↔ TTS ↔ Pitch Detection Loop for Eyes-Free     ║
// ║           somatic guitar practice.                           ║
// ║ WHY     : The student must be able to put the device down    ║
// ║           and be guided entirely by voice and strings.       ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState, useEffect, useRef, useCallback } from 'react';
import usePitchDetector from '../../../hooks/usePitchDetector';
import { useTruebadour } from '../../../hooks/TruebadourProvider';

export function useConversationalPracticeEngine({ activeFretId }) {
  const [isEyesFree, setIsEyesFree] = useState(false);
  // States: 'IDLE', 'SPEAKING', 'LISTENING_PITCH', 'LISTENING_VOICE', 'PROCESSING'
  const [engineState, setEngineState] = useState('IDLE');
  
  const pitchDetector = usePitchDetector();
  const { ai, kokoro, voiceInput, voicePrefs } = useTruebadour();
  
  const currentGoalRef = useRef(null);
  
  // Clean up on unmount or disable
  useEffect(() => {
    if (!isEyesFree) {
      if (pitchDetector.isListening) pitchDetector.stopListening();
      if (voiceInput.isListening) voiceInput.stopListening();
      setEngineState('IDLE');
    }
  }, [isEyesFree]);

  const speak = useCallback(async (text) => {
    setEngineState('SPEAKING');
    if (pitchDetector.isListening) pitchDetector.stopListening();
    if (voiceInput.isListening) voiceInput.stopListening();

    if (kokoro.isReady) {
      await kokoro.speak(text, {
        voice: voicePrefs?.voiceId || 'af_bella',
        speed: voicePrefs?.speed || 1.0,
      });
    } else {
      // Web Speech fallback — returns a promise that resolves when speech ends
      await new Promise((resolve) => {
        if (!window.speechSynthesis) { resolve(); return; }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        window.speechSynthesis.speak(utterance);
      });
    }
  }, [kokoro, pitchDetector, voiceInput, voicePrefs]);

  const triggerNextStep = useCallback(async () => {
    if (!isEyesFree) return;
    
    // Simple mock logic for the loop
    if (engineState === 'IDLE') {
      await speak(`Let's begin Chapter ${activeFretId}. Please play the root note, C.`);
      setEngineState('LISTENING_PITCH');
      pitchDetector.startListening();
      currentGoalRef.current = 'C';
    }
  }, [activeFretId, engineState, isEyesFree, pitchDetector, speak]);

  // Monitor pitch
  useEffect(() => {
    if (engineState === 'LISTENING_PITCH' && pitchDetector.noteInfo?.name && pitchDetector.noteInfo.name !== '--') {
      const played = pitchDetector.noteInfo.name;
      // Debounce and check
      if (played === currentGoalRef.current) {
        pitchDetector.stopListening();
        setEngineState('PROCESSING');
        speak(`Beautiful. You found the ${played}. Now, breathe deeply. When you are ready, ask me for the next step.`).then(() => {
           setEngineState('LISTENING_VOICE');
           voiceInput.startListening((transcript) => {
             voiceInput.stopListening();
             setEngineState('PROCESSING');
             speak(`You said: ${transcript}. I am still learning this capability, but you are doing great.`);
             setEngineState('IDLE');
           }, 'en');
        });
      }
    }
  }, [engineState, pitchDetector.noteInfo, pitchDetector, speak, voiceInput]);

  const toggleEyesFree = useCallback(() => {
    setIsEyesFree(prev => !prev);
  }, []);

  // Auto-start loop when activated
  useEffect(() => {
    if (isEyesFree && engineState === 'IDLE') {
      triggerNextStep();
    }
  }, [isEyesFree, engineState, triggerNextStep]);

  return {
    isEyesFree,
    engineState,
    toggleEyesFree,
    pitchDetected: pitchDetector.noteInfo,
  };
}
