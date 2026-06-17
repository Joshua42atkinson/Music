// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useDAGProgress.js                                   ║
// ║ WHAT    : React hook for DAG traversal state                 ║
// ║ WHY     : Every component needs to know where student is     ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { dagNodes, getNodeById, getNodesByFret, FRET_METADATA } from '../data/dag/dagNodes';
import { 
  isNodeUnlocked, 
  isNodeRecommended, 
  getNextRecommendedNode,
  getNewlyUnlockedNodes 
} from '../data/dag/dagEdges';
import { useScaffolding } from '../components/ScaffoldingProvider';
import { attemptDAGPhase } from '../data/tractionStore';
import { vvGet, vvGetJSON, vvSetJSON, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

const DAG_PROGRESS_KEY = STORAGE_KEYS.DAG_PROGRESS;

const DEFAULT_PROGRESS = {
  currentNodeId: 'fret-1-class-be', // Everyone starts here
  completedNodes: [],
  unlockedNodes: ['fret-1-class-be'], // First node is always unlocked
  recommendedNodes: [],
  phaseStates: {}, // nodeId -> { beCompleted, doCompleted, playCompleted, ... }
  pathHistory: [],
  lastAccessed: null,
};

function loadProgress() {
  try {
    const saved = vvGetJSON(DAG_PROGRESS_KEY, null);
    if (!saved) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...saved };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress) {
  try {
    vvSetJSON(DAG_PROGRESS_KEY, progress);
  } catch (e) {
    console.warn('[useDAGProgress] Failed to save:', e);
  }
}

export function useDAGProgress() {
  const scaffolding = useScaffolding();
  const isUsingScaffolding = scaffolding && !scaffolding.isFallback;

  // Local state is used as a fallback/isolated mode for tests
  const [localProgress, setLocalProgress] = useState(loadProgress);
  const [sandboxMode, setSandboxMode] = useState(() => {
    try {
      const raw = vvGet(STORAGE_KEYS.TRACTION);
      if (raw) return JSON.parse(raw).settings?.sandboxMode === true;
    } catch { /* ignore */ }
    return false;
  });

  // Keep sandboxMode synced across tab updates
  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = vvGet(STORAGE_KEYS.TRACTION);
        if (raw) {
          setSandboxMode(JSON.parse(raw).settings?.sandboxMode === true);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handleStorage);
    // No polling — the storage event handles cross-tab sync,
    // and same-tab updates are already handled by React state.
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // ── Merge local progress into scaffolding on transition ──
  // When the ScaffoldingProvider becomes available (e.g. user logs in),
  // any progress made in local-only mode must be carried over.
  const prevIsUsingScaffoldingRef = useRef(false);
  useEffect(() => {
    if (isUsingScaffolding && !prevIsUsingScaffoldingRef.current) {
      const localCompleted = localProgress.completedNodes || [];
      const scaffoldingCompleted = scaffolding.completedNodes || [];
      const missing = localCompleted.filter(id => !scaffoldingCompleted.includes(id));
      if (missing.length > 0) {
        // Merge each missing node into the scaffolding state
        missing.forEach(nodeId => {
          scaffolding.advanceNode(nodeId);
        });
        // Clear the local key to prevent future divergence
        try { vvRemove(DAG_PROGRESS_KEY); } catch { /* ignore */ }
        setLocalProgress({ ...DEFAULT_PROGRESS });
      }
    }
    prevIsUsingScaffoldingRef.current = isUsingScaffolding;
  }, [isUsingScaffolding, localProgress.completedNodes, scaffolding]);

  // ── Unified State getters ──
  const currentNodeId = useMemo(() => {
    return isUsingScaffolding ? scaffolding.currentNodeId : localProgress.currentNodeId;
  }, [isUsingScaffolding, scaffolding.currentNodeId, localProgress.currentNodeId]);

  const completedNodesArray = useMemo(() => {
    return isUsingScaffolding ? scaffolding.completedNodes : localProgress.completedNodes;
  }, [isUsingScaffolding, scaffolding.completedNodes, localProgress.completedNodes]);

  const currentNode = useMemo(() => getNodeById(currentNodeId), [currentNodeId]);
  
  const currentFret = useMemo(() => currentNode?.fret || 1, [currentNode]);
  
  const currentFretMetadata = useMemo(() => FRET_METADATA[currentFret] || {}, [currentFret]);
  
  const completedNodesList = useMemo(() => 
    completedNodesArray.map(id => getNodeById(id)).filter(Boolean),
    [completedNodesArray]
  );
  
  const unlockedNodesList = useMemo(() => {
    if (sandboxMode) return dagNodes;
    if (isUsingScaffolding) {
      return dagNodes.filter(n => isNodeUnlocked(n.id, completedNodesArray, sandboxMode));
    }
    return localProgress.unlockedNodes.map(id => getNodeById(id)).filter(Boolean);
  }, [localProgress.unlockedNodes, completedNodesArray, sandboxMode, isUsingScaffolding]);
  
  const recommendedNodesList = useMemo(() => {
    const recs = dagNodes
      .filter(n => isNodeRecommended(n.id, completedNodesArray, sandboxMode))
      .map(n => n.id);
    return recs.map(id => getNodeById(id)).filter(Boolean);
  }, [completedNodesArray, sandboxMode]);
  
  const nextRecommendedNode = useMemo(() => {
    const nextId = getNextRecommendedNode(completedNodesArray, currentNode?.pillar, sandboxMode);
    return nextId ? getNodeById(nextId) : null;
  }, [completedNodesArray, currentNode, sandboxMode]);

  
  // ── Actions ──
  
  const completeNode = useCallback((nodeId) => {
    if (isUsingScaffolding) {
      scaffolding.advanceNode(nodeId);
      return;
    }
    
    setLocalProgress(prev => {
      if (prev.completedNodes.includes(nodeId)) return prev;
      
      const newCompleted = [...prev.completedNodes, nodeId];
      const newlyUnlocked = getNewlyUnlockedNodes(nodeId);
      const newUnlocked = [...new Set([...prev.unlockedNodes, ...newlyUnlocked])];
      
      const newProgress = {
        ...prev,
        completedNodes: newCompleted,
        unlockedNodes: newUnlocked,
        currentNodeId: getNextRecommendedNode(newCompleted, getNodeById(nodeId)?.pillar, sandboxMode) || nodeId,
        pathHistory: [...prev.pathHistory, { nodeId, timestamp: new Date().toISOString() }],
        lastAccessed: new Date().toISOString(),
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, [isUsingScaffolding, scaffolding, sandboxMode]);
  
  const setCurrentNode = useCallback((nodeId) => {
    if (isUsingScaffolding) {
      scaffolding.navigateToNode(nodeId);
      return;
    }
    
    setLocalProgress(prev => {
      const newProgress = {
        ...prev,
        currentNodeId: nodeId,
        lastAccessed: new Date().toISOString(),
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [isUsingScaffolding, scaffolding]);
  
  const getPhaseState = useCallback((nodeId) => {
    if (isUsingScaffolding) {
      const node = getNodeById(nodeId);
      if (node) {
        const fretState = scaffolding.traction?.frets?.[node.fret] || {};
        return {
          beCompleted: !!fretState.beCompleted,
          doCompleted: !!fretState.doCompleted,
          playCompleted: !!fretState.playCompleted,
          beAttempts: fretState.beAttempts || 0,
          doAttempts: fretState.doAttempts || 0,
          playAttempts: fretState.playAttempts || 0,
          lastAccessed: fretState.lastAccessed || null,
        };
      }
    }
    
    return localProgress.phaseStates[nodeId] || {
      beCompleted: false,
      doCompleted: false,
      playCompleted: false,
      beAttempts: 0,
      doAttempts: 0,
      playAttempts: 0,
      lastAccessed: null,
    };
  }, [isUsingScaffolding, scaffolding.traction.frets, localProgress.phaseStates]);
  
  const updatePhaseState = useCallback((nodeId, phase, status) => {
    if (isUsingScaffolding) {
      if (status === 'completed') {
        scaffolding.completePhase(nodeId, phase);
      } else if (status === 'attempted') {
        const node = getNodeById(nodeId);
        if (node) {
          scaffolding.updateTraction(prev => attemptDAGPhase(prev, node.fret, phase));
        }
      }
      return;
    }
    
    setLocalProgress(prev => {
      const current = prev.phaseStates[nodeId] || {};
      const newPhaseState = {
        ...current,
        [`${phase}Completed`]: status === 'completed',
        [`${phase}Attempts`]: (current[`${phase}Attempts`] || 0) + (status === 'attempted' ? 1 : 0),
        lastAccessed: new Date().toISOString(),
      };
      
      const newProgress = {
        ...prev,
        phaseStates: { ...prev.phaseStates, [nodeId]: newPhaseState },
      };
      
      // Auto-complete node if all phases are done
      const node = getNodeById(nodeId);
      if (node && node.phase !== 'all') {
        const phases = ['be', 'do', 'play'];
        const allPhasesComplete = phases.every(p => newPhaseState[`${p}Completed`]);
        if (allPhasesComplete && !prev.completedNodes.includes(nodeId)) {
          newProgress.completedNodes = [...prev.completedNodes, nodeId];
          newProgress.unlockedNodes = [...new Set([...prev.unlockedNodes, ...getNewlyUnlockedNodes(nodeId)])];
        }
      }
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, [isUsingScaffolding, scaffolding]);
  
  const getFretProgress = useCallback((fret) => {
    const fretNodes = getNodesByFret(fret);
    const completed = fretNodes.filter(n => completedNodesArray.includes(n.id));
    return {
      total: fretNodes.length,
      completed: completed.length,
      percentage: fretNodes.length > 0 ? Math.round((completed.length / fretNodes.length) * 100) : 0,
      isComplete: completed.length === fretNodes.length,
    };
  }, [completedNodesArray]);
  
  const getPillarProgress = useCallback((pillar) => {
    const pillarNodes = dagNodes.filter(n => n.pillar === pillar);
    const completed = pillarNodes.filter(n => completedNodesArray.includes(n.id));
    return {
      total: pillarNodes.length,
      completed: completed.length,
      percentage: pillarNodes.length > 0 ? Math.round((completed.length / pillarNodes.length) * 100) : 0,
    };
  }, [completedNodesArray]);
  
  return {
    // State
    progress: {
      currentNodeId,
      completedNodes: completedNodesArray,
      unlockedNodes: unlockedNodesList.map(n => n.id),
      recommendedNodes: recommendedNodesList.map(n => n.id),
      phaseStates: isUsingScaffolding ? {} : localProgress.phaseStates,
      pathHistory: isUsingScaffolding ? [] : localProgress.pathHistory,
      lastAccessed: isUsingScaffolding ? null : localProgress.lastAccessed,
    },
    currentNode,
    currentFret,
    currentFretMetadata,
    completedNodes: completedNodesList,
    unlockedNodes: unlockedNodesList,
    recommendedNodes: recommendedNodesList,
    nextRecommendedNode,
    
    // Actions
    completeNode,
    setCurrentNode,
    getPhaseState,
    updatePhaseState,
    getFretProgress,
    getPillarProgress,
  };
}

export default useDAGProgress;
