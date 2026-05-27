import React, { useState, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CharacterSheet from './CharacterSheet';
import QuestLog from './QuestLog';
import { JournalFeed } from './JournalEntry';
import VideoRecorder from './VideoRecorder';
import SongwritingCompanion from '../SongwritingCompanion';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// TROUBADOUR'S PLAYBOOK — D&D Player Handbook Shell
// Tabbed layout: Character / Quests / Songbook / Journal
// Replaces the old DigitalBinder tool-launcher approach
// with a narrative-driven, living document.
// ═══════════════════════════════════════════════════════════

const TABS = [
  { id: 'character', icon: '⚔️', en: 'Character', fr: 'Personnage' },
  { id: 'quests',    icon: '🗺️', en: 'Quests',    fr: 'Quêtes' },
  { id: 'songbook',  icon: '✍️', en: 'Songbook',  fr: 'Recueil' },
  { id: 'journal',   icon: '📓', en: 'Journal',   fr: 'Journal' },
];

export default function PlaybookShell({ onOpenSlides, onBack }) {
  const [activeTab, setActiveTab] = useState('character');
  const { locale, t } = useLocale();
  const lang = locale;
  const navigate = useNavigate();
  const backHandler = onBack || (() => navigate('/'));

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
            {t('troubadourPlaybook')}
          </h1>
          <p style={styles.subtitle}>
            {t('heroGuide')}
          </p>
        </div>
        <button style={styles.backBtn} onClick={backHandler} aria-label="Return to home">
          <img
            src="/assets/wordmark.png"
            alt="Voix Vive"
            style={{ height: '32px', width: 'auto' }}
            draggable={false}
          />
        </button>
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
    marginLeft: '52px',
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
