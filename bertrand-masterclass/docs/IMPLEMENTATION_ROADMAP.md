# Voix Vive — Implementation Roadmap

> **Purpose:** Wiring plan — connect dead-letter systems to working features, in dependency order.
> **Last Updated:** 2026-06-01
> **Source:** Codebase audit (`docs/CODEBASE_AUDIT.md`) + Kriya research (`docs/05_KRIYA_DELIVERY_SYSTEM.md`, `docs/06_GAME_NOTIFICATIONS_IDENTITY.md`)
> **Principle:** Every item below traces to a specific file, function, and line. No hand-waving.

---

## The Problem: 5 Dead-Letter Systems

These systems exist in code but are invisible to students because nothing calls them:

| # | System | File | What's Dead | What Should Happen |
|---|--------|------|-------------|-------------------|
| 1 | **Commitment Tier** | `gameProgression.js:22-80` | Defined (gentle/committed/intensive), written by Onboarding, **read by nothing** | Drives practice duration, tree unlocks, graduation ETA |
| 2 | **4-Level Mastery** | `tractionStore.js:74-78` | Encountered→Experienced→Owned→Mastered, **displayed nowhere** | Visible in UI, triggers identity shedding prompts |
| 3 | **Scaffolding Fade** | `tractionStore.js:206-218` | Computes `scaffoldingLevel` 0.0–1.0, only fades note labels/fret numbers | Also fades prompts, troubadour hand-holding, identity layers |
| 4 | **DAG Navigation** | `dagNodes.js`, `dagEdges.js`, `useDAGProgress.js` | 144 nodes defined, **no route renders them**, `completedNodes` stays empty | Students navigate the DAG, see BE→DO→PLAY per node |
| 5 | **Practice Engine** | `practiceEngine.js` | Generates 20-min sessions, **hardcoded durations**, not wired to tier | Sessions adapt to commitment tier, fire at user-set times |

---

## Wiring Order — Dependency Graph

```
AI Tier → Tier → PracticeEngine → Garden → Notifications
  │         │         │              │          │
  │         │         ▼              ▼          ▼
  │         │    Session adapts   Trees grow  Rules fire
  │         │    to tier config   from hits   from state
  │         │         │              │          │
  │         ▼         ▼              ▼          ▼
  │    Mastery displayed in UI ←─────────────┘
  │         │
  │         ▼
  │    Scaffolding fades identity prompts
  │         │
  │         ▼
  │    DAG wired to routes (the capstone)
  ▼
Troubadour always speaks (Souffle→Voix→Chant)
```

**Rule:** Each layer depends on the one below it. Don't skip.
**New:** Layer 0 (AI tier) is the foundation — the Troubadour must always have a voice, even when everything else is offline.

---

## LAYER 0: Wire AI Three-Layer Architecture (Souffle → Voix → Chant)

**Why first:** The Troubadour is part of the game system. Audio is always on. The LLM is toggleable. Before any other wiring, the student must always have a guide — even offline. This is the Kriya test: the workbook must work without the guru present.

> **Full design:** `docs/07_MINIMUM_AI_MODE.md`

### 0.1 Verify Souffle tier (offline) works standalone

**File:** `src/hooks/useTroubadourAI.js:55`, `src/data/troubadourOffline.js`
**Current:** Offline fallback exists but is treated as a last resort
**Change:** Verify that with `aiEnabled === false`, the full game loop works:
- BreathingGate audio cues play
- PitchRoom reference tones play
- Static Troubadour prompts are spoken via Web Speech API
- `troubadourOffline.js` keyword responses are rich enough for practice guidance

**Effort:** 1 hour (verification + enriching offline prompts if needed)
**Impact:** Student can use the full game with zero server, zero download

### 0.2 Resurrect wllama for in-browser inference

**File:** Create `src/hooks/useWllamaTroubadour.js` from archived `_archive/.../useWebLLM.js`
**Current:** wllama hook was removed during cleanup
**Change:**

