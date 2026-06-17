import React, { useState } from 'react';
import { useScaffolding } from '../../components/ScaffoldingProvider';
import { getBardicTitle } from '../../data/bardicTitles';
import { FRET_METADATA } from '../../data/dag/dagNodes';
import CapstoneCard from '../../components/CapstoneCard';
import CharacterSheet from '../../components/CharacterSheet';
import { vvGet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TruebadourLoom.jsx                                   ║
// ║ WHAT    : The student's musical identity page.                 ║
// ║ WHERE   : The Player portal (MentorTools)                     ║
// ║ WHY     : Surfaces existing RPG-like state as identity,       ║
// ║           not game. The student BECOMES the Truebadour.        ║
// ╚════════════════════════════════════════════════════════════════╝

const TYPE_LABELS = {
  storyteller: 'The Storyteller',
  craftsman: 'The Craftsman',
  ear: 'The Ear',
  seeker: 'The Seeker',
};

export default function TruebadourLoom() {
  const { traction, completedNodes: _completedNodes } = useScaffolding();
  const [showSheet, setShowSheet] = useState(false);

  const bardLevel = traction?.bardLevel || 1;
  const title = getBardicTitle(bardLevel);
  const totalTraction = traction?.totalTraction || 0;
  const truebadourType = traction?.studentProfile?.truebadourType;
  const maxTraction = 1200; // 12 frets × 100

  // Gather fret data for myelination map
  const frets = traction?.frets || {};
  const fretStates = Array.from({ length: 12 }, (_, i) => {
    const fid = i + 1;
    const f = frets[fid] || {};
    const meta = FRET_METADATA[fid] || {};
    return {
      id: fid,
      note: meta.note || `Fret ${fid}`,
      interval: meta.interval || '',
      color: meta.color || '#666',
      traction: f.traction || 0,
      beMastery: f.beMastery || 0,
      doMastery: f.doMastery || 0,
      playMastery: f.playMastery || 0,
      resonance: (f.beResonance && f.doResonance && f.playResonance) || false,
      completed: f.beCompleted && f.doCompleted && f.playCompleted,
    };
  });

  // Practice stats
  const practiceLog = JSON.parse(vvGet(STORAGE_KEYS.PRACTICE_LOG) || '[]');
  const totalMinutes = practiceLog.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalSessions = practiceLog.length;
  const streak = calculateStreak(practiceLog);

  return (
    <div className="p-5 max-w-[800px] mx-auto text-[#e8edf2] font-sans">
      {/* ── Identity Header ── */}
      <div className="bg-gradient-to-br from-blue-400/[0.08] to-purple-400/[0.08] border border-blue-400/20 rounded-[20px] p-7 mb-6 text-center">
        <div className="font-mono text-[0.65rem] text-[#60a5fa] tracking-[0.2em] uppercase mb-3">Level {bardLevel} of 12</div>
        <h1 className="font-heading text-[2rem] text-vv-text m-0 mb-2">{title.title}</h1>
        <p className="font-mono text-[0.8rem] text-cf-gold m-0 mb-3">{title.epithet}</p>
        <p className="text-[0.9rem] text-white/60 leading-[1.6] max-w-[520px] mx-auto mb-4">{title.description}</p>
        <div className="mt-2">
          <span className="font-mono text-[0.7rem] text-white/40 uppercase tracking-[0.1em] mr-2">Skill:</span>
          <span className="text-[0.85rem] text-emerald-400/90 italic">{title.gift}</span>
        </div>
      </div>

      {/* ── Myelination Map ── */}
      <div className="mb-6">
        <h2 className="font-heading text-[1.4rem] text-vv-text m-0 mb-2">Myelination Map</h2>
        <p className="text-[0.85rem] text-white/40 m-0 mb-4">
          Each fret lights up as you practice. This is your musical memory forming — one interval at a time.
        </p>
        <div className="flex gap-2 justify-center flex-wrap mb-3">
          {fretStates.map(fret => (
            <div key={fret.id} className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center relative transition-all duration-300"
                style={{
                  background: fret.completed
                    ? `radial-gradient(circle at 50% 40%, ${fret.color}40 0%, ${fret.color}15 40%, transparent 100%)`
                    : `radial-gradient(circle at 50% 40%, ${fret.color}15 0%, transparent 70%)`,
                  borderColor: fret.completed ? fret.color : 'rgba(255,255,255,0.08)',
                  boxShadow: fret.resonance ? `0 0 20px ${fret.color}30` : 'none',
                }}
              >
                <span className="font-heading text-[0.85rem] text-vv-text font-semibold">{fret.note}</span>
                <span className="text-[0.55rem] text-white/40 font-mono">{fret.interval}</span>
                {fret.resonance && <span className="absolute -top-1 -right-1 text-[0.9rem] text-amber-400">◈</span>}
              </div>
              <div className="w-1 h-10 bg-white/[0.06] rounded overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded transition-[height] duration-500 ease-out opacity-70"
                  style={{ width: `${fret.traction}%`, background: fret.color }}
                />
              </div>
              <span className="font-mono text-[0.6rem] text-white/30">{fret.id}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center text-[0.75rem] text-white/40">
          <span>○ Fret</span>
          <span>● Lit</span>
          <span>◈ Resonance</span>
        </div>
      </div>

      {/* ── Practice Stats ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
        <StatCard label="Total Practice" value={`${totalMinutes} min`} icon="⏱️" />
        <StatCard label="Sessions" value={totalSessions} icon="🎸" />
        <StatCard label="Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`} icon="🔥" />
        <StatCard label="Traction" value={`${Math.round((totalTraction / maxTraction) * 100)}%`} icon="⚡" />
      </div>

      {/* ── Truebadour Type ── */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="font-heading text-[1.4rem] text-vv-text m-0 mb-2">Truebadour Type</h2>
            <p className="text-[0.85rem] text-white/40 m-0">
              {truebadourType
                ? `${TYPE_LABELS[truebadourType]} — The AI adapts to your learning nature.`
                : 'Discover how you learn best. The AI adapts to your nature.'}
            </p>
          </div>
          <button
            onClick={() => setShowSheet(true)}
            className="py-2 px-4 rounded-lg border border-cf-gold/40 bg-transparent text-cf-gold font-mono text-[0.75rem] font-semibold cursor-pointer whitespace-nowrap"
          >
            {truebadourType ? 'Change' : 'Discover'}
          </button>
        </div>
      </div>

      {/* ── The Capstone ── */}
      <CapstoneCard traction={traction} />

      {/* ── Mentor Hooks ── */}
      <div className="mb-6">
        <h2 className="font-heading text-[1.4rem] text-vv-text m-0 mb-2">Mentor Sessions</h2>
        <p className="text-[0.85rem] text-white/40 m-0 mb-4">
          All tools, practice sessions, and progress tracking are free. These are optional paid interactions with Bertrand.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
          <MentorCard
            title="Quick Audio Critique"
            price="$5"
            description="3-minute question or clip. Fast text feedback within 24 hours."
            cta="Ask a Question"
          />
          <MentorCard
            title="Async Video Review"
            price="$45"
            description="15-minute structured practice block. Bertrand reviews your playing and records a personal response overlay."
            cta="Submit Practice Video"
          />
          <MentorCard
            title="Bertrand Approved Capstone"
            price="$100"
            description="20-minute capstone audition. 3 original songs + somatic reflection + voice integration. Certificate + personalized curriculum."
            cta="View Capstone Requirements"
          />
        </div>
      </div>

      {/* ── Character Sheet Modal ── */}
      {showSheet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[8px] flex items-center justify-center z-[100] p-6" onClick={() => setShowSheet(false)}>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl max-h-[90vh] overflow-auto w-full max-w-[640px]" onClick={e => e.stopPropagation()}>
            <CharacterSheet onClose={() => setShowSheet(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center flex flex-col gap-1">
      <span className="text-[1.2rem]">{icon}</span>
      <span className="font-heading text-[1.3rem] text-vv-text">{value}</span>
      <span className="font-mono text-[0.65rem] text-white/40 uppercase tracking-[0.1em]">{label}</span>
    </div>
  );
}

function MentorCard({ title, price, description, cta }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-heading text-[1.1rem] text-vv-text m-0">{title}</h3>
        <span className="font-mono text-[0.9rem] text-cf-gold">{price}</span>
      </div>
      <p className="text-[0.8rem] text-white/50 leading-[1.5] m-0 mb-3">{description}</p>
      <button className="w-full py-2.5 rounded-lg border-none bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] text-white font-mono text-[0.75rem] font-semibold cursor-pointer tracking-[0.05em]">{cta}</button>
    </div>
  );
}

function calculateStreak(log) {
  if (!log.length) return 0;
  const dates = [...new Set(log.map(e => new Date(e.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let checkDate = dates[0] === today ? today : yesterday;
  for (const d of dates) {
    if (d === checkDate) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
    } else break;
  }
  return streak;
}

