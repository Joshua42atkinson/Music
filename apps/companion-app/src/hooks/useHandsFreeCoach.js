// ═══════════════════════════════════════════════════════════════════
// useHandsFreeCoach — Hands-free voice coach for the C Scale journey
//
// Continuously listens for voice commands using a simple VAD + STT loop.
// When the student speaks, the microphone stream wakes up STT, transcribes
// the command, executes the handler, and speaks a TTS response.
//
// Phase 1 implementation: energy-based VAD + Web Speech API STT/TTS.
// Future phases: Silero VAD, Whisper ONNX, guitar-aware gating.
// ═══════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { getAudioContext, initMicrophone, closeMicrophone } from '../audio/audioEngine';
import { devError, devLog } from '../lib/devLog';

const SPEECH_THRESHOLD = 0.03;
const SILENCE_THRESHOLD = 0.015;
const SILENCE_TIMEOUT_MS = 1500;
const RECOGNITION_TIMEOUT_MS = 8000;
const AWAKE_TIMEOUT_MS = 15000; // Stay awake for 15s after last interaction

const WAKE_WORDS = ['coach', 'truebadour', 'ok truebadour', 'hey coach', 'ok google', 'siri'];

const COMMANDS = {
  next: ['next', 'suivant', 'avancer', 'forward'],
  previous: ['previous', 'back', 'précédent', 'reculer'],
  repeat: ['repeat', 'again', 'répète', 'recommence', 'replay'],
  read: ['read', 'listen to', 'lire', 'écouter le'],
  ask: ['ask', 'question', 'demander', 'mentor', 'truebadour', 'help me'],
  practice: ['practice', 'pratiquer', 'mode pratique'],
  close: ['close', 'exit practice', 'fermer', 'quitter pratique'],
  play: ['play', 'start', 'jouer', 'démarrer'],
  stop: ['stop', 'pause', 'arrête', 'quit', 'exit', 'quitter'],
  record: ['record', 'enregistrer'],
  menu: ['menu', 'home', 'dashboard', 'accueil', 'tableau de bord'],
  where: ['where', 'what chapter', 'status', 'où', 'quel chapitre', 'statut'],
  resonance: ['resonance', 'drone', 'résonance', 'bourdon'],
  complete: ['complete', 'done', 'finished', 'terminé', 'fini'],
  slower: ['slower', 'slow', 'lentement', 'ralenti', 'ralentir'],
  faster: ['faster', 'fast', 'speed', 'vite', 'accélère'],
  help: ['help', 'aide', 'commands', 'commandes'],
};

const RESPONSES = {
  next: { en: 'Next.', fr: 'Suivant.' },
  previous: { en: 'Previous.', fr: 'Précédent.' },
  repeat: { en: 'Repeating.', fr: 'Je répète.' },
  read: { en: 'Reading.', fr: 'Lecture.' },
  ask: { en: 'Summoning the Truebadour.', fr: 'J\'invoque le Truebadour.' },
  practice: { en: 'Entering practice mode.', fr: 'Mode pratique.' },
  close: { en: 'Exiting practice mode.', fr: 'Sortie du mode pratique.' },
  play: { en: 'Listening for your guitar.', fr: 'J\'écoute votre guitare.' },
  stop: { en: 'Stopped.', fr: 'Arrêté.' },
  record: { en: 'Recording.', fr: 'Enregistrement.' },
  menu: { en: 'Going to dashboard.', fr: 'Retour au tableau de bord.' },
  where: { en: 'You are on', fr: 'Vous êtes sur' },
  resonance: { en: 'Toggling resonance.', fr: 'Bourdon activé.' },
  complete: { en: 'Chapter complete.', fr: 'Chapitre terminé.' },
  slower: { en: 'Slower.', fr: 'Plus lentement.' },
  faster: { en: 'Faster.', fr: 'Plus vite.' },
  help: { en: 'Say next, previous, read, practice, play, ask, where, or stop.', fr: 'Dites suivant, précédent, lire, pratiquer, jouer, demander, où, ou arrête.' },
  stop_coach: { en: 'Hands-free mode stopped.', fr: 'Mode mains libres arrêté.' },
  unknown: { en: 'I did not understand. Say help for commands.', fr: 'Je n\'ai pas compris. Dites aide pour les commandes.' },
};

