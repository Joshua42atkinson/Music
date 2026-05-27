# Voix Vive — Session State Audit
## 2026-05-27 | Document Hygiene & eModule Reality Check

> **Purpose:** Stop guessing about what works. This is the ground truth.

---

## I. WHAT GOT DONE THIS SESSION

| # | Task | File(s) | Status | Tested? |
|---|------|---------|--------|---------|
| 1 | Rename AmbientPlayer → Troubadour | `AmbientPlayer.jsx` | ✅ Complete | Build only |
| 2 | Guitar icon + tooltip fix | `AmbientPlayer.jsx` | ✅ Complete | Build only |
| 3 | AI chat below music/metronome | `AmbientPlayer.jsx` | ✅ Complete | Build only |
| 4 | Server status lights | `AmbientPlayer.jsx` | ✅ Complete | Build only |
| 5 | Remove GuitarWorkbench AI overlay | `GuitarWorkbench.jsx` | ✅ Complete | Build only |
| 6 | Move header buttons right | `GuitarWorkbench.jsx`, `PlayerPortal.jsx` | ✅ Complete | Build only |
| 7 | Route VertiscaleEngine | `App.jsx` + `/game` | ✅ Complete | HTTP 200 only |
| 8 | Route AdventurePlayer | `App.jsx` + `/adventure` | ✅ Complete | HTTP 200 only |
| 9 | Restore mentor pricing to /player | `PlayerPortal.jsx` | ✅ Complete | HTTP 200 only |
| 10 | Create eModule design doc | `12_GUITAR_EMODULE_PEARL_MATURATION.md` | ✅ Complete | N/A |
| 11 | Fix LandingScreen merge conflicts | `LandingScreen.jsx` | ✅ Complete | Build only |
| 12 | Push to GitHub | `main` branch | ✅ Complete | CI unknown |

**Critical gap:** Nothing was browser-tested before declaring "done." Server returns 200 but we don't know if components render correctly.

---

## II. THE GUITAR PAGE — What It Actually Is Right Now

### File: `src/components/GuitarWorkbench.jsx`

**What it claims to be:** The 12-fret tool hub, the guitar practice workbench.

**What it actually is:** A page with:
- Header (title + back/help buttons moved right)
- Quick Actions grid (12 buttons that open tools in modal)
- `useScaffolding` hook for traction/stats
- **NO AI chat** (removed — unified into Troubadour widget)
- **NO direct link to /game or /adventure** (still missing!)
- Tool modals: BreathingGate, PracticeTimer, PitchRoom, Metronome, IntervalVisualizer, FretboardExplorer, PlingTrainer, MicrotonalTracker, VertiscaleEngine (old inline?), AsyncAssessor, MultiKeyHub, RhythmEngine

**What it SHOULD be for the eModule:**
```
Guitar Workbench (The Practice Nook)
├── Header: "The Guitar — Fret [X] of 12"
├── Maturation Map (visual 12-fret progress)
│   ├── Current fret highlighted
│   ├── Click any fret → opens that chapter
│   └── Locked frets shown with "complete previous to unlock"
├── Today's Practice (AI or user-selected)
│   ├── Suggested tool based on curriculum position
│   └── "Start Session" button
├── All Tools Grid (12 tools, always accessible)
│   ├── Click → opens tool modal
│   └── Mark as "practiced today"
├── Quick Links
│   ├── 🎮 Vertiscale Game → /game
│   ├── 📖 Troubadour Adventure → /adventure
│   ├── 📚 Playbook → /playbook
│   └── 🎓 Studio → /studio
└── Session Summary
    ├── Minutes practiced today
    └── Streak / consistency
```

**What's missing:**
- [ ] Maturation Map visualization
- [ ] Link to /game (Vertiscale)
- [ ] Link to /adventure (CYOA)
- [ ] Curriculum position awareness (which fret am I on?)
- [ ] Tool completion tracking (which tools did I use today?)
- [ ] AI-guided session suggestions

---

## III. DOCUMENT INVENTORY — Research Folder

