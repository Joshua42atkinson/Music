import React from 'react';
import { getCertificationStatus, getNextCertificationGoal, CERTIFICATION_TIERS } from '../data/certification';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : CapstoneCard.jsx                                     ║
// ║ WHAT    : The $100 capstone audition call-to-action            ║
// ║ WHERE   : TroubadourLoom, Player Portal                        ║
// ║ WHY     : Transforms mastery into credential. The student     ║
// ║           becomes the teacher through demonstration.           ║
// ╚════════════════════════════════════════════════════════════════╝

export default function CapstoneCard({ traction }) {
  const status = getCertificationStatus(traction);
  const goal = getNextCertificationGoal(traction);
  const tier = CERTIFICATION_TIERS[goal.tier];

  const isEligible = goal.eligible || false;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.crown}>👑</span>
        <h2 style={styles.title}>The Troubadour's Trial</h2>
        <p style={styles.epithet}>{tier.epithet}</p>
        <p style={styles.subtitle}>{tier.description}</p>
      </div>

      {/* Progress */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${(status.progress.completedFrets / 12) * 100}%`,
          }}
        />
      </div>
      <div style={styles.progressLabel}>
        {status.progress.completedFrets} / 12 frets · {status.progress.highMasteryCount} high masteries
      </div>

      <p style={styles.freeNote}>
        All tiers unlock for free as you practice. Optional: submit your audition to Bertrand for review.
      </p>

      {/* Current Goal */}
      {!isEligible && (
        <div style={styles.goalBox}>
          <span style={styles.goalLabel}>Next Milestone:</span>
          <span style={styles.goalText}>{tier.name}</span>
          <p style={styles.goalDesc}>{goal.remaining}</p>
          <p style={styles.goalRequirement}>{tier.requirement}</p>
        </div>
      )}

      {/* Master Tier Details */}
      {isEligible && (
        <div style={styles.auditionDetails}>
          <h3 style={styles.auditionTitle}>Optional Capstone Review — $100</h3>
          <p style={styles.auditionDesc}>
            {CERTIFICATION_TIERS.master.audition.prompt}
          </p>

          <div style={styles.questionSection}>
            <h4 style={styles.sectionLabel}>Reflection Questions</h4>
            {CERTIFICATION_TIERS.master.audition.questions.map((q, i) => (
              <p key={i} style={styles.question}>{i + 1}. {q}</p>
            ))}
          </div>

          <div style={styles.questionSection}>
            <h4 style={styles.sectionLabel}>Required Demonstrations</h4>
            {CERTIFICATION_TIERS.master.audition.demonstrations.map((d, i) => (
              <p key={i} style={styles.demonstration}>▸ {d}</p>
            ))}
          </div>

          <div style={styles.includesBox}>
            <h4 style={styles.sectionLabel}>What You Receive</h4>
            <ul style={styles.includesList}>
              {CERTIFICATION_TIERS.master.includes.split(' + ').map((item, i) => (
                <li key={i} style={styles.includesItem}>{item}</li>
              ))}
            </ul>
          </div>

          <button style={styles.cta}>
            🎬 Begin Capstone Submission (20 min video)
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(201,169,110,0.06) 100%)',
    border: '1px solid rgba(251,191,36,0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  crown: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.5rem',
    color: '#fbbf24',
    margin: '0 0 6px',
  },
  epithet: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    color: '#c9a96e',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 480,
  },
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #fbbf24, #c9a96e)',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  progressLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    marginBottom: 8,
  },
  freeNote: {
    fontSize: '0.75rem',
    color: 'rgba(52,211,153,0.7)',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  goalBox: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  goalLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginRight: 6,
  },
  goalText: {
    fontSize: '0.9rem',
    color: '#f0e6d2',
    fontWeight: 600,
  },
  goalDesc: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    margin: '6px 0',
  },
  goalRequirement: {
    fontSize: '0.75rem',
    color: 'rgba(96,165,250,0.7)',
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
  },
  auditionDetails: {
    marginTop: 12,
  },
  auditionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    color: '#f0e6d2',
    margin: '0 0 10px',
  },
  auditionDesc: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    margin: '0 0 14px',
    fontStyle: 'italic',
  },
  questionSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    margin: '0 0 8px',
  },
  question: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 6px',
    paddingLeft: 12,
    borderLeft: '2px solid rgba(96,165,250,0.3)',
    lineHeight: 1.4,
  },
  demonstration: {
    fontSize: '0.8rem',
    color: 'rgba(52,211,153,0.8)',
    margin: '0 0 4px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  includesBox: {
    background: 'rgba(52,211,153,0.06)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    border: '1px solid rgba(52,211,153,0.15)',
  },
  includesList: {
    margin: 0,
    paddingLeft: 18,
  },
  includesItem: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  cta: {
    width: '100%',
    padding: '14px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #fbbf24, #c9a96e)',
    color: '#050508',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
};
