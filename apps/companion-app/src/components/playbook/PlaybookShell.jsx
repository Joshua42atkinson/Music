import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CharacterSheet from './CharacterSheet';
import QuestLog from './QuestLog';
import { JournalFeed } from './JournalEntry';
import VideoRecorder from './VideoRecorder';
import VideoLibrary from './VideoLibrary';
import SongwritingCompanion from '../SongwritingCompanion';
import BEWorkbook from './BEWorkbook';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';
import AuthButton from '../AuthButton';
import { useAuth } from '../../hooks/useAuth';
import { vvGet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PlaybookShell.jsx                                   ║
// ║ WHAT    : Renders the D&D Player Handbook layout for student  ║
// ║           progression, quest logging, and songwriting.        ║
// ║ WHY     : Centralizes meta-learning activities so the student ║
// ║           can reflect, plan, and create outside the fretboard.║
// ║ WHO     : Student — the primary reflective environment.       ║
// ║ OWNS    : Tab state for Character, Quests, Workbook, Songbook ║
// ║           and Journal.                                        ║
// ║ NEEDS   : CharacterSheet, QuestLog, JournalFeed, BEWorkbook   ║
// ║ RULES   : Do not add generic components; maintain the RPG vibe║
// ║           This is a 'Somatic Integration' space, keep it slow.║
// ║ FIX AT  : Route '/playbook' → PlaybookShell.jsx               ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

const TABS = [
  { id: 'character', icon: '📊', en: 'Dashboard', fr: 'Tableau de bord' },
  { id: 'workbook',  icon: '📚', en: 'Curriculum',  fr: 'Programme' },
  { id: 'quests',    icon: '🗺️', en: 'Syllabus',    fr: 'Syllabus' },
  { id: 'library',   icon: '📽️', en: 'Resources',   fr: 'Ressources' },
  { id: 'songbook',  icon: '✍️', en: 'Projects',  fr: 'Projets' },
  { id: 'journal',   icon: '📓', en: 'Submissions',   fr: 'Soumissions' },
];

export default function PlaybookShell({ onOpenSlides, onBack }) {
  const [activeTab, setActiveTab] = useState('character');
  const { locale, toggleLocale } = useLocale();
  const lang = locale;
  const navigate = useNavigate();
  const backHandler = onBack || (() => navigate('/'));
  const { user } = useAuth();
  
  const [reviewedCount, setReviewedCount] = useState(0);

  const studentName = (() => {
    const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    if (googleName) return googleName;
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || 'Adventurer'; }
    catch { return 'Adventurer'; }
  })();

  useEffect(() => {
    const checkSubmissions = async () => {
      try {
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
        console.warn('Failed to poll submissions in PlaybookShell:', e);
      }
    };

    checkSubmissions();
    const interval = setInterval(checkSubmissions, 10000);
    return () => clearInterval(interval);
  }, [studentName]);

  const handleOpenSlides = useCallback((fretId) => {
    onOpenSlides?.(fretId);
  }, [onOpenSlides]);

  return (
    <div className="min-h-screen bg-cf-void flex flex-col text-[#e8edf2] font-body">
      {/* Header */}
      <div className="flex items-center py-3 px-5 gap-3 pt-[max(16px,env(safe-area-inset-top))]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] text-cf-gold tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none py-2 px-0"
          aria-label="Back"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-heading text-[1.3rem] font-semibold text-vv-text m-0">
            Academy Learning Portal
          </h1>
          <p className="font-mono text-[0.55rem] text-cf-gold/40 tracking-[0.15em] uppercase m-0">
            Student Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] text-cf-gold text-base cursor-pointer flex items-center justify-center shrink-0" onClick={toggleLocale} aria-label="Toggle Language">
            {locale === 'en' ? '🇺🇸' : '🇫🇷'}
          </button>
          <AuthButton />
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] text-cf-gold text-base cursor-pointer flex items-center justify-center shrink-0" onClick={backHandler} aria-label="Return to home">
            <img
              src="/assets/wordmark.png"
              alt="Voix Vive"
              className="h-8 w-auto"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/[0.06] px-2 gap-[2px]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex flex-col items-center gap-[3px] py-[10px] px-1 pb-2 bg-transparent border-none border-b-2 cursor-pointer relative transition-all duration-200"
            style={{
              borderBottomColor: activeTab === tab.id ? 'var(--cf-gold)' : 'transparent',
              color: activeTab === tab.id ? 'var(--cf-gold)' : 'rgba(255,255,255,0.35)',
            }}
          >
            {tab.id === 'journal' && reviewedCount > 0 && (
              <span className="absolute top-1 right-[12%] bg-red-500 text-white rounded-full w-[14px] h-[14px] text-[8px] flex items-center justify-center font-bold shadow-[0_0_8px_#ef4444]">
                {reviewedCount}
              </span>
            )}
            <span className="text-base">{tab.icon}</span>
            <span className="font-mono text-[0.55rem] tracking-[0.06em] uppercase">{tab[lang]}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'character' && <CharacterSheet />}
            {activeTab === 'quests' && <QuestLog onOpenSlides={handleOpenSlides} />}
            {activeTab === 'workbook' && <BEWorkbook />}
            {activeTab === 'library' && <VideoLibrary />}
            {activeTab === 'songbook' && <SongwritingCompanion />}
            {activeTab === 'journal' && (
              <div className="flex flex-col gap-5">
                <VideoRecorder />
                <JournalFeed />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
