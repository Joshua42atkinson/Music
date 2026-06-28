import { devWarn } from '../lib/devLog';
import { useState, useCallback, useRef } from 'react';
import { devError } from '../lib/devLog';

// ═══════════════════════════════════════════════════════════════════
// useVoiceInput — Hands-free voice input for the Truebadour
// LAYER 2: VOIX — Voice Loop (STT → LLM → TTS)
//
// STT cascade:
//   1. Web Speech API Recognition (zero download, always available)
//   2. Whisper Base ONNX (~150 MB, future — higher accuracy)
//
// VAD: Silero VAD (2 MB, future — always-on wake word detection)
//
// Architecture: Student speaks → STT transcribes → LLM processes
//   → TTS speaks back. Full voice loop, hands-free.
// ═══════════════════════════════════════════════════════════════════

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(null);

  // Check availability on mount
  const supported = typeof window !== 'undefined' && (
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  const startListening = useCallback((onTranscript, locale = 'en') => {
    if (!supported) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = locale.startsWith('fr') ? 'fr-FR' : 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      if (onTranscriptRef.current) {
        onTranscriptRef.current(transcript, confidence);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Not an error — just silence
        setIsListening(false);
        return;
      }
      devWarn('[VoiceInput] Error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    onTranscriptRef.current = onTranscript;
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      devError('[VoiceInput] Start failed:', err);
      setError(err.message);
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    isAvailable: !!supported,
    error,
    startListening,
    stopListening,
  };
}