export function useHandsFreeCoach({ handlers = {}, locale = 'en', ttsSpeak = null, onUnhandledTranscript = null } = {}) {
  const [isActive, setIsActive] = useState(false);
  const [state, setState] = useState('idle'); // idle | listening | processing | speaking | error
  const [isAwake, setIsAwake] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [error, setError] = useState(null);

  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceStartRef = useRef(null);
  const isSpeechDetectedRef = useRef(false);
  const stateRef = useRef('idle');
  const isAwakeRef = useRef(false);
  const awakeTimeoutRef = useRef(null);
  const handlersRef = useRef(handlers);
  const onUnhandledRef = useRef(onUnhandledTranscript);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    onUnhandledRef.current = onUnhandledTranscript;
  }, [onUnhandledTranscript]);

  const updateAwakeState = useCallback((awakeStatus) => {
    isAwakeRef.current = awakeStatus;
    setIsAwake(awakeStatus);
    if (awakeTimeoutRef.current) {
      clearTimeout(awakeTimeoutRef.current);
      awakeTimeoutRef.current = null;
    }
    if (awakeStatus) {
      // automatically go back to sleep after AWAKE_TIMEOUT_MS of inactivity
      awakeTimeoutRef.current = setTimeout(() => {
        isAwakeRef.current = false;
        setIsAwake(false);
        devLog('[useHandsFreeCoach] Went back to sleep');
      }, AWAKE_TIMEOUT_MS);
    }
  }, []);

  const updateState = useCallback((newState) => {
    stateRef.current = newState;
    setState(newState);
  }, []);

  const speak = useCallback(async (action) => {
    const text = RESPONSES[action]?.[locale] || RESPONSES[action]?.en;
    if (!text) return;

    if (ttsSpeak) {
      updateState('speaking');
      try {
        await ttsSpeak(text);
      } catch (err) {
        devError('[useHandsFreeCoach] ttsSpeak error:', err);
      } finally {
        if (stateRef.current === 'speaking') {
          updateState('idle');
        }
      }
    } else {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      utterance.onstart = () => updateState('speaking');
      utterance.onend = () => updateState('idle');
      utterance.onerror = () => updateState('idle');
      window.speechSynthesis.speak(utterance);
    }
  }, [locale, updateState, ttsSpeak]);

  const speakCustom = useCallback(async (text) => {
    if (!text) return;
    if (ttsSpeak) {
      updateState('speaking');
      try {
        await ttsSpeak(text);
      } catch (err) {
        devError('[useHandsFreeCoach] ttsSpeak error:', err);
      } finally {
        if (stateRef.current === 'speaking') {
          updateState('idle');
        }
      }
    } else {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      utterance.onstart = () => updateState('speaking');
      utterance.onend = () => updateState('idle');
      utterance.onerror = () => updateState('idle');
      window.speechSynthesis.speak(utterance);
    }
  }, [locale, updateState, ttsSpeak]);

  const processCommand = useCallback((transcript) => {
    updateState('processing');
    const lower = transcript.toLowerCase().trim();
    setLastCommand(lower);
    
    // Check for Wake Word
    const containsWakeWord = WAKE_WORDS.some(w => lower.includes(w));
    if (containsWakeWord) {
      updateAwakeState(true);
      // Remove wake word from transcript to process the rest
      let cleanTranscript = lower;
      WAKE_WORDS.forEach(w => {
        cleanTranscript = cleanTranscript.replace(w, '').trim();
      });
      if (!cleanTranscript) {
        // Just the wake word, say Yes?
        speak('play'); // Using 'play' response ("Listening...") as acknowledgment
        return;
      }
    }

    if (!isAwakeRef.current && !containsWakeWord) {
      devLog('[useHandsFreeCoach] Asleep, ignoring:', transcript);
      updateState('idle');
      return;
    }

    // Refresh awake timeout
    updateAwakeState(true);

    let matched = false;
    for (const [action, triggers] of Object.entries(COMMANDS)) {
      if (triggers.some((t) => lower.includes(t))) {
        const handler = handlersRef.current[action];
        if (handler) handler();
        if (action === 'stop' && (lower.includes('quit') || lower.includes('exit') || lower.includes('quitter'))) {
          // "quit" / "exit" stops the hands-free loop itself
          speak('stop_coach');
          setTimeout(() => stopRef.current(), 1200);
        } else {
          speak(action);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      const aiHandler = onUnhandledRef.current;
      if (aiHandler) {
        devLog('[useHandsFreeCoach] No keyword match — piping to AI:', transcript);
        // Clean transcript from wake words before passing to AI
        let cleanTranscript = transcript.toLowerCase();
        WAKE_WORDS.forEach(w => {
          cleanTranscript = cleanTranscript.replace(w, '').trim();
        });
        
        // Wrap in async IIFE so we don't block the synchronous processCommand
        (async () => {
          try {
            const aiResponse = await aiHandler(cleanTranscript || transcript);
            if (aiResponse) {
              speakCustom(aiResponse);
            } else {
              updateState('idle');
            }
          } catch (e) {
            devError('[useHandsFreeCoach] AI Handler error:', e);
            speak('error');
            updateState('idle');
          }
        })();
      } else {
        speak('unknown');
        updateState('idle');
      }
    }
  }, [locale, speak, speakCustom, updateState, updateAwakeState]);

  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      updateState('error');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    recognition.maxAlternatives = 1;

    let timeoutId = null;

    recognition.onstart = () => {
      devLog('[useHandsFreeCoach] Recognition started');
      updateState('listening');
      // Safety timeout: if no result in 8s, abort and return to idle
      timeoutId = setTimeout(() => {
        devLog('[useHandsFreeCoach] Recognition timeout — no speech detected');
        try { recognition.stop(); } catch { /* ignore */ }
      }, RECOGNITION_TIMEOUT_MS);
    };

    recognition.onresult = (event) => {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      const transcript = event.results[0][0].transcript;
      devLog('[useHandsFreeCoach] Heard:', transcript);
      processCommand(transcript);
    };

    recognition.onerror = (event) => {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      devError('[useHandsFreeCoach] Recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted') {
        updateState('idle');
      } else {
        setError(event.error);
        updateState('error');
      }
    };

    recognition.onend = () => {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      recognitionRef.current = null;
      devLog('[useHandsFreeCoach] Recognition ended, state:', stateRef.current);
      if (stateRef.current === 'listening') {
        updateState('idle');
      }
    };

    recognitionRef.current = recognition;
    try {
      devLog('[useHandsFreeCoach] Starting recognition...');
      recognition.start();
    } catch (err) {
      devError('[useHandsFreeCoach] Recognition start failed:', err);
      recognitionRef.current = null;
      updateState('idle');
    }
  }, [locale, processCommand, updateState]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const stopRef = useRef(() => {});

  // Use refs for callbacks so vadTick never goes stale
  const startRecognitionRef = useRef(startRecognition);
  const stopRecognitionRef = useRef(stopRecognition);
  useEffect(() => { startRecognitionRef.current = startRecognition; }, [startRecognition]);
  useEffect(() => { stopRecognitionRef.current = stopRecognition; }, [stopRecognition]);

  const vadTick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser || !stateRef.current) return;

    // Do NOT halt VAD during speaking anymore (Interruptible Architecture)
    if (stateRef.current === 'processing') {
      rafIdRef.current = requestAnimationFrame(vadTick);
      return;
    }

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    let rmsSum = 0;
    for (let i = 0; i < buffer.length; i++) rmsSum += buffer[i] * buffer[i];
    const rms = Math.sqrt(rmsSum / buffer.length);

    if (rms > SPEECH_THRESHOLD) {
      silenceStartRef.current = null;
      
      // Interrupt TTS if speaking
      if (stateRef.current === 'speaking') {
        devLog('[useHandsFreeCoach] Interrupted AI speech!');
        window.speechSynthesis?.cancel();
        // Also dispatch event in case native audio is playing
        window.dispatchEvent(new CustomEvent('voixvive:ai_interrupt'));
        updateState('idle');
      }

      if (!isSpeechDetectedRef.current && stateRef.current === 'idle') {
        isSpeechDetectedRef.current = true;
        devLog('[useHandsFreeCoach] Speech detected (RMS:', rms.toFixed(3), ') — starting recognition');
        startRecognitionRef.current();
      }
    } else if (rms < SILENCE_THRESHOLD) {
      if (!silenceStartRef.current) silenceStartRef.current = performance.now();
      const silenceDuration = performance.now() - silenceStartRef.current;
      if (isSpeechDetectedRef.current && silenceDuration > SILENCE_TIMEOUT_MS) {
        isSpeechDetectedRef.current = false;
        stopRecognitionRef.current();
      }
    }

    rafIdRef.current = requestAnimationFrame(vadTick);
  }, []);

  const start = useCallback(async () => {
    try {
      devLog('[useHandsFreeCoach] Starting hands-free mode...');
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Initialize with echo cancellation for conversational loop
      const micData = await initMicrophone({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      });
      if (!micData) {
        throw new Error('Microphone access was denied or failed.');
      }

      analyserRef.current = micData.analyser;
      setIsActive(true);
      setError(null);
      updateState('idle');
      isSpeechDetectedRef.current = false;
      silenceStartRef.current = null;
      devLog('[useHandsFreeCoach] Mic initialized, VAD loop starting');
      rafIdRef.current = requestAnimationFrame(vadTick);
    } catch (err) {
      devError('[useHandsFreeCoach] Start failed:', err);
      setError(err.message);
      updateState('error');
    }
  }, [vadTick, updateState]);

  const stop = useCallback(() => {
    setIsActive(false);
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
    stopRecognition();
    window.speechSynthesis?.cancel();
    closeMicrophone();
    analyserRef.current = null;
    isSpeechDetectedRef.current = false;
    silenceStartRef.current = null;
    updateState('idle');
  }, [stopRecognition, updateState]);

  stopRef.current = stop;

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    isActive,
    state,
    isAwake,
    lastCommand,
    error,
    start,
    stop,
  };
}
