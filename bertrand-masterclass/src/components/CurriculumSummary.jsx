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
      <div className="no-print" style={{
        padding: '32px 24px 16px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(201,169,110,0.5)',
          margin: '0 0 8px',
        }}>
          Voix Vive · The Chromatic Monomyth
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
          fontWeight: 400,
          color: '#f0e6d2',
          margin: 0,
        }}>
          The 12-Fret Journey
        </h1>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.95rem',
          margin: '8px 0 0',
        }}>
          One semitone. One stage. One transformation.
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 80px' }}>
        {frets.map((fret, idx) => {
          const yinPhil = fret.yin?.philosophy?.[lang] || fret.yin?.philosophy?.en || '';
          const yangInst = fret.yang?.instruction?.[lang] || fret.yang?.instruction?.en || '';
          const quoteText = fret.yin?.quote?.text?.[lang] || fret.yin?.quote?.text?.en || '';
          const quoteAuthor = fret.yin?.quote?.author || '';
          const coreMsg = fret.coreMessage?.[lang] || fret.coreMessage?.en || '';
          const heroStage = fret.heroStage?.[lang] || fret.heroStage?.en || '';
          const interval = fret.interval?.[lang] || fret.interval?.en || '';
          const title = fret.title?.[lang] || fret.title?.en || '';
          const act = fret.act?.[lang] || fret.act?.en || '';
          const pillar = fret.pillar?.[lang] || fret.pillar?.en || '';

          const isPart3 = idx >= 8; // Frets 9-12 (0-indexed: 8-11)
          const isPart2 = idx >= 4 && idx < 8;
          const partLabel = isPart3 ? 'Part 3 · Playing Free'
            : isPart2 ? 'Part 2 · Learning the Language'
            : 'Part 1 · Finding Your Voice';

          return (
            <div key={fret.id} className="summary-card" style={{
              marginBottom: 16,
              padding: 20,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Fret header */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: fret.color || '#c9a96e',
                  letterSpacing: '0.1em',
                }}>
                  FRET {fret.fret}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {fret.note} · {interval}
                </span>
                {idx === 0 && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5rem',
                    color: 'rgba(122,170,136,0.6)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    {partLabel}
                  </span>
                )}
                {idx === 4 && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5rem',
                    color: 'rgba(90,138,170,0.6)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    {partLabel}
                  </span>
                )}
                {idx === 8 && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5rem',
                    color: 'rgba(201,169,110,0.6)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    {partLabel}
                  </span>
                )}
              </div>

              {/* Title + Hero Stage */}
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#f0e6d2',
                margin: '0 0 4px',
                lineHeight: 1.3,
              }}>
                {title}
              </h2>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(201,169,110,0.5)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 12px',
              }}>
                {heroStage} · {pillar}
              </p>

              {/* Core message */}
              {coreMsg && (
                <p style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.5,
                  margin: '0 0 12px',
                  paddingLeft: 12,
                  borderLeft: `2px solid ${fret.color || '#c9a96e'}40`,
                }}>
                  {coreMsg}
                </p>
              )}

              {/* Yin excerpt */}
              {yinPhil && (
                <p style={{
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                  margin: '0 0 8px',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.55rem',
                    color: 'rgba(201,169,110,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>Yin · </span>
                  {extractFirstParagraph(yinPhil)}
                </p>
              )}

              {/* Yang excerpt */}
              {yangInst && (
                <p style={{
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                  margin: '0 0 8px',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.55rem',
                    color: 'rgba(201,169,110,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>Yang · </span>
                  {extractFirstSentence(yangInst)}
                </p>
              )}

              {/* Quote */}
              {quoteText && (
                <p style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                  color: 'rgba(201,169,110,0.5)',
                  lineHeight: 1.5,
                  margin: '8px 0 0',
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                  “{quoteText}” — {quoteAuthor}
                </p>
              )}
            </div>
          );
        })}

        {/* Closing */}
        <div style={{
          textAlign: 'center',
          padding: '32px 20px',
          borderTop: '1px solid rgba(201,169,110,0.1)',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.3)',
            fontStyle: 'italic',
          }}>
            The octave is the spiral, not the circle.
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 8,
          }}>
            voix-vive.com · Bertrand Laurence
          </p>
        </div>
      </div>
    </div>
  );
}
