---
description: AI + DAG Harmonization Maturation Map — how the Troubadour and the workbook grow into each other
---

# AI + DAG Harmonization — Maturation Map
> **The Troubadour is not a chatbot. The DAG is not a syllabus. They are one system.**
> Updated: 2026-06-01
> **New:** Three hardware tiers + comprehensive Claims Map (`docs/CLAIMS_MAP.md`)

---

## THE VISION

The student opens the app. The Troubadour speaks:

> "Welcome to Voix Vive. I am your guide on the 12-fret journey. 
> You are an instrument playing an instrument. 
> Today we begin at Fret 1 — the Root Note. 
> Close your eyes. Breathe. Over."

The student breathes. The app waits.

> "Ready?"

> "Ready."

> "Copy. Go ahead. The Root Note is not a place on the neck. 
> It is the place inside you that says 'I am here.' 
> Imagine the low E string vibrating. Feel it in your chest. 
> Do not play yet. Just imagine. Over."

The student imagines. The app waits.

> "Ready?"

> "Ready."

> "Copy. Go ahead. Now hum the E. Let your voice find it. 
> The guitar will meet you there. Over."

The student hums. The app listens (pitch detection). 

> "Beautiful. You hummed an E at 82.4 Hz. 
> Now play the open low E string. Over."

The student plays. The app compares hum vs. played pitch.

> "That's incredible. The music is the voice of your heart. 
> Fret 1, Node 1 — complete. 
> Tomorrow, Fret 2 — the Minor 2nd. 
> Trust the process. Over."

**This is the harmonized system.** The DAG defines the path. The Troubadour walks it with the student. The Net Protocol governs the interaction. BE→DO→PLAY governs the pedagogy.

---

## KEY DECISIONS (2026-05-28 Session)

### 1. Student-Hosted AI (Not Cloud, Not Joshua-Hosted)
The AI runs on the STUDENT'S machine. Tauri desktop app packages everything.
- **Bertrand:** Owns website, coaching business. Zero AI hosting cost.
- **Joshua:** Owns platform code. No obligation to host inference.
- **Student:** Owns their laptop. AI is local, private, offline-capable.

### 2. Tauri Desktop (Not Web-First, Not Android-First)
Tauri wraps the existing React app in a native desktop shell.
- **Bundle:** 50MB (vs 150MB Electron)
- **Backend:** Rust (spawns AI server, native audio, hardware detection)
- **Phone:** Connects via Tailscale to laptop's local AI
- **Casting:** Chromecast/Miracast for TV practice

### 3. Three Hardware Tiers (Reframed 2026-06-01)

The maturation map is now organized by **hardware requirement**, not by AI layer name.

#### Tier 1: No Hardware (Web-Only) — Souffle + Voix
**What the student needs:** A web browser. Nothing else.
**Download:** 0–2.65 GB (optional, cached in browser OPFS)
**Server:** None.

| Sub-Tier | Size | Models | What Works |
|----------|------|--------|-----------|
| **Souffle** (baseline, always on) | 0 MB | None | Offline keyword prompts (18 categories), Web Speech API TTS, all 12 tools, curriculum slides, progress tracking, .voixvive savestate export |
| **Voix** (upgrade, toggleable) | ~2.65 GB | LFM2.5-1.2B-Instruct (~700 MB) + Qwen3-TTS 0.6B (~1.65 GB) + Kokoro-82M fallback (~300 MB) | Generative AI chat with DAG-aware compressed prompt (~500 tokens), neural TTS with voice cloning, hands-free voice input, Net Protocol "Over.", 143 automated tests verifying behavior |

**Code:** `useTroubadourAI.js`, `useWllamaTroubadour.js`, `useKokoroTTS.js`, `useVoiceInput.js`, `troubadourOffline.js`, `troubadourPrompt.js`
**Docs:** `docs/07_MINIMUM_AI_MODE.md`, `docs/CLAIMS_MAP.md`

#### Tier 2: Low Hardware (~6 GB RAM) — Chant Lite
**What the student needs:** Laptop with ~6 GB free RAM.
**Download:** ~6 GB (StepAudio Mini Q4)
**Server:** Runs locally on student's machine.

