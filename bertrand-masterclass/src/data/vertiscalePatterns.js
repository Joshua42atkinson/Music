// ═══════════════════════════════════════════════════════════
// VERTISCALE PATTERN LIBRARY
// All note positions derived from @tonaljs/tonal + STRING_TUNING
// (same constants as FretboardExplorer — no parallel data source)
//
// Each pattern object describes a vertical cross-section of the
// fretboard for a given scale, root, and position window.
// ═══════════════════════════════════════════════════════════

import { Scale, Interval } from '@tonaljs/tonal';

// Standard tuning — must match FretboardExplorer.jsx
export const STRING_TUNING = [
  { name: 'E', octave: 4, midiBase: 64 }, // High E (string 0)
  { name: 'B', octave: 3, midiBase: 59 },
  { name: 'G', octave: 3, midiBase: 55 },
  { name: 'D', octave: 3, midiBase: 50 },
  { name: 'A', octave: 2, midiBase: 45 },
  { name: 'E', octave: 2, midiBase: 40 }, // Low E (string 5)
];

export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

// ─────────────────────────────────────────────────────────────
// Core: compute which frets on each string contain scale notes
// within a given fret window [minFret, maxFret]
// ─────────────────────────────────────────────────────────────

export function computeVertiscale({ rootIndex, tonalName, minFret = 0, maxFret = 14 }) {
  const rootName = NOTE_NAMES[rootIndex].replace('♯', '#');
  const scaleData = Scale.get(`${rootName} ${tonalName}`);
  if (!scaleData || !scaleData.intervals) return [];

  const scaleSemitones = scaleData.intervals.map(ivl => Interval.semitones(ivl));

  // For each string, find the first scale note that falls in [minFret, maxFret]
  return STRING_TUNING.map((str) => {
    const hits = [];
    for (let fret = minFret; fret <= maxFret; fret++) {
      const midi = str.midiBase + fret;
      const noteClass = midi % 12;
      const relativeToRoot = ((noteClass - rootIndex) % 12 + 12) % 12;
      if (scaleSemitones.includes(relativeToRoot)) {
        hits.push({
          fret,
          noteName: NOTE_NAMES[noteClass],
          isRoot: noteClass === rootIndex,
          intervalIndex: scaleSemitones.indexOf(relativeToRoot),
        });
      }
    }
    // Return only the lowest fret hit per string (one dot per string for clarity)
    return hits.length > 0 ? hits[0] : null;
  });
}

// ─────────────────────────────────────────────────────────────
// Pattern Definitions
// id, label, tonalName, rootIndex, minFret, maxFret,
// phase1Eligible (can appear in Flash game),
// level: 'awakening' | 'practice' | 'flow'
// ─────────────────────────────────────────────────────────────

export const VERTISCALE_PATTERNS = [
  // ── AWAKENING (entry point — A minor pentatonic, classic) ──
  {
    id: 'am_pent_low',
    label: 'A Minor Pentatonic (Open)',
    description: 'The universal entry point. Two strings, five notes.',
    tonalName: 'minor pentatonic',
    rootIndex: 9,          // A
    minFret: 0,
    maxFret: 5,
    stringsActive: [3, 4, 5], // D, A, Low E only — simplified for beginners
    phase1Eligible: true,
    level: 'awakening',
  },
  {
    id: 'am_pent_full',
    label: 'A Minor Pentatonic (Full)',
    description: 'All six strings. The complete vertical shape.',
    tonalName: 'minor pentatonic',
    rootIndex: 9,
    minFret: 0,
    maxFret: 7,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'awakening',
  },
  {
    id: 'em_pent',
    label: 'E Minor Pentatonic (Open)',
    description: 'Open position. The blues mother-shape.',
    tonalName: 'minor pentatonic',
    rootIndex: 4,          // E
    minFret: 0,
    maxFret: 5,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'awakening',
  },

  // ── APPLIED PRACTICE (major/minor scales) ──
  {
    id: 'c_major',
    label: 'C Major (Open Position)',
    description: 'The foundational major scale. Bright and spatial.',
    tonalName: 'major',
    rootIndex: 0,          // C
    minFret: 0,
    maxFret: 5,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'practice',
  },
  {
    id: 'g_major',
    label: 'G Major (Open Position)',
    description: 'Wide open voicing. The neck reveals its breadth.',
    tonalName: 'major',
    rootIndex: 7,          // G
    minFret: 0,
    maxFret: 5,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'practice',
  },
  {
    id: 'a_natural_minor',
    label: 'A Natural Minor',
    description: 'Melancholy as teacher. Darkness with structure.',
    tonalName: 'minor',
    rootIndex: 9,          // A
    minFret: 0,
    maxFret: 7,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'practice',
  },
  {
    id: 'd_major',
    label: 'D Major',
    description: 'Same pattern, new root. Adjacent key navigation.',
    tonalName: 'major',
    rootIndex: 2,          // D
    minFret: 0,
    maxFret: 5,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'practice',
  },
  {
    id: 'am_major_pent',
    label: 'A Major Pentatonic',
    description: 'The bright mirror of the minor. Country and gospel lives here.',
    tonalName: 'major pentatonic',
    rootIndex: 9,          // A
    minFret: 0,
    maxFret: 7,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'practice',
  },

  // ── FLOW STATE (modes + chromatic) ──
  {
    id: 'a_dorian',
    label: 'A Dorian',
    description: 'Minor with a raised 6th. Jazz-adjacent, deeply expressive.',
    tonalName: 'dorian',
    rootIndex: 9,          // A
    minFret: 0,
    maxFret: 9,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'flow',
  },
  {
    id: 'g_mixolydian',
    label: 'G Mixolydian',
    description: 'Major with a flat 7th. Blues and rock live here.',
    tonalName: 'mixolydian',
    rootIndex: 7,          // G
    minFret: 0,
    maxFret: 9,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'flow',
  },
  {
    id: 'am_blues',
    label: 'A Blues Scale',
    description: 'Minor pentatonic + the blue note. Maximum emotional bandwidth.',
    tonalName: 'minor blues',
    rootIndex: 9,          // A
    minFret: 0,
    maxFret: 9,
    stringsActive: [0, 1, 2, 3, 4, 5],
    phase1Eligible: true,
    level: 'flow',
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Get patterns eligible for a given difficulty level */
export function getPatternsForLevel(level) {
  const levels = { awakening: ['awakening'], practice: ['awakening', 'practice'], flow: ['awakening', 'practice', 'flow'] };
  const allowed = levels[level] || ['awakening'];
  return VERTISCALE_PATTERNS.filter(p => p.phase1Eligible && allowed.includes(p.level));
}

/** Resolve a pattern to its full fretboard positions */
export function resolvePattern(patternId) {
  const pattern = VERTISCALE_PATTERNS.find(p => p.id === patternId);
  if (!pattern) return null;
  const positions = computeVertiscale({
    rootIndex: pattern.rootIndex,
    tonalName: pattern.tonalName,
    minFret: pattern.minFret,
    maxFret: pattern.maxFret,
  });
  return { ...pattern, positions };
}

/** Compute note frequency from MIDI number */
export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
