# 🗺️ VOIX VIVE — Development Roadmap

> **Last Updated:** 2026-05-17  
> **Timeline:** 8 weeks from today (target completion: July 12, 2026)  
> **Goal:** Sustainable income for Bertrand Laurence via free-textbook marketing funnel + paid coaching/VR product

---

## The Strategy

```
FREE LAYER (Marketing Funnel)
┌─────────────────────────────────────────────────┐
│  12-Chapter Living Textbook (web app)           │
│  → Builds culture, trust, and student pipeline  │
│  → SEO brings organic traffic                   │
│  → Students fall in love with Bertrand's method │
└─────────────────────┬───────────────────────────┘
                      │ converts to
                      ▼
PAID LAYER (Revenue)
┌─────────────────────────────────────────────────┐
│  Live Zoom Lessons        $60/hr                │
│  Async Video Coaching     $35/review            │
│  Inner Circle Membership  $25/mo                │
│  Group Workshops          $35/person            │
│  Gift Certificates        $60-275               │
│  Tips (Ko-fi/Venmo)       any amount            │
└─────────────────────┬───────────────────────────┘
                      │ evolves into
                      ▼
PREMIUM LAYER (Future)
┌─────────────────────────────────────────────────┐
│  VR Guitar Classroom (Bevy ECS + OpenXR)        │
│  AI Bertrand Coach (fine-tuned Gemma 4)         │
│  Android App (immersive somatic experience)     │
│  → THIS is the "Masterclass" product            │
└─────────────────────────────────────────────────┘
```

---

## Phase 0: Foundation ✅ (Complete)

**What:** The Living Textbook + Business Platform  
**Status:** Done — built in a single day

