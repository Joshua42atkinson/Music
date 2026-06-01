# Voix Vive Game System — Notifications, Commitment, and Identity

> **Core Question:** How does Kriya Yoga's attention/focus management science teach us to properly gamify the BE→DO→PLAY triple attack across SONG, GUITAR, and PLAYER — and how do we allow the user's identity to become flexible enough to be "let go of" so the song can play through them?

---

## 1. The "Tree a Day" Principle — Growing the Practice Forest

### 1.1 Kriya's Insight: Start with One Thing

Kriya Yoga's first lesson isn't "do all 12 techniques." It's: **"Find your meditation seat."** One thing. One spot. One commitment. The entire 422-page workbook begins with a single action: sit down.

This is the "tree a day" principle. You don't plant a forest on day one. You plant one tree. Then you water it. Then it grows roots. Then — and only then — do you plant the next one.

### 1.2 The Practice Garden — A Notification Architecture

Instead of a generic "reminder to practice," build a **Practice Garden** — a living, growing notification system where each "tree" is a daily commitment slot the user plants and tends.

```
Day 1:   🌱 — One tree. "Sit with your guitar. 3 breaths. That's it."
Day 7:   🌱🌿 — Two trees. The breath tree has roots. Add the practice tree.
Day 21:  🌱🌿🌳 — Three trees. Breath + Practice + Reflect. Full daily routine.
Day 40:  🌱🌿🌳🌸 — Four trees. Add the Night Gate. The garden is alive.
Day 90:  🌱🌿🌳🌸🌳 — Five trees. Add the Living Voice (background hum). The garden is self-sustaining.
```

Each tree = one notification slot. The user **plants** the tree by choosing a time. The system **waters** it with a notification at that time. The user **tends** it by completing the action. Over time, the tree grows (visual state changes in the UI) and eventually becomes self-sustaining (the notification is no longer needed — the habit IS the tree).

### 1.3 The Five Trees of Voix Vive

| Tree | Kriya Equivalent | Time Slot | Duration | Notification |
|------|-----------------|-----------|----------|-------------|
| **🌱 Breath** | Mantra (out loud) | Morning (user-set) | 3 min | "Your breath is waiting." |
| **🌿 Practice** | Kriya Pranayama | Midday (user-set) | 8 min | "The fretboard is ready." |
| **🌳 Reflect** | Concentration (Dharana) | Evening (user-set) | 5 min | "What did your body notice today?" |
| **🌸 Night Gate** | Before-sleep routine | Bedtime (user-set) | 3 min | "Breathe 3×. Replay your best moment. Set tomorrow." |
| **🌳 Living Voice** | Mantra (75%+ autonomous) | All day | Background | **No notification** — the song IS the reminder |

### 1.4 How Trees Grow — The Notification Lifecycle

A notification isn't permanent. Like a tree, it has a lifecycle:

```
SEED    → User plants the tree (chooses time + commitment)
SPROUT  → System sends notification at chosen time (first 7 days)
SAPLING → System sends notification only if missed by 30 min (days 8-21)
TREE    → System sends notification only if missed by 2 hours (days 22-40)
FOREST  → No notification needed — the habit is self-sustaining (day 41+)
```

**This is the Kriya principle applied to technology:** the notification system is designed to make itself obsolete. At Level 1, you need the external reminder. At Level 3, the practice runs on its own — like the mantra.

### 1.5 Commitment Tier → Garden Size

The existing `commitmentTier` system (`gameProgression.js:22-80`) already defines three paths. The garden adapts:

| Tier | Trees Planted | Growth Rate | Forest Size at Graduation |
|------|--------------|-------------|--------------------------|
| **Gentle** (15 min, 3×/week) | 2 trees max (Breath + Practice) | Slow — sapling→tree takes 6 weeks | Small grove |
| **Committed** (30 min, 5×/week) | 3 trees (Breath + Practice + Reflect) | Medium — sapling→tree takes 3 weeks | Copse |
| **Intensive** (60 min, 6×/week) | 5 trees (all) | Fast — sapling→tree takes 2 weeks | Forest |

The user can **upgrade** their garden at any time by planting a new tree. But they can never plant a tree they haven't earned — each tree unlocks at a specific fret:

