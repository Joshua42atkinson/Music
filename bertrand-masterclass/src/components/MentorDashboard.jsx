import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, User, BookOpen, Send, Sparkles, CheckCircle, 
  RotateCcw, ShieldAlert, Award, FileText, ArrowLeft, Volume2, Globe
} from 'lucide-react';
import PitchTelemetryMap from './PitchTelemetryMap';
import { useLocale } from '../hooks/useLocale';

const DAAS_API_BASE = 'http://localhost:8080/api';

export default function MentorDashboard({ onClose }) {
  const { locale, toggleLocale, t, somatic, isFrench } = useLocale();

  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [activeLLM, setActiveLLM] = useState('Detecting...');
  
  // Editorial drafts
  const [scorecardDraft, setScorecardDraft] = useState('');
  const [feedbackDraft, setFeedbackDraft] = useState('');

  // 1. Fetch submissions from DaaS SQLite
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${DAAS_API_BASE}/mentor/submissions`);
      if (resp.ok) {
        const data = await resp.json();
        setSubmissions(data.submissions || []);
      }
    } catch (e) {
      console.error('Failed to load mentor submissions:', e);
    }
    setLoading(false);
  };

  // 2. Load active LLM backend name
  const loadInferenceStatus = async () => {
    try {
      const resp = await fetch(`${DAAS_API_BASE}/inference/status`);
      if (resp.ok) {
        const data = await resp.json();
        setActiveLLM(data.active_backend?.name || 'Local LLM (Ollama/LM Studio)');
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadSubmissions();
    loadInferenceStatus();
  }, []);

  // 3. Selection handler
  const handleSelectSub = (sub) => {
    setSelectedSub(sub);
    setScorecardDraft(sub.pythagoras_scorecard || '');
    setFeedbackDraft(sub.troubadour_draft || '');
  };

  // 4. Trigger Pythagoras & Troubadour AI preprocessor and LLM evaluator
  const triggerAIEval = async () => {
    if (!selectedSub) return;
    setEvaluating(true);
    try {
      const resp = await fetch(`${DAAS_API_BASE}/mentor/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedSub.id, language: locale }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setSelectedSub(data.submission);
          setScorecardDraft(data.submission.pythagoras_scorecard || '');
          setFeedbackDraft(data.submission.troubadour_draft || '');
          await loadSubmissions();
        }
      }
    } catch (e) {
      console.error('AI evaluation failed:', e);
    }
    setEvaluating(false);
  };

  // 5. Submit Bertrand's final reviewed assessment
  const submitReview = async () => {
    if (!selectedSub) return;
    setLoading(true);
    try {
      const resp = await fetch(`${DAAS_API_BASE}/mentor/submit_review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSub.id,
          pythagoras_scorecard: scorecardDraft,
          troubadour_draft: feedbackDraft,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setSelectedSub(data.submission);
          await loadSubmissions();
        }
      }
    } catch (e) {
      console.error('Failed to submit review:', e);
    }
    setLoading(false);
  };

  // Somatic Stamps
  const injectMacro = (metaphor) => {
    const stamps = {
      pling: isFrench
        ? `\n\n🎸 Métaphore du ${somatic('PLING')} : 'Assurez-vous d'écouter la résonance absolue du PLING—ressentez la note résonner pleinement sans aucune crispation somatique.'`
        : `\n\n🎸 ${somatic('PLING')} Metaphor: 'Ensure you listen for the absolute PLING! resonance—feel the note ring out fully with zero somatic grip.'`,
      shearl: isFrench
        ? `\n\n🕊️ Métaphore du ${somatic('SHEARL')} : 'Appliquez le glissement du CISAILLEMENT ici—laissez vos doigts glisser horizontalement comme une plume, en contournant les frettes sans friction du manche.'`
        : `\n\n🕊️ ${somatic('SHEARL')} Metaphor: 'Apply the SHEARL glide here—let your fingers glide horizontally like a feather, bypassing frets without neck friction.'`,
      fheal: isFrench
        ? `\n\n🕯️ Métaphore de la ${somatic('FHEAL')} : 'Essayez la récupération de la GUÉRISON—relâchez votre épaule gauche, laissez la main respirer et laissez votre mémoire musculaire s'exprimer.'`
        : `\n\n🕯️ ${somatic('FHEAL')} Metaphor: 'Try the FHEAL recovery—drop your left shoulder down, let the hand breathe, and allow your muscle memory to speak.'`
    };
    if (stamps[metaphor]) {
      setFeedbackDraft(prev => prev + stamps[metaphor]);
    }
  };

  return (
    <div className="mentor-dashboard-overlay bg-cf-void w-full min-h-screen text-cf-ink font-inter relative flex flex-col">
      <style>{`
        .mentor-dashboard-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: #050508;
          color: #e8dcc8;
          overflow-y: auto;
        }
        .md-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: calc(100vh - 64px);
          overflow: hidden;
        }
        .md-sidebar {
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
          background: rgba(13, 13, 20, 0.4);
        }
        .md-sub-item {
          transition: all 0.2s;
          cursor: pointer;
        }
        .md-sub-item:hover {
          background: rgba(201,169,110,0.05);
        }
        .md-sub-item.active {
          background: rgba(201,169,110,0.1);
          border-left: 3px solid #c9a96e;
          }
        .md-workspace {
          overflow-y: auto;
          background: #08080c;
        }
        .md-workspace-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          height: 100%;
        }
        .md-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .md-btn-eval {
          background: linear-gradient(135deg, #c9a96e 0%, #e0d0aa 100%);
          color: #0d0d14;
        }
        .md-btn-eval:hover {
          box-shadow: 0 0 20px rgba(201,169,110,0.3);
        }
        .md-badge {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      `}</style>

      {/* Top Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-md font-bold font-mono tracking-wider text-white">{t('mentorTitle')}</h1>
            <p className="text-[10px] text-white/40">Coaching Client: Bertrand Laurence · {t('sovereignLocal')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Bilingual Language Switcher Toggle */}
          <button
            onClick={toggleLocale}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-white/80 transition-all flex items-center gap-1.5"
          >
            <Globe size={12} className="text-cf-gold" />
            {isFrench ? '🇺🇸 English' : '🇫🇷 Français'}
          </button>

          <span className="text-[10px] font-mono text-cf-gold px-2 py-0.5 bg-cf-gold/15 rounded-full border border-cf-gold/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cf-gold animate-pulse" />
            AI Brain: {activeLLM}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="md-grid">
        {/* Left Sidebar: Submissions list */}
        <div className="md-sidebar p-4 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-white/50 px-2 flex items-center gap-2">
            <FolderOpen size={12} /> {isFrench ? 'Sessions Éleves' : 'Student Submissions'}
          </h2>

          <div className="space-y-2">
            {submissions.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-6">{t('noSubmissions')}</p>
            ) : (
              submissions.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => handleSelectSub(sub)}
                  className={`md-sub-item p-4 rounded-xl border border-white/5 ${selectedSub?.id === sub.id ? 'active' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-white truncate max-w-[160px]">{sub.student_name}</h3>
                    <span className={`md-badge px-2 py-0.5 rounded text-[8px] ${
                      sub.status === 'reviewed' ? 'bg-green-500/20 text-green-400' :
                      sub.status === 'drafting' ? 'bg-yellow-500/20 text-yellow-400' :
                                                  'bg-blue-500/20 text-blue-400'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-cf-gold/80 mb-1">{sub.exercise_name}</p>
                  <p className="text-[10px] text-white/40 font-mono">ID: {sub.id.substring(0, 8)}...</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right workspace */}
        <div className="md-workspace p-6">
          <AnimatePresence mode="wait">
            {selectedSub ? (
              <motion.div 
                key={selectedSub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="md-workspace-split">
                  {/* Left Column: Student Video & Pitch Telemetry */}
                  <div className="space-y-6">
                    {/* Video Player */}
                    <div className="md-card rounded-2xl overflow-hidden p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono uppercase text-white/60 flex items-center gap-1.5">
                          <User size={12} className="text-cf-gold" /> {selectedSub.student_name} · {t('studentVideo')}
                        </span>
                        <span className="text-xs text-cf-sage font-mono">{t('exercise')}: {selectedSub.exercise_name}</span>
                      </div>
                      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative">
                        {selectedSub.video_path.startsWith('http') || selectedSub.video_path.startsWith('/') ? (
                          <video src={selectedSub.video_path} controls className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-center p-6 space-y-3">
                            <span className="text-4xl">🎸</span>
                            <p className="text-xs text-white/40 font-mono">{selectedSub.video_path}</p>
                            <p className="text-[10px] text-white/20">Video path registered locally inside SQLite</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preprocess / Evaluate Controls */}
                    <div className="md-card rounded-2xl p-5 border-cf-gold/20" style={{ background: 'rgba(201,169,110,0.03)' }}>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-cf-gold animate-pulse" /> {isFrench ? "Pupitre d'IA Socratique" : "Socratic Preprocessing Desk"}
                          </h4>
                          <p className="text-xs text-white/40">
                            {isFrench 
                              ? "Déclenche FFmpeg, extrait l'analyse acoustique Pythagore et génère des propositions socratiques."
                              : "Spawn FFmpeg and run pitch auto-correlation + Gemma Socratic prompt drafting."
                            }
                          </p>
                        </div>
                        <button
                          onClick={triggerAIEval}
                          disabled={evaluating}
                          className="px-4 py-2.5 rounded-xl md-btn-eval font-bold text-xs font-mono tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          {evaluating ? (isFrench ? '🔄 Traitement...' : '🔄 Preprocessing...') : t('triggerSocratic')}
                        </button>
                      </div>

                      {selectedSub.transcript && (
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <h5 className="text-[10px] font-mono uppercase text-white/50 mb-1">{isFrench ? "Difficulté exprimée par l'élève" : "Student Verbal struggle"}</h5>
                          <p className="text-xs text-white/80 italic">"{selectedSub.transcript}"</p>
                        </div>
                      )}
                    </div>

                    {/* Pitch telemetry map */}
                    <PitchTelemetryMap telemetryData={selectedSub.telemetry_json} />
                  </div>

                  {/* Right Column: AI Scorecard & Bertrand Somatic Feedback Draft */}
                  <div className="space-y-6 flex flex-col h-full">
                    {/* Pythagoras Scorecard Editor */}
                    <div className="md-card rounded-2xl p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                          <Award size={14} className="text-cf-gold" /> {t('diagnosticScorecard')}
                        </h4>
                        <span className="text-[9px] font-mono text-white/30">Markdown supported</span>
                      </div>
                      <textarea
                        value={scorecardDraft}
                        onChange={(e) => setScorecardDraft(e.target.value)}
                        placeholder="Pythagoras Scorecard will draft here. Focuses oncents deviation, note hits, rhythm accuracy..."
                        className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono leading-relaxed resize-none text-[#d8ccb8] focus:border-cf-gold/60 focus:outline-none"
                      />
                    </div>

                    {/* Troubadour Somatic Socratic Message Editor */}
                    <div className="md-card rounded-2xl p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                          <Volume2 size={14} className="text-cf-gold animate-pulse" /> {t('somaticFeedback')}
                        </h4>
                        <span className="text-[9px] font-mono text-white/30">Troubadour draft</span>
                      </div>
                      
                      {/* Metaphor Stamp Bar */}
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        <button 
                          onClick={() => injectMacro('pling')}
                          className="px-2 py-1 rounded bg-[#7aaa88]/15 border border-[#7aaa88]/30 hover:bg-[#7aaa88]/25 text-[#7aaa88] text-[9px] font-mono uppercase transition-all"
                        >
                          + {t('stampPling')}
                        </button>
                        <button 
                          onClick={() => injectMacro('shearl')}
                          className="px-2 py-1 rounded bg-[#5a90a0]/15 border border-[#5a90a0]/30 hover:bg-[#5a90a0]/25 text-[#5a90a0] text-[9px] font-mono uppercase transition-all"
                        >
                          + {t('stampShearl')}
                        </button>
                        <button 
                          onClick={() => injectMacro('fheal')}
                          className="px-2 py-1 rounded bg-[#7b6aaa]/15 border border-[#7b6aaa]/30 hover:bg-[#7b6aaa]/25 text-[#7b6aaa] text-[9px] font-mono uppercase transition-all"
                        >
                          + {t('stampFheal')}
                        </button>
                      </div>

                      <textarea
                        value={feedbackDraft}
                        onChange={(e) => setFeedbackDraft(e.target.value)}
                        placeholder="The Troubadour somatic message will draft here. Bertrand Lawrence somatic Socratic guidelines are pre-loaded..."
                        className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs leading-relaxed resize-none text-[#d8ccb8] focus:border-cf-gold/60 focus:outline-none"
                      />
                    </div>

                    {/* Finalize button */}
                    <button
                      onClick={submitReview}
                      disabled={loading}
                      className="w-full py-4 rounded-xl md-btn-eval font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> {t('saveFinalReview')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/2">
                <span className="text-5xl mb-4">🔮</span>
                <h3 className="text-lg font-bold text-white mb-2">{t('mentorTitle')}</h3>
                <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                  {isFrench 
                    ? "Sélectionnez une vidéo de pratique à gauche pour analyser la justesse, exécuter le diagnostic Socratique local et rédiger un retour d'expérience."
                    : "Select a student's practice video from the left column to extract pitch metrics, run local AI Socratic analysis, and build subscription-free feedback."
                  }
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
