import React from 'react';

// ═══════════════════════════════════════════════════════════
// CONNECTION MANAGER — Dormant until DaaS Backend Exists
// 
// Previously: Showed a "Connect to Voix Vive" modal on first load,
// asking students for a server tunnel URL they don't have.
// This was the #1 student-experience blocker.
//
// Current: Renders nothing. The Dexie IndexedDB schema in
// localDatabase.js is still available for when the Tauri/Rust
// backend is built. Re-enable this component when the Axum
// server and Cloudflare Tunnel are operational.
// ═══════════════════════════════════════════════════════════

export default function ConnectionManager() {
  // Intentionally renders nothing.
  // The local database (Dexie) is initialized elsewhere and
  // remains available for offline progress tracking.
  return null;
}