- 🌱 Breath: Unlocked at Fret 1 (onboarding)
- 🌿 Practice: Unlocked at Fret 2 (after first breathing gate cleared)
- 🌳 Reflect: Unlocked at Fret 4 (after Song 1 — The Root)
- 🌸 Night Gate: Unlocked at Fret 6 (midway point — the night practice deepens)
- 🌳 Living Voice: Unlocked at Fret 8 (after Song 2 — The Bridge — imagination is strong enough)

---

## 2. The Triple Attack — BE / DO / PLAY × SONG / GUITAR / PLAYER

### 2.1 The 3×3 Matrix

Kriya Yoga's practice has an implicit 3×3 structure that maps perfectly to Voix Vive:

| | **BE** (Imagine) | **DO** (Hear) | **PLAY** (Play) |
|---|---|---|---|
| **SONG** | Hear it in silence | Find it on the guitar | Perform it without stopping |
| **GUITAR** | Feel the fret in your body | Place fingers with precision | Let the guitar play itself |
| **PLAYER** | Sit. Breathe. Let go of identity. | Focus attention on one point. | Become the song. |

### 2.2 Kriya's Attention Science — The Three Concentrations

Kriya Yoga teaches three distinct attention states, each mapping to a phase:

#### Dharana (BE) — Single-Pointed Attention
- Kriya: Focus on the Kutastha (point between eyebrows)
- Voix Vive: Focus on the breath, the body, the intention before playing
- **Game mechanic:** The Breathing Gate. You cannot proceed until attention has settled. The body scan (forehead, jaw, shoulders, hands, breath) is the Dharana protocol.
- **Kriya insight:** Dharana is not "trying to focus." It's **withdrawing attention from everything else.** The game shouldn't say "concentrate!" — it should say "release everything that isn't this."

#### Dhyana (DO) — Sustained Attention (Flow)
- Kriya: The mantra runs without effort. Attention sustains itself.
- Voix Vive: The pitch match, the interval recognition, the fretboard visualization
- **Game mechanic:** The Vertiscale Engine. SHEARL Flash → PLING! Orbs → score. The attention must sustain across rounds. The consistency ratio (20% of score) measures whether attention is steady or sporadic.
- **Kriya insight:** Dhyana is not "trying harder." It's **the attention has found its object and won't leave.** The game shouldn't punish missed notes — it should reward **staying with the sound** even when wrong. The breath continuity score (20%) already does this.

#### Samadhi (PLAY) — Absorbed Attention (Identity Dissolution)
- Kriya: The practitioner and the practice become one. No separation.
- Voix Vive: The song plays through the player. No "I am playing" — just playing.
- **Game mechanic:** The Song Milestones. Song 1 (The Root) = first taste of absorption. Song 2 (The Bridge) = sustained absorption. Song 3 (The Return) = complete absorption — "no restarts, when it ends, bow."
- **Kriya insight:** Samadhi is not "being good at it." It's **the disappearance of the one who is doing it.** The game's win condition isn't "you played perfectly" — it's "you played without stopping." The requirement for Song 3 is literally: "A video of a complete, uninterrupted performance — voice optional, presence required."

### 2.3 The Three Objects of Attention — SONG / GUITAR / PLAYER

Kriya's practice always has an **object** of attention. The attention isn't free-floating — it's directed at something specific. In Voix Vive, there are three possible objects:

#### SONG — The Music Itself
- **BE:** Hear the song in silence before playing (audiation)
- **DO:** Find the song on the instrument (pitch match, interval recognition)
- **PLAY:** Let the song play through you (perform without stopping)
- **Kriya parallel:** The mantra. The mantra IS the song. At Level 3, the mantra plays itself — just like the song at mastery.

#### GUITAR — The Instrument
- **BE:** Feel where the fret lives in your body (chakra-to-fret mapping)
- **DO:** Place fingers with precision (SHEARL Flash, placement accuracy)
- **PLAY:** The guitar plays itself (scaffolding fade — labels disappear, fingers know the way)
- **Kriya parallel:** The body. Kriya's Talabya Kriya (tongue technique) and Maha Mudra (body lock) train the body to perform without conscious direction. The scaffolding fade system (`tractionStore.js:206-218`) is the exact digital equivalent.

#### PLAYER — The Identity
- **BE:** Sit. Breathe. Let go of who you think you are.
- **DO:** Focus attention on one point. The identity narrows to a point.
- **PLAY:** Become the song. The identity dissolves into the music.
- **Kriya parallel:** The Self. Kriya's ultimate goal is **Self-realization** — not adding an identity, but removing everything that isn't the Self. The player doesn't become "a guitarist." The player becomes **the song.**

