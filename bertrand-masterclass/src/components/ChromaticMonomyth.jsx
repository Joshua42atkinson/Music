// ═══════════════════════════════════════════════════════════
// CHROMATIC MONOMYTH — Reference Chart
// The 12-fret map showing intervals, ratios, cents, colors,
// Hero's Journey stages, and emotional meaning in one view.
// Route: /monomyth (linked from Song portal)
// ═══════════════════════════════════════════════════════════

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Info } from 'lucide-react';
import chapterData from '../data/chapterData';
import { useLocale } from '../hooks/useLocale';

export default function ChromaticMonomyth() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? val[locale] || val.en : val);

  return (
    <div style={{
      minHeight: '100svh',
      background: '#050508',
      color: '#e8e6e3',
      padding: 'max(16px, env(safe-area-inset-top)) 16px 40px',
    }}>
      {/* ── Navigation Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, position: 'relative', zIndex: 2,
      }}>
        <button onClick={() => navigate(-1)} style={navBtnStyle}>
          <ArrowLeft size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)',
            marginBottom: 2,
          }}>◈ Reference</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem', color: '#c9a96e', margin: 0,
          }}>The Chromatic Monomyth</h1>
        </div>

        <button onClick={() => navigate('/')} style={navBtnStyle}>
          <Home size={18} />
        </button>
      </div>

      {/* ── Intro ── */}
      <p style={{
        fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.7,
        textAlign: 'center', maxWidth: 540, margin: '0 auto 28px',
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        Twelve semitones. Twelve stages. One journey from silence to surrender.
        Each fret carries a mathematical truth discovered by Pythagoras,
        an emotional doorway, and a chapter of becoming.
      </p>

      {/* ── The Chart ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 1fr 80px 70px',
          gap: 8,
          padding: '10px 12px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.55rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'rgba(201,169,110,0.4)',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
        }}>
          <span>Fret</span>
          <span>Interval</span>
          <span>Hero Stage</span>
          <span style={{ textAlign: 'right' }}>Ratio</span>
          <span style={{ textAlign: 'right' }}>Cents</span>
        </div>

        {chapterData.map((fret) => (
          <div
            key={fret.id}
            onClick={() => navigate('/song', { state: { activeFret: fret.fret } })}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 1fr 80px 70px',
              gap: 8,
              alignItems: 'center',
              padding: '12px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${fret.color}10`;
              e.currentTarget.style.borderColor = `${fret.color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
          >
            {/* Fret number + color dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: fret.color,
                boxShadow: `0 0 8px ${fret.color}40`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem', color: '#c9a96e',
              }}>{fret.fret}</span>
            </div>

            {/* Interval */}
            <div>
              <span style={{
                fontSize: '0.85rem', color: '#e8e6e3', fontWeight: 500,
              }}>{localize(fret.interval)}</span>
              <span style={{
                display: 'block', fontSize: '0.65rem', opacity: 0.5, marginTop: 2,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{fret.note}</span>
            </div>

            {/* Hero Stage */}
            <div>
              <span style={{
                fontSize: '0.8rem', color: '#e8e6e3',
              }}>{localize(fret.heroStage)}</span>
              <span style={{
                display: 'block', fontSize: '0.65rem', opacity: 0.45, marginTop: 2,
                fontStyle: 'italic',
              }}>{localize(fret.title)}</span>
            </div>

            {/* Ratio */}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem', color: '#c9a96e', opacity: 0.8,
              textAlign: 'right',
            }}>
              {fret.pythagoreanLegacy?.ratio || '—'}
            </span>

            {/* Cents */}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem', opacity: 0.5,
              textAlign: 'right',
            }}>
              {fret.pythagoreanLegacy?.cents !== undefined ? `${fret.pythagoreanLegacy.cents}` : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{
        maxWidth: 540, margin: '32px auto 0',
        padding: 16, borderRadius: 12,
        background: 'rgba(201,169,110,0.04)',
        border: '1px solid rgba(201,169,110,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Info size={14} color="rgba(201,169,110,0.5)" />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)',
          }}>How to Read</span>
        </div>
        <p style={{
          fontSize: '0.8rem', lineHeight: 1.5, opacity: 0.6, margin: 0,
        }}>
          <strong style={{ color: '#c9a96e' }}>Ratio:</strong> The Pythagorean frequency ratio —
          the ancient Greek mathematical origin of each interval.<br />
          <strong style={{ color: '#c9a96e' }}>Cents:</strong> Modern unit of pitch measurement.
          1200 cents = one octave. Pythagoras measured by ear; we measure by cents.<br />
          <strong style={{ color: '#c9a96e' }}>Click any row</strong> to jump to that chapter in The Song.
        </p>
      </div>

      {/* ── Footer ── */}
      <p style={{
        textAlign: 'center', marginTop: 32,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.6rem', opacity: 0.3,
      }}>
        12 semitones · 12 ratios · 12 stages · One journey
      </p>
    </div>
  );
}

const navBtnStyle = {
  width: 36, height: 36, borderRadius: 10,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(201,169,110,0.2)',
  color: '#c9a96e',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
};
