// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PreScreeningResults.test.jsx                         ║
// ║ WHAT    : Unit tests for pre-screening results display         ║
// ║ WHY     : Analysis must render strengths, issues, draft review ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreScreeningResults from '../../components/PreScreeningResults';

// Mock useLocale
vi.mock('../../hooks/useLocale', () => ({
  useLocale: () => ({
    t: (key) => key,
    isFrench: false,
    locale: 'en',
  }),
}));

const MOCK_ANALYSIS = {
  overallAssessment: 'The student shows good engagement.',
  strengths: ['Consistent practice posture', 'Clear effort'],
  issues: [
    {
      category: 'timing',
      severity: 'low',
      timestamp: '00:15',
      description: 'Slight rush on transitions',
      suggestion: 'Practice with metronome at 60 BPM',
    },
    {
      category: 'posture',
      severity: 'medium',
      timestamp: null,
      description: 'Wrist tension during barre chords',
      suggestion: 'Relax wrist and drop shoulder',
    },
  ],
  draftReview: 'I can see you\'re putting real work into this.',
  priorityFlags: ['Wrist tension during barre chords'],
  estimatedLevel: 'intermediate',
  recommendedFocus: 'Slow transitions with metronome',
};

describe('PreScreeningResults — Analysis Display', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nothing when analysis is null', () => {
    const { container } = render(<PreScreeningResults analysis={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders overall assessment', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText(/The student shows good engagement/)).toBeTruthy();
  });

  test('renders strengths list', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText('Consistent practice posture')).toBeTruthy();
    expect(screen.getByText('Clear effort')).toBeTruthy();
  });

  test('renders issue descriptions', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText('Slight rush on transitions')).toBeTruthy();
    expect(screen.getByText('Wrist tension during barre chords')).toBeTruthy();
  });

  test('renders issue suggestions', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText(/Practice with metronome at 60 BPM/)).toBeTruthy();
  });

  test('renders timestamp when provided', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText('00:15')).toBeTruthy();
  });

  test('renders priority flags', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText('Wrist tension during barre chords')).toBeTruthy();
  });

  test('renders recommended focus', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText('Slow transitions with metronome')).toBeTruthy();
  });

  test('renders estimated level', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} />);
    expect(screen.getByText(/intermediate/)).toBeTruthy();
  });

  test('does not render draft review in student view', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} isMentorView={false} />);
    expect(screen.queryByText(/I can see you're putting real work/)).toBeNull();
  });

  test('renders draft review in mentor view', () => {
    render(<PreScreeningResults analysis={MOCK_ANALYSIS} isMentorView={true} />);
    expect(screen.getByText(/I can see you're putting real work/)).toBeTruthy();
  });

  test('renders mock badge for mock analysis', () => {
    render(<PreScreeningResults analysis={{ ...MOCK_ANALYSIS, _mock: true }} />);
    expect(screen.getByText('Mock')).toBeTruthy();
  });
});
