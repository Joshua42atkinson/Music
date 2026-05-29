# Voix Vive Academy — The Four Modes & Apprenticeship Framework

> How four toggle combinations create four distinct student experiences,
> and how they ladder up to a real "Troubadour Apprentice Certificate."

---

## The 2×2 Matrix

Two independent toggles create four usage modes:

```
                    AI ON (Troubadour)          AI OFF (Silent)
                ┌─────────────────────────┬────────────────────────────┐
                │                         │                            │
  GAME MODE     │  🎓 APPRENTICESHIP      │  📖 SELF-STUDY             │
  (Guided Path) │                         │                            │
                │  The full course.        │  The workbook experience.  │
                │  DAG gates enforce       │  Same gates, same rigor.   │
                │  BE→DO→PLAY. Troubadour  │  No voice in your ear.     │
                │  coaches at every step.  │  Just you and the guitar.  │
                │  Certificate-eligible.   │  Certificate-eligible.     │
                │                         │                            │
                │  WHO: New students,      │  WHO: Introverts, students │
                │  students who want       │  who prefer textbooks to   │
                │  mentorship presence     │  tutors, people who already│
                │                         │  know what to practice     │
                ├─────────────────────────┼────────────────────────────┤
                │                         │                            │
  OPEN BOOK     │  🌊 EXPLORATION          │  🎸 REFERENCE TOOL         │
  (Sandbox)     │                         │                            │
                │  Creative sandbox.       │  The "just let me look    │
                │  All 121 nodes open.     │  something up" mode.       │
                │  Troubadour responds to  │  Browse the textbook,      │
                │  your Hero's Journey     │  use the tools, play the   │
                │  archetype phase.        │  games — no tracking,      │
                │  NOT certificate-eligible│  no coaching, no pressure. │
                │                         │  NOT certificate-eligible. │
                │  WHO: Advanced players,  │  WHO: Returning graduates, │
                │  curious explorers,      │  teachers previewing the   │
                │  artists seeking         │  material, quick-reference │
                │  inspiration             │  users                     │
                │                         │                            │
                └─────────────────────────┴────────────────────────────┘
```

---

## Mode 1: APPRENTICESHIP (Game + AI) — The Full Course

This is the flagship experience. This is what Bertrand sells.

### What the Student Experiences
1. **Somatic Gates** enforce strict BE→DO→PLAY progression
2. **The Troubadour** coaches at every node with interval-specific prompts
3. **FHEAL Journaling** requires honest reflection before advancing
4. **Video Submissions** go to Bertrand for review at every PLAY phase
5. **Scaffolding Fades** automatically as traction increases (labels disappear, training wheels come off)
6. **Certificate Awarded** upon completing all 12 frets + Capstone Audition review by Bertrand

### Psychology: The Five Languages of Practice

Why does a student keep picking up the guitar? Because the platform speaks their *practice language*:

| Language | How the Platform Speaks It | Fret Examples |
|----------|---------------------------|---------------|
| **Achievement** | DAG gates unlock. Bard Level rises. Progress bar fills. Completion chimes ring. | Game Mode milestones, traction score |
| **Understanding** | The Living Textbook explains WHY each interval matters. Pythagorean ratios. Hero's Journey mapping. | Class pillar slides, ©SHEARL protocol |
| **Expression** | Journal prompts ask "who are you as a musician?" Video submissions are dedicated performances. | Workbook pillar, Fret 10 dedicated melody |
| **Connection** | Bertrand watches your video and responds personally. The Troubadour calls you by name. | Mentor review, Troubadour AI persona |
| **Sensation** | Somatic exercises. Breathing Gate. Tension/release tracking. "Feel the chord before you think about it." | Guitar pillar, ©FHEAL protocol, tensionScore |

Each student has a dominant language. The platform speaks ALL five, so every student finds their hook.

### Attention Management

The anti-dopamine design prevents burnout:
- **No streaks displayed** (tracked internally for data, never shown to student)
- **No leaderboards** (this is a solo journey)
- **No speed challenges** (the Troubadour says "slower than you think is right")
- **Scaffolding fades** instead of adding complexity — the interface gets SIMPLER as you progress
- **FHEAL reflections** force the student to pause and breathe between chapters

