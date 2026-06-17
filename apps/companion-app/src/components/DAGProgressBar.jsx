import React from 'react';
import { useScaffolding } from './ScaffoldingProvider';
import { dagNodes, FRET_METADATA } from '../data/dag/dagNodes';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// DAG PROGRESS BAR — Visual 12-fret journey tracker
// Purely graph-based. No AI required. Works offline.
// ═══════════════════════════════════════════════════════════

const PHASE_COLORS = {
  be: '#60a5fa',      // blue — imagination
  do: '#a78bfa',      // purple — hearing
  play: '#34d399',    // green — playing
  milestone: '#fbbf24', // amber — celebration
  reflection: '#f472b6', // pink — journal
};

const PILLAR_ICONS = {
  class: '📚',
  guitar: '🎸',
  workbook: '📝',
};

export default function DAGProgressBar() {
  const { completedNodes, currentNodeId, currentFret, currentPhase } = useScaffolding();
  const { t } = useLocale();

  // Overall progress
  const totalNodes = dagNodes.length;
  const completedCount = completedNodes.length;
  const overallPercentage = Math.round((completedCount / totalNodes) * 100);

  // Fret progress
  const fretProgress = React.useMemo(() => {
    const progress = {};
    for (let fret = 1; fret <= 12; fret++) {
      const fretNodes = dagNodes.filter(n => n.fret === fret);
      const completed = fretNodes.filter(n => completedNodes.includes(n.id));
      progress[fret] = {
        total: fretNodes.length,
        completed: completed.length,
        percentage: fretNodes.length > 0 ? Math.round((completed.length / fretNodes.length) * 100) : 0,
        isComplete: completed.length === fretNodes.length && fretNodes.length > 0,
      };
    }
    return progress;
  }, [completedNodes]);

  // Pillar progress
  const pillarProgress = React.useMemo(() => {
    const pillars = ['class', 'guitar', 'workbook'];
    return pillars.reduce((acc, pillar) => {
      const pillarNodes = dagNodes.filter(n => n.pillar === pillar);
      const completed = pillarNodes.filter(n => completedNodes.includes(n.id));
      acc[pillar] = {
        total: pillarNodes.length,
        completed: completed.length,
        percentage: pillarNodes.length > 0 ? Math.round((completed.length / pillarNodes.length) * 100) : 0,
      };
      return acc;
    }, {});
  }, [completedNodes]);

  return (
    <div className="dag-progress-bar bg-black/30 rounded-2xl p-5 text-white font-mono max-w-[600px] mx-auto">
      {/* Overall Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[1.1rem] font-semibold tracking-[0.02em]">Your 12-Chapter Journey</span>
          <span className="text-[1.5rem] font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">{overallPercentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded overflow-hidden mb-2">
          <div className="h-full rounded transition-[width] duration-500"
            style={{
              width: `${overallPercentage}%`,
              background: overallPercentage === 100
                ? 'linear-gradient(90deg, #34d399, #60a5fa)'
                : 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            }}
          />
        </div>
        <div className="flex justify-between text-[0.75rem] text-white/50">
          <span>{completedCount} / {totalNodes} nodes</span>
          <span>{12 - Object.values(fretProgress).filter(f => f.isComplete).length} chapters remaining</span>
        </div>
      </div>

      {/* Fret Map — Horizontal timeline */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => {
          const meta = FRET_METADATA[fret];
          const progress = fretProgress[fret];
          const isCurrent = fret === currentFret;
          const isLocked = !progress.isComplete && fret > 1 && !fretProgress[fret - 1]?.isComplete;

          return (
            <div
              key={fret}
              className={`relative min-w-[60px] h-20 bg-white/5 rounded-lg flex flex-col items-center justify-center border transition-all duration-300 ${
                isCurrent ? 'border-2 border-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.3)]' :
                progress.isComplete ? 'bg-green-400/[0.15] border-green-400/40' :
                'border-white/10'
              } ${isLocked ? 'opacity-40' : ''}`}
            >
              <div className="text-[1.2rem] font-bold mb-0.5">{fret}</div>
              <div className="text-[0.55rem] text-white/60 text-center leading-[1.2]">{meta?.interval?.split(' ')[0]}</div>
              <div className="text-[0.5rem] text-white/40 text-center mt-0.5">{meta?.character}</div>
              {progress.isComplete && <div className="absolute top-1 right-1 text-[0.7rem]">✓</div>}
              {isCurrent && <div className="absolute -inset-0.5 rounded-[10px] border-2 border-blue-400 animate-pulse" />}
              {isLocked && <div className="absolute text-[0.8rem] opacity-50">🔒</div>}
            </div>
          );
        })}
      </div>

      {/* Pillar Progress */}
      <div className="mb-4">
        <div className="text-[0.8rem] text-white/50 mb-2 uppercase tracking-[0.08em]">{t('threePillars')}</div>
        <div className="grid grid-cols-3 gap-2">
          {['class', 'guitar', 'workbook'].map(pillar => {
            const prog = pillarProgress[pillar];
            return (
              <div key={pillar} className="bg-white/5 rounded-lg p-3 text-center border border-white/[0.08]">
                <div className="text-[1.5rem] mb-1">{PILLAR_ICONS[pillar]}</div>
                <div className="text-[0.7rem] text-white/70 mb-1">
                  {pillar === 'class' ? t('pillarSong') : pillar === 'guitar' ? t('pillarGuitar') : t('pillarPlayer')}
                </div>
                <div className="text-[1rem] font-bold mb-1">{prog.percentage}%</div>
                <div className="h-1 bg-white/10 rounded overflow-hidden">
                  <div className="h-full rounded transition-[width] duration-500"
                    style={{
                      width: `${prog.percentage}%`,
                      background: PHASE_COLORS[pillar === 'class' ? 'be' : pillar === 'guitar' ? 'play' : 'reflection'],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Node Indicator */}
      {currentNodeId && (
        <div className="border-t border-white/10 pt-4">
          <div className="text-[0.75rem] text-white/50 mb-2 uppercase tracking-[0.08em]">{t('currentFocus')}</div>
          <div className="bg-blue-400/10 rounded-lg p-3 border border-blue-400/20">
            <div className="text-[0.7rem] mb-1 font-semibold">
              <span style={{ color: PHASE_COLORS[currentPhase] || '#fff' }}>●</span>
              {' '}{currentPhase?.toUpperCase()}
            </div>
            <div className="text-[0.9rem] font-medium">
              {dagNodes.find(n => n.id === currentNodeId)?.title || currentNodeId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

