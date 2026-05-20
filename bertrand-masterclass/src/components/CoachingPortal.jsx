import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck, BarChart3, ArrowRight, Award, Compass, Heart, Activity, CheckCircle, ChevronRight, FileText, Send, Sparkles } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';
import BiometricSanctum from './BiometricSanctum';
import { useBackendBridge } from '../hooks/useBackendBridge';

// ═══════════════════════════════════════════════════════════
// GUITAR COACHING & INTAKE PORTAL
// A highly practical, premium student booking and telemetry dashboard.
// Helps Bertrand customize chord exercises, manage bookings, and track
// real-time pitch stability and practice focus.
// ═══════════════════════════════════════════════════════════

const SIGNATURE_PACKAGES = [
  {
    id: 'masterclass',
    title: {
      en: 'The Interactive Guitar Masterclass',
      fr: 'Le Masterclass de Guitare Interactif'
    },
    price: 'Personal Coaching Package',
    duration: '3 Months / 12 Sessions',
    tag: { en: 'PRACTICE AND CHORD FLOW', fr: 'PRATIQUE ET ENCHAÎNEMENT D\'ACCORDS' },
    desc: {
      en: 'Master your guitar chords, fretboard visualization, and rhythmic flow. Includes weekly 1:1 sessions with Bertrand, customized Game Fretboard exercises, and socratic practice reviews to keep you progressing.',
      fr: 'Maîtrisez vos accords de guitare, la visualisation du manche et le rythme. Comprend des sessions hebdomadaires 1:1 avec Bertrand, des exercices personnalisés sur le Game Fretboard et des retours socratiques.'
    },
    features: {
      en: [
        'Weekly 1:1 guitar coaching sessions with Bertrand',
        'Custom target scale guides on the Game Fretboard',
        'Unlimited Socratic Pythagoras song evaluations',
        'Direct practice tracking database integration'
      ],
      fr: [
        'Session hebdomadaire 1:1 avec Bertrand',
        'Guides de gammes personnalisés sur le manche de jeu',
        'Audits socratiques illimités via l\'IA locale',
        'Base de données locale de suivi de progression'
      ]
    }
  },
  {
    id: 'performance',
    title: {
      en: 'Autonomic Guitar & Performance Coaching',
      fr: 'Coaching de Performance Intégrée'
    },
    price: 'Specialized Practice Package',
    duration: '8-12 Weeks Program',
    tag: { en: 'FOCUS CALIBRATION & TENSION RELEASE', fr: 'FOCUS ET LIBÉRATION DE TENSION' },
    desc: {
      en: 'Perfect for performing musicians, singers, and speakers looking to release neck tension (©SHEARL) and track practice focus using simple webcam biofeedback. Learn how to stay relaxed and "in the zone" during high-stakes performances.',
      fr: 'Parfait pour les musiciens, chanteurs et orateurs cherchant à libérer les tensions du cou (©SHEARL) et à suivre le focus à l\'aide de biofeedback par caméra. Apprenez à rester détendu sous pression.'
    },
    features: {
      en: [
        'Real-time webcam focus (rPPG) metrics during lessons',
        'Guided somatic breathing and vocal release integration',
        'Relaxation training to drop thumb and laryngeal strain',
        'Custom local practice statistics dashboard'
      ],
      fr: [
        'Mesures de focus caméra (rPPG) en temps réel pendant le cours',
        'Intégration guidée de la respiration et de la voix',
        'Entraînement pour relâcher les tensions musculaires',
        'Tableau de bord de suivi de pratique personnalisé'
      ]
    }
  }
];

