# 🎸 VOIX VIVE — Master Context & Business Platform

> **Purpose:** Load this file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-18 (Session 7 — Workspace Rename + Tools Complete)  
> **Project Root:** `/home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5178  
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
    ├── src/
    │   ├── main.jsx            — React entry
    │   ├── App.jsx             — Router + ScaffoldingProvider + WelcomeOnboarding
    │   ├── index.css           — Design system (~660 LOC, --cf-* + --bard-* tokens)
    │   │
    │   ├── data/
    │   │   ├── chapterData.js      — ★ 12-chapter curriculum (Hero's Journey × Chromatic)
    │   │   ├── slideGenerator.js   — Converts chapters → swipeable slide decks
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

## 8. WHAT'S DONE vs WHAT'S LEFT

### ✅ Complete
- [x] 12-chapter Living Textbook (free, swipeable slides with artwork for ch1-8)
- [x] StudioPage business landing (6 services, 13 testimonials, payment grid, FAQ, French section)
- [x] PracticeRecorder (video/audio → IndexedDB outbox)
- [x] AmbientPlayer (Bertrand's "Houlton Skies" via HTML5 Audio)
- [x] Metronome wired into AmbientPlayer panel (mutually exclusive with ambient, persistent across pages)
- [x] WelcomeOnboarding (3-slide first-run intro)
- [x] SEO (JSON-LD, Open Graph, Twitter Cards)
- [x] OrientationHub bottom nav (Chapters, Fretboard, Binder, Studio)
- [x] FretboardExplorer (14-fret with scales + Web Audio)
- [x] Digital Binder (practice log, tools tab, submissions) — max-width 640px on desktop
- [x] Guitar Tools wired in Binder: Metronome, PracticeTimer, PlingTrainer, PitchRoom, BreathingGate, RhythmEngine
- [x] FretboardSheet wired into SlideViewer exercise slides
- [x] Fret 5 — Interval Visualizer (©SHEARL) ✅
- [x] Fret 8 — Microtonal Tracker (©FHEAL) ✅
- [x] Fret 11 — Multi-Key Hub (©FHEAL) ✅
- [x] Workspace cleanup and rename (daydream-website → voix-vive) — May 18 2026

### 🟡 Needs Bertrand's Input
- [ ] Stripe Payment Links — Bertrand creates Stripe account, we plug in URLs
- [ ] Venmo QR image — need actual QR code screenshot
- [ ] PayPal.me and Ko-fi URLs
- [ ] Review StudioPage copy for accuracy

### 🔴 Remaining Dev Work
- [ ] **Fret 9 — Vertiscale Engine** (©SHEARL) — the main gamification event
  - Phase 1: show vertical scale pattern, hide it, student taps from memory, score + streak
  - Phase 2: PLING! mic validation
  - Phase 3: FHEAL freeplay tracker
- [ ] ch9-12 artwork (35 images via AI generation)
- [ ] ch8 artwork completion (missing: exercise-0, exercise-1, fretboard, meditation, quote, end)
- [ ] PracticeRecorder → actual upload pipeline (Cloudflare R2 or DaaS tunnel)
- [ ] Production deployment (voix-vive.com domain + Vercel DNS)

### 🚀 Future: VR/AI Masterclass (the premium product)
- [ ] Bevy ECS + Rust/WASM + OpenXR architecture document
- [ ] Fine-tune Gemma 4 model on Bertrand's teaching data
- [ ] Android app shell in Android Studio
- [ ] VR classroom: avatar, fretboard overlay, pitch detection

---

## 9. QUICK-START FOR NEW AI SESSIONS

```
INSTRUCTIONS FOR AI:

1. You are building "Voix Vive" — a BUSINESS PLATFORM for guitar instructor
   Bertrand Laurence. The 12-chapter Living Textbook is FREE (marketing funnel).
   Revenue comes from live coaching, async feedback, membership, and workshops.

2. Project root: /home/joshua-atkinson/antigravity/voix-vive/
   App: /home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass/

3. THE CORE EXPERIENCE is the SlideViewer.jsx (free curriculum) +
   StudioPage.jsx (business landing with pricing, testimonials, and CTAs).

4. PAYMENT: Use Stripe Payment Links (no backend needed). Bertrand also
   accepts Venmo. Display both options prominently.

5. RESPECT THE IP BOUNDARY (§5): Don't import Great Game concepts without permission.

6. THE LIVING TEXTBOOK IS FREE. Do not gate chapters behind payment.
   The FUTURE Masterclass is a separate VR/AI product (Bevy + Gemma 4).

7. Run: cd /home/joshua-atkinson/antigravity/voix-vive/bertrand-masterclass && npm run dev

8. Bertrand has family in France he hasn't visited in years.
   This platform needs to fund that trip. Build accordingly.
```

### Academic Context
- Purdue EDCI 57300 Practicum
- AI Policy: Level 2 Partially Restricted — must declare AI usage
