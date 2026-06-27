import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useVoicePreferences.js                               ║
// ║ WHAT    : Manages all Kokoro TTS voice settings with           ║
// ║           cookie persistence (if consented) + Supabase sync.   ║
// ║ WHY     : Audio is #1 priority — settings must survive refresh,║
// ║           device changes, and login/logout cleanly             ║
// ║ WHO     : student (all users, logged in or not)                ║
// ║ OWNS    : voiceId, speed, pitch, volume, autoPlay, language    ║
// ║ NEEDS   : supabase from ../lib/supabase (optional — graceful   ║
// ║           degradation to cookie state if no auth)              ║
// ║ RULES   : Always read from cookie first if consented.          ║
// ║           Supabase sync is async best-effort — never blocking. ║
// ║           French locale auto-selects ff_siwis voice.           ║
// ║ FIX AT  : If settings reset on login, check Supabase upsert.  ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { vvGet, vvSet, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ── All Kokoro-82M voices available in kokoro-js ──────────────────
export const KOKORO_VOICES = {
  en: {
    label: 'English',
    male: [
      { id: 'am_adam',    name: 'Adam',    desc: 'Warm, authoritative' },
      { id: 'am_michael', name: 'Michael', desc: 'Clear, professional' },
      { id: 'am_fenrir',  name: 'Fenrir',  desc: 'Deep, dramatic' },
      { id: 'am_echo',    name: 'Echo',    desc: 'Bright, energetic' },
      { id: 'am_puck',    name: 'Puck',    desc: 'Playful, light' },
      { id: 'am_liam',    name: 'Liam',    desc: 'Friendly, natural' },
      { id: 'am_onyx',    name: 'Onyx',    desc: 'Rich, smooth' },
      { id: 'am_santa',   name: 'Santa',   desc: 'Warm, jovial' },
    ],
    female: [
      { id: 'af_heart',   name: 'Heart',   desc: 'Warm, intimate' },
      { id: 'af_bella',   name: 'Bella',   desc: 'Expressive, musical' },
      { id: 'af_nicole',  name: 'Nicole',  desc: 'Clear, professional' },
      { id: 'af_sky',     name: 'Sky',     desc: 'Bright, uplifting' },
      { id: 'af_sarah',   name: 'Sarah',   desc: 'Natural, conversational' },
      { id: 'af_nova',    name: 'Nova',    desc: 'Confident, dynamic' },
      { id: 'af_alloy',   name: 'Alloy',   desc: 'Balanced, versatile' },
      { id: 'af_jessica', name: 'Jessica', desc: 'Warm, expressive' },
    ],
  },
  fr: {
    label: 'Français',
    male: [
      { id: 'fm_gaston', name: 'Gaston', desc: 'Voix française naturelle' },
    ],
    female: [
      { id: 'ff_siwis',  name: 'Siwis',  desc: 'Voix française douce' },
    ],
  },
  gb: {
    label: 'British English',
    male: [
      { id: 'bm_george',  name: 'George',  desc: 'Classic British' },
      { id: 'bm_lewis',   name: 'Lewis',   desc: 'Modern British' },
      { id: 'bm_daniel',  name: 'Daniel',  desc: 'Refined, clear' },
    ],
    female: [
      { id: 'bf_emma',    name: 'Emma',    desc: 'Elegant, warm' },
      { id: 'bf_isabella',name: 'Isabella',desc: 'Rich, expressive' },
    ],
  },
};

