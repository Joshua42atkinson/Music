# 🎸 VOIX VIVE — Master Context & Business Platform

> **Purpose:** Load this file into a new AI session to instantly recover full project context.  
> **Last Updated:** 2026-05-25 (Documentation alignment sprint — 12-fret UI governance, IP boundary enforcement, routing correction)  
> **Project Root:** `/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/`  
> **Dev Server:** `npm run dev` → localhost:5173  
> **Git Remote:** https://github.com/joshua42atkinson/Music.git  
> **Deployment:** Vercel → `bertrand-masterclass/dist` (auto-deployed on push)
> **AI Server:** LM Studio → localhost:1234 (Qwen Coder 32B)
> **MCP Server:** `cd mcp-server && ./start-mcp.sh` → localhost:3001

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

### Ownership
- **Bertrand Laurence** — owns the platform as a business asset. All revenue belongs to him.
- **Joshua Atkinson** — owns the platform architecture, code, and design methodology (ADDIECRAPEYE, PEARL). The engineering IP stays with Joshua.
- **Trinity ID AI OS** — Joshua's separate sovereign learning OS (`/home/joshua/Workflow/Desktop/`). A sibling project. IDEAS may inform Voix Vive; CODE does not port across.

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
DB (Local):   Dexie.js / IndexedDB (offline progress + submission outbox)
Media:        MediaRecorder API (practice video/audio capture)
SEO:          JSON-LD LocalBusiness, Open Graph, Twitter Cards
Source Code:  ~19,800 LOC across 59 source files (components, hooks, data, game, pages)
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

Each fret is one chapter, one chromatic tone, one monomyth stage, one digital tool, one protocol:

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

The game trains **imagination**, not fingers. Bertrand's axiom: *"The fingers follow."*

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

### Routing (do not change without updating this doc)

