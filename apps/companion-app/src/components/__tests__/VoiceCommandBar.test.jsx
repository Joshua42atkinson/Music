// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : VoiceCommandBar.test.jsx                             ║
// ║ WHAT    : Unit tests for voice command bar UI                  ║
// ║ WHY     : Mic button + listening indicator must render         ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock useLocale
vi.mock('../../hooks/useLocale', () => ({
  useLocale: () => ({
    t: (key) => key,
    isFrench: false,
    locale: 'en',
  }),
}));

// Mock useVoiceNav
const mockVoiceNav = {
  isListening: false,
  toggleListening: vi.fn(),
  speak: vi.fn(),
  stopSpeaking: vi.fn(),
  lastCommand: null,
  supported: true,
  commands: {
    next: ['next', 'suivant'],
    previous: ['previous', 'précédent'],
    play: ['play', 'jouer'],
    stop: ['stop', 'arrêter'],
    record: ['record', 'enregistrer'],
    ask: ['ask', 'demander'],
    menu: ['menu', 'accueil'],
    practice: ['practice', 'pratiquer'],
    read: ['read', 'lire'],
    help: ['help', 'aide'],
    close: ['close', 'fermer'],
  },
};

vi.mock('../../hooks/useVoiceNav', () => ({
  useVoiceNav: () => mockVoiceNav,
}));

import VoiceCommandBar from '../../components/VoiceCommandBar';

describe('VoiceCommandBar — Floating Mic UI', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockVoiceNav.isListening = false;
    mockVoiceNav.supported = true;
  });

  test('renders mic button when supported', () => {
    render(<VoiceCommandBar handlers={{}} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  test('renders nothing when not supported', () => {
    mockVoiceNav.supported = false;
    const { container } = render(<VoiceCommandBar handlers={{}} />);
    expect(container.firstChild).toBeNull();
  });

  test('calls toggleListening on button click', () => {
    render(<VoiceCommandBar handlers={{}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockVoiceNav.toggleListening).toHaveBeenCalled();
  });

  test('shows listening indicator when isListening is true', () => {
    mockVoiceNav.isListening = true;
    render(<VoiceCommandBar handlers={{}} />);
    expect(screen.getByText('Listening')).toBeTruthy();
  });

  test('does not show listening indicator when not listening', () => {
    render(<VoiceCommandBar handlers={{}} />);
    expect(screen.queryByText('Listening')).toBeNull();
  });

  test('shows last command when listening', () => {
    mockVoiceNav.isListening = true;
    mockVoiceNav.lastCommand = 'next chapter';
    render(<VoiceCommandBar handlers={{}} />);
    expect(screen.getByText('"next chapter"')).toBeTruthy();
  });
});
