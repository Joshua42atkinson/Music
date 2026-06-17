# Voix Vive Codebase Analysis — 2026-06-15

> Post-invasive-audit deep analysis. All 20 audit issues resolved.
> Build: passing. Tests: 108/108. Bundle: 6.1MB raw / ~2.0MB gzip.

---

## 1. Vital Signs

| Metric | Value | Assessment |
|--------|-------|------------|
| Source files | 201 (.jsx/.js/.ts) | Mid-size SPA |
| Lines of code | 53,796 | Manageable |
| Components | 62 | Good granularity |
| Custom hooks | 28 | Rich abstraction layer |
| Lib modules | 11 | Lean service layer |
| Test files | 12 | **Critical gap** |
| Test cases | 108 | Covers data layer only |
| Routes | 34 (33 lazy) | Excellent lazy loading |
| Error boundaries | 26 wraps | Robust crash isolation |
| Build time | 9.2s | Fast |
| Bundle (gzip) | ~2.0MB | Heavy — dominated by AI libs |
| node_modules | 2.5GB | Large — ML/AI dependencies |

---

## 2. Bundle Anatomy

| Chunk | Raw | Gzip | Notes |
|-------|-----|------|-------|
| `ai-kokoro` | 2,156 KB | 899 KB | **44% of total gzip** — Kokoro TTS engine |
| `CScaleVisualizer` | 980 KB | 274 KB | Three.js + XR — loads only on /poc |
| `App` (main) | 532 KB | 205 KB | All components, hooks, data |
| `ai-transformers` | 505 KB | 145 KB | HuggingFace ONNX — lazy loaded |
| `vendor-react` | 284 KB | 93 KB | React + Router + Framer |
| `Bible12M` | 244 KB | 90 KB | Pedagogy content data |
| `cosyVoiceWorker` | 110 KB | 36 KB | WebGPU TTS worker |
| Everything else | ~400 KB | ~120 KB | 30+ small route chunks |

**Key insight:** The initial page load loads `vendor-react` + `index` + `App` = ~330KB gzip. AI chunks are lazy and only load when the student activates Truebadour or TTS. This is well-architected for perceived performance.

**Risk:** `ai-kokoro` at 900KB gzip is the heaviest chunk. If a student on a slow connection triggers TTS, they'll wait. No loading indicator or progressive enhancement for this case.

---

## 3. Component Health

### Size Distribution

| Category | Lines | Components | Avg |
|----------|-------|------------|-----|
| Oversized (>800) | 4,114 | 4 | 1,029 |
| Large (400-800) | 5,830 | 10 | 583 |
| Medium (200-400) | 4,613 | 16 | 288 |
| Small (<200) | 1,937 | 32 | 61 |

**Oversized components (refactor candidates):**

| Component | Lines | useState | useEffect | Diagnosis |
|-----------|-------|----------|-----------|-----------|
| `SlideViewer` | 1,182 | 11 | 8 | Does slide rendering + navigation + audio + quizzes. Split: SlideRenderer, SlideNav, SlideAudio |
| `CharacterSheet` | 1,127 | ? | ? | RPG character display + XP math + bard level. Split: StatBlock, XPTracker, BardTitle |
| `BEWorkbook` | 1,053 | ? | ? | BE phase content + timer + gate. Split: BEContent, BETimer, BEGate |
| `BookWidget` | 752 | 15 | 7 | 15 useState — doing too much. Split: BookRenderer, PageNav, BookmarkManager |

### State Complexity

| Component | useState | useEffect | Risk |
|-----------|----------|-----------|------|
| `BookWidget` | 15 | 7 | **High** — 15 state variables, likely has derived state that should be useMemo |
| `MentorDashboard` | 13 | 1 | Medium — many recording states, could use useReducer |
| `SlideViewer` | 11 | 8 | **High** — 8 effects = 8 potential race conditions |
| `CoachingPortal` | 11 | 1 | Medium — form state, could useReducer |
| `CommunityHub` | 10 | 2 | Medium |

**Pattern:** Components use `useState` for everything. Zero `useReducer`, zero Zustand/Jotai, zero derived state via `useMemo`. This leads to:
- State that should be computed (e.g., `isComplete` stored as state instead of derived from `progress >= 100`)
- Prop drilling through 3+ levels (53 cross-component imports)
- No centralized state for cross-cutting concerns (audio, AI, recording)

---

## 4. Hook Health

### Size Distribution

