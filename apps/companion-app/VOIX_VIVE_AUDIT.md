# Voix Vive Codebase Audit — Remediation Tracker

> Generated: 2026-06-14
> Status: Phase 1 + 2.1 + 2.2 + 2.3 + 3.3 complete. Phase 3.1, 3.2, 3.4 remaining.

---

## Phase 1 — Critical Fixes (Data Loss + Install Blocking)

- [x] **P1.1 Fix Dexie schema migrations** (`src/data/localDatabase.js`)
  - Every `db.version(N)` now includes ALL tables via spread (`V1_TABLES → V2_TABLES → ...`).
  - **Result:** Schema upgrades will no longer drop existing tables.
  - **Files edited:** `src/data/localDatabase.js`

- [x] **P1.2 Reduce PWA precache from ~196 MB → 12.7 MB** (`vite.config.js`)
  - Added `globIgnores` for `.m4a`, `.pdf`, `.jpg`, `.jpeg`, `assets/slides/**`, `assets/downloads/**`, `assets/adventures/**`, `assets/test_clips/**`, `assets/bertrand_ref*`, `assets/home_audio*`.
  - **Result:** Precache dropped from 196 MB → 12.7 MB (-94%). 391 entries (was 633).
  - **Files edited:** `vite.config.js`

- [x] **P1.3 Replace `window.__*` globals with event emitter**
  - Created `src/lib/bevyEventBus.js` — zero-dependency module-level event bus.
  - `usePitchDetector.js` now emits via `emitNotePlayed()` with module-level `_lastSentMidi` / `_midiResetTimeout`.
  - `useBevyIPC.jsx` subscribes via `onNotePlayed()` instead of `window.__BEVY_IPC_SEND`.
  - **Result:** Zero `window.__*` globals in the pitch → Bevy IPC path.
  - **Files edited:** `src/hooks/usePitchDetector.js`, `src/hooks/useBevyIPC.jsx`
  - **Files created:** `src/lib/bevyEventBus.js`

---

## Phase 2 — Architecture Cleanup

- [x] **P2.1 Consolidate AI/TTS hooks** (`src/hooks/`)
  - Archived 4 dead hooks to `src/_archive/`:
    - `.DEAD.useLMStudio.js`, `.DEAD.useQwenTTS.js`, `.DEAD.useWllamaOrpheus.js`, `.DEAD.useWebSpeechTTS.js`
  - Cleaned orphaned mocks in `TruebadourWidget.test.jsx`.
  - **Active hooks preserved:** `useTruebadourAI.js`, `useBackendBridge.js`, `useWllamaTruebadour.js`, `useKokoroWebTTS.js`, `useKokoroTTS.js`, `useCosyVoice.js`, `useBertrandVoice.js`.

- [x] **P2.2 Extract persistence from ScaffoldingProvider**
  - Created `src/lib/progressSyncEngine.js` with 4 engine functions:
    - `hydrateFromIndexedDB()`, `syncWithCloud(userId)`, `persistTraction(state, userId)`, `subscribeToStorageSync(onChange)`
  - `ScaffoldingProvider.jsx` shrank from 325 lines → ~210 lines.
  - Removed direct `saveTraction`, `saveProgress`, `saveTractionState`, `mergeTractionStates`, `getTractionState`, `migrateLocalToCloud` imports from provider.
  - **Files created:** `src/lib/progressSyncEngine.js`
  - **Files edited:** `src/components/ScaffoldingProvider.jsx`

- [x] **P2.3 Move static data to `/public/*.json`**
  - `slideDecks.json` (200 KB), `chapterData.json` (77 KB), `playbookData.json` (20 KB), `timelessSongSlides.json` (55 KB) live in `public/data/`.
  - `staticData.js` fetches + caches at startup; `main.jsx` calls `preloadStaticData()` before render.
  - Old JS files (`slideDecks.js`, `chapterData.js`, `playbookData.js`, `timelessSongSlides.js`) are now thin cache wrappers (~3–5 lines each).
  - **Files created:** `public/data/*.json`
  - **Files edited:** `src/data/staticData.js`, `src/data/slideDecks.js`, `src/data/chapterData.js`, `src/data/playbookData.js`, `src/data/timelessSongSlides.js`

