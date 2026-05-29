# Beta Changelog

All significant improvements, refactors, and feature additions made during the Voix Vive Beta phase are recorded here.

## [v1.0.0-beta.1] - 2026-05-29

### Added
- **144-Node Curriculum Expansion:** Shifted the pedagogical scope from 132 to 144 nodes for true symmetry (12 Frets x 12 Nodes).
- **The Somatic Gate:** A physical mastery milestone injected into the `guitar` pillar of all 12 frets. It acts as a strict Sandersonian limitation, ensuring students cannot proceed without completing a physical check-in.
- **Troubadour Widget Command Center:** Transformed `AmbientPlayer.jsx` into `TroubadourWidget.jsx`. Added a `SYS` (System & Identity) tab.
- **Global Memory Card:** Integrated `.voixvive` save/load logic directly into the Troubadour widget, making data persistence globally accessible across the app.
- **Dynamic Avatar Generation:** The widget now reads `active_student_profile` from local storage and displays a generated visual avatar.
- **QA Infrastructure:** Added `@vitest/coverage-v8` and `@vitest/ui` to the repository. Created the `docs/06_BETA_QA_PROGRAM.md` document to guide testing philosophy.
- **Sandbox Mode:** Added a toggle in the widget SYS tab to bypass strict curriculum rules (Somatic Gates) for unstructured practice.
- **Documentation Hygiene:** Merged redundant architecture files, updated the core `00_SYSTEM_ARCHITECTURE.md`, and formally documented the Somatic Gates in the pedagogy standard.

### Changed
- Refactored `App.jsx` to route UI logic through the new global `TroubadourWidget`.
- Updated all `fret-[X]-class-milestone` nodes to depend on `fret-[X]-guitar-milestone`.

## [v1.0.0-beta.2] - 2026-05-29

### Added
- **Maturation Map Route (`/guitar/map`):** Created the high-fidelity `MaturationMap` component visualizing the 12-fret Hero's Journey, organizing progress across three pillars (Song, Guitar, Workbook), and indicating the active fret with ambient micro-animations.
- **Decomposed TroubadourWidget:** Successfully began split of 1000+ line widget to improve maintainability:
  - Extracted `useMetronome.js` (93 LOC) Web Audio hook with tap tempo.
  - Extracted `troubadourPrompt.js` (120 LOC) to encapsulate the DAG-aware, military radio "Net Protocol" system prompt builder.
- **Curated VideoLibrary:** Expanded the 25% stub `VideoLibrary.jsx` into a high-fidelity 310-LOC component organizing Bertrand Laurence's archives by fret and phase (BE/DO/PLAY), featuring custom localized descriptions and localized placeholders.

### Changed
- **Pedagogical Alignment (Great Game Purge):**
  - Renamed competitive tracking field `pitchRoomHighScore` to `pitchRoomBestAccuracy` in the `tractionStore` state.
  - Removed former "Florins" economy from locales, deprecated DaaS SQLite functions in `useBackendBridge.js`, and purged it from Supabase's user profile migration logic.
  - Aligned all badge earning logic to refer to "strong proficiency" rather than "high scores".
- **CharacterSheet Consolidation:** Replaced the duplicate 133-LOC stub at `src/components/CharacterSheet.jsx` with a direct re-export of the robust 617-LOC `src/components/playbook/CharacterSheet.jsx`, unifying student state.
- **Wired Maturation Map Navigation:** Added the "View Map" quick action button in `GuitarWorkbench` to link directly to the new visual roadmap.

