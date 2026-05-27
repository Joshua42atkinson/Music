# VOIX VIVE — Architecture & Data Flow
> **Reference for all technical decisions, data wiring, and file structure.**
> Last Updated: 2026-05-25

---

## STATE ARCHITECTURE

Two layers of persistence, one context layer:

```
┌─────────────────────────────────────────────────────┐
│  ScaffoldingProvider (React Context)                │
│  Exposes: bardLevel, practiceMinutes, streak,       │
│           traction, fretsUnlocked, updateTraction   │
│  Source: tractionStore.js (reads from localStorage) │
└──────────────────┬──────────────────────────────────┘
                   │ reads/writes
       ┌───────────┴──────────────┐
       │                          │
┌──────▼──────────┐    ┌──────────▼──────────┐
│ tractionStore.js │    │  localDatabase.js    │
│ (localStorage)   │    │  (IndexedDB/Dexie)   │
│ Fast, sync       │    │  Durable, async      │
│ Lost on clear    │    │  Survives clear      │
└─────────────────┘    └─────────────────────┘
```

**Rule:** `tractionStore` is the live state. `localDatabase` is the backup. Write to both. Never read from IndexedDB for render-critical state — it's async and slow.

---

## THE THREE WIRES (implemented 2026-05-25)

### Wire 1 — Game → Traction
```
VertiscaleEngine.handleSessionComplete(scores, logs)
  → sessionLogger.logVertiscaleSession({ phase, patternId, rounds })
    → tractionStore.updateFretTraction(fretId, delta)
      → ScaffoldingProvider re-renders with new bardLevel
```
Files: `VertiscaleEngine.jsx` → `sessionLogger.js` → `tractionStore.js`

### Wire 2 — Student Name → Troubadour
```
ProfileModal.onCreate
  → db.studentProfile.put({ id: 1, name, createdAt })   [IndexedDB]
  → localStorage.setItem('active_student_profile', name) [sync]
  → AmbientPlayer.buildSystemPrompt() reads name
    → Troubadour addresses student personally
```
Files: `LandingScreen.jsx` → `localDatabase.js` → `AmbientPlayer.jsx`

### Wire 3 — Textbook → Game Unlock
```
SlideViewer.goTo(lastSlideIndex)
  → tractionStore.updateFretTraction(fretId, { yinCompleted: true })
    → ScaffoldingProvider.fretsUnlocked updates
      → VertiscaleEngine phase gate reads yinCompleted
```
Files: `SlideViewer.jsx` → `tractionStore.js` → `VertiscaleEngine.jsx`

---

## ROUTING TABLE

```
/                → LandingScreen      (Three Portals)
/song            → OrientationHub     (12-chapter selector → SlideViewer)
/guitar          → VertiscaleEngine   (Fret 9 game — direct mount)
/player          → MentorTools        (Practice tools shell)
/studio          → StudioPage         (Business/marketing page)
/playbook        → PlaybookShell      (Student identity — lazy loaded)
/privacy         → PrivacyPolicy
/terms           → TermsOfService
```

All routes wrapped in `ErrorBoundary`. Heavy routes are `React.lazy()` loaded.
`AmbientPlayer` renders globally (outside Routes) — always present.
`ScaffoldingProvider` wraps the entire app.

---

## TRACTION STATE SCHEMA

```js
// tractionStore.js — what a full traction object looks like
{
  bardLevel: 3,
  totalTraction: 1840,
  practiceMinutes: 142,
  streak: 4,               // days
  fretsUnlocked: [1, 2, 3, 9],
  frets: {
    1: {
      traction: 80,        // 0-100, drives Bard Level
      yinCompleted: true,  // reached last slide in SlideViewer
      yangCompleted: false, // completed game phase for this fret
      phase1Unlocked: true,
      phase2Unlocked: false,
      phase3Unlocked: false,
    },
    // ... frets 1-12
  }
}
```

