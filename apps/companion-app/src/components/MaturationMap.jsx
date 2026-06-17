// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : MaturationMap.jsx                                    ║
// ║ WHAT    : Visual 12-fret journey map — "Where am I?"          ║
// ║ WHY     : Students had no visual overview of their progress   ║
// ║           across all 12 frets. This IS the maturation map.    ║
// ║ WHO     : Student — the primary navigation/orientation view   ║
// ║ OWNS    : Fret progress visualization, pillar breakdown,      ║
// ║           clickable fret nodes, recommended next action       ║
// ║ NEEDS   : useDAGProgress, dagNodes, bardicTitles, useLocale   ║
// ║ RULES   : No Great Game language. No leaderboards.            ║
// ║           12-fret neck IS the UI. Each fret = one row.        ║
// ║ ROUTE   : /guitar/map                                         ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, Star, Lock, CheckCircle } from 'lucide-react';
import { useScaffolding } from './ScaffoldingProvider';
import { useDAGProgress } from '../hooks/useDAGProgress';
import { getNodesByFret, FRET_METADATA } from '../data/dag/dagNodes';
import { getBardTitle } from '../data/playbookData';
import { useLocale } from '../hooks/useLocale';

// ── Fret color palette (chromatic, esoteric) ──
const FRET_COLORS = [
  '#e74c3c', // 1 — C Root (red, fire)
  '#e67e22', // 2 — C# m2 (orange, tension)
  '#f1c40f', // 3 — D M2 (gold, awakening)
  '#2ecc71', // 4 — D# m3 (green, growth)
  '#1abc9c', // 5 — E M3 (teal, clarity)
  '#3498db', // 6 — F P4 (blue, depth)
  '#9b59b6', // 7 — F# TT (purple, ordeal)
  '#e91e63', // 8 — G P5 (magenta, reward)
  '#ff5722', // 9 — G# m6 (deep orange, road back)
  '#ffc107', // 10 — A M6 (amber, resurrection)
  '#00bcd4', // 11 — A# m7 (cyan, elixir)
  '#8bc34a', // 12 — B M7 (lime, mastery)
];

const FRET_INTERVALS = [
  'Root', 'm2', 'M2', 'm3', 'M3', 'P4',
  'TT', 'P5', 'm6', 'M6', 'm7', 'M7',
];

const HERO_STAGES = [
  'Call to Adventure',
  'Refusal of the Call',
  'Meeting the Mentor',
  'Crossing the Threshold',
  'Tests, Allies, Enemies',
  'Approach to the Cave',
  'The Ordeal',
  'The Reward',
  'The Road Back',
  'The Resurrection',
  'Return with the Elixir',
  'Master of Two Worlds',
];

