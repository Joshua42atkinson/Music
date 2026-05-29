import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, Guitar, X } from 'lucide-react';
import frets from '../data/chapterData';
import SlideViewer from '../components/SlideViewer';
import NeckMenu from '../components/NeckMenu';
import SongwritingCompanion from '../components/SongwritingCompanion';
import { generateSlides } from '../data/slideGenerator';
import { getChapterProgress } from '../data/localDatabase';
import AuthButton from '../components/AuthButton';

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
  const navigate = useNavigate();

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
      {/* ── Navigation Bar ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.15)',
            borderRadius: 8,
            padding: '8px 12px',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/monomyth')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem', color: '#c9a96e',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
              background: 'rgba(201,169,110,0.06)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 8, padding: '8px 12px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.12)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.06)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)';
            }}
            aria-label="Chromatic Monomyth"
          >
            <BookOpen size={14} />
            Chart
          </button>
          <AuthButton />
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36,
              background: 'rgba(201,169,110,0.06)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 8,
              color: '#c9a96e',
              cursor: 'pointer',
            }}
            aria-label="Home"
          >
            <Home size={16} />
          </button>
        </div>
      </nav>

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
          background: 'linear-gradient(135deg, rgba(201,169,110,0.4) 0%, rgba(201,169,110,0.15) 100%)',
          border: '1px solid rgba(201,169,110,0.4)',
          color: '#c9a96e', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,169,110,0.3), 0 0 30px rgba(201,169,110,0.2)',
          transition: 'all 0.3s ease',
          animation: 'glow 2s ease-in-out infinite',
        }}
      >
        <Guitar size={22} />
      </button>
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(201,169,110,0.3), 0 0 30px rgba(201,169,110,0.2); }
          50% { box-shadow: 0 4px 20px rgba(201,169,110,0.5), 0 0 50px rgba(201,169,110,0.4); }
        }
      `}</style>

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
