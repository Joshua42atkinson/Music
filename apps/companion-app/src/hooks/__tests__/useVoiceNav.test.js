// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useVoiceNav.test.js                                  ║
// ║ WHAT    : Unit tests for voice navigation hook                 ║
// ║ WHY     : Hands-free nav must match commands in EN + FR       ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Web Speech API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onstart = null;
  onresult = null;
  onerror = null;
  onend = null;
  _started = false;

  start() {
    if (this._started) throw new Error('Already started');
    this._started = true;
  }
  stop() {
    this._started = false;
    if (this.onend) this.onend();
  }
  abort() {
    this._started = false;
    if (this.onend) this.onend();
  }
}

Object.defineProperty(window, 'SpeechRecognition', {
  value: MockSpeechRecognition,
  writable: true, configurable: true,
});
Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: MockSpeechRecognition,
  writable: true, configurable: true,
});

// Mock speechSynthesis
window.speechSynthesis = {
  cancel: vi.fn(),
  speak: vi.fn(),
  getVoices: vi.fn(() => []),
};

class MockUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.rate = 1;
    this.pitch = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
  }
}
global.SpeechSynthesisUtterance = MockUtterance;

import { useVoiceNav } from '../../hooks/useVoiceNav';

describe('useVoiceNav — Voice Navigation Hook', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('reports supported when Web Speech API exists', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    expect(result.current.supported).toBe(true);
  });

  test('isListening starts as false', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    expect(result.current.isListening).toBe(false);
  });

  test('toggleListening starts recognition', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    act(() => {
      result.current.toggleListening();
    });
    expect(result.current.isListening).toBe(true);
  });

  test('toggleListening stops when already listening', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    act(() => { result.current.toggleListening(); });
    act(() => { result.current.toggleListening(); });
    expect(result.current.isListening).toBe(false);
  });

  test('speak calls speechSynthesis', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    act(() => {
      result.current.speak('Hello world');
    });
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  test('stopSpeaking cancels speechSynthesis', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    act(() => {
      result.current.stopSpeaking();
    });
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  test('commands object includes expected actions', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    expect(result.current.commands).toHaveProperty('next');
    expect(result.current.commands).toHaveProperty('previous');
    expect(result.current.commands).toHaveProperty('play');
    expect(result.current.commands).toHaveProperty('stop');
    expect(result.current.commands).toHaveProperty('record');
    expect(result.current.commands).toHaveProperty('ask');
    expect(result.current.commands).toHaveProperty('menu');
    expect(result.current.commands).toHaveProperty('practice');
  });

  test('commands include French triggers', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    expect(result.current.commands.next).toContain('suivant');
    expect(result.current.commands.previous).toContain('précédent');
    expect(result.current.commands.play).toContain('jouer');
    expect(result.current.commands.stop).toContain('arrêter');
  });
});

describe('useVoiceNav — No Web Speech API', () => {
  beforeEach(() => {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
  });
  afterEach(() => {
    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
  });

  test('reports unsupported when Web Speech API does not exist', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    expect(result.current.supported).toBe(false);
  });

  test('toggleListening does nothing when unsupported', () => {
    const { result } = renderHook(() => useVoiceNav({ handlers: {} }));
    act(() => {
      result.current.toggleListening();
    });
    expect(result.current.isListening).toBe(false);
  });
});
