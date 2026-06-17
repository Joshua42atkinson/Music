---
description: Comprehensive audit — what's hard, soft, and absent in the codebase vs. the maturation map
---

# AI + DAG Harmonization — Gap Analysis Audit
> **Date:** 2026-05-28
> **Auditor:** Cascade (AI assistant)
> **Scope:** Full codebase vs. Maturation Map (Phases A-F)

---

## LEGEND

| Symbol | Meaning |
|--------|---------|
| ✅ **HARD** | Already solid. Minor wiring only. |
| 🟡 **SOFT** | Exists but needs changes to harmonize with AI/DAG. |
| 🔴 **ABSENT** | Completely missing. Must be built from scratch. |
| ⚡ **AI-CRITICAL** | Must be injected into Troubadour system prompt. |

---

## 1. DATA LAYER (Phase A: DAG Foundation)

### 1.1 Traction Store (`src/data/tractionStore.js`)

| Field | Status | Notes | AI-Inject? |
|-------|--------|-------|------------|
| `bardLevel` | ✅ HARD | Derived from totalTraction. Works. | ✅ Yes |
| `totalTraction` | ✅ HARD | Aggregated per-fret. Works. | ✅ Yes |
| `practiceMinutes` | ✅ HARD | Tracked with streak. Works. | ✅ Yes |
| `streak` | ✅ HARD | Consecutive days. Works. | ✅ Yes |
| `fretsUnlocked` | 🟡 SOFT | Array of fret IDs. **Missing:** *why* it unlocked (which node triggered it). | ✅ Yes |
| `frets[]` per-fret state | 🟡 SOFT | Has `yinCompleted`, `yangCompleted`, `traction`, `pitchAccuracy`. **Missing:** `beCompleted`, `doCompleted`, `playCompleted` — the three phases per fret. | ✅ Yes |
| `breathingSessions` | ✅ HARD | Counter. Works. | ✅ Yes |
| `settings.scaffoldingLevel` | ✅ HARD | Auto-fades visual aids. Works. | No |

**VERDICT:** Per-fret state exists but lacks BE/DO/PLAY phase granularity. The yin/yang flags map to something *like* BE/DO, but they are binary (completed/not) rather than stateful (in-progress/ready/completed). **SOFT — needs `phase` field.**

---

### 1.2 Local Database (`src/data/localDatabase.js`)

| Table | Status | Notes |
|-------|--------|-------|
| `progress` | 🟡 SOFT | `fretId, completed, lastAccessed`. **Missing:** node-level granularity. One row per fret, not per node. |
| `journal` | ✅ HARD | `fretId, toolId, timestamp, mood`. Good. |
| `questLog` | ✅ HARD | `fretId, event, timestamp`. Event-driven logging. |
| `vertiscaleSessions` | ✅ HARD | `phase, patternId, timestamp, successful`. Per-session tracking. |
| `recordings` | ✅ HARD | `exerciseName, timestamp, reviewed, feedback`. Async assessor. |
| **Missing table:** `dagNodes` | 🔴 ABSENT | No node-level completion tracking. |
| **Missing table:** `dagProgress` | 🔴 ABSENT | No "current node," "next recommended," or "path history." |
| **Missing table:** `aiConversations` | 🔴 ABSENT | No per-node conversation history with Troubadour. |

**VERDICT:** IndexedDB is well-structured for the OLD architecture (per-fret). The DAG needs per-node tables. **SOFT — can add columns to existing tables or create new ones.**

---

### 1.3 Scaffolding Provider (`src/components/ScaffoldingProvider.jsx`)

| Feature | Status | Notes |
|---------|--------|-------|
| LocalStorage read/write | ✅ HARD | Fast sync. Works. |
| IndexedDB backup | ✅ HARD | Async fallback. Works. |
| Supabase cloud sync | ✅ HARD | Auth listener, cloud hydration, migration. Works. |
| Context exposes `traction` | ✅ HARD | All components can read. Works. |
| Context exposes `updateTraction` | ✅ HARD | Single mutation point. Works. |
| **Missing:** `currentDAGNode` | 🔴 ABSENT | No concept of "where the student is in the DAG." |
| **Missing:** `nextRecommendedNode` | 🔴 ABSENT | No concept of "what the Troubadour should suggest next." |
| **Missing:** `nodeHistory` | 🔴 ABSENT | No breadcrumb trail of completed nodes. |
| **Missing:** `phaseState` | 🔴 ABSENT | No BE/DO/PLAY phase tracking per node. |

**VERDICT:** The provider is excellent for the OLD architecture. The DAG needs new state slices. **SOFT — can extend with new context properties.**

