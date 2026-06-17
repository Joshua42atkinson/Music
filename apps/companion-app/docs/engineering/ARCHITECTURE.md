---
title: Application Architecture Map
status: active
tags: [architecture, technical, frontend]
date: 2026-06-14
---

# Voix Vive Companion App — Technical Architecture

This document is the source of truth for the codebase structure, state management, and deployment strategy of the Voix Vive React Application. 

## 1. Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with specific custom hex colors, avoid generic `bg-red-500` classes)
- **Routing:** `react-router-dom` v7
- **PWA:** `vite-plugin-pwa` (Service workers are critical for offline usage)
- **Database:** Local-first with Dexie (IndexedDB). Sovereign offline mode — no cloud DB.

## 2. Global State & Context Providers
The application state is deeply nested to provide global features without prop drilling. If you are adding a new route, it MUST reside within these providers in `App.jsx`.

**The Root Hierarchy (`App.jsx`):**
```jsx
<Router>
  <ErrorBoundary>
    <ScaffoldingProvider>      {/* Manages UI state, AI toggle, and global layouts */}
      <BevyIPCProvider>        {/* IPC layer for the VR Fretboard engine */}
        <AppContent>
          <TruebadourProvider> {/* The global AI state machine (LLM inference) */}
            <Routes> ... </Routes>
          </TruebadourProvider>
        </AppContent>
      </BevyIPCProvider>
    </ScaffoldingProvider>
  </ErrorBoundary>
</Router>
```

## 3. The Dual-Market Directory Structure
As of June 2026, the application utilizes a **Dual-Market Strategy**. The codebase is physically split to prevent the heavy pedagogy from confusing absolute beginners.

- **`src/features/audio-engine/`**: Core gameplay loops. Pitch detection (`PitchRoom.jsx`), the metronome, and fast audio feedback. 
- **`src/features/vr-fretboard/`**: The visual representation of the instrument.
- **`src/features/somatic-masterclass/`**: The heavy, philosophical "TrueFire" style tier. Contains the `TruebadourWidget.jsx`, `SomaticStudioPrompter.jsx`, and all journaling/pedagogy components.

> [!WARNING]
> **Phase 1 Routing Rule**: The components in `somatic-masterclass/` must NEVER be loaded on the default `/` or `/contemplative` routes. They must be strictly gated behind a dedicated `/masterclass` path so the beginner onboarding flow is not interrupted.

## 4. Data Persistence Strategy
The application is **Offline-First**. 
1. **Local Reads/Writes**: All immediate reads/writes must go through Dexie (IndexedDB). Do NOT make blocking network calls to save student progress.
2. **Sovereign Mode**: All data lives locally in IndexedDB and localStorage. No cloud sync — the app is fully offline-capable. (Supabase was removed 2026-06-15 per invasive audit M5.)

## 5. Web Audio API Constraints
- Pitch detection logic runs in the browser. 
- Audio contexts MUST be resumed via explicit user gesture (e.g., clicking a "Start Tuning" button) to comply with Chrome and Safari autoplay policies. Do not attempt to start audio contexts on component mount.