```javascript
import { Wllama } from '@wllama/wllama';

// Load LFM2.5-1.2B-Instruct-GGUF Q4_K_M (~700 MB) from public/models/
const wllama = new Wllama({
  'default': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@latest/dist/wllama.wasm',
});
await wllama.loadModelFromUrl('/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf', {
  n_gpu_layers: 20, // WebGPU offload if available
});
```

**Effort:** 2 hours
**Impact:** In-browser generative AI — no server needed after ~700 MB download

### 0.3 Add wllama to detection cascade

**File:** `src/hooks/useTroubadourAI.js:47-137`
**Current:** Detection order: aiEnabled→remote vLLM→StepAudio→llama.cpp→LM Studio→offline
**Change:** Insert wllama detection after aiEnabled check, before external servers:

```javascript
// After aiEnabled check (line 55), before remote vLLM (line 66):
if (wllamaRef.current?.isReady()) {
  setIsReady(true);
  setBackend('wllama');
  return { connected: true, backend: 'wllama', model: { id: 'LFM2.5-1.2B-Q4' } };
}
```

**Effort:** 1 hour
**Impact:** In-browser AI automatically used when available, external servers as upgrade

### 0.4 Create compressed prompt for 1.2B model

**File:** `src/data/troubadourPrompt.js`
**Current:** `buildTroubadourPrompt()` generates ~2000 tokens (too large for in-browser)
**Change:** Add `buildCompressedPrompt()` targeting ~500 tokens:

| Section | Full (33B) | Compressed (1.2B) |
|---------|------------|-------------------|
| Identity | Full description | "You are the Troubadour, a Socratic guitar mentor." |
| Archetype | Full profile | Type name: "Tone: Seeker (contemplative)" |
| Polarity | Full rules | "Polarity: Yin (soft, somatic)" |
| Platform | Full 12-fret map | "Fret {n}, {interval}. Phase: {phase}." |
| Net Protocol | 6 rules | "End every response with 'Over.'" |
| Student | Full traction JSON | "Bard {level}, streak {n}d, {completed}/12 frets" |
| Hard Rules | 9 rules | 3 rules: same language, max 3 sentences, end "Over." |

**Effort:** 2 hours
**Impact:** 350M model gets right-sized context for its capacity

---

## LAYER 1: Wire Commitment Tier → Practice Engine

**Why first:** Everything else (garden size, notification frequency, session duration) derives from the tier. It's the root of the dependency tree.

### 1.1 Make `practiceEngine.js` tier-aware

**File:** `src/data/practiceEngine.js`
**Current:** `const DAILY_DURATION = 20;` (hardcoded), `PHASE_TIME` fixed at 7/8/5 min
**Change:**

```javascript
import { COMMITMENT_TIERS } from './gameProgression';

export function generateDailySession(traction, completedNodes) {
  const tier = COMMITMENT_TIERS[traction.commitmentTier] || COMMITMENT_TIERS.gentle;
  const dailyMinutes = tier.dailyMinutes;
  
  // Scale phase times proportionally
  const scale = dailyMinutes / 20;
  const PHASE_TIME = {
    be:  Math.round(7 * scale),
    do:  Math.round(8 * scale),
    play: Math.round(5 * scale),
  };
  // ... rest of function uses PHASE_TIME instead of hardcoded values
}
```

**Effort:** 30 min
**Impact:** Gentle path students get 15-min sessions, Intensive get 60-min sessions

### 1.2 Display commitment tier in CharacterSheet

**File:** `src/components/playbook/CharacterSheet.jsx`
**Current:** Shows XP, bard level, troubadour type
**Change:** Add tier badge (☀️/🎸/🔥) + graduation ETA from `gameProgression.js:193-260`

```javascript
import { COMMITMENT_TIERS, calculateGraduationETA } from '../../data/gameProgression';

// In render:
const tier = COMMITMENT_TIERS[traction.commitmentTier];
const eta = calculateGraduationETA(traction);
// Show: tier.icon + tier.name.en + "Graduation: " + eta.weeksRemaining + " weeks"
```

