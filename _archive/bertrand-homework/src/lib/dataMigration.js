// ═══════════════════════════════════════════════════════════
// DATA MIGRATION — LocalStorage → Supabase on first login
// Preserves existing student progress when they sign in.
// ═══════════════════════════════════════════════════════════

import { supabase } from './supabase';

const MIGRATION_KEY = 'voixvive_migrated_v1';

/**
 * Check if user has already migrated.
 */
export function hasMigrated() {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}

/**
 * Read all local traction data.
 */
function readLocalTraction() {
  try {
    const raw = localStorage.getItem('voixvive_traction');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Read all local journal entries.
 */
function readLocalJournal() {
  try {
    const raw = localStorage.getItem('voixvive_journal');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Read practice log (if stored separately).
 */
function readLocalPracticeLog() {
  try {
    const raw = localStorage.getItem('voixvive_practice_log');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Migrate local data to Supabase.
 * Called once on first successful login.
 */
export async function migrateLocalToCloud(userId) {
  if (!userId) return { success: false, error: 'No user ID' };
  if (hasMigrated()) return { success: true, skipped: true };

  const results = { traction: 0, journal: 0, practice: 0, errors: [] };

  try {
    // ── 1. Migrate traction (fret progress) ────────────────────
    const localTraction = readLocalTraction();
    if (localTraction) {
      const frets = localTraction.frets || {};
      const tractionRows = Object.entries(frets).map(([fretId, data]) => ({
        user_id: userId,
        fret_id: parseInt(fretId, 10),
        traction_pct: data.traction || 0,
        attempts: (data.beAttempts || 0) + (data.doAttempts || 0) + (data.playAttempts || 0),
        completed: data.traction >= 100,
      }));

      if (tractionRows.length > 0) {
        const { error } = await supabase
          .from('traction')
          .upsert(tractionRows, { onConflict: ['user_id', 'fret_id'] });
        if (error) results.errors.push(`traction: ${error.message}`);
        else results.traction = tractionRows.length;
      }

      // Update profile summary
      await supabase.from('profiles').upsert({
        id: userId,
        bard_level: localTraction.bardLevel || 1,
        practice_minutes: localTraction.practiceMinutes || 0,
        streak: localTraction.streak || 0,
        traction_data: localTraction,
      }, { onConflict: 'id' });
    }

    // ── 2. Migrate journal entries ──────────────────────────────
    const localJournal = readLocalJournal();
    if (localJournal.length > 0) {
      const journalRows = localJournal.map(entry => ({
        user_id: userId,
        fret_id: entry.fretId || null,
        content: entry.content || entry.text || '',
        mood: entry.mood || null,
        entry_type: 'journal',
        created_at: entry.timestamp || entry.created_at || new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('journal_entries')
        .insert(journalRows);
      if (error) results.errors.push(`journal: ${error.message}`);
      else results.journal = journalRows.length;
    }

    // ── 3. Mark migration complete ────────────────────────────────
    localStorage.setItem(MIGRATION_KEY, 'true');
    results.success = true;

  } catch (err) {
    results.errors.push(err.message);
    results.success = false;
  }

  return results;
}

/**
 * Load cloud data into local state.
 * Called on app start when user is already logged in.
 */
export async function loadCloudData(userId) {
  if (!userId) return null;

  try {
    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Load traction
    const { data: tractionRows } = await supabase
      .from('traction')
      .select('*')
      .eq('user_id', userId);

    // Load journal
    const { data: journalRows } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return {
      profile: profile || {},
      traction: tractionRows || [],
      journal: journalRows || [],
    };
  } catch (err) {
    console.error('loadCloudData failed:', err);
    return null;
  }
}
