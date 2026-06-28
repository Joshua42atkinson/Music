---
description: Voix Vive Living Roadmap — dual-market alignment, core loop completion, and deployment.
---

# Voix Vive — Living Roadmap
> **This file is the single source of truth for what comes next.**
> Updated: 2026-06-28
>
> **Rule:** No feature proceeds to the next phase until all items in the current phase are checked.

---

## ARCHITECTURAL CONTEXT
We have executed a major restructuring to support the **Dual-Market Strategy**. The codebase is now strictly separated between:
1. `src/features/audio-engine` & `vr-fretboard`: The mass-market, Gibson/Yousician competitor.
2. `src/features/somatic-masterclass`: The deep, opt-in TrueFire-style pedagogy.

---

## PHASE 0: SHIP & SELL (Immediate — Revenue Gate)
> **Goal:** First paying customer. See `docs/VOIX_VIVE_BUSINESS_PLAN.md` for full plan.
> **Rule:** Nothing else matters until someone can pay for the course.

### Business Setup (Joshua)
- [ ] Register LLC (~$100)
- [ ] Create Stripe account
- [ ] Replace mock Stripe URLs in `pricingData.js` with real Payment Links
- [ ] Apply for Google Cloud for Startups ($350K credits)
- [ ] Apply to Google AI Futures Fund
- [ ] Apply for SBA Boots to Business (veteran entrepreneurship training)
- [ ] Register as SDVOSB (Service-Disabled Veteran-Owned Small Business)

### Subscription & Content (Joshua + Bertrand)
- [x] Add subscription gate — all chapters free, video review submission requires active subscription (`MentorshipGate.jsx` uses `SUBSCRIPTION_TIERS`)
- [ ] Wire Stripe Subscriptions (recurring billing) — Community $5, Apprentice $100, Journeyman $500, Master $1000
- [ ] Add video review submission UI — record 5-min demo → AI pre-screens → submit to Bertrand's queue
- [x] Add AI pre-screening pipeline — Gemini analyzes video, flags issues, generates draft review with timestamps (`aiPreScreening.js`, `usePreScreening.js`, `PreScreeningResults.jsx`)
- [x] Add subscription state to auth context (free / community / apprentice / journeyman / master) (`useAuth.js` persists to localStorage)
- [ ] Add live session scheduling UI (Journeyman+ — Zoom integration)
- [ ] Add upgrade prompts at emotional peaks (chapter completion, AI technique flags, community engagement)
- [ ] Bertrand records 3 chapter intro videos (5-10 min each, EN + FR) — Chapters 1, 2, 3
- [ ] Load videos into existing SlideViewer/PlayerPortal
- [ ] Deploy to Netlify with custom domain
- [ ] Bertrand tells his in-person students about the online mentorship

### Hands-Free Navigation (Joshua)
- [x] Build `useVoiceNav` hook — Web Speech API STT (commands) + TTS (reading content)
- [x] Build `VoiceCommandBar` component — floating mic button + visual feedback
- [x] Refactor C-Scale screen — collapsible sections, minimal chrome, practice-first layout (practice mode in `CScaleHub.jsx`)
- [x] Voice commands: next, previous, play, stop, record, ask, menu, back, practice (EN + FR triggers)
- [x] TTS reads chapter titles, instructions, AI responses aloud (via `speak()` in `useVoiceNav.js`)
- [x] **AI-driven hands-free** — unhandled transcripts piped to Truebadour AI with context (chapter, pitch state, practice mode). AI interprets intent freely and can emit `[TOOL:XXX]` tags to drive the UI (`useHandsFreeCoach.js` → `CScaleHub.jsx`)
- [x] **Student Google OAuth → Gemini** — logged-in students use their own Google AI quota for the Truebadour AI (zero API cost for platform). `geminiOAuth.js` + `useTruebadourAI.js` backend detection
- [x] Auto-speak chapter intro on navigation when hands-free is active
- [x] 16 voice commands with EN/FR triggers (next, previous, read, repeat, play, stop, practice, close, ask, help, where, menu, home, slower, faster, resonance, complete)

