// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagNodes.ts                                         ║
// ║ WHAT    : Complete DAG node definitions for 12-fret curriculum║
// ║ WHY     : The Truebadour walks this graph with the student   ║
// ║ RULES   : Every node has a truebadourPrompt                  ║
// ║           Every fret has BE→DO→PLAY across 3 pillars        ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

import type { DAGNode, FretMeta } from './dagTypes';
import { getDAGNodes, getFretMetadata } from '../staticData';

/**
 * Complete node graph for the Voix Vive curriculum.
 * Organized by fret (1-12), then by pillar (class/guitar/workbook).
 * Each fret has BE→DO→PLAY phases.
 *
 * Data lives in `/public/data/dagNodes.json` and is preloaded by
 * `staticData.js` before React renders so all lookups are synchronous.
 *
 * Usage:
 *   import { dagNodes, getNodeById, getNodesByFret, getNodesByPillar } from './dagNodes';
 *   const fret1Nodes = getNodesByFret(1);
 *   const currentNode = getNodeById('fret-1-class-be');
 */

// ── Runtime cache reads (populated by preloadStaticData in main.jsx) ──

export const dagNodes: DAGNode[] = getDAGNodes();
export const FRET_METADATA: Record<number, FretMeta> = getFretMetadata();

// ── LOOKUP FUNCTIONS ──

export function getNodeById(id: string): DAGNode | null {
  return dagNodes.find(n => n.id === id) || null;
}

export function getNodesByFret(fret: number): DAGNode[] {
  return dagNodes.filter(n => n.fret === fret);
}

export function getNodesByPillar(pillar: string): DAGNode[] {
  return dagNodes.filter(n => n.pillar === pillar);
}

export function getNodesByPhase(phase: string): DAGNode[] {
  return dagNodes.filter(n => n.phase === phase);
}

export function getPrerequisites(nodeId: string): (DAGNode | null)[] {
  const node = getNodeById(nodeId);
  if (!node) return [];
  return node.prerequisites.map(prereqId => getNodeById(prereqId)).filter(Boolean);
}

export function getSuggestedAfter(nodeId: string): (DAGNode | null)[] {
  const node = getNodeById(nodeId);
  if (!node) return [];
  return node.suggestedAfter.map(suggId => getNodeById(suggId)).filter(Boolean);
}

export function getMilestoneForFret(fret: number): DAGNode | null {
  return dagNodes.find(n => n.fret === fret && n.type === 'milestone') || null;
}

export function getTotalXp(): number {
  return dagNodes.reduce((sum, n) => sum + (n.xpValue || 0), 0);
}

export function getFretXp(fret: number): number {
  return getNodesByFret(fret).reduce((sum, n) => sum + (n.xpValue || 0), 0);
}
