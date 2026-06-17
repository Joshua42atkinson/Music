// ═══════════════════════════════════════════════════════════
// STORAGE — localStorage wrapper with vv_ namespace + migration
// Reads legacy keys on miss, writes new keys only.
// ═══════════════════════════════════════════════════════════

import { LEGACY_KEY_MAP } from './storageKeys';

const MIGRATION_FLAG = 'vv_storage_migrated_v1';

/**
 * One-time migration: copy values from legacy keys to new vv_ keys,
 * then remove the legacy keys. Safe to run on every boot (idempotent).
 */
export function migrateStorage() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  for (const [legacyKey, newKey] of Object.entries(LEGACY_KEY_MAP)) {
    const value = localStorage.getItem(legacyKey);
    if (value !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, value);
    }
    localStorage.removeItem(legacyKey);
  }

  localStorage.setItem(MIGRATION_FLAG, 'true');
}

/** Get item — reads new key first, falls back to legacy key. */
export function vvGet(key) {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  if (value !== null) return value;

  // Reverse lookup: find legacy key that maps to this new key
  for (const [legacy, current] of Object.entries(LEGACY_KEY_MAP)) {
    if (current === key) {
      const legacyValue = localStorage.getItem(legacy);
      if (legacyValue !== null) return legacyValue;
    }
  }
  return null;
}

/** Set item — always writes the new key. */
export function vvSet(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

/** Remove item — removes the new key only. */
export function vvRemove(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/** Parse JSON safely. Returns fallback on error. */
export function vvGetJSON(key, fallback = null) {
  try {
    const raw = vvGet(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Stringify and store JSON. */
export function vvSetJSON(key, value) {
  vvSet(key, JSON.stringify(value));
}
