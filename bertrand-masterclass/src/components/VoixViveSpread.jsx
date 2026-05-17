import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chapters from '../data/chapterData';
import BreathingGate from './BreathingGate';
import { loadTraction, getChapterState, updateChapterTraction, recordBreathingSession } from '../data/tractionStore';

const VoixViveSpread = ({ chapterId = 1, onBack }) => {
  const chapter = chapters.find(c => c.id === chapterId) || chapters[0];
  const [traction, setTraction] = useState(loadTraction());
  const chapterState = getChapterState(traction, chapterId);
  const [showBreathingGate, setShowBreathingGate] = useState(!chapterState.breathingGateCleared);
  const [activePage, setActivePage] = useState('yin'); // yin | yang
  const [isMobile, setIsMobile] = useState(false);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtxRef.current = new AudioContext();
    return () => { if (audioCtxRef.current?.state !== 'closed') audioCtxRef.current?.close(); };
  }, []);

  const playSpineNote = (freq) => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, audioCtxRef.current.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 1.2);
  };

  const handleBreathingComplete = () => {
    const updated = recordBreathingSession(traction, chapterId);
    setTraction(updated);
    setShowBreathingGate(false);
  };

  // Spine fret notes (chromatic from open E2 to Fret 12)
  const spineNotes = Array.from({ length: 13 }, (_, i) => ({
    fret: i,
    freq: 82.41 * Math.pow(2, i / 12),
    isChapterFret: i === chapter.fret || i === 0,
    isActive: i <= chapter.fret
  }));

  return (
    <>
      {showBreathingGate && (
        <BreathingGate
          chapterTitle={chapter.title}
          onComplete={handleBreathingComplete}
          isCleared={chapterState.breathingGateCleared}
        />
      )}

      <div className="voix-vive-spread">
        <style>{`
          .voix-vive-spread {
            display: flex; min-height: 100vh;
            background: #0a0a0f; color: #e0e0ff;
            font-family: 'Inter', sans-serif;
            position: relative;
          }
          @media (max-width: 899px) {
            .voix-vive-spread { flex-direction: column; }
            .voix-vive-page { width: 100% !important; min-height: auto !important; }
            .voix-vive-spine { display: none; }
            .voix-vive-mobile-tabs { display: flex !important; }
          }
          .voix-vive-page {
            flex: 1; padding: 3rem; overflow-y: auto;
            min-height: 100vh; position: relative;
          }
          .voix-vive-page.yin {
            background: radial-gradient(ellipse at 30% 20%, rgba(123, 106, 170, 0.08) 0%, #0a0a0f 70%);
            border-right: 1px solid rgba(255,255,255,0.03);
          }
          .voix-vive-page.yang {
            background: radial-gradient(ellipse at 70% 80%, rgba(201, 169, 110, 0.06) 0%, #0a0a0f 70%);
          }
          .voix-vive-spine {
            width: 64px; background: #050508;
            border-left: 1px solid rgba(255,255,255,0.05);
            border-right: 1px solid rgba(255,255,255,0.05);
            display: flex; flex-direction: column;
            align-items: center; justify-content: space-between;
            padding: 2rem 0; position: relative; flex-shrink: 0;
          }
          .spine-fret {
            width: 40px; height: 40px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.7rem; font-weight: 700; cursor: pointer;
            transition: all 0.2s ease; border: 2px solid transparent;
            font-family: 'JetBrains Mono', monospace;
          }
          .spine-fret.active {
            background: rgba(201, 169, 110, 0.15);
            border-color: rgba(201, 169, 110, 0.4);
            color: #c9a96e;
          }
          .spine-fret.dim {
            background: rgba(255,255,255,0.02);
            color: #333; border-color: rgba(255,255,255,0.03);
          }
          .spine-fret.chapter-fret {
            background: rgba(201, 169, 110, 0.25);
            border-color: #c9a96e;
            color: #c9a96e;
            box-shadow: 0 0 12px rgba(201, 169, 110, 0.2);
          }
          .spine-fret:hover { transform: scale(1.15); }
          .voix-vive-mobile-tabs {
            display: none; position: sticky; top: 0;
            z-index: 100; background: #0a0a0f;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .mobile-tab {
            flex: 1; padding: 1rem; text-align: center;
            font-size: 0.75rem; letter-spacing: 0.15em;
            text-transform: uppercase; cursor: pointer;
            border: none; background: none; color: #5a6a80;
            font-family: 'JetBrains Mono', monospace;
            transition: all 0.2s ease;
          }
          .mobile-tab.active {
            color: #c9a96e;
            border-bottom: 2px solid #c9a96e;
            background: rgba(201, 169, 110, 0.05);
          }
          .page-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem; letter-spacing: 0.2em;
            text-transform: uppercase; margin-bottom: 2rem;
          }
          .yin .page-label { color: #7b6aaa; }
          .yang .page-label { color: #c9a96e; }
          .page-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem; font-weight: 400;
            color: #e8edf2; margin-bottom: 0.5rem; line-height: 1.15;
          }
          .page-subtitle {
            font-size: 1rem; color: #5a6a80;
            margin-bottom: 3rem; font-style: italic;
          }
          .page-body { font-size: 1.1rem; line-height: 1.9; color: #b0b8c8; }
          .page-body p { margin-bottom: 1.5em; }
          .page-quote {
            border-left: 3px solid #7b6aaa;
            padding: 1.5rem 2rem; margin: 2rem 0;
            font-family: 'EB Garamond', serif;
            font-style: italic; font-size: 1.3rem;
            color: #7aaa88; line-height: 1.8;
          }
          .page-quote .author {
            display: block; margin-top: 0.75rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem; color: #5a6a80;
            font-style: normal; letter-spacing: 0.1em;
          }
          .concept-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 8px; padding: 1.25rem 1.5rem;
            margin-bottom: 1rem;
          }
          .concept-term {
            font-weight: 600; color: #c9a96e;
            font-size: 0.95rem; margin-bottom: 0.3rem;
          }
          .concept-def { font-size: 0.95rem; color: #8090a8; line-height: 1.7; }
          .exercise-card {
            background: rgba(201, 169, 110, 0.04);
            border: 1px solid rgba(201, 169, 110, 0.1);
            border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;
          }
          .exercise-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem; color: #e8edf2;
            margin-bottom: 1rem; font-weight: 400;
          }
          .exercise-step {
            display: flex; gap: 1rem; align-items: flex-start;
            margin-bottom: 0.75rem; font-size: 0.95rem;
            color: #b0b8c8; line-height: 1.7;
          }
          .step-num {
            width: 24px; height: 24px; border-radius: 50%;
            background: rgba(201, 169, 110, 0.15);
            color: #c9a96e; font-size: 0.7rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-top: 2px;
            font-family: 'JetBrains Mono', monospace;
          }
          .back-btn {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: #8090a8; padding: 0.6rem 1.2rem;
            border-radius: 4px; cursor: pointer;
            font-size: 0.8rem; font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.1em; transition: all 0.2s ease;
            position: fixed; top: 1rem; left: 1rem; z-index: 50;
          }
          .back-btn:hover { background: rgba(255,255,255,0.08); color: #c9a96e; }
          .chapter-badge {
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            padding: 0.4rem 1rem; border-radius: 4px;
            margin-bottom: 1.5rem; font-size: 0.75rem;
            font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.1em; color: #5a6a80;
          }
          .chapter-badge .ch-color {
            width: 8px; height: 8px; border-radius: 50%;
          }
        `}</style>

        {/* Back button */}
        <button className="back-btn" onClick={onBack}>← Dashboard</button>

        {/* Mobile tabs */}
        <div className="voix-vive-mobile-tabs">
          <button className={`mobile-tab ${activePage === 'yin' ? 'active' : ''}`} onClick={() => setActivePage('yin')}>
            ☯ Yin · Theory
          </button>
          <button className={`mobile-tab ${activePage === 'yang' ? 'active' : ''}`} onClick={() => setActivePage('yang')}>
            ☯ Yang · Practice
          </button>
        </div>

        {/* ── YIN PAGE (Left) ── */}
        {(!isMobile || activePage === 'yin') && (
          <motion.div className="voix-vive-page yin"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="chapter-badge">
              <span className="ch-color" style={{ background: chapter.color }} />
              CHAPTER {chapter.id} · FRET {chapter.fret} · {chapter.interval}
            </div>
            <p className="page-label">☽ Yin · {chapter.act}</p>
            <h1 className="page-title">{chapter.yin.title}</h1>
            <p className="page-subtitle">{chapter.heroStage}</p>

            <div className="page-body">
              {chapter.yin.philosophy.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {chapter.yin.quote && (
              <div className="page-quote">
                "{chapter.yin.quote.text}"
                <span className="author">— {chapter.yin.quote.author}</span>
              </div>
            )}

            {chapter.yin.concepts?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <p className="page-label" style={{ marginBottom: '1rem' }}>KEY CONCEPTS</p>
                {chapter.yin.concepts.map((c, i) => (
                  <div key={i} className="concept-card">
                    <div className="concept-term">{c.term}</div>
                    <div className="concept-def">{c.definition}</div>
                  </div>
                ))}
              </div>
            )}

            {chapter.yin.meditation && (
              <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'rgba(123, 106, 170, 0.06)', borderRadius: '12px', border: '1px solid rgba(123, 106, 170, 0.1)' }}>
                <p className="page-label" style={{ color: '#7b6aaa' }}>MEDITATION</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: '1.2rem', color: '#e8edf2', lineHeight: 1.8 }}>
                  {chapter.yin.meditation.prompt}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── SPINE (Center Fretboard) ── */}
        <div className="voix-vive-spine">
          {spineNotes.map(note => (
            <div key={note.fret}
              className={`spine-fret ${note.isChapterFret ? 'chapter-fret' : note.isActive ? 'active' : 'dim'}`}
              onClick={() => playSpineNote(note.freq)}
              title={`Fret ${note.fret} — ${note.freq.toFixed(1)}Hz`}>
              {note.fret}
            </div>
          ))}
        </div>

        {/* ── YANG PAGE (Right) ── */}
        {(!isMobile || activePage === 'yang') && (
          <motion.div className="voix-vive-page yang"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="chapter-badge">
              <span className="ch-color" style={{ background: chapter.color }} />
              {chapter.pillar.toUpperCase()}
            </div>
            <p className="page-label">☀ Yang · Physical Application</p>
            <h1 className="page-title">{chapter.yang.title}</h1>
            <p className="page-subtitle">{chapter.coreMessage}</p>

            <div className="page-body">
              {chapter.yang.instruction.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {chapter.yang.exercises?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                {chapter.yang.exercises.map((ex, i) => (
                  <div key={i} className="exercise-card">
                    <div className="exercise-name">{ex.name}</div>
                    {ex.steps.map((step, j) => (
                      <div key={j} className="exercise-step">
                        <span className="step-num">{j + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {chapter.yang.fretboardFocus && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(201, 169, 110, 0.04)', borderRadius: '8px', border: '1px solid rgba(201, 169, 110, 0.1)' }}>
                <p className="page-label">FRETBOARD FOCUS</p>
                <p style={{ color: '#8090a8', fontSize: '0.95rem' }}>
                  Frets {chapter.yang.fretboardFocus.startFret}–{chapter.yang.fretboardFocus.endFret} ·
                  Pattern: <strong style={{ color: '#c9a96e' }}>{chapter.yang.fretboardFocus.pattern}</strong>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default VoixViveSpread;
