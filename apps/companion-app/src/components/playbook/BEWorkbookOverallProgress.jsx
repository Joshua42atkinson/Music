// ═══════════════════════════════════════════════════════════
// BEWorkbookOverallProgress — Phase completion bar
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { dagNodes } from '../../data/dag/dagNodes';

export default function BEWorkbookOverallProgress({ traction }) {
  const completedPhases = Object.values(traction?.frets || {}).reduce((sum, f) => {
    return sum + (f.beCompleted ? 1 : 0) + (f.doCompleted ? 1 : 0) + (f.playCompleted ? 1 : 0);
  }, 0);
  const totalPhases = dagNodes.filter(n => n.phase !== 'all').length || 108;
  const percent = Math.min(100, Math.round((completedPhases / totalPhases) * 100));

  return (
    <div className="p-5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
      <h3 className="font-mono text-[0.7rem] text-cf-gold/60 tracking-[0.2em] uppercase m-0 mb-3">Overall Progress</h3>
      <div className="h-2 bg-white/[0.06] rounded overflow-hidden mb-2">
        <div
          className="h-full rounded bg-gradient-to-r from-[#60a5fa] to-[#34d399] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[0.7rem] text-white/40">
        <span>{completedPhases} / {totalPhases} phases</span>
        <span>{percent}% complete</span>
      </div>
    </div>
  );
}
