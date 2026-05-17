# 🎸 BERTRAND MASTERCLASS — Master Context & Maturation Map

> **Purpose:** Load this entire file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-17 (Session 2)  
> **Project Root:** `/home/joshua-atkinson/antigravity/daydream-website/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5174 (or next available port)  
> **Git:** https://github.com/Joshua42atkinson/Music.git (code lives in daydream-website monorepo)

---

## 1. CAST OF CHARACTERS

### The Developer — Joshua Atkinson
- Systems Architect, Full-Stack Engineer (Rust/Bevy/WASM/Android/React)
- Purdue University MS LDT Candidate (EDCI 57300 Practicum, Dr. Jennifer Richardson)
- Creator of the *Trinity ID AI OS* and the *ADDIECRAPEYE* design framework
- Author of *"The Great Game: A Player's Handbook to Consciousness"* (personal IP — see §3)
- Portfolio: LDTAtkinson.com
- Hardware: Desktop (AMD Strix Halo / 128GB RAM); currently on laptop

### The Client/SME — Bertrand Laurence
- Master guitarist (Berklee, MassArt, Mirage Mime Theatre)
- Creator of the Somatic Mystic philosophy
- Proprietary protocols: ©SHEARL, ©PLING!, ©FHEAL
- YouTube: https://www.youtube.com/@BertrandLaurenceMusic/videos
- Studio: https://bertrandguitarstudio.duetpartner.com/
- **Thursday call scheduled** — Bertrand reviews the build

### Academic Context
- Purdue EDCI 57300 Practicum
- AI Policy: Level 2 Partially Restricted — must declare AI usage

---

## 2. BERTRAND'S PEDAGOGY (SME-OWNED CONTENT)

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
- Practice TOO SLOW (myelination), Kinesthetic Sleep, The Practice Nook, Binder Control, CAGED System, Vertiscales, Notes → Chords → Songs

---

## 3. IP BOUNDARY: THE GREAT GAME vs THE MASTERCLASS

**BERTRAND'S** (use freely): 5 Pillars, SHEARL/PLING!/FHEAL, Yin/Yang, kinesthesis, fascia, CAGED, Vertiscales, breath-work, body scan, Hero's Journey × Chromatic Scale

**JOSHUA'S GREAT GAME** (do NOT import without discussion): Four Channels/Committee, Player/Persona/Architect, Physics of Being, Virtue Topology, N=1 Experiment, Coal/Steam/Traction model

**BORDERLINE** (confirm Thursday): "The Bard's Voix Vive" title, "Bard Level" terminology, Monomyth stage names, alchemical metaphors

---

## 4. TECH STACK

```
Framework:    Vite + React 18 + React Router 7
Styling:      Tailwind CSS 3 + vanilla CSS (~680 LOC with --bard-* aliases)
Animation:    Framer Motion (swipe gestures, transitions)
Icons:        Lucide React
Audio:        Web Audio API
State:        localStorage via tractionStore.js + ScaffoldingProvider context
Fonts:        Cormorant Garamond, Inter, EB Garamond, JetBrains Mono
Total Source:  ~4,500 lines across 19 files
```

---

## 5. FILE MAP

```
bertrand-masterclass/
├── CONTEXT.md              — THIS FILE
├── src/
│   ├── main.jsx            — React entry
│   ├── App.jsx             — Router + ScaffoldingProvider wrapper
│   ├── index.css           — Design system (~680 LOC, --cf-* + --bard-* tokens, .bard-* classes)
│   │
│   ├── data/
│   │   ├── chapterData.js  — ★ 12-chapter curriculum (22 exercises, ~220 LOC)
│   │   ├── slideGenerator.js — ★ Converts chapters → swipeable slide decks + SLIDE_IMAGES map
│   │   ├── tractionStore.js — localStorage progress + scaffolding fade (180 LOC)
│   │   └── videoData.js    — Video module index (41 LOC)
│   │
│   ├── components/
│   │   ├── SlideViewer.jsx      — ★★ CORE: Phone-native swipeable slide reader (glassmorphism)
│   │   ├── ScaffoldingProvider.jsx — React context for traction-aware UI fade
│   │   ├── FretboardExplorer.jsx — Full 14-fret fretboard with scales + Web Audio
│   │   ├── VoixViveSpread.jsx   — Legacy desktop Yin/Yang book layout (superseded by SlideViewer)
│   │   ├── BreathingGate.jsx    — Somatic breathing + body scan gate
│   │   ├── PitchRoom.jsx        — Gamified ear training
│   │   ├── DigitalBinder.jsx    — Practice log + habit tracker
│   │   ├── ModulePlayer.jsx     — Video embed shell
│   │   ├── PlayerHandbook.jsx   — Legacy 5-Tome handbook (deprecated)
│   │   └── About.jsx            — Bertrand bio + contact
│   │
│   └── pages/
│       └── OrientationHub.jsx   — ★ Mobile-first vertical chapter list + SlideViewer integration
│
└── public/assets/
    ├── bertrand_profile.jpg
    ├── slides/ch1/              — ★ Generated art: title.png, yin-tension.png, meditation.png
    └── slides/                  — (ch2-12 art to be generated in next session)
