# VOIX VIVE — Architecture & Data Flow
> **Reference for all technical decisions, data wiring, and file structure.**
> Last Updated: 2026-05-28
>
> **This document is the source of truth. If code contradicts this doc, the doc is right.**

---

## COMPUTE DAG — Student, Cloud, Local

This platform uses a **Directed Acyclic Graph** (DAG) for compute: data flows one direction, no cycles, each node owns its layer.

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│   STUDENT HARDWARE   │      │    CLOUD (Free)      │      │   LOCAL (Bertrand)   │
│    (Browser PWA)     │◄────►│    Supabase/Vercel   │◄────►│   Desktop DaaS      │
│                      │      │                      │      │   (LM Studio + API)   │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
         │                              │                              │
    ┌────▼────┐                    ┌────▼────┐                    ┌────▼────┐
    │  SOURCE │                    │  TRUTH  │                    │  BRAIN  │
    │  (User) │                    │ (Sync)  │                    │  (AI)   │
    └─────────┘                    └─────────┘                    └─────────┘
```

### Student (Browser) — Skin & Nerves
- **UI rendering**: React + Vite (instant)
- **Audio synthesis**: Web Audio API (<10ms latency)
- **Mic input / pitch detection**: AudioWorklet (privacy + speed)
- **Metronome**: AudioContext (no network jitter)
- **Fretboard touch**: Canvas/CSS (<16fps)
- **Offline cache**: IndexedDB/Dexie
- **Compute budget**: ~200MB RAM, 1 CPU core

### Cloud (Supabase Free Tier) — Spine
- **User identity**: Google OAuth → `auth.users`
- **Progress persistence**: `profiles` + `traction` tables
- **Journal sync**: `journal_entries` (write phone, read tablet)
- **Submission queue**: `submissions` (metadata only, not video blobs)
- **Free limits**: 500MB DB, 2GB bandwidth, 50K MAU, 1GB storage
- **Cost**: $0

### Local (Bertrand's Desktop) — Brain
- **LM Studio**: LLM inference at `localhost:1234`
- **Video review storage**: 500GB+ local disk
- **FFmpeg**: CPU-heavy processing
- **Mentor dashboard**: See all students
- **Reachability**: Cloudflare Tunnel (free) or Tailscale
- **Cost**: $0 (uses existing hardware)

---

## THE THREE WIRES (implemented 2026-05-27)

### Wire 1 — Game → Traction → Cloud
```
VertiscaleEngine.handleSessionComplete(scores, logs)
  → sessionLogger.logVertiscaleSession({ phase, patternId, rounds })
    → tractionStore.updateFretTraction(fretId, delta)           [local]
    → supabase.from('vertiscale_sessions').insert(...)         [cloud]
      → ScaffoldingProvider re-renders with new bardLevel
```
Files: `VertiscaleEngine.jsx` → `sessionLogger.js` → `tractionStore.js` + Supabase

### Wire 2 — Troubadour AI → Student
```
Student types in Troubadour widget
  → POST http://localhost:1234/v1/chat/completions (LM Studio)
    → Response streamed back to widget
      → Browser TTS reads aloud (optional)
        → Student hears AI voice
```
Files: `AmbientPlayer.jsx` → `useLMStudio.js` → LM Studio → `SpeechSynthesis`

### Wire 3 — Submission → Mentor Review
```
PracticeRecorder.save(blob)
  → db.recordings.add({ metadata })      [IndexedDB local]
  → supabase.from('submissions').insert({ meta })  [cloud]
    → Bertrand sees in MentorDashboard (reads cloud)
      → Bertrand reviews video (local DaaS)
        → Feedback written to cloud
          → Student sees "Reviewed" status