**Effort:** 1 hour
**Impact:** Students see their commitment path and expected timeline

### 1.3 Add tier selector to Playbook settings

**File:** New section in `PlaybookShell.jsx` or `ProfileModal.jsx`
**Current:** No way to change tier after onboarding
**Change:** Allow tier upgrade (never downgrade without confirmation — Kriya principle: commitment deepens, doesn't shallow)

**Effort:** 2 hours
**Impact:** Students can deepen their commitment as practice takes root

---

## LAYER 2: Display Mastery Levels in UI

**Why second:** Mastery levels are already computed (0-3) but invisible. Making them visible is the bridge between "the code knows" and "the student knows."

### 2.1 Add mastery badges to QuestLog

**File:** `src/components/playbook/QuestLog.jsx` (or wherever fret progress is shown)
**Current:** Checks `traction >= 60` for completion — binary
**Change:** Show mastery level per phase:

```
BE: ○○○○ (Encountered)  →  ●○○○ (Experienced)  →  ●●○○ (Owned)  →  ●●●● (Mastered)
DO: ●●○○ (Owned)
PLAY: ○○○○ (Encountered)
```

**Implementation:**
```javascript
const fretState = traction.frets[fretId];
const masteryLabels = ['Encountered', 'Experienced', 'Owned', 'Mastered'];
const phases = ['be', 'do', 'play'];

phases.map(phase => {
  const level = fretState?.[`${phase}Mastery`] || 0;
  return `${phase.toUpperCase()}: ${'●'.repeat(level)}${'○'.repeat(3-level)} ${masteryLabels[level]}`;
});
```

**Effort:** 2 hours
**Impact:** Students see granular progress, not just "done/not done"

### 2.2 Add mastery transitions to Troubadour prompts

**File:** `src/data/troubadourPrompt.js` or inline in `ScaffoldingProvider.jsx`
**Current:** Troubadour has no awareness of mastery transitions
**Change:** When mastery advances (0→1, 1→2, 2→3), inject a one-time prompt:

| Transition | Kriya Stage | Prompt |
|-----------|-------------|--------|
| 0→1 (Encountered→Experienced) | Mantra out loud | "You've touched it. Now let it touch you back." |
| 1→2 (Experienced→Owned) | Mantra silent | "The practice is becoming yours. It speaks inside you now." |
| 2→3 (Owned→Mastered) | Mantra autonomous | "This runs through you without asking. You are the instrument." |

**Implementation:** In `completeDAGPhase()` and `markDepthExplored()`, check if mastery level changed and set a flag in traction state: `lastMasteryTransition: { fretId, phase, fromLevel, toLevel, timestamp }`. The Troubadour reads this flag on next render and shows the prompt.

**Effort:** 3 hours
**Impact:** Identity shedding becomes visible and felt

---

## LAYER 3: Extend Scaffolding Fade to Identity Prompts

**Why third:** Now that mastery is visible, the scaffolding can respond to it. As mastery deepens, prompts soften, then disappear.

### 3.1 Add `promptLevel` to scaffolding calculation

**File:** `src/data/tractionStore.js:206-218`
**Current:** `calculateScaffolding()` only adjusts visual aids
**Change:**

```javascript
function calculateScaffolding(state) {
  const avgTraction = state.totalTraction / Math.max(Object.keys(state.frets).length, 1);
  const level = Math.max(0, 1 - (avgTraction / 100));
  
  // Average mastery across all frets
  const frets = Object.values(state.frets);
  const avgMastery = frets.length > 0
    ? frets.reduce((sum, f) => sum + (f.beMastery||0) + (f.doMastery||0) + (f.playMastery||0), 0) / (frets.length * 3)
    : 0;
  
  return {
    ...state.settings,
    scaffoldingLevel: level,
    showNoteLabels: avgTraction < 40,
    showFretNumbers: avgTraction < 60,
    showMetronome: avgTraction < 80,
    showCAGEDOverlay: true,
    // NEW: Identity scaffolding
    promptVerbosity: avgMastery < 1 ? 'full' : avgMastery < 2 ? 'reduced' : avgMastery < 3 ? 'minimal' : 'silent',
    showTroubadourHandholding: avgMastery < 2,
    showBreathingGatePrompt: avgMastery < 2.5,
  };
}
```

**Effort:** 1 hour
**Impact:** The training wheels fade not just visually but verbally — the Troubadour speaks less as the student knows more

### 3.2 Consume `promptVerbosity` in TroubadourWidget

**File:** `src/components/TroubadourWidget.jsx`
**Current:** Always shows full prompts
**Change:** Read `promptVerbosity` from scaffolding and adjust prompt length/detail

| Verbosity | Behavior |
|-----------|----------|
| `full` | Current behavior — full troubadour prompts |
| `reduced` | Half-length prompts, more Socratic questions |
| `minimal` | One-line reminders only ("Breathe. Listen. Play.") |
| `silent` | No prompts — the student is the Troubadour now |

**Effort:** 2 hours
**Impact:** The identity shedding is now felt in the AI's behavior, not just in badges

---

## LAYER 4: Wire DAG to Routes (The Capstone)

**Why fourth:** The DAG is the architectural upgrade that makes everything else navigable. But it's meaningless without the first three layers — a student navigating the DAG needs to see mastery levels, feel scaffolding fade, and have sessions that match their commitment.

### 4.1 Add "Workbook" tab to PlaybookShell

**File:** `src/components/playbook/PlaybookShell.jsx`
**Current:** 4 tabs (CharacterSheet, QuestLog, Songwriting, Journal)
**Change:** Add 5th tab: "Workbook" → renders `BEWorkbook.jsx`

**Effort:** 30 min
**Impact:** Students see the 144-node DAG for the first time

### 4.2 Wire "Mark Complete" in SlideViewer

**File:** `src/components/SlideViewer.jsx`
**Current:** Reaching last slide auto-passes BE gate but doesn't call `completePhase()`
**Change:** On last slide, show button: "Mark BE Complete" → calls `scaffolding.completePhase(nodeId, 'be')`

**Effort:** 1 hour
**Impact:** `completedNodes` array actually gets populated

### 4.3 Wire PitchRoom DO phase completion

**File:** `src/components/PitchRoom.jsx`
**Current:** Marks DO gate passed on successful pitch match
**Change:** Also call `scaffolding.completePhase(nodeId, 'do')` so the DAG records it

**Effort:** 30 min
**Impact:** DO phase shows as complete in the Workbook

### 4.4 Add PLAY gate — performance submission

**File:** `src/components/PracticeRecorder.jsx` or `StructuredPracticeRecorder.jsx`
**Current:** Records video but doesn't pass PLAY gate
**Change:** After recording + self-confirmation, call `scaffolding.passGate(fretId, 'play')` and `scaffolding.completePhase(nodeId, 'play')`

**Effort:** 2 hours
**Impact:** PLAY phase can be completed — full BE→DO→PLAY cycle works

### 4.5 Sync DAG completion to legacy traction

**File:** `src/data/tractionStore.js:246-308` (already done in `completeDAGPhase`)
**Current:** `completeDAGPhase()` already syncs: `be=33, do=66, play=100` traction
**Change:** None needed — this is already implemented. Just verify it works once 4.2-4.4 are wired.

**Effort:** 0 (verification only)
**Impact:** QuestLog and Workbook stay in sync

---

## LAYER 5: Practice Garden + Notifications

**Why fifth:** The garden depends on tier (tree count), mastery (tree unlocks), and DAG (which fret the student is on). All of those must work first.

### 5.1 Add `garden` to tractionStore DEFAULT_STATE

**File:** `src/data/tractionStore.js`
**Change:** Add `garden` object (see `docs/06_GAME_NOTIFICATIONS_IDENTITY.md` §4.2)

**Effort:** 1 hour
**Impact:** Data model for notification trees exists

### 5.2 Create PracticeGarden component

**File:** New `src/components/PracticeGarden.jsx`
**Change:** Visual garden where students plant/tend trees, see growth stages

**Effort:** 4 hours
**Impact:** Students can set practice times and see their commitment grow

### 5.3 Create notificationEngine

**File:** New `src/lib/notificationEngine.js`
**Change:** Web Push API + service worker + state-driven notification rules (see `docs/06_GAME_NOTIFICATIONS_IDENTITY.md` §4.4)

**Effort:** 6 hours
**Impact:** Notifications fire at student-set times, thin out as habits form

### 5.4 Extend calendarService for student practice events

**File:** `src/lib/calendarService.js`
**Current:** Only handles mentor review booking
**Change:** Add `createPracticeEvents(garden, tier)` for auto-scheduling (see `docs/06_GAME_NOTIFICATIONS_IDENTITY.md` §4.6)

**Effort:** 3 hours
**Impact:** Practice times appear in Google Calendar

---

## LAYER 6: Night Gate + Paravastha Check

**Why sixth:** The night gate is the deepest Kriya practice — the before-sleep routine that colors the entire sleep cycle. It requires the garden (for the 🌸 Night Gate tree) and notifications (for the bedtime reminder).

### 6.1 Create NightGate component

**File:** New `src/components/NightGate.jsx`
**Change:** 3-breath close + replay best moment + set tomorrow's intention (see `docs/06_GAME_NOTIFICATIONS_AND_IDENTITY.md` §1.3)

**Effort:** 3 hours
**Impact:** Students have a before-sleep practice that consolidates the day's learning

### 6.2 Add Paravastha check to evening reflection

**File:** Modify `practiceEngine.js` reflection block or create new component
**Change:** After evening practice, ask: "How long did the feeling last? 5 min? 1 hour? All day?" (see `docs/06_GAME_NOTIFICATIONS_AND_IDENTITY.md` §4.4 rule `paravastha-prompt`)

**Effort:** 1 hour
**Impact:** Students track the after-effect state — the Kriya measure of practice depth

---

## Summary: Effort & Impact

| Layer | What | Effort | Student Impact | Dependency |
|-------|------|--------|---------------|------------|
| **0** | AI Three-Layer (Souffle→Voix→Chant) | 6 hr | Troubadour always speaks | None |
| **1** | Tier → PracticeEngine | 3.5 hr | Sessions match commitment | None |
| **2** | Mastery in UI | 5 hr | Granular progress visible | Layer 1 |
| **3** | Scaffolding → Identity | 3 hr | Prompts fade as mastery grows | Layer 2 |
| **4** | DAG → Routes | 4 hr | 144-node system becomes real | Layers 1-3 |
| **5** | Garden + Notifications | 14 hr | Practice times, habit growth | Layers 1-4 |
| **6** | Night Gate + Paravastha | 4 hr | Before-sleep consolidation | Layer 5 |
| **TOTAL** | | **~39.5 hr** | | |

### Recommended Sequence

```
Week 1: Layer 0 (AI tier: verify Souffle + resurrect wllama) + Layer 1 (Tier → PracticeEngine)
Week 2: Layer 0.3-0.4 (wllama cascade + compressed prompt) + Layer 4.1-4.3 (DAG wiring basics)
Week 3: Layer 2 (Mastery in UI) + Layer 4.4-4.5 (PLAY gate + sync verification)
Week 4: Layer 3 (Scaffolding → Identity) + Layer 5.1-5.2 (Garden data + UI)
Week 5: Layer 5.3-5.4 (Notifications + Calendar) + Layer 6 (Night Gate)
```

### The Kriya Principle Applied to Development

Kriya starts with one thing: sit down. This roadmap starts with one thing: **wire the tier to the engine.** Everything else grows from that root. Don't build the garden before the seed is planted. Don't add notifications before the session duration is correct. Don't fade prompts before the student can see their mastery level.

**One tree at a time.**
