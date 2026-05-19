import React, { useState } from 'react';
import frets from '../data/chapterData';
import SlideViewer from '../components/SlideViewer';
import NeckMenu from '../components/NeckMenu';
import DigitalBinder from '../components/DigitalBinder';
import StudioPage from '../pages/StudioPage';
import { useNavigate } from 'react-router-dom';
import { generateSlides } from '../data/slideGenerator';
import { getChapterProgress } from '../data/localDatabase';

// ═══════════════════════════════════════════════════════════
// ORIENTATION HUB — "The Neck" Landing Page
// A rich, warm guitar fretboard you scroll down
// Rosewood grain, metallic strings, glowing inlay dots
// Each chapter = one fret on the neck
// ═══════════════════════════════════════════════════════════

// Emotive icon sets — replacing bland emojis with paired chapter art
const CHAPTER_ICONS = {
  1:  { symbol: '🫁', glyph: '♩' },   // Breath & body
  2:  { symbol: '👁️', glyph: '♪' },    // The observer
  3:  { symbol: '🤫', glyph: '♫' },   // Silence the critic
  4:  { symbol: '🔮', glyph: '♬' },   // The mentor's wisdom
  5:  { symbol: '⚗️', glyph: '♯' },    // Alchemy of theory
  6:  { symbol: '🗺️', glyph: '♮' },    // CAGED map
  7:  { symbol: '🌀', glyph: '♭' },   // Inner ear spiral
  8:  { symbol: '⚡', glyph: '𝄞' },   // Ordeal lightning
  9:  { symbol: '🗡️', glyph: '𝄢' },    // The sword
  10: { symbol: '🌅', glyph: '𝄡' },   // Sunset road
  11: { symbol: '🪞', glyph: '𝄪' },   // Mirror
  12: { symbol: '∞', glyph: '𝄫' },    // Infinity
};

const PROGRESS_BADGES = {
  'not-started': null,
  'in-progress': { label: '◐', color: '#c9a96e', title: 'In progress' },
  'completed':   { label: '●', color: '#2ed573', title: 'Completed' },
};

const DOT_FRETS = [3, 5, 7, 9];
const DOUBLE_DOT_FRETS = [12];

const OrientationHub = () => {
  const navigate = useNavigate();
  const [activeFret, setActiveFret] = useState(null);

  if (activeFret) {
    return (
      <SlideViewer
        fretId={activeFret}
        onBack={() => setActiveFret(null)}
        onFretChange={(id) => setActiveFret(id)}
      />
    );
  }

  const mappedFrets = frets.map(ch => {
    const totalSlides = generateSlides(ch).length;
    const progress = getChapterProgress(ch.id, totalSlides);
    const badge = PROGRESS_BADGES[progress];
    return {
      ...ch,
      symbol: CHAPTER_ICONS[ch.id]?.symbol || ch.icon,
      // Append progress indicator to subtitle
      subtitle: badge
        ? `${ch.subtitle}  ${badge.label}`
        : ch.subtitle,
    };
  });

  return (
    <NeckMenu
      items={mappedFrets}
      activeId={null} // We use SlideViewer instead of inline content
      onItemClick={(id) => setActiveFret(id)}
      headerTitle="Voix Vive"
      headerSubtitle="Your 12-chapter journey through the guitar"
      showBackButton={true}
    />
  );
};

export default OrientationHub;
