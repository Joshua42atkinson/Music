import React, { useMemo, useRef, useState, useEffect } from 'react';
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

  const allMilestones = Array.from({ length: 12 }, (_, i) => `fret-${i + 1}-class-milestone`);
  const completedMilestones = allMilestones.filter(mId => traction.completedNodes?.includes(mId));
  const hasCompletedCourse = completedMilestones.length === 12;

  // Multi-tiered certifications status
  const [coachingTier, setCoachingTier] = useState('free');
  const [selectedCert, setSelectedCert] = useState(null); // 'apprentice' | 'journeyman' | 'master' | null
  const [showCertModal, setShowCertModal] = useState(false);

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

  // Synchronize coaching_tier dynamically from the DaaS server
  useEffect(() => {
    const fetchTier = async () => {
      try {
        const resp = await fetch(`http://localhost:8080/api/db/profile?name=${encodeURIComponent(studentName)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.profile) {
            setCoachingTier(data.profile.coaching_tier || 'free');
          }
        }
      } catch (e) {
        console.warn('Failed to load profile tier in CharacterSheet:', e);
      }
    };
    if (studentName) {
      fetchTier();
    }
  }, [studentName]);

  const fileInputRef = useRef(null);

  const handleExport = async () => {
    await exportVoixViveFile(studentName);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importVoixViveFile(file);
      window.location.reload();
    } catch (err) {
      alert(lang === 'fr' ? 'Fichier de sauvegarde invalide.' : 'Invalid save file.');
    }
    
    // Reset file input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Determine certification lock states
  const isApprenticeUnlocked = completedFrets >= 4;
  const isJourneymanUnlocked = completedFrets >= 8 && (coachingTier === 'journeyman' || coachingTier === 'master');
  const isMasterUnlocked = completedFrets >= 12 && coachingTier === 'master';

  return (
    <div style={styles.sheet}>
      {/* Academy Degrees & Certifications Section */}
      <div style={styles.celebrationCard}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓 🏆 📜</div>
        <h3 style={styles.celebrationTitle}>
          {lang === 'fr' ? 'DEGRÉS ACADÉMIQUES & PARCHEMINS' : 'ACADEMY DEGREES & CERTIFICATIONS'}
        </h3>
        <p style={styles.celebrationText}>
          {lang === 'fr' 
            ? `Consultez et téléchargez vos diplômes officiels signés par Maître Bertrand Laurence au fur et à mesure de votre progression somatique.`
            : `View and download your official printed scrolls certified and signed by Master Troubadour Bertrand Laurence as you mature your somatic guitar skills.`}
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '800px',
          margin: '16px auto 0',
          textAlign: 'left'
        }}>
          {/* Tier 1: Apprentice Bard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isApprenticeUnlocked ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isApprenticeUnlocked ? '#e0d0aa' : 'rgba(255,255,255,0.4)' }}>
                  Apprentice Bard
                </span>
                <span>{isApprenticeUnlocked ? '⭐' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {lang === 'fr' 
                  ? 'Déverrouillé après 4 modules complétés. Aucun examen requis.' 
                  : 'Unlocked at Fret 1–4 completed. No audition required.'}
              </p>
            </div>
            {isApprenticeUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('apprentice'); setShowCertModal(true); }}
                style={{
                  ...styles.certButton,
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.75rem'
                }}
              >
                📜 {lang === 'fr' ? 'Parchemin' : 'View Scroll'}
              </button>
            ) : (
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', padding: '8px 0' }}>
                {completedFrets}/4 Frets Complete
              </div>
            )}
          </div>

          {/* Tier 2: Journeyman Bard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isJourneymanUnlocked ? '1px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isJourneymanUnlocked ? '#e0d0aa' : 'rgba(255,255,255,0.4)' }}>
                  Journeyman Bard
                </span>
                <span>{isJourneymanUnlocked ? '🌟' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {lang === 'fr' 
                  ? 'Exige 8 modules et l\'évaluation d\'audition de Bertrand ($45).' 
                  : 'Requires Fret 1–8 complete + Bertrand\'s Capstone audition ($45).'}
              </p>
            </div>
            {isJourneymanUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('journeyman'); setShowCertModal(true); }}
                style={{
                  ...styles.certButton,
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  background: 'linear-gradient(135deg, #c9a96e, #8a6f3e)'
                }}
              >
                📜 {lang === 'fr' ? 'Parchemin' : 'View Scroll'}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                  {completedFrets}/8 Frets Complete
                </div>
                <a
                  href="https://bertrandguitarstudio.duetpartner.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.certButton,
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  🎸 {lang === 'fr' ? 'Audition ($45)' : 'Book Audition ($45)'}
                </a>
              </div>
            )}
          </div>

          {/* Tier 3: Bertrand Approved Troubadour */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isMasterUnlocked ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isMasterUnlocked ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>
                  Troubadour Master
                </span>
                <span>{isMasterUnlocked ? '👑' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {lang === 'fr' 
                  ? 'Exige les 12 modules et l\'évaluation de Bertrand ($100).' 
                  : 'Requires all 12 modules + Bertrand\'s Capstone master approval ($100).'}
              </p>
            </div>
            {isMasterUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('master'); setShowCertModal(true); }}
                style={{
                  ...styles.certButton,
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  background: 'linear-gradient(135deg, #d4af37, #aa7c11)'
                }}
              >
                📜 {lang === 'fr' ? 'Parchemin' : 'View Scroll'}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                  {completedFrets}/12 Frets Complete
                </div>
                <a
                  href="https://bertrandguitarstudio.duetpartner.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.certButton,
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  🎸 {lang === 'fr' ? 'Master review' : 'Book Master Review'}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

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
            Masterclass Learner Profile
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
          <span style={styles.quickLabel}>Modules</span>
        </div>
      </div>

      {/* Stat Block — 5 Core Abilities */}
      <div style={styles.statBlock}>
        <h3 style={styles.statBlockTitle}>
          Core Competencies
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
          Student Archetype
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

      {showCertModal && selectedCert && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }} className="no-print">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-certificate, #printable-certificate * {
                visibility: visible;
              }
              #printable-certificate {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: #fbf8f0 !important;
                color: #2c1a04 !important;
                border: 8px double #8a6f3e !important;
                padding: 50px !important;
                box-sizing: border-box;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>
          
          <div style={{
            background: '#1c1510',
            border: selectedCert === 'master' ? '3px double #d4af37' : selectedCert === 'journeyman' ? '3px double #c9a96e' : '3px double #8a8a8a',
            padding: '30px',
            maxWidth: '650px',
            width: '100%',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
            position: 'relative',
            color: '#f3e5c8',
          }}>
            <button 
              onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
              style={{
                position: 'absolute',
                top: 15, right: 15,
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            
            {/* Printable Certificate Frame */}
            <div id="printable-certificate" style={{
              border: selectedCert === 'master' ? '2px solid rgba(212,175,55,0.6)' : selectedCert === 'journeyman' ? '2px solid rgba(201,169,110,0.4)' : '2px solid rgba(255,255,255,0.2)',
              padding: '32px 24px',
              borderRadius: '4px',
              backgroundColor: '#1f1812',
              backgroundImage: selectedCert === 'master' 
                ? 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 80%)'
                : 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 80%)',
              boxShadow: selectedCert === 'master' ? '0 0 20px rgba(212,175,55,0.15) inset' : 'none'
            }}>
              {/* Emblem */}
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                {selectedCert === 'master' ? '👑' : selectedCert === 'journeyman' ? '🌟' : '⭐'}
              </div>
              
              {/* Header Title */}
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: selectedCert === 'master' ? '2.2rem' : '1.8rem', 
                color: selectedCert === 'master' ? '#d4af37' : '#e0d0aa', 
                letterSpacing: '0.06em', 
                margin: '0 0 8px', 
                textTransform: 'uppercase' 
              }}>
                {selectedCert === 'master' 
                  ? (lang === 'fr' ? "Grand Parchemin de Maître Troubadour" : "Bertrand Approved Troubadour Master Scroll")
                  : selectedCert === 'journeyman'
                  ? (lang === 'fr' ? "Brevet de Troubadour Compagnon" : "Troubadour Journeyman Certificate")
                  : (lang === 'fr' ? "Certificat d'Apprenti Troubadour" : "Troubadour Apprentice Certificate")
                }
              </h2>
              
              <div style={{ 
                fontSize: '0.75rem', 
                fontFamily: "'JetBrains Mono', monospace", 
                color: selectedCert === 'master' ? '#d4af37' : 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em', 
                marginBottom: 24 
              }}>
                {lang === 'fr' ? "ACADÉMIE DE MUSIQUE VOIX VIVE" : "VOIX VIVE MUSIC ACADEMY"}
              </div>
              
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', margin: '0 0 15px', color: 'rgba(255,255,255,0.7)' }}>
                {lang === 'fr' ? "Ce document atteste officiellement que" : "This is to certify that"}
              </p>
              
              {/* Student Name */}
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: '2.4rem', 
                color: '#ffffff', 
                margin: '10px 0 20px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                borderBottom: '1px solid rgba(212,175,55,0.3)', 
                paddingBottom: '10px', 
                display: 'inline-block', 
                minWidth: '320px' 
              }}>
                {studentName}
              </h3>
              
              {/* Detailed Somatic Text */}
              <p style={{ 
                fontSize: '0.85rem', 
                lineHeight: 1.6, 
                maxWidth: '520px', 
                margin: '0 auto 24px',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {selectedCert === 'master' ? (
                  lang === 'fr' 
                    ? "a atteint une maîtrise somatique absolue des 12 frettes de la guitare, démontrant une résonance acoustique parfaite (©PLING!), des glissements fluides (©CISAILLEMENT) et une parfaite géométrie physique des intervalles pythagoriciens sous le mentorat de Bertrand Laurence."
                    : "has successfully demonstrated absolute somatic mastery of all 12 frets of the guitar, integrating pure PLING sonic resonance, frictionless SHEARL finger-gliding mechanics, and precise interval ratios under the personal supervision and endorsement of Bertrand Laurence."
                ) : selectedCert === 'journeyman' ? (
                  lang === 'fr' 
                    ? "a complété avec succès l'initiation somatique des Frettes 1 à 8 et a démontré une compétence mécanique professionnelle validée par l'évaluation d'audition de Maître Bertrand Laurence."
                    : "has completed somatic guitar modules 1 through 8, establishing beautiful tone geometry, hand balance, and somatic recovery metrics validated by Bertrand Laurence's official Capstone review."
                ) : (
                  lang === 'fr' 
                    ? "a complété avec succès l'initiation somatique des Frettes 1 à 4, démontrant une intégration rigoureuse de la résonance absolue du PLING et du confort physique."
                    : "has successfully unlocked somatic guitar modules 1 through 4, establishing strong foundational physical balance, CAGED fretboard visualization, and basic somatic tone mechanics."
                )}
              </p>
              
              {/* Seals and signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, padding: '0 20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontFamily: "'Cormorant Garamond', serif", borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4, width: '140px', fontStyle: 'italic' }}>
                    {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {lang === 'fr' ? "Date d'obtention" : "Date of Award"}
                  </div>
                </div>
                
                {/* Wax Seal Graphic for Premium Feel */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}>
                    <circle cx="50" cy="50" r="42" fill={selectedCert === 'master' ? '#b22222' : selectedCert === 'journeyman' ? '#a0522d' : '#4682b4'} opacity="0.9" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="3,3" />
                    <text x="50" y="55" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="bold" fontFamily="'Cormorant Garamond', serif">
                      {selectedCert === 'master' ? 'MASTER' : selectedCert === 'journeyman' ? 'BARD' : 'APPR'}
                    </text>
                  </svg>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {lang === 'fr' ? "Sceau Officiel" : "Official Seal"}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontFamily: "'Cormorant Garamond', serif", 
                    color: '#d4af37', 
                    borderBottom: '1px solid rgba(255,255,255,0.2)', 
                    paddingBottom: 4, 
                    width: '140px', 
                    fontStyle: 'italic', 
                    fontWeight: 600 
                  }}>
                    Bertrand Laurence
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {lang === 'fr' ? "Sceau du Mentorat" : "Mentorship Seal"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 25 }}>
              <button 
                onClick={() => window.print()}
                style={{
                  ...styles.certButton,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                }}
              >
                🖨️ {lang === 'fr' ? 'Imprimer / PDF' : 'Print / Save PDF'}
              </button>
              <button 
                onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
                style={{
                  ...styles.certButton,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  },
  celebrationCard: {
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(167,139,250,0.15))',
    border: '2px double #d4af37',
    borderRadius: '16px',
    boxShadow: '0 0 30px rgba(212,175,55,0.25)',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#f3e5c8',
  },
  celebrationTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    color: '#d4af37',
    margin: '0 0 10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  celebrationText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    color: 'rgba(243,229,200,0.85)',
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  certButton: {
    background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
    color: '#1a120b',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
    transition: 'all 0.2s',
  }
};
