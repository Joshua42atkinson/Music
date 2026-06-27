import React, { useState, useEffect } from 'react';
import {
  BookOpen, CheckCircle, UploadCloud, Clock, Send, Video, Lock, Sparkles
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import PracticeRecorder from './PracticeRecorder';
import { TOOLS_CATALOG, FRET_INLAY_POSITIONS } from '../data/toolsData';
import RhythmEngine from '../features/audio-engine/RhythmEngine';
import FretboardExplorer from '../features/vr-fretboard/FretboardExplorer';
import PlingTrainer from './PlingTrainer';
import PitchRoom from '../features/audio-engine/PitchRoom';
import BreathingGate from './BreathingGate';
import SongwritingCompanion from './SongwritingCompanion';
import PracticeTimer from './PracticeTimer';
import IntervalVisualizer from './IntervalVisualizer';
import MicrotonalTracker from './MicrotonalTracker';
import MultiKeyHub from './MultiKeyHub';
import VertiscaleEngine from '../game/VertiscaleEngine';
import NeckMenu from './NeckMenu';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useLocale } from '../hooks/useLocale';
import { useScaffolding } from './ScaffoldingProvider';
import { vvGet, vvSetJSON } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

/* ── Protocol colour map ── */
const PROTOCOL_COLORS = {
  'SHEARL': { border: 'rgba(90,144,160,0.45)',  bg: 'rgba(90,144,160,0.08)',  text: '#5a90a0', label: '©SHEARL' },
  'PLING!': { border: 'rgba(122,170,136,0.45)', bg: 'rgba(122,170,136,0.08)', text: '#7aaa88', label: '©PLING!' },
  'FHEAL':  { border: 'rgba(123,106,170,0.45)', bg: 'rgba(123,106,170,0.08)', text: '#7b6aaa', label: '©FHEAL'  },
};

/* ── Single tool card ── */
const FretToolCard = ({ tool, onClick }) => {
  const { t } = useLocale();
  const isAvailable = tool.status === 'available';
  const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
  const hasInlay = FRET_INLAY_POSITIONS.has(tool.id);

  return (
    <motion.div
      whileHover={isAvailable ? { y: -3, scale: 1.02 } : {}}
      whileTap={isAvailable ? { scale: 0.97 } : {}}
      onClick={isAvailable ? onClick : undefined}
      className="relative flex flex-col rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: isAvailable
          ? `linear-gradient(145deg, ${colors.bg}, rgba(3,3,6,0.6))`
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isAvailable ? colors.border : 'rgba(255,255,255,0.06)'}`,
        cursor: isAvailable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.55,
        boxShadow: isAvailable ? `0 4px 24px ${colors.bg}` : 'none',
      }}
    >
      {/* Top row: fret badge + inlay dot */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span
          className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded"
          style={{
            color: isAvailable ? colors.text : 'rgba(255,255,255,0.2)',
            background: isAvailable ? colors.bg : 'transparent',
            border: `1px solid ${isAvailable ? colors.border : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {t('fret')} {tool.id}
        </span>
        {hasInlay && (
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isAvailable ? colors.text : 'rgba(255,255,255,0.12)',
              boxShadow: isAvailable ? `0 0 6px ${colors.text}` : 'none',
            }}
          />
        )}
      </div>

      {/* Icon */}
      <div className="flex justify-center py-3">
        <div
          className="p-3 rounded-full"
          style={{
            background: isAvailable ? colors.bg : 'rgba(255,255,255,0.04)',
            color: isAvailable ? colors.text : 'rgba(255,255,255,0.2)',
          }}
        >
          {isAvailable ? tool.icon : <Lock size={18} />}
        </div>
      </div>

      {/* Name + phase */}
      <div className="px-3 pb-3 text-center">
        <h4
          className="text-sm font-bold leading-tight mb-1"
          style={{ color: isAvailable ? '#e8edf2' : 'rgba(255,255,255,0.25)' }}
        >
          {tool.shortName}
        </h4>
        <p
          className="text-[9px] leading-tight"
          style={{ color: isAvailable ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.15)' }}
        >
          {tool.chromatic} · {tool.phase}
        </p>
      </div>

      {/* Protocol stripe at bottom */}
      <div
        className="h-0.5 w-full"
        style={{
          background: isAvailable
            ? `linear-gradient(90deg, transparent, ${colors.text}, transparent)`
            : 'transparent',
        }}
      />

      {/* Coming soon badge */}
      {!isAvailable && (
        <div
          className="absolute top-2 right-2 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded text-white/20 border border-white/[0.08]"
        >
          {t('soon')}
        </div>
      )}
    </motion.div>
  );
};

