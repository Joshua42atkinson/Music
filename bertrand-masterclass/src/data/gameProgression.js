// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : gameProgression.js                                  ║
// ║ WHAT    : Commitment tiers, time matrix, and graduation logic ║
// ║ WHY     : The game needs a win condition (3 original songs)   ║
// ║           and a time-aware path to get there                  ║
// ║ WHO     : Used by BEWorkbook, onboarding, and dashboard       ║
// ║ OWNS    : COMMITMENT_TIERS, TIME_MATRIX, song milestone logic ║
// ║ NEEDS   : tractionStore (reads commitment tier from state)    ║
// ║ RULES   : Songs are the milestones, not fret completion       ║
// ║           Time estimates are based on ABRSM/Suzuki research   ║
// ║           "Character first, ability second" — Suzuki axiom    ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════
// COMMITMENT TIERS
// Three paths to graduation. All reach the same destination.
// Time estimates grounded in ABRSM grading data, Fender's
// practice research, and deliberate practice literature.
// ═══════════════════════════════════════════════════════════

export const COMMITMENT_TIERS = {
  gentle: {
    id: 'gentle',
    icon: '☀️',
    name: { en: 'The Gentle Path', fr: 'Le Chemin Doux' },
    subtitle: { en: '15 min/day, a few days a week', fr: '15 min/jour, quelques jours par semaine' },
    dailyMinutes: 15,
    daysPerWeek: 3,
    totalWeeks: 40,
    color: '#60a5fa',
    acts: [
      { frets: [1, 2, 3, 4], weeks: 12, songDue: 1 },
      { frets: [5, 6, 7, 8], weeks: 16, songDue: 2 },
      { frets: [9, 10, 11, 12], weeks: 12, songDue: 3 },
    ],
    description: {
      en: 'For the parent who practices after the kids sleep. For the worker who steals 15 minutes at lunch. Slow is not weak — slow is deliberate.',
      fr: 'Pour le parent qui pratique après le coucher des enfants. Lent ne veut pas dire faible — lent veut dire délibéré.',
    },
  },
  committed: {
    id: 'committed',
    icon: '🎸',
    name: { en: 'The Committed Path', fr: 'Le Chemin Engagé' },
    subtitle: { en: '30 min/day, most days', fr: '30 min/jour, la plupart des jours' },
    dailyMinutes: 30,
    daysPerWeek: 5,
    totalWeeks: 20,
    color: '#a78bfa',
    acts: [
      { frets: [1, 2, 3, 4], weeks: 6, songDue: 1 },
      { frets: [5, 6, 7, 8], weeks: 8, songDue: 2 },
      { frets: [9, 10, 11, 12], weeks: 6, songDue: 3 },
    ],
    description: {
      en: 'The dedicated student who shows up daily. You will feel the shift around month two.',
      fr: 'L\'étudiant dévoué qui se présente chaque jour. Vous sentirez le changement vers le deuxième mois.',
    },
  },
  intensive: {
    id: 'intensive',
    icon: '🔥',
    name: { en: 'The Intensive Path', fr: 'Le Chemin Intensif' },
    subtitle: { en: '60+ min/day, nearly every day', fr: '60+ min/jour, presque tous les jours' },
    dailyMinutes: 60,
    daysPerWeek: 6,
    totalWeeks: 12,
    color: '#f59e0b',
    acts: [
      { frets: [1, 2, 3, 4], weeks: 3, songDue: 1 },
      { frets: [5, 6, 7, 8], weeks: 5, songDue: 2 },
      { frets: [9, 10, 11, 12], weeks: 4, songDue: 3 },
    ],
    description: {
      en: 'Summer intensive. Career changer. The obsessed. Three months of total immersion.',
      fr: 'Stage intensif d\'été. Reconversion. Les passionnés. Trois mois d\'immersion totale.',
    },
  },
};

// ═══════════════════════════════════════════════════════════
// THREE SONGS — The Win Condition
// Each song maps to a pillar and a phase of growth.
// Song 1 = BE (identity), Song 2 = DO (imagination),
// Song 3 = PLAY (expression). Three songs = Troubadour.
// ═══════════════════════════════════════════════════════════