```

★★ = Primary delivery component (this is what users interact with)

---

## 6. CURRENT STATE — What's Built

### Mobile-First "Living Textbook" (THE CORE EXPERIENCE)
- **OrientationHub:** Vertical chapter list grouped by Hero's Journey Acts (I–III)
  - Each chapter = full-width card with icon badge, colored accent, fret/interval metadata
  - Fixed bottom tool bar (Chapters / Fretboard / Binder / About)
  - Tap any chapter → opens SlideViewer full-screen
- **SlideViewer:** Phone-native swipeable slide deck (framer-motion drag gestures)
  - Each chapter auto-generates ~12-15 slides from chapterData
  - Slide types: title, yin-philosophy, yin-quote, yin-concept, yin-meditation, yang-instruction, yang-exercise, yang-fretboard, chapter-end
  - Portrait: image top (38vh) / text bottom (glass panel)
  - Landscape: image left (40%) / text right (60%)
  - Glassmorphism: frosted glass topbar, text zone, and navigation
  - Progress bar + dot navigation + prev/next arrows
  - Per-slide image rendering (actual art when available, gradient fallback)
  - Chapter 1 has 3 AI-generated background images (golden string, fascia meditation, breath ripple)

### All 12 Chapters Have Full Content
- Unique philosophy (Yin), wisdom quote, meditation prompt per chapter
- 2 detailed exercises each (Yang) with 5-step procedures
- Chapter 12 = intentional Free Play (no exercises)
- SHEARL and PLING! protocols integrated into chapters 4-7

### Supporting Systems
- **FretboardExplorer:** 14-fret range, 6 scale patterns, root selector, MIDI math, chapter-aware dimming
- **ScaffoldingProvider:** React context wrapping entire app
- **TractionStore:** All 12 chapters unlocked by default (for Bertrand review)
- **Design System:** Unified --bard-* CSS tokens + .bard-card/button/label/badge/quote classes

---

## 7. MATURATION MAP — Next Session Priorities

### 🎨 PHASE A: Visual Art (Paused for Art Direction)
- [x] Generate themed background images for Chapters 1-8.
- [ ] Define strict "Art Direction / Brand Bible" before mass generating the remaining 60+ images.
- [ ] Wire all remaining images into SLIDE_IMAGES map in slideGenerator.js.

### 🎵 PHASE B: Background Music
- [ ] Embed Bertrand's YouTube guitar performances as ambient audio.
- [ ] Audio player component with play/pause, volume, track selector.
- [ ] Auto-play soft guitar during Yin slides, silence during Yang exercises.

### ✨ PHASE C: Glassmorphism Polish
- [x] Apply glass treatment to SlideViewer panels.
- [ ] Apply glass treatment to OrientationHub chapter cards.
- [ ] Add subtle particle/glow effects to chapter headers.

### 🎸 PHASE D: The Three Protocols (Software Interactivity)
- [x] **©PLING! (Sing Then Find):** Built `PlingTrainer.jsx` using Web Audio API for real-time vocal pitch detection.
- [ ] **©SHEARL (Call and Response):** Upgrade `FretboardExplorer.jsx` into an interactive game (App highlights fret -> App plays note -> App listens for student to play it on guitar).
- [ ] **©FHEAL (Rhythm & Flow Tracker):** Build a module that uses microphone volume envelopes to measure continuous playing (Flow) vs stuttering, without Left-Brain interference.

### 📱 PHASE E: Mobile UX Polish  
- [ ] Test on 375px (iPhone SE) and 390px (iPhone 14) viewports.
- [ ] Haptic feedback on slide swipe (navigator.vibrate).
- [ ] PWA manifest for home screen install.

### 🤖 PHASE F: AI & Advanced (Desktop ONLY)
- [ ] Local LLM "Ask Bertrand" Socratic tutor.
- [ ] Computer vision posture tracking.

### 💼 PHASE G: Mentorship & Business Ecosystem (The Pivot)
- [ ] **1-on-1 Mentoring Portal:** Create `MentorshipHub.jsx` for seamless Zoom/WebRTC video coaching integration.
- [ ] **Homework App:** Upgrade `DigitalBinder.jsx` to a backend-ready application (Firebase/Supabase).
- [ ] **Progress Tracking:** Allow Bertrand to assign chapters and students to submit audio/video practice recordings.

### 📝 PHASE H: Content (Requires Bertrand — Thursday call)
- [ ] Bertrand reviews all chapter content and app usability.
- [ ] Confirm/replace terminology and titles.
- [ ] Discuss backend database needs for the business pivot.

---

## 8. QUICK-START FOR NEW AI SESSIONS

```
INSTRUCTIONS FOR AI:

1. You are building "The Bertrand Laurence Masterclass" — a mobile-first, swipeable
   Living Textbook for guitar instruction based on Bertrand's Somatic Mystic philosophy.

2. Project: Vite + React at /home/joshua-atkinson/antigravity/daydream-website/bertrand-masterclass/

3. THE CORE EXPERIENCE is SlideViewer.jsx — a phone-native swipeable slide deck.
   Each chapter auto-generates ~15 slides from chapterData.js via slideGenerator.js.
   Slides have images (top/left) + text (bottom/right) with glassmorphism.

4. RESPECT THE IP BOUNDARY (§3): Don't import Great Game concepts without permission.

5. NEXT PRIORITIES: Generate art for all 12 chapters, add background music,
   polish glassmorphism, integrate fretboard as bottom sheet.

6. Run: cd bertrand-masterclass && npm run dev

7. Desktop machine needed for: AI inference, WASM FFT, computer vision.
```
