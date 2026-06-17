// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : workbenchData.js                                     ║
// ║ WHAT    : Curriculum-to-tool mapping + suggestion engine       ║
// ║ WHY     : Students should not browse 12 tools. They should    ║
// ║           receive ONE invitation based on where they are.     ║
// ║ RULES   : Tools are called, not chosen (design doc §2)       ║
// ║           Somatic check-in always offered before practice      ║
// ╚═════════════════════════════════════════════════════════════════╝

import { getChapterProgress } from './localDatabase';
import { SLIDE_DECKS } from './slideDecks';
import frets from './chapterData';
import { loadTraction } from './tractionStore';
import { TOOLS_CATALOG } from './toolsData';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ═══════════════════════════════════════════════════════════
// CHAPTER → TOOL MAP
// The sacred 12-fret mapping. Each chapter has ONE primary tool.
// ═══════════════════════════════════════════════════════════
export const CHAPTER_TOOL_MAP = {
  1:  { toolId: 1,  name: 'Breathing Gate',       why: 'Am I safe here?' },
  2:  { toolId: 2,  name: 'Practice Timer',       why: 'Can I commit to this?' },
  3:  { toolId: 3,  name: 'Pitch Room',           why: 'Can I hear myself?' },
  4:  { toolId: 4,  name: "Truebadour's Quill",   why: 'Can I express what I feel?' },
  5:  { toolId: 5,  name: 'Interval Visualizer',  why: 'How do notes relate?' },
  6:  { toolId: 6,  name: 'The Grid Map',         why: 'Can I face the whole neck?' },
  7:  { toolId: 7,  name: 'PLING! Trainer',       why: 'Can I sing and play?' },
  8:  { toolId: 8,  name: 'Microtonal Tracker',   why: 'How precise am I really?' },
  9:  { toolId: 9,  name: 'Playable Guitar',      why: 'Can I play with half pressure?' },
  10: { toolId: 10, name: 'Async Assessor',       why: 'Can I be seen?' },
  11: { toolId: 11, name: 'Multi-Key Hub',        why: 'Can I see the whole?' },
  12: { toolId: 12, name: 'Rhythm Engine',        why: 'Can I play free?' },
};

// ═══════════════════════════════════════════════════════════
// SOMATIC INTERVENTIONS
// When the AI detects stress/rushing from audio or journal patterns,
// it should suggest these instead of advancing curriculum.
// ═══════════════════════════════════════════════════════════
export const SOMATIC_TOOLS = [
  { toolId: 1, name: 'Breathing Gate', protocol: 'SHEARL', label: 'Center first' },
  { toolId: 2, name: 'Practice Timer', protocol: 'SHEARL', label: 'Just 10 minutes' },
];

// ═══════════════════════════════════════════════════════════
// GET CURRICULUM POSITION
// Where is the student in the 12-chapter journey?
// ═══════════════════════════════════════════════════════════
export function getCurriculumPosition() {
  let highestCompleted = 0;
  let currentFret = null;
  let currentProgress = 'not-started';

  for (let i = 1; i <= 12; i++) {
    const fret = frets.find(c => c.id === i);
    if (!fret) continue;
    const totalSlides = SLIDE_DECKS[fret.id]?.length || 0;
    const progress = getChapterProgress(i, totalSlides);

    if (progress === 'completed') {
      highestCompleted = i;
    } else if (progress === 'in-progress' && !currentFret) {
      currentFret = i;
      currentProgress = 'in-progress';
    }
  }

  // If nothing in progress, suggest next not-started
  if (!currentFret) {
    for (let i = 1; i <= 12; i++) {
      const fret = frets.find(c => c.id === i);
      if (!fret) continue;
      const totalSlides = SLIDE_DECKS[fret.id]?.length || 0;
      const progress = getChapterProgress(i, totalSlides);
      if (progress === 'not-started') {
        currentFret = i;
        currentProgress = 'not-started';
        break;
      }
    }
  }

  // If everything completed, stay at 12
  if (!currentFret) {
    currentFret = 12;
    currentProgress = 'completed';
  }

  return {
    currentFret,
    currentProgress,
    highestCompleted,
    isAllCompleted: highestCompleted === 12 && currentProgress === 'completed',
  };
}

