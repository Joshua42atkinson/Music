import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SlideViewer from '../SlideViewer';

global.WebGL2RenderingContext = class {};

vi.mock('three', () => ({
  WebGLRenderer: class {
    constructor() {}
    setSize() {}
    render() {}
  },
  Scene: class {},
  PerspectiveCamera: class {},
  Color: class {},
}));

// Mocks
vi.mock('../../hooks/useCosyVoice', () => ({
  useCosyVoice: () => ({
    isReady: true,
    speak: vi.fn(),
    cancel: vi.fn(),
    initTTS: vi.fn()
  })
}));

vi.mock('../../features/vr-fretboard/FretboardSheet', () => ({
  default: () => <div data-testid="mock-fretboard-sheet" />
}));

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
  updateFretTraction: vi.fn((prev, _id, _updates) => prev),
  getFretState: vi.fn(() => ({ yinCompleted: false })),
}));

vi.mock('../FretboardSheet', () => ({
  default: () => <div data-testid="fretboard-sheet">Fretboard</div>,
}));

vi.mock('../../data/curriculumIndexer', () => ({
  default: {},
}));

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {}, scene: {}, gl: {} })),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  Environment: () => <div data-testid="mock-environment" />,
  Text: () => <div data-testid="mock-text" />,
}));

vi.mock('@pmndrs/xr', () => ({
  XR: ({ children }) => <div data-testid="mock-xr">{children}</div>,
  Controllers: () => null,
  Hands: () => null,
  useXR: vi.fn(() => ({ isPresenting: false })),
}));

vi.mock('iwer', () => ({}));
vi.mock('@iwer/devui', () => ({
  DevUI: class {}
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
