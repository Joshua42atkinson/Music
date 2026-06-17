// ═══════════════════════════════════════════════════════════
// SUPABASE STUB — Supabase removed (M5)
// Exports null so all `if (!supabase)` guards still work.
// ═══════════════════════════════════════════════════════════

const supabase = null;

export { supabase };
export default supabase;

// Auth helpers — all return null/disabled
export async function signInWithGoogle() { throw new Error('Supabase removed — auth disabled'); }
export async function signOut() {}
export async function getCurrentUser() { return null; }
export async function getSession() { return null; }
export async function getProfile() { return null; }
export async function upsertProfile() { return null; }
export async function getProgress() { return null; }
export async function saveProgress() { return null; }
export async function getTractionState() { return null; }
export async function saveTractionState() { return null; }
export async function migrateLocalToCloud() { return null; }
