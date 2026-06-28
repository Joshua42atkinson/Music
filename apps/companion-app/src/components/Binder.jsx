import { devWarn } from '../lib/devLog';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { ArrowLeft } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';
import SlideViewer from './SlideViewer';
import { useCosyVoice } from '../hooks/useCosyVoice';
import { getVoicePrompt } from '../data/voicePrompts';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ── Decomposed Components ──
import WorkbookTab from './workbook/WorkbookTab';
import ToolLauncherModal from './workbook/ToolLauncherModal';

// ── Shared Subcomponents from Playbook ──
import CharacterSheet from './playbook/CharacterSheet';
import { JournalFeed } from './playbook/JournalEntry';
import VideoRecorder from './playbook/VideoRecorder';
import VideoLibrary from './playbook/VideoLibrary';
import SongwritingCompanion from './SongwritingCompanion';

export default function Workbook() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const { refreshTraction } = useScaffolding();
  const cosyvoice = useCosyVoice();

  const [activeTab, setActiveTab] = useState('workbook');
  const [activeTool, setActiveTool] = useState(null);
  const [activeSlideFretId, setActiveSlideFretId] = useState(null);

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
            {t('voixViveSovereignOS', 'Voix Vive Sovereign OS')}
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
              <WorkbookTab 
                handleOpenTool={handleOpenTool} 
                setActiveSlideFretId={setActiveSlideFretId}
                setActiveTab={setActiveTab} 
              />
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
      <ToolLauncherModal 
        activeTool={activeTool} 
        handleCloseTool={handleCloseTool} 
      />
    </div>
  );
}
