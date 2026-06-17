// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TutorialMenu.jsx                                     ║
// ║ WHAT    : Interactive "How This Works" guide — always          ║
// ║           accessible from the Binder (blue book widget)        ║
// ║ WHY     : Users can't beta-test what they can't understand.    ║
// ║           PEARL wraps the app around the user — this IS the    ║
// ║           wrapper. Every section answers "what do I do next?"  ║
// ║ WHO     : Any user, any time, any experience level             ║
// ║ RULES   : No dead ends. Every step links to the next action.   ║
// ║           Language: somatic/truebadour brand, never clinical.  ║
// ╚═════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, ChevronRight, ChevronLeft, BookOpen, Music,
  Gamepad2, Guitar, Users, Mic, Star, Compass, Check
} from 'lucide-react';

// ── The 5 Destinations — what each place IS and what to DO there ──
const TOUR_STEPS = [
  {
    id: 'welcome',
    icon: '🎸',
    title: 'Welcome to Voix Vive',
    subtitle: 'The Living Voice',
    body: `You've entered a whole-person guitar academy. This isn't a course — it's a journey through 12 frets, 12 intervals, and one master pedagogy.

Think of this app as a **companion that wraps around you** — not a set of tasks to complete. The more you return, the more it remembers and guides.`,
    cta: null,
    ctaRoute: null,
    color: 'var(--cf-gold)',
    bg: 'rgba(var(--cf-gold-rgb),0.08)',
  },
  {
    id: 'truebadour',
    icon: '🔴',
    title: 'The Truebadour Widget',
    subtitle: 'Red guitar icon — top left',
    body: `The **red guitar icon** is your AI companion — The Truebadour. Tap it anytime.

**What it does:**
• Asks you guided questions about your playing
• Speaks to you in Bertrand's voice style
• Remembers your fret level and practice goals
• Has a voice mode — it can listen AND speak

**Start here:** Open the Truebadour and introduce yourself. Tell it which fret you're working on.`,
    cta: 'Open the Truebadour',
    ctaAction: 'truebadour',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
  },
  {
    id: 'song',
    icon: '🎵',
    title: 'Song — Your Lesson Hub',
    subtitle: 'Where the curriculum lives',
    body: `Navigate to **Song** in the bottom bar (or top nav on desktop).

**This is where you:**
• Choose your current fret (1–12)
• Work through the BE → DO → PLAY sequence
• Access lesson slides and backing tracks
• Track your mastery stars

**The progression:**
○ Encountered → ◐ Experienced → ● Owned → ★ Mastered

**Start here:** Pick Fret 1 and read the first slide. Don't rush.`,
    cta: 'Go to Song',
    ctaRoute: '/song',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'player',
    icon: '🎮',
    title: 'Player — Practice & Games',
    subtitle: 'Where you train your hands and ears',
    body: `Navigate to **Player** in the nav bar.

**This is where you:**
• Run the Adventure Player (gamified practice sessions)
• Play the Vertiscale Engine (fretboard game)
• Track your streak and practice minutes
• Get somatic check-ins before and after practice

**The key insight:** Player is not about perfection — it's about showing up. Even 5 minutes counts toward your streak.

**Start here:** Open Player and press "Begin Session." Answer the somatic check-in honestly.`,
    cta: 'Go to Player',
    ctaRoute: '/player',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    id: 'binder',
    icon: '📘',
    title: 'Binder — This Widget (The Blue Book)',
    subtitle: 'Your tools, journal, and character sheet',
    body: `You're already here — inside the **Binder** (blue book, top right).

**The Binder contains:**
• **Workbook** — lesson tools (breathing gate, pitch room, rhythm engine)
• **Projects** — your songwriting and creative work
• **Submissions** — recordings you send to Bertrand
• **Resources** — reference sheets, PDFs, backing tracks
• **Character** — your XP, Bard Level, and progress stats

**The Library tab** (where you found this guide) also has:
• Navigation map
• Settings and save/export
• Study Chat with the AI

**You can open this guide anytime** from the Library tab → "How This Works."`,
    cta: null,
    ctaAction: null,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    id: 'riff',
    icon: '🎸',
    title: 'RIFF — Creative Community',
    subtitle: 'Where you play, share, and jam',
    body: `Navigate to **RIFF** in the nav bar.

**RIFF is the creative hub:**
• Free-play mode with AI feedback (no scoring, just expression)
• Share your riffs with the community (60-second clips)
• Weekly challenges set by Bertrand
• Live jam chat

**When to use RIFF:**
After a lesson session, come to RIFF to *play freely* with what you just learned. No pressure. No grades. Just music.

**RIFF is coming soon for beta** — but the Truebadour creative chat is live inside RIFF now.`,
    cta: 'Go to RIFF',
    ctaRoute: '/riff',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    id: 'nextsteps',
    icon: '✨',
    title: 'Your First 15 Minutes',
    subtitle: 'A suggested path to start',
    body: null,
    steps: [
      { n: '1', text: 'Open the Truebadour (red guitar). Introduce yourself and name your fret level.' },
      { n: '2', text: 'Go to Song → choose Fret 1 → read the first lesson slide.' },
      { n: '3', text: 'Open Player → run a 5-minute practice session.' },
      { n: '4', text: 'Come back to Binder → Submissions → record a short clip for Bertrand.' },
      { n: '5', text: 'Explore RIFF → open the Truebadour chat and free-play for 2 minutes.' },
    ],
    cta: 'Start My Journey',
    ctaRoute: '/song',
    color: 'var(--cf-gold)',
    bg: 'rgba(var(--cf-gold-rgb),0.08)',
  },
];