| Hook | Lines | useCallback | Role |
|------|-------|-------------|------|
| `useBackendBridge` | 360 | 11 | AI backend switching + chat — **too many responsibilities** |
| `useCosyVoice` | 312 | 8 | Server + WebGPU TTS — dual mode is complex |
| `useDAGProgress` | 311 | 7 | DAG state + localStorage sync — still dual-path |
| `usePitchDetector` | 291 | 3 | 60fps pitch detection — performance-critical |
| `useKokoroTTS` | 243 | 6 | Cloud TTS with audio queue |
| `useVoicePreferences` | 233 | 12 | **12 useCallback** — over-wrapped |
| `usePlayerState` | 218 | 7 | Player mode management |
| `useStudioAudio` | 209 | 5 | Audio processing chain |
| `useFlashTimer` | 209 | 9 | Interval timer with phases |
| `useWllamaTruebadour` | 203 | 3 | Local LLM engine |

### Hook Dependency Issues

| Hook | Issue | Status |
|------|-------|--------|
| `useBackendBridge` | Stale closures on async functions | ✅ Fixed (M2) |
| `useWllamaTruebadour` | `isLoading` in deps → double-init | ✅ Fixed (C1) |
| `useKokoroWebTTS` | Same double-init pattern | ✅ Fixed (C2) |
| `useDAGProgress` | Dual state (local + scaffolding) | ✅ Fixed (C3) |
| `usePitchDetector` | 60fps over-render | ✅ Fixed (H3) |
| `useVoicePreferences` | 12 useCallback — likely over-memoized | ⚠️ Unaudited |

---

## 5. Styling System

### The Problem in Numbers

| Metric | Value | Industry Norm |
|--------|-------|---------------|
| Inline style blocks | 884 | 0 (CSS modules/Tailwind) |
| Unique hardcoded colors | 178 | 8-12 (design tokens) |
| `rgba(201,169,110)` occurrences | 217 | 1 (CSS variable) |
| `fontFamily` declarations | 249 | 1-3 (CSS variables) |
| `@keyframes` inline | 12 | 0 (CSS file) |
| CSS files | 0 | 1-5 |
| Tailwind classes used | ~0 | 100+ |

**The gold color `#c9a96e`** appears 160 times as hex + 217 times as rgba = **377 references to one color**. Changing the brand gold requires editing 62 files.

**Font stack repetition:**
- `'JetBrains Mono', monospace` — 149 declarations
- `'Cormorant Garamond', serif` — 41 declarations
- `'Inter', sans-serif` — 14 declarations

**Tailwind is installed but unused.** `tailwindcss` is in devDependencies, `@tailwindcss/typography` is in dependencies, `postcss` + `autoprefixer` are configured — but zero components use Tailwind classes. The entire UI is inline styles.

---

## 6. Persistence Layer

### localStorage Keys (38 unique)

| Key Pattern | Count | Purpose |
|-------------|-------|---------|
| `voixvive_*` | 22 | App state, preferences, logs |
| `bard_traction` | 1 | Main progress state |
| `voix_vive_*` | 4 | DAG progress, adventure, swipe hint |
| `bertrand_habits` | 1 | Habit tracking |
| `active_student_profile` | 1 | Current user name |
| `voixvive-slide-*` | 12+ | Per-fret slide positions |

**Inconsistency:** Three naming conventions (`voixvive_`, `voix_vive_`, `bard_`). No namespace collision today, but confusing for maintainers.

### IndexedDB (Dexie) — 10 Tables

| Table | Schema | Purpose |
|-------|--------|---------|
| `settings` | `key, value` | Traction state backup, tunnel URL |
| `progress` | `fretId, completed, lastAccessed` | Per-fret progress |
| `messages` | `++id, serverId, text, sender, timestamp, isSynced` | AI chat history |
| `outbox` | `++id, fretId, blob, status` | Pending video uploads |
| `vertiscaleSessions` | `++id, phase, patternId, timestamp, successful` | Game sessions |
| `songs` | `++id, title, timestamp, isFavorite` | Songwriting saves |
| `journal` | `++id, fretId, toolId, timestamp, mood` | Journal entries |
| `studentProfile` | `id, name, createdAt` | Local profile |
| `questLog` | `++id, fretId, event, timestamp` | Quest events |
| `aiNarration` | `++id, type, contextKey, timestamp` | AI narration log |
| `recordings` | `++id, exerciseName, timestamp, duration, blobUrl, reviewed, feedback` | Practice recordings |

**Schema version:** V4 (4 migrations). Rule: "Never delete tables between versions — add only." This is good practice.

