# VOIX VIVE — Master Context Document
> **Load this file first in every new AI session.**
> Last Updated: 2026-05-25 | Root: `/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/`

---

## WHO OWNS WHAT

| Person | Owns |
|---|---|
| **Bertrand Laurence** | The platform as a business. All revenue. All curriculum content. ©SHEARL, ©PLING!, ©FHEAL, Somatic Mystic philosophy, the 5 Pillars, Yin/Yang dual-coding, Vertiscale method. |
| **Joshua Atkinson** | The code, architecture, and engineering methodology (ADDIECRAPEYE, PEARL). The build is a gift. Joshua's IP never transfers unless explicitly agreed. |

**Do not mix in Joshua's other projects:**
- Trinity ID AI OS → `/home/joshua/Workflow/Desktop/` — sibling project, separate codebase
- The Great Game — Joshua's consciousness framework — language/concepts do NOT belong here
- Forbidden words: `Dojo`, `Forge`, `Coal/Steam`, `Four Channels`, `Committee`, `Player/Character split`, `leaderboards`, `score rings`, `AP points`, `Easy/Medium/Hard`

---

## THE PLATFORM IN ONE PARAGRAPH

Voix Vive ("The Living Voice") is a Slow Web guitar mentorship platform built for Bertrand Laurence. It rejects dopamine-driven e-learning. Students move through 12 chapters mapped to the chromatic scale, the Hero's Journey, and Bertrand's three proprietary protocols. The platform has three rooms: The Song (textbook), The Guitar (imagination game), The Player (practice tools). A medieval bard AI named Troubadour guides students without ever mentioning scores, speed, or comparisons.

---

## DEV ENVIRONMENT

```
Dev Server:   npm run dev → localhost:5173
Build:        npm run build → dist/
AI Server:    LM Studio → localhost:1234 (Qwen Coder 32B / Troubadour GGUF)
MCP Server:   cd mcp-server && ./start-mcp.sh → localhost:3001
DaaS Server:  Axum → localhost:8080 (desktop app, optional)
Git Remote:   https://github.com/joshua42atkinson/Music.git
Deployment:   Vercel → auto-deploy on push
```

---

## THE THREE PORTALS (do not rename, do not add a 4th)

Named after Boethius's three musics. Sacred structure.

| Portal | Route | Component | Purpose |
|---|---|---|---|
| 🎵 The Song | `/song` | `OrientationHub` → `SlideViewer` | 12-chapter Living Textbook (free) |
| 🎸 The Guitar | `/guitar` | `VertiscaleEngine` | Imagination game — the engine of mastery |
| 🧘 The Player | `/player` | `MentorTools` | Breathing, recording, reflection |

---

## THE 12-FRET MAP (sacred — governs all UI)

Every screen, tool, and game phase maps to one fret. If a feature doesn't map here, it doesn't belong yet.

| Fret | Tone | Chapter | Protocol | Component | Status |
|---|---|---|---|---|---|
| 1 | C | Root Note | ©SHEARL | `BreathingGate` | ✅ |
| 2 | C# | Time as a Friend | ©SHEARL | `PracticeTimer` | ✅ |
| 3 | D | The Ear Awakens | ©PLING! | `PitchRoom` | ✅ |
| 4 | D# | Committing to the Beat | ©SHEARL | `Metronome` | ✅ |
| 5 | E | The Map That Lies | ©SHEARL | `IntervalVisualizer` | ✅ |
| 6 | F | The Full Neck | ©SHEARL | `FretboardExplorer` | ✅ |
| 7 | F# | The Devil's Note | ©PLING! | `PlingTrainer` | ✅ |
| 8 | G | Precision as Gift | ©FHEAL | `MicrotonalTracker` | ✅ |
| 9 | G# | Force Threshold | ©SHEARL→©PLING!→©FHEAL | `VertiscaleEngine` ⭐ | ✅ |
| 10 | A | Being Seen | ©FHEAL | `CoachingPortal` | ✅ |
| 11 | A# | Fluency | ©FHEAL | `MultiKeyHub` | ✅ |
| 12 | B | Freedom | ©FHEAL | `RhythmEngine` | ✅ |

