import React, { useState, useEffect } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { QUEST_DATA } from '../../data/playbookData';
import { getSlidePosition } from '../../data/localDatabase';
import { generateSlides } from '../../data/slideGenerator';
import frets from '../../data/chapterData';
import { TOOLS_CATALOG } from '../../data/toolsData';
import { db } from '../../data/localDatabase';

// ═══════════════════════════════════════════════════════════
// QUEST LOG — 12-Fret Hero's Journey timeline
// Each fret is a quest with flavor text, progress, and
// journal entries. Tapping expands the quest details.
// ═══════════════════════════════════════════════════════════

const PROTOCOL_COLORS = {
  'SHEARL': '#5a90a0',
  'PLING!': '#7aaa88',
  'FHEAL':  '#7b6aaa',
};

export default function QuestLog({ onOpenSlides }) {
  const { traction } = useScaffolding();
  const { locale, t } = useLocale();
  const lang = locale;
  const [expandedId, setExpandedId] = useState(null);
  const [journalCounts, setJournalCounts] = useState({});

  // Load journal entry counts per fret
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const entries = await db.journal.toArray();
        const counts = {};
        entries.forEach(e => {
          counts[e.fretId] = (counts[e.fretId] || 0) + 1;
        });
        setJournalCounts(counts);
      } catch { /* IndexedDB may not be available */ }
    };
    loadCounts();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3 style={styles.sectionTitle}>
        {t('questLog')}
      </h3>

      {/* Timeline */}
      <div style={styles.timeline}>
        {QUEST_DATA.map((quest, idx) => {
          const fretTraction = traction.frets?.[quest.fretId] || {};
          const tractionPct = fretTraction.traction || 0;
          const tool = TOOLS_CATALOG.find(t => t.id === quest.fretId);
          const fret = frets.find(f => f.id === quest.fretId);
          const slides = fret ? generateSlides(fret) : [];
          const slidePos = getSlidePosition(quest.fretId);
          const slideProgress = slides.length > 0 ? Math.round((slidePos / (slides.length - 1)) * 100) : 0;
          const isCompleted = tractionPct >= 60;
          const isStarted = tractionPct > 0 || slidePos > 0;
          const isExpanded = expandedId === quest.fretId;
          const protocolColor = PROTOCOL_COLORS[tool?.protocol] || '#c9a96e';
          const journals = journalCounts[quest.fretId] || 0;

          const status = isCompleted ? 'completed' : isStarted ? 'active' : 'locked';
          const statusIcon = isCompleted ? '✅' : isStarted ? '📖' : '🔒';

          return (
            <div key={quest.fretId} style={styles.questRow}>
              {/* Timeline connector */}
              {idx < QUEST_DATA.length - 1 && (
                <div style={{
                  ...styles.connector,
                  background: isCompleted
                    ? `linear-gradient(180deg, ${protocolColor}, ${protocolColor}40)`
                    : 'rgba(255,255,255,0.06)',
                }} />
              )}

              {/* Quest node */}
              <div
                style={{
                  ...styles.questNode,
                  borderColor: status === 'completed' ? protocolColor
                    : status === 'active' ? `${protocolColor}80`
                    : 'rgba(255,255,255,0.08)',
                  background: status === 'completed' ? `${protocolColor}15`
                    : status === 'active' ? `${protocolColor}08`
                    : 'rgba(255,255,255,0.02)',
                  opacity: status === 'locked' ? 0.5 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(isExpanded ? null : quest.fretId)}
              >
                {/* Header row */}
                <div style={styles.questHeader}>
                  <span style={styles.questIcon}>{statusIcon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...styles.questFretLabel, color: protocolColor }}>
                      {t('questFret')} {quest.fretId} · {tool?.phase || ''}
                    </p>
                    <h4 style={styles.questTitle}>{quest.quest[lang]}</h4>
                  </div>
                  <span style={{ ...styles.expandArrow, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                </div>

                {/* Progress mini-bar */}
                {status !== 'locked' && (
                  <div style={styles.miniBar}>
                    <div style={{ ...styles.miniBarFill, width: `${Math.max(slideProgress, tractionPct)}%`, background: protocolColor }} />
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div style={styles.expandedContent}>
                    <p style={styles.flavorText}>{quest.flavor[lang]}</p>

                    {/* Progress details */}
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>{t('slidesLabel')}</span>
                      <span style={styles.detailValue}>{slidePos}/{slides.length}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>{t('masteryLabel')}</span>
                      <span style={styles.detailValue}>{tractionPct}%</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>{t('reflectionsLabel')}</span>
                      <span style={styles.detailValue}>{journals}</span>
                    </div>

                    {/* Reward */}
                    <div style={{ ...styles.rewardBadge, borderColor: `${protocolColor}40`, background: `${protocolColor}10` }}>
                      <span style={{ color: protocolColor, fontSize: '0.7rem' }}>🏆 {quest.reward[lang]}</span>
                    </div>

                    {/* Continue button */}
                    {status !== 'locked' && onOpenSlides && (
                      <button
                        style={{ ...styles.continueBtn, borderColor: `${protocolColor}50`, color: protocolColor }}
                        onClick={(e) => { e.stopPropagation(); onOpenSlides(quest.fretId); }}
                      >
                        {isCompleted
                          ? t('reviewQuest')
                          : t('continueQuest')
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  sectionTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.5)',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '20px',
  },
  timeline: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  questRow: { position: 'relative' },
  connector: {
    position: 'absolute',
    left: '22px',
    top: '48px',
    bottom: '-8px',
    width: '2px',
    zIndex: 0,
  },
  questNode: {
    position: 'relative',
    zIndex: 1,
    borderRadius: '14px',
    border: '1px solid',
    padding: '14px',
    transition: 'all 0.3s ease',
  },
  questHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  questIcon: { fontSize: '1.2rem', width: '32px', textAlign: 'center', flexShrink: 0 },
  questFretLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    margin: '0 0 2px',
  },
  questTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#e8edf2',
    margin: 0,
    lineHeight: 1.2,
  },
  expandArrow: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.9rem',
    transition: 'transform 0.2s ease',
    flexShrink: 0,
  },
  miniBar: {
    height: '2px',
    borderRadius: '1px',
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginTop: '10px',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: '1px',
    transition: 'width 0.5s ease',
  },
  expandedContent: {
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  flavorText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: '0.95rem',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.7,
    marginBottom: '14px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  detailLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  detailValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
  },
  rewardBadge: {
    marginTop: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
  },
  continueBtn: {
    width: '100%',
    marginTop: '12px',
    padding: '10px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
