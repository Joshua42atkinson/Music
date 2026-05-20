import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// GLOSSARY — In-app plain-English glossary for Voix Vive terms
// Triggered by a "?" button. Slides up from bottom.
// Written at 8th-grade reading level for novice learners.
// ═══════════════════════════════════════════════════════════

const GLOSSARY_ENTRIES = [
  { term: 'Vertiscale', plain: 'A vertical scale shape — the pattern of notes going up and down across all 6 strings at one fret position.' },
  { term: '©SHEARL', plain: 'See, Hear, Feel — the first step. Study the pattern before touching anything.' },
  { term: '©PLING!', plain: 'Sing then Play — hear the note in your head, sing it, then find it on the guitar.' },
  { term: '©FHEAL', plain: 'Feel and Express — stop thinking and let your fingers follow your instinct.' },
  { term: 'Flash', plain: 'Quick recall game. A pattern appears and disappears — try to recreate it from your imagination.' },
  { term: 'Imagine', plain: 'Slow study mode. The pattern stays visible while you practice holding it steady in your mind.' },
  { term: 'Audiate', plain: 'Imagining a sound in your head before you make it out loud. Like reading silently, but with music.' },
  { term: 'Root Note', plain: 'The home base note. Everything else in a scale or chord is measured from here.' },
  { term: 'Fret (in menus)', plain: 'A numbered chapter or section. The app menus look like a guitar neck, so each section = one fret.' },
  { term: 'Bard Level', plain: 'Your progress level. It goes up as you practice consistently — not by going fast.' },
  { term: 'Myelination', plain: 'When your brain builds faster nerve pathways through slow, careful repetition. This is how lasting skills form.' },
  { term: 'Inner Fretboard', plain: 'Your ability to see the guitar neck in your mind, without looking at the real one.' },
  { term: 'Inner Ear', plain: 'Your ability to hear a note in your head before you sing or play it.' },
  { term: 'Inner Voice', plain: 'Self-awareness — noticing what you are doing and feeling while you play.' },
  { term: 'Pitch Gate', plain: 'A moment in the game where you must sing or hum a note to continue. Your microphone checks the pitch.' },
  { term: 'Cents', plain: 'A tiny unit of pitch (1/100th of a note). Used to measure how in-tune you are.' },
];

export default function Glossary() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? GLOSSARY_ENTRIES.filter(e =>
        e.term.toLowerCase().includes(search.toLowerCase()) ||
        e.plain.toLowerCase().includes(search.toLowerCase())
      )
    : GLOSSARY_ENTRIES;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open glossary"
        style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#8090a8', borderRadius: '50%',
          width: 36, height: 36,
          fontSize: '1rem', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >?</button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 300,
                background: 'rgba(3,3,6,0.7)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Slide-up panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 301,
                maxHeight: '75vh',
                background: 'linear-gradient(180deg, #12100e 0%, #0d0d14 100%)',
                borderTop: '1px solid rgba(201,169,110,0.15)',
                borderRadius: '20px 20px 0 0',
                display: 'flex', flexDirection: 'column',
                fontFamily: 'Inter, sans-serif', color: '#e0e0ff',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {/* Handle */}
              <div style={{
                display: 'flex', justifyContent: 'center', padding: '12px 0 8px',
              }}>
                <div style={{
                  width: 40, height: 4, borderRadius: 2,
                  background: 'rgba(255,255,255,0.15)',
                }} />
              </div>

              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.3rem', fontWeight: 500, color: '#c9a96e',
                  margin: 0,
                }}>Glossary</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none', border: 'none', color: '#5a6a80',
                    fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px',
                  }}
                >✕</button>
              </div>

              {/* Search */}
              <div style={{ padding: '12px 20px 8px' }}>
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, color: '#e0e0ff',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Entries */}
              <div style={{
                flex: 1, overflow: 'auto', padding: '8px 20px 24px',
                WebkitOverflowScrolling: 'touch',
              }}>
                {filtered.map(entry => (
                  <div key={entry.term} style={{
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
                      color: '#c9a96e', letterSpacing: '0.05em', marginBottom: 6,
                    }}>{entry.term}</div>
                    <div style={{
                      fontSize: '0.95rem', color: '#b0b8c8', lineHeight: 1.6,
                    }}>{entry.plain}</div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p style={{ color: '#5a6a80', fontSize: '0.9rem', textAlign: 'center', marginTop: 24 }}>
                    No matching terms found.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