---

## TECH STACK

```
Framework:    Vite + React 18 + React Router 7
Styling:      Tailwind CSS 3 + vanilla CSS (~660 LOC, --bard-* CSS vars)
Animation:    Framer Motion (swipe, transitions)
Icons:        Lucide React
Fonts:        Cormorant Garamond, Inter, EB Garamond, JetBrains Mono
State:        localStorage (tractionStore.js) + IndexedDB (localDatabase.js via Dexie)
AI:           LM Studio streaming (useLMStudio.js) → Troubadour persona
Audio:        HTML5 Audio + MediaRecorder API + Web Audio (pitch detection)
Payments:     Stripe Payment Links (no backend required)
Localization: useLocale.js — 100+ bilingual keys (EN/FR)
Source:       ~23,900 LOC across 59 files
```

---

## DATA FLOW — THE THREE WIRES (implemented 2026-05-25)

```
Wire 1: Game → Traction
  VertiscaleEngine → sessionLogger.logVertiscaleSession() → tractionStore.updateFretTraction()
  Result: Bard Level and scaffolding advance from game play

Wire 2: Student Name → Troubadour
  ProfileModal.onCreate → IndexedDB studentProfile + localStorage 'active_student_profile'
  Troubadour reads name → addresses student personally

Wire 3: Textbook → Game Unlock
  SlideViewer (last slide) → tractionStore.updateFretTraction({ yinCompleted: true })
  Result: Completing a chapter marks yin flag, gates next phase
```

---

## TROUBADOUR AI — QUICK REFERENCE

- **Name:** Troubadour (never "Guide", "Assistant", "Bot")
- **Persona:** Medieval bard, calm, poetic, encouraging
- **Location:** `AmbientPlayer.jsx` — always top-left, always accessible
- **Backend:** LM Studio localhost:1234 | Fine-tune target: Gemma 4 2B (GGUF)
- **Hard Rules:** Max 3 sentences. Respond in student's language. Never mention scores/speed/difficulty. Never invent curriculum. Always close with breath, imagination, or next step.
- **Adapts to:** Four Troubadour Types (see `docs/03_TROUBADOUR.md`)
- **Full spec:** `docs/03_TROUBADOUR.md`

---

## FILE MAP — WHERE THINGS LIVE

