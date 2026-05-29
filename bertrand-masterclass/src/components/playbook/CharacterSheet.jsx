import React, { useMemo, useRef } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { useAuth } from '../../hooks/useAuth';
import {
  getBardTitle, getXpForNextLevel, CORE_STATS, computeStatValue,
  INTERVAL_BADGES, MASTERY_LEVELS, getIntervalMastery,
  TROUBADOUR_TYPES, computeTroubadourProfile,
} from '../../data/playbookData';

// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : CharacterSheet.jsx                                    ║
// ║ P · Perspective  : Student identity — shows who the student    ║
// ║                    is becoming through their practice journey   ║
// ║ E · Engineering  : Renders Bard Level, stats, interval badges, ║
// ║                    and Troubadour Type profile from traction    ║
// ║ A · Aesthetic    : Dark parchment, gold accents, esoteric bard ║
// ║ R · Research     : docs/03_TROUBADOUR.md §Four Troubadour Types║
// ║ L · Layout       : Used by: PlaybookShell                      ║
// ║                    Uses: playbookData, useScaffolding, useLocale║
// ╠═════════════════════════════════════════════════════════════════╣
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                      ║
// ║ IP      : No Florins, no Great Game stats, no Trinity Channels  ║
// ║ RULES   : Troubadour Types are the identity system — not CAGED ║
// ║ FIX AT  : playbookData.js → computeTroubadourProfile           ║
// ╚═════════════════════════════════════════════════════════════════╝

