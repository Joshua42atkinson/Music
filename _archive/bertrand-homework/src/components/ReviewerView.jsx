import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const localize = (val) => {
  if (!val) return '';
  if (typeof val === 'object') {
    return val['en'] || Object.values(val)[0] || '';
  }
  return val;
};

// Simplified translation function for homework app
const t = (key) => {
  const dict = {
    howMusicWorks: "How Music Works",
    howGuitarWorks: "How the Guitar Works",
    nextFret: "Next Chapter",
    references: "References",
    viewReferences: "View",
    hideReferences: "Hide",
    seconds: "seconds"
  };
  return dict[key] || key;
};

// ── References Panel — Expandable citations ──
function ReferencesPanel({ references }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '8px 14px',
          color: '#5a6a80', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', textAlign: 'left',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>📚</span>
        <span style={{ flex: 1 }}>
          {open ? t('hideReferences') : t('viewReferences')} {t('references')} ({references.length})
        </span>
        <span style={{ opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          marginTop: 8, padding: '12px 14px',
          background: 'rgba(201,169,110,0.04)',
          border: '1px solid rgba(201,169,110,0.12)',
          borderRadius: 8,
        }}>
          {references.map((ref, i) => (
            <div key={i} style={{
              marginBottom: i < references.length - 1 ? 12 : 0,
              paddingBottom: i < references.length - 1 ? 12 : 0,
              borderBottom: i < references.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '0.95rem',
                fontStyle: 'italic', color: '#c9a96e', margin: 0,
              }}>
                {ref.title}
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: '#5a6a80', margin: '2px 0 4px', letterSpacing: '0.08em',
              }}>
                {ref.author} · {ref.date}
              </p>
              <p style={{
                fontSize: '0.8rem', color: '#8090a8', lineHeight: 1.6, margin: 0,
              }}>
                {ref.context}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Slide Content Renderer ──
function SlideContent({ slide }) {
  if (slide.type === 'tutorial') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
         <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">{slide.title}</h1>
         <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">{slide.body}</p>
         {slide.subtext && <p className="mt-8 text-indigo-400 font-mono text-sm uppercase tracking-widest">{slide.subtext}</p>}
      </div>
    );
  }

  switch (slide.type) {
    case 'title':
      return (
        <>
          <p className="sv-label" style={{ color: slide.accent }}>{localize(slide.label)}</p>
          <h1 className="sv-title">{localize(slide.title)}</h1>
          <p className="sv-subtitle">{localize(slide.subtitle)}</p>
          <p className="sv-meta">{localize(slide.meta)}</p>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'pythagorean-legacy':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p style={{ fontStyle: 'italic', opacity: 0.85 }}>{localize(slide.hook)}</p></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <div style={{
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#c9a96e'
            }}>Ratio: {slide.ratio}</div>
            <div style={{
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#c9a96e'
            }}>{slide.cents} cents</div>
          </div>
        </>
      );

    case 'yin-philosophy':
      return (
        <>
          <p className="sv-label" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
          {slide.title && <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>}
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'yin-quote':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p className="sv-label" style={{ color: '#7b6aaa', textAlign: 'center' }}>{localize(slide.label)}</p>
          <p className="sv-quote">"{localize(slide.quote)}"</p>
          <p className="sv-author">— {localize(slide.author)}</p>
        </div>
      );

    case 'yin-concept':
      return (
        <>
          <p className="sv-label" style={{ color: '#7b6aaa' }}>{localize(slide.label)}</p>
          <h2 className="sv-concept-term">{localize(slide.title)}</h2>
          <p className="sv-concept-def">{localize(slide.body)}</p>
        </>
      );

    case 'yin-shedding':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p className="sv-label" style={{ color: '#c9a96e', textAlign: 'center' }}>{localize(slide.label)}</p>
          <p className="sv-quote" style={{ color: '#e8edf2' }}>{localize(slide.body)}</p>
        </div>
      );

    case 'yin-meditation':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p className="sv-label" style={{ color: '#7b6aaa', textAlign: 'center' }}>{localize(slide.label)}</p>
          <p className="sv-meditation-prompt">{localize(slide.body)}</p>
          {slide.duration && <p className="sv-duration">⏱ {slide.duration} {t('seconds')}</p>}
        </div>
      );

    case 'yang-instruction':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
        </>
      );

    case 'yang-theory':
      return (
        <>
          <p className="sv-label" style={{ color: '#0abde3' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}>{localize(slide.title)}</h2>
          
          <div className="mb-6 p-4 rounded-xl bg-[#0abde3]/10 border border-[#0abde3]/30">
            <h3 className="font-bold text-[#0abde3] text-sm mb-2 font-mono uppercase tracking-wider">
              {t('howMusicWorks')}
            </h3>
            <p className="sv-body text-sm">{localize(slide.musicGrammar)}</p>
          </div>
          
          <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: 'rgba(201,169,110,0.3)', backgroundColor: 'rgba(201,169,110,0.1)' }}>
            <h3 className="font-bold text-sm mb-2 font-mono uppercase tracking-wider" style={{ color: '#c9a96e' }}>
              {t('howGuitarWorks')}
            </h3>
            <p className="sv-body text-sm">{localize(slide.guitarGrammar)}</p>
          </div>
        </>
      );

    case 'yang-exercise':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div>
            {slide.steps?.map((step, i) => (
              <div key={i} className="sv-step">
                <span className="sv-step-num" style={{
                  background: `${slide.accent}20`,
                  color: slide.accent
                }}>{i + 1}</span>
                <span className="sv-step-text">{localize(step)}</span>
              </div>
            ))}
          </div>
          
          {/* Missing interactive widgets for homework mode */}
          <div style={{ marginTop: 24, padding: 16, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 8, textAlign: 'center' }}>
            <p className="text-sm text-slate-400 font-mono">Interactive Exercise Widget Hidden in Review Mode</p>
          </div>
        </>
      );

    case 'yang-fretboard':
      return (
        <>
          <p className="sv-label" style={{ color: '#c9a96e' }}>{localize(slide.label)}</p>
          <h2 className="sv-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{localize(slide.title)}</h2>
          <div className="sv-body"><p>{localize(slide.body)}</p></div>
          <div style={{ marginTop: 24, padding: 16, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 8, textAlign: 'center' }}>
            <p className="text-sm text-slate-400 font-mono">Fretboard Widget Hidden in Review Mode</p>
          </div>
        </>
      );

    case 'fret-end':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
          <div className="sv-end-icon">{slide.icon}</div>
          <h2 className="sv-end-title">{localize(slide.title)}</h2>
          <p className="sv-end-body">{localize(slide.body)}</p>
          <p className="text-emerald-400 font-mono mt-4">✓ End of Chapter</p>
        </div>
      );

    case 'timeless-song':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Label + ratio badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="sv-label" style={{ color: '#c9a96e', margin: 0 }}>{localize(slide.label)}</p>
            {slide.ratio && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                color: '#c9a96e', background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.25)',
                padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em',
              }}>
                {slide.ratio}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
            fontWeight: 400, color: '#e8edf2', lineHeight: 1.15, margin: 0,
          }}>
            {localize(slide.title)}
          </h2>

          {/* POV body — split by \n\n into paragraphs */}
          <div style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b0b8c8' }}>
            {(localize(slide.body) || '').split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1em' }}>{para}</p>
            ))}
          </div>

          {/* Historical subtext provenance */}
          {slide.subtext && (
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
              color: '#5a6a80', letterSpacing: '0.12em', textTransform: 'uppercase',
              borderLeft: '2px solid rgba(201,169,110,0.3)', paddingLeft: '0.75rem',
            }}>
              {localize(slide.subtext)}
            </p>
          )}

          {/* Quote */}
          {slide.quote && (
            <div style={{
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 10, padding: '1rem 1.2rem',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '1.05rem',
                fontStyle: 'italic', color: '#c9a96e', lineHeight: 1.7, margin: 0,
              }}>
                "{localize(slide.quote)}"
              </p>
              {slide.author && (
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                  color: '#5a6a80', marginTop: '0.5rem', letterSpacing: '0.1em',
                }}>
                  — {localize(slide.author)}
                </p>
              )}
            </div>
          )}

          {/* References panel — expandable */}
          {slide.references?.length > 0 && (
            <ReferencesPanel references={slide.references} />
          )}
        </div>
      );

    default:
      return <p className="sv-body">{localize(slide.body)}</p>;
  }
}

