import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { C_SCALE_CHAPTERS } from '../../data/cScaleCurriculum';

export default function ChapterSidebar({ activeStage, onSelectStage, progress, onEnterStudio }) {
  const allDone = progress['ch12'];

  return (
    <div className="w-80 flex flex-col gap-5 shrink-0 max-h-[calc(100vh-180px)] overflow-y-auto pr-3">
      <h2 className="m-0 text-[0.9rem] font-mono text-white/40 uppercase tracking-[0.05em]">The 12-Chapter Curriculum</h2>
      <div className="flex flex-col gap-3">
        {C_SCALE_CHAPTERS.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          const isDone = progress[stage.key];
          return (
            <button
              key={stage.id}
              className="glass-card flex items-center justify-between p-4 rounded-xl border border-solid cursor-pointer transition-all duration-200 ease-out bg-transparent"
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
  );
}
