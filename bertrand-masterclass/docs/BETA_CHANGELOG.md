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