---

## INDEXEDDB SCHEMA (localDatabase.js)

```
Table: settings          — id, key, value
Table: progress          — id, fretId, traction, timestamp
Table: messages          — id, role, content, timestamp
Table: outbox            — id, type, payload, synced
Table: vertiscaleSessions — id, phase, patternId, timestamp, successful
Table: songs             — id, title, content
Table: journal           — id, fretId, content, timestamp
Table: studentProfile    — id (always 1), name, createdAt
Table: questLog          — id, fretId, phase, completedAt
Table: aiNarration       — id, fretId, text, timestamp
```

---

## COMPONENT DEPENDENCY MAP

```
App.jsx
  ├── ScaffoldingProvider       [wraps everything]
  ├── AmbientPlayer             [global — top-left always]
  ├── LandingScreen
  │   ├── CoachingPortal
  │   ├── ProfileModal
  │   └── AdventurePlayer (lazy)
  ├── OrientationHub
  │   ├── NeckMenu
  │   └── SlideViewer
  │       ├── FretboardSheet
  │       └── PlingTrainer
  ├── VertiscaleEngine (lazy)
  │   ├── GameFretboard
  │   ├── OrbEngine
  │   ├── PitchGateUI
  │   ├── AdventurePlayer
  │   ├── NeckMenu
  │   ├── BiometricSanctum
  │   └── Glossary
  ├── MentorTools
  │   └── DigitalBinder
  │       ├── BreathingGate
  │       ├── PracticeTimer
  │       ├── PitchRoom
  │       ├── Metronome
  │       ├── IntervalVisualizer
  │       ├── FretboardExplorer
  │       ├── PlingTrainer
  │       ├── MicrotonalTracker
  │       ├── CoachingPortal
  │       ├── MultiKeyHub
  │       └── RhythmEngine
  └── PlaybookShell (lazy)
      ├── CharacterSheet
      ├── QuestLog
      └── JournalEntry
```

---

## LOCALIZATION SYSTEM

All user-facing text lives in `useLocale.js`. Never hardcode EN strings in components.

```js
const { t, locale } = useLocale();
// locale: 'en' | 'fr'
// t('key') returns current locale string
// For objects: localize(val) = val[locale] || val['en']
```

Toggle lives in `LandingScreen`. Persisted to `localStorage('voix_vive_locale')`.

---

## IP BOUNDARY ENFORCEMENT

**Automated check:** Before any commit, grep for forbidden terms:
```bash
grep -rn "Florin\|Four Channels\|Dojo\|Great Game\|Coal.*Steam\|Jean-Luc" src/
# Should return zero results
```

**Files with confirmed clean status (post 2026-05-25):**
- `VertiscaleEngine.jsx` — Florins, Jean-Luc, earnFlorins removed
- `playbookData.js` — Four Channels being replaced with Troubadour Types
- `Tavern3DVisualizer.jsx` — archived to `_archive/vr_future/`
- `HealthPulse.jsx` — archived to `_archive/removed_components/`

---

## BACKEND BRIDGE (DaaS — optional desktop feature)

`useBackendBridge.js` connects to an Axum server at `localhost:8080`.
This is the Joshua-built DaaS desktop companion app.
- Provides: SQLite logging, LM Studio switching, profile sync
- **Not required** for the web app to function
- Always fail gracefully when server is offline
- Never block the UI waiting for DaaS response

---

## MOONSHOTS (do not build until revenue gates are met)

| Feature | Gate | Notes |
|---|---|---|
| Android App / PWA | $2,500/mo | Tauri mobile build ready |
| AI Bertrand Coach (fine-tuned Gemma 4) | $2,500/mo | Training data in `/training/` |
| **VR Guitar Classroom** | **$5,000/mo** | **Bevy ECS + OpenXR + Tavern3D scenes** |
| Roblox Music World | $5,000/mo | Social learning |
