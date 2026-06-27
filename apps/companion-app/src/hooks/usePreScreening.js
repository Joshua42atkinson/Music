// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : usePreScreening.js                                   ║
// ║ WHAT    : React hook for AI pre-screening of video submissions ║
// ║ WHY     : Lets Apprentice+ students submit video and get AI    ║
// ║           analysis before Bertrand reviews                     ║
// ║ WHO     : Consumed by submission UI components                 ║
// ║ OWNS    : Analysis state, loading, error, result caching       ║
// ║ NEEDS   : aiPreScreening.js, useAuth (tier check)              ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
import { useState, useCallback, useRef } from 'react';
import { analyzeVideoSubmission, deleteGeminiFile } from '../lib/aiPreScreening';
import { devError } from '../lib/devLog';

const TIER_RANK = { free: 0, community: 1, apprentice: 2, journeyman: 3, master: 4 };

export function usePreScreening() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileUriRef = useRef(null);

  const analyze = useCallback(async (videoBlob, context = {}) => {
    if (!videoBlob) {
      setError('No video provided');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(10);
    setAnalysis(null);

    try {
      setProgress(30);
      const result = await analyzeVideoSubmission(videoBlob, context);
      setProgress(90);
      setAnalysis(result);
      setProgress(100);
      return result;
    } catch (err) {
      devError('[usePreScreening] Analysis failed:', err);
      setError(err.message || 'AI analysis failed. Please try again or submit without pre-screening.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setProgress(0);
  }, []);

  const cleanup = useCallback(async () => {
    if (fileUriRef.current) {
      await deleteGeminiFile(fileUriRef.current);
      fileUriRef.current = null;
    }
  }, []);

  return {
    isAnalyzing,
    analysis,
    error,
    progress,
    analyze,
    clearAnalysis,
    cleanup,
  };
}
