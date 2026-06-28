export default function StageHeader({ chapter }) {
  return (
    <div className="py-3 md:py-[18px] px-3 md:px-[18px] border-b border-white/[0.05] bg-black/20 flex items-center justify-between gap-[18px]">
      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-[1.1rem] md:text-[1.5rem] font-heading" style={{ color: chapter.color }}>
          {chapter.title} — {chapter.subtitle}
        </h2>
        <p className="mt-1 md:mt-[12px] text-[0.8rem] md:text-[0.95rem] text-white/70">
          {chapter.desc}
        </p>
      </div>
      {chapter.ratio && (
        <div className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03]">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.1em] text-white/30">Pythagorean</span>
          <span className="font-mono text-[0.9rem] font-bold" style={{ color: chapter.color }}>{chapter.ratio}</span>
        </div>
      )}
    </div>
  );
}
