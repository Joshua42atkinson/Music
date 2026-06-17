// ═══════════════════════════════════════════════════════════
// CHROMATIC MONOMYTH — Reference Chart
// The 12-fret map showing intervals, ratios, cents, colors,
// Hero's Journey stages, and emotional meaning in one view.
// Route: /monomyth (linked from Song portal)
// ═══════════════════════════════════════════════════════════

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Info } from 'lucide-react';
import chapterData from '../../data/chapterData';
import { useLocale } from '../../hooks/useLocale';

export default function ChromaticMonomyth() {
  const navigate = useNavigate();
  const { locale, t: _t } = useLocale();
  const localize = (val) => (val && typeof val === 'object' ? val[locale] || val.en : val);

  return (
    <div className="min-h-[100svh] bg-[#050508] text-[#e8e6e3] px-4 pb-10" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
      {/* ── Navigation Bar ── */}
      <div className="flex items-center justify-between mb-6 relative z-[2]">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-[10px] bg-white/[0.05] border border-cf-gold/20 text-cf-gold flex items-center justify-center cursor-pointer transition-all duration-300">
          <ArrowLeft size={18} />
        </button>

        <div className="text-center">
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-cf-gold/50 mb-0.5">◈ Reference</p>
          <h1 className="font-heading text-[1.1rem] text-cf-gold m-0">The Chromatic Monomyth</h1>
        </div>

        <button onClick={() => navigate('/')} className="w-9 h-9 rounded-[10px] bg-white/[0.05] border border-cf-gold/20 text-cf-gold flex items-center justify-center cursor-pointer transition-all duration-300">
          <Home size={18} />
        </button>
      </div>

      {/* ── Intro ── */}
      <p className="text-[0.85rem] leading-[1.6] opacity-70 text-center max-w-[540px] mx-auto mb-7 font-heading">
        Twelve semitones. Twelve stages. One journey from silence to surrender.
        Each fret carries a mathematical truth discovered by Pythagoras,
        an emotional doorway, and a chapter of becoming.
      </p>

      {/* ── The Chart ── */}
      <div className="max-w-[800px] mx-auto flex flex-col gap-2">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_1fr_80px_70px] gap-2 py-2.5 px-3 font-mono text-[0.55rem] tracking-[0.15em] uppercase text-cf-gold/40 border-b border-cf-gold/15">
          <span>Fret</span>
          <span>Interval</span>
          <span>Hero Stage</span>
          <span className="text-right">Ratio</span>
          <span className="text-right">Cents</span>
        </div>

        {chapterData.map((fret) => (
          <div
            key={fret.id}
            onClick={() => navigate('/song', { state: { activeFret: fret.fret } })}
            className="grid grid-cols-[40px_1fr_1fr_80px_70px] gap-2 items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer transition-all duration-300"
            onMouseEnter={e => {
              e.currentTarget.style.background = `${fret.color}10`;
              e.currentTarget.style.borderColor = `${fret.color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
          >
            {/* Fret number + color dot */}
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: fret.color, boxShadow: `0 0 8px ${fret.color}40` }}
              />
              <span className="font-mono text-[0.85rem] text-cf-gold">{fret.fret}</span>
            </div>

            {/* Interval */}
            <div>
              <span className="text-[0.85rem] text-[#e8e6e3] font-medium">{localize(fret.interval)}</span>
              <span className="block text-[0.65rem] opacity-50 mt-0.5 font-mono">{fret.note}</span>
            </div>

            {/* Hero Stage */}
            <div>
              <span className="text-[0.8rem] text-[#e8e6e3]">{localize(fret.heroStage)}</span>
              <span className="block text-[0.65rem] opacity-45 mt-0.5 italic">{localize(fret.title)}</span>
            </div>

            {/* Ratio */}
            <span className="font-mono text-[0.75rem] text-cf-gold/80 text-right">
              {fret.pythagoreanLegacy?.ratio || '—'}
            </span>

            {/* Cents */}
            <span className="font-mono text-[0.7rem] opacity-50 text-right">
              {fret.pythagoreanLegacy?.cents !== undefined ? `${fret.pythagoreanLegacy.cents}` : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="max-w-[540px] mx-auto mt-8 p-4 rounded-xl bg-cf-gold/[0.04] border border-cf-gold/[0.12]">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} color="rgba(var(--cf-gold-rgb),0.5)" />
          <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-cf-gold/50">How to Read</span>
        </div>
        <p className="text-[0.8rem] leading-[1.5] opacity-60 m-0">
          <strong className="text-cf-gold">Ratio:</strong> The Pythagorean frequency ratio —
          the ancient Greek mathematical origin of each interval.<br />
          <strong className="text-cf-gold">Cents:</strong> Modern unit of pitch measurement.
          1200 cents = one octave. Pythagoras measured by ear; we measure by cents.<br />
          <strong className="text-cf-gold">Click any row</strong> to jump to that chapter in The Song.
        </p>
      </div>

      {/* ── Footer ── */}
      <p className="text-center mt-8 font-mono text-[0.6rem] opacity-30">
        12 semitones · 12 ratios · 12 stages · One journey
      </p>
    </div>
  );
}
