export default function StageHeader({ chapter }) {
  return (
    <div className="py-4 md:py-6 px-4 md:px-8 border-b border-white/[0.05] bg-black/20">
      <h2 className="m-0 text-[1.1rem] md:text-[1.5rem] font-heading" style={{ color: chapter.color }}>
        {chapter.title} — {chapter.subtitle}
      </h2>
      <p className="mt-1 md:mt-2 text-[0.8rem] md:text-[0.95rem] text-white/70">
        {chapter.desc}
      </p>
    </div>
  );
}
