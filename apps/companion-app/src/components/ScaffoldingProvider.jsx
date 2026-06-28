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
import { loadTraction, getScaffoldingLevel, getCurrentPhase } from '../data/tractionStore';
import { hydrateFromIndexedDB, syncWithCloud, persistTraction, subscribeToStorageSync } from '../lib/progressSyncEngine';
import { useAuth } from '../hooks/useAuth';
import { useScaffoldingActions } from '../hooks/useScaffoldingActions';
import { getNodeById } from '../data/dag/dagNodes';
import { getNextRecommendedNode } from '../data/dag/dagEdges';
import { indexCurriculum } from '../data/curriculumIndexer';
import { analytics, logEvent } from '../lib/firebase';
import { devWarn, devLog } from '../lib/devLog';

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
    let isMounted = true;
    hydrateFromIndexedDB().then(restored => {
      if (!isMounted) return;
      if (restored) setTraction(restored);
      setIsHydrated(true);
    });

    // Index curriculum for RAG (async, non-blocking)
    indexCurriculum().catch(err => {
      devWarn('[VoixVive] Curriculum indexing failed:', err);
    });

    return () => { isMounted = false; };
  }, []);

  // ── Sync with Supabase on Login ──
  useEffect(() => {
    if (!user) {
      setUserId(null);
      return;
    }

    let isMounted = true;
    setUserId(user.id);
    syncWithCloud(user.id).then(merged => {
      if (!isMounted) return;
      if (merged) setTraction(merged);
    });

    return () => { isMounted = false; };
  }, [user]);

  // ── Multi-tab sync: re-read localStorage when another tab writes ──
  useEffect(() => {
    return subscribeToStorageSync(setTraction);
  }, []);

  // ── Godot XR Telemetry Polling (Phase 4 Bridge) ──
  useEffect(() => {
    if (import.meta.env.PROD) return; // Only poll in dev mode where Vite plugin runs
    
    let isPolling = true;
    
    const pollGodot = async () => {
      if (!isPolling) return;
      try {
        const resp = await fetch('/api/vertiscale/latest');
        if (resp.ok) {
          const telemetry = await resp.json();
          if (telemetry && Object.keys(telemetry).length > 0) {
            devLog('[VoixVive] Received Godot XR Telemetry:', telemetry);
            
            // Calculate XP (10 XP for success, 2 for attempt, scaled by score)
            const baseXP = telemetry.successful ? 10 : 2;
            const scoreMultiplier = Math.max(1, (telemetry.score || 0) / 100);
            const xpGained = Math.round(baseXP * scoreMultiplier);
            
            setTraction(prev => {
              const updated = {
                ...prev,
                bardLevel: (prev.bardLevel || 1) + (xpGained / 100), // Fractional level increase
                practiceMinutes: (prev.practiceMinutes || 0) + 1, // Assume each play takes ~1 minute
                resonanceCycles: (prev.resonanceCycles || 0) + (telemetry.successful ? 1 : 0),
              };
              
              // Persist the changes
              persistTraction(updated, userId);
              return updated;
            });
          }
        }
      } catch (err) {
        // Ignore network errors when server restarts or is unreachable
      }
      
      if (isPolling) {
        setTimeout(pollGodot, 1000); // Poll every second
      }
    };
    
    pollGodot();
    
    return () => { isPolling = false; };
  }, [userId]);

  const refreshTraction = useCallback(() => {
    setTraction(loadTraction());
  }, []);

  const updateTraction = useCallback((updater) => {
    setTraction(prev => {
      const nextState = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      // Fire side effect safely inside the updater or in a separate useEffect.
      // Since persistTraction is idempotent and debounced, it's safe here.
      persistTraction(nextState, userId);
      return nextState;
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

  const actions = useScaffoldingActions(traction, updateTraction);

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
    globalMode: settings.globalMode || 'truebadour_trial',
    promptVerbosity: settings.promptVerbosity || 'full',
    aiEnabled: settings.aiEnabled !== false,
    gameEnabled: settings.gameEnabled !== false,

    // Convenience: somatic depth and stats
    somaticDepth: traction.somaticDepth || 1,
    bardLevel: traction.bardLevel || 1,
    streak: traction.streak || 0,
    practiceMinutes: traction.practiceMinutes || 0,
    resonanceCycles: traction.resonanceCycles || 0,
    breathingSessions: traction.breathingSessions || 0,

    // DAG Navigation (new)
    currentNodeId,
    currentNode,
    currentFret,
    currentPhase,
    completedNodes,
    nextRecommended,
    ...actions,
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
      isFallback: true,
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
      globalMode: 'truebadour_trial',
      promptVerbosity: 'full',
      aiEnabled: true,
      gameEnabled: true,
      toggleGlobalMode: () => {},
      toggleAI: () => {},
      toggleGame: () => {},
      somaticDepth: 1,
      practiceMinutes: 0,
      resonanceCycles: 0,
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
