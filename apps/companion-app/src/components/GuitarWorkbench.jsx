import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : GuitarWorkbench.jsx                                  ║
// ║ WHAT    : Guided practice hub providing ONE suggested practice ║
// ║           and access to the 12 fret tools based on curriculum. ║
// ║ WHY     : Students need curation over choice; 12 tools is too  ║
// ║           many. The workbench guides the somatic check-in.     ║
// ║ WHO     : Student — primary environment for 'DO' phase.        ║
// ║ OWNS    : The suggested tool logic, tool modal state, and      ║
// ║           rendering the Character/Sensations statistics.       ║
// ║ NEEDS   : ScaffoldingProvider, useLocale, db (IndexedDB)       ║
// ║ RULES   : Tools are CALLED, not chosen (design doc §2).        ║
// ║           Never show a "next" button, only "begin".            ║
// ║ FIX AT  : Route '/guitar' → GuitarWorkbench.jsx                ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                     ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { db } from '../data/localDatabase';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { TOOLS_CATALOG } from '../data/toolsData';
import {
  getPracticeContext, getInvitation,
  CHAPTER_TOOL_MAP,
} from '../data/workbenchData';
import {
  Wind, Timer, Music, Feather, Grid3x3, BookOpen, Mic, Activity, Zap,
  Video, Layers, Play, X, Sparkles, ChevronDown, ChevronUp,
  HelpCircle, Heart, Brain, Ear, Compass, ArrowLeft, Map,
} from 'lucide-react';

import AuthButton from './AuthButton';

// ── Tool components ──
import BreathingGate from './BreathingGate';
import PracticeTimer from './PracticeTimer';
import PitchRoom from '../features/audio-engine/PitchRoom';
import SongwritingCompanion from './SongwritingCompanion';
import IntervalVisualizer from './IntervalVisualizer';
import FretboardExplorer from '../features/vr-fretboard/FretboardExplorer';
import PlingTrainer from './PlingTrainer';
import MicrotonalTracker from './MicrotonalTracker';
import MultiKeyHub from './MultiKeyHub';
import RhythmEngine from '../features/audio-engine/RhythmEngine';
import PracticeRecorder from './PracticeRecorder';

const PROTOCOL_COLORS = {
  'SHEARL': { bg: 'rgba(90,144,160,0.08)', border: 'rgba(90,144,160,0.25)', text: '#5a90a0', dot: '#5a90a0' },
  'PLING!': { bg: 'rgba(122,170,136,0.08)', border: 'rgba(122,170,136,0.25)', text: '#7aaa88', dot: '#7aaa88' },
  'FHEAL':  { bg: 'rgba(123,106,170,0.08)', border: 'rgba(123,106,170,0.25)', text: '#7b6aaa', dot: '#7b6aaa' },
};

const ICON_MAP = {
  1: Wind, 2: Timer, 3: Music, 4: Feather, 5: Grid3x3,
  6: BookOpen, 7: Mic, 8: Activity, 9: Zap, 10: Video, 11: Layers, 12: Play,
};

const STAT_ICONS = { breath: Wind, pitch: Ear, memory: Brain, expression: Heart };

