---
description: Voix Vive Living Roadmap — what to build, in what order, with clear gates
---

# Voix Vive — Living Roadmap
> **This file is the single source of truth for what comes next.**
> Updated: 2026-05-27
>
> **Rule:** No feature proceeds to the next phase until all items in the current phase are checked.

---

## PHASE 0: STABILIZATION (Current — May 27)

**Goal:** The app builds, routes work, navigation is consistent, docs reflect reality.

### Code
- [x] Fix all lint errors (LandingScreen, GuitarWorkbench, PlayerPortal)
- [x] Build passes with zero errors
- [x] Route `/game` → VertiscaleEngine
- [x] Route `/adventure` → AdventurePlayer
- [x] Add back button + Voix Vive home to StudioPage
- [ ] Add back button + Voix Vive home to GuitarWorkbench
- [ ] Add back button + Voix Vive home to OrientationHub
- [ ] Add back button + Voix Vive home to PlaybookShell
- [ ] Add back button + Voix Vive home to VertiscaleEngine
- [ ] Add back button + Voix Vive home to AdventurePlayer
- [ ] Browser test `/game` — does VertiscaleEngine render?
- [ ] Browser test `/adventure` — does AdventurePlayer render?
- [ ] Browser test `/player` — does pricing show?
- [ ] Browser test `/guitar` — do all 12 tools open?

### Docs
- [x] Rewrite `02_ARCHITECTURE.md` with DAG, routing, component map
- [x] Document navigation standard (back + wordmark)
- [x] Document PlayerPortal "digital mirror" vision
- [ ] Update `04_ROADMAP.md` to reflect actual progress
- [ ] Archive stale docs (`09_master_architecture_doc.md`)

### Gate to Phase 1
> **Build passes + all routes render in browser + navigation consistent on every page**

---

## PHASE 1: PERSISTENCE (Next — Supabase + Google Auth)

**Goal:** Students can log in. Progress survives across devices. Bertrand can see aggregate data.

### Prerequisites (YOU must do these — I cannot)
1. Create Supabase project at `supabase.com` (free tier)
2. In Supabase dashboard: enable Google OAuth provider
3. In Google Cloud Console: create OAuth 2.0 credentials
   - Redirect URI: `https://voix-vive.com/auth/v1/callback`
   - Also add `http://localhost:5173/auth/v1/callback` for dev
4. Give me: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### I can do everything below once I have the keys
- [ ] Add `@supabase/supabase-js` dependency
- [ ] Create `supabaseClient.js` + `useAuth.js` hook
- [ ] Add login/logout UI to LandingScreen
- [ ] Write SQL schema to Supabase (profiles, traction, journal, submissions, vertiscale_sessions, songs)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Add `migrateLocalToCloud()` — preserves existing student data on first login
- [ ] Update `ScaffoldingProvider` to read from Supabase when logged in, fall back to localStorage when not
- [ ] Update `tractionStore.js` to sync to cloud

### Gate to Phase 2
> **Student can sign in with Google. Progress persists. Local data migrates cleanly.**

---

## PHASE 2: MENTOR CONNECT (Bertrand's Dashboard)

**Goal:** Bertrand sees student submissions, engagement, and can write feedback.

### Prerequisites (YOU must do these)
1. Confirm with Bertrand: does he want a separate `/mentor` route, or should mentor features live in `/studio`?
2. Confirm: should mentors be able to see aggregate data (all students) or only their own?

### I can build
- [ ] Create `/mentor` route (or integrate into `/studio`)
- [ ] MentorDashboard: submissions queue, review status, student list
- [ ] Add `feedback` field to submissions table
- [ ] Notification system: student sees "Reviewed" badge when feedback is ready
- [ ] Email/push notifications (future — skip for now)

### Gate to Phase 3
> **Bertrand can log in, see student submissions, and write feedback. Student sees feedback.**

---

## PHASE 3: VOICE + AI (Troubadour Enhancement)

**Goal:** The AI speaks. The student can speak back. The experience is voice-first.

### Prerequisites (YOU must do these)
1. Install LM Studio on Bertrand's desktop (or your own for dev)
2. Download a model (e.g., Gemma 3 4B Instruct, or Phi-4)
3. Confirm: is the server always at `localhost:1234`, or should this be configurable?

### I can build
- [ ] Add TTS to Troubadour widget — AI responses auto-speak
- [ ] Add speech-to-text mic button in chat input
- [ ] Add "Troubadour Offline" mode — static prompt library when LM Studio is down
- [ ] AI can pull Song pages into chat (context injection)
- [ ] AI can control ambient music / metronome via voice commands
- [ ] AI prompt engineering based on DAG: "What did you notice about your breath?"

### Gate to Phase 4
> **Student can speak to Troubadour. Troubadour speaks back. Works offline with static prompts.**

---

## PHASE 4: THE DIGITAL MIRROR (Player Portal)

**Goal:** The Player Portal becomes a practice mirror — video journaling, posture, timing.

