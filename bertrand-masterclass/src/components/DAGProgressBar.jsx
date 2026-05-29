import React from 'react';
import { useScaffolding } from './ScaffoldingProvider';
import { dagNodes, FRET_METADATA } from '../data/dag/dagNodes';
import { isNodeUnlocked } from '../data/dag/dagEdges';

// ═══════════════════════════════════════════════════════════
// DAG PROGRESS BAR — Visual 12-fret journey tracker
// Purely graph-based. No AI required. Works offline.
// ═══════════════════════════════════════════════════════════

const PHASE_COLORS = {
  be: '#60a5fa',      // blue — imagination
  do: '#a78bfa',      // purple — hearing
  play: '#34d399',    // green — playing
  milestone: '#fbbf24', // amber — celebration
  reflection: '#f472b6', // pink — journal
};

const PILLAR_ICONS = {
  class: '📚',
  guitar: '🎸',
  workbook: '📝',
};

export default function DAGProgressBar() {
  const { completedNodes, currentNodeId, currentFret, currentPhase } = useScaffolding();

  // Overall progress
  const totalNodes = dagNodes.length;
  const completedCount = completedNodes.length;
  const overallPercentage = Math.round((completedCount / totalNodes) * 100);

  // Fret progress
  const fretProgress = React.useMemo(() => {
    const progress = {};
    for (let fret = 1; fret <= 12; fret++) {
      const fretNodes = dagNodes.filter(n => n.fret === fret);
      const completed = fretNodes.filter(n => completedNodes.includes(n.id));
      progress[fret] = {
        total: fretNodes.length,
        completed: completed.length,
        percentage: fretNodes.length > 0 ? Math.round((completed.length / fretNodes.length) * 100) : 0,
        isComplete: completed.length === fretNodes.length && fretNodes.length > 0,
      };
    }
    return progress;
  }, [completedNodes]);

  // Pillar progress
  const pillarProgress = React.useMemo(() => {
    const pillars = ['class', 'guitar', 'workbook'];
    return pillars.reduce((acc, pillar) => {
      const pillarNodes = dagNodes.filter(n => n.pillar === pillar);
      const completed = pillarNodes.filter(n => completedNodes.includes(n.id));
      acc[pillar] = {
        total: pillarNodes.length,
        completed: completed.length,
        percentage: pillarNodes.length > 0 ? Math.round((completed.length / pillarNodes.length) * 100) : 0,
      };
      return acc;
    }, {});
  }, [completedNodes]);

  return (
    <div className="dag-progress-bar" style={styles.container}>
      {/* Overall Progress */}
      <div style={styles.overallSection}>
        <div style={styles.overallHeader}>
          <span style={styles.title}>Your 12-Fret Journey</span>
          <span style={styles.percentage}>{overallPercentage}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${overallPercentage}%`,
              background: overallPercentage === 100
                ? 'linear-gradient(90deg, #34d399, #60a5fa)'
                : 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            }}
          />
        </div>
        <div style={styles.statsRow}>
          <span>{completedCount} / {totalNodes} nodes</span>
          <span>{12 - Object.values(fretProgress).filter(f => f.isComplete).length} frets remaining</span>
        </div>
      </div>

      {/* Fret Map — Horizontal timeline */}
      <div style={styles.fretMap}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => {
          const meta = FRET_METADATA[fret];
          const progress = fretProgress[fret];
          const isCurrent = fret === currentFret;
          const isLocked = !progress.isComplete && fret > 1 && !fretProgress[fret - 1]?.isComplete;

          return (
            <div
              key={fret}
              style={{
                ...styles.fretNode,
                ...(isCurrent ? styles.currentFret : {}),
                ...(progress.isComplete ? styles.completeFret : {}),
                ...(isLocked ? styles.lockedFret : {}),
              }}
            >
              <div style={styles.fretNumber}>{fret}</div>
              <div style={styles.fretInterval}>{meta?.interval?.split(' ')[0]}</div>
              <div style={styles.fretCharacter}>{meta?.character}</div>
              {progress.isComplete && <div style={styles.checkmark}>✓</div>}
              {isCurrent && <div style={styles.pulseRing} />}
              {isLocked && <div style={styles.lockIcon}>🔒</div>}
            </div>
          );
        })}
      </div>

      {/* Pillar Progress */}
      <div style={styles.pillarSection}>
        <div style={styles.pillarTitle}>Three Pillars</div>
        <div style={styles.pillarGrid}>
          {['class', 'guitar', 'workbook'].map(pillar => {
            const prog = pillarProgress[pillar];
            return (
              <div key={pillar} style={styles.pillarCard}>
                <div style={styles.pillarIcon}>{PILLAR_ICONS[pillar]}</div>
                <div style={styles.pillarName}>
                  {pillar === 'class' ? 'The Song' : pillar === 'guitar' ? 'The Guitar' : 'The Player'}
                </div>
                <div style={styles.pillarPercent}>{prog.percentage}%</div>
                <div style={styles.miniTrack}>
                  <div
                    style={{
                      ...styles.miniFill,
                      width: `${prog.percentage}%`,
                      background: PHASE_COLORS[pillar === 'class' ? 'be' : pillar === 'guitar' ? 'play' : 'reflection'],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Node Indicator */}
      {currentNodeId && (
        <div style={styles.currentNodeSection}>
          <div style={styles.currentLabel}>Current Focus</div>
          <div style={styles.currentNodeCard}>
            <div style={styles.currentPhaseBadge}>
              <span style={{ color: PHASE_COLORS[currentPhase] || '#fff' }}>●</span>
              {' '}{currentPhase?.toUpperCase()}
            </div>
            <div style={styles.currentNodeName}>
              {dagNodes.find(n => n.id === currentNodeId)?.title || currentNodeId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ──
const styles = {
  container: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 20,
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    maxWidth: 600,
    margin: '0 auto',
  },
  overallSection: {
    marginBottom: 20,
  },
  overallHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  percentage: {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  progressTrack: {
    height: 8,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.5s ease',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  fretMap: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    overflowX: 'auto',
    paddingBottom: 8,
  },
  fretNode: {
    position: 'relative',
    minWidth: 60,
    height: 80,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
  },
  currentFret: {
    border: '2px solid #60a5fa',
    boxShadow: '0 0 12px rgba(96,165,250,0.3)',
  },
  completeFret: {
    background: 'rgba(52,211,153,0.15)',
    border: '1px solid rgba(52,211,153,0.4)',
  },
  lockedFret: {
    opacity: 0.4,
  },
  fretNumber: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: 2,
  },
  fretInterval: {
    fontSize: '0.55rem',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  fretCharacter: {
    fontSize: '0.5rem',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: '0.7rem',
  },
  pulseRing: {
    position: 'absolute',
    inset: -2,
    borderRadius: 10,
    border: '2px solid #60a5fa',
    animation: 'pulse 2s infinite',
  },
  lockIcon: {
    position: 'absolute',
    fontSize: '0.8rem',
    opacity: 0.5,
  },
  pillarSection: {
    marginBottom: 16,
  },
  pillarTitle: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  pillarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  pillarCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  pillarIcon: {
    fontSize: '1.5rem',
    marginBottom: 4,
  },
  pillarName: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  pillarPercent: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: 4,
  },
  miniTrack: {
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.5s ease',
  },
  currentNodeSection: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  currentLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  currentNodeCard: {
    background: 'rgba(96,165,250,0.1)',
    borderRadius: 8,
    padding: 12,
    border: '1px solid rgba(96,165,250,0.2)',
  },
  currentPhaseBadge: {
    fontSize: '0.7rem',
    marginBottom: 4,
    fontWeight: 600,
  },
  currentNodeName: {
    fontSize: '0.9rem',
    fontWeight: 500,
  },
};
