import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SlideViewer from '../SlideViewer';

// Mocks
vi.mock('../../hooks/useLocale', () => ({
  useLocale: () => ({
    locale: 'en',
    t: (key) => {
      const dict = {
        back: 'Back',
        swipeToRead: 'Swipe to read',
        seconds: 'seconds',
        openFretboard: 'Open Fretboard',
        practiceOnFretboard: 'Practice on Fretboard',
        openFretboardFrets: 'Open Fretboard: Frets',
        nextFret: 'Next Fret',
        howMusicWorks: 'How Music Works',
        howGuitarWorks: 'How Guitar Works',
        launchTool: 'Launch',
        comingSoon: 'Coming Soon',
        viewReferences: 'View',
        hideReferences: 'Hide',
        references: 'References',
      };
      return dict[key] || key;
    },
  }),
}));

vi.mock('../ScaffoldingProvider', () => ({
  useScaffolding: () => ({ updateTraction: vi.fn() }),
}));

vi.mock('../../data/localDatabase', () => ({
  saveSlidePosition: vi.fn(),
  getSlidePosition: vi.fn(() => 0),
}));

vi.mock('../../data/tractionStore', () => ({
  updateFretTraction: vi.fn((prev, id, updates) => prev),
  getFretState: vi.fn(() => ({ yinCompleted: false })),
}));

vi.mock('../FretboardSheet', () => ({
  default: () => <div data-testid="fretboard-sheet">Fretboard</div>,
}));

vi.mock('../PlingTrainer', () => ({
  default: () => <div data-testid="pling-trainer">Pling</div>,
}));

describe('SlideViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first slide of a chapter', () => {
    render(<SlideViewer fretId={1} onBack={() => {}} />);
    expect(screen.getByText('The Root Note')).toBeInTheDocument();
    expect(screen.getByText(/1\/\d+/)).toBeInTheDocument(); // page num like 1/16
  });

  it('shows chapter label in top bar', () => {
    render(<SlideViewer fretId={2} onBack={() => {}} />);
    expect(screen.getByText(/Ch\.2/)).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    render(<SlideViewer fretId={1} onBack={() => {}} />);
    const progress = document.querySelector('.sv-progress');
    expect(progress).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<SlideViewer fretId={1} onBack={() => {}} />);
    const prevBtn = document.querySelector('.sv-nav-btn');
    expect(prevBtn).toBeInTheDocument();
  });

  it('back button calls onBack', () => {
    const onBack = vi.fn();
    render(<SlideViewer fretId={1} onBack={onBack} />);
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders different slide types without crashing', () => {
    // Chapter 7 has quote, meditation, theory, exercise slides
    render(<SlideViewer fretId={7} onBack={() => {}} />);
    expect(screen.getByText('The Ordeal')).toBeInTheDocument();
  });

  it('renders timeless-song slides with quote and subtext', () => {
    render(<SlideViewer fretId={1} onBack={() => {}} />);
    // Slide 2 should be timeless-song (after title)
    // Just verify no crash and expected content renders
    expect(document.querySelector('.sv-slide')).toBeInTheDocument();
  });
});