---

## 2. TROUBADOUR AI (Phase B: Prompt Maturation)

### 2.1 System Prompt (`src/components/AmbientPlayer.jsx → buildSystemPrompt()`)

| Section | Status | Notes | AI-Inject? |
|---------|--------|-------|------------|
| IDENTITY | 🟡 SOFT | "Medieval bard who walked the 12-fret path." **Missing:** Bertrand's actual phrases ("You are an instrument playing an instrument"), French expressions, BE/DO/PLAY protocol language. | ⚡ CRITICAL |
| PLATFORM KNOWLEDGE | ✅ HARD | Three portals, 12-fret map, three protocols, game phases. Solid. | ✅ Yes |
| THIS STUDENT | 🟡 SOFT | Bard Level, streak, frets completed, traction detail. **Missing:** current DAG node, Troubadour Type, BE/DO/PLAY phase, last journal entry. | ⚡ CRITICAL |
| HARD RULES | ✅ HARD | 6 rules are well-designed. Good guardrails. | No |
| **Missing section:** DAG CONTEXT | 🔴 ABSENT | No "You are at Fret 3, Node class-be. Prerequisites: Fret 2 completed." | ⚡ CRITICAL |
| **Missing section:** NET PROTOCOL | 🔴 ABSENT | No "End every message with 'Over.' Wait for 'Ready.'" | ⚡ CRITICAL |
| **Missing section:** BE→DO→PLAY PHASE | 🔴 ABSENT | No "If BE phase: ask imagination question. If DO phase: ask to hum. If PLAY phase: ask to play." | ⚡ CRITICAL |
| **Missing section:** MATH LANGUAGE | 🔴 ABSENT | No "Name intervals by semitones, ratio, Hz, cents." | ⚡ CRITICAL |
| **Missing section:** VOICE MODE | 🔴 ABSENT | No "You are [Real Bertrand / AI Bertrand / Generic Troubadour]." | ⚡ CRITICAL |

**VERDICT:** The prompt is GOOD for a general-purpose assistant. It is INSUFFICIENT for the harmonized system. **SOFT — needs 4-5 new sections, plus dynamic injection from DAG state.**

---

### 2.2 Voice Mode Infrastructure (`src/lib/audioStreamingService.js`)

| Feature | Status | Notes |
|---------|--------|-------|
| WebSocket connection | ✅ HARD | Connects to middleware. Works. |
| Audio recording | ✅ HARD | MediaRecorder → WebSocket. Works. |
| Audio playback | ✅ HARD | Web Audio API. Works. |
| Text message handling | ✅ HARD | JSON parsing, transcript extraction. Works. |
| Paralinguistic events | ✅ HARD | Emotion detection callback. Works. |
| Persona switch (troubadour/bernard/bertrand) | 🟡 SOFT | Three personas defined. **Missing:** "Real Bertrand" vs "AI Bertrand" vs "Generic." **Missing:** voiceprint selection. | 🔴 ABSENT |
| **Missing:** Real Bertrand clip library | 🔴 ABSENT | No curated audio clips from recordings. |
| **Missing:** AI Bertrand voice generation | 🔴 ABSENT | No local LLM → speech token pipeline. |
| **Missing:** Voice mode toggle UI | 🔴 ABSENT | No settings for "Hear Real / AI / Generic." |

**VERDICT:** WebSocket audio pipeline is SOLID. Voice mode selection is missing. **SOFT — add voice mode routing; ABSENT — clip library and AI pipeline.**

---

### 2.3 Troubadour Types (Four Archetypes)

| Type | Status | Notes |
|------|--------|-------|
| The Storyteller (©FHEAL) | 🟡 SOFT | Mentioned in docs. **Missing:** Prompt voice variant. |
| The Craftsman (©SHEARL) | 🟡 SOFT | Mentioned in docs. **Missing:** Prompt voice variant. |
| The Ear (©PLING!) | 🟡 SOFT | Mentioned in docs. **Missing:** Prompt voice variant. |
| The Seeker (All three) | 🟡 SOFT | Mentioned in docs. **Missing:** Prompt voice variant. |
| **Missing:** Type detection | 🔴 ABSENT | No logic to infer type from practice data. |
| **Missing:** Type-based prompt injection | 🔴 ABSENT | Prompt doesn't change based on student type. |

**VERDICT:** Archetypes exist in docs but not in code. **SOFT — add type-based prompt variants; ABSENT — type detection logic.**

---

## 3. TUTORIAL / CLASS MODE (Phase C: Guided Tutorial)

