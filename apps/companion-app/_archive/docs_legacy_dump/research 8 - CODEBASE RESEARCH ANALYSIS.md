# Voix Vive — Complete Codebase Research Analysis

**Date:** 2026-05-28
**Project:** /home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass
**Live URL:** voix-vive.com
**Methodology:** Direct source code examination — no assumptions, no documentation bias

---

## 1. EXECUTIVE SUMMARY

Voix Vive is a **React SPA** with a **dual curriculum system** that currently runs in tension:

| System | Status | Used By |
|--------|--------|---------|
| **Legacy 12-Fret** (chapterData.js, slideGenerator.js, toolsData.jsx) | ✅ **Live and wired** | OrientationHub, GuitarWorkbench, SlideViewer, QuestLog |
| **New DAG 144-Node** (dagNodes.js, dagEdges.js, useDAGProgress.js) | 🔴 **Built but NOT wired to UI** | Only ScaffoldingProvider reads it. No component renders it. |

The live site works through the legacy system. The 144-node DAG system is architecturally superior but invisible to students.

---

## 2. PROJECT ARCHITECTURE

```
bertrand-masterclass/
├── src/
│   ├── App.jsx                 # Root router — 13 routes defined
│   ├── main.jsx                # ReactDOM entry
│   ├── index.css               # Tailwind + custom dark theme
│   ├── audio/                  # Web Audio engine (metronome clicks, etc.)
│   ├── components/             # 42 UI components
│   ├── data/                   # Curriculum, stores, DAG
│   ├── game/                   # Vertiscale engine + Adventure
│   ├── hooks/                  # 7 custom React hooks
│   ├── lib/                    # External service integrations
│   ├── pages/                  # 7 top-level page components
│   ├── test/                   # Test utilities
│   └── utils/                  # Helper functions
├── public/assets/              # Static images, audio, slides
├── package.json               # React 18, Vite, Tailwind, Framer Motion, Dexie
└── index.html                 # Single HTML entry
```

**Build System:** Vite (not Create React App)
**Styling:** Tailwind CSS + inline styles (dual approach, inconsistent)
**State:** React Context (ScaffoldingProvider) + localStorage + IndexedDB
**Auth:** Supabase Auth (Google OAuth)
**Database:** Supabase PostgreSQL (cloud) + IndexedDB (local) + localStorage (fast)
**AI:** StepAudio R1.1 (localhost:9998) or LM Studio fallback (localhost:1234)
**Audio:** Web Audio API (custom engine in src/audio/)

---

## 3. ROUTING & NAVIGATION

### 3.1 Defined Routes (App.jsx)

| Route | Component | Lazy? | Status |
|-------|-----------|-------|--------|
| `/` | LandingScreen | No | ✅ Live |
| `/song` | OrientationHub | Yes | ✅ Live |
| `/guitar` | GuitarWorkbench | Yes | ✅ Live |
| `/player` | PlayerPortal | Yes | ✅ Live |
| `/playbook` | PlaybookShell | Yes | ✅ Live |
| `/studio` | StudioPage | Yes | ✅ Live (admin/coaching) |
| `/mentor` | MentorDashboard | Yes | ✅ Live |
| `/game` | VertiscaleEngine | Yes | ✅ Live |
| `/adventure` | AdventurePlayer | Yes | ✅ Live |
| `/monomyth` | ChromaticMonomyth | Yes | ✅ Live |
| `/summary` | CurriculumSummary | Yes | ✅ Live |
| `/ai-developer` | AIDeveloperChat | Yes | 🔴 Dev only |
| `/auth/callback` | AuthCallback | Yes | ✅ Live |

### 3.2 Navigation Flow

```
LandingScreen (4 portal cards)
    ├── /song → OrientationHub (NeckMenu → tap fret → SlideViewer)
    │   └── SlideViewer (swipe through slides per fret)
    ├── /guitar → GuitarWorkbench (tool picker modal)
    │   └── ToolModal (12 tools: BreathingGate, PracticeTimer, etc.)
    ├── /player → PlayerPortal (submissions, video library, timeline)
    │   └── PracticeRecorder, StructuredPracticeRecorder
    └── /playbook → PlaybookShell (4 tabs)
        ├── CharacterSheet (XP, stats, troubadour type)
        ├── QuestLog (12-fret timeline with progress)
        ├── SongwritingCompanion
        └── JournalFeed + VideoRecorder
```

