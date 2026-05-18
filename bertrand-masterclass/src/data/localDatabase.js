import Dexie from 'dexie';

// ═══════════════════════════════════════════════════════════
// VOIX VIVE LOCAL PERMANENCE
// IndexedDB schema for offline-first, permanent student progress.
//
// Architecture:
//   - tractionStore.js / localStorage = fast primary read/write (sync, instant)
//   - localDatabase.js / IndexedDB    = durable backup (async, survives clears)
//
// On boot, ScaffoldingProvider checks IndexedDB first if localStorage is empty.
// On every traction write, ScaffoldingProvider also writes to IndexedDB.
// ═══════════════════════════════════════════════════════════

export const db = new Dexie('VoixViveDatabase');

db.version(1).stores({
  // Key/value store for settings and server config
  settings: 'key, value',

  // Student's local progress (per-fret telemetry)
  progress: 'fretId, completed, lastAccessed',

  // Local cache of direct messages
  messages: '++id, serverId, text, sender, timestamp, isSynced',

  // Homework outbox queue (videos ready to sync when online)
  outbox: '++id, fretId, blob, status', // status: 'queued', 'syncing', 'synced'
});

// ─────────────────────────────────────────────────────────────
// TRACTION PERSISTENCE — Full state backup to IndexedDB
// Key: 'traction_state' in the settings table
// ─────────────────────────────────────────────────────────────

/**
 * Save the entire traction state object to IndexedDB.
 * Called by ScaffoldingProvider on every state change.
 * Non-blocking — failures are logged but don't crash the app.
 */
export async function saveProgress(tractionState) {
  try {
    await db.settings.put({
      key: 'traction_state',
      value: JSON.stringify(tractionState),
    });
  } catch (e) {
    console.warn('[VoixVive] IndexedDB saveProgress failed:', e);
  }
}

/**
 * Load the traction state from IndexedDB.
 * Returns the parsed object, or null if nothing is stored yet.
 * Called by ScaffoldingProvider on first mount as a fallback
 * when localStorage is empty (e.g., after a browser data clear).
 */
export async function getProgress() {
  try {
    const record = await db.settings.get('traction_state');
    if (!record) return null;
    return JSON.parse(record.value);
  } catch (e) {
    console.warn('[VoixVive] IndexedDB getProgress failed:', e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE POSITION PERSISTENCE — Remember where student left off
// ─────────────────────────────────────────────────────────────

/**
 * Save the last-viewed slide index for a given fret.
 * Stored in localStorage for instant sync reads in SlideViewer.
 */
export function saveSlidePosition(fretId, slideIndex) {
  try {
    localStorage.setItem(`voixvive-slide-${fretId}`, String(slideIndex));
  } catch (e) {
    console.warn('[VoixVive] saveSlidePosition failed:', e);
  }
}

/**
 * Retrieve the last-viewed slide index for a given fret.
 * Returns 0 (first slide) if no position is stored.
 */
export function getSlidePosition(fretId) {
  try {
    const stored = localStorage.getItem(`voixvive-slide-${fretId}`);
    return stored !== null ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// SERVER DISCOVERY (DaaS tunnel URL)
// ─────────────────────────────────────────────────────────────

export async function setServerTunnel(url) {
  await db.settings.put({ key: 'server_tunnel', value: url });
}

export async function getServerTunnel() {
  const record = await db.settings.get('server_tunnel');
  return record ? record.value : null;
}
