import Dexie from 'dexie';

// ═══════════════════════════════════════════════════════════
// VOIX VIVE LOCAL PERMANENCE
// IndexedDB schema for offline capability and Local-First sync
// ═══════════════════════════════════════════════════════════

export const db = new Dexie('VoixViveDatabase');

db.version(1).stores({
  // Stores basic connection info to find Bertrand's dynamic tunnel
  settings: 'key, value',
  
  // Student's local progress (what slides they've seen, time spent)
  progress: 'chapterId, completed, lastAccessed',
  
  // Local cache of direct messages
  messages: '++id, serverId, text, sender, timestamp, isSynced',
  
  // Homework outbox queue (videos ready to sync when online)
  outbox: '++id, chapterId, blob, status' // status: 'queued', 'syncing', 'synced'
});

// Helper functions for Connection Discovery
export async function setServerTunnel(url) {
  await db.settings.put({ key: 'server_tunnel', value: url });
}

export async function getServerTunnel() {
  const record = await db.settings.get('server_tunnel');
  return record ? record.value : null;
}