The result: students practice because they *want to*, not because the app guilt-trips them.

---

## Mode 2: SELF-STUDY (Game + No AI) — The Workbook

Same progression gates, same rigor — but silent. No Troubadour, no coaching, no voice.

### What the Student Experiences
1. Everything from Apprenticeship mode EXCEPT the AI chat
2. The troubadourPrompts still appear as *written coaching text* in the UI (not spoken)
3. The student reads the Living Textbook at their own pace
4. Video submissions still go to Bertrand
5. **Certificate-eligible** — the gates are the same, the proof is the same

### Who This Is For
- Students who find AI coaching distracting
- Students who prefer to read and think before playing
- Students in environments where they can't have audio playing (libraries, shared spaces)
- Students who want the discipline of the gates without the personality of the Troubadour

### Psychology
This mode respects the **Understanding** and **Achievement** practice languages above all. The student is their own coach. The platform provides structure, not companionship.

---

## Mode 3: EXPLORATION (Open Book + AI) — The Creative Sandbox

All 121 nodes are unlocked. No gates, no progression. The Troubadour becomes an open-ended companion.

### What the Student Experiences
1. Every fret, every tool, every game is available immediately
2. The Troubadour reads the student's CURRENT position (which fret they're browsing) and adjusts its coaching to the Hero's Journey archetype of that fret
3. The student can jump from Fret 12 (Major 7th / The Home) to Fret 7 (Tritone / The Ordeal) without consequence
4. Progress is still tracked but gates are not enforced
5. **NOT certificate-eligible** — skipping gates means no proof of mastery

### The Yin/Yang Navigation System

This is where the Hero's Journey archetype framework becomes the **primary navigation tool**:

```
STUDENT FEELING          →  FRET THEY SHOULD VISIT  →  YIN/YANG ENERGY
─────────────────────────────────────────────────────────────────────────
"I feel stuck"           →  Fret 7 (The Ordeal)     →  Yin (sit with it)
"I feel uninspired"      →  Fret 1 (The Foundation)  →  Balanced (breathe)
"I feel frustrated"      →  Fret 4 (The Longing)    →  Yin (embrace it)
"I want to feel strong"  →  Fret 8 (The Power)      →  Yang (play loud)
"I miss playing"         →  Fret 9 (The Memory)     →  Yin (nostalgia)
"I want to perform"      →  Fret 10 (The Hope)      →  Balanced (be seen)
"I want to feel free"    →  Fret 12 (The Home)      →  Balanced (improvise)
"I want to learn blues"  →  Fret 11 (The Return)    →  Yin (shuffle, feel)
```

### AI Tone Adaptation (TODO — Not Yet Implemented)

The Troubadour should read `FRET_METADATA[currentFret].emotion` and adjust its system prompt:

```javascript
// Proposed injection into Troubadour system prompt:
const fretMeta = FRET_METADATA[currentFret];
const toneInstruction = fretMeta.emotion.includes('Yin')
  ? 'Speak softly. Use contemplative language. Encourage sitting with feelings.'
  : fretMeta.emotion.includes('Yang')
    ? 'Speak with energy. Use directive language. Encourage bold action.'
    : 'Speak neutrally. Use Socratic questions. Let the student lead.';
```

### Psychology
This mode speaks the **Expression** and **Sensation** practice languages. The student is an artist, not an apprentice. The fretboard is a canvas, not a curriculum.

---

## Mode 4: REFERENCE TOOL (Open Book + No AI) — The Library

Everything open. No coaching. No tracking. Just the content.

### What the Student Experiences
1. Full access to all tools, all textbook content, all games
2. No AI, no voice, no prompts
3. No progress tracking (or tracking is paused)
4. The platform is a pure interactive music theory reference

### Who This Is For
- **Returning graduates** who completed the course and want to revisit specific topics
- **Teachers** previewing the platform before recommending it to students
- **Quick-reference users** who just want the fretboard explorer or pitch room
- **Demo mode** for the landing page

---

## The Certificate: "Troubadour Apprentice"

