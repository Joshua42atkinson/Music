// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagEdges.js                                        ║
// ║ WHAT    : Adjacency list — prerequisites & suggestedAfter    ║
// ║ WHY     : Graph traversal logic for the Troubadour           ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

import { dagNodes, getNodeById } from './dagNodes';

/**
 * Build a map of all edges for fast traversal.
 * @returns {Map<string, {prerequisites: string[], suggestedAfter: string[], unlockedBy: string[]}>}
 */
export function buildEdgeMap() {
  const edgeMap = new Map();
  
  // Initialize all nodes
  dagNodes.forEach(node => {
    edgeMap.set(node.id, {
      prerequisites: [...node.prerequisites],
      suggestedAfter: [...node.suggestedAfter],
      unlockedBy: [], // Nodes that THIS node unlocks (reverse lookup)
    });
  });
  
  // Build reverse edges
  dagNodes.forEach(node => {
    node.prerequisites.forEach(prereqId => {
      const prereqEntry = edgeMap.get(prereqId);
      if (prereqEntry) {
        prereqEntry.unlockedBy.push(node.id);
      }
    });
  });
  
  return edgeMap;
}

/**
 * Check if a node is unlocked given a list of completed nodes.
 * @param {string} nodeId
 * @param {string[]} completedNodeIds
 * @returns {boolean}
 */
export function isNodeUnlocked(nodeId, completedNodeIds, sandboxMode = false) {
  if (sandboxMode) return true;
  const node = getNodeById(nodeId);
  if (!node) return false;
  if (node.prerequisites.length === 0) return true; // First nodes are always unlocked
  return node.prerequisites.every(prereqId => completedNodeIds.includes(prereqId));
}

/**
 * Check if a node is "recommended" (unlocked + all suggestedAfter prerequisites met).
 * @param {string} nodeId
 * @param {string[]} completedNodeIds
 * @returns {boolean}
 */
export function isNodeRecommended(nodeId, completedNodeIds, sandboxMode = false) {
  if (!isNodeUnlocked(nodeId, completedNodeIds, sandboxMode)) return false;
  const node = getNodeById(nodeId);
  if (!node) return false;
  if (completedNodeIds.includes(nodeId)) return false; // Already completed
  // A node is recommended if all its suggestedAfter nodes are completed
  return node.suggestedAfter.every(suggId => completedNodeIds.includes(suggId));
}

/**
 * Get all nodes that become unlocked when a node is completed.
 * @param {string} completedNodeId
 * @returns {string[]} - List of newly unlocked node IDs
 */
export function getNewlyUnlockedNodes(completedNodeId) {
  const edgeMap = buildEdgeMap();
  const entry = edgeMap.get(completedNodeId);
  return entry ? entry.unlockedBy : [];
}

/**
 * Get the recommended next node for a student.
 * Priority: 1) Current pillar BE phase, 2) Same fret next phase, 3) Next fret BE phase
 * @param {string[]} completedNodeIds
 * @param {string} [currentPillar] - 'class' | 'guitar' | 'workbook'
 * @returns {string|null} - Node ID or null if all complete
 */
export function getNextRecommendedNode(completedNodeIds, currentPillar = 'class') {
  // Find the highest fret with completed nodes
  const completedFrets = new Set();
  completedNodeIds.forEach(id => {
    const node = getNodeById(id);
    if (node) completedFrets.add(node.fret);
  });
  
  const maxCompletedFret = Math.max(...completedFrets, 0);
  
  // Strategy: Complete current fret in current pillar, then move to next fret
  // Phase order: be -> do -> play -> milestone
  const phaseOrder = ['be', 'do', 'play', 'all'];
  
  // Check current fret for next phase in current pillar
  const currentFretNodes = dagNodes.filter(n => n.fret === maxCompletedFret && n.pillar === currentPillar);
  for (const phase of phaseOrder) {
    const node = currentFretNodes.find(n => n.phase === phase && !completedNodeIds.includes(n.id));
    if (node && isNodeUnlocked(node.id, completedNodeIds)) {
      return node.id;
    }
  }
  
  // If current fret pillar is complete, try other pillars at same fret
  const pillars = ['class', 'guitar', 'workbook'];
  for (const pillar of pillars) {
    if (pillar === currentPillar) continue;
    const pillarNodes = dagNodes.filter(n => n.fret === maxCompletedFret && n.pillar === pillar);
    for (const phase of phaseOrder) {
      const node = pillarNodes.find(n => n.phase === phase && !completedNodeIds.includes(n.id));
      if (node && isNodeUnlocked(node.id, completedNodeIds)) {
        return node.id;
      }
    }
  }
  
  // If all pillars at current fret are complete, move to next fret
  const nextFret = maxCompletedFret + 1;
  if (nextFret <= 12) {
    const nextFretNodes = dagNodes.filter(n => n.fret === nextFret);
    for (const node of nextFretNodes) {
      if (!completedNodeIds.includes(node.id) && isNodeUnlocked(node.id, completedNodeIds)) {
        return node.id;
      }
    }
  }
  
  return null; // All complete!
}

/**
 * Get all nodes along the "critical path" (minimum nodes to reach a target).
 * @param {string} targetNodeId
 * @returns {string[]} - Ordered list of prerequisite node IDs
 */
export function getCriticalPath(targetNodeId) {
  const path = [];
  const visited = new Set();
  
  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = getNodeById(nodeId);
    if (!node) return;
    
    // Visit prerequisites first
    node.prerequisites.forEach(prereqId => {
      dfs(prereqId);
    });
    
    path.push(nodeId);
  }
  
  dfs(targetNodeId);
  return path;
}

