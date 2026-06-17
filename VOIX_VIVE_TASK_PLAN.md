# Voix Vive — Remaining Task Plan
> Slow & Steady. Expert attention to detail. No breaking changes.
> Last updated: 2026-06-15

---

## Philosophy
- One task at a time. Verify, test, commit.
- No broad refactors. Component-by-component only.
- Run `npm --prefix apps/companion-app test -- --run` after every change.
- Run `npm --prefix apps/companion-app run build` after every session.

---

## Phase A — Safe Loose Ends (Zero Risk)
> These changes are cosmetic, additive, or gated. They cannot break functionality.

### A1 — i18n Style Debt
**Files**: `MaturationMap.jsx`, `Binder.jsx`
**What**: Replace inline `lang === 'fr' ? ... : ...` with `t()` keys
**Risk**: None (strings only)
**Steps**:
1. Add keys to `locales/en.json` and `locales/fr.json`
2. Replace conditionals with `const { t } = useLocale()` calls
3. Verify both languages render correctly
**Effort**: Small (2 files)

### A2 — Add `useLocale` to Low-Impact Components
**Files**: `MultiKeyHub.jsx`, `PlingTrainer.jsx`, `HumanOctaveLibrary.jsx`
**What**: Wire `useLocale` hook, extract hardcoded strings to locale files
**Risk**: None (additive, falls back to English)
**Steps**:
1. Import `useLocale` in each component
2. Extract strings to `locales/en.json`
3. Use `t('key')` for labels, titles, descriptions
**Effort**: Small-Medium (3 files)

### A3 — Gate Remaining Console Calls
**Files**: `notificationService.js` (4), `R2Service.js` (4), `audioStreamingService.js` (3), `driveService.js` (2)
**What**: Wrap non-error `console.log/warn` in `import.meta.env.DEV` or use `devLog` utility
**Risk**: None (logging only)
**Steps**:
1. Import `devLog` from `src/lib/devLog.js`
2. Replace `console.log` → `devLog`, `console.warn` → `devWarn`
3. Leave `console.error` untouched (errors matter in production)
**Effort**: Small (4 files)

### A4 — Add CSP Header to vite.config.js
**File**: `vite.config.js`
**What**: Add `Content-Security-Policy` to server headers (already in index.html meta tag)
**Risk**: None (header already defined, just needs server-side mirror)
**Steps**:
1. Verify current CSP meta tag in `index.html`
2. Add identical policy string to `vite.config.js` server.headers
3. Test dev server loads without CSP errors in browser console
**Effort**: Tiny

---

## Phase B — Phase E Test Coverage (Low Risk)
> Writing tests for existing code. If a test fails, the code is the source of truth.

### B1 — T1: `useAuth` Tests
**Scope**: session hydration, auth state change, isMounted guard, signOut
**Risk**: Low (test-only, no code changes)
**Depends on**: None
**Steps**:
1. Create `src/hooks/__tests__/useAuth.test.js`
2. Mock Supabase auth client or test in "sovereign mode" (no Supabase)
3. Cover: initial state, signOut clears state, unmount guard prevents setState
**Effort**: Medium

### B2 — T2: `useWllamaTruebadour` Tests
**Scope**: init idempotency, retry limit, unload reset
**Risk**: Low (test-only)
**Depends on**: None
**Steps**:
1. Create `src/hooks/__tests__/useWllamaTruebadour.test.js`
2. Mock `Wllama` class
3. Cover: double-init guard, retry count increments, unload resets state
**Effort**: Medium

### B3 — T7: `useBackendBridge` Tests
**Scope**: switchBackend uses ref not stale state, detectBackends guarded, fetchWithRetry backoff
**Risk**: Low (test-only)
**Depends on**: None
**Steps**:
1. Create `src/hooks/__tests__/useBackendBridge.test.js`
2. Mock fetch for backend detection
3. Cover: backend switching, retry backoff timing, stale closure fix
**Effort**: Medium

### B4 — T3: `useKokoroWebTTS` Tests
**Scope**: init idempotency, speak lifecycle, cancel mid-play, generateBlob
**Risk**: Low (test-only)
**Depends on**: None
**Steps**:
1. Create `src/hooks/__tests__/useKokoroWebTTS.test.js`
2. Mock Kokoro TTS engine
3. Cover: init once, speak→cancel→speak sequence, blob generation
**Effort**: Medium

### B5 — T6: `audioStreamingService` Tests
**Scope**: connect/disconnect cycle, AudioContext cleanup, recording start/stop
**Risk**: Low (test-only)
**Steps**:
1. Create `src/lib/__tests__/audioStreamingService.test.js`
2. Mock WebSocket and AudioContext
3. Cover: connection lifecycle, cleanup on disconnect, recording state
**Effort**: Medium

