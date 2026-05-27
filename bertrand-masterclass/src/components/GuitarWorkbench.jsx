// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : GuitarWorkbench.jsx                                  ║
// ║ WHAT    : Guided practice hub — ONE suggestion, AI-guided    ║
// ║ WHY     : 12 tools is too many choices. Students need ONE    ║
// ║           invitation based on where they are in curriculum.   ║
// ║ RULES   : Tools are CALLED, not chosen (design doc §2)        ║
// ║           AI Troubadour is the primary interface               ║
// ║           Somatic check-in always available before practice     ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { db } from '../data/localDatabase';
import { TOOLS_CATALOG } from '../data/toolsData';
import {
  getPracticeContext, getInvitation,
  CHAPTER_TOOL_MAP,
} from '../data/workbenchData';
import {
  Wind, Timer, Music, Feather, Grid3x3, BookOpen, Mic, Activity, Zap,
  Video, Layers, Play, X, Sparkles, ChevronDown, ChevronUp,
  HelpCircle, Heart, Brain, Ear, Compass,
} from 'lucide-react';

// ── Tool components ──
import BreathingGate from './BreathingGate';
import PracticeTimer from './PracticeTimer';
import PitchRoom from './PitchRoom';
import SongwritingCompanion from './SongwritingCompanion';
import IntervalVisualizer from './IntervalVisualizer';
import FretboardExplorer from './FretboardExplorer';
import PlingTrainer from './PlingTrainer';
import MicrotonalTracker from './MicrotonalTracker';
import MultiKeyHub from './MultiKeyHub';
import RhythmEngine from './RhythmEngine';
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
  if (!tool) return null;
  const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
  const Icon = ICON_MAP[tool.id] || Wind;

  const renderTool = () => {
    switch (tool.id) {
      case 1: return <BreathingGate />;
      case 2: return <PracticeTimer />;
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,5,8,0.92)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon size={20} style={{ color: colors.text }} />
          <div>
            <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0e6d2' }}>{tool.name}</h3>
            <p style={{ margin: 0, fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: colors.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Fret {tool.id} · {tool.protocol} · {tool.phase}
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>{renderTool()}</div>
    </div>
  );
}

// ── Suggested Practice Card ──
function SuggestedPractice({ suggestion, onOpenTool, lang }) {
  if (!suggestion?.tool) return null;
  const tool = suggestion.tool;
  const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
  const Icon = ICON_MAP[tool.id] || Wind;
  const invitation = getInvitation(suggestion.fretId || tool.id, lang);

  return (
    <div style={{
      ...styles.suggestionCard,
      borderColor: colors.border,
      background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(5,5,8,0.5) 100%)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ ...styles.suggestionIcon, background: colors.bg, borderColor: colors.border, color: colors.text }}>
          <Icon size={24} />
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.text }}>
            {suggestion.type === 'somatic' ? 'Somatic Check-in' : `Fret ${suggestion.fretId || tool.id} · ${tool.protocol}`}
          </p>
          <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#f0e6d2', fontWeight: 600 }}>
            {tool.name}
          </h3>
        </div>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: '0.88rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
        "{invitation || tool.telemetry}"
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => onOpenTool(tool)}
          style={{ ...styles.primaryBtn, background: colors.bg, borderColor: colors.border, color: colors.text }}
        >
          <Play size={16} /> Begin Session
        </button>
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
  const lang = locale;
  const { bardLevel, practiceMinutes, streak } = useScaffolding();
  const [activeTool, setActiveTool] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [showAllTools, setShowAllTools] = useState(false);
  const [showQuill, setShowQuill] = useState(false);
  const [practiceCtx] = useState(() => getPracticeContext());

  // Load journal
  useEffect(() => {
    const load = async () => {
      try {
        const entries = await db.journal.orderBy('timestamp').reverse().limit(5).toArray();
        setJournalEntries(entries);
      } catch (e) { console.warn('[Workbench] No journal:', e); }
    };
    load();
  }, []);

  const handleOpenTool = useCallback((tool) => {
    setActiveTool(tool);
    // Track last practiced fret
    try {
      localStorage.setItem('voixvive_last_tool_fret', String(tool.id));
    } catch (e) { /* ignore */ }
  }, []);

  const handleHelpClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: 'music', focusChat: true } }));
  }, []);

  const studentName = (() => {
    try { return localStorage.getItem('active_student_profile') || t('adventurer') || 'Student'; }
    catch { return 'Student'; }
  })();

  const getBardTitle = (level) => {
    const titles = {
      en: ['Wandering Bard', 'Apprentice Troubadour', 'Journeyman Minstrel', 'Skilled Rhapsode', 'Master Voix'],
      fr: ['Barde Errant', 'Troubadour Apprenti', 'Ménestrel Compagnon', 'Rhapsode Habile', 'Maître Voix'],
    };
    const idx = Math.min(level - 1, (titles[lang] || titles.en).length - 1);
    return (titles[lang] || titles.en)[idx];
  };

  const completedFrets = practiceCtx?.fretsCompleted || [];
  const suggestion = practiceCtx?.suggestion;
  const stats = practiceCtx?.stats || {};

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerCenter}>
          <p style={styles.headerLabel}>Guitar Workbench</p>
          <p style={styles.headerSub}>Your practice companion</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleHelpClick} style={styles.helpBtn} aria-label="Ask the Troubadour">
            <HelpCircle size={20} style={{ color: '#c9a96e' }} />
          </button>
          <button onClick={() => navigate('/')} style={styles.backBtn} aria-label="Home">
            <img src="/assets/wordmark.png" alt="Voix Vive" style={{ height: 28 }} draggable={false} />
          </button>
        </div>
      </div>

      {/* ── Character Bar ── */}
      <div style={styles.characterBar}>
        <div style={styles.statBox}>
          <span style={styles.statValue}>{studentName}</span>
          <span style={styles.statLabel}>Lv.{bardLevel} {getBardTitle(bardLevel)}</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statBox}>
          <span style={styles.statValue}>{streak || 0}</span>
          <span style={styles.statLabel}>day streak</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statBox}>
          <span style={styles.statValue}>{practiceMinutes || 0}</span>
          <span style={styles.statLabel}>minutes</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statBox}>
          <span style={styles.statValue}>{completedFrets.length}/12</span>
          <span style={styles.statLabel}>frets</span>
        </div>
      </div>

      {/* ── SUGGESTED PRACTICE (Hero) ── */}
      <div style={{ padding: '0 16px', maxWidth: 640, margin: '0 auto' }}>
        {suggestion && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '20px 0 10px' }}>
              <Compass size={14} style={{ color: '#c9a96e' }} />
              <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)' }}>
                {suggestion.type === 'somatic' ? 'Suggested first' : 'Your next step'}
              </span>
            </div>
            <SuggestedPractice suggestion={suggestion} onOpenTool={handleOpenTool} lang={lang} />
          </>
        )}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ padding: '16px 16px 0', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleHelpClick} style={styles.quickActionBtn}>
            <Sparkles size={14} /> Ask the Troubadour
          </button>
          <button onClick={() => setShowQuill(true)} style={{ ...styles.quickActionBtn, opacity: 0.7 }}>
            <Feather size={14} /> Troubadour's Quill
          </button>
          <button onClick={() => navigate('/song')} style={{ ...styles.quickActionBtn, opacity: 0.7 }}>
            <BookOpen size={14} /> Return to /song
          </button>
        </div>
      </div>

      {/* ── YOUR JOURNEY ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Journey</h2>
        <div style={styles.journeyRow}>
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
                style={{
                  ...styles.journeyDot,
                  background: isDone ? 'rgba(201,169,110,0.25)' : hasJournal ? 'rgba(122,170,136,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: isCurrent ? '#c9a96e' : isDone ? 'rgba(201,169,110,0.4)' : hasJournal ? 'rgba(122,170,136,0.3)' : 'rgba(255,255,255,0.08)',
                  boxShadow: isCurrent ? '0 0 12px rgba(201,169,110,0.2)' : 'none',
                  cursor: 'pointer',
                }}
                title={`Fret ${fretId}: ${tool?.name || ''}`}
              >
                <span style={{ fontSize: '0.55rem', color: isCurrent ? '#c9a96e' : isDone ? '#c9a96e' : hasJournal ? '#7aaa88' : 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", fontWeight: isCurrent ? 700 : 400 }}>
                  {fretId}
                </span>
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
          Gold ring = current · Gold = completed · Green = journal · Gray = waiting
        </p>
      </div>

      {/* ── CHARACTER STATS ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Sensations</h2>
        <p style={styles.sectionSubtitle}>The body is the instrument that plays the instrument.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
          {[
            { key: 'breath', label: 'Breath', value: stats.breath || 1 },
            { key: 'pitch', label: 'Pitch', value: stats.pitch || 1 },
            { key: 'memory', label: 'Memory', value: stats.memory || 1 },
          ].map(stat => {
            const StatIcon = STAT_ICONS[stat.key] || Compass;
            const pct = (stat.value / 20) * 100;
            return (
              <div key={stat.key} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <StatIcon size={14} style={{ color: 'rgba(201,169,110,0.5)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>{stat.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f0e6d2', fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>/20</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, rgba(201,169,110,0.4), rgba(201,169,110,0.7))', borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALL TOOLS (Collapsible) ── */}
      <div style={styles.section}>
        <button onClick={() => setShowAllTools(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px 0' }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, margin: 0, display: 'inline' }}>All 12 Tools</h2>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              {showAllTools ? 'click to hide' : 'click to browse'}
            </span>
          </div>
          {showAllTools ? <ChevronUp size={16} style={{ color: 'rgba(255,255,255,0.3)' }} /> : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />}
        </button>

        {showAllTools && (
          <div style={styles.toolGrid}>
            {TOOLS_CATALOG.map(tool => {
              const colors = PROTOCOL_COLORS[tool.protocol] || PROTOCOL_COLORS['SHEARL'];
              const Icon = ICON_MAP[tool.id] || Wind;
              const isDone = completedFrets.includes(tool.id);
              const isSuggested = suggestion?.toolId === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => handleOpenTool(tool)}
                  style={{
                    ...styles.toolCard,
                    background: isSuggested ? `linear-gradient(135deg, ${colors.bg}, rgba(201,169,110,0.05))` : colors.bg,
                    borderColor: isSuggested ? '#c9a96e' : colors.border,
                    opacity: isDone ? 0.7 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ ...styles.toolFretBadge, color: colors.text, borderColor: colors.border }}>
                      Fret {tool.id}
                    </span>
                    {isSuggested && <span style={{ fontSize: '0.55rem', color: '#c9a96e', fontFamily: "'JetBrains Mono', monospace" }}>SUGGESTED</span>}
                    {isDone && !isSuggested && <span style={{ fontSize: '0.6rem', color: 'rgba(122,170,136,0.6)' }}>✓</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ ...styles.toolIconWrap, background: colors.bg, color: colors.text, borderColor: colors.border }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 600, color: '#e8dcc8', lineHeight: 1.2 }}>{tool.shortName}</h3>
                      <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>{tool.desc}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, textAlign: 'left' }}>
                    {tool.telemetry}
                  </p>
                  <div style={{ ...styles.toolProtocolStripe, background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)` }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RECENT REFLECTIONS ── */}
      {journalEntries.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Reflections</h2>
          <div style={styles.reflectionsList}>
            {journalEntries.map((entry, i) => (
              <div key={entry.id || i} style={styles.reflectionCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '1rem' }}>
                    {entry.mood === 'calm' ? '😌' : entry.mood === 'excited' ? '✨' : entry.mood === 'frustrated' ? '😤' : entry.mood === 'peaceful' ? '🕊️' : entry.mood === 'tense' ? '😬' : '😐'}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                    Fret {entry.fretId} · {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.45 }}>
                  {entry.text?.slice(0, 140)}{entry.text?.length > 140 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOOL MODAL ── */}
      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}

      {/* ── Troubadour's Quill Overlay ── */}
      {showQuill && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(12px)', overflowY: 'auto' }}>
          <button onClick={() => setShowQuill(false)} style={{ position: 'sticky', top: '12px', float: 'right', zIndex: 601, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', margin: '12px 16px' }}>
            <X size={18} />
          </button>
          <SongwritingCompanion />
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100svh',
    background: '#050508',
    color: '#e8dcc8',
    fontFamily: "'Inter', sans-serif",
    paddingBottom: 60,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  helpBtn: {
    background: 'rgba(201,169,110,0.12)',
    border: '1px solid rgba(201,169,110,0.35)',
    borderRadius: 10,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  headerCenter: {
    textAlign: 'left',
    flex: 1,
  },
  headerLabel: {
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(201,169,110,0.5)',
  },
  headerSub: {
    margin: '4px 0 0',
    fontFamily: "'EB Garamond', serif",
    fontStyle: 'italic',
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.4)',
  },
  characterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 14px',
    minWidth: 60,
  },
  statValue: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f0e6d2',
    fontFamily: "'Cormorant Garamond', serif",
  },
  statLabel: {
    fontSize: '0.5rem',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 22,
    background: 'rgba(255,255,255,0.08)',
  },
  suggestionCard: {
    borderRadius: 16,
    border: '1px solid',
    padding: '20px 22px',
    marginBottom: 8,
    textAlign: 'left',
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    flexShrink: 0,
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 10,
    border: '1px solid',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s',
  },
  quickActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  section: {
    padding: '20px 16px 0',
    maxWidth: 640,
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: '0 0 4px',
  },
  sectionSubtitle: {
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.3)',
    margin: '0 0 12px',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
  },
  journeyRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
    padding: '10px 0',
  },
  journeyDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    transition: 'all 0.3s',
    background: 'none',
  },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 10,
    marginTop: 12,
  },
  toolCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 14,
    borderRadius: 12,
    border: '1px solid',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'none',
  },
  toolFretBadge: {
    fontSize: '0.55rem',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid',
  },
  toolIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    flexShrink: 0,
  },
  toolProtocolStripe: {
    height: 1,
    marginTop: 'auto',
    paddingTop: 10,
  },
  reflectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 10,
  },
  reflectionCard: {
    padding: 12,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
};
