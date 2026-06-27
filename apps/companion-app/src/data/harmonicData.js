// ═══════════════════════════════════════════════════════════
// HARMONIC DATA — Pythagorean frequency ratios + physics context
// Each interval expressed as a vibration ratio and its meaning.
// This data surfaces in-game as "resonance reveals" — brief
// physics discoveries triggered by correct player actions.
//
// The student's hands discover what Pythagoras called divine.
// ═══════════════════════════════════════════════════════════

export const HARMONIC_SERIES = {
  // semitones: { ratio, label, physicsNote, pythagorean }
  0:  {
    ratio: '1:1',
    label: 'Unison',
    physicsNote: 'Identical frequencies. Two strings vibrating as one body.',
    pythagorean: 'Pythagoras called this ratio the foundation of all harmony.',
    resonanceReveal: 'Same frequency. Perfect rest.',
  },
  1:  {
    ratio: '16:15',
    label: 'Minor 2nd',
    physicsNote: 'The smallest standard ratio. Maximum acoustic roughness.',
    pythagorean: 'The shortest step. Maximum tension.',
    resonanceReveal: 'One fret apart — the tightest friction in music.',
  },
  2:  {
    ratio: '9:8',
    label: 'Major 2nd',
    physicsNote: 'The whole step. The building block of every major and minor scale.',
    pythagorean: '9:8 — Pythagorean whole tone. Two frets of separation.',
    resonanceReveal: '9:8 — the whole step that builds every scale.',
  },
  3:  {
    ratio: '6:5',
    label: 'Minor 3rd',
    physicsNote: 'The first "minor" emotional colour. 6 vibrations for every 5.',
    pythagorean: '6:5 — the ratio that gives minor chords their depth.',
    resonanceReveal: '6:5 — three frets. The sound of melancholy.',
  },
  4:  {
    ratio: '5:4',
    label: 'Major 3rd',
    physicsNote: 'The ratio of brightness. Every major chord contains this relationship.',
    pythagorean: '5:4 — the interval Pythagoras called "pure brightness."',
    resonanceReveal: '5:4 — four frets. The sound of sunrise.',
  },
  5:  {
    ratio: '4:3',
    label: 'Perfect 4th',
    physicsNote: 'The guitar is tuned in 4:3 ratios between most strings. You are holding the instrument\'s own architecture.',
    pythagorean: '4:3 — Pythagoras\'s first named consonance. The guitar itself is built from this ratio.',
    resonanceReveal: '4:3 — the ratio your guitar is tuned in.',
  },
  6:  {
    ratio: '√2:1',
    label: 'Tritone',
    physicsNote: 'The only interval that cannot be expressed as a simple integer ratio. Irrational. It literally bisects the octave.',
    pythagorean: 'The Devil\'s Interval. Pythagoras had no name for it. It defies his system.',
    resonanceReveal: '√2:1 — the only irrational interval. The crack in the system.',
  },
  7:  {
    ratio: '3:2',
    label: 'Perfect 5th',
    physicsNote: 'The second overtone. Every note in the universe generates its Perfect 5th as a natural resonance.',
    pythagorean: '3:2 — the ratio Pythagoras called most divine. The first overtone you can hear inside a single plucked string.',
    resonanceReveal: '3:2 — the most fundamental interval in physics. Your string is already singing it.',
  },
  8:  {
    ratio: '8:5',
    label: 'Minor 6th',
    physicsNote: 'The inversion of the Major 3rd. Same two notes, different order — different emotional colour.',
    pythagorean: '8:5 — the Minor 6th. The same notes as a Major 3rd, heard from the other direction.',
    resonanceReveal: '8:5 — same notes as a Major 3rd, but the world flipped.',
  },
  9:  {
    ratio: '5:3',
    label: 'Major 6th',
    physicsNote: 'Open and searching. The inversion of the Minor 3rd.',
    pythagorean: '5:3 — wistful expansion. The ratio of longing.',
    resonanceReveal: '5:3 — wide open. The sound of looking back.',
  },
  10: {
    ratio: '16:9',
    label: 'Minor 7th',
    physicsNote: 'Two whole steps below the octave. Creates the pull that makes Dominant 7th chords want to resolve.',
    pythagorean: '16:9 — the ratio that generates the blues. One step from home.',
    resonanceReveal: '16:9 — almost home. The pull of the dominant.',
  },
  11: {
    ratio: '15:8',
    label: 'Major 7th',
    physicsNote: 'One semitone below the octave. Maximum dissonance against the root, demanding resolution.',
    pythagorean: '15:8 — the threshold of the octave. You are one half-step from completion.',
    resonanceReveal: '15:8 — one fret from the octave. Breathe. Almost there.',
  },
  12: {
    ratio: '2:1',
    label: 'Octave',
    physicsNote: 'Exactly double the frequency. The string vibrates in two halves. Fret 12 is the physical midpoint of every guitar string.',
    pythagorean: '2:1 — the Octave. The frequency doubles. The cycle is complete. A new world begins.',
    resonanceReveal: '2:1 — the frequency doubled. You have completed the cycle.',
  },
};

// ─────────────────────────────────────────────────────────────
// Get the harmonic data for a given interval (in semitones)
// ─────────────────────────────────────────────────────────────

export function getHarmonicData(semitones) {
  const key = ((semitones % 12) + 12) % 12;
  return HARMONIC_SERIES[key] || HARMONIC_SERIES[0];
}

// ─────────────────────────────────────────────────────────────
// Compute the semitone interval between two MIDI notes
// ─────────────────────────────────────────────────────────────

export function semitoneDifference(midiA, midiB) {
  return ((midiB - midiA) % 12 + 12) % 12;
}

// ─────────────────────────────────────────────────────────────
// Fret → chapter context map
// Links each game pattern to the Fret page data for
// yin quote + westernTheory injection into the game UI
// ─────────────────────────────────────────────────────────────

import frets from './chapterData';

export function getFretContext(fretId) {
  if (!frets || !Array.isArray(frets)) return null;
  return frets.find(f => f.id === fretId) || null;
}

// The "cognitive prime" shown before a round — drawn from the active fret's yin
export function getCognitivePrime(fretId) {
  const fret = getFretContext(fretId);
  if (!fret) return null;
  const philosophy = fret.yin?.philosophy;
  const philosophyStr = Array.isArray(philosophy)
    ? philosophy.join(' ')
    : (typeof philosophy === 'string' ? philosophy : '');
  return {
    quote: fret.yin?.quote,
    intervalLabel: fret.interval,
    harmonicData: getHarmonicData(fretId - 1),
    coreMessage: fret.coreMessage,
    philosophyExcerpt: philosophyStr ? philosophyStr.slice(0, 180) + '…' : null,
  };
}