| File | Purpose | Status | Action |
|------|---------|--------|--------|
| `09_master_architecture_doc.md` | System arch | ⚠️ Stale (880 bytes!) | **Archive** — superseded by 10_MASTER |
| `10_MASTER_DESIGN_DOC.md` | Pedagogy, business, IP | ✅ Active source of truth | Keep |
| `10_design_doc_01_foundation.md` | ADDIECRAPEYE | ✅ Active | Keep |
| `10_design_doc_02_curriculum.md` | 12-fret map | ✅ Active | Keep |
| `10_design_doc_03_vertiscale_game.md` | Game design | ✅ Active | Keep |
| `10_design_doc_04_platform_and_business.md` | Tech & pricing | ✅ Active | Keep |
| `11_bertrand_content_request.md` | Content asks from Bertrand | ✅ Active | Keep |
| `12_GUITAR_EMODULE_PEARL_MATURATION.md` | Unification blueprint | ✅ New, this session | Keep |
| `TROUBADOUR_AI_REPORT.md` | AI research | ✅ Active | Keep |
| `session_artifacts/` | Old session notes | ⚠️ May be stale | Review & archive |

### Docs Folder

| File | Purpose | Status |
|------|---------|--------|
| `00_MASTER.md` | Platform overview | ✅ Active |
| `01_PEDAGOGY.md` | Teaching philosophy | ✅ Active |
| `02_ARCHITECTURE.md` | Tech stack | ⚠️ Partially stale |
| `03_TROUBADOUR.md` | AI widget spec | ✅ Active |
| `04_ROADMAP.md` | Dev timeline | ⚠️ Needs update |
| `05_PEARL_STANDARD.md` | Design quality rubric | ✅ Active |

---

## IV. COMPONENT AUDIT — What's Used vs Orphaned

### Routed in App.jsx (ACTIVE)

| Component | Route | Used? | Notes |
|-----------|-------|-------|-------|
| `LandingScreen` | `/` | ✅ Yes | 4 portals + coaching |
| `OrientationHub` | `/song` | ✅ Yes | Timeless Song slides |
| `GuitarWorkbench` | `/guitar` | ✅ Yes | Tool hub |
| `PlayerPortal` | `/player` | ✅ Yes | Submissions + pricing |
| `PlaybookShell` | `/playbook` | ✅ Yes | Character/Quests/Songbook/Journal |
| `StudioPage` | `/studio` | ✅ Yes | Pricing/mentorship |
| `VertiscaleEngine` | `/game` | ✅ NEW | Was orphaned, now routed |
| `AdventurePlayer` | `/adventure` | ✅ NEW | Was orphaned, now routed |
| `CurriculumSummary` | `/summary` | ? | Exists, unsure if linked |
| `AIDeveloperChat` | `/ai-developer` | ? | Internal dev tool |
| `PrivacyPolicy` | `/privacy` | ✅ Yes | Footer link |
| `TermsOfService` | `/terms` | ✅ Yes | Footer link |

### Imported by active components (SEMI-ACTIVE)

These are imported but may be conditionally rendered or buried:

| Component | Imported By | Actually Rendered? |
|-----------|-------------|-------------------|
| `BreathingGate` | `GuitarWorkbench`, `DigitalBinder` | ✅ In tool modal |
| `PracticeTimer` | `GuitarWorkbench`, `DigitalBinder` | ✅ In tool modal |
| `PitchRoom` | `GuitarWorkbench`, `DigitalBinder` | ✅ In tool modal |
| `Metronome` | `GuitarWorkbench`, `AmbientPlayer` | ✅ In tool modal + widget |
| `IntervalVisualizer` | `GuitarWorkbench` | ✅ In tool modal |
| `FretboardExplorer` | `GuitarWorkbench`, `VertiscaleEngine` | ✅ In tool modal + game |
| `PlingTrainer` | `GuitarWorkbench` | ✅ In tool modal |
| `MicrotonalTracker` | `GuitarWorkbench` | ✅ In tool modal |
| `AsyncAssessor` | `GuitarWorkbench` | ✅ In tool modal |
| `MultiKeyHub` | `GuitarWorkbench` | ✅ In tool modal |
| `RhythmEngine` | `GuitarWorkbench` | ✅ In tool modal |
| `DigitalBinder` | `MentorTools` | ⚠️ MentorTools not routed |
| `MentorDashboard` | `MentorTools` | ⚠️ MentorTools not routed |
| `SlideViewer` | `OrientationHub` | ✅ Yes |
| `NeckMenu` | `OrientationHub`, `SlideViewer` | ✅ Yes |
| `PracticeRecorder` | `PlayerPortal`, `AsyncAssessor` | ✅ Yes |
| `ScaffoldingProvider` | `App.jsx` | ✅ Yes |
| `ErrorBoundary` | `App.jsx` | ✅ Yes |
| `CoachingPortal` | `LandingScreen` | ✅ Yes (modal) |
| `ProfileModal` | `LandingScreen` | ✅ Yes (modal) |

