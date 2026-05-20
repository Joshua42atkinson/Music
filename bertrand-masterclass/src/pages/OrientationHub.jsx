import React, { useState } from 'react';
import frets from '../data/chapterData';
import SlideViewer from '../components/SlideViewer';
import NeckMenu from '../components/NeckMenu';
import SongwritingCompanion from '../components/SongwritingCompanion';
import { generateSlides } from '../data/slideGenerator';
import { getChapterProgress } from '../data/localDatabase';
import { Feather, X } from 'lucide-react';

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
  const [activeFret, setActiveFret] = useState(null);
  const [showQuill, setShowQuill] = useState(false);

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
    <>
      <NeckMenu
        items={mappedFrets}
        activeId={null} // We use SlideViewer instead of inline content
        onItemClick={(id) => setActiveFret(id)}
        headerTitle="Voix Vive"
        headerSubtitle="Your 12-chapter journey through the guitar"
        showBackButton={true}
      />

      {/* ── Troubadour's Quill Floating Action Button ── */}
      <button
        onClick={() => setShowQuill(true)}
        aria-label="Open Troubadour's Quill"
        style={{
          position: 'fixed', bottom: '72px', right: '16px', zIndex: 400,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(123,106,170,0.4) 0%, rgba(123,106,170,0.15) 100%)',
          border: '1px solid rgba(123,106,170,0.4)',
          color: '#b09cd8', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(123,106,170,0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <Feather size={22} />
      </button>

      {/* ── Quill Overlay ── */}
      {showQuill && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 600,
          background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(12px)',
          overflowY: 'auto',
        }}>
          <button
            onClick={() => setShowQuill(false)}
            style={{
              position: 'sticky', top: '12px', right: '16px', float: 'right',
              zIndex: 601, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              margin: '12px 16px',
            }}
          >
            <X size={18} />
          </button>
          <SongwritingCompanion />
        </div>
      )}
    </>
  );
};

export default OrientationHub;
