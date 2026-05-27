// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : ScaffoldingProvider.jsx                            ║
// ║ WHAT    : Global React context — student progress in memory  ║
// ║ WHY     : Every tool, game, and AI panel needs to know the   ║
// ║           student's Bard Level, streak, and fret state       ║
// ║ WHO     : Invisible — wraps entire app, used by all screens  ║
// ║ OWNS    : traction state, updateTraction, scaffoldingLevel   ║
// ║ NEEDS   : tractionStore.loadTraction/saveTraction            ║
// ║          localDatabase.saveProgress/getProgress             ║
// ║ RULES   : updateTraction is the ONLY way to mutate state     ║
// ║           Always persist to localStorage on every update     ║
// ║           No Great Game stats. No XP/Florin economy.         ║
// ║ FIX AT  : useScaffolding() returning stale? → check here    ║
// ║           → tractionStore.saveTraction → localStorage key   ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                   ║
// ╚═══════════════════════════════════════════════════════════════╝
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadTraction, saveTraction, getScaffoldingLevel } from '../data/tractionStore';
import { saveProgress, getProgress } from '../data/localDatabase';
import { getTractionState, saveTractionState, migrateLocalToCloud } from '../lib/supabase';

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [userId, setUserId] = useState(null);

  // ── Listen for auth state changes (login / logout) ──
  useEffect(() => {
    let unsub = null;

    const setupAuthListener = async () => {
      try {
        const mod = await import('../lib/supabase');
        const supabase = mod.default;
        if (!supabase) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          const newId = session?.user?.id || null;
          setUserId(prev => {
            if (prev !== newId) {
              // Auth changed — we'll handle hydration in the next effect cycle
              if (newId) {
                console.log('[VoixVive] User logged in:', newId);
              } else {
                console.log('[VoixVive] User logged out');
              }
            }
            return newId;
          });
        });
        unsub = listener.subscription;
      } catch {
        // Supabase not configured — stay in offline mode
      }
    };

    setupAuthListener();
    return () => unsub?.unsubscribe();
  }, []);

  // ── On mount: hydrate from cloud (if logged in) or IndexedDB ──
  useEffect(() => {
    const hydrate = async () => {
      const localState = loadTraction();
      const isEmptyState = !localState.lastPracticeDate && localState.bardLevel <= 1 && localState.practiceMinutes === 0;

      // Check if Supabase auth has a user
      let sessionUserId = null;
      try {
        const { getSession } = await import('../lib/supabase');
        const session = await getSession();
        sessionUserId = session?.user?.id || null;
      } catch {
        sessionUserId = null;
      }

      if (sessionUserId) {
        // Logged in — try cloud first
        setUserId(sessionUserId);
        try {
          const cloudData = await getTractionState(sessionUserId);
          if (cloudData) {
            saveTraction(cloudData);
            setTraction(cloudData);
            console.info('[VoixVive] Restored progress from Supabase cloud.');
          } else {
            // First login — migrate local data to cloud
            await migrateLocalToCloud(sessionUserId, localState);
            console.info('[VoixVive] Migrated local progress to Supabase cloud.');
          }
        } catch (err) {
          console.warn('[VoixVive] Supabase load failed, using localStorage:', err);
        }
      } else if (isEmptyState) {
        // Not logged in, localStorage empty — try IndexedDB backup
        try {
          const idbState = await getProgress();
          if (idbState) {
            saveTraction(idbState);
            setTraction(idbState);
            console.info('[VoixVive] Restored progress from IndexedDB backup.');
          }
        } catch (err) {
          console.warn('[VoixVive] IndexedDB restore failed:', err);
        }
      }

      setIsHydrated(true);
    };

    hydrate();
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
      // Always save to localStorage (fast, sync, works offline)
      saveTraction(next);
      // Async durable backup to IndexedDB — non-blocking
      saveProgress(next).catch(() => {});
      // If logged in, also save to Supabase cloud — non-blocking
      if (userId) {
        saveTractionState(userId, next).catch(err => {
          console.warn('[VoixVive] Supabase save failed (will retry on next update):', err);
        });
      }
      return next;
    });
  }, [userId]);

  const scaffolding = getScaffoldingLevel(traction);
  const settings = traction.settings || {};

  const value = {
    traction,
    refreshTraction,
    updateTraction,
    isHydrated,
    userId,

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
      userId: null,
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
