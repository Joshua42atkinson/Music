// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : aiPreScreening.test.js                               ║
// ║ WHAT    : Unit tests for AI pre-screening pipeline             ║
// ║ WHY     : Video analysis must produce structured JSON          ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeVideoSubmission, uploadVideoToGemini, deleteGeminiFile } from '../aiPreScreening';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock import.meta.env
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');

describe('aiPreScreening — AI Video Analysis Pipeline', () => {

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns mock analysis when no API key is configured', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const blob = new Blob(['fake-video'], { type: 'video/webm' });
    const result = await analyzeVideoSubmission(blob, { fretId: 1, chapterName: 'Chapter 1' });

    expect(result._mock).toBe(true);
    expect(result.overallAssessment).toBeTruthy();
    expect(result.issues).toBeInstanceOf(Array);
    expect(result.draftReview).toBeTruthy();
    expect(result.priorityFlags).toBeInstanceOf(Array);
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });

  test('mock analysis includes strengths and recommended focus', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const blob = new Blob(['fake-video'], { type: 'video/webm' });
    const result = await analyzeVideoSubmission(blob);

    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.recommendedFocus).toBeTruthy();
    expect(result.estimatedLevel).toBeTruthy();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });

  test('uploadVideoToGemini throws on missing API key', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const blob = new Blob(['fake'], { type: 'video/webm' });
    await expect(uploadVideoToGemini(blob)).rejects.toThrow('VITE_GEMINI_API_KEY not configured');
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });

  test('uploadVideoToGemini uploads metadata then video data', async () => {
    const blob = new Blob(['fake-video'], { type: 'video/webm' });

    // First call: metadata upload → returns file uri
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ file: { uri: 'https://gemini.test/files/123', name: 'test' } }),
    });
    // Second call: video data upload
    mockFetch.mockResolvedValueOnce({ ok: true });

    const result = await uploadVideoToGemini(blob, 'video/webm');

    expect(result.uri).toBe('https://gemini.test/files/123');
    expect(result.mimeType).toBe('video/webm');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('uploadVideoToGemini throws on upload failure', async () => {
    const blob = new Blob(['fake'], { type: 'video/webm' });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Quota exceeded' } }),
    });

    await expect(uploadVideoToGemini(blob)).rejects.toThrow('Quota exceeded');
  });

  test('deleteGeminiFile is best-effort (no throw)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(deleteGeminiFile('https://gemini.test/files/123')).resolves.not.toThrow();
  });

  test('deleteGeminiFile does nothing without API key', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    mockFetch.mockClear();
    await deleteGeminiFile('https://gemini.test/files/123');
    expect(mockFetch).not.toHaveBeenCalled();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });
});
