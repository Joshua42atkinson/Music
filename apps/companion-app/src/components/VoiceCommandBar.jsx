// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : VoiceCommandBar.jsx                                  ║
// ║ WHAT    : Floating mic button + voice feedback UI              ║
// ║ WHY     : Hands-free navigation — student holds guitar,        ║
// ║           taps mic, speaks commands, gets TTS readback         ║
// ║ WHO     : All students (free tier feature)                     ║
// ║ OWNS    : Mic toggle button, listening indicator, last command ║
// ║ NEEDS   : useVoiceNav hook, useLocale for i18n                 ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
import React, { useState } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { useVoiceNav } from '../hooks/useVoiceNav';
import { useLocale } from '../hooks/useLocale';

export default function VoiceCommandBar({ handlers = {}, enabled = true }) {
  const { t, isFrench, locale } = useLocale();
  const [showHelp, setShowHelp] = useState(false);

  const {
    isListening,
    toggleListening,
    lastCommand,
    supported,
    commands,
  } = useVoiceNav({ handlers, locale, enabled });

  if (!supported) return null;

  return (
    <>
      {/* Floating mic button */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-300 ${
          isListening
            ? 'bg-[rgba(224,112,112,0.2)] border-2 border-[#e07070] shadow-[0_0_20px_rgba(224,112,112,0.3)]'
            : 'bg-[rgba(var(--cf-gold-rgb),0.1)] border border-[rgba(var(--cf-gold-rgb),0.3)]'
        }`}
        aria-label={isListening
          ? (isFrench ? 'Arrêter l\'écoute' : 'Stop listening')
          : (isFrench ? 'Commande vocale' : 'Voice command')}
      >
        {isListening ? (
          <Mic size={22} className="text-[#e07070]" />
        ) : (
          <Mic size={22} className="text-cf-gold" />
        )}
        {isListening && (
          <span className="absolute inset-0 rounded-full border-2 border-[#e07070] animate-ping opacity-30" />
        )}
      </button>

      {/* Listening indicator + last command */}
      {isListening && (
        <div className="fixed bottom-24 right-6 z-50 max-w-[280px] rounded-xl bg-[rgba(13,13,20,0.95)] border border-[rgba(255,255,255,0.1)] px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#e07070] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e07070] animate-pulse" />
              {isFrench ? 'En écoute' : 'Listening'}
            </span>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-[0.6rem] font-mono uppercase tracking-wider text-[#5a6a7a] bg-transparent border-none cursor-pointer hover:text-cf-gold"
            >
              {isFrench ? 'Aide' : 'Help'}
            </button>
          </div>
          {lastCommand && (
            <p className="text-[0.78rem] text-[#a0a8b8] m-0 mb-1 italic">
              "{lastCommand}"
            </p>
          )}
          {showHelp && (
            <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
              <p className="text-[0.65rem] text-[#6a7a8a] m-0 mb-1.5">
                {isFrench ? 'Commandes disponibles' : 'Available commands'}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(commands).slice(0, 8).map(([action, triggers]) => (
                  <span
                    key={action}
                    className="text-[0.6rem] font-mono px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#7a8a9a]"
                  >
                    {triggers[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