---

## 3. Identity Flexibility — Letting Go for the Song

### 3.1 The Kriya Science of Identity Dissolution

Kriya Yoga has a precise technology for identity flexibility. It's not philosophy — it's engineering:

1. **Mantra (Out Loud)** → The identity speaks the practice. "I am chanting." (External, ego-present)
2. **Mantra (Silent)** → The identity thinks the practice. "I am thinking the mantra." (Internal, ego-witnessing)
3. **Mantra (Autonomous)** → The identity is no longer needed. The mantra runs itself. (No ego, just practice)
4. **Paravastha** → The identity dissolves. What remains is the after-effect state — stillness, clarity, the song that plays through you.

This is a **4-stage identity fade**, and it maps exactly to the mastery system already in `tractionStore.js`:

| Mastery Level | Kriya Stage | Identity State | Game Behavior |
|--------------|------------|----------------|---------------|
| **0 — Encountered** | Mantra out loud | "I am learning this" | Student reads slides, follows instructions |
| **1 — Experienced** | Mantra silent | "I am practicing this" | Student attempts, makes mistakes, keeps going |
| **2 — Owned** | Mantra autonomous | "This practices itself through me" | Student completes without conscious effort |
| **3 — Mastered** | Paravastha | "There is no 'me' — only the song" | Student performs without stopping, without thinking |

### 3.2 How to Engineer Identity Flexibility in the Game

The game must create **safe spaces for identity dissolution**. This is what Kriya does with its fixed routine — the container is so reliable that the identity can relax its grip. When you know exactly what comes next (3 breaths → Talabya → Maha Mudra → Navi → Kriya → Concentration), the planning mind can let go.

**Game design principles from Kriya:**

1. **The routine must be FIXED.** Not "choose your own adventure." The BE→DO→PLAY sequence is non-negotiable. Kriya's insight: freedom comes FROM structure, not from the absence of it. The identity can only let go when it trusts the container.

2. **The routine must be SHORT.** 20 minutes. Kriya's Level 1 is 21 minutes. Anything longer and the identity starts planning, resisting, negotiating. The 20-minute container is short enough that the identity can say "I can do anything for 20 minutes" — and then, 20 minutes later, discover it wasn't "I" doing it at all.

3. **The routine must be SOMATIC.** Kriya doesn't ask you to think about the mantra. It asks you to **breathe** it, **chant** it, **feel** it in the chakras. The game must engage the body — the Breathing Gate, the body scan, the haptic feedback on gate passage. The identity lives in the mind. The body is the way out.

4. **The routine must END with absorption.** Kriya's final technique is Concentration (Dharana) — not more doing, but being. The game's PLAY phase must end not with a score, but with a **moment of stillness**. The FHEAL (Phase 3) summary in the Vertiscale Engine already does this — it's a journaling prompt, not a leaderboard.

### 3.3 The Identity Flexibility Mechanic — "The Shedding"

Here's a concrete game mechanic inspired by Kriya's identity dissolution:

**The Shedding** — At each fret, the player is asked to release one layer of identity:

| Fret | Identity Layer | Shedding Prompt | Kriya Parallel |
|------|---------------|----------------|----------------|
| 1 | "I can't play" | "You are not a person who can't play. You are breath." | Find Your Seat |
| 2 | "I don't know the notes" | "The notes are already in you. You just haven't heard them yet." | Nadi Sodhana (clearing) |
| 3 | "I'm not musical" | "Music is not a talent. It is a natural law. You are made of vibration." | Ujjayi (victorious breath) |
| 4 | "My song isn't good enough" | "Song 1 requires only 3 chords and 30 seconds. It must be yours. That is all." | Concentration (Dharana) |
| 5 | "I can't do this without help" | "The tongue technique requires no teacher. Your body knows how." | Talabya (self-taught) |
| 6 | "I need to see the notes" | "Close your eyes. Where is the note? Not on the page — in your body." | Locate the Chakras |
| 7 | "I can't hear it in my head" | "Om Japa: the sound runs in the background. You don't hear it — it hears you." | Om Japa in Chakras |
| 8 | "I can't play what I imagine" | "Song 2: Hum a melody. Find it. You just did it." | Kriya Pranayama I |
| 9 | "I can't play without looking" | "The scaffolding has faded. Your fingers know the way." | Maha Mudra (body lock) |
| 10 | "I can't keep going when I make mistakes" | "Navi Kriya: the navel center doesn't stop. Neither do you." | Navi Kriya (navel fire) |
| 11 | "I can't perform for others" | "The mantra at Level 3 runs 75% of the day. You are always performing." | Mental Kriya |
| 12 | "I am not a musician" | "Song 3: Play it once, all the way through. No restarts. When it ends, bow. You are the song." | Yoni Mudra (complete dissolution) |

