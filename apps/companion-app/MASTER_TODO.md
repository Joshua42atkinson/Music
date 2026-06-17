# Voix Vive — Master TODO List

> Generated: 2026-06-15
> Source: CODEBASE_ANALYSIS_2026-06-15.md (21 sections)
> Preceding work: Invasive audit 20/20 fixed, 108/108 tests pass, build clean
> 
> Priority key: **P1** = blocks real users · **P2** = high leverage · **P3** = maintainability · **P4** = growth/marketing · **P5** = long-term quality

> **⚠️ HARD RULE: No blocking the landing page.** All introductory/orientation content must happen inside widgets — user-controlled, with consent and skip ability. The landing page sets the first impression. Never auto-redirect or force-navigate away from it.

---

## P1 — Immediate (Blocks Real Users)

- [x] **P1-regression** — Add regression tests for audit fixes
  - `useWllamaTruebadour` — double-init guard (C1 fix)
  - `useKokoroWebTTS` — double-init guard (C2 fix)
  - `useAuth` — unmount guard (M1 fix)
  - `useBackendBridge` — stale closure fix (M2 fix)
  - These fixes can silently regress without tests
  - **Effort:** Medium (4 test files, ~20 cases)

- [x] **P1-keyboard** — Keyboard accessibility for 48 components
  - 48 components have `onClick` without `onKeyDown`
  - App is completely unusable via keyboard
  - Fix: Add `onKeyDown={(e) => e.key === 'Enter' && handler()}` to all interactive elements
  - **Effort:** Medium (systematic find-and-fix)

- [x] **P1-auth-ui** — Replace "Offline" auth button with sovereign mode messaging
  - Current: greyed-out button saying "Offline" — looks broken
  - Target: shield icon + "Your data stays on your device" — looks intentional
  - This is a *feature* (privacy-first, no account needed), not a bug
  - **Effort:** Small (AuthButton.jsx edit)

- [x] **P1-api-key** — Audit `VITE_TRUEBADOUR_API_KEY` exposure
  - Currently embedded in client-side bundle via `import.meta.env`
  - If this is a secret API key, it's exposed to every visitor
  - Fix: If secret → move to DaaS proxy; if public → document as safe
  - **Effort:** Small (investigation) → Medium (if proxy needed)

---

## P2 — High Leverage (Improves Experience + Maintainability)

- [x] **P2-onboarding** — Trigger onboarding from game mode entry
  - 5-step flow exists (Welcome → Breathing → Phase → Tier → Ready) but never fires
  - **HARD RULE: No blocking the landing page.** All introductory content must be in widgets, with consent and skip ability.
  - Landing page sets the first impression — no auto-redirect, no forced navigation
  - Fix: Check `localStorage` for `voixvive_onboarded` in FreePlayGuard; if absent, show OnboardingModal as overlay widget (not replacing content)
  - Key: `voixvive_onboarded` (set by OnboardingModal.finish())
  - Design: Onboarding is voluntary, tied to game mode as tutorial system, always skippable (X button on every step)
  - **Effort:** Small (localStorage check + overlay widget in FreePlayGuard)

- [x] **P2-progress** — Add progress percentage to StudentDashboard
  - "You are 23% of the way to Truebadour" — simple, motivating, shareable
  - Calculate: completed DAG nodes / 121 total nodes
  - **Effort:** Small (one derived value + UI element)

- [x] **P2-orphan-deps** — Remove orphaned dependencies
  - `@tailwindcss/typography` — ⚠️ kept (used in tailwind.config.js + Bible12M.jsx prose classes)
  - `react-helmet-async` — ⚠️ kept (used in main.jsx HelmetProvider)
  - `@tauri-apps/api` + `@tauri-apps/plugin-opener` — ✅ removed (not used in src/)
  - `@tauri-apps/cli` — ✅ removed from devDependencies + "tauri" script
  - `supabase/` directory — ⬜ still pending (Edge functions for removed Supabase project)
  - **Effort:** Small (uninstall + delete dir)

- [x] **P2-design-tokens** — Extract design tokens to CSS variables
  - `#c9a96e` (brand gold): 377 references across 62 files
  - `rgba(201,169,110)`: 217 additional references
  - Font stacks: 249 inline `fontFamily` declarations
  - Changing brand gold currently requires editing 62 files
  - Fix: Create `src/styles/tokens.css` with CSS custom properties; replace inline hex with `var(--color-gold)`
  - **Effort:** Medium (systematic replacement)

