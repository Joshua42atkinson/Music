// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : bevyEventBus.js                                    ║
// ║ WHAT    : Module-level event bus for pitch → Bevy IPC       ║
// ║ WHY     : Replaces window.__BEVY_IPC_SEND / __LAST_SENT_MIDI║
// ║           globals with a proper typed event emitter.         ║
// ║ WHO     : usePitchDetector emits, useBevyIPC subscribes    ║
// ║ RULES   : Zero React deps — plain module, zero globals     ║
// ╚═══════════════════════════════════════════════════════════════╝

const _noteListeners = new Set();

/**
 * Emit a note-played event. Called by usePitchDetector on every
 * detected note that passes the MIDI-throttle gate.
 */
export function emitNotePlayed(payload) {
  _noteListeners.forEach(fn => {
    try { fn(payload); } catch { /* swallow */ }
  });
}

/**
 * Subscribe to note-played events. Called by useBevyIPC.
 * Returns an unsubscribe function.
 */
export function onNotePlayed(fn) {
  _noteListeners.add(fn);
  return () => _noteListeners.delete(fn);
}
