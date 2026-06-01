// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useTroubadourAI.test.js                             ║
// ║ WHAT    : Unit tests for the unified AI orchestration hook   ║
// ║ WHY     : The three-layer cascade must fail over correctly   ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock fetch for backend detection
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock speechSynthesis
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn(() => [
  { lang: 'en-US', name: 'English Voice' },
  { lang: 'fr-FR', name: 'French Voice' },
]);

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: (utterance) => {
      mockSpeak(utterance);
      // Trigger onend asynchronously to simulate real speech
      setTimeout(() => utterance.onend?.(), 10);
    },
    cancel: mockCancel,
    getVoices: mockGetVoices,
  },
  writable: true, configurable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: class MockUtterance {
    constructor(text) { this.text = text; }
    voice = null; rate = 1; pitch = 1;
    onend = null;
    onerror = null;
  },
  writable: true, configurable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });

import { useTroubadourAI } from '../../hooks/useTroubadourAI';

describe('useTroubadourAI — Three-Layer Cascade', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mockFetch.mockReset();
  });

  describe('TTS Cascade — speakText', () => {
    test('falls back to Web Speech API when no neural TTS loaded', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      await act(async () => { await result.current.speakText('Test message', 'en'); });
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });

    test('uses French voice for French locale', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      await act(async () => { await result.current.speakText('Bonjour', 'fr'); });
      expect(mockSpeak).toHaveBeenCalled();
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice?.lang).toBe('fr-FR');
    });

    test('tries Kokoro TTS before Web Speech if kokoroRef is wired', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      const mockKokoroSpeak = vi.fn().mockResolvedValue(true);
      await act(async () => {
        result.current.kokoroRef.current = { isReady: true, speak: mockKokoroSpeak };
        await result.current.speakText('Test neural TTS', 'en');
      });
      expect(mockKokoroSpeak).toHaveBeenCalledWith('Test neural TTS', 'en');
      expect(mockSpeak).not.toHaveBeenCalled();
    });

    test('tries Qwen3-TTS before Kokoro if qwenRef is wired', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      const mockQwenSpeak = vi.fn().mockResolvedValue(true);
      const mockKokoroSpeak = vi.fn().mockResolvedValue(true);
      await act(async () => {
        result.current.qwenRef.current = { isReady: true, speak: mockQwenSpeak };
        result.current.kokoroRef.current = { isReady: true, speak: mockKokoroSpeak };
        await result.current.speakText('Test Qwen TTS', 'fr');
      });
      expect(mockQwenSpeak).toHaveBeenCalledWith('Test Qwen TTS', 'fr');
      expect(mockKokoroSpeak).not.toHaveBeenCalled();
    });

    test('falls back through cascade when primary TTS fails', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      const mockQwenSpeak = vi.fn().mockRejectedValue(new Error('Qwen failed'));
      const mockKokoroSpeak = vi.fn().mockResolvedValue(true);
      await act(async () => {
        result.current.qwenRef.current = { isReady: true, speak: mockQwenSpeak };
        result.current.kokoroRef.current = { isReady: true, speak: mockKokoroSpeak };
        await result.current.speakText('Cascade test', 'en');
      });
      expect(mockQwenSpeak).toHaveBeenCalled();
      expect(mockKokoroSpeak).toHaveBeenCalled();
      expect(mockSpeak).not.toHaveBeenCalled();
    });
  });

  describe('Backend Detection — detectBackend', () => {
    test('returns offline when aiEnabled is false', async () => {
      localStorageMock.setItem('bard_traction', JSON.stringify({ settings: { aiEnabled: false } }));
      const { result } = renderHook(() => useTroubadourAI());
      let detection;
      await act(async () => { detection = await result.current.detectBackend(); });
      expect(detection.backend).toBe('offline');
    });

    test('returns wllama when wllamaRef is ready', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      await act(async () => {
        result.current.wllamaRef.current = {
          isReady: true, modelId: 'LFM2.5-1.2B-Instruct-Q4', chatCompletion: vi.fn(),
        };
        const detection = await result.current.detectBackend();
        expect(detection.backend).toBe('wllama');
        expect(detection.model.id).toBe('LFM2.5-1.2B-Instruct-Q4');
      });
    });

    test('returns offline as final fallback', async () => {
      mockFetch.mockRejectedValue(new Error('No servers'));
      const { result } = renderHook(() => useTroubadourAI());
      let detection;
      await act(async () => { detection = await result.current.detectBackend(); });
      expect(detection.backend).toBe('offline');
      expect(detection.connected).toBe(true);
    });
  });

  describe('Chat Stream — offline fallback', () => {
    test('produces streaming for offline responses', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      const chunks = [];
      await act(async () => {
        await result.current.chatStream(
          [{ role: 'user', content: 'hello' }],
          (chunk, full) => chunks.push({ chunk, full }),
          { currentFret: 1 }
        );
      });
      expect(chunks.length).toBeGreaterThan(0);
    });

    test('offline responses end with "Over."', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      let chatResult;
      await act(async () => {
        chatResult = await result.current.chatStream(
          [{ role: 'user', content: 'hello' }],
          () => {},
          { currentFret: 1 }
        );
      });
      expect(chatResult.choices[0].message.content).toMatch(/Over\.$/);
    });

    test('uses fret-aware fallback when no keyword match', async () => {
      const { result } = renderHook(() => useTroubadourAI());
      let chatResult;
      await act(async () => {
        chatResult = await result.current.chatStream(
          [{ role: 'user', content: 'xyzzy qwerty' }],
          () => {},
          { currentFret: 5 }
        );
      });
      expect(chatResult.choices[0].message.content).toContain('Major 3rd');
    });
  });

  describe('Cancel', () => {
    test('cancels speech synthesis', () => {
      const { result } = renderHook(() => useTroubadourAI());
      act(() => { result.current.cancel(); });
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe('Ref exposure', () => {
    test('exposes wllamaRef, kokoroRef, qwenRef, voiceRef', () => {
      const { result } = renderHook(() => useTroubadourAI());
      expect(result.current.wllamaRef).toBeDefined();
      expect(result.current.kokoroRef).toBeDefined();
      expect(result.current.qwenRef).toBeDefined();
      expect(result.current.voiceRef).toBeDefined();
    });

    test('exposes speakText for external use', () => {
      const { result } = renderHook(() => useTroubadourAI());
      expect(typeof result.current.speakText).toBe('function');
    });
  });
});
