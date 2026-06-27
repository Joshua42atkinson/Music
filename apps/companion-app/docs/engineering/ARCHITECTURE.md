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
The application is **Local-First with Opt-In Cloud Sync**. Verified against code 2026-06-25 (`src/lib/progressSyncEngine.ts`, `src/lib/firebase.js`, `src/hooks/useAuth.js`).
1. **Local Reads/Writes (always on)**: All immediate reads/writes go through Dexie (IndexedDB, `src/data/localDatabase.js`) plus a fast localStorage cache (`vvGet`/`vvSet`). IndexedDB is the authoritative layer; localStorage is the synchronous read cache. Do NOT make blocking network calls to save student progress.
2. **Sovereign Default**: With no login and no opt-in, ALL data stays on-device. The app is fully offline-capable in this mode.
3. **Optional Cloud Sync (Firebase)**: Cloud sync is **opt-in and gated twice** — it only runs when a user is logged in (`userId`) AND the `voixvive_cloud_sync` localStorage flag is `'true'` (toggled via `useAuth.toggleCloud()`, defaults off). When enabled, traction state is mirrored to **Firebase Firestore** at `users/{userId}` (`saveTractionState`/`getTractionState` in `src/lib/firebase.js`). Sync is async, non-blocking, best-effort.
4. **Auth**: Login is **Google OAuth** via `@react-oauth/google` (`src/hooks/useAuth.js`). There is no email/password backend.
5. **Supabase is removed**: `src/lib/supabase.js` is a null stub (all exports return `null`); `@supabase/supabase-js` is not a dependency (removed 2026-06-15 per invasive audit M5). NOTE: several components (`CommunityHub.jsx`, `HumanOctaveLibrary.jsx`, `PlayerPortal.jsx`, `JournalEntry.jsx`, `MentorshipBlog.jsx`, `useVoicePreferences.js`) still `import { supabase }` from the stub — those code paths are dormant (guarded by `if (supabase)` null checks) and represent dead-code debt, not active features.

## 5. Web Audio API Constraints
- Pitch detection logic runs in the browser. 
- Audio contexts MUST be resumed via explicit user gesture (e.g., clicking a "Start Tuning" button) to comply with Chrome and Safari autoplay policies. Do not attempt to start audio contexts on component mount.