### 3.1 Welcome Onboarding (`src/components/WelcomeOnboarding.jsx`)

| Feature | Status | Notes |
|---------|--------|-------|
| First-run modal | ✅ HARD | Shows once, stores flag. Works. |
| 3-slide intro | 🟡 SOFT | Text + emoji. **Missing:** Audio narration. **Missing:** BE→DO→PLAY demonstration. **Missing:** hands-free navigation instruction. |
| "Begin Your Journey" CTA | 🟡 SOFT | Navigates to app. **Missing:** No guided path. Student is dropped into the app. |
| **Missing:** Voice-first mode | 🔴 ABSENT | No audio narration. No "Close your eyes." |
| **Missing:** BE→DO→PLAY demo | 🔴 ABSENT | No demonstration of the three phases. |
| **Missing:** Hands-free instruction | 🔴 ABSENT | No "Say 'The Song' to open that portal." |
| **Missing:** Net Protocol training | 🔴 ABSENT | No "Say 'Over' when you're done. Say 'Ready' when you're ready." |

**VERDICT:** Onboarding is a visual welcome screen, not a class. **SOFT — can extend slides; ABSENT — voice-first class mode component.**

---

### 3.2 Game Engine (`src/game/VertiscaleEngine.jsx`)

| State | Status | Notes |
|-------|--------|-------|
| `BE_STEP` | ✅ **HARD — CRITICAL FINDING** | "BE > DO > HAVE — breath intention before Phase 1." The game ALREADY HAS a BE state! |
| `PHASE1` (SHEARL Flash) | ✅ HARD | "Perceive the pattern before placing fingers" — this IS the DO phase! |
| `PHASE2` (PLING! Orbs) | ✅ HARD | "Sing the pitch before playing it" — this IS the PLAY phase! |
| `PHASE3` (FHEAL summary) | ✅ HARD | "Session summary + journaling prompt" — reflection, the integration! |
| **Finding:** State machine exists | ✅ HARD | ENGINE_STATES already models BE→DO→PLAY! |

**VERDICT:** **MAJOR DISCOVERY.** The Vertiscale Engine already has BE_STEP → PHASE1 → PHASE2 → PHASE3. This IS the BE→DO→PLAY state machine, just named differently. **HARD — just needs to be harmonized with the Troubadour prompt and the DAG.**

---

## 4. VOICE MODES (Phase D: Either/Or)

### 4.1 Real Bertrand Clips

| Feature | Status | Notes |
|---------|--------|-------|
| Recording exists | ✅ HARD | `May 27 at 6-20 PM.m4a` is on disk. |
| Transcript exists | ✅ HARD | `BERTRAND_TRANSCRIPT_MAY27.txt` — 14,540 words. |
| Lexicon mined | ✅ HARD | `BERTRAND_LEXICON.md` — phrases, metaphors, teaching patterns. |
| Speaker embedding | ✅ HARD | `bertrand_speaker_embedding.npy` — 192-dim voiceprint extracted. |
| Clean clip segments | ✅ HARD | Podcast segments extracted with timestamps. |
| **Missing:** Clip library in app | 🔴 ABSENT | No JS data structure mapping phrases to audio files. |
| **Missing:** Audio file hosting | 🔴 ABSENT | Clips not in `/public/audio/` or CDN. |
| **Missing:** Playback integration | 🔴 ABSENT | No code to play "real_bertrand_welcome.wav" when triggered. |

**VERDICT:** All the CONTENT for Real Bertrand exists. The INTEGRATION is missing. **SOFT — create clip library; ABSENT — playback wiring.**

---

### 4.2 AI Bertrand Pipeline

| Feature | Status | Notes |
|---------|--------|-------|
| Step-Audio-2-mini loaded | ✅ HARD | BNB NF4, 6GB, runs on Strix Halo. |
| campplus.onnx loaded | ✅ HARD | Speaker embedding model works. |
| Speaker embedding extracted | ✅ HARD | `bertrand_speaker_embedding.npy` saved. |
| token2wav components verified | ✅ HARD | flow.pt, hift.pt, speech_tokenizer all present. |
| **token2wav inference tested** | 🟡 SOFT | Components load. **Did not complete end-to-end audio generation with LLM.** |
| **Missing:** LLM + token2wav pipeline | 🔴 ABSENT | No code that: (1) LLM generates text + speech tokens, (2) token2wav renders with Bertrand voiceprint. |
| **Missing:** Streaming audio response | 🔴 ABSENT | No chunked audio streaming for real-time voice. |