**No route for:** DAGProgressBar, BEWorkbook (not wired to router)

---

## 4. STATE MANAGEMENT

### 4.1 Three-Tier Persistence Architecture

```
┌─────────────────────────────────────────────┐
│  TIER 1: localStorage (tractionStore.js)     │
│  Key: 'bard_traction'                        │
│  Speed: sync, instant                        │
│  Volatility: clears on browser data reset    │
├─────────────────────────────────────────────┤
│  TIER 2: IndexedDB (localDatabase.js/Dexie) │
│  Tables: settings, progress, messages,      │
│           outbox, vertiscaleSessions,         │
│           songs, journal, studentProfile,     │
│           questLog, aiNarration, recordings   │
│  Speed: async, ~50ms                         │
│  Volatility: survives browser clears         │
├─────────────────────────────────────────────┤
│  TIER 3: Supabase Cloud (PostgreSQL)        │
│  Tables: profiles, video_submissions          │
│  Speed: async, network dependent             │
│  Volatility: permanent (server-side)         │
└─────────────────────────────────────────────┘
```

### 4.2 ScaffoldingProvider.jsx — The Central Hub

**What it exposes to ALL components:**

| Property | Source | Live? |
|----------|--------|-------|
| `traction` | localStorage | ✅ |
| `updateTraction` | localStorage + IndexedDB + Supabase | ✅ |
| `bardLevel` | computed from totalTraction | ✅ |
| `practiceMinutes` | localStorage | ✅ |
| `streak` | localStorage | ✅ |
| `breathingSessions` | localStorage | ✅ |
| `scaffolding` | computed (scaffoldingLevel) | ✅ |
| `showNoteLabels` | settings | ✅ |
| `showFretNumbers` | settings | ✅ |
| `showMetronome` | settings | ✅ |
| `showCAGEDOverlay` | settings | ✅ |
| **DAG PROPERTIES:** | | |
| `currentNodeId` | traction.currentNodeId | 🟡 Exists but no component uses it for navigation |
| `currentNode` | dagNodes lookup | 🟡 Same |
| `currentFret` | currentNode.fret | 🟡 Same |
| `currentPhase` | getCurrentPhase() | 🟡 Same |
| `completedNodes` | traction.completedNodes | 🟡 Same |
| `nextRecommended` | getNextRecommendedNode() | 🟡 Same |
| `completePhase` | completeDAGPhase() | 🟡 Called by nothing in UI |
| `advanceNode` | completeNode() | 🟡 Called by nothing in UI |
| `navigateToNode` | setCurrentNode() | 🟡 Called by nothing in UI |

**Key Finding:** The DAG navigation helpers are defined but no component in the live UI calls them. The Playbook's QuestLog still uses the old `traction.frets` system.

### 4.3 tractionStore.js — The Data Shape

```javascript
DEFAULT_STATE = {
  bardLevel: 1,
  totalTraction: 0,
  practiceMinutes: 0,
  fretsUnlocked: [1,2,3,4,5,6,7,8,9,10,11,12],
  frets: {},                    // Per-fret state (legacy)
  breathingSessions: 0,
  lastPracticeDate: null,
  streak: 0,
  pitchRoomScore: 0,
  pitchRoomHighScore: 0,
  // DAG additions:
  currentNodeId: 'fret-1-class-be',
  completedNodes: [],           // Array of node IDs
  settings: { ... }
}

// Per-fret state shape:
getDefaultFretState(fretId) = {
  id: fretId,
  yinCompleted: false,          // Legacy
  yangCompleted: false,         // Legacy
  breathingGateCleared: false,
  traction: 0,                  // 0-100 (LEGACY PROGRESS METRIC)
  pitchAccuracy: 0,
  tensionScore: 100,
  attempts: 0,
  lastAccessed: null,
  meditationSeconds: 0,
  exercisesCompleted: [],
  // DAG additions:
  beCompleted: false,
  doCompleted: false,
  playCompleted: false,
  beAttempts: 0,
  doAttempts: 0,
  playAttempts: 0,
}
```

