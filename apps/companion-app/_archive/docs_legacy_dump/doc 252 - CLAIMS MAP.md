# Voix Vive — Claims Map

> Every function and UI element mapped to the document that claims it. Updated 2026-06-01.

---

## 1. THREE HARDWARE TIERS

### Tier 1: No Hardware (Web-Only)
**Needs:** Web browser only. **Download:** 0–2.65 GB optional.

| Sub-Tier | Size | Models | Status |
|----------|------|--------|--------|
| **Souffle** (baseline) | 0 MB | None | Offline prompts, Web Speech TTS, all 12 tools, curriculum, progress tracking — **VERIFIED** |
| **Voix** (upgrade) | ~2.65 GB | LFM2.5-1.2B (~700 MB) + Qwen3-TTS (~1.65 GB) + Kokoro-82M (~300 MB) | Hooks created. LFM2.5 & Qwen3 models **NOT downloaded**. Kokoro NOT loaded. |

**Docs:** `07_MINIMUM_AI_MODE.md` §2, `BERTRAND_EXECUTIVE_BRIEF.md` §4

### Tier 2: Low Hardware (~6 GB RAM)
**Needs:** Laptop with ~6 GB free. **Download:** ~6 GB (StepAudio Mini Q4).

| Feature | Claimed In | Status |
|---------|-----------|--------|
| StepAudio Mini speech-to-speech | `07_MINIMUM_AI_MODE.md` | 🔴 NOT BUILT — no model, no endpoint |
| Curriculum RAG (local vector DB) | `05_KRIYA_DELIVERY_SYSTEM.md` | 🔴 NOT BUILT |
| Calendar-aware AI pacing | `05_KRIYA_DELIVERY_SYSTEM.md` §5.5 | 🔴 NOT BUILT |
| Local storage archive (Drive) | `05_KRIYA_DELIVERY_SYSTEM.md` §5.6 | 🔴 NOT BUILT — OAuth scope exists, unused |

### Tier 3: Pro Hardware (~20 GB VRAM)
**Needs:** Workstation or cloud GPU. **Download:** ~19 GB (StepAudio R1.1 33B Q4).

| Feature | Claimed In | Status |
|---------|-----------|--------|
| StepAudio R1.1 33B full voice | `07_MINIMUM_AI_MODE.md` §2.3, `BERTRAND_EXECUTIVE_BRIEF.md` | 🟡 PARTIAL — connection code exists, 0% of students have it running |
| Mentor dashboard + submission queue | `BERTRAND_EXECUTIVE_BRIEF.md` §2, `07_BERTRAND_MENTORSHIP_INTEGRATION.md` | 🟡 PARTIAL — UI exists, not wired to paid tiers |
| Async video feedback ($35) | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 PARTIAL — infra exists, no payment flow |
| Biofeedback (Fitbit/heart rate) | `BERTRAND_EXECUTIVE_BRIEF.md` §3.2 | 🔴 NOT BUILT |

---

## 2. AI / TROUBADOUR — DETAILED

