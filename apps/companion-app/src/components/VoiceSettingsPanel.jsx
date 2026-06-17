// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : VoiceSettingsPanel.jsx                               ║
// ║ WHAT    : Full audio settings panel — voice, speed, pitch,     ║
// ║           volume, auto-play, language, preview                 ║
// ║ WHY     : Audio is the #1 product differentiator. Students     ║
// ║           must be able to tune Bertrand's voice to their taste ║
// ║ WHO     : student (accessed via Voice button in Truebadour)    ║
// ║ OWNS    : All UI for voice preference controls                 ║
// ║ NEEDS   : useVoicePreferences, useKokoroWebTTS (for preview),  ║
// ║           framer-motion, KOKORO_VOICES catalog                 ║
// ║ RULES   : French locale auto-selects ff_siwis as default.      ║
// ║           Preview plays immediately on voice/speed change if   ║
// ║           testOnChange is enabled. Never blocks other audio.   ║
// ║ FIX AT  : If preview fails, check Kokoro init in parent hook.  ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝

import React, { useState, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Cloud, Check, Volume2 } from 'lucide-react';
import { KOKORO_VOICES } from '../hooks/useVoicePreferences';

const RED = '#cc3333';
const labelBase = "block text-[0.6rem] text-white/35 uppercase tracking-[0.1em] mb-1 font-mono";
const sectionBase = "bg-black/20 rounded-xl p-3 px-3.5 flex flex-col gap-2.5";

const PREVIEW_TEXTS = {
  en: "A string vibrates between two silences. You are both.",
  fr: "Une corde vibre entre deux silences. Vous êtes les deux.",
  gb: "A string vibrates between two silences. You are both.",
};