| Feature | Model | What Works |
|---------|-------|-----------|
| Full voice AI | StepAudio Mini (~6 GB, Q4) | Speech-to-speech, natural conversation, paralinguistics |
| Curriculum RAG | Local vector DB | AI retrieves from curriculum docs for accurate, hallucination-free answers |
| Calendar-aware pacing | Google Calendar integration | AI adjusts practice schedule based on student's actual calendar |
| Local storage archive | Drive/Filesystem | All practice journals, recordings, reflections stored locally, searchable |

**Code:** `audioStreamingService.js` (needs StepAudio Mini endpoint), `calendarService.js` (extend for practice events), `localDatabase.js`
**Docs:** `docs/05_KRIYA_DELIVERY_SYSTEM.md` §5.5, `docs/CLAIMS_MAP.md`
**Status:** 🔴 NOT IMPLEMENTED. No StepAudio Mini model configured. No RAG. Calendar only books mentor reviews.

#### Tier 3: Pro Hardware (~20 GB VRAM) — Chant
**What the student needs:** Workstation with ~20 GB VRAM, or cloud GPU instance.
**Download:** ~19 GB (StepAudio R1.1 33B Q4)
**Server:** Local (Strix Halo) or cloud vLLM.

| Feature | Model | What Works |
|---------|-------|-----------|
| Full Troubadour | StepAudio R1.1 33B | Complete pedagogical depth, voice cloning, emotional nuance, Net Protocol |
| Mentor dashboard | Supabase + dashboard | Bertrand reviews student DAG traversal, submission queue |
| Async video feedback | Supabase submissions | Student submits video → Bertrand reviews → feedback injected into Troubadour context |
| Biofeedback | Fitbit/smartwatch | Heart rate gates practice behind calm-state check |

**Code:** `MentorDashboard.jsx`, `audioStreamingService.js`, `useBackendBridge.js`, `supabase.js`
**Docs:** `BERTRAND_EXECUTIVE_BRIEF.md`, `docs/07_BERTRAND_MENTORSHIP_INTEGRATION.md`
**Status:** 🟡 PARTIAL. Server connection code exists. Dashboard exists. But 0% of students have the server running. Video submission infra exists but not wired to mentor workflow.

### 4. Development AI (Joshua's Workstation Only)
**Nemotron 120B** — generates static content: troubadourPrompts, tutorial scripts, reflection prompts
- NOT used in production — content is baked into the app at build time
- Runs on Joshua's Strix Halo during development only
- **Pattern:** Fire and forget. Build code while Nemotron writes.

---

## MATURATION PHASES

### PHASE A: DAG FOUNDATION (60% Complete)
**Status:** ✅ `dagNodes.js` (Fret 1 complete, Fret 2-12 metadata + some prompts)
**Status:** ✅ `dagEdges.js` (prerequisite logic, unlock detection)
**Status:** ✅ `dagTypes.js` (JSDoc type definitions)
**Status:** ✅ `useDAGProgress.js` (React hook, phase tracking)
**Status:** ✅ `FRET_METADATA` (all 12 frets: intervals, ratios, Hz, emotions)
**Status:** 🟡 `ScaffoldingProvider.jsx` (DAG props exist but NO component calls them)

**Remaining:**
- 📝 Generate troubadourPrompt text for Fret 2-12 (Nemotron: Fret 2-4 done, 5-12 pending)
- 📝 Parse Nemotron output and integrate into `dagNodes.js`
- 🔴 **Wire DAG into live UI** — BEWorkbook tab, DAGProgressBar, "Mark Complete" buttons
- 🔴 **Parse Nemotron output for Fret 5-12** → inject into `dagNodes.js`
- 🔴 **4-level mastery** — port Day Dream's Encountered→Experienced→Owned→Mastered per phase
- 🔴 **Depth prompts** — "Go Deeper" Socratic question per node
- 🔴 **Synergy system** — cross-pillar bonuses for same-fret completions
- 🔴 **StudentTrail** — record choice data, not just node IDs

