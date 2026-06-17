import { Mic, MicOff } from 'lucide-react';

export default function PitchDetectorHUD({ isListening, noteInfo, volume, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="premium-button flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200"
      style={{
        background: isListening ? 'rgba(46,204,113,0.15)' : undefined,
        borderColor: isListening ? 'rgba(46,204,113,0.4)' : undefined,
        color: isListening ? '#2ecc71' : undefined,
      }}
    >
      {isListening ? <Mic size={16} /> : <MicOff size={16} />}
      <span className="text-[0.7rem] font-mono">
        {isListening
          ? `${noteInfo?.name || '--'}${noteInfo?.octave || ''} · ${Math.round(volume)}%`
          : 'Enable Mic'}
      </span>
    </button>
  );
}