/* ── Protocol legend ── */
const ProtocolLegend = () => (
  <div className="flex gap-2 justify-center flex-wrap pb-2">
    {Object.entries(PROTOCOL_COLORS).map(([key, val]) => (
      <div
        key={key}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase"
        style={{ background: val.bg, border: `1px solid ${val.border}`, color: val.text }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: val.text, boxShadow: `0 0 4px ${val.text}` }} />
        {val.label}
      </div>
    ))}
  </div>
);

/* ── Guitar neck nut bar ── */
const NeckNut = () => {
  const { t } = useLocale();
  return (
  <div className="relative mb-1 mx-2">
    <div
      className="h-2 rounded-sm w-full bg-[linear-gradient(180deg,rgba(var(--cf-gold-rgb),0.5),rgba(var(--cf-gold-rgb),0.2))] shadow-[0_2px_8px_rgba(var(--cf-gold-rgb),0.15)]"
    />
    <p className="text-[9px] font-mono tracking-widest text-center mt-1 text-cf-gold/40">
      {t('the12Tools')}
    </p>
  </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const DigitalBinder = () => {
  const { locale, t } = useLocale();
  const { traction } = useScaffolding();
  const [activeToolId, setActiveToolId] = useState(null);
  
  const {
    isDaaSConnected,
    activeBackend,
    availableBackends,
    loading,
    switchBackend,
    detectBackends,
    getLogs,
  } = useBackendBridge();

  const [habits, setHabits] = useState(() => {
    const saved = vvGet(STORAGE_KEYS.HABITS);
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: {
          en: 'Checked Shoulder Posture',
          fr: 'Vérifié la Posture des Épaules'
        }, 
        completed: false 
      },
      { 
        id: 2, 
        name: {
          en: 'Tuned Guitar',
          fr: 'Accordé la Guitare'
        }, 
        completed: false 
      },
      { 
        id: 3, 
        name: {
          en: 'Reviewed CAGED Maps',
          fr: 'Revu les Cartographies CAGED'
        }, 
        completed: false 
      },
    ];
  });

  const [showRecorder, setShowRecorder] = useState(false);
  const [submissions, setSubmissions] = useState(() =>
    JSON.parse(vvGet(STORAGE_KEYS.SUBMISSIONS) || '[]')
  );

  // Sync SQLite logs if DaaS is active
  useEffect(() => {
    if (isDaaSConnected) {
      getLogs().then(sqLogs => {
        if (sqLogs && sqLogs.length > 0) {
          const formattedSqLogs = sqLogs.map(log => ({
            id: log.id,
            exerciseName: log.notes || 'Somatic Exercise',
            mediaType: log.recording_path ? 'video' : 'audio',
            duration: Math.round(log.score) || 45,
            timestamp: log.timestamp,
            status: 'reviewed',
          }));
          setSubmissions(prev => {
            const merged = [...formattedSqLogs, ...prev];
            const unique = [];
            const seen = new Set();
            for (const item of merged) {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                unique.push(item);
              }
            }
            return unique;
          });
        }
      });
    }
  }, [isDaaSConnected, getLogs]);

  useEffect(() => {
    vvSetJSON(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  const toggleHabit = (id) =>
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));

  const resetDaily = () => {
    if (!window.confirm('Reset your daily practice checklist? This will uncheck all items.')) return;
    setHabits(habits.map(h => ({ ...h, completed: false })));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // activeTool is defined in renderToolContent instead

  // Tools that open the ambient widget instead of a full-screen overlay
  const WIDGET_TOOLS = {
    // Previously Metronome (Fret 4) opened as a widget — now Truebadour's Quill renders inline
  };

  const localize = (val) => {
    if (!val) return '';
    if (typeof val === 'object') return val[locale] || val['en'] || '';
    return val;
  };

  const mappedTools = TOOLS_CATALOG.map(tool => ({
    id: tool.id,
    fret: tool.id,
    title: tool.name,
    subtitle: tool.desc,
    symbol: tool.icon,
    color: PROTOCOL_COLORS[tool.protocol]?.text || 'var(--cf-gold)',
    act: tool.phase
  }));

  const handleToolClick = (toolId) => {
    if (WIDGET_TOOLS[toolId]) {
      window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: WIDGET_TOOLS[toolId] } }));
    } else {
      setActiveToolId(prev => prev === toolId ? null : toolId);
    }
  };

  const renderToolContent = (item) => {
    const activeTool = TOOLS_CATALOG.find(t => t.id === item.id);
    if (!activeTool) return null;
    
    const wiredIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const colors = PROTOCOL_COLORS[activeTool.protocol] || PROTOCOL_COLORS['SHEARL'];

    return (
      <div className="p-4 bg-[#030306] min-h-[300px]">
        {item.id === 1  && (traction?.settings?.disableBreathingGates ? <div className="text-center p-8 text-white/40 font-mono text-sm">Breathing exercises disabled in settings.</div> : <BreathingGate />)}
        {item.id === 2  && <PracticeTimer />}
        {item.id === 3  && <PitchRoom />}
        {item.id === 4  && <SongwritingCompanion />}
        {item.id === 5  && <IntervalVisualizer />}
        {item.id === 6  && <FretboardExplorer compact={false} />}
        {item.id === 7  && <PlingTrainer />}
        {item.id === 8  && <MicrotonalTracker />}
        {item.id === 9  && <FretboardExplorer compact={false} />}
        {item.id === 10 && <PracticeRecorder onClose={() => setActiveToolId(null)} exerciseName="Async Assessor" />}
        {item.id === 11 && <MultiKeyHub />}
        {item.id === 12 && <RhythmEngine />}

        {!wiredIds.includes(item.id) && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 text-center px-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
            >
              <div style={{ color: colors.text }}>{activeTool.icon}</div>
            </div>
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: colors.text }}>
                {t('fret')} {activeTool.id} · {t('comingSoon')}
              </p>
              <h3 className="text-2xl font-cormorant font-bold text-white mb-3">{activeTool.name}</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">{activeTool.telemetry}</p>
            </div>
            <div
              className="px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase"
              style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
            >
              {activeTool.chromatic} · {activeTool.monomyth}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <NeckMenu
      items={mappedTools}
      activeId={activeToolId}
      onItemClick={handleToolClick}
      renderContent={renderToolContent}
      headerTitle={t('truebadoursWorkshop')}
      headerSubtitle={t('practiceToolsSubtitle')}
      showBackButton={true}
    >
      {/* ── PRACTICE LOG ── */}
      <div className="max-w-[640px] mx-auto w-full pt-10">
        
        {/* DaaS Server Panel */}
        <div className="border border-cf-border/60 rounded-2xl p-5 mb-6 backdrop-blur-md relative overflow-hidden bg-[rgba(13,13,20,0.65)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDaaSConnected ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
              <h3 className="text-sm font-mono tracking-wider uppercase text-white/80">
                {t('desktopService')}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cf-gold px-2 py-0.5 bg-cf-gold/10 rounded-full border border-cf-gold/20">
              {isDaaSConnected ? t('sovereignLocal') : t('offlinePreview')}
            </span>
          </div>
          
          {isDaaSConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase">
                    {t('activeLocalAiBrain')}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {activeBackend && typeof activeBackend === 'object' ? activeBackend.name : (activeBackend || 'Detecting...')}
                  </p>
                </div>
                <button 
                  onClick={detectBackends}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-cf-gold/20 hover:bg-cf-gold/30 text-cf-gold border border-cf-gold/30 text-xs font-mono tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? t('probing') : t('redetect')}
                </button>
              </div>

              {availableBackends.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {availableBackends.map(b => (
                    <button
                      key={b.name}
                      disabled={loading || b.active}
                      onClick={() => switchBackend(b.name)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                        b.active 
                          ? 'bg-cf-gold text-cf-deep border-cf-gold font-bold' 
                          : b.healthy 
                            ? 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            : 'bg-white/2 opacity-30 text-white/40 border-transparent cursor-not-allowed'
                      }`}
                    >
                      {b.name} {b.healthy ? '•' : 'x'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-white/40 leading-relaxed">
              {t('desktopAppPreviewText')}
            </p>
          )}
        </div>
        
        <AnimatePresence>
          {showRecorder && (
            <PracticeRecorder onClose={() => setShowRecorder(false)} exerciseName="PLING! Protocol — Minor 3rd" />
          )}
        </AnimatePresence>

        <div className="space-y-6 text-white font-inter">

          {/* Active Assignment */}
          <div>
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-lg font-bold">{t('activeAssignments')}</h2>
              <span className="text-xs text-cf-sage">{t('oneDue')}</span>
            </div>
            <div className="bg-cf-deep border border-cf-border rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <UploadCloud size={80} />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-2 py-1 rounded bg-cf-sage/20 text-cf-sage text-[10px] font-mono tracking-widest mb-3 uppercase">
                  {t('dueThursday')}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t('recordPling')}
                </h3>
                <p className="text-sm text-cf-whisper mb-6">
                  {t('recordPlingDesc')}
                </p>
                <button
                  onClick={() => setShowRecorder(true)}
                  className="w-full py-3 rounded-xl bg-cf-sage text-cf-deep font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  <Video size={18} /> {t('recordAndSubmit')}
                </button>
              </div>
            </div>
          </div>

          {/* Submissions */}
          {submissions.length > 0 && (
            <div>
              <h2 className="text-sm font-mono tracking-widest text-white/40 uppercase mb-4 px-2">
                {t('mySubmissions')}
              </h2>
              <div className="space-y-2">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      sub.status === 'reviewed' ? 'bg-green-500/20' :
                      sub.status === 'sent' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {sub.status === 'reviewed' ? <CheckCircle size={16} className="text-green-400" /> :
                       sub.status === 'sent'     ? <Send size={16} className="text-blue-400" /> :
                                                   <Clock size={16} className="text-yellow-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{sub.exerciseName}</h4>
                      <p className="text-xs text-white/50">
                        {sub.mediaType === 'video' ? '📹' : '🎙️'} {formatTime(sub.duration)} ·{' '}
                        {new Date(sub.timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
                      sub.status === 'reviewed' ? 'bg-green-500/20 text-green-400' :
                      sub.status === 'sent'     ? 'bg-blue-500/20 text-blue-400' :
                                                  'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {sub.status === 'reviewed' ? t('reviewed') : sub.status === 'sent' ? t('sent') : t('queued')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Practice Checklist */}
          <div>
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-lg font-bold">{t('prePracticeRitual')}</h2>
              <button onClick={resetDaily} className="text-xs text-cf-gold hover:underline">
                {t('resetDaily')}
              </button>
            </div>
            <div className="space-y-2">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    habit.completed
                      ? 'bg-green-500/10 border-green-500/20 opacity-70'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                    habit.completed ? 'bg-green-500 border-green-500 text-[#030306]' : 'border-white/20'
                  }`}>
                    {habit.completed && <CheckCircle size={16} />}
                  </div>
                  <span className={`text-sm ${habit.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                    {localize(habit.name)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bertrand's Feedback */}
          <div>
            <h2 className="text-sm font-mono tracking-widest text-white/40 uppercase mb-4 px-2">
              {t('bertrandsFeedback')}
            </h2>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-cf-gold/30 flex-shrink-0">
                  <img src="/assets/bertrand_profile.jpg" alt="Bertrand" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{t('cagedSubmission')}</h4>
                  <p className="text-xs text-white/50">{t('feedbackDate')}</p>
                </div>
              </div>
              <p className="text-sm text-cf-ink-bright italic border-l-2 border-cf-gold/50 pl-3">
                {t('feedbackQuote')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </NeckMenu>
  );
};

export default DigitalBinder;
