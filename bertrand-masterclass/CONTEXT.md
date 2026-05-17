# 🎸 VOIX VIVE — Master Context & Business Platform

> **Purpose:** Load this file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-17 (Session 4 — Revenue Pivot + Documentation Discipline)  
> **Project Root:** `/home/joshua-atkinson/antigravity/daydream-website/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5178  
> **Git:** https://github.com/joshua42atkinson/daydream-website.git  
> **Deployment:** Vercel (TBD — needs production domain)

---

## 1. CAST OF CHARACTERS

### The Developer — Joshua Atkinson
- Systems Architect, Full-Stack Engineer (Rust/Bevy/WASM/Android/React)
- Purdue University MS LDT Candidate (EDCI 57300 Practicum, Dr. Jennifer Richardson)
- Creator of the *Trinity ID AI OS* and the *ADDIECRAPEYE* design framework
- Author of *"The Great Game: A Player's Handbook to Consciousness"* (personal IP — see §3)
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

## 3. BERTRAND'S PEDAGOGY (SME-OWNED CONTENT)

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

## 4. IP BOUNDARY: THE GREAT GAME vs THE MASTERCLASS

**BERTRAND'S** (use freely): 5 Pillars, SHEARL/PLING!/FHEAL, Yin/Yang, kinesthesis, fascia, CAGED, Vertiscales, breath-work, body scan, Hero's Journey × Chromatic Scale

**JOSHUA'S GREAT GAME** (do NOT import without discussion): Four Channels/Committee, Player/Persona/Architect, Physics of Being, Virtue Topology, N=1 Experiment, Coal/Steam/Traction model

**BORDERLINE** (confirmed titles): "Voix Vive" title, "Bard Level" terminology, Monomyth stage names

---

## 5. TECH STACK

```
Framework:    Vite + React 18 + React Router 7
Styling:      Tailwind CSS 3 + vanilla CSS (~680 LOC with --bard-* aliases)
Animation:    Framer Motion (swipe gestures, transitions)
Icons:        Lucide React
Audio:        HTML5 Audio (Bertrand's "Houlton Skies" as primary ambient track)
State:        localStorage via tractionStore.js + ScaffoldingProvider context
Fonts:        Cormorant Garamond, Inter, EB Garamond, JetBrains Mono
Payments:     Stripe Payment Links (no backend required) + Venmo QR
DB (Local):   Dexie.js / IndexedDB (offline progress + submission outbox)
Media:        MediaRecorder API (practice video/audio capture)
SEO:          JSON-LD LocalBusiness, Open Graph, Twitter Cards
Total Source: ~8,250 lines across 24 files
```

---

## 6. FILE MAP

```
bertrand-masterclass/
├── CONTEXT.md              — THIS FILE (master project context)
├── ROADMAP.md              — Development roadmap with phases and timeline
├── index.html              — SEO: JSON-LD, Open Graph, Twitter Cards
│
├── src/
│   ├── main.jsx            — React entry
│   ├── App.jsx             — Router + ScaffoldingProvider + WelcomeOnboarding
│   ├── index.css           — Design system (~680 LOC, --cf-* + --bard-* tokens)
│   │
│   ├── data/
│   │   ├── chapterData.js      — ★ 12-chapter curriculum (Hero's Journey × Chromatic)
│   │   ├── slideGenerator.js   — Converts chapters → swipeable slide decks
│   │   ├── tractionStore.js    — localStorage progress + scaffolding fade
│   │   ├── localDatabase.js    — Dexie/IndexedDB schema (offline-first, submission outbox)
│   │   ├── pricingData.js      — ★ Revenue streams, pricing, Stripe link stubs
│   │   ├── testimonialData.js  — ★ 13 real student testimonials + 8 FAQ items
│   │   └── videoData.js        — Video module index
│   │
│   ├── components/
│   │   ├── SlideViewer.jsx         — ★★ CORE: Swipeable slide reader (the Living Textbook)
│   │   ├── PracticeRecorder.jsx    — ★ Async video/audio recorder → IndexedDB outbox
│   │   ├── WelcomeOnboarding.jsx   — ★ 3-slide first-run welcome flow
│   │   ├── AmbientPlayer.jsx      — HTML5 Audio: "Houlton Skies" + volume/skip
│   │   ├── DigitalBinder.jsx       — Practice log + submission history viewer
│   │   ├── ConnectionManager.jsx   — Dormant (renders null until DaaS backend exists)
│   │   ├── ScaffoldingProvider.jsx — React context for traction-aware UI fade
│   │   ├── FretboardExplorer.jsx   — 14-fret fretboard with scales + Web Audio
│   │   ├── BreathingGate.jsx       — Somatic breathing gate
│   │   ├── PitchRoom.jsx           — Gamified ear training
│   │   ├── TheMentor.jsx           — Legacy (superseded by StudioPage, can be deleted)
│   │   └── About.jsx               — Contact info
│   │
│   └── pages/
│       ├── OrientationHub.jsx     — ★ Mobile-first chapter list + 4-tab bottom nav
│       ├── StudioPage.jsx         — ★ Business landing (6 services, testimonials, payments)
│       └── MentorshipHub.jsx      — Legacy mentorship dashboard (placeholder)
│
└── public/assets/
    ├── bertrand_profile.jpg       — Instructor photo
    ├── houlton_skies.m4a          — ★ Bertrand's music (4.6MB, primary ambient)
    ├── home_audio.m4a             — Secondary ambient track (26MB)
    └── slides/ch1-ch12/           — AI-generated chapter artwork (ch1-8 populated, ch9-12 empty)
```

---

## 7. WHAT'S DONE vs WHAT'S LEFT

### ✅ Complete
- [x] 12-chapter Living Textbook (free, swipeable slides with artwork for ch1-8)
- [x] StudioPage business landing (6 services, 13 testimonials, payment grid, FAQ, French section)
- [x] PracticeRecorder (video/audio → IndexedDB outbox)
- [x] AmbientPlayer (Bertrand's "Houlton Skies" via HTML5 Audio)
- [x] WelcomeOnboarding (3-slide first-run intro)
- [x] SEO (JSON-LD, Open Graph, Twitter Cards)
- [x] OrientationHub bottom nav (Chapters, Fretboard, Binder, Studio)
- [x] FretboardExplorer (14-fret with scales + Web Audio)
- [x] Digital Binder (practice log, submissions, feedback)

### 🟡 Needs Bertrand's Input
- [ ] Stripe Payment Links — Bertrand creates Stripe account, we plug in URLs
- [ ] Venmo QR image — need actual QR code screenshot
- [ ] PayPal.me and Ko-fi URLs
- [ ] Review StudioPage copy for accuracy

### 🔴 Remaining Dev Work
- [ ] ch9-12 artwork (35 images via AI generation)
- [ ] PracticeRecorder → actual upload pipeline (Cloudflare R2 or DaaS tunnel)
- [ ] Remove `react-youtube` unused dependency from package.json
- [ ] Delete `TheMentor.jsx` (dead code, replaced by StudioPage)
- [ ] MentorshipHub.jsx — either wire to real data or remove

### 🚀 Future: VR/AI Masterclass (the premium product)
- [ ] Bevy ECS + Rust/WASM + OpenXR architecture document
- [ ] Fine-tune Gemma 4 model on Bertrand's teaching data
- [ ] Android app shell in Android Studio
- [ ] VR classroom: avatar, fretboard overlay, pitch detection

---

## 8. QUICK-START FOR NEW AI SESSIONS

```
INSTRUCTIONS FOR AI:

1. You are building "Voix Vive" — a BUSINESS PLATFORM for guitar instructor
   Bertrand Laurence. The 12-chapter Living Textbook is FREE (marketing funnel).
   Revenue comes from live coaching, async feedback, membership, and workshops.

2. Project: Vite + React at /home/joshua-atkinson/antigravity/daydream-website/bertrand-masterclass/

3. THE CORE EXPERIENCE is the SlideViewer.jsx (free curriculum) +
   StudioPage.jsx (business landing with pricing, testimonials, and CTAs).

4. PAYMENT: Use Stripe Payment Links (no backend needed). Bertrand also
   accepts Venmo. Display both options prominently.

5. RESPECT THE IP BOUNDARY (§4): Don't import Great Game concepts without permission.

6. THE LIVING TEXTBOOK IS FREE. Do not gate chapters behind payment.
   The FUTURE Masterclass is a separate VR/AI product (Bevy + Gemma 4).

7. Run: cd bertrand-masterclass && npm run dev

8. Bertrand has family in France he hasn't visited in years.
   This platform needs to fund that trip. Build accordingly.
```

### Academic Context
- Purdue EDCI 57300 Practicum
- AI Policy: Level 2 Partially Restricted — must declare AI usage