### Bilingual & Marketing (Joshua)
- [x] i18n the StudioPage — add useLocale, translate all hardcoded English strings (40+ keys in en.json/fr.json)
- [x] Build PricingSection component — render SUBSCRIPTION_TIERS on StudioPage
- [x] Fix MentorshipGate — use SUBSCRIPTION_TIERS instead of hardcoded old $1/$5 tiers
- [x] Add SEO + OG meta tags for social sharing (JSON-LD updated to 5-tier model, OG locale alternates)
- [x] Add email capture form for launch notifications (`EmailCapture.jsx`)

### Gate to Phase 1
> **One person is paying $100/month. They submitted a video, AI pre-screened it, Bertrand added his judgment in 5 minutes. The student feels seen.**

---

## PHASE 1: DUAL-MARKET ROUTING & UX ALIGNMENT

**Goal:** Ensure the app physically functions as a dual-market platform. The Somatic Masterclass must be hidden behind an opt-in wall so casual users aren't overwhelmed with dogma.

### UI & Architecture
- [ ] Refactor `App.jsx` to introduce a clear `/masterclass` route.
- [ ] Remove forced AI / Truebadour widgets from the default Fretboard / Audio Engine screens.
- [ ] Create an onboarding splash screen that lets users select their path: "Start Playing" (AR) vs "Enter Masterclass" (Somatic).
- [ ] Clean up Navigation (NeckMenu) to reflect these two distinct domains.

### Gate to Phase 2
> **A user can open the app, tune their guitar, and play with zero philosophical prompts. A different user can explicitly opt-in to the Somatic Masterclass and access the Truebadour AI.**

---

## PHASE 2: CORE GAMEPLAY LOOP (Feature Parity)

**Goal:** Fulfill the missing Top 10 features needed to make the Audio AR experience highly competitive in the market.

### Features
- [ ] Build the "Peer-reviewed Jam Projects" module (async video/audio collaboration).
- [ ] Build "Exportable Reports" (PDF/Shareable Web Summaries of practice metrics).
- [ ] Polish the Metronome (visual syncing, advanced subdivisions).
- [ ] Finalize the Fretboard visualizer (animations, scale highlighting).

### Gate to Phase 3
> **The AR Audio experience has feature parity with industry leaders and includes our unique community and export offerings.**

---

## PHASE 3: BETA LAUNCH & QA

**Goal:** The site is live, performant, and stable for external beta testers.

### Deployment & Polish
- [x] Implement Cloudflare Pages deployment (`wrangler.toml`, `_redirects` for SPA)
- [x] Ensure PWA installability (manifest, service worker, caching)
- [ ] Lighthouse audit (target 90+ across all metrics)
- [ ] End-to-end testing of the Pitch Detection across Chrome/Safari

### Gate to Final Release
> **App is live at voix-vive.com, installs as PWA, and Pitch Detection works flawlessly in production.**

---

## PHASE 4: ANDROID / GOOGLE PLAY STORE (After Beta)

**Goal:** Native Android app on Google Play Store + AR readiness for Android XR.

### Milestones
- [ ] Build Tauri Android APK (config already exists in `src-tauri/tauri.conf.json`)
- [ ] Sign APK and create Google Play Store listing
- [ ] Google Play Billing integration (alternative to Stripe for Android)
- [ ] Local database sync (Dexie/IndexedDB works in Tauri WebView)
- [ ] Hardware integration: low-latency mic input, haptic feedback, offline mode
- [ ] Apply for XREAL developer program (Project Aura early access)
- [ ] Port spatial engine (`apps/spatial-engine/`) to Android OpenXR
- [ ] Build AR fretboard prototype on XREAL Project Aura (when available, late 2026)

---

*This roadmap lives in `docs/ppl/roadmap.md`. Update it every session.*
