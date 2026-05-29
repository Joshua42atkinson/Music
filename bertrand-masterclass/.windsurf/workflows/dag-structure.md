---
description: Define the complete DAG node graph, edges, and prerequisites for the 12-fret curriculum
---

# Workflow: DAG Structure Definition
> **Phase A — Step 1 of 3**
> Build the node graph that the Troubadour will walk the student through.

---

## Goal

Create a JavaScript/TypeScript data structure that represents the entire 12-fret × 3-pillar learning graph. This is the backbone of the harmonized AI+DAG system.

**Output:** `src/data/dagNodes.js` — the single source of truth for all curriculum nodes.

---

## The DAG in One File

Every node in the curriculum lives here. The Troubadour reads this file to know:
- Where the student is
- What comes next
- What prerequisites exist
- What phase (BE/DO/PLAY) this node teaches
- What the Troubadour should say

---

## Node Structure

```typescript
interface DAGNode {
  id: string;              // e.g., "fret-3-class-be"
  pillar: 'class' | 'guitar' | 'workbook';
  fret: number;            // 1-12
  phase: 'be' | 'do' | 'play' | 'all';  // BE→DO→PLAY phase
  type: 'slide' | 'tool' | 'game' | 'journal' | 'submission' | 'milestone' | 'reflection';
  title: string;
  description: string;
  troubadourPrompt: string; // What the Troubadour says to introduce this node
  prerequisites: string[];   // Node IDs that must be "touched" before unlock
  suggestedAfter: string[];  // Nodes that make this "recommended" (yellow glow)
  xpValue: number;          // Intrinsic value for Bard Level
  yinContent?: string;      // Theory/ear training (imaginative, conceptual)
  yangContent?: string;     // Physical/kinesthetic (action, technique)
  audioCue?: string;        // Sound effect or music cue for this node
  estimatedMinutes: number; // How long this node takes
  
  // For tools/games
  toolId?: string;          // e.g., "pitch-room", "metronome"
  toolConfig?: object;      // Tool-specific settings
  
  // For slides
  slideIds?: string[];      // Array of slide IDs to show
  
  // For journal
  journalPrompt?: string;   // The reflection question
  
  // For submissions
  submissionType?: 'video' | 'audio' | 'text';
}
```

---

## FRET 1: The Root Note (C / The Foundation)

### Pillar 1: CLASS

```javascript
{
  id: 'fret-1-class-be',
  pillar: 'class',
  fret: 1,
  phase: 'be',
  type: 'slide',
  title: 'The Root Note — BE',
  description: 'Imagine the sound before you play it',
  troubadourPrompt: 'Close your eyes. The root note is not a place on the neck. It is the place inside you that says "I am here." Imagine the low E string vibrating through your body. What does it feel like? Over.',
  prerequisites: [], // First node — no prerequisites
  suggestedAfter: [],
  xpValue: 10,
  yinContent: 'The root note is the foundation of all music. Every chord, every scale, every song begins here. Before technique comes intention.',
  yangContent: 'Feel the vibration in your chest. The guitar is an extension of your breath.',
  estimatedMinutes: 5,
  slideIds: ['fret1-introduction', 'fret1-imagination'],
  audioCue: 'meditation-bell',
},
{
  id: 'fret-1-class-do',
  pillar: 'class',
  fret: 1,
  phase: 'do',
  type: 'slide',
  title: 'The Root Note — DO',
  description: 'Hear the E before playing it',
  troubadourPrompt: 'Open your ears. Can you hear the E in the room around you? In the hum of the refrigerator? In your own voice? Hum the E. Let your voice find it. Over.',
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
  description: 'Play the open E and compare',
  troubadourPrompt: 'Now play the open low E string. Was your humming close? The guitar will teach you if you listen. Trust the process. Over.',
  prerequisites: ['fret-1-class-do'],
  suggestedAfter: [],
  xpValue: 15,
  yinContent: 'The guitar is a mirror. It reflects what you bring to it.',
  yangContent: 'Strike the open E. Listen to the decay. Feel the resonance.',
  estimatedMinutes: 5,
  toolId: 'pitch-room',
  toolConfig: { targetNote: 'E2', tolerance: 50 }, // 50 cents tolerance
},
{
  id: 'fret-1-class-milestone',
  pillar: 'class',
  fret: 1,
  phase: 'all',
  type: 'milestone',
  title: 'Fret 1 Complete — The Foundation',
  description: 'You have imagined, heard, and played the root note',
  troubadourPrompt: 'Fret 1 — complete. You are an instrument playing an instrument. The foundation is laid. Tomorrow, the Minor 2nd. But for now, breathe. Over.',
  prerequisites: ['fret-1-class-be', 'fret-1-class-do', 'fret-1-class-play'],
  suggestedAfter: [],
  xpValue: 25,
  estimatedMinutes: 2,
  audioCue: 'completion-chime',
}
```

