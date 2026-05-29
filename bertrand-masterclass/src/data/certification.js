// ═══════════════════════════════════════════════════════════
// BERTRAND APPROVED CERTIFICATION — The Capstone Audition
// The Troubadour's Trial: prove mastery through expression.
// NOT a test. A demonstration. The student becomes the teacher.
//
// IMPORTANT: All workbook, DAG progression, and practice tools
// are FREE. The only paid features are mentor interactions with
// Bertrand (video review, critique, capstone evaluation).
// ═══════════════════════════════════════════════════════════

export const CERTIFICATION_TIERS = {
  apprentice: {
    name: 'Apprentice Bard',
    epithet: 'The Unknowing Player',
    requirement: 'Complete Fret 1–4 (all phases, all pillars)',
    description: 'You hold the instrument. You do not yet know that you are the instrument.',
    audition: null, // no audition required
    price: 0,
  },
  journeyman: {
    name: 'Journeyman Bard',
    epithet: 'The Wandering Player',
    requirement: 'Complete Fret 1–8, mastery ≥ 2 on all completed phases',
    description: 'You have traveled the first eight stations. You play what you have been shown. The song is still outside you.',
    audition: {
      videoMinutes: 10,
      songsRequired: 2,
      prompt: 'Play two original compositions based on your journal reflections. Show the CAGED system in action.',
      questions: [
        'Describe the physical sensation of playing your first song. Where in your body do you feel it?',
        'What interval relationship connects your two compositions?',
      ],
    },
    price: 45,
    includes: 'Personal video review from Bertrand + written recommendations',
  },
  master: {
    name: 'Bertrand Approved Troubadour',
    epithet: 'The Knowing Singer',
    requirement: 'Complete all 12 frets, mastery ≥ 3 on at least 6 phases',
    description: 'A song is a prayer told twice. The first time you speak to yourself. The second time, the instrument speaks through you. You are no longer the player. You are the prayer.',
    audition: {
      videoMinutes: 20,
      songsRequired: 3,
      prompt: 'Play three original compositions born from your workbook journal sessions. Each must express a different emotional state.',
      questions: [
        'For each song: what part of your body is this expressed from? Do you feel it in your gut, your chest, your throat?',
        'What is your voice? What is the guitar? Answer in your own words — not theory, but lived experience.',
        'Describe a moment in your practice where the instrument disappeared and only the music remained.',
        'Teach one concept from your journey to an imaginary beginner. What would you say?',
      ],
      demonstrations: [
        'Singing while playing: match your voice to each string',
        'Square breathing: demonstrate 4-count while holding a chord',
        'The G-B glitch: explain and demonstrate the major third transition',
      ],
    },
    price: 100,
    includes: 'Full video review + personalized curriculum recommendations + signed digital certificate + "Bertrand Approved" badge on profile',
  },
};

export function getCertificationStatus(traction) {
  const frets = traction?.frets || {};
  const completedFrets = Object.entries(frets)
    .filter(([, f]) => f.beCompleted && f.doCompleted && f.playCompleted)
    .map(([id]) => parseInt(id));

  const masteries = Object.values(frets).flatMap(f => [
    f.beMastery || 0, f.doMastery || 0, f.playMastery || 0,
  ]);
  const highMasteryCount = masteries.filter(m => m >= 3).length;

  // Check tiers
  const all12 = completedFrets.length >= 12;
  const first8 = completedFrets.filter(id => id <= 8).length === 8;
  const first4 = completedFrets.filter(id => id <= 4).length === 4;

  let highest = null;
  if (all12 && highMasteryCount >= 6) {
    highest = 'master';
  } else if (first8 && masteries.every(m => m >= 2)) {
    highest = 'journeyman';
  } else if (first4) {
    highest = 'apprentice';
  }

  return {
    highestEligible: highest,
    progress: {
      completedFrets: completedFrets.length,
      totalFrets: 12,
      highMasteryCount,
      totalPhases: masteries.length,
    },
  };
}

export function getNextCertificationGoal(traction) {
  const status = getCertificationStatus(traction);
  const tier = status.highestEligible;

  if (!tier) {
    return {
      tier: 'apprentice',
      remaining: 'Complete Fret 1 BE phase to begin',
    };
  }

  if (tier === 'apprentice') {
    return {
      tier: 'journeyman',
      remaining: `Complete Frets 5–8 and raise all phase mastery to ≥ 2 (${status.progress.completedFrets}/8 frets, ${status.progress.highMasteryCount}/${status.progress.totalPhases} high masteries)`,
    };
  }

  if (tier === 'journeyman') {
    return {
      tier: 'master',
      remaining: `Complete Frets 9–12 and achieve mastery ≥ 3 on 6+ phases (${status.progress.completedFrets}/12 frets, ${status.progress.highMasteryCount}/6 high masteries)`,
    };
  }

  // Master achieved — suggest re-audition for deeper mastery
  return {
    tier: 'master',
    remaining: 'You are eligible for the Bertrand Approved capstone audition!',
    eligible: true,
  };
}