### Prerequisites (YOU must do these)
1. Confirm: do you want video recording in-browser (WebRTC `getUserMedia`), or upload from phone?
2. Confirm: what does "reinforcement learning for posture" mean to you? (ML model? Simple heuristics?)
3. Do you have the CAGED TCG report ready to share?

### I can build
- [ ] Low-def video recording UI in PlayerPortal
- [ ] Self-review mode: student watches their own recording with playback controls
- [ ] Metronome overlay on video (visual beat reference)
- [ ] Background music sync — Troubadour plays ambient tracks during practice
- [ ] Reflection prompts after every session
- [ ] Timeline view: submissions + journal entries + practice sessions in one feed
- [ ] Remove pricing cards from PlayerPortal (StudioPage is the single source of truth)

### Gate to Phase 5
> **Student can record practice, review it, get reflection prompts. No pricing in PlayerPortal.**

---

## PHASE 5: CAGED TCG SHOP

**Goal:** A shop for the CAGED-based trading card game. Audio-based. Integrated with the workbook.

### Prerequisites (YOU must do these)
1. Share the CAGED TCG report
2. Define: is this a separate product, or integrated into the workbook/game?
3. Define pricing model for TCG packs/cards

### I can build
- [ ] Shop page (`/shop`)
- [ ] Card catalog (CAGED system representation)
- [ ] Stripe checkout integration
- [ ] Inventory system (local or cloud)

### Gate to Phase 6
> **Shop is live. Cards are browseable. Checkout works.**

---

## PHASE 6: VERCEL + PWA

**Goal:** The site is live at `voix-vive.com`. It installs as a PWA. It works offline.

### Prerequisites (YOU must do these)
1. Connect GitHub repo to Vercel dashboard (`vercel.com/dashboard` → Import → `Joshua42atkinson/Music`)
2. Set `voix-vive.com` as custom domain
3. Add environment variables to Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### I can build
- [ ] Add `manifest.json` for PWA
- [ ] Add service worker for offline caching
- [ ] Configure `vercel.json` or `netlify.toml` for SPA routing
- [ ] Test all routes on deployed site

### Gate to Phase 7
> **Site live at voix-vive.com. PWA installable. All routes work.**

---

## PHASE 7: ANDROID (Future — Only when revenue gates met)

**Goal:** Native Android app with hardware integration.

### Prerequisites (YOU must do these)
1. Open Android Studio (only when I say so)
2. Confirm: Tauri mobile vs React Native vs Capacitor?

### I can build
- [ ] Tauri mobile build (since we already use Vite + Rust toolchain)
- [ ] Local database sync (SQLite on device, syncs to Supabase)
- [ ] Hardware integration: mic input, haptic feedback, offline mode

---

## DECISION LOG

| Date | Decision | Why |
|------|----------|-----|
| 2026-05-27 | Webapp first, Android later | Webapp can do 90% of what's needed. Android is a Phase 7 moonshot. |
| 2026-05-27 | Supabase free tier | $0 cost. Scales to 50K MAU. Google Auth included. |
| 2026-05-27 | LM Studio local | Free, private, no API keys. Bertrand owns the AI. |
| 2026-05-27 | No paid ear training game yet | User's separate project. Not in Voix Vive scope until revenue gates met. |
| 2026-05-27 | CAGED TCG deferred to Phase 5 | Needs report first. Not blocking core platform. |

---

## WHAT I NEED FROM YOU

**Right now (to proceed):**
1. **Nothing.** I can finish Phase 0 (navigation standardization + browser tests) autonomously.

**For Phase 1 (Supabase):**
1. Supabase project URL and anon key
2. Google OAuth client ID and secret (or give me dashboard access)

**For Phase 2 (Mentor):**
1. Bertrand's preference: separate `/mentor` route or integrated into `/studio`?

**For Phase 3 (Voice AI):**
1. Confirm LM Studio is installed and model loaded
2. Confirm server address (default `localhost:1234`)

**For Phase 4 (Digital Mirror):**
1. CAGED TCG report (when ready)
2. Clarification on posture analysis (ML vs heuristics)

**For Phase 6 (Vercel):**
1. You connect the repo in Vercel dashboard (I can't do this from IDE)

---

## AGENTIC WORK MODE

I can work autonomously on:
- All code changes within the repo
- Build, lint, test
- Git commits and pushes
- Doc updates
- Architecture decisions within the 12-fret map

I **cannot** do autonomously:
- Create external accounts (Supabase, Vercel, Google Cloud, Stripe)
- Access external dashboards (Vercel, Supabase)
- Make financial/purchasing decisions
- Communicate with Bertrand (you are the bridge)

**When you say "do the work," I will:**
1. Read the current state
2. Pick the highest-priority unchecked item from the current phase
3. Implement it
4. Build and verify
5. Update docs
6. Commit and push
7. Report what I did

**When you say "what's next," I will:**
1. Show the current phase
2. Show what's checked and unchecked
3. Show what I need from you (if anything)

---

*This roadmap lives in `.windsurf/workflows/roadmap.md`. Update it every session.*
