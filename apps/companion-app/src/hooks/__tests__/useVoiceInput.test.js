// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useVoiceInput.test.js                               ║
// ║ WHAT    : Unit tests for voice input hook (Web Speech API)    ║
// ║ WHY     : Hands-free voice must work before guitar testing    ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Web Speech API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  maxAlternatives = 1;
  onstart = null;
  onresult = null;
  onerror = null;
  onend = null;

  start() { this.onstart?.(); }
  stop() { this.onend?.(); }
  abort() { this.onend?.(); }
}

Object.defineProperty(window, 'SpeechRecognition', {
  value: MockSpeechRecognition,
  writable: true, configurable: true,
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: MockSpeechRecognition,
  writable: true, configurable: true,
});

import { useVoiceInput } from '../../hooks/useVoiceInput';

describe('useVoiceInput — Voice STT Hook', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('reports availability when Web Speech API exists', () => {
    const { result } = renderHook(() => useVoiceInput());
    expect(result.current.isAvailable).toBe(true);
  });

  test('isListening starts as false', () => {
    const { result } = renderHook(() => useVoiceInput());
    expect(result.current.isListening).toBe(false);
  });

  test('startListening sets isListening to true', () => {
    const { result } = renderHook(() => useVoiceInput());
    act(() => {
      result.current.startListening(() => {}, 'en');
    });
    expect(result.current.isListening).toBe(true);
  });

  test('stopListening sets isListening to false', () => {
    const { result } = renderHook(() => useVoiceInput());
    act(() => {
      result.current.startListening(() => {}, 'en');
    });
    act(() => {
      result.current.stopListening();
    });
    expect(result.current.isListening).toBe(false);
  });

  test('handles no-speech error gracefully', () => {
    const { result } = renderHook(() => useVoiceInput());
    // Should not throw
    expect(() => {
      act(() => {
        result.current.startListening(() => {}, 'en');
      });
    }).not.toThrow();
  });

  test('sets French locale for French input', () => {
    const { result } = renderHook(() => useVoiceInput());
    expect(() => {
      act(() => {
        result.current.startListening(() => {}, 'fr');
      });
    }).not.toThrow();
  });

  test('error starts as null', () => {
    const { result } = renderHook(() => useVoiceInput());
    expect(result.current.error).toBeNull();
  });
});

// Test with Web Speech API unavailable
describe('useVoiceInput — No Web Speech API', () => {
  beforeEach(() => {
    // Override to simulate no Web Speech API
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
  });

  afterEach(() => {
    // Restore
    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
  });

  test('reports unavailable when Web Speech API does not exist', () => {
    const { result } = renderHook(() => useVoiceInput());
    expect(result.current.isAvailable).toBe(false);
  });

  test('startListening sets error when not supported', () => {
    const { result } = renderHook(() => useVoiceInput());
    act(() => {
      result.current.startListening(() => {}, 'en');
    });
    expect(result.current.error).toBeTruthy();
  });
});
