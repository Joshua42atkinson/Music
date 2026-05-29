import React, { useState, useEffect } from 'react';
import { getNodeById, FRET_METADATA } from '../../data/dag/dagNodes';
import { generateDailySession } from '../../data/practiceEngine';
import { getBardicTitle } from '../../data/bardicTitles';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PracticeJournal.jsx                                  ║
// ║ WHAT    : Workbook companion — today's focus, practice log,   ║
// ║           mentor booking. Wraps around the student.            ║
// ║ WHY     : Transforms workbook from checklist to living journal. ║
// ╚════════════════════════════════════════════════════════════════╝

export default function PracticeJournal({ traction, nextRecommended, completedNodes }) {
  const [log, setLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('voixvive_practice_log') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('voixvive_practice_log', JSON.stringify(log));
  }, [log]);

  // Generate the 20-min daily session from the DAG
  const session = generateDailySession(traction, completedNodes);
  const { blocks, focusNode, title } = session;

  // Current identity
  const bardLevel = traction?.bardLevel || 1;
  const bardTitle = getBardicTitle(bardLevel);

  // Streak calculation
  const today = new Date().toDateString();
  const practicedToday = log.some(e => new Date(e.date).toDateString() === today);
  const streak = calculateStreak(log);

  // Time since last practice
  const lastEntry = log[0];
  const lastPracticeText = lastEntry
    ? formatTimeSince(new Date(lastEntry.date))
    : 'No sessions yet';

  const handleLogSession = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      nodeId: focusNode?.id || 'fret-1-class-be',
      fret: focusNode?.fret || 1,
      phase: focusNode?.phase || 'be',
      activity: focusNode?.title || 'Practice',
      duration: 20,
      status: 'logged',
    };
    setLog(prev => [entry, ...prev]);
  };

  return (
    <div style={styles.container}>
      {/* ── Today's 20-Min Session ── */}
      <div style={styles.focusCard}>
        <div style={styles.identityBar}>
          <span style={styles.identityTitle}>{bardTitle.title}</span>
          <span style={styles.identityEpithet}>{bardTitle.epithet}</span>
        </div>
        <div style={styles.focusHeader}>
          <span style={styles.focusIcon}>🎯</span>
          <span style={styles.focusLabel}>Today's 20-Minute Session</span>
          <span style={styles.streakBadge}>🔥 {streak} day{streak !== 1 ? 's' : ''}</span>
        </div>

        <h3 style={styles.focusTitle}>{title}</h3>

        {/* Session blocks */}
        <div style={styles.blocksContainer}>
          {blocks.map((block, i) => (
            <div key={i} style={styles.blockRow}>
              <span style={styles.blockIcon}>{block.icon}</span>
              <div style={styles.blockContent}>
                <div style={styles.blockHeader}>
                  <span style={styles.blockLabel}>{block.label}</span>
                  <span style={styles.blockDuration}>{block.duration} min</span>
                </div>
                <p style={styles.blockDesc}>{block.description}</p>
                {block.activities && (
                  <ul style={styles.activityList}>
                    {block.activities.map((a, j) => (
                      <li key={j} style={styles.activityItem}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.focusActions}>
          <button style={styles.primaryBtn} onClick={handleLogSession}>
            {practicedToday ? '✓ Logged Today' : 'Start 20-Min Session'}
          </button>
          <button style={styles.secondaryBtn} onClick={() => alert('Schedule feature: integrate calendarService.getAvailableSlots()')}>
            📅 Book Mentor Review
          </button>
        </div>

        <div style={styles.focusFooter}>
          <span>Last practice: {lastPracticeText}</span>
        </div>
      </div>

      {/* ── Practice Log ── */}
      {log.length > 0 && (
        <div style={styles.logSection}>
          <h4 style={styles.logTitle}>Recent Sessions</h4>
          <div style={styles.logList}>
            {log.slice(0, 7).map(entry => (
              <div key={entry.id} style={styles.logEntry}>
                <div style={styles.logDot} />
                <div style={styles.logContent}>
                  <span style={styles.logActivity}>{entry.activity}</span>
                  <span style={styles.logMeta}>
                    {new Date(entry.date).toLocaleDateString()} · {entry.duration} min
                  </span>
                </div>
                <span style={styles.logStatus}>{entry.status === 'reviewed' ? '✓' : '○'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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

function formatTimeSince(date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const styles = {
  container: {
    marginBottom: 24,
  },
  focusCard: {
    background: 'linear-gradient(135deg, rgba(96,165,250,0.08) 0%, rgba(167,139,250,0.08) 100%)',
    border: '1px solid rgba(96,165,250,0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  identityBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  identityTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    color: '#f0e6d2',
    fontWeight: 600,
  },
  identityEpithet: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.7)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  focusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  focusIcon: {
    fontSize: '1.2rem',
  },
  focusLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: '#60a5fa',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    flex: 1,
  },
  streakBadge: {
    fontSize: '0.8rem',
    color: '#fbbf24',
    background: 'rgba(251,191,36,0.1)',
    padding: '4px 10px',
    borderRadius: 12,
  },
  focusTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    color: '#f0e6d2',
    margin: '0 0 6px',
  },
  focusMeta: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(201,169,110,0.8)',
    margin: '0 0 10px',
  },
  focusDescription: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    margin: '0 0 16px',
  },
  focusActions: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
  },
  primaryBtn: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  secondaryBtn: {
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  focusFooter: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  logSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  logTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(201,169,110,0.6)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  logEntry: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#34d399',
    flexShrink: 0,
  },
  logContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  logActivity: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.8)',
  },
  logMeta: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  logStatus: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.3)',
  },
  blocksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  blockRow: {
    display: 'flex',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  blockIcon: {
    fontSize: '1.2rem',
    lineHeight: 1,
    marginTop: 2,
  },
  blockContent: {
    flex: 1,
  },
  blockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f0e6d2',
  },
  blockDuration: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.06)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  blockDesc: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 6px',
    lineHeight: 1.4,
  },
  activityList: {
    margin: 0,
    paddingLeft: 16,
    listStyle: 'disc',
  },
  activityItem: {
    fontSize: '0.75rem',
    color: 'rgba(96,165,250,0.8)',
    marginBottom: 2,
  },
};
