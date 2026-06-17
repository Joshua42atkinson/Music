import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePitchDetector from '../hooks/usePitchDetector';
import { useBevyIPC } from '../hooks/useBevyIPC';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import { useCScaleProgress } from '../features/c-scale/useCScaleProgress';
import BeDoExercise from '../features/c-scale/BeDoExercise';
import PitchDetectorHUD from '../features/c-scale/PitchDetectorHUD';
import ChapterSidebar from '../features/c-scale/ChapterSidebar';
import StageHeader from '../features/c-scale/StageHeader';
import FretboardPanel from '../features/c-scale/FretboardPanel';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { droneEngine } from '../lib/audio/GenerativeDroneEngine';

// ═══════════════════════════════════════════════════════════
// MAIN HUB
// ═══════════════════════════════════════════════════════════
export default function CScaleHub() {
  const [activeStage, setActiveStage] = useState(C_SCALE_CHAPTERS[0].id);
  const [threeDMode, setThreeDMode] = useState(false);
  const [resonanceMode, setResonanceMode] = useState(false);
  const { progress, markComplete } = useCScaleProgress();
  const navigate = useNavigate();

  const { isConnected, sendCommand } = useBevyIPC();
  const { isListening, noteInfo, volume, error, startListening, stopListening } = usePitchDetector();

  const currentChapter = C_SCALE_CHAPTERS.find(s => s.id === activeStage);

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Handle Drone Engine state when stage changes or resonance mode toggles
  useEffect(() => {
    if (resonanceMode) {
      droneEngine.startDrone(activeStage);
    } else {
      droneEngine.stopAll();
    }
    return () => droneEngine.stopAll();
  }, [activeStage, resonanceMode]);

  return (
    <div className={`mesh-bg min-h-[100svh] text-[var(--vv-text)] font-body pt-20 pb-10 flex flex-col transition-colors duration-1000 ${resonanceMode ? 'bg-[#030201] shadow-[inset_0_0_150px_rgba(204,153,51,0.05)]' : 'bg-transparent'}`}>
      <div className="px-10 mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="m-0 font-heading text-[2.5rem] font-normal text-[var(--vv-cream)]">The C Scale Journey</h1>
          <p className="mt-2 font-mono text-[0.8rem] tracking-[0.1em] uppercase text-[var(--vv-gold)]/60">The Matrix of the Fretboard (12 Chapters)</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setResonanceMode(!resonanceMode)}
            className={`premium-button px-4 py-2 rounded-lg border font-mono text-[0.8rem] transition-all duration-500 flex items-center gap-2 ${resonanceMode ? 'border-[#34d399] text-[#34d399] shadow-[0_0_15px_rgba(52,211,153,0.2)] bg-[#34d399]/5' : 'border-cf-gold/40 text-cf-gold hover:border-cf-gold/80'}`}
          >
            {resonanceMode ? '〰️ Resonance Active' : '〰️ Freestyle Resonance'}
          </button>
          
          <PitchDetectorHUD
            isListening={isListening}
            noteInfo={noteInfo}
            volume={volume}
            onToggle={toggleMic}
          />

          <button
            className="premium-button px-4 py-2 rounded-lg border font-mono text-[0.8rem] transition-all duration-200"
            onClick={() => {
              setThreeDMode(!threeDMode);
              if (!threeDMode) {
                const archetype = vvGet(STORAGE_KEYS.ARCHETYPE) || 'unknown';
                sendCommand('LAUNCH_C_SCALE', { archetype, friction: 1 });
              }
            }}
            style={{
              borderColor: isConnected ? '#2ecc71' : 'rgba(var(--cf-gold-rgb),0.4)',
              color: isConnected ? '#2ecc71' : 'var(--cf-gold)',
            }}
          >
            {threeDMode ? 'Exit XR Stream' : (isConnected ? 'Launch XR Stream (Connected)' : 'Launch XR Stream')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-10 mb-4 px-4 py-2.5 rounded-lg bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] text-[var(--vv-red)] text-[0.85rem]">
          {error}
        </div>
      )}

      <div className="flex gap-8 px-10 flex-1">
        {/* Left Column: 12-Chapter Curriculum */}
        <ChapterSidebar
          activeStage={activeStage}
          onSelectStage={setActiveStage}
          progress={progress}
          onEnterStudio={() => navigate('/studio/prompter')}
        />

        {/* Right Column: Visualization + Exercise */}
        <div className="glass-card flex-1 flex flex-col rounded-2xl overflow-hidden">
          <StageHeader chapter={currentChapter} />

          {/* Exercise Area (BE / DO Panels) */}
          <div className="px-8 py-6 border-b border-white/5">
            <BeDoExercise
              key={activeStage}
              chapter={currentChapter}
              isListening={isListening}
              noteInfo={noteInfo}
              onComplete={() => markComplete(currentChapter.key)}
            />
          </div>

          <FretboardPanel threeDMode={threeDMode} activeStage={activeStage} />
        </div>
      </div>
    </div>
  );
}
