import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useVoiceNav.js                                       ║
// ║ WHAT    : Hands-free voice navigation hook (STT + TTS)         ║
// ║ WHY     : Student props phone, holds guitar, navigates by voice║
// ║ WHO     : All students (free tier, Web Speech API is built-in)  ║
// ║ OWNS    : Speech recognition, command dispatch, TTS readback   ║
// ║ NEEDS   : Web Speech API (SpeechRecognition + speechSynthesis) ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
import { useState, useCallback, useRef, useEffect } from 'react';

// Commands mapped to action keys
// The hook consumer provides handlers via the `commands` prop
const DEFAULT_COMMANDS = {
  next: ['next', 'forward', 'suivant', 'avancer'],
  previous: ['previous', 'back', 'précédent', 'reculer'],
  play: ['play', 'start', 'jouer', 'démarrer'],
  stop: ['stop', 'pause', 'arrêter'],
  record: ['record', 'enregistrer'],
  ask: ['ask', 'question', 'demander', 'question'],
  menu: ['menu', 'hub', 'accueil'],
  practice: ['practice', 'pratiquer'],
  read: ['read', 'lire'],
  help: ['help', 'aide'],
  close: ['close', 'fermer'],
};

/**
 * Hook for hands-free voice navigation.
 * Uses Web Speech API (SpeechRecognition for STT, speechSynthesis for TTS).
 * Both are built into modern browsers — no downloads needed.
 *
 * @param {Object} options
 * @param {Object} options.handlers - Map of action → callback (e.g. { next: () => navigate(...) })
 * @param {string} options.locale - 'en' or 'fr' for recognition language
 * @param {boolean} options.enabled - Whether voice nav is active
 * @returns {Object} { isListening, toggleListening, speak, stopSpeaking, lastCommand, supported }
 */
export function useVoiceNav({ handlers = {}, locale = 'en', enabled = true } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const handlersRef = useRef(handlers);
  const shouldListenRef = useRef(false);

  // Update handlers ref without re-creating recognition
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last.isFinal) return;

      const transcript = last[0].transcript.trim().toLowerCase();
      setLastCommand(transcript);

      // Match against commands
      for (const [action, triggers] of Object.entries(DEFAULT_COMMANDS)) {
        if (triggers.some(trigger => transcript.includes(trigger))) {
          const handler = handlersRef.current[action];
          if (handler) {
            handler();
          }
          break;
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      devWarn('[useVoiceNav] Recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        shouldListenRef.current = false;
      }
    };

    recognition.onend = () => {
      // Auto-restart if still in listening mode (continuous mode)
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          // start() throws if already started — ignore
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      try { recognition.stop(); } catch { /* ignore */ }
    };
  }, [locale]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current || !supported) return;

    if (isListening) {
      shouldListenRef.current = false;
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      setIsListening(false);
    } else {
      shouldListenRef.current = true;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // start() throws if already started
      }
    }
  }, [isListening, supported]);

  const speak = useCallback((text) => {
    if (!text?.trim()) return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v =>
      locale === 'fr'
        ? v.lang.toLowerCase().includes('fr')
        : v.lang.toLowerCase().includes('en')
    );
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }, [locale]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Update recognition language when locale changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    }
  }, [locale]);

  // Respect enabled flag
  useEffect(() => {
    if (!enabled && isListening) {
      shouldListenRef.current = false;
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
      setIsListening(false);
    }
  }, [enabled, isListening]);

  return {
    isListening,
    toggleListening,
    speak,
    stopSpeaking,
    lastCommand,
    supported,
    commands: DEFAULT_COMMANDS,
  };
}