| Feature | Status |
|---------|--------|
| 12-chapter curriculum (Hero's Journey × Chromatic Scale) | ✅ |
| Swipeable slide viewer with AI artwork (ch1-8) | ✅ |
| StudioPage business landing (6 services, 13 testimonials, FAQ) | ✅ |
| PracticeRecorder (video/audio → IndexedDB) | ✅ |
| AmbientPlayer (Bertrand's "Houlton Skies") | ✅ |
| Welcome onboarding flow | ✅ |
| Digital Binder (practice log + submissions) | ✅ |
| FretboardExplorer (14-fret + scales + Web Audio) | ✅ |
| SEO (JSON-LD, Open Graph, Twitter Cards) | ✅ |
| Bottom nav (Chapters, Fretboard, Binder, Studio) | ✅ |

---

## Phase 1: Go Live 🔥 (Week 1 — May 18-24)

**Goal:** Process Bertrand's first paid booking through the platform.

| Task | Owner | Priority |
|------|-------|----------|
| Bertrand creates Stripe account + Payment Links | Bertrand | P0 |
| Plug Stripe URLs into `pricingData.js` | Joshua | P0 |
| Generate ch9-12 artwork (35 images) | Joshua/AI | P1 |
| Get Venmo QR screenshot from Bertrand | Bertrand | P1 |
| Set up production domain (voixvive.com?) | Joshua | P1 |
| Deploy to Vercel production | Joshua | P1 |
| Delete dead code (TheMentor.jsx, MentorshipHub.jsx) | Joshua | P2 |
| Remove `react-youtube` from package.json | Joshua | P2 |
| Thursday review call with Bertrand | Both | P0 |

**Exit Criteria:** A student can tap "Book Trial Lesson" and complete payment.

---

## Phase 1.5: Guitar Tools Suite 🛠️ (Week 1-2 — concurrent) ✅ (Complete)

**Goal:** Wire all orphaned interactive components into the Binder's new "Tools" tab. Students get a free, powerful practice toolkit that keeps them in the app.

### Already Built (orphaned — need to wire into Binder)

| Component | Lines | What It Does | Status |
|-----------|-------|--------------|--------|
| `FretboardExplorer.jsx` | 423 | 14-fret interactive neck, CAGED overlays, 6 scale patterns, Web Audio | ✅ In Fretboard tab |
| `PlingTrainer.jsx` | 248 | Real-time pitch detection via mic — sing a note, see if you're in tune | ✅ Wired in Binder |
| `PitchRoom.jsx` | ~200 | Interval ear training game — hear two notes, identify the interval | ✅ Wired in Binder |
| `BreathingGate.jsx` | ~150 | Somatic breathing exercise + body scan (Bertrand's pre-practice ritual) | ✅ Wired in Binder |
| `FretboardSheet.jsx` | 299 | Bottom-sheet fretboard overlay for in-slide practice | ✅ Wired in Slides |
| `PlayerHandbook.jsx` | 209 | 5 Tomes reference content (old dashboard) | ❌ Orphaned |

### New Tools to Build

| Tool | Description | Difficulty |
|------|-------------|------------|
| **Metronome** | Tap tempo, adjustable BPM, accent patterns, visual pulse | ✅ Complete |
| **Chord Library** | Visual chord diagrams (open + barre), searchable, with audio | Medium |
| **Practice Timer** | Pomodoro-style with "Practice TOO SLOW" reminders | ✅ Complete |
| **CAGED Shape Toggle** | Add UI buttons to FretboardExplorer to show/hide CAGED overlays | Easy |
| **Tuner** | Mic-based guitar tuner (extend PlingTrainer) | Medium |
| **Chord Progression Player** | Common progressions (I-IV-V, I-V-vi-IV) with audio + fretboard | Medium |

### Implementation Plan

| Task | Priority |
|------|----------|
| ✅ Add "Tools" tab to DigitalBinder (alongside Assignments/Submissions) | P0 |
| ✅ Wire PlingTrainer into Tools tab | P1 |
| ✅ Wire PitchRoom into Tools tab | P1 |
| ✅ Wire BreathingGate into Tools tab | P1 |
| ✅ Build Metronome component | P1 |
| [ ] Add CAGED shape toggle buttons to FretboardExplorer | P1 |
| [ ] Build Chord Library with Bertrand's most-used chords | P2 |
| ✅ Build Practice Timer with TOO SLOW philosophy | P2 |
| ✅ Wire FretboardSheet into SlideViewer exercise slides | P2 |

**Exit Criteria:** Binder has a "Tools" tab with 5+ interactive practice tools. (✅ Achieved: 8 Tools Active)

## Phase 2: Async Coaching Pipeline 📹 (Week 2 — May 25-31)

**Goal:** Students can record, submit, and receive video feedback.

| Task | Owner | Priority |
|------|-------|----------|
| PracticeRecorder → real upload (Cloudflare R2 Workers) | Joshua | P0 |
| Bertrand feedback recording interface | Joshua | P1 |
| Email/SMS notification when submission received | Joshua | P1 |
| Submission review dashboard (Bertrand-side) | Joshua | P1 |
| In-slide "Record This" CTAs on exercise slides | Joshua | P2 |
| Student receives feedback notification | Joshua | P2 |

**Exit Criteria:** Bertrand receives a practice video, records 3-min feedback, student gets notified.

---

## Phase 3: Community + Workshop System 👥 (Week 3-4 — June 1-14)

**Goal:** Inner Circle membership + scheduled group workshops.

| Task | Owner | Priority |
|------|-------|----------|
| Stripe recurring billing for membership ($25/mo, $199/yr) | Joshua | P0 |
| Member-only perks (priority queue, downloadable materials) | Joshua | P1 |
| Workshop calendar with pre-payment booking | Joshua | P1 |
| Zoom deep-link integration for workshops | Joshua | P1 |
| Community forum (lightweight — could be Discord embed) | Joshua | P2 |
| Email list / newsletter integration (Buttondown or Resend) | Joshua | P2 |

**Exit Criteria:** 10+ Inner Circle members, 1 workshop executed.

---

## Phase 4: Android App Shell 📱 (Week 5-6 — June 15-28)

**Goal:** Native Android app wrapping the web platform + AI coaching.

| Task | Owner | Priority |
|------|-------|----------|
| Android Studio project with WebView shell | Joshua | P0 |
| Fine-tune Gemma 4 on Bertrand's teaching data (transcripts, protocols) | Joshua | P0 |
| AI chat interface: "Ask Bertrand" | Joshua | P0 |
| Offline mode (PWA caching for textbook) | Joshua | P1 |
| Push notifications for feedback/workshop reminders | Joshua | P1 |
| Google Play Store listing | Joshua | P2 |

**Exit Criteria:** Playable Android app with AI Bertrand that gives guitar coaching advice.

---

## Phase 5: VR Guitar Classroom 🥽 (Week 7-8 — June 29 - July 12)

**Goal:** Immersive VR experience — the premium "Masterclass" product.

| Task | Owner | Priority |
|------|-------|----------|
| Bevy ECS + Rust/WASM architecture for 3D classroom | Joshua | P0 |
| Bertrand AI avatar with gesture animation | Joshua | P0 |
| OpenXR integration (Meta Quest / PCVR) | Joshua | P1 |
| Mixed reality fretboard overlay | Joshua | P1 |
| Real-time pitch detection (Web Audio → visual feedback) | Joshua | P1 |
| Multi-student VR lobby (up to 8 students) | Joshua | P2 |
| Haptic breathing guide (controller vibration) | Joshua | P2 |

**Exit Criteria:** 1 student completes a 15-minute VR guitar lesson with AI Bertrand.

---

## Revenue Projections

### Conservative (Month 1, with active marketing)
| Stream | Volume | Monthly |
|--------|--------|---------|
| Live Lessons (Zoom) | 5 weekly students × $60 | $1,200 |
| Async Reviews | 10/month × $35 | $350 |
| Inner Circle Members | 10 × $25 | $250 |
| Workshops | 2/month × 10 students × $35 | $700 |
| **Total** | | **$2,500/mo** |

### Growth (Month 3, with app + SEO traffic)
| Stream | Volume | Monthly |
|--------|--------|---------|
| Live Lessons | 10 weekly students × $60 | $2,400 |
| Async Reviews | 30/month × $30 avg | $900 |
| Inner Circle Members | 40 × $25 | $1,000 |
| Workshops | 4/month × 12 students × $35 | $1,680 |
| VR Masterclass | 5 purchases × $97 | $485 |
| **Total** | | **$6,465/mo** |

### France Trip Math
At $2,500/mo, Bertrand saves $1,000/mo → France trip funded in **3 months**.  
At $6,465/mo, Bertrand saves $3,000/mo → France trip funded in **6 weeks**.

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-17 | Living Textbook is 100% free | Culture-building funnel > one-time sales |
| 2026-05-17 | Removed paid "Masterclass Course" from pricing | The "Masterclass" becomes the VR/AI product |
| 2026-05-17 | HTML5 Audio over YouTube embed | More reliable, works offline, smaller bundle |
| 2026-05-17 | Stripe Payment Links over Stripe API | Zero backend, Bertrand can manage himself |
| 2026-05-17 | Dexie/IndexedDB for submission outbox | Local-first, survives refresh, syncs when online |
| 2026-05-17 | Fine-tune Gemma 4 for AI Bertrand | On-device inference, no API costs, owns the model |
