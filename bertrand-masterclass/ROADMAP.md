# 🗺️ VOIX VIVE — Development Roadmap

> **Last Updated:** 2026-05-19 (Revised per Market Assessment — revenue-first sequencing)  
> **Timeline:** 8 weeks core platform (target: July 12, 2026), moonshots funded by revenue  
> **Milestone:** Thursday Review with Bertrand (Client Stakeholder, May 22)  
> **Status:** Rough Draft Mode — not going live until approved. Building functional prototypes so the client can "add flavor" rather than building from scratch.  
> **Goal:** Sustainable income for Bertrand Laurence via free-textbook marketing funnel + paid coaching + AI evaluation + premium curriculum

---

## The Strategy

```
FREE LAYER (Marketing Funnel)
┌─────────────────────────────────────────────────┐
│  12-Chapter Living Textbook (web app)           │
│  → Builds culture, trust, and student pipeline  │
│  → SEO brings organic traffic                   │
│  → Students fall in love with Bertrand's method │
│  → Bilingual: English + French (i18n)           │
└─────────────────────┬───────────────────────────┘
                      │ converts to
                      ▼
PAID LAYER (Revenue — the priority)
┌─────────────────────────────────────────────────┐
│  Live Zoom Lessons        $60/hr                │
│  Async Video Coaching     $35/review            │
│  Troubadour AI Eval       $5-$35/eval (NEW)     │
│  Voice Octave (Frets 13-24) $49 unlock (NEW)    │
│  Inner Circle Membership  $25/mo                │
│  Group Workshops          $35/person            │
│  Gift Certificates        $60-275               │
│  Tips (Ko-fi/Venmo)       any amount            │
└─────────────────────┬───────────────────────────┘
                      │ revenue funds
                      ▼
MOONSHOT LAYER (Built after income is proven)
┌─────────────────────────────────────────────────┐
│  Android App / PWA (mobile-first experience)    │
│  AI Bertrand Coach (fine-tuned Gemma 4)         │
│  VR Guitar Classroom (Bevy ECS + OpenXR)        │
│  Roblox Music World (social learning)           │
│  → Funded by Paid Layer revenue, not built on   │
│    speculation                                  │
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

## Phase 1: Stakeholder Review (Week 1 — May 18-24)

**Goal:** Present a fully functional, "rough draft" prototype of the entire Masterclass platform to Bertrand on Thursday for his approval and "flavor" additions. We will NOT go live until he approves.

| Task | Owner | Priority |
|------|-------|----------|
| Refine Vertiscale Engine & Adventure Game | AI | P0 |
| Configure `voix-vive.com` domain in Vercel | Joshua | P1 |
| Collect Stripe Payment Links | Bertrand | P1 |
| Get Venmo QR screenshot from Bertrand | Bertrand | P1 |
| Thursday review call with Bertrand | Both | P0 |

**Exit Criteria:** Bertrand reviews the working platform on Thursday, approves the direction, and provides his custom pedagogical flavor.

---

## Phase 1.5: Guitar Tools Suite 🛠️ ✅ (Complete — May 18 2026)

**Goal:** Wire all orphaned interactive components into the Binder's new "Tools" tab. Students get a free, powerful practice toolkit that keeps them in the app.

### Already Built (orphaned — need to wire into Binder)

| Component | Lines | What It Does | Status |
|-----------|-------|--------------|--------|
| `FretboardExplorer.jsx` | 423 | 14-fret interactive neck, CAGED overlays, 6 scale patterns, Web Audio | ✅ In Fretboard tab |
| `PlingTrainer.jsx` | 248 | Real-time pitch detection via mic — sing a note, see if you're in tune | ✅ Wired in Binder |
| `PitchRoom.jsx` | ~200 | Interval ear training game — hear two notes, identify the interval | ✅ Wired in Binder |
| `BreathingGate.jsx` | ~150 | Somatic breathing exercise + body scan (Bertrand's pre-practice ritual) | ✅ Wired in Binder |
| `FretboardSheet.jsx` | 299 | Bottom-sheet fretboard overlay for in-slide practice | ✅ Wired in Slides |
| `PlayerHandbook.jsx` | 209 | 5 Tomes reference content (old dashboard) | 🗑️ Removed (dead code) |

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

**Exit Criteria:** Binder has a "Tools" tab with 5+ interactive practice tools. (✅ Achieved: 8 Tools Active, 4 Planned)

---

## Phase 1.6: Complete The 12 Tools 🛠️ ✅ (Complete — May 19 2026)

**Goal:** Bring all 12 frets to life so the tools grid is fully interactive.

| Fret | Tool | Protocol | Status |
|------|------|----------|--------|
| **5** | **Interval Visualizer** | ©SHEARL | ✅ Complete — tap-two-notes fretboard, interval name + semitone count |
| **8** | **Microtonal Tracker** | ©FHEAL | ✅ Complete — real-time cents needle (−50¢ to +50¢) via mic |
| **9** | **Vertiscale Engine** | ©SHEARL+©FHEAL | ✅ **Complete** — The Imagination Engine: Flash + Imagine modes, OrbEngine wired, Journal + coaching cues |
| **11** | **Multi-Key Hub** | ©FHEAL | ✅ Complete — all-12-keys scale overlay extending FretboardExplorer |

**Exit Criteria:** All 12 fret cards are interactive with real UIs. ✅ Achieved.

## Phase 2: Stripe + Async Coaching Pipeline 💰 (Week 2 — May 25-31)

**Goal:** Earn the first dollar. Connect Stripe. Let students submit videos and receive feedback.

| Task | Owner | Priority |
|------|-------|----------|
| Bertrand creates Stripe account + generates payment links | Bertrand | **P0** |
| Wire Stripe links into `pricingData.js` | Joshua | **P0** |
| DNS: voix-vive.com → Vercel | Joshua | **P0** |
| PracticeRecorder → real upload (Cloudflare R2 Workers) | Joshua | P0 |
| Bertrand feedback recording interface | Joshua | P1 |
| Email notification on submission (Resend) | Joshua | P1 |
| Submission review dashboard (Bertrand-side) | Joshua | P1 |
| In-slide "Record This" CTAs on exercise slides | Joshua | P2 |

**Revenue unlocked:** $5 Quick Questions + $15 Mini Critiques + $35 Full Reviews + $65 Live Lessons  
**Exit Criteria:** One student pays. One async review is delivered.

---

## Phase 3: French Internationalization 🇫🇷 (Week 3 — June 1-7)

**Goal:** Double the addressable market. Bertrand already speaks French.

| Task | Owner | Priority |
|------|-------|----------|
| Install `react-i18next` + provider | Joshua | P0 |
| Extract all strings to `locales/en.json` | Joshua | P0 |
| Create `locales/fr.json` (UI chrome + pricing) | Joshua | P1 |
| Translate `chapterData.js` (12 chapters) | Joshua + Bertrand | P1 |
| Language toggle (🇺🇸 / 🇫🇷) in header | Joshua | P1 |
| Bertrand reviews French translations | Bertrand | P1 |

**Decision Required:** Do branded terms (©PLING!, ©SHEARL, ©FHEAL) stay in English or get French equivalents? Bertrand must decide.

**Revenue unlocked:** Francophone market (Quebec, Louisiana, France, Belgium, West Africa — 180M+ speakers)  
**Exit Criteria:** A French-speaking student can navigate the entire platform in French.

---

## Phase 4: Troubadour AI Evaluation 🤖 (Week 4-5 — June 8-21)

**Goal:** AI-powered singing/playing evaluation. First automated revenue stream.

Builds on existing components: PlingTrainer (pitch), MicrotonalTracker (cents), RhythmEngine (timing), PracticeRecorder (capture), audioEngine (infrastructure).

| Task | Owner | Priority |
|------|-------|----------|
| `ToneAnalyzer.js` — MFCC vocal tone classification | Joshua | P0 |
| `BreathDetector.js` — amplitude envelope analysis | Joshua | P1 |
| `PhraseSegmenter.js` — phrase boundary detection | Joshua | P1 |
| `TroubadourScorecard.jsx` — radar chart UI | Joshua | P0 |
| Bronze tier ($5/eval) — Pitch + Rhythm scorecard | Joshua | P0 |
| Silver tier ($15/eval) — Full scorecard + AI coaching notes | Joshua | P1 |
| Gold tier ($35/eval) — AI prep + Bertrand video reaction | Joshua | P1 |

**Anti-Dopamine Design:** No speed scores, no leaderboards, no combo streaks. Feedback uses Bertrand's philosophy: "Your pitch was centered and warm" instead of "87/100".

**Revenue unlocked:** $5–$35 per AI evaluation. Zero marginal cost for Bronze/Silver.  
**Exit Criteria:** A student records 60 seconds, receives a Troubadour Scorecard with pitch/rhythm/tone/breath ratings.

---

## Phase 5: Voice Octave — Frets 13-24 🎤 (Week 6-7 — June 22 - July 5)

**Goal:** Premium curriculum that completes the "Voix Vive" brand promise. Guitar octave = free funnel. Voice octave = paid product.

| Task | Owner | Priority |
|------|-------|----------|
| Write Frets 13-24 content with Bertrand | Both | P0 |
| Generate Voice Octave slide artwork (AI) | Joshua | P1 |
| Wire `chapterData.js` expansion (add 12 frets) | Joshua | P0 |
| Implement paywall gate at Fret 13 | Joshua | P0 |
| Stripe checkout for Voice Octave access | Joshua | P0 |
| French translations for Frets 13-24 | Joshua + Bertrand | P1 |

**Pricing options:** $49 one-time, $9/mo sub, or free with Inner Circle annual ($199/yr)  
**Revenue unlocked:** First premium content product  
**Exit Criteria:** Fret 13 displays behind a paywall. One student purchases access.

---

## Phase 6: Community + Workshop System 👥 (Week 8 — July 6-12)

**Goal:** Inner Circle membership + scheduled group workshops. Now enhanced by French i18n and Troubadour AI.

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

## Phase 7+: Moonshots 🚀 (After Income Is Proven)

These are real goals — but they're gated behind revenue. Build them when the web app is earning.

### Android App / PWA (Month 3 — August)
| Task | Effort |
|------|--------|
| PWA conversion (offline, installable, push notifications) | 8-12 hrs |
| OR: Android WebView shell + Play Store listing | 6-8 hrs |
| Gemma 4 fine-tune on Bertrand's teaching data | 10-15 hrs |
| "Ask Bertrand" AI chat interface | 6-8 hrs |

**Gate:** Revenue ≥ $2,500/mo for 2 consecutive months.

### VR Guitar Classroom (Month 4+ — September)
| Task | Effort |
|------|--------|
| Bevy ECS + Rust/WASM architecture for 3D classroom | 20-30 hrs |
| Bertrand AI avatar with gesture animation | 15-20 hrs |
| OpenXR integration (Meta Quest / PCVR) | 15-20 hrs |
| Multi-student VR lobby (up to 8 students) | 10-15 hrs |

**Gate:** Revenue ≥ $5,000/mo. At least 50 active students.

### Roblox Music World (Month 5+ — October)
| Task | Effort |
|------|--------|
| Roblox Studio project — social music learning environment | 15-20 hrs |
| Guitar practice mini-games adapted from Vertiscale Engine | 10-15 hrs |
| Social features: jam rooms, student concerts, challenges | 10-15 hrs |
| Roblox marketplace listing | 5-8 hrs |

**Gate:** Revenue ≥ $5,000/mo. Young student demographic proven.

> The moonshots are not cut — they're sequenced after the web app starts earning. Every dollar from Phases 2-6 funds these.

---

## Revenue Projections (Updated per Market Assessment)

### Phase 2 Launch (Month 1-2, with active marketing)
| Stream | Volume | Monthly |
|--------|--------|---------|
| Live Lessons (Zoom) | 8 weekly × $60 avg | $1,920 |
| Quick Questions ($5) | 20/month | $100 |
| Mini Critiques ($15) | 10/month | $150 |
| Full Video Reviews ($35) | 5/month | $175 |
| Inner Circle Members | 10 × $25 | $250 |
| **Total** | | **$2,595/mo** |

### Phase 4 Mature (Month 3-6, with AI + French + Voice Octave)
| Stream | Volume | Monthly |
|--------|--------|---------|
| Live Lessons (Zoom) | 12 weekly × $60 avg | $2,880 |
| Async Coaching (all tiers) | 35/month | $625 |
| Troubadour AI (Bronze/Silver) | 40/month × $10 avg | $400 |
| Voice Octave Purchases | 5/month × $49 | $245 |
| Inner Circle Members | 30 × $25 | $750 |
| Workshops | 2/month × 10 × $35 | $700 |
| **Total** | | **$5,600/mo** |

### Phase 6 Compounding (Month 6-12)
| Stream | Volume | Monthly |
|--------|--------|---------|
| Live Lessons | 15 weekly × $60 avg | $3,600 |
| Async Coaching | 50/month avg | $1,000 |
| Troubadour AI | 60/month × $10 avg | $600 |
| Voice Octave + Voice bundles | 10/month | $490 |
| Inner Circle Members | 50 × $25 | $1,250 |
| Workshops | 4/month × 12 × $35 | $1,680 |
| Gift Certificates | 5/month × $65 avg | $325 |
| **Total** | | **$8,945/mo** |

### Revenue Compounding
```
Each phase builds on the previous:
  → French students can buy Troubadour evaluations
  → Troubadour AI reduces Bertrand's per-review time (20 min → 5 min)
  → Voice Octave justifies Inner Circle membership
  → Inner Circle members attend workshops
  → All revenue funds Android/VR/Roblox moonshots