export default function ReviewerView({ slide, onNext, onPrev }) {
  if (!slide) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-0 md:p-8">
      <style>{`
        .sv-container {
          position: relative; 
          width: 100%; max-width: 440px;
          height: 100%; max-height: 900px;
          background: #030306;
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
          color: #e0e0ff;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .sv-container {
            height: 90vh;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 40px 80px rgba(0,0,0,0.8);
          }
        }
        .sv-slide-area { flex: 1; position: relative; overflow-y: auto; }
        .sv-slide { display: flex; flex-direction: column; min-height: 100%; }
        
        .sv-image-zone {
          flex-shrink: 0; height: auto; min-height: 200px; max-height: 45vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; background: #000;
        }
        .sv-image-zone img, .sv-image-zone svg {
          width: 100%; height: auto; max-height: 45vh; object-fit: cover; opacity: 0.9;
          display: block;
        }
        .sv-image-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(transparent, #030306);
        }
        .sv-text-zone {
          flex: 1;
          padding: 28px 24px 60px;
          background: rgba(6,6,12,0.8);
        }
        
        /* Typography */
        .sv-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.22em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .sv-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 7vw, 2.8rem);
          font-weight: 400; color: #e8edf2;
          margin-bottom: 16px; line-height: 1.1;
        }
        .sv-subtitle {
          font-size: 0.95rem; color: #5a6a80;
          font-style: italic; margin-bottom: 8px;
        }
        .sv-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          letter-spacing: 0.1em; margin-bottom: 20px;
        }
        .sv-body {
          font-size: 1.05rem; line-height: 1.85;
          color: #b0b8c8;
        }
        .sv-body p { margin-bottom: 1.2em; }
        
        /* Components */
        .sv-quote {
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.3rem, 5vw, 1.8rem);
          font-style: italic; color: #7aaa88;
          line-height: 1.7; text-align: center;
          padding: 0 8px;
        }
        .sv-author {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          text-align: center; margin-top: 20px;
          letter-spacing: 0.1em;
        }
        .sv-concept-term {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400;
          color: #e8edf2; margin-bottom: 16px;
        }
        .sv-concept-def {
          font-size: 1.1rem; line-height: 1.85; color: #b0b8c8;
        }
        .sv-meditation-prompt {
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem; font-style: italic;
          color: #e8edf2; line-height: 1.8; text-align: center; padding: 0 8px;
        }
        .sv-duration {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #7b6aaa;
          text-align: center; margin-top: 20px; letter-spacing: 0.15em;
        }
        .sv-step {
          display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px;
        }
        .sv-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace; margin-top: 2px;
        }
        .sv-step-text {
          font-size: 1rem; line-height: 1.7; color: #b0b8c8;
        }
        .sv-end-icon { font-size: 4rem; text-align: center; margin-bottom: 20px; }
        .sv-end-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; text-align: center; color: #e8edf2; margin-bottom: 12px;
        }
        .sv-end-body {
          font-size: 1rem; color: #8090a8; text-align: center; line-height: 1.7; margin-bottom: 30px;
        }
      `}</style>

      {/* Navigation Overlays (Desktop) */}
      <button 
        onClick={onPrev}
        className="hidden md:flex absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all items-center justify-center z-10"
      >
        <ChevronLeft size={48} />
      </button>
      
      {/* The Masterclass Slide Emulator */}
      <div className="sv-container">
        
        {/* Top meta strip */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur border-b border-white/5 z-10">
          <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">{slide.id}</div>
          <div className="font-mono text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
            {slide.type}
          </div>
        </div>

        <div className="sv-slide-area">
          <div className="sv-slide">
             {/* Image Zone */}
             {slide.image && (
                <div className="sv-image-zone">
                  <img src={slide.image} alt="" />
                  <div className="sv-image-overlay" />
                </div>
             )}

             {/* Text Zone */}
             <div className="sv-text-zone">
                <SlideContent slide={slide} />
             </div>
          </div>
        </div>

      </div>

      <button 
        onClick={onNext}
        className="hidden md:flex absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all items-center justify-center z-10"
      >
        <ChevronRight size={48} />
      </button>

      {/* Mobile Nav overlay (bottom) */}
      <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-between px-6 z-20 pointer-events-none">
        <button onClick={onPrev} className="p-4 bg-black/50 backdrop-blur rounded-full text-white pointer-events-auto border border-white/10">
           <ChevronLeft size={24} />
        </button>
        <button onClick={onNext} className="p-4 bg-black/50 backdrop-blur rounded-full text-white pointer-events-auto border border-white/10">
           <ChevronRight size={24} />
        </button>
      </div>

    </div>
  );
}