### POTENTIALLY ORPHANED — Needs Decision

| Component | File | Why It Might Be Dead | Recommendation |
|-----------|------|---------------------|----------------|
| `BiometricSanctum` | `BiometricSanctum.jsx` | Imported by VertiscaleEngine but... is it used? | **Verify in game** |
| `FretboardSheet` | `FretboardSheet.jsx` | Imported by VertiscaleEngine, `DigitalBinder` | **Verify in game** |
| `Glossary` | `Glossary.jsx` | Imported by SlideViewer, CoachingPortal | ✅ Keep (used) |
| `LMStudioStatus` | `LMStudioStatus.jsx` | Only imported by itself? Check | **Verify** |
| `LMStudioSubAgent` | `LMStudioSubAgent.jsx` | Dev tool, imported by...? | **Verify** |
| `PitchTelemetryMap` | `PitchTelemetryMap.jsx` | Imported by VertiscaleEngine | **Verify in game** |
| `WelcomeOnboarding` | `WelcomeOnboarding.jsx` | Imported by...? | **Verify** |
| `SongwritingCompanion` | `SongwritingCompanion.jsx` | Imported by PlaybookShell | ✅ Keep (used) |
| `HelpMenu` | `HelpMenu.jsx` | Imported by GuitarWorkbench | ✅ Keep (used) |
| `MentorTools` | `MentorTools.jsx` | NOT routed in App.jsx | **ARCHIVE or ROUTE** |
| `CharacterSheet` | `playbook/CharacterSheet.jsx` | Used by PlaybookShell | ✅ Keep |
| `QuestLog` | `playbook/QuestLog.jsx` | Used by PlaybookShell | ✅ Keep |
| `Songbook` | `playbook/Songbook.jsx` | Used by PlaybookShell | ✅ Keep |
| `JournalEntry` | `playbook/JournalEntry.jsx` | Used by PlaybookShell | ✅ Keep |

### Hooks Audit

| Hook | Used By | Status |
|------|---------|--------|
| `useBackendBridge` | `LandingScreen` | ✅ Active |
| `useLocale` | Many | ✅ Active |
| `useLMStudio` | `AmbientPlayer` | ✅ Active |
| `usePracticeAI` | ??? | ⚠️ **MAY BE ORPHANED** |
| `useWebLLM` | ??? | ⚠️ **MAY BE ORPHANED** |
| `useScaffolding` | Many | ✅ Active |

---

## V. THE 12-FRET TOOL MAP — Code vs Design Alignment

| Fret | Design Doc Says | Code Reality | Gap |
|------|----------------|--------------|-----|
| 1 | Breathing Gate | ✅ `BreathingGate.jsx` exists | None |
| 2 | Practice Timer | ✅ `PracticeTimer.jsx` exists | None |
| 3 | Pitch Room | ✅ `PitchRoom.jsx` exists | None |
| 4 | Metronome | ✅ `Metronome.jsx` exists | None |
| 5 | Interval Visualizer | ✅ `IntervalVisualizer.jsx` exists | None |
| 6 | Fretboard Explorer | ✅ `FretboardExplorer.jsx` exists | None |
| 7 | PLING! Trainer | ✅ `PlingTrainer.jsx` exists | None |
| 8 | Microtonal Tracker | ✅ `MicrotonalTracker.jsx` exists | None |
| 9 | **Vertiscale Engine** | ✅ `VertiscaleEngine.jsx` exists, NOW ROUTED | **Was orphaned, fixed** |
| 10 | Async Assessor | ✅ `AsyncAssessor` in GuitarWorkbench | None |
| 11 | Multi-Key Hub | ✅ `MultiKeyHub.jsx` exists | None |
| 12 | Rhythm Engine | ✅ `RhythmEngine.jsx` exists | None |

**All 12 tools exist in code. Fret 9 was the only routing gap — fixed.**

---

## VI. WHAT'S ACTUALLY BROKEN (Known Issues)

### Lint Errors (Pre-existing, Not From This Session)