**Key Finding:** `traction` (0-100) is the legacy progress metric. The DAG's `beCompleted/doCompleted/playCompleted` exist but nothing writes to them except the utility functions. The QuestLog checks `traction >= 60` to determine if a fret is "completed."

---

## 5. THE CURRICULUM SYSTEMS (DUAL ARCHITECTURE)

### 5.1 Legacy System: chapterData.js + slideGenerator.js

**How it works:**
1. `chapterData.js` defines 12 frets with rich metadata:
   - Bilingual content (en/fr)
   - Yin/Yang philosophy sections
   - Hero's journey stage mapping
   - Western music theory
   - Pythagorean ratios
   - Meditation prompts
   - Exercise instructions
   - Slide image references

2. `slideGenerator.js` converts each chapter into an array of slide objects:
   ```
   { id, type, title, body, image, accent, fret }
   Types: title | yin-philosophy | yin-quote | yin-concept |
          yin-meditation | yang-instruction | yang-exercise |
          yang-fretboard | fret-end
   ```

3. `OrientationHub` renders `NeckMenu` → student taps fret → `SlideViewer` renders slides

4. Slide images are expected at `/assets/slides/ch{N}/{type}.png`

**Student path through legacy system:**
```
Landing → /song → NeckMenu → tap Fret 3 → SlideViewer
→ Swipe through ~8-12 slides → Read text, see images
→ "Done" when reaching last slide
→ Progress saved as `slidePosition` in localStorage
→ QuestLog shows fret as "completed" if traction >= 60
```

### 5.2 New System: dagNodes.js + dagEdges.js + useDAGProgress.js

**The DAG defines 144 nodes:**
- 12 frets × 3 pillars × 4 phases (BE, DO, PLAY, MILESTONE for class; similar for others)
- Fret 1: 11 nodes with complete metadata + troubadourPrompts
- Frets 2-12: metadata exists (interval, ratio, cents, Hz, emotion) but troubadourPrompts are being generated by Nemotron

**The DAG is NOT wired to the UI.** Key evidence:

1. **No route** in App.jsx for DAG views
2. **No import** of dagNodes in OrientationHub (uses chapterData.js)
3. **No import** of useDAGProgress in PlaybookShell (uses QUEST_DATA)
4. **QuestLog.jsx** uses `QUEST_DATA` from `playbookData.js`, not dagNodes
5. **GuitarWorkbench.jsx** uses `TOOLS_CATALOG` from `toolsData.jsx`, not dagNodes
6. **No component** calls `completePhase()` or `advanceNode()` from ScaffoldingProvider

**The DAG exists as code only. Students never see it.**

---

## 6. COMPONENT INVENTORY

### 6.1 Components Actually Rendered in Live Routes