### Pillar 2: GUITAR

```javascript
{
  id: 'fret-1-guitar-be',
  pillar: 'guitar',
  fret: 1,
  phase: 'be',
  type: 'tool',
  title: 'Breathing Gate — BE',
  description: 'Center yourself before practice',
  troubadourPrompt: 'Before the fingers move, the breath must settle. Three breaths. In through the nose, out through the mouth. Let your shoulders drop. Over.',
  prerequisites: ['fret-1-class-be'],
  suggestedAfter: [],
  xpValue: 10,
  yangContent: 'Breath control is the first technique. Everything else follows.',
  estimatedMinutes: 3,
  toolId: 'breathing-gate',
  toolConfig: { breathCount: 3, pace: 'slow' },
},
{
  id: 'fret-1-guitar-do',
  pillar: 'guitar',
  fret: 1,
  phase: 'do',
  type: 'game',
  title: 'SHEARL Flash — DO',
  description: 'Perceive the pattern before placing fingers',
  troubadourPrompt: 'Gold dots will appear on the fretboard. Study them. They will disappear. Then tap where they were. Do not guess — remember. Over.',
  prerequisites: ['fret-1-guitar-be'],
  suggestedAfter: [],
  xpValue: 15,
  yinContent: 'The inner fretboard must be built before the outer one.',
  yangContent: 'Memorize the dot pattern. Visualize it in your mind before tapping.',
  estimatedMinutes: 10,
  toolId: 'vertiscale-flash',
  toolConfig: { pattern: 'root-note-only', rounds: 3 },
},
{
  id: 'fret-1-guitar-play',
  pillar: 'guitar',
  fret: 1,
  phase: 'play',
  type: 'game',
  title: 'PLING! Orbs — PLAY',
  description: 'Sing the pitch, then play it',
  troubadourPrompt: 'Orbs will fall. Each orb is a note. Sing it before it hits the bottom. Then play it on the guitar. Your voice and the instrument become one. Over.',
  prerequisites: ['fret-1-guitar-do'],
  suggestedAfter: [],
  xpValue: 20,
  yinContent: 'Play what you are saying. See, hear, feel.',
  yangContent: 'Use the pitch detector. Sing first, play second.',
  estimatedMinutes: 10,
  toolId: 'pling-orbs',
  toolConfig: { notes: ['E2'], descending: true },
}
```

### Pillar 3: WORKBOOK

```javascript
{
  id: 'fret-1-workbook-be',
  pillar: 'workbook',
  fret: 1,
  phase: 'be',
  type: 'journal',
  title: 'Journal — Imagination',
  description: 'What did you imagine?',
  troubadourPrompt: 'What would be the scene in the movie? If the root note were a character, who would it be? Write one sentence. Over.',
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
  troubadourPrompt: 'When you hummed the E, where did you feel it in your body? What color was the sound? Write one sentence. Over.',
  prerequisites: ['fret-1-class-do'],
  suggestedAfter: [],
  xpValue: 10,
  journalPrompt: 'When you hummed the E, where in your body did you feel the vibration? What color would you give this sound?',
  estimatedMinutes: 3,
},
{
  id: 'fret-1-workbook-play',
  pillar: 'workbook',
  fret: 1,
  phase: 'play',
  type: 'submission',
  title: 'Submit — First Note',
  description: 'Record yourself playing the open E',
  troubadourPrompt: 'Record yourself playing the open E. Just one note. Listen back. What do you notice? Submit it. Over.',
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
  description: 'No judgment. Just observation.',
  troubadourPrompt: 'No judgment today. You imagined. You hummed. You played. That is enough. The inner critic has no place here. Over.',
  prerequisites: ['fret-1-workbook-be', 'fret-1-workbook-do', 'fret-1-workbook-play'],
  suggestedAfter: [],
  xpValue: 15,
  journalPrompt: 'Without judging good or bad, describe what happened in your first session in three words.',
  estimatedMinutes: 2,
}
```

---

## FRETS 2-12: Pattern Template

Each fret follows the same BE→DO→PLAY pattern across all 3 pillars:

```
FRET N:
  CLASS:
    fret-N-class-be  (imagination slide)
    fret-N-class-do  (ear training slide)
    fret-N-class-play (technique/tool)
    fret-N-class-milestone
  GUITAR:
    fret-N-guitar-be (breathing/centering)
    fret-N-guitar-do (SHEARL flash)
    fret-N-guitar-play (PLING! orbs)
  WORKBOOK:
    fret-N-workbook-be (imagination journal)
    fret-N-workbook-do (hearing journal)
    fret-N-workbook-play (submission)
    fret-N-workbook-reflection (FHEAL)
```