export default function MaturationMap() {
  const navigate = useNavigate();
  const { bardLevel, streak, practiceMinutes, traction, voice = 0, resonance = 0 } = useScaffolding();
  const { progress, getFretProgress, currentFret } = useDAGProgress();
  const { locale, t } = useLocale();
  const lang = locale;

  const bardTitle = useMemo(() => getBardTitle(bardLevel, lang), [bardLevel, lang]);
  const sandboxMode = traction?.settings?.sandboxMode;

  const currentMode = useMemo(() => {
    const aiEnabled = traction?.settings?.aiEnabled !== false;
    if (!sandboxMode && aiEnabled) return { label: 'Apprenticeship', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)' };
    if (!sandboxMode && !aiEnabled) return { label: 'Self-Study', color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)' };
    if (sandboxMode && aiEnabled) return { label: 'Exploration', color: '#fbbf24', background: 'rgba(251,191,38,0.1)', borderColor: 'rgba(251,191,38,0.25)' };
    return { label: 'Library', color: '#9ca3af', background: 'rgba(156,163,175,0.1)', borderColor: 'rgba(156,163,175,0.25)' };
  }, [traction, sandboxMode]);

  const fretData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const fret = i + 1;
      const meta = FRET_METADATA[fret] || {};
      const prog = getFretProgress(fret);
      const nodes = getNodesByFret(fret);
      const completedNodes = nodes.filter(n => progress.completedNodes.includes(n.id));
      
      // Pillar breakdown
      const pillars = ['class', 'guitar', 'workbook'].map(pillar => {
        const pillarNodes = nodes.filter(n => n.pillar === pillar);
        const pillarComplete = pillarNodes.filter(n => progress.completedNodes.includes(n.id));
        return {
          pillar,
          total: pillarNodes.length,
          completed: pillarComplete.length,
          pct: pillarNodes.length > 0 ? Math.round((pillarComplete.length / pillarNodes.length) * 100) : 0,
        };
      });

      return {
        fret,
        interval: FRET_INTERVALS[i],
        heroStage: HERO_STAGES[i],
        color: FRET_COLORS[i],
        meta,
        totalNodes: nodes.length,
        completedCount: completedNodes.length,
        percentage: prog.percentage,
        isComplete: prog.isComplete,
        isCurrent: fret === currentFret,
        isLocked: !sandboxMode && fret > 1 && !progress.completedNodes.some(id => id.startsWith(`fret-${fret}-`)) && prog.percentage === 0,
        pillars,
      };
    });
  }, [progress, getFretProgress, currentFret, sandboxMode]);

  // Find the highest unlocked fret
  const _highestUnlocked = useMemo(() => {
    for (let i = 11; i >= 0; i--) {
      if (!fretData[i].isLocked) return fretData[i].fret;
    }
    return 1;
  }, [fretData]);

  const totalProgress = useMemo(() => {
    const totalNodes = fretData.reduce((sum, f) => sum + f.totalNodes, 0);
    const completedNodes = fretData.reduce((sum, f) => sum + f.completedCount, 0);
    return totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  }, [fretData]);

  return (
    <div className="min-h-screen bg-cf-void text-[#e8edf2] font-body pb-10">
      {/* Header */}
      <div className="flex items-center pt-[max(16px,env(safe-area-inset-top))] px-5 py-3 gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/[0.08] text-cf-gold cursor-pointer flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-heading text-[1.4rem] font-semibold text-vv-text m-0">
            {t('maturationMap')}
          </h1>
          <p className="font-mono text-[0.65rem] text-cf-gold tracking-[0.1em] m-0">
            Lv.{bardLevel} — {bardTitle}
          </p>
          {/* Voice and Resonance Metrics */}
          <div className="flex gap-3 justify-center mt-1">
            <div className="flex items-center gap-1 py-0.5 px-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[0.65rem] font-mono">
              <span className="text-[0.8rem]">🎤</span>
              <span>Voice: {voice}</span>
            </div>
            <div className="flex items-center gap-1 py-0.5 px-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[0.65rem] font-mono">
              <span className="text-[0.8rem]">🌟</span>
              <span>Resonance: {resonance}</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 mt-1 py-px px-2 rounded-xl text-[0.6rem] font-mono font-bold uppercase tracking-[0.05em]"
            style={{
              background: currentMode.background,
              border: `1px solid ${currentMode.borderColor}`,
              color: currentMode.color,
            }}>
            {currentMode.label}
          </div>
        </div>
        <button onClick={() => navigate('/')} className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/[0.08] text-cf-gold cursor-pointer flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" aria-label="Home">
          <Home size={18} />
        </button>
      </div>

      {/* Overall Progress */}
      <div className="px-5 pb-4">
        <div className="flex justify-center gap-3 mb-2.5">
          <div className="flex items-center gap-1 py-1 px-2.5 rounded-[20px] bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[0.85rem]">🔥</span>
            <span className="font-mono text-[0.75rem] text-vv-text font-semibold">{streak}</span>
          </div>
          <div className="flex items-center gap-1 py-1 px-2.5 rounded-[20px] bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[0.85rem]">⏱️</span>
            <span className="font-mono text-[0.75rem] text-vv-text font-semibold">{practiceMinutes}m</span>
          </div>
          <div className="flex items-center gap-1 py-1 px-2.5 rounded-[20px] bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[0.85rem]">🏔️</span>
            <span className="font-mono text-[0.75rem] text-vv-text font-semibold">{totalProgress}%</span>
          </div>
        </div>
        <div className="h-1 rounded-sm bg-white/[0.06] overflow-hidden mb-1.5">
          <div className="h-full rounded-sm transition-[width] duration-[0.6s] ease-out" style={{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, var(--cf-gold), #e0d0aa)', boxShadow: '0 0 8px rgba(var(--cf-gold-rgb),0.4)' }} />
        </div>
        <p className="font-mono text-[0.55rem] text-cf-gold/40 tracking-[0.15em] uppercase text-center m-0">
          {t('totalJourneyProgress')}
        </p>
      </div>

      {/* Fret Grid */}
      <div className="flex flex-col gap-1.5 px-3">
        {fretData.map((fd) => (
          <button
            key={fd.fret}
            onClick={() => {
              if (!fd.isLocked) {
                navigate('/song', { state: { fret: fd.fret } });
              }
            }}
            className="flex items-center gap-3 py-3 px-3.5 rounded-xl border-l-[3px] border-none text-left text-inherit w-full transition-all duration-200"
            style={{
              borderLeftColor: fd.color,
              opacity: fd.isLocked ? 0.35 : 1,
              cursor: fd.isLocked ? 'default' : 'pointer',
              background: fd.isCurrent
                ? `linear-gradient(90deg, ${fd.color}12, transparent)`
                : 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Fret Number */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[0.85rem] font-bold shrink-0"
              style={{
                background: fd.isComplete ? fd.color : 'rgba(255,255,255,0.06)',
                color: fd.isComplete ? '#0a0a0f' : fd.color,
              }}
            >
              {fd.isComplete ? <CheckCircle size={16} /> : fd.isLocked ? <Lock size={14} /> : fd.fret}
            </div>

            {/* Fret Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[0.8rem] font-bold tracking-[0.05em]" style={{ color: fd.color }}>
                  {fd.interval}
                </span>
                <span className="font-quote text-[0.8rem] text-white/50 italic truncate">{fd.heroStage}</span>
                {fd.isCurrent && <span className="text-green-400 text-[0.6rem] animate-pulse">●</span>}
              </div>

              {/* Pillar Bars */}
              <div className="flex gap-1.5">
                {fd.pillars.map(p => (
                  <div key={p.pillar} className="flex-1 flex items-center gap-1">
                    <span className="text-[0.65rem] shrink-0">
                      {p.pillar === 'class' ? '📖' : p.pillar === 'guitar' ? '🎸' : '📓'}
                    </span>
                    <div className="flex-1 h-[3px] rounded-sm bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-sm transition-[width] duration-[0.4s] ease-out opacity-70" style={{ width: `${p.pct}%`, background: fd.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Percentage */}
            <div className="flex items-center gap-1 shrink-0 min-w-[50px] justify-end">
              <span className="font-mono text-[0.8rem] font-semibold" style={{ color: fd.percentage === 100 ? '#4ade80' : fd.color }}>
                {fd.percentage}%
              </span>
              {!fd.isLocked && !fd.isComplete && (
                <ChevronRight size={14} className="opacity-30" />
              )}
              {fd.isComplete && (
                <Star size={14} className="text-amber-400" fill="#fbbf24" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Human Octave Entry Point */}
      <div className="p-5 mt-2.5">
        <button
          onClick={() => navigate('/human-octave')}
          className="w-full py-4 rounded-xl border-none flex items-center justify-center gap-2 font-heading text-[1.2rem] font-semibold cursor-pointer bg-[linear-gradient(135deg,var(--cf-gold),#a48141)] text-[#050508] shadow-[0_4px_15px_rgba(var(--cf-gold-rgb),0.2)]"
        >
          <span className="text-[1.4rem]">🎧</span>
          {t('theHumanOctave')}
        </button>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 p-5 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[0.8rem]">📖</span>
          <span className="font-mono text-[0.6rem] text-white/35 tracking-[0.05em]">{t('theSong')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[0.8rem]">🎸</span>
          <span className="font-mono text-[0.6rem] text-white/35 tracking-[0.05em]">{t('theGuitar')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[0.8rem]">📓</span>
          <span className="font-mono text-[0.6rem] text-white/35 tracking-[0.05em]">{t('theWorkbook')}</span>
        </div>
      </div>
    </div>
  );
}