| Component | Used By | Purpose | AI Required? |
|-----------|---------|---------|------------|
| LandingScreen | Route `/` | 4 portal cards + wordmark | No |
| OrientationHub | Route `/song` | NeckMenu + SlideViewer wrapper | No |
| NeckMenu | OrientationHub | 12-fret vertical scrollable neck | No |
| SlideViewer | OrientationHub | Swipeable slides per fret | No |
| GuitarWorkbench | Route `/guitar` | Tool launcher modal | No |
| ToolModal | GuitarWorkbench | Renders individual tools | No |
| BreathingGate | ToolModal (id=1) | Guided breathing animation | No |
| PracticeTimer | ToolModal (id=2) | Pomodoro timer | No |
| PitchRoom | ToolModal (id=3) | Pitch detection + ear training | No |
| IntervalVisualizer | ToolModal (id=5) | Visual interval explorer | No |
| FretboardExplorer | ToolModal (id=6,9) | Interactive fretboard | No |
| PlingTrainer | ToolModal (id=7) | Vocal-motor integration | No |
| MicrotonalTracker | ToolModal (id=8) | Cents deviation display | No |
| MultiKeyHub | ToolModal (id=11) | Multi-key scale viewer | No |
| RhythmEngine | ToolModal (id=12) | Backing track player | No |
| PlayerPortal | Route `/player` | Submissions + library + timeline | No |
| PracticeRecorder | PlayerPortal | Audio/video recorder | No |
| StructuredPracticeRecorder | PlayerPortal | Guided recording | No |
| PlaybookShell | Route `/playbook` | Tabbed shell (4 tabs) | No |
| CharacterSheet | PlaybookShell (tab 1) | XP, stats, troubadour type | No |
| QuestLog | PlaybookShell (tab 2) | 12-fret timeline | No |
| SongwritingCompanion | PlaybookShell (tab 3), OrientationHub | Lyrics + chords | No |
| JournalFeed | PlaybookShell (tab 4) | Reflection entries | No |
| VideoRecorder | PlaybookShell (tab 4) | Video journal | No |
| MentorDashboard | Route `/mentor` | Bertrand's student overview | No |
| VertiscaleEngine | Route `/game` | Flash/orb/journal game | No |
| AdventurePlayer | Route `/adventure` | Narrative adventure mode | No |
| ChromaticMonomyth | Route `/monomyth` | 12-fret chart visualization | No |
| AmbientPlayer | App.jsx (global) | Music player + AI chat + metronome | 🟡 Chat uses AI if connected |

### 6.2 Components Built But Not Wired

| Component | Status | Why Not Used |
|-----------|--------|-------------|
| DAGProgressBar | 🔴 Code only | Not imported in any route |
| BEWorkbook | 🔴 Code only | Not imported in any route |
| AIDeveloperChat | 🟡 Route exists but hidden | `/ai-developer` — dev tool |
| useDAGProgress | 🟡 Hook exists | No component uses it |

---

## 7. MECHANICAL MODE ASSESSMENT (No AI)

### 7.1 What Works Without Any AI Connection

| Feature | Works? | Notes |
|---------|--------|-------|
| Slide reading | ✅ | Text + images, swipe navigation |
| Neck navigation | ✅ | Tap fret → open slides |
| Breathing Gate | ✅ | Animated breathing guide |
| Practice Timer | ✅ | Pomodoro with start/stop |
| Pitch Room | ✅ | Pitch detection via Web Audio |
| Interval Visualizer | ✅ | Tap notes, see intervals |
| Fretboard Explorer | ✅ | Interactive fretboard |
| Metronome | ✅ | Web Audio scheduler, tap tempo |
| Video library | ✅ | Static list of Bertrand videos |
| Audio recorder | ✅ | MediaRecorder API |
| Practice recording | ✅ | Save to IndexedDB |
| Journal entries | ✅ | Text entries to IndexedDB |
| Quest progress | ✅ | Tracks `traction >= 60` |
| Character sheet | ✅ | XP, bard level, troubadour type |
| Game (Vertiscale) | ✅ | Flash + orb + journal phases |
| Adventure mode | ✅ | Narrative progression |
| Auth (Google) | ✅ | Supabase OAuth |
| Cloud sync | 🟡 | Supabase env vars needed |
| Music player | ✅ | Audio element with tracks |

### 7.2 What Requires AI (and its status)

| Feature | AI Required? | Connection Status |
|---------|-------------|-------------------|
| AI chat in AmbientPlayer | Yes | 🟡 `useLMStudio` connects to :9998 or :1234, but most students won't have this running |
| Voice mode (StepAudio) | Yes | 🔴 AudioStreamingService exists but not wired to a working endpoint |
| SongwritingCompanion AI | Yes | 🔴 Not connected |
| AI-generated prompts | Yes | 🔴 Nemotron generates dev content, not runtime |
| Adaptive pacing | Yes | 🔴 Not built |
| Socratic routing | Yes | 🔴 Not built |

### 7.3 Mechanical Mode Grade: B+

**Strengths:**
- All 12 tools are functional
- Progress tracking works (traction-based)
- Journal + recordings persist
- Mobile-responsive design
- Bilingual (en/fr)

