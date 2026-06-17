// ═══════════════════════════════════════════════════════════════════
// inferenceGate.js — CPU Mutex for the Mini Trinity
//
// All models stay loaded in RAM (static memory).
// Only ONE model runs inference at a time (gated CPU).
//
// Usage:
//   const text = await withGate(() => llm.chatCompletion(msgs));
//   const tokens = await withGate(() => orpheus.generate(text));
// ═══════════════════════════════════════════════════════════════════

let _gate = Promise.resolve();
let _currentHolder = null;

/**
 * Execute an async function with exclusive CPU access.
 * All other withGate() calls queue behind this one.
 * @param {Function} fn - Async function to execute
 * @param {string} [label] - Optional label for debugging (e.g. 'llm', 'tts', 'embed')
 * @returns {Promise<*>} Result of fn()
 */
export function withGate(fn, label = 'unknown') {
  _gate = _gate.then(async () => {
    _currentHolder = label;
    try {
      const result = await fn();
      return result;
    } finally {
      _currentHolder = null;
    }
  });
  return _gate;
}

/**
 * Check which model currently holds the CPU gate.
 * @returns {string|null} Label of current holder, or null if idle
 */
export function getGateHolder() {
  return _currentHolder;
}
