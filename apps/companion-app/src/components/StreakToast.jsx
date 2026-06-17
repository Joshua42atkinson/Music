// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : StreakToast.jsx                                      ║
// ║ WHAT    : Fires at 8pm if user hasn't practiced today          ║
// ║ WHY     : Habit protection — a gentle nudge, not a nag         ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

const PRACTICE_KEY = STORAGE_KEYS.LAST_PRACTICE;
const today = () => new Date().toISOString().slice(0, 10);

export default function StreakToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      const last = vvGet(PRACTICE_KEY) || '';
      if (hour >= 20 && last !== today()) setVisible(true);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(id);
  }, [visible]);

  const logPractice = () => {
    vvSet(PRACTICE_KEY, today());
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-20 right-4 z-[9500] w-[min(280px,calc(100vw-2rem))] bg-[#0d0d18] border border-cf-gold/45 rounded-[14px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {/* Dismiss */}
          <button onClick={() => setVisible(false)} className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-white/25 p-0.5 flex">
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-[#f97316] shrink-0" />
            <span className="font-heading text-[0.95rem] text-vv-text">
              Don't break your streak!
            </span>
          </div>

          <p className="m-0 mb-2.5 text-[0.75rem] leading-[1.5] text-white/50 font-mono">
            No practice logged today. Even 5 minutes keeps the chain alive.
          </p>

          <button onClick={logPractice} className="w-full py-2 rounded-[9px] cursor-pointer bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.4)] text-[#f97316] font-mono text-[11px] tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 min-h-[36px] transition-all duration-150">
            <Flame size={11} /> Log Practice Now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
