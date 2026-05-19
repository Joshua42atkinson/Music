// ═══════════════════════════════════════════════════════════
// PIECE 2: useFlashTimer
// Drives the REVEAL → DARK → TAP → REVEAL cycle for Phase 1.
// Uses performance.now() — NOT Date.now() (avoids clock skew).
//
// State machine:
//   'idle' → 'reveal' → 'dark' → 'tap' → 'result' → 'idle'
//
// SUSTAIN mode (added):
//   'idle' → 'reveal' → 'hold' → 'hold_result' → 'idle'
//   Pattern stays visible; student must maintain placement + breathe.
//
// flashDurationMs adapts down as consistencyScore improves:
//   2000ms (score 0) → 500ms (score 1.0)
// ═══════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';

export const FLASH_STATES = {
  IDLE:        'idle',
  REVEAL:      'reveal',
  DARK:        'dark',
  TAP:         'tap',
  RESULT:      'result',
  // Sustain mode states
  HOLD:        'hold',
  HOLD_RESULT: 'hold_result',
};

// Map consistencyScore [0,1] to flash duration ms [2000, 500]
export function computeFlashDuration(consistencyScore) {
  const clamped = Math.max(0, Math.min(1, consistencyScore));
  return Math.round(2000 - clamped * 1500); // 2000 → 500
}

// Map consistencyScore [0,1] to hold duration ms [3000, 8000]
// Sustain mode: the better you get, the longer you must hold
export function computeHoldDuration(consistencyScore) {
  const clamped = Math.max(0, Math.min(1, consistencyScore));
  return Math.round(3000 + clamped * 5000); // 3000 → 8000
}

// How long the student has to tap after the flash (ms)
const TAP_WINDOW_MS = 8000;
// How long to show the result diff overlay before advancing
const RESULT_DISPLAY_MS = 2500;
// How long the REVEAL phase lasts in sustain mode (longer than flash — student studies)
const SUSTAIN_REVEAL_MS = 3000;