**Gate:** Student opens Playbook → sees 144-node BE→DO→PLAY checklist → can mark nodes complete → progress persists across sessions.
**Honest blocker:** The DAG is a ghost system. Beautiful code, zero UI surface area.

---

### PHASE B: TAURI APP SCAFFOLD (New — Precedes Prompt v4)
**Goal:** Desktop app that packages the web app + spawns local AI.

**Workflows:**
- `tauri-scaffold.md` — Create Tauri project, move React app
- `tauri-hardware-detection.md` — Rust module: detect GPU/RAM, select model tier
- `tauri-ai-spawner.md` — Spawn vLLM/llama.cpp as child process
- `tauri-native-audio.md` — Replace Web Audio with native recording/playback

**Gate:** App installs, detects hardware, downloads correct model, starts local server.

---

### PHASE B: MECHANICAL MODE (NEW — The No-AI Student Experience)
**Goal:** The 144-node DAG is visible, usable, and completable WITHOUT any AI. All Day Dream patterns ported.

**Why this exists:** Research revealed the DAG is a "ghost system" — beautiful code, zero UI surface area. Students use the legacy 12-fret system. This phase makes the DAG real.

**Workflows:**
- `dag-ui-wiring.md` — Wire DAGProgressBar + BEWorkbook into PlaybookShell as 5th tab
- `dag-mark-complete.md` — "Mark Complete" buttons on SlideViewer, PitchRoom, tools
- `dag-daydream-mastery.md` — Port 4-level mastery: Encountered→Experienced→Owned→Mastered per phase
- `dag-daydream-depth.md` — "Go Deeper" Socratic prompts per node
- `dag-daydream-synergy.md` — Cross-pillar resonance bonuses (same fret, different pillars)
- `dag-daydream-trail.md` — StudentTrail: record HOW student completed (rushed, explored, etc.)
- `dag-somatic-gate.md` — Pitch-match unlocks progression (mechanical, no AI needed)
- `dag-audiation-pause.md` — Mandatory 3-5s "Silent Space" before vocalization (Edwin Gordon)
- `dag-tts-narration.md` — Browser TTS reads slides aloud (hands-free mechanical)
- `dag-voice-commands.md` — Web Speech API: "Next", "Back", "Repeat" (hands-free)

**Gate:** Student opens app → sees 144-node workbook → clicks through BE→DO→PLAY → pitch match unlocks → completes without screen. No AI server required.
**Key finding from research:** This is 2-3 days of focused work. All tools exist (Web Speech API, Web TTS, pitch detection). Just needs wiring.

---

### PHASE C: TROUBADOUR PROMPT MATURATION v4
**Goal:** The system prompt knows about the DAG, speaks in BE→DO→PLAY phases, uses Net Protocol.

**Workflows:**
- `prompt-v4-dag-context.md` — Inject current node, prerequisites, phase into prompt
- `prompt-v4-net-protocol.md` — "Over/Ready/Copy/Go ahead/Wait" in prompt + post-processing
- `prompt-v4-be-do-play.md` — Phase-specific language injection
- `prompt-v4-math-language.md` — Hz, cents, ratios for ear training

**Gate:** Troubadour responds differently based on current DAG node. Always ends with "Over."

---

### PHASE D: GUIDED TUTORIAL ("The Class")
**Goal:** First-time student gets a 20-minute voice-first walkthrough.

**Workflows:**
- `class-mode-shell.md` — Audio-first UI component
- `class-tutorial-script.md` — The actual script the Troubadour speaks → **Nemotron task**
- `class-be-do-play-sm.md` — State machine for imagination → singing → playing
- `class-hands-free-nav.md` — Voice commands to open portals/tools

**Gate:** New student completes tutorial without touching the screen.

---

### PHASE E: EITHER/OR VOICE SYSTEM
**Goal:** Student can choose Real Bertrand, AI Bertrand, or Generic Troubadour.

**Workflows:**
- `voice-toggle-arch.md` — Settings UI + backend routing
- `real-bertrand-library.md` — Curated clip library from recordings
- `ai-bertrand-pipeline.md` — LLM text → speech tokens → token2wav
- `generic-troubadour-voice.md` — Default non-Bertrand voice option

