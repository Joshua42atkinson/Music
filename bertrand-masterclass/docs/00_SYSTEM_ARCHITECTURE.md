# VOIX VIVE ACADEMY — System Architecture

> **Last Updated:** 2026-05-29
> **Root Directory:** `/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/`
> **Status:** Beta Quality Assurance Phase

## 1. Technical Philosophy: Sovereign & Offline-First

Voix Vive is built on a "Sovereign Tech" philosophy. It rejects cloud lock-in and respects student privacy. The application is a React SPA (Single Page Application) that runs almost entirely offline. 

- **Progress is owned by the student**: Data is saved to the browser's IndexedDB and localStorage first. The `.voixvive` Memory Card export allows for 100% sovereign save states.
- **AI is sovereign**: The Troubadour AI runs against a local LM Studio instance (`localhost:1234`) or a local Trinity Server.
- **Cloud is a backup, not a master**: Supabase is used strictly for cross-device syncing and mentor video metadata, not as a hard dependency for the curriculum.

## 2. Tech Stack & Quality Assurance

- **Framework**: Vite + React 18 + React Router 7
- **Styling**: Vanilla CSS (`index.css` with CSS variables) + Tailwind CSS (specifically for CoachingPortal)
- **Animation**: Framer Motion (page transitions, swipe gestures)
- **Testing (Beta QA)**: Vitest + `@vitest/ui` with comprehensive coverage reporting (`npm run test:coverage`).
- **State Management**: `ScaffoldingProvider.jsx` (Global context) + `tractionStore.js` (localStorage) + `localDatabase.js` (Dexie/IndexedDB)
- **AI Integration**: `useLMStudio.js` (Streaming chat) + `useTroubadourAI.js` (Persona logic) + `TroubadourWidget.jsx` (Global Command Center)
- **Audio Processing**: HTML5 Web Audio API + `usePitchDetector.js` (for the PitchRoom and PLING! games)

## 3. Data Architecture: The Three Layers

Because of the offline-first mandate, state is managed across three distinct layers:

1. **Layer 1: LocalStorage (`tractionStore.js`)**
   - **Speed**: Instant (Synchronous).
   - **Purpose**: Holds the `active_student_profile`, current `bardLevel`, and fret-by-fret `traction` states (Yin, Yang, Be, Do, Play). The 144-node DAG uses this to determine if a node is unlocked via `isNodeUnlocked`.

2. **Layer 2: IndexedDB (`localDatabase.js`)**
   - **Speed**: Very fast (Asynchronous).
   - **Purpose**: Durable browser storage via Dexie. Used for larger data objects like student FHEAL Journal entries and `.voixvive` file imports/exports.

3. **Layer 3: Supabase (Cloud Sync)**
   - **Speed**: Network dependent.
   - **Purpose**: Cross-device hydration. When a student logs in, Supabase pushes the latest state down to IndexedDB and LocalStorage. Also used to store metadata for Video Submissions so Bertrand can view the queue in the Mentor Dashboard.

## 4. The Data Wires (How State Moves)

The application relies on three primary data flows ("wires") to connect the curriculum to the UI and the AI.

- **Wire 1: Action → Traction (The Game Loop)**
  - When a student completes a pedagogical phase in a tool (e.g., PitchRoom), it fires an event to the `ScaffoldingProvider`.
  - The provider updates the `tractionStore` (e.g., marking Fret 3 DO as complete).
  - This instantly unlocks the next phase in the 144-node DAG (tracked via `useDAGProgress.js`) and updates the overall `bardLevel`.

- **Wire 2: Identity → Troubadour (The AI Context)**
  - The global `TroubadourWidget.jsx` reads the student's active profile and curriculum position.
  - The `useTroubadourAI` hook injects this context into the system prompt.
  - Result: The local LLM knows the student's name, their current fret, and their learning style without making any cloud API calls.

- **Wire 3: Submission → Mentor Review**
  - PracticeRecorder saves a video blob to IndexedDB.
  - Metadata is synced to Supabase `submissions`.
  - Bertrand views it in MentorDashboard (reads cloud), processes the video locally, and writes feedback back to the cloud.

## 5. Curriculum Enforcement (Game vs. Sandbox)

The system supports two parallel progression modes managed by `tractionStore.js`:
- **Guided Path (Strict)**: The standard "Game" mode. The 144-node Directed Acyclic Graph (DAG) enforces linear progression based on pedagogical prerequisites. Students cannot jump to Fret 5 until Fret 4 is complete.
- **Sandbox Mode (No-Game)**: A toggle in the Troubadour Widget's "SYS" tab. This temporarily overrides the `isNodeUnlocked` function to return `true` for all 144 nodes, allowing intentional practice and uninhibited exploration without breaking the core save state.

## 6. Directory Structure Quick Reference

- `/src/pages` — Top-level routes (`LandingScreen`, `OrientationHub`, `StudioPage`, `MentorDashboard`).
- `/src/components` — Global UI and the 12 fret tools (`BreathingGate`, `PitchRoom`, `VertiscaleEngine`, etc.).
- `/src/components/playbook` — The student interface (`BEWorkbook`, `CharacterSheet`, `JournalEntry`).
- `/src/data/dag` — The curriculum database (`dagNodes.js`, `dagEdges.js`, `useDAGProgress.js`).
- `/src/hooks` — Reusable logic (`usePitchDetector`, `useTroubadourAI`).
- `/src/lib` — External service wrappers (`supabase.js`, `localDatabase.js`).
