// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : progressSyncEngine.ts                              ║
// ║ WHAT    : Offline-first persistence layer: localStorage →    ║
// ║           IndexedDB → Supabase cloud merge.                 ║
// ║ WHY     : ScaffoldingProvider was a god object. This isolates║
// ║           all sync IO so the React layer stays thin.         ║
// ║ RULES   : Never block the UI. Always write local first.     ║
// ║           Supabase is a background sync, not a dependency.  ║
// ╚═══════════════════════════════════════════════════════════════╝
import type { TractionState } from '../data/tractionStore';
import {
  loadTraction,
  saveTraction,
  mergeTractionStates,
  CURRENT_TRACTION_SCHEMA,
  migrateTractionState,
} from '../data/tractionStore';
import { saveProgress, getProgress } from '../data/localDatabase';
import { getTractionState, saveTractionState, migrateLocalToCloud } from './supabase';
import { devLog, devWarn } from './devLog';

/**
 * Hydrate traction state — IndexedDB is the source of truth.
 *
 * On every boot, we read BOTH IndexedDB and localStorage, compare
 * their `_persistedAt` timestamps, and use the newer one. If the
 * chosen source differs from the other, we sync it back so both
 * layers stay consistent.
 *
 * This resolves the dual-write problem (P5-dual-write):
 *  - Previously: localStorage was primary, IndexedDB was a fire-and-forget backup
 *  - Now:       IndexedDB is primary, localStorage is a synchronous read cache
 *
 * @returns The restored state, or null if both layers are empty.
 */
export async function hydrateFromIndexedDB(): Promise<TractionState | null> {
  const localState = loadTraction();
  const localFresh = localState._persistedAt || 0;

  try {
    const idbState = await getProgress();
    if (idbState) {
      const migrated = migrateTractionState(idbState);
      const idbFresh = migrated._persistedAt || 0;

      if (idbFresh >= localFresh) {
        // IndexedDB is newer (or tied) — use it as source of truth
        if (idbFresh > localFresh) {
          saveTraction(migrated); // sync back to localStorage cache
          devLog('[VoixVive] IndexedDB was fresher than localStorage; synced to cache.');
        }
        return migrated;
      }
    }
  } catch (err) {
    devWarn('[VoixVive] IndexedDB read failed during hydration:', err);
  }

  // Fall back to localStorage if IndexedDB is empty or older
  const isEmptyState = !localState._schemaVersion || localState._schemaVersion < CURRENT_TRACTION_SCHEMA;
  if (!isEmptyState) {
    // localStorage has data and IndexedDB is stale/empty — sync to IndexedDB
    saveProgress(localState).catch(() => {});
    return localState;
  }

  return null;
}

/**
 * Sync local traction with Supabase on user login.
 * Merges local + cloud, writes back to both.
 * @param userId — Supabase auth user id
 * @returns The merged traction state, or null.
 */
export async function syncWithCloud(userId: string): Promise<TractionState | null> {
  try {
    const cloudTractionRaw = await getTractionState(userId);
    const currentLocal = loadTraction();

    if (cloudTractionRaw) {
      console.info('[VoixVive] Merging local state with Supabase cloud...');
      const cloudTraction = migrateTractionState(cloudTractionRaw);
      const merged = mergeTractionStates(currentLocal, cloudTraction);
      saveTraction(merged);
      await saveTractionState(userId, merged);
      console.info('[VoixVive] Cloud state synchronized successfully.');
      return merged;
    }

    // No cloud data yet — migrate existing local progress
    await migrateLocalToCloud(userId, currentLocal);
    return currentLocal;
  } catch (err) {
    console.error('[VoixVive] Supabase sync failed:', err);
    return null;
  }
}

/**
 * Persist traction state to all storage layers.
 * Writes: IndexedDB (source of truth, awaited) → localStorage (cache) → Supabase (cloud).
 *
 * P5-dual-write fix: IndexedDB is now the authoritative layer.
 * We await IndexedDB completion before writing localStorage so that
 * `_persistedAt` on IndexedDB is always >= localStorage. If IndexedDB
 * fails, we still write localStorage as a graceful degradation — the
 * next hydration will detect localStorage is newer and sync it back.
 *
 * @param state — the full traction state
 * @param userId — if logged in, also sync to Supabase
 */
export async function persistTraction(state: TractionState, userId: string | null = null): Promise<void> {
  const stamped = { ...state, _persistedAt: Date.now() };

  // 1. Durable IndexedDB — source of truth, awaited
  try {
    await saveProgress(stamped);
  } catch (err) {
    devWarn('[VoixVive] IndexedDB write failed, falling back to localStorage only:', err);
  }

  // 2. Fast localStorage — synchronous read cache
  saveTraction(stamped);

  // 3. Cloud Supabase — async, non-blocking, only if logged in
  if (userId) {
    saveTractionState(userId, stamped).catch((err: Error) => {
      devWarn('[VoixVive] Background Supabase sync failed:', err);
    });
  }
}

/**
 * Subscribe to cross-tab localStorage changes.
 * Returns an unsubscribe function.
 * @param onChange — callback with parsed traction
 * @returns unsubscribe
 */
export function subscribeToStorageSync(onChange: (newState: TractionState) => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === 'bard_traction' || e.key === null) {
      onChange(loadTraction());
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
