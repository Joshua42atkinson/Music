// ═══════════════════════════════════════════════════════════
// BEWorkbookHeader — Fret selector + fret metadata display
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { dagNodes, FRET_METADATA } from '../../data/dag/dagNodes';
import { isNodeUnlocked } from '../../data/dag/dagEdges';

export default function BEWorkbookHeader({
  selectedFret,
  onSelectFret,
  completedNodes,
  traction,
}) {
  const fretNodes = dagNodes.filter(n => n.fret === selectedFret);
  const meta = FRET_METADATA[selectedFret] || {};

  return (
    <>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="font-heading text-[1.8rem] text-vv-text m-0 mb-2">Academy Curriculum Path</h2>
        <p className="font-mono text-[0.8rem] text-cf-gold tracking-[0.08em] m-0">
          Module {selectedFret} — {meta.interval} ({meta.character})
        </p>
      </div>

      {/* Module Selector */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => {
          const isComplete = fretNodes.every(n => completedNodes.includes(n.id));
          const isSelected = fret === selectedFret;
          const isLocked = fret > 1 && !isNodeUnlocked(
            `fret-${fret}-class-be`,
            completedNodes,
            traction?.settings?.sandboxMode
          );

          return (
            <button
              key={fret}
              onClick={() => !isLocked && onSelectFret(fret)}
              onKeyDown={(e) => e.key === 'Enter' && !isLocked && onSelectFret(fret)}
              className={[
                'relative min-w-[48px] h-12 rounded-[10px] border bg-white/[0.05] text-[#e8edf2] cursor-pointer flex items-center justify-center transition-all duration-200 font-mono',
                isSelected ? 'border-2 border-[#60a5fa] shadow-[0_0_12px_rgba(96,165,250,0.3)]' : 'border-white/10',
                isComplete ? 'bg-emerald-400/[0.15] border-emerald-400/40' : '',
                isLocked ? 'opacity-30 cursor-not-allowed' : '',
              ].filter(Boolean).join(' ')}
              disabled={isLocked}
              aria-pressed={isSelected}
              aria-label={`Fret ${fret}${isComplete ? ' complete' : ''}${isLocked ? ' locked' : ''}`}
            >
              <span className="text-base font-bold">{fret}</span>
              {isComplete && <span className="absolute top-0.5 right-0.5 text-[0.6rem]">✓</span>}
              {isLocked && <span className="absolute text-[0.7rem]">🔒</span>}
            </button>
          );
        })}
      </div>

      {/* Fret Info */}
      <div className="text-center mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        <div className="font-heading text-[1.4rem] text-cf-gold mb-1">{meta.character}</div>
        <div className="font-mono text-[0.7rem] text-white/50 flex justify-center gap-2 mb-1">
          <span>{meta.ratio} ratio</span>
          <span>•</span>
          <span>{meta.cents} cents</span>
          <span>•</span>
          <span>{meta.hzExample}</span>
        </div>
        <div className="text-[0.85rem] text-white/60 italic">{meta.emotion}</div>
      </div>
    </>
  );
}