export default function VoiceSettingsPanel({
  prefs,
  saving,
  setVoiceId,
  setSpeed,
  setPitch,
  setVolume,
  setAutoPlay,
  setLanguage,
  setTestOnChange,
  resetDefaults,
  // Kokoro speak function passed from parent (already initialised)
  onPreview,
  locale: _locale,
  user,
  cookieConsent,
  grantCookieConsent,
}) {
  const [previewing, setPreviewing] = useState(false);

  const handlePreview = useCallback(async () => {
    if (previewing || !onPreview) return;
    setPreviewing(true);
    try {
      const text = PREVIEW_TEXTS[prefs.language] || PREVIEW_TEXTS.en;
      await onPreview(text, prefs.voiceId, prefs.speed);
    } catch (e) {
      console.warn('[VoiceSettings] Preview failed:', e);
    } finally {
      setPreviewing(false);
    }
  }, [previewing, onPreview, prefs]);

  const handleVoiceChange = useCallback((id) => {
    setVoiceId(id);
    if (prefs.testOnChange && onPreview) {
      const text = PREVIEW_TEXTS[prefs.language] || PREVIEW_TEXTS.en;
      onPreview(text, id, prefs.speed).catch(() => {});
    }
  }, [setVoiceId, prefs, onPreview]);

  const handleLangChange = useCallback((lang) => {
    setLanguage(lang);
    // Auto-select a sensible default voice for the language
    const voices = KOKORO_VOICES[lang];
    if (voices) {
      const firstMale = voices.male?.[0]?.id;
      if (firstMale) setVoiceId(firstMale);
    }
  }, [setLanguage, setVoiceId]);

  const currentVoices = KOKORO_VOICES[prefs.language] || KOKORO_VOICES.en;
  const allVoices = [...(currentVoices.male || []), ...(currentVoices.female || [])];
  const selectedVoice = allVoices.find(v => v.id === prefs.voiceId);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-3.5"
    >
      <div className="bg-black/35 border border-cf-red/15 rounded-xl p-4 flex flex-col gap-3.5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.65rem] text-cf-red tracking-[0.15em] uppercase">
            🎙 Voice Studio
          </span>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-[0.55rem] text-cf-gold font-mono">
                <Cloud size={10} className="inline mr-0.5" />saving…
              </span>
            )}
            <button
              onClick={() => {
                if (window.confirm('Reset voice settings to defaults?')) {
                  resetDefaults();
                }
              }}
              title="Reset to defaults"
              className="bg-transparent border-none cursor-pointer text-white/20 p-0.5 hover:text-white/40 transition-colors"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* ── Login / Cookie Consent Banner ── */}
        {!user && !cookieConsent && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 px-3.5 mb-1">
            <p className="text-[0.65rem] text-amber-400 font-mono mb-2 leading-[1.4]">
              Your voice settings are temporary. To save them across sessions, you can <strong>Log In to Sync</strong> ☁️ or <strong>Allow Cookies</strong> 🍪.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('ambient:open', { detail: { mode: 'auth' } }))}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-amber-400 bg-amber-400/20 text-amber-400 font-mono text-[0.6rem] cursor-pointer hover:bg-amber-400/30 transition-colors"
              >
                Log In to Sync
              </button>
              <button
                onClick={grantCookieConsent}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-white/20 bg-white/5 text-white/70 font-mono text-[0.6rem] cursor-pointer hover:bg-white/10 transition-colors"
              >
                Allow Cookies
              </button>
            </div>
          </div>
        )}

        {/* ── Language ── */}
        <div className={sectionBase}>
          <label className={labelBase}>Language / Langue</label>
          <div className="flex gap-1.5">
            {Object.entries(KOKORO_VOICES).map(([lang, data]) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className="flex-1 py-1.5 px-1 rounded-lg border font-mono text-[0.6rem] cursor-pointer transition-all duration-200 tracking-[0.05em]"
                style={{
                  borderColor: prefs.language === lang ? 'rgba(204,51,51,0.6)' : 'rgba(255,255,255,0.08)',
                  background: prefs.language === lang ? 'rgba(204,51,51,0.15)' : 'rgba(255,255,255,0.03)',
                  color: prefs.language === lang ? '#ff8888' : 'rgba(255,255,255,0.35)',
                }}
              >
                {data.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Voice Persona ── */}
        <div className={sectionBase}>
          <label className={labelBase}>Voice Persona</label>

          {/* Male voices */}
          {currentVoices.male?.length > 0 && (
            <>
              <div className="text-[0.55rem] text-white/20 font-mono mb-0.5">
                ♂ {prefs.language === 'fr' ? 'Masculin' : 'Male'}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {currentVoices.male.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVoiceChange(v.id)}
                    className="py-2 px-2.5 rounded-lg border border-white/[0.07] cursor-pointer text-left transition-all duration-150"
                    style={{
                      borderColor: prefs.voiceId === v.id ? 'rgba(204,51,51,0.7)' : 'rgba(255,255,255,0.07)',
                      background: prefs.voiceId === v.id ? 'rgba(204,51,51,0.18)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="font-mono text-[0.7rem] font-semibold" style={{ color: prefs.voiceId === v.id ? '#ff9999' : 'rgba(255,255,255,0.6)' }}>
                      {prefs.voiceId === v.id && <Check size={9} className="inline mr-1" />}{v.name}
                    </div>
                    <div className="text-[0.55rem] text-white/25 mt-0.5">{v.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Female voices */}
          {currentVoices.female?.length > 0 && (
            <>
              <div className="text-[0.55rem] text-white/20 font-mono mt-1 mb-0.5">
                ♀ {prefs.language === 'fr' ? 'Féminin' : 'Female'}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {currentVoices.female.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVoiceChange(v.id)}
                    className="py-2 px-2.5 rounded-lg border border-white/[0.07] cursor-pointer text-left transition-all duration-150"
                    style={{
                      borderColor: prefs.voiceId === v.id ? 'rgba(204,51,51,0.7)' : 'rgba(255,255,255,0.07)',
                      background: prefs.voiceId === v.id ? 'rgba(204,51,51,0.18)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="font-mono text-[0.7rem] font-semibold" style={{ color: prefs.voiceId === v.id ? '#ff9999' : 'rgba(255,255,255,0.6)' }}>
                      {prefs.voiceId === v.id && <Check size={9} className="inline mr-1" />}{v.name}
                    </div>
                    <div className="text-[0.55rem] text-white/25 mt-0.5">{v.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Speed ── */}
        <div className={sectionBase}>
          <div className="flex justify-between items-center">
            <label className={`${labelBase} mb-0`}>
              {prefs.language === 'fr' ? 'Vitesse' : 'Speed'}
            </label>
            <span className="text-[0.7rem] text-red-300 font-mono font-semibold">
              {prefs.speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range" min="0.5" max="2.0" step="0.05"
            value={prefs.speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-cf-red h-1"
          />
          <div className="flex justify-between text-[0.5rem] text-white/20 font-mono">
            <span>0.5× Slow</span><span>1.0× Normal</span><span>2.0× Fast</span>
          </div>
        </div>

        {/* ── Pitch ── */}
        <div className={sectionBase}>
          <div className="flex justify-between items-center">
            <label className={`${labelBase} mb-0`}>
              {prefs.language === 'fr' ? 'Tonalité' : 'Pitch'}
            </label>
            <span className="text-[0.7rem] text-cf-gold font-mono font-semibold">
              {prefs.pitch >= 1.0 ? '+' : ''}{((prefs.pitch - 1.0) * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range" min="0.5" max="1.5" step="0.05"
            value={prefs.pitch}
            onChange={e => setPitch(parseFloat(e.target.value))}
            className="w-full accent-cf-gold h-1"
          />
          <div className="flex justify-between text-[0.5rem] text-white/20 font-mono">
            <span>Low</span><span>Natural</span><span>High</span>
          </div>
        </div>

        {/* ── Volume ── */}
        <div className={sectionBase}>
          <div className="flex justify-between items-center">
            <label className={`${labelBase} mb-0`}>
              <Volume2 size={9} className="inline mr-1" />
              {prefs.language === 'fr' ? 'Volume' : 'Volume'}
            </label>
            <span className="text-[0.7rem] text-white/50 font-mono">
              {Math.round(prefs.volume * 100)}%
            </span>
          </div>
          <input
            type="range" min="0.1" max="1.0" step="0.05"
            value={prefs.volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-full accent-white/40 h-1"
          />
        </div>

        {/* ── Toggles ── */}
        <div className={sectionBase}>
          {[
            {
              label: prefs.language === 'fr' ? 'Lecture auto' : 'Auto-play responses',
              desc:  prefs.language === 'fr' ? 'Lire automatiquement les réponses' : 'Read AI replies aloud automatically',
              value: prefs.autoPlay,
              set:   setAutoPlay,
            },
            {
              label: prefs.language === 'fr' ? 'Tester au changement' : 'Preview on change',
              desc:  prefs.language === 'fr' ? 'Jouer un exemple à chaque changement' : 'Play a sample whenever a setting changes',
              value: prefs.testOnChange,
              set:   setTestOnChange,
            },
          ].map(t => (
            <div key={t.label} className="flex items-center justify-between gap-2.5">
              <div>
                <div className="text-[0.65rem] text-white/60 font-mono">
                  {t.label}
                </div>
                <div className="text-[0.55rem] text-white/25 mt-px">{t.desc}</div>
              </div>
              <button
                onClick={() => t.set(!t.value)}
                className="w-10 h-[22px] rounded-[11px] border-none cursor-pointer relative shrink-0 transition-colors duration-200"
                style={{
                  background: t.value ? 'rgba(122,200,150,0.4)' : 'rgba(255,255,255,0.08)',
                }}
              >
                <div className="w-4 h-4 rounded-full absolute top-[3px] transition-all duration-200"
                  style={{
                    background: t.value ? '#7ac896' : 'rgba(255,255,255,0.25)',
                    left: t.value ? 21 : 3,
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* ── Preview ── */}
        <button
          onClick={handlePreview}
          disabled={previewing}
          className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-mono text-[0.65rem] tracking-[0.1em] uppercase transition-all duration-200"
          style={{
            cursor: previewing ? 'default' : 'pointer',
            background: previewing ? 'rgba(204,51,51,0.06)' : 'rgba(204,51,51,0.18)',
            border: `1px solid ${previewing ? 'rgba(204,51,51,0.15)' : 'rgba(204,51,51,0.45)'}`,
            color: previewing ? 'rgba(255,136,136,0.4)' : '#ff8888',
          }}
        >
          <Play size={12} style={{ animation: previewing ? 'pulse 1s infinite' : 'none' }} />
          {previewing
            ? (prefs.language === 'fr' ? 'Lecture en cours…' : 'Playing…')
            : (prefs.language === 'fr' ? 'Tester la voix' : `Preview · ${selectedVoice?.name || prefs.voiceId}`)}
        </button>

        {/* ── Current selection summary ── */}
        <div className="text-[0.55rem] text-white/20 font-mono text-center tracking-[0.05em]">
          {prefs.voiceId} · {prefs.speed}x · vol {Math.round(prefs.volume * 100)}%
          {saving ? ' · ☁ syncing' : user ? ' · ☁ synced' : cookieConsent ? ' · 🍪 saved' : ' · session only'}
        </div>
      </div>
    </motion.div>
  );
}