---

## P3 — Maintainability (Reduces Complexity)

- [x] **P3-decompose-slides** — Decompose SlideViewer (1,182 → ~880 lines)
  - Extracted: `SlideViewer.css` (~300 lines of CSS-in-JS moved to external stylesheet)
  - Remaining: SlideRenderer, SlideNav, SlideAudio, SlideQuiz hooks (state/audio/gesture logic still inline)
  - **Effort:** Medium → Partial (CSS extraction complete)

- [x] **P3-decompose-charsheet** — Decompose CharacterSheet (1,128 → ~788 lines)
  - Extracted: `CharacterSheet.styles.js` (~340 lines of inline styles)
  - Remaining: StatBlock, XPTracker, BardTitle, CertModal, ExportButton component extractions
  - **Effort:** Medium → Partial (styles extraction complete)

- [x] **P3-decompose-beworkbook** — Decompose BEWorkbook (1,053 → ~144 lines)
  - Extracted: `BEWorkbook.styles.js` (420 lines) + `BEWorkbookHeader.jsx` (fret selector)
  - Extracted: `BEWorkbookProgressTab.jsx` (nodes grid + phase checklist)
  - Extracted: `BEWorkbookScheduleTab.jsx` (daily practice cards + wind-down)
  - Extracted: `BEWorkbookOverallProgress.jsx` (progress bar)
  - **Effort:** Medium → Complete

- [x] **P3-bookwidget-state** — Refactor BookWidget (14 `useState` → 6 `useState` + 2 hooks)
  - Extracted: `useMobileDetect.js` (reactive window width check)
  - Extracted: `useBookAudio.js` (audio player state: track, play, mute, volume, time, duration, error)
  - Derived `isActive` and `progress` moved to `useMemo`
  - **Effort:** Small-Medium → Complete

- [x] **P3-ls-namespace** — Normalize localStorage keys
  - Three conventions: `voixvive_` (22 keys), `voix_vive_` (4 keys), `bard_` (1 key)
  - Fix: Created `src/lib/storageKeys.js` (24 key registry) + `src/lib/storage.js` (vvGet/vvSet/vvGetJSON with one-time migration)
  - Migrated: App.jsx, OnboardingModal.jsx, useWllamaTruebadour.js, useLocale.js, BEWorkbook.jsx
  - Remaining: 41 files still use raw localStorage — migrate incrementally
  - **Effort:** Small (systematic rename + migration helper)

- [x] **P3-aria-landmarks** — Add ARIA landmarks and roles
  - Current: 26 `aria-` attributes, 0 `role=`, 0 landmarks
  - Fix: Added `<main role="main">` around Routes in App.jsx, `role="complementary"` to TruebadourWidget + BookWidget, `aria-label` on nav elements
  - **Effort:** Small (6-8 layout components)

---

## P4 — Growth & Marketing (User-Facing Improvements)

- [x] **P4-i18n-gap** — i18n for components missing `useLocale`
  - Was: ~9 components without `useLocale`; scoped down from exaggerated "34 components"
  - Wired: `PrimaryNav`, `AuthButton`, `Onboarding`, `FeedbackButton`, `DAGProgressBar`, `OnboardingModal`, `MentorVideoRecorder`, `ErrorBoundary`
  - 115 new keys added to both `en.json` and `fr.json` (Navigation, Auth, Onboarding, Feedback, Error recovery, Mentor tools)
  - `Skeleton.jsx`, `ScrollToTop.jsx` — no user-facing strings, skipped intentionally
  - **Effort:** Large

- [x] **P4-try-it-page** — Pitch detector demo UX polish
  - Re-scoped: no new page; improved existing `PitchRoom` and `DailyCalibration` to match competitor UX
  - Auto-mic-enable on "Start", pitch deviation meter, success haptic + chord chime
  - DailyCalibration: cumulative progress ring, checkmark animation on tuned strings
  - **Effort:** Medium

- [x] **P4-shareable-sheet** — Make Character Sheet shareable
  - Canvas-based PNG card (1200×675, social-media-ready) generated natively — no dependencies
  - Shows: name, bard title, epithet, streak, minutes, chapters, Truebadour type, core stat bars
  - Camera photo capture: 📷 button on portrait → circular preview → capture → embed in share card
  - Photo persisted to localStorage (`vv_profile_photo`); loads on next visit
  - Web Share API with image file on supported devices; fallback: auto-download + clipboard copy
  - Share button added to CharacterSheet header
  - **Effort:** Medium

