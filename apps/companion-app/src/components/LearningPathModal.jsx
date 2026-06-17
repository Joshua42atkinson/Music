import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookOpen } from 'lucide-react';

export default function LearningPathModal({ isOpen, onSelect }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#0a0a0f] border border-[#9b59b6]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(155,89,182,0.15)] relative overflow-hidden"
        >
          {/* Subtle Glow Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,rgba(155,89,182,0.15),transparent_50%)] pointer-events-none" />
          
          <h2 className="text-3xl text-center text-[#f0e6d2] font-cormorant mb-3 relative z-10">
            Choose Your Path
          </h2>
          <p className="text-center text-white/60 font-ebgaramond text-lg mb-8 relative z-10">
            How do you want to learn? You can change this later in settings.
          </p>

          <div className="flex flex-col gap-4 relative z-10">
            {/* Guided Course (Recommended) */}
            <button
              onClick={() => onSelect(false)}
              className="flex items-start gap-4 p-5 rounded-xl border border-[var(--cf-gold)]/40 bg-gradient-to-br from-[var(--cf-gold)]/10 to-transparent hover:bg-[var(--cf-gold)]/20 transition-all group text-left"
            >
              <div className="p-3 bg-[var(--cf-gold)]/20 rounded-lg text-[var(--cf-gold)] group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-[var(--cf-gold)] font-mono font-bold uppercase tracking-widest text-sm mb-1 flex items-center gap-2">
                  Guided Course
                  <span className="bg-[var(--cf-gold)] text-black text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Recommended</span>
                </h3>
                <p className="text-white/70 text-sm font-ebgaramond leading-relaxed">
                  A focused, step-by-step path to learn the guitar. Extra tools are hidden so you won't get distracted.
                </p>
              </div>
            </button>

            {/* Open Sandbox */}
            <button
              onClick={() => onSelect(true)}
              className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
            >
              <div className="p-3 bg-white/10 rounded-lg text-white/70 group-hover:text-white group-hover:scale-110 transition-transform">
                <Compass size={24} />
              </div>
              <div>
                <h3 className="text-white/90 font-mono font-bold uppercase tracking-widest text-sm mb-1">
                  Explore Mode
                </h3>
                <p className="text-white/50 text-sm font-ebgaramond leading-relaxed">
                  Browse all lessons, games, and practice tools freely at your own pace.
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