```
Files: `PracticeRecorder.jsx` → `localDatabase.js` + Supabase → `MentorDashboard.jsx`

---

## ROUTING TABLE (Current — 2026-05-27)

```
/                → LandingScreen      (Three Portals + Playbook)
/song            → OrientationHub     (12-chapter selector → SlideViewer)
/guitar          → GuitarWorkbench    (12 tools hub — NOT Vertiscale anymore)
/game            → VertiscaleEngine   (Fret 9 game — now standalone route)
/adventure       → AdventurePlayer    (Troubadour CYOA — now standalone route)
/player          → PlayerPortal     (Submissions + video library + pricing)
/playbook        → PlaybookShell    (Character, Quests, Songbook, Journal)
/studio          → StudioPage         (Pricing, mentorship, gift certs)
/summary         → CurriculumSummary  (12-fret progress overview)
/ai-developer    → AIDeveloperChat    (Internal dev tool)
/privacy         → PrivacyPolicy
/terms           → TermsOfService
```

All routes wrapped in `ErrorBoundary`. Heavy routes are `React.lazy()` loaded.
`AmbientPlayer` (renamed **Troubadour**) renders globally — always present.
`ScaffoldingProvider` wraps the entire app.

---

## COMPONENT DEPENDENCY MAP (Current — 2026-05-27)

```
App.jsx
  ├── ScaffoldingProvider       [wraps everything]
  ├── Troubadour (AmbientPlayer)  [global — bottom-right floating widget]
  │   ├── Music player
  │   ├── Metronome
  │   └── AI Chat (useTroubadourAI)
  │       ├── Remote vLLM (GMKtek)
  │       ├── Local LM Studio (fallback)
  │       └── Offline (static cues)
  ├── BetaGate                     [PIN-protected AI beta access]
  ├── LandingScreen
  │   ├── CoachingPortal (modal)
  │   └── ProfileModal (modal)
  ├── OrientationHub (lazy)
  │   ├── NeckMenu
  │   └── SlideViewer
  │       └── Glossary
  ├── GuitarWorkbench (lazy)      [THE 12-TOOL HUB]
  │   ├── BreathingGate (modal)
  │   ├── PracticeTimer (modal)
  │   ├── PitchRoom (modal)
  │   ├── Metronome (modal)
  │   ├── IntervalVisualizer (modal)
  │   ├── FretboardExplorer (modal)
  │   ├── PlingTrainer (modal)
  │   ├── MicrotonalTracker (modal)
  │   ├── AsyncAssessor (modal)
  │   ├── MultiKeyHub (modal)
  │   └── RhythmEngine (modal)
  ├── VertiscaleEngine (lazy)    [/game — standalone]
  │   ├── GameFretboard
  │   ├── OrbEngine
  │   ├── PitchGateUI
  │   ├── BiometricSanctum
  │   └── Glossary
  ├── AdventurePlayer (lazy)       [/adventure — standalone]
  ├── PlayerPortal (lazy)          [submissions + library + pricing]
  │   ├── PracticeRecorder (modal)
  │   ├── TroubadourLoom           [identity + myelination map + mentor]
  │   │   ├── CapstoneCard         [certification tiers + audition]
  │   │   └── MentorCard           [$5 / $45 / $100 interactions]
  │   └── ServiceCard (new)
  ├── PlaybookShell (lazy)
  │   ├── BEWorkbook               [DAG node cards + PracticeJournal]
  │   │   ├── PracticeJournal      [20-min daily session generator]
  │   │   └── DAGProgressBar       [fret-level progress]
  │   ├── CharacterSheet
  │   ├── QuestLog
  │   ├── Songbook
  │   └── JournalEntry
  ├── StudioPage (lazy)
  ├── CurriculumSummary (lazy)
  └── AIDeveloperChat (lazy)
```

---

## TRACTION STATE SCHEMA

```js
// tractionStore.js — what a full traction object looks like
{
  bardLevel: 3,
  totalTraction: 1840,
  practiceMinutes: 142,
  streak: 4,               // days
  completedNodes: ['fret-1-class-be', 'fret-1-class-do'],
  frets: {
    1: {
      traction: 80,        // 0-100, drives Bard Level
      beCompleted: true,
      doCompleted: true,
      playCompleted: false,
      beMastery: 2,        // 0-3
      doMastery: 1,
      playMastery: 0,
      beResonance: true,   // achieved through repetition + depth
      doResonance: false,
      playResonance: false,
      beAttempts: 2,
      doAttempts: 1,
      playAttempts: 0,
      depthExplored: true, // viewed all slides/depth content
      lastAccessed: '2026-05-28T14:30:00Z',
    },
    // ... frets 1-12
  },
  studentProfile: {
    troubadourType: 'storyteller', // storyteller | craftsman | ear | seeker
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
Table: recordings        — id, exerciseName, timestamp, duration, blobUrl, reviewed, feedback
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

**Files with confirmed clean status (post 2026-05-27):**
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

## NAVIGATION STANDARD

Every page (except LandingScreen) must have:
1. **Back button** — `navigate(-1)` or semantic back (e.g., `/playbook` from Songbook)
2. **Voix Vive wordmark** — `navigate('/')`, links to LandingScreen
3. Consistent styling: JetBrains Mono uppercase, `#c9a96e` color

**Implemented:**
- `PrivacyPolicy.jsx` — back button ✓
- `TermsOfService.jsx` — back button ✓
- `PlayerPortal.jsx` — wordmark home button ✓
- `StudioPage.jsx` — back + wordmark buttons ✓ (added 2026-05-27)

**Pending:**
- `GuitarWorkbench.jsx` — needs standardized nav bar
- `OrientationHub.jsx` — needs standardized nav bar
- `PlaybookShell.jsx` — needs standardized nav bar
- `VertiscaleEngine.jsx` — needs standardized nav bar

---

## PLAYER PORTAL VISION — "Digital Mirror Playground"

The Player Portal is not a dashboard. It is a **mirror**.

### Current State
- Video submissions to Bertrand
- Submission library with review status
- Pricing cards (StudioPage overlap — to be removed)
- Timeline of submissions + journal entries

### Future State (post-persistence)
- **Video journaling** — low-def self-recording for posture, timing, expression
- **Body posture analysis** — reinforcement learning for ergonomic guitar position
- **Metronome video** — visual beat reference overlaid on student video
- **Background music** — ambient tracks from Troubadour for practice sessions
- **AI integration** — Troubadour can pull Song pages into chat, set ambient music, control workbook tools via voice
- **Reflection prompts** — after every practice session, AI asks: "What did you notice about your breath?"

### DAG Flow
```
[Practice Session] → [Record Video] → [Self-Review] → [AI Analysis] → [Journal Prompt] → [Next Session]
```

No gamification. No scores. Just presence, reflection, and gentle guidance.

---

## MOONSHOTS (do not build until revenue gates are met)

| Feature | Gate | Notes |
|---|---|---|
| Android App / PWA | $2,500/mo | Tauri mobile build ready |
| AI Bertrand Coach (fine-tuned Gemma 4) | $2,500/mo | Training data in `/training/` |
| **VR Guitar Classroom** | **$5,000/mo** | **Bevy ECS + OpenXR + Tavern3D scenes** |
| Roblox Music World | $5,000/mo | Social learning |
| CAGED TCG Shop | Post-launch | Trading card game for music learning |