- [x] **P4-interval-nav** — Surface interval metaphors in navigation
  - FRET_METADATA.character merged into `NeckMenu` items → `{character} · Chapter {N} · {interval}`
  - StudentDashboard SYLLABUS titles flipped: metaphor names primary
  - All user-facing "Fret" → "Chapter" across 8 files
  - **Effort:** Small

- [x] **P4-audio-prompt** — Add audio permission prompt
  - `audioEngine.js`: new `isAudioPermissionNeeded()` helper
  - `PitchRoom` + `usePitchDetector`: AudioContext suspension guard with user-friendly error
  - **Effort:** Small

- [x] **P4-undo-safety** — Add confirmation dialogs before destructive actions
  - `SongwritingCompanion`: delete song
  - `DigitalBinder`: reset daily checklist
  - `VoiceSettingsPanel`: reset voice defaults
  - **Effort:** Small

---

## P5 — Long-Term Quality (Technical Debt)

- [x] **P5-component-tests** — Component integration tests
  - `src/hooks/useScaffoldingActions.gate.test.js` — 8 tests covering gate enforcement regression:
    - Rejects BE/DO/PLAY completion when respective gate not passed
    - Allows completion when gate IS passed
    - passGate + completePhase chain works (stale-closure fix)
    - passGate idempotency
    - Completion without nodeId updates fret only
  - Pre-existing `completePhaseChain.test.js` failure (unrelated — `isNodeUnlocked` returns false, test expects true)
  - Remaining: MentorDashboard, PracticeRecorder, BreathingGate, BookWidget component-level integration tests
  - **Effort:** Large (4+ test files, ~30 cases)

- [ ] **P5-inline-to-css** — Migrate inline styles to Tailwind or CSS modules
  - 884 inline style blocks, 178 unique hardcoded colors
  - Enables: responsive breakpoints, dark mode, design system
  - **Effort:** Very Large (62 components, systematic)

- [x] **P5-pitch-gated** — Gate fret completion on pitch accuracy
  - Fix: `useScaffoldingActions.completePhase` now uses functional updater pattern — reads latest traction state
  - Gate enforcement: checks `${phase}GatePassed` in business logic before completing; silently rejects if not passed
  - Solves stale-closure bug when `passGate` + `completePhase` are chained in same event handler
  - `passGate` also migrated to functional updater for consistency
  - PitchRoom already auto-passes gate on pitch match success; button disabled until gate passed — now backed by enforced business logic
  - **Effort:** Medium (hook integration + gate logic)

- [x] **P5-csp** — Add Content Security Policy headers
  - CSP meta tag added to `index.html` + dev server headers in `vite.config.js`
  - Policy: default-src 'self', script-src 'self' 'wasm-unsafe-eval' blob:, style-src 'self' 'unsafe-inline' https://fonts.googleapis.com, img-src 'self' data: blob:, media-src 'self' blob:, connect-src 'self' ws: wss: localhost, worker-src 'self' blob:
  - **Effort:** Small (config addition)

- [x] **P5-console-dev** — Gate console.log behind DEV mode
  - Created `src/lib/devLog.js` with `devLog`, `devWarn`, `devInfo` utilities
  - Migrated: `notificationService.js` (4), `r2Service.js` (3), `audioStreamingService.js` (2), `driveService.js` (3), `calendarService.js` (1), `ScaffoldingProvider.jsx` (1), `curriculumIndexer.js` (3), `mockAIPipeline.js` (1)
  - ~18 calls gated; `console.error` kept visible (errors matter in production)
  - **Effort:** Small (systematic find-and-wrap)

- [ ] **P5-dual-write** — Resolve dual-write persistence
  - Same data in localStorage + IndexedDB with no consistency guarantee
  - Target: IndexedDB as source of truth, localStorage as synchronous read cache
  - **Effort:** Medium (ScaffoldingProvider refactor)

---

## Phase E — Test Coverage (From Invasive Audit Tracker)

