// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : localDatabase.js                                   ║
// ║ WHAT    : Durable IndexedDB backup — 10 tables via Dexie.js  ║
// ║ WHY     : localStorage clears on browser data reset; this    ║
// ║           survives. It is the offline-first safety net.       ║
// ║ WHO     : No UI — written to by game, textbook, profile flow ║
// ║ OWNS    : vertiscaleSessions, studentProfile, journal, outbox ║
// ║ NEEDS   : Dexie (npm) — no other dependencies               ║
// ║ RULES   : Never delete tables between schema versions — add  ║
// ║           only. studentProfile uses id=1 until Supabase auth  ║
// ║           Never block the UI waiting on an async db call      ║
// ║ FIX AT  : Open DevTools → Application → IndexedDB → voix_vive║
// ║           If missing: check Dexie version / schema mismatch   ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                   ║
// ╚═══════════════════════════════════════════════════════════════╝
import Dexie from 'dexie';
import { vvGet, vvSet } from '../lib/storage';

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

const V1_TABLES = {
  settings: 'key, value',
  progress: 'fretId, completed, lastAccessed',
  messages: '++id, serverId, text, sender, timestamp, isSynced',
  outbox: '++id, fretId, blob, status',
  vertiscaleSessions: '++id, phase, patternId, timestamp, successful',
};

const V2_TABLES = {
  ...V1_TABLES,
  songs: '++id, title, timestamp, isFavorite',
};

const V3_TABLES = {
  ...V2_TABLES,
  journal: '++id, fretId, toolId, timestamp, mood',
  studentProfile: 'id, name, createdAt',
  questLog: '++id, fretId, event, timestamp',
  aiNarration: '++id, type, contextKey, timestamp',
};

const V4_TABLES = {
  ...V3_TABLES,
  recordings: '++id, exerciseName, timestamp, duration, blobUrl, reviewed, feedback',
};

db.version(1).stores(V1_TABLES);
db.version(2).stores(V2_TABLES);
db.version(3).stores(V3_TABLES);
db.version(4).stores(V4_TABLES);

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
    vvSet(`vv_slide_${fretId}`, String(slideIndex));
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
    const stored = vvGet(`vv_slide_${fretId}`);
    return stored !== null ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Get chapter progress state for display in the NeckMenu.
 * @param {number} fretId — chapter ID (1-12)
 * @param {number} totalSlides — total slides in this chapter
 * @returns {'not-started'|'in-progress'|'completed'}
 */
export function getChapterProgress(fretId, totalSlides) {
  const pos = getSlidePosition(fretId);
  if (pos === 0) return 'not-started';
  if (pos >= totalSlides - 1) return 'completed';
  return 'in-progress';
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