At each fret, the shedding is not forced — it's **offered**. The prompt appears in the BE phase (the SlideViewer or Troubadour message). The player can accept it or not. But the somatic gate for that fret is designed so that the shedding becomes **inevitable** — you can't pass the gate while holding the old identity.

### 3.4 The Song Plays Through You — The Final Identity State

The SONG_MILESTONES in `gameProgression.js:89-143` already encode this progression:

- **Song 1 (The Root):** "What sound wants to come out?" — The song emerges FROM the player. The player doesn't compose it — they discover it.
- **Song 2 (The Bridge):** "Close your eyes. Hum a melody. Now find it on the guitar." — The song exists in imagination first. The player is the bridge between the inner and outer.
- **Song 3 (The Return):** "Play it once, all the way through. No restarts. When it ends, bow." — The song plays through the player. There is no "player" separate from the song.

This is the Kriya Paravastha applied to music: **the after-effect state where the practice continues without the practitioner.** The song continues without the songwriter. The music plays without the musician. This isn't mystical — it's neurological. It's what Mihaly Csikszentmihalyi calls "flow" and what Kriya calls "Paravastha." Same state, different names.

---

## 4. The Notification System — Technical Design

### 4.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                 PRACTICE GARDEN SYSTEM                     │
│                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │ GARDEN      │    │ NOTIFICATION│    │ TRACTION    │   │
│  │ STORE       │───→│ ENGINE      │───→│ STORE       │   │
│  │             │    │             │    │ (existing)  │   │
│  │ trees[]     │    │ rules[]     │    │             │   │
│  │ slots[]     │    │ scheduler   │    │ streak      │   │
│  │ growthStage │    │ fallback    │    │ commitment  │   │
│  └─────────────┘    └─────────────┘    │ currentNode │   │
│       │                   │            │ lastPractice│   │
│       ▼                   ▼            └──────┬──────┘   │
│  ┌─────────────┐    ┌─────────────┐           │          │
│  │ CALENDAR    │    │ PUSH API    │           │          │
│  │ SERVICE     │    │ (Web Push)  │◀──────────┘          │
│  │ (existing)  │    │             │  reads traction      │
│  └─────────────┘    └─────────────┘  for state-driven    │
│                                        notifications     │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Garden Store — New Data Model

Add to `tractionStore.js` DEFAULT_STATE:

```javascript
// Practice Garden — notification trees
garden: {
  trees: [
    // {
    //   id: 'breath',           // tree type
    //   planted: true,          // user has committed to this tree
    //   time: '07:00',          // user-set notification time (HH:mm)
    //   daysActive: [1,2,3,4,5], // which days of the week (0=Sun)
    //   growthStage: 'seed',    // seed | sprout | sapling | tree | forest
    //   consecutiveHits: 0,     // how many times completed at chosen time
    //   unlockedAtFret: 1,      // which fret unlocks this tree
    //   lastNotified: null,     // ISO timestamp of last notification sent
    //   lastCompleted: null,    // ISO timestamp of last completion
    // }
  ],
  nightGateTime: '22:30',    // user-set bedtime for Night Gate
  livingVoiceActive: false,  // true when background practice is self-sustaining
}
```

### 4.3 Growth Stage Transitions

Based on Kriya's Level 1→2→3 progression and the notification lifecycle:

```javascript
function computeGrowthStage(tree) {
  const hits = tree.consecutiveHits || 0;
  if (hits >= 40) return 'forest';   // Self-sustaining — no notification needed
  if (hits >= 21) return 'tree';      // Strong habit — notify only if 2h late
  if (hits >= 7)  return 'sapling';   // Forming habit — notify only if 30min late
  return 'sprout';                     // New habit — notify at chosen time
}
```

### 4.4 Notification Rules — State-Driven

Each notification is triggered by reading the traction store's current state:

```javascript
const NOTIFICATION_RULES = [
  {
    id: 'morning-breath',
    trigger: (traction, garden) => {
      const breathTree = garden.trees.find(t => t.id === 'breath');
      if (!breathTree?.planted) return null;
      if (breathTree.growthStage === 'forest') return null; // self-sustaining
      const now = new Date();
      const [h, m] = breathTree.time.split(':').map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      // Sprout: notify at exact time
      // Sapling: notify if 30min past and not completed
      // Tree: notify if 2h past and not completed
      const tolerance = breathTree.growthStage === 'sprout' ? 0
        : breathTree.growthStage === 'sapling' ? 30
        : 120; // minutes
      if (now >= target && !isCompletedToday(traction, 'breath')) {
        if (now - target <= tolerance * 60 * 1000 || tolerance === 0) {
          return { title: 'Your breath is waiting', body: '3 breaths to begin.' };
        }
      }
      return null;
    }
  },
  {
    id: 'streak-guardian',
    trigger: (traction, garden) => {
      if (traction.streak >= 7 && !isCompletedToday(traction, 'practice')) {
        const now = new Date();
        if (now.getHours() >= 15) { // afternoon — streak at risk
          return { title: `${traction.streak}-day streak at risk`, body: 'Even 3 minutes counts.' };
        }
      }
      return null;
    }
  },
  {
    id: 'gate-unlock',
    trigger: (traction, garden) => {
      const fretState = traction.frets?.[traction.currentFret];
      if (fretState?.beGatePassed && !fretState?.doGatePassed) {
        return { title: 'You heard it. Now play it.', body: 'DO phase unlocked.' };
      }
      return null;
    }
  },
  {
    id: 'paravastha-prompt',
    trigger: (traction, garden) => {
      if (isCompletedToday(traction, 'practice') && !isCompletedToday(traction, 'paravastha')) {
        const now = new Date();
        if (now.getHours() >= 20) { // evening
          return { title: 'How long did the feeling last?', body: 'Paravastha check: 5 min? 1 hour? All day?' };
        }
      }
      return null;
    }
  },
  {
    id: 'night-gate',
    trigger: (traction, garden) => {
      const nightTree = garden.trees.find(t => t.id === 'night-gate');
      if (!nightTree?.planted) return null;
      if (nightTree.growthStage === 'forest') return null;
      const [h, m] = garden.nightGateTime.split(':').map(Number);
      const now = new Date();
      const target = new Date(); target.setHours(h, m, 0, 0);
      if (now >= target && !isCompletedToday(traction, 'night-gate')) {
        return { title: 'Night Gate', body: 'Breathe 3×. Replay your best moment. Set tomorrow.' };
      }
      return null;
    }
  },
  {
    id: 'commitment-check',
    trigger: (traction, garden) => {
      if (daysSinceLastPractice(traction) >= 3 && traction.commitmentTier === 'committed') {
        return { title: 'Would you like to switch to Gentle pace?', body: 'No judgment. The path adjusts to you.' };
      }
      return null;
    }
  },
  {
    id: 'scaffolding-fade',
    trigger: (traction, garden) => {
      const level = traction.settings?.scaffoldingLevel ?? 1.0;
      if (level < 0.5 && !traction._scaffoldingFadeNotified) {
        return { title: 'Note labels fading', body: 'Your fingers know the way now.' };
      }
      return null;
    }
  },
];
```

### 4.5 Web Push API — Service Worker Architecture

```javascript
// notificationEngine.js — runs in service worker

// 1. Request permission during onboarding (after first breath)
// 2. Subscribe to push manager
// 3. Store subscription in tractionStore.garden.pushSubscription
// 4. On each page visit, evaluate NOTIFICATION_RULES
// 5. Schedule local notifications via service worker
// 6. On notification click → deep link to the relevant phase

// Key: notifications are LOCAL (no server needed for basic functionality)
// Server push only needed for mentor review reminders (existing calendarService)
```

### 4.6 Calendar Integration — Auto-Scheduling

Extend `calendarService.js` to also create **student practice events**:

```javascript
export async function createPracticeEvents(garden, tier) {
  const tierConfig = COMMITMENT_TIERS[tier];
  const events = [];

  for (const tree of garden.trees) {
    if (!tree.planted || tree.growthStage === 'forest') continue;

    // Create recurring calendar event for this tree
    events.push({
      summary: `Voix Vive — ${TREE_NAMES[tree.id]}`,
      description: TREE_DESCRIPTIONS[tree.id],
      start: { dateTime: nextOccurrence(tree.time), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: nextOccurrenceEnd(tree.time, tree.id, tierConfig), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${daysToRRULE(tree.daysActive)}`],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 5 },
          { method: 'popup', minutes: 0 },
        ]
      },
      colorId: TREE_COLORS[tree.id], // Google Calendar color IDs
    });
  }

  // Create each event
  for (const event of events) {
    await calendarFetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  }
}
```

---

## 5. The Complete Game Loop — With Notifications and Identity

### 5.1 The Daily Cycle (Informed by Kriya's Daily Routine)

```
MORNING → 🌱 Breath Tree fires notification
  │
  ▼
BE PHASE — Dharana (Single-Pointed Attention)
  "Release everything that isn't this."
  Body scan → 3 breaths → Intention for today
  Identity: "I am sitting with my guitar."
  │
  ▼
MIDDAY → 🌿 Practice Tree fires notification
  │
  ▼
DO PHASE — Dhyana (Sustained Attention)
  "The attention has found its object and won't leave."
  SHEARL Flash → PLING! Orbs → Score
  Identity: "I am practicing." → "The practice practices itself."
  │
  ▼
EVENING → 🌳 Reflect Tree fires notification
  │
  ▼
PLAY PHASE — Samadhi (Absorbed Attention)
  "The song plays through you."
  Performance → Journal entry → Paravastha check
  Identity: "I played." → "The song played."
  │
  ▼
NIGHT → 🌸 Night Gate Tree fires notification
  │
  ▼
NIGHT GATE — Paravastha (After-Effect State)
  "How long did the feeling last?"
  Breathe 3× → Replay best moment → Set tomorrow's intention
  Identity: None. Just the after-effect of the day's practice.
  │
  ▼
SLEEP → The last mental state colors the entire sleep cycle.
  (Kriya principle: the before-sleep routine is the most powerful practice gateway.)
  │
  ▼
DAWN → 🌳 Living Voice (if unlocked)
  The melodic cell from BE phase runs in the background.
  No notification needed. The song IS the alarm.
```

### 5.2 The Weekly Cycle (Informed by Kriya's 3-Level Depth)

```
Week 1:   Level 1 — Mechanical. Learn the routine. Identity: "I am learning."
Week 2-3: Level 2 — Musical. Feel the routine. Identity: "I am practicing."
Week 4+:  Level 3 — Autonomous. The routine runs itself. Identity: "The song plays."
```

Each week, the scaffolding fades a little more. The notifications thin out. The trees grow. The identity loosens its grip. And one day, the student sits down with their guitar, and there is no "student" and no "guitar" — just the song.

### 5.3 The Fret Cycle (Informed by Kriya's Initiation Gates)

Each fret follows the same 3-phase structure, but the **identity shedding** deepens:

```
Fret N:
  BE → Shed one identity layer. Pass the somatic gate (body confirms readiness).
  DO → Practice the new identity. Pass the pitch gate (ear confirms accuracy).
  PLAY → Perform from the new identity. Pass the performance gate (song confirms authenticity).
  → Advance to Fret N+1. The old identity is gone. The new one is lighter.
