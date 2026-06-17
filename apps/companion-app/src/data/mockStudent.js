// ═══════════════════════════════════════════════════════════════════
// MockStudent — Synthetic personas for AI testing
// Generate realistic student profiles, practice logs, and traction
// so the Truebadour AI can be tested without real users.
// ═══════════════════════════════════════════════════════════════════

import { FRET_METADATA } from './dag/dagNodes';
import { vvGet, vvSetJSON, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

export const TRUEBADOUR_TYPES = ['storyteller', 'craftsman', 'ear', 'seeker'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// ── Generate a complete mock student ─────────────────────────────
export function generateMockStudent(seed = null) {
  if (seed !== null) {
    // Simple seeded RNG for reproducible personas
    const s = seed;
    return _generate(s);
  }
  return _generate(Math.floor(Math.random() * 10000));
}

function _generate(seed) {
  const rng = (mod = 1) => ((seed = (seed * 16807 + 0) % 2147483647) / 2147483647) * mod;
  const rInt = (min, max) => Math.floor(rng(max - min + 1)) + min;

  const type = TRUEBADOUR_TYPES[rInt(0, 3)];
  const level = rInt(1, 12);
  const completedFrets = rInt(0, level);

  // Generate practice log
  const days = rInt(7, 90);
  const practiceLog = [];
  for (let i = 0; i < days; i++) {
    if (rng() > 0.3) { // 70% practice rate
      practiceLog.push({
        date: daysAgo(i),
        duration: rInt(10, 45),
        nodes: [`fret-${rInt(1, Math.max(1, completedFrets))}-${pick(['class', 'guitar', 'workbook'])}-${pick(['be', 'do', 'play'])}`],
        notes: pick(PRACTICE_NOTES),
      });
    }
  }

  // Generate traction state
  const frets = {};
  for (let f = 1; f <= 12; f++) {
    if (f <= completedFrets) {
      frets[f] = {
        traction: 100,
        beCompleted: true,
        doCompleted: true,
        playCompleted: true,
        beMastery: rInt(2, 3),
        doMastery: rInt(2, 3),
        playMastery: rInt(2, 3),
        beResonance: true,
        doResonance: true,
        playResonance: true,
      };
    } else if (f === completedFrets + 1) {
      // Current fret — partial progress
      const phases = ['be', 'do', 'play'];
      const currentPhase = pick(phases);
      frets[f] = {
        traction: currentPhase === 'be' ? 33 : currentPhase === 'do' ? 66 : 85,
        beCompleted: currentPhase !== 'be',
        doCompleted: currentPhase === 'play',
        playCompleted: false,
      };
    }
  }

  const totalMinutes = practiceLog.reduce((s, e) => s + e.duration, 0);
  const streak = calculateStreak(practiceLog);

  return {
    id: `mock-${seed}`,
    name: pick(MOCK_NAMES),
    truebadourType: type,
    bardLevel: level,
    completedFrets,
    totalMinutes,
    streak,
    practiceLog,
    traction: {
      frets,
      totalTraction: Object.values(frets).reduce((s, f) => s + (f.traction || 0), 0),
      completedNodes: generateCompletedNodes(frets),
    },
    // For AI evaluation testing
    mockSubmission: {
      videoUrl: null, // Would be a real URL in production
      duration: rInt(120, 600),
      fret: completedFrets > 0 ? rInt(1, completedFrets) : 1,
      phase: pick(['be', 'do', 'play']),
      selfAssessment: pick(SELF_ASSESSMENTS),
    },
  };
}

function generateCompletedNodes(frets) {
  const nodes = [];
  Object.entries(frets).forEach(([fretId, f]) => {
    const pillars = ['class', 'guitar', 'workbook'];
    pillars.forEach(p => {
      if (f.beCompleted) nodes.push(`fret-${fretId}-${p}-be`);
      if (f.doCompleted) nodes.push(`fret-${fretId}-${p}-do`);
      if (f.playCompleted) nodes.push(`fret-${fretId}-${p}-play`);
    });
  });
  return nodes;
}

function calculateStreak(log) {
  if (!log.length) return 0;
  const sorted = [...log].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

// ── Data pools ───────────────────────────────────────────────────
const MOCK_NAMES = [
  'Aiden', 'Benoit', 'Chloe', 'Daphne', 'Elio', 'Fabien',
  'Gabrielle', 'Hugo', 'Ines', 'Julien', 'Kai', 'Lena',
  'Marc', 'Noa', 'Olivia', 'Pierre', 'Quinn', 'Remy',
  'Sophie', 'Theo', 'Uma', 'Victor', 'Wren', 'Xavier',
  'Yara', 'Zoe',
];

const PRACTICE_NOTES = [
  'Felt tension in shoulders during Breathing Gate. Need to relax more.',
  'The minor third suddenly clicked. I could hear it before playing.',
  'Practiced square breathing with C major chord. 4 counts felt natural.',
  'Struggled with G-B string transition. Will revisit tomorrow.',
  'Sang along with the metronome for 10 minutes. Voice is opening up.',
  'Imagined the fretboard as a city. Each fret is a neighborhood.',
  'Tried too fast. Slowed down to 40 BPM. Much better.',
  'The tritone still feels unstable. I sat with the discomfort.',
  'Played my first original progression. Three chords, felt like a song.',
  'Recorded myself. Playback revealed timing issues on the bridge.',
];

const SELF_ASSESSMENTS = [
  'I can hear the intervals before I play them about 60% of the time.',
  'My left hand is still gripping too hard. Working on fingertip placement.',
  'Singing while playing is getting easier. The voice is finding the note faster.',
  'I understand CAGED shapes but transitioning between them is slow.',
  'The Breathing Gate helps me reset between practice blocks.',
  'I can identify major vs minor thirds by ear now.',
  'My practice nook ritual is becoming automatic. I look forward to it.',
];

// ── Batch generator for stress testing ──────────────────────────
export function generateMockCohort(count = 20) {
  return Array.from({ length: count }, (_, i) => generateMockStudent(i + 1));
}

// ── Inject mock student into localStorage for UI testing ────────
export function injectMockStudent(student = null) {
  const s = student || generateMockStudent();
  vvSetJSON(STORAGE_KEYS.MOCK_STUDENT, s);
  vvSetJSON(STORAGE_KEYS.PRACTICE_LOG, s.practiceLog);
  // Merge into traction store
  const existing = JSON.parse(vvGet(STORAGE_KEYS.TRACTION) || '{}');
  vvSetJSON(STORAGE_KEYS.TRACTION, {
    ...existing,
    frets: s.traction.frets,
    totalTraction: s.traction.totalTraction,
    completedNodes: s.traction.completedNodes,
    bardLevel: s.bardLevel,
    studentProfile: { truebadourType: s.truebadourType },
  });
  return s;
}

// ── Clear mock data ─────────────────────────────────────────────
export function clearMockStudent() {
  vvRemove(STORAGE_KEYS.MOCK_STUDENT);
}
