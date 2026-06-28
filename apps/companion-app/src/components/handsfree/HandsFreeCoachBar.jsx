// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : HandsFreeCoachBar.jsx                                ║
// ║ WHAT    : Hands-free coach toggle + status UI                  ║
// ║ WHY     : Student must start/stop hands-free mode without       ║
// ║           looking at the screen; large touch target, clear state║
// ║ WHO     : C Scale hub and future practice screens               ║
// ║ NEEDS   : useHandsFreeCoach hook, useLocale for i18n           ║
// ╚═══════════════════════════════════════════════════════════════╝
import React, { useEffect } from 'react';
import { Mic, MicOff, Ear, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { useHandsFreeCoach } from '../../hooks/useHandsFreeCoach';
import { useLocale } from '../../hooks/useLocale';
import { useTruebadour } from '../../hooks/TruebadourProvider';

const STATE_LABELS = {
  idle: { en: 'Tap to start hands-free', fr: 'Appuyez pour le mode mains libres' },
  listening: { en: 'Listening...', fr: 'J\'écoute...' },
  processing: { en: 'Processing...', fr: 'Traitement...' },
  speaking: { en: 'Speaking...', fr: 'Je parle...' },
  error: { en: 'Error', fr: 'Erreur' },
};

export default function HandsFreeCoachBar({ handlers, onActiveChange }) {
  const { locale } = useLocale();
  const { speak: ttsSpeak } = useTruebadour();
  const { isActive, state, lastCommand, error, start, stop } = useHandsFreeCoach({
    handlers,
    locale,
    ttsSpeak,
  });

  // Notify parent when active state changes
  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const label = STATE_LABELS[state]?.[locale] || STATE_LABELS.idle[locale];

  const icons = {
    idle: <Mic size={28} className="text-cf-gold" />,
    listening: <Ear size={28} className="text-[#e07070] animate-pulse" />,
    processing: <Loader2 size={28} className="text-cf-gold animate-spin" />,
    speaking: <Volume2 size={28} className="text-cf-gold" />,
    error: <AlertCircle size={28} className="text-[#e07070]" />,
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
      <div className="flex items-center gap-3 rounded-full bg-[rgba(13,13,20,0.95)] border border-[rgba(255,255,255,0.1)] px-3 py-2 backdrop-blur-sm shadow-lg">
        <button
          onClick={isActive ? stop : start}
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 active:scale-95"
          style={{
            background: isActive ? 'rgba(224,112,112,0.15)' : 'rgba(255,255,255,0.05)',
            borderColor: isActive ? 'rgba(224,112,112,0.6)' : 'rgba(255,255,255,0.15)',
          }}
          aria-label={isActive ? 'Stop hands-free mode' : 'Start hands-free mode'}
        >
          {isActive ? <MicOff size={24} className="text-[#e07070]" /> : icons.idle}
          {isActive && (
            <span className="absolute inset-0 rounded-full border-2 border-[#e07070] animate-ping opacity-30" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[0.8rem] font-medium text-[#f0e6d2] m-0 leading-tight">
            {label}
          </p>
          {lastCommand && state !== 'idle' && (
            <p className="text-[0.7rem] text-[#a0a8b8] m-0 mt-0.5 truncate">
              “{lastCommand}”
            </p>
          )}
          {error && (
            <p className="text-[0.65rem] text-[#e07070] m-0 mt-0.5 line-clamp-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