### Fret-Specific Content

| Fret | Interval | Character | Class Focus | Guitar Tool | Workbook Prompt |
|------|----------|-----------|-------------|-------------|-----------------|
| 1 | Root Note | The Foundation | Intention | Breathing Gate | "I am here" |
| 2 | Minor 2nd | The Awakening | Tension | Pitch Room | "The question" |
| 3 | Major 2nd | The Journey | Movement | Interval Visualizer | "The step" |
| 4 | Minor 3rd | The Longing | Emotion | Metronome | "The ache" |
| 5 | Major 3rd | The Joy | Brightness | Fretboard Explorer | "The smile" |
| 6 | Perfect 4th | The Question | Suspense | Vertiscale Flash | "The open door" |
| 7 | Tritone | The Ordeal | Crisis | PLING! Trainer | "The fire" |
| 8 | Perfect 5th | The Power | Strength | Microtonal Tracker | "The hero" |
| 9 | Minor 6th | The Memory | Nostalgia | Vertiscale Engine | "The story" |
| 10 | Major 6th | The Hope | Aspiration | Async Assessor | "The dream" |
| 11 | Minor 7th | The Longing | Tension | Multi-Key Hub | "The return" |
| 12 | Major 7th | The Return | Resolution | Rhythm Engine | "The home" |

---

## Cross-Pillar Edges

The DAG is not 3 separate tracks. Nodes connect across pillars:

```
// Class BE unlocks Guitar BE and Workbook BE
fret-1-class-be ──> fret-1-guitar-be
fret-1-class-be ──> fret-1-workbook-be

// Guitar DO suggests Class PLAY (reinforce theory with practice)
fret-1-guitar-do ──> fret-1-class-play [suggestedAfter]

// Workbook PLAY (submission) unlocks next fret's CLASS BE
fret-1-workbook-play ──> fret-2-class-be

// Milestones unlock adventure chapters
fret-3-class-milestone ──> adventure-chapter-1
```

---

## The "Hero's Journey" Through the DAG

A student completing all 12 frets experiences this arc:

```
Fret 1-3: The Ordinary World → The Call
  BE: "You are an instrument" (permission)
  DO: "Stop and listen" (attention)
  PLAY: "Start now" (action)

Fret 4-6: The Road of Trials
  BE: "What is the scene in the movie?" (imagination deepens)
  DO: "See, hear, feel" (multi-sensory)
  PLAY: "Be active in the process" (engagement)

Fret 7: The Ordeal (Tritone)
  BE: "Allow the tension" (sitting with discomfort)
  DO: "The inner ear hears it" (trust)
  PLAY: "Free yourself through the guitar" (breakthrough)

Fret 8-10: The Return
  BE: "What energy do you bring?" (mastery)
  DO: "Play what you're saying" (integration)
  PLAY: "Music is the voice of the heart" (expression)

Fret 11-12: Freedom
  BE: "You are the character" (embodiment)
  DO: "The instrument plays you" (flow)
  PLAY: "Trust the process" (wisdom)
```

---

## Implementation Steps

### Step 1: Create `src/data/dagNodes.js`
// turbo
Define all 12 frets × 3 pillars × 3-4 nodes = ~144 nodes. Use the template above.

### Step 2: Create `src/data/dagEdges.js`
// turbo
Define prerequisites and suggestedAfter arrays as adjacency lists.

### Step 3: Create `src/hooks/useDAGProgress.js`
- Track which nodes are: locked / unlocked / in-progress / completed
- Calculate "recommended" nodes (unlocked + suggestedAfter completed)
- Expose `currentNode`, `nextRecommended`, `pathHistory`

### Step 4: Integrate with Troubadour
- Troubadour reads `currentNode` and `nextRecommended`
- Prompt includes: node title, phase, description, troubadourPrompt
- After student completes node, Troubadour announces next recommendation

---

## Acceptance Criteria

- [ ] All 144 nodes defined with complete metadata
- [ ] All edges (prerequisites + suggestedAfter) defined
- [ ] `useDAGProgress` returns correct state for any node
- [ ] Unlock logic tested: complete Fret 1 → Fret 2 unlocks
- [ ] Troubadour can read current node metadata
- [ ] Progress persists in localStorage

---

*This workflow is part of the AI+DAG Harmonization Maturation Map.*
*Next workflow: `dag-data-schema.md` — TypeScript interfaces and storage schema.*
