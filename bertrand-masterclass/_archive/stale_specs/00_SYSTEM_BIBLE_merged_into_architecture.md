# Voix Vive Academy — The System Bible

> **The single document that captures the entire platform as both an online school and a video-game save-state system.**
> Last Updated: 2026-05-29

---

## Document Audit: What We Have vs. What We Need

Before building the unified picture, here is an honest assessment of every document in the `docs/` folder.

### Current Document Inventory

| Document | Lines | What It Covers | Strength | Weakness |
|----------|-------|----------------|----------|----------|
| `EDCI_57300_Project_Proposal.md` | 627 | **The best single document.** Business model, ADDIE framework, stakeholder analysis, revenue projections, risk assessment. Written for an academic audience. | Comprehensive, credentialed, cites Bloom's/Csikszentmihalyi/Gordon. | Academic tone. Does not describe the save-state/game architecture. |
| `00_SYSTEM_ARCHITECTURE.md` | 74 | Three-layer data model (localStorage → IndexedDB → Supabase), the three data wires, directory structure. | Excellent technical reference for developers. | Zero pedagogical context. A teacher reading this would learn nothing about the *curriculum*. |
| `01_PEDAGOGY.md` | 156 | **The IP document.** ©SHEARL, ©PLING!, ©FHEAL, Yin/Yang coding, Slow Web mandate, the 12-chapter monomyth table, Vertiscale phases. | The purest expression of Bertrand's philosophy. | Does not connect to the actual code, DAG, or save-state system. |
| `01_ACADEMY_SYLLABUS.md` | 76 | 12-month pacing table, Capstone rubric (Emerging/Competent/Masterful), SLA for mentorship response times, technical requirements. | The only document a *student* could read as a course catalog. | Thin — no mention of the 121-node DAG, the tools, or how progression actually works in the software. |
| `02_BUSINESS_MODEL.md` | 56 | Freemium funnel, 6 pricing tiers, Stripe payment links, video review workflow, queue cap. | Clear and operational. | Does not reference the DAG or how free-tier usage naturally leads to the paywall (the "plateau" moment). |
| `03_TROUBADOUR.md` | 131 | AI persona, Four Troubadour Types, system prompt structure, hard rules, fine-tuning spec (Gemma 4 E2B, LoRA), VR moonshot. | The most complete AI spec in the project. | Does not explain how the AI *reads the save state* to contextualize its coaching. |
| `05_PEARL_STANDARD.md` | 166 | The PEARL header format for source files, worked examples, ADDIECRAPEYE stage definitions. | Excellent for developer onboarding. | Not relevant to teachers or students. |
| `07_BERTRAND_MENTORSHIP_INTEGRATION.md` | ~140 | Bertrand's background, 36-video production checklist (3 per fret × 12 frets), voice cloning strategy. | The roadmap for filling the mentorship gap. | Brand new — needs Bertrand's input on which existing YouTube clips can fill slots. |

---

### The Gap

**No single document currently explains the platform as both a school AND a game.** The Project Proposal comes closest but was written for Purdue, not for a teacher evaluating the system. The Pedagogy doc captures the soul but not the machine. The Architecture doc captures the machine but not the soul.

**This document fills that gap.**

---

## Part 1: The School (What a Teacher Would See)

### 1.1 The Syllabus at a Glance

Voix Vive Academy is a 12-month, self-paced online guitar course. Every student who signs up gets:

| Layer | Content | Format | Free? |
|-------|---------|--------|-------|
| **The Living Textbook** | 12 chapters mapping the Hero's Journey to the chromatic scale. Each chapter covers one interval (Root → Minor 2nd → Major 2nd → ... → Octave). | Interactive slides with bilingual text (EN/FR), guided meditations, Pythagorean ratio explanations, and somatic exercises. | ✅ Yes |
| **The Practice Tools** | 12 interactive instruments: Breathing Gate, Practice Timer, Pitch Room, Metronome, Interval Visualizer, Fretboard Explorer, PLING! Trainer, Microtonal Tracker, Vertiscale Engine, Coaching Portal, Multi-Key Hub, Rhythm Engine. | Real-time Web Audio API tools with microphone input, pitch detection, and visual feedback. | ✅ Yes |
| **The Workbook** | FHEAL journaling prompts at every phase. Students write reflections, record audio/video submissions, and track their somatic state. | Text journal entries stored locally + optional video submissions to Google Drive. | ✅ Yes |
| **The AI Troubadour** | A Socratic AI coach (running locally or via cloud proxy) that adapts its voice to the student's archetype and current curriculum position. | Streaming chat in the ambient panel. 3-sentence max responses. Net Protocol ("Over.") | ✅ Yes |
| **Mentor Review** | Bertrand watches your video, records a personal critique, and writes notes. | Asynchronous video exchange. 7-day SLA. | 💰 Paid ($35-$100) |

### 1.2 Curriculum Depth (The Numbers)

A teacher would want to know: *how much actual content is there?*

| Metric | Count | Source File |
|--------|-------|-------------|
| Total chapters (frets) | 12 | `chapterData.js` (972 lines) |
| Total DAG nodes (lessons) | **121** | `dagNodes.js` (2,375 lines) |
| Unique AI coaching prompts | 121 (one per node) | `troubadourPrompt` field in each node |
| Journal/reflection prompts | 24 (2 per fret) | `journalPrompt` field in workbook nodes |
| Video submission gates | 12 (1 per fret) | `type: 'submission'` nodes |
| Milestone checkpoints | 24 (2 per fret) | `type: 'milestone'` nodes |
| Interactive tool configs | ~36 | `toolConfig` objects in guitar pillar nodes |
| Bilingual slide content | 12 × ~8 slides each ≈ **96 slides** | `slideGenerator.js` (368 lines) |
| Pythagorean ratio entries | 12 | `pythagoreanLegacy` in `chapterData.js` |
| Vocabulary terms defined | ~36 (3 per fret) | `concepts[]` arrays in `chapterData.js` |
| Somatic meditation prompts | 12 | `meditation.prompt` in Yin sections |
| Physical exercises | ~24 | `exercises[]` in Yang sections |
| Estimated total student hours | **~60 hours** (5 hours/fret × 12 frets) | `estimatedMinutes` fields summed |

**Verdict for a teacher:** This is not a thin MVP. It is a fully authored, bilingual, 60-hour curriculum with 121 discrete instructional nodes, each containing its own AI coaching prompt, somatic gate, and assessment pathway. The content depth rivals a semester-long community college course.

### 1.3 What a Teacher Would LOVE

1. **Bloom's Taxonomy Alignment.** The BE → DO → PLAY phase sequence maps directly to Bloom's:
   - **BE** = Remember + Understand (read, imagine, visualize)
   - **DO** = Apply + Analyze (practice, pitch-match, ear-train)
   - **PLAY** = Evaluate + Create (perform, compose, reflect)

2. **Somatic Gates.** Students cannot skip ahead. The DAG enforces physical proof of learning before conceptual advancement. A teacher would call this "mastery-based progression."

3. **The FHEAL Workbook.** Every fret requires journaling. The prompts are not generic ("how did that feel?") — they are crafted: *"If the root note were a character in a movie, who would they be?"* This is genuine reflective practice.

4. **Capstone Rubric.** The 3-pillar rubric (BE/DO/PLAY × Emerging/Competent/Masterful) is clean, observable, and human-evaluated — not just machine-scored.

5. **Anti-Dopamine Design.** No streaks, no leaderboards, no speed challenges, no push notifications. A teacher who has watched students burn out on Duolingo would weep with joy.

### 1.4 What a Teacher Would CRITIQUE

