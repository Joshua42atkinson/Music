# VOIX VIVE — UI PEARL Standards
> **The definitive alignment matrix for all primary user-facing pages.**
> Written for: Quality alignment and enforcing consistent pedagogical intent across the Academy platform.
> Last Updated: 2026-05-31

---

## What is this document?
This document defines the **PEARL** (Perspective, Engineering, Aesthetic, Research, Layout) matrix for every primary page/portal the student encounters. It acts as a rigid quality-control standard for future development, ensuring that new features do not clutter the UI, break the aesthetic, or violate the pedagogical intent of the masterclass.

---

### 1. The Home Portal (Landing)
**File**: `src/pages/StudioPage.jsx`
- **P — Perspective:** The gateway. Sets the premium tone of the masterclass and acts as the central dispatch to all other learning environments.
- **E — Engineering:** Renders the main entry hubs using `react-router-dom` navigation. Lightweight, no heavy data-fetching.
- **A — Aesthetic:** Clean, minimalist, premium. Deep gradients, extensive negative space, elegant typography. No distracting widgets.
- **R — Research:** Aligns with the *Bertrand Executive Brief* — establishing immediate professional credibility.
- **L — Layout:** Centralized card grid. The global `TroubadourWidget` is present but remains passive until invoked.
- **RULES**: Never add internal course content here. It is purely a routing shell.

---

### 2. The Orientation Hub
**File**: `src/pages/OrientationHub.jsx`
- **P — Perspective:** The narrative and philosophical primer. Where students learn *why* they are practicing, before they learn *how*.
- **E — Engineering:** Manages the 'Pedagogical Attunement' flow and visualizes the 'Whole Person' initiation framework.
- **A — Aesthetic:** Reflective, paced, text-focused. Uses the "Pedagogical Pill" at the top instead of a heavy navigation bar.
- **R — Research:** Driven by `09_FOUR_MODES_AND_APPRENTICESHIP.md` — introducing the four modes of the masterclass.
- **L — Layout:** Vertical scroll, text-heavy. All navigation is explicitly deferred to the `TroubadourWidget`.
- **RULES**: Maintain the screenless/centralized navigation aesthetic. No floating widgets other than the Troubadour.

---

### 3. The Guitar Workbench
**File**: `src/pages/GuitarWorkbench.jsx`
- **P — Perspective:** The somatic practice floor. This is where the actual mechanical guitar work happens.
- **E — Engineering:** Deeply integrated with `useScaffolding` and `tractionStore`. Manages real-time practice minutes, tracking, and fretboard visualization tools.
- **A — Aesthetic:** Tactical, high-contrast, focused. Dark mode specifically designed to be highly legible from 3-6 feet away while holding a guitar.
- **R — Research:** Dictated by the *Somatic Audio Engine* requirements. Visuals must never distract from the auditory feedback.
- **L — Layout:** Tool-centric. The Fretboard/Tool occupies the center screen. Extraneous quick-actions and navigation bars have been excised.
- **RULES**: Do not put non-practice related information here. The focus is 100% on the instrument.

---

### 4. The Player Portal
**File**: `src/components/PlayerPortal.jsx`
- **P — Perspective:** The mirror. A place for students to watch Bertrand's demonstrations and review their own video journals.
- **E — Engineering:** Handles video playback, blob URL management, and potentially external video streaming architecture.
- **A — Aesthetic:** Immersive "theater" mode. Minimal UI chrome. The content is the video.
- **R — Research:** Supports the *Resonant Mirror* concept — seeing oneself and the master clearly.
- **L — Layout:** Gallery grid of videos with a full-screen modal player. Simple profile tracking in the header.
- **RULES**: Video controls must be massive and accessible. No complex navigation inside the player modal.

---

### 5. Academy Learning Portal (LMS Dashboard)
**File**: `src/components/playbook/PlaybookShell.jsx`
- **P — Perspective:** The administrative and cognitive reflection space. Where the student manages their progression through the e-course.
- **E — Engineering:** Gated tab-navigation rendering `CharacterSheet` (Dashboard), `BEWorkbook` (Curriculum), and other LMS views. Reads from `ScaffoldingProvider` to lock/unlock modules.
- **A — Aesthetic:** Structured, data-rich, professional. Uses clear typography to present syllabus paths and tracking metrics.
- **R — Research:** Aligns with standard Learning Management Systems (LMS) required for B2B/Government educational contracts.
- **L — Layout:** Horizontal tab-bar controlling a central view-port.
- **RULES**: Maintain strict e-learning terminology (Modules, Curriculum, Dashboard). No gamified D&D/RPG language (e.g., Quests, Level-Ups) is permitted here.

---

### 6. The Troubadour Command Center
**File**: `src/components/TroubadourWidget.jsx`
- **P — Perspective:** The omnipresent guide and navigator. It serves as both the AI companion and the singular traffic controller for the entire app.
- **E — Engineering:** A fixed, floating widget that persists across routes. Manages AI chat streaming, the metronome/audio tracks, and all global App Navigation (Portal Tab).
- **A — Aesthetic:** Glassmorphic, compact, purple/amber accents. Designed to feel like a "smart companion" that sits quietly in the corner until needed.
- **R — Research:** Resolves the "UI Clutter" issue by centralizing all menus and "Quick Actions" into a single global state.
- **L — Layout:** Tabbed interior (AI, Music, Metro, Portal) wrapped in a collapsible floating pop-up.
- **RULES**: This is the *only* place global navigation should exist. Do not re-add top-bars or hamburger menus to individual pages.

---
