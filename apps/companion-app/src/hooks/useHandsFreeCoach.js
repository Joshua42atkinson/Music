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
import { devError } from '../lib/devLog';

const SPEECH_THRESHOLD = 0.03;
const SILENCE_THRESHOLD = 0.015;
const SILENCE_TIMEOUT_MS = 1500;

const COMMANDS = {
  next: ['next', 'suivant', 'avancer', 'forward'],
  previous: ['previous', 'back', 'précédent', 'reculer'],
  repeat: ['repeat', 'again', 'répète', 'recommence', 'replay'],
  slower: ['slower', 'slow', 'lentement', 'ralenti', 'ralentir'],
  faster: ['faster', 'fast', 'speed', 'vite', 'accélère'],
  play: ['play', 'start', 'jouer', 'démarrer', 'listen'],
  help: ['help', 'aide', 'commands', 'commandes'],
  stop: ['stop', 'pause', 'arrête', 'quit', 'exit', 'quitter'],
};

const RESPONSES = {
  next: { en: 'Next.', fr: 'Suivant.' },
  previous: { en: 'Previous.', fr: 'Précédent.' },
  repeat: { en: 'Repeating.', fr: 'Je répète.' },
  slower: { en: 'Slower.', fr: 'Plus lentement.' },
  faster: { en: 'Faster.', fr: 'Plus vite.' },
  play: { en: 'Listening for your guitar.', fr: 'J\'écoute votre guitare.' },
  help: { en: 'Say next, repeat, slower, faster, play, or stop.', fr: 'Dites suivant, répète, lentement, vite, jouer, ou arrête.' },
  stop: { en: 'Hands-free mode stopped.', fr: 'Mode mains libres arrêté.' },
  unknown: { en: 'I did not understand. Say help for commands.', fr: 'Je n\'ai pas compris. Dites aide pour les commandes.' },
};

export function useHandsFreeCoach({ handlers = {}, locale = 'en' } = {}) {
  const [isActive, setIsActive] = useState(false);
  const [state, setState] = useState('idle'); // idle | listening | processing | speaking | error
  const [lastCommand, setLastCommand] = useState(null);
  const [error, setError] = useState(null);

  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceStartRef = useRef(null);
  const isSpeechDetectedRef = useRef(false);
  const stateRef = useRef('idle');
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const updateState = useCallback((newState) => {
    stateRef.current = newState;
    setState(newState);
  }, []);

  const speak = useCallback((action) => {
    if (!window.speechSynthesis) return;
    const text = RESPONSES[action]?.[locale] || RESPONSES[action]?.en;
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;
    utterance.onstart = () => updateState('speaking');
    utterance.onend = () => updateState('idle');
    utterance.onerror = () => updateState('idle');
    window.speechSynthesis.speak(utterance);
  }, [locale, updateState]);

  const processCommand = useCallback((transcript) => {
    updateState('processing');
    const lower = transcript.toLowerCase().trim();
    setLastCommand(lower);

    let matched = false;
    for (const [action, triggers] of Object.entries(COMMANDS)) {
      if (triggers.some((t) => lower.includes(t))) {
        const handler = handlersRef.current[action];
        if (handler) handler();
        if (action === 'stop') {
          // Stop the hands-free loop itself after responding
          setTimeout(() => stopRef.current(), 1200);
        }
        speak(action);
        matched = true;
        break;
      }
    }

    if (!matched) {
      speak('unknown');
    }
  }, [locale, speak, updateState]);

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

    recognition.onstart = () => updateState('listening');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        updateState('idle');
      } else {
        setError(event.error);
        updateState('error');
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (stateRef.current === 'listening') {
        updateState('idle');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      devError('[useHandsFreeCoach] Recognition start failed:', err);
      updateState('idle');
    }
  }, [locale, processCommand, updateState]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const stopRef = useRef(() => {});

  const vadTick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser || !stateRef.current) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    let rmsSum = 0;
    for (let i = 0; i < buffer.length; i++) rmsSum += buffer[i] * buffer[i];
    const rms = Math.sqrt(rmsSum / buffer.length);

    if (rms > SPEECH_THRESHOLD) {
      silenceStartRef.current = null;
      if (!isSpeechDetectedRef.current && stateRef.current === 'idle') {
        isSpeechDetectedRef.current = true;
        startRecognition();
      }
    } else if (rms < SILENCE_THRESHOLD) {
      if (!silenceStartRef.current) silenceStartRef.current = performance.now();
      const silenceDuration = performance.now() - silenceStartRef.current;
      if (isSpeechDetectedRef.current && silenceDuration > SILENCE_TIMEOUT_MS) {
        isSpeechDetectedRef.current = false;
        stopRecognition();
      }
    }

    rafIdRef.current = requestAnimationFrame(vadTick);
  }, [startRecognition, stopRecognition]);

  const start = useCallback(async () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }

      const micData = await initMicrophone();
      if (!micData) {
        throw new Error('Microphone access was denied or failed.');
      }

      analyserRef.current = micData.analyser;
      setIsActive(true);
      setError(null);
      updateState('idle');
      isSpeechDetectedRef.current = false;
      silenceStartRef.current = null;
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
    lastCommand,
    error,
    start,
    stop,
  };
}
