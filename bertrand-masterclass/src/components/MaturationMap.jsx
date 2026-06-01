// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : MaturationMap.jsx                                    ║
// ║ WHAT    : Visual 12-fret journey map — "Where am I?"          ║
// ║ WHY     : Students had no visual overview of their progress   ║
// ║           across all 12 frets. This IS the maturation map.    ║
// ║ WHO     : Student — the primary navigation/orientation view   ║
// ║ OWNS    : Fret progress visualization, pillar breakdown,      ║
// ║           clickable fret nodes, recommended next action       ║
// ║ NEEDS   : useDAGProgress, dagNodes, bardicTitles, useLocale   ║
// ║ RULES   : No Great Game language. No leaderboards.            ║
// ║           12-fret neck IS the UI. Each fret = one row.        ║
// ║ ROUTE   : /guitar/map                                         ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, Star, Lock, CheckCircle } from 'lucide-react';
import { useScaffolding } from './ScaffoldingProvider';
import { useDAGProgress } from '../hooks/useDAGProgress';
import { getNodesByFret, FRET_METADATA } from '../data/dag/dagNodes';
import { getBardTitle } from '../data/playbookData';
import { useLocale } from '../hooks/useLocale';

// ── Fret color palette (chromatic, esoteric) ──
const FRET_COLORS = [
  '#e74c3c', // 1 — C Root (red, fire)
  '#e67e22', // 2 — C# m2 (orange, tension)
  '#f1c40f', // 3 — D M2 (gold, awakening)
  '#2ecc71', // 4 — D# m3 (green, growth)
  '#1abc9c', // 5 — E M3 (teal, clarity)
  '#3498db', // 6 — F P4 (blue, depth)
  '#9b59b6', // 7 — F# TT (purple, ordeal)
  '#e91e63', // 8 — G P5 (magenta, reward)
  '#ff5722', // 9 — G# m6 (deep orange, road back)
  '#ffc107', // 10 — A M6 (amber, resurrection)
  '#00bcd4', // 11 — A# m7 (cyan, elixir)
  '#8bc34a', // 12 — B M7 (lime, mastery)
];

const FRET_INTERVALS = [
  'Root', 'm2', 'M2', 'm3', 'M3', 'P4',
  'TT', 'P5', 'm6', 'M6', 'm7', 'M7',
];

const HERO_STAGES = [
  'Call to Adventure',
  'Refusal of the Call',
  'Meeting the Mentor',
  'Crossing the Threshold',
  'Tests, Allies, Enemies',
  'Approach to the Cave',
  'The Ordeal',
  'The Reward',
  'The Road Back',
  'The Resurrection',
  'Return with the Elixir',
  'Master of Two Worlds',
];

