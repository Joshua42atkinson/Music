// ═══════════════════════════════════════════════════════════
// SUPABASE CLIENT — Voix Vive
// Single source of truth for all Supabase interactions.
// Falls back to localStorage when offline (Phase 1 compat).
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // We handle this manually in AuthCallback
    },
  });
  console.log('[Supabase] Client initialized');
} else {
  console.warn('[Supabase] Missing env vars — running in offline mode');
}

export { supabase };
export default supabase;

// ═══════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ═══════════════════════════════════════════════════════════
// PROFILE HELPERS
// ═══════════════════════════════════════════════════════════

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════
// PROGRESS HELPERS
// ═══════════════════════════════════════════════════════════

export async function getProgress(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function saveProgress(userId, fretId, slideIndex, completed) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      fret_id: fretId,
      slide_index: slideIndex,
      completed,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,fret_id,slide_index' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════
// TRACTION STATE HELPERS (ScaffoldingProvider cloud sync)
// ═══════════════════════════════════════════════════════════

export async function getTractionState(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('traction_data')
    .eq('id', userId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Row not found
    throw error;
  }
  return data?.traction_data || null;
}

export async function saveTractionState(userId, tractionData) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      traction_data: tractionData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════
// DATA MIGRATION — Local → Cloud on first login
// ═══════════════════════════════════════════════════════════

export async function migrateLocalToCloud(userId, localTraction) {
  if (!supabase) return null;

  // Check if user already has cloud data
  const existing = await getTractionState(userId);
  if (existing) {
    console.log('[Supabase] Cloud traction already exists, skipping migration');
    return existing;
  }

  // Upload local data
  console.log('[Supabase] Migrating local traction to cloud...');
  await saveTractionState(userId, localTraction);

  // Also create a default student profile if none exists
  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!studentProfile) {
    await supabase.from('student_profiles').insert({
      user_id: userId,
      name: localTraction.name || 'Troubadour',
      current_chapter: localTraction.bardLevel || 1,
      bard_level: localTraction.bardLevel || 1,
      xp: localTraction.totalTraction || 0,
      florins: 0,
      instrument: 'guitar',
    });
    console.log('[Supabase] Created default student profile');
  }

  console.log('[Supabase] Migration complete');
  return localTraction;
}
