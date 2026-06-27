import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../data/localDatabase';
import { TOOLS_CATALOG } from '../../data/toolsData';
import { QUEST_DATA, getXpForNextLevel, computeStatValue } from '../../data/playbookData';
import { getSuggestedTool } from '../../data/workbenchData';
import { SLIDE_DECKS } from '../../data/slideDecks';
import frets from '../../data/chapterData';
import { getSlidePosition } from '../../data/localDatabase';
import { Play, Feather, Activity, BookOpenCheck } from 'lucide-react';
import { vvGet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { devWarn } from '../../lib/devLog';

const PROTOCOL_COLORS = {
  'SHEARL': { text: '#5a90a0' },
  'PLING!': { text: '#7aaa88' },
  'FHEAL':  { text: '#7b6aaa' },
};

const MASTERY_STARS = ['○', '◐', '●', '★'];

export default function WorkbookTab({ handleOpenTool, setActiveSlideFretId, setActiveTab }) {
  const { locale, t } = useLocale();
  const { traction, bardLevel, practiceMinutes, streak, globalMode } = useScaffolding();
  const { user } = useAuth();
  
  const [expandedFretId, setExpandedFretId] = useState(null);
  const [journalCounts, setJournalCounts] = useState({});
  const [, setReviewedCount] = useState(0);

  const studentName = useMemo(() => {
    const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    if (googleName) return googleName;
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || 'Adventurer'; }
    catch { return 'Adventurer'; }
  }, [user]);

  const loadStats = useCallback(async () => {
    try {
      const entries = await db.journal.toArray();
      const counts = {};
      entries.forEach(e => {
        counts[e.fretId] = (counts[e.fretId] || 0) + 1;
      });
      setJournalCounts(counts);

      const resp = await fetch('http://localhost:8080/api/mentor/submissions');
      if (resp.ok) {
        const data = await resp.json();
        if (data.submissions) {
          const count = data.submissions.filter(
            s => s.student_name === studentName && s.status === 'reviewed'
          ).length;
          setReviewedCount(count);
        }
      }
    } catch (e) {
      devWarn('Failed to load submissions in Workbook:', e);
    }
  }, [studentName]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const suggestion = useMemo(() => getSuggestedTool(), []);
  const statBreath = useMemo(() => computeStatValue('breath', traction), [traction]);
  const statPitch = useMemo(() => computeStatValue('pitch', traction), [traction]);
  const statMemory = useMemo(() => computeStatValue('memory', traction), [traction]);

  const xpCurrent = traction?.xp || 0;
  const xpNext = getXpForNextLevel(bardLevel);
  const xpProgress = xpNext > 0 ? Math.min(1, xpCurrent / xpNext) : 1;
  const completedFretsCount = Object.values(traction?.frets || {}).filter(f => (f.traction || 0) >= 60).length;

  return (
    <div className="max-w-[650px] mx-auto px-4 pb-10">
      {/* 1. Character Header */}
      <div className="bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.05)] to-[rgba(5,5,8,0.6)] border border-[rgba(var(--cf-gold-rgb),0.15)] rounded-2xl p-5 mt-5">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="font-[Cormorant_Garamond] text-[1.4rem] font-semibold text-[#f0e6d2]">{studentName}</div>
            <div className="font-mono text-[0.7rem] text-[var(--cf-gold)] uppercase tracking-[0.08em] mt-0.5">
              Lv.{bardLevel} {t(`bardLevel_${Math.min(Math.max(bardLevel, 1), 10)}`)}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-0.5 px-2">
              <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{streak || 0}</span>
              <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('daysStreak')}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
              <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{practiceMinutes || 0}</span>
              <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('minutes')}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
              <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{completedFretsCount}/12</span>
              <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('fretsLabel')}</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-3.5 mb-4">
          <div className="flex justify-between font-mono text-[0.6rem] text-white/50 uppercase tracking-[0.05em] mb-1.5">
            <span>XP Progress</span>
            <span>{xpCurrent} / {xpNext} XP</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-[2px] overflow-hidden">
            <div
              className="h-full rounded-[2px] transition-[width] duration-[400ms] ease-out bg-gradient-to-r from-[var(--cf-gold)] to-[#e0d0aa]"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Sensation Stats Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mt-4">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[0.9rem]">🫁</span>
              <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('breathControl')}</span>
              <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statBreath}/20</span>
            </div>
            <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
              <div
                className="h-full rounded-[1.5px]"
                style={{ width: `${(statBreath / 20) * 100}%`, background: '#5a90a0' }}
              />
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[0.9rem]">🎯</span>
              <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('pitchAccuracy')}</span>
              <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statPitch}/20</span>
            </div>
            <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
              <div
                className="h-full rounded-[1.5px]"
                style={{ width: `${(statPitch / 20) * 100}%`, background: '#7aaa88' }}
              />
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
            <div className="text-[0.9rem]">🧠</div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('fretboardMemory')}</span>
              <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statMemory}/20</span>
            </div>
            <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
              <div
                className="h-full rounded-[1.5px]"
                style={{ width: `${(statMemory / 20) * 100}%`, background: '#7b6aaa' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Quest Hero CTA */}
      {suggestion?.tool && (
        <div className="bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.1)] to-[rgba(5,5,8,0.7)] border border-[rgba(var(--cf-gold-rgb),0.3)] rounded-2xl p-6 mt-5 text-center shadow-[0_8px_32px_rgba(var(--cf-gold-rgb),0.08)]">
          <div className="flex justify-between items-center mb-3">
            <div className="font-mono text-[0.65rem] text-[var(--cf-gold)] tracking-[0.15em] font-bold">
              ⚡ {t('currentQuest')}
            </div>
            <div className="font-mono text-[0.6rem] text-white/40 uppercase">
              Chapter {suggestion.fretId || suggestion.tool.id} · {suggestion.tool.protocol}
            </div>
          </div>
          <h3 className="font-[Cormorant_Garamond] text-[1.6rem] font-semibold text-[#f0e6d2] m-0 mb-2.5">
            {suggestion.tool.name}
          </h3>
          <p className="font-[EB_Garamond] text-[1.05rem] leading-normal text-white/[0.65] italic m-0 mx-auto mb-5 max-w-[480px]">
            "{t(`chapter_${suggestion.fretId || suggestion.tool.id}_invitation`) === `chapter_${suggestion.fretId || suggestion.tool.id}_invitation` ? suggestion.tool.telemetry : t(`chapter_${suggestion.fretId || suggestion.tool.id}_invitation`)}"
          </p>
          <button
            onClick={() => handleOpenTool(suggestion.tool)}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[var(--cf-gold)] to-[#aa7c11] text-[#050508] border-0 rounded-[30px] px-[30px] py-3 font-mono text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer shadow-[0_4px_16px_rgba(var(--cf-gold-rgb),0.25)] transition-all duration-200"
          >
            <Play size={14} fill="currentColor" /> {t('beginSession')}
          </button>
        </div>
      )}

      {/* 3. 12-Chapter Quest Timeline */}
      {globalMode === 'open_book' ? (
      <div className="mt-8">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.22em] uppercase text-center mb-5">
          {t('minstrelsJourney')}
        </h3>

        <div className="relative flex flex-col gap-3">
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
            const isExpanded = expandedFretId === quest.fretId;
            const protocolColor = PROTOCOL_COLORS[tool?.protocol]?.text || 'var(--cf-gold)';
            const journals = journalCounts[quest.fretId] || 0;

            const beComp = !!fretTraction.beCompleted;
            const doComp = !!fretTraction.doCompleted;
            const playComp = !!fretTraction.playCompleted;

            const beMastery = fretTraction.beMastery || 0;
            const doMastery = fretTraction.doMastery || 0;
            const playMastery = fretTraction.playMastery || 0;

            const beGate = !!fretTraction.beGatePassed;
            const doGate = !!fretTraction.doGatePassed;
            const playGate = !!fretTraction.playGatePassed;

            const status = isCompleted ? 'completed' : isStarted ? 'active' : 'locked';
            const statusIcon = isCompleted ? '✅' : isStarted ? '📖' : '🔒';

            return (
              <div key={quest.fretId} className="relative">
                {idx < QUEST_DATA.length - 1 && (
                  <div
                    className="absolute left-[26px] top-[52px] -bottom-3 w-[2px] z-0"
                    style={{
                      background: isCompleted
                        ? `linear-gradient(180deg, ${protocolColor}, ${protocolColor}30)`
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />
                )}
                <div
                  className="relative rounded-2xl border p-4 cursor-pointer transition-all duration-200"
                  style={{
                    borderColor: isExpanded ? 'var(--cf-gold)' : status === 'completed' ? `${protocolColor}80` : status === 'active' ? 'rgba(var(--cf-gold-rgb),0.3)' : 'rgba(255,255,255,0.05)',
                    background: status === 'completed' ? 'rgba(255,255,255,0.01)' : 'rgba(5,5,8,0.4)',
                    opacity: status === 'locked' ? 0.45 : 1,
                  }}
                  onClick={() => setExpandedFretId(isExpanded ? null : quest.fretId)}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-[1.25rem] w-6 text-center shrink-0">{statusIcon}</span>
                    <div className="flex-1">
                      <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase m-0 mb-0.5" style={{ color: protocolColor }}>
                        {t('fretUpper')} {quest.fretId} · {tool?.protocol || ''}
                      </p>
                      <h4 className="font-[Cormorant_Garamond] text-[1.15rem] font-semibold text-[#e8edf2] m-0 leading-tight">{t(`quest_${quest.fretId}_title`)}</h4>
                    </div>
                    <span className="text-white/30 text-[0.9rem] transition-transform duration-200 shrink-0" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                      ▾
                    </span>
                  </div>

                  {status !== 'locked' && (
                    <div className="h-[2px] rounded-[1px] bg-white/[0.06] overflow-hidden mt-3">
                      <div
                        className="h-full rounded-[1px] transition-[width] duration-[400ms] ease-out"
                        style={{ width: `${Math.max(slideProgress, tractionPct)}%`, background: `linear-gradient(90deg, ${protocolColor}, var(--cf-gold))` }}
                      />
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
                      <p className="font-[EB_Garamond] text-[1.02rem] italic text-white/[0.55] leading-relaxed m-0 mb-4">{t(`quest_${quest.fretId}_flavor`)}</p>

                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(var(--cf-gold-rgb),0.05)] border border-[rgba(var(--cf-gold-rgb),0.15)] text-[0.75rem] font-mono text-white/60 mb-4">
                        🎁 <span className="text-[#e0d0aa] font-semibold">{t(`quest_${quest.fretId}_reward`)}</span>
                      </div>

                      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
                        <div
                          className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                          style={{
                            borderColor: beComp ? 'rgba(90,144,160,0.3)' : 'rgba(255,255,255,0.05)',
                            background: beComp ? 'rgba(90,144,160,0.03)' : 'rgba(255,255,255,0.01)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5a90a0]" />
                            <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Imagine (BE)</span>
                            <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={t(`mastery_${beMastery}`)}>
                              {MASTERY_STARS[beMastery]}
                            </span>
                          </div>
                          <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                            <span>Slides: {slidePos}/{slides.length}</span>
                            <span>{beGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                          </div>
                          <button
                            onClick={() => setActiveSlideFretId(quest.fretId)}
                            className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                          >
                            <BookOpenCheck size={12} /> {beComp ? 'Review Slides' : 'Read Slides'}
                          </button>
                        </div>

                        <div
                          className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                          style={{
                            borderColor: doComp ? 'rgba(122,170,136,0.3)' : 'rgba(255,255,255,0.05)',
                            background: doComp ? 'rgba(122,170,136,0.03)' : 'rgba(255,255,255,0.01)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7aaa88]" />
                            <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Hear (DO)</span>
                            <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={t(`mastery_${doMastery}`)}>
                              {MASTERY_STARS[doMastery]}
                            </span>
                          </div>
                          <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                            <span>Accuracy: {fretTraction.pitchAccuracy || 0}%</span>
                            <span>{doGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                          </div>
                          <button
                            onClick={() => handleOpenTool(tool)}
                            className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                          >
                            <Activity size={12} /> {doComp ? 'Practice Tool' : 'Launch Tool'}
                          </button>
                        </div>

                        <div
                          className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                          style={{
                            borderColor: playComp ? 'rgba(123,106,170,0.3)' : 'rgba(255,255,255,0.05)',
                            background: playComp ? 'rgba(123,106,170,0.03)' : 'rgba(255,255,255,0.01)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7b6aaa]" />
                            <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Play (PLAY)</span>
                            <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={t(`mastery_${playMastery}`)}>
                              {MASTERY_STARS[playMastery]}
                            </span>
                          </div>
                          <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                            <span>Reflections: {journals}</span>
                            <span>{playGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                          </div>
                          <button
                            onClick={() => setActiveTab('submissions')}
                            className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                          >
                            <Feather size={12} /> {playComp ? 'View Journal' : 'Write Reflection'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      ) : (
        <div className="mt-6">
          <div className="rounded-2xl border border-cf-guitar/20 bg-gradient-to-br from-cf-guitar/[0.06] to-cf-void/80 p-6 pb-5 mb-5 text-center">
            <div className="text-[2rem] mb-3">🎸</div>
            <h3 className="font-[Cormorant_Garamond] text-[1.4rem] text-[#f0e6d2] m-0 mb-2">
              {t('journeyBeginsTitle')}
            </h3>
            <p className="font-sans text-[0.85rem] text-white/50 leading-[1.6] m-0 mb-5">
              {t('journeyBeginsDesc')}
            </p>
            <button
              onClick={() => handleOpenTool(TOOLS_CATALOG.find(t => t.id === 1))}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] bg-cf-guitar/15 border border-cf-guitar/40 text-[#ff8888] cursor-pointer font-mono text-[0.75rem] tracking-[0.1em] uppercase"
            >
              <Play size={14} fill="currentColor" />
              {t('beginFret1')}
            </button>
          </div>

          <div className="opacity-40 pointer-events-none">
            <h4 className="font-mono text-[0.6rem] text-white/30 tracking-[0.15em] uppercase m-0 mb-3">
              {t('fullJourney')}
            </h4>
            <div className="flex flex-col gap-1.5">
              {QUEST_DATA.slice(0, 6).map((quest) => (
                <div key={quest.fretId} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[0.8rem]">🔒</span>
                  <span className="font-mono text-[0.65rem] text-white/35 uppercase">
                    Chapter {quest.fretId} — {t(`quest_${quest.fretId}_title`)}
                  </span>
                </div>
              ))}
              <div className="text-center text-white/20 text-[0.6rem] font-mono py-2">
                + 6 {t('moreFrets')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