export const SONG_MILESTONES = [
  {
    id: 1,
    pillar: 'be',
    title: { en: 'The Root', fr: 'La Racine' },
    unlockAfterFret: 4,
    description: {
      en: 'Your first song. 3-4 chords played with intention. It can be 30 seconds. It must be yours.',
      fr: 'Votre première chanson. 3-4 accords joués avec intention. Elle peut durer 30 secondes. Elle doit être la vôtre.',
    },
    prompt: {
      en: 'Sit with your guitar. Close your eyes. What sound wants to come out? Play it. Record it. That is Song One.',
      fr: 'Asseyez-vous avec votre guitare. Fermez les yeux. Quel son veut sortir ? Jouez-le. Enregistrez-le. C\'est la Chanson Un.',
    },
    requirement: {
      en: 'A video of you performing an original piece (any length, any complexity)',
      fr: 'Une vidéo de vous interprétant une pièce originale (toute durée, toute complexité)',
    },
  },
  {
    id: 2,
    pillar: 'do',
    title: { en: 'The Bridge', fr: 'Le Pont' },
    unlockAfterFret: 8,
    description: {
      en: 'You can now hear an interval in your head, find it on the fretboard, and build a melody around it.',
      fr: 'Vous pouvez maintenant entendre un intervalle dans votre tête, le trouver sur le manche, et construire une mélodie autour.',
    },
    prompt: {
      en: 'Close your eyes. Hum a melody. Now find it on the guitar. Build 4 bars around that melody. This is Song Two.',
      fr: 'Fermez les yeux. Fredonnez une mélodie. Trouvez-la sur la guitare. Construisez 4 mesures. C\'est la Chanson Deux.',
    },
    requirement: {
      en: 'A video of you performing a song that includes a melody you heard in your imagination first',
      fr: 'Une vidéo de vous interprétant une chanson incluant une mélodie que vous avez d\'abord entendue dans votre imagination',
    },
  },
  {
    id: 3,
    pillar: 'play',
    title: { en: 'The Return', fr: 'Le Retour' },
    unlockAfterFret: 12,
    description: {
      en: 'Perform freely. Voice and guitar together. Do not stop for mistakes. The song plays through you.',
      fr: 'Jouez librement. Voix et guitare ensemble. Ne vous arrêtez pas pour les erreurs. La chanson joue à travers vous.',
    },
    prompt: {
      en: 'This is your final song. Play it once, all the way through. No restarts. When it ends, bow.',
      fr: 'C\'est votre chanson finale. Jouez-la une fois, du début à la fin. Pas de reprise. Quand elle finit, saluez.',
    },
    requirement: {
      en: 'A video of a complete, uninterrupted performance — voice optional, presence required',
      fr: 'Une vidéo d\'une performance complète et ininterrompue — voix optionnelle, présence requise',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// THREE ACTS — The Journey Structure
// Maps to the Hero's Journey: Departure → Initiation → Return
// ═══════════════════════════════════════════════════════════

export const ACTS = [
  {
    id: 1,
    title: { en: 'Finding Your Root', fr: 'Trouver Votre Racine' },
    subtitle: { en: 'BE — Identity & Permission', fr: 'ÊTRE — Identité & Permission' },
    frets: [1, 2, 3, 4],
    pillar: 'be',
    color: '#60a5fa',
    focus: {
      en: 'Breathing, listening, relaxation, first chords. Giving yourself permission to be a musician.',
      fr: 'Respiration, écoute, relaxation, premiers accords. Se donner la permission d\'être musicien.',
    },
    songMilestone: 1,
  },
  {
    id: 2,
    title: { en: 'Learning the Language', fr: 'Apprendre le Langage' },
    subtitle: { en: 'DO — Imagination & Precision', fr: 'FAIRE — Imagination & Précision' },
    frets: [5, 6, 7, 8],
    pillar: 'do',
    color: '#a78bfa',
    focus: {
      en: 'Intervals, fretboard geometry, singing-to-playing. The imagination is the secret key.',
      fr: 'Intervalles, géométrie du manche, chanter-pour-jouer. L\'imagination est la clé secrète.',
    },
    songMilestone: 2,
  },
  {
    id: 3,
    title: { en: 'Playing Free', fr: 'Jouer Libre' },
    subtitle: { en: 'PLAY — Expression & Surrender', fr: 'JOUER — Expression & Abandon' },
    frets: [9, 10, 11, 12],
    pillar: 'play',
    color: '#34d399',
    focus: {
      en: 'Full neck exploration, performing for others, free improvisation. The guitar plays through you.',
      fr: 'Exploration complète du manche, jouer pour les autres, improvisation libre. La guitare joue à travers vous.',
    },
    songMilestone: 3,
  },
];

// ═══════════════════════════════════════════════════════════
// PROGRESSION CALCULATOR
// Given a commitment tier and a start date, compute where
// the student "should" be and when they'll graduate.
// ═══════════════════════════════════════════════════════════

/**
 * Get the student's expected timeline based on their commitment tier.
 * @param {string} tierId - 'gentle' | 'committed' | 'intensive'
 * @param {string|null} startDate - ISO date string when the student started
 * @returns {Object} Timeline with ETA, current act, weeks elapsed, etc.
 */
export function getProgressionTimeline(tierId, startDate) {
  const tier = COMMITMENT_TIERS[tierId] || COMMITMENT_TIERS.committed;

  if (!startDate) {
    return {
      tier,
      weeksElapsed: 0,
      currentAct: 1,
      expectedFret: 1,
      graduationEta: null,
      songsCompleted: 0,
      percentComplete: 0,
    };
  }

  const start = new Date(startDate);
  const now = new Date();
  const msElapsed = now - start;
  const weeksElapsed = Math.max(0, Math.floor(msElapsed / (7 * 24 * 60 * 60 * 1000)));

  // Determine which act and expected fret
  let cumulativeWeeks = 0;
  let currentAct = 3;
  let expectedFret = 12;

  for (const act of tier.acts) {
    if (weeksElapsed < cumulativeWeeks + act.weeks) {
      currentAct = act.songDue;
      const progressInAct = (weeksElapsed - cumulativeWeeks) / act.weeks;
      const fretIndex = Math.floor(progressInAct * act.frets.length);
      expectedFret = act.frets[Math.min(fretIndex, act.frets.length - 1)];
      break;
    }
    cumulativeWeeks += act.weeks;
  }

  // Graduation ETA
  const graduationDate = new Date(start);
  graduationDate.setDate(graduationDate.getDate() + tier.totalWeeks * 7);

  const percentComplete = Math.min(100, Math.round((weeksElapsed / tier.totalWeeks) * 100));

  return {
    tier,
    weeksElapsed,
    currentAct,
    expectedFret,
    graduationEta: graduationDate.toISOString(),
    graduationFormatted: graduationDate.toLocaleDateString(undefined, {
      month: 'long', year: 'numeric',
    }),
    percentComplete,
    totalWeeks: tier.totalWeeks,
    weeksRemaining: Math.max(0, tier.totalWeeks - weeksElapsed),
  };
}

/**
 * Get which song milestone is currently active for a student.
 * @param {Object} traction - The student's traction state
 * @returns {Object|null} The next incomplete song milestone, or null if graduated
 */
export function getActiveSongMilestone(traction) {
  const songs = traction.songs || {};
  for (const milestone of SONG_MILESTONES) {
    if (!songs[milestone.id]?.submitted) {
      return milestone;
    }
  }
  return null; // All songs submitted — graduated!
}

/**
 * Check if the student has graduated (all 3 songs submitted).
 * @param {Object} traction - The student's traction state
 * @returns {boolean}
 */
export function hasGraduated(traction) {
  const songs = traction.songs || {};
  return SONG_MILESTONES.every(m => songs[m.id]?.submitted);
}

/**
 * Get the current act based on which fret the student is on.
 * @param {number} currentFret
 * @returns {Object} The act data
 */
export function getCurrentAct(currentFret) {
  return ACTS.find(act => act.frets.includes(currentFret)) || ACTS[0];
}
