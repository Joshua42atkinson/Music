import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function TruebadourScorecard({ scores, onClose }) {
  // scores: { pitch: 85, rhythm: 92, tone: 78, breath: 88, overall: 86 }
  
  // Fallback to avoid crashes if scores is undefined
  const safeScores = scores || { pitch: 0, rhythm: 0, tone: 0, breath: 0, overall: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#0d0d12] border border-cf-gold/30 rounded-xl p-6 w-full max-w-[400px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[#e8edf2] font-body"
    >
      <h3 className="m-0 mb-1 text-[1.25rem] font-heading text-vv-text text-center">Truebadour AI Analysis</h3>
      <p className="m-0 mb-6 text-[0.75rem] text-white/50 text-center uppercase tracking-[0.05em]">Pitch Accuracy Scorecard</p>

      <div className="flex flex-col gap-4 mb-6">
        {['pitch', 'rhythm', 'tone', 'breath'].map((key) => {
          const value = safeScores[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-[60px] text-[0.85rem] font-medium text-white/80">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="flex-1 h-2 bg-white/10 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full rounded"
                  style={{ backgroundColor: getScoreColor(value) }}
                />
              </div>
              <span className="w-10 text-right text-[0.85rem] font-semibold font-mono">{value}%</span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
        <div className="text-[0.9rem] font-medium text-vv-text">Overall Focus & Flow</div>
        <div className="text-[2rem] font-bold font-mono" style={{ color: getScoreColor(safeScores.overall) }}>
          {safeScores.overall}
        </div>
      </div>

      <button className="w-full py-3 bg-cf-gold text-black border-none rounded-md font-semibold cursor-pointer hover:bg-cf-gold/90 transition-colors" onClick={onClose}>
        Continue
      </button>
    </motion.div>
  );
}

function getScoreColor(score) {
  if (score >= 90) return 'var(--cf-gold)'; // Gold
  if (score >= 80) return '#10b981'; // Green
  if (score >= 70) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
}