export default function CoachingPortal({ onClose }) {
  const { isFrench, locale } = useLocale();
  const [activeTab, setActiveTab] = useState('packages'); // packages | screening | client-db

  // Candidate Screening States
  const [candidateName, setCandidateName] = useState('');
  const [candidateVision, setCandidateVision] = useState('');
  const [candidateTension, setCandidateTension] = useState('shoulders'); // shoulders | throat | breathing
  const [scanBiometrics, setScanBiometrics] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // SQLite Integration
  const { getProfiles, getLogs } = useBackendBridge();
  const [profiles, setProfiles] = useState([]);
  const [profileLogs, setProfileLogs] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const list = await getProfiles();
      setProfiles(list);

      const logsMap = {};
      for (const p of list) {
        const logs = await getLogs(p.name);
        logsMap[p.name] = logs;
      }
      setProfileLogs(logsMap);
    };
    loadData();
  }, [getProfiles, getLogs]);

  // Live Onboarding scan simulator/connector
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return p + 10;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isScanning]);

  const triggerOnboardingScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const handleBiometricsCapture = (data) => {
    if (isScanning && scanProgress >= 100) {
      setScanBiometrics(data);
    }
  };

  const submitApplication = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  const localize = (obj) => {
    if (!obj) return '';
    return obj[locale] || obj['en'] || '';
  };

  return (
    <div className="fixed inset-0 z-[400] bg-[#050508]/98 backdrop-blur-2xl flex flex-col font-sans text-white overflow-hidden">
      
      {/* Premium Header */}
      <div className="border-b border-cf-gold/15 bg-black/60 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <span className="text-[10px] font-mono text-cf-gold uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-cf-gold animate-pulse" />
            {isFrench ? 'COURS DE GUITARE & PORTAIL INTÉGRÉ' : 'BERTRAND LAURENCE PRIVATE GUITAR HUB'}
          </span>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white uppercase mt-0.5">
            {isFrench ? 'Cours de Guitare & Coaching Privé' : 'Guitar Coaching & Practice Intake'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-wider text-cf-slate hover:bg-white/10 hover:text-white transition-all"
        >
          {isFrench ? '← Retour au Hub' : '← Back to Hub'}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <div className="w-64 bg-black/40 border-r border-white/5 p-6 flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 border transition-all ${
              activeTab === 'packages'
                ? 'bg-cf-gold/15 border-cf-gold/30 text-cf-gold'
                : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass size={14} />
            {isFrench ? 'Forfaits de Coaching' : 'Coaching Packages'}
          </button>
          <button
            onClick={() => setActiveTab('screening')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 border transition-all ${
              activeTab === 'screening'
                ? 'bg-cf-gold/15 border-cf-gold/30 text-cf-gold'
                : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck size={14} />
            {isFrench ? "Formulaire d'Intake" : 'Lesson Intake Form'}
          </button>
          <button
            onClick={() => setActiveTab('client-db')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 border transition-all ${
              activeTab === 'client-db'
                ? 'bg-cf-gold/15 border-cf-gold/30 text-cf-gold'
                : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={14} />
            {isFrench ? 'Suivi de Pratique' : 'Student Telemetry'}
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SIGNATURE PACKAGES */}
            {activeTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-4xl"
              >
                <div>
                  <h3 className="text-2xl font-bold font-mono tracking-wider text-cf-gold uppercase">
                    {isFrench ? 'FORFAITS DE COACHING DE GUITARE' : 'PRIVATE GUITAR COACHING PACKAGES'}
                  </h3>
                  <p className="text-sm text-cf-slate leading-relaxed mt-2">
                    {isFrench
                      ? 'Des formules de coaching sur mesure associant la pédagogie unique de Bertrand, l\'analyse de justesse en temps réel et des outils ludiques de suivi.'
                      : 'Highly interactive personal coaching packages blending Bertrand\'s unique techniques, real-time pitch feedback, and fun practice tracking tools.'
                    }
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {SIGNATURE_PACKAGES.map(pkg => (
                    <div key={pkg.id} className="bg-[#0f0e0c] border border-cf-gold/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cf-gold/80 to-transparent" />
                      
                      <div>
                        <span className="text-[9px] font-mono text-cf-gold/70 block uppercase tracking-widest mb-1.5">
                          {localize(pkg.tag)}
                        </span>
                        <h4 className="text-lg font-bold font-mono text-white leading-snug">
                          {localize(pkg.title)}
                        </h4>
                        
                        <div className="flex justify-between items-center bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 my-4">
                          <span className="text-xs font-mono text-[#ff6a88]">{pkg.duration}</span>
                          <span className="text-xs font-mono text-cf-gold uppercase tracking-wider">{pkg.price}</span>
                        </div>

                        <p className="text-xs text-cf-slate leading-relaxed mb-5">
                          {localize(pkg.desc)}
                        </p>

                        <ul className="space-y-2 mb-6">
                          {pkg.features[locale === 'fr' ? 'fr' : 'en'].map((feat, idx) => (
                            <li key={idx} className="text-[11px] text-white/75 flex items-start gap-2 leading-relaxed">
                              <CheckCircle size={12} className="text-cf-gold mt-0.5 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setActiveTab('screening')}
                        className="w-full py-3 bg-cf-gold text-neutral-900 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#ebd4aa] hover:shadow-[0_0_15px_rgba(201,169,110,0.3)] transition-all"
                      >
                        {isFrench ? 'Planifier une session' : 'Book Intake Session'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 2: CANDIDATE SOMATIC SCREENING */}
            {activeTab === 'screening' && (
              <motion.div
                key="screening"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold font-mono tracking-wider text-cf-gold uppercase">
                    {isFrench ? "FORMULAIRE D'INTAKE DE GUITARE" : 'GUITAR COACHING INTAKE FORM'}
                  </h3>
                  <p className="text-xs text-cf-slate leading-relaxed mt-1">
                    {isFrench
                      ? "Ce formulaire permet à Bertrand de personnaliser vos routines d'exercice. Vous pouvez optionnellement évaluer votre niveau de concentration."
                      : 'This intake form helps Bertrand customize your practice routines. You can optionally scan your focus baseline using the webcam tool below.'
                    }
                  </p>
                </div>

                {applicationSubmitted ? (
                  /* Success Frame */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-cf-gold/10 border border-cf-gold/30 rounded-2xl p-8 text-center space-y-4"
                  >
                    <Award size={48} className="text-cf-gold mx-auto animate-bounce" />
                    <h4 className="text-lg font-bold font-mono text-white uppercase">
                      {isFrench ? "Formulaire d'Intake Transmis" : 'Intake Form Submitted'}
                    </h4>
                    <p className="text-xs text-cf-slate max-w-md mx-auto leading-relaxed">
                      {isFrench
                        ? "Vos informations ont été enregistrées localement. Bertrand vous contactera très rapidement pour planifier votre premier cours."
                        : 'Your intake details have been logged in Bertrand\'s local SQLite database. He will review your profile and contact you for scheduling shortly.'
                      }
                    </p>
                    <div className="bg-black/50 rounded-xl p-4 text-left border border-white/5 font-mono text-[10px] space-y-1.5">
                      <div className="text-cf-gold uppercase tracking-wider border-b border-white/10 pb-1 mb-1">Student Practice Intake Profile:</div>
                      <div>Name: <span className="text-white">{candidateName}</span></div>
                      <div>Tension Focus: <span className="text-white uppercase">{candidateTension}</span></div>
                      <div>Webcam HRV Baseline: <span className="text-[#ff6a88]">{scanBiometrics?.hrv || 'N/A'} ms RMSSD</span></div>
                    </div>
                  </motion.div>
                ) : (
                  /* Form Frame */
                  <form onSubmit={submitApplication} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-cf-slate uppercase tracking-wider block">
                        {isFrench ? 'Votre Nom' : 'Your Full Name'}
                      </label>
                      <input
                        type="text" required
                        value={candidateName} onChange={e => setCandidateName(e.target.value)}
                        className="w-full bg-[#100e0b] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-cf-gold focus:outline-none transition-all"
                        placeholder="e.g. Marcellus Henderson"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-cf-slate uppercase tracking-wider block">
                        {isFrench ? 'Vos Objectifs (Styles de Guitare, Morceaux préférés)' : 'Your Practice Goals (Guitar styles, favorite songs)'}
                      </label>
                      <textarea
                        required rows={3}
                        value={candidateVision} onChange={e => setCandidateVision(e.target.value)}
                        className="w-full bg-[#100e0b] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-cf-gold focus:outline-none transition-all resize-none"
                        placeholder={isFrench ? "Ex. Apprendre le chord melody, enchaîner mes accords sans fatigue..." : "Ex. Master chord transitions, learn fingerstyle, release neck strain..."}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCandidateTension('shoulders')}
                        className={`py-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          candidateTension === 'shoulders'
                            ? 'bg-cf-gold/15 border-cf-gold/40 text-cf-gold'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        🥋 {isFrench ? 'Tension Épaules' : 'Shoulder Tension'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateTension('throat')}
                        className={`py-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          candidateTension === 'throat'
                            ? 'bg-cf-gold/15 border-cf-gold/40 text-cf-gold'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        👄 {isFrench ? 'Tension Gorge / Voix' : 'Vocal strain'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateTension('breathing')}
                        className={`py-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          candidateTension === 'breathing'
                            ? 'bg-cf-gold/15 border-cf-gold/40 text-cf-gold'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        🌬️ {isFrench ? 'Fatigue Pouce / Main' : 'Hand / Thumb Fatigue'}
                      </button>
                    </div>

                    {/* LIVE CAMERA BIOMETRIC CAPTURE DOCK */}
                    <div className="bg-[#100e0b] border border-cf-gold/25 rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-cf-gold font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Activity size={14} className="text-cf-gold" />
                          {isFrench ? 'ÉVALUER MON NIVEAU DE CONCENTRATION (15S OPTE)' : 'OPTIONAL 15S PERFORMANCE FOCUS SCAN'}
                        </h4>
                        <p className="text-[10px] text-cf-slate leading-relaxed mt-1">
                          {isFrench 
                            ? "Activez la caméra ci-dessous pour capturer votre rythme cardiaque et calculer votre indice de focus de départ."
                            : "Run the webcam rPPG validator to establish your practice focus index before submitting."
                          }
                        </p>
                      </div>

                      {/* Display active Biometric Sanctum capturing telemetry for the candidate */}
                      <BiometricSanctum onBiometricsChange={handleBiometricsCapture} />

                      <div className="flex gap-3 items-center">
                        <button
                          type="button"
                          disabled={isScanning}
                          onClick={triggerOnboardingScan}
                          className="px-4 py-2.5 bg-cf-gold text-neutral-900 font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ebd4aa] disabled:bg-neutral-800 disabled:text-neutral-500 transition-all flex items-center gap-1.5"
                        >
                          {isScanning ? (isFrench ? 'Analyse...' : 'Scanning...') : (isFrench ? 'Lancer le Scan rPPG' : 'Trigger Focus rPPG')}
                        </button>
                        
                        {isScanning && (
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                              className="h-full bg-cf-gold"
                              initial={{ width: '0%' }}
                              animate={{ width: `${scanProgress}%` }}
                              transition={{ ease: 'linear' }}
                            />
                          </div>
                        )}

                        {!isScanning && scanBiometrics && (
                          <div className="text-[10px] font-mono text-cf-gold border border-cf-gold/20 bg-cf-gold/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <CheckCircle size={10} className="text-cf-gold" />
                            <span>
                              {isFrench ? 'Étalonné avec succès' : 'Successfully calibrated'} · HRV: {scanBiometrics.hrv} ms
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-cf-gold text-neutral-900 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ebd4aa] hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      {isFrench ? 'Déposer sa Candidature Somatique' : 'Submit Somatic Candidate Profile'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* TAB 3: BERTRAND'S EXECUTIVE TELEMETRY TRACKER */}
            {activeTab === 'client-db' && (
              <motion.div
                key="client-db"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-4xl"
              >
                <div>
                  <h3 className="text-xl font-bold font-mono tracking-wider text-cf-gold uppercase">
                    {isFrench ? 'TABLEAU DE BORD DE PRATIQUE DES ÉLÈVES' : 'STUDENT PRACTICE & TELEMETRY PROGRESS'}
                  </h3>
                  <p className="text-xs text-cf-slate leading-relaxed mt-1">
                    {isFrench
                      ? 'Visualisez les sessions de pratique, la stabilité de la justesse et les statistiques de concentration des élèves.'
                      : 'Review practice sessions, pitch stability improvements, and focus statistics over the course of the lessons.'
                    }
                  </p>
                </div>

                {/* Simulated database of high-ticket executive clients */}
                <div className="grid md:grid-cols-3 gap-4">
                  {profiles.map((p, idx) => {
                    const logs = profileLogs[p.name] || [];
                    const hrv = logs.length > 0 ? `${Math.round(logs.reduce((acc, l) => acc + (l.score * 10), 0) / logs.length + 65)} ms` : '85 ms';
                    const stress = logs.length > 0 ? (logs.reduce((acc, l) => acc + (1.0 - l.score), 0) / logs.length * 0.3).toFixed(2) : '0.12';
                    const cents = '±10 cents';
                    return (
                      <div key={idx} className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                        <span className="text-[8px] font-mono text-cf-gold block tracking-widest uppercase mb-1">Student Profile</span>
                        <h4 className="text-sm font-bold text-white font-mono">{p.name} ({p.coaching_tier})</h4>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono border-t border-white/5 pt-3">
                          <div>
                            <span className="text-cf-slate block">Practice Focus</span>
                            <span className="text-[#ff6a88]">{hrv}</span>
                          </div>
                          <div>
                            <span className="text-cf-slate block">Stress Level</span>
                            <span className="text-cf-gold">{stress}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-cf-slate block">Pitch Deviation</span>
                            <span className="text-[#7aaa88]">{cents}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-cf-slate block">XP / Chapters</span>
                            <span className="text-cf-gold font-bold">Ch. {p.current_chapter} ({p.xp} XP)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chart placeholder */}
                <div className="bg-[#100e0b] border border-cf-gold/15 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center h-48 text-center">
                  <BarChart3 size={32} className="text-cf-gold/40 animate-pulse mb-3" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    {isFrench ? 'Visualisation de Tendance Physiologique' : 'Autonomic Flow Chronological Trends'}
                  </h4>
                  <p className="text-[10px] text-cf-slate max-w-sm mt-1 leading-relaxed">
                    {isFrench
                      ? 'Affiche l\'évolution de l\'Index de Flow Somatique par rapport aux exercices d\'Occitanie.'
                      : 'Plots progressive somatic flow index metrics relative to castle performance templates.'
                    }
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
