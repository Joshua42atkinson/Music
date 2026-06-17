import { useState, useCallback } from 'react';
import { vvGetJSON, vvSetJSON, vvSet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

const PROGRESS_KEY = STORAGE_KEYS.CSCALE_JOURNEY_PROGRESS;
const COMPLETED_KEY = STORAGE_KEYS.CSCALE_COMPLETED;

function loadProgress() {
  try {
    return vvGetJSON(PROGRESS_KEY, {});
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    vvSetJSON(PROGRESS_KEY, progress);
    if (Object.keys(progress).length === 12) {
      vvSet(COMPLETED_KEY, 'true');
    }
  } catch {
    /* ignore */
  }
}

export function useCScaleProgress() {
  const [progress, setProgressState] = useState(loadProgress);

  const markComplete = useCallback((stageKey) => {
    setProgressState((prev) => {
      if (prev[stageKey]) return prev; // no-op if already done
      const next = { ...prev, [stageKey]: true };
      saveProgress(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (stageKey) => !!progress[stageKey],
    [progress]
  );

  const allComplete = Object.keys(progress).length === 12;

  return { progress, markComplete, isComplete, allComplete };
}
