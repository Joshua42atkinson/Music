// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : llmQuality.test.js                                   ║
// ║ WHAT    : Automated LLM quality regression tests             ║
// ║ WHY     : Ensure prompt changes improve, not degrade, quality ║
// ║ RUN     : npx vitest run llmQuality                           ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import {
  getAllTestCases,
  autoScoreResponse,
  scoreKeywordPresence,
  scoreOverProtocol,
  scoreConciseness,
  scoreSafety,
  LLM_SCORING_DIMENSIONS,
} from '../llmTestSuite';

describe('LLM Quality — Automated Scoring', () => {
  test('all test cases have required fields', () => {
    const cases = getAllTestCases();
    expect(cases.length).toBeGreaterThan(0);

    for (const tc of cases) {
      expect(tc.id).toBeDefined();
      expect(tc.query).toBeDefined();
      expect(tc.mode).toMatch(/chat|truebadour/);
      expect(tc.locale).toMatch(/en|fr/);
    }
  });

  test('keyword presence scoring works', () => {
    const score = scoreKeywordPresence(
      'Place your index finger on the third fret. Use gentle pressure.',
      ['finger', 'fret', 'pressure'],
      ['force']
    );
    expect(score).toBe(1.0); // All expected, none forbidden

    const badScore = scoreKeywordPresence(
      'Force your fingers hard!',
      ['gentle', 'relax'],
      ['force']
    );
    expect(badScore).toBe(0); // Contains forbidden word
  });

  test('Over protocol scoring — truebadour mode', () => {
    expect(scoreOverProtocol('Practice slowly today. Over.', 'truebadour')).toBe(5);
    expect(scoreOverProtocol('Practice slowly. Over. Remember to breathe.', 'truebadour')).toBe(3);
    expect(scoreOverProtocol('Practice slowly today.', 'truebadour')).toBe(1);
  });

  test('Over protocol scoring — chat mode', () => {
    expect(scoreOverProtocol('Practice slowly today. Over.', 'chat')).toBe(0);
    expect(scoreOverProtocol('Practice slowly today.', 'chat')).toBe(5);
  });

  test('conciseness scoring', () => {
    expect(scoreConciseness('One. Two. Three. Four.')).toBe(5);
    expect(scoreConciseness('One. Two. Three. Four. Five. Six. Seven.')).toBe(3);
    expect(scoreConciseness('A. B. C. D. E. F. G. H. I. J. K. L. M.')).toBe(1);
  });

  test('safety scoring detects danger', () => {
    const safe = scoreSafety('Stop playing and rest your wrist. See a doctor if pain persists.');
    expect(safe).toBeGreaterThanOrEqual(4);

    const dangerous = scoreSafety('Push through the pain. No pain no gain!');
    expect(dangerous).toBeLessThanOrEqual(2);
  });

  test('full auto-score produces all dimensions', () => {
    const response = 'What do you feel when you place your finger on the third fret? Breathe and notice the tension. Rest if it hurts. Over.';
    const testCase = {
      mode: 'truebadour',
      locale: 'en',
      expected_keywords: ['finger', 'fret', 'breathe'],
      forbidden_keywords: ['force'],
    };

    const scores = autoScoreResponse(response, testCase);

    expect(scores.weighted_total).toBeDefined();
    expect(scores.weighted_total).toBeGreaterThanOrEqual(1);
    expect(scores.weighted_total).toBeLessThanOrEqual(5);

    // All dimensions present
    for (const dim of Object.keys(LLM_SCORING_DIMENSIONS)) {
      expect(scores[dim]).toBeDefined();
      expect(scores[dim]).toBeGreaterThanOrEqual(0);
      expect(scores[dim]).toBeLessThanOrEqual(5);
    }
  });

  test('safety critical test cases have forbidden keywords', () => {
    const safetyCases = getAllTestCases().filter(tc => tc.id.startsWith('safe-'));
    expect(safetyCases.length).toBeGreaterThan(0);

    for (const tc of safetyCases) {
      expect(tc.forbidden_keywords.length).toBeGreaterThan(0);
      expect(tc.expected_keywords.length).toBeGreaterThan(0);
    }
  });
});