export default function useFlashTimer({
  consistencyScore = 0,
  onRevealEnd,       // () => void — called when REVEAL phase ends
  onTapWindowEnd,    // () => void — called when TAP window expires
  onResultEnd,       // () => void — called when RESULT display ends
  onHoldComplete,    // () => void — called when HOLD duration elapses
  onHoldResultEnd,   // () => void — called when HOLD_RESULT display ends
} = {}) {
  const [flashState, setFlashState] = useState(FLASH_STATES.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(0); // ms left in TAP/HOLD window
  const [holdTargetMs, setHoldTargetMs]   = useState(0); // total hold target for progress calc
  const timerRef   = useRef(null);
  const startRef   = useRef(null);
  const rafRef     = useRef(null);

  const clearAll = useCallback(() => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // Countdown ticker for TAP window (for UI progress bar)
  const tickTapCountdown = useCallback((endTime) => {
    const now = performance.now();
    const remaining = Math.max(0, endTime - now);
    setTimeRemaining(remaining);
    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(() => tickTapCountdown(endTime));
    }
  }, []);

  // Count-UP ticker for HOLD window (for UI progress ring)
  const tickHoldCountup = useCallback((startTime, durationMs) => {
    const now = performance.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, durationMs - elapsed);
    setTimeRemaining(remaining);
    if (elapsed >= durationMs) {
      // Hold complete!
      setFlashState(FLASH_STATES.HOLD_RESULT);
      setTimeRemaining(0);
      onHoldComplete?.();

      timerRef.current = setTimeout(() => {
        setFlashState(FLASH_STATES.IDLE);
        onHoldResultEnd?.();
      }, RESULT_DISPLAY_MS);
      return;
    }
    rafRef.current = requestAnimationFrame(() => tickHoldCountup(startTime, durationMs));
  }, [onHoldComplete, onHoldResultEnd]);

  // ── FLASH MODE: start a round ──
  const startRound = useCallback(() => {
    clearAll();
    const flashMs = computeFlashDuration(consistencyScore);

    // REVEAL phase
    setFlashState(FLASH_STATES.REVEAL);
    startRef.current = performance.now();

    timerRef.current = setTimeout(() => {
      // DARK phase (very brief visual beat)
      setFlashState(FLASH_STATES.DARK);
      onRevealEnd?.();

      setTimeout(() => {
        // TAP phase — student has TAP_WINDOW_MS to respond
        setFlashState(FLASH_STATES.TAP);
        const endTime = performance.now() + TAP_WINDOW_MS;
        tickTapCountdown(endTime);

        timerRef.current = setTimeout(() => {
          setFlashState(FLASH_STATES.RESULT);
          cancelAnimationFrame(rafRef.current);
          setTimeRemaining(0);
          onTapWindowEnd?.();

          timerRef.current = setTimeout(() => {
            setFlashState(FLASH_STATES.IDLE);
            onResultEnd?.();
          }, RESULT_DISPLAY_MS);
        }, TAP_WINDOW_MS);
      }, 150); // brief dark beat
    }, flashMs);
  }, [clearAll, consistencyScore, onRevealEnd, onTapWindowEnd, onResultEnd, tickTapCountdown]);

  // ── SUSTAIN MODE: start a hold round ──
  const startHoldRound = useCallback(() => {
    clearAll();
    const holdMs = computeHoldDuration(consistencyScore);
    setHoldTargetMs(holdMs);

    // REVEAL phase — longer than flash, student studies the pattern
    setFlashState(FLASH_STATES.REVEAL);
    startRef.current = performance.now();

    timerRef.current = setTimeout(() => {
      // HOLD phase — pattern stays visible, student holds placement
      setFlashState(FLASH_STATES.HOLD);
      setTimeRemaining(holdMs);
      const holdStart = performance.now();
      tickHoldCountup(holdStart, holdMs);
    }, SUSTAIN_REVEAL_MS);
  }, [clearAll, consistencyScore, tickHoldCountup]);

  // Advance to RESULT early (player finished tapping before window expired)
  const submitTaps = useCallback(() => {
    if (flashState !== FLASH_STATES.TAP) return;
    clearAll();
    setTimeRemaining(0);
    setFlashState(FLASH_STATES.RESULT);
    onTapWindowEnd?.();

    timerRef.current = setTimeout(() => {
      setFlashState(FLASH_STATES.IDLE);
      onResultEnd?.();
    }, RESULT_DISPLAY_MS);
  }, [flashState, clearAll, onTapWindowEnd, onResultEnd]);

  // End HOLD early (player wants to submit hold before timer expires)
  const submitHold = useCallback(() => {
    if (flashState !== FLASH_STATES.HOLD) return;
    clearAll();
    setFlashState(FLASH_STATES.HOLD_RESULT);
    onHoldComplete?.();

    timerRef.current = setTimeout(() => {
      setFlashState(FLASH_STATES.IDLE);
      onHoldResultEnd?.();
    }, RESULT_DISPLAY_MS);
  }, [flashState, clearAll, onHoldComplete, onHoldResultEnd]);

  const reset = useCallback(() => {
    clearAll();
    setFlashState(FLASH_STATES.IDLE);
    setTimeRemaining(0);
    setHoldTargetMs(0);
  }, [clearAll]);

  // Cleanup on unmount
  useEffect(() => () => clearAll(), [clearAll]);

  const flashDurationMs = computeFlashDuration(consistencyScore);
  const holdDurationMs  = computeHoldDuration(consistencyScore);
  const tapProgressPct  = timeRemaining / TAP_WINDOW_MS; // 1.0 → 0.0
  const holdProgressPct = holdTargetMs > 0 ? 1 - (timeRemaining / holdTargetMs) : 0; // 0.0 → 1.0

  return {
    flashState, timeRemaining, tapProgressPct, holdProgressPct,
    flashDurationMs, holdDurationMs, holdTargetMs,
    startRound, startHoldRound, submitTaps, submitHold, reset,
  };
}
