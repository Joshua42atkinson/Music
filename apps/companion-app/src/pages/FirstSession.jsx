import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mic, MicOff, Globe, Guitar, Check, Volume2, Sparkles, SkipForward } from 'lucide-react';
import { vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { useLocale } from '../hooks/useLocale';
import { loadTraction, saveTraction } from '../data/tractionStore';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import usePitchDetector from '../hooks/usePitchDetector';

// ── Standard guitar tuning (MIDI note numbers) ──
const TUNING_TARGETS = [
  { midi: 40, label: 'E', name: 'E2' },
  { midi: 45, label: 'A', name: 'A2' },
  { midi: 50, label: 'D', name: 'D3' },
  { midi: 55, label: 'G', name: 'G3' },
  { midi: 59, label: 'B', name: 'B3' },
  { midi: 64, label: 'E', name: 'E4' },
];

const CENTS_TOLERANCE = 25;
const MIN_STRINGS_TUNED = 2;

// Any C note (MIDI 36, 48, 60, 72)
const C_MIDI_NOTES = [36, 48, 60, 72];

const STRINGS = {
  en: {
    welcome: 'Voix Vive',
    subtitle: 'The Living Voice',
    promise: 'In the next 5 minutes, you\u2019ll tune your guitar and play your first note.',
    begin: 'Let\u2019s Begin',
    tuneTitle: 'Tune Your Guitar',
    tuneBody: 'Play any string, one at a time. We\u2019ll listen and tell you if it\u2019s in tune.',
    enableMic: 'Enable Microphone',
    micError: 'Please allow microphone access to tune your guitar.',
    tunedStrings: (n) => `${n} of ${TUNING_TARGETS.length} strings checked`,
    tuneContinue: (n) => n >= MIN_STRINGS_TUNED ? 'Good enough \u2014 Let\u2019s continue' : `Play ${MIN_STRINGS_TUNED - n} more string${MIN_STRINGS_TUNED - n === 1 ? '' : 's'} to continue`,
    skipTuning: 'Skip tuning',
    listenTitle: 'Hear the Foundation',
    listenBody: 'Western music is built on 3 notes: the 1, the 3, and the 5. Together, they form a chord \u2014 the supporting beams of harmony.',
    playAudio: 'Play Bertrand\u2019s Explanation',
    listenContinue: 'I hear it. Let me try.',
    playTitle: 'Play Your First Note',
    playBody: 'Play a C note on your guitar.',
    playHint: '3rd fret on the A string, or 8th fret on the low E string',
    listening: 'Listening\u2026',
    detected: (note) => `Detected: ${note}`,
    celebration: 'You played C \u2014 the root. The \u20181\u2019. This is home base.',
    playContinue: 'I did it!',
    reflectTitle: 'You Did It',
    reflectBody: 'You just played your first note. The 1-3-5 is the foundation of Western music. Every song you\u2019ve ever heard is built on this. Welcome to the journey.',
    enterAcademy: 'Enter the Academy',
    skip: 'Skip',
  },
  fr: {
    welcome: 'Voix Vive',
    subtitle: 'La Voix Vivante',
    promise: 'Dans les 5 prochaines minutes, vous accorderez votre guitare et jouerez votre premi\u00e8re note.',
    begin: 'Commen\u00e7ons',
    tuneTitle: 'Accordez Votre Guitare',
    tuneBody: 'Jouez n\u2019importe quelle corde, une \u00e0 la fois. Nous \u00e9couterons et vous dirons si elle est accord\u00e9e.',
    enableMic: 'Activer le Micro',
    micError: 'Veuillez autoriser l\u2019acc\u00e8s au microphone pour accorder votre guitare.',
    tunedStrings: (n) => `${n} sur ${TUNING_TARGETS.length} cordes v\u00e9rifi\u00e9es`,
    tuneContinue: (n) => n >= MIN_STRINGS_TUNED ? 'C\u2019est bien \u2014 Continuons' : `Jouez ${MIN_STRINGS_TUNED - n} autre${MIN_STRINGS_TUNED - n === 1 ? '' : 's'} corde${MIN_STRINGS_TUNED - n === 1 ? '' : 's'} pour continuer`,
    skipTuning: 'Passer l\u2019accord',
    listenTitle: '\u00c9coutez la Fondation',
    listenBody: 'La musique occidentale est construite sur 3 notes: la 1, la 3, et la 5. Ensemble, elles forment un accord \u2014 les poutres ma\u00eetresses de l\u2019harmonie.',
    playAudio: '\u00c9couter l\u2019explication de Bertrand',
    listenContinue: 'J\u2019entends. Laissez-moi essayer.',
    playTitle: 'Jouez Votre Premi\u00e8re Note',
    playBody: 'Jouez un Do (C) sur votre guitare.',
    playHint: '3\u00e8me case sur la corde de La, ou 8\u00e8me case sur la corde de Mi grave',
    listening: '\u00c9coute\u2026',
    detected: (note) => `D\u00e9tect\u00e9: ${note}`,
    celebration: 'Vous avez jou\u00e9 Do \u2014 la fondamentale. Le \u00ab\u00a01\u00a0\u00bb. C\u2019est la base.',
    playContinue: 'J\u2019ai r\u00e9ussi!',
    reflectTitle: 'Vous Avez R\u00e9ussi',
    reflectBody: 'Vous venez de jouer votre premi\u00e8re note. Le 1-3-5 est le fondement de la musique occidentale. Chaque chanson que vous avez entendue est construite l\u00e0-dessus. Bienvenue dans le voyage.',
    enterAcademy: 'Entrer dans l\u2019Acad\u00e9mie',
    skip: 'Passer',
  },
};

function Dots({ total, current }) {
  return (
    <div className="flex gap-1.5 justify-center mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background: i === current ? 'var(--cf-gold)' : 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
    </div>
  );
}

function CentsMeter({ cents }) {
  const clamped = Math.max(-50, Math.min(50, cents));
  const pct = (clamped + 50) / 100 * 100;
  const inTune = Math.abs(cents) <= CENTS_TOLERANCE;
  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
        <div
          className="absolute top-0 bottom-0 rounded-full transition-all duration-150"
          style={{
            left: inTune ? '37.5%' : `${Math.min(pct, 50)}%`,
            width: inTune ? '25%' : '4px',
            background: inTune ? '#2ecc71' : cents < 0 ? '#e74c3c' : '#f39c12',
          }}
        />
      </div>
      <div className="flex justify-between mt-1 font-mono text-[9px] text-white/30">
        <span>flat</span>
        <span style={{ color: inTune ? '#2ecc71' : 'rgba(255,255,255,0.4)' }}>
          {inTune ? 'in tune' : `${cents > 0 ? '+' : ''}${cents}\u00a2`}
        </span>
        <span>sharp</span>
      </div>
    </div>
  );
}

