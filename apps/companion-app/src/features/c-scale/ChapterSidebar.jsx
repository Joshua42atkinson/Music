import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { C_SCALE_CHAPTERS } from '../../data/cScaleCurriculum';

export default function ChapterSidebar({ activeStage, onSelectStage, progress, onEnterStudio }) {
  const allDone = progress['ch12'];

  return (
    <>
      {/* ── Desktop: vertical sidebar ── */}
      <div className="hidden md:flex w-80 flex-col gap-[18px] shrink-0 max-h-[calc(100vh-180px)] overflow-y-auto pr-3">
        <h2 className="m-0 text-[0.9rem] font-mono text-white/40 uppercase tracking-[0.05em]">The 12-Chapter Curriculum</h2>
        <div className="flex flex-col gap-[12px]">
          {C_SCALE_CHAPTERS.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isDone = progress[stage.key];
            return (
              <button
                key={stage.id}
                className="glass-card flex items-center justify-between p-[18px] rounded-xl border border-solid cursor-pointer transition-all duration-200 ease-out bg-transparent"
                onClick={() => onSelectStage(stage.id)}
                style={{
                  borderColor: isActive ? stage.color : undefined,
                  background: isActive ? `linear-gradient(135deg, ${stage.color}15, transparent)` : undefined
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: isDone ? 'rgba(46,204,113,0.15)' : `${stage.color}20`,
                      color: isDone ? '#2ecc71' : stage.color
                    }}>
                    {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <div className="text-left">
                    <div className="text-[0.65rem] font-mono uppercase tracking-[0.05em]"
                      style={{ color: isDone ? '#2ecc71' : stage.color }}>
                      {isDone ? '✓ Complete' : `Ch. ${index + 1}`}
                    </div>
                    <div className="text-[0.95rem] font-semibold text-vv-text">{stage.title}</div>
                    {stage.ratio && (
                      <div className="text-[0.6rem] font-mono text-white/30 mt-0.5">{stage.ratio}</div>
                    )}
                  </div>
                </div>
                {isActive && <ChevronRight size={18} color={stage.color} />}
              </button>
            );
          })}
        </div>

        {allDone && (
          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={onEnterStudio}
              className="w-full p-4 rounded-xl text-[#2ecc71] flex items-center justify-center gap-2 cursor-pointer font-mono uppercase tracking-[0.1em] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.05))',
                border: '1px solid rgba(46,204,113,0.3)',
              }}
            >
              Enter the Studio (BE • DO • PLAY) <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile: horizontal scrollable strip ── */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {C_SCALE_CHAPTERS.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          const isDone = progress[stage.key];
          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className="flex items-center gap-2 p-2.5 rounded-lg border shrink-0 cursor-pointer transition-all duration-200"
              style={{
                borderColor: isActive ? stage.color : 'rgba(255,255,255,0.08)',
                background: isActive ? `${stage.color}15` : 'transparent',
              }}
            >
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{
                  background: isDone ? 'rgba(46,204,113,0.15)' : `${stage.color}20`,
                  color: isDone ? '#2ecc71' : stage.color
                }}>
                {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[0.55rem] font-mono uppercase tracking-[0.05em]"
                  style={{ color: isDone ? '#2ecc71' : stage.color }}>
                  {isDone ? '✓' : `Ch.${index + 1}`}
                </div>
                <div className="text-[0.8rem] font-semibold text-vv-text">{stage.title}</div>
                {stage.ratio && (
                  <div className="text-[0.55rem] font-mono text-white/25">{stage.ratio}</div>
                )}
              </div>
            </button>
          );
        })}
        {allDone && (
          <button
            onClick={onEnterStudio}
            className="flex items-center gap-2 p-2.5 rounded-lg border shrink-0 cursor-pointer font-mono font-bold"
            style={{
              borderColor: 'rgba(46,204,113,0.3)',
              background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.05))',
              color: '#2ecc71',
            }}
          >
            <span className="text-[0.8rem]">Enter Studio →</span>
          </button>
        )}
      </div>
    </>
  );
}
