// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : FeedbackButton.jsx                                   ║
// ║ WHAT    : Floating beta feedback pill — always visible         ║
// ║           bottom-center, above the PrimaryNav                  ║
// ║ WHY     : Beta testers need a dead-simple way to report bugs   ║
// ║           or leave impressions without leaving the app.        ║
// ║ WHERE   : Sends to joshua42atkinson@gmail.com via mailto +     ║
// ║           writes to localStorage for local AI scan (Nemotron)  ║
// ║ RULES   : Hidden on / and /onboarding. Max 500 char.           ║
// ║           Auto-populates user context from login + session.    ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MessageSquarePlus, X, Send, Check, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';
import { vvGet, vvGetJSON, vvSetJSON } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

const FEEDBACK_EMAIL = 'joshua42atkinson@gmail.com';
const HIDDEN_PATHS   = ['/', '/onboarding'];
const FEEDBACK_KEY   = STORAGE_KEYS.BETA_FEEDBACK;

function getCategories(t) {
  return [
    { id: 'bug',     emoji: '🐛', label: t('catBug') },
    { id: 'idea',    emoji: '💡', label: t('catIdea') },
    { id: 'love',    emoji: '❤️', label: t('catLove') },
    { id: 'confuse', emoji: '😕', label: t('catConfused') },
  ];
}

// ── Pull user context for auto-population ──────────────────────────
function getUserContext(session) {
  try {
    const name    = vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || 'Beta Tester';
    const email   = session?.user?.email || '';  // From Supabase session, not localStorage
    const fret    = vvGet(STORAGE_KEYS.CURRENT_FRET) || '1';
    const streak  = vvGet(STORAGE_KEYS.STREAK) || '0';
    const bardLvl = (() => {
      const t = JSON.parse(vvGet(STORAGE_KEYS.TRACTION) || '{}');
      return t.bardLevel || 1;
    })();
    const ps = JSON.parse(vvGet(STORAGE_KEYS.PLAYER_STATE) || '{}');
    const toneLabel = ps.tone === 3 ? 'High' : ps.tone === 1 ? 'Low' : 'Mid';
    return { name, email, fret, streak, bardLvl, toneLabel, distortion: ps.distortion || 'clean', resonance: ps.resonance || 0 };
  } catch {
    return { name: 'Beta Tester', email: '', fret: '1', streak: '0', bardLvl: 1, toneLabel: 'Mid', distortion: 'clean', resonance: 0 };
  }
}