```
/          → LandingScreen      — 3 portals + Troubadour Adventure launcher
/song      → OrientationHub     — Living Textbook (12-chapter neck menu)
/guitar    → VertiscaleEngine   — The game (12-root-note menu → Flash/Imagine/Audiate/Reflect)
/player    → MentorTools        — Breathing + recording + binder
/playbook  → PlaybookShell      — Progress tracking
/studio    → StudioPage         — Bertrand's services + pricing + testimonials
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

**Rule:** Update the relevant design doc in the same session you change the code. Documentation is the lens that prevents scope creep.

---

## 8. WHAT'S DONE vs WHAT'S LEFT

### ✅ Complete (as of 2026-05-25)
- [x] 12-chapter Living Textbook (free, swipeable slides with artwork for ch1-8)
- [x] **AI Developer Integration** (LM Studio + MCP Server)
  - MCP Server with file read/edit tools and approval queue
  - AIDeveloperChat component at `/ai-developer`
  - useLMStudio hook for Qwen Coder integration
  - Complete documentation (AI_DEVELOPER_GUIDE, LM_STUDIO_SETUP)
- [x] StudioPage business landing (6 services, 13 testimonials, payment grid, FAQ, French section)
- [x] All 12 Fret tools wired and interactive (12/12 ✅)
- [x] **Fret 9 — Vertiscale Imagination Engine** ✅
  - Phase 1 Flash: REVEAL → DARK → TAP → RESULT (8 rounds, progressive difficulty)
  - Phase 1 Imagine: REVEAL → HOLD → RESULT (sustain scoring, breathing pulse)
  - Phase 2 Audiate: OrbEngine + PitchGateUI wired (needs live testing)
  - Phase 3 Reflect: Journal textarea + dynamic coaching cues + localStorage persistence
- [x] **Troubadour Adventure wired into Landing Page** ✅
  - 918 lines of bilingual narrative, 12 branching scenes, 3 acts
  - Pitch-gated progression (Hear → Sing → Choose)
  - Lazy-loaded as 57 kB chunk, opens as full-screen overlay
  - Scene art rendered as ambient backgrounds behind 3D visualizer
- [x] **i18n infrastructure: useLocale.js** with 100+ bilingual keys (EN/FR)
  - LandingScreen, PinModal, ProfileModal fully migrated to t()
  - AdventurePlayer fully migrated to t() (21 → 1 isFrench calls)
- [x] **LandingScreen decomposed** (1168 → 684 lines): PinModal + ProfileModal extracted
- [x] Menu reframed: Inner Fretboard / Inner Ear / Inner Voice
- [x] Imagination Management Framework documented in game design doc
- [x] PracticeRecorder, AmbientPlayer, Metronome, WelcomeOnboarding, SEO
- [x] Digital Binder (practice log, tools tab, submissions)
- [x] Workspace cleanup and rename (daydream-website → voix-vive)
- [x] BiometricSanctum simplified (691 → 175 LOC, removed scope-creep hardware code)

### � AUTH & GATING ARCHITECTURE DECISION (documented 2026-05-25)

**During development:** All 12 frets unlocked. No gates. No login required. `fretsUnlocked: [1..12]` stays as the default in `tractionStore.js`.

**Auth stack when ready: Supabase** (not Firebase, not Clerk, not raw Google Auth)
- Google OAuth + email/password via Supabase Auth
- Postgres database → Bertrand's mentor dashboard reads student progress
- Row-level security → each student sees only their own data
- Stripe webhook → flips tier flag in Supabase on payment
- Cloudflare R2 → video submission storage (already in outbox schema)
- Free tier → $0 until real users arrive

**Three tiers (Phase 3 implementation):**
```
Free       → Frets 1-3 fully open, Frets 4-12 textbook preview only
$19/mo     → All 12 frets + Digital Binder + Vertiscale game
$89/mo     → All above + AsyncAssessor submissions (2/month to Bertrand)
```

**Do NOT use Google Auth directly** — adds Google dependency, breaks offline, not Slow Web aligned.
**Do NOT gate frets before launch** — Bertrand needs students to experience the full arc first.

**Troubadour gains from Supabase (future):**
- Cross-device streak/progress (real data, not just local)
- Bertrand's coaching notes surface in the AI prompt
- Last tool used, last session date, student's declared goals

### 🔴 Connection Wiring (Priority Order — before auth)

These connect the three portals into one coherent learning arc:

**Wire 1: Game → Textbook traction** (1 session, ~20 lines)
- `sessionLogger.js` calls `updateFretTraction()` after each Vertiscale session
- Game scores advance chapter progress, scaffold fades as mastery grows

**Wire 2: Textbook → Game unlock** (~10 lines)
- `SlideViewer` completion sets `yinCompleted`/`yangCompleted` on the fret state
- Vertiscale phase unlock gates read these flags

**Wire 3: Student name** (~30 lines)
- First-visit name prompt writes to `studentProfile` in IndexedDB (schema already exists)
- Troubadour addresses student by name in responses

### 🟡 Needs Bertrand's Input
- [ ] Stripe Payment Links — Bertrand creates Stripe account, we plug in URLs
- [ ] Venmo QR image — need actual QR code screenshot
- [ ] Review StudioPage copy and pricing for accuracy
- [ ] License decision: open source, proprietary, or hybrid
- [ ] Confirm fret gating tiers match his actual pricing intention

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

**Workflow 5: Troubadour Adventure UI** ✅ (Complete — May 20 2026)
- AdventurePlayer wired into LandingScreen via lazy-loaded overlay
- Broken bookshelf shop removed (490 lines of dead modal code)
- Scene art backgrounds, BiometricSanctum noise removed
- All 21 inline isFrench ternaries migrated to t() lookups

**Workflow 6: Eyes-Closed Mode + Somatic Deepening** (1 session)
- Add "eyes closed" variant of Flash mode — screen goes black, taps are from pure imagination
- Add imagination vividness self-rating after each round
- Add body scan prompt rotation to Phase 3 journal

### 🚀 Future: Moonshots (Gated Behind Revenue)
- [ ] French i18n — `react-i18next`, `locales/en.json` + `locales/fr.json` (Phase 3)
- [ ] Troubadour AI — ToneAnalyzer, BreathDetector, PhraseSegmenter, Scorecard (Phase 4)
- [ ] Voice Octave — Frets 13-24 premium curriculum with paywall (Phase 5)
- [ ] Android App / PWA (Gate: Revenue ≥ $2,500/mo)
- [ ] Bevy ECS + Rust/WASM + OpenXR VR classroom (Gate: Revenue ≥ $5,000/mo)
- [ ] Fine-tune Gemma 4 model on Bertrand's teaching data
- [ ] Roblox Music World — social music learning environment (Gate: Revenue ≥ $5,000/mo)

### 🎨 Remaining Non-Game Work
- [x] ch1-12 artwork — all 12 chapters have AI-generated slide art ✅
- [ ] PracticeRecorder → actual upload pipeline (Cloudflare R2) — Phase 2
- [ ] Production deployment (voix-vive.com domain + Vercel DNS) — Phase 2
- [ ] French i18n — `react-i18next` infrastructure + translations — Phase 3
- [ ] Troubadour AI Scorecard — radar chart + evaluation pipeline — Phase 4
- [ ] Post-Thursday: update CONTEXT.md with Bertrand's feedback

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
Deploy:       Vercel → voix-vive.com (auto on push to main)
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
| `DESIGN.md` | System architecture and technical design |
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

---

## 11. AI DEVELOPER INTEGRATION (New - May 25)

The platform now includes a complete AI developer system:

### LM Studio + MCP Server
- **LM Studio** runs Qwen Coder 32B with GPU acceleration
- **MCP Server** exposes file editing tools to the AI
- **Approval Queue** ensures safety for destructive changes
- **Chat Interface** at `/ai-developer` for natural language requests

### Capabilities
Bertrand can now:
- Type natural language requests to fix bugs
- Request new features and exercises
- Generate monthly subscription content
- Deploy changes after approval
- Debug issues with AI assistance

### Quick Start
```bash
# 1. Start LM Studio (load Qwen Coder, enable server on port 1234)

# 2. Start MCP Server
cd mcp-server && ./start-mcp.sh

# 3. Access chat interface
# Navigate to http://localhost:5173/ai-developer
```

See `docs/AI_DEVELOPER_GUIDE.md` for complete documentation.
