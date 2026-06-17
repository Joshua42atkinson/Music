# Beta QA & Testing Program

This document outlines the Quality Assurance philosophy for the Voix Vive Academy as it enters the Beta phase. Our goal is to ensure platform stability, data integrity, and a flawless local-first "Sovereign" learning experience.

## Testing Philosophy

Voix Vive relies on a local-first offline architecture. Because we do not rely on a centralized cloud database to store student progress, the integrity of the data locally—and the robustness of the UI that interacts with it—is our primary focus.

### 1. The Data Layer (Vitest)
The pedagogical core of the platform is the 144-Node Directed Acyclic Graph (DAG) and the `tractionStore`.
- **DAG Integrity:** We run strict unit tests to ensure that no node is orphaned, that all prerequisites resolve logically, and that there are exactly 144 nodes (12 per fret).
- **Traction Sync:** We verify that the `tractionStore` accurately persists state to `localStorage` and `IndexedDB`.

### 2. The User Interface (React Testing Library)
Our UI must reflect the exact "Scaffolding Level" of the student.
- **Scaffolding Fading:** We test that visual aids (fret numbers, note names) correctly fade out as the student's mastery increases.
- **The Troubadour Widget:** The global command center must always render correctly, sync with the current active profile, and process the `.voixvive` memory card without error.

### 3. The Somatic / Manual Testing
Because this is a physical guitar learning platform built on Brandon Sanderson's "Hard Magic" principles, some things cannot be automated.
- **The Somatic Gate:** Every fret requires a physical test (e.g., holding a chord for 60 seconds without tension). Manual testing must verify that the UI doesn't allow a student to bypass this physical limitation.
- **Form Factor:** Testing on an actual mobile device with a guitar in lap is mandatory for evaluating the legibility of the "Play" phase.

## Running Tests

To run the full suite:
\`\`\`bash
npm run test
\`\`\`

To view coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

To open the Vitest UI dashboard:
\`\`\`bash
npm run test:ui
\`\`\`

All tests must pass before any new feature is merged into the `main` branch.
