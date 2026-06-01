// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : troubadourOffline.test.js                           ║
// ║ WHAT    : Unit tests for offline Troubadour response engine  ║
// ║ WHY     : The Souffle tier must ALWAYS teach — validated     ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import {
  OFFLINE_RESPONSES,
  OFFLINE_FALLBACK,
  getOfflineResponse,
  getFretAwareFallback,
} from '../troubadourOffline';

describe('Offline Response Engine — Souffle Tier', () => {

  describe('getOfflineResponse — keyword matching', () => {
    test('matches greeting keywords', () => {
      const result = getOfflineResponse('hello');
      expect(result.matched).toBe(true);
      expect(result.response).toContain('Over.');
    });

    test('matches French greeting', () => {
      const result = getOfflineResponse('bonjour');
      expect(result.matched).toBe(true);
      expect(result.response).toContain('Over.');
    });

    test('matches pain/fingers keywords', () => {
      const result = getOfflineResponse('my fingers hurt');
      expect(result.matched).toBe(true);
      expect(result.response).toContain('Over.');
      expect(result.response).toContain('body');
    });

    test('matches breath/relax keywords', () => {
      const result = getOfflineResponse('I need to breathe');
      expect(result.matched).toBe(true);
      expect(result.response.toLowerCase()).toContain('breath');
    });

    test('prefers longer (more specific) keywords', () => {
      // "fret 7" should match the fret-7 specific response, not generic "fret"
      const result = getOfflineResponse('fret 7 tritone');
      expect(result.matched).toBe(true);
      expect(result.response).toContain('ordeal');
    });

    test('returns unmatched for unrecognized input', () => {
      const result = getOfflineResponse('xyzzy qwerty');
      expect(result.matched).toBe(false);
      expect(result.response).toBe(OFFLINE_FALLBACK);
    });

    test('handles null/undefined/empty input gracefully', () => {
      expect(getOfflineResponse(null).matched).toBe(false);
      expect(getOfflineResponse(undefined).matched).toBe(false);
      expect(getOfflineResponse('').matched).toBe(false);
    });

    test('handles non-string input gracefully', () => {
      expect(getOfflineResponse(123).matched).toBe(false);
      expect(getOfflineResponse({}).matched).toBe(false);
    });

    test('all offline responses end with "Over."', () => {
      for (const entry of OFFLINE_RESPONSES) {
        expect(entry.response).toMatch(/Over\.$/);
      }
    });
  });

  describe('getFretAwareFallback — fret-specific fallback', () => {
    test('returns fret 1 specific guidance', () => {
      const result = getFretAwareFallback(1);
      expect(result).toContain('Root Note');
      expect(result).toMatch(/Over\.$/);
    });

    test('returns fret 7 (tritone) specific guidance', () => {
      const result = getFretAwareFallback(7);
      expect(result).toContain('Tritone');
      expect(result).toMatch(/Over\.$/);
    });

    test('returns fret 12 (octave) specific guidance', () => {
      const result = getFretAwareFallback(12);
      expect(result).toContain('Major 7th');
      expect(result).toMatch(/Over\.$/);
    });

    test('all 12 frets have specific fallbacks', () => {
      for (let fret = 1; fret <= 12; fret++) {
        const result = getFretAwareFallback(fret);
        expect(result).not.toBe(OFFLINE_FALLBACK);
        expect(result).toMatch(/Over\.$/);
      }
    });

    test('unknown fret returns generic fallback', () => {
      const result = getFretAwareFallback(99);
      expect(result).toBe(OFFLINE_FALLBACK);
    });

    test('default (no fret) returns fret 1 fallback (not generic)', () => {
      const result = getFretAwareFallback();
      // Default currentFret=1, so fret 1 specific prompt is returned
      expect(result).toContain('Root Note');
      expect(result).toMatch(/Over\.$/);
    });
  });

  describe('Coverage — every keyword category is reachable', () => {
    const categoryTests = [
      { input: 'I feel stuck', expected: 'stuck' },
      { input: 'how long should I practice', expected: 'practice' },
      { input: 'my hand hurts', expected: 'pain' },
      { input: 'I feel tension', expected: 'tension' },
      { input: 'I want to play fast', expected: 'speed' },
      { input: 'how do I play a barre chord', expected: 'barre' },
      { input: 'I want to sing', expected: 'sing' },
      { input: 'explain music theory', expected: 'theory' },
      { input: 'I lack motivation', expected: 'motivation' },
      { input: 'what is a fret', expected: 'fret' },
      { input: 'play a major scale', expected: 'scale' },
      { input: 'how to change chords', expected: 'chord' },
      { input: 'I sound bad on recording', expected: 'recording' },
      { input: 'stage fright', expected: 'stage' },
      { input: 'tell me about bertrand', expected: 'bertrand' },
      { input: 'thank you', expected: 'thank' },
      { input: 'goodbye', expected: 'goodbye' },
      { input: 'tritone devil interval', expected: 'tritone' },
      { input: 'I need to breathe', expected: 'breath' },
    ];

    test.each(categoryTests)('keyword "$input" matches a response', ({ input }) => {
      const result = getOfflineResponse(input);
      expect(result.matched).toBe(true);
      expect(result.response.length).toBeGreaterThan(20);
    });
  });
});