**Dual-write problem:** `ScaffoldingProvider` writes to both `localStorage` and `IndexedDB` on every state change. The IndexedDB write is async and non-blocking, but it means the same data exists in two places with no guarantee of consistency.

---

## 7. Audio Architecture

### Integration Points (25 files)

```
audioEngine.js (singleton)
├── useKokoroWebTTS.js    → resumeAudio() for playback
├── useKokoroTTS.js       → resumeAudio() for playback
├── useStudioAudio.js     → Own AudioContext (specialized chain)
├── usePitchDetector.js   → Own AudioContext (analyser node)
├── useMetronome.js       → Own oscillator
├── audioStreamingService  → Own AudioContext (WebSocket playback)
└── useTruebadourAI.js    → Web Speech API (browser native)
```

**Singleton pattern** (`audioEngine.js`) is correctly used for simple playback. Specialized contexts (studio processing, pitch detection) correctly create their own. This is well-architected.

**Remaining concern:** `audioStreamingService` creates an `AudioContext` in `playAudio()` that's now properly closed in `disconnect()`. But if `disconnect()` is never called (component unmounts without cleanup), it leaks.

---

## 8. AI Pipeline

### Backend Switching

```
useBackendBridge.js
├── Local: LM Studio (localhost:1234)
├── DaaS:  Remote GPU server (VITE_DAAS_API_BASE)
└── Auto-detect on mount
```

The bridge supports 3 backends with automatic detection. `switchBackend` and `detectBackends` are now properly wrapped in `useCallback` with ref guards (M2 fix).

### Truebadour AI Stack

| Layer | Module | Size | Purpose |
|-------|--------|------|---------|
| System prompt | `truebadourPrompt.js` | 515 lines | Socratic guitar teacher persona |
| Psychology | `systemPsychology.js` | 306 lines | Emotional response patterns |
| Knowledge | `systemKnowledgeRegistry.js` | 374 lines | Guitar theory, DAG structure |
| Debugging | `systemDebugging.js` | 451 lines | Self-repair instructions |
| RAG | `ragStore.js` | 336 lines | Context retrieval |
| Injection | `systemPromptInjector.js` | 270 lines | Dynamic context assembly |

**Total prompt engineering:** ~2,252 lines of system prompt code. This is a substantial AI personality layer — the Truebadour is a first-class character in the codebase.

---

## 9. Test Coverage

### What's Tested

| Module | Test File | Cases | Coverage |
|--------|-----------|-------|----------|
| `tractionStore` | `tractionStore.studentFlow.test.js` | 17 | Full student lifecycle |
| `truebadourPrompt` | `truebadourCompressedPrompt.test.js` | 28 | Prompt compression |
| `ttsAudio` | `ttsAudio.test.js` | 9 | TTS voice mapping |
| `llmQuality` | `llmQuality.test.js` | 8 | LLM response quality |
| `dagNodes` | `dagNodes.test.js` | 12 | DAG node structure |
| `useVoiceInput` | `useVoiceInput.test.js` | 9 | Voice input hook |
| `useDAGProgress` | `useDAGProgress.test.js` | 4 | DAG progress hook |
| `truebadourPrompt` | `truebadourPrompt.test.js` | 6 | Prompt content |
| `ragStore` | `ragStore.test.js` | 5 | RAG retrieval |
| `completePhaseChain` | `completePhaseChain.test.js` | 1 | Phase completion |
| `TruebadourWidget` | `TruebadourWidget.test.jsx` | 3 | Widget rendering |
| `SlideViewer` | `SlideViewer.test.jsx` | 6 | Slide rendering |

### What's NOT Tested (0 coverage)

| Module | Risk | Lines | Why it matters |
|--------|------|-------|----------------|
| `useAuth` | High | 31 | Auth flow — was the M1 unmount guard fix correct? |
| `useWllamaTruebadour` | High | 203 | C1 double-init fix — will it regress? |
| `useKokoroWebTTS` | High | 171 | C2 double-init fix — will it regress? |
| `useBackendBridge` | High | 360 | M2 stale closure fix — will it regress? |
| `ScaffoldingProvider` | Medium | 197 | M1 unmount guard + C3 merge — core state |
| `usePitchDetector` | Medium | 291 | H3 over-render fix — performance critical |
| `MentorDashboard` | Medium | 738 | M6 auth headers — security critical |
| `FeedbackButton` | Low | 261 | M7 PII removal — privacy |
| `PracticeTimer` | Low | 209 | L3 setTimeout fix — UX |
| All 62 components | Low-Med | ~22,000 | No component integration tests |