export default function FirstSession() {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();
  const T = useMemo(() => STRINGS[locale] || STRINGS.en, [locale]);
  const [step, setStep] = useState(0);
  const [tunedStrings, setTunedStrings] = useState(() => new Set());
  const [noteDetected, setNoteDetected] = useState(false);
  const audioRef = useRef(null);

  const { isListening, noteInfo, startListening, stopListening, error } = usePitchDetector();

  const chapter1 = C_SCALE_CHAPTERS[0];
  const totalSteps = 5;
  const isLast = step === totalSteps - 1;

  // ── Track tuned strings during Step 1 ──
  useEffect(() => {
    if (step !== 1 || !isListening || !noteInfo || noteInfo.name === '--') return;
    const match = TUNING_TARGETS.find(t => t.midi === noteInfo.midi);
    if (match && Math.abs(noteInfo.cents) <= CENTS_TOLERANCE) {
      setTunedStrings(prev => {
        const next = new Set(prev);
        next.add(match.midi);
        return next;
      });
    }
  }, [step, isListening, noteInfo]);

  // ── Detect C note during Step 3 ──
  useEffect(() => {
    if (step !== 3 || !isListening || !noteInfo || noteInfo.name === '--') return;
    if (C_MIDI_NOTES.includes(noteInfo.midi) && Math.abs(noteInfo.cents) <= CENTS_TOLERANCE) {
      if (!noteDetected) {
        setNoteDetected(true);
      }
    }
  }, [step, isListening, noteInfo, noteDetected]);

  // ── Auto-start mic when entering tune or play step ──
  useEffect(() => {
    if ((step === 1 || step === 3) && !isListening) {
      startListening();
    }
    if (step !== 1 && step !== 3 && isListening) {
      stopListening();
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup mic on unmount ──
  useEffect(() => {
    return () => {
      if (isListening) stopListening();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    vvSet(STORAGE_KEYS.ONBOARDED, '1');
    vvSet(STORAGE_KEYS.LOCALE, locale);
    vvSet(STORAGE_KEYS.STARTING_FRET, '1');

    const tr = loadTraction();
    tr.onboardingComplete = true;
    tr.journeyStartDate = new Date().toISOString();
    tr.settings.sandboxMode = false;
    tr.currentPillar = 'BE';
    tr.currentNodeId = 'fret-1-class-be';
    if (!tr.fretsUnlocked.includes(1)) {
      tr.fretsUnlocked = [1, ...tr.fretsUnlocked];
    }
    saveTraction(tr);

    navigate('/c-scale');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    setStep(s => s + 1);
  };

  const skipAll = () => {
    finish();
  };

  const tunedCount = tunedStrings.size;

  return (
    <div className="min-h-[100svh] flex items-center justify-center p-4 bg-[#050508] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(232,204,146,0.06), transparent 60%)',
        }}
      />

      {/* Language toggle — top right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all font-mono text-[10px] uppercase tracking-widest"
        >
          <Globe size={12} />
          {locale === 'en' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* Skip — top left */}
      <button
        onClick={skipAll}
        className="absolute top-4 left-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-transparent border-none text-white/20 hover:text-white/40 transition-colors font-mono text-[10px] uppercase tracking-widest"
      >
        <SkipForward size={12} />
        {T.skip}
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[480px] z-10"
        >
          {/* ── STEP 0: Welcome ── */}
          {step === 0 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-[56px] mb-4"
              >
                <span className="inline-block" style={{ animation: 'loadBreath 3s ease-in-out infinite' }}>
                  <Guitar size={56} className="text-cf-gold mx-auto" />
                </span>
              </motion.div>
              <h1 className="font-heading text-[2.8rem] font-normal text-vv-text m-0 mb-1">
                {T.welcome}
              </h1>
              <p className="font-mono text-[11px] text-cf-gold tracking-[0.15em] uppercase m-0 mb-8">
                {T.subtitle}
              </p>
              <div className="bg-cf-gold/[0.05] border border-cf-gold/15 rounded-xl p-5 mb-8">
                <p className="m-0 text-[1.05rem] leading-[1.6] text-white/75">
                  {T.promise}
                </p>
              </div>
              <button
                onClick={next}
                className="w-full py-4 rounded-xl cursor-pointer text-cf-gold font-mono text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all duration-200 min-h-[48px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.25) 0%, rgba(var(--cf-gold-rgb),0.1) 100%)',
                  border: '1px solid rgba(var(--cf-gold-rgb),0.5)',
                }}
              >
                {T.begin} <ChevronRight size={16} />
              </button>
              <style>{`
                @keyframes loadBreath {
                  0%, 100% { opacity: 0.6; transform: scale(0.95); }
                  50% { opacity: 1; transform: scale(1.05); }
                }
              `}</style>
            </div>
          )}

          {/* ── STEP 1: Tune ── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-[36px] mb-3">🎸</div>
                <h2 className="font-heading text-[1.8rem] text-vv-text m-0 mb-2">{T.tuneTitle}</h2>
                <p className="m-0 text-[0.9rem] text-white/60 leading-[1.5] px-4">
                  {T.tuneBody}
                </p>
              </div>

              {/* Mic status */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[0.8rem] text-center">
                  {T.micError}
                </div>
              )}

              {/* Tuning indicators */}
              <div className="grid grid-cols-6 gap-2 mb-6">
                {TUNING_TARGETS.map((target) => {
                  const isTuned = tunedStrings.has(target.midi);
                  const isCurrent = isListening && noteInfo?.midi === target.midi;
                  return (
                    <div
                      key={target.midi}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all duration-200"
                      style={{
                        background: isTuned ? 'rgba(46,204,113,0.12)' : isCurrent ? 'rgba(232,204,146,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isTuned ? 'rgba(46,204,113,0.4)' : isCurrent ? 'rgba(232,204,146,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <span
                        className="font-heading text-[1.2rem]"
                        style={{ color: isTuned ? '#2ecc71' : isCurrent ? 'var(--cf-gold)' : 'rgba(255,255,255,0.3)' }}
                      >
                        {target.label}
                      </span>
                      {isTuned ? (
                        <Check size={14} className="text-[#2ecc71]" />
                      ) : (
                        <span className="font-mono text-[8px] text-white/20">{target.name}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live note display */}
              {isListening && noteInfo?.name && noteInfo.name !== '--' && (
                <div className="text-center mb-4">
                  <div className="font-mono text-[0.75rem] text-white/40 uppercase tracking-widest mb-1">
                    {T.detected(`${noteInfo.name}${noteInfo.octave}`)}
                  </div>
                  <CentsMeter cents={noteInfo.cents} />
                </div>
              )}

              {/* Mic toggle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => isListening ? stopListening() : startListening()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-200"
                  style={{
                    background: isListening ? 'rgba(46,204,113,0.12)' : 'rgba(255,255,255,0.04)',
                    borderColor: isListening ? 'rgba(46,204,113,0.4)' : 'rgba(255,255,255,0.1)',
                    color: isListening ? '#2ecc71' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest">
                    {isListening ? 'Listening' : T.enableMic}
                  </span>
                </button>
              </div>

              <p className="text-center font-mono text-[10px] text-white/30 mb-4">
                {T.tunedStrings(tunedCount)}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all font-mono text-[0.7rem] uppercase tracking-widest"
                >
                  {T.skipTuning}
                </button>
                <button
                  onClick={next}
                  disabled={tunedCount < MIN_STRINGS_TUNED}
                  className="flex-1 py-3 rounded-xl font-mono text-[0.7rem] uppercase tracking-widest transition-all duration-200 min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: tunedCount >= MIN_STRINGS_TUNED
                      ? 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.25) 0%, rgba(var(--cf-gold-rgb),0.1) 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${tunedCount >= MIN_STRINGS_TUNED ? 'rgba(var(--cf-gold-rgb),0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: tunedCount >= MIN_STRINGS_TUNED ? 'var(--cf-gold)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {T.tuneContinue(tunedCount)}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Listen ── */}
          {step === 2 && (
            <div className="text-center">
              <div className="text-[36px] mb-3">🎵</div>
              <h2 className="font-heading text-[1.8rem] text-vv-text m-0 mb-4">{T.listenTitle}</h2>

              {/* Triad visualization */}
              <div className="flex justify-center gap-3 mb-6">
                {[
                  { num: '1', note: 'C', color: '#3498db' },
                  { num: '3', note: 'E', color: '#f1c40f' },
                  { num: '5', note: 'G', color: '#e74c3c' },
                ].map((n, i) => (
                  <motion.div
                    key={n.num}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 200 }}
                    className="flex flex-col items-center gap-1 w-20 py-4 rounded-xl"
                    style={{
                      background: `${n.color}15`,
                      border: `1px solid ${n.color}40`,
                    }}
                  >
                    <span className="font-heading text-[1.8rem]" style={{ color: n.color }}>{n.num}</span>
                    <span className="font-mono text-[10px] text-white/40 uppercase">{n.note}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-cf-gold/[0.05] border border-cf-gold/15 rounded-xl p-5 mb-6 text-left">
                <p className="m-0 text-[0.95rem] leading-[1.6] text-white/75">
                  {T.listenBody}
                </p>
              </div>

              {/* Audio player */}
              {chapter1.bePhase?.audioSnippet && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        if (audioRef.current.paused) {
                          audioRef.current.play();
                        } else {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        }
                      }
                    }}
                    className="flex items-center gap-3 mx-auto px-5 py-3 rounded-xl border border-cf-gold/30 bg-cf-gold/[0.08] hover:bg-cf-gold/[0.15] transition-all"
                  >
                    <Volume2 size={20} className="text-cf-gold" />
                    <span className="font-mono text-[0.75rem] text-cf-gold uppercase tracking-widest">
                      {T.playAudio}
                    </span>
                  </button>
                  <audio ref={audioRef} src={chapter1.bePhase.audioSnippet} className="hidden" />
                </div>
              )}

              <button
                onClick={next}
                className="w-full py-4 rounded-xl cursor-pointer text-cf-gold font-mono text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all duration-200 min-h-[48px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.25) 0%, rgba(var(--cf-gold-rgb),0.1) 100%)',
                  border: '1px solid rgba(var(--cf-gold-rgb),0.5)',
                }}
              >
                {T.listenContinue} <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 3: Play ── */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-[36px] mb-3">🎶</div>
              <h2 className="font-heading text-[1.8rem] text-vv-text m-0 mb-2">{T.playTitle}</h2>
              <p className="m-0 text-[0.95rem] text-white/70 mb-2">{T.playBody}</p>
              <p className="m-0 font-mono text-[10px] text-white/30 mb-6">{T.playHint}</p>

              {/* Mic status */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[0.8rem]">
                  {T.micError}
                </div>
              )}

              {/* Detection display */}
              <div className="mb-6">
                {noteDetected ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 rounded-xl bg-[#2ecc71]/10 border border-[#2ecc71]/40"
                  >
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-[48px] mb-3"
                    >
                      🎉
                    </motion.div>
                    <p className="m-0 text-[1.1rem] text-[#2ecc71] font-heading px-6">
                      {T.celebration}
                    </p>
                  </motion.div>
                ) : (
                  <div className="py-8 rounded-xl bg-white/[0.03] border border-white/10">
                    {isListening ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-[40px] mb-3"
                        >
                          <Mic size={40} className="text-cf-gold mx-auto" />
                        </motion.div>
                        <p className="m-0 font-mono text-[0.8rem] text-white/50 uppercase tracking-widest">
                          {T.listening}
                        </p>
                        {noteInfo?.name && noteInfo.name !== '--' && (
                          <div className="mt-3">
                            <span className="font-heading text-[1.5rem] text-cf-gold">
                              {noteInfo.name}{noteInfo.octave}
                            </span>
                            <CentsMeter cents={noteInfo.cents} />
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={startListening}
                        className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg border border-cf-gold/30 bg-cf-gold/[0.08] text-cf-gold transition-all"
                      >
                        <Mic size={16} />
                        <span className="font-mono text-[0.7rem] uppercase tracking-widest">{T.enableMic}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={next}
                  className="flex-1 py-3.5 rounded-xl font-mono text-[0.75rem] uppercase tracking-widest transition-all min-h-[44px]"
                  style={{
                    background: noteDetected
                      ? 'linear-gradient(135deg, rgba(46,204,113,0.25) 0%, rgba(46,204,113,0.1) 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${noteDetected ? 'rgba(46,204,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: noteDetected ? '#2ecc71' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {T.playContinue}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Reflect ── */}
          {step === 4 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-[48px] mb-4"
              >
                <Sparkles size={48} className="text-cf-gold mx-auto" />
              </motion.div>
              <h2 className="font-heading text-[2rem] text-vv-text m-0 mb-6">{T.reflectTitle}</h2>

              {/* Scripted Truebadour message */}
              <div className="bg-cf-gold/[0.05] border border-cf-gold/20 rounded-xl p-6 mb-8 text-left relative">
                <div className="absolute -top-3 left-6 bg-[#050508] px-3">
                  <span className="font-mono text-[9px] text-cf-gold uppercase tracking-widest">Truebadour</span>
                </div>
                <p className="m-0 text-[1rem] leading-[1.7] text-white/80 italic">
                  \u201c{T.reflectBody}\u201d
                </p>
              </div>

              {/* Progress preview */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="m-0 font-heading text-[0.95rem] text-vv-cream">Chapter 1: The Supporting Beams</p>
                    <p className="m-0 font-mono text-[10px] text-cf-gold/60 uppercase tracking-widest mt-1">Started</p>
                  </div>
                  <div className="text-[24px]">🌱</div>
                </div>
              </div>

              <button
                onClick={finish}
                className="w-full py-4 rounded-xl cursor-pointer text-cf-gold font-mono text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all duration-200 min-h-[48px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.3) 0%, rgba(var(--cf-gold-rgb),0.12) 100%)',
                  border: '1px solid rgba(var(--cf-gold-rgb),0.6)',
                }}
              >
                {T.enterAcademy} <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Progress dots */}
          {step > 0 && <Dots total={totalSteps} current={step} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
