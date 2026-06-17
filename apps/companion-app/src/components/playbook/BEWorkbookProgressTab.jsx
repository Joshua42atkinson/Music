// ═══════════════════════════════════════════════════════════
// BEWorkbookProgressTab — Nodes grid + BE→DO→PLAY checklist
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { dagNodes } from '../../data/dag/dagNodes';
import { isNodeUnlocked } from '../../data/dag/dagEdges';

const PHASE_COLORS = {
  be: '#60a5fa',
  do: '#a78bfa',
  play: '#34d399',
};

const PHASE_LABELS = {
  be: { en: 'Imagine', fr: 'Imagine' },
  do: { en: 'Hear', fr: 'Entends' },
  play: { en: 'Play', fr: 'Joue' },
};

const MASTERY_STARS = ['○', '◐', '●', '★'];
const MASTERY_LABELS = ['Encountered', 'Experienced', 'Owned', 'Mastered'];

const GATE_MESSAGES = {
  be: {
    en: 'Somatic Gate Locked: You must first read all slides in the Song (living textbook) portal to unlock this phase.',
    fr: "Porte Somatique Verrouillée : Vous devez d'abord lire toutes les diapositives dans le portail du Chant pour déverrouiller cette étape."
  },
  do: {
    en: 'Somatic Gate Locked: You must first match pitches in the Pitch Room / Pling Trainer to unlock this phase.',
    fr: "Porte Somatique Verrouillée : Vous devez d'abord faire correspondre les hauteurs dans la Pitch Room / Pling Trainer pour déverrouiller cette étape."
  },
  play: {
    en: 'Somatic Gate Locked: You must first submit an audio or video practice recording in the Studio to unlock this phase.',
    fr: "Porte Somatique Verrouillée : Vous devez d'abord soumettre un enregistrement de pratique dans le Studio pour déverrouiller cette étape."
  }
};