| # | Function / UI | File | Claimed In | Status |
|---|--------------|------|-----------|--------|
| 1 | Offline keyword responses (18 categories) | `troubadourOffline.js` | `07_MINIMUM_AI_MODE.md` §2.1 | ✅ **VERIFIED** — 143 tests, 19 keyword groups + fret-aware fallback |
| 2 | Web Speech API TTS | `useTroubadourAI.js` | `07_MINIMUM_AI_MODE.md` §2.1, §4.4 | ✅ **VERIFIED** — auto-speaks, zero download |
| 3 | Compressed prompt (~500 tokens, fret/phase/polarity-aware) | `troubadourPrompt.js` | `07_MINIMUM_AI_MODE.md` §2.2 | ✅ **VERIFIED** — tested |
| 4 | Full prompt (~2000 tokens) | `troubadourPrompt.js` | `07_MINIMUM_AI_MODE.md` §2.3 | ✅ **VERIFIED** |
| 5 | Net Protocol "Over." enforcement | `troubadourPrompt.js:enforceOver()` | `07_MINIMUM_AI_MODE.md` §3 | ✅ **VERIFIED** |
| 6 | wllama GGUF inference hook | `useWllamaTroubadour.js` | `07_MINIMUM_AI_MODE.md` §2.2, `IMPLEMENTATION_ROADMAP.md` §0.2 | ✅ **IMPLEMENTED** — WASM CDN paths fixed. Model file NOT present. |
| 7 | LFM2.5-1.2B-Instruct in-browser LLM | `useWllamaTroubadour.js` | `07_MINIMUM_AI_MODE.md` §2.2 | 🟡 **PARTIAL** — code ready. `public/models/` is empty. |
| 8 | Kokoro-82M neural TTS | `useKokoroTTS.js` | `07_MINIMUM_AI_MODE.md` §4.2 | 🟡 **PARTIAL** — hook created, voice map configured. Model NOT loaded. |
| 9 | Voice input (Web Speech Recognition) | `useVoiceInput.js` | `07_MINIMUM_AI_MODE.md` §9 | ✅ **VERIFIED** — start/stop/error/locale. Tests passing. |
| 10 | AI chat streaming (multi-backend) | `useTroubadourAI.js` | `07_MINIMUM_AI_MODE.md` §2, `CODEBASE_AUDIT.md` §8 | ✅ **IMPLEMENTED** — remote vLLM, StepAudio, LM Studio, offline fallback |
| 11 | Backend detection cascade | `useTroubadourAI.js` | `07_MINIMUM_AI_MODE.md` §3 | ✅ **IMPLEMENTED** — wllama→remote→StepAudio→llama.cpp→LM Studio→offline |
| 12 | TTS cascade (Qwen3→Kokoro→WebSpeech) | `useTroubadourAI.js` | `07_MINIMUM_AI_MODE.md` §4.2 | ✅ **IMPLEMENTED** — code wired. Qwen3 not yet built. |
| 13 | Qwen3-TTS 0.6B ONNX (primary TTS) | *not created* | `07_MINIMUM_AI_MODE.md` §4.1 | 🔴 **NOT BUILT** — major gap. Claimed as primary TTS. |
| 14 | Voice cloning from 3s audio | *not implemented* | `07_MINIMUM_AI_MODE.md` §4.1 | 🔴 **NOT BUILT** — needs Qwen3-TTS + Bertrand recordings |
| 15 | Silero VAD always-on | *not implemented* | `07_MINIMUM_AI_MODE.md` §9.4 | 🔴 **NOT BUILT** |
| 16 | Whisper Base ONNX STT | *not implemented* | `07_MINIMUM_AI_MODE.md` §9.2 | 🔴 **NOT BUILT** |
| 17 | Hands-free voice commands | *not implemented* | `07_MINIMUM_AI_MODE.md` §9.3 | 🔴 **NOT BUILT** — "Navigate", "Repeat", "Slower", etc. |
| 18 | LLM tool use (function calls) | *not implemented* | `07_MINIMUM_AI_MODE.md` §2.2 | 🔴 **NOT BUILT** — speak_text, navigate_to, set_metronome |
| 19 | AI-adjustable student pacing | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §5.5 | 🔴 **NOT BUILT** |
| 20 | Curriculum RAG | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §7 | 🔴 **NOT BUILT** |
| 21 | Real Bertrand clip injection | *not implemented* | `CODEBASE_AUDIT.md` §12.3, `BERTRAND_EXECUTIVE_BRIEF.md` §2 | 🔴 **NOT BUILT** — "Beautiful", "Breathe", "Relax the shoulder" snippets |

---

## 3. CURRICULUM / DAG

