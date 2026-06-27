import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../hooks/useLocale';

export default function AcademyManifesto() {
  const { t } = useLocale();
  const [manifestoExpanded, setManifestoExpanded] = useState(false);

  return (
    <motion.div
      className="manifesto-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
    >
      <div className="manifesto-card">
        {/* Always-visible tagline */}
        <h1 className="manifesto-tagline font-heading text-[clamp(1.4rem,5vw,1.9rem)] font-normal text-cf-gold text-center leading-[1.25] mb-4 italic drop-shadow-[0_2px_12px_rgba(201,169,110,0.15)]">
          {t('manifestoTagline')}
        </h1>

        {/* Short hook */}
        <p className="font-quote text-base text-[rgba(210,210,218,0.65)] text-center leading-relaxed mb-4">
          {t('manifestoHook')}
        </p>

        {/* Expand toggle */}
        <button
          onClick={() => setManifestoExpanded(v => !v)}
          onKeyDown={(e) => e.key === 'Enter' && setManifestoExpanded(v => !v)}
          className="block mx-auto bg-transparent border-none cursor-pointer font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[rgba(var(--cf-gold-rgb),0.45)] pt-1 pb-[2px] transition-colors duration-200 hover:text-[rgba(var(--cf-gold-rgb),0.7)]"
        >
          {manifestoExpanded ? t('manifestoLess') : t('manifestoMore')}
        </button>

        {/* Expanded content — pillars + body */}
        <AnimatePresence>
          {manifestoExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <p className="manifesto-kicker mt-5">
                {t('manifestoKicker')}
              </p>
              <h2 className="manifesto-title">
                {t('manifestoTitle')}
              </h2>
              <p className="manifesto-body">
                {t('manifestoBody')}
              </p>
              <div className="manifesto-pillars">
                {[
                  { label: t('manifestoPillarBeLabel'), sub: t('manifestoPillarBeSub'), color: 'var(--cf-gold)' },
                  { label: t('manifestoPillarDoLabel'), sub: t('manifestoPillarDoSub'), color: '#7aaa88' },
                  { label: t('manifestoPillarPlayLabel'), sub: t('manifestoPillarPlaySub'), color: '#c07898' },
                ].map(({ label, sub, color }) => (
                  <div key={label} className="manifesto-pillar">
                    <div style={{ background: `${color}18`, borderColor: `${color}40` }} className="w-10 h-10 rounded-full border flex items-center justify-center mb-1.5">
                      <span className="font-heading text-[1.2rem]" style={{ color }}>{label[0]}</span>
                    </div>
                    <span className="manifesto-pillar-label text-[#f0e6d2]">{label}</span>
                    <span className="manifesto-pillar-sub" style={{ color: `${color}90` }}>{sub}</span>
                  </div>
                ))}
              </div>
              <div className="manifesto-free-badge mt-5">
                <span>✦</span>
                <span>{t('manifestoFreeBadge')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
