import React, { useState, useCallback, useEffect } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { vvGetJSON, vvSetJSON } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import BEWorkbookHeader from './BEWorkbookHeader';
import PracticeJournal from './PracticeJournal';
import PracticeGarden from './PracticeGarden';
import BEWorkbookProgressTab from './BEWorkbookProgressTab';
import BEWorkbookScheduleTab from './BEWorkbookScheduleTab';
import BEWorkbookOverallProgress from './BEWorkbookOverallProgress';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : BEWorkbook.jsx                                       ║
// ║ WHAT    : Mechanical BE→DO→PLAY workbook for all 144 nodes   ║
// ║ WHY     : No AI required. Student manually checks off phases.  ║
// ║ PATTERN : Based on CharacterSheet badge grid + stat blocks     ║
// ╚════════════════════════════════════════════════════════════════╝

export default function BEWorkbook() {
  const {
    currentNodeId,
    currentFret,
    completedNodes,
    nextRecommended,
    completePhase,
    advanceNode,
    traction,
    updateTraction,
    globalMode,
  } = useScaffolding();

  const { locale } = useLocale();
  const lang = locale === 'fr' ? 'fr' : 'en';

  const [selectedFret, setSelectedFret] = useState(currentFret || 1);
  const [activeTab, setActiveTab] = useState('schedule'); // 'progress' | 'journal' | 'schedule'
  const [activePrompt, setActivePrompt] = useState(null); // { nodeId, phase }
  const [activeWindDown, setActiveWindDown] = useState(false);
  const [practiceLog, setPracticeLog] = useState(() => vvGetJSON(STORAGE_KEYS.PRACTICE_LOG, []));

  // Persist practice log
  useEffect(() => {
    vvSetJSON(STORAGE_KEYS.PRACTICE_LOG, practiceLog);
  }, [practiceLog]);

  const handleLogAndComplete = useCallback((nodeId, phase) => {
    completePhase?.(nodeId, phase);
    const entry = { date: new Date().toISOString(), activity: `${phase.toUpperCase()} Reflection`, xp: 15, attribute: 'Harmonia' };
    setPracticeLog(prev => [entry, ...prev]);
    updateTraction(prev => ({ ...prev, xp: (prev.xp || 0) + 15 }));
  }, [completePhase, setPracticeLog, updateTraction]);

  return (
    <div className="p-5 max-w-[800px] mx-auto text-[#e8edf2] font-sans">
      <BEWorkbookHeader
        selectedFret={selectedFret}
        onSelectFret={setSelectedFret}
        completedNodes={completedNodes}
        traction={traction}
      />

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'progress', label: 'Progress', icon: '📊' },
          { key: 'journal', label: 'Practice Journal', icon: '📓' },
          { key: 'schedule', label: 'Today', icon: '☀️' },
          { key: 'garden', label: 'Garden', icon: '🌱' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'flex items-center gap-2 py-2 px-4 rounded-lg border text-sm font-mono cursor-pointer transition-all duration-200',
              activeTab === tab.key
                ? 'bg-cf-gold/15 border-cf-gold/40 text-cf-gold'
                : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06]',
            ].join(' ')}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'progress' && (
        <BEWorkbookProgressTab
          selectedFret={selectedFret}
          completedNodes={completedNodes}
          currentNodeId={currentNodeId}
          nextRecommended={nextRecommended}
          traction={traction}
          globalMode={globalMode}
          lang={lang}
          activePrompt={activePrompt}
          setActivePrompt={setActivePrompt}
          onPhaseComplete={completePhase}
          onNodeComplete={advanceNode}
          onLogAndComplete={handleLogAndComplete}
        />
      )}

      {activeTab === 'journal' && (
        <PracticeJournal
          traction={traction}
          nextRecommended={nextRecommended}
          completedNodes={completedNodes}
        />
      )}

      {activeTab === 'schedule' && (
        <BEWorkbookScheduleTab
          selectedFret={selectedFret}
          currentNodeId={currentNodeId}
          practiceLog={practiceLog}
          setPracticeLog={setPracticeLog}
          activeWindDown={activeWindDown}
          setActiveWindDown={setActiveWindDown}
          completePhase={completePhase}
          updateTraction={updateTraction}
        />
      )}

      {activeTab === 'garden' && (
        <PracticeGarden />
      )}

      <BEWorkbookOverallProgress traction={traction} />
    </div>
  );
}