**Weaknesses:**
- Slide content is static (no audio narration)
- No voice navigation
- Auto-complete doesn't exist (student must manually progress)
- No cross-pillar synergies
- No depth prompts
- QuestLog uses coarse `traction >= 60` metric, not granular BE/DO/PLAY

---

## 8. AI INTEGRATION STATUS

### 8.1 The AI Hook Chain

```
AmbientPlayer.jsx
    ├── useLMStudio.js          → connects to :9998 (StepAudio) or :1234 (LM Studio)
    │   └── chatCompletionStream() → fetch() to local AI
    ├── useBackendBridge.js     → :8080 (DaaS) or :9998 or :1234
    │   ├── askBertrand()        → tries LM Studio, falls back to DaaS
    │   └── checkLMStudio()      → health check on :9998 then :1234
    └── buildSystemPrompt()     → constructs DAG-aware prompt v4
        └── uses: currentNodeId, currentFret, currentPhase, FRET_METADATA
```

### 8.2 What Actually Happens When Student Types in Chat

```
1. Student types message in AmbientPlayer chat input
2. buildSystemPrompt() constructs prompt with DAG context
3. sendGuideMessage() calls chatCompletionStream(useLMStudio)
4. useLMStudio fetches POST http://localhost:9998/v1/chat/completions
5. IF StepAudio is running → gets AI response
6. IF StepAudio is NOT running → tries :1234 (LM Studio)
7. IF neither running → shows offline message:
   "I am currently running in offline preview mode. Start your local AI..."
```

**Reality:** 99% of students see the offline message because they don't have StepAudio R1.1 running locally.

### 8.3 Voice Mode (StepAudio 2.5)

```
toggleVoice() in AmbientPlayer.jsx
    ├── AudioStreamingService.connect(STEP_MIDDLEWARE_URL)
    │   └── ws://localhost:8081/ws/troubadour  ← NOT :9998
    └── Sets up callbacks:
        ├── onConnectionChange
        ├── onTextReceived
        ├── onAudioReceived
        ├── onParalinguistic  ← emotional detection
        └── onError
```

**Key Finding:** Voice mode connects to `:8081` (middleware), NOT `:9998` (StepAudio R1.1 directly). The middleware (`src/lib/audioStreamingService.js`) is supposed to handle:
- WebSocket to StepAudio
- Audio streaming
- STT/TTS
- Paralinguistics

**But:** There's no evidence the middleware is running or configured. The voice toggle exists in UI but likely fails for all students.

---

## 9. THE STUDENT JOURNEY (ACTUAL CODE PATH)

### 9.1 First-Time Student

```
1. Open voix-vive.com → LandingScreen
   ├── Sees 4 portals: Song, Guitar, Player, Playbook
   └── Wordmark + breathing animation

2. Clicks "The Song" → /song → OrientationHub
   ├── NeckMenu renders 12 frets vertically
   ├── Each fret shows: icon, title, subtitle, progress badge
   └── Progress = getChapterProgress(fretId, totalSlides)
       └── Based on slidePosition in localStorage (0 = not started)

3. Taps Fret 1 → setActiveFret(1) → SlideViewer
   ├── generateSlides(chapterData[0]) → array of slides
   ├── Swipe through slides
   └── Each slide: title, body text, optional image

4. "Completes" slides by reaching the end
   └── NO explicit "complete" button
   └── Progress saved as last slide index

5. Goes to /guitar → GuitarWorkbench
   ├── Shows "Suggested Practice" based on getPracticeContext()
   └── Can open any of 12 tools

6. Opens BreathingGate (ToolModal)
   └── Animated breathing circle for 60 seconds
   └── recordBreathingSession() → saves to tractionStore

7. Goes to /player → PlayerPortal
   ├── Can record practice video
   ├── Can browse Bertrand video library
   └── Can view timeline of activity

8. Goes to /playbook → PlaybookShell
   ├── CharacterSheet: XP bar, bard level, troubadour type
   ├── QuestLog: 12-fret timeline, locked/unlocked/completed
   ├── SongwritingCompanion: write lyrics
   └── Journal: write reflections

9. NO PATH through DAG system
   └── The 144 nodes are invisible
   └── BE/DO/PLAY phases are not presented as a checklist
   └── Student cannot see granular progress
```

