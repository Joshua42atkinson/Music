/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadTraction, saveTraction, getScaffoldingLevel } from '../data/tractionStore';
import { saveProgress, getProgress } from '../data/localDatabase';

// ═══════════════════════════════════════════════════════════
// SCAFFOLDING PROVIDER
// Global React context that manages traction state and
// exposes scaffolding-aware helpers to all components.
// As mastery increases, UI aids automatically fade.
//
// Persistence architecture:
//   localStorage (tractionStore)  → fast sync read/write
//   IndexedDB (localDatabase)     → durable backup, survives clears
// ═══════════════════════════════════════════════════════════

const ScaffoldingContext = createContext(null);

export function ScaffoldingProvider({ children }) {
  const [traction, setTraction] = useState(loadTraction());
  const [isHydrated, setIsHydrated] = useState(() => {
    const localState = loadTraction();
    const isEmptyState = !localState.lastPracticeDate && localState.bardLevel <= 1 && localState.practiceMinutes === 0;
    return !isEmptyState;
  });

  // ── On mount: hydrate from IndexedDB if localStorage is empty ──
  // This restores progress after a browser data clear or private mode session.
  useEffect(() => {
    const localState = loadTraction();
    const isEmptyState = !localState.lastPracticeDate && localState.bardLevel <= 1 && localState.practiceMinutes === 0;

    if (isEmptyState) {
      getProgress().then(idbState => {
        if (idbState) {
          // Restore from IndexedDB backup
          saveTraction(idbState);
          setTraction(idbState);
          console.info('[VoixVive] Restored progress from IndexedDB backup.');
        }
        setIsHydrated(true);
      });
    }
  }, []);

  // ── Periodic re-sync from localStorage (multi-tab support) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setTraction(loadTraction());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshTraction = useCallback(() => {
    setTraction(loadTraction());
  }, []);

  const updateTraction = useCallback((updater) => {
    setTraction(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveTraction(next);
      // Async durable backup to IndexedDB — non-blocking
      saveProgress(next).catch(() => {});
      return next;
    });
  }, []);

  const scaffolding = getScaffoldingLevel(traction);
  const settings = traction.settings || {};

  const value = {
    traction,
    refreshTraction,
    updateTraction,
    isHydrated,

    // Scaffolding levels (1.0 = full aids, 0.0 = no aids)
    scaffolding,
    showNoteLabels: settings.showNoteLabels !== false,
    showFretNumbers: settings.showFretNumbers !== false,
    showMetronome: settings.showMetronome !== false,
    showCAGEDOverlay: settings.showCAGEDOverlay !== false,

    // Convenience: bard level and stats
    bardLevel: traction.bardLevel || 1,
    practiceMinutes: traction.practiceMinutes || 0,
    streak: traction.streak || 0,
    breathingSessions: traction.breathingSessions || 0,
  };

  return (
    <ScaffoldingContext.Provider value={value}>
      {children}
    </ScaffoldingContext.Provider>
  );
}

export function useScaffolding() {
  const ctx = useContext(ScaffoldingContext);
  if (!ctx) {
    // Graceful fallback for components used outside the provider
    return {
      traction: loadTraction(),
      refreshTraction: () => {},
      updateTraction: () => {},
      isHydrated: true,
      scaffolding: 1.0,
      showNoteLabels: true,
      showFretNumbers: true,
      showMetronome: true,
      showCAGEDOverlay: true,
      bardLevel: 1,
      practiceMinutes: 0,
      streak: 0,
      breathingSessions: 0,
    };
  }
  return ctx;
}

export default ScaffoldingProvider;