```
src/
  App.jsx                    ← Router, global providers, lazy imports
  main.jsx                   ← React entry point
  index.css                  ← Global CSS, --bard-* variables

  pages/
    LandingScreen.jsx        ← The Trinity (three portals) + ProfileModal
    OrientationHub.jsx       ← Song portal shell → NeckMenu → SlideViewer
    StudioPage.jsx           ← Business landing, pricing, testimonials, SEO
    PrivacyPolicy.jsx        ← Legal
    TermsOfService.jsx       ← Legal

  components/                ← All 12-fret tools + global UI
    AmbientPlayer.jsx        ← Ambient music + Metronome + Troubadour chat [GLOBAL]
    ScaffoldingProvider.jsx  ← Global traction context (bardLevel, streak, etc.)
    NeckMenu.jsx             ← Guitar neck navigation UI [GLOBAL]
    SlideViewer.jsx          ← Swipeable chapter reader [GLOBAL]
    DigitalBinder.jsx        ← Tool launcher for each fret [GLOBAL]
    BreathingGate.jsx        ← Fret 1
    PracticeTimer.jsx        ← Fret 2
    PitchRoom.jsx            ← Fret 3
    Metronome.jsx            ← Fret 4
    IntervalVisualizer.jsx   ← Fret 5
    FretboardExplorer.jsx    ← Fret 6
    PlingTrainer.jsx         ← Fret 7
    MicrotonalTracker.jsx    ← Fret 8
    (VertiscaleEngine = game)← Fret 9
    CoachingPortal.jsx       ← Fret 10
    MultiKeyHub.jsx          ← Fret 11
    RhythmEngine.jsx         ← Fret 12
    MentorDashboard.jsx      ← Bertrand's teacher view (admin)
    PracticeRecorder.jsx     ← Video/audio submission tool
    WelcomeOnboarding.jsx    ← First-visit flow
    ProfileModal.jsx         ← Student name/style/PIN creation
    FretboardSheet.jsx       ← Overlay fretboard reference
    PlingTrainer.jsx         ← Sing-before-play trainer
    BiometricSanctum.jsx     ← HRV / breath state input
    AIDeveloperChat.jsx      ← Dev tool (not student-facing)
    LMStudioStatus.jsx       ← Dev tool
    LMStudioSubAgent.jsx     ← Dev tool
    SongwritingCompanion.jsx ← Creative writing tool
    Tavern3DVisualizer ──────── ARCHIVED → _archive/vr_future/ (future Android XR)

    playbook/
      PlaybookShell.jsx      ← Route /playbook shell
      CharacterSheet.jsx     ← Student identity (Four Troubadour Types)
      QuestLog.jsx           ← Fret completion tracker
      JournalEntry.jsx       ← FHEAL reflection journal

  game/
    VertiscaleEngine.jsx     ← Fret 9 — full game state machine (1,493 LOC)
    GameFretboard.jsx        ← Phase 1 tap UI
    OrbEngine.jsx            ← Phase 2 audiation orbs
    PitchGateUI.jsx          ← Mic input gate
    AdventurePlayer.jsx      ← Narrative adventure mode
    scoreCalculator.js       ← Phase scoring (pure functions)
    sessionLogger.js         ← Session → tractionStore pipeline
    narrativeEngine.js       ← Adventure narrative data

  hooks/
    useLocale.js             ← 100+ bilingual EN/FR keys
    useLMStudio.js           ← LM Studio streaming chat
    useBackendBridge.js      ← DaaS Axum desktop sync
    useFlashTimer.js         ← Phase 1 flash timing
    usePitchDetector.js      ← Web Audio pitch detection
    useWebLLM.js             ← Browser-local LLM fallback

  data/
    chapterData.js           ← 12 chapters — titles, tones, monomyth stages
    slideGenerator.js        ← Generates slides from chapter data
    tractionStore.js         ← localStorage traction state + Bard Level
    localDatabase.js         ← IndexedDB via Dexie — offline-first
    vertiscalePatterns.js    ← Scale patterns for the game
    playbookData.js          ← Bard titles, Four Troubadour Types, stats
    pricingData.js           ← Stripe links, pricing tiers
    testimonialData.js       ← Student testimonials
    timelessSongSlides.js    ← Bonus song curriculum content
    harmonicData.js          ← Harmonic reference data
    toolsData.jsx            ← Tool catalog for DigitalBinder
    adventures/troubadour.js ← Narrative adventure scenes

docs/                        ← Living documentation (this folder)
  00_MASTER.md               ← THIS FILE — start every session here
  01_PEDAGOGY.md             ← Bertrand's IP, protocols, 12-fret
  02_ARCHITECTURE.md         ← Tech, data flow, wires, decisions
  03_TROUBADOUR.md           ← AI persona, prompt rules, fine-tuning
  04_ROADMAP.md              ← Phases, auth plan, revenue gates
  05_PEARL_STANDARD.md       ← Code header spec for all source files

_archive/                    ← Dated archive, never delete
  2026-05-25_docs/           ← All docs before clean-slate restructure
  vr_future/                 ← Tavern3DVisualizer (Android XR moonshot)
  removed_components/        ← HealthPulse (removed from routing)
```

---

## BEFORE TOUCHING ANY CODE — CHECKLIST

1. Read `docs/01_PEDAGOGY.md` if touching curriculum or protocol language
2. Read `docs/02_ARCHITECTURE.md` if touching data flow, routing, or state
3. Read `docs/03_TROUBADOUR.md` if touching Troubadour AI or system prompt
4. Check the 12-fret map — does the change map to a fret? If not, why?
5. Check IP boundary — does it use any forbidden words or Great Game concepts?
6. Run `npm run build` — build must pass clean before committing
