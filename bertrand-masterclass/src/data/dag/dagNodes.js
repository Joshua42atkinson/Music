// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagNodes.js                                         ║
// ║ WHAT    : Complete DAG node definitions for 12-fret curriculum║
// ║ WHY     : The Troubadour walks this graph with the student   ║
// ║ RULES   : Every node has a troubadourPrompt                  ║
// ║           Every fret has BE→DO→PLAY across 3 pillars        ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

/**
 * Complete node graph for the Voix Vive curriculum.
 * Organized by fret (1-12), then by pillar (class/guitar/workbook).
 * Each fret has BE→DO→PLAY phases.
 * 
 * Usage:
 *   import { dagNodes, getNodeById, getNodesByFret, getNodesByPillar } from './dagNodes';
 *   const fret1Nodes = getNodesByFret(1);
 *   const currentNode = getNodeById('fret-1-class-be');
 */

// ── FRET 1: The Root Note (E / The Foundation) ──

const FRET_1_NODES = [
  // ═══════════════════════════════════════════════════════════
  // CLASS PILLAR — The Song (living textbook)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fret-1-class-be',
    pillar: 'class',
    fret: 1,
    phase: 'be',
    type: 'slide',
    title: 'The Root Note — BE',
    description: 'Imagine the sound before you play it. The foundation of all music.',
    troubadourPrompt: 'Close your eyes. The root note is not a place on the neck. It is the place inside you that says "I am here." You are an instrument playing an instrument. Imagine the low E string vibrating through your body. What does it feel like? Over.',
    prerequisites: [],
    suggestedAfter: [],
    xpValue: 10,
    yinContent: 'The root note is the foundation of all music. Every chord, every scale, every song begins here. Before technique comes intention.',
    yangContent: 'Feel the vibration in your chest. The guitar is an extension of your breath.',
    audioCue: 'meditation-bell',
    estimatedMinutes: 5,
    slideIds: ['fret1-introduction', 'fret1-imagination'],
  },
  {
    id: 'fret-1-class-do',
    pillar: 'class',
    fret: 1,
    phase: 'do',
    type: 'slide',
    title: 'The Root Note — DO',
    description: 'Hear the E before playing it. The ear is the true instrument.',
    troubadourPrompt: 'Open your ears. Can you hear the E in the room around you? In the hum of the refrigerator? In your own voice? Stop and listen to the relationship between the silence and the sound. Hum the E. Let your voice find it. Over.',
    prerequisites: ['fret-1-class-be'],
    suggestedAfter: [],
    xpValue: 10,
    yinContent: 'The ear is the true instrument. The fingers are just servants.',
    yangContent: 'Hum the open low E. Match pitch with your voice before touching the guitar.',
    estimatedMinutes: 5,
    slideIds: ['fret1-ear-training', 'fret1-humming'],
  },
  {
    id: 'fret-1-class-play',
    pillar: 'class',
    fret: 1,
    phase: 'play',
    type: 'tool',
    title: 'The Root Note — PLAY',
    description: 'Play the open E and compare to your humming. The guitar teaches if you listen.',
    troubadourPrompt: 'Start now. Be active in the process. Play the open low E string. Was your humming close? The guitar will teach you if you listen. Trust the process. Over.',
    prerequisites: ['fret-1-class-do'],
    suggestedAfter: [],
    xpValue: 15,
    yinContent: 'The guitar is a mirror. It reflects what you bring to it.',
    yangContent: 'Strike the open E. Listen to the decay. Feel the resonance.',
    estimatedMinutes: 5,
    toolId: 'pitch-room',
    toolConfig: { targetNote: 'E2', toleranceCents: 50, mode: 'single-note' },
  },
  {
    id: 'fret-1-class-milestone',
    pillar: 'class',
    fret: 1,
    phase: 'all',
    type: 'milestone',
    title: 'Fret 1 Complete — The Foundation',
    description: 'You have imagined, heard, and played the root note.',
    troubadourPrompt: "Voilà. Fret 1 — complete. You are an instrument playing an instrument. The foundation is laid. Bravo. Tomorrow, the Minor 2nd. But for now, breathe. Trust the process. Over.",
    prerequisites: ['fret-1-class-be', 'fret-1-class-do', 'fret-1-class-play', 'fret-1-guitar-milestone'],
    suggestedAfter: ['fret-2-class-be'],
    xpValue: 25,
    estimatedMinutes: 2,
    audioCue: 'completion-chime',
  },

  // ═══════════════════════════════════════════════════════════
  // GUITAR PILLAR — Tools & Game
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fret-1-guitar-be',
    pillar: 'guitar',
    fret: 1,
    phase: 'be',
    type: 'tool',
    title: 'Breathing Gate — BE',
    description: 'Center yourself before practice. Breath is the first technique.',
    troubadourPrompt: 'Before the fingers move, the breath must settle. Three breaths. In through the nose, out through the mouth. Let your shoulders drop. You know, the body is the first instrument. Over.',
    prerequisites: ['fret-1-class-be'],
    suggestedAfter: [],
    xpValue: 10,
    yangContent: 'Breath control is the first technique. Everything else follows.',
    estimatedMinutes: 3,
    toolId: 'breathing-gate',
    toolConfig: { breathCount: 3, pace: 'slow', visualization: 'expanding-circle' },
  },
  {
    id: 'fret-1-guitar-do',
    pillar: 'guitar',
    fret: 1,
    phase: 'do',
    type: 'game',
    title: 'SHEARL Flash — DO',
    description: 'Perceive the pattern before placing fingers. The inner fretboard.',
    troubadourPrompt: 'Gold dots will appear on the fretboard. Study them. They will disappear. Then tap where they were. Do not guess — remember. See, hear, feel. Allow the impression to be made. Over.',
    prerequisites: ['fret-1-guitar-be'],
    suggestedAfter: [],
    xpValue: 15,
    yinContent: 'The inner fretboard must be built before the outer one.',
    yangContent: 'Memorize the dot pattern. Visualize it in your mind before tapping.',
    estimatedMinutes: 10,
    toolId: 'vertiscale-flash',
    toolConfig: { pattern: 'root-note-only', rounds: 3, showDurationMs: 2000 },
  },
  {
    id: 'fret-1-guitar-play',
    pillar: 'guitar',
    fret: 1,
    phase: 'play',
    type: 'game',
    title: 'PLING! Orbs — PLAY',
    description: 'Sing the pitch, then play it. Voice and instrument become one.',
    troubadourPrompt: 'Orbs will fall. Each orb is a note. Sing it before it hits the bottom. Then play it on the guitar. Play what you are saying. So it becomes one thing. Over.',
    prerequisites: ['fret-1-guitar-do'],
    suggestedAfter: [],
    xpValue: 20,
    yinContent: 'Play what you are saying. The voice and the instrument are not separate.',
    yangContent: 'Use the pitch detector. Sing first, play second. Compare.',
    estimatedMinutes: 10,
    toolId: 'pling-orbs',
    toolConfig: { notes: ['E2'], descending: true, orbSpeed: 'slow' },
  },

    {
    id: 'fret-1-guitar-milestone',
    pillar: 'guitar',
    fret: 1,
    phase: 'all',
    type: 'milestone',
    title: 'The Somatic Gate',
    description: 'Physical mastery check.',
    troubadourPrompt: 'Before we proceed, a somatic check. Hold the interval for 60 seconds. Breathe from the diaphragm. Let the tension melt. Over.',
    prerequisites: ['fret-1-guitar-be', 'fret-1-guitar-do', 'fret-1-guitar-play'],
    suggestedAfter: [],
    xpValue: 10,
    estimatedMinutes: 2,
    audioCue: 'completion-chime',
  },

  // ═══════════════════════════════════════════════════════════
  // WORKBOOK PILLAR — Journal & Reflection
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fret-1-workbook-be',
    pillar: 'workbook',
    fret: 1,
    phase: 'be',
    type: 'journal',
    title: 'Journal — Imagination',
    description: 'What did you imagine?',
    troubadourPrompt: 'What would be the scene in the movie? If the root note were a character, who would they be? What is their story? Write one sentence. Over.',
    prerequisites: ['fret-1-class-be'],
    suggestedAfter: [],
    xpValue: 10,
    journalPrompt: 'If the root note (low E) were a character in a movie, who would they be? Describe them in one sentence.',
    estimatedMinutes: 3,
  },
  {
    id: 'fret-1-workbook-do',
    pillar: 'workbook',
    fret: 1,
    phase: 'do',
    type: 'journal',
    title: 'Journal — Hearing',
    description: 'What did you hear?',
    troubadourPrompt: 'When you hummed the E, where did you feel it in your body? What color was the sound? Music is the voice of the heart. Write one sentence. Over.',
    prerequisites: ['fret-1-class-do'],
    suggestedAfter: [],
    xpValue: 10,
    journalPrompt: 'When you hummed the E, where in your body did you feel the vibration? What color would you give this sound? One sentence.',
    estimatedMinutes: 3,
  },
  {
    id: 'fret-1-workbook-play',
    pillar: 'workbook',
    fret: 1,
    phase: 'play',
    type: 'submission',
    title: 'Submit — First Note',
    description: 'Record yourself playing the open E. Just one note.',
    troubadourPrompt: `Record yourself playing the open E. Just one note. Listen back. What do you notice? That's incredible — you are making music. Submit it. Over.`,
    prerequisites: ['fret-1-class-play'],
    suggestedAfter: [],
    xpValue: 20,
    submissionType: 'video',
    estimatedMinutes: 5,
  },
  {
    id: 'fret-1-workbook-reflection',
    pillar: 'workbook',
    fret: 1,
    phase: 'all',
    type: 'reflection',
    title: 'FHEAL — Let Go',
    description: 'No judgment. Just observation. The inner critic has no place here.',
    troubadourPrompt: 'No judgment today. You imagined. You hummed. You played. That is enough. The inner critic has no place here. How can you free yourself from the guitar through the guitar? Over.',
    prerequisites: ['fret-1-workbook-be', 'fret-1-workbook-do', 'fret-1-workbook-play'],
    suggestedAfter: [],
    xpValue: 15,
    journalPrompt: 'Without judging good or bad, describe what happened in your first session in three words.',
    estimatedMinutes: 2,
  },
];

