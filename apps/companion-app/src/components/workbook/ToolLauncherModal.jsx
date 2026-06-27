import React from 'react';
import { Wind, X } from 'lucide-react';
import BreathingGate from '../BreathingGate';
import PracticeTimer from '../PracticeTimer';
import PitchRoom from '../../features/audio-engine/PitchRoom';
import SongwritingCompanion from '../SongwritingCompanion';
import IntervalVisualizer from '../IntervalVisualizer';
import FretboardExplorer from '../../features/vr-fretboard/FretboardExplorer';
import PlingTrainer from '../PlingTrainer';
import MicrotonalTracker from '../MicrotonalTracker';
import MultiKeyHub from '../MultiKeyHub';
import RhythmEngine from '../../features/audio-engine/RhythmEngine';
import PracticeRecorder from '../PracticeRecorder';
import { Timer, Music, Feather, Grid3x3, BookOpen, Mic, Activity, Zap, Video, Layers, Play } from 'lucide-react';
import { useScaffolding } from '../ScaffoldingProvider';

const ICON_MAP = {
  1: Wind, 2: Timer, 3: Music, 4: Feather, 5: Grid3x3,
  6: BookOpen, 7: Mic, 8: Activity, 9: Zap, 10: Video, 11: Layers, 12: Play,
};

const PROTOCOL_COLORS = {
  'SHEARL': { border: 'rgba(90,144,160,0.25)', text: '#5a90a0' },
  'PLING!': { border: 'rgba(122,170,136,0.25)', text: '#7aaa88' },
  'FHEAL':  { border: 'rgba(123,106,170,0.25)', text: '#7b6aaa' },
};

export default function ToolLauncherModal({ activeTool, handleCloseTool }) {
  const { traction } = useScaffolding();
  if (!activeTool) return null;
  return (
    <div className="fixed inset-0 z-[1000] bg-[rgba(5,5,8,0.96)] backdrop-blur-[10px] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: PROTOCOL_COLORS[activeTool.protocol]?.border || 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div style={{ color: PROTOCOL_COLORS[activeTool.protocol]?.text }}>
            {React.createElement(ICON_MAP[activeTool.id] || Wind, { size: 20 })}
          </div>
          <div>
            <h3 className="m-0 font-[Cormorant_Garamond] text-[1.25rem] text-[#f0e6d2] font-semibold">{activeTool.name}</h3>
            <p className="m-0 text-[0.6rem] font-mono tracking-[0.08em] uppercase" style={{ color: PROTOCOL_COLORS[activeTool.protocol]?.text }}>
              Chapter {activeTool.id} · {activeTool.protocol} · {activeTool.phase}
            </p>
          </div>
        </div>
        <button
          onClick={handleCloseTool}
          className="bg-white/[0.06] border border-white/[0.1] rounded-lg w-9 h-9 flex items-center justify-center text-[var(--cf-gold)] cursor-pointer transition-all duration-200"
          aria-label="Close Practice Tool"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {(() => {
          switch (activeTool.id) {
            case 1: return traction?.settings?.disableBreathingGates ? <div className="text-center p-8 text-white/40 font-mono text-sm">Breathing exercises disabled in settings.</div> : <BreathingGate fretTitle={activeTool.name} onComplete={handleCloseTool} />;
            case 2: return <PracticeTimer fretId={activeTool.id} />;
            case 3: return <PitchRoom />;
            case 4: return <SongwritingCompanion />;
            case 5: return <IntervalVisualizer />;
            case 6: return <FretboardExplorer compact={false} />;
            case 7: return <PlingTrainer />;
            case 8: return <MicrotonalTracker />;
            case 9: return <FretboardExplorer compact={false} />;
            case 10: return <PracticeRecorder onClose={handleCloseTool} exerciseName="Async Assessor" />;
            case 11: return <MultiKeyHub />;
            case 12: return <RhythmEngine />;
            default: return null;
          }
        })()}
      </div>
    </div>
  );
}