| # | Function / UI | File | Claimed In | Status |
|---|--------------|------|-----------|--------|
| 22 | 12-fret curriculum slides (bilingual, Pythagorean) | `chapterData.js`, `slideGenerator.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §1 | ✅ **VERIFIED** |
| 23 | 144-node DAG data model | `dagNodes.js`, `dagEdges.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §3, `CODEBASE_AUDIT.md` §5 | 🟡 **PARTIAL** — Fret 1 complete (11 nodes). Frets 2-12 metadata-only. |
| 24 | DAG progress tracking hook | `useDAGProgress.js` | `CODEBASE_AUDIT.md` §4.2 | 🟡 **GHOST** — hook exists. No component uses it. `completedNodes` always empty. |
| 25 | BE→DO→PLAY phase data model | `dagNodes.js`, `tractionStore.js` | `BERTRAND_EXECUTIVE_BRIEF.md`, `CONTEXT.md` §7 | 🟡 **PARTIAL** — data complete. UI shows only legacy `traction >= 60`. |
| 26 | Maturation Map visual (12-fret grid) | `MaturationMap.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §3 | ✅ **VERIFIED** — pillar breakdown, progress %, hero stages |
| 27 | BEWorkbook component | `playbook/BEWorkbook.jsx` | `CODEBASE_AUDIT.md` §6.2 | 🟡 **GHOST** — built, NOT imported in PlaybookShell. No 5th tab. |
| 28 | DAGProgressBar component | `DAGProgressBar.jsx` | `CODEBASE_AUDIT.md` §6.2 | 🟡 **GHOST** — built, not rendered anywhere. |
| 29 | 4-level mastery (Encountered→Experienced→Owned→Mastered) | `tractionStore.js` | `IMPLEMENTATION_ROADMAP.md` §2 | 🟡 **GHOST** — data fields exist. **NOT displayed in UI.** |
| 30 | Cross-pillar resonance | *not implemented* | `IMPLEMENTATION_ROADMAP.md` §2.2 | 🔴 **NOT BUILT** |
| 31 | Depth prompts ("Go Deeper") | *not implemented* | `CODEBASE_AUDIT.md` §12.3 | 🔴 **NOT BUILT** |
| 32 | Somatic gate (pitch-match unlocks DAG node) | `PitchRoom.jsx` (partial) | `CODEBASE_AUDIT.md` §7.3 | 🟡 **PARTIAL** — PitchRoom works. Does NOT call `completePhase()`. |
| 33 | Auto-mark-complete button | *not implemented* | `CODEBASE_AUDIT.md` §11.3 | 🔴 **NOT BUILT** |
| 34 | Fret-aware fallback prompts | `troubadourOffline.js` | `07_MINIMUM_AI_MODE.md` §2.1 | ✅ **VERIFIED** |

---

## 4. GAME / PRACTICE TOOLS

| # | Function / UI | File | Claimed In | Status |
|---|--------------|------|-----------|--------|
| 35 | Breathing Gate | `BreathingGate.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 36 | Pitch Room | `PitchRoom.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 37 | Metronome | `Metronome.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 38 | Vertiscale Engine (Flash/Imagine/Audiate/Reflect) | `VertiscaleEngine.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2, `CONTEXT.md` §7 | ✅ **VERIFIED** |
| 39 | Practice Timer | `PracticeTimer.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 40 | Interval Visualizer | `IntervalVisualizer.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 41 | Fretboard Explorer | `FretboardExplorer.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 42 | Pling Trainer | `PlingTrainer.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 43 | Practice Recorder | `PracticeRecorder.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 44 | Resonant Mirror (screenless audio game) | *not implemented* | `BERTRAND_EXECUTIVE_BRIEF.md` §3, `RESONANT_MIRROR_GDD.md` | 🔴 **NOT BUILT** — **MAJOR GAP** |
| 45 | Biofeedback / heart rate gate | *not implemented* | `BERTRAND_EXECUTIVE_BRIEF.md` §3.2 | 🔴 **NOT BUILT** |
| 46 | Adventure mode (narrative) | `AdventurePlayer.jsx` | `CONTEXT.md` §7 | ✅ **VERIFIED** — 918 lines, 12 scenes, 3 acts |
| 47 | Troubadour Loom (identity page) | `TroubadourLoom.jsx` | `CONTEXT.md` §8 | ✅ **VERIFIED** |

---

## 5. PROGRESS / PERSISTENCE

