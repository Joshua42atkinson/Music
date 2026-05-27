# VOIX VIVE — Design Document | Batch 04: Platform & Business
*Architecture, Revenue Model, IP & Licensing*

---

## V. THE PLATFORM — Technical Architecture

### Design Principle: Technology Serves Pedagogy

Every technical decision is subordinate to a pedagogical one. This means:
- The AudioWorklet exists because ©PLING! requires mic feedback without UI lag — not because WASM is elegant
- Framer Motion transitions are slow because the Slow Web philosophy demands contemplation — not because animation is fun
- IndexedDB exists because adult learners practice in fragments — not because local-first is fashionable

If a technology cannot be justified by naming a student need or a pedagogical protocol, it does not belong in the stack.

### Pedagogical Contrast: Recall vs. Recognition

The platform actively distances itself from mainstream "scrolling tab" (Guitar Hero style) guitar education tools, which train **Reactive Recognition** (reacting to a dot on a screen). Instead, the platform enforces **Deep Recall**:

- **Vertiscale Engine (Phase 1):** Forces the student to visualize a pattern, hold it in their working memory (after the flash disappears), and physically execute it. This builds robust neurological pathways rather than mere visual reflexes.
- **Progressive Difficulty Stages:** To manage cognitive load, the Vertiscale Engine scales dynamically. Instead of overwhelming beginners with a 6-string shape, it starts at **Stage 1 (Bass Strings Only)** and progressively adds higher strings every two rounds, bridging the gap between isolated "box" playing and holistic fretboard fluency.

---

### The Four Phases

```
PHASE 1: The Living Textbook (CURRENT — complete)
  What:    Browser-based PWA, 12-chapter curriculum, Digital Binder
  Deploy:  Vercel → voix-vive.com
  Stack:   Vite + React 18 + React Router 7 + Vanilla CSS (custom --bard-* tokens)
  Audio:   HTML5 Audio (AmbientPlayer) + Web Audio API (tools)
  DB:      Dexie/IndexedDB (offline-first progress + submission outbox)
  State:   localStorage + ScaffoldingProvider React Context

PHASE 2: The Mentored Platform (NEXT — async coaching)
  What:    AsyncAssessor upload pipeline, Bertrand's review dashboard
  New:     Cloudflare R2 for video storage, email/SMS notification
  Key:     AsyncAssessor.jsx ≠ PracticeRecorder.jsx — it is a distinct tool
           PracticeRecorder: local capture + IndexedDB outbox
           AsyncAssessor: direct submission + mentor dashboard connection
  Revenue: $89/mo tier now functional

PHASE 3: Android XR Guitar Instruction (FUTURE)
  What:    Native Android app wrapping web frontend (Tauri v2)
           + Bevy ECS / OpenXR immersive Vertiscale experience
  Audio:   oboe crate (NOT cpal) — bypasses Android audio mixer
           AudioStreamBuilder → PERFORMANCE_MODE_LOW_LATENCY
  XR:      bevy_oxr (correct crate — NOT bevy_mod_xr)
  AI:      On-device fine-tuned Gemma 4 "Ask Bertrand" model
           Runs via Tauri IPC, no cloud dependency

PHASE 4: The Bertrand Laurence School (VISION)
  What:    Multi-instructor platform
           Guest experts: jazz, folk, classical
           Synchronous virtual ensembles (spatialized 3D audio)
           Gated modules from diverse masters
```

---

### Current Tech Stack (Phase 1)

| Layer | Technology | Pedagogical Justification |
|---|---|---|
| Framework | Vite + React 18 | Component isolation maps to modular tool architecture |
| Routing | React Router 7 | Tab-based nav (Chapters / Fretboard / Binder / Studio) |
| Styling | Vanilla CSS + custom `--bard-*` tokens | Design system enforces visual calm (dark, gold, no red/green gamification colors) |
| Animation | Framer Motion | Slow swipe transitions enforce Slow Web pacing |
| Audio | HTML5 Audio + Web Audio API | AmbientPlayer = practice nook atmosphere; AudioWorklet = real-time pitch tools |
| State | localStorage + ScaffoldingProvider | Progress survives fragmented sessions (adult learner mandate) |
| DB | Dexie/IndexedDB | Offline-first submission outbox |
| Payments | Stripe Payment Links | Zero backend — Bertrand can manage independently |
| SEO | JSON-LD LocalBusiness + Open Graph | Guitar instructor local discovery + social sharing |
| Fonts | Cormorant Garamond (headings) + Inter (body) + JetBrains Mono (fretboard labels) | Typography enforces esoteric-but-legible identity |

### Audio Pipeline: Real-Time Pitch Detection

The following applies to PlingTrainer, MicrotonalTracker, and Vertiscale Phase 2:

```
Mic Input
    ↓
MediaStreamAudioSource
    ↓
AudioWorkletNode (main thread)
    ↓ [SharedArrayBuffer ring buffer — 4096 samples]
AudioWorkletProcessor [WASM thread]
    ↓
YIN / autocorrelation algorithm
  - Buffer: 4096 samples @ 44.1kHz = ~93ms base latency
  - Hybrid time-domain + frequency-domain reduces perceptible latency to <30ms
    ↓
Fundamental frequency (Hz)
    ↓ [PostMessage back to main thread]
MIDI note mapping: n = 69 + 12 × log₂(f/440)
    ↓
Cents deviation: cents = 1200 × log₂(detected/target)
    ↓
UI update: needle / gate indicator / orb color
```

**Library choices:**
- `autopitch` (Rust/WASM): zero-allocation, real-time — use for PlingTrainer + Vertiscale mic gate
- `pitchlite` (C++/WASM, MPM + YIN): use for MicrotonalTracker (sub-cent resolution needed)
- `Glicol` (Rust graph synth): use for Phase 3 Freeplay procedural backing tracks

---

## VI. THE ECONOMY — Business Model

### The Funnel

```
FREE          → Living Textbook (12 chapters, all tools, no login required)
                PURPOSE: Culture-building. Students fall in love with Bertrand's
                method before they've spent a dollar. SEO brings them here.
                
PAID TIER 1   → The Passive Path ($19/mo)
                Full curriculum access, Digital Binder, progress persistence
                No direct mentor contact
                WHO: Self-directed learners, gift recipients, international students
                
PAID TIER 2   → The Mentored Path ($89/mo)  ← STRATEGIC FULCRUM
                All of Tier 1 + AsyncAssessor submissions (2/month)
                Bertrand reviews 60–90s clips → returns 3–5min personal video response
                EFFECTIVE RATE: $356/hr for Bertrand (compressed, async, scalable)
                WHO: Committed students who want personal feedback without scheduling pressure
                
PAID TIER 3   → The Live Path ($350/mo)
                All of Tier 2 + synchronous Zoom sessions + direct messaging
                WHO: Serious students, those rebuilding after injury, performers
```

### One-Time Products

| Product | Price | Description |
|---|---|---|
| Downloadable Resource Pack | $29 | Bertrand's Vertiscales, CAGED maps, chord grids (printable PDF) |
| Gift Certificate | $60–$275 | For Gift-Givers — generates PDF/email confirmation |

### Payment Stack
Stripe Payment Links (no backend required) → Bertrand operates independently once URLs are plugged into `pricingData.js`  
Secondary: Venmo QR, PayPal.me, Ko-fi, Zelle, Wire/IBAN (francophone students)

### Francophone Market Strategy
Bertrand's French fluency opens Montreal, Quebec, and Louisiana — markets underserved by English-language guitar instruction. The StudioPage French section is already live. Once `voix-vive.com` is live with French SEO tags, this market activates organically.

---

## VII. THE LAW — IP & Licensing

### IP Boundary: What Belongs to Whom

```
BERTRAND'S (use freely in the platform):
  ©SHEARL, ©PLING!, ©FHEAL (protocols)
  The 5 Pillars of musicianship
  Yin/Yang dual-coding methodology
  Vertiscale teaching method
  CAGED system applications
  Somatic/kinesthetic language
  All curriculum content and chapter narratives
  The axiom: "You are an instrument playing an instrument"

JOSHUA'S — THE GREAT GAME (do NOT import without explicit discussion):
  Four Channels / The Committee
  Player / Persona / Architect framework
  Physics of Being
  Virtue Topology
  N=1 Experiment
  Coal / Steam / Traction model
  
BORDERLINE (confirmed titles, proceed with care):
  "Voix Vive" brand name
  "Bard Level" terminology
  Monomyth stage names as applied to the curriculum
```

### Revenue Agreement
100% of all revenue belongs to Bertrand Laurence Guitar Studio. Joshua Atkinson developed the platform as a gift. No revenue split exists.

### License Status

The platform license is **to be determined by Bertrand Laurence**. Until a specific license is chosen, the platform is All Rights Reserved.

**Dependency compatibility** (relevant when/if Bertrand chooses an open-source license):

| Dependency | License | Integration |
|---|---|---|
| JS-Hero, fretboard-js, Glicol, pitchlite | MIT | ✅ Compatible with any license |
| FretPath | Apache 2.0 | ✅ Compatible with any license |
| Polyphonic pitch detectors (GPLv3) | GPLv3 | ⚠️ Isolate as separate microservice if proprietary |
| Any GPLv2 library | GPLv2 | ❌ Incompatible — reject entirely |

---

*Next: Batch 05 — Master Assembly*