// ── FRET 2: Minor 2nd ──

const FRET_2_NODES = [
  {
    "id": "fret-2-class-be",
    "pillar": "class",
    "fret": 2,
    "phase": "be",
    "type": "slide",
    "title": "Minor 2nd — Class BE",
    "description": "BE phase for Minor 2nd (Class)",
    "troubadourPrompt": "Close your eyes and let the music paint a picture in your mind, like a director framing a scene. Alors, imagine what the scene in the movie would be, Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-class-do",
    "pillar": "class",
    "fret": 2,
    "phase": "do",
    "type": "slide",
    "title": "Minor 2nd — Class DO",
    "description": "DO phase for Minor 2nd (Class)",
    "troubadourPrompt": "Ecoute the note ringing at 440 Hz, the pure A that tunes our souls. Now hum or sing that pitch, feeling the ratio of vibration in your voice, Over.",
    "prerequisites": [
      "fret-2-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-class-play",
    "pillar": "class",
    "fret": 2,
    "phase": "play",
    "type": "slide",
    "title": "Minor 2nd — Class PLAY",
    "description": "PLAY phase for Minor 2nd (Class)",
    "troubadourPrompt": "Place your index finger on the second fret of the G string to sound a bright B. Start now, Over.",
    "prerequisites": [
      "fret-2-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-2-guitar-be",
    "pillar": "guitar",
    "fret": 2,
    "phase": "be",
    "type": "tool",
    "title": "Minor 2nd — Guitar BE",
    "description": "BE phase for Minor 2nd (Guitar)",
    "troubadourPrompt": "Sit tall, inhale deeply through the nose, feeling the air fill your belly like a soft chord. Exhale slowly through the mouth, releasing tension, Over.",
    "prerequisites": [
      "fret-2-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-guitar-do",
    "pillar": "guitar",
    "fret": 2,
    "phase": "do",
    "type": "game",
    "title": "Minor 2nd — Guitar DO",
    "description": "DO phase for Minor 2nd (Guitar)",
    "troubadourPrompt": "Ecoute the two notes back-to-back and listen for the distance between them, like footsteps on a path. Identify whether the interval is a second, third, or fourth, Over.",
    "prerequisites": [
      "fret-2-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-guitar-play",
    "pillar": "guitar",
    "fret": 2,
    "phase": "play",
    "type": "game",
    "title": "Minor 2nd — Guitar PLAY",
    "description": "PLAY phase for Minor 2nd (Guitar)",
    "troubadourPrompt": "Place your ring finger on the third fret of the B string and your pinky on the fifth fret of the same string to form a minor third. Play the interval now, Over.",
    "prerequisites": [
      "fret-2-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-2-workbook-be",
    "pillar": "workbook",
    "fret": 2,
    "phase": "be",
    "type": "journal",
    "title": "Minor 2nd — Workbook BE",
    "description": "BE phase for Minor 2nd (Workbook)",
    "troubadourPrompt": "In your journal, describe the colors and emotions that the music evokes as if you were scoring a film. Let your imagination flow onto the page, Over.",
    "prerequisites": [
      "fret-2-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-workbook-do",
    "pillar": "workbook",
    "fret": 2,
    "phase": "do",
    "type": "journal",
    "title": "Minor 2nd — Workbook DO",
    "description": "DO phase for Minor 2nd (Workbook)",
    "troubadourPrompt": "Recall the exact pitch you heard and note how it felt in your chest, like a gentle vibration. Write down any images or memories that surfaced during the listening, Over.",
    "prerequisites": [
      "fret-2-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-2-workbook-play",
    "pillar": "workbook",
    "fret": 2,
    "phase": "play",
    "type": "submission",
    "title": "Minor 2nd — Workbook PLAY",
    "description": "PLAY phase for Minor 2nd (Workbook)",
    "troubadourPrompt": "Set up your recorder and capture a clean take of the interval you just practiced. Listen back with curiosity, noting where the sound shines, Over.",
    "prerequisites": [
      "fret-2-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-2-class-milestone",
    "pillar": "class",
    "fret": 2,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 2 Complete — The Awakening",
    "description": "You have imagined, heard, and played the minor 2nd.",
    "troubadourPrompt": "Voilà. Fret 2 — complete. You are an instrument playing an instrument. The minor 2nd is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-2-class-be",
      "fret-2-class-do",
      "fret-2-class-play"
    ],
    "suggestedAfter": [
      "fret-3-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-2-workbook-reflection",
    "pillar": "workbook",
    "fret": 2,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Awakening",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "FHEAL: Feel, Hold, Embrace, Accept, Let go—allow any tension to dissolve like mist under morning sun. Offer yourself kindness, remembering that every note is a step forward, Over.",
    "prerequisites": [
      "fret-2-workbook-be",
      "fret-2-workbook-do",
      "fret-2-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 3: Major 2nd ──

const FRET_3_NODES = [
  {
    "id": "fret-3-class-be",
    "pillar": "class",
    "fret": 3,
    "phase": "be",
    "type": "slide",
    "title": "Major 2nd — Class BE",
    "description": "BE phase for Major 2nd (Class)",
    "troubadourPrompt": "What would be the scene in the movie as you imagine the sound of Fret 3? Over. Let your mind wander like a troubadour's tale, ecoute the colors that appear. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-3-class-do",
    "pillar": "class",
    "fret": 3,
    "phase": "do",
    "type": "slide",
    "title": "Major 2nd — Class DO",
    "description": "DO phase for Major 2nd (Class)",
    "troubadourPrompt": "Hum or sing the note you hear at Fret 3, feeling its vibration around 196 Hz, like a gentle breeze. Over. Alors, let your voice rise and fall, matching the ratio of the interval as you listen. Over.",
    "prerequisites": [
      "fret-3-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-3-class-play",
    "pillar": "class",
    "fret": 3,
    "phase": "play",
    "type": "slide",
    "title": "Major 2nd — Class PLAY",
    "description": "PLAY phase for Major 2nd (Class)",
    "troubadourPrompt": "Place your finger on the third fret of the second string and play the note B. Over. Start now, let the sound ring clear as a morning bell, bravo for taking the first step. Over.",
    "prerequisites": [
      "fret-3-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-3-guitar-be",
    "pillar": "guitar",
    "fret": 3,
    "phase": "be",
    "type": "tool",
    "title": "Major 2nd — Guitar BE",
    "description": "BE phase for Major 2nd (Guitar)",
    "troubadourPrompt": "Close your eyes, breathe in slowly for four counts, and feel the guitar's wood against your chest. Over. Exhale gently, releasing tension as if you were letting go of a leaf on a stream, ecoute the calm within. Over.",
    "prerequisites": [
      "fret-3-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5,
    "toolId": "pitch-room"
  },
  {
    "id": "fret-3-guitar-do",
    "pillar": "guitar",
    "fret": 3,
    "phase": "do",
    "type": "game",
    "title": "Major 2nd — Guitar DO",
    "description": "DO phase for Major 2nd (Guitar)",
    "troubadourPrompt": "Listen carefully to the tone played at Fret 3, and try to identify whether it feels like a question or an answer. Over. Alors, trust your inner ear, and name the interval as you would name a familiar friend. Over.",
    "prerequisites": [
      "fret-3-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5,
    "toolId": "pitch-room"
  },
  {
    "id": "fret-3-guitar-play",
    "pillar": "guitar",
    "fret": 3,
    "phase": "play",
    "type": "game",
    "title": "Major 2nd — Guitar PLAY",
    "description": "PLAY phase for Major 2nd (Guitar)",
    "troubadourPrompt": "Play the interval of a perfect fourth starting at Fret 3 on the third string, let each note sing clearly. Over. Bravo, feel the resonance travel up the neck like a story unfolding. Over.",
    "prerequisites": [
      "fret-3-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10,
    "toolId": "pitch-room"
  },
  {
    "id": "fret-3-workbook-be",
    "pillar": "workbook",
    "fret": 3,
    "phase": "be",
    "type": "journal",
    "title": "Major 2nd — Workbook BE",
    "description": "BE phase for Major 2nd (Workbook)",
    "troubadourPrompt": "In your journal, describe the scene you imagined when you heard the sound of Fret 3, as if painting with words. Over. Let your imagination flow freely, ecoute the whispers of your heart onto the page. Over.",
    "prerequisites": [
      "fret-3-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-3-workbook-do",
    "pillar": "workbook",
    "fret": 3,
    "phase": "do",
    "type": "journal",
    "title": "Major 2nd — Workbook DO",
    "description": "DO phase for Major 2nd (Workbook)",
    "troubadourPrompt": "Reflect on what you heard during the ear training, noting any emotions or images that surfaced. Over. Alors, write down how the interval spoke to you, like a conversation between old companions. Over.",
    "prerequisites": [
      "fret-3-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-3-workbook-play",
    "pillar": "workbook",
    "fret": 3,
    "phase": "play",
    "type": "submission",
    "title": "Major 2nd — Workbook PLAY",
    "description": "PLAY phase for Major 2nd (Workbook)",
    "troubadourPrompt": "Record yourself playing the interval at Fret 3, capturing each note as it rings out. Over. When you listen back, bravo for hearing your progress, and let the recording be a mirror of your growth. Over.",
    "prerequisites": [
      "fret-3-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-3-class-milestone",
    "pillar": "class",
    "fret": 3,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 3 Complete — The Journey",
    "description": "You have imagined, heard, and played the major 2nd.",
    "troubadourPrompt": "Voilà. Fret 3 — complete. You are an instrument playing an instrument. The major 2nd is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-3-class-be",
      "fret-3-class-do",
      "fret-3-class-play"
    ],
    "suggestedAfter": [
      "fret-4-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-3-workbook-reflection",
    "pillar": "workbook",
    "fret": 3,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Journey",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "FHEAL — let go of any judgment, imagine the sound as a river that carries away doubts. Over. Voila, embrace the silence between notes, and feel the peace settle like soft snow on a quiet town. Over.",
    "prerequisites": [
      "fret-3-workbook-be",
      "fret-3-workbook-do",
      "fret-3-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 4: Minor 3rd ──

const FRET_4_NODES = [
  {
    "id": "fret-4-class-be",
    "pillar": "class",
    "fret": 4,
    "phase": "be",
    "type": "slide",
    "title": "Minor 3rd — Class BE",
    "description": "BE phase for Minor 3rd (Class)",
    "troubadourPrompt": "Alors, imagine what the scene in the movie would be like Over. Let the picture unfold in your mind, voila Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-class-do",
    "pillar": "class",
    "fret": 4,
    "phase": "do",
    "type": "slide",
    "title": "Minor 3rd — Class DO",
    "description": "DO phase for Minor 3rd (Class)",
    "troubadourPrompt": "Ecoute, hum the note you hear, feeling its vibration like a 440 Hz heart Over. Alors, sing it softly, letting the ratio of the interval guide your voice Over.",
    "prerequisites": [
      "fret-4-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-class-play",
    "pillar": "class",
    "fret": 4,
    "phase": "play",
    "type": "slide",
    "title": "Minor 3rd — Class PLAY",
    "description": "PLAY phase for Minor 3rd (Class)",
    "troubadourPrompt": "Place your finger on the fourth fret of the third string, ready to play the note Over. Start now, let the tone ring clear and brave, bravo Over.",
    "prerequisites": [
      "fret-4-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-4-guitar-be",
    "pillar": "guitar",
    "fret": 4,
    "phase": "be",
    "type": "tool",
    "title": "Minor 3rd — Guitar BE",
    "description": "BE phase for Minor 3rd (Guitar)",
    "troubadourPrompt": "Alors, close your eyes, inhale deeply, feeling the calm like a soft breeze Over. Exhale slowly, releasing tension, and center your spirit for practice Over.",
    "prerequisites": [
      "fret-4-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-guitar-do",
    "pillar": "guitar",
    "fret": 4,
    "phase": "do",
    "type": "game",
    "title": "Minor 3rd — Guitar DO",
    "description": "DO phase for Minor 3rd (Guitar)",
    "troubadourPrompt": "Ecoute, listen closely to the two tones played, let their colors speak to you Over. Identify the interval by naming its feeling, as if you were naming a dear friend Over.",
    "prerequisites": [
      "fret-4-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-guitar-play",
    "pillar": "guitar",
    "fret": 4,
    "phase": "play",
    "type": "game",
    "title": "Minor 3rd — Guitar PLAY",
    "description": "PLAY phase for Minor 3rd (Guitar)",
    "troubadourPrompt": "Voila, place your fingers to form the interval on the fourth fret, let the strings sing together Over. Play it slowly, then with confidence, feeling the harmony grow Over.",
    "prerequisites": [
      "fret-4-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-4-workbook-be",
    "pillar": "workbook",
    "fret": 4,
    "phase": "be",
    "type": "journal",
    "title": "Minor 3rd — Workbook BE",
    "description": "BE phase for Minor 3rd (Workbook)",
    "troubadourPrompt": "Alors, write a short scene that the interval inspires, let your imagination wander freely Over. Describe the colors, emotions, and story that arise as you listen Over.",
    "prerequisites": [
      "fret-4-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-workbook-do",
    "pillar": "workbook",
    "fret": 4,
    "phase": "do",
    "type": "journal",
    "title": "Minor 3rd — Workbook DO",
    "description": "DO phase for Minor 3rd (Workbook)",
    "troubadourPrompt": "Ecoute, think about the notes you just heard, what emotions did they stir within you Over. Note any images or memories that surfaced, honoring your inner ear Over.",
    "prerequisites": [
      "fret-4-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-4-workbook-play",
    "pillar": "workbook",
    "fret": 4,
    "phase": "play",
    "type": "submission",
    "title": "Minor 3rd — Workbook PLAY",
    "description": "PLAY phase for Minor 3rd (Workbook)",
    "troubadourPrompt": "Bravo, set up your recorder and capture the interval as you play it, preserving your effort Over. Listen back with kindness, noticing the progress you’ve made Over.",
    "prerequisites": [
      "fret-4-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-4-class-milestone",
    "pillar": "class",
    "fret": 4,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 4 Complete — The Sorrow",
    "description": "You have imagined, heard, and played the minor 3rd.",
    "troubadourPrompt": "Voilà. Fret 4 — complete. You are an instrument playing an instrument. The minor 3rd is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-4-class-be",
      "fret-4-class-do",
      "fret-4-class-play"
    ],
    "suggestedAfter": [
      "fret-5-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-4-workbook-reflection",
    "pillar": "workbook",
    "fret": 4,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Sorrow",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "Voila, release any critique, let the music flow like a river without resistance Over. Embrace the moment as it is, trusting your journey forward Over.",
    "prerequisites": [
      "fret-4-workbook-be",
      "fret-4-workbook-do",
      "fret-4-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 5: Major 3rd ──

const FRET_5_NODES = [
  {
    "id": "fret-5-class-be",
    "pillar": "class",
    "fret": 5,
    "phase": "be",
    "type": "slide",
    "title": "Major 3rd — Class BE",
    "description": "BE phase for Major 3rd (Class)",
    "troubadourPrompt": "Close your eyes. The Major 3rd is the sound of sunlight entering a room. It is the interval that defines every major chord — the difference between sadness and joy, between minor and major. Before you play, hear that brightness inside. What does warmth sound like? Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-class-do",
    "pillar": "class",
    "fret": 5,
    "phase": "do",
    "type": "slide",
    "title": "Major 3rd — Class DO",
    "description": "DO phase for Major 3rd (Class)",
    "troubadourPrompt": "Hum any note. Now sing the note four semitones higher — a Major 3rd above. Feel how your voice lifts, like stepping from shadow into light. The ratio is 5:4, the simplest consonance after the octave. Your body already knows this sound. Over.",
    "prerequisites": [
      "fret-5-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-class-play",
    "pillar": "class",
    "fret": 5,
    "phase": "play",
    "type": "slide",
    "title": "Major 3rd — Class PLAY",
    "description": "PLAY phase for Major 3rd (Class)",
    "troubadourPrompt": "Play the open low E string. Now fret the G♯ at the fourth fret. Together, that is a Major 3rd — Root plus brightness. This is how Notes become Chords become Songs. Strum both and let the warmth fill the room. Over.",
    "prerequisites": [
      "fret-5-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-5-guitar-be",
    "pillar": "guitar",
    "fret": 5,
    "phase": "be",
    "type": "tool",
    "title": "Major 3rd — Guitar BE",
    "description": "BE phase for Major 3rd (Guitar)",
    "troubadourPrompt": "Before you map the fretboard, the body must be loose. Roll your shoulders three times. Shake your fretting hand. The CAGED system you are about to learn requires spatial awareness — you cannot see patterns while your muscles are locked. Breathe. Over.",
    "prerequisites": [
      "fret-5-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-guitar-do",
    "pillar": "guitar",
    "fret": 5,
    "phase": "do",
    "type": "game",
    "title": "Major 3rd — Guitar DO",
    "description": "DO phase for Major 3rd (Guitar)",
    "troubadourPrompt": "Play the open A string, then the C♯ at the fourth fret. That is a Major 3rd. Now play the open D, then the F♯ at the fourth fret. Same shape — same interval — different root. The geometry repeats. That is the secret of the guitar. Over.",
    "prerequisites": [
      "fret-5-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-guitar-play",
    "pillar": "guitar",
    "fret": 5,
    "phase": "play",
    "type": "game",
    "title": "Major 3rd — Guitar PLAY",
    "description": "PLAY phase for Major 3rd (Guitar)",
    "troubadourPrompt": "Build a C major chord from scratch: Root C, Major 3rd E, Perfect 5th G. Play each note individually first. Sing each one. Now strum all three together. You just built a chord from intervals — not from a diagram, from understanding. Bravo. Over.",
    "prerequisites": [
      "fret-5-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-5-workbook-be",
    "pillar": "workbook",
    "fret": 5,
    "phase": "be",
    "type": "journal",
    "title": "Major 3rd — Workbook BE",
    "description": "BE phase for Major 3rd (Workbook)",
    "troubadourPrompt": "In your journal: You now know the difference between a Major and Minor 3rd — between light and shadow. Write about a moment in your life when something shifted from dark to bright. One sentence is enough. Over.",
    "prerequisites": [
      "fret-5-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-workbook-do",
    "pillar": "workbook",
    "fret": 5,
    "phase": "do",
    "type": "journal",
    "title": "Major 3rd — Workbook DO",
    "description": "DO phase for Major 3rd (Workbook)",
    "troubadourPrompt": "When you played the Major 3rd, did your body respond differently than to the Minor 3rd? The Major is warmth, sunlight, resolution. The Minor was melancholy, longing. Write which one your body prefers — and notice that there is no wrong answer. Over.",
    "prerequisites": [
      "fret-5-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-5-workbook-play",
    "pillar": "workbook",
    "fret": 5,
    "phase": "play",
    "type": "submission",
    "title": "Major 3rd — Workbook PLAY",
    "description": "PLAY phase for Major 3rd (Workbook)",
    "troubadourPrompt": "Record yourself building a Major chord from scratch — Root, Major 3rd, Perfect 5th — and then strumming it. You are not copying a shape from a book. You are constructing harmony from understanding. Submit it. Over.",
    "prerequisites": [
      "fret-5-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-5-class-milestone",
    "pillar": "class",
    "fret": 5,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 5 Complete — The Joy",
    "description": "You have imagined, heard, and played the major 3rd.",
    "troubadourPrompt": "Voilà. Fret 5 — complete. You are an instrument playing an instrument. The major 3rd is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-5-class-be",
      "fret-5-class-do",
      "fret-5-class-play"
    ],
    "suggestedAfter": [
      "fret-6-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-5-workbook-reflection",
    "pillar": "workbook",
    "fret": 5,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Joy",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "Take a moment to release any critique of your performance, letting the music flow like a river. Bravo, embrace the silence after the last note, knowing each attempt is a step forward, Over.",
    "prerequisites": [
      "fret-5-workbook-be",
      "fret-5-workbook-do",
      "fret-5-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 6: Perfect 4th ──

const FRET_6_NODES = [
  {
    "id": "fret-6-class-be",
    "pillar": "class",
    "fret": 6,
    "phase": "be",
    "type": "slide",
    "title": "Perfect 4th — Class BE",
    "description": "BE phase for Perfect 4th (Class)",
    "troubadourPrompt": "The Perfect 4th is the heart of your guitar's geometry. Every string except one is tuned in Perfect 4ths. This is the Approach to the Inmost Cave — the moment you realize the fretboard is not random chaos. It is a grid of repeating shapes. See it. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-6-class-do",
    "pillar": "class",
    "fret": 6,
    "phase": "do",
    "type": "slide",
    "title": "Perfect 4th — Class DO",
    "description": "DO phase for Perfect 4th (Class)",
    "troubadourPrompt": "Play the open low E string. Now play the A string — open. That is a Perfect 4th: five semitones. The same interval that tunes your guitar also builds the foundation of the CAGED system. Hum the E, then hum the A. Feel the distance. Over.",
    "prerequisites": [
      "fret-6-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-6-class-play",
    "pillar": "class",
    "fret": 6,
    "phase": "play",
    "type": "slide",
    "title": "Perfect 4th — Class PLAY",
    "description": "PLAY phase for Perfect 4th (Class)",
    "troubadourPrompt": "This is where ©SHEARL becomes your superpower. See the C chord shape. Now slide it up two frets — that is D. See the pattern? The CAGED system means five shapes cover the entire neck. Play the C shape, then the A shape, at the same root. Same chord, different geography. Over.",
    "prerequisites": [
      "fret-6-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-6-guitar-be",
    "pillar": "guitar",
    "fret": 6,
    "phase": "be",
    "type": "tool",
    "title": "Perfect 4th — Guitar BE",
    "description": "BE phase for Perfect 4th (Guitar)",
    "troubadourPrompt": "You are about to explore the entire fretboard. Before you do, relax your thumb behind the neck — it should be resting, not squeezing. Your wrist should be loose, your forearm relaxed. The neck is not a weapon to grip. It is a landscape to walk across. Breathe. Over.",
    "prerequisites": [
      "fret-6-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5,
    "toolId": "fretboard-explorer"
  },
  {
    "id": "fret-6-guitar-do",
    "pillar": "guitar",
    "fret": 6,
    "phase": "do",
    "type": "game",
    "title": "Perfect 4th — Guitar DO",
    "description": "DO phase for Perfect 4th (Guitar)",
    "troubadourPrompt": "Play a C chord in the open position. Now find the same C chord using the A-shape barre at the third fret. Same notes, different fingers, different neighborhood on the neck. ©SHEARL: See the shape before you play it. Hear the chord before you strum. Over.",
    "prerequisites": [
      "fret-6-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5,
    "toolId": "fretboard-explorer"
  },
  {
    "id": "fret-6-guitar-play",
    "pillar": "guitar",
    "fret": 6,
    "phase": "play",
    "type": "game",
    "title": "Perfect 4th — Guitar PLAY",
    "description": "PLAY phase for Perfect 4th (Guitar)",
    "troubadourPrompt": "Play a G chord — open position. Now play G using the E-shape barre at the third fret. Now the D-shape at the seventh fret. Three neighborhoods, one chord. You are not memorizing — you are navigating. The map is becoming real. Over.",
    "prerequisites": [
      "fret-6-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10,
    "toolId": "fretboard-explorer"
  },
  {
    "id": "fret-6-workbook-be",
    "pillar": "workbook",
    "fret": 6,
    "phase": "be",
    "type": "journal",
    "title": "Perfect 4th — Workbook BE",
    "description": "BE phase for Perfect 4th (Workbook)",
    "troubadourPrompt": "In your journal: Draw a rough sketch of the neck showing where you found the same chord in three different positions. You do not need artistic talent — stick figures and circles are perfect. The act of drawing maps the fretboard in your spatial memory. Over.",
    "prerequisites": [
      "fret-6-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-6-workbook-do",
    "pillar": "workbook",
    "fret": 6,
    "phase": "do",
    "type": "journal",
    "title": "Perfect 4th — Workbook DO",
    "description": "DO phase for Perfect 4th (Workbook)",
    "troubadourPrompt": "When you moved the chord shape up the neck, did it feel like the same chord or a different one? Write about what changed — the physical feeling in your hand, the brightness or darkness of the sound, the confidence or hesitation in your fingers. Over.",
    "prerequisites": [
      "fret-6-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-6-workbook-play",
    "pillar": "workbook",
    "fret": 6,
    "phase": "play",
    "type": "submission",
    "title": "Perfect 4th — Workbook PLAY",
    "description": "PLAY phase for Perfect 4th (Workbook)",
    "troubadourPrompt": "Record yourself playing the same chord in three CAGED positions up the neck. No strumming pattern required — just clean, ringing chords, one after another. Show the fretboard that you can see its geometry. Submit it. Over.",
    "prerequisites": [
      "fret-6-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-6-class-milestone",
    "pillar": "class",
    "fret": 6,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 6 Complete — The Strength",
    "description": "You have imagined, heard, and played the perfect 4th.",
    "troubadourPrompt": "Voilà. Fret 6 — complete. You are an instrument playing an instrument. The perfect 4th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-6-class-be",
      "fret-6-class-do",
      "fret-6-class-play"
    ],
    "suggestedAfter": [
      "fret-7-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-6-workbook-reflection",
    "pillar": "workbook",
    "fret": 6,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Strength",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "Bring awareness to any tension in your hands or mind, and gently release it as you would let a leaf float downstream. Alors, embrace the moment with FHEAL - feel, honor, embrace, accept, let go - without judgment, Over.",
    "prerequisites": [
      "fret-6-workbook-be",
      "fret-6-workbook-do",
      "fret-6-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 7: Tritone ──

const FRET_7_NODES = [
  {
    "id": "fret-7-class-be",
    "pillar": "class",
    "fret": 7,
    "phase": "be",
    "type": "slide",
    "title": "Tritone — Class BE",
    "description": "BE phase for Tritone (Class)",
    "troubadourPrompt": "The Tritone. Six semitones — exactly half the octave. The medieval church called it Diabolus in Musica — the Devil in Music. It is the most unstable, tense, and terrifying interval in all of Western harmony. And you are about to hold it in your hands without flinching. This is the Ordeal. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-7-class-do",
    "pillar": "class",
    "fret": 7,
    "phase": "do",
    "type": "slide",
    "title": "Tritone — Class DO",
    "description": "DO phase for Tritone (Class)",
    "troubadourPrompt": "Play the open low E. Now fret the B♭ at the sixth fret. Hold both. Listen to the beating — that ugly, restless vibration. That is the Tritone. It wants to resolve. Your body wants to move away from it. Do not move. Sit in the dissonance. Breathe. This is ©PLING! at its hardest. Over.",
    "prerequisites": [
      "fret-7-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-7-class-play",
    "pillar": "class",
    "fret": 7,
    "phase": "play",
    "type": "slide",
    "title": "Tritone — Class PLAY",
    "description": "PLAY phase for Tritone (Class)",
    "troubadourPrompt": "Now resolve it. Play the Tritone — then move one fret down to the Perfect 5th. Feel the tension dissolve. That gravitational pull from chaos to order is what drives all of Western music. Every blues song, every jazz standard, every film score. You just felt it in your fingers. Over.",
    "prerequisites": [
      "fret-7-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-7-guitar-be",
    "pillar": "guitar",
    "fret": 7,
    "phase": "be",
    "type": "tool",
    "title": "Tritone — Guitar BE",
    "description": "BE phase for Tritone (Guitar)",
    "troubadourPrompt": "The Ordeal requires courage. Before you enter the ©PLING! Trainer, scan your body for tension. The Tritone will provoke discomfort — your jaw may clench, your shoulders may rise. Notice this. Release it. The only way through the Devil's interval is relaxation. Over.",
    "prerequisites": [
      "fret-7-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5,
    "toolId": "pling-trainer"
  },
  {
    "id": "fret-7-guitar-do",
    "pillar": "guitar",
    "fret": 7,
    "phase": "do",
    "type": "game",
    "title": "Tritone — Guitar DO",
    "description": "DO phase for Tritone (Guitar)",
    "troubadourPrompt": "Sing the root note. Now sing the note six frets higher — the Tritone. It is the hardest interval to sing because it has no natural resting place. If you can sing the Devil's interval, you can sing anything. ©PLING! — sing it, then play it. Over.",
    "prerequisites": [
      "fret-7-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5,
    "toolId": "pling-trainer"
  },
  {
    "id": "fret-7-guitar-play",
    "pillar": "guitar",
    "fret": 7,
    "phase": "play",
    "type": "game",
    "title": "Tritone — Guitar PLAY",
    "description": "PLAY phase for Tritone (Guitar)",
    "troubadourPrompt": "Play the Tritone. Hold it for four breaths. Now resolve to the Perfect 5th. Hold that for four breaths. Back to the Tritone. Resolve again. You are training your fingers and your nervous system to move through tension without panic. This is the Ordeal, and you are surviving it. Over.",
    "prerequisites": [
      "fret-7-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10,
    "toolId": "pling-trainer"
  },
  {
    "id": "fret-7-workbook-be",
    "pillar": "workbook",
    "fret": 7,
    "phase": "be",
    "type": "journal",
    "title": "Tritone — Workbook BE",
    "description": "BE phase for Tritone (Workbook)",
    "troubadourPrompt": "In your journal: The Devil's interval was banned by the medieval church. Why do you think musicians kept playing it anyway? What does tension teach us that comfort cannot? Write one honest sentence. Over.",
    "prerequisites": [
      "fret-7-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-7-workbook-do",
    "pillar": "workbook",
    "fret": 7,
    "phase": "do",
    "type": "journal",
    "title": "Tritone — Workbook DO",
    "description": "DO phase for Tritone (Workbook)",
    "troubadourPrompt": "When you held the Tritone, what happened in your body? Did your shoulders rise? Did your breath stop? The Tritone is a somatic mirror — it reveals where you hold tension. Write about what it showed you. Over.",
    "prerequisites": [
      "fret-7-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-7-workbook-play",
    "pillar": "workbook",
    "fret": 7,
    "phase": "play",
    "type": "submission",
    "title": "Tritone — Workbook PLAY",
    "description": "PLAY phase for Tritone (Workbook)",
    "troubadourPrompt": "Record yourself playing the Tritone and resolving it to the Perfect 5th — three times. Do not rush the resolution. Let the dissonance ring. Let the resolution breathe. This recording proves you can sit with musical tension and transform it. Submit it. Over.",
    "prerequisites": [
      "fret-7-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-7-class-milestone",
    "pillar": "class",
    "fret": 7,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 7 Complete — The Mystery",
    "description": "You have imagined, heard, and played the tritone.",
    "troubadourPrompt": "Voilà. Fret 7 — complete. You are an instrument playing an instrument. The tritone is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-7-class-be",
      "fret-7-class-do",
      "fret-7-class-play"
    ],
    "suggestedAfter": [
      "fret-8-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-7-workbook-reflection",
    "pillar": "workbook",
    "fret": 7,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Mystery",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "Bravo, release any judgment and simply observe your practice with kindness. Let go of expectations, allowing the music to be a gentle companion, Over.",
    "prerequisites": [
      "fret-7-workbook-be",
      "fret-7-workbook-do",
      "fret-7-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 8: Perfect 5th ──

const FRET_8_NODES = [
  {
    "id": "fret-8-class-be",
    "pillar": "class",
    "fret": 8,
    "phase": "be",
    "type": "slide",
    "title": "Perfect 5th — Class BE",
    "description": "BE phase for Perfect 5th (Class)",
    "troubadourPrompt": "The Perfect 5th is the Reward after the Ordeal. Seven semitones of pure consonance — the most stable interval after the octave. It is the sound of power chords, church bells, and open tuning. After surviving the Devil's Note, you have earned this clarity. Close your eyes and hear it before you play it. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-class-do",
    "pillar": "class",
    "fret": 8,
    "phase": "do",
    "type": "slide",
    "title": "Perfect 5th — Class DO",
    "description": "DO phase for Perfect 5th (Class)",
    "troubadourPrompt": "Hum any comfortable note. Now sing the note seven semitones higher — a Perfect 5th. It should feel like coming home after a long journey. The ratio is 3:2, the most natural consonance. Pythagoras heard it in the blacksmith's hammers. You hear it in every rock song ever written. Over.",
    "prerequisites": [
      "fret-8-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-class-play",
    "pillar": "class",
    "fret": 8,
    "phase": "play",
    "type": "slide",
    "title": "Perfect 5th — Class PLAY",
    "description": "PLAY phase for Perfect 5th (Class)",
    "troubadourPrompt": "Play the open low E. Now fret the B at the seventh fret. Root and Perfect 5th. That is a power chord. Two fingers, infinite power. Every rock anthem, every hymn, every war cry — built on this ratio. Strum it and feel the authority in your hands. Over.",
    "prerequisites": [
      "fret-8-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-8-guitar-be",
    "pillar": "guitar",
    "fret": 8,
    "phase": "be",
    "type": "tool",
    "title": "Perfect 5th — Guitar BE",
    "description": "BE phase for Perfect 5th (Guitar)",
    "troubadourPrompt": "After the Tritone's chaos, your body may still be holding tension. Shake your hands. Roll your wrists. The Perfect 5th requires confidence, not force — you cannot play a power chord while gripping the neck like a weapon. Loose hands. Strong sound. Over.",
    "prerequisites": [
      "fret-8-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-guitar-do",
    "pillar": "guitar",
    "fret": 8,
    "phase": "do",
    "type": "game",
    "title": "Perfect 5th — Guitar DO",
    "description": "DO phase for Perfect 5th (Guitar)",
    "troubadourPrompt": "Play a power chord on E. Now slide the shape up two frets — that is F♯5. Two more — A♭5. The shape never changes. Your ear tracks the root, your hand follows the geometry. This is ©FHEAL in action — feel the chord before you think about it. Over.",
    "prerequisites": [
      "fret-8-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-guitar-play",
    "pillar": "guitar",
    "fret": 8,
    "phase": "play",
    "type": "game",
    "title": "Perfect 5th — Guitar PLAY",
    "description": "PLAY phase for Perfect 5th (Guitar)",
    "troubadourPrompt": "Play a power chord progression: E5 → A5 → D5 → A5 → E5. Use only downstrokes. Feel the weight of each chord landing like a footstep. You are not playing notes — you are driving rhythm. The Perfect 5th is the engine of the guitar. Over.",
    "prerequisites": [
      "fret-8-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-8-workbook-be",
    "pillar": "workbook",
    "fret": 8,
    "phase": "be",
    "type": "journal",
    "title": "Perfect 5th — Workbook BE",
    "description": "BE phase for Perfect 5th (Workbook)",
    "troubadourPrompt": "In your journal: The power chord is the most democratic sound in music — anyone can play it within minutes. Why do you think simplicity carries so much emotional weight? Write about a time when less was more. Over.",
    "prerequisites": [
      "fret-8-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-workbook-do",
    "pillar": "workbook",
    "fret": 8,
    "phase": "do",
    "type": "journal",
    "title": "Perfect 5th — Workbook DO",
    "description": "DO phase for Perfect 5th (Workbook)",
    "troubadourPrompt": "When you played the power chord progression, did your right hand find a natural rhythm? Did your body want to nod, tap, or sway? Write about what your body did without being told to. That is ©FHEAL — the body already knows. Over.",
    "prerequisites": [
      "fret-8-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-8-workbook-play",
    "pillar": "workbook",
    "fret": 8,
    "phase": "play",
    "type": "submission",
    "title": "Perfect 5th — Workbook PLAY",
    "description": "PLAY phase for Perfect 5th (Workbook)",
    "troubadourPrompt": "Record yourself playing a power chord progression of your own design — any roots, any rhythm. Make it feel like something. Make it mean something. This is the first time you are composing, not practicing. Submit it. Over.",
    "prerequisites": [
      "fret-8-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-8-class-milestone",
    "pillar": "class",
    "fret": 8,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 8 Complete — The Power",
    "description": "You have imagined, heard, and played the perfect 5th.",
    "troubadourPrompt": "Voilà. Fret 8 — complete. You are an instrument playing an instrument. The perfect 5th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-8-class-be",
      "fret-8-class-do",
      "fret-8-class-play"
    ],
    "suggestedAfter": [
      "fret-9-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-8-workbook-reflection",
    "pillar": "workbook",
    "fret": 8,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Power",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "©FHEAL — Feel the weight of the guitar in your lap. Hold the last chord. Embrace the silence after it fades. Accept that what you played is exactly what it needed to be. Let go. You have survived the Ordeal and claimed the Reward. Over.",
    "prerequisites": [
      "fret-8-workbook-be",
      "fret-8-workbook-do",
      "fret-8-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 9: Minor 6th ──

const FRET_9_NODES = [
  {
    "id": "fret-9-class-be",
    "pillar": "class",
    "fret": 9,
    "phase": "be",
    "type": "slide",
    "title": "Minor 6th — Class BE",
    "description": "BE phase for Minor 6th (Class)",
    "troubadourPrompt": "The Minor 6th is eight semitones — the inversion of the Major 3rd. Where the Major 3rd was sunlight, the Minor 6th is the memory of sunlight. It is the interval of film scores and lullabies, of Beauty and the Beast and Love Story. You are on the Road Back. The journey home begins now. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-9-class-do",
    "pillar": "class",
    "fret": 9,
    "phase": "do",
    "type": "slide",
    "title": "Minor 6th — Class DO",
    "description": "DO phase for Minor 6th (Class)",
    "troubadourPrompt": "Play the open low E. Now fret the C at the eighth fret. That searching, bittersweet sound is the Minor 6th. Sing the root, then try to sing the Minor 6th. Your inner ear must stretch further than before — eight semitones is a wide leap. Trust it. Over.",
    "prerequisites": [
      "fret-9-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-9-class-play",
    "pillar": "class",
    "fret": 9,
    "phase": "play",
    "type": "slide",
    "title": "Minor 6th — Class PLAY",
    "description": "PLAY phase for Minor 6th (Class)",
    "troubadourPrompt": "This is where all three protocols converge. Play the Root. ©SHEARL — see the eighth fret in your mind's eye. ©PLING! — sing the Minor 6th before you play it. ©FHEAL — now play it without thinking, letting the sound arise from your body. Three protocols, one note. Over.",
    "prerequisites": [
      "fret-9-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-9-guitar-be",
    "pillar": "guitar",
    "fret": 9,
    "phase": "be",
    "type": "tool",
    "title": "Minor 6th — Guitar BE",
    "description": "BE phase for Minor 6th (Guitar)",
    "troubadourPrompt": "You are about to enter the Vertiscale Engine — the convergence of everything you have learned. Before you begin, find the minimum finger pressure needed to make a clean note at the eighth fret. Use the Pressure Threshold technique from Fret 9. Effortlessness is the goal. Over.",
    "prerequisites": [
      "fret-9-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5,
    "toolId": "vertiscale-engine"
  },
  {
    "id": "fret-9-guitar-do",
    "pillar": "guitar",
    "fret": 9,
    "phase": "do",
    "type": "game",
    "title": "Minor 6th — Guitar DO",
    "description": "DO phase for Minor 6th (Guitar)",
    "troubadourPrompt": "Phase 1 of the Vertiscale: The Inner Fretboard. Flash patterns will appear — memorize them using ©SHEARL before tapping. Your spatial memory is being tested. You are no longer reading the neck; you are recalling it from inside. Over.",
    "prerequisites": [
      "fret-9-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5,
    "toolId": "vertiscale-engine"
  },
  {
    "id": "fret-9-guitar-play",
    "pillar": "guitar",
    "fret": 9,
    "phase": "play",
    "type": "game",
    "title": "Minor 6th — Guitar PLAY",
    "description": "PLAY phase for Minor 6th (Guitar)",
    "troubadourPrompt": "Phase 2 of the Vertiscale: The Inner Ear. Notes will descend. Sing them before they reach the bottom. ©PLING! — your voice leads, your fingers follow. If you can sing the note, you own it. If you cannot, you are borrowing it. Make it yours. Over.",
    "prerequisites": [
      "fret-9-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10,
    "toolId": "vertiscale-engine"
  },
  {
    "id": "fret-9-workbook-be",
    "pillar": "workbook",
    "fret": 9,
    "phase": "be",
    "type": "journal",
    "title": "Minor 6th — Workbook BE",
    "description": "BE phase for Minor 6th (Workbook)",
    "troubadourPrompt": "In your journal: The Road Back is the hero's longest stretch. What in your musical journey so far has felt like a long road? What kept you walking? Write about your persistence — not your talent. Over.",
    "prerequisites": [
      "fret-9-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-9-workbook-do",
    "pillar": "workbook",
    "fret": 9,
    "phase": "do",
    "type": "journal",
    "title": "Minor 6th — Workbook DO",
    "description": "DO phase for Minor 6th (Workbook)",
    "troubadourPrompt": "After the Vertiscale, reflect: which phase was hardest — seeing, singing, or feeling? That gap is your growth edge. Write about the phase that challenged you most and why. The awareness alone is progress. Over.",
    "prerequisites": [
      "fret-9-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-9-workbook-play",
    "pillar": "workbook",
    "fret": 9,
    "phase": "play",
    "type": "submission",
    "title": "Minor 6th — Workbook PLAY",
    "description": "PLAY phase for Minor 6th (Workbook)",
    "troubadourPrompt": "Record yourself playing the Vertiscale — ascending from Root through all 12 intervals on a single string. Play it too slow. Slower than you think is right. Myelination requires patience, not speed. Submit it. Over.",
    "prerequisites": [
      "fret-9-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-9-class-milestone",
    "pillar": "class",
    "fret": 9,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 9 Complete — The Longing",
    "description": "You have imagined, heard, and played the minor 6th.",
    "troubadourPrompt": "Voilà. Fret 9 — complete. You are an instrument playing an instrument. The minor 6th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-9-class-be",
      "fret-9-class-do",
      "fret-9-class-play"
    ],
    "suggestedAfter": [
      "fret-10-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-9-workbook-reflection",
    "pillar": "workbook",
    "fret": 9,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Longing",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "©FHEAL in full. Feel the fatigue in your fingers. Hold the guitar against your chest. Embrace the fact that you just played through the hardest chapter in the curriculum. Accept your current level without comparison. Let go of what you think you should sound like. You sound like you. Over.",
    "prerequisites": [
      "fret-9-workbook-be",
      "fret-9-workbook-do",
      "fret-9-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 10: Major 6th ──

const FRET_10_NODES = [
  {
    "id": "fret-10-class-be",
    "pillar": "class",
    "fret": 10,
    "phase": "be",
    "type": "slide",
    "title": "Major 6th — Class BE",
    "description": "BE phase for Major 6th (Class)",
    "troubadourPrompt": "The Major 6th is the Resurrection. Nine semitones of nostalgia, hope, and wistful beauty. It is the interval you hear in lullabies and farewells. This chapter is about being seen — performing not for perfection, but for connection. The audience does not hear your technique. They feel your story. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-class-do",
    "pillar": "class",
    "fret": 10,
    "phase": "do",
    "type": "slide",
    "title": "Major 6th — Class DO",
    "description": "DO phase for Major 6th (Class)",
    "troubadourPrompt": "Play the open low E. Now sing — do not play — the note nine semitones higher. That is the Major 6th. It is a wide leap. If your voice cracks or wobbles, that is honesty, not failure. Sing it three times. Each time, your voice will find it more easily. Over.",
    "prerequisites": [
      "fret-10-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-class-play",
    "pillar": "class",
    "fret": 10,
    "phase": "play",
    "type": "slide",
    "title": "Major 6th — Class PLAY",
    "description": "PLAY phase for Major 6th (Class)",
    "troubadourPrompt": "Play a melody — any melody you love. Not from a book. Not from a lesson. From memory. Play it slowly, with feeling. Dedicate it to someone. The act of dedicating changes everything — your touch softens, your tempo breathes, your heart opens. This is the Performing pillar. Over.",
    "prerequisites": [
      "fret-10-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-10-guitar-be",
    "pillar": "guitar",
    "fret": 10,
    "phase": "be",
    "type": "tool",
    "title": "Major 6th — Guitar BE",
    "description": "BE phase for Major 6th (Guitar)",
    "troubadourPrompt": "This chapter is about recording anxiety — the fear of being heard. Before you open the Coaching Portal, sit with that fear. Name it. Is it the fear of being judged? Of not being good enough? That fear is exactly what the Troubadour’s Journey is designed to dissolve. Breathe. Over.",
    "prerequisites": [
      "fret-10-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-guitar-do",
    "pillar": "guitar",
    "fret": 10,
    "phase": "do",
    "type": "game",
    "title": "Major 6th — Guitar DO",
    "description": "DO phase for Major 6th (Guitar)",
    "troubadourPrompt": "Play the same simple melody three times. First time: play it as if you are sad. Second time: as if you are celebrating. Third time: as if you are saying goodbye. Same notes. Three completely different performances. Emotional conditioning — this is what separates a guitarist from a musician. Over.",
    "prerequisites": [
      "fret-10-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-guitar-play",
    "pillar": "guitar",
    "fret": 10,
    "phase": "play",
    "type": "game",
    "title": "Major 6th — Guitar PLAY",
    "description": "PLAY phase for Major 6th (Guitar)",
    "troubadourPrompt": "Open the Coaching Portal. Turn on your camera. Look into it. Play your dedicated melody. You are performing for Bertrand — and more importantly, for yourself. This is being seen. This is the Resurrection. Bravo. Over.",
    "prerequisites": [
      "fret-10-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-10-workbook-be",
    "pillar": "workbook",
    "fret": 10,
    "phase": "be",
    "type": "journal",
    "title": "Major 6th — Workbook BE",
    "description": "BE phase for Major 6th (Workbook)",
    "troubadourPrompt": "In your journal: What was it like to be recorded? Did you notice your body tensing? Did the inner critic appear? Write honestly about the experience of performing on camera. There is no wrong answer — only awareness. Over.",
    "prerequisites": [
      "fret-10-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-workbook-do",
    "pillar": "workbook",
    "fret": 10,
    "phase": "do",
    "type": "journal",
    "title": "Major 6th — Workbook DO",
    "description": "DO phase for Major 6th (Workbook)",
    "troubadourPrompt": "When you played the melody three ways — sad, joyful, farewell — which version felt most natural? Which felt forced? Write about what your body wanted to express versus what your mind told it to express. The gap between them is your growth edge. Over.",
    "prerequisites": [
      "fret-10-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-10-workbook-play",
    "pillar": "workbook",
    "fret": 10,
    "phase": "play",
    "type": "submission",
    "title": "Major 6th — Workbook PLAY",
    "description": "PLAY phase for Major 6th (Workbook)",
    "troubadourPrompt": "Record your dedicated melody one final time. This time, do not think about technique. Do not think about the camera. Think only about the person you are playing for. Submit it to Bertrand. He will hear not your skill, but your heart. Over.",
    "prerequisites": [
      "fret-10-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-10-class-milestone",
    "pillar": "class",
    "fret": 10,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 10 Complete — The Love",
    "description": "You have imagined, heard, and played the major 6th.",
    "troubadourPrompt": "Voilà. Fret 10 — complete. You are an instrument playing an instrument. The major 6th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-10-class-be",
      "fret-10-class-do",
      "fret-10-class-play"
    ],
    "suggestedAfter": [
      "fret-11-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-10-workbook-reflection",
    "pillar": "workbook",
    "fret": 10,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Love",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "©FHEAL — You were seen today. You performed. You submitted. That took more courage than any scale or chord progression. Feel the relief. Hold the pride. Embrace the vulnerability. Accept that you are a musician. Let go of the idea that you are not ready. You are. Over.",
    "prerequisites": [
      "fret-10-workbook-be",
      "fret-10-workbook-do",
      "fret-10-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 11: Minor 7th ──

const FRET_11_NODES = [
  {
    "id": "fret-11-class-be",
    "pillar": "class",
    "fret": 11,
    "phase": "be",
    "type": "slide",
    "title": "Minor 7th — Class BE",
    "description": "BE phase for Minor 7th (Class)",
    "troubadourPrompt": "The Minor 7th — ten semitones. This is the Return. The interval that makes a Dominant 7th chord demand resolution. It is the sound of blues, of jazz, of soul. Every 12-bar blues you have ever heard pivots on this interval. You are almost home. One more step. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-class-do",
    "pillar": "class",
    "fret": 11,
    "phase": "do",
    "type": "slide",
    "title": "Minor 7th — Class DO",
    "description": "DO phase for Minor 7th (Class)",
    "troubadourPrompt": "Play a G chord. Now add the F on the first fret of the high E string. That gritty, unresolved sound is G7 — a Dominant 7th. The Minor 7th is the note that creates the gravitational pull back to C. Hum the G, then hum the F. Feel how the F leans toward the E. That lean is the Return. Over.",
    "prerequisites": [
      "fret-11-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-class-play",
    "pillar": "class",
    "fret": 11,
    "phase": "play",
    "type": "slide",
    "title": "Minor 7th — Class PLAY",
    "description": "PLAY phase for Minor 7th (Class)",
    "troubadourPrompt": "Play a simple 12-bar blues in E: E7 for four bars, A7 for two, E7 for two, B7 for one, A7 for one, E7 for two. Every chord is a Dominant 7th — every chord contains the Minor 7th interval. You are not learning theory. You are playing the blues. Over.",
    "prerequisites": [
      "fret-11-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-11-guitar-be",
    "pillar": "guitar",
    "fret": 11,
    "phase": "be",
    "type": "tool",
    "title": "Minor 7th — Guitar BE",
    "description": "BE phase for Minor 7th (Guitar)",
    "troubadourPrompt": "The blues requires a relaxed right hand and a loose wrist. Before you play, shake your strumming hand for ten seconds. Let it go completely limp. Now pick up the guitar and strum — keep that looseness. The blues does not come from effort. It comes from release. Over.",
    "prerequisites": [
      "fret-11-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-guitar-do",
    "pillar": "guitar",
    "fret": 11,
    "phase": "do",
    "type": "game",
    "title": "Minor 7th — Guitar DO",
    "description": "DO phase for Minor 7th (Guitar)",
    "troubadourPrompt": "Play a Dominant 7th chord. Now mute all the strings with your left hand and strum the muted strings rhythmically — chuck-chuck-chuck. Now alternate: chord, mute, chord, mute. That is the funk groove. Right-hand muting is the secret weapon of rhythm guitar. Over.",
    "prerequisites": [
      "fret-11-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-guitar-play",
    "pillar": "guitar",
    "fret": 11,
    "phase": "play",
    "type": "game",
    "title": "Minor 7th — Guitar PLAY",
    "description": "PLAY phase for Minor 7th (Guitar)",
    "troubadourPrompt": "Play a 12-bar blues with a shuffle feel. Swing the eighth notes — long-short, long-short, like a heartbeat with a limp. This is not straight time. This is the blues talking. Let your body sway. If your head is not moving, the rhythm is not in your body yet. Over.",
    "prerequisites": [
      "fret-11-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-11-workbook-be",
    "pillar": "workbook",
    "fret": 11,
    "phase": "be",
    "type": "journal",
    "title": "Minor 7th — Workbook BE",
    "description": "BE phase for Minor 7th (Workbook)",
    "troubadourPrompt": "In your journal: The blues is not a style — it is a feeling. Everyone has the blues. Write about a moment in your life that felt like a 12-bar loop — a pattern you kept repeating until something finally shifted. One honest paragraph. Over.",
    "prerequisites": [
      "fret-11-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-workbook-do",
    "pillar": "workbook",
    "fret": 11,
    "phase": "do",
    "type": "journal",
    "title": "Minor 7th — Workbook DO",
    "description": "DO phase for Minor 7th (Workbook)",
    "troubadourPrompt": "When you played the shuffle, did your body want to move? Did you smile? Did you feel something unlock? The Minor 7th is the most emotionally honest interval — it does not pretend to be resolved. Write about what felt authentic in your playing today. Over.",
    "prerequisites": [
      "fret-11-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-11-workbook-play",
    "pillar": "workbook",
    "fret": 11,
    "phase": "play",
    "type": "submission",
    "title": "Minor 7th — Workbook PLAY",
    "description": "PLAY phase for Minor 7th (Workbook)",
    "troubadourPrompt": "Record yourself playing a 12-bar blues in any key. Use Dominant 7th chords. Use a shuffle rhythm. Play it like you mean it — not like you are practicing it. This is the blues. It does not care about perfection. It cares about truth. Submit it. Over.",
    "prerequisites": [
      "fret-11-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-11-class-milestone",
    "pillar": "class",
    "fret": 11,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 11 Complete — The Blues",
    "description": "You have imagined, heard, and played the minor 7th.",
    "troubadourPrompt": "Voilà. Fret 11 — complete. You are an instrument playing an instrument. The minor 7th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-11-class-be",
      "fret-11-class-do",
      "fret-11-class-play"
    ],
    "suggestedAfter": [
      "fret-12-class-be"
    ],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-11-workbook-reflection",
    "pillar": "workbook",
    "fret": 11,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Blues",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "©FHEAL — The blues taught you that imperfection is not failure. It is expression. Feel the rhythm still in your body. Hold the last chord ringing in your memory. Embrace the rawness of what you played. Accept that the blues is you, speaking. Let go of the need to be polished. Over.",
    "prerequisites": [
      "fret-11-workbook-be",
      "fret-11-workbook-do",
      "fret-11-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── FRET 12: Major 7th ──

const FRET_12_NODES = [
  {
    "id": "fret-12-class-be",
    "pillar": "class",
    "fret": 12,
    "phase": "be",
    "type": "slide",
    "title": "Major 7th — Class BE",
    "description": "BE phase for Major 7th (Class)",
    "troubadourPrompt": "The Major 7th. Eleven semitones — one half-step from the Octave. The final interval. It is the sound of arrival that has not quite landed. The dissonance of a Cmaj7 chord is not ugly — it is elegant, hovering, luminous. Like standing on the threshold of home, seeing the light inside. This is the Return with the Elixir. Over.",
    "prerequisites": [],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-class-do",
    "pillar": "class",
    "fret": 12,
    "phase": "do",
    "type": "slide",
    "title": "Major 7th — Class DO",
    "description": "DO phase for Major 7th (Class)",
    "troubadourPrompt": "Play a C major chord. Now lift your index finger off the first fret of the B string, letting the open B ring. That shimmering, almost-resolved sound is Cmaj7. The Major 7th hovers one semitone below the Octave — close enough to taste home but not quite there. Sing the B, then sing the C above it. Feel how close they are. Over.",
    "prerequisites": [
      "fret-12-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-class-play",
    "pillar": "class",
    "fret": 12,
    "phase": "play",
    "type": "slide",
    "title": "Major 7th — Class PLAY",
    "description": "PLAY phase for Major 7th (Class)",
    "troubadourPrompt": "Play four chords: Cmaj7, Am7, Dm7, G7. Let each chord ring for a full breath. That progression is the sound of every bossa nova, every chill jazz café, every sunset. You are not playing notes — you are painting with intervals. Every color you have learned is in those four chords. Over.",
    "prerequisites": [
      "fret-12-class-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-12-guitar-be",
    "pillar": "guitar",
    "fret": 12,
    "phase": "be",
    "type": "tool",
    "title": "Major 7th — Guitar BE",
    "description": "BE phase for Major 7th (Guitar)",
    "troubadourPrompt": "You have walked all 12 frets. Before this final practice session, sit with the guitar in your lap and do nothing for sixty seconds. No playing. No thinking. Just breathing. You began at Fret 1 by learning to breathe. You end at Fret 12 the same way. The circle closes. Over.",
    "prerequisites": [
      "fret-12-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-guitar-do",
    "pillar": "guitar",
    "fret": 12,
    "phase": "do",
    "type": "game",
    "title": "Major 7th — Guitar DO",
    "description": "DO phase for Major 7th (Guitar)",
    "troubadourPrompt": "Play the Chromatic Vertiscale: starting from the open E, play every fret — one by one — up to the 12th fret. Each fret is an interval you have mastered. Root, Minor 2nd, Major 2nd, Minor 3rd, Major 3rd, Perfect 4th, Tritone, Perfect 5th, Minor 6th, Major 6th, Minor 7th, Major 7th, Octave. Name each one as you play it. Over.",
    "prerequisites": [
      "fret-12-guitar-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-guitar-play",
    "pillar": "guitar",
    "fret": 12,
    "phase": "play",
    "type": "game",
    "title": "Major 7th — Guitar PLAY",
    "description": "PLAY phase for Major 7th (Guitar)",
    "troubadourPrompt": "Now improvise freely across the entire neck. Use any interval, any position, any rhythm. There are no wrong notes — only choices. ©FHEAL is fully active. You are not practicing. You are playing. You are the instrument playing the instrument. Over.",
    "prerequisites": [
      "fret-12-guitar-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-12-workbook-be",
    "pillar": "workbook",
    "fret": 12,
    "phase": "be",
    "type": "journal",
    "title": "Major 7th — Workbook BE",
    "description": "BE phase for Major 7th (Workbook)",
    "troubadourPrompt": "In your journal: You began this journey by asking 'What does the root note feel like?' Now ask: 'Who am I as a musician?' Not who you want to be. Who you are right now, today, at this fret. Write one paragraph — no editing, no judgment. Over.",
    "prerequisites": [
      "fret-12-class-be"
    ],
    "suggestedAfter": [],
    "xpValue": 10,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-workbook-do",
    "pillar": "workbook",
    "fret": 12,
    "phase": "do",
    "type": "journal",
    "title": "Major 7th — Workbook DO",
    "description": "DO phase for Major 7th (Workbook)",
    "troubadourPrompt": "Look back through your journal entries — from Fret 1 to now. Read your own words. Notice how your language has changed. The student who wrote at Fret 1 is not the same person writing at Fret 12. Write about what you notice. That difference is the elixir. Over.",
    "prerequisites": [
      "fret-12-workbook-be"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "estimatedMinutes": 5
  },
  {
    "id": "fret-12-workbook-play",
    "pillar": "workbook",
    "fret": 12,
    "phase": "play",
    "type": "submission",
    "title": "Major 7th — Workbook PLAY",
    "description": "PLAY phase for Major 7th (Workbook)",
    "troubadourPrompt": "Record your Capstone Audition. Play anything you want — a song, an improvisation, a melody you composed. Play it for Bertrand. Play it for yourself. This recording is the proof that you walked all 12 frets and arrived home. Submit it. Bravo. Over.",
    "prerequisites": [
      "fret-12-workbook-do"
    ],
    "suggestedAfter": [],
    "xpValue": 20,
    "estimatedMinutes": 10
  },
  {
    "id": "fret-12-class-milestone",
    "pillar": "class",
    "fret": 12,
    "phase": "all",
    "type": "milestone",
    "title": "Fret 12 Complete — The Lead",
    "description": "You have imagined, heard, and played the major 7th.",
    "troubadourPrompt": "Voilà. Fret 12 — complete. You are an instrument playing an instrument. The major 7th is now part of your vocabulary. Bravo. Over.",
    "prerequisites": [
      "fret-12-class-be",
      "fret-12-class-do",
      "fret-12-class-play"
    ],
    "suggestedAfter": [],
    "xpValue": 25,
    "estimatedMinutes": 2,
    "audioCue": "completion-chime"
  },
  {
    "id": "fret-12-workbook-reflection",
    "pillar": "workbook",
    "fret": 12,
    "phase": "all",
    "type": "reflection",
    "title": "FHEAL — The Lead",
    "description": "No judgment. Just observation. The inner critic has no place here.",
    "troubadourPrompt": "©FHEAL — the final reflection. Feel the weight of twelve chapters of growth. Hold the memory of every interval, every journal entry, every recording. Embrace the musician you have become. Accept that the journey never truly ends — only this chapter does. Let go of the student. You are a Troubadour now. Over.",
    "prerequisites": [
      "fret-12-workbook-be",
      "fret-12-workbook-do",
      "fret-12-workbook-play"
    ],
    "suggestedAfter": [],
    "xpValue": 15,
    "journalPrompt": "Without judging good or bad, describe what happened in this session in three words.",
    "estimatedMinutes": 2
  }
];

// ── EXPORT ALL NODES ──
export const dagNodes = [
  ...FRET_1_NODES,
  ...FRET_2_NODES,
  ...FRET_3_NODES,
  ...FRET_4_NODES,
  ...FRET_5_NODES,
  ...FRET_6_NODES,
  ...FRET_7_NODES,
  ...FRET_8_NODES,
  ...FRET_9_NODES,
  ...FRET_10_NODES,
  ...FRET_11_NODES,
  ...FRET_12_NODES,
];

// ── LOOKUP FUNCTIONS ──

export function getNodeById(id) {
  return dagNodes.find(n => n.id === id) || null;
}

export function getNodesByFret(fret) {
  return dagNodes.filter(n => n.fret === fret);
}

export function getNodesByPillar(pillar) {
  return dagNodes.filter(n => n.pillar === pillar);
}

export function getNodesByPhase(phase) {
  return dagNodes.filter(n => n.phase === phase);
}

export function getPrerequisites(nodeId) {
  const node = getNodeById(nodeId);
  if (!node) return [];
  return node.prerequisites.map(prereqId => getNodeById(prereqId)).filter(Boolean);
}

export function getSuggestedAfter(nodeId) {
  const node = getNodeById(nodeId);
  if (!node) return [];
  return node.suggestedAfter.map(suggId => getNodeById(suggId)).filter(Boolean);
}

export function getMilestoneForFret(fret) {
  return dagNodes.find(n => n.fret === fret && n.type === 'milestone') || null;
}

export function getTotalXp() {
  return dagNodes.reduce((sum, n) => sum + (n.xpValue || 0), 0);
}

export function getFretXp(fret) {
  return getNodesByFret(fret).reduce((sum, n) => sum + (n.xpValue || 0), 0);
}

// ── FRET METADATA ──

export const FRET_METADATA = {
  1: { interval: 'Root Note', character: 'The Foundation', ratio: '1:1', cents: 0, hzExample: '82.41 Hz (E2)', emotion: 'Grounded, stable, open' },
  2: { interval: 'Minor 2nd', character: 'The Awakening', ratio: '16:15', cents: 111.7, hzExample: '87.31 Hz (F2)', emotion: 'Tense, questioning, yearning' },
  3: { interval: 'Major 2nd', character: 'The Journey', ratio: '9:8', cents: 203.9, hzExample: '92.50 Hz (F#2)', emotion: 'Moving forward, hopeful' },
  4: { interval: 'Minor 3rd', character: 'The Longing', ratio: '6:5', cents: 315.6, hzExample: '98.00 Hz (G2)', emotion: 'Melancholic, deep, emotional' },
  5: { interval: 'Major 3rd', character: 'The Joy', ratio: '5:4', cents: 386.3, hzExample: '103.83 Hz (G#2)', emotion: 'Bright, happy, resolved' },
  6: { interval: 'Perfect 4th', character: 'The Question', ratio: '4:3', cents: 498.0, hzExample: '110.00 Hz (A2)', emotion: 'Open, suspended, searching' },
  7: { interval: 'Tritone', character: 'The Ordeal', ratio: '√2:1 (~1.414)', cents: 600, hzExample: '116.54 Hz (A#2/Bb2)', emotion: 'Crisis, tension, breakthrough' },
  8: { interval: 'Perfect 5th', character: 'The Power', ratio: '3:2', cents: 701.96, hzExample: '123.47 Hz (B2)', emotion: 'Strong, stable, powerful' },
  9: { interval: 'Minor 6th', character: 'The Memory', ratio: '8:5', cents: 813.7, hzExample: '130.81 Hz (C3)', emotion: 'Nostalgic, distant, longing' },
  10: { interval: 'Major 6th', character: 'The Hope', ratio: '5:3', cents: 884.4, hzExample: '138.59 Hz (C#3)', emotion: 'Uplifting, aspiring, reaching' },
  11: { interval: 'Minor 7th', character: 'The Return', ratio: '16:9', cents: 996.1, hzExample: '146.83 Hz (D3)', emotion: 'Winding, unresolved, coming back' },
  12: { interval: 'Major 7th', character: 'The Home', ratio: '15:8', cents: 1088.3, hzExample: '155.56 Hz (D#3)', emotion: 'Leading, expectant, arrival' },
};