### What It Proves
A student who earns the Troubadour Apprentice Certificate has:
1. ✅ Completed all 12 frets in **Game Mode** (BE→DO→PLAY for each)
2. ✅ Passed all 12 Somatic Gates (breathing, pitch matching, performance)
3. ✅ Submitted 12 video recordings (one per fret PLAY phase)
4. ✅ Written 12 FHEAL journal reflections
5. ✅ Completed the **Capstone Audition** (Fret 12 Workbook PLAY)
6. ✅ Received Bertrand's personal review of the Capstone

### What It Contains
- Student's name
- Date of completion
- Bertrand Laurence's signature (digital)
- Voix Vive Academy seal
- Total practice hours logged
- Bard Level achieved
- A personal note from Bertrand (from the Capstone review)

### Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Gate enforcement (Game Mode) | ✅ Working | `isNodeUnlocked()` in `dagEdges.js` |
| Progress tracking | ✅ Working | `tractionStore.js`, `useDAGProgress.js` |
| Video submission | ✅ Scaffolded | `type: 'submission'` nodes exist, recording UI exists |
| Mentor review queue | ⚠️ Partial | Video upload works, review dashboard not built |
| Certificate generation | ❌ Not built | Needs a simple PDF/image generator |
| Capstone review flow | ❌ Not built | Bertrand reviews final video, writes note, triggers cert |
| Certificate display | ❌ Not built | Character Sheet could show earned certificates |

### Minimum Viable Certificate (What We Can Build Now)
1. When all 12 `fret-N-class-milestone` nodes are completed → show "Course Complete" badge
2. When Fret 12 Workbook PLAY is submitted → trigger email to Bertrand
3. Bertrand reviews and marks "approved" in Supabase
4. Student's Character Sheet shows the Troubadour Apprentice seal
5. Student can export a `.voixvive` save file that includes `certificateEarned: true`

---

## Meaning-Making: Why This Is Not "Just a Cool Website"

### The Five Proof Points That Distinguish an Academy from a Website

| Proof Point | Website | Academy | Voix Vive Status |
|-------------|---------|---------|------------------|
| **Curriculum** | Random tutorials | Sequenced, gated syllabus | ✅ 121-node DAG with BE→DO→PLAY |
| **Assessment** | Self-reported "I did it" | Somatic gates + human review | ✅ Gates exist, ⚠️ review partial |
| **Credential** | Badge/trophy | Certificate with instructor signature | ❌ Not built yet |
| **Mentorship** | AI chatbot | Human mentor who knows your name | ⚠️ Video review exists, queue not built |
| **Pedagogy** | "Here's how to play G chord" | "Here's why the Perfect 4th matters to your body" | ✅ Full somatic philosophy |

### What's Missing for "Full Academy"
1. **Certificate generation** — even a simple one proves it's a course, not a toy
2. **Mentor review dashboard** — Bertrand needs a screen to watch/review/approve submissions
3. **Completion email** — automated congratulation + cert delivery when Bertrand approves Capstone

These three features are the difference between "cool website" and "Troubadour Apprentice Course with certificate and mentorship."

---

## Implementation Priority

### Phase 1: Make It Real (This Sprint)
- [ ] Fix `useDAGProgress` sandbox awareness (Bug from session log)
- [ ] Add persistent mode indicator (badge showing Game/Open Book + AI/Silent)
- [ ] Relabel toggle buttons ("Guided Path / Open Book" + "Troubadour / Silent")
- [ ] Add "Course Complete" detection (all 12 milestones completed → celebration screen)

### Phase 2: Certificate (Next Sprint)
- [ ] Build simple certificate component (student name, date, Bertrand signature, seal)
- [ ] Add `certificateEarned` flag to `bard_traction`
- [ ] Build Mentor Dashboard (list of pending PLAY submissions with approve/note buttons)
- [ ] Wire Capstone approval → certificate generation

### Phase 3: Polish (Launch Sprint)
- [ ] Implement Yin/Yang Troubadour tone adaptation
- [ ] Add "Five Languages" self-assessment to onboarding (which practice language speaks to you?)
- [ ] Build email notification for Capstone submission → Bertrand
- [ ] Add certificate export (PDF or shareable image)