**VERDICT:** Components verified. Pipeline not wired. **SOFT — finish token2wav test; ABSENT — LLM→token2wav integration.**

---

### 4.3 Generic Troubadour Voice

| Feature | Status | Notes |
|---------|--------|-------|
| Default voice option | 🔴 ABSENT | No "Use default voice" setting. |
| Browser TTS fallback | 🟡 SOFT | `speechSynthesis` API exists in all browsers. Trivial to add. |

**VERDICT:** Trivial addition. **SOFT — add browser TTS option.**

---

## 5. DYNAMIC DAG (Phase E: Adaptive Traversal)

### 5.1 Node Graph Data

| Feature | Status | Notes |
|---------|--------|-------|
| `dagNodes.js` data file | 🔴 ABSENT | No JavaScript/TypeScript node definitions. |
| `dagEdges.js` adjacency list | 🔴 ABSENT | No prerequisite/suggestedAfter definitions. |
| `useDAGProgress` hook | 🔴 ABSENT | No "current node / next recommended / path history" logic. |
| **Existing:** Fret unlock logic | ✅ HARD | `updateFretTraction` already unlocks next fret at traction >= 60. |
| **Existing:** Chapter progress | ✅ HARD | `getChapterProgress` already tracks not-started / in-progress / completed. |

**VERDICT:** The DAG data structures are the biggest gap. **ABSENT — must build from scratch.**

---

### 5.2 Adaptive Pacing

| Feature | Status | Notes |
|---------|--------|-------|
| Response time tracking | 🔴 ABSENT | No measurement of how long student takes to respond. |
| Speed up / slow down logic | 🔴 ABSENT | No algorithm to adjust pacing. |
| Net Protocol timer | 🟡 SOFT | `turn_detection: { type: 'server_vad', threshold: 0.5 }` exists in audioStreamingService. **Can be extended.** |

**VERDICT:** Completely missing. **ABSENT.**

---

### 5.3 Socratic Routing

| Feature | Status | Notes |
|---------|--------|-------|
| Socratic questions in prompt | ✅ HARD | "If unsure, ask a Socratic question" is in HARD RULES. |
| Question-before-answer logic | 🔴 ABSENT | No structured "ask 3 questions before revealing." |
| Student response analysis | 🔴 ABSENT | No parsing of student answers to determine understanding. |

**VERDICT:** The prompt mentions Socratic method but has no structured routing. **ABSENT.**

---

## 6. MENTORSHIP (Phase F: Async Bridge)

### 6.1 Submission Context

| Feature | Status | Notes |
|---------|--------|-------|
| Video recordings table | ✅ HARD | `recordings` table in IndexedDB. |
| Submission reviewed flag | ✅ HARD | `reviewed, feedback` fields exist. |
| **Missing:** DAG path in submission | 🔴 ABSENT | No "Student completed Fret 3 BE→DO→PLAY in 15 minutes" metadata. |
| **Missing:** Phase attempt counts | 🔴 ABSENT | No "3 attempts on DO phase, 1 on PLAY phase." |
| **Missing:** Troubadour conversation log | 🔴 ABSENT | No "Student asked about tension 3 times." |

**VERDICT:** Submissions exist but lack DAG context. **SOFT — add metadata fields.**

---

### 6.2 Mentor Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| `/mentor` route | ✅ HARD | Exists in App.jsx. |
| `MentorDashboard` component | ✅ HARD | Exists (lazy-loaded). |
| **Missing:** DAG visualization | 🔴 ABSENT | No "see student's path through the graph." |
| **Missing:** AI-generated summary | 🔴 ABSENT | No "Joshua struggled with Fret 3 DO phase." |

**VERDICT:** Dashboard scaffold exists. Needs DAG data and AI summaries. **SOFT — extend dashboard.**

---

## SUMMARY TABLE

### By Phase

| Phase | % Complete | Biggest Gap |
|-------|------------|-------------|
| A: DAG Foundation | 30% | `dagNodes.js`, `dagEdges.js`, `useDAGProgress` hook |
| B: Prompt v4 | 60% | Net Protocol, BE→DO→PLAY phase injection, math language |
| C: Guided Tutorial | 15% | ClassMode component, voice-first UI, tutorial script |
| D: Either/Or Voice | 40% | Clip library, LLM→token2wav pipeline, voice toggle |
| E: Dynamic DAG | 5% | Node graph data, adaptive pacing, Socratic routing |
| F: Async Mentorship | 30% | DAG metadata in submissions, dashboard visualization |

### By File

