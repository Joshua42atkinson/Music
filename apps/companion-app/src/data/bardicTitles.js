// ═══════════════════════════════════════════════════════════
// BARDIC TITLES — 12 stations of the Truebadour's journey
// Maps bardLevel (1-12) to the 12-fret hero's journey.
// NOT a game level — an identity marker. The student becomes the title.
// ═══════════════════════════════════════════════════════════

export const BARDIC_TITLES = [
  {
    level: 1,
    title: 'The Silent One',
    epithet: 'Root Note · Unison',
    description: 'Before the first sound, there is listening. You are learning to hear yourself.',
    mystery: 'Lesser Mystery of Breath',
    gift: 'Awareness of tension',
  },
  {
    level: 2,
    title: 'The Listener',
    epithet: 'Minor 2nd · The Awakening',
    description: 'The smallest step creates the greatest friction. You have begun to question.',
    mystery: 'Lesser Mystery of Attention',
    gift: 'Hearing dissonance as invitation',
  },
  {
    level: 3,
    title: 'The Questioner',
    epithet: 'Major 2nd · The Journey',
    description: 'Two semitones — a whole step into the unknown. You refuse to turn back.',
    mystery: 'Lesser Mystery of Refusal',
    gift: 'The courage to be a beginner',
  },
  {
    level: 4,
    title: 'The Initiate',
    epithet: 'Minor 3rd · The Threshold',
    description: 'Three semitones. The mentor appears when the student is ready. You are ready.',
    mystery: 'Lesser Mystery of Trust',
    gift: 'Receiving guidance without surrender',
  },
  {
    level: 5,
    title: 'The Apprentice',
    epithet: 'Major 3rd · The Bright Interval',
    description: 'Four semitones — the first major chord. You are building the beams of your own harmony.',
    mystery: 'Lesser Mystery of Construction',
    gift: 'Seeing the fretboard as architecture',
  },
  {
    level: 6,
    title: 'The Wanderer',
    epithet: 'Perfect 4th · The Open Road',
    description: 'Five semitones. The guitar is fundamentally quartal — you are learning to move vertically.',
    mystery: 'Lesser Mystery of Geography',
    gift: 'Navigating the neck without fear',
  },
  {
    level: 7,
    title: 'The Ordeal-Bearer',
    epithet: 'Tritone · The Devil\'s Interval',
    description: 'Six semitones — half an octave, the most unstable point. This is where most turn back. You will not.',
    mystery: 'Greater Mystery of The Ordeal',
    gift: 'Holding tension without collapse',
  },
  {
    level: 8,
    title: 'The Reward-Seeker',
    epithet: 'Perfect 5th · The Power Chord',
    description: 'Seven semitones — the most stable interval after the octave. You have earned your power.',
    mystery: 'Greater Mystery of The Reward',
    gift: 'Playing with authority',
  },
  {
    level: 9,
    title: 'The Returner',
    epithet: 'Minor 6th · The Road Back',
    description: 'Eight semitones. You carry what you have learned back into the world.',
    mystery: 'Greater Mystery of Return',
    gift: 'Teaching what you have lived',
  },
  {
    level: 10,
    title: 'The Reborn',
    epithet: 'Major 6th · The Return',
    description: 'Nine semitones. You are not who you were when you began. The instrument has changed you.',
    mystery: 'Greater Mystery of Transformation',
    gift: 'Singing while playing as one act',
  },
  {
    level: 11,
    title: 'The Mirror',
    epithet: 'Minor 7th · The Reflection',
    description: 'Ten semitones. You see yourself in every note. Stage fright is the ego protecting itself — you have outgrown it.',
    mystery: 'Greater Mystery of Integration',
    gift: 'Playing without performing',
  },
  {
    level: 12,
    title: 'The Truebadour',
    epithet: 'Major 7th · The Master\'s Threshold',
    description: 'Eleven semitones — one step from the octave. The journey and the destination are the same.',
    mystery: 'Greater Mystery of Mastery',
    gift: 'The voice and the guitar as one body',
  },
];

export function getBardicTitle(bardLevel) {
  const clamped = Math.max(1, Math.min(12, bardLevel || 1));
  return BARDIC_TITLES[clamped - 1];
}

export function getMasteryLabel(masteryLevel) {
  const labels = ['Encountered', 'Experienced', 'Owned', 'Mastered'];
  return labels[masteryLevel] || 'Unknown';
}

export function getMasteryStars(masteryLevel) {
  const stars = ['○', '◐', '●', '★'];
  return stars[masteryLevel] || '○';
}
