/**
 * Development-only logger.
 * Strips console noise from production builds while keeping errors visible.
 */
export function devLog(...args) {
  if (import.meta.env.DEV) console.log(...args);
}

export function devWarn(...args) {
  if (import.meta.env.DEV) console.warn(...args);
}

export function devInfo(...args) {
  if (import.meta.env.DEV) console.info(...args);
}

export function devError(...args) {
  if (import.meta.env.DEV) console.error(...args);
}