const DEFAULTS = {
  voiceId:     'am_adam',
  speed:       1.0,
  pitch:       1.0,
  volume:      1.0,
  autoPlay:    true,
  language:    'en',         // 'en' | 'fr' | 'gb'
  testOnChange: false,
};

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function loadFromStorage() {
  const consent = getCookie('voixvive_cookie_consent') === 'true';
  if (consent) {
    try {
      const raw = getCookie('voixvive_voice_prefs');
      if (raw) return { ...DEFAULTS, ...JSON.parse(decodeURIComponent(raw)) };
    } catch { /* ignore */ }
  }
  // Try reading from old localStorage if no cookie was found yet, just for seamless migration
  try {
    const raw = vvGet(STORAGE_KEYS.VOICE_PREFS);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

export function useVoicePreferences({ user } = {}) {
  const [prefs, setPrefs] = useState(loadFromStorage);
  const [saving, setSaving] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => getCookie('voixvive_cookie_consent') === 'true');
  const syncTimeout = useRef(null);

  // ── Provide way to grant consent ─────────────────────────────
  const grantCookieConsent = useCallback(() => {
    setCookieConsent(true);
    setCookie('voixvive_cookie_consent', 'true', 365);
    // Write current prefs immediately
    setCookie('voixvive_voice_prefs', encodeURIComponent(JSON.stringify(prefs)), 365);
    
    // Cleanup old localStorage if it exists
    try {
      vvRemove(STORAGE_KEYS.VOICE_PREFS);
      vvRemove(STORAGE_KEYS.VOICE_ID);
      vvRemove(STORAGE_KEYS.TTS_SPEED);
    } catch { /* ignore */ }
  }, [prefs]);

  // ── Persist to cookie immediately on every change if consented ──
  useEffect(() => {
    if (cookieConsent && !user) {
      setCookie('voixvive_voice_prefs', encodeURIComponent(JSON.stringify(prefs)), 365);
    }
    // Also write legacy keys to localStorage ONLY IF consented, for fallback compat
    if (cookieConsent) {
      try {
        vvSet(STORAGE_KEYS.VOICE_ID,   prefs.voiceId);
        vvSet(STORAGE_KEYS.TTS_SPEED,  String(prefs.speed));
      } catch { /* ignore */ }
    }
  }, [prefs, cookieConsent, user]);

  // ── Load from Supabase on auth ───────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('user_voice_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setPrefs(prev => ({ ...prev, ...data.prefs }));
        }
      } catch { /* no prefs yet — that's fine */ }
    })();
  }, [user]);

  // ── Sync to Supabase (debounced 2s) ─────────────────────────
  const syncToSupabase = useCallback((newPrefs) => {
    if (!user || !supabase) return;
    clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        await supabase.from('user_voice_preferences').upsert({
          user_id: user.id,
          prefs: newPrefs,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      } catch (e) {
        devWarn('[VoicePrefs] Supabase sync failed:', e);
      } finally {
        setSaving(false);
      }
    }, 2000);
  }, [user]);

  // ── Individual setters ───────────────────────────────────────
  const update = useCallback((patch) => {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      syncToSupabase(next);
      return next;
    });
  }, [syncToSupabase]);

  const setVoiceId    = useCallback(v   => update({ voiceId: v }),    [update]);
  const setSpeed      = useCallback(v   => update({ speed: v }),      [update]);
  const setPitch      = useCallback(v   => update({ pitch: v }),      [update]);
  const setVolume     = useCallback(v   => update({ volume: v }),     [update]);
  const setAutoPlay   = useCallback(v   => update({ autoPlay: v }),   [update]);
  const setLanguage   = useCallback(v   => update({ language: v }),   [update]);
  const setTestOnChange = useCallback(v => update({ testOnChange: v }), [update]);

  // ── Reset to defaults ────────────────────────────────────────
  const resetDefaults = useCallback(() => {
    setPrefs(DEFAULTS);
    syncToSupabase(DEFAULTS);
  }, [syncToSupabase]);

  return {
    user,
    prefs,
    saving,
    cookieConsent,
    grantCookieConsent,
    setVoiceId,
    setSpeed,
    setPitch,
    setVolume,
    setAutoPlay,
    setLanguage,
    setTestOnChange,
    resetDefaults,
    update,
    // Convenience accessors
    voiceId:      prefs.voiceId,
    speed:        prefs.speed,
    pitch:        prefs.pitch,
    volume:       prefs.volume,
    autoPlay:     prefs.autoPlay,
    language:     prefs.language,
    testOnChange: prefs.testOnChange,
  };
}

