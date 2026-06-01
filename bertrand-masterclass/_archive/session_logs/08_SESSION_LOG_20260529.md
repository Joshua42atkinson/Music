# Session Log — 2026-05-29: System Bible & Content Deepening

> Captures all insights, decisions, bugs found, and next steps from today's session.

---

## 1. Documents Created

### `docs/00_SYSTEM_BIBLE.md` — The Definitive Platform Document
- **Purpose:** The single document that captures the entire platform as BOTH an online school AND a video-game save-state system.
- **Contains:**
  - Audit of all 8 existing docs (what each covers, strengths, weaknesses)
  - Full curriculum metrics (121 nodes, ~60 hours, 96 slides, bilingual content)
  - RPG metaphor mapping (Character = Profile, Skill Tree = DAG, Save File = bard_traction, etc.)
  - 3-layer save architecture diagram (localStorage → IndexedDB → Supabase)
  - DAG skill tree visual (per-fret BE→DO→PLAY gate flow)
  - Mentorship presence gradient (AI → Video → Async Review → Live)
  - Honest grade card from 4 evaluator perspectives (Music Educator B+, ID A-, Game Dev A, Business B)
  - Prioritized action plan

### `docs/07_BERTRAND_MENTORSHIP_INTEGRATION.md` — Mentorship Blueprint
- **Purpose:** Maps 36 instructional videos (3 per fret × 12 frets) that Bertrand needs to record.
- **Status:** Committed and pushed.

---

## 2. Critical Design Insight: Open Book vs. Game Mode

### The Dual-Mode Philosophy (from Joshua, 2026-05-29)

> "I made the course so that it can reflect the human experience — see mysticism and Hero's Journey — so we have a full list of phases that the student might be in, and if it is balanced, yang, or yin... and that is the course messaging, and the way to psychologically and emotionally manage the course content based on the vibe of the player in OPEN BOOK mode. In Game mode, the flow is in the progress itself, and not skipping steps."

### What This Means Architecturally

| Mode | Navigation System | Progression Driver | Emotional Framework |
|------|------------------|-------------------|---------------------|
| **Open Book (Sandbox)** | Hero's Journey phases + Yin/Yang coding | Student's emotional resonance — "I feel like I'm in The Ordeal" | PRIMARY — the chapter archetypes (Foundation, Awakening, Longing, Joy, Question, Ordeal, Power, Memory, Hope, Return, Home) ARE the curriculum map |
| **Game (Guided Path)** | DAG gates (BE→DO→PLAY per fret) | Mechanical unlocking — you earn the next fret by proving mastery | SECONDARY — the archetypes provide flavor, but the satisfaction comes from the unlock sequence |

### The 12 Fret Archetypes (from `FRET_METADATA`)

| Fret | Interval | Archetype | Yin/Yang | Hero's Journey Stage |
|------|----------|-----------|----------|---------------------|
| 1 | Root | The Foundation | Balanced | Ordinary World |
| 2 | Minor 2nd | The Awakening | Yang (tension) | Call to Adventure |
| 3 | Major 2nd | The Journey | Yang (movement) | Refusal / Acceptance |
| 4 | Minor 3rd | The Longing | Yin (melancholy) | Meeting the Mentor |
| 5 | Major 3rd | The Joy | Yang (bright) | Crossing the Threshold |
| 6 | Perfect 4th | The Question | Balanced | Tests, Allies, Enemies |
| 7 | Tritone | The Ordeal | Yin (crisis) | Approach to Inmost Cave |
| 8 | Perfect 5th | The Power | Yang (authority) | The Ordeal / Reward |
| 9 | Minor 6th | The Memory | Yin (nostalgia) | The Road Back |
| 10 | Major 6th | The Hope | Balanced | Resurrection |
| 11 | Minor 7th | The Return | Yin (blues) | Return with Elixir |
| 12 | Major 7th | The Home | Balanced | The Elixir |

### Key Implication
In Open Book mode, the Troubadour AI should read the student's Yin/Yang state and adjust its coaching tone:
- **Yin phase student** → contemplative, soft, "sit with this feeling"
- **Yang phase student** → energized, directive, "play it now, feel the power"
- **Balanced phase student** → neutral, Socratic, "what do you notice?"

This is NOT currently implemented in the Troubadour's system prompt. It should be.

---

## 3. Bug Found: `useDAGProgress` is Sandbox-Unaware

### The Problem
`useDAGProgress.js` — the central hook that most components depend on for progression state — **never reads `sandboxMode` from `bard_traction`**. It calls `isNodeUnlocked()` and `isNodeRecommended()` without passing the `sandboxMode` flag.

**Only `BEWorkbook.jsx` manually passes `sandboxMode`** to its own calls. Every other component that uses `useDAGProgress` will still show nodes as locked even when sandbox mode is active.

