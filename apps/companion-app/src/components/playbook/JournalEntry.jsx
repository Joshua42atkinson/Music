import React, { useState, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';
import { useAuth } from '../../hooks/useAuth';
import { useAutoSave } from '../../hooks/useAutoSave';
import { db } from '../../data/localDatabase';
import { supabase } from '../../lib/supabase';
import { JOURNAL_PROMPTS, JOURNAL_MOODS } from '../../data/playbookData';

// ═══════════════════════════════════════════════════════════
// JOURNAL ENTRY — Post-session reflection modal
// Appears after a tool session ends. Shows a curated prompt,
// mood selector, and free-text area. Saves to IndexedDB.
// ═══════════════════════════════════════════════════════════

export default function JournalEntry({ fretId, toolId, onClose, onSave }) {
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const lang = locale;
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  
  // Auto-save journal entry
  const journalData = { mood, text, fretId, toolId };
  const { forceSave } = useAutoSave(`journal_${fretId}_${toolId}`, journalData, 2000);

  // Pick a random curated prompt for this fret
  const [prompt] = useState(() => {
    const prompts = JOURNAL_PROMPTS[fretId] || JOURNAL_PROMPTS[1];
    const picked = prompts[Math.floor(Math.random() * prompts.length)];
    return picked[lang] || picked.en;
  });

  const handleSave = async () => {
    if (!text.trim() && !mood) { onClose?.(); return; }
    const entry = {
      fretId,
      toolId,
      timestamp: new Date().toISOString(),
      mood: mood || 'neutral',
      prompt,
      text: text.trim(),
    };
    try {
      // 1. Always save to IndexedDB (local, fast, works offline)
      await db.journal.add(entry);

      // 2. If logged in, also save to Supabase cloud
      if (user && supabase) {
        try {
          const { error } = await supabase.from('journal_entries').insert({
            user_id: user.id,
            fret_id: fretId,
            entry_type: 'text',
            body: text.trim(),
            mood: mood || 'neutral',
            prompt,
            created_at: entry.timestamp,
          });
          if (error) throw error;
          console.log('[JournalEntry] Synced to Supabase cloud');
        } catch (cloudErr) {
          console.warn('[JournalEntry] Cloud sync failed (saved locally):', cloudErr);
        }
      }

      setSaved(true);
      setTimeout(() => { onSave?.(); onClose?.(); }, 1200);
    } catch (e) {
      console.warn('[Playbook] Failed to save journal entry:', e);
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-[12px] flex items-center justify-center p-5">
      <div className="bg-[#0d0d14] border border-cf-gold/20 rounded-[20px] p-6 w-full max-w-[400px] flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <span className="text-[2rem]">📓</span>
          <h3 className="font-heading text-[1.3rem] font-semibold text-vv-text m-[8px_0_2px]">
            {t('sessionReflection')}
          </h3>
          <p className="font-mono text-[0.65rem] text-cf-gold/50 tracking-[0.12em] m-0">
            {t('questFret')} {fretId}
          </p>
        </div>

        {/* Mood selector */}
        <div>
          <p className="font-mono text-[0.6rem] text-white/35 tracking-[0.1em] uppercase mb-2">
            {t('howAreYouFeeling')}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {JOURNAL_MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className="flex-1 min-w-[55px] py-2 px-1 rounded-[10px] border cursor-pointer flex flex-col items-center gap-[3px] transition-all duration-200"
                style={{
                  borderColor: mood === m.id ? 'var(--cf-gold)' : 'rgba(255,255,255,0.08)',
                  background: mood === m.id ? 'rgba(var(--cf-gold-rgb),0.12)' : 'rgba(255,255,255,0.03)',
                  transform: mood === m.id ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span className="text-[1.1rem]">{m.emoji}</span>
                <span className="font-mono text-[0.5rem] tracking-[0.05em]" style={{ color: mood === m.id ? 'var(--cf-gold)' : 'rgba(255,255,255,0.4)' }}>
                  {m[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="py-3.5 px-3.5 rounded-xl bg-cf-gold/[0.06] border border-cf-gold/15">
          <p className="font-quote text-base italic text-cf-gold leading-[1.6] m-0 text-center">"{prompt}"</p>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('yourThoughts')}
          rows={5}
          className="w-full py-3.5 px-3.5 rounded-xl text-[0.9rem] leading-[1.7] bg-white/[0.04] border border-white/10 text-[#e8edf2] outline-none resize-y font-body focus:border-white/20 transition-colors"
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-[10px] bg-white/5 border border-white/10 text-white/40 text-[0.75rem] font-mono cursor-pointer hover:bg-white/[0.08] transition-colors">
            {t('skipBtn')}
          </button>
          <button onClick={handleSave} className="flex-[2] py-3 rounded-[10px] border text-[0.75rem] font-mono font-semibold cursor-pointer transition-all duration-300"
            style={{
              background: saved ? 'rgba(122,170,136,0.2)' : 'rgba(var(--cf-gold-rgb),0.15)',
              borderColor: saved ? 'rgba(122,170,136,0.4)' : 'rgba(var(--cf-gold-rgb),0.3)',
              color: saved ? '#7aaa88' : 'var(--cf-gold)',
            }}
          >
            {saved ? t('savedReflection') : t('saveReflection')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Journal Feed — shows all past entries ──
export function JournalFeed() {
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        let all = [];
        if (user && supabase) {
          // Logged in — fetch from Supabase
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (!error && data) {
            all = data.map(row => ({
              id: row.id,
              fretId: row.fret_id,
              timestamp: row.created_at,
              mood: row.mood || 'neutral',
              prompt: row.prompt || row.title,
              text: row.body || row.content,
            }));
          }
        }
        // Fallback / supplement with IndexedDB
        if (all.length === 0) {
          all = await db.journal.orderBy('timestamp').reverse().toArray();
        }
        setEntries(all);
      } catch { /* IndexedDB may not be available */ }
    };
    load();
  }, [user]);

  const moodMap = {};
  JOURNAL_MOODS.forEach(m => { moodMap[m.id] = m; });

  if (entries.length === 0) {
    return (
      <div className="py-10 px-5 text-center">
        <p className="text-[2rem] mb-3">📓</p>
        <p className="font-quote text-[1.1rem] italic text-white/40">
          {t('emptyJournal')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-[500px] mx-auto">
      <h3 className="font-mono text-[0.65rem] text-cf-gold/50 tracking-[0.25em] uppercase text-center mb-5">
        {t('journalTitle')}
      </h3>

      <div className="flex flex-col gap-2.5">
        {entries.map(entry => {
          const m = moodMap[entry.mood];
          return (
            <div key={entry.id} className="py-3.5 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[0.6rem] text-white/35">
                  {t('questFret')} {entry.fretId} · {new Date(entry.timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
                {m && <span className="text-[0.9rem]">{m.emoji}</span>}
              </div>
              {entry.prompt && (
                <p className="font-quote text-[0.85rem] italic text-cf-gold/50 mb-1.5 leading-[1.5]">
                  "{entry.prompt}"
                </p>
              )}
              {entry.text && (
                <p className="text-[0.9rem] text-white/60 leading-[1.7]">
                  {entry.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

