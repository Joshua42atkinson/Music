// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useDAGProgress.js                                   ║
// ║ WHAT    : React hook for DAG traversal state                 ║
// ║ WHY     : Every component needs to know where student is     ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState, useCallback, useMemo } from 'react';
import { dagNodes, getNodeById, getNodesByFret, FRET_METADATA } from '../data/dag/dagNodes';
import { 
  isNodeUnlocked, 
  isNodeRecommended, 
  getNextRecommendedNode,
  getNewlyUnlockedNodes 
} from '../data/dag/dagEdges';

const DAG_PROGRESS_KEY = 'voix_vive_dag_progress';

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
    const raw = localStorage.getItem(DAG_PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(DAG_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('[useDAGProgress] Failed to save:', e);
  }
}

export function useDAGProgress() {
  const [progress, setProgress] = useState(loadProgress);
  
  // ── Computed values ──
  const currentNode = useMemo(() => getNodeById(progress.currentNodeId), [progress.currentNodeId]);
  
  const currentFret = useMemo(() => currentNode?.fret || 1, [currentNode]);
  
  const currentFretMetadata = useMemo(() => FRET_METADATA[currentFret] || {}, [currentFret]);
  
  const completedNodesList = useMemo(() => 
    progress.completedNodes.map(id => getNodeById(id)).filter(Boolean),
    [progress.completedNodes]
  );
  
  const unlockedNodesList = useMemo(() =>
    progress.unlockedNodes.map(id => getNodeById(id)).filter(Boolean),
    [progress.unlockedNodes]
  );
  
  const recommendedNodesList = useMemo(() => {
    const recs = dagNodes
      .filter(n => isNodeRecommended(n.id, progress.completedNodes))
      .map(n => n.id);
    return recs.map(id => getNodeById(id)).filter(Boolean);
  }, [progress.completedNodes]);
  
  const nextRecommendedNode = useMemo(() => {
    const nextId = getNextRecommendedNode(progress.completedNodes, currentNode?.pillar);
    return nextId ? getNodeById(nextId) : null;
  }, [progress.completedNodes, currentNode]);
  
  // ── Actions ──
  
  const completeNode = useCallback((nodeId) => {
    setProgress(prev => {
      if (prev.completedNodes.includes(nodeId)) return prev;
      
      const newCompleted = [...prev.completedNodes, nodeId];
      const newlyUnlocked = getNewlyUnlockedNodes(nodeId);
      const newUnlocked = [...new Set([...prev.unlockedNodes, ...newlyUnlocked])];
      
      const newProgress = {
        ...prev,
        completedNodes: newCompleted,
        unlockedNodes: newUnlocked,
        currentNodeId: getNextRecommendedNode(newCompleted, getNodeById(nodeId)?.pillar) || nodeId,
        pathHistory: [...prev.pathHistory, { nodeId, timestamp: new Date().toISOString() }],
        lastAccessed: new Date().toISOString(),
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);
  
  const setCurrentNode = useCallback((nodeId) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        currentNodeId: nodeId,
        lastAccessed: new Date().toISOString(),
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);
  
  const getPhaseState = useCallback((nodeId) => {
    return progress.phaseStates[nodeId] || {
      beCompleted: false,
      doCompleted: false,
      playCompleted: false,
      beAttempts: 0,
      doAttempts: 0,
      playAttempts: 0,
      lastAccessed: null,
    };
  }, [progress.phaseStates]);
  
  const updatePhaseState = useCallback((nodeId, phase, status) => {
    setProgress(prev => {
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
  }, []);
  
  const getFretProgress = useCallback((fret) => {
    const fretNodes = getNodesByFret(fret);
    const completed = fretNodes.filter(n => progress.completedNodes.includes(n.id));
    return {
      total: fretNodes.length,
      completed: completed.length,
      percentage: fretNodes.length > 0 ? Math.round((completed.length / fretNodes.length) * 100) : 0,
      isComplete: completed.length === fretNodes.length,
    };
  }, [progress.completedNodes]);
  
  const getPillarProgress = useCallback((pillar) => {
    const pillarNodes = dagNodes.filter(n => n.pillar === pillar);
    const completed = pillarNodes.filter(n => progress.completedNodes.includes(n.id));
    return {
      total: pillarNodes.length,
      completed: completed.length,
      percentage: pillarNodes.length > 0 ? Math.round((completed.length / pillarNodes.length) * 100) : 0,
    };
  }, [progress.completedNodes]);
  
  return {
    // State
    progress,
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