### Affected Components
- `DAGProgressBar.jsx` — imports `isNodeUnlocked` but doesn't pass sandboxMode
- `useDAGProgress.js` → `recommendedNodesList`, `nextRecommendedNode`, `unlockedNodesList` all ignore sandbox
- Any future component using `useDAGProgress` will inherit this bug

### The Fix (NOT YET APPLIED)
`useDAGProgress` should:
1. Read `sandboxMode` from `bard_traction` in localStorage on init
2. Accept `sandboxMode` as a parameter or context value
3. Pass it to all `isNodeUnlocked()` and `isNodeRecommended()` calls

### Priority: **Medium** — affects UX consistency but doesn't break data integrity.

---

## 4. Bug Found: AI Toggle Labeling

### The Problem
The AI On/Off toggle buttons say **"Online / Offline"** — which reads like a network status indicator, not a preference toggle.

### The Fix
Relabel to **"Troubadour / Silent"** or **"AI On / AI Off"** to match the pedagogical intent.

### Priority: **Low** — cosmetic only.

---

## 5. Content Work Completed: TroubadourPrompt Deepening

### What Was Done
Replaced all generic/batch-generated `troubadourPrompt` text for Frets 5-12 (77 lines changed) with hand-crafted somatic coaching text that:
- References the correct interval (e.g., "the ratio is 5:4" for Major 3rd)
- Uses Bertrand's actual pedagogical protocols (©SHEARL, ©PLING!, ©FHEAL)
- Maps to the Hero's Journey archetype for each fret
- Provides specific physical instructions (not vague "close your eyes" templates)
- Includes correct musical references (not "440 Hz" for every fret)

### Fret-by-Fret Summary

| Fret | Theme | What the prompts now teach |
|------|-------|--------------------------|
| 5 | Major 3rd / The Joy | Sunlight/shadow metaphor. Building chords from intervals. Chord construction. |
| 6 | Perfect 4th / The Question | CAGED system. Fretboard geometry. Barre chord navigation. |
| 7 | Tritone / The Ordeal | Diabolus in Musica. Tension/resolution. Somatic mirror. Breathing through dissonance. |
| 8 | Perfect 5th / The Power | Power chords. Composition begins. Composing (not just practicing). |
| 9 | Minor 6th / The Memory | Vertiscale Engine. ©SHEARL/©PLING!/©FHEAL convergence. Spatial memory. |
| 10 | Major 6th / The Hope | Recording anxiety. Emotional conditioning. Dedicated performance. Being seen. |
| 11 | Minor 7th / The Return | 12-bar blues. Shuffle rhythm. Funk muting. Imperfection as expression. |
| 12 | Major 7th / The Home | Capstone Audition. Chromatic review. Journal retrospective. Graduation. |

### What Still Needs Work
- Fret 10 class-do prompt was in a tricky encoding but is now fixed (10/10 replaced)
- Milestone prompts for all frets still use the generic template: "Voilà. Fret N — complete. You are an instrument playing an instrument."  — these could be deepened but are acceptable as-is

---

## 6. Remaining Action Items (Prioritized)

### Must Do Before Public Launch
1. **[ ] Fix `useDAGProgress` sandbox awareness** — wire sandboxMode through the hook
2. **[ ] Relabel AI toggle** from "Online/Offline" to "Troubadour/Silent"
3. **[ ] Add visual sandbox indicator** — student should see a persistent badge when in Open Book mode
4. **[ ] Implement Yin/Yang tone adjustment** in Troubadour system prompt (read archetype phase from FRET_METADATA)

### Bertrand Must Do
5. **[ ] Record 36 videos** (3 per fret × 12 frets, as specified in doc 07)
6. **[ ] Create Stripe account** and generate production Payment Links
7. **[ ] Update `pricingData.js`** with live Stripe URLs

### Nice to Have
8. **[ ] Deploy Supabase Edge Function** for Gemini AI proxy (cloud Troubadour)
9. **[ ] Wire Google Calendar** integration (schedule lessons from app)
10. **[ ] Wire Google Drive** integration (auto-backup .voixvive save files)
11. **[ ] Deepen milestone troubadourPrompts** for each fret (currently generic)
12. **[ ] Add peer review layer** for PLAY submissions

---

## 7. Git Commits This Session

| Hash | Message | Files |
|------|---------|-------|
| `1b47ba0` | Add System Bible and Bertrand Mentorship Integration docs | `docs/00_SYSTEM_BIBLE.md`, `docs/07_BERTRAND_MENTORSHIP_INTEGRATION.md` |
| `f6d9357` | Deepen troubadourPrompts for Frets 5-12 | `src/data/dag/dagNodes.js` (77 lines) |