### 9.2 Progress Tracking (What Actually Gets Saved)

```
localStorage['bard_traction'] = {
  frets: {
    1: { traction: 45, breathingGateCleared: true, beCompleted: false, ... },
    2: { traction: 20, ... },
    ...
  },
  completedNodes: [],         // Always empty — nothing writes here
  currentNodeId: 'fret-1-class-be',  // Never changes
  practiceMinutes: 125,
  streak: 3,
  ...
}
```

**Key Finding:** `completedNodes` stays empty because no UI calls `completeNode()` or `advanceNode()`. The DAG system is a ghost.

---

## 10. EXTERNAL DEPENDENCIES & SERVICE STATUS

### 10.1 Supabase

**Configured?** Conditionally.
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;      // needs env var
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;  // needs env var
```

**If env vars missing:** Runs in offline mode. All data stays local.
**If env vars present:** Cloud sync active. Google OAuth works.

**Tables used:**
- `profiles` — student identity
- `video_submissions` — async mentor review
- `auth.users` — Supabase Auth

**Status on live site:** Unknown — depends on build-time env vars.

### 10.2 Local AI (StepAudio / LM Studio)

**Connection:**
- Primary: `http://localhost:9998/v1` (StepAudio R1.1)
- Fallback: `http://localhost:1234/v1` (LM Studio / Nemotron)

**Student requirement:** Must have AI server running locally.
**Real-world status:** 0% of students have this configured.

### 10.3 Google Drive

**Used for:** Cross-device video submission storage.
**Integration:** `src/lib/driveService.js`
**Status:** Only works if student authenticates Google separately.

### 10.4 npm Dependencies (from package.json)

```
Production:
  react, react-dom, react-router-dom    — SPA framework
  framer-motion                        — animations
  lucide-react                         — icons
  tailwindcss                          — styling
  dexie                                — IndexedDB wrapper
  @supabase/supabase-js                — cloud database
  three, @react-three/fiber            — 3D (used in Vertiscale)
  tone                                 — Web Audio (used in some tools)
  
Dev:
  vite, @vitejs/plugin-react           — build
  eslint                               — linting
```

---

## 11. CRITICAL GAPS & ISSUES

### 11.1 The DAG is a Ghost System

**Severity: HIGH**

144 nodes are defined. Progress tracking exists. But:
- No route renders the DAG
- No component calls DAG navigation helpers
- `completedNodes` array stays empty forever
- Students see 12-fret progress, not 144-node progress

**Impact:** The entire architectural upgrade is invisible.

### 11.2 Dual Progress Metrics

**Severity: MEDIUM**

The system tracks progress TWO ways:
1. **Legacy:** `traction` (0-100 per fret) — used by QuestLog, CharacterSheet
2. **DAG:** `beCompleted/doCompleted/playCompleted` — exists but unused

These will diverge. A student could have `traction: 80` (legacy "complete") but `beCompleted: false` (DAG "incomplete").

### 11.3 No Explicit Lesson Completion

**Severity: MEDIUM**

Students swipe through slides but there's no "Mark Complete" button. Progress is inferred from:
- Slide position (last viewed slide index)
- Tool usage (breathing gate cleared, timer used)
- Traction accumulation (mysterious — what adds to traction?)

Students don't know when they've "finished" a fret.

### 11.4 AI Always Shows Offline

**Severity: MEDIUM**

The AI chat widget (AmbientPlayer) is visible to all students. But:
- No student has StepAudio running locally
- The offline message is confusing: "Start your local AI..."
- No fallback to cloud AI exists
- No clear indication that AI is a premium/desktop feature

### 11.5 Voice Mode Non-Functional

**Severity: LOW-MEDIUM**

The voice toggle exists but:
- Connects to `:8081` middleware (not configured)
- Even if middleware worked, needs StepAudio R1.1 on `:9998`
- No "voice not available" message — likely just fails silently

### 11.6 Mobile Experience Untested

**Severity: LOW**