| # | Function / UI | File | Claimed In | Status |
|---|--------------|------|-----------|--------|
| 48 | 3-tier persistence (localStorage→IDB→Supabase) | `tractionStore.js`, `localDatabase.js`, `ScaffoldingProvider.jsx` | `00_SYSTEM_ARCHITECTURE.md` §3 | ✅ **VERIFIED** |
| 49 | Streak tracking | `tractionStore.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 50 | Bard level / XP system | `tractionStore.js`, `CharacterSheet.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 51 | Character Sheet | `playbook/CharacterSheet.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 52 | Quest Log (12-fret timeline) | `playbook/QuestLog.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** — uses legacy traction system |
| 53 | Practice Journal | `playbook/PracticeJournal.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | ✅ **VERIFIED** |
| 54 | Capstone Card (3-tier certification) | `CapstoneCard.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §4, `CONTEXT.md` §8 | ✅ **IMPLEMENTED** — no payment flow |
| 55 | .voixvive savestate export/import | `saveState.js` | `00_SYSTEM_ARCHITECTURE.md` §1 | ✅ **VERIFIED** |
| 56 | Sandbox mode (unlock all nodes) | `ScaffoldingProvider.jsx`, `useDAGProgress.js` | `CONTEXT.md` §8 | ✅ **VERIFIED** |
| 57 | Commitment tier (gentle/committed/intensive) | `gameProgression.js` | `05_KRIYA_DELIVERY_SYSTEM.md` §5.3 | 🟡 **GHOST** — defined, written by onboarding. **Read by nothing.** |
| 58 | Scaffolding fade (visual aids) | `tractionStore.js` | `05_KRIYA_DELIVERY_SYSTEM.md` §4.2 | 🟡 **PARTIAL** — note labels/fret numbers fade. **Troubadour prompts do NOT fade.** |
| 59 | Practice engine (20-min sessions) | `practiceEngine.js` | `05_KRIYA_DELIVERY_SYSTEM.md` §3.1 | 🟡 **PARTIAL** — generates sessions. **Hardcoded 20 min. Does NOT adapt to commitment tier.** |
| 60 | Notification system (push/Web Push) | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §5, `06_GAME_NOTIFICATIONS_IDENTITY.md` | 🔴 **NOT BUILT** — claimed extensively. Zero infra. |
| 61 | Night Gate (before-sleep routine) | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §4.1 | 🔴 **NOT BUILT** |
| 62 | Paravastha check (after-effect) | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §4.1 | 🔴 **NOT BUILT** |
| 63 | Practice Garden | *not implemented* | `06_GAME_NOTIFICATIONS_IDENTITY.md` §4.2 | 🔴 **NOT BUILT** |
| 64 | Google Calendar practice events | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §5.5 | 🔴 **NOT BUILT** |
| 65 | Google Drive journal archive | *not implemented* | `05_KRIYA_DELIVERY_SYSTEM.md` §5.6 | 🔴 **NOT BUILT** |

---

## 6. BUSINESS / REVENUE

| # | Function / UI | File | Claimed In | Status |
|---|--------------|------|-----------|--------|
| 66 | Free 12-chapter curriculum | `chapterData.js`, `OrientationHub.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §1, `02_BUSINESS_MODEL.md` | ✅ **VERIFIED** |
| 67 | Studio Page (pricing, services, testimonials) | `StudioPage.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2, `02_BUSINESS_MODEL.md` | ✅ **VERIFIED** |
| 68 | Quick Question ($5) | `pricingData.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **CLAIMED, NOT WIRED** — price defined. No Stripe, no flow. |
| 69 | Video Review ($35) | `pricingData.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **CLAIMED, NOT WIRED** — price defined. Submission infra exists but not connected to paid review. |
| 70 | Private Lesson ($65) | `pricingData.js`, `StudioPage.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **CLAIMED, NOT WIRED** — pricing displayed. No booking integration. |
| 71 | Inner Circle ($25/mo) | `pricingData.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **CLAIMED, NOT WIRED** — no membership system. |
| 72 | Capstone Audition ($100) | `CapstoneCard.jsx`, `pricingData.js` | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **PARTIAL** — card exists. No payment flow. No actual evaluation. |
| 73 | Stripe payment links | *not configured* | `BERTRAND_EXECUTIVE_BRIEF.md` §2, `CONTEXT.md` §2 | 🔴 **NOT BUILT** — Bertrand must create Stripe account. |
| 74 | Mentor dashboard | `MentorDashboard.jsx` | `BERTRAND_EXECUTIVE_BRIEF.md` §2 | 🟡 **BUILT, NOT FULLY WIRED** — UI exists. Submission queue not connected to paid tiers. |

