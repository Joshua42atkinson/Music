import React from 'react';
import { useScaffolding } from './ScaffoldingProvider';
import { getBardicTitle, getMasteryStars } from '../data/bardicTitles';
import { FRET_METADATA } from '../data/dag/dagNodes';
import CapstoneCard from './CapstoneCard';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TroubadourLoom.jsx                                   ║
// ║ WHAT    : The student's musical identity page.                 ║
// ║ WHERE   : The Player portal (MentorTools)                     ║
// ║ WHY     : Surfaces existing RPG-like state as identity,       ║
// ║           not game. The student BECOMES the Troubadour.        ║
// ╚════════════════════════════════════════════════════════════════╝

export default function TroubadourLoom() {
  const { traction, completedNodes } = useScaffolding();

  const bardLevel = traction?.bardLevel || 1;
  const title = getBardicTitle(bardLevel);
  const totalTraction = traction?.totalTraction || 0;
  const maxTraction = 1200; // 12 frets × 100

  // Gather fret data for myelination map
  const frets = traction?.frets || {};
  const fretStates = Array.from({ length: 12 }, (_, i) => {
    const fid = i + 1;
    const f = frets[fid] || {};
    const meta = FRET_METADATA[fid] || {};
    return {
      id: fid,
      note: meta.note || `Fret ${fid}`,
      interval: meta.interval || '',
      color: meta.color || '#666',
      traction: f.traction || 0,
      beMastery: f.beMastery || 0,
      doMastery: f.doMastery || 0,
      playMastery: f.playMastery || 0,
      resonance: (f.beResonance && f.doResonance && f.playResonance) || false,
      completed: f.beCompleted && f.doCompleted && f.playCompleted,
    };
  });

  // Practice stats
  const practiceLog = JSON.parse(localStorage.getItem('voixvive_practice_log') || '[]');
  const totalMinutes = practiceLog.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalSessions = practiceLog.length;
  const streak = calculateStreak(practiceLog);

  return (
    <div style={styles.container}>
      {/* ── Identity Header ── */}
      <div style={styles.identityCard}>
        <div style={styles.levelBadge}>Level {bardLevel} of 12</div>
        <h1 style={styles.title}>{title.title}</h1>
        <p style={styles.epithet}>{title.epithet}</p>
        <p style={styles.description}>{title.description}</p>
        <div style={styles.giftRow}>
          <span style={styles.giftLabel}>Skill:</span>
          <span style={styles.giftValue}>{title.gift}</span>
        </div>
      </div>

      {/* ── Myelination Map ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Myelination Map</h2>
        <p style={styles.sectionSubtitle}>
          Each fret lights up as you practice. This is your musical memory forming — one interval at a time.
        </p>
        <div style={styles.neckMap}>
          {fretStates.map(fret => (
            <div key={fret.id} style={styles.fretColumn}>
              <div
                style={{
                  ...styles.fretNode,
                  background: fret.completed
                    ? `radial-gradient(circle at 50% 40%, ${fret.color}40 0%, ${fret.color}15 40%, transparent 100%)`
                    : `radial-gradient(circle at 50% 40%, ${fret.color}15 0%, transparent 70%)`,
                  borderColor: fret.completed ? fret.color : 'rgba(255,255,255,0.08)',
                  boxShadow: fret.resonance
                    ? `0 0 20px ${fret.color}30`
                    : 'none',
                }}
              >
                <span style={styles.fretNote}>{fret.note}</span>
                <span style={styles.fretInterval}>{fret.interval}</span>
                {fret.resonance && <span style={styles.resonanceRing}>◈</span>}
              </div>
              <div style={styles.fretTraction}>
                <div
                  style={{
                    ...styles.tractionFill,
                    width: `${fret.traction}%`,
                    background: fret.color,
                  }}
                />
              </div>
              <span style={styles.fretNumber}>{fret.id}</span>
            </div>
          ))}
        </div>
        <div style={styles.legend}>
          <span style={styles.legendItem}>○ Fret</span>
          <span style={styles.legendItem}>● Lit</span>
          <span style={styles.legendItem}>◈ Resonance</span>
        </div>
      </div>

      {/* ── Practice Stats ── */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Practice" value={`${totalMinutes} min`} icon="⏱️" />
        <StatCard label="Sessions" value={totalSessions} icon="🎸" />
        <StatCard label="Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`} icon="🔥" />
        <StatCard label="Traction" value={`${Math.round((totalTraction / maxTraction) * 100)}%`} icon="⚡" />
      </div>

      {/* ── The Capstone ── */}
      <CapstoneCard traction={traction} />

      {/* ── Mentor Hooks ── */}
      <div style={styles.mentorSection}>
        <h2 style={styles.sectionTitle}>Mentor Sessions</h2>
        <p style={styles.sectionSubtitle}>
          All tools, practice sessions, and progress tracking are free. These are optional paid interactions with Bertrand.
        </p>
        <div style={styles.mentorCards}>
          <MentorCard
            title="Quick Audio Critique"
            price="$5"
            description="3-minute question or clip. Fast text feedback within 24 hours."
            cta="Ask a Question"
          />
          <MentorCard
            title="Async Video Review"
            price="$45"
            description="15-minute structured practice block. Bertrand reviews your playing and records a personal response overlay."
            cta="Submit Practice Video"
          />
          <MentorCard
            title="Bertrand Approved Capstone"
            price="$100"
            description="20-minute capstone audition. 3 original songs + somatic reflection + voice integration. Certificate + personalized curriculum."
            cta="View Capstone Requirements"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statIcon}>{icon}</span>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

function MentorCard({ title, price, description, cta }) {
  return (
    <div style={styles.mentorCard}>
      <div style={styles.mentorHeader}>
        <h3 style={styles.mentorTitle}>{title}</h3>
        <span style={styles.mentorPrice}>{price}</span>
      </div>
      <p style={styles.mentorDesc}>{description}</p>
      <button style={styles.mentorCta}>{cta}</button>
    </div>
  );
}

function calculateStreak(log) {
  if (!log.length) return 0;
  const dates = [...new Set(log.map(e => new Date(e.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let checkDate = dates[0] === today ? today : yesterday;
  for (const d of dates) {
    if (d === checkDate) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
    } else break;
  }
  return streak;
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: '0 auto',
    color: '#e8edf2',
    fontFamily: "'Inter', sans-serif",
  },
  identityCard: {
    background: 'linear-gradient(135deg, rgba(96,165,250,0.08) 0%, rgba(167,139,250,0.08) 100%)',
    border: '1px solid rgba(96,165,250,0.2)',
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  levelBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: '#60a5fa',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2rem',
    color: '#f0e6d2',
    margin: '0 0 8px',
  },
  epithet: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    color: '#c9a96e',
    margin: '0 0 12px',
  },
  description: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    maxWidth: 520,
    margin: '0 auto 16px',
  },
  giftRow: {
    marginTop: 8,
  },
  giftLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginRight: 8,
  },
  giftValue: {
    fontSize: '0.85rem',
    color: 'rgba(52,211,153,0.9)',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    color: '#f0e6d2',
    margin: '0 0 8px',
  },
  sectionSubtitle: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0 16px',
  },
  neckMap: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  fretColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  fretNode: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.3s',
  },
  fretNote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.85rem',
    color: '#f0e6d2',
    fontWeight: 600,
  },
  fretInterval: {
    fontSize: '0.55rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  resonanceRing: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: '0.9rem',
    color: '#fbbf24',
  },
  fretTraction: {
    width: 4,
    height: 40,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  tractionFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 2,
    transition: 'height 0.5s ease',
    opacity: 0.7,
  },
  fretNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.3)',
  },
  legend: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
  },
  legendItem: {},
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statIcon: {
    fontSize: '1.2rem',
  },
  statValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    color: '#f0e6d2',
  },
  statLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  mentorSection: {
    marginBottom: 24,
  },
  mentorCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 12,
  },
  mentorCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 20,
  },
  mentorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mentorTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    color: '#f0e6d2',
    margin: 0,
  },
  mentorPrice: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9rem',
    color: '#c9a96e',
  },
  mentorDesc: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    margin: '0 0 12px',
  },
  mentorCta: {
    width: '100%',
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
  },
};
