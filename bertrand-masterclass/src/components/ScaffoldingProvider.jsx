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
import { loadTraction, saveTraction, getScaffoldingLevel, getCurrentPhase, completeDAGPhase, attemptDAGPhase, setCurrentNode, completeNode, markDepthExplored, passSomaticGate } from '../data/tractionStore';
import { saveProgress, getProgress } from '../data/localDatabase';
import { getTractionState, saveTractionState, migrateLocalToCloud } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { getNodeById } from '../data/dag/dagNodes';
import { getNextRecommendedNode } from '../data/dag/dagEdges';

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
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);

  // ── No Auth Listener needed for Sovereign Mode ──

  // ── On mount: hydrate from IndexedDB backup (if localStorage empty) ──
  useEffect(() => {
    const hydrate = async () => {
      const localState = loadTraction();
      const isEmptyState = !localState.lastPracticeDate && localState.bardLevel <= 1 && localState.practiceMinutes === 0;

      if (isEmptyState) {
        // LocalStorage empty — try IndexedDB backup
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

  // ── Sync with Supabase on Login ──
  useEffect(() => {
    if (!user) {
      setUserId(null);
      return;
    }

    setUserId(user.id);
    const syncCloudData = async () => {
      try {
        const cloudTraction = await getTractionState(user.id);
        if (cloudTraction) {
          console.info('[VoixVive] Hydrating local state from Supabase cloud...');
          saveTraction(cloudTraction);
          setTraction(cloudTraction);
        } else {
          // No cloud data yet — migrate existing local progress
          const currentLocal = loadTraction();
          await migrateLocalToCloud(user.id, currentLocal);
        }
      } catch (err) {
        console.error('[VoixVive] Supabase sync failed:', err);
      }
    };
    
    syncCloudData();
  }, [user]);

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
      
      // Async durable backup to Supabase if logged in
      if (userId) {
        saveTractionState(userId, next).catch(err => {
          console.warn('[VoixVive] Background Supabase sync failed:', err);
        });
      }
      
      return next;
    });
  }, [userId]);

  const scaffolding = getScaffoldingLevel(traction);
  const settings = traction.settings || {};

  // ── DAG Navigation Helpers ──
  const currentNodeId = traction.currentNodeId || 'fret-1-class-be';
  const currentNode = getNodeById(currentNodeId);
  const currentFret = currentNode?.fret || 1;
  const currentPhase = getCurrentPhase(traction, currentFret);
  const completedNodes = traction.completedNodes || [];
  const nextRecommended = getNextRecommendedNode(completedNodes, currentNode?.pillar || 'class', settings.sandboxMode);

  const completePhase = useCallback((fretIdOrNodeId, phase) => {
    // Accept either a numeric fretId or a nodeId string like 'fret-1-class-be'
    let fretId = fretIdOrNodeId;
    let nodeId = fretIdOrNodeId;
    if (typeof fretIdOrNodeId === 'string' && fretIdOrNodeId.startsWith('fret-')) {
      const match = fretIdOrNodeId.match(/fret-(\d+)/);
      if (match) fretId = parseInt(match[1], 10);
      nodeId = fretIdOrNodeId;
    }
    // Mark the DAG phase complete (fret state: beCompleted, mastery, traction sync)
    let newState = completeDAGPhase(traction, fretId, phase);
    // Also mark the node complete so prerequisites unlock for downstream nodes
    if (typeof nodeId === 'string' && nodeId.startsWith('fret-')) {
      newState = completeNode(newState, nodeId);
    }
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const advanceNode = useCallback((nodeId) => {
    const newState = completeNode(traction, nodeId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const navigateToNode = useCallback((nodeId) => {
    const newState = setCurrentNode(traction, nodeId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const markDepth = useCallback((fretId) => {
    const newState = markDepthExplored(traction, fretId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const passGate = useCallback((fretIdOrNodeId, phase) => {
    let fretId = fretIdOrNodeId;
    if (typeof fretIdOrNodeId === 'string' && fretIdOrNodeId.startsWith('fret-')) {
      const match = fretIdOrNodeId.match(/fret-(\d+)/);
      if (match) fretId = parseInt(match[1], 10);
    }
    const newState = passSomaticGate(traction, fretId, phase);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

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

    // DAG Navigation (new)
    currentNodeId,
    currentNode,
    currentFret,
    currentPhase,
    completedNodes,
    nextRecommended,
    completePhase,
    advanceNode,
    navigateToNode,
    markDepth,
    passGate,
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
      // DAG Navigation fallback
      currentNodeId: 'fret-1-class-be',
      currentNode: null,
      currentFret: 1,
      currentPhase: 'be',
      completedNodes: [],
      nextRecommended: 'fret-1-class-be',
      completePhase: () => {},
      advanceNode: () => {},
      navigateToNode: () => {},
      markDepth: () => {},
      passGate: () => {},
    };
  }
  return ctx;
}

export default ScaffoldingProvider;
