// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : CurriculumSummary.jsx                              ║
// ║ WHAT    : 12-slide data dump — one card per fret, no art     ║
// ║ WHY     : Audience positioning. Quick scan of full arc.    ║
// ║ WHO     : New visitors, potential students, Bertrand         ║
// ║ RULES   : No images. Clean typography. Printable-friendly.   ║
// ║           One idea per card. The spiral should be visible. ║
// ╚═══════════════════════════════════════════════════════════════╝
import React from 'react';
import { useLocale } from '../hooks/useLocale';
import frets from '../data/chapterData';

function extractFirstSentence(text) {
  if (!text) return '';
  // Split on sentence-ending punctuation followed by space or end
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.slice(0, 120) + '...';
}

function extractFirstParagraph(text) {
  if (!text) return '';
  const paragraphs = text.split('\n').filter(p => p.trim());
  return paragraphs[0] || '';
}

export default function CurriculumSummary() {
  const { locale } = useLocale();
  const lang = locale;

  return (
    <div className="min-h-[100svh] bg-[#0a0d14] text-[#e8dcc8] font-sans">
      <style>{`
        @media print {
          .summary-card { break-inside: avoid; page-break-inside: avoid; }
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print py-8 px-6 pb-4 text-center border-b border-cf-gold/15">
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-cf-gold/50 m-0 mb-2">
          Voix Vive · The Chromatic Monomyth
        </p>
        <h1 className="font-heading text-[clamp(1.6rem,5vw,2.2rem)] font-normal text-vv-text m-0">
          The 12-Fret Journey
        </h1>
        <p className="font-[EB_Garamond] italic text-white/40 text-[0.95rem] mt-2">
          One semitone. One stage. One transformation.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-[720px] mx-auto py-6 px-4 pb-20">
        {frets.map((fret, idx) => {
          const yinPhil = fret.yin?.philosophy?.[lang] || fret.yin?.philosophy?.en || '';
          const yangInst = fret.yang?.instruction?.[lang] || fret.yang?.instruction?.en || '';
          const quoteText = fret.yin?.quote?.text?.[lang] || fret.yin?.quote?.text?.en || '';
          const quoteAuthor = fret.yin?.quote?.author || '';
          const coreMsg = fret.coreMessage?.[lang] || fret.coreMessage?.en || '';
          const heroStage = fret.heroStage?.[lang] || fret.heroStage?.en || '';
          const interval = fret.interval?.[lang] || fret.interval?.en || '';
          const title = fret.title?.[lang] || fret.title?.en || '';
          const pillar = fret.pillar?.[lang] || fret.pillar?.en || '';

          const isPart3 = idx >= 8; // Frets 9-12 (0-indexed: 8-11)
          const isPart2 = idx >= 4 && idx < 8;
          const partLabel = isPart3 ? 'Part 3 · Playing Free'
            : isPart2 ? 'Part 2 · Learning the Language'
            : 'Part 1 · Finding Your Voice';

          return (
            <div key={fret.id} className="summary-card mb-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {/* Fret header */}
              <div className="flex items-baseline gap-2.5 mb-2.5">
                <span className="font-mono text-[0.65rem] tracking-[0.1em]" style={{ color: fret.color || 'var(--cf-gold)' }}>
                  FRET {fret.fret}
                </span>
                <span className="font-mono text-[0.6rem] text-white/30">
                  {fret.note} · {interval}
                </span>
                {idx === 0 && (
                  <span className="font-mono text-[0.5rem] text-[rgba(122,170,136,0.6)] tracking-[0.08em] uppercase ml-auto">
                    {partLabel}
                  </span>
                )}
                {idx === 4 && (
                  <span className="font-mono text-[0.5rem] text-[rgba(90,138,170,0.6)] tracking-[0.08em] uppercase ml-auto">
                    {partLabel}
                  </span>
                )}
                {idx === 8 && (
                  <span className="font-mono text-[0.5rem] text-cf-gold/60 tracking-[0.08em] uppercase ml-auto">
                    {partLabel}
                  </span>
                )}
              </div>

              {/* Title + Hero Stage */}
              <h2 className="font-heading text-[1.15rem] font-semibold text-vv-text m-0 mb-1 leading-[1.3]">
                {title}
              </h2>
              <p className="font-mono text-[0.6rem] text-cf-gold/50 tracking-[0.08em] uppercase m-0 mb-3">
                {heroStage} · {pillar}
              </p>

              {/* Core message */}
              {coreMsg && (
                <p className="font-[EB_Garamond] text-[0.95rem] italic text-white/65 leading-[1.5] m-0 mb-3 pl-3"
                  style={{ borderLeft: `2px solid ${fret.color || 'var(--cf-gold)'}40` }}>
                  {coreMsg}
                </p>
              )}

              {/* Yin excerpt */}
              {yinPhil && (
                <p className="text-[0.82rem] text-white/50 leading-[1.6] m-0 mb-2">
                  <span className="font-mono text-[0.55rem] text-cf-gold/40 uppercase tracking-[0.08em]">Yin · </span>
                  {extractFirstParagraph(yinPhil)}
                </p>
              )}

              {/* Yang excerpt */}
              {yangInst && (
                <p className="text-[0.82rem] text-white/50 leading-[1.6] m-0 mb-2">
                  <span className="font-mono text-[0.55rem] text-cf-gold/40 uppercase tracking-[0.08em]">Yang · </span>
                  {extractFirstSentence(yangInst)}
                </p>
              )}

              {/* Quote */}
              {quoteText && (
                <p className="font-[EB_Garamond] text-[0.8rem] italic text-cf-gold/50 leading-[1.5] m-0 mt-2 pt-2 border-t border-white/[0.04]">
                  “{quoteText}” — {quoteAuthor}
                </p>
              )}
            </div>
          );
        })}

        {/* Closing */}
        <div className="text-center py-8 px-5 border-t border-cf-gold/10">
          <p className="font-heading text-[1.1rem] text-white/30 italic">
            The octave is the spiral, not the circle.
          </p>
          <p className="font-mono text-[0.55rem] text-white/15 tracking-[0.15em] uppercase mt-2">
            voix-vive.com · Bertrand Laurence
          </p>
        </div>
      </div>
    </div>
  );
}
