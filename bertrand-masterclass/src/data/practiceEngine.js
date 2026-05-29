// ═══════════════════════════════════════════════════════════
// PRACTICE ENGINE — Generates a 20-minute daily session
// from the student's current DAG position.
// Wraps the curriculum around the person, not the person around the app.
// ═══════════════════════════════════════════════════════════

import { getNodeById } from './dag/dagNodes';
import { getNextRecommendedNode, isNodeUnlocked } from './dag/dagEdges';

const DAILY_DURATION = 20; // minutes

const PHASE_TIME = {
  be: 7,   // Imagine: slides, meditation, concepts
  do: 8,   // Hear: pitch room, audiation, interval work
  play: 5, // Play: fretboard, exercises, free improv
};

/**
 * Generate a structured 20-minute daily practice session.
 * Returns: { title, blocks[], totalMinutes, focusNode, reviewNode }
 */
export function generateDailySession(traction, completedNodes) {
  const nextNode = getNextRecommendedNode(completedNodes);
  const focusNode = nextNode ? getNodeById(nextNode) : null;

  // Find a review node (completed but not 'Mastered' — mastery < 3)
  const reviewNode = findReviewNode(traction, completedNodes);

  const blocks = [];

  // ── Block 1: Breathing Gate (always 2 min) ──
  blocks.push({
    type: 'breathing',
    label: 'Breathing Gate',
    description: 'Square breathing. 4 counts: inhale, hold, exhale, hold.',
    duration: 2,
    icon: '🫁',
  });

  // ── Block 2: Warm-up / Review (5 min) ──
  if (reviewNode) {
    blocks.push({
      type: 'review',
      label: `Review: ${reviewNode.title}`,
      description: reviewNode.description,
      nodeId: reviewNode.id,
      fret: reviewNode.fret,
      phase: reviewNode.phase,
      duration: 5,
      icon: '🔄',
    });
  } else {
    blocks.push({
      type: 'warmup',
      label: 'Warm-up',
      description: 'Chromatics. One finger per fret. Slow, mindful.',
      duration: 5,
      icon: '🔥',
    });
  }

  // ── Block 3: New Material (10 min) ──
  if (focusNode) {
    blocks.push({
      type: 'new',
      label: focusNode.title,
      description: focusNode.description,
      nodeId: focusNode.id,
      fret: focusNode.fret,
      phase: focusNode.phase,
      duration: 10,
      icon: '🎯',
      activities: getPhaseActivities(focusNode.phase, focusNode.fret),
    });
  } else {
    // All complete — suggest free exploration
    blocks.push({
      type: 'free',
      label: 'Free Play',
      description: 'Improvise. Sing what you play. Feel what you sing.',
      duration: 10,
      icon: '🎸',
    });
  }

  // ── Block 4: Reflection / Close (3 min) ──
  blocks.push({
    type: 'reflection',
    label: 'Reflection',
    description: 'What sensation stayed with you? Name it in three words.',
    duration: 3,
    icon: '✨',
  });

  const totalMinutes = blocks.reduce((sum, b) => sum + b.duration, 0);

  return {
    title: focusNode
      ? `Fret ${focusNode.fret} · ${focusNode.phase.toUpperCase()} · ${focusNode.title}`
      : 'Free Exploration Day',
    blocks,
    totalMinutes,
    focusNode,
    reviewNode,
    date: new Date().toISOString(),
  };
}

/**
 * Find a node worth reviewing: completed but mastery < 3,
 * or hasn't been touched in 7+ days.
 */
function findReviewNode(traction, completedNodes) {
  const frets = traction?.frets || {};

  // Look for completed nodes with low mastery
  for (const nodeId of completedNodes) {
    const node = getNodeById(nodeId);
    if (!node) continue;

    const f = frets[node.fret];
    if (!f) continue;

    const mastery = f[`${node.phase}Mastery`] || 0;
    const lastAccessed = f.lastAccessed ? new Date(f.lastAccessed) : null;
    const daysSince = lastAccessed
      ? (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    // Review if mastery < 3 OR hasn't been touched in 7 days
    if (mastery < 3 || daysSince > 7) {
      return node;
    }
  }

  return null;
}

/**
 * Return specific activities for each phase.
 */
function getPhaseActivities(phase, fretId) {
  switch (phase) {
    case 'be':
      return [
        'Read the yin philosophy slide',
        'Sit with the meditation prompt',
        'Visualize the interval as color/texture',
      ];
    case 'do':
      return [
        `Open Pitch Room (Fret ${fretId})`,
        'Hum the target pitch before matching',
        'Audiation: hear the note, then play it',
      ];
    case 'play':
      return [
        'Play the exercise at 60 BPM',
        'Say the note names aloud while playing',
        'Free improv: use only this fret\'s interval',
      ];
    default:
      return ['Explore the material freely'];
  }
}

/**
 * Check if student has practiced today (from log).
 */
export function hasPracticedToday(log = []) {
  const today = new Date().toDateString();
  return log.some(e => new Date(e.date).toDateString() === today);
}

/**
 * Calculate weekly practice volume (minutes).
 */
export function getWeeklyVolume(log = []) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return log
    .filter(e => new Date(e.date).getTime() > weekAgo)
    .reduce((sum, e) => sum + (e.duration || 0), 0);
}