**Coverage estimate:** ~6% of source files have tests. The audit fixed 20 bugs and added 0 regression tests. Any of these fixes can silently regress.

---

## 10. Accessibility

| Metric | Value | Target |
|--------|-------|--------|
| `aria-` attributes | 26 | 200+ |
| `role=` attributes | 0 | 20+ |
| `tabIndex` | 0 | 10+ |
| `onClick` without `onKeyDown` | 48 components | 0 |
| Screen reader landmarks | 0 | 5+ |

**48 components have click handlers with no keyboard equivalent.** This means the app is completely unusable via keyboard. A student who cannot use a mouse (motor impairment, or simply prefers keyboard nav) cannot operate any button, menu, or interactive element.

Zero ARIA landmarks means screen readers see the app as an undifferentiated blob of content.

---

## 11. Internationalization

| Metric | Value |
|--------|-------|
| Components using `useLocale` | 28 / 62 (45%) |
| Components NOT using `useLocale` | 34 (55%) |
| Languages supported | 2 (en, fr) |
| i18n framework | i18next + react-i18next |
| Translation files | Embedded in `useLocale.js` |

**55% of components have no i18n.** This means over half the UI is English-only. For a Franco-American pedagogy app, this is a significant gap. The `12M.md` pedagogy is deeply French-influenced (Kriya, Voix, Souffle, Chant) but the UI doesn't reflect this in most components.

---

## 12. Security Posture

| Item | Status | Notes |
|------|--------|-------|
| Supabase keys in `.env` | ✅ Removed | Was suspicious `sb_publishable_` format |
| PII in localStorage | ✅ Fixed | Email was stored; now from session (M7) |
| DaaS API auth headers | ✅ Fixed | JWT on all 7 fetches (M6) |
| `VITE_TRUEBADOUR_API_KEY` | ⚠️ In `.env` | Exposed to browser — is this a secret? |
| Content Security Policy | ❌ None | No CSP headers in vite.config.js |
| XSS via `dangerouslySetInnerHTML` | ❓ Unchecked | react-markdown renders user content |
| CORS | ❓ Unknown | DaaS API CORS config not verified |

---

## 13. Dependency Audit

### Heavy Dependencies

| Package | Size (gzip) | Used? | Notes |
|---------|-------------|-------|-------|
| `kokoro-js` | 900 KB | ✅ | Core TTS — lazy loaded |
| `@huggingface/transformers` | 145 KB | ✅ | Pitch detection model — lazy |
| `onnxruntime-web` | In ai-transformers | ✅ | WASM inference — lazy |
| `@wllama/wllama` | In ai-wllama | ✅ | Local LLM — lazy |
| `three` + `@react-three/fiber` | 274 KB | ⚠️ | Only for CScaleVisualizer (/poc) |
| `@react-three/xr` | In CScale | ⚠️ | WebXR — experimental feature |
| `@tauri-apps/api` | Small | ⚠️ | Desktop wrapper — is Tauri used? |
| `framer-motion` | In vendor-react | ⚠️ | 3 dead imports removed (L1), still used in some |
| `@tailwindcss/typography` | Small | ❌ | Installed, never used |
| `react-helmet-async` | Small | ❌ | Installed, no SEO meta tags set |

### Orphaned Dependencies (candidates for removal)

- `@tailwindcss/typography` — no Tailwind classes used
- `react-helmet-async` — no `<Helmet>` usage found
- `@tauri-apps/api` + `@tauri-apps/plugin-opener` — only useful for Tauri desktop build, not web
- `supabase/` directory — Edge functions for removed Supabase project

---

## 14. Architecture Strengths

1. **Lazy loading is disciplined.** 33/34 routes lazy. AI chunks are separate. Initial load is ~330KB gzip.
2. **Error boundaries everywhere.** 26 wraps = one crash doesn't kill the app.
3. **Audio singleton pattern.** `audioEngine.js` prevents the #1 Web Audio bug (multiple contexts).
4. **Offline-first is real.** No network required. localStorage + IndexedDB. PWA with service worker.
5. **DAG curriculum encoding.** The 12-fret progression is data-driven, not hardcoded.
6. **Truebadour AI depth.** 2,252 lines of system prompt engineering = a real character, not a chatbot.
7. **Bilingual foundation.** i18next is wired up; 45% of components support FR/EN.
8. **Dexie schema migrations.** 4 versions, add-only rule = safe upgrades.

---

## 15. Architecture Weaknesses

