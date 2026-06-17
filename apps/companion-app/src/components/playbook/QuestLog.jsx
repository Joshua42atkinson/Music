import React, { useState, useEffect } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { QUEST_DATA } from '../../data/playbookData';
import { getSlidePosition } from '../../data/localDatabase';
import { SLIDE_DECKS } from '../../data/slideDecks';
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

const MASTERY_SYMBOLS = ['○', '◐', '●', '★'];
const MASTERY_COLORS = ['rgba(255,255,255,0.25)', '#7aaa88', '#a78bfa', 'var(--cf-gold)'];
const MASTERY_LABELS = {
  be: { en: 'BE (Concept)', fr: 'ÊTRE (Concept)' },
  do: { en: 'DO (Hearing)', fr: 'FAIRE (Audition)' },
  play: { en: 'PLAY (Playing)', fr: 'JOUER (Jeu)' }
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
    <div className="p-5 max-w-[500px] mx-auto">
      <h3 className="font-mono text-[0.65rem] text-cf-gold/50 tracking-[0.25em] uppercase text-center mb-5">
        {t('questLog')}
      </h3>

      {/* Timeline */}
      <div className="relative flex flex-col gap-2">
        {QUEST_DATA.map((quest, idx) => {
          const fretTraction = traction?.frets?.[quest.fretId] || {};
          const tractionPct = fretTraction.traction || 0;
          const tool = TOOLS_CATALOG.find(t => t.id === quest.fretId);
          const fret = frets.find(f => f.id === quest.fretId);
          const slides = fret ? (SLIDE_DECKS[fret.id] || []) : [];
          const slidePos = getSlidePosition(quest.fretId);
          const slideProgress = slides.length > 0 ? Math.round((slidePos / (slides.length - 1)) * 100) : 0;
          const isCompleted = tractionPct >= 60;
          const isStarted = tractionPct > 0 || slidePos > 0;
          const isExpanded = expandedId === quest.fretId;
          const protocolColor = PROTOCOL_COLORS[tool?.protocol] || 'var(--cf-gold)';
          const journals = journalCounts[quest.fretId] || 0;

          const status = isCompleted ? 'completed' : isStarted ? 'active' : 'locked';
          const statusIcon = isCompleted ? '✅' : isStarted ? '📖' : '🔒';

          return (
            <div key={quest.fretId} className="relative">
              {/* Timeline connector */}
              {idx < QUEST_DATA.length - 1 && (
                <div className="absolute left-[22px] top-12 bottom-[-8px] w-[2px] z-0"
                  style={{
                    background: isCompleted
                      ? `linear-gradient(180deg, ${protocolColor}, ${protocolColor}40)`
                      : 'rgba(255,255,255,0.06)',
                  }}
                />
              )}

              {/* Quest node */}
              <div
                className="relative z-[1] rounded-[14px] border p-3.5 transition-all duration-300 ease cursor-pointer"
                style={{
                  borderColor: status === 'completed' ? protocolColor
                    : status === 'active' ? `${protocolColor}80`
                    : 'rgba(255,255,255,0.08)',
                  background: status === 'completed' ? `${protocolColor}15`
                    : status === 'active' ? `${protocolColor}08`
                    : 'rgba(255,255,255,0.02)',
                  opacity: status === 'locked' ? 0.5 : 1,
                }}
                onClick={() => setExpandedId(isExpanded ? null : quest.fretId)}
              >
                {/* Header row */}
                <div className="flex items-center gap-3">
                  <span className="text-[1.2rem] w-8 text-center shrink-0">{statusIcon}</span>
                  <div className="flex-1">
                    <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase m-0 mb-0.5" style={{ color: protocolColor }}>
                      {t('questFret')} {quest.fretId} · {tool?.phase || ''}
                    </p>
                    <h4 className="font-heading text-[1.05rem] font-semibold text-[#e8edf2] m-0 leading-[1.2]">{quest.quest[lang]}</h4>
                  </div>
                  <span className="text-white/30 text-[0.9rem] transition-transform duration-200 shrink-0" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                </div>

                {/* Progress mini-bar */}
                {status !== 'locked' && (
                  <div className="h-[2px] rounded-sm bg-white/[0.06] overflow-hidden mt-2.5">
                    <div className="h-full rounded-sm transition-[width] duration-500 ease" style={{ width: `${Math.max(slideProgress, tractionPct)}%`, background: protocolColor }} />
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/[0.06]">
                    <p className="font-quote text-[0.95rem] italic text-white/55 leading-[1.7] mb-3.5">{quest.flavor[lang]}</p>

                    {/* Progress details */}
                    <div className="flex justify-between py-1">
                      <span className="font-mono text-[0.65rem] text-white/35 uppercase tracking-[0.08em]">{t('slidesLabel')}</span>
                      <span className="font-mono text-[0.75rem] text-white/60 font-semibold">{slidePos}/{slides.length}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-mono text-[0.65rem] text-white/35 uppercase tracking-[0.08em]">{t('masteryLabel')}</span>
                      <span className="font-mono text-[0.75rem] text-white/60 font-semibold">{tractionPct}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-mono text-[0.65rem] text-white/35 uppercase tracking-[0.08em]">{t('reflectionsLabel')}</span>
                      <span className="font-mono text-[0.75rem] text-white/60 font-semibold">{journals}</span>
                    </div>

                    {/* Mastery per phase */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-dashed border-white/[0.06]">
                      {['be', 'do', 'play'].map(phase => {
                        const mastery = fretTraction[`${phase}Mastery`] || 0;
                        const symbol = MASTERY_SYMBOLS[mastery];
                        const color = MASTERY_COLORS[mastery];
                        const label = MASTERY_LABELS[phase][lang] || MASTERY_LABELS[phase].en;
                        return (
                          <div key={phase} className="flex flex-col items-center bg-white/[0.01] border border-white/[0.04] rounded-lg py-1.5 px-1 text-center">
                            <span className="text-[0.55rem] text-white/35 font-mono uppercase tracking-[0.04em] mb-0.5">
                              {phase}
                            </span>
                            <span className="text-[1.25rem] leading-[1.2]" style={{ color }} title={label}>
                              {symbol}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reward */}
                    <div className="mt-3 py-2 px-3 rounded-lg border text-center" style={{ borderColor: `${protocolColor}40`, background: `${protocolColor}10` }}>
                      <span className="text-[0.7rem]" style={{ color: protocolColor }}>🏆 {quest.reward[lang]}</span>
                    </div>

                    {/* Continue button */}
                    {status !== 'locked' && onOpenSlides && (
                      <button
                        className="w-full mt-3 py-2.5 rounded-[10px] bg-white/[0.03] border font-mono text-[0.75rem] tracking-[0.08em] cursor-pointer transition-all duration-200 hover:bg-white/[0.06]"
                        style={{ borderColor: `${protocolColor}50`, color: protocolColor }}
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