// ── Tool Modal ──
function ToolModal({ tool, onClose }) {
  const { traction } = useScaffolding();
  if (!tool) return null;
  const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
  const Icon = ICON_MAP[tool.id] || Wind;

  const renderTool = () => {
    switch (tool.id) {
      case 1: return traction?.settings?.disableBreathingGates ? <div className="text-center p-8 text-white/40 font-mono text-sm">Breathing exercises disabled in settings.</div> : <BreathingGate />;
      case 2: return <PracticeTimer fretId={tool.id} />;
      case 3: return <PitchRoom />;
      case 4: return <SongwritingCompanion />;
      case 5: return <IntervalVisualizer />;
      case 6: return <FretboardExplorer compact={false} />;
      case 7: return <PlingTrainer />;
      case 8: return <MicrotonalTracker />;
      case 9: return <FretboardExplorer compact={false} />;
      case 10: return <PracticeRecorder onClose={onClose} exerciseName="Async Assessor" />;
      case 11: return <MultiKeyHub />;
      case 12: return <RhythmEngine />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'rgba(5,5,8,0.92)' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-3">
          <Icon size={20} style={{ color: colors.text }} />
          <div>
            <h3 className="m-0 font-heading text-[1.1rem] text-[#f0e6d2]">{tool.name}</h3>
            <p className="m-0 text-[0.6rem] font-mono tracking-[0.08em] uppercase" style={{ color: colors.text }}>
              Fret {tool.id} · {tool.protocol} · {tool.phase}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-cf-gold cursor-pointer hover:bg-white/10 transition-colors" aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">{renderTool()}</div>
    </div>
  );
}

// ── Suggested Practice Card ──
function SuggestedPractice({ suggestion, onOpenTool, lang }) {
  if (!suggestion?.tool) return null;
  const tool = suggestion.tool;
  const isCScale = suggestion.type === 'c-scale';
  const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
  const Icon = isCScale ? Music : (ICON_MAP[tool.id] || Wind);
  const invitation = t(`chapter_${suggestion.fretId || tool.id}_invitation`);

  const handleDismiss = () => {
    try { vvSet(STORAGE_KEYS.CSCALE_DISMISSED, 'true'); } catch { /* ignore */ }
    window.location.reload();
  };

  return (
    <div className="rounded-2xl border p-5 pb-5 mb-2 text-left" style={{ borderColor: isCScale ? 'rgba(var(--cf-gold-rgb),0.4)' : colors.border, background: isCScale ? 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.08) 0%, rgba(5,5,8,0.5) 100%)' : `linear-gradient(135deg, ${colors.bg} 0%, rgba(5,5,8,0.5) 100%)` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0" style={{ background: isCScale ? 'rgba(var(--cf-gold-rgb),0.1)' : colors.bg, borderColor: isCScale ? 'rgba(var(--cf-gold-rgb),0.3)' : colors.border, color: isCScale ? 'var(--cf-gold)' : colors.text }}>
          <Icon size={24} />
        </div>
        <div>
          <p className="m-0 mb-0.5 text-[0.55rem] font-mono tracking-[0.1em] uppercase" style={{ color: isCScale ? 'var(--cf-gold)' : colors.text }}>
            {isCScale ? "Foundation · Bertrand's Method" : suggestion.type === 'somatic' ? 'Somatic Check-in' : `Fret ${suggestion.fretId || tool.id} · ${tool.protocol}`}
          </p>
          <h3 className="m-0 font-heading text-[1.3rem] text-[#f0e6d2] font-semibold">
            {tool.name}
          </h3>
        </div>
      </div>

      <p className="m-0 mb-4 text-[0.88rem] leading-[1.55] text-white/60 italic">
        "{invitation || tool.telemetry}"
      </p>

      <div className="flex gap-2.5 items-center">
        <button
          onClick={() => {
            if (tool.id === 'cscale') {
              onOpenTool('navigate_cscale');
            } else {
              onOpenTool(tool);
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[0.85rem] font-semibold cursor-pointer font-body transition-all duration-200 hover:translate-y-[-1px]" style={{ background: isCScale ? 'rgba(var(--cf-gold-rgb),0.1)' : colors.bg, borderColor: isCScale ? 'rgba(var(--cf-gold-rgb),0.3)' : colors.border, color: isCScale ? 'var(--cf-gold)' : colors.text }}
        >
          <Play size={16} /> {isCScale ? 'Begin C-Scale Course' : 'Begin Session'}
        </button>
        {isCScale && (
          <button
            onClick={handleDismiss}
            className="bg-transparent border-none text-white/30 text-[0.75rem] cursor-pointer font-mono underline hover:text-white/50 transition-colors"
          >
            Skip for now →
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function GuitarWorkbench() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const { bardLevel, practiceMinutes, streak, traction } = useScaffolding();
  const isKidMode = traction?.settings?.kidMode === true;
  const [activeTool, setActiveTool] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [showAllTools, setShowAllTools] = useState(false);
  const [practiceCtx] = useState(() => getPracticeContext());

  // Load journal
  useEffect(() => {
    const load = async () => {
      try {
        const entries = await db.journal.orderBy('timestamp').reverse().limit(5).toArray();
        setJournalEntries(entries);
      } catch (e) { devWarn('[Workbench] No journal:', e); }
    };
    load();
  }, []);

  const handleOpenTool = useCallback((tool) => {
    if (tool === 'navigate_cscale') {
      navigate('/c-scale');
      return;
    }
    setActiveTool(tool);
    // Track last practiced fret
    try {
      vvSet(STORAGE_KEYS.LAST_TOOL_FRET, String(tool.id));
    } catch { /* ignore */ }
  }, [navigate]);

  useEffect(() => {
    const onStartMeditation = () => {
      const breathingTool = TOOLS_CATALOG.find(t => t.id === 1);
      if (breathingTool) {
        handleOpenTool(breathingTool);
      }
    };
    window.addEventListener('voixvive:start_meditation', onStartMeditation);
    return () => window.removeEventListener('voixvive:start_meditation', onStartMeditation);
  }, [handleOpenTool]);

  const _handleHelpClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: 'music', focusChat: true } }));
  }, []);

  const studentName = (() => {
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || t('adventurer') || 'Student'; }
    catch { return 'Student'; }
  })();



  const completedFrets = practiceCtx?.fretsCompleted || [];
  const suggestion = practiceCtx?.suggestion;
  const stats = practiceCtx?.stats || {};

  return (
    <div className="min-h-svh bg-cf-void text-vv-text font-body pb-16">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/[0.06]">
        <div className="text-left flex-1">
          <p className="m-0 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-cf-gold/50">Guitar Workbench</p>
          <p className="m-0 mt-1 font-quote italic text-[0.95rem] text-white/40">Your practice companion</p>
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <button onClick={() => navigate(-1)} className="bg-white/5 border border-white/[0.08] rounded-lg px-2.5 py-1.5 cursor-pointer flex items-center hover:bg-white/10 transition-colors" aria-label="Back">
            <ArrowLeft size={20} className="text-cf-gold" />
          </button>
        </div>
      </div>

      {/* ── Character Bar ── */}
      <div className="flex items-center justify-center gap-0 py-3.5 px-4 border-b border-white/[0.04] flex-wrap">
        <div className="flex flex-col items-center px-3.5 min-w-[60px]">
          <span className="text-[0.85rem] font-semibold text-[#f0e6d2] font-heading">{studentName}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase mt-0.5">Lv.{bardLevel} {t(`bardLevel_${Math.min(Math.max(bardLevel, 1), 10)}`)}</span>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px]">
          <span className="text-[0.85rem] font-semibold text-[#f0e6d2] font-heading">{streak || 0}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase mt-0.5">day streak</span>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px]">
          <span className="text-[0.85rem] font-semibold text-[#f0e6d2] font-heading">{practiceMinutes || 0}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase mt-0.5">minutes</span>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px]">
          <span className="text-[0.85rem] font-semibold text-[#f0e6d2] font-heading">{completedFrets.length}/12</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase mt-0.5">frets</span>
        </div>
      </div>

      {/* ── SUGGESTED PRACTICE (Hero) ── */}
      <div className="px-4 max-w-[640px] mx-auto">
        {suggestion && (
          <>
            <div className="flex items-center gap-2 my-5 mb-2.5">
              <Compass size={14} className="text-cf-gold" />
              <span className="text-[0.6rem] font-mono tracking-[0.12em] uppercase text-cf-gold/60">
                {suggestion.type === 'somatic' ? 'Suggested first' : 'Your next step'}
              </span>
            </div>
            <SuggestedPractice suggestion={suggestion} onOpenTool={handleOpenTool} />
          </>
        )}
      </div>

      {/* ── YOUR JOURNEY ── */}
      <div className="pt-5 px-4 max-w-[640px] mx-auto">
        <h2 className="font-heading text-[1.05rem] font-semibold text-[#f0e6d2] mb-1">Your Journey</h2>
        <div className="flex justify-center gap-1.5 flex-wrap py-2.5">
          {Array.from({ length: 12 }, (_, i) => {
            const fretId = i + 1;
            const isDone = completedFrets.includes(fretId);
            const hasJournal = journalEntries.some(e => e.fretId === fretId);
            const isCurrent = practiceCtx?.curriculum?.currentFret === fretId;
            const tool = CHAPTER_TOOL_MAP[fretId];
            return (
              <button
                key={fretId}
                onClick={() => {
                  const t = TOOLS_CATALOG.find(tc => tc.id === tool.toolId);
                  if (t) handleOpenTool(t);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 bg-transparent cursor-pointer" style={{ background: isDone ? 'rgba(var(--cf-gold-rgb),0.25)' : hasJournal ? 'rgba(122,170,136,0.15)' : 'rgba(255,255,255,0.04)', borderColor: isCurrent ? 'var(--cf-gold)' : isDone ? 'rgba(var(--cf-gold-rgb),0.4)' : hasJournal ? 'rgba(122,170,136,0.3)' : 'rgba(255,255,255,0.08)', boxShadow: isCurrent ? '0 0 12px rgba(var(--cf-gold-rgb),0.2)' : 'none' }}
                title={`Fret ${fretId}: ${tool?.name || ''}`}
              >
                <span className="text-[0.55rem] font-mono" style={{ color: isCurrent ? 'var(--cf-gold)' : isDone ? 'var(--cf-gold)' : hasJournal ? '#7aaa88' : 'rgba(255,255,255,0.25)', fontWeight: isCurrent ? 700 : 400 }}>
                  {fretId}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-[0.6rem] text-white/20 mt-2 font-mono tracking-[0.06em]">
          Gold ring = current · Gold = completed · Green = journal · Gray = waiting
        </p>
      </div>

      {/* ── CHARACTER STATS ── */}
      <div className="pt-5 px-4 max-w-[640px] mx-auto">
        <h2 className="font-heading text-[1.05rem] font-semibold text-[#f0e6d2] mb-1">Your Sensations</h2>
        <p className="text-[0.68rem] text-white/30 mb-3 font-mono tracking-[0.06em]">The body is the instrument that plays the instrument.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-8">
          {[
            { key: 'breath', label: 'Breath', value: stats.breath || 1 },
            { key: 'pitch', label: 'Pitch', value: stats.pitch || 1 },
            { key: 'memory', label: 'Memory', value: stats.memory || 1 },
          ].map(stat => {
            const StatIcon = STAT_ICONS[stat.key] || Compass;
            const pct = (stat.value / 20) * 100;
            return (
              <div key={stat.key} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-6 mb-8">
                  <StatIcon size={14} className="text-cf-gold/50" />
                  <span className="text-[0.7rem] text-white/40 uppercase tracking-[0.06em] font-mono">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[1.2rem] font-semibold text-[#f0e6d2] font-heading">{stat.value}</span>
                  <span className="text-[0.6rem] text-white/25">/20</span>
                </div>
                <div className="h-[3px] rounded-sm bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-sm transition-[width] duration-500 ease-out" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, rgba(var(--cf-gold-rgb),0.4), rgba(var(--cf-gold-rgb),0.7))' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALL TOOLS (Collapsible) ── */}
      <div className="pt-5 px-4 max-w-[640px] mx-auto">
        <button onClick={() => setShowAllTools(v => !v)} className="flex items-center justify-between w-full bg-transparent border-none text-inherit cursor-pointer py-1 px-0 hover:opacity-80 transition-opacity">
          <div>
            <h2 className="font-heading text-[1.05rem] font-semibold text-[#f0e6d2] mb-1 inline">All 12 Tools</h2>
            <span className="text-[0.65rem] text-white/30 ml-2 font-mono">
              {showAllTools ? 'click to hide' : 'click to browse'}
            </span>
          </div>
          {showAllTools ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
        </button>

        {showAllTools && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5 mt-3">
            {TOOLS_CATALOG.map(tool => {
              const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
              const Icon = ICON_MAP[tool.id] || Wind;
              const isDone = completedFrets.includes(tool.id);
              const isSuggested = suggestion?.toolId === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => handleOpenTool(tool)}
                  className="flex flex-col p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 bg-transparent" style={{ background: isSuggested ? `linear-gradient(135deg, ${colors.bg}, rgba(var(--cf-gold-rgb),0.05))` : colors.bg, borderColor: isSuggested ? 'var(--cf-gold)' : colors.border, opacity: isDone ? 0.7 : 1 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[0.55rem] font-mono tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border" style={{ color: colors.text, borderColor: colors.border }}>
                      Fret {tool.id}
                    </span>
                    {isSuggested && <span className="text-[0.55rem] text-cf-gold font-mono">SUGGESTED</span>}
                    {isDone && !isSuggested && <span className="text-[0.6rem] text-cf-sage/60">✓</span>}
                  </div>
                  <div className="flex items-center gap-2.5 mb-8">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center border shrink-0" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
                      <Icon size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="m-0 mb-0.5 text-[0.9rem] font-semibold text-[#e8dcc8] leading-[1.2]">{tool.shortName}</h3>
                      {!isKidMode && <p className="m-0 text-[0.6rem] text-white/35 font-mono tracking-[0.04em]">{tool.desc}</p>}
                    </div>
                  </div>
                  {!isKidMode && (
                    <p className="m-0 text-[0.7rem] text-white/45 leading-[1.4] text-left">
                      {tool.telemetry}
                    </p>
                  )}
                  <div className="h-px mt-auto pt-2.5" style={{ background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)` }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RECENT REFLECTIONS ── */}
      {journalEntries.length > 0 && (
        <div className="pt-5 px-4 max-w-[640px] mx-auto">
          <h2 className="font-heading text-[1.05rem] font-semibold text-[#f0e6d2] mb-1">Recent Reflections</h2>
          <div className="flex flex-col gap-2 mt-2.5">
            {journalEntries.map((entry, i) => (
              <div key={entry.id || i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[1rem]">
                    {entry.mood === 'calm' ? '😌' : entry.mood === 'excited' ? '✨' : entry.mood === 'frustrated' ? '😤' : entry.mood === 'peaceful' ? '🕊️' : entry.mood === 'tense' ? '😬' : '😐'}
                  </span>
                  <span className="text-[0.55rem] text-white/30 font-mono tracking-[0.06em]">
                    Fret {entry.fretId} · {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="m-0 text-[0.78rem] text-white/55 leading-[1.45]">
                  {entry.text?.slice(0, 140)}{entry.text?.length > 140 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOOL MODAL ── */}
      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}

    </div>
  );
}

