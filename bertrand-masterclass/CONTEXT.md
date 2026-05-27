# 🎸 VOIX VIVE — Master Context & Business Platform

> **Purpose:** Load this file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-27 (Google Auth LIVE on voix-vive.com, DAG Funnel designed, Phase 1 active)  
> **Project Root:** `/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5173  
> **Git Remote:** https://github.com/joshua42atkinson/Music.git  
> **Deployment:** Vercel → `www.voix-vive.com` (auto-deployed on push to main)
> **AI Server:** LM Studio → localhost:1234 (Qwen Coder 32B)
> **MCP Server:** `cd mcp-server && ./start-mcp.sh` → localhost:3001

---

## 1. CAST OF CHARACTERS

### The Developer — Joshua Atkinson
- Systems Architect, Full-Stack Engineer (Rust/Bevy/WASM/Android/React)
- Purdue University MS LDT Candidate (EDCI 57300 Practicum, Dr. Jennifer Richardson)
- Creator of the *Trinity ID AI OS* and the *ADDIECRAPEYE* design framework
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
- **Contact:** bertlarrymusic@gmail.com | 617-447-5575

---

## 2. BUSINESS STRATEGY

### Revenue Model
```
The 12-chapter Living Textbook is 100% FREE.
It is the culture-building marketing funnel that creates long-term students.

Revenue comes from (REVENUE-FIRST SEQUENCING — Phase 2-6):
  1. Live coaching (Zoom/in-studio)
  2. Async video feedback (engagement ladder: $5→$15→$35)
  3. Troubadour AI Evaluation ($5-$35/eval — NEW, automated)
  4. Voice Octave premium curriculum (Frets 13-24, $49 unlock — NEW)
  5. Community membership (Inner Circle)
  6. Group workshops
  7. Gift certificates
  8. Tips / support

MOONSHOTS (Gated behind proven revenue):
  Android App / PWA — Gate: Revenue ≥ $2,500/mo
  AI Bertrand Coach (fine-tuned Gemma 4) — Gate: Revenue ≥ $2,500/mo
  VR Guitar Classroom (Bevy ECS + OpenXR) — Gate: Revenue ≥ $5,000/mo
  Roblox Music World (social learning) — Gate: Revenue ≥ $5,000/mo
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

### Ownership (Updated 2026-05-27)

| Layer | Owner | What It Is | Can License? |
|-------|-------|-----------|--------------|
| **Business / Studio** | Bertrand Laurence | `voix-vive.com` domain, student relationships, coaching revenue, lesson content | No — his personal asset |
| **Platform Code** | Joshua Atkinson | React/Vite app, Supabase schema, game engines, AI integration | Yes — framework can be licensed to other instructors |
| **Methodology** | Joshua Atkinson | ADDIECRAPEYE, PEARL, 12-Fret Monomyth mapping, Troubadour persona design | Yes — documented for academic and commercial use |
| **Curriculum Content** | Bertrand Laurence | Lesson text, exercises, philosophical framing, musical examples | No — his artistic IP |

### What Is NOT Documented (Action Required)
- ❌ **No written contract** between Joshua and Bertrand
- ❌ **No explicit license grant** for the platform code
- ❌ **No revenue-sharing agreement** for future licensing
- ❌ **No GDPR compliance statement** for EU students
- ❌ **No terms of service** governing student data use

### Recommended Next Steps (Non-Legal-Advice)
1. **Simple email agreement** between Joshua and Bertrand:
   - "I gift the website code and infrastructure to your teaching business. I retain ownership of the ADDIECRAPEYE framework and platform architecture for potential future licensing. You retain all revenue from student coaching and lessons."
2. **Add to `/privacy` page:** Where data is stored, what data is collected, student rights
3. **Add to `/terms` page:** Platform is free for learning, coaching is paid separately, no medical claims

### The Nonprofit Question (Deferred)
**Status:** Discussed but not pursued. Rationale: two-person operation, no grant funding yet, hobby-tier hosting covers costs. Revisit if:
- 3+ instructors want to use the platform
- Google for Education or arts foundation grant becomes available
- Revenue exceeds $2,500/mo and tax structure matters