---

## 7. PEDAGOGICAL / CONTENT

| # | Claim | Document | Status |
|---|-------|----------|--------|
| 75 | Bilingual EN/FR (100+ keys) | `BERTRAND_EXECUTIVE_BRIEF.md` §5, `CONTEXT.md` §6 | ✅ **VERIFIED** |
| 76 | Pythagorean ratios per fret | `BERTRAND_EXECUTIVE_BRIEF.md` §1 | ✅ **VERIFIED** |
| 77 | Hero's journey 12-stage mapping | `BERTRAND_EXECUTIVE_BRIEF.md` §1, `CONTEXT.md` §7 | ✅ **VERIFIED** |
| 78 | Yin/Yang dual-coding | `01_PEDAGOGY.md`, `CONTEXT.md` §4 | ✅ **VERIFIED** |
| 79 | ©SHEARL protocol | `CONTEXT.md` §4 | ✅ **VERIFIED** |
| 80 | ©PLING! protocol | `CONTEXT.md` §4 | ✅ **VERIFIED** |
| 81 | ©FHEAL protocol | `CONTEXT.md` §4 | ✅ **VERIFIED** |
| 82 | Somatic mystic philosophy | `01_PEDAGOGY.md` | ✅ **VERIFIED** |
| 83 | "You are an instrument playing an instrument" | `BERTRAND_EXECUTIVE_BRIEF.md`, `CONTEXT.md` §4 | ✅ **VERIFIED** |
| 84 | AI trained on Bertrand's pedagogy | `BERTRAND_EXECUTIVE_BRIEF.md` §4 | 🟡 **PARTIAL** — offline prompts use his language. Not fine-tuned. |
| 85 | Voice cloning of Bertrand | `07_MINIMUM_AI_MODE.md` §4.3 | 🔴 **NOT BUILT** |
| 86 | Fine-tuned model on Bertrand's teaching data | `CONTEXT.md` §9 | 🔴 **NOT BUILT** |

---

## 8. SUMMARY: GAP ANALYSIS

### Over-Claimed (Claimed in docs, NOT built — highest risk for funding)

| Priority | Feature | Document | Risk |
|----------|---------|----------|------|
| **CRITICAL** | Resonant Mirror (screenless audio game) | `BERTRAND_EXECUTIVE_BRIEF.md` §3 | This is THE flagship game described to Bertrand. Not built at all. |
| **CRITICAL** | Qwen3-TTS 0.6B (primary TTS) | `07_MINIMUM_AI_MODE.md` §4.1 | Claimed as primary in-browser TTS. No code exists. |
| **HIGH** | Biofeedback / heart rate gate | `BERTRAND_EXECUTIVE_BRIEF.md` §3.2 | Claimed as differentiator. No code. |
| **HIGH** | Notification system | `05_KRIYA_DELIVERY_SYSTEM.md` §5 | Extensively claimed. Zero infrastructure. |
| **HIGH** | StepAudio Mini / Low Hardware tier | `07_MINIMUM_AI_MODE.md` §2.2, §6 | Claimed. No model, no endpoint. |
| **MEDIUM** | RAG + calendar-aware pacing | `05_KRIYA_DELIVERY_SYSTEM.md` §5.5, §7 | Claimed for Tier 2. Not built. |
| **MEDIUM** | Voice cloning of Bertrand | `07_MINIMUM_AI_MODE.md` §4.3 | Claimed. Needs recordings + Qwen3-TTS. |
| **MEDIUM** | Stripe payment links / all revenue flows | `BERTRAND_EXECUTIVE_BRIEF.md` §2, `02_BUSINESS_MODEL.md` | Pricing displayed. No actual payment processing. |
| **MEDIUM** | 4-level mastery visible in UI | `IMPLEMENTATION_ROADMAP.md` §2 | Data exists. Not displayed. |
| **LOW** | Hands-free voice commands | `07_MINIMUM_AI_MODE.md` §9.3 | Claimed. Not built. |