1. **884 inline styles, 178 unique colors, 0 CSS files.** The entire UI is `style={{}}` blocks. No design tokens, no responsive breakpoints, no dark mode. Changing brand gold (`#c9a96e`) requires editing 62 files.
2. **6% test coverage.** 12 test files for 201 source files. Zero tests for hooks where critical bugs lived. Zero component integration tests. Every audit fix can silently regress.
3. **48 components keyboard-inaccessible.** `onClick` without `onKeyDown`. Zero ARIA landmarks. Zero `role` attributes. The app is completely unusable without a mouse.
4. **55% of components skip i18n.** Over half the UI is English-only in a Franco-American app.
5. **Oversized components.** `SlideViewer` (1,182 lines, 11 useState, 8 useEffect) is doing 4 jobs. `BookWidget` (15 useState) is a state explosion.
6. **No centralized state.** 515 useState calls, 0 useReducer, 0 external state manager. Cross-cutting state (audio, AI, recording) is prop-drilled through ScaffoldingProvider.
7. **38 localStorage keys with 3 naming conventions.** `voixvive_`, `voix_vive_`, `bard_` — inconsistent, no namespace management.
8. **Dual-write persistence.** Same data in localStorage + IndexedDB with no consistency guarantee.

---

## 16. Priority Matrix

### Immediate (blocks real users)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Add regression tests for C1/C2/M1/M2 fixes | Prevents silent regression of critical bugs | Medium |
| 2 | Keyboard accessibility for all buttons | Required for WCAG 2.1 AA | Medium |
| 3 | Remove orphaned deps (tailwind-typography, helmet, tauri?) | Reduces bundle/confusion | Small |
| 4 | Fix `VITE_TRUEBADOUR_API_KEY` exposure | Potential secret leak | Small |

### Short-term (improves maintainability)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 5 | Extract design tokens to CSS variables | Enables theming, reduces 377 gold-color edits to 1 | Medium |
| 6 | Decompose SlideViewer, CharacterSheet, BEWorkbook | Reduces complexity, enables testing | Medium |
| 7 | Normalize localStorage key namespace | Prevents collision, aids debugging | Small |
| 8 | Add useReducer to BookWidget, MentorDashboard | Reduces state explosion | Small |

### Medium-term (improves quality)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 9 | i18n for remaining 34 components | Full FR/EN coverage | Medium |
| 10 | Component integration tests (Testing Library) | Catches render bugs | Large |
| 11 | Replace inline styles with Tailwind or CSS modules | Maintainability, responsive, dark mode | Large |
| 12 | Gate completion on pitch accuracy, not time | Pedagogical integrity | Medium |

---

## 17. The Three Perspectives (Summary)

### 🎓 Teacher
- **Loves:** DAG-encoded pedagogy, BE→DO→PLAY enforcement, Truebadour's Socratic depth
- **Fears:** Completion by time-not-talent, mentor loop not operational, spiral learning described but not coded
- **Wants:** Pitch-gated completion, real mentor review flow, progress percentage visible to students

### 🔧 Engineer
- **Loves:** Lazy loading, error boundaries, audio singleton, offline-first PWA
- **Fears:** 884 inline styles, 6% test coverage, 48 keyboard-inaccessible components, oversized components
- **Wants:** Design tokens, regression tests, component decomposition, centralized state

### 🎸 Student
- **Loves:** Real-time pitch feedback, Truebadour AI companion, bard level motivation, works offline
- **Fears:** Overwhelming first experience, "Offline" auth button looks broken, no undo for destructive actions, audio can silently fail
- **Wants:** Guided onboarding, clear progress bar, "no account needed" messaging, audio permission prompt

---

---

## 18. Stakeholder POV — What They Actually See

### 🎸 The Student (Primary User)

**What they see when they open the app:**

