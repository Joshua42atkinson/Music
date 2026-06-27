import React from 'react';
import { Play, User, Music, Guitar, Compass } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BLUE = '#4488ff';

export default function NavigateTab({ bardLevel, streak, practiceMinutes, completedNodes, nextRecommended, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      {/* Apprentice status card */}
      <div className="rounded-[14px] p-3 px-3.5 mb-3.5 bg-cf-gold/[0.06] border border-cf-gold/18">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(var(--cf-gold-rgb),0.7)]">
            Apprentice Status
          </span>
          <span className="font-mono text-[0.65rem] bg-cf-gold/15 text-cf-gold px-2 py-0.5 rounded-md">
            Lv.{bardLevel}
          </span>
        </div>
        <div className="flex justify-around mb-3">
          {[
            { val: streak || 0, label: 'Streak' },
            { val: practiceMinutes || 0, label: 'Minutes' },
            { val: completedNodes?.length || 0, label: 'Frets' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-[1.1rem] text-[#f0e6d2] font-[Cormorant_Garamond]">{val}</div>
              <div className="text-[0.5rem] text-white/30 font-mono tracking-[0.08em] uppercase">{label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { if (nextRecommended) navigate(`/class/${nextRecommended}`); else navigate('/song'); setOpen(false); }}
          className="w-full py-2 rounded-lg bg-cf-gold/10 border border-cf-gold/30 text-cf-gold cursor-pointer font-mono text-[0.65rem] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5"
        >
          <Play size={12} fill="currentColor" /> Resume Journey
        </button>
      </div>

      {/* Portal links */}
      <div className="flex flex-col gap-1.5">
        {[
          { path: '/',          icon: User,     label: 'Home Portal' },
          { path: '/song',      icon: Music,    label: 'Orientation Hub' },
          { path: '/guitar',    icon: Guitar,   label: 'Guitar Workbench' },
          { path: '/player',    icon: Play,     label: 'Audio & Videos' },
          { path: '/guitar/map',icon: Compass,  label: 'Maturation Map' },
        ].map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setOpen(false); }}
              className="flex items-center gap-2 py-2 px-3 rounded-[10px] cursor-pointer font-mono text-[0.7rem] tracking-[0.08em] uppercase text-left transition-all duration-150"
              style={{
                background: active ? 'rgba(68,136,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(68,136,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? BLUE : 'rgba(255,255,255,0.55)',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
