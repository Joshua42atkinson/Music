import React, { useState, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';
import { useAuth } from '../../hooks/useAuth';
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
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerIcon}>📓</span>
          <h3 style={styles.headerTitle}>
            {t('sessionReflection')}
          </h3>
          <p style={styles.headerSub}>
            {t('questFret')} {fretId}
          </p>
        </div>

        {/* Mood selector */}
        <div style={styles.moodSection}>
          <p style={styles.moodLabel}>
            {t('howAreYouFeeling')}
          </p>
          <div style={styles.moodRow}>
            {JOURNAL_MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                style={{
                  ...styles.moodBtn,
                  borderColor: mood === m.id ? '#c9a96e' : 'rgba(255,255,255,0.08)',
                  background: mood === m.id ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.03)',
                  transform: mood === m.id ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span style={styles.moodEmoji}>{m.emoji}</span>
                <span style={{ ...styles.moodText, color: mood === m.id ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>
                  {m[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div style={styles.promptBox}>
          <p style={styles.promptText}>"{prompt}"</p>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('yourThoughts')}
          rows={5}
          style={styles.textarea}
        />

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.skipBtn}>
            {t('skipBtn')}
          </button>
          <button onClick={handleSave} style={{
            ...styles.saveBtn,
            background: saved ? 'rgba(122,170,136,0.2)' : 'rgba(201,169,110,0.15)',
            borderColor: saved ? 'rgba(122,170,136,0.4)' : 'rgba(201,169,110,0.3)',
            color: saved ? '#7aaa88' : '#c9a96e',
          }}>
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
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📓</p>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {t('emptyJournal')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3 style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        color: 'rgba(201,169,110,0.5)',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        {t('journalTitle')}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.map(entry => {
          const m = moodMap[entry.mood];
          return (
            <div key={entry.id} style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  {t('questFret')} {entry.fretId} · {new Date(entry.timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
                {m && <span style={{ fontSize: '0.9rem' }}>{m.emoji}</span>}
              </div>
              {entry.prompt && (
                <p style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  color: 'rgba(201,169,110,0.5)',
                  marginBottom: '6px',
                  lineHeight: 1.5,
                }}>
                  "{entry.prompt}"
                </p>
              )}
              {entry.text && (
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                }}>
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

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#0d0d14',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: '20px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: { textAlign: 'center' },
  headerIcon: { fontSize: '2rem' },
  headerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: '8px 0 2px',
  },
  headerSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(201,169,110,0.5)',
    letterSpacing: '0.12em',
    margin: 0,
  },
  moodSection: {},
  moodLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  moodRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  moodBtn: {
    flex: '1 1 0',
    minWidth: '55px',
    padding: '8px 4px',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    transition: 'all 0.2s ease',
  },
  moodEmoji: { fontSize: '1.1rem' },
  moodText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.5rem',
    letterSpacing: '0.05em',
  },
  promptBox: {
    padding: '14px',
    borderRadius: '12px',
    background: 'rgba(201,169,110,0.06)',
    border: '1px solid rgba(201,169,110,0.15)',
  },
  promptText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#c9a96e',
    lineHeight: 1.6,
    margin: 0,
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8edf2',
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  skipBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.75rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 2,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