```

### France Trip Math
At $2,595/mo (Phase 2), Bertrand saves $800/mo → France trip in **4 months**.  
At $5,600/mo (Phase 4), Bertrand saves $2,000/mo → France trip in **6 weeks**.  
At $8,945/mo (Phase 6), Bertrand saves $4,000+/mo → France trip in **3 weeks**.

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

---

## Domain & Deployment

### Current Deployment
- **Platform:** Vercel (free tier)
- **Local root:** `/home/joshua-atkinson/antigravity/voix-vive/`
- **Build dir:** `bertrand-masterclass/` (configured in `vercel.json`)
- **Current URL:** auto-assigned Vercel subdomain

### Domain Options (Squarespace — researched 2026-05-18)

| Domain | Price/yr | Notes |
|--------|----------|-------|
| **voix-vive.com** | **$14** | ✅ In cart — **recommended** |
| voixvive.net | $14 | "Closed match" flag on Squarespace |
| voixvive.org | $8 | Cheapest; .org implies nonprofit |
| voievive.com | $14 | Misspelling risk |
| musiquevive.com | $14 | Alternative brand angle |
| voixvive.live | $10 | Good for live sessions / streaming |
| voixvive.studio | $10 | Strong coaching/studio brand fit |
| voixvive.store | $4 | Cheapest option |

> **Recommendation:** Buy `voix-vive.com` ($14/yr). Optionally add `voixvive.studio` ($10/yr) as a redirect alias — easy to say, strong brand signal.

### DNS → Vercel Setup
1. Purchase domain on Squarespace
2. In Vercel project → **Settings → Domains** → Add `voix-vive.com`
3. Add these DNS records at Squarespace:
   - `A` record → `76.76.21.21`
   - `CNAME` record → `cname.vercel-dns.com`
4. SSL auto-provisions via Let's Encrypt (~10 min)

### Deployment Checklist
- [x] Purchase `voix-vive.com` on Squarespace
- [ ] Add domain in Vercel project settings
- [ ] Update DNS at Squarespace registrar
- [ ] Confirm SSL and www → root redirect
- [ ] Verify on mobile (iOS Safari + Android Chrome)

### Key Decisions — 2026-05-18

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-18 | voix-vive.com as primary domain | Clean, brandable, $14/yr — already in cart |
| 2026-05-18 | Metronome added to AmbientPlayer panel | Persistent click across all pages and tools |
| 2026-05-18 | Frets 5, 8, 11 built and wired | 11/12 tools live — only Fret 9 (Vertiscale game) remains |
| 2026-05-18 | DigitalBinder wrapped in max-width 640px | Matches StudioPage on desktop, no full-width stretch |
| 2026-05-18 | Workspace renamed daydream-website → voix-vive | Align local folder with project brand |
| 2026-05-18 | Root legacy files (Cargo, old README, old node_modules) deleted | Project is 100% in bertrand-masterclass/ — root was dead weight |

### Key Decisions — 2026-05-19

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-19 | Vertiscale Engine reframed as "Imagination Engine" | Grounded in Gordon's audiation theory + predictive processing neuroscience. The game trains the internal model, not the fingers. |
| 2026-05-19 | Three Inners framework: Inner Fretboard / Inner Ear / Inner Voice | Maps Boethius's Three Musics to game phases. Moves from instrumentalis → humana. |
| 2026-05-19 | Flash + Imagine dual modes for Phase 1 | "The Opposite Principle" — speed trains prediction velocity, stillness trains prediction stability |
| 2026-05-19 | Phase 3 reframed from Freeplay to Journal + Coaching | v1 implements metacognitive reflection. Freeplay deferred to v2. |
| 2026-05-19 | Fret 9 (Vertiscale Engine) complete — all 12/12 tools live | Phase 1.6 exit criteria achieved |
| 2026-05-19 | **Roadmap resequenced: revenue-first** | Market assessment revealed Android/VR were scheduled before income. Inserted French i18n, Troubadour AI, and Voice Octave as Phases 3-5. Android/VR/Roblox deferred to moonshots (funded by revenue). |
| 2026-05-19 | French i18n added as Phase 3 | Bertrand is bilingual, brand is French. 180M+ Francophone market underserved. |
| 2026-05-19 | Troubadour AI Evaluation System added as Phase 4 | Builds on 5 existing components. First automated revenue stream ($5-$35/eval, zero marginal cost for Bronze/Silver). |
| 2026-05-19 | Voice Octave (Frets 13-24) added as Phase 5 | Completes brand promise ("Voix Vive" = voice, but only guitar was covered). Premium paywall product. |
| 2026-05-19 | Roblox Music World added to moonshots | Social learning environment for younger demographic. Gated behind revenue proof. |
