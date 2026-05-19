# 🎸 VOIX VIVE — Master Context & Business Platform

> **Purpose:** Load this file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-19 (Session 9 — PEARL Framework + CRAP Visual Audit + Token Standardization)  
> **Project Root:** `/home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5173  
> **Git Remote:** https://github.com/joshua42atkinson/Music.git  
> **Deployment:** Vercel → `bertrand-masterclass/dist` (auto-deployed on push)

---

## 1. CAST OF CHARACTERS

### The Developer — Joshua Atkinson
- Systems Architect, Full-Stack Engineer (Rust/Bevy/WASM/Android/React)
- Purdue University MS LDT Candidate (EDCI 57300 Practicum, Dr. Jennifer Richardson)
- Creator of the *Trinity ID AI OS* and the *ADDIECRAPEYE* design framework
- Author of *"The Great Game: A Player's Handbook to Consciousness"* (personal IP — see §4)
- Portfolio: LDTAtkinson.com
- Hardware: Desktop (AMD Strix Halo / 128GB RAM); currently on laptop
- **Capabilities:** Can build anything in 2 months — VR/AR, Bevy ECS, Android, full-stack web

### The Client/SME — Bertrand Laurence
- Master guitarist & vocalist (Berklee College of Music, MassArt, Mirage Mime Theatre)
- Creator of the Somatic Mystic philosophy
- Proprietary protocols: ©SHEARL, ©PLING!, ©FHEAL
- **Location:** Houlton, Maine (relocated from Cambridge/Boston area)
- **Family:** Has family in France he hasn't visited in years — **revenue generation is critical**
- YouTube: @BertrandLaurenceMusic
- Studio: https://bertrandguitarstudio.duetpartner.com/
- Thumbtack: Top Pro award, multiple years
- Passim School of Music: Group class instructor (Guit&Vocal, Fingerstyle)
- **Thursday call scheduled** — Bertrand reviews the build

---

## 2. BUSINESS STRATEGY

### Revenue Model
```
The 12-chapter Living Textbook is 100% FREE.
It is the culture-building marketing funnel that creates long-term students.

Revenue comes from:
  1. Live coaching (Zoom/in-studio)
  2. Async video feedback
  3. Community membership (Inner Circle)
  4. Group workshops
  5. Gift certificates
  6. Tips / support

FUTURE PREMIUM PRODUCT:
  VR/AI Masterclass — Android app + VR mode
  - Fine-tuned Gemma 4 model as "AI Bertrand"
  - Bevy ECS architecture for immersive VR guitar classroom
  - THIS is the paid Masterclass, not the free textbook