| File | Status | Action Needed |
|------|--------|-------------|
| `tractionStore.js` | 🟡 SOFT | Add `beCompleted`, `doCompleted`, `playCompleted` per fret. Add `currentNodeId`. |
| `localDatabase.js` | 🟡 SOFT | Add `dagNodes` and `dagProgress` tables. |
| `ScaffoldingProvider.jsx` | 🟡 SOFT | Expose `currentDAGNode`, `nextRecommendedNode`, `nodeHistory`. |
| `AmbientPlayer.jsx` | 🟡 SOFT | Add DAG context, Net Protocol, BE→DO→PLAY phase, voice mode to `buildSystemPrompt()`. |
| `audioStreamingService.js` | 🟡 SOFT | Add voice mode routing. |
| `WelcomeOnboarding.jsx` | 🟡 SOFT | Extend to voice-first class mode OR replace with `ClassMode.jsx`. |
| `VertiscaleEngine.jsx` | ✅ HARD | Already has BE_STEP → PHASE1 → PHASE2 → PHASE3. Harmonize naming. |
| `playbookData.js` | ✅ HARD | Character sheet, quest log, journal exist. Just needs DAG node links. |
| `dagNodes.js` | 🔴 ABSENT | Must create from scratch. |
| `dagEdges.js` | 🔴 ABSENT | Must create from scratch. |
| `useDAGProgress.js` | 🔴 ABSENT | Must create from scratch. |
| `ClassMode.jsx` | 🔴 ABSENT | Must create from scratch. |
| `VoiceModeToggle.jsx` | 🔴 ABSENT | Must create from scratch. |
| `RealBertrandLibrary.js` | 🔴 ABSENT | Must create from scratch. |

---

## TOP 5 PRIORITIES (What's Softest + Most Impactful)

### 1. `dagNodes.js` + `dagEdges.js` (Phase A)
**Why:** Everything else depends on this. The Troubadour can't guide without a graph.
**Effort:** 2 hours.
**Impact:** Unlocks Phases B, C, E.

### 2. `buildSystemPrompt()` v4 (Phase B)
**Why:** The prompt is the AI's brain. Without DAG context, Net Protocol, and BE→DO→PLAY phases, the Troubadour is just a chatbot.
**Effort:** 1 hour.
**Impact:** Immediate improvement in AI coaching quality.

### 3. `VertiscaleEngine` ↔ DAG Harmonization (Phase A→C bridge)
**Why:** The game ALREADY HAS BE_STEP/PHASE1/PHASE2/PHASE3. It's 80% of the state machine we need. Just rename/map to BE→DO→PLAY and wire to DAG nodes.
**Effort:** 30 minutes.
**Impact:** Instant state machine for the guided tutorial.

### 4. `VoiceModeToggle` + `RealBertrandLibrary` (Phase D)
**Why:** The content exists (recordings, transcript, clips). Just needs integration.
**Effort:** 1 hour.
**Impact:** Student can choose Real vs. AI Bertrand.

### 5. `ClassMode.jsx` (Phase C)
**Why:** The first-run experience is the make-or-break moment. A 20-minute voice-first tutorial that teaches BE→DO→PLAY + Net Protocol + hands-free navigation.
**Effort:** 4 hours.
**Impact:** Student understands the system without reading.

---

## SURPRISING FINDINGS

1. **The Vertiscale Engine already has BE→DO→PLAY.** It's called BE_STEP → PHASE1 → PHASE2 → PHASE3. The game was built with this philosophy from the start. We just need to name it explicitly and wire it to the Troubadour.

2. **The audioStreamingService already has persona switching.** `troubadour`, `bernard`, `bertrand` personas exist. We just need to add "Real Bertrand" (clip playback) and "AI Bertrand" (LLM generation).

3. **The Playbook already has quest tracking.** `questLog` table logs events like "Started Fret 3." This is a DAG event log waiting for a graph.

4. **The prompt is 60% there.** Platform knowledge, hard rules, student context — all solid. Just needs 4-5 new sections.

---

## WHAT'S ACTUALLY HARD (Don't Touch)

- `tractionStore.js` — Per-fret state, unlock logic, scaffolding fade
- `ScaffoldingProvider.jsx` — Context, cloud sync, hydration
- `localDatabase.js` — IndexedDB schema, backup logic
- `audioStreamingService.js` — WebSocket, MediaRecorder, Web Audio playback
- `VertiscaleEngine.jsx` — Game state machine, scoring, pitch detection

These are production-ready. Harmonization means ADDING to them, not rewriting.

---

*Next: Start building Priority 1 (`dagNodes.js`) or Priority 2 (`buildSystemPrompt` v4)?*
