import React from 'react';
import { getCertificationStatus, getNextCertificationGoal, CERTIFICATION_TIERS } from '../data/certification';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : CapstoneCard.jsx                                     ║
// ║ WHAT    : The $100 capstone audition call-to-action            ║
// ║ WHERE   : TruebadourLoom, Player Portal                        ║
// ║ WHY     : Transforms mastery into credential. The student     ║
// ║           becomes the teacher through demonstration.           ║
// ╚════════════════════════════════════════════════════════════════╝

export default function CapstoneCard({ traction }) {
  const status = getCertificationStatus(traction);
  const goal = getNextCertificationGoal(traction);
  const tier = CERTIFICATION_TIERS[goal.tier];

  const isEligible = goal.eligible || false;

  return (
    <div className="bg-gradient-to-br from-amber-400/[0.06] to-cf-gold/[0.06] border border-amber-400/20 rounded-2xl p-6 mb-6">
      <div className="text-center mb-4">
        <span className="text-[2rem] block mb-2">👑</span>
        <h2 className="font-heading text-[1.5rem] text-amber-400 m-0 mb-1.5">The Truebadour's Trial</h2>
        <p className="font-mono text-[0.75rem] text-cf-gold tracking-[0.15em] uppercase m-0 mb-2">{tier.epithet}</p>
        <p className="text-[0.85rem] text-white/50 m-0 leading-[1.5] max-w-[480px]">{tier.description}</p>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-white/[0.06] rounded-md overflow-hidden mb-1.5">
        <div className="h-full rounded-md transition-[width] duration-500 bg-[linear-gradient(90deg,#fbbf24,var(--cf-gold))]"
          style={{ width: `${(status.progress.completedFrets / 12) * 100}%` }}
        />
      </div>
      <div className="font-mono text-[0.7rem] text-white/35 text-center mb-2">
        {status.progress.completedFrets} / 12 frets · {status.progress.highMasteryCount} high masteries
      </div>

      <p className="text-[0.75rem] text-green-400/70 text-center mb-4 italic">
        All tiers unlock for free as you practice. Optional: submit your audition to Bertrand for review.
      </p>

      {/* Current Goal */}
      {!isEligible && (
        <div className="bg-white/[0.03] rounded-xl p-3.5 mb-3">
          <span className="font-mono text-[0.65rem] text-white/40 uppercase tracking-[0.1em] mr-1.5">Next Milestone:</span>
          <span className="text-[0.9rem] text-vv-text font-semibold">{tier.name}</span>
          <p className="text-[0.8rem] text-white/50 my-1.5">{goal.remaining}</p>
          <p className="text-[0.75rem] text-blue-400/70 font-mono m-0">{tier.requirement}</p>
        </div>
      )}

      {/* Master Tier Details */}
      {isEligible && (
        <div className="mt-3">
          <h3 className="font-heading text-[1.2rem] text-vv-text m-0 mb-2.5">Optional Capstone Review — $100</h3>
          <p className="text-[0.85rem] text-white/60 leading-[1.5] mb-3.5 italic">
            {CERTIFICATION_TIERS.master.audition.prompt}
          </p>

          <div className="mb-3">
            <h4 className="font-mono text-[0.65rem] text-cf-gold/70 uppercase tracking-[0.15em] m-0 mb-2">Reflection Questions</h4>
            {CERTIFICATION_TIERS.master.audition.questions.map((q, i) => (
              <p key={i} className="text-[0.8rem] text-white/60 mb-1.5 pl-3 border-l-2 border-blue-400/30 leading-[1.4]">{i + 1}. {q}</p>
            ))}
          </div>

          <div className="mb-3">
            <h4 className="font-mono text-[0.65rem] text-cf-gold/70 uppercase tracking-[0.15em] m-0 mb-2">Required Demonstrations</h4>
            {CERTIFICATION_TIERS.master.audition.demonstrations.map((d, i) => (
              <p key={i} className="text-[0.8rem] text-green-400/80 mb-1 font-mono">▸ {d}</p>
            ))}
          </div>

          <div className="bg-green-400/[0.06] rounded-xl p-3.5 mb-4 border border-green-400/15">
            <h4 className="font-mono text-[0.65rem] text-cf-gold/70 uppercase tracking-[0.15em] m-0 mb-2">What You Receive</h4>
            <ul className="m-0 pl-[18px]">
              {CERTIFICATION_TIERS.master.includes.split(' + ').map((item, i) => (
                <li key={i} className="text-[0.8rem] text-white/70 mb-1">{item}</li>
              ))}
            </ul>
          </div>

          <button className="w-full py-3.5 rounded-xl border-none bg-gradient-to-br from-amber-400 to-cf-gold text-cf-void font-mono text-[0.8rem] font-bold cursor-pointer tracking-[0.05em] uppercase">
            🎬 Begin Capstone Submission (20 min video)
          </button>
        </div>
      )}
    </div>
  );
}

