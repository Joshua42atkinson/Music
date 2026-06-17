// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagEdges.ts                                        ║
// ║ WHAT    : Adjacency list — prerequisites & suggestedAfter    ║
// ║ WHY     : Graph traversal logic for the Truebadour           ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

import { dagNodes, getNodeById } from './dagNodes';
import type { DAGNode } from './dagTypes';

interface EdgeEntry {
  prerequisites: string[];
  suggestedAfter: string[];
  unlockedBy: string[];
}

/**
 * Build a map of all edges for fast traversal.
 * Cached at module level since dagNodes is static.
 */
let _cachedEdgeMap: Map<string, EdgeEntry> | null = null;

export function buildEdgeMap(): Map<string, EdgeEntry> {
  if (_cachedEdgeMap) return _cachedEdgeMap;

  const edgeMap = new Map<string, EdgeEntry>();

  // Initialize all nodes
  dagNodes.forEach((node: DAGNode) => {
    edgeMap.set(node.id, {
      prerequisites: [...node.prerequisites],
      suggestedAfter: [...node.suggestedAfter],
      unlockedBy: [], // Nodes that THIS node unlocks (reverse lookup)
    });
  });

  // Build reverse edges
  dagNodes.forEach((node: DAGNode) => {
    node.prerequisites.forEach((prereqId: string) => {
      const prereqEntry = edgeMap.get(prereqId);
      if (prereqEntry) {
        prereqEntry.unlockedBy.push(node.id);
      }
    });
  });

  _cachedEdgeMap = edgeMap;
  return edgeMap;
}

/**
 * Check if a node is unlocked given a list of completed nodes.
 */
export function isNodeUnlocked(
  nodeId: string,
  completedNodeIds: string[],
  sandboxMode = false
): boolean {
  if (sandboxMode) return true;
  const node = getNodeById(nodeId);
  if (!node) return false;
  if (node.prerequisites.length === 0) return true; // First nodes are always unlocked
  return node.prerequisites.every((prereqId: string) => completedNodeIds.includes(prereqId));
}

/**
 * Check if a node is "recommended" (unlocked + all suggestedAfter prerequisites met).
 */
export function isNodeRecommended(
  nodeId: string,
  completedNodeIds: string[],
  sandboxMode = false
): boolean {
  if (!isNodeUnlocked(nodeId, completedNodeIds, sandboxMode)) return false;
  const node = getNodeById(nodeId);
  if (!node) return false;
  if (completedNodeIds.includes(nodeId)) return false; // Already completed
  // A node is recommended if all its suggestedAfter nodes are completed
  return node.suggestedAfter.every((suggId: string) => completedNodeIds.includes(suggId));
}

/**
 * Get all nodes that become unlocked when a node is completed.
 * @returns List of newly unlocked node IDs
 */
export function getNewlyUnlockedNodes(completedNodeId: string): string[] {
  const edgeMap = buildEdgeMap();
  const entry = edgeMap.get(completedNodeId);
  return entry ? entry.unlockedBy : [];
}

/**
 * Get the recommended next node for a student.
 * Priority: 1) Current pillar BE phase, 2) Same fret next phase, 3) Next fret BE phase
 * @returns Node ID or null if all complete
 */
export function getNextRecommendedNode(
  completedNodeIds: string[],
  currentPillar = 'class',
  sandboxMode = false
): string | null {
  // Find the highest fret with completed nodes
  const completedFrets = new Set<number>();
  completedNodeIds.forEach((id: string) => {
    const node = getNodeById(id);
    if (node) completedFrets.add(node.fret);
  });

  const maxCompletedFret = Math.max(...completedFrets, 0);

  // Strategy: Complete current fret in current pillar, then move to next fret
  // Phase order: be -> do -> play -> milestone
  const phaseOrder = ['be', 'do', 'play', 'all'];

  // Check current fret for next phase in current pillar
  const currentFretNodes = dagNodes.filter(
    (n: DAGNode) => n.fret === maxCompletedFret && n.pillar === currentPillar
  );
  for (const phase of phaseOrder) {
    const node = currentFretNodes.find(
      (n: DAGNode) => n.phase === phase && !completedNodeIds.includes(n.id)
    );
    if (node && isNodeUnlocked(node.id, completedNodeIds, sandboxMode)) {
      return node.id;
    }
  }

  // If current fret pillar is complete, try other pillars at same fret
  const pillars = ['class', 'guitar', 'workbook'];
  for (const pillar of pillars) {
    if (pillar === currentPillar) continue;
    const pillarNodes = dagNodes.filter(
      (n: DAGNode) => n.fret === maxCompletedFret && n.pillar === pillar
    );
    for (const phase of phaseOrder) {
      const node = pillarNodes.find(
        (n: DAGNode) => n.phase === phase && !completedNodeIds.includes(n.id)
      );
      if (node && isNodeUnlocked(node.id, completedNodeIds, sandboxMode)) {
        return node.id;
      }
    }
  }

  // If all pillars at current fret are complete, move to next fret
  const nextFret = maxCompletedFret + 1;
  if (nextFret <= 12) {
    const nextFretNodes = dagNodes.filter((n: DAGNode) => n.fret === nextFret);
    for (const node of nextFretNodes) {
      if (
        !completedNodeIds.includes(node.id) &&
        isNodeUnlocked(node.id, completedNodeIds, sandboxMode)
      ) {
        return node.id;
      }
    }
  }

  return null; // All complete!
}

/**
 * Get all nodes along the "critical path" (minimum nodes to reach a target).
 * @returns Ordered list of prerequisite node IDs
 */
export function getCriticalPath(targetNodeId: string): string[] {
  const path: string[] = [];
  const visited = new Set<string>();

  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = getNodeById(nodeId);
    if (!node) return;

    // Visit prerequisites first
    node.prerequisites.forEach((prereqId: string) => {
      dfs(prereqId);
    });

    path.push(nodeId);
  }

  dfs(targetNodeId);
  return path;
}
