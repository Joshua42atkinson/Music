// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : promptVersioning.js                                 ║
// ║ WHAT    : A/B prompt testing, version control, regression     ║
// ║ WHY     : Every prompt change must prove it improves quality  ║
// ║ STAGE   : TEST / QUALITY CONTROL                              ║
// ╚═══════════════════════════════════════════════════════════════╝

import { getAllTestCases, autoScoreResponse } from './llmTestSuite';
import { vvGet, vvSetJSON } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ── Prompt Version Registry ────────────────────────────────────
// Store historical prompts for comparison and rollback
const PROMPT_VERSIONS_KEY = STORAGE_KEYS.PROMPT_VERSIONS;
const PROMPT_RESULTS_KEY = STORAGE_KEYS.PROMPT_RESULTS;

/**
 * Save a new prompt version with metadata.
 */
export function savePromptVersion(name, promptBuilder, metadata = {}) {
  const versions = getPromptVersions();
  const version = {
    id: `v${versions.length + 1}_${Date.now()}`,
    name,
    timestamp: Date.now(),
    metadata,
    // We can't store functions, so we store the function name
    builderName: promptBuilder.name || 'anonymous',
  };
  versions.push(version);
  vvSetJSON(PROMPT_VERSIONS_KEY, versions);
  return version;
}

/**
 * Get all saved prompt versions.
 */
export function getPromptVersions() {
  try {
    return JSON.parse(vvGet(PROMPT_VERSIONS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Run A/B test: compare two prompt builders against the test suite.
 * Returns statistically meaningful results.
 */
export async function runPromptABTest(
  promptBuilderA,
  promptBuilderB,
  generateFn,
  options = {}
) {
  const {
    maxTests = 10, // Limit for speed
    mode = 'chat',
    locale = 'en',
  } = options;

  const testCases = getAllTestCases()
    .filter(tc => tc.mode === mode && tc.locale === locale)
    .slice(0, maxTests);

  const results = {
    versionA: { name: promptBuilderA.name || 'A', scores: {}, details: [] },
    versionB: { name: promptBuilderB.name || 'B', scores: {}, details: [] },
    winner: null,
    margin: 0,
  };

  for (const testCase of testCases) {
    // Build prompts
    const promptA = promptBuilderA(testCase);
    const promptB = promptBuilderB(testCase);

    // Generate responses (caller provides actual inference)
    const responseA = await generateFn(promptA, testCase);
    const responseB = await generateFn(promptB, testCase);

    // Score both
    const scoreA = autoScoreResponse(responseA, testCase);
    const scoreB = autoScoreResponse(responseB, testCase);

    results.versionA.details.push({
      testId: testCase.id,
      query: testCase.query,
      response: responseA,
      scores: scoreA,
    });
    results.versionB.details.push({
      testId: testCase.id,
      query: testCase.query,
      response: responseB,
      scores: scoreB,
    });

    // Aggregate per-dimension scores
    for (const dim of Object.keys(scoreA)) {
      if (dim === 'weighted_total') continue;
      results.versionA.scores[dim] = (results.versionA.scores[dim] || 0) + scoreA[dim];
      results.versionB.scores[dim] = (results.versionB.scores[dim] || 0) + scoreB[dim];
    }
  }

  // Average scores
  const n = testCases.length;
  for (const dim of Object.keys(results.versionA.scores)) {
    results.versionA.scores[dim] /= n;
    results.versionB.scores[dim] /= n;
  }

  // Determine winner
  const totalA = results.versionA.details.reduce((s, d) => s + d.scores.weighted_total, 0) / n;
  const totalB = results.versionB.details.reduce((s, d) => s + d.scores.weighted_total, 0) / n;

  if (totalA > totalB) {
    results.winner = 'A';
    results.margin = totalA - totalB;
  } else if (totalB > totalA) {
    results.winner = 'B';
    results.margin = totalB - totalA;
  } else {
    results.winner = 'tie';
    results.margin = 0;
  }

  // Persist results
  savePromptResults(results);

  return results;
}

/**
 * Save test results to localStorage for trend analysis.
 */
export function savePromptResults(results) {
  const allResults = getPromptResults();
  allResults.push({
    timestamp: Date.now(),
    ...results,
  });
  // Keep last 50 results
  while (allResults.length > 50) allResults.shift();
  vvSetJSON(PROMPT_RESULTS_KEY, allResults);
}

/**
 * Get all historical prompt test results.
 */
export function getPromptResults() {
  try {
    return JSON.parse(vvGet(PROMPT_RESULTS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Detect quality regression: compare latest result to historical average.
 */
export function detectRegression(latestScores, threshold = 0.3) {
  const history = getPromptResults();
  if (history.length < 3) return { regression: false, reason: 'insufficient history' };

  const historicalTotals = history
    .slice(-10)
    .map(r => {
      const a = r.versionA?.scores || {};
      const b = r.versionB?.scores || {};
      return (a.weighted_total || 0) + (b.weighted_total || 0);
    })
    .filter(s => s > 0);

  if (historicalTotals.length < 3) return { regression: false, reason: 'insufficient data' };

  const avg = historicalTotals.reduce((a, b) => a + b, 0) / historicalTotals.length;
  const current = latestScores.weighted_total || 0;

  if (current < avg - threshold) {
    return {
      regression: true,
      current,
      historical_avg: avg,
      drop: avg - current,
      threshold,
    };
  }

  return { regression: false, current, historical_avg: avg };
}

/**
 * Generate a quality report for the current prompt.
 */
export function generateQualityReport(versionName, testResults) {
  const lines = [
    `# Prompt Quality Report: ${versionName}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Overall Score',
    `Weighted Average: ${testResults.versionA?.scores?.weighted_total?.toFixed(2) || 'N/A'} / 5.0`,
    '',
    '## Dimension Breakdown',
  ];

  const scores = testResults.versionA?.scores || {};
  for (const [dim, value] of Object.entries(scores)) {
    if (dim === 'weighted_total') continue;
    const bar = '█'.repeat(Math.round(value)) + '░'.repeat(5 - Math.round(value));
    lines.push(`- ${dim}: ${value.toFixed(2)} ${bar}`);
  }

  lines.push('', '## Test Case Details');
  for (const detail of testResults.versionA?.details || []) {
    lines.push(`### ${detail.testId}: ${detail.query.slice(0, 50)}...`);
    lines.push(`- Total: ${detail.scores.weighted_total.toFixed(2)}`);
    lines.push(`- Response: ${detail.response.slice(0, 100)}...`);
    lines.push('');
  }

  lines.push('', '## Regression Check');
  const reg = detectRegression(scores);
  if (reg.regression) {
    lines.push(`⚠️ REGRESSION DETECTED: Score dropped ${reg.drop.toFixed(2)} below historical average ${reg.historical_avg.toFixed(2)}`);
  } else {
    lines.push(`✅ No regression. Current: ${reg.current?.toFixed(2)}, Historical avg: ${reg.historical_avg?.toFixed(2)}`);
  }

  return lines.join('\n');
}
