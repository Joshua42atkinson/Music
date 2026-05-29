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
    "troubadourPrompt": "Close your eyes and picture the story unfolding at the fifth fret, what colors and characters appear? Alors, let that image guide your fingers as you prepare to play, Over.",
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
    "troubadourPrompt": "Hum the note that lives at the fifth fret, feeling its vibration around 440 Hz, like a heart beating steady. Ecoute, let your voice match that pitch, and notice how the ratio sings in your chest, Over.",
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
    "troubadourPrompt": "Place your index finger on the fifth fret of the second string to sound a B note. Voila, start now and let the tone ring clear, Over.",
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
    "troubadourPrompt": "Sit tall, inhale deeply for four counts, feeling the air fill your belly like a warm breeze. Alors, exhale slowly for six counts, releasing tension as you center your focus on the fifth fret, Over.",
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
    "troubadourPrompt": "Play the note at the fifth fret on the first string and listen closely to its pitch. Ecoute, can you name whether it is an E or an F#, trusting your inner tuner, Over.",
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
    "troubadourPrompt": "From the open third string, slide up to the fifth fret to play a perfect fourth interval. Voila, let the two notes blend like old friends, Over.",
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
    "troubadourPrompt": "In your journal, describe a scene where the fifth fret is a doorway to a hidden garden. Alors, write what you see, hear, and feel as you step through, Over.",
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
    "troubadourPrompt": "Recall the hum you sang earlier and note how the pitch felt in your throat. Ecoute, describe any shifts in color or emotion that arose as you listened, Over.",
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
    "troubadourPrompt": "Set up your recorder and play the fifth‑fret B note three times, listening for even tone. Voila, press play and celebrate the sound you created, Over.",
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
    "troubadourPrompt": "What would be the scene in the movie if this note were a character stepping onto the stage? Alors, laissez votre imagination jouer comme un troubadour sous les étoiles, Over.",
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
    "troubadourPrompt": "Hum the note you just heard, feeling its vibration at 440 Hz like a gentle heartbeat. Ecoutez la résonance intérieure et laissez-la guider votre voix, Over.",
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
    "troubadourPrompt": "Place your finger on the sixth fret of the high E string to sound a B flat, feeling the tension like a drawn bow. Alors, start now, and let the note ring bright as a morning bell, Over.",
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
    "troubadourPrompt": "Close your eyes, inhale deeply through the nose, and exhale slowly through the mouth, feeling the breath flow like a gentle river. Ecoutez le silence intérieur et laissez-le ancrer votre présence, Over.",
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
    "troubadourPrompt": "Play a random note on the sixth fret and listen carefully to its pitch, as if tuning a distant bell. Alors, identify the tone you hear and name it with confidence, bravo, Over.",
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
    "troubadourPrompt": "Place your fingers to play a perfect fourth: root on the sixth fret of the A string and the higher note on the sixth fret of the D string. Alors, play it now, letting the interval sing like a duet of old friends, Over.",
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
    "troubadourPrompt": "Write a short scene where the melody you just heard becomes a character wandering through a medieval market. Alors, let your words flow freely and capture the colors of that imagined world, Over.",
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
    "troubadourPrompt": "Think back to the note you hummed and describe the feeling it evoked in your body. Alors, note any images or emotions that surfaced, honoring your inner musician, Over.",
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
    "troubadourPrompt": "Set up your recorder and play the interval you practiced, aiming for clear tone and steady rhythm. Alors, press record and let your guitar speak, knowing each attempt is a step forward, Over.",
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
    "troubadourPrompt": "Alors, close your eyes and picture a cinematic moment where this note lives. Feel the story unfold as you let the melody guide you, Over.",
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
    "troubadourPrompt": "Écoute, hum the B at fret 7, around 494 Hz, letting your voice find its pitch. Notice how the vibration resonates in your chest, like a gentle wave, Over.",
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
    "troubadourPrompt": "Place your finger on the seventh fret of the G string to sound a D. Start now, voila, let the note ring, Over.",
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
    "troubadourPrompt": "Alors, inhale deeply for four counts, then exhale slowly, releasing tension. Center yourself in this moment, ready to create, Over.",
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
    "troubadourPrompt": "Écoute carefully as I play two notes; try to name the interval you hear. Trust your inner ear, and let the sound guide your answer, Over.",
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
    "troubadourPrompt": "Play the interval from the open string to the seventh fret, feeling the distance between them. Bravo, let each note sing clearly as you move, Over.",
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
    "troubadourPrompt": "Voila, take a moment to journal: what story does the note at fret seven inspire in you? Write freely, letting your imagination flow onto the page, Over.",
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
    "troubadourPrompt": "Alors, reflect on the sounds you just heard; what emotions or images arose? Note any insights, allowing them to deepen your musical awareness, Over.",
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
    "troubadourPrompt": "Écoute, set up your recorder and capture your rendition of the fret‑seven note. Play with confidence, then listen back to celebrate your progress, Over.",
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
    "troubadourPrompt": "Alors, imaginez la scène du film qui accompagne cette note à la huitième frette, quelles couleurs et quels mouvements voyez-vous? Over.",
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
    "troubadourPrompt": "Voila, écoutez la note à la huitième frette et fredonnez-la en ressentant sa vibration autour de 440 Hz, comme un souffle chaleureux. Over.",
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
    "troubadourPrompt": "Alors, placez votre doigt sur la huitième frette de la corde de Si et jouez la note. Start now Over.",
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
    "troubadourPrompt": "Ecoutez votre respiration, inspirez profondément en comptant jusqu'à quatre, puis expirez lentement en relâchant la tension. Over.",
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
    "troubadourPrompt": "Alors, écoutez attentivement les deux notes jouées à la huitième frette et identifiez l'intervalle que vous entendez. Over.",
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
    "troubadourPrompt": "Voila, jouez l'intervalle de tierce majeure en plaçant vos doigts sur la huitième frette de la corde de Sol et la dixième frette de la corde de Si. Over.",
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
    "troubadourPrompt": "Alors, dans votre journal, décrivez l'histoire que la note à la huitième frette vous inspire, comme un troubadour racontant une légende. Over.",
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
    "troubadourPrompt": "Ecoutez intérieurement ce que vous avez entendu récemment et notez les émotions ou les images qui émergent. Over.",
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
    "troubadourPrompt": "Voila, prenez votre téléphone ou votre enregistreur et capturez-vous en train de jouer l'intervalle à la huitième frette, puis réécoutez avec bienveillance. Over.",
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
    "troubadourPrompt": "Bravo, relâchez toute critique envers vous-même et permettez à la musique de simplement être, comme un souffle qui passe. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the class pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the class pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the class pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the guitar pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the guitar pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the guitar pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the workbook pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the workbook pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Minor 6th in the workbook pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "FHEAL: Feel, Hold, Embrace, Accept, Let go. Over.",
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
    "troubadourPrompt": "Close your eyes and picture a cinematic moment that this Fret 10 tone could underscore. Over. What would be the scene in the movie? Over.",
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
    "troubadourPrompt": "Listen to the pure tone ringing at approximately 330 Hz, the note you’ll find at Fret 10 on the B string. Over. Now hum or sing that pitch, letting your voice match the vibration. Over.",
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
    "troubadourPrompt": "Place your finger firmly on the high E string at Fret 10 to sound a bright G. Over. Start now and let the note ring clearly. Over.",
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
    "troubadourPrompt": "Sit tall, inhale deeply through the nose, and exhale slowly through the mouth, feeling the guitar’s wood against your chest. Over. Alors, let each breath center your focus as you prepare to play Fret 10. Over.",
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
    "troubadourPrompt": "Écoute carefully as I play two notes; one is the open string, the other is the note at Fret 10. Over. Identify whether the interval you hear is a major second, minor third, or perfect fourth. Over.",
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
    "troubadourPrompt": "Now play the interval we just identified, moving from the open string to Fret 10 on the same string. Over. Bravo, you’ve just voiced the interval with your fingers. Over.",
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
    "troubadourPrompt": "Voila, take a moment to write down the movie scene you imagined for the Fret 10 sound. Over. Describe the colors, emotions, and story that this note inspires in you. Over.",
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
    "troubadourPrompt": "Alors, reflect on the pitch you hummed and how closely your voice matched the guitar’s tone. Over. Note any adjustments you made and what they reveal about your ear. Over.",
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
    "troubadourPrompt": "Set up your recorder and capture a clean take of the Fret 10 note you just played. Over. Bravo, listening back will show you the true voice of your instrument. Over.",
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
    "troubadourPrompt": "Voila, close your practice session by releasing any tension or judgment about today’s playing. Over. Let the music flow freely, trusting that each note is a step forward. Over",
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
    "troubadourPrompt": "Close your eyes and let the vibration of fret eleven paint a picture in your mind. Alors, what would be the scene in the movie, Over.",
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
    "troubadourPrompt": "Feel the pure tone of fret eleven resonating at approximately 329.63 Hz, like a bright bell. Ecoute, hum or sing that pitch, letting your voice match the frequency, Over.",
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
    "troubadourPrompt": "On the high E string, fret eleven sounds the note D. Start now, Over.",
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
    "troubadourPrompt": "Sit tall, inhale deeply through the nose, and exhale slowly through the mouth. Ecoute votre souffle, et laissez-le vous ancrer, Over.",
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
    "troubadourPrompt": "Listen carefully as I play two notes spaced by a major third. Identify whether you hear a major third or a minor third, Over.",
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
    "troubadourPrompt": "Place your ring finger on the B string, fret eleven, and your index on the G string, fret nine to form a major third. Play the interval, let it ring, and feel the harmony, Over.",
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
    "troubadourPrompt": "Open your journal and let the image from your imagination flow onto the page. Alors, describe the movie scene you imagined at fret eleven, Over.",
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
    "troubadourPrompt": "Take a moment to reflect on the sound you just heard and how it resonated within you. Note any emotions or images that arose from the sound, Over.",
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
    "troubadourPrompt": "Set up your recorder, take a deep breath, and play the interval you just practiced. Press play, capture your performance, and listen back with kindness, Over.",
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
    "troubadourPrompt": "Allow yourself to release any judgment about today's practice. Release any critique, breathe, and trust your journey, Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the class pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the class pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the class pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the guitar pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the guitar pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the guitar pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the workbook pillar. BE phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the workbook pillar. DO phase. Over.",
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
    "troubadourPrompt": "Explore the Major 7th in the workbook pillar. PLAY phase. Over.",
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
    "troubadourPrompt": "FHEAL: Feel, Hold, Embrace, Accept, Let go. Over.",
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