// ═══════════════════════════════════════════════════════════
// GET SUGGESTED TOOL
// The ONE tool the student should see as primary.
// ═══════════════════════════════════════════════════════════
export function getSuggestedTool() {
  const traction = loadTraction();
  const pos = getCurriculumPosition();
  const now = Date.now();
  const lastPractice = traction.lastPracticeTimestamp || 0;
  const daysSincePractice = (now - lastPractice) / (1000 * 60 * 60 * 24);

  // ── Somatic override: if long gap or low breath stat, warm up first ──
  const breathStat = Math.min(20, Math.max(1, Math.floor((traction.breathingSessions || 0) / 2) + 1));
  const needsWarmup = daysSincePractice > 3 || breathStat < 5;

  if (needsWarmup && pos.currentFret > 2) {
    return {
      type: 'somatic',
      toolId: 1,
      tool: TOOLS_CATALOG.find(t => t.id === 1),
      reason: daysSincePractice > 3
        ? "It's been a while. Let's breathe together before we dive in."
        : "Your breath stat is calling for a reset. Center first.",
      chapterMapping: CHAPTER_TOOL_MAP[1],
    };
  }

  // ── C-Scale Priority Override ──
  // Suggest the C-Scale foundation before proceeding to the 12-fret chromatic tools.
  // Checks both completion state (all 4 stages done) and a dismiss flag.
  const hasCompletedCScale = vvGet(STORAGE_KEYS.CSCALE_COMPLETED) === 'true';
  const hasDismissedCScale = vvGet(STORAGE_KEYS.CSCALE_DISMISSED) === 'true';
  if (!hasCompletedCScale && !hasDismissedCScale) {
    // Use a real tool from the catalog as the visual shell (Grid Map, id:6)
    const shellTool = TOOLS_CATALOG.find(t => t.id === 6);
    return {
      type: 'c-scale',
      toolId: 'cscale',
      tool: {
        ...shellTool,
        id: 'cscale',
        name: 'C-Scale Foundation',
        shortName: 'C Scale',
        desc: 'Geometric Mastery',
        telemetry: 'Master the arithmetic of the soul — the C Major scale as a coordinate system.',
      },
      reason: 'Master the arithmetic of the soul before the chromatic journey.',
      fretId: 0,
      progress: 'not-started',
      chapterMapping: { name: 'C-Scale Foundation', why: 'This is where Bertrand begins.' },
    };
  }

  // ── Curriculum-driven suggestion ──
  const mapping = CHAPTER_TOOL_MAP[pos.currentFret];
  const tool = TOOLS_CATALOG.find(t => t.id === mapping.toolId);

  return {
    type: 'curriculum',
    toolId: mapping.toolId,
    tool,
    reason: mapping.why,
    fretId: pos.currentFret,
    progress: pos.currentProgress,
    chapterMapping: mapping,
  };
}

// ═══════════════════════════════════════════════════════════
// GET PRACTICE CONTEXT FOR AI
// Everything the AI needs to know to guide the student.
// ═══════════════════════════════════════════════════════════
export function getPracticeContext() {
  const traction = loadTraction();
  const pos = getCurriculumPosition();
  const suggestion = getSuggestedTool();

  const fretsCompleted = Object.entries(traction?.frets || {})
    .filter(([_, f]) => (f.traction || 0) >= 60)
    .map(([id]) => parseInt(id));

  const breathStat = Math.min(20, Math.max(1, Math.floor((traction.breathingSessions || 0) / 2) + 1));
  const pitchStat = (() => {
    const frets = Object.values(traction?.frets || {});
    const pitches = frets.map(f => f.pitchAccuracy || 0).filter(p => p > 0);
    if (pitches.length === 0) return 1;
    const avg = pitches.reduce((a, b) => a + b, 0) / pitches.length;
    return Math.min(20, Math.max(1, Math.round(avg / 5)));
  })();
  const memoryStat = (() => {
    const frets = Object.values(traction?.frets || {});
    const tractions = frets.map(f => f.traction || 0);
    if (tractions.length === 0) return 1;
    const avg = tractions.reduce((a, b) => a + b, 0) / tractions.length;
    return Math.min(20, Math.max(1, Math.round(avg / 5)));
  })();

  const lastFretPracticed = (() => {
    try {
      return parseInt(vvGet(STORAGE_KEYS.LAST_TOOL_FRET)) || null;
    } catch { return null; }
  })();

  return {
    curriculum: pos,
    suggestion,
    stats: {
      breath: breathStat,
      pitch: pitchStat,
      memory: memoryStat,
      level: traction.bardLevel || 1,
      streak: traction.streak || 0,
      minutes: traction.practiceMinutes || 0,
    },
    fretsCompleted,
    lastFretPracticed,
    totalJournalEntries: traction.journalEntries || 0,
    totalSongs: traction.songsWritten || 0,
  };
}

// ═══════════════════════════════════════════════════════════
// GET CHAPTER TOOL INVITATION TEXT
// Bertrand-style language for each chapter's tool.
// ═══════════════════════════════════════════════════════════
export const CHAPTER_INVITATIONS = {
  1:  { en: "Find your root note. Let the guitar find you.", fr: "Trouvez votre note fondamentale. Laissez la guitare vous trouver." },
  2:  { en: "You only need 10 minutes. Start.", fr: "Vous n'avez besoin que de 10 minutes. Commencez." },
  3:  { en: "The mentor was inside all along.", fr: "Le mentor était en vous depuis le début." },
  4:  { en: "What are you feeling right now? Write it down.", fr: "Que ressentez-vous en ce moment? Écrivez-le." },
  5:  { en: "Tap two notes. See the relationship.", fr: "Tapez deux notes. Voyez la relation." },
  6:  { en: "Face the whole neck. The map is in your hands.", fr: "Faites face à tout le manche. La carte est entre vos mains." },
  7:  { en: "Sing before you play. The mic does not lie.", fr: "Chantez avant de jouer. Le micro ne ment pas." },
  8:  { en: "See what was invisible. Your vibrato becomes intentional.", fr: "Voyez l'invisible. Votre vibrato devient intentionnel." },
  9:  { en: "Play with half pressure. Find the minimum force.", fr: "Jouez avec la moitié de la pression. Trouvez la force minimale." },
  10: { en: "Record yourself. Let Bertrand see you.", fr: "Enregistrez-vous. Laissez Bertrand vous voir." },
  11: { en: "See all 12 keys at once. Navigate like a room.", fr: "Voyez les 12 tonalités à la fois. Naviguez comme une pièce." },
  12: { en: "No rules. Just the instrument and the voice inside.", fr: "Pas de règles. Juste l'instrument et la voix intérieure." },
};

export function getInvitation(fretId, lang = 'en') {
  return CHAPTER_INVITATIONS[fretId]?.[lang] || CHAPTER_INVITATIONS[fretId]?.en || '';
}