### B6 — T5: `ScaffoldingProvider` Tests
**Scope**: hydration from IndexedDB, unmount during async, DAG merge
**Risk**: Low (test-only)
**Steps**:
1. Create `src/components/__tests__/ScaffoldingProvider.test.js`
2. Mock IndexedDB/Dexie
3. Cover: hydration, unmount safety, DAG state merge
**Effort**: Large (complex component)

### B7 — T4: `progressSyncEngine` Tests
**Scope**: merge local→cloud, conflict resolution, offline queue, IndexedDB fallback
**Risk**: Low (test-only)
**Steps**:
1. Create `src/lib/__tests__/progressSyncEngine.test.js`
2. Mock Supabase and IndexedDB
3. Cover: sync merge logic, offline queue, conflict resolution
**Effort**: Large (complex engine)

---

## Phase C — localStorage Migration (Medium Risk)
> Systematic migration from raw localStorage to `vvGet/vvSet`. Must preserve data.

### C1 — Audit Remaining Files
**What**: Identify all files using raw `localStorage.getItem/SetItem`
**Risk**: None (audit only)
**Steps**:
1. Search for `localStorage.getItem`, `localStorage.setItem`, `localStorage.removeItem`
2. Catalog each file + key used
3. Map each raw key to `STORAGE_KEYS` constant
**Effort**: Small (1 session)

### C2 — Migrate Game Files
**Files**: `game/AdventurePlayer.jsx`, `game/VertiscaleEngine.jsx`, `game/VertiscaleEngine.jsx`
**Risk**: Low-Medium (data migration needed)
**Steps**:
1. Import `vvGet`, `vvSet`, `STORAGE_KEYS`
2. Replace raw localStorage calls
3. Add one-time data migration: read old key → write new key → remove old key
4. Test game progress persists across reload
**Effort**: Medium

### C3 — Migrate Page Files
**Files**: `pages/CScaleHub.jsx`, `pages/StudentDashboard.jsx`, etc.
**Risk**: Low
**Steps**:
1. Import `vvGet`, `vvSet`, `STORAGE_KEYS`
2. Replace raw localStorage calls
3. Test page state persists
**Effort**: Medium

### C4 — Migrate Data Files
**Files**: `data/curriculumIndexer.js`, `data/notificationEngine.js`, etc.
**Risk**: Low
**Steps**:
1. Import `vvGet`, `vvSet`, `STORAGE_KEYS`
2. Replace raw localStorage calls
3. Verify curriculum indexing still works
**Effort**: Small-Medium

---

## Phase D — P5 Inline-to-Tailwind Migration (Higher Risk)
> Large effort. Break into micro-batches. One component at a time.

### D1 — Audit & Prioritize
**What**: Rank components by inline style count
**Risk**: None (audit only)
**Steps**:
1. List all 72 files with inline styles
2. Sort by count (highest first)
3. Top targets: `CharacterSheet.jsx` (141), `VertiscaleEngine.jsx` (141), `LandingScreen.jsx` (24)
**Effort**: Small (1 session)

### D2 — Extract Design Tokens First
**What**: Create CSS custom properties for repeated values
**Risk**: Low (additive)
**Steps**:
1. Create `src/styles/tokens.css` with brand colors, spacing, fonts
2. Import in `index.css`
3. Verify no visual regressions
**Effort**: Small

### D3 — Migrate One Component (Pilot)
**Target**: Smallest component with inline styles (e.g., `FeedbackButton.jsx` — 2 styles)
**Risk**: Low (small surface area)
**Steps**:
1. Map inline styles to Tailwind classes
2. Extract any repeated values to tokens
3. Verify visually identical
4. Commit before next component
**Effort**: Small (per component)

### D4 — Continue Component-by-Component
**Approach**: 1-2 components per session, smallest first
**Risk**: Medium (many changes, visual regressions possible)
**Steps**:
1. Pick next component from prioritized list
2. Migrate styles to Tailwind
3. Visual verification
4. Commit
5. Repeat
**Effort**: Very Large (ongoing)

---

## Execution Order

```
Phase A (Safe)     → A1 → A2 → A3 → A4        (1-2 sessions)
Phase B (Tests)    → B1 → B2 → B7 → B3 → B6 → B4 → B5  (3-4 sessions)
Phase C (Migration) → C1 → C2 → C3 → C4       (2-3 sessions)
Phase D (Tailwind)  → D1 → D2 → D3 → D4...     (ongoing, 1-2 components/session)
```

**Total Estimated Time**: 8-12 focused sessions

---

## Success Criteria

- [ ] All console calls gated in production
- [ ] i18n consistent across all user-facing components
- [ ] CSP header active in dev server
- [ ] All 7 Phase E test files exist and pass
- [ ] Zero raw localStorage usage (all via `vvGet/vvSet`)
- [ ] Inline styles reduced by 50%+ (or component-by-component plan in place)
- [ ] Build succeeds, all existing tests pass after every session
