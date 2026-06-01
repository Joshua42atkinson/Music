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
  const { locale, t } = useLocale();
  const lang = locale;
  const navigate = useNavigate();
  const backHandler = onBack || (() => navigate('/'));
  const { user } = useAuth();
  
  const [reviewedCount, setReviewedCount] = useState(0);

  const studentName = (() => {
    const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    if (googleName) return googleName;
    try { return localStorage.getItem('active_student_profile') || 'Adventurer'; }
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
    <div style={styles.shell}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '8px 0',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>
            Academy Learning Portal
          </h1>
          <p style={styles.subtitle}>
            Student Management System
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AuthButton />
          <button style={styles.backBtn} onClick={backHandler} aria-label="Return to home">
            <img
              src="/assets/wordmark.png"
              alt="Voix Vive"
              style={{ height: '32px', width: 'auto' }}
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === tab.id ? '#c9a96e' : 'transparent',
              color: activeTab === tab.id ? '#c9a96e' : 'rgba(255,255,255,0.35)',
            }}
          >
            {tab.id === 'journal' && reviewedCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '12%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                fontSize: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 0 8px #ef4444'
              }}>
                {reviewedCount}
              </span>
            )}
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab[lang]}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.content}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

const styles = {
  shell: {
    minHeight: '100vh',
    background: '#050508',
    display: 'flex',
    flexDirection: 'column',
    color: '#e8edf2',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px 12px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    gap: '12px',
  },
  backBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#c9a96e',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: 0,
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    color: 'rgba(201,169,110,0.4)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 8px',
    gap: '2px',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '10px 4px 8px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  tabIcon: { fontSize: '1rem' },
  tabLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '40px',
  },
};