```

### Pricing (from Thumbtack/Duet Partner)
```
Private Lesson (Zoom):     $60/hr ($45 trial, $55 bulk, $50 10-pack)
Guitar & Voice (©PLING!):  $60/hr ($55 bulk)
Async Video Review:         $35/review ($30 5-pack, $25 10-pack)
Inner Circle Membership:    $25/mo or $199/yr
Group Workshop:             $35/person ($30 series)
Gift Certificate:           $60-$275
```

### Payment Acceptance
Stripe (cards, Apple Pay, Google Pay), Venmo, PayPal, Zelle, Cash App, Ko-fi, Wire/IBAN (for French/European students)

> **ACTION REQUIRED:** Bertrand must create a Stripe account and generate Payment Link URLs. We paste them into `pricingData.js`.

---

## 3. VOIX VIVE — CORE PHILOSOPHY

### What is Voix Vive?
Voix Vive ("The Living Voice") is an advanced, highly esoteric guitar mentorship platform designed by Bertrand Laurence. It rejects the modern paradigm of fast, gamified, dopamine-driven e-learning. Instead, it operates on the philosophy of the **"Slow Web"** — forcing students into a contemplative, deliberate, and somatically aware state of learning.

It is conceptualized as a **"Bard's Grimoire"** — a living textbook and peer-to-peer mentorship hub where the student learns that *they* are an instrument playing an instrument.

### Visual Identity: "The Unbound Grimoire"
The aesthetic of Voix Vive is unapologetically esoteric, diverse, and imaginative. It avoids sterile stock photography.

**The Prompt Matrix:** When generating AI art for the curriculum, use an "Unbound" conceptual strategy:
- Lean heavily into surreal, metaphorical imagery (Alchemists forging notes, monks meditating on giant floating guitar picks, starry skies viewed through guitar soundholes)
- **Vibe:** "High-quality, imaginative, and esoteric pedagogical illustration. Deeply atmospheric and metaphorical. A mix of surrealism and grounded reality."
- **Constraint:** Do not restrict to "analog photography" — the 112-slide curriculum must remain visually stimulating and diverse.

---

## 4. BERTRAND'S PEDAGOGY (SME-OWNED CONTENT)

### The Core Axiom
> *"You are an instrument playing an instrument. If I am playing the guitar, who is playing me?"*

### Yin & Yang Dual-Coding
- **Yin (Invisible):** Theory, ear training, meditation, emotional storytelling
- **Yang (Visible):** Fretboard organization, muscle memory, technique, exercises

### The 5 Pillars
I. Music Theory (Grammar) | II. Ear Training | III. Technique (Kinesthesis) | IV. Creativity | V. Performing

### Three Protocols
- **©SHEARL** — See / Hear / Feel → bridges theory to technique
- **©PLING!** — Sing & Play → hardwires vocal cords to motor cortex
- **©FHEAL** — Hear / Feel → obey creative impulse without Left-Brain interference

### Key Teaching Concepts
- Practice TOO SLOW (myelination), Kinesthetic Sleep, The Practice Nook
- Binder Control, CAGED System, Vertiscales, Notes → Chords → Songs
- "Applied theory" over traditional music theory
- Body-centered: relaxation, effortlessness, flowing ergonomics
- Student-choice: "Choose any songs and styles of their liking"

---

## 5. IP BOUNDARY: THE GREAT GAME vs THE MASTERCLASS

**BERTRAND'S** (use freely): 5 Pillars, SHEARL/PLING!/FHEAL, Yin/Yang, kinesthesis, fascia, CAGED, Vertiscales, breath-work, body scan, Hero's Journey × Chromatic Scale

**JOSHUA'S GREAT GAME** (do NOT import without discussion): Four Channels/Committee, Player/Persona/Architect, Physics of Being, Virtue Topology, N=1 Experiment, Coal/Steam/Traction model

**BORDERLINE** (confirmed titles): "Voix Vive" title, "Bard Level" terminology, Monomyth stage names

---

## 6. TECH STACK

```
Framework:    Vite + React 18 + React Router 7
Styling:      Tailwind CSS 3 + vanilla CSS (~660 LOC with --bard-* aliases)
Animation:    Framer Motion (swipe gestures, transitions)
Icons:        Lucide React
Audio:        HTML5 Audio (Bertrand's "Houlton Skies" as primary ambient track)
State:        localStorage via tractionStore.js + ScaffoldingProvider context
Fonts:        Cormorant Garamond, Inter, EB Garamond, JetBrains Mono
Payments:     Stripe Payment Links (no backend required) + Venmo QR
DB (Local):   Dexie.js / IndexedDB (offline progress + submission outbox)
Media:        MediaRecorder API (practice video/audio capture)
SEO:          JSON-LD LocalBusiness, Open Graph, Twitter Cards
Source Code:  ~616 KB across 16 source files + 7 data files
```

---

## 7. FILE MAP

```
voix-vive/
├── vercel.json             — Deployment config (buildCommand → bertrand-masterclass/)
├── _archive/               — Legacy files (NOT in git)
│
└── bertrand-masterclass/   — ★ THE APP (all active dev happens here)
    ├── CONTEXT.md          — THIS FILE (master project context)
    ├── ROADMAP.md          — Development roadmap with phases and timeline
    ├── Gamifying Guitar Learning with Open Source.md — Next phase planning doc
    ├── index.html          — SEO: JSON-LD, Open Graph, Twitter Cards
    │
    ├── research/                           — ★ DESIGN DOCUMENTS (see §7b)
    │   ├── 10_MASTER_DESIGN_DOC.md         — Single source of truth for the whole platform
    │   ├── 10_design_doc_01_foundation.md  — Philosophy, student profile, Slow Web mandate
    │   ├── 10_design_doc_02_curriculum.md  — Curriculum architecture, chapter map
    │   ├── 10_design_doc_03_vertiscale_game.md — ★★ THE GAME DESIGN DOC (Imagination Engine)
    │   ├── 10_design_doc_04_platform_and_business.md — Tech stack, revenue, deployment
    │   └── 09_master_architecture_doc.md   — Prior synthesis (superseded by 10_ docs)
    │
    ├── src/
    │   ├── main.jsx            — React entry
    │   ├── App.jsx             — Router + ScaffoldingProvider + WelcomeOnboarding
    │   ├── index.css           — Design system (~660 LOC, --cf-* + --bard-* tokens)
    │   │
    │   ├── game/                            — ★★ THE IMAGINATION ENGINE (Fret 9)
    │   │   ├── VertiscaleEngine.jsx         — Core state machine: menu, Phase 1/2/3, scoring
    │   │   ├── GameFretboard.jsx            — Visual layer: 8 cell states, hold animations
    │   │   ├── OrbEngine.jsx               — Phase 2: descending orbs (rAF + AudioContext timing)
    │   │   ├── PitchGateUI.jsx             — Phase 2: pitch needle cents deviation display
    │   │   ├── narrativeEngine.js           — Adventure state machine (Troubadour scenes)
    │   │   ├── scoreCalculator.js           — Flash + Sustain scoring, consistency ratio
    │   │   └── sessionLogger.js             — Persistence: tractionStore + Dexie
    │   │
    │   ├── hooks/
    │   │   └── useFlashTimer.js             — Timer engine: REVEAL→DARK→TAP→RESULT + HOLD states
    │   │
    │   ├── data/
    │   │   ├── chapterData.js      — ★ 12-chapter curriculum (Hero's Journey × Chromatic)
    │   │   ├── vertiscalePatterns.js — Pattern library: 12 roots × pentatonic/major/minor
    │   │   ├── harmonicData.js     — Pythagorean ratios + interval resonance cues
    │   │   ├── adventures/troubadour.js — ★ Pitch-gated narrative: 12 scenes, 3 acts, branching
    │   │   ├── slideGenerator.js   — Converts chapters → swipeable slide decks
    │   │   ├── timelessSongSlides.js — 36 historical slides (Pythagoras → Messiaen)
    │   │   ├── tractionStore.js    — localStorage progress + scaffolding fade
    │   │   ├── localDatabase.js    — Dexie/IndexedDB schema (offline-first, submission outbox)
    │   │   ├── pricingData.js      — ★ Revenue streams, pricing, Stripe link stubs
    │   │   ├── testimonialData.js  — ★ 13 real student testimonials + 8 FAQ items
    │   │   └── toolsData.jsx       — Tools catalog for Binder & SlideViewer
    │   │
    │   ├── components/
    │   │   ├── SlideViewer.jsx         — ★★ CORE: Swipeable slide reader (the Living Textbook)
    │   │   ├── PracticeRecorder.jsx    — ★ Async video/audio recorder → IndexedDB outbox
    │   │   ├── WelcomeOnboarding.jsx   — ★ 3-slide first-run welcome flow
    │   │   ├── AmbientPlayer.jsx       — HTML5 Audio: ambient + Metronome (mutually exclusive)
    │   │   ├── DigitalBinder.jsx       — Practice log + Tools tab + submission history
    │   │   ├── NeckMenu.jsx            — Root-note selection menu for game entry
    │   │   ├── ScaffoldingProvider.jsx — React context for traction-aware UI fade
    │   │   ├── FretboardExplorer.jsx   — 14-fret fretboard with scales + Web Audio
    │   │   ├── FretboardSheet.jsx      — Bottom-sheet fretboard overlay for in-slide practice
    │   │   ├── BreathingGate.jsx       — Somatic breathing gate (Bertrand's pre-practice ritual)
    │   │   ├── IntervalVisualizer.jsx  — ★ Fret 5: tap-two-notes interval trainer (©SHEARL)
    │   │   ├── MicrotonalTracker.jsx   — ★ Fret 8: real-time cents deviation mic tool (©FHEAL)
    │   │   ├── MultiKeyHub.jsx         — ★ Fret 11: all-12-keys scale overlay (©FHEAL)
    │   │   ├── PitchRoom.jsx           — Gamified interval ear training (©PLING!)
    │   │   ├── PlingTrainer.jsx        — Real-time pitch detection via mic (©PLING! protocol)
    │   │   ├── Metronome.jsx           — Tap tempo, adjustable BPM, visual pulse (in AmbientPlayer)
    │   │   ├── PracticeTimer.jsx       — Pomodoro-style with "Practice TOO SLOW" reminders
    │   │   └── RhythmEngine.jsx        — Rhythm pattern engine
    │   │
    │   └── pages/
    │       ├── OrientationHub.jsx     — ★ Mobile-first chapter list + 4-tab bottom nav
    │       └── StudioPage.jsx         — ★ Business landing (6 services, testimonials, payments)
    │
    └── public/assets/
        ├── bertrand_profile.jpg       — Instructor photo
        ├── houlton_skies.m4a          — ★ Bertrand's music (4.6MB, primary ambient)
        ├── home_audio.m4a             — Secondary ambient track (26MB)
        └── slides/ch1-ch12/           — AI-generated chapter artwork (ch1-8 populated, ch9-12 TBD)
```

---

## 7b. SUPPORTING DOCUMENTS — Reference Guide

The project has a layered documentation system. **Read in this order depending on your task:**

| If you need... | Read this | Path |
|---------------|-----------|------|
| Full project context | **CONTEXT.md** (this file) | `./CONTEXT.md` |
| Development timeline + key decisions | **ROADMAP.md** | `./ROADMAP.md` |
| Platform philosophy, student profile, pedagogy | **Master Design Doc** | `./research/10_MASTER_DESIGN_DOC.md` |
| **Game mechanics, imagination framework, scoring** | **★ Vertiscale Game Design Doc** | `./research/10_design_doc_03_vertiscale_game.md` |
| Curriculum structure (Yin/Yang, chapter map) | **Curriculum Design Doc** | `./research/10_design_doc_02_curriculum.md` |
| Tech stack, deployment, licensing | **Platform Design Doc** | `./research/10_design_doc_04_platform_and_business.md` |
| Philosophy + slow web mandate | **Foundation Design Doc** | `./research/10_design_doc_01_foundation.md` |
| Gamification research (audio, XR, licensing) | **Open Source Research** | `./Gamifying Guitar Learning with Open Source.md` |

### How to Use These Docs

**For game work:** Read `10_design_doc_03_vertiscale_game.md` FIRST. It contains:
- The Imagination Management Framework (Gordon, Boethius, predictive processing)
- The Three Inners mapping (Inner Fretboard / Inner Ear / Inner Voice)
- Flash and Imagine mode game loops
- Scoring philosophy (quality of internal model, not speed)
- Phase 2 audiation loop and the critical "audiation pause"
- Phase 3 journal/coaching cue design
- Future: adventure system, XR transformation

**For platform work:** Read `10_MASTER_DESIGN_DOC.md` for the full picture.

**For pricing/business questions:** Read `ROADMAP.md` §Revenue + `10_design_doc_04_platform_and_business.md`.

**Rule: Update docs when you change the game.** If a game mechanic changes, update the game design doc in the same session. This prevents scope creep and keeps imagination management as the governing lens.

---

## 8. WHAT'S DONE vs WHAT'S LEFT

### ✅ Complete (as of 2026-05-19)
- [x] 12-chapter Living Textbook (free, swipeable slides with artwork for ch1-8)
- [x] StudioPage business landing (6 services, 13 testimonials, payment grid, FAQ, French section)
- [x] All 12 Fret tools wired and interactive (12/12 ✅)
- [x] **Fret 9 — Vertiscale Imagination Engine** ✅
  - Phase 1 Flash: REVEAL → DARK → TAP → RESULT (8 rounds, progressive difficulty)
  - Phase 1 Imagine: REVEAL → HOLD → RESULT (sustain scoring, breathing pulse)
  - Phase 2 Audiate: OrbEngine + PitchGateUI wired (needs live testing)
  - Phase 3 Reflect: Journal textarea + dynamic coaching cues + localStorage persistence
- [x] Menu reframed: Inner Fretboard / Inner Ear / Inner Voice
- [x] Imagination Management Framework documented in game design doc
- [x] PracticeRecorder, AmbientPlayer, Metronome, WelcomeOnboarding, SEO
- [x] Digital Binder (practice log, tools tab, submissions)
- [x] Workspace cleanup and rename (daydream-website → voix-vive)

### 🟡 Needs Bertrand's Input
- [ ] Stripe Payment Links — Bertrand creates Stripe account, we plug in URLs
- [ ] Venmo QR image — need actual QR code screenshot
- [ ] Review StudioPage copy for accuracy
- [ ] Thursday review call feedback

### 🔴 Next Game Workflows (Priority Order)

These are the next tasks for game development sessions. Each one should be a focused session.

**Workflow 1: Live Testing + Bug Fixes** (1 session)
- Spin up dev server, test all 4 game modes in browser
- Verify Phase 1 Flash (regression — should still work)
- Verify Phase 1 Imagine (new — sustain hold + breathing pulse)
- Verify Phase 2 Audiate (new — OrbEngine + PitchGateUI integration)
- Verify Phase 3 Reflect (new — journal + coaching cues)
- Fix any runtime errors, visual glitches, or UX issues

**Workflow 2: Audiation Pause for Phase 2** (1 session)
- Add the "imagine before you sing" UI affordance to OrbEngine
- Visual: note name appears → countdown → mic activates (the pause IS the training)
- This is the single most important game mechanic — it's what separates this from Guitar Hero
- Update `10_design_doc_03_vertiscale_game.md` if the design changes

**Workflow 3: Pattern Library + Menu Expansion** (1 session)
- Add scale type selector to game menu (pentatonic / major / minor / CAGED)
- Wire `vertiscalePatterns.js` to generate all scale types for selected root
- This is pure content expansion — triples the playable material

**Workflow 4: Session Persistence + Phase Unlock Gates** (1 session)
- Reconcile sessionLogger.js with VertiscaleEngine's inline localStorage
- Implement phase unlock gates: 5 successful Phase 1 → unlock Phase 2, etc.
- Wire `computePhaseUnlock()` from scoreCalculator into the menu

**Workflow 5: Troubadour Adventure UI** (1-2 sessions)
- Build adventure scene renderer component
- Wire `troubadour.js` (484 lines of pitch-gated narrative, 12 scenes, branching)
- This is where imagination management becomes narrative — the student IS a character
- Biggest untapped asset in the codebase

**Workflow 6: Eyes-Closed Mode + Somatic Deepening** (1 session)
- Add "eyes closed" variant of Flash mode — screen goes black, taps are from pure imagination
- Add imagination vividness self-rating after each round
- Add body scan prompt rotation to Phase 3 journal

### 🚀 Future: VR/AI Masterclass (the premium product)
- [ ] Bevy ECS + Rust/WASM + OpenXR architecture document
- [ ] Fine-tune Gemma 4 model on Bertrand's teaching data
- [ ] Android app shell in Android Studio
- [ ] VR classroom: avatar, fretboard overlay, pitch detection

### 🎨 Remaining Non-Game Work
- [ ] ch9-12 artwork (35 images via AI generation)
- [ ] PracticeRecorder → actual upload pipeline (Cloudflare R2)
- [ ] Production deployment (voix-vive.com domain + Vercel DNS)

---

## 9. QUICK-START FOR NEW AI SESSIONS

```
INSTRUCTIONS FOR AI:

1. You are building "Voix Vive" — a BUSINESS PLATFORM for guitar instructor
   Bertrand Laurence. The 12-chapter Living Textbook is FREE (marketing funnel).
   Revenue comes from live coaching, async feedback, membership, and workshops.

2. Project root: /home/joshua-atkinson/antigravity/voix-vive/
   App: /home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass/

3. THE GAME (Fret 9 — Vertiscale Imagination Engine) is the current dev focus.
   Read research/10_design_doc_03_vertiscale_game.md for the Imagination
   Management Framework BEFORE making game changes.

4. The game trains IMAGINATION, not fingers. Three phases:
   - THE INNER FRETBOARD: Flash (prediction speed) + Imagine (prediction stability)
   - THE INNER EAR: Audiate (imagine pitch → sing → verify → place)
   - THE INNER VOICE: Reflect (journal + coaching cues)

5. Game code lives in src/game/ (7 files) and src/hooks/useFlashTimer.js.
   Game data lives in src/data/vertiscalePatterns.js, harmonicData.js,
   and adventures/troubadour.js.

6. RESPECT THE IP BOUNDARY (§5): Don't import Great Game concepts without permission.

7. THE LIVING TEXTBOOK IS FREE. Do not gate chapters behind payment.

8. Run: cd /home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass && npm run dev

9. When changing game mechanics, UPDATE the game design doc in the same session.
   Documentation is the lens that prevents scope creep.

10. Bertrand has family in France he hasn't visited in years.
    This platform needs to fund that trip. Build accordingly.
```

### Academic Context
- Purdue EDCI 57300 Practicum
- AI Policy: Level 2 Partially Restricted — must declare AI usage