```

By Fret 12, the student has shed 12 layers of identity. What remains is not "a guitarist" or "a musician" — it's **the living voice itself.** Voix Vive.

---

## 6. The AI Tutor as Game System — Always-On Troubadour

> **Full design:** `docs/07_MINIMUM_AI_MODE.md`

The Troubadour AI is not a separate feature. It is part of the game system — as fundamental as the metronome or the breathing gate. Audio is always on. The LLM chat is toggleable.

### 6.1 Audio = Game Infrastructure (Not Toggleable)

The game's audio cues serve the same function as Kriya's mantra: they are always-present guides that the student internalizes over time.

| Audio Cue | Game Phase | Kriya Parallel | Always On? |
|-----------|-----------|----------------|-----------|
| Breathing timer tone | BE (Breathing Gate) | Mantra rhythm | ✅ Yes |
| Metronome click | DO (SHEARL Flash) | Kriya timing | ✅ Yes |
| Pitch reference tone | DO (PLING! Orbs) | Mantra pitch | ✅ Yes |
| Troubadour voice (TTS) | All phases | Guru's voice | ✅ Yes (quality varies) |

The `aiEnabled` toggle (🔮/🤫 in OrientationHub) controls the **LLM chat** only. When toggled off, the student still hears:
- Game audio cues (breathing, metronome, pitch)
- Static Troubadour prompts spoken via Web Speech API
- Phase announcements ("BE phase complete. Move to DO.")

### 6.2 The Three AI Tiers as Game Difficulty

The AI tier system maps to the game's existing difficulty labels (Bertrand's language, never Easy/Medium/Hard):

| AI Tier | Game Difficulty | Troubadour Behavior | Kriya Level |
|---------|----------------|---------------------|-------------|
| **Whisper** (offline) | Kinesthetic Awakening | Static prompts, keyword-matched. "Close your eyes. The root note is not a place on the neck." | Level 1 (external) |
| **Voice** (in-browser) | Applied Practice | Generative AI, compressed prompt. Adapts to fret/phase. "You're on Fret 4, the Minor 3rd. What does longing sound like?" | Level 2 (internalized) |
| **Song** (server) | Flow State | Full 33B model, full prompt, voice interaction. The Troubadour speaks with Bertrand's depth. | Level 3 (autonomous) |

### 6.3 The Whisper Test — Can the Game Run Without AI?

**Yes.** The game engine (VertiscaleEngine), scoring (scoreCalculator), session logging (sessionLogger), and persistence (tractionStore) all work without any AI backend. The Troubadour is an overlay, not a dependency.

When `aiEnabled === false` or no backend is detected:
- `useTroubadourAI.js:55` routes to `troubadourOffline.js` for text responses
- `speakText()` (line 23-44) uses Web Speech API for TTS
- Game phases proceed normally with audio cues
- The student still receives pedagogical guidance from static prompts

This is the Kriya test: **the workbook must work without the guru present.**

---

## 7. Implementation Priority

| Priority | Feature | Files to Create/Modify | Kriya Principle |
|----------|---------|----------------------|-----------------|
| **P0** | AI three-layer architecture | See `docs/07_MINIMUM_AI_MODE.md` Phase A-C | Workbook IS the guru |
| **P0** | Garden Store (data model) | `tractionStore.js` — add `garden` to DEFAULT_STATE | Tree a day |
| **P0** | Garden UI (plant/tend trees) | New: `PracticeGarden.jsx` | Tree a day |
| **P0** | Notification Engine | New: `notificationEngine.js`, `notificationRules.js` | Mantra-as-notification |
| **P1** | wllama + LFM2.5-1.2B hook | New: `useWllamaTroubadour.js`, modify `useTroubadourAI.js` | Mantra silent |
| **P1** | Web Push Service Worker | New: `sw.js`, modify `index.html` | External→Internal bridge |
| **P1** | Identity Shedding Prompts | Modify: `dagNodes.js` — add `sheddingPrompt` to each fret | Kriya initiation gates |
| **P1** | Paravastha Check | Modify: `BEWorkbook.jsx` Evening Reflect card | Paravastha |
| **P2** | Calendar Auto-Scheduling | Modify: `calendarService.js` | Digital enhancement |
| **P2** | Night Gate Routine | New: `NightGate.jsx` | Before-sleep practice |
| **P2** | Growth Stage Visualizations | Modify: `PracticeGarden.jsx` | Tree lifecycle |
| **P3** | Living Voice Background Mode | New: `LivingVoice.jsx` | Autonomous mantra |
| **P3** | Fret-to-Body Resonance Lesson | New: `BodyResonance.jsx` | Chakra = body's fretboard |

---

## 8. The Deepest Insight

Kriya Yoga's entire technology is designed for one purpose: **to make the practitioner disappear into the practice.**

The mantra starts external (out loud). Then internal (silent). Then autonomous (self-running). Then the practitioner dissolves into the after-effect state (Paravastha). At no point does the practitioner "get better at" the mantra. The mantra gets better at running itself through the practitioner.

Voix Vive must work the same way. The student doesn't "get better at guitar." The guitar gets better at playing itself through the student. The song doesn't "get better." The song gets better at singing itself through the voice. The player doesn't "become a musician." The musician disappears into the music.

**The notification system is the training wheels for this dissolution.** At first, the phone reminds you to practice. Then the habit reminds you. Then the body reminds you. Then the song reminds you. And finally, there is no "you" to remind — just the living voice, playing.

That's the game. **Build notifications that grow into trees that grow into a forest that becomes the world the student lives in.**
