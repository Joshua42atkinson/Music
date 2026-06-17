import React, { useState, useEffect, useCallback, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { useAuth } from '../hooks/useAuth';
import { db } from '../data/localDatabase';
import { TOOLS_CATALOG } from '../data/toolsData';
import { QUEST_DATA, getBardTitle, getXpForNextLevel, computeStatValue } from '../data/playbookData';
import { getSuggestedTool, getInvitation, CHAPTER_TOOL_MAP } from '../data/workbenchData';
import { SLIDE_DECKS } from '../data/slideDecks';
import frets from '../data/chapterData';
import { getSlidePosition } from '../data/localDatabase';
import {
  Wind, Timer, Music, Feather, Grid3x3, BookOpen, Mic, Activity, Zap,
  Video, Layers, Play, X, ChevronDown, ChevronUp, ArrowLeft, Ear, Brain, Heart, Award, Compass, BookOpenCheck
} from 'lucide-react';
import AuthButton from './AuthButton';
import HamburgerMenu from './HamburgerMenu';
import SlideViewer from './SlideViewer';
import { useCosyVoice } from '../hooks/useCosyVoice';
import { getVoicePrompt } from '../data/voicePrompts';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ── Interactive Tool Components ──
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

// ── Shared Subcomponents from Playbook ──
import CharacterSheet from './playbook/CharacterSheet';
import { JournalFeed } from './playbook/JournalEntry';
import VideoRecorder from './playbook/VideoRecorder';
import VideoLibrary from './playbook/VideoLibrary';

const PROTOCOL_COLORS = {
  'SHEARL': { bg: 'rgba(90,144,160,0.08)', border: 'rgba(90,144,160,0.25)', text: '#5a90a0', dot: '#5a90a0' },
  'PLING!': { bg: 'rgba(122,170,136,0.08)', border: 'rgba(122,170,136,0.25)', text: '#7aaa88', dot: '#7aaa88' },
  'FHEAL':  { bg: 'rgba(123,106,170,0.08)', border: 'rgba(123,106,170,0.25)', text: '#7b6aaa', dot: '#7b6aaa' },
};

const ICON_MAP = {
  1: Wind, 2: Timer, 3: Music, 4: Feather, 5: Grid3x3,
  6: BookOpen, 7: Mic, 8: Activity, 9: Zap, 10: Video, 11: Layers, 12: Play,
};

const MASTERY_STARS = ['○', '◐', '●', '★'];
const MASTERY_LABELS = {
  en: ['Encountered', 'Experienced', 'Owned', 'Mastered'],
  fr: ['Rencontré', 'Expérimenté', 'Acquis', 'Maîtrisé']
};

const TABS = [
  { id: 'workbook',    icon: '📚', en: 'Workbook',     fr: 'Livre de bord' },
  { id: 'projects',    icon: '✍️', en: 'Projects',     fr: 'Projets' },
  { id: 'submissions', icon: '📓', en: 'Submissions',  fr: 'Soumissions' },
  { id: 'library',     icon: '📽️', en: 'Resources',    fr: 'Ressources' },
  { id: 'character',   icon: '📊', en: 'Character',    fr: 'Personnage' },
];

export default function Workbook() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const lang = locale;
  const {
    traction,
    updateTraction: _updateTraction,
    refreshTraction,
    bardLevel,
    practiceMinutes,
    streak,
    currentNodeId: _currentNodeId,
    completedNodes: _completedNodes,
    completePhase: _completePhase,
    passGate: _passGate,
    globalMode
  } = useScaffolding();
  const { user } = useAuth();
  const cosyvoice = useCosyVoice();

  const [activeTab, setActiveTab] = useState('workbook');
  const [activeTool, setActiveTool] = useState(null);
  const [activeSlideFretId, setActiveSlideFretId] = useState(null);
  const [expandedFretId, setExpandedFretId] = useState(null);
  const [journalCounts, setJournalCounts] = useState({});
  const [, setReviewedCount] = useState(0);

  // Somatic PLAY Gate Voice Prompt
  useEffect(() => {
    cosyvoice.initTTS();
    return () => {
      cosyvoice.cancel();
    };
  }, [cosyvoice]);

  useEffect(() => {
    if (activeTab === 'submissions' && cosyvoice.isReady) {
      let activeFret = 1;
      try {
        const last = vvGet(STORAGE_KEYS.LAST_TOOL_FRET);
        if (last) activeFret = parseInt(last, 10);
      } catch { /* ignore */ }
      
      const prompt = getVoicePrompt(activeFret, 'play', locale);
      if (prompt) {
        cosyvoice.speak(prompt, locale);
      }
    } else {
      cosyvoice.cancel();
    }
  }, [activeTab, cosyvoice, locale]);

  const studentName = useMemo(() => {
    const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    if (googleName) return googleName;
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || 'Adventurer'; }
    catch { return 'Adventurer'; }
  }, [user]);

  // Load journal counts & reviewed count
  const loadStats = useCallback(async () => {
    try {
      const entries = await db.journal.toArray();
      const counts = {};
      entries.forEach(e => {
        counts[e.fretId] = (counts[e.fretId] || 0) + 1;
      });
      setJournalCounts(counts);

      const resp = await fetch('http://localhost:8080/api/mentor/submissions');
      if (resp.ok) {
        const data = await resp.json();
        if (data.submissions) {
          const count = data.submissions.filter(
            s => s.student_name === studentName && s.status === 'reviewed'
          ).length;
          setReviewedCount(count);
        }
      }
    } catch (e) {
      console.warn('Failed to load submissions in Workbook:', e);
    }
  }, [studentName]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const handleOpenTool = useCallback((tool) => {
    setActiveTool(tool);
    try {
      vvSet(STORAGE_KEYS.LAST_TOOL_FRET, String(tool.id));
    } catch { /* ignore */ }
  }, []);

  const handleCloseTool = useCallback(() => {
    setActiveTool(null);
    refreshTraction();
  }, [refreshTraction]);

  // Suggestion details
  const suggestion = useMemo(() => {
    return getSuggestedTool();
  }, []);

  // Sensation Stats
  const statBreath = useMemo(() => computeStatValue('breath', traction), [traction]);
  const statPitch = useMemo(() => computeStatValue('pitch', traction), [traction]);
  const statMemory = useMemo(() => computeStatValue('memory', traction), [traction]);

  const xpCurrent = traction?.xp || 0;
  const xpNext = getXpForNextLevel(bardLevel);
  const xpProgress = xpNext > 0 ? Math.min(1, xpCurrent / xpNext) : 1;
  const completedFretsCount = Object.values(traction?.frets || {}).filter(f => (f.traction || 0) >= 60).length;

  return (
    <div className="flex flex-col h-[100svh] bg-[#050508] text-[#e8dcc8] font-sans overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[0.75rem] text-[var(--cf-gold)] font-mono tracking-[0.05em] uppercase cursor-pointer bg-transparent border-0 p-0"
          aria-label="Back to home"
        >
          <ArrowLeft size={14} />
          {t('back')}
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-[Cormorant_Garamond] text-[1.4rem] font-semibold text-[#f0e6d2] m-0">
            {t('somaticWorkbook')}
          </h1>
          <p className="font-mono text-[0.55rem] text-[rgba(var(--cf-gold-rgb),0.45)] tracking-[0.15em] uppercase m-0">
            Voix Vive Sovereign OS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu activeTab={activeTab} setActiveTab={setActiveTab} />
          <button className="bg-transparent border-0 p-0 cursor-pointer flex items-center" onClick={() => navigate('/')} aria-label="Home page">
            <img
              src="/assets/wordmark.png"
              alt="Voix Vive"
              className="h-6 w-auto"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* ── Tab Contents ── */}
      <div className="flex-1 overflow-y-auto pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'workbook' && (
              <div className="max-w-[650px] mx-auto px-4 pb-10">
                {/* 1. Character Header */}
                <div className="bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.05)] to-[rgba(5,5,8,0.6)] border border-[rgba(var(--cf-gold-rgb),0.15)] rounded-2xl p-5 mt-5">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <div className="font-[Cormorant_Garamond] text-[1.4rem] font-semibold text-[#f0e6d2]">{studentName}</div>
                      <div className="font-mono text-[0.7rem] text-[var(--cf-gold)] uppercase tracking-[0.08em] mt-0.5">
                        Lv.{bardLevel} {getBardTitle(bardLevel, lang)}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-0.5 px-2">
                        <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{streak || 0}</span>
                        <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('daysStreak')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 px-2">
                        <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{practiceMinutes || 0}</span>
                        <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('minutes')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 px-2">
                        <span className="font-[Cormorant_Garamond] text-[1.3rem] font-bold text-[#f0e6d2]">{completedFretsCount}/12</span>
                        <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-[0.05em]">{t('fretsLabel')}</span>
                      </div>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="mt-3.5 mb-4">
                    <div className="flex justify-between font-mono text-[0.6rem] text-white/50 uppercase tracking-[0.05em] mb-1.5">
                      <span>XP Progress</span>
                      <span>{xpCurrent} / {xpNext} XP</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full rounded-[2px] transition-[width] duration-[400ms] ease-out bg-gradient-to-r from-[var(--cf-gold)] to-[#e0d0aa]"
                        style={{ width: `${xpProgress * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Sensation Stats Grid */}
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mt-4">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[0.9rem]">🫁</span>
                        <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('breathControl')}</span>
                        <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statBreath}/20</span>
                      </div>
                      <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
                        <div
                          className="h-full rounded-[1.5px]"
                          style={{ width: `${(statBreath / 20) * 100}%`, background: '#5a90a0' }}
                        />
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[0.9rem]">🎯</span>
                        <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('pitchAccuracy')}</span>
                        <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statPitch}/20</span>
                      </div>
                      <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
                        <div
                          className="h-full rounded-[1.5px]"
                          style={{ width: `${(statPitch / 20) * 100}%`, background: '#7aaa88' }}
                        />
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] px-3 pt-2.5 pb-3">
                      <div className="text-[0.9rem]">🧠</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="font-sans text-[0.7rem] text-white/60 flex-1">{t('fretboardMemory')}</span>
                        <span className="font-mono text-[0.75rem] font-semibold text-[#f0e6d2]">{statMemory}/20</span>
                      </div>
                      <div className="h-[3px] bg-white/[0.05] rounded-[1.5px] overflow-hidden">
                        <div
                          className="h-full rounded-[1.5px]"
                          style={{ width: `${(statMemory / 20) * 100}%`, background: '#7b6aaa' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Active Quest Hero CTA */}
                {suggestion?.tool && (
                  <div className="bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.1)] to-[rgba(5,5,8,0.7)] border border-[rgba(var(--cf-gold-rgb),0.3)] rounded-2xl p-6 mt-5 text-center shadow-[0_8px_32px_rgba(var(--cf-gold-rgb),0.08)]">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-mono text-[0.65rem] text-[var(--cf-gold)] tracking-[0.15em] font-bold">
                        ⚡ {t('currentQuest')}
                      </div>
                      <div className="font-mono text-[0.6rem] text-white/40 uppercase">
                        Chapter {suggestion.fretId || suggestion.tool.id} · {suggestion.tool.protocol}
                      </div>
                    </div>
                    <h3 className="font-[Cormorant_Garamond] text-[1.6rem] font-semibold text-[#f0e6d2] m-0 mb-2.5">
                      {suggestion.tool.name}
                    </h3>
                    <p className="font-[EB_Garamond] text-[1.05rem] leading-normal text-white/[0.65] italic m-0 mx-auto mb-5 max-w-[480px]">
                      "{getInvitation(suggestion.fretId || suggestion.tool.id, lang) || suggestion.tool.telemetry}"
                    </p>
                    <button
                      onClick={() => handleOpenTool(suggestion.tool)}
                      className="inline-flex items-center gap-2 bg-gradient-to-br from-[var(--cf-gold)] to-[#aa7c11] text-[#050508] border-0 rounded-[30px] px-[30px] py-3 font-mono text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer shadow-[0_4px_16px_rgba(var(--cf-gold-rgb),0.25)] transition-all duration-200"
                    >
                      <Play size={14} fill="currentColor" /> {t('beginSession')}
                    </button>
                  </div>
                )}

                {/* 3. 12-Chapter Quest Timeline */}
                {globalMode === 'open_book' ? (
                <div className="mt-8">
                  <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.22em] uppercase text-center mb-5">
                    {t('minstrelsJourney')}
                  </h3>

                  <div className="relative flex flex-col gap-3">
                    {QUEST_DATA.map((quest, idx) => {
                      const fretTraction = traction?.frets?.[quest.fretId] || {};
                      const tractionPct = fretTraction.traction || 0;
                      const tool = TOOLS_CATALOG.find(t => t.id === quest.fretId);
                      const fret = frets.find(f => f.id === quest.fretId);
                      const slides = fret ? (SLIDE_DECKS[fret.id] || []) : [];
                      const slidePos = getSlidePosition(quest.fretId);
                      const slideProgress = slides.length > 0 ? Math.round((slidePos / (slides.length - 1)) * 100) : 0;
                      
                      const isCompleted = tractionPct >= 60;
                      const isStarted = tractionPct > 0 || slidePos > 0;
                      const isExpanded = expandedFretId === quest.fretId;
                      const protocolColor = PROTOCOL_COLORS[tool?.protocol]?.text || 'var(--cf-gold)';
                      const journals = journalCounts[quest.fretId] || 0;

                      // Phase node completions & mastery
                      const beComp = !!fretTraction.beCompleted;
                      const doComp = !!fretTraction.doCompleted;
                      const playComp = !!fretTraction.playCompleted;

                      const beMastery = fretTraction.beMastery || 0;
                      const doMastery = fretTraction.doMastery || 0;
                      const playMastery = fretTraction.playMastery || 0;

                      const beGate = !!fretTraction.beGatePassed;
                      const doGate = !!fretTraction.doGatePassed;
                      const playGate = !!fretTraction.playGatePassed;

                      const status = isCompleted ? 'completed' : isStarted ? 'active' : 'locked';
                      const statusIcon = isCompleted ? '✅' : isStarted ? '📖' : '🔒';

                      return (
                        <div key={quest.fretId} className="relative">
                          {/* Timeline connector line */}
                          {idx < QUEST_DATA.length - 1 && (
                            <div
                              className="absolute left-[26px] top-[52px] -bottom-3 w-[2px] z-0"
                              style={{
                                background: isCompleted
                                  ? `linear-gradient(180deg, ${protocolColor}, ${protocolColor}30)`
                                  : 'rgba(255,255,255,0.06)',
                              }}
                            />
                          )}

                          {/* Quest Card */}
                          <div
                            className="relative rounded-2xl border p-4 cursor-pointer transition-all duration-200"
                            style={{
                              borderColor: isExpanded ? 'var(--cf-gold)' : status === 'completed' ? `${protocolColor}80` : status === 'active' ? 'rgba(var(--cf-gold-rgb),0.3)' : 'rgba(255,255,255,0.05)',
                              background: status === 'completed' ? 'rgba(255,255,255,0.01)' : 'rgba(5,5,8,0.4)',
                              opacity: status === 'locked' ? 0.45 : 1,
                            }}
                            onClick={() => setExpandedFretId(isExpanded ? null : quest.fretId)}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="text-[1.25rem] w-6 text-center shrink-0">{statusIcon}</span>
                              <div className="flex-1">
                                <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase m-0 mb-0.5" style={{ color: protocolColor }}>
                                  {t('fretUpper')} {quest.fretId} · {tool?.protocol || ''}
                                </p>
                                <h4 className="font-[Cormorant_Garamond] text-[1.15rem] font-semibold text-[#e8edf2] m-0 leading-tight">{quest.quest[lang]}</h4>
                              </div>
                              <span className="text-white/30 text-[0.9rem] transition-transform duration-200 shrink-0" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                                ▾
                              </span>
                            </div>

                            {/* Mini progress line */}
                            {status !== 'locked' && (
                              <div className="h-[2px] rounded-[1px] bg-white/[0.06] overflow-hidden mt-3">
                                <div
                                  className="h-full rounded-[1px] transition-[width] duration-[400ms] ease-out"
                                  style={{ width: `${Math.max(slideProgress, tractionPct)}%`, background: `linear-gradient(90deg, ${protocolColor}, var(--cf-gold))` }}
                                />
                              </div>
                            )}

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
                                <p className="font-[EB_Garamond] text-[1.02rem] italic text-white/[0.55] leading-relaxed m-0 mb-4">{quest.flavor[lang]}</p>

                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(var(--cf-gold-rgb),0.05)] border border-[rgba(var(--cf-gold-rgb),0.15)] text-[0.75rem] font-mono text-white/60 mb-4">
                                  🎁 <span className="text-[#e0d0aa] font-semibold">{quest.reward[lang]}</span>
                                </div>

                                {/* Phase Nodes Grid */}
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
                                  {/* Imagine (BE) */}
                                  <div
                                    className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                                    style={{
                                      borderColor: beComp ? 'rgba(90,144,160,0.3)' : 'rgba(255,255,255,0.05)',
                                      background: beComp ? 'rgba(90,144,160,0.03)' : 'rgba(255,255,255,0.01)'
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#5a90a0]" />
                                      <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Imagine (BE)</span>
                                      <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={MASTERY_LABELS[lang][beMastery]}>
                                        {MASTERY_STARS[beMastery]}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                                      <span>Slides: {slidePos}/{slides.length}</span>
                                      <span>{beGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                                    </div>
                                    <button
                                      onClick={() => setActiveSlideFretId(quest.fretId)}
                                      className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                                    >
                                      <BookOpenCheck size={12} /> {beComp ? 'Review Slides' : 'Read Slides'}
                                    </button>
                                  </div>

                                  {/* Hear (DO) */}
                                  <div
                                    className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                                    style={{
                                      borderColor: doComp ? 'rgba(122,170,136,0.3)' : 'rgba(255,255,255,0.05)',
                                      background: doComp ? 'rgba(122,170,136,0.03)' : 'rgba(255,255,255,0.01)'
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#7aaa88]" />
                                      <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Hear (DO)</span>
                                      <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={MASTERY_LABELS[lang][doMastery]}>
                                        {MASTERY_STARS[doMastery]}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                                      <span>Accuracy: {fretTraction.pitchAccuracy || 0}%</span>
                                      <span>{doGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                                    </div>
                                    <button
                                      onClick={() => handleOpenTool(tool)}
                                      className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                                    >
                                      <Activity size={12} /> {doComp ? 'Practice Tool' : 'Launch Tool'}
                                    </button>
                                  </div>

                                  {/* Play (PLAY) */}
                                  <div
                                    className="rounded-xl border p-3 px-3.5 flex flex-col gap-2"
                                    style={{
                                      borderColor: playComp ? 'rgba(123,106,170,0.3)' : 'rgba(255,255,255,0.05)',
                                      background: playComp ? 'rgba(123,106,170,0.03)' : 'rgba(255,255,255,0.01)'
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#7b6aaa]" />
                                      <span className="font-mono text-[0.65rem] font-bold uppercase text-[#e8edf2] flex-1">Play (PLAY)</span>
                                      <span className="font-mono text-[0.75rem] text-[var(--cf-gold)]" title={MASTERY_LABELS[lang][playMastery]}>
                                        {MASTERY_STARS[playMastery]}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-mono text-[0.55rem] text-white/40">
                                      <span>Reflections: {journals}</span>
                                      <span>{playGate ? 'Gate ✓' : 'Gate 🔒'}</span>
                                    </div>
                                    <button
                                      onClick={() => setActiveTab('submissions')}
                                      className="flex items-center justify-center gap-1.5 w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0d0aa] font-mono text-[0.65rem] cursor-pointer transition-all duration-200 mt-1"
                                    >
                                      <Feather size={12} /> {playComp ? 'View Journal' : 'Write Reflection'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                ) : (
                  /* Trial Mode — show first fret CTA and locked journey preview */
                  <div className="mt-6">
                    <div className="rounded-2xl border border-cf-guitar/20 bg-gradient-to-br from-cf-guitar/[0.06] to-cf-void/80 p-6 pb-5 mb-5 text-center">
                      <div className="text-[2rem] mb-3">🎸</div>
                      <h3 className="font-[Cormorant_Garamond] text-[1.4rem] text-[#f0e6d2] m-0 mb-2">
                        {t('journeyBeginsTitle')}
                      </h3>
                      <p className="font-sans text-[0.85rem] text-white/50 leading-[1.6] m-0 mb-5">
                        {t('journeyBeginsDesc')}
                      </p>
                      <button
                        onClick={() => handleOpenTool(TOOLS_CATALOG.find(t => t.id === 1))}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] bg-cf-guitar/15 border border-cf-guitar/40 text-[#ff8888] cursor-pointer font-mono text-[0.75rem] tracking-[0.1em] uppercase"
                      >
                        <Play size={14} fill="currentColor" />
                        {t('beginFret1')}
                      </button>
                    </div>

                    {/* Locked journey preview — show all 12 as locked */}
                    <div className="opacity-40 pointer-events-none">
                      <h4 className="font-mono text-[0.6rem] text-white/30 tracking-[0.15em] uppercase m-0 mb-3">
                        {t('fullJourney')}
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {QUEST_DATA.slice(0, 6).map((quest) => (
                          <div key={quest.fretId} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-[0.8rem]">🔒</span>
                            <span className="font-mono text-[0.65rem] text-white/35 uppercase">
                              Chapter {quest.fretId} — {quest.quest[lang]}
                            </span>
                          </div>
                        ))}
                        <div className="text-center text-white/20 text-[0.6rem] font-mono py-2">
                          + 6 {t('moreFrets')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="max-w-[800px] mx-auto px-4 pb-10">
                <SongwritingCompanion />
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="max-w-[650px] mx-auto px-4 pb-10 flex flex-col gap-5">
                <VideoRecorder />
                <JournalFeed />
              </div>
            )}

            {activeTab === 'library' && (
              <div className="max-w-[800px] mx-auto px-4 pb-10">
                <VideoLibrary />
              </div>
            )}

            {activeTab === 'character' && (
              <div className="max-w-[800px] mx-auto px-4 pb-10">
                <CharacterSheet />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide Viewer Fullscreen Modal Overlay ── */}
      {activeSlideFretId && (
        <div className="fixed inset-0 z-[1000] bg-[rgba(5,5,8,0.96)] backdrop-blur-[10px] flex flex-col overflow-y-auto">
          <SlideViewer
            fretId={activeSlideFretId}
            onBack={() => {
              setActiveSlideFretId(null);
              refreshTraction();
            }}
            onFretChange={(nextId) => setActiveSlideFretId(nextId)}
          />
        </div>
      )}

      {/* ── Tool Launcher Modal Overlay ── */}
      {activeTool && (
        <div className="fixed inset-0 z-[1000] bg-[rgba(5,5,8,0.96)] backdrop-blur-[10px] flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: PROTOCOL_COLORS[activeTool.protocol]?.border || 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div style={{ color: PROTOCOL_COLORS[activeTool.protocol]?.text }}>
                {React.createElement(ICON_MAP[activeTool.id] || Wind, { size: 20 })}
              </div>
              <div>
                <h3 className="m-0 font-[Cormorant_Garamond] text-[1.25rem] text-[#f0e6d2] font-semibold">{activeTool.name}</h3>
                <p className="m-0 text-[0.6rem] font-mono tracking-[0.08em] uppercase" style={{ color: PROTOCOL_COLORS[activeTool.protocol]?.text }}>
                  Chapter {activeTool.id} · {activeTool.protocol} · {activeTool.phase}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseTool}
              className="bg-white/[0.06] border border-white/[0.1] rounded-lg w-9 h-9 flex items-center justify-center text-[var(--cf-gold)] cursor-pointer transition-all duration-200"
              aria-label="Close Practice Tool"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {(() => {
              switch (activeTool.id) {
                case 1: return traction?.settings?.disableBreathingGates ? <div className="text-center p-8 text-white/40 font-mono text-sm">Breathing exercises disabled in settings.</div> : <BreathingGate fretTitle={activeTool.name} onComplete={handleCloseTool} />;
                case 2: return <PracticeTimer fretId={activeTool.id} />;
                case 3: return <PitchRoom />;
                case 4: return <SongwritingCompanion />;
                case 5: return <IntervalVisualizer />;
                case 6: return <FretboardExplorer compact={false} />;
                case 7: return <PlingTrainer />;
                case 8: return <MicrotonalTracker />;
                case 9: return <FretboardExplorer compact={false} />;
                case 10: return <PracticeRecorder onClose={handleCloseTool} exerciseName="Async Assessor" />;
                case 11: return <MultiKeyHub />;
                case 12: return <RhythmEngine />;
                default: return null;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

