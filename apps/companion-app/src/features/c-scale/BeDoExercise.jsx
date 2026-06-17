import React, { useState, useEffect } from 'react';
import { PITCH_DETECTION_THRESHOLD } from '../../data/cScaleCurriculum';

export default function BeDoExercise({ chapter, isListening, noteInfo, onComplete }) {
  const [phase, setPhase] = useState('BE');
  const [hitCount, setHitCount] = useState(0);

  useEffect(() => {
    if (phase !== 'DO' || !isListening || !noteInfo?.name) return;
    setHitCount((prev) => {
      const next = prev + 1;
      if (next > PITCH_DETECTION_THRESHOLD) {
        onComplete();
      }
      return next;
    });
  }, [noteInfo, isListening, phase, onComplete]);

  return (
    <div className="flex flex-col">
      {phase === 'BE' && (
        <div className="p-6 rounded-xl bg-[rgba(52,152,219,0.1)] border border-[rgba(52,152,219,0.3)]">
          <h3 className="m-0 mb-2 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-[var(--vv-blue)]">
            Phase 1: BE (Active Imagination)
          </h3>
          <h2 className="m-0 mb-4 font-heading text-2xl text-[var(--vv-cream)]">
            {chapter.bePhase.title}
          </h2>
          <p className="m-0 mb-4 text-base text-white/80 leading-relaxed">
            {chapter.bePhase.content}
          </p>
          <div className="p-4 rounded-lg bg-black/30 border-l-[3px] border-[var(--vv-yellow)]">
            <p className="m-0 text-[0.9rem] text-[var(--vv-yellow)] italic">
              <strong>Prompt:</strong> {chapter.bePhase.action}
            </p>
          </div>
          <button
            onClick={() => setPhase('DO')}
            className="mt-6 px-6 py-3 bg-[var(--vv-blue)] text-white border-none rounded-lg cursor-pointer font-mono font-bold"
          >
            I have visualized it. Move to DO →
          </button>
        </div>
      )}

      {phase === 'DO' && (
        <div className="p-6 rounded-xl bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)]">
          <h3 className="m-0 mb-2 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-[var(--vv-green)]">
            Phase 2: DO (Somatic Application)
          </h3>
          <p className="m-0 mb-4 text-[1.1rem] text-[var(--vv-cream)] leading-relaxed">
            {chapter.doPhase.instruction}
          </p>

          {!isListening ? (
            <div className="text-[var(--vv-red)] text-[0.9rem] p-3 rounded-lg bg-[rgba(231,76,60,0.1)]">
              ⚠️ Turn on your microphone to validate your playing.
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-4">
              <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--vv-green)] transition-[width] duration-200"
                  style={{ width: `${Math.min((hitCount / PITCH_DETECTION_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[var(--vv-green)] font-mono text-[0.8rem]">Listening...</span>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setPhase('BE')}
              className="px-5 py-2.5 bg-transparent text-white/50 border border-white/20 rounded-lg cursor-pointer font-mono"
            >
              ← Back to Visualization
            </button>
            <button
              onClick={onComplete}
              className="px-5 py-2.5 bg-[rgba(46,204,113,0.2)] text-[var(--vv-green)] border border-[rgba(46,204,113,0.5)] rounded-lg cursor-pointer font-mono"
            >
              Mark Complete (Override)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
