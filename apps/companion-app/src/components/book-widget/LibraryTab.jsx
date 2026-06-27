import React from 'react';
import { HelpCircle, BookText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LibraryTab({ setShowTutorial, setShowHelp, setOpen }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2.5">
      {/* ── PRIMARY: How This Works guide ── */}
      <button
        onClick={() => setShowTutorial(true)}
        className="w-full p-4 rounded-[14px] border border-cf-gold/40 text-left cursor-pointer transition-all duration-200 hover:from-[rgba(var(--cf-gold-rgb),0.22)] hover:to-[rgba(var(--cf-gold-rgb),0.1)] bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.15)] to-[rgba(var(--cf-gold-rgb),0.06)]"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-[20px]">♾️</span>
          <span className="text-cf-gold font-[Cormorant_Garamond] text-[1rem] font-semibold">How This Works</span>
        </div>
        <p className="m-0 ml-[30px] text-[rgba(var(--cf-gold-rgb),0.6)] font-mono text-[0.6rem] tracking-[0.08em] uppercase">Start here · 7-step guided tour</p>
      </button>

      <div className="p-4 rounded-[14px] bg-white/[0.02] border border-white/[0.05]">
        <h3 className="text-white/50 font-[Cormorant_Garamond] text-[1rem] mb-2.5 mt-0">
          More Resources
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="w-full py-3 rounded-[10px] bg-white/[0.05] border border-white/[0.1] text-white/70 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 text-left cursor-pointer"
          >
            <HelpCircle size={16} /> Academy Philosophy
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full py-3 rounded-[10px] bg-white/[0.05] border border-white/[0.1] text-white/70 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle size={16} /> Academy Help & Philosophy
          </button>
          <button
            onClick={() => { navigate('/12m'); setOpen(false); }}
            className="w-full py-3 rounded-[10px] bg-white/[0.02] border border-white/[0.05] text-white/50 font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 cursor-pointer"
          >
            <BookText size={16} /> Open the 12M Bible
          </button>
        </div>
      </div>
    </div>
  );
}
