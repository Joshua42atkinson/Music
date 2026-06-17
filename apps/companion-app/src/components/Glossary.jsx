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
  { term: 'Chapter', plain: 'A numbered section. The app menus look like a guitar neck, so each chapter corresponds to one step of the journey.' },
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
        className="bg-white/[0.04] border border-white/[0.08] text-[#8090a8] rounded-full w-9 h-9 text-base cursor-pointer font-mono flex items-center justify-center transition-all duration-200"
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
              className="fixed inset-0 z-[300] bg-[rgba(3,3,6,0.7)] backdrop-blur-[4px]"
            />

            {/* Slide-up panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[301] max-h-[75vh] bg-gradient-to-b from-[#12100e] to-[#0d0d14] border-t border-cf-gold/15 rounded-t-[20px] flex flex-col font-sans text-[#e0e0ff] pb-[env(safe-area-inset-bottom)]"
            >
              {/* Handle */}
              <div className="flex justify-center py-3 pb-2">
                <div className="w-10 h-1 rounded bg-white/15" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-white/[0.06]">
                <h2 className="font-heading text-[1.3rem] font-medium text-cf-gold m-0">Glossary</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent border-none text-[#5a6a80] text-[1.2rem] cursor-pointer py-1 px-2"
                >✕</button>
              </div>

              {/* Search */}
              <div className="py-3 px-5 pb-2">
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[#e0e0ff] font-mono text-[0.85rem] outline-none"
                />
              </div>

              {/* Entries */}
              <div className="flex-1 overflow-auto py-2 px-5 pb-6">
                {filtered.map(entry => (
                  <div key={entry.term} className="py-3.5 border-b border-white/[0.04]">
                    <div className="font-mono text-[0.85rem] text-cf-gold tracking-[0.05em] mb-1.5">{entry.term}</div>
                    <div className="text-[0.95rem] text-[#b0b8c8] leading-[1.6]">{entry.plain}</div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-[#5a6a80] text-[0.9rem] text-center mt-6">
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