| File | Count | Type | Severity |
|------|-------|------|----------|
| `LandingScreen.jsx` | 12 | Unused vars from profile code | Low (doesn't break build) |
| `GuitarWorkbench.jsx` | 6 | Unused imports + setState in effect | Medium |
| `PlayerPortal.jsx` | 6 | Unused vars + setState in effect | Medium |

### Functional Issues (Needs Verification)

| Issue | Where | Impact | How to Test |
|-------|-------|--------|-------------|
| VertiscaleEngine at `/game` | Browser | Unknown if game loads | Navigate to `/game`, check console |
| AdventurePlayer at `/adventure` | Browser | Unknown if story loads | Navigate to `/adventure`, check console |
| PlayerPortal pricing cards | Browser | Visual layout unknown | Navigate to `/player`, scroll to bottom |
| Troubadour widget chat | Browser | AI streaming untested | Open widget, type message |
| MentorTools not routed | App.jsx | Mentor dashboard inaccessible | Should we route it? |

---

## VII. ARCHIVE DECISIONS — This Session

### Move to `_archive/2026-05-27_session_cleanup/removed_components/`

| Item | Reason |
|------|--------|
| `09_master_architecture_doc.md` | 880 bytes, completely superseded by `10_MASTER_DESIGN_DOC.md` |
| `usePracticeAI.js` | If confirmed orphaned (check imports first) |
| `useWebLLM.js` | If confirmed orphaned (check imports first) |

### Keep But Document

| Item | Action |
|------|--------|
| `BiometricSanctum.jsx` | Verify it's used in VertiscaleEngine before archiving |
| `MentorTools.jsx` | Decide: route it or archive it |
| `LMStudioStatus.jsx` | May be dev-only, verify usage |
| `LMStudioSubAgent.jsx` | May be dev-only, verify usage |

---

## VIII. NEXT STEPS — Prioritized

### Before Declaring "Working"
1. **Browser test every route** — `/`, `/guitar`, `/game`, `/adventure`, `/player`, `/playbook`, `/studio`
2. **Fix lint errors** — Clean up unused vars in LandingScreen, GuitarWorkbench, PlayerPortal
3. **Verify game components render** — Check console for import/runtime errors

### For eModule Maturation
4. **Add links in GuitarWorkbench** to `/game` and `/adventure`
5. **Create Maturation Map component** — Visual 12-fret progress
6. **Route MentorTools or archive it** — Decide fate

### For Document Hygiene
7. **Archive stale docs** — Move `09_master_architecture_doc.md` to archive
8. **Update `02_ARCHITECTURE.md`** — Reflect current stack
9. **Update `04_ROADMAP.md`** — Reflect actual progress

---

*Audit completed: 2026-05-27*
*Auditor: Cascade (honest about what wasn't tested)*

---

## APPENDIX A — Post-Push Fixes (2026-05-27 Continuation)

| # | Task | File(s) | Status | Tested? |
|---|------|---------|--------|---------|
| 13 | Fix LandingScreen lint errors (dead imports, dupes) | `LandingScreen.jsx` | ✅ Complete | Build |
| 14 | Fix GuitarWorkbench lint errors | `GuitarWorkbench.jsx` | ✅ Complete | Build |
| 15 | Fix PlayerPortal lint errors (useMemo, empty catches) | `PlayerPortal.jsx` | ✅ Complete | Build |
| 16 | Build verification | All files | ✅ Complete | Build pass |
| 17 | Add StudioPage navigation | `StudioPage.jsx` | ✅ Complete | Build |
| 18 | Rewrite `02_ARCHITECTURE.md` | `docs/02_ARCHITECTURE.md` | ✅ Complete | N/A |
| 19 | Document PlayerPortal vision | `docs/02_ARCHITECTURE.md` | ✅ Complete | N/A |
| 20 | Document navigation standard | `docs/02_ARCHITECTURE.md` | ✅ Complete | N/A |

**Build status:** ✅ `npm run build` passes (2.49s, no errors)
**Lint status:** ✅ `npx eslint` clean on all three files
**Push status:** ✅ `14aced3` on `main`

**Outstanding (not this session):**
- Browser testing of `/game`, `/adventure`, `/player`, `/guitar`
- Standardized nav bars on GuitarWorkbench, OrientationHub, PlaybookShell, VertiscaleEngine
- Supabase project setup + Google Auth
- Cloudflare Tunnel for LM Studio
- CAGED TCG shop design