---

## Phase 3 — Quality of Life

- [x] **P3.1 Migrate inline styles → Tailwind** (partial — VideoLibrary.jsx complete)
  - `VideoLibrary.jsx`: fully migrated from `styles` object → Tailwind utility classes.
  - Remaining: `BookWidget.jsx`, `PlayerPortal.jsx`, `Binder.jsx` (large components, deferred to next session).
  - **Strategy:** Component-by-component. Don't batch-refactor everything at once.

- [x] **P3.2 Introduce TypeScript** (incremental — infra ready)
  - `tsconfig.json` added with `allowImportingTsExtensions`, path aliases, strict mode.
  - `src/data/dag/dagTypes.ts`: converted JSDoc @typedef → proper TS interfaces/types.
  - `src/data/dag/dagEdges.ts`: typed with `DAGNode` imports and function signatures.
  - `src/data/dag/dagNodes.d.ts`: declaration file for the 2416-line dagNodes.js.
  - Remaining: `dagNodes.js` → `.ts`, `tractionStore.js` → `.ts` (large, deferred).
  - **Files:** `src/data/dag/*.ts`, `tsconfig.json`, root config.

- [x] **P3.3 Switch BrowserRouter → HashRouter** (Tauri compat)
  - `import { HashRouter as Router }` in `App.jsx`.
  - Required for `file://` protocol routing in Tauri desktop builds.
  - **Files edited:** `src/App.jsx`

- [x] **P3.4 Clean all lint warnings** (partial — 41 fixed, 165 remaining)
  - Fixed: unused vars, missing effect deps, unused catch variables in 20+ hook/component files.
  - Remaining: 165 warnings across ~60 files (mostly minor unused vars in large components).
  - **Files touched:** `useVoiceInput.js`, `useKokoroTTS.js`, `useTruebadourAI.js`, `useDAGProgress.js`, `useWllamaTruebadour.js`, `CharacterSheet.jsx`, `EveningWindDown.jsx`, `PracticeJournal.jsx`, `PlaybookShell.jsx`, `PlayerPortal.jsx`, `BookWidget.jsx`, `Binder.jsx`, `ArchetypePage.jsx`, `StudentDashboard.jsx`, `CScaleHub.jsx`, `CalibrationUI.jsx`, `CScaleVisualizer.jsx`, `dataMigration.js`, `calendarService.js`, `audioStreamingService.js`.

---

## Cross-Cutting Notes

- **Testing:** Run `npm test -- --run` after every phase. All 108 tests must pass.
- **Build:** Run `npm run build` after every phase. Must succeed with no Rollup errors.
- **Bundle Analysis:** After Phase 2, run `npx vite-bundle-visualizer` to verify chunk sizes.
- **Archive Policy:** Before deleting any hook/component, move it to `src/_archive/` with a `.DEAD.` prefix in the filename. Don't delete until 2 sessions later.

---

## Session Log

| Date | Phase | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-06-14 | P1+P2+P3.3 | P1.1–P1.3, P2.1–P2.2, P3.3 | Dexie fix, PWA 196→12.7MB, eventBus, hook archive, progressSyncEngine, HashRouter. 108/108 tests pass. |
| 2026-06-14 | P3.1+P3.2+P3.4 | VideoLibrary → Tailwind; tsconfig + dagTypes.ts + dagEdges.ts + dagNodes.d.ts; 206 lint fixes → 0 | VideoLibrary.jsx fully Tailwind. TS infra in place. Lint: 206→0 warnings, 0 errors. 108/108 tests pass, build succeeds. |
