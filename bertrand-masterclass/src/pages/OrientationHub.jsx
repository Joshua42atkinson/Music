import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, Guitar, X, ShieldAlert, Award, Menu } from 'lucide-react';
import frets from '../data/chapterData';
import SlideViewer from '../components/SlideViewer';
import NeckMenu from '../components/NeckMenu';
import { generateSlides } from '../data/slideGenerator';
import { getChapterProgress } from '../data/localDatabase';
import AuthButton from '../components/AuthButton';
import { useScaffolding } from '../components/ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import DailyCalibration from '../game/DailyCalibration';

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
  const [forceCalibration, setForceCalibration] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);
  const navigate = useNavigate();
  const { traction, updateTraction, isHydrated } = useScaffolding();
  const { locale } = useLocale();

  const today = new Date().toISOString().split('T')[0];
  const isCalibrated = traction?.lastCalibrationDate === today;
  
  const sandboxMode = traction?.settings?.sandboxMode;
  const aiEnabled = traction?.settings?.aiEnabled !== false;

  const getModeLabel = () => {
    if (!sandboxMode && aiEnabled) {
      return { 
        label: 'Apprenticeship Mode', 
        color: '#a78bfa', 
        borderColor: 'rgba(167,139,250,0.3)',
        background: 'rgba(167,139,250,0.1)',
        description: 'Guided Path + AI Somatic Mentorship',
        certBadge: true
      };
    }
    if (!sandboxMode && !aiEnabled) {
      return { 
        label: 'Self-Study Mode', 
        color: '#34d399', 
        borderColor: 'rgba(52,211,153,0.3)',
        background: 'rgba(52,211,153,0.1)',
        description: 'Guided Path (Silent)',
        certBadge: true
      };
    }
    if (sandboxMode && aiEnabled) {
      return { 
        label: 'Exploration Mode', 
        color: '#fbbf24', 
        borderColor: 'rgba(251,191,38,0.3)',
        background: 'rgba(251,191,38,0.1)',
        description: 'Open Book Sandbox + AI Somatic Mentorship',
        certBadge: false
      };
    }
    return { 
      label: 'Library Reference Mode', 
      color: '#9ca3af', 
      borderColor: 'rgba(156,163,175,0.3)',
      background: 'rgba(156,163,175,0.1)',
      description: 'Open Book Sandbox (Silent)',
      certBadge: false
    };
  };

  const currentMode = getModeLabel();

  if (((!isCalibrated && !sandboxMode) || forceCalibration) && isHydrated !== false) {
    return (
      <DailyCalibration 
        onClose={() => {
          setForceCalibration(false);
          if (!isCalibrated) navigate('/');
        }} 
      />
    );
  }

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
    const localizedSubtitle = ch.subtitle[locale] || ch.subtitle.en || ch.subtitle;
    return {
      ...ch,
      symbol: CHAPTER_ICONS[ch.id]?.symbol || ch.icon,
      // Append progress indicator to subtitle
      subtitle: badge
        ? `${localizedSubtitle}  ${badge.label}`
        : localizedSubtitle,
    };
  });

  return (
    <>
      {/* ── Navigation Bar ── */}
      <nav className="nav-bar-container">
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
          <span className="back-btn-text">Back</span>
        </button>

        {/* Centered Mode Status Pill */}
        <div 
          className="nav-mode-pill"
          onClick={() => setShowModeInfo(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '4px 12px',
            borderRadius: 20,
            background: currentMode.background,
            border: `1px solid ${currentMode.borderColor}`,
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            maxWidth: '260px',
            boxShadow: `0 0 10px ${currentMode.background}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }} 
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.borderColor = currentMode.color;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = currentMode.borderColor;
          }}
          title="Click to view and change study modes"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            color: currentMode.color,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            {currentMode.certBadge && <Award size={10} style={{ color: currentMode.color }} />}
            {currentMode.label}
          </div>
          <div 
            className="nav-mode-desc"
            style={{
              fontSize: '0.5rem',
              color: 'rgba(255, 255, 255, 0.45)',
              fontFamily: "'Inter', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '240px'
            }}
          >
            {currentMode.description}
          </div>
        </div>
        {/* Minimal Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AuthButton />
        </div>
      </nav>

      {/* ── Mode Explainer Popover ── */}
      {showModeInfo && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5,5,8,0.7)',
            backdropFilter: 'blur(10px)',
            padding: 16
          }} 
          onClick={() => setShowModeInfo(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(25, 20, 18, 0.98) 0%, rgba(15, 10, 8, 0.99) 100%)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              borderRadius: 16,
              padding: 24,
              maxWidth: 380,
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(201, 169, 110, 0.15)',
              position: 'relative'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              color: '#f0e6d2',
              margin: '0 0 12px 0',
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(201, 169, 110, 0.2)'
            }}>
              Pedagogical Attunement
            </h3>
            
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.5,
              marginBottom: 20,
              textAlign: 'center'
            }}>
              Your active study mode determines how you interact with the 12 somatic frets. Toggle between structured alignment and open exploration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Sandbox vs Guided */}
              <div style={{
                background: 'rgba(201, 169, 110, 0.04)',
                border: '1px solid rgba(201, 169, 110, 0.15)',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0e6d2', fontFamily: "'JetBrains Mono', monospace" }}>
                    FRET PROGRESSION
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    {sandboxMode ? 'All 12 frets unlocked' : 'Fret-by-fret sequence'}
                  </div>
                </div>
                <button
                  onClick={() => updateTraction(prev => ({ 
                    settings: { ...prev.settings, sandboxMode: !sandboxMode } 
                  }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: sandboxMode ? 'rgba(201, 169, 110, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${sandboxMode ? '#c9a96e' : 'rgba(255,255,255,0.1)'}`,
                    color: sandboxMode ? '#c9a96e' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.65rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {sandboxMode ? '🔓 Sandbox' : '🏆 Guided'}
                </button>
              </div>

              {/* Troubadour AI vs Mute */}
              <div style={{
                background: 'rgba(201, 169, 110, 0.04)',
                border: '1px solid rgba(201, 169, 110, 0.15)',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0e6d2', fontFamily: "'JetBrains Mono', monospace" }}>
                    TROUBADOUR COMPANION
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    {aiEnabled ? 'AI Somatic Mentorship ON' : 'AI Companion is muted'}
                  </div>
                </div>
                <button
                  onClick={() => updateTraction(prev => ({ 
                    settings: { ...prev.settings, aiEnabled: !aiEnabled } 
                  }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: aiEnabled ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${aiEnabled ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
                    color: aiEnabled ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.65rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {aiEnabled ? '🔮 Troubadour' : '🤫 Silent'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowModeInfo(false)}
              style={{
                marginTop: 24,
                width: '100%',
                padding: '10px 0',
                borderRadius: 8,
                background: 'rgba(201,169,110,0.12)',
                border: '1px solid rgba(201,169,110,0.3)',
                color: '#c9a96e',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,110,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,169,110,0.12)'}
            >
              Confirm Attunement
            </button>
          </div>
        </div>
      )}


      <NeckMenu
        items={mappedFrets}
        activeId={null} // We use SlideViewer instead of inline content
        onItemClick={(id) => setActiveFret(id)}
        headerTitle="Voix Vive"
        headerSubtitle="Your 12-chapter journey through the guitar"
        showBackButton={true}
      />

      <style>{`
        .nav-bar-container {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          padding-top: max(12px, env(safe-area-inset-top));
          background: linear-gradient(180deg, rgba(13, 13, 20, 0.95) 0%, rgba(13, 13, 20, 0.7) 70%, transparent 100%);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(201, 169, 110, 0.08);
          transition: all 0.3s ease;
        }

        .back-btn-text {
          display: inline;
        }

        .desktop-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(201,169,110,0.08);
          border: 1px solid rgba(201,169,110,0.2);
          border-radius: 8px;
          color: #c9a96e;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: rgba(201,169,110,0.15);
          border-color: rgba(201,169,110,0.35);
        }

        .mobile-dropdown {
          display: none;
          position: fixed;
          top: 64px;
          right: 16px;
          background: rgba(18, 16, 14, 0.96);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(201, 169, 110, 0.25);
          border-radius: 12px;
          padding: 16px;
          width: 220px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(201,169,110,0.1);
          flex-direction: column;
          gap: 12px;
          z-index: 499;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-dropdown.open {
          display: flex;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: rgba(201,169,110,0.05);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 8px;
          color: #c9a96e;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .dropdown-item:hover {
          background: rgba(201,169,110,0.12);
          border-color: rgba(201,169,110,0.35);
          color: #f0e6d2;
        }

        @media (max-width: 767px) {
          .desktop-actions {
            display: none;
          }
          .mobile-only-flex {
            display: flex !important;
          }
          .back-btn-text {
            display: none;
          }
          .nav-mode-pill {
            max-width: 160px !important;
          }
          .nav-mode-desc {
            display: none !important;
          }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(201,169,110,0.3), 0 0 30px rgba(201,169,110,0.2); }
          50% { box-shadow: 0 4px 20px rgba(201,169,110,0.5), 0 0 50px rgba(201,169,110,0.4); }
        }
      `}</style>

    </>
  );
};

export default OrientationHub;