**Gate:** Student toggles voice in settings. All three modes produce audio.

---

### PHASE F: DYNAMIC DAG TRAVERSAL
**Goal:** Troubadour suggests next node, adapts to student progress, paces via Net Protocol.

**Workflows:**
- `dag-troubadour-context.md` — How DAG state injects into every prompt
- `adaptive-pacing.md` — Speed up/slow down based on student response time
- `socratic-routing.md` — Troubadour asks questions before revealing answers
- `reflection-prompts.md` — Journal prompts generated from DAG node context

**Gate:** Troubadour says "Next, I suggest Fret 3 Pitch Room because you completed Fret 2 yesterday" and is correct.

---

### PHASE G: ASYNC MENTORSHIP BRIDGE
**Goal:** Bertrand reviews student submissions with full DAG context.

**Workflows:**
- `submission-dag-context.md` — Each submission includes: node path, phase, attempts
- `mentor-dashboard-dag.md` — Bertrand sees student's DAG traversal
- `feedback-injection.md` — Bertrand's written feedback becomes Troubadour context

**Gate:** Bertrand opens dashboard, sees: "Joshua completed Fret 3 BE phase in 4 minutes, struggled with DO phase humming, played successfully on 3rd attempt."

---

## DEPENDENCY GRAPH (Updated)

```
PHASE A (DAG Structure — 60% done)
    │
    ├──> PHASE B (Mechanical Mode) ──> PHASE C (Tauri Scaffold)
    │    │                                 │
    │    │ Wire DAG into UI                 │ Package for desktop
    │    │ 4-level mastery                   │ Spawn local AI
    │    │ Somatic Gate (pitch unlock)       │ Hardware detection
    │    │ Audiation pause                  │
    │    │ No AI required                   │
    │    │                                  │
    │    └──> PHASE D (Prompt v4) <─────────┘
    │              │
    │              └──> PHASE E (Tutorial)
    │                       │
    │                       └──> PHASE F (Either/Or Voice)
    │                                │
    └──> PHASE G (Dynamic DAG) <─────┘
              │
              └──> PHASE H (Mentorship)
```

**New insight:** Mechanical Mode must come BEFORE Tauri because students can use the web app RIGHT NOW. The DAG needs UI surface area before packaging matters. Tauri then adds local AI spawning on top of an already-working mechanical system.

**Phase ordering principle:**
1. Make the DAG usable (Mechanical) →
2. Package it for desktop (Tauri) →
3. Add AI text chat (Prompt v4) →
4. Add AI voice (Tutorial/Voice) →
5. Make AI adaptive (Dynamic) →
6. Connect mentor (Mentorship)

**Rule:** No phase starts until the previous phase's gate is met.

---

## WORKFLOW INDEX