1. **Landing screen** — Dark background (#050508), gold accents (#c9a96e), four portal cards with images:
   - 📖 *Read & Learn* → Song/SlideViewer
   - 🎶 *Watch & Connect* → Player/Recorder
   - 📝 *Notes & Growth* → Binder/Playbook
   - 🎸 *Practice & Explore* → Guitar/Riff
   - Plus: Academy Manifesto (expandable), AuthButton showing "Offline"

2. **Dashboard** — 12 fret cards laid out like a guitar neck. Each fret is a month:
   - Fret 1: 🌱 *The Root & The Breath* (The Unison)
   - Fret 2: ⚡ *The Minor Second* (The Awakening)
   - Fret 3: 🚶 *The Major Second* (The Step)
   - ...up to Fret 12: 🏆 *The Octave* (The Return)
   - Each card shows: title, interval name, poetic subtitle, emoji icon

3. **Inside a fret** — BE → DO → PLAY cycle:
   - **BE:** BreathingGate — animated breathing circle, body scan checklist, voice guidance
   - **DO:** SlideViewer — markdown slides with TAB, diagrams, theory
   - **PLAY:** PracticeRecorder — record video, get AI feedback, submit to mentor

4. **The Truebadour** — Floating red button (bottom-right). Opens AI chat:
   - Text or voice input
   - Socratic responses with guitar-specific knowledge
   - Speaks back via TTS (Kokoro voice)
   - Knows your fret position, bard level, and practice history

5. **Character Sheet** — RPG-style progress display:
   - Bard Level (1-12), XP bar, streak counter
   - Core stats (Strength, Dexterity, etc. mapped to practice metrics)
   - Certification badges: Apprentice → Journeyman → Master
   - Export .voixvive save file

6. **Coaching Portal** — Bertrand's services:
   - ☕ Tip jar ($5/$15/$50 one-time)
   - 🎸 Private lessons ($65/session, packs available)
   - 🎤 Voice coaching ($65/session)
   - ❓ Quick Question ($5/text reply)
   - 📹 Mini Critique ($15/video review)

**What they DON'T see (but should):**
- A game mode tutorial (onboarding flow exists but only triggers as overlay widget in FreePlayGuard, never blocks landing)
- Overall progress percentage — "You're 23% of the way to Truebadour"
- That "Offline" on the auth button means "no account needed" — it looks broken
- Audio permission prompt — pitch detection silently fails without user gesture

**What they feel:**
- 🟢 *Magical* — the pitch detector responding to their actual guitar in real-time
- 🟢 *Personal* — the Truebadour knows their fret position and speaks Socratically
- 🟢 *Motivated* — bard levels, streaks, XP, certifications create genuine progression
- 🟡 *Overwhelmed* — 4 portals, 34 routes, no guided first path
- 🟡 *Confused* — "Offline" button, no explanation of sovereign mode
- 🔴 *Vulnerable* — no undo, no "are you sure?" before destructive actions

---

### 👨‍🏫 The Teacher / Mentor (Bertrand)

**What they see:**

1. **Mentor Dashboard** (`/mentor`) — Currently accessible to everyone (auth disabled):
   - Video review queue
   - Student submissions list
   - Recording + text review interface
   - DaaS API integration for AI-assisted review

2. **Coaching Portal** — Their service menu with real pricing:
   - Private lessons: $65/single, $275/5-pack, $500/10-pack
   - Voice coaching: $65/session
   - Quick questions: $5/reply
   - Mini critiques: $15/video
   - Payment via Stripe, Venmo, PayPal

**What they DON'T see (but need):**
- A real queue management system — submissions go to IndexedDB outbox but never reach a server
- Notification when a student submits — the email service is stubbed (Supabase removed)
- Calendar integration — `calendarService.js` exists but no real Google Calendar connection
- Student progress overview — can't see a student's DAG progress without them sharing their screen
- Revenue dashboard — no way to track payments, lesson counts, or student retention

**What they feel:**
- 🟢 *Visionary* — the pedagogy is encoded in software, not just in their head
- 🟢 *Protected* — the queue cap (max 10) prevents flooding
- 🟡 *Disconnected* — no real pipeline from student submission to mentor review
- 🔴 *Manual* — everything after "student records video" requires manual coordination

---

### 💰 The Client / Buyer (Parent, Adult Student, Patron)

**What they see:**

1. **Landing page** — The Academy Manifesto (expandable):
   - Philosophy of somatic guitar pedagogy
   - "The 12-fret journey from silence to song"
   - Four portals as entry points

2. **Pricing page** (via Coaching Portal):
   - Free tier: "The curriculum, the AI coach, and all twelve tools are free — always."
   - Tip jar: "Like a street performer, Bertrand shares his art first"
   - Paid services: lessons, coaching, critiques with clear pricing

3. **Terms & Privacy** — Legal pages at `/privacy` and `/terms`

**What they DON'T see (but need):**
- Social proof — no testimonials, no student success stories, no "917 lines of adventure content"
- Demo — no way to try the pitch detector or Truebadour without committing
- Mobile app store presence — it's a PWA, not in App Store/Play Store
- Clear "this works offline, no account needed" messaging

**What they feel:**
- 🟢 *Trusted* — transparent pricing, no hidden fees, free core content
- 🟢 *Respected* — the tip jar model says "we trust you" not "pay us first"
- 🟡 *Uncertain* — is this a real product or a prototype? No social proof.
- 🟡 *Confused* — what's a "fret"? What's "BE/DO/PLAY"? The language is insider-y

---

### 🏢 The Platform / Investor

**What they see:**

1. **Technical differentiators** (if they look under the hood):
   - 121-node DAG curriculum graph with prerequisite enforcement
   - Real-time pitch detection at 60fps in the browser
   - Somatic breathing gates that gate content on physiological readiness
   - AI companion with 2,252 lines of Socratic personality engineering
   - Full offline PWA — zero server dependency

2. **Business model:**
   - Freemium: 100% free curriculum as acquisition channel
   - Human services: $5-$65 per interaction
   - No subscription required — pay-per-value
   - Street performer model: free first, tip after

3. **Market position:**
   - Not competing with Yousician/SimplyPiano (gamified tab readers)
   - Not competing with Truebase/Tonebase (video libraries)
   - Creating a new category: **somatic AI guitar pedagogy**

**What they DON'T see:**
- User metrics — no analytics, no tracking, no conversion funnel
- Revenue validation — Stripe links are mock URLs
- Scale plan — how does 1 mentor serve 1000 students?
- IP protection — the DAG and prompt engineering are in plaintext source

**What they feel:**
- 🟢 *Novel* — this is genuinely new. Nobody else does somatic + AI + DAG + offline
- 🟢 *Lean* — zero server costs, PWA, no cloud dependency
- 🟡 *Unproven* — no users, no revenue, no metrics
- 🔴 *Risky* — single mentor bottleneck, no automation of the paid services

---

## 19. What's Uniquely Yours — Competitive Moat

### Features No Competitor Can Claim

| Feature | Voix Vive | Yousician | SimplyPiano | Truebase | Tonebase | Fender Play |
|---------|-----------|-----------|-------------|----------|----------|-------------|
| **Somatic breathing gates** | ✅ Required before content | ❌ | ❌ | ❌ | ❌ | ❌ |
| **BE→DO→PLAY cycle** | ✅ Enforced in software | ❌ Linear | ❌ Linear | ❌ Video-only | ❌ Video-only | ❌ Linear |
| **DAG prerequisite graph** | ✅ 121 nodes, 187 edges | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Real-time pitch detection** | ✅ 60fps, breath-state aware | ✅ Basic | ✅ Basic | ❌ | ❌ | ❌ |
| **AI Socratic companion** | ✅ 2,252-line personality | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Offline-first PWA** | ✅ Zero server dependency | ❌ Requires internet | ❌ Requires internet | ❌ | ❌ | ❌ |
| **Bilingual (FR/EN)** | ✅ i18next wired | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Interval-as-metaphor** | ✅ Each fret = an interval + emotion | ❌ | ❌ | ❌ | ❌ | ❌ |
| **RPG character sheet** | ✅ Bard levels, XP, certifications | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Adventure narrative** | ✅ 917-line Troubadour story | ❌ | ❌ | ❌ | ❌ | ❌ |
| **VR/XR fretboard** | ✅ WebXR + Three.js | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Street performer pricing** | ✅ Free core + tip jar | ❌ Subscription | ❌ Subscription | ❌ Subscription | ❌ Subscription | ❌ Subscription |
| **No login required** | ✅ Sovereign offline mode | ❌ | ❌ | ❌ | ❌ | ❌ |

### The Moat Analysis

**What's copyable (low moat):**
- Pitch detection — standard Web Audio API, any dev can implement
- PWA — well-documented pattern
- Bilingual — i18next is a library
- VR fretboard — Three.js + WebXR are open source

**What's hard to copy (medium moat):**
- The DAG curriculum — requires a pedagogue to design 121 interconnected nodes with prerequisite logic. A dev can build the graph, but they need a Bertrand to populate it.
- The Truebadour personality — 2,252 lines of Socratic prompt engineering. You can't prompt-engineer this without deep guitar pedagogy knowledge.
- The interval-as-metaphor system — mapping each semitone to an emotional/somatic archetype (Unison=Root, Minor 2nd=Awakening, Tritone=Question) is a specific philosophical framework.

**What's impossible to copy (high moat):**
- **Bertrand himself.** The entire system is an expression of one person's 30+ year teaching philosophy. The breathing gates, the somatic approach, the "unlearn standard tuning" provocation — these come from lived pedagogy, not product design. You can clone the code, but you can't clone the teacher.
- **The integration.** Any single feature (pitch detection, AI chat, breathing exercises) exists elsewhere. Nobody has combined somatic gating + AI Socratic companion + DAG curriculum + offline PWA + interval metaphor + adventure narrative into one system. The value is in the *integration*, not the components.
- **The street performer model.** "Free forever, pay if it helps" is a philosophical stance, not a pricing strategy. Competitors are locked into subscription models. Switching would cannibalize their revenue.

---

## 20. Marketing Strategy — Informs User-Facing Design

### Positioning Statement

> **Voix Vive is the world's first somatic AI guitar academy.** It teaches guitar through breath, body, and AI — not tabs, videos, and subscriptions. The 12-fret journey maps every semitone to a human experience: from The Root (unison, grounding) to The Return (octave, mastery). No login. No internet. No subscription. Just you, your guitar, and a Socratic AI companion who knows where you are on the path.

### The Three Marketing Truths

1. **"Your body is the first instrument."** Every other app starts with the guitar. Voix Vive starts with the breath. This is the headline.

2. **"The AI knows where you are."** The Truebadour isn't a chatbot — it's a Socratic guide that knows your fret position, your bard level, and your practice history. This is the demo.

3. **"Free forever. Pay if it helps."** No paywall, no trial, no login. The entire curriculum is free. This is the trust builder.

### Marketing Channels → Product Implications

| Channel | What it needs from the product | Current gap |
|---------|-------------------------------|-------------|
| **TikTok/Reels** | 15-second demo of pitch detector + breathing gate | No shareable demo mode; no "try this" landing page |
| **YouTube** | 2-minute "first 5 minutes" walkthrough | Game mode tutorial (overlay widget, not forced) |
| **Product Hunt** | Clear one-liner + screenshot carousel | Landing page has 4 portals, no clear value prop above fold |
| **Guitar forums** | "I built a free AI guitar teacher that works offline" | No shareable progress (no social export) |
| **Word of mouth** | "Try this — it's free and you don't even need an account" | "Offline" button looks broken, not intentional |
| **Patreon/Ko-fi** | Tip jar integration | Tip jar exists in Coaching Portal but isn't prominent |

### User-Facing Design Priorities (from marketing needs)

1. **Replace "Offline" with "No account needed — everything saves locally"**
   - The sovereign mode is a *feature*, not a bug. Frame it as privacy-first, not broken.
   - Design: Replace AuthButton "Offline" with a small shield icon + "Your data stays on your device"

2. **Add a "Try it now" landing page**
   - One-click pitch detector demo (no navigation, no onboarding)
   - Shows the magic in 5 seconds: play a note → see it detected → hear the Truebadour respond
   - This is the TikTok moment

3. **Trigger onboarding from game mode entry (NOT the landing page)**
   - The 5-step flow (Welcome → Breathing → Phase → Tier → Ready) exists but isn't triggered
   - **HARD RULE: No blocking the landing page.** All introductory content must be in widgets, with consent and skip ability.
   - Landing page sets the first impression — first-time visitors see 4 portals and explore freely
   - Fix: Check `localStorage` for `voixvive_onboarded` in FreePlayGuard; if absent, show OnboardingModal as overlay widget (not replacing content)
   - Onboarding is voluntary, tied to game mode as tutorial system, always skippable

4. **Add a progress percentage to the dashboard**
   - "You are 23% of the way to Truebadour" — simple, motivating, shareable
   - Calculate: completed nodes / 121 total nodes

5. **Make the Character Sheet shareable**
   - "I'm a Level 4 Bard (The Shadow) on my Voix Vive journey" — social proof
   - Export as image (canvas screenshot) or link

6. **Surface the interval metaphors in navigation**
   - The fret names (The Root, The Awakening, The Shadow) are beautiful and unique
   - They're hidden inside the dashboard cards
   - Make them the primary navigation labels, not "Fret 1, Fret 2"

---

## 21. Stakeholder Priority Matrix

| Priority | Student | Teacher | Client | Platform |
|----------|---------|---------|--------|----------|
| **#1** | Game mode tutorial (voluntary, skippable) | Real review pipeline | Social proof / demo | Analytics / metrics |
| **#2** | "No account needed" messaging | Student progress view | Clear value prop above fold | Conversion funnel |
| **#3** | Progress percentage | Notification on submission | Mobile app store presence | Scale plan (1→1000 students) |
| **#4** | Shareable character sheet | Calendar integration | Testimonials | IP protection |
| **#5** | Pitch-gated completion | Revenue dashboard | "Try it now" demo | Automation of paid services |

---

*Generated 2026-06-15 by Cascade. Based on automated codebase analysis post-invasive-audit remediation.*
*Sections 18-21 added: Stakeholder POV, competitive moat, marketing strategy, stakeholder priorities.*
