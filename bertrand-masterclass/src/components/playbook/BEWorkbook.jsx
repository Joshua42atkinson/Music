import React, { useState, useCallback, useEffect } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { dagNodes, FRET_METADATA, getNodeById } from '../../data/dag/dagNodes';
import { isNodeUnlocked, getNextRecommendedNode } from '../../data/dag/dagEdges';
import PracticeJournal from './PracticeJournal';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : BEWorkbook.jsx                                       ║
// ║ WHAT    : Mechanical BE→DO→PLAY workbook for all 144 nodes   ║
// ║ WHY     : No AI required. Student manually checks off phases.  ║
// ║ PATTERN : Based on CharacterSheet badge grid + stat blocks     ║
// ╚════════════════════════════════════════════════════════════════╝

const PHASE_LABELS = {
  be: { en: 'Imagine', fr: 'Imagine' },
  do: { en: 'Hear', fr: 'Entends' },
  play: { en: 'Play', fr: 'Joue' },
};

const PHASE_COLORS = {
  be: '#60a5fa',   // blue
  do: '#a78bfa',   // purple
  play: '#34d399', // green
};

export default function BEWorkbook() {
  const {
    currentNodeId,
    currentNode,
    currentFret,
    currentPhase,
    completedNodes,
    nextRecommended,
    completePhase,
    advanceNode,
    navigateToNode,
    traction,
  } = useScaffolding();

  const [selectedFret, setSelectedFret] = useState(currentFret || 1);
  const [activeTab, setActiveTab] = useState('progress'); // 'progress' | 'journal' | 'schedule'
  const [practiceLog, setPracticeLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('voixvive_practice_log') || '[]'); }
    catch { return []; }
  });

  // Persist practice log
  useEffect(() => {
    localStorage.setItem('voixvive_practice_log', JSON.stringify(practiceLog));
  }, [practiceLog]);

  // Get nodes for selected fret
  const fretNodes = dagNodes.filter(n => n.fret === selectedFret);
  const meta = FRET_METADATA[selectedFret] || {};

  // Check if a node is completed (all phases of its fret done)
  const isNodeCompleted = useCallback((nodeId) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return false;
    const fretState = traction?.frets?.[node.fret];
    return !!(fretState?.beCompleted && fretState?.doCompleted && fretState?.playCompleted);
  }, [traction]);

  // Get phase completion from traction store (real data)
  const getPhaseStatus = useCallback((nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return false;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return false;
    return !!fretState[`${phase}Completed`];
  }, [traction]);

  // Get mastery level for a phase (0-3)
  const getMasteryLevel = useCallback((nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return 0;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return 0;
    return fretState[`${phase}Mastery`] || 0;
  }, [traction]);

  // Get cross-pillar resonance status (Day Dream synergy)
  const getResonance = useCallback((nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return false;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return false;
    return !!fretState[`${phase}Resonance`];
  }, [traction]);

  const MASTERY_STARS = ['○', '◐', '●', '★'];
  const MASTERY_LABELS = ['Encountered', 'Experienced', 'Owned', 'Mastered'];

  const handlePhaseComplete = (nodeId, phase) => {
    completePhase?.(nodeId, phase);
  };

  const handleNodeComplete = (nodeId) => {
    advanceNode?.(nodeId);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>BE → DO → PLAY Workbook</h2>
        <p style={styles.subtitle}>
          Fret {selectedFret} — {meta.interval} ({meta.character})
        </p>
      </div>

      {/* Practice Journal — wraps around the student */}
      <PracticeJournal
        traction={traction}
        nextRecommended={nextRecommended}
        completedNodes={completedNodes}
      />

      {/* Fret Selector */}
      <div style={styles.fretSelector}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => {
          const isComplete = fretNodes.every(n => completedNodes.includes(n.id));
          const isCurrent = fret === currentFret;
          const isSelected = fret === selectedFret;
          const isLocked = fret > 1 && !isNodeUnlocked(`fret-${fret}-class-be`, completedNodes);

          return (
            <button
              key={fret}
              onClick={() => !isLocked && setSelectedFret(fret)}
              style={{
                ...styles.fretButton,
                ...(isSelected ? styles.fretButtonSelected : {}),
                ...(isComplete ? styles.fretButtonComplete : {}),
                ...(isLocked ? styles.fretButtonLocked : {}),
              }}
              disabled={isLocked}
            >
              <span style={styles.fretNumber}>{fret}</span>
              {isComplete && <span style={styles.fretCheck}>✓</span>}
              {isLocked && <span style={styles.fretLock}>🔒</span>}
            </button>
          );
        })}
      </div>

      {/* Fret Info */}
      <div style={styles.fretInfo}>
        <div style={styles.fretCharacter}>{meta.character}</div>
        <div style={styles.fretDetails}>
          <span>{meta.ratio} ratio</span>
          <span>•</span>
          <span>{meta.cents} cents</span>
          <span>•</span>
          <span>{meta.hzExample}</span>
        </div>
        <div style={styles.fretEmotion}>{meta.emotion}</div>
      </div>

      {/* ── Today's Focus Card ── */}
      <TodayFocusCard
        traction={traction}
        nextRecommended={nextRecommended}
        practiceLog={practiceLog}
        onStartPractice={() => logPracticeSession(practiceLog, setPracticeLog, nextRecommended)}
      />

      {/* ── Tab Navigation ── */}
      <div style={styles.tabBar}>
        {[
          { key: 'progress', label: 'Progress', icon: '📊' },
          { key: 'journal', label: 'Practice Journal', icon: '📓' },
          { key: 'schedule', label: 'Schedule', icon: '📅' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.key ? styles.tabButtonActive : {}),
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'progress' && (
        <>
          {/* Nodes Grid */}
          <div style={styles.nodesGrid}>
        {fretNodes.map(node => {
          const isCompleted = isNodeCompleted(node.id);
          const isCurrent = node.id === currentNodeId;
          const isNext = node.id === nextRecommended;
          const isUnlocked = isNodeUnlocked(node.id, completedNodes);

          return (
            <div
              key={node.id}
              style={{
                ...styles.nodeCard,
                ...(isCompleted ? styles.nodeCompleted : {}),
                ...(isCurrent ? styles.nodeCurrent : {}),
                ...(isNext && !isCompleted ? styles.nodeNext : {}),
                ...(!isUnlocked ? styles.nodeLocked : {}),
              }}
            >
              {/* Node Header */}
              <div style={styles.nodeHeader}>
                <span style={styles.pillarIcon}>
                  {node.pillar === 'class' ? '📚' : node.pillar === 'guitar' ? '🎸' : '📝'}
                </span>
                <span style={styles.nodeType}>{node.type}</span>
                {isCompleted && <span style={styles.nodeDoneBadge}>✓ Done</span>}
                {isCurrent && <span style={styles.nodeCurrentBadge}>▶ Current</span>}
              </div>

              {/* Node Title */}
              <h3 style={styles.nodeTitle}>{node.title}</h3>
              <p style={styles.nodeDescription}>{node.description}</p>

              {/* BE → DO → PLAY Checklist with Mastery Stars */}
              <div style={styles.phaseChecklist}>
                {['be', 'do', 'play'].map(phase => {
                  const isPhaseDone = getPhaseStatus(node.id, phase);
                  const mastery = getMasteryLevel(node.id, phase);
                  const resonance = getResonance(node.id, phase);
                  const star = MASTERY_STARS[mastery];
                  const masteryLabel = MASTERY_LABELS[mastery];
                  return (
                    <label
                      key={phase}
                      style={{
                        ...styles.phaseRow,
                        ...(isPhaseDone ? styles.phaseRowDone : {}),
                        ...(resonance ? styles.phaseRowResonance : {}),
                      }}
                      title={resonance ? `${masteryLabel} — Cross-Pillar Resonance unlocked` : masteryLabel}
                    >
                      <input
                        type="checkbox"
                        checked={isPhaseDone}
                        onChange={() => isUnlocked && handlePhaseComplete(node.id, phase)}
                        disabled={!isUnlocked}
                        style={styles.phaseCheckbox}
                      />
                      <span
                        style={{
                          ...styles.phaseDot,
                          background: isPhaseDone ? PHASE_COLORS[phase] : 'transparent',
                          borderColor: resonance ? '#fbbf24' : PHASE_COLORS[phase],
                          boxShadow: resonance ? `0 0 8px ${PHASE_COLORS[phase]}80` : 'none',
                        }}
                      />
                      <span style={styles.phaseLabel}>
                        <strong>{phase.toUpperCase()}</strong>
                        {' — '}
                        {PHASE_LABELS[phase].en}
                        {resonance && (
                          <span style={{
                            fontSize: '0.65rem',
                            color: '#fbbf24',
                            marginLeft: 6,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}>
                            ⚡ Resonant
                          </span>
                        )}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: mastery === 3 ? '#c9a96e' : 'rgba(255,255,255,0.3)',
                        marginLeft: 'auto',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {star}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Mark Complete Button */}
              {isUnlocked && !isCompleted && (
                <button
                  onClick={() => handleNodeComplete(node.id)}
                  style={styles.completeButton}
                >
                  Mark Node Complete
                </button>
              )}

              {/* Locked Overlay */}
              {!isUnlocked && (
                <div style={styles.lockedOverlay}>
                  <span style={styles.lockedText}>🔒 Complete previous nodes to unlock</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

        </>
      )}

      {/* Overall Progress — calculated from phase completion, not node array */}
      {(() => {
        const completedPhases = Object.values(traction?.frets || {}).reduce((sum, f) => {
          return sum + (f.beCompleted ? 1 : 0) + (f.doCompleted ? 1 : 0) + (f.playCompleted ? 1 : 0);
        }, 0);
        // Total phases = 12 frets × 3 pillars × 3 phases = 108 (exclude 'all' phase milestones)
        const totalPhases = dagNodes.filter(n => n.phase !== 'all').length || 108;
        const percent = Math.min(100, Math.round((completedPhases / totalPhases) * 100));
        return (
          <div style={styles.overallSection}>
            <h3 style={styles.overallTitle}>Overall Progress</h3>
            <div style={styles.overallBar}>
              <div
                style={{
                  ...styles.overallFill,
                  width: `${percent}%`,
                }}
              />
            </div>
            <div style={styles.overallStats}>
              <span>{completedPhases} / {totalPhases} phases</span>
              <span>{percent}% complete</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: '0 auto',
    color: '#e8edf2',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    margin: '0 0 8px',
    color: '#f0e6d2',
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    color: '#c9a96e',
    letterSpacing: '0.08em',
    margin: 0,
  },
  fretSelector: {
    display: 'flex',
    gap: 6,
    marginBottom: 20,
    overflowX: 'auto',
    paddingBottom: 8,
  },
  fretButton: {
    position: 'relative',
    minWidth: 48,
    height: 48,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#e8edf2',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontFamily: "'JetBrains Mono', monospace",
  },
  fretButtonSelected: {
    border: '2px solid #60a5fa',
    boxShadow: '0 0 12px rgba(96,165,250,0.3)',
  },
  fretButtonComplete: {
    background: 'rgba(52,211,153,0.15)',
    borderColor: 'rgba(52,211,153,0.4)',
  },
  fretButtonLocked: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  fretNumber: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  fretCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: '0.6rem',
  },
  fretLock: {
    position: 'absolute',
    fontSize: '0.7rem',
  },
  fretInfo: {
    textAlign: 'center',
    marginBottom: 24,
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  fretCharacter: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    color: '#c9a96e',
    marginBottom: 4,
  },
  fretDetails: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  fretEmotion: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  nodesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  nodeCard: {
    position: 'relative',
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s',
  },
  nodeCompleted: {
    background: 'rgba(52,211,153,0.08)',
    borderColor: 'rgba(52,211,153,0.3)',
  },
  nodeCurrent: {
    border: '2px solid #60a5fa',
    boxShadow: '0 0 16px rgba(96,165,250,0.2)',
  },
  nodeNext: {
    border: '1px dashed rgba(96,165,250,0.5)',
  },
  nodeLocked: {
    opacity: 0.5,
  },
  nodeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pillarIcon: {
    fontSize: '1.2rem',
  },
  nodeType: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    flex: 1,
  },
  nodeDoneBadge: {
    fontSize: '0.65rem',
    color: '#34d399',
    background: 'rgba(52,211,153,0.15)',
    padding: '2px 8px',
    borderRadius: 10,
  },
  nodeCurrentBadge: {
    fontSize: '0.65rem',
    color: '#60a5fa',
    background: 'rgba(96,165,250,0.15)',
    padding: '2px 8px',
    borderRadius: 10,
  },
  nodeTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 6px',
    color: '#f0e6d2',
  },
  nodeDescription: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 12px',
    lineHeight: 1.4,
  },
  phaseChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  phaseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 8px',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  phaseRowDone: {
    background: 'rgba(255,255,255,0.06)',
  },
  phaseRowResonance: {
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.25)',
  },
  phaseCheckbox: {
    display: 'none',
  },
  phaseDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '2px solid',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  phaseLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
  },
  completeButton: {
    width: '100%',
    marginTop: 12,
    padding: '10px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.2s',
  },
  lockedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)',
  },
  lockedText: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    padding: 16,
  },
  overallSection: {
    padding: 20,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  overallTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(201,169,110,0.6)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
  },
  overallBar: {
    height: 8,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overallFill: {
    height: '100%',
    borderRadius: 4,
    background: 'linear-gradient(90deg, #60a5fa, #34d399)',
    transition: 'width 0.5s ease',
  },
  overallStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
  },
};
