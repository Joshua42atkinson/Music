// ═══════════════════════════════════════════════════════════
// BEWorkbookScheduleTab — Daily practice cards + wind-down
// ═══════════════════════════════════════════════════════════

import React from 'react';
import EveningWindDown from './EveningWindDown';

const CURRENT_FRET_TOOL = {
  1: 'Breathing Gate', 2: 'Practice Timer', 3: 'Pitch Room',
  4: "Truebadour's Quill", 5: 'Interval Visualizer', 6: 'Grid Map',
  7: 'PLING! Trainer', 8: 'Microtonal Tracker', 9: 'Playable Guitar',
  10: 'Async Assessor', 11: 'Multi-Key Hub', 12: 'Rhythm Engine',
};

export default function BEWorkbookScheduleTab({
  selectedFret,
  currentNodeId,
  practiceLog,
  setPracticeLog,
  activeWindDown,
  setActiveWindDown,
  completePhase,
  updateTraction,
}) {
  const today = new Date().toDateString();
  const todayLog = practiceLog.filter(l => new Date(l.date).toDateString() === today);
  const doneBreath = todayLog.some(l => l.attribute === 'Soma' && l.activity !== 'Night Wind-Down');
  const doneHand = todayLog.some(l => l.attribute === 'Logos');
  const doneJournal = todayLog.some(l => l.attribute === 'Harmonia');
  const doneWindDown = todayLog.some(l => l.activity === 'Night Wind-Down');
  const todayXp = todayLog.reduce((sum, l) => sum + (l.xp || 0), 0);
  const sessionsToday = todayLog.length;
  const fretToolName = CURRENT_FRET_TOOL[selectedFret] || 'Breathing Gate';

  const logEntry = (activity, xp, attribute) => {
    const entry = { date: new Date().toISOString(), activity, xp, attribute };
    setPracticeLog(prev => [entry, ...prev]);
    updateTraction(prev => ({ ...prev, xp: (prev.xp || 0) + xp }));
  };

  if (activeWindDown) {
    return (
      <EveningWindDown
        onComplete={() => {
          setActiveWindDown(false);
          logEntry('Night Wind-Down', 20, 'Soma');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Today's header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-heading text-[1.3rem] font-semibold text-vv-text m-0">Today's Practice</h3>
          <p className="font-mono text-[0.7rem] text-white/35 tracking-[0.04em] mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-heading text-[1.5rem] font-bold text-amber-400">{todayXp}</span>
          <span className="font-mono text-[0.55rem] text-white/30 tracking-[0.08em] uppercase">XP today</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center py-2">
        <div className="w-3.5 h-3.5 rounded-full transition-[background] duration-300 ease-out" style={{ background: doneBreath ? '#60a5fa' : 'rgba(255,255,255,0.08)' }} />
        <div className="w-10 h-0.5 transition-[background] duration-300 ease-out" style={{ background: doneBreath && doneHand ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.06)' }} />
        <div className="w-3.5 h-3.5 rounded-full transition-[background] duration-300 ease-out" style={{ background: doneHand ? '#a78bfa' : 'rgba(255,255,255,0.08)' }} />
        <div className="w-10 h-0.5 transition-[background] duration-300 ease-out" style={{ background: doneHand && doneJournal ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.06)' }} />
        <div className="w-3.5 h-3.5 rounded-full transition-[background] duration-300 ease-out" style={{ background: doneJournal ? '#34d399' : 'rgba(255,255,255,0.08)' }} />
        <div className="w-10 h-0.5 transition-[background] duration-300 ease-out" style={{ background: doneJournal && doneWindDown ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.06)' }} />
        <div className="w-3.5 h-3.5 rounded-full transition-[background] duration-300 ease-out" style={{ background: doneWindDown ? '#a78bfa' : 'rgba(255,255,255,0.08)' }} />
      </div>
      <p className="text-center text-[0.8rem] text-white/45 m-0 mb-1 leading-[1.4]">
        {sessionsToday === 0 ? 'No sessions yet — start with your breath.' :
         sessionsToday >= 4 ? '✨ All four rituals complete. Beautiful.' :
         `${sessionsToday} of 4 daily rituals complete.`}
      </p>

      {/* Session Cards */}
      <div className="flex flex-col gap-3">
        {/* Morning — Breathe */}
        <div className="border rounded-[14px] py-4.5 px-5 transition-all duration-300 ease-out" style={{ borderColor: doneBreath ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.08)', background: doneBreath ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.02)' }}>
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[1.3rem]">☀️</span>
              <div>
                <h4 className="m-0 text-base font-semibold text-vv-text font-heading">Morning — Breathe</h4>
                <p className="m-0.5 mt-0 font-mono text-[0.65rem] text-white/35 tracking-[0.04em]">Breathing Gate · Fret {selectedFret}</p>
              </div>
            </div>
            <span className="font-mono text-[0.75rem] font-semibold" style={{ color: doneBreath ? '#34d399' : '#fbbf24' }}>
              {doneBreath ? '✓ Done' : '+25 XP'}
            </span>
          </div>
          <p className="m-0 mb-3.5 text-[0.85rem] text-white/50 leading-[1.5]">
            Sit with your guitar. Close your eyes. Breathe 3 slow cycles. Release your shoulders. Then begin.
          </p>
          {!doneBreath && (
            <button
              onClick={() => {
                logEntry('Morning Breathing', 25, 'Soma');
                updateTraction(prev => ({ ...prev, breathingSessions: (prev.breathingSessions || 0) + 1 }));
                completePhase?.(currentNodeId || 'fret-1-class-be', 'be');
              }}
              className="w-full py-3 rounded-[10px] bg-blue-400/[0.12] border border-blue-400/30 text-[#60a5fa] font-sans text-[0.9rem] font-semibold cursor-pointer transition-all duration-200"
            >
              Start Breathing Session
            </button>
          )}
        </div>

        {/* Afternoon — Practice */}
        <div className="border rounded-[14px] py-4.5 px-5 transition-all duration-300 ease-out" style={{ borderColor: doneHand ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)', background: doneHand ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.02)' }}>
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[1.3rem]">🎸</span>
              <div>
                <h4 className="m-0 text-base font-semibold text-vv-text font-heading">Afternoon — Practice</h4>
                <p className="m-0.5 mt-0 font-mono text-[0.65rem] text-white/35 tracking-[0.04em]">{fretToolName} · Fret {selectedFret}</p>
              </div>
            </div>
            <span className="font-mono text-[0.75rem] font-semibold" style={{ color: doneHand ? '#34d399' : '#fbbf24' }}>
              {doneHand ? '✓ Done' : '+35 XP'}
            </span>
          </div>
          <p className="m-0 mb-3.5 text-[0.85rem] text-white/50 leading-[1.5]">
            Open {fretToolName} and work through today's exercises. Listen first, then play. Practice too slow.
          </p>
          {!doneHand && (
            <button
              onClick={() => {
                logEntry(`Practice: ${fretToolName}`, 35, 'Logos');
                updateTraction(prev => ({ ...prev, rhythmSessions: (prev.rhythmSessions || 0) + 1, pitchSessions: (prev.pitchSessions || 0) + 1 }));
                completePhase?.(currentNodeId || 'fret-1-class-be', 'do');
              }}
              className="w-full py-3 rounded-[10px] bg-purple-400/[0.12] border border-purple-400/30 text-[#a78bfa] font-sans text-[0.9rem] font-semibold cursor-pointer transition-all duration-200"
            >
              Start Practice Session
            </button>
          )}
        </div>

        {/* Evening — Reflect */}
        <div className="border rounded-[14px] py-4.5 px-5 transition-all duration-300 ease-out" style={{ borderColor: doneJournal ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.08)', background: doneJournal ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)' }}>
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[1.3rem]">📓</span>
              <div>
                <h4 className="m-0 text-base font-semibold text-vv-text font-heading">Evening — Reflect</h4>
                <p className="m-0.5 mt-0 font-mono text-[0.65rem] text-white/35 tracking-[0.04em]">Practice Journal</p>
              </div>
            </div>
            <span className="font-mono text-[0.75rem] font-semibold" style={{ color: doneJournal ? '#34d399' : '#fbbf24' }}>
              {doneJournal ? '✓ Done' : '+50 XP'}
            </span>
          </div>
          <p className="m-0 mb-3.5 text-[0.85rem] text-white/50 leading-[1.5]">
            What did you notice today? Write one sentence about how your body felt while playing.
          </p>
          {!doneJournal && (
            <button
              onClick={() => {
                logEntry('Evening Journal', 50, 'Harmonia');
                updateTraction(prev => ({ ...prev, journalEntries: (prev.journalEntries || 0) + 1 }));
                completePhase?.(currentNodeId || 'fret-1-class-be', 'play');
              }}
              className="w-full py-3 rounded-[10px] bg-emerald-400/[0.12] border border-emerald-400/30 text-[#34d399] font-sans text-[0.9rem] font-semibold cursor-pointer transition-all duration-200"
            >
              Write Today's Reflection
            </button>
          )}
        </div>

        {/* Night — Wind Down */}
        <div className="border rounded-[14px] py-4.5 px-5 transition-all duration-300 ease-out" style={{ borderColor: doneWindDown ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)', background: doneWindDown ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.02)' }}>
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[1.3rem]">🌙</span>
              <div>
                <h4 className="m-0 text-base font-semibold text-vv-text font-heading">Night — Wind-Down</h4>
                <p className="m-0.5 mt-0 font-mono text-[0.65rem] text-white/35 tracking-[0.04em]">Somatic Gate</p>
              </div>
            </div>
            <span className="font-mono text-[0.75rem] font-semibold" style={{ color: doneWindDown ? '#34d399' : '#fbbf24' }}>
              {doneWindDown ? '✓ Done' : '+20 XP'}
            </span>
          </div>
          <p className="m-0 mb-3.5 text-[0.85rem] text-white/50 leading-[1.5]">
            Take 3 minutes to breathe, replay your best musical moment, and set an intention before sleep.
          </p>
          {!doneWindDown && (
            <button
              onClick={() => setActiveWindDown(true)}
              className="w-full py-3 rounded-[10px] bg-purple-400/[0.12] border border-purple-400/30 text-[#a78bfa] font-sans text-[0.9rem] font-semibold cursor-pointer transition-all duration-200"
            >
              Start Wind-Down Routine
            </button>
          )}
        </div>
      </div>

      {/* Recent activity log */}
      {practiceLog.length > 0 && (
        <div className="mt-2 py-3.5 px-4 rounded-[10px] bg-white/[0.02] border border-white/[0.05]">
          <p className="m-0 mb-2 font-mono text-[0.6rem] text-white/30 tracking-[0.1em] uppercase">Recent Activity</p>
          {practiceLog.slice(0, 5).map((log, i) => (
            <p key={i} className="my-0.5 font-mono text-[0.7rem] text-white/35 leading-[1.5]">
              {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {log.activity} · +{log.xp} XP
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