| Workflow | Phase | Description | File |
|----------|-------|-------------|------|
| `dag-structure.md` | A | Node graph, edges, prerequisites | `.windsurf/workflows/dag-structure.md` |
| `dag-data-schema.md` | A | TypeScript interfaces, storage | `.windsurf/workflows/dag-data-schema.md` |
| `dag-progress-engine.md` | A | Unlock logic, progress tracking | `.windsurf/workflows/dag-progress-engine.md` |
| `dag-ui-wiring.md` | B | Wire DAG into Playbook + SlideViewer | `.windsurf/workflows/dag-ui-wiring.md` |
| `dag-mark-complete.md` | B | "Mark Complete" buttons across app | `.windsurf/workflows/dag-mark-complete.md` |
| `dag-daydream-mastery.md` | B | 4-level mastery per phase | `.windsurf/workflows/dag-daydream-mastery.md` |
| `dag-daydream-depth.md` | B | "Go Deeper" Socratic prompts | `.windsurf/workflows/dag-daydream-depth.md` |
| `dag-daydream-synergy.md` | B | Cross-pillar resonance bonuses | `.windsurf/workflows/dag-daydream-synergy.md` |
| `dag-daydream-trail.md` | B | StudentTrail with choice recording | `.windsurf/workflows/dag-daydream-trail.md` |
| `dag-somatic-gate.md` | B | Pitch-match unlocks progression | `.windsurf/workflows/dag-somatic-gate.md` |
| `dag-audiation-pause.md` | B | Mandatory "Silent Space" before vocalization | `.windsurf/workflows/dag-audiation-pause.md` |
| `dag-tts-narration.md` | B | Browser TTS reads slides aloud | `.windsurf/workflows/dag-tts-narration.md` |
| `dag-voice-commands.md` | B | Web Speech API navigation | `.windsurf/workflows/dag-voice-commands.md` |
| `prompt-v4-dag-context.md` | D | DAG-aware system prompt | `.windsurf/workflows/prompt-v4-dag-context.md` |
| `prompt-v4-net-protocol.md` | D | Military radio protocol in AI | `.windsurf/workflows/prompt-v4-net-protocol.md` |
| `prompt-v4-be-do-play.md` | D | Phase-specific pedagogy language | `.windsurf/workflows/prompt-v4-be-do-play.md` |
| `prompt-v4-math-language.md` | D | Hz, cents, ratios for ear training | `.windsurf/workflows/prompt-v4-math-language.md` |
| `class-mode-shell.md` | E | Audio-first UI component | `.windsurf/workflows/class-mode-shell.md` |
| `class-tutorial-script.md` | E | Troubadour's first-session script | `.windsurf/workflows/class-tutorial-script.md` |
| `class-be-do-play-sm.md` | E | Imagination → singing → playing state machine | `.windsurf/workflows/class-be-do-play-sm.md` |
| `class-hands-free-nav.md` | E | Voice commands for app navigation | `.windsurf/workflows/class-hands-free-nav.md` |
| `voice-toggle-arch.md` | F | Either/Or voice architecture | `.windsurf/workflows/voice-toggle-arch.md` |
| `real-bertrand-library.md` | F | Curated recording clip library | `.windsurf/workflows/real-bertrand-library.md` |
| `ai-bertrand-pipeline.md` | F | LLM → token2wav → audio | `.windsurf/workflows/ai-bertrand-pipeline.md` |
| `generic-troubadour-voice.md` | F | Default non-Bertrand voice | `.windsurf/workflows/generic-troubadour-voice.md` |
| `dag-troubadour-context.md` | G | DAG state → prompt injection | `.windsurf/workflows/dag-troubadour-context.md` |
| `adaptive-pacing.md` | G | Speed up/slow down | `.windsurf/workflows/adaptive-pacing.md` |
| `socratic-routing.md` | G | Question-before-answer routing | `.windsurf/workflows/socratic-routing.md` |
| `reflection-prompts.md` | G | Auto-generated journal prompts | `.windsurf/workflows/reflection-prompts.md` |
| `submission-dag-context.md` | H | Submission metadata with DAG path | `.windsurf/workflows/submission-dag-context.md` |
| `mentor-dashboard-dag.md` | H | Bertrand sees DAG traversal | `.windsurf/workflows/mentor-dashboard-dag.md` |
| `feedback-injection.md` | H | Written feedback → AI context | `.windsurf/workflows/feedback-injection.md` |
| `slide-image-generation.md` | M | Generate ~35 missing slide images via ComfyUI (llama.cpp API + Nemotron review, existing stock as style ref) | End of Phase C |
| `async-video-review.md` | H | 15-min structured practice block → async mentor review overlay ($45 tier) | Phase D |
| `quick-audio-critique.md` | M | 3-min clip → text response ($5 tier) | Phase D |
| `google-drive-integration.md` | M | Student recordings → personal Google Drive (data sovereignty) | Phase D |
| `youtube-content-pillars.md` | L | 90-sec shorts: S.H.E.A.R.L., Play/Sing, Feel/Improv | Content strategy |

---

## CURRENT STATUS (Updated 2026-06-01 — Voix Tier Implemented, Pre-Browser Test)