export default function CharacterSheet() {
  const { traction, updateTraction, bardLevel, practiceMinutes, streak, breathingSessions, userId } = useScaffolding();
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const lang = locale;

  const title = getBardTitle(bardLevel, lang);
  const xpCurrent = traction.xp || 0;
  const xpNext = getXpForNextLevel(bardLevel);
  const xpProgress = xpNext > 0 ? Math.min(1, xpCurrent / xpNext) : 1;
  const completedFrets = Object.values(traction.frets || {}).filter(f => (f.traction || 0) >= 60).length;

  // Badge system — interval mastery from Adventure
  const intervalMastery = useMemo(() => getIntervalMastery(), []);
  const profile = useMemo(() => computeTroubadourProfile(traction), [traction]);
  const overriddenType = useMemo(() => 
    traction.troubadourTypeOverride ? TROUBADOUR_TYPES.find(t => t.id === traction.troubadourTypeOverride) : null
  , [traction.troubadourTypeOverride]);
  const displayType = overriddenType || profile.dominantType;

  // Use Google user data when logged in, fallback to localStorage profile
  const isLoggedIn = !!userId;
  const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const googleAvatar = user?.user_metadata?.avatar_url;
  const studentName = (() => {
    if (googleName) return googleName;
    try { return localStorage.getItem('active_student_profile') || t('adventurer'); }
    catch { return t('adventurer'); }
  })();

  const fileInputRef = useRef(null);

  const handleExport = () => {
    const saveState = {
      version: 1,
      timestamp: new Date().toISOString(),
      bard_traction: localStorage.getItem('bard_traction'),
      voix_vive_dag_progress: localStorage.getItem('voix_vive_dag_progress'),
      voix_vive_adventure_session: localStorage.getItem('voix_vive_adventure_session')
    };
    
    const blob = new Blob([JSON.stringify(saveState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_journal.voixvive`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveState = JSON.parse(e.target.result);
        if (saveState.bard_traction) localStorage.setItem('bard_traction', saveState.bard_traction);
        if (saveState.voix_vive_dag_progress) localStorage.setItem('voix_vive_dag_progress', saveState.voix_vive_dag_progress);
        if (saveState.voix_vive_adventure_session) localStorage.setItem('voix_vive_adventure_session', saveState.voix_vive_adventure_session);
        
        // Reload to rehydrate state from localStorage
        window.location.reload();
      } catch (err) {
        alert(lang === 'fr' ? 'Fichier de sauvegarde invalide.' : 'Invalid save file.');
        console.error("Failed to parse save file:", err);
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={styles.sheet}>
      {/* Header — Name & Level */}
      <div style={styles.header}>
        <div style={styles.portrait}>
          {googleAvatar ? (
            <img
              src={googleAvatar}
              alt={studentName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span style={styles.portraitEmoji}>🎸</span>
          )}
        </div>
        <div style={styles.headerText}>
          <h2 style={styles.name}>{studentName}</h2>
          <p style={styles.title}>
            Lv.{bardLevel} — {title}
          </p>
          {isLoggedIn && (
            <p style={styles.cloudStatus}>☁️ {t('synced') || 'Cloud sync active'}</p>
          )}
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
          <span style={styles.quickLabel}>{t('streakLabel')}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>⏱️</span>
          <span style={styles.quickValue}>{practiceMinutes}</span>
          <span style={styles.quickLabel}>{t('minLabel')}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>🫁</span>
          <span style={styles.quickValue}>{breathingSessions}</span>
          <span style={styles.quickLabel}>{t('breathsLabel')}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickIcon}>🏔️</span>
          <span style={styles.quickValue}>{completedFrets}/12</span>
          <span style={styles.quickLabel}>{t('questsLabel')}</span>
        </div>
      </div>

      {/* Stat Block — 5 Core Abilities */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          {t('abilities')}
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
          {t('intervalMastery')}
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

      {/* Troubadour Type — Four Archetypes */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          {lang === 'fr' ? 'Type de Troubadour' : 'Troubadour Type'}
        </h3>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <select 
            value={traction.troubadourTypeOverride || ''}
            onChange={(e) => updateTraction({ troubadourTypeOverride: e.target.value || null })}
            style={styles.typeSelector}
          >
            <option value="">{lang === 'fr' ? 'Détection automatique' : 'Auto-detect'}</option>
            {TROUBADOUR_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name[lang]}
              </option>
            ))}
          </select>
        </div>
        {displayType && (
          <p style={styles.emergentClass}>
            {displayType.icon} {displayType.name[lang]}
            {overriddenType && <span style={styles.overrideBadge}>{lang === 'fr' ? ' (Choisi)' : ' (Chosen)'}</span>}
          </p>
        )}
        <div style={styles.attunementGrid}>
          {TROUBADOUR_TYPES.map(type => {
            const val = profile[type.id] || 0;
            return (
              <div key={type.id} style={styles.attunementRow}>
                <span style={styles.attunementIcon}>{type.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.attunementLabelRow}>
                    <span style={{ ...styles.attunementLabel, color: type.color }}>
                      {type.name[lang]}
                    </span>
                    <span style={styles.attunementPct}>{Math.round(val * 100)}%</span>
                  </div>
                  <div style={styles.attunementTrack}>
                    <div style={{
                      ...styles.attunementFill,
                      width: `${val * 100}%`,
                      background: type.color,
                      boxShadow: `0 0 8px ${type.color}40`,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Card System */}
      <div style={{ ...styles.statBlock, marginTop: '32px' }}>
        <h3 style={styles.statBlockTitle}>
          {lang === 'fr' ? 'Le Journal du Troubadour' : "The Troubadour's Journal"}
        </h3>
        <p style={{ ...styles.subtitle, textAlign: 'center', marginBottom: '16px', opacity: 0.6, fontSize: '0.65rem', textTransform: 'none', letterSpacing: 'normal', fontFamily: "'Inter', sans-serif" }}>
          {lang === 'fr' 
            ? "Vous êtes le seul propriétaire de vos données. Sauvegardez votre journal localement pour ne pas perdre votre progression."
            : "You are the sole owner of your data. Download your journal to safely backup your progress."}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleExport}
            style={styles.saveButton}
          >
            💾 {lang === 'fr' ? 'Sceller le Journal' : 'Seal the Journal'}
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={styles.loadButton}
          >
            📜 {lang === 'fr' ? 'Présenter le Journal' : 'Present your Journal'}
          </button>
          <input 
            type="file" 
            accept=".voixvive,.json"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: 'none' }}
          />
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
  cloudStatus: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: '#4ade80',
    letterSpacing: '0.08em',
    margin: '4px 0 0',
    opacity: 0.8,
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
  typeSelector: {
    background: 'rgba(0,0,0,0.3)',
    color: '#e0d0aa',
    border: '1px solid rgba(201,169,110,0.3)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  overrideBadge: {
    fontSize: '0.75rem',
    fontStyle: 'normal',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'JetBrains Mono', monospace",
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
  saveButton: {
    padding: '10px 16px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.3)',
    color: '#e0d0aa',
    borderRadius: '8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loadButton: {
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};