### Under-Claimed (Built, NOT prominently claimed — missed marketing)

| Feature | What's Built | Where to Claim |
|---------|-------------|---------------|
| 143 passing unit tests | Full test suite for AI hooks, offline engine, DAG | Add to `BERTRAND_EXECUTIVE_BRIEF.md` — "Tested and verified" |
| Compressed prompt architecture | `buildCompressedPrompt()` — 500-token DAG-aware prompt | Highlight in `07_MINIMUM_AI_MODE.md` as innovation |
| TTS cascade (3-tier fallback) | Qwen3→Kokoro→WebSpeech | Already claimed but could be more prominent |
| .voixvive sovereign savestate | Full data export/import | Claim in `BERTRAND_EXECUTIVE_BRIEF.md` — "Own your data" |
| Sandbox mode | Explore all 144 nodes without restriction | Claim in `BERTRAND_EXECUTIVE_BRIEF.md` — "No lock-in" |
| 12 practice tools | All functional, zero AI required | Already claimed, well-documented |

### Ghost Systems (Built in code, invisible to students)

| System | File | Why Invisible |
|--------|------|--------------|
| DAG 144-node system | `dagNodes.js`, `dagEdges.js`, `useDAGProgress.js` | No route renders it. No component calls navigation. `completedNodes` empty. |
| BEWorkbook | `playbook/BEWorkbook.jsx` | Not imported in PlaybookShell. No 5th tab. |
| DAGProgressBar | `DAGProgressBar.jsx` | Not rendered anywhere. |
| 4-level mastery | `tractionStore.js` | Data fields exist. No UI shows them. |
| Commitment tier | `gameProgression.js` | Written by onboarding. Never read. |
| Scaffolding fade (prompts) | `tractionStore.js` | Visual aids fade. AI prompts do NOT fade. |

---

## 9. ACTION ITEMS

### For Funding Documents (Fix Over-Claims)
1. **Resonant Mirror** — Either build MVP (4-6 hours) OR remove/reframe claim in `BERTRAND_EXECUTIVE_BRIEF.md`
2. **Qwen3-TTS** — Either build `useQwenTTS.js` (~6 hours) OR reframe TTS claims to "Kokoro + WebSpeech, Qwen3 planned"
3. **Biofeedback** — Remove from `BERTRAND_EXECUTIVE_BRIEF.md` until Fitbit API integration exists
4. **Payment processing** — Add "Coming soon" qualifier to all revenue tiers until Stripe is configured
5. **StepAudio Mini** — Clarify that Tier 2 is "planned" not "available"

### For Code (Fix Ghost Systems)
1. **Wire DAG to UI** — Add BEWorkbook as 5th tab in PlaybookShell (30 min)
2. **Mark Complete buttons** — SlideViewer + PitchRoom call `completePhase()` (2 hours)
3. **Display mastery** — Add 4-level dots to QuestLog (2 hours)
4. **Download models** — Place `LFM2.5-1.2B-Instruct-Q4_K_M.gguf` in `public/models/` (10 min download)

### For Marketing (Claim What Exists)
1. Add "143 automated tests verifying AI behavior" to executive brief
2. Add "Sovereign savestate — own your data" as feature
3. Add "Sandbox mode — explore freely" as feature
4. Lead with "12 practice tools, fully functional, zero AI required" as mechanical mode strength

---

*Generated from codebase audit + document cross-reference. 86 claims mapped across 14 source documents.*