| Phase | Status | % Complete | What's Done | What's Left |
|-------|--------|------------|-------------|-------------|
| A: DAG Foundation | � Nearly Complete | 85% | `dagNodes.js` (Fret 1 complete, 2-12 metadata), `dagEdges.js`, `dagTypes.js`, `useDAGProgress.js`, `tractionStore.js` extended with DAG phase tracking, `ScaffoldingProvider.jsx` wired with DAG navigation, unit tests written | Parse Nemotron output → inject 121 prompts into `dagNodes.js` |
| B: Mechanical Mode | ✅ COMPLETE | 100% | BEWorkbook tab. Mark Complete on SlideViewer + PitchRoom. 4-level mastery. Cross-pillar resonance. Somatic Gate. Audiation Pause. DAG→legacy sync. | Gate met. |
| **B+: Voix Tier** | **✅ COMPLETE** | **100%** | **`useKokoroTTS.js` (neural TTS), `useWllamaTroubadour.js` (LFM2.5-1.2B-Instruct GGUF), `useVoiceInput.js` (Web Speech Recognition), `useTroubadourAI.js` rewired with Qwen3→Kokoro→WebSpeech TTS cascade, `TroubadourWidget.jsx` "Load Living Voice" button + voice input + status lights, 143 tests passing** | **Browser test with real audio, download GGUF model** |
| C: Prompt v4 | 🟡 Partial | 60% | `buildCompressedPrompt()` for Voix tier (~500 tokens, fret/phase/polarity-aware), `buildTroubadourPrompt()` for Chant tier, `enforceOver()` post-processing, Net Protocol "Over." enforced | Inject Hz/cents/ratio math language, test with real LLM inference |
| D: Guided Tutorial | 🔴 Not started | 0% | — | Class mode UI shell, 20-min script (Nemotron task), BE→DO→PLAY state machine, hands-free voice nav |
| E: Either/Or Voice | 🟡 Partial | 50% | `useVoiceInput.js` (Web Speech Recognition), `useKokoroTTS.js` (neural TTS), `audioStreamingService.js` (StepAudio), voice cascade: local STT → StepAudio fallback | Qwen3-TTS 0.6B ONNX integration, Silero VAD always-on, Whisper Base ONNX |
| F: Dynamic DAG | 🔴 Not started | 0% | — | Adaptive pacing, socratic routing, reflection prompts auto-generated from node context |
| G: Async Mentorship | 🔴 Not started | 0% | — | Submission metadata with DAG path, mentor dashboard, feedback injection into Troubadour context |

---

## WHAT GOT DONE TODAY (2026-05-28)

**Code (Cascade):**
| File | Lines | What |
|------|-------|------|
| `src/data/dag/dagNodes.js` | 284 | Fret 1 complete (11 nodes with prompts). Fret 2-12 metadata complete (intervals, ratios, Hz, emotions). 144 nodes total defined. |
| `src/data/dag/dagEdges.js` | 162 | Edge map builder, unlock detection, recommendation engine |
| `src/data/dag/dagTypes.js` | 60 | JSDoc types for DAGNode, DAGEdge, DAGProgress, PhaseState |
| `src/hooks/useDAGProgress.js` | 200 | React hook: currentNode, unlockedNodes, completedNodes, recommendedNodes, phase completion |
| `src/data/tractionStore.js` | +161 | Added: `currentNodeId`, `completedNodes`, `beCompleted`/`doCompleted`/`playCompleted`, `completeDAGPhase()`, `attemptDAGPhase()`, `getCurrentPhase()`, `setCurrentNode()`, `completeNode()` |
| `src/components/ScaffoldingProvider.jsx` | +47 | Exposed: `currentNodeId`, `currentNode`, `currentFret`, `currentPhase`, `completedNodes`, `nextRecommended`, `completePhase()`, `advanceNode()`, `navigateToNode()` |
| `src/hooks/__tests__/dagNodes.test.js` | 97 | Unit tests: node completeness, unique IDs, prerequisite validation, milestone existence |
| `TAURI_ARCHITECTURE.md` | 431 | Student-hosted AI, hardware tiers, Tauri desktop plan |
| `AI_CASCADE_SPLIT.md` | 187 | Task split between Nemotron and Cascade |