### BERTRAND'S IP (use freely in the platform)
©SHEARL, ©PLING!, ©FHEAL (protocols) · The 5 Pillars of musicianship · Yin/Yang dual-coding · Vertiscale teaching method · CAGED system applications · Somatic/kinesthetic language · All curriculum content and chapter narratives · The axiom: *"You are an instrument playing an instrument"*

### JOSHUA'S GREAT GAME (do NOT import without explicit discussion)
Four Channels / The Committee · Player / Persona / Architect framework · Physics of Being · Virtue Topology · N=1 Experiment · Coal / Steam / Traction model · "Dojo" framing · "Forge warmth" language · Character Sheet as game mechanic

### BORDERLINE (confirmed OK, proceed with care)
"Voix Vive" brand name · "Bard Level" terminology · Monomyth stage names applied to curriculum

### Red Flags — Words That Do Not Belong in Voix Vive
- "Dojo" — martial/speed framing, opposite of Slow Web mandate
- "Forge" — Great Game smithing metaphor
- "Feel where it lives" — Great Game body-map language (use Bertrand's FHEAL language instead)
- "Player / Character" split — Great Game framework
- Any leaderboard, score ring, or AP economy language

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
DB (Cloud):   Supabase (Postgres + Auth + RLS) — Phase 1 active
DB (Local):   Dexie.js / IndexedDB (offline progress + submission outbox)
Media:        MediaRecorder API (practice video/audio capture)
SEO:          JSON-LD LocalBusiness, Open Graph, Twitter Cards
Source Code:  ~20,000+ LOC across 65+ source files (components, hooks, data, game, pages)
Localization:  Custom useLocale.js hook with 100+ bilingual keys (EN/FR)
```

---

## 7. THE 12-FRET UI — Governing Structure

**The 12-fret guitar neck is the single UI metaphor that governs everything in this platform.**
It is not a design choice. It is Bertrand's teaching reality: 12 chromatic tones, 12 stages of the Hero's Journey, 12 chapters of the curriculum, 12 tools in the Digital Binder. One isomorphism, held consistently across every screen.

### The Three Portals (Landing Page)

```
🎵 THE SONG     → /song   → OrientationHub  — 12-chapter Living Textbook (free, swipeable)
🎸 THE GUITAR   → /guitar → VertiscaleEngine — The Imagination Engine (the game)
🧘 THE PLAYER   → /player → MentorTools     — Breathing, recording, reflection tools
```

These names — **The Song, The Guitar, The Player** — are the platform's three rooms. They come from Boethius's three musics: *Musica Mundana* (the cosmos/song), *Musica Instrumentalis* (the guitar), *Musica Humana* (the human/player). Do not rename them. Do not add a fourth portal without a pedagogical reason grounded in Bertrand's work.

### The 12-Fret Tool Map (The Guitar → Digital Binder)

| Fret | Tone | Stage | Chapter | Protocol | Tool |
|------|------|-------|---------|----------|------|
| 1 | C | Call to Adventure | The Root Note | ©SHEARL | Breathing Gate |
| 2 | C# | Refusal of the Call | Time as a Friend | ©SHEARL | Practice Timer |
| 3 | D | Meeting the Mentor | The Ear Awakens | ©PLING! | Pitch Room |
| 4 | D# | Crossing the Threshold | Committing to the Beat | ©SHEARL | Metronome |
| 5 | E | Tests, Allies, Enemies | The Map That Lies | ©SHEARL | Interval Visualizer |
| 6 | F | Approach to the Cave | The Full Neck | ©SHEARL | Fretboard Explorer |
| 7 | F# | The Ordeal | The Devil's Note | ©PLING! | PLING! Trainer |
| 8 | G | The Reward | Precision as Gift | ©FHEAL | Microtonal Tracker |
| 9 | G# | The Road Back | Force Threshold | ©SHEARL→©PLING!→©FHEAL | **Vertiscale Engine ⭐** |
| 10 | A | The Resurrection | Being Seen | ©FHEAL | Async Assessor |
| 11 | A# | Return with the Elixir | Fluency | ©FHEAL | Multi-Key Hub |
| 12 | B | Master of Two Worlds | Freedom | ©FHEAL | Rhythm Engine |

> **The Vertiscale Engine (Fret 9)** is also accessible as a standalone game at `/guitar`. It is the synthesis tool — it spans all frets and all protocols in one playable loop.

### The Vertiscale Game — Three Phases (Fret 9)

```
PHASE 1 — THE INNER FRETBOARD (©SHEARL)
  ⚡ Flash Mode:   See pattern → darkness → recall from imagination → tap
  🫁 Imagine Mode: Hold pattern → breathe → sustain internal rendering

PHASE 2 — THE INNER EAR (©PLING!)
  🎵 Audiate:     Note orb descends → imagine the pitch → sing → mic validates → tap

PHASE 3 — THE INNER VOICE (©FHEAL)
  📝 Reflect:     Session journal + dynamic coaching cues. NO score displayed.
```

**Difficulty labels (Bertrand's language — never change to Easy/Medium/Hard):**
- Kinesthetic Awakening · Applied Practice · Flow State

**Unlock gates:**
- Phase 2 unlocks after 5 successful Phase 1 sessions (`consistencyRatio > 0.85`)
- Phase 3 unlocks after 3 successful Phase 2 sessions (or on reaching Chapter 12)

### Routing (Updated 2026-05-27)

```
/               → LandingScreen      — 3 portals + Troubadour Adventure launcher
/song           → OrientationHub     — Living Textbook (12-chapter neck menu)
/guitar         → VertiscaleEngine   — The game
/player         → MentorTools        — Breathing + recording + binder
/playbook       → PlaybookShell      — Progress tracking
/studio         → StudioPage         — Bertrand's services + pricing + testimonials
/game           → VertiscaleEngine   — Direct game access
/adventure      → AdventurePlayer    — Standalone narrative mode
/monomyth      → ChromaticMonomyth  — Reference chart (12-fret grid)
/auth/callback  → AuthCallback     — OAuth redirect handler
/ai-developer   → AIDeveloperChat   — AI modification system
```

---

## 7b. DOCUMENT READING ORDER

| Task | Read first | Path |
|------|-----------|------|
| Any game change | **Vertiscale Game Design Doc** | `research/10_design_doc_03_vertiscale_game.md` |
| Any platform/UI change | **Master Design Doc** | `research/10_MASTER_DESIGN_DOC.md` |
| Student profile / pedagogy | **Foundation Doc** | `research/10_design_doc_01_foundation.md` |
| Curriculum / chapter map | **Curriculum Doc** | `research/10_design_doc_02_curriculum.md` |
| Tech stack / revenue / IP | **Platform Doc** | `research/10_design_doc_04_platform_and_business.md` |
| Timeline / milestones | **ROADMAP.md** | `ROADMAP.md` |
| UX flows / navigation | **UX Map** | `USER_EXPERIENCE_MAP.md` |
| Current status & checklist | **Maturation Map** | `research/12_GUITAR_EMODULE_PEARL_MATURATION.md` |

**Rule:** Update the relevant design doc in the same session you change the code. Documentation is the lens that prevents scope creep.

---

## 8. WHAT'S DONE vs WHAT'S LEFT

### ✅ Complete (as of 2026-05-27)

**Phase 0 — Stabilization:**
- [x] 12-chapter Living Textbook (free, swipeable slides with artwork for ch1-12)
- [x] All routes wired: `/`, `/song`, `/guitar`, `/player`, `/playbook`, `/studio`, `/game`, `/adventure`, `/monomyth`, `/auth/callback`
- [x] Navigation standardization — Back + Home buttons on all major pages
- [x] Build passes with zero errors (`npm run build`)
- [x] LandingScreen decomposed (PinModal + ProfileModal extracted)
- [x] Troubadour Adventure wired into Landing Page (918 lines bilingual narrative, 12 scenes, 3 acts)
- [x] i18n infrastructure: useLocale.js with 100+ bilingual keys (EN/FR)
- [x] StudioPage business landing (6 services, 13 testimonials, payment grid, FAQ, French section)
- [x] All 12 Fret tools wired and interactive (12/12 ✅)
- [x] Fret 9 — Vertiscale Imagination Engine (Flash, Imagine, Audiate, Reflect)
- [x] PracticeRecorder, AmbientPlayer, Metronome, WelcomeOnboarding, SEO
- [x] Digital Binder (practice log, tools tab, submissions)
- [x] Remove distracting floating Bertrand photo from LandingScreen

**Phase 1 — Persistence (IN PROGRESS):**
- [x] Supabase project created (`fmaaihxhfgmqdmtmckmc`) with full schema
- [x] Schema deployed in SQL Editor (profiles, student_profiles, progress, submissions, journal_entries + RLS + triggers)
- [x] Supabase client library installed (`@supabase/supabase-js`)
- [x] `.env` configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [x] `.env.example` template created
- [x] `.gitignore` protects `.env`
- [x] Vercel deployed with custom domain `www.voix-vive.com`
- [x] Vercel environment variables set
- [x] Google OAuth 2.0 credentials created in Google Cloud Console
- [x] Google OAuth enabled in Supabase (Client ID + Secret pasted)
- [x] `src/lib/supabase.js` — full client with auth, profile, progress, submission, journal helpers
- [x] `src/hooks/useAuth.js` — auth state management hook
- [x] `src/components/AuthButton.jsx` — non-invasive login/logout button (avatar + name + leave)
- [x] `src/pages/AuthCallback.jsx` — OAuth redirect handler, routes to `/song`
- [x] AuthButton placed in LandingScreen header (next to language toggle, non-blocking)
- [x] `/auth/callback` route added to App.jsx

**Content & Pedagogy:**
- [x] Pythagorean Legacy added to all 12 frets in `chapterData.js` (hook, ratio, cents)
- [x] Pythagorean Legacy slide in every chapter deck (`slideGenerator.js` + `SlideViewer.jsx`)
- [x] Chromatic Monomyth reference chart at `/monomyth` (12-fret grid: interval, stage, ratio, cents)
- [x] Monomyth chart linked from OrientationHub nav bar (BookOpen "Chart" button)

**Documentation:**
- [x] `research/12_GUITAR_EMODULE_PEARL_MATURATION.md` updated to v1.3
- [x] Legal & IP Framework appendix added (ownership table, undocumented items, recommendations)
- [x] Bertrand's Checklist appendix added (immediate actions, Phase 2 needs, brand needs)

### 🔴 IN PROGRESS / PENDING

**Phase 1 — Remaining:**
- [ ] **Login test** — Verify Google sign-in works end-to-end on `www.voix-vive.com`
- [ ] **ScaffoldingProvider sync** — Read from Supabase when logged in, localStorage when not
- [ ] **Data migration** — Local → cloud on first login (preserves existing student progress)
- [ ] **Create `/guitar/map` route** — The Maturation Map as primary navigation
- [ ] **No-AI fallback** — Static prompt library when LM Studio is offline

**Phase 2 — Mentor Connect:**
- [ ] Mentor dashboard — Bertrand sees all student progress, submission queue, feedback
- [ ] Notification system — Student sees "Reviewed" badge when feedback is ready
- [ ] PlayerPortal merge — Remove pricing, add submission status + mentor link
- [ ] Async coaching pricing — Per submission? Monthly? Bundled? (needs Bertrand input)

**Phase 3 — Voice + AI:**
- [ ] Voice TTS — AI responses auto-speak aloud
- [ ] Voice STT — Speech-to-text in chat input
- [ ] AI context injection — Troubadour can pull Song pages into chat
- [ ] AI tool control — Troubadour can set ambient music, metronome via voice
- [ ] AI prompt engineering — DAG-based reflection prompts
- [ ] Adventure standalone enhancement — AI narration

**Phase 4 — Digital Mirror:**
- [ ] Video journaling — Low-def self-recording in PlayerPortal
- [ ] Self-review — Playback with metronome overlay
- [ ] Reflection prompts — After every session: "What did you notice about your breath?"
- [ ] Timeline view — Submissions + journal + practice sessions in one feed
- [ ] CAGED TCG Shop — Browse cards, checkout (Phase 5)

**Phase 5 — Vercel + PWA (FAST-TRACKED — already done):**
- [x] Production deploy — Live at `www.voix-vive.com`
- [ ] PWA manifest — Installable, offline cache
- [ ] Service worker — Offline mode for core features

**Phase 6 — Android (Moonshot — Revenue Gate: $2,500/mo):**
- [ ] Tauri mobile build — Native Android app
- [ ] Hardware integration — Mic, haptics, local SQLite sync
- [ ] Offline-first — Full functionality without network

**Needs Bertrand's Input:**
- [ ] **Color/shape mapping for 12 notes** — "What color and shape for each chromatic note?"
- [ ] **Review StudioPage copy and pricing** — Confirm rates are current
- [ ] **Mentor dashboard preference** — Separate `/mentor` page or integrated notifications?
- [ ] **Submission review workflow** — How does he want to receive student videos?
- [ ] **Record welcome video** — 30–60 seconds for landing page
- [ ] **Provide bio + photo** — For mentor section
- [ ] **Favorite songs for each fret** — Real examples for Timeless Song slides
- [ ] **Voice memo for Troubadour** — "Welcome, troubadour..." for AI voice cloning (Phase 3)

### 🚀 Future: Moonshots (Gated Behind Revenue)
- [ ] French i18n — `react-i18next`, `locales/en.json` + `locales/fr.json` (Phase 3)
- [ ] Troubadour AI — ToneAnalyzer, BreathDetector, PhraseSegmenter, Scorecard (Phase 4)
- [ ] Voice Octave — Frets 13-24 premium curriculum with paywall (Phase 5)
- [ ] Android App / PWA (Gate: Revenue ≥ $2,500/mo)
- [ ] Bevy ECS + Rust/WASM + OpenXR VR classroom (Gate: Revenue ≥ $5,000/mo)
- [ ] Fine-tune Gemma 4 model on Bertrand's teaching data
- [ ] Roblox Music World — social music learning environment (Gate: Revenue ≥ $5,000/mo)

---

## 9. RULES FOR AI SESSIONS

### Who this platform is for
This is **Bertrand Laurence's** guitar teaching platform. Bertrand is a master guitarist and vocalist (Berklee, MassArt) who teaches adult learners through somatic, body-centred methods. Joshua Atkinson built it as a gift. All revenue goes to Bertrand.

**This platform is NOT:**
- Trinity ID AI OS (Joshua's separate project at `/home/joshua/Workflow/Desktop/`)
- Daydream (Joshua's vocabulary engine at `/home/joshua/Workflow/Other/Day_Dream/`)
- The Great Game (Joshua's consciousness framework — separate IP)

Do not import concepts, language, or patterns from those projects without explicit instruction.

### Before touching any code

1. Read `CONTEXT.md` §7 (12-fret UI map) — confirm the change fits the structure
2. For game changes: read `research/10_design_doc_03_vertiscale_game.md` first
3. For platform changes: read `research/10_MASTER_DESIGN_DOC.md` first
4. Test in browser **before** declaring something done
5. Update the relevant design doc in the same session as the code change

### Language rules (Bertrand's voice only)

| Use this | Never use this |
|----------|---------------|
| ©SHEARL, ©PLING!, ©FHEAL | "Dojo", "Forge", "Crucible" |
| The Inner Fretboard / Ear / Voice | Player/Character split |
| Kinesthetic Awakening / Applied Practice / Flow State | Easy / Medium / Hard |
| Breath, somatic, imagination, myelination | Coal/Steam/Traction economy |
| "That's the myelination window. Stay here." | Score rings, leaderboards, AP points |
| The Song / The Guitar / The Player | Any 4th portal not in Boethius framework |

### The 12-fret neck IS the UI
Every screen, every tool, every game phase traces back to the 12-fret map in §7. If a proposed feature does not map to a fret, a protocol, or a phase — it does not belong here yet. Ask first.

### The Troubadour AI
The platform's AI guide is named **the Troubadour** — a medieval bard who has walked the 12-fret chromatic path. This name is used consistently everywhere: the adventure mode, the chat guide, the AI persona.

**Current implementation:** LM Studio streaming via `useLMStudio` hook, inside `AmbientPlayer.jsx` (the Troubadour tab). System prompt is built dynamically from the student's live character sheet (Bard Level, practice minutes, streak, completed frets).

**Future:** A fine-tuned model trained on Bertrand's teaching data, his written curriculum, and session transcripts. This will become the "Ask Bertrand" model — Bertrand's voice, Bertrand's pedagogy, running on-device.

**System prompt rules (never break these):**
- Respond in whatever language the student writes in (EN/FR)
- Never mention scores, speed, leaderboards, difficulty levels
- Always return to breath, imagination, or one small next step
- When in doubt, ask a Socratic question
- Max 2-4 sentences per response

### Practical
```
Project root: /home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/
Dev server:   npm run dev  →  localhost:5173
Git remote:   https://github.com/joshua42atkinson/Music.git
Deploy:       Vercel → www.voix-vive.com (auto on push to main)
i18n:         t('key') from useLocale.js — add to both EN and FR sections
```

### Academic context
- Purdue EDCI 57300 Practicum — Joshua Atkinson, advisor Dr. Jennifer Richardson
- AI usage: Level 2 Partially Restricted — must declare AI assistance

---

## 10. DOCUMENTATION INDEX

### Core Documentation
| Document | Purpose |
|----------|---------|
| `CONTEXT.md` | This file — master project context |
| `research/12_GUITAR_EMODULE_PEARL_MATURATION.md` | Current status, checklist, legal/IP, Bertrand's needs |
| `ROADMAP.md` | Development phases and milestones |
| `USER_EXPERIENCE_MAP.md` | User journey and interaction flows |

### Technical Documentation
| Document | Purpose |
|----------|---------|
| `docs/API_REFERENCE.md` | Complete API docs for hooks and components |
| `docs/ARCHITECTURE_FLOWS.md` | Data flows and state management |
| `docs/AI_DEVELOPER_GUIDE.md` | AI modification system usage |
| `docs/LM_STUDIO_SETUP.md` | LM Studio configuration guide |
| `docs/QUICKSTART_LM_STUDIO.md` | 3-minute setup for AI features |

### Server Documentation
| Document | Purpose |
|----------|---------|
| `mcp-server/README.md` | MCP server architecture and setup |

### Business Documentation
| Document | Purpose |
|----------|---------|
| `MEETING_PREP.md` | Stakeholder meeting notes |
| `IP_ASSIGNMENT.md` | Intellectual property terms |
| `Gamifying Guitar Learning with Open Source.md` | Academic proposal |

### Curriculum Documentation
| Document | Purpose |
|----------|---------|
| `research/10_design_doc_01_foundation.md` | Pedagogical foundation |
| `research/10_design_doc_02_curriculum.md` | 12-chapter curriculum map |
| `research/10_design_doc_03_vertiscale_game.md` | Game design document |
| `research/10_design_doc_04_platform_and_business.md` | Platform architecture |
| `research/10_MASTER_DESIGN_DOC.md` | Master design document |

---

## 11. AI DEVELOPER INTEGRATION

The platform now includes a complete AI developer system:

### LM Studio + MCP Server
- **LM Studio** runs Qwen Coder 32B with GPU acceleration
- **MCP Server** exposes file editing tools to the AI
- **Approval Queue** ensures safety for destructive changes
- **Chat Interface** at `/ai-developer` for natural language requests

### Quick Start
```bash
# 1. Start LM Studio (load Qwen Coder, enable server on port 1234)

# 2. Start MCP Server
cd mcp-server && ./start-mcp.sh

# 3. Access chat interface
# Navigate to http://localhost:5173/ai-developer
```

See `docs/AI_DEVELOPER_GUIDE.md` for complete documentation.

---

## 12. SUPABASE PROJECT DETAILS

| Field | Value |
|-------|-------|
| Project URL | `https://fmaaihxhfgmqdmtmckmc.supabase.co` |
| Anon Key | `tALVyw3Xn3IOL5H1d-wWaw_qriRYU31` |
| Project Ref | `fmaaihxhfgmqdmtmckmc` |
| Schema | `supabase/schema.sql` (deployed) |
| Tables | profiles, student_profiles, progress, submissions, journal_entries |
| Auth Provider | Google OAuth (configured, needs live test) |

---

## 13. LONG WORKFLOW QUEUE (For Agentic Sessions)

When the user is away, proceed in this order:

1. **ScaffoldingProvider Supabase sync** — Read/write progress to Supabase when logged in
2. **Data migration on first login** — localStorage traction → Supabase progress table
3. **AuthButton on all nav bars** — Add to OrientationHub, GuitarWorkbench, PlaybookShell, VertiscaleEngine
4. **Creator footer** — Add "Built by Joshua Atkinson · LDTAtkinson.com" to landing page footer
5. **Privacy/Terms updates** — Add actual legal text about Supabase data storage
6. **Test Google login** — Once user confirms OAuth is fully enabled
7. **No-AI fallback** — Static prompt library when LM Studio is offline
8. **PWA manifest** — Installable, offline cache for core features