1. **Frets 5-12 Content Thinning.** Fret 1's DAG nodes are hand-crafted masterpieces with specific `toolConfig`, `slideIds`, and rich `yinContent`/`yangContent` prose. Frets 5-12 were batch-generated and have more generic `troubadourPrompt` text (e.g., "Alors, imagine what the scene in the movie would be like Over"). The pedagogical *structure* is identical, but the *authorial voice* thins out.

2. **No Rubric for AI Feedback.** The Troubadour gives Socratic coaching, but there is no rubric for *how the AI evaluates*. A teacher would ask: "How does the AI know if a student's journal entry is thoughtful or just two words?" Currently, it doesn't — the AI is a guide, not an assessor.

3. **Video Submission Bottleneck.** The PLAY phase requires a video submission reviewed by Bertrand. If 500 students are active, that's 500 × 12 = 6,000 video reviews per year. The queue cap (10 pending) helps, but a teacher would point out this doesn't scale without AI-assisted pre-screening or peer review.

4. **No Peer Interaction.** The platform is purely solo. There is no forum, no peer feedback, no cohort. A teacher would argue that music is inherently social and the absence of community is a gap.

---

## Part 2: The Game (The Save-State Architecture)

### 2.1 The Core Metaphor

Voix Vive is a **single-player RPG disguised as an online school.**

| RPG Concept | Voix Vive Equivalent | Code Location |
|-------------|---------------------|---------------|
| Character | Student Profile (name, archetype, troubadour type) | `tractionStore.js → studentProfile` |
| Level | Bard Level (1-12, derived from total traction) | `tractionStore.js → bardLevel` |
| XP | Traction (accumulated practice points, not displayed as a score) | `tractionStore.js → totalTraction` |
| Skill Tree | The 121-node DAG (Directed Acyclic Graph) | `dagNodes.js` + `dagEdges.js` |
| Quest Log | Completed nodes array | `tractionStore.js → completedNodes` |
| World Map | The Maturation Map (`/guitar/map`) showing all 12 frets | `MaturationMap.jsx` |
| Save File | `bard_traction` key in localStorage | `tractionStore.js` |
| Memory Card | `.voixvive` file export (portable save state) | Export function in settings |
| Cloud Save | Supabase `traction_states` table | `supabaseSync.js` |
| NPC Guide | The Troubadour AI | `TroubadourWidget.jsx` + `useTroubadourAI.js` |
| Boss Gates | Somatic Gates (BE→DO→PLAY per fret) | `isNodeUnlocked()` in `useDAGProgress.js` |
| Sandbox Mode | "No-Game" toggle — unlocks all 121 nodes | `tractionStore.js → settings.sandboxMode` |
| Character Sheet | The D&D-style player card | `CharacterSheet.jsx` |
| Inn / Rest | Breathing Gate tool | `BreathingGate.jsx` |

### 2.2 The Save State (What Gets Persisted)

The `bard_traction` localStorage object is the player's save file. Here is its exact schema:

```
bard_traction = {
  // ── Character Stats ──
  bardLevel: 1,              // Derived from totalTraction (not editable)
  totalTraction: 0,          // Cumulative practice points
  practiceMinutes: 0,        // Total time spent
  streak: 0,                 // Consecutive days (not displayed to student)
  
  // ── World State ──
  fretsUnlocked: [1..12],    // Which frets are accessible
  currentNodeId: 'fret-1-class-be',  // Current position in the DAG
  completedNodes: [],         // Array of completed node IDs
  
  // ── Per-Fret Detailed State ──
  frets: {
    1: {
      traction: 0,           // 0-100 per fret
      beCompleted: false,     // Phase gates
      doCompleted: false,
      playCompleted: false,
      beMastery: 0,          // 0=Encountered, 1=Experienced, 2=Owned, 3=Mastered
      doMastery: 0,
      playMastery: 0,
      beGatePassed: false,    // Somatic proof gate
      doGatePassed: false,
      playGatePassed: false,
      tensionScore: 100,      // 100=max tension (beginner), 0=fully relaxed
      pitchAccuracy: 0,       // 0-100 from PitchRoom
      attempts: 0,
      timeSpentSeconds: 0,
      exercisesCompleted: [],
      depthExplored: false,   // "Go Deeper" clicked
    },
    // ... repeated for frets 2-12
  },
  
  // ── Settings ──
  settings: {
    aiEnabled: true,
    sandboxMode: false,       // "No-Game" toggle
    scaffoldingLevel: 1.0,    // 1.0=full guidance, 0.0=none
    showNoteLabels: true,
    showMetronome: true,
  }
}
```

