import React, { useMemo } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import {
  getBardTitle, getXpForNextLevel, CORE_STATS, computeStatValue,
  INTERVAL_BADGES, MASTERY_LEVELS, getIntervalMastery,
  CHANNEL_ATTUNEMENTS, computeAttunement,
} from '../../data/playbookData';

// ═══════════════════════════════════════════════════════════
// CHARACTER SHEET — D&D-style stat block
// Bard Level, title, 5 core stats, XP bar, streak, florins.
// Styled like a dark parchment character sheet.
// ═══════════════════════════════════════════════════════════

export default function CharacterSheet() {
  const { traction, bardLevel, practiceMinutes, streak, breathingSessions } = useScaffolding();
  const { isFrench } = useLocale();
  const lang = isFrench ? 'fr' : 'en';

  const title = getBardTitle(bardLevel, lang);
  const xpCurrent = traction.xp || 0;
  const xpNext = getXpForNextLevel(bardLevel);
  const xpProgress = xpNext > 0 ? Math.min(1, xpCurrent / xpNext) : 1;
  const florins = traction.florins || 0;
  const completedFrets = Object.values(traction.frets || {}).filter(f => (f.traction || 0) >= 60).length;

  // Badge system — interval mastery from Adventure
  const intervalMastery = useMemo(() => getIntervalMastery(), []);
  const attunement = useMemo(() => computeAttunement(traction), [traction]);

  const studentName = (() => {
    try { return localStorage.getItem('active_student_profile') || (isFrench ? 'Aventurier' : 'Adventurer'); }
    catch { return isFrench ? 'Aventurier' : 'Adventurer'; }
  })();

  return (
    <div style={styles.sheet}>
      {/* Header — Name & Level */}
      <div style={styles.header}>
        <div style={styles.portrait}>
          <span style={styles.portraitEmoji}>🎸</span>
        </div>
        <div style={styles.headerText}>
          <h2 style={styles.name}>{studentName}</h2>
          <p style={styles.title}>
            Lv.{bardLevel} — {title}
          </p>
        </div>
      </div>

      {/* XP Bar */}
      <div style={styles.xpSection}>
        <div style={styles.xpLabelRow}>
          <span style={styles.xpLabel}>XP</span>
          <span style={styles.xpNumbers}>{xpCurrent} / {xpNext}</span>
        </div>
        <div style={styles.xpTrack}>
          <div style={{ ...styles.xpFill, width: `${xpProgress * 100}%` }} />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={styles.quickStats}>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>🔥</span>
          <span style={styles.quickValue}>{streak}</span>
          <span style={styles.quickLabel}>{isFrench ? 'Série' : 'Streak'}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>⏱️</span>
          <span style={styles.quickValue}>{practiceMinutes}</span>
          <span style={styles.quickLabel}>{isFrench ? 'Min' : 'Min'}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>🫁</span>
          <span style={styles.quickValue}>{breathingSessions}</span>
          <span style={styles.quickLabel}>{isFrench ? 'Souffles' : 'Breaths'}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>⚜️</span>
          <span style={styles.quickValue}>{florins}</span>
          <span style={styles.quickLabel}>{isFrench ? 'Florins' : 'Florins'}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>🏔️</span>
          <span style={styles.quickValue}>{completedFrets}/12</span>
          <span style={styles.quickLabel}>{isFrench ? 'Quêtes' : 'Quests'}</span>
        </div>
      </div>

      {/* Stat Block — 5 Core Abilities */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          {isFrench ? '── COMPÉTENCES ──' : '── ABILITIES ──'}
        </h3>
        <div style={styles.statsGrid}>
          {CORE_STATS.map(stat => {
            const value = computeStatValue(stat.id, traction);
            const statName = stat.name[lang] || stat.name.en;
            return (
              <div key={stat.id} style={styles.statCard}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <span style={styles.statValue}>{value}</span>
                <span style={styles.statName}>{statName}</span>
                <div style={styles.statBar}>
                  <div style={{ ...styles.statBarFill, width: `${(value / 20) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interval Mastery Badges */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          {isFrench ? '── MAÎTRISE DES INTERVALLES ──' : '── INTERVAL MASTERY ──'}
        </h3>
        <div style={styles.badgeGrid}>
          {INTERVAL_BADGES.map(badge => {
            const level = intervalMastery[badge.id] || 'none';
            const masteryDef = MASTERY_LEVELS.find(m => m.id === level);
            const isLocked = level === 'none';
            return (
              <div key={badge.id} style={{
                ...styles.badgeCard,
                borderColor: isLocked ? 'rgba(255,255,255,0.06)' : `${badge.color}40`,
                background: isLocked ? 'rgba(255,255,255,0.02)' : `${badge.color}0a`,
                opacity: isLocked ? 0.45 : 1,
              }}>
                <span style={{ ...styles.badgeSymbol, color: isLocked ? '#3a3a4a' : badge.color }}>
                  {badge.symbol}
                </span>
                <span style={{ ...styles.badgeNote, color: isLocked ? '#3a3a4a' : '#e8edf2' }}>
                  {badge.note}
                </span>
                <span style={{ ...styles.badgeInterval, color: isLocked ? '#2a2a3a' : 'rgba(255,255,255,0.5)' }}>
                  {badge.interval[lang]}
                </span>
                <span style={{ ...styles.badgeRatio, color: isLocked ? '#2a2a3a' : `${badge.color}80` }}>
                  {badge.ratio}
                </span>
                {masteryDef && (
                  <span style={{ ...styles.badgeMastery, color: masteryDef.color }}>
                    {masteryDef.icon} {masteryDef.stars}
                  </span>
                )}
                {isLocked && <span style={styles.badgeLock}>🔒</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Attunement — Trinity's Four Channels */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          {isFrench ? '── ACCORD DES CANAUX ──' : '── CHANNEL ATTUNEMENT ──'}
        </h3>
        <p style={styles.emergentClass}>
          {attunement.emergentClass[lang]}
        </p>
        <div style={styles.attunementGrid}>
          {CHANNEL_ATTUNEMENTS.map(ch => {
            const val = attunement[ch.id] || 0;
            return (
              <div key={ch.id} style={styles.attunementRow}>
                <span style={{ ...styles.attunementIcon }}>{ch.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.attunementLabelRow}>
                    <span style={{ ...styles.attunementLabel, color: ch.color }}>
                      {ch.channel[lang]}
                    </span>
                    <span style={styles.attunementPct}>{Math.round(val * 100)}%</span>
                  </div>
                  <div style={styles.attunementTrack}>
                    <div style={{
                      ...styles.attunementFill,
                      width: `${val * 100}%`,
                      background: ch.color,
                      boxShadow: `0 0 8px ${ch.color}40`,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  sheet: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    color: '#e8edf2',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 100%)',
    border: '1px solid rgba(201,169,110,0.2)',
  },
  portrait: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(201,169,110,0.1)',
    border: '2px solid rgba(201,169,110,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  portraitEmoji: { fontSize: '1.8rem' },
  headerText: { flex: 1 },
  name: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.6rem',
    fontWeight: 600,
    margin: '0 0 2px',
    color: '#f0e6d2',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    color: '#c9a96e',
    letterSpacing: '0.1em',
    margin: 0,
  },
  xpSection: { marginBottom: '20px' },
  xpLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  xpLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.6)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
  xpNumbers: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
  },
  xpTrack: {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #c9a96e, #e0d0aa)',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 8px rgba(201,169,110,0.4)',
  },
  quickStats: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  quickStat: {
    flex: '1 1 0',
    minWidth: '60px',
    padding: '10px 6px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  quickIcon: { fontSize: '1.1rem' },
  quickValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f0e6d2',
  },
  quickLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  statBlock: { marginBottom: '20px' },
  statBlockTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.5)',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statCard: {
    display: 'grid',
    gridTemplateColumns: '32px 36px 1fr',
    gridTemplateRows: 'auto auto',
    alignItems: 'center',
    gap: '0 10px',
    padding: '12px 14px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statIcon: {
    fontSize: '1.2rem',
    gridRow: '1 / 3',
    textAlign: 'center',
  },
  statValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#c9a96e',
  },
  statName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
  },
  statBar: {
    gridColumn: '2 / 4',
    height: '3px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginTop: '4px',
  },
  statBarFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, rgba(201,169,110,0.6), rgba(201,169,110,0.3))',
    transition: 'width 0.5s ease',
  },
  // Badge grid
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '8px',
  },
  badgeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '12px 6px 10px',
    borderRadius: '12px',
    border: '1px solid',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  badgeSymbol: { fontSize: '1.4rem', lineHeight: 1 },
  badgeNote: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  badgeInterval: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.5rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  badgeRatio: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
  },
  badgeMastery: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    marginTop: '2px',
  },
  badgeLock: { fontSize: '0.7rem', marginTop: '2px' },
  // Attunement
  emergentClass: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    fontWeight: 400,
    color: '#e0d0aa',
    textAlign: 'center',
    marginBottom: '16px',
    fontStyle: 'italic',
  },
  attunementGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  attunementRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  attunementIcon: { fontSize: '1rem', width: '24px', textAlign: 'center' },
  attunementLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  attunementLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  attunementPct: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.35)',
  },
  attunementTrack: {
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  attunementFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
};
