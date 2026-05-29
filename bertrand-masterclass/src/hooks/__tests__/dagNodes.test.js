// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagNodes.test.js                                   ║
// ║ WHAT    : Unit tests for DAG node graph and edges            ║
// ║ WHY     : Validate unlock logic, prerequisites, progress     ║
// ║ STAGE   : TEST (AI+DAG Harmonization Phase A)              ║
// ╚═══════════════════════════════════════════════════════════════╝

import { dagNodes, getNodeById, getNodesByFret, getNodesByPillar, getPrerequisites, getMilestoneForFret, getTotalXp, getFretXp } from '../../data/dag/dagNodes';
import { isNodeUnlocked, getNextRecommendedNode } from '../../data/dag/dagEdges';

describe('DAG Node Graph', () => {
  test('dagNodes has at least Fret 1 nodes', () => {
    expect(dagNodes.length).toBeGreaterThanOrEqual(12);
  });

  test('Fret 1 has expected nodes', () => {
    const fret1Nodes = getNodesByFret(1);
    expect(fret1Nodes.length).toBeGreaterThanOrEqual(11); // 3 pillars × 3 phases + milestone + reflection
  });

  test('Every node has required fields', () => {
    dagNodes.forEach(node => {
      expect(node.id).toBeTruthy();
      expect(node.pillar).toMatch(/^(class|guitar|workbook)$/);
      expect(node.fret).toBeGreaterThanOrEqual(1);
      expect(node.fret).toBeLessThanOrEqual(12);
      expect(node.phase).toMatch(/^(be|do|play|all)$/);
      expect(node.title).toBeTruthy();
      expect(node.troubadourPrompt).toBeTruthy();
      expect(node.troubadourPrompt).toMatch(/Over\.?$/); // "Over" or "Over." — Nemotron sometimes omits period
      expect(node.xpValue).toBeGreaterThan(0);
      expect(node.estimatedMinutes).toBeGreaterThan(0);
    });
  });

  test('Every fret has a milestone', () => {
    for (let fret = 1; fret <= 12; fret++) {
      const milestone = getMilestoneForFret(fret);
      // If fret is not yet defined in dagNodes, skip
      if (getNodesByFret(fret).length === 0) continue;
      expect(milestone).not.toBeNull();
      expect(milestone.type).toBe('milestone');
    }
  });

  test('Node IDs are unique', () => {
    const ids = dagNodes.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('Prerequisites reference existing nodes', () => {
    dagNodes.forEach(node => {
      node.prerequisites.forEach(prereqId => {
        const prereq = getNodeById(prereqId);
        expect(prereq).not.toBeNull();
        expect(prereq.id).toBe(prereqId);
      });
    });
  });
});

describe('DAG Unlock Logic', () => {
  test('First node (fret-1-class-be) is always unlocked', () => {
    expect(isNodeUnlocked('fret-1-class-be', [])).toBe(true);
  });

  test('Node with prerequisites requires them completed', () => {
    const node = getNodeById('fret-1-class-do');
    if (!node) return;
    
    // Without prerequisites
    expect(isNodeUnlocked(node.id, [])).toBe(false);
    
    // With prerequisites
    expect(isNodeUnlocked(node.id, node.prerequisites)).toBe(true);
  });
});

describe('DAG Progress', () => {
  test('Fret 1 XP is positive', () => {
    expect(getFretXp(1)).toBeGreaterThan(0);
  });

  test('Total XP is positive', () => {
    expect(getTotalXp()).toBeGreaterThan(0);
  });
});

describe('Next Recommended Node', () => {
  test('Returns first node when nothing completed', () => {
    const next = getNextRecommendedNode([], 'class');
    expect(next).toBe('fret-1-class-be');
  });

  test('Returns next phase after completing BE', () => {
    const next = getNextRecommendedNode(['fret-1-class-be'], 'class');
    expect(next).toBe('fret-1-class-do');
  });
});