### 2.3 The Three Save Layers (Durability Hierarchy)

```
┌─────────────────────────────────────────────────┐
│  Layer 3: SUPABASE (Cloud)                      │
│  Speed: Network · Survives: Everything          │
│  Triggered: On every state write (if logged in) │
│  Key: user_id → traction_states table           │
├─────────────────────────────────────────────────┤
│  Layer 2: INDEXEDDB (Browser Durable)           │
│  Speed: Fast async · Survives: Tab close,       │
│         browser restart, localStorage clear      │
│  Triggered: On every state write (non-blocking) │
│  Key: settings.traction_state in Dexie DB       │
├─────────────────────────────────────────────────┤
│  Layer 1: LOCALSTORAGE (Instant)                │
│  Speed: Synchronous · Survives: Tab close       │
│  Triggered: On every state write (primary)      │
│  Key: bard_traction                             │
└─────────────────────────────────────────────────┘
         ▲ Read priority: Layer 1 → Layer 2 → Layer 3
         ▼ Write priority: All three simultaneously
```

**On boot:** ScaffoldingProvider checks localStorage first. If empty (e.g., cleared browser data), it falls back to IndexedDB. If the user is logged in, it hydrates from Supabase cloud.

**On every action:** All three layers are written to simultaneously. Layer 1 is sync (instant UI update). Layers 2 and 3 are async (non-blocking, fire-and-forget with error logging).

### 2.4 The DAG as a Skill Tree

The 121-node DAG is the curriculum's enforcement engine. Every node has `prerequisites` — an array of node IDs that must be completed before this node unlocks.

```
FRET 1 SKILL TREE (simplified):

  CLASS PILLAR          GUITAR PILLAR         WORKBOOK PILLAR
  ─────────────         ──────────────        ─────────────────
  fret-1-class-be ──┬── fret-1-guitar-be ──── fret-1-workbook-be
         │          │          │                       │
  fret-1-class-do   │   fret-1-guitar-do     fret-1-workbook-do
         │          │          │                       │
  fret-1-class-play │   fret-1-guitar-play   fret-1-workbook-play
         │          │          │                       │
         └──────────┴──────────┘                       │
                    │                                  │
          fret-1-guitar-milestone            fret-1-workbook-reflection
                    │
          fret-1-class-milestone
                    │
          ┌─────────┘
          ▼
  fret-2-class-be (NEXT FRET UNLOCKED)
```

**Sandbox Mode** temporarily overrides `isNodeUnlocked()` to return `true` for all 121 nodes. This lets advanced students explore freely without corrupting their save state. When they toggle it off, they return to their actual progression.

---

## Part 3: The Mentorship Layer (How Bertrand Scales)

### 3.1 The Presence Gradient

Bertrand's presence ranges from "always on" (ambient) to "rare and expensive" (live):

```
ALWAYS ON ─────────────────────────────────────── RARE
   │                                                │
   ▼                                                ▼
AI Troubadour    Video Library    Async Review    Live Zoom
(free, 24/7)     (free, curated)  ($35, 7-day)   ($65, 1hr)
                                                     
 "Breathe.        Bertrand's       Bertrand        Real-time
  Trust the       actual face      watches your    1-on-1
  process.        and voice on     video and        coaching
  Over."          screen           records a        session
                                   response
```

### 3.2 Where Videos Plug In

The `VideoLibrary.jsx` component surfaces videos based on the student's current fret. Each fret needs 3 clips (BE/DO/PLAY). Current status:

| Fret | BE Video | DO Video | PLAY Video | Status |
|------|----------|----------|------------|--------|
| 1 | Placeholder | Placeholder | Placeholder | ⏳ Needs recording |
| 2 | Placeholder | Placeholder | — | ⏳ Needs recording |
| 3 | — | Placeholder | — | ⏳ Needs recording |
| 4 | — | — | Placeholder | ⏳ Needs recording |
| 5-12 | — | — | — | ⏳ Empty arrays |

**Total videos needed:** 36 (12 frets × 3 phases)
**Total videos recorded:** 0

### 3.3 How the AI Reads the Save State

The Troubadour's system prompt is dynamically built from the save state:

```
"This student's name is [studentName].
 They are Bard Level [bardLevel].
 They have practiced [practiceMinutes] minutes.
 They are on [currentNodeId] — Fret [N], Phase [BE/DO/PLAY].
 Their Troubadour Type is [The Storyteller/Craftsman/Ear/Seeker].
 They have completed [completedNodes.length] of 121 nodes."
```

This means the AI's coaching is *always contextual*. If the student is stuck on Fret 7 (the Tritone — "The Ordeal"), the Troubadour knows and can say: *"The Devil's Note is meant to be uncomfortable. Hold the tension. Breathe into it. Over."*

---

## Part 4: The Honest Grade Card

If this platform were submitted to a panel of music educators, instructional designers, and game developers, here is how each discipline would score it:

| Evaluator | Grade | Reasoning |
|-----------|-------|-----------|
| **Music Educator** | **B+** | Exceptional pedagogical structure (BE/DO/PLAY, somatic gates, FHEAL journaling). Content thins in frets 5-12. No peer interaction. Video library is empty. |
| **Instructional Designer** | **A-** | 121-node DAG with prerequisites is textbook mastery-based learning. Bloom's alignment is rigorous. The Troubadour AI persona is well-specified. Assessment rubric exists but is only human-evaluated (no formative AI assessment). |
| **Game Developer** | **A** | Save-state architecture is production-grade (3-layer persistence, portable `.voixvive` exports, cloud sync). DAG-as-skill-tree is elegant. Sandbox mode solves the "linearity vs. freedom" tension perfectly. Character sheet and archetype system add genuine personality. |
| **Business Analyst** | **B** | Freemium funnel is correctly designed (free content → paid mentorship). Zero-backend payment via Stripe links is genius for a solo operator. But: no Stripe links are live yet, video review doesn't scale past ~100 active students. |

### Overall: **B+ / A-**

**The architecture is A-tier. The content is B-tier because Bertrand hasn't recorded the videos yet.** The system is a Ferrari with an empty fuel tank — the engine is flawless, but the mentorship presence (the fuel) needs to be poured in.

---

## Part 5: The Action Plan (Filling the Tank)

### Priority 1: Content (The Fuel)
- [ ] Bertrand records 12 "BE" videos (philosophical introductions, 2-4 min each)
- [ ] Bertrand records 12 "DO" videos (over-the-shoulder demonstrations, 3-5 min each)
- [ ] Bertrand records 12 "PLAY" videos (performance examples, 2-3 min each)
- [ ] Deepen troubadourPrompts for Frets 5-12 (currently generic)

### Priority 2: Revenue (The Ignition)
- [ ] Bertrand creates Stripe account and generates live Payment Links
- [ ] Update `pricingData.js` with real Stripe URLs
- [ ] Test end-to-end payment flow on mobile

### Priority 3: Scale (The Transmission)
- [ ] Deploy Supabase Edge Function for Gemini AI proxy (cloud Troubadour)
- [ ] Wire Google Calendar integration (schedule lessons from the app)
- [ ] Wire Google Drive integration (auto-backup `.voixvive` save files)
- [ ] Consider peer review layer (students review each other's PLAY submissions before Bertrand's queue)
