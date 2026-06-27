// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : usePreScreening.test.js                              ║
// ║ WHAT    : Unit tests for pre-screening React hook              ║
// ║ WHY     : Hook must manage loading/error/success states        ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock the aiPreScreening module
vi.mock('../../lib/aiPreScreening', () => ({
  analyzeVideoSubmission: vi.fn(),
  deleteGeminiFile: vi.fn(),
}));

import { usePreScreening } from '../../hooks/usePreScreening';
import { analyzeVideoSubmission } from '../../lib/aiPreScreening';

describe('usePreScreening — Pre-Screening Hook', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initial state is idle with no analysis', () => {
    const { result } = renderHook(() => usePreScreening());
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.analysis).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(0);
  });

  test('analyze returns null when no video provided', async () => {
    const { result } = renderHook(() => usePreScreening());
    let ret;
    await act(async () => {
      ret = await result.current.analyze(null);
    });
    expect(ret).toBeNull();
    expect(result.current.error).toBe('No video provided');
  });

  test('analyze sets isAnalyzing and stores result on success', async () => {
    const mockAnalysis = {
      overallAssessment: 'Good work',
      issues: [],
      draftReview: 'Nice job',
    };
    analyzeVideoSubmission.mockResolvedValueOnce(mockAnalysis);

    const { result } = renderHook(() => usePreScreening());
    const blob = new Blob(['fake'], { type: 'video/webm' });

    let ret;
    await act(async () => {
      ret = await result.current.analyze(blob, { fretId: 1 });
    });

    expect(ret).toEqual(mockAnalysis);
    expect(result.current.analysis).toEqual(mockAnalysis);
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(100);
  });

  test('analyze sets error on failure', async () => {
    analyzeVideoSubmission.mockRejectedValueOnce(new Error('API timeout'));

    const { result } = renderHook(() => usePreScreening());
    const blob = new Blob(['fake'], { type: 'video/webm' });

    let ret;
    await act(async () => {
      ret = await result.current.analyze(blob);
    });

    expect(ret).toBeNull();
    expect(result.current.error).toBe('API timeout');
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.analysis).toBeNull();
  });

  test('clearAnalysis resets state', async () => {
    const mockAnalysis = { overallAssessment: 'Good' };
    analyzeVideoSubmission.mockResolvedValueOnce(mockAnalysis);

    const { result } = renderHook(() => usePreScreening());
    const blob = new Blob(['fake'], { type: 'video/webm' });

    await act(async () => {
      await result.current.analyze(blob);
    });
    expect(result.current.analysis).not.toBeNull();

    act(() => {
      result.current.clearAnalysis();
    });

    expect(result.current.analysis).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(0);
  });
});
