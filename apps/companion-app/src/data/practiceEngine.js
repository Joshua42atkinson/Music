// ═══════════════════════════════════════════════════════════
// PRACTICE ENGINE — Generates a 20-minute daily session
// from the student's current DAG position.
// Wraps the curriculum around the person, not the person around the app.
// ═══════════════════════════════════════════════════════════

import { getNodeById } from './dag/dagNodes';
import { getNextRecommendedNode } from './dag/dagEdges';

const DAILY_DURATION = 20; // minutes

const PHASE_TIME = {
  be: 7,   // Imagine: slides, meditation, concepts
  do: 8,   // Hear: pitch room, audiation, interval work
  play: 5, // Play: fretboard, exercises, free improv
};

/**
 * Calculate block durations based on commitment tier.
 * Gentle: 10m, Committed: 20m, Intensive: 30m
 */
function getDurationsForTier(tier = 'committed') {
  const normalizedTier = typeof tier === 'string' ? tier.toLowerCase() : 'committed';
  switch (normalizedTier) {
    case 'gentle':
      return { breath: 1, review: 2, new: 5, reflect: 2 };
    case 'intensive':
      return { breath: 3, review: 7, new: 15, reflect: 5 };
    case 'committed':
    default:
      return { breath: 2, review: 5, new: 10, reflect: 3 };
  }
}

/**
 * Generate a structured daily practice session based on commitment tier.
 * Returns: { title, blocks[], totalMinutes, focusNode, reviewNode }
 */
export function generateDailySession(traction, completedNodes) {
  const nextNode = getNextRecommendedNode(completedNodes);
  const focusNode = nextNode ? getNodeById(nextNode) : null;

  // Find a review node (completed but not 'Mastered' — mastery < 3)
  const reviewNode = findReviewNode(traction, completedNodes);
  
  const tierDurations = getDurationsForTier(traction?.commitmentTier);

  const blocks = [];

  // ── Block 1: Breathing Gate ──
  blocks.push({
    type: 'breathing',
    label: 'Breathing Gate',
    description: 'Square breathing. 4 counts: inhale, hold, exhale, hold.',
    duration: tierDurations.breath,
    icon: '🫁',
  });

  // ── Block 2: Warm-up / Review ──
  if (reviewNode) {
    blocks.push({
      type: 'review',
      label: `Review: ${reviewNode.title}`,
      description: reviewNode.description,
      nodeId: reviewNode.id,
      fret: reviewNode.fret,
      phase: reviewNode.phase,
      duration: tierDurations.review,
      icon: '🔄',
    });
  } else {
    blocks.push({
      type: 'warmup',
      label: 'Warm-up',
      description: 'Chromatics. One finger per fret. Slow, mindful.',
      duration: tierDurations.review,
      icon: '🔥',
    });
  }

  // ── Block 3: New Material ──
  if (focusNode) {
    blocks.push({
      type: 'new',
      label: focusNode.title,
      description: focusNode.description,
      nodeId: focusNode.id,
      fret: focusNode.fret,
      phase: focusNode.phase,
      duration: tierDurations.new,
      icon: '🎯',
      activities: getPhaseActivities(focusNode.phase, focusNode.fret),
    });
  } else {
    // All complete — suggest free exploration
    blocks.push({
      type: 'free',
      label: 'Free Play',
      description: 'Improvise. Sing what you play. Feel what you sing.',
      duration: tierDurations.new,
      icon: '🎸',
    });
  }

  // ── Block 4: Reflection / Close ──
  blocks.push({
    type: 'reflection',
    label: 'Reflection',
    description: 'What sensation stayed with you? Name it in three words.',
    duration: tierDurations.reflect,
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