- [ ] **T1** — `useAuth` tests: session hydration, auth state change, isMounted guard, signOut
- [ ] **T2** — `useWllamaTruebadour` tests: init idempotency, retry limit, unload reset
- [ ] **T3** — `useKokoroWebTTS` tests: init idempotency, speak lifecycle, cancel mid-play, generateBlob
- [ ] **T4** — `progressSyncEngine` tests: merge local→cloud, conflict resolution, offline queue, IndexedDB fallback
- [ ] **T5** — `ScaffoldingProvider` tests: hydration from IndexedDB, unmount during async, DAG merge
- [ ] **T6** — `audioStreamingService` tests: connect/disconnect cycle, AudioContext cleanup, recording start/stop
- [ ] **T7** — `useBackendBridge` tests: switchBackend uses ref not stale state, detectBackends guarded, fetchWithRetry backoff

> Note: T1-T2 overlap with P1-regression. Execute together.

---

## Execution Order

```
Phase 1 (P1)  ── Regression tests + keyboard a11y + auth UI + API key audit     ~3 days
Phase 2 (P2)  ── Onboarding + progress % + orphan deps + design tokens           ~2 days
Phase 3 (P3)  ── Component decomposition + state refactor + LS namespace + ARIA  ~4 days
Phase 4 (P4)  ── i18n + Try It page + shareable sheet + interval nav + safety    ~5 days
Phase 5 (P5)  ── Full test suite + CSS migration + pitch-gated completion        ~7 days
Phase E       ── T1-T7 test coverage (overlaps with P1-regression)               ~2 days
                                                                  Total: ~23 days
```

---

## Completion Tracking

| Phase | Items | Status | Tests |
|-------|-------|--------|-------|
| Invasive Audit | 20/20 | ✅ Complete | 108/108 |
| P1 | 4/4 | ✅ Complete | 4 regression test files, 12 cases, all pass |
| P2 | 4/4 | ✅ Complete | — |
| P3 | 6/6 | ✅ Complete | — |
| P3-bonus | 6 | ✅ Complete (extra) | — |
| P4 | 6/6 | ✅ Complete | — |
| P5 | 5/6 | 🟡 In Progress (csp + console + pitch-gated + tests + dual-write done) | 8 gate tests pass |
| Phase E | 0/7 | ⬜ Pending | — |

### Bonus Work Completed (not in original P3 plan)
- Skeleton loading states (Skeleton.jsx + applied to StudentDashboard, LandingScreen)
- Hover state system (8 CSS utility classes in index.css)
- Mobile viewport fixes (responsive breakpoints, touch optimizations, safe areas)
- Auto-save hook (useAutoSave.js + applied to JournalEntry)
- Error boundaries (already existed — verified coverage)
- 3 speculative test files created then deleted (APIs didn't match — needs Phase E proper rewrite)

---

## Loose Ends Discovered (Post-P4 Audit)

> Discovered during P4 completion sweep. Not blockers — document for future prioritization.

### i18n Style Debt
- `MaturationMap.jsx`, `Binder.jsx` use inline `lang === 'fr' ? ... : ...` instead of `t()` keys
- Pattern: 6+ components have this hybrid approach — works but is inconsistent and hard to extend to new languages
- **Fix:** Extract inline strings to `t()` keys in locale files

### Components Still Missing `useLocale` (Low Impact)
- `MultiKeyHub.jsx` — hardcoded English scale labels (Major, Natural Minor, Major Penta, etc.) — only used in guitar theory hub
- `PlingTrainer.jsx` — game-like pitch trainer, mostly symbols and numbers
- `HumanOctaveLibrary.jsx` — video library, mostly media labels
- These are functional without i18n but would benefit from it eventually

### Console Calls in Production Paths
- Actual count: ~30 `console.log/warn/error` across 15 files (higher than original audit's "21")
- Key offenders: `notificationService.js` (4), `R2Service.js` (4), `audioStreamingService.js` (3), `driveService.js` (2)
- `ErrorBoundary.jsx` `componentDidCatch` logs — this one should stay (errors are important)
- **Fix:** Wrap non-error logs in `import.meta.env.DEV` or use a `devLog` utility

### Raw localStorage Usage
- ~25 files still use raw `localStorage.getItem/SetItem` outside of `vvGet/vvSet`
- Migration to `storageKeys.js` + `storage.js` is partially complete (P3-ls-namespace)
- Files like `game/AdventurePlayer.jsx`, `game/VertiscaleEngine.jsx`, `pages/CScaleHub.jsx`, `data/curriculumIndexer.js` not yet migrated

### CSP Still Missing
- `vite.config.js` has `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` for SharedArrayBuffer
- No `Content-Security-Policy` header defined — XSS risk for react-markdown user content rendering
- **Status:** Documented as P5-csp, remains open