The codebase has `safe-area-inset` CSS and responsive design, but:
- No evidence of mobile-specific testing
- Some tools (FretboardExplorer) may be hard to use on small screens
- Audio recorder needs permissions that may be denied on iOS Safari

---

## 12. WHAT'S ACTUALLY COMPLETE vs CODE-ONLY

### 12.1 Actually Complete (Live, Wired, Functional)

✅ 12-fret slide system (chapterData + slideGenerator + SlideViewer)
✅ 12 practice tools (GuitarWorkbench + ToolModal)
✅ 4-tab Playbook (CharacterSheet, QuestLog, Songwriting, Journal)
✅ Player Portal (recordings, video library, timeline)
✅ Auth (Google OAuth via Supabase)
✅ Progress persistence (3-tier: localStorage, IndexedDB, Supabase)
✅ Vertiscale game (flash/orb/journal phases)
✅ Adventure mode
✅ Mentor dashboard
✅ Metronome + music player (AmbientPlayer)
✅ Bilingual support (en/fr)
✅ Mobile responsive CSS

### 12.2 Built But Not Wired

🟡 DAG system (dagNodes.js, dagEdges.js, useDAGProgress.js, DAGProgressBar.jsx, BEWorkbook.jsx)
🟡 buildSystemPrompt() v4 (exists in AmbientPlayer, injects DAG context)
🟡 AI text chat (works IF local AI running, but no student has it)
🟡 AudioStreamingService (class exists, not connected to working endpoint)

### 12.3 Not Built

🔴 Audio narration for slides (TTS)
🔴 Voice navigation (speech commands)
🔴 Auto-mark-complete based on time threshold
🔴 Cross-pillar synergy system
🔴 Depth prompts per node
🔴 Lesson state machine (BE→DO→PLAY formal flow)
🔴 Tauri desktop app
🔴 Model download manager
🔴 Hardware detection
🔴 Adaptive pacing
🔴 Real Bertrand clip injection into AI responses

---

## 13. DATA FLOW ANALYSIS

### 13.1 Student Action → Data Flow

```
Student taps "Begin Session" in GuitarWorkbench
    ↓
ToolModal opens (e.g., BreathingGate)
    ↓
BreathingGate runs 60-second animation
    ↓
On complete: recordBreathingSession(state, fretId)
    ↓
updateFretTraction() → tractionStore.saveTraction()
    ↓
localStorage['bard_traction'] updated
    ↓
ScaffoldingProvider.updateTraction() also calls:
    ├── localDatabase.saveProgress() → IndexedDB
    └── (if logged in) saveTractionState() → Supabase
    ↓
CharacterSheet.jsx re-renders with new stats
    ↓
QuestLog.jsx shows updated progress
```

### 13.2 DAG Data Flow (Theoretical — Not Used)

```
Student clicks "Mark Complete" in BEWorkbook (NOT WIRED)
    ↓
completePhase(nodeId, 'be')
    ↓
ScaffoldingProvider.completePhase()
    ↓
tractionStore.completeDAGPhase()
    ↓
fretState.beCompleted = true
    ↓
localStorage + IndexedDB updated
    ↓
useDAGProgress.updatePhaseState()
    ↓
Check if all phases complete → auto-complete node
    ↓
getNewlyUnlockedNodes() → unlock next nodes
    ↓
DAGProgressBar would re-render
```

---

## 14. FILE SIZE & COMPLEXITY METRICS

| File | Lines | Purpose | Complexity |
|------|-------|---------|------------|
| chapterData.js | 972 | 12-fret curriculum data | Medium |
| timelessSongSlides.js | ~1,800 | Pre-built slide content | Low |
| slideGenerator.js | 355 | Converts chapters to slides | Medium |
| playbookData.js | ~800 | Character sheet definitions | Medium |
| tractionStore.js | 303 | Progress CRUD | Low |
| localDatabase.js | 167 | IndexedDB schema | Low |
| dagNodes.js | 284 | 144 nodes (11 complete, 133 metadata-only) | Medium |
| dagEdges.js | 163 | Graph traversal logic | Low |
| useDAGProgress.js | 201 | DAG progress hook | Low |
| ScaffoldingProvider.jsx | 263 | Global state provider | Medium |
| AmbientPlayer.jsx | 814 | Music + chat + metronome + voice | **HIGH** |
| GuitarWorkbench.jsx | 662 | Tool launcher + suggestions | Medium |
| PlayerPortal.jsx | 923 | Submissions + library + timeline | Medium |
| OrientationHub.jsx | 216 | Neck menu + SlideViewer wrapper | Low |
| VertiscaleEngine.jsx | 1,502 | Game state machine | **HIGH** |
| MentorDashboard.jsx | ~400 | Bertrand's overview | Medium |