// ── Build mailto URL with full student context ─────────────────────
function buildMailto(category, text, ctx, page) {
  const subject = encodeURIComponent(
    `[Voix Vive Beta] ${category.toUpperCase()} · Fret ${ctx.fret} · ${ctx.name}`
  );
  const body = encodeURIComponent(
`FEEDBACK
--------
Category  : ${category}
From      : ${ctx.name}${ctx.email ? ' <' + ctx.email + '>' : ''}
Page      : ${page}
Fret      : ${ctx.fret}  |  Streak: ${ctx.streak}d  |  Bard Level: ${ctx.bardLvl}
Tone      : ${ctx.toneLabel}  |  Signal: ${ctx.distortion}  |  Resonance: ${ctx.resonance}

MESSAGE
-------
${text}

---
Voix Vive Beta · ${new Date().toISOString()}
`
  );
  return `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}

export default function FeedbackButton() {
  const location                 = useLocation();
  const { session }             = useAuth();
  const { t, locale: lang }     = useLocale();
  const CATEGORIES               = getCategories(t);
  const [open,     setOpen]      = useState(false);
  const [text,     setText]      = useState('');
  const [category, setCategory]  = useState('idea');
  const [sent,     setSent]      = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('voixvive:open_feedback', handleOpen);
    return () => window.removeEventListener('voixvive:open_feedback', handleOpen);
  }, []);

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const submit = () => {
    if (!text.trim()) return;
    const ctx = getUserContext(session);

    // 1. Save rich entry to localStorage (for Nemotron local scan)
    try {
      const existing = vvGetJSON(FEEDBACK_KEY, []);
      vvSetJSON(FEEDBACK_KEY, [...existing, {
        id:         Date.now(),
        ts:         new Date().toISOString(),
        page:       location.pathname,
        category,
        text:       text.trim().slice(0, 500),
        user:       ctx.name,
        userEmail:  ctx.email,
        fret:       ctx.fret,
        streak:     ctx.streak,
        bardLevel:  ctx.bardLvl,
        tone:       ctx.toneLabel,
        distortion: ctx.distortion,
        resonance:  ctx.resonance,
      }]); /* ignore */ 
    } catch { /* ignore */ }

    // 2. Open mailto → email to Joshua
    window.open(buildMailto(category, text.trim(), ctx, location.pathname), '_blank');

    setSent(true);
    setTimeout(() => {
      setOpen(false); setSent(false); setText(''); setCategory('idea');
    }, 3000);
  };

  const ctx      = getUserContext(session);
  const firstName = ctx.name !== 'Beta Tester' ? ctx.name.split(' ')[0] : null;

  return (
    <>
      {/* ── Feedback panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[4px]"
            onClick={() => setOpen(false)}
          />
        )}
        {open && (
          <motion.div
            key="feedback-panel"
            initial={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.95 }}
            animate={{ opacity: 1, x: '-50%', y: '-50%',  scale: 1    }}
            exit={{    opacity: 0, x: '-50%', y: '-48%',  scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 z-[9999] w-[min(340px,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto bg-[#0d0d18] border border-cf-gold/30 rounded-2xl p-[1.1rem] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-heading text-vv-text text-[0.95rem]">
                {t('betaFeedback')}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer text-white/30 p-1 flex min-h-[44px] items-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Auto-context pill — shows who's sending */}
            <div className="mb-2.5 py-1 px-2 rounded-lg bg-cf-gold/[0.06] border border-cf-gold/15 font-mono text-[9px] text-cf-gold/50 tracking-[0.05em] flex items-center gap-1.5">
              <Mail size={8} />
              {ctx.name} · Fret {ctx.fret} · {location.pathname}
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 mb-2.5 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`py-1 px-2.5 rounded-xl cursor-pointer font-mono text-[10px] tracking-[0.05em] uppercase transition-all duration-150 min-h-[44px] border ${category === c.id ? 'border-cf-gold/60 bg-cf-gold/10 text-cf-gold' : 'border-white/10 bg-transparent text-white/40'}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* Text input or confirmation */}
            {!sent ? (
              <>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value.slice(0, 500))}
                  placeholder={t('feedbackPlaceholder')}
                  maxLength={500}
                  rows={3}
                  className="w-full resize-none box-border bg-white/[0.04] border border-white/10 rounded-[10px] py-2 px-2.5 text-white/80 font-mono text-xs leading-[1.5] outline-none mb-1.5"
                />
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-white/20">
                    {text.length}/500
                  </span>
                  <button
                    onClick={submit}
                    disabled={!text.trim()}
                    className={`py-[7px] px-4 rounded-lg font-mono text-[10px] tracking-[0.1em] uppercase flex items-center gap-[5px] min-h-[44px] transition-all duration-150 border ${text.trim() ? 'cursor-pointer bg-cf-gold/20 border-cf-gold/40 text-cf-gold' : 'cursor-not-allowed bg-white/[0.04] border-white/[0.08] text-white/20'}`}
                  >
                    <Send size={11} /> {t('send')}
                  </button>
                </div>
              </>
            ) : (
              // ── Auto-reply confirmation ──
              <div className="text-center py-3">
                <Check size={22} className="text-[#4ade80] mx-auto mb-2 block" />
                <p className="m-0 mb-1 text-vv-text font-heading text-base">
                  {firstName ? t('thankYouName', { name: firstName }) : t('thankYou')}
                </p>
                <p className="m-0 mb-0.5 text-white/45 font-mono text-[9px] tracking-[0.05em]">
                  {t('feedbackLogged')}
                </p>
                <p className="m-0 text-cf-gold/35 font-mono text-[8px] tracking-[0.04em]">
                  {t('yourVoiceShapes')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