// ── Step Dot Nav ─────────────────────────────────────────────────
function StepDots({ total, current, onSelect, color }) {
  return (
    <div className="flex gap-1.5 justify-center items-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Step ${i + 1}`}
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current ? color : 'rgba(255,255,255,0.15)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function TutorialMenu({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [, setCompleted] = useState(new Set());

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === TOUR_STEPS.length - 1;

  const markDone = (id) => setCompleted(prev => new Set([...prev, id]));

  const handleCTA = () => {
    markDone(current.id);
    if (current.ctaAction === 'truebadour') {
      onClose();
      // Truebadour widget opens via TruebadourProvider context
      // Fire a custom event that TruebadourWidget listens to
      window.dispatchEvent(new CustomEvent('voixvive:open-truebadour'));
    } else if (current.ctaRoute) {
      onClose();
      navigate(current.ctaRoute);
    }
  };

  const bold = (text) => {
    if (!text) return null;
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: current.color, fontWeight: 600 }}>{part}</strong>
        : part
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-[8px]"
      />

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-[#0a0a14] p-8"
          style={{
            border: `1px solid ${current.color}30`,
            boxShadow: `0 0 60px ${current.color}15, 0 20px 60px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-white/30 p-1 flex items-center justify-center"
            aria-label="Close guide"
          >
            <X size={18} />
          </button>

          {/* Progress */}
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.15em] text-white/30 uppercase mb-2">
              How This Works — {step + 1} of {TOUR_STEPS.length}
            </div>
            <StepDots total={TOUR_STEPS.length} current={step} onSelect={setStep} color={current.color} />
          </div>

          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="text-[40px] mb-3">{current.icon}</div>
            <h2 className="font-heading text-[1.5rem] font-semibold text-vv-text m-0 mb-1">
              {current.title}
            </h2>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase m-0"
              style={{ color: current.color }}>
              {current.subtitle}
            </p>
          </div>

          {/* Body */}
          <div className="rounded-xl p-5 mb-6"
            style={{
              background: current.bg,
              border: `1px solid ${current.color}20`,
            }}
          >
            {/* Numbered steps (last screen) */}
            {current.steps ? (
              <div className="flex flex-col gap-2.5">
                {current.steps.map((s) => (
                  <div key={s.n} className="flex gap-2.5 items-start">
                    <div className="w-[22px] h-[22px] rounded-full shrink-0 text-[#0a0a14] flex items-center justify-center font-mono text-[11px] font-bold"
                      style={{ background: current.color }}>{s.n}</div>
                    <p className="m-0 text-[0.875rem] leading-[1.55] text-white/75">{s.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[0.875rem] leading-[1.65] text-white/72 whitespace-pre-line">
                {bold(current.body)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* CTA button */}
            {current.cta && (
              <button
                onClick={handleCTA}
                className="w-full py-3 px-4 rounded-xl border cursor-pointer font-mono text-xs tracking-[0.1em] uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                style={{
                  borderColor: `${current.color}50`,
                  background: `${current.color}18`,
                  color: current.color,
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${current.color}28`}
                onMouseLeave={e => e.currentTarget.style.background = `${current.color}18`}
              >
                <ChevronRight size={14} />
                {current.cta}
              </button>
            )}

            {/* Prev / Next */}
            <div className="flex gap-2">
              {!isFirst && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-2.5 px-3 rounded-[10px] border border-white/10 bg-white/[0.04] text-white/50 font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:bg-white/[0.08]"
                >
                  <ChevronLeft size={12} /> Back
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex-[2] py-2.5 px-3 rounded-[10px] border border-white/[0.12] bg-white/[0.06] text-white/70 font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:bg-white/[0.1]"
                >
                  Next <ChevronRight size={12} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-[2] py-2.5 px-3 rounded-[10px] border border-white/[0.12] bg-white/[0.06] text-white/50 font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer hover:bg-white/[0.1] transition-colors"
                >
                  Close Guide
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