---

## 15. RECOMMENDATIONS (Ranked by Impact/Effort)

### Immediate (This Week)

1. **Wire DAGProgressBar + BEWorkbook into PlaybookShell**
   - Add 5th tab: "Workbook"
   - Import BEWorkbook, render it
   - Effort: 1 hour
   - Impact: Students finally see the 144-node system

2. **Add "Mark Complete" buttons to SlideViewer**
   - After last slide, show: "Mark BE Complete" → calls completePhase()
   - Effort: 2 hours
   - Impact: DAG progress actually gets recorded

3. **Wire BE/DO/PLAY to legacy traction system**
   - When beCompleted/doCompleted/playCompleted all true → set traction = 60
   - Effort: 1 hour
   - Impact: DAG and legacy systems stay in sync

### Short-Term (Next 2 Weeks)

4. **Parse Nemotron output (Fret 2-9 done, 10-12 pending)**
   - Inject troubadourPrompts into dagNodes.js
   - Effort: 2 hours
   - Impact: All 144 nodes have complete metadata

5. **Add browser TTS audio narration to SlideViewer**
   - "Read aloud" button per slide
   - Effort: 3 hours
   - Impact: Hands-free mechanical mode

6. **Add Web Speech API for voice commands**
   - "Next", "Back", "Repeat"
   - Effort: 4 hours
   - Impact: Voice navigation without AI

### Medium-Term (Next Month)

7. **Test buildSystemPrompt() with StepAudio**
   - Verify DAG context injection works
   - Fix any issues
   - Effort: 1 day
   - Impact: AI text chat becomes functional for you/Joshua

8. **Add depth prompts per node**
   - Similar to Day Dream's depth_prompt
   - "Go Deeper" button on each slide
   - Effort: 2 days
   - Impact: Richer pedagogical experience

9. **Build Tauri scaffold**
   - cargo create-tauri-app
   - Move React app into shell
   - Effort: 3 days
   - Impact: Desktop app foundation

---

## 16. APPENDIX: KEY CODE SNIPPETS

### A. The Ghost DAG (Not Used)

```javascript
// ScaffoldingProvider.jsx:189-218
value = {
  // ... legacy props ...
  currentNodeId,      // Always 'fret-1-class-be' — never changes
  currentNode,        // Always the same node
  currentFret,        // Always 1
  currentPhase,       // Always 'be'
  completedNodes,     // Always [] — nothing writes here
  nextRecommended,    // Always 'fret-1-class-be'
  completePhase,      // Function exists, never called by UI
  advanceNode,        // Function exists, never called by UI
  navigateToNode,     // Function exists, never called by UI
}
```

### B. Legacy Progress (Actually Used)

```javascript
// QuestLog.jsx checks:
const tractionPct = fretTraction.traction || 0;
const isCompleted = tractionPct >= 60;

// CharacterSheet.jsx:
const completedFrets = Object.values(traction.frets || {})
  .filter(f => (f.traction || 0) >= 60).length;
```

### C. The Offline AI Message (What Students See)

```javascript
// useBackendBridge.js:206-212
if (!isDaaSConnected) {
  return {
    choices: [{
      message: {
        role: 'assistant',
        content: "I am currently running in offline preview mode. Start your local AI (StepAudio R1.1 on port 9998, or LM Studio on port 1234 for dev) or the Voix Vive DaaS Desktop App (port 8080) to connect to my local LLM for real-time Socratic guitar instruction."
      }
    }]
  };
}
```

---

**End of Research Analysis**