export default function BEWorkbookProgressTab({
  selectedFret,
  completedNodes,
  currentNodeId,
  nextRecommended,
  traction,
  globalMode,
  lang,
  activePrompt,
  setActivePrompt,
  onPhaseComplete,
  onNodeComplete,
  onLogAndComplete,
}) {
  const fretNodes = dagNodes.filter(n => n.fret === selectedFret);

  const isNodeCompleted = (nodeId) => completedNodes.includes(nodeId);

  const getPhaseStatus = (nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return false;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return false;
    return !!fretState[`${phase}Completed`];
  };

  const getMasteryLevel = (nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return 0;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return 0;
    return fretState[`${phase}Mastery`] || 0;
  };

  const getResonance = (nodeId, phase) => {
    const node = dagNodes.find(n => n.id === nodeId);
    if (!node) return false;
    const fretState = traction?.frets?.[node.fret];
    if (!fretState) return false;
    return !!fretState[`${phase}Resonance`];
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6">
        {fretNodes.map(node => {
          const isCompleted = isNodeCompleted(node.id);
          const isCurrent = node.id === currentNodeId;
          const isNext = node.id === nextRecommended;
          const isUnlocked = isNodeUnlocked(node.id, completedNodes, traction?.settings?.sandboxMode);

          return (
            <div
              key={node.id}
              className={[
                'relative p-4 bg-white/[0.03] rounded-xl border transition-all duration-300',
                isCompleted ? 'bg-emerald-400/[0.08] border-emerald-400/30' : 'border-white/[0.08]',
                isCurrent ? 'border-2 border-[#60a5fa] shadow-[0_0_16px_rgba(96,165,250,0.2)]' : '',
                isNext && !isCompleted ? 'border border-dashed border-blue-400/50' : '',
                !isUnlocked ? 'opacity-50' : '',
              ].filter(Boolean).join(' ')}
            >
              {/* Node Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[1.2rem]">
                  {node.pillar === 'class' ? '📚' : node.pillar === 'guitar' ? '🎸' : '📝'}
                </span>
                <span className="font-mono text-[0.6rem] text-white/40 uppercase tracking-[0.1em] flex-1">{node.type}</span>
                {isCompleted && <span className="text-[0.65rem] text-emerald-400 bg-emerald-400/[0.15] py-0.5 px-2 rounded-[10px]">✓ Done</span>}
                {isCurrent && <span className="text-[0.65rem] text-[#60a5fa] bg-blue-400/[0.15] py-0.5 px-2 rounded-[10px]">▶ Current</span>}
              </div>

              {/* Node Title */}
              <h3 className="text-base font-semibold text-vv-text m-0 mb-1.5">{node.title}</h3>
              <p className="text-[0.8rem] text-white/50 m-0 mb-3 leading-[1.4]">{node.description}</p>

              {/* BE → DO → PLAY Checklist with Mastery Stars */}
              <div className="flex flex-col gap-1.5">
                {['be', 'do', 'play'].map(phase => {
                  const isPhaseDone = getPhaseStatus(node.id, phase);
                  const mastery = getMasteryLevel(node.id, phase);
                  const resonance = getResonance(node.id, phase);
                  const star = MASTERY_STARS[mastery];
                  const masteryLabel = MASTERY_LABELS[mastery];

                  const isPromptOpen = activePrompt?.nodeId === node.id && activePrompt?.phase === phase;

                  const promptText = phase === 'be' ? 'What did your body notice? (e.g., shoulders tense, breath shallow)'
                                   : phase === 'do' ? 'What did you hear? (e.g., interval felt unstable, pitch was sharp)'
                                   : 'How long did the feeling last? (e.g., 5 minutes, still feeling it)';

                  return (
                    <div key={phase} className="flex flex-col gap-1">
                      <div
                        className={[
                          'flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200',
                          isPhaseDone ? 'bg-white/[0.06]' : 'bg-white/[0.03]',
                          resonance ? 'bg-amber-400/[0.08] border border-amber-400/25' : '',
                          isPromptOpen ? 'bg-white/[0.08]' : '',
                        ].filter(Boolean).join(' ')}
                        title={resonance ? `${masteryLabel} — Cross-Pillar Resonance unlocked` : masteryLabel}
                        onClick={() => {
                          if (!isUnlocked || isPhaseDone) return;

                          if (globalMode === 'truebadour_trial') {
                            const fretState = traction?.frets?.[node.fret];
                            const gatePassed = fretState ? !!fretState[`${phase}GatePassed`] : false;
                            if (!gatePassed) {
                              alert(GATE_MESSAGES[phase][lang]);
                              return;
                            }
                          }

                          setActivePrompt(isPromptOpen ? null : { nodeId: node.id, phase });
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-all duration-200"
                          style={{
                            background: isPhaseDone ? PHASE_COLORS[phase] : 'transparent',
                            borderColor: resonance ? '#fbbf24' : PHASE_COLORS[phase],
                            boxShadow: resonance ? `0 0 8px ${PHASE_COLORS[phase]}80` : 'none',
                          }}
                        />
                        <span className="text-[0.8rem] text-white/70">
                          <strong>{phase.toUpperCase()}</strong>
                          {' — '}
                          {PHASE_LABELS[phase][lang]}
                          {resonance && (
                            <span className="text-[0.65rem] text-amber-400 ml-1.5 tracking-[0.08em] uppercase">
                              ⚡ Resonant
                            </span>
                          )}
                        </span>
                        <span className="text-[0.75rem] ml-auto font-mono" style={{ color: mastery === 3 ? 'var(--cf-gold)' : 'rgba(255,255,255,0.3)' }}>
                          {star}
                        </span>
                      </div>

                      {/* Sensory Journaling Prompt */}
                      {isPromptOpen && (
                        <div className="py-2 px-3 bg-black/20 rounded-lg mt-1">
                          <p className="text-[0.75rem] text-white/60 m-0 mb-2 italic">
                            {promptText}
                          </p>
                          <textarea
                            autoFocus
                            placeholder="Type your reflection here..."
                            className="w-full min-h-[60px] bg-white/[0.05] border border-white/10 text-[#e8edf2] p-2 rounded-md text-[0.85rem] resize-y font-sans"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onLogAndComplete(node.id, phase);
                                setActivePrompt(null);
                              }
                            }}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLogAndComplete(node.id, phase);
                                setActivePrompt(null);
                              }}
                              className="py-1.5 px-4 rounded-lg border-none bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] text-white font-mono text-[0.75rem] font-semibold cursor-pointer tracking-[0.05em] transition-all duration-200"
                            >
                              Log & Complete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mark Complete Button */}
              {isUnlocked && !isCompleted && (
                <button
                  onClick={() => onNodeComplete(node.id)}
                  className="w-full mt-3 py-2.5 rounded-lg border-none bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] text-white font-mono text-[0.75rem] font-semibold cursor-pointer tracking-[0.05em] transition-all duration-200"
                >
                  Mark Node Complete
                </button>
              )}

              {/* Locked Overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-[0.8rem] text-white/60 text-center p-4">🔒 Complete previous nodes to unlock</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