export default function MaturationMap() {
  const navigate = useNavigate();
  const { bardLevel, streak, practiceMinutes, traction } = useScaffolding();
  const { progress, getFretProgress, currentFret } = useDAGProgress();
  const { locale, t } = useLocale();
  const lang = locale;

  const bardTitle = useMemo(() => getBardTitle(bardLevel, lang), [bardLevel, lang]);
  const sandboxMode = traction?.settings?.sandboxMode;

  const currentMode = useMemo(() => {
    const aiEnabled = traction?.settings?.aiEnabled !== false;
    if (!sandboxMode && aiEnabled) return { label: 'Apprenticeship', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)' };
    if (!sandboxMode && !aiEnabled) return { label: 'Self-Study', color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)' };
    if (sandboxMode && aiEnabled) return { label: 'Exploration', color: '#fbbf24', background: 'rgba(251,191,38,0.1)', borderColor: 'rgba(251,191,38,0.25)' };
    return { label: 'Library', color: '#9ca3af', background: 'rgba(156,163,175,0.1)', borderColor: 'rgba(156,163,175,0.25)' };
  }, [traction, sandboxMode]);

  const fretData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const fret = i + 1;
      const meta = FRET_METADATA[fret] || {};
      const prog = getFretProgress(fret);
      const nodes = getNodesByFret(fret);
      const completedNodes = nodes.filter(n => progress.completedNodes.includes(n.id));
      
      // Pillar breakdown
      const pillars = ['class', 'guitar', 'workbook'].map(pillar => {
        const pillarNodes = nodes.filter(n => n.pillar === pillar);
        const pillarComplete = pillarNodes.filter(n => progress.completedNodes.includes(n.id));
        return {
          pillar,
          total: pillarNodes.length,
          completed: pillarComplete.length,
          pct: pillarNodes.length > 0 ? Math.round((pillarComplete.length / pillarNodes.length) * 100) : 0,
        };
      });

      return {
        fret,
        interval: FRET_INTERVALS[i],
        heroStage: HERO_STAGES[i],
        color: FRET_COLORS[i],
        meta,
        totalNodes: nodes.length,
        completedCount: completedNodes.length,
        percentage: prog.percentage,
        isComplete: prog.isComplete,
        isCurrent: fret === currentFret,
        isLocked: !sandboxMode && fret > 1 && !progress.completedNodes.some(id => id.startsWith(`fret-${fret}-`)) && prog.percentage === 0,
        pillars,
      };
    });
  }, [progress, getFretProgress, currentFret, sandboxMode]);

  // Find the highest unlocked fret
  const highestUnlocked = useMemo(() => {
    for (let i = 11; i >= 0; i--) {
      if (!fretData[i].isLocked) return fretData[i].fret;
    }
    return 1;
  }, [fretData]);

  const totalProgress = useMemo(() => {
    const totalNodes = fretData.reduce((sum, f) => sum + f.totalNodes, 0);
    const completedNodes = fretData.reduce((sum, f) => sum + f.completedCount, 0);
    return totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  }, [fretData]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.navBtn} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>
            {lang === 'fr' ? 'Carte de Maturation' : 'Maturation Map'}
          </h1>
          <p style={styles.subtitle}>
            Lv.{bardLevel} — {bardTitle}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            padding: '2px 8px',
            borderRadius: 12,
            background: currentMode.background,
            border: `1px solid ${currentMode.borderColor}`,
            color: currentMode.color,
            fontSize: '0.6rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {currentMode.label}
          </div>
        </div>
        <button onClick={() => navigate('/')} style={styles.navBtn} aria-label="Home">
          <Home size={18} />
        </button>
      </div>

      {/* Overall Progress */}
      <div style={styles.overallSection}>
        <div style={styles.overallStats}>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>🔥</span>
            <span style={styles.statValue}>{streak}</span>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>⏱️</span>
            <span style={styles.statValue}>{practiceMinutes}m</span>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>🏔️</span>
            <span style={styles.statValue}>{totalProgress}%</span>
          </div>
        </div>
        <div style={styles.overallBar}>
          <div style={{ ...styles.overallFill, width: `${totalProgress}%` }} />
        </div>
        <p style={styles.overallLabel}>
          {lang === 'fr' ? 'Progression Totale' : 'Total Journey Progress'}
        </p>
      </div>

      {/* Fret Grid */}
      <div style={styles.fretGrid}>
        {fretData.map((fd) => (
          <button
            key={fd.fret}
            onClick={() => {
              if (!fd.isLocked) {
                navigate('/song', { state: { fret: fd.fret } });
              }
            }}
            style={{
              ...styles.fretRow,
              borderLeftColor: fd.color,
              opacity: fd.isLocked ? 0.35 : 1,
              cursor: fd.isLocked ? 'default' : 'pointer',
              background: fd.isCurrent
                ? `linear-gradient(90deg, ${fd.color}12, transparent)`
                : 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Fret Number */}
            <div style={{
              ...styles.fretNumber,
              background: fd.isComplete ? fd.color : 'rgba(255,255,255,0.06)',
              color: fd.isComplete ? '#0a0a0f' : fd.color,
            }}>
              {fd.isComplete ? <CheckCircle size={16} /> : fd.isLocked ? <Lock size={14} /> : fd.fret}
            </div>

            {/* Fret Info */}
            <div style={styles.fretInfo}>
              <div style={styles.fretTitleRow}>
                <span style={{ ...styles.fretName, color: fd.color }}>
                  {fd.interval}
                </span>
                <span style={styles.fretStage}>{fd.heroStage}</span>
                {fd.isCurrent && <span style={styles.currentBadge}>●</span>}
              </div>

              {/* Pillar Bars */}
              <div style={styles.pillarRow}>
                {fd.pillars.map(p => (
                  <div key={p.pillar} style={styles.pillarGroup}>
                    <span style={styles.pillarIcon}>
                      {p.pillar === 'class' ? '📖' : p.pillar === 'guitar' ? '🎸' : '📓'}
                    </span>
                    <div style={styles.pillarTrack}>
                      <div style={{
                        ...styles.pillarFill,
                        width: `${p.pct}%`,
                        background: fd.color,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Percentage */}
            <div style={styles.fretPct}>
              <span style={{ ...styles.pctValue, color: fd.percentage === 100 ? '#4ade80' : fd.color }}>
                {fd.percentage}%
              </span>
              {!fd.isLocked && !fd.isComplete && (
                <ChevronRight size={14} style={{ opacity: 0.3 }} />
              )}
              {fd.isComplete && (
                <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={styles.legendIcon}>📖</span>
          <span style={styles.legendLabel}>{lang === 'fr' ? 'Le Chant' : 'The Song'}</span>
        </div>
        <div style={styles.legendItem}>
          <span style={styles.legendIcon}>🎸</span>
          <span style={styles.legendLabel}>{lang === 'fr' ? 'La Guitare' : 'The Guitar'}</span>
        </div>
        <div style={styles.legendItem}>
          <span style={styles.legendIcon}>📓</span>
          <span style={styles.legendLabel}>{lang === 'fr' ? 'Le Cahier' : 'The Workbook'}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#050508',
    color: '#e8edf2',
    fontFamily: "'Inter', sans-serif",
    paddingBottom: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px 12px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    gap: '12px',
  },
  navBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#c9a96e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: 0,
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: '#c9a96e',
    letterSpacing: '0.1em',
    margin: 0,
  },

  // Overall
  overallSection: {
    padding: '0 20px 16px',
  },
  overallStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statIcon: { fontSize: '0.85rem' },
  statValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    color: '#f0e6d2',
    fontWeight: 600,
  },
  overallBar: {
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  overallFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #c9a96e, #e0d0aa)',
    transition: 'width 0.6s ease',
    boxShadow: '0 0 8px rgba(201,169,110,0.4)',
  },
  overallLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    color: 'rgba(201,169,110,0.4)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 0,
  },

  // Fret Grid
  fretGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '0 12px',
  },
  fretRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '12px',
    border: 'none',
    borderLeft: '3px solid',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    color: 'inherit',
    width: '100%',
  },
  fretNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  fretInfo: {
    flex: 1,
    minWidth: 0,
  },
  fretTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  fretName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  fretStage: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  currentBadge: {
    color: '#4ade80',
    fontSize: '0.6rem',
    animation: 'pulse 2s infinite',
  },
  pillarRow: {
    display: 'flex',
    gap: '6px',
  },
  pillarGroup: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  pillarIcon: {
    fontSize: '0.65rem',
    flexShrink: 0,
  },
  pillarTrack: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  pillarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
    opacity: 0.7,
  },

  // Percentage column
  fretPct: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
    minWidth: '50px',
    justifyContent: 'flex-end',
  },
  pctValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    fontWeight: 600,
  },

  // Legend
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    marginTop: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendIcon: { fontSize: '0.8rem' },
  legendLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.05em',
  },
};
