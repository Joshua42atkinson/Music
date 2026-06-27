import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TruebadourWidget from '../../features/somatic-masterclass/TruebadourWidget';

// ── Mock Routing ──
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

// ── Mock Localization ──
vi.mock('../../hooks/useLocale', () => ({
  useLocale: () => ({
    locale: 'en',
    t: (key) => {
      const dict = {
        music: 'Music',
        click: 'Click',
        nowPlaying: 'Now Playing',
        metronome: 'Metronome',
        help: 'Help',
        start: 'Start',
        stop: 'Stop',
        tap: 'Tap',
      };
      return dict[key] || key;
    },
  }),
}));

// ── Mock AI orchestration hook ──
const mockChatStream = vi.fn();
const mockSpeakText = vi.fn();
vi.mock('../../hooks/useTruebadourAI', () => ({
  useTruebadourAI: () => ({
    chatStream: mockChatStream,
    backend: 'offline',
    wllamaRef: { current: null },
    kokoroRef: { current: null },
    bertrandRef: { current: null },
    voiceRef: { current: null },
    speakText: mockSpeakText,
  }),
}));

// ── Mock related hooks ──
vi.mock('../../hooks/useWllamaTruebadour', () => ({
  useWllamaTruebadour: () => ({ initEngine: vi.fn(), loadProgress: 0, isReady: false, unload: vi.fn() }),
}));
vi.mock('../../hooks/useCosyVoice', () => ({
  useCosyVoice: () => ({ initTTS: vi.fn(), loadProgress: 0, isReady: false, cancel: vi.fn(), speak: vi.fn() }),
}));
vi.mock('../../hooks/useVoiceInput', () => ({
  useVoiceInput: () => ({
    isAvailable: true,
    isListening: false,
    startListening: vi.fn(),
    stopListening: vi.fn(),
  }),
}));
vi.mock('../../hooks/useBackendBridge', () => ({
  useBackendBridge: () => ({ isDaaSConnected: false, isLMStudioConnected: false }),
}));
vi.mock('../../hooks/useBevyIPC', () => ({
  useBevyIPC: () => ({ isConnected: false, lastMessage: null, sendCommand: vi.fn() }),
}));

// ── Mock TruebadourProvider (centralized AI brain + widget control) ──
const mockOpenRift = vi.fn();
const mockCloseAll = vi.fn();
let mockActiveWidget = null;

vi.mock('../../hooks/TruebadourProvider', () => ({
  useTruebadour: () => ({
    ai: {
      chatStream: mockChatStream,
      backend: 'offline',
      wllamaRef: { current: null },
      kokoroRef: { current: null },
      bertrandRef: { current: null },
      voiceRef: { current: null },
      speakText: mockSpeakText,
    },
    bertrand: { initTTS: vi.fn(), loadProgress: 0, isReady: false, cancel: vi.fn(), speak: vi.fn() },
    wllama: { initEngine: vi.fn(), loadProgress: 0, isReady: false, unload: vi.fn() },
    voiceInput: { isAvailable: true, isListening: false, startListening: vi.fn(), stopListening: vi.fn() },
    voixLoading: false,
    voixReady: false,
    loadVoix: vi.fn(),
    unloadVoix: vi.fn(),
    loadProgress: 0,
    activeWidget: mockActiveWidget,
    openRift: mockOpenRift,
    openBinder: vi.fn(),
    closeAll: mockCloseAll,
  }),
  TruebadourProvider: ({ children }) => children,
}));

// ── Mock Scaffolding Provider ──
const mockUpdateTraction = vi.fn();
vi.mock('../ScaffoldingProvider', () => ({
  useScaffolding: () => ({
    traction: { settings: { aiEnabled: true, sandboxMode: false, kidMode: false } },
    updateTraction: mockUpdateTraction,
    bardLevel: 2,
    practiceMinutes: 15,
    streak: 3,
    currentNodeId: 'node-1',
    currentNode: {},
    currentFret: 3,
    currentPhase: 'DO',
    completedNodes: [],
    nextRecommended: 'fret-4-do',
  }),
}));

// ── Mock Metronome ──
const mockSetIsPlaying = vi.fn();
vi.mock('../../hooks/useMetronome', () => ({
  useMetronome: () => ({
    beats: 4, currentBeat: 0, isPlaying: false, bpm: 120, volume: 0.5,
    setBpm: vi.fn(), setBeats: vi.fn(), setVolume: vi.fn(),
    setIsPlaying: mockSetIsPlaying, tap: vi.fn(), stop: vi.fn(),
  }),
}));

// ── Mock data stores ──
vi.mock('../../data/ragStore', () => ({
  searchChunks: vi.fn().mockResolvedValue([]),
  buildContextBlock: vi.fn().mockReturnValue(''),
}));
vi.mock('../../data/saveState', () => ({
  exportVoixViveFile: vi.fn(),
  importVoixViveFile: vi.fn(),
}));

describe('TruebadourWidget (Riff) — Mutual Exclusion & Game Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockActiveWidget = null;
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('does not render panel content when activeWidget is not riff', () => {
    mockActiveWidget = null;
    render(<TruebadourWidget />);
    // Panel should not be visible
    expect(screen.queryByText('Riff')).not.toBeInTheDocument();
  });

  it('does not render panel content when activeWidget is not riff', () => {
    mockActiveWidget = null;
    render(<TruebadourWidget />);
    // Panel should not be visible
    expect(screen.queryByText('Riff')).not.toBeInTheDocument();
  });
});