**Text Generation (Nemotron):**
- Fret 2 prompts: ✅ (1871 chars)
- Fret 3 prompts: ✅ (2378 chars)
- Fret 4 prompts: ✅ (1919 chars, after retry)
- Fret 5 prompts: 🔄 In progress...
- Frets 6-12: 🔄 Pending

**Infrastructure:**
- `scripts/openclaw/generate_prompts.sh` — Fire-and-forget Nemotron runner with retry logic
- `scripts/openclaw/mcp_voixvive_workflow.py` — MCP tool workflow (unused, Nemotron can't sustain MCP)
- `.cascade_checkpoints/GO_COOK.md` — Session summary and next steps

---

## WHAT REMAINS (Honest Assessment)

**Phase A Gate — "All 144 nodes have complete metadata":**
- [ ] Nemotron finishes generating Fret 5-12 prompts (background, dev-only)
- [ ] Parse Nemotron JSON output for Fret 2-4 (already generated)
- [ ] Inject all prompts into `dagNodes.js` (static content, baked at build)
- [ ] Validate every node has `troubadourPrompt` + add `depthPrompt` field

**Phase B Gate — "Student completes Fret 1 without touching the screen":**
- [ ] Wire BEWorkbook into PlaybookShell as 5th tab
- [ ] Wire DAGProgressBar into landing/orientation views
- [ ] Add "Mark Complete" to SlideViewer (after last slide)
- [ ] Add "Mark Complete" to PitchRoom (after successful pitch match)
- [ ] Port 4-level mastery from Day Dream (encountered→experienced→owned→mastered)
- [ ] Add `depthPrompt` per node + "Go Deeper" UI
- [ ] Add cross-pillar synergy system (same fret, different pillars)
- [ ] Build StudentTrail (record choice data, not just node IDs)
- [ ] Build Somatic Gate: pitch match unlocks next node progression
- [ ] Build Audiation Pause: 3-5s mandatory silence before vocalization
- [ ] Add browser TTS for slide narration (hands-free)
- [ ] Add Web Speech API voice commands ("Next", "Back", "Repeat")
- [ ] Sync DAG progress to legacy `traction` metric (prevent divergence)

**Phase C Gate — "App installs, detects hardware, downloads model, starts server":**
- [ ] `cargo create-tauri-app` in project root
- [ ] Move React app into Tauri shell
- [ ] Rust hardware detection module (GPU, RAM, OS)
- [ ] Model selection logic (Tier A/B/C/D/E)
- [ ] Model download manager (progress bar, resume)
- [ ] **Target models:** StepAudio 2.5 (for Tier A when available), StepAudio R1.1 (current), Gemma-4B, Phi-3-mini
- [ ] Spawn vLLM/llama.cpp as child process
- [ ] Health check and auto-restart

**Phase D Gate — "Troubadour responds differently based on DAG node":**
- [ ] `buildSystemPrompt()` reads `currentNodeId` from ScaffoldingContext
- [ ] Injects: node title, phase, prerequisites, emotional character
- [ ] Injects Net Protocol rules: "End every statement with Over."
- [ ] Injects BE→DO→PLAY phase language
- [ ] Injects Hz/cents/ratio for current fret
- [ ] Post-processing: verify "Over." at end of every response
- [ ] **Test with StepAudio R1.1** (localhost:9998) — verify DAG context flows through

**Phase E-F-G-H:** Not started. Each is a full sprint.

---

## NEW: DAY DREAM → VOIX VIVE PATTERN MAP

| Day Dream Pattern | Voix Vive Application | Phase | Effort |
|-------------------|----------------------|-------|--------|
| 4-level mastery (Encountered→Experienced→Owned→Mastered) | Replace boolean `beCompleted` with levels + timeSpent + depthExplored | B | 2 hrs |
| Synergy system (cross-word bonuses) | Cross-pillar resonance (Class-BE + Guitar-BE of same fret) | B | 3 hrs |
| Depth prompts (per-node Socratic) | "Go Deeper" button on each slide/tool | B | 4 hrs |
| StudentTrail with choices | Record HOW student completed (rushed, explored, etc.) | B | 2 hrs |
| Attunement scoring | Wire pillar completion to Troubadour Type in CharacterSheet | B | 2 hrs |
| Triple Sandwich layout | Render BE/DO/PLAY layers simultaneously per slide | B | 4 hrs |
| Channel color system | Map CAGED intervals → Mind/Heart/Body/Action colors | B | 1 hr |
| GameState machine | Formal BE_Imagine → DO_Listen → PLAY_Perform → Reflection | B | 3 hrs |

---

## NEXT ACTION

**Current Priority: PHASE B (Mechanical Mode)** — The DAG is a ghost. Beautiful architecture that no student has ever seen. Wire it into the live app FIRST, then add AI on top.

**Why Phase B before C (Tauri) or D (Prompt v4):**
1. Students use the web app TODAY. Mechanical mode works immediately.
2. No student runs local AI (StepAudio). The offline message is what 99% see.
3. The 144-node DAG is the core differentiator. It's invisible. Fix that first.
4. Day Dream proved 4-level mastery, synergy, depth prompts, and attunement work pedagogically. Port them.
5. Tauri is packaging. Packaging a ghost doesn't help. Package a working system.

**Background Task:** Nemotron continues generating Fret 5-12 prompts (Joshua's dev workstation, not production).

**Option 1 (Wire the DAG — RECOMMENDED):** Add BEWorkbook tab to PlaybookShell. Add "Mark Complete" to SlideViewer + tools. Port 4-level mastery. Build Somatic Gate + audiation pause. This is 2-3 days of focused work and makes the app fundamentally better for ALL students (with or without AI).

**Option 2 (Test Prompt v4):** Verify `buildSystemPrompt()` with StepAudio R1.1 (localhost:9998). Quick win but only affects the 1% of students with local AI.

**Option 3 (Build Tauri):** Start desktop packaging. Longer runway. Better done after Mechanical Mode is proven.

## PRACTICAL BRIDGE: Bertrand Weekly Async Evaluation

**The gap:** Beautiful code and 4-level mastery mean nothing if a 9-year-old can't navigate the app alone, or if the app doesn't actually improve their guitar playing.

**The solution:** Weekly 15-minute async review between Joshua and Bertrand.

**What Bertrand does (5 min):**
- Screenshots his student's BEWorkbook progress from that week
- Notes which frets stalled, which tools were ignored, where students got confused
- Records a 2-minute voice memo: "Fret 4 DO phase — nobody is using the Pitch Room. The interval names are too abstract. They need a song anchor."

**What Joshua does (5 min):**
- Reviews the voice memo
- Pushes one micro-fix to the app (new slide, renamed button, added hint)
- Updates the maturation map with the real-world blocker

**What the system does (5 min):**
- Logs the change in `feedback-injection.md` for future Troubadour context
- Tags the issue in the project tracker
- If 3+ students hit the same stall, auto-generates a Nemotron task for new content

**Why this matters:**
- **Marketing:** Bertrand becomes a co-creator, not just a client. He tells other teachers about "our app."
- **Pedagogy:** The 144-node DAG is theory. Bertrand's 20 years of teaching is ground truth.
- **Iteration:** 1 week from classroom observation to deployed fix. No other edtech platform moves this fast.
- **Trust:** When students see their real teacher's voice in the app, the AI is no longer a black box.

**Trigger:** Start this ritual as soon as Phase B (Mechanical Mode) is live and one student completes Fret 1 end-to-end.

---

**Remember:**
- Nemotron is dev-only. Never in production.
- StepAudio R1.1 (localhost:9998) is the current production AI runtime.
- **StepAudio 2.5** (end-to-end voice + paralinguistics) is the target upgrade — NOT YET DEPLOYED on ROCm.
- The web app is the product. Tauri packages it. AI enhances it. But the DAG + mechanical mode IS the product.
- **The Bertrand loop is the secret weapon.** Code without a teacher in the loop is a ghost system. Teacher without code is a bottleneck. Together they iterate at the speed of a classroom.
