# VOIX VIVE
## Master Pedagogical Design Document
### *The TAO of Living Music*

> **Version:** 3.0 — PEARL Multi-Perspective + ADDIECRAPEYE Integration (2026-05-19)  
> **Author:** Joshua Atkinson (Platform Architect & Instructional Designer) | SME: Bertrand Laurence  
> **Design Framework:** ADDIECRAPEYE + PEARL (Trinity ID AI OS — The Conductor's Compass)  
> **Source Batches:** `10_design_doc_01–04.md` in `/research/`  
> **Status:** Living document — update when architectural or pedagogical decisions are made

---

> *"You are an instrument playing an instrument. If I am playing the guitar — who is playing me?"*
> — Bertrand Laurence

---

## The Purpose of This Document

This is the single source of truth for the Voix Vive platform. Every technical decision traces back to a pedagogical one. Every pedagogical decision traces back to the student. When a decision is ambiguous, return to the axiom above and ask: does this serve the student's somatic safety, or does it serve something else?

---

## I. THE STUDENT — Who Learns Here

Adults aged 30–65. Most have tried before and stopped — not from lack of talent, but because the system they entered was designed for children: rote drills, punitive grading, performance anxiety baked in from lesson one.

These students carry:
- **Fear of sounding bad**, especially in front of others
- **Impatience with their own hands** — the gap between what they hear internally and what they execute feels like a personal failing
- **Fragmented time** — 10 minutes before dinner, 20 minutes on a weekend. Progress must survive those gaps
- **Inner critic dominance** — the analytical mind interrupts the creative one constantly

### What Actually Works for Them

| Conventional Approach | Bertrand's Approach |
|---|---|
| Start with technique | Start with somatic safety |
| Measure performance by speed | Measure by presence and breath |
| Theory as prerequisite | Theory as discovery |
| Practice alone, perform later | Internalize before you externalize |
| Scales as drills | Scales as spatial stories |

The platform embodies the second column in every interaction. **No speed metrics. No punitive streaks. No leaderboards.** The only competition is between the student and their own previous moment of tension.

### The Gift-Giver (Secondary User)
A secondary user purchases the platform as a gift. They need: printable/emailable purchase confirmation, a clear description of what their loved one receives, and a gift certificate interface in the StudioPage.

---

## II. THE WAY — Pedagogical Philosophy

### The Slow Web Mandate
Voix Vive is explicitly anti-dopamine. Transitions are slow. The ambient soundscape is continuous. The breath gate precedes every session. The platform simulates the psychological environment of a **physical practice nook** — a safe, quiet room where no one is watching and no one is judging.

### Yin and Yang: The Dual-Coding Engine

```
YIN (The Invisible Domain)          YANG (The Visible Domain)
──────────────────────────          ─────────────────────────
Abstract music theory               Fretboard geometry
Ear training & pitch memory         Finger placement & kinesthesis
Breath & nervous system             Physical ergonomics & relaxation
Emotional interpretation            Muscle memory & myelination
Creative impulse                    Technical execution
```

Every tool and every chapter has both dimensions. A student who plays the right note with locked shoulders has only achieved Yang.

### The Three Protocols: A Complete Learning Cycle

```
PERCEIVE ──────────► EMBODY ──────────► EXPRESS
    ↓                    ↓                   ↓
©SHEARL               ©PLING!             ©FHEAL
See/Hear/Feel         Sing & Play         Hear/Feel (bypass the critic)
Theory → Touch        Vocal → Motor       Impulse → Instrument
```

**©SHEARL:** Before placing a finger, the student sees the pattern, hears the interval internally, and feels the shape in hand memory. Always the entry point.

**©PLING!:** The student sings the pitch before playing it — hardwiring the vocal tract to the motor cortex. Forces knowing the sound before executing it. The most powerful intervention in the curriculum.

**©FHEAL:** Once SHEARL and PLING! are embodied, FHEAL trains the student to bypass analytical interference and translate raw creative impulse directly into the instrument. Where improvisation lives.

### The Myelination Imperative
Myelin sheaths form during **slow, conscious, correct repetition** — not fast, pressured drilling. All scoring and progression logic in the Vertiscale Engine is calibrated around this biological fact.

---

## III. THE CURRICULUM — The Chromatic Monomyth

### Macro Sequence
```
CHAPTERS 1–4: NOTES    — Single note meaning, pitch internalization, tension/release
CHAPTERS 5–8: CHORDS   — Notes in relationship, CAGED geometry, harmonic emotion
CHAPTERS 9–12: SONGS   — Full fretboard fluency, improvisation, no visible map
```

### The 12-Chapter Map

Each chapter's tool is chosen as a **psychological self-discovery metaphor** — the tool embodies the inner process the student undergoes at that monomyth stage.

> **Source of truth:** `src/data/toolsData.jsx` + `src/components/DigitalBinder.jsx`
> The code IS the curriculum. This table must match the code, not the other way around.

| # | Tone | Stage | Chapter Focus | Protocol | Tool (Code) |
|---|------|-------|---------------|----------|-------------|
| 1 | C — Root | Call to Adventure | The Root Note. Body Scan. Ventral Vagal state. *"Am I safe here?"* | ©SHEARL | Breathing Gate |
| 2 | C# — m2 | Refusal of the Call | *"I don't have time."* Timer reframes time from enemy to ally. | ©SHEARL | Practice Timer |
| 3 | D — M2 | Meeting the Mentor | The Ear Awakens. The mentor is the student's own capacity to hear. | ©PLING! | Pitch Room |
| 4 | D# — m3 | Crossing the Threshold | Committing to the Beat. The metronome does not negotiate. First surrender. | ©SHEARL | Metronome |
| 5 | E — M3 | Tests, Allies, Enemies | Brightness and the Warp. G/B anomaly. The map lies — learn it anyway. | ©SHEARL | Interval Visualizer |
| 6 | F — P4 | Approach to the Inmost Cave | The Full Neck. CAGED System. The thing they most fear: the entire fretboard at once. | ©SHEARL | The Grid Map |
| 7 | F# — Tritone | The Ordeal | The Devil in Music. Sing the tritone before playing it. The mic does not lie. | ©PLING! | PLING! Trainer |
| 8 | G — P5 | The Reward | Precision as Gift. Sub-cent resolution reveals what was invisible. Vibrato becomes intentional. | ©FHEAL | Microtonal Tracker |
| 9 | G# — m6 | The Road Back | Force Threshold. The Playable Guitar shows the full interactive fretboard — explore intervals and scales by touch. | ©SHEARL | Playable Guitar |
| 10 | A — M6 | The Resurrection | Submitting to the Mirror. Practice visible to another person for the first time. | ©FHEAL | Async Assessor |
| 11 | A# — m7 | Return with the Elixir | Fluency. All 12 keys at once. Navigate keys like rooms — without thinking about the door. | ©FHEAL | Multi-Key Hub |
| 12 | B — M7 | Master of Two Worlds | Rubedo. Free improvisation. No map. No rules. Mastery is silence of the inner critic. | ©FHEAL | Rhythm Engine |

> **Note:** The **Vertiscale Engine ⭐** (the Game) is NOT a fret-specific tool. It is a standalone game mode accessible via 🎮 Game on the landing screen. It spans ALL frets — any root note, any scale — and represents the synthesis of all 12 tools into a single playable practice loop (SHEARL Flash → PLING! Orbs → FHEAL Impression).

### Digital Binder — Self-Discovery Tool Arc
```
SAFETY & COMMITMENT (Frets 1–2)
  Fret 1:  Breathing Gate       — "Am I safe here?"
  Fret 2:  Practice Timer       — "Can I commit to this?"

PERCEPTION & LISTENING (Frets 3–4)
  Fret 3:  Pitch Room           — "Can I hear myself?"
  Fret 4:  Metronome            — "Can I surrender to time?"

SPATIAL AWARENESS (Frets 5–6)
  Fret 5:  Interval Visualizer  — "How do notes relate?"
  Fret 6:  The Grid Map         — "Can I face the whole neck?"

INTEGRATION & PRECISION (Frets 7–8)
  Fret 7:  PLING! Trainer       — "Can I sing and play?"
  Fret 8:  Microtonal Tracker   — "How precise am I really?"

MASTERY & FREEDOM (Frets 9–12)
  Fret 9:  Playable Guitar      — "Can I explore freely?"
  Fret 10: Async Assessor       — "Can I be seen?"
  Fret 11: Multi-Key Hub        — "Can I see the whole?"
  Fret 12: Rhythm Engine        — "Can I play free?"
```

---

## IV. THE GAME ⭐ — Vertiscale Engine (Standalone Mode)

### What Is a Vertiscale?

A paper chart Bertrand drew for students. It solved the central spatial problem of guitar pedagogy: most students learn scales *horizontally* (along one string), but real playing is *vertical* (across all six strings simultaneously). The Vertiscale shows the full cross-section — all six strings, all notes, in the actual spatial relationship the fingers encounter.

Bertrand called it the **"Rosetta Stone of the fretboard"**: once seen, it cannot be unseen.

The Vertiscale Engine makes this paper chart a living, three-phase learning game.

---

### Three-Phase Architecture

```
PHASE 1: SHEARL — See It, Map It
  Mode:    Vertiscale Flash
  Goal:    Spatial memory formation
  Metric:  Accuracy (NOT speed)

PHASE 2: PLING! — Sing It, Play It
  Mode:    Note Drops with mic validation
  Goal:    Vocal-motor integration under time pressure
  Metric:  Pitch accuracy BEFORE placement (must sing → then tap)

PHASE 3: FHEAL — Feel It, Play Free
  Mode:    Freeplay over backing track
  Goal:    Bypass analytical brain; express creative impulse
  Metric:  Session logging only — no score displayed
```

**Unlock progression:**
- Phase 2 unlocks after 5 successful Phase 1 sessions (`consistencyRatio > 0.85`)
- Phase 3 unlocks after 3 successful Phase 2 sessions (or upon reaching Chapter 12)

---

### Phase 1: Vertiscale Flash (©SHEARL)

**Loop:**
```
1. REVEAL    → Scale pattern lights up on all 6 strings (2.0s beginner → 0.5s advanced)
2. DARKNESS  → Fretboard goes neutral. Student has 8 seconds to reproduce
3. TAP       → Student taps fret positions. Instant feedback (glow = correct, pulse-red = wrong)
4. REVEAL    → Correct pattern re-illuminates overlaid with student's taps (diff view)
5. SCORE     → Points awarded. Next round begins
```

**Progression logic:**
- Start: 5-note patterns (minor pentatonic — 2 strings)
- Expand to full 6-string patterns as `consistencyScore` stabilizes
- Reduce flash window based on consistency, NOT speed
- Unlock adjacent keys before introducing new pattern shapes

**Pattern Library** (from FretboardExplorer's existing scale data):
Major, Natural Minor, Minor Pentatonic, Major Pentatonic + all CAGED positions

---

### Phase 2: Note Drops with Mic Validation (©PLING!)

**Loop:**
```
1. ORB SPAWNS    → Note orb appears at top of fretboard column, begins descending
                   Displays: note name, string number, optional finger hint

2. MIC WINDOW    → At 50% descent: mic activates. Student sings/hums target pitch
                   Tolerance: ±35¢ (beginner) → ±10¢ (advanced)
                   Visual: pitch needle animates toward green zone

3. GATE CHECK    → Pitch confirmed: orb turns green → tap window opens (2 bars)
                   Pitch missed:    orb turns amber → tap window opens (penalty applied)
                   Orb reaches bottom: miss registered

4. TAP           → Student taps correct fret position
                   Response: string vibration animation + Web Audio note preview

5. FEEDBACK      → Composite score: pitch accuracy + tap timing + breath continuity
```

**Why the mic gate matters:** Without it, the student defaults to visual pattern matching — they see the orb and tap by spatial memory. The mic gate forces the pitch to live in their throat *before* it lives in their fingers. This is the neurological core of Bertrand's method.

**Difficulty levels (use Bertrand's language — never "Easy/Medium/Hard"):**
| Bertrand Label | Descent | Tolerance | Orb Density |
|---|---|---|---|
| Kinesthetic Awakening | 80 BPM | ±35¢ | 1 per 4 beats |
| Applied Practice | 120 BPM | ±20¢ | 1 per 2 beats |
| Flow State | 160 BPM | ±10¢ | 1 per beat |

---

### Phase 3: Freeplay (©FHEAL)

No rules. No orbs. No flash. A backing track plays. The student plays anything.

**What's tracked invisibly:**
- Notes vs. backing track key (in-key vs. chromatic choices)
- Note durations and rests
- Pitch bends and microtonal expression

**What's shown after the session:** A simple "impression" (not a score):
> *"You spent most of this session in the upper register. You played 47 notes — 38 in key, 9 chromatic. Which moment felt the most like music to you?"*

**Why no score:** ©FHEAL is specifically engineered to deactivate the prefrontal cortex's analytical interference. A score would immediately re-engage the inner critic. The reflection prompt replaces the score.

---

### Scoring Philosophy (Phases 1 & 2)

| Component | Weight | What It Measures |
|---|---|---|
| Placement Accuracy | 35% | Correct fret + string |
| Pitch Accuracy (Phase 2) | 25% | Cents deviation during mic window |
| Breath Continuity | 20% | No amplitude spikes or holds (mic tracks this) |
| Consistency Ratio | 20% | Variance across 5-round window |

**Explicitly NOT scored:** response speed, number of attempts, comparison to other students.

**The Streak Mechanic (Anti-Dopamine):**
Streaks trigger when: 3 consecutive rounds with `breathContinuity > 80%` AND `placementAccuracy > 85%`. Reward: soft ambient glow on the practice nook UI. A one-line note: *"That's the myelination window. Stay here."*

---

### Technical Architecture (`VertiscaleEngine.jsx`)

**State:**
```javascript
{
  phase: 1 | 2 | 3,
  currentPattern: PatternObject,     // from FretboardExplorer scale library
  sessionScores: ScoreEntry[],
  micActive: boolean,
  breathState: 'free' | 'held' | 'shallow',
  orbQueue: OrbObject[],
  flashVisible: boolean,
  flashDurationMs: number,           // 2000 → 500 based on consistencyScore
  consistencyScore: number           // rolling average over last 5 rounds
}
```

**Key dependencies (reuse, don't duplicate):**
- `FretboardExplorer` — scale pattern data + fretboard rendering
- `PlingTrainer` — mic/AudioWorklet pipeline (Phase 2 pitch gate)
- `MicrotonalTracker` — cents deviation (Phase 2 + Freeplay logging)
- `Metronome` — orb timing grid (Phase 2)
- `AmbientPlayer` — Freeplay backing track (mutually exclusive with Metronome)
- `tractionStore` — session logging, bardLevel progression
- `localDatabase` (Dexie) — session impressions for async review

**Engineering constraints:**
- Orb timing: `requestAnimationFrame` + `AudioContext.currentTime` — NOT `setInterval`
- Flash duration: `performance.now()` — NOT `Date.now()` (avoids clock skew)
- Mic pipeline: reuse PlingTrainer's existing AudioWorklet — do NOT create a second AudioContext
- Pattern data: extend FretboardExplorer's scale state — do NOT create a parallel data source
- Breath detection: amplitude envelope from mic stream; sustained dip below threshold for 1+ seconds = `breathState: 'held'`

**Mic Integration Sequence (Phase 2):**
```
1. Request mic permission (reuse from PlingTrainer session if available)
2. Initialize AudioWorkletNode (reuse existing worklet from PlingTrainer context)
3. On orb spawn: begin buffering pitch data
4. At 50% descent: open mic gate window
5. Compare detected Hz to target Hz (via @tonaljs/tonal)
6. Map delta: cents = 1200 × log₂(detected / target)
7. If |cents| < threshold: gate passes → green orb
8. Close mic gate; student taps
9. Log: { pitchCents, tapAccuracy, breathState, timestamp }
```

---

### Curriculum Wiring

| Chapter | Game Mode | Pattern | Exit Criteria |
|---|---|---|---|
| 9 (Road Back) | Phase 1 only | Minor pentatonic (A shape, 5 frets) | 3 consecutive rounds, `consistencyRatio > 0.85` |
| 12 (Master) | Phase 3 only | No pattern (Freeplay) | Session logged to PracticeRecorder |
| Binder Fret 9 (any time after Ch.9) | All 3 phases | Any pattern in library | Phase unlock gates (see above) |

---

### Future: Android XR Vertiscale (Phase 3 Platform)

| Web Mode | XR Transformation |
|---|---|
| Note Drops (2D) | Orbs descend onto student's *physical guitar strings* via MR passthrough |
| Vertiscale Flash | Scale pattern projected onto *actual fretboard* for 0.5s, then fades — student plays from memory while seeing the real guitar |
| Freeplay | All visual overlays removed. Pure ©FHEAL. Mic only. |

**XR tech requirements:**
- `bevy_oxr` (OpenXR runtime — NOT `bevy_mod_xr`)
- `oboe` crate (NOT `cpal`) — sub-millisecond Android audio
- Camera passthrough → string tracking via computer vision
- SharedArrayBuffer ring buffer: Bevy audio thread ↔ Web Audio worklet

---

## V. THE PLATFORM — Technical Architecture

### Four Phases

| Phase | Status | What |
|---|---|---|
| 1: Living Textbook | ✅ Complete | React PWA, 12 chapters, Digital Binder (12/12 tools) |
| 2: Mentored Platform | 🔴 Next | AsyncAssessor pipeline, Bertrand review dashboard, Cloudflare R2 |
| 3: Android XR | 🔵 Future | Tauri v2 + Bevy ECS + OpenXR + Gemma 4 AI |
| 4: The School | 🔵 Vision | Multi-instructor, spatialized ensembles, guest masters |

### Current Stack (Phase 1)
```
Vite 7.2.4 + React 18 + React Router 7
Vanilla CSS + custom --bard-* design tokens
Framer Motion (swipe transitions — deliberately slow)
Lucide React (icons)
HTML5 Audio (AmbientPlayer) + Web Audio API (tools)
@tonaljs/tonal (note/interval math)
Dexie/IndexedDB (offline-first)
localStorage + ScaffoldingProvider (progress state)
Stripe Payment Links (zero backend)
JSON-LD LocalBusiness + Open Graph (SEO)
Fonts: Cormorant Garamond + Inter + JetBrains Mono
```

---

## VI. THE ECONOMY — Business Model

### Revenue Architecture: À La Carte + Inner Circle

The platform uses an **à la carte + membership** model rather than tiered subscriptions. This is optimized for Bertrand's situation as an independent instructor:

**Why à la carte beats subscription tiers for Bertrand:**
- **Lower barrier:** A $5 Quick Question converts a browser into a paying student. A $19/mo subscription scares them away.
- **Scales with effort:** Bertrand earns more when he does more work. No ceiling on income per student.
- **No empty tiers:** A "$19/mo Passive Path" charges for something already free — students will resent it.
- **Gift certificates work:** À la carte maps cleanly to gift-giving. "Here's 5 lessons" is a better gift than "Here's a month of a subscription."

### Live Services (Core Revenue)

| Service | Price | Effective Rate | Delivery |
|---|---|---|---|
| Quick Question (text) | $5 | ~$120/hr (3-min reply) | In-app message |
| Mini Critique (video) | $15 | ~$180/hr (5-min reply) | Video response |
| Full Video Review | $35 | ~$140/hr (15-min watch + response) | Video response |
| Private Lesson | $65/session | $65/hr | Zoom or in-studio |
| 5-Lesson Pack "Onward" | $275 ($55/ea) | $55/hr | Zoom or in-studio |
| 10-Lesson Pack "Onward Forward" | $500 ($50/ea) | $50/hr | Zoom or in-studio |

### Inner Circle Membership (Recurring Revenue)

| Plan | Price | Includes |
|---|---|---|
| Monthly | $25/mo | Monthly group Q&A, priority async queue, downloadable Vertiscales, community access |
| Annual | $199/yr ($16.58/mo) | Same + 34% savings |

### One-Time Products
- **Downloadable Resource Pack:** $29 — Vertiscales, CAGED maps, chord grids (printable PDF)
- **Gift Certificate:** $60–$275 — PDF emailed, redeemable for any service

### What Can Easily Change (for Thursday)
- All prices in `pricingData.js` — single file, 5-minute change
- Service descriptions — same file
- Inner Circle perks — same file
- Payment links — plug in Stripe URLs when Bertrand has a Stripe account
- Add/remove payment methods (Venmo, PayPal, Zelle, etc.)

### What Cannot Easily Change
- Moving from à la carte to subscription tiers requires auth + paywall middleware
- The free/paid boundary (what's gated vs. open) requires route guards — not built yet

### Francophone Strategy
Bertrand's French fluency opens Montreal, Quebec, and Louisiana. StudioPage French section is live. Domain `voix-vive.com` + French SEO activates this market on launch.

---

## VII. THE LAW — IP & Licensing

### IP Boundary

```
BERTRAND'S → ©SHEARL, ©PLING!, ©FHEAL, 5 Pillars, Yin/Yang, Vertiscale,
              CAGED applications, somatic language, all curriculum content

JOSHUA'S (THE GREAT GAME) → Do NOT import without explicit discussion:
              Four Channels, Player/Persona/Architect, Physics of Being,
              Virtue Topology, N=1 Experiment, Coal/Steam/Traction

BORDERLINE → "Voix Vive" title, "Bard Level" terminology, Monomyth stage names
```

**Ownership:** 100% Bertrand Laurence Guitar Studio. Joshua Atkinson developed the platform as a gift. All platform code, curriculum content, and trademarks belong to Bertrand.

### License Status

The platform license is **to be determined by Bertrand Laurence**. Until a specific license is chosen, the platform is All Rights Reserved.

**Dependency compatibility** (relevant when/if Bertrand chooses an open-source license):

| Library | License | Status |
|---|---|---|
| JS-Hero, fretboard-js, Glicol, pitchlite | MIT | ✅ Compatible with any license |
| FretPath | Apache 2.0 | ✅ Compatible with any license |
| GPLv3 polyphonic detectors | GPLv3 | ⚠️ Isolate as microservice if proprietary |
| Any GPLv2 library | GPLv2 | ❌ Reject entirely |

---

## VIII. THURSDAY MEETING PREP — Bertrand Sync

> **Meeting date:** Thursday, May 22, 2026
> **Attendees:** Joshua + Bertrand
> **Goal:** Walkthrough of the finished platform, pricing confirmation, domain launch
>
> **📋 Live Runsheet:** See [`MEETING_PREP.md`](../MEETING_PREP.md) for the phone-readable walkthrough script.
> The content below is the academic record; the runsheet above is the live operational document.

### What To Show Bertrand

1. **The Living Textbook** — Swipe through Frets 1–12 on his phone. Let him see the AI artwork, the pedagogical slides, the Timeless Song historical layer, and the 📚 References panel. This is his curriculum made visible.

2. **The 12 Tools** — Open the Digital Binder → The 12 Tools tab. All 12 are wired and functional. Demonstrate:
   - Breathing Gate (somatic entry)
   - PLING! Trainer (mic-based pitch singing)
   - Vertiscale Engine (the game — Phase 1 SHEARL Flash)

3. **The Studio Page** — Show the pricing cards, service descriptions, and payment method options. Ask: "Are these prices right? What needs to change?"

### What Bertrand Needs To Decide

| Decision | Why It Matters | Easy To Change? |
|---|---|---|
| **Are the lesson prices correct?** ($65 single, $55×5, $50×10) | These are visible to every student. Must match his DuetPartner pricing. | ✅ Yes — one file, 5 minutes |
| **Inner Circle: $25/mo — is this right?** | This is his recurring revenue base. Too high = no signups. Too low = unsustainable. | ✅ Yes — one number |
| **Quick Question: $5 — too low?** | This is the conversion point. $5 is intentionally low to get first-time payers. | ✅ Yes |
| **Video Review: $15 / $35 — worth his time?** | At $35 for 15-min watch + response = ~$140/hr effective. Does that feel right? | ✅ Yes |
| **Stripe account — does he have one?** | Without Stripe, no online payments. Venmo/PayPal are fallbacks but not scalable. | ⚠️ He needs to set this up |
| **voix-vive.com — ready to go live?** | Domain is purchased. DNS change takes 30 minutes. Once flipped, the site is public. | ✅ Yes — DNS records only |

### What's Already Locked In (Don't Re-Negotiate)

- **The 12-chapter structure** — Built, tested, populated with art. Changing chapter order = full rebuild.
- **The 3 protocols** (©SHEARL, ©PLING!, ©FHEAL) — These are Bertrand's IP and the curriculum's backbone.
- **Bertrand owns everything** — Platform code + curriculum + trademarks are 100% Bertrand's. Joshua built this as a gift.
- **License TBD** — Bertrand will decide whether to open-source, keep proprietary, or use a hybrid license.

### What's Flexible (Can Change Thursday)

- All prices
- Service descriptions and names
- Which payment methods to list
- Whether to launch immediately or wait
- Chapter titles and slide text (content changes, not structural)
- Tool names and descriptions in the Digital Binder
- Whether to add/remove the Francophone marketing section

### Open Questions For Bertrand

1. Does the "self-discovery arc" framing resonate? (Safety → Commitment → Listening → Spatial → Integration → Mastery → Freedom)
2. Which tools does he want to demonstrate to students first?
3. Does he want a "Welcome" video embedded on the landing page?
4. Is there anything in the Timeless Song historical slides he'd want to change or add?
5. Timeline: launch this weekend, or wait for Stripe setup first?
6. **NEW:** Inner Voice / Outer Voice curriculum — should this be Frets 13–24, a parallel track, or embedded within existing frets?
7. **NEW:** Voice cloning for slide narration — does he consent to AI voice generation from his YouTube audio?
8. **NEW:** Carleton Project integration — which sub-categories (tone, timber, projection, articulation, linguistics, breath support) are ready for content?

---

## IX. THE SOVEREIGN FACTORY — ADDIECRAPEYE Lifecycle

> *The PEARL goes in the CRAP.*
> — Joshua Atkinson, Purdue EDCI 57300

### What Is ADDIECRAPEYE?

ADDIECRAPEYE is a 10-phase, 3-layer instructional systems engineering pipeline created by Joshua Atkinson. It takes raw subject matter and compiles it into localized, high-performance visual structures. The framework bridges instructional design theory (ADDIE) with visual systems architecture (CRAP — Robin Williams' canonical design principles) and real-time execution telemetry (EYE).

```
[ PHASE 1: CONCEPTUAL INTAKE & SYSTEMIC DESIGN ]
   ├── A  — Analysis (Raw Asset & SME Data Parsing)
   ├── D  — Design (Backward Mapping & Bloom's Taxonomy Contract)
   ├── D  — Development (Artifact Compilation)
   ├── I  — Implementation (Platform Stage Deployment)
   └── E  — Evaluation (Continuous Alignment Metrics & QM Rubric)
         │
         ▼ The Engineering Bridge: Concept → Visual Output
[ PHASE 2: VISUAL SYSTEMS ARCHITECTURE & COGNITIVE LAYOUT ]
   ├── C  — Contrast (Visual Weight, Typographic Scale, & Optical Hierarchy)
   ├── R  — Repetition (Consistent Semantic UI Tokens & Theme Continuity)
   ├── A  — Alignment (Grid Topologies, Anchor Points, & Layout Constraints)
   └── P  — Proximity (Cognitive Slicing, Spatial Grouping, & Layout Margins)
         │
         ▼ The Vibe Coding Feedback Loop
[ PHASE 3: THE LIVE TELEMETRY RUNTIME LOOP ]
   └── EYE — Execution, Yield, and Evaluation (Active Telemetry Engine)
```

**The PEARL** (Performance → Evidence → Activity → Reflection → Learning) is the multi-stakeholder perspective-checking methodology that lives inside the CRAP phases. Before making any visual design decision, PEARL asks: *does this serve the student? the mentor? the engineer? the gift-giver?* — ensuring no visual choice is arbitrary.

### System Invariant
> **No Design Without Structure.** Visual styling (C, R, A, P) is forbidden before structural constraints (A, D, D, I, E) are compiled and validated against the educational schema.

---

### Phase 1: ADDIE — Conceptual Intake & Systemic Design

Applied to Voix Vive:

| Phase | Instructional Action | Voix Vive Realization |
|-------|---------------------|----------------------|
| **A · Analysis** | Parse incoming SME assets using NLP/vision. Map background gaps and learner profiles | Datamined Bertrand's YouTube, DuetPartner, Thumbtack. Built learner profile: adults 30–65 with prior quit history and inner-critic dominance |
| **D · Design** | Enforce strict backward design. Map terminal behaviors to Bloom's Taxonomy | 12-fret monomyth mapped to protocol gates (©SHEARL → ©PLING! → ©FHEAL). Each chapter has measurable exit criteria |
| **D · Development** | Compile tested artifacts: code modules, content strings, media templates | SlideViewer, VertiscaleEngine, Troubadour adventure, 36 Timeless Song slides, 28 concept cards |
| **I · Implementation** | Stage compiled files into the target platform environment | Vercel PWA, mobile-first, touch-optimized. Offline-first via Dexie/IndexedDB |
| **E · Evaluation** | Audit the content architecture against quality rubric | Novice usability testing (Joshua as proxy learner). Curriculum audit against pedagogical intent. `npm run build` as structural validation |

---

### Phase 2: CRAP — Visual Systems Architecture

> Based on Robin Williams' *The Non-Designer's Design Book* — the four canonical principles that transform amateur layouts into professional visual communication.

The PEARL lives here. Each visual decision is checked against all stakeholder perspectives before implementation.

#### C · Contrast — Visual Weight & Optical Hierarchy

*If two things are not the same, make them very different.*

| Voix Vive Application | PEARL Check |
|----------------------|-------------|
| Gold (#c9a96e) on dark backgrounds (#0a0d14) — maximum readability, zero eye strain | **Student:** Can a 55-year-old read this in a dimly lit room? **Engineer:** Does this pass WCAG AA contrast ratio? |
| Title slides use `clamp(2rem, 8vw, 3.5rem)` — massive typographic scale. Body text at `clamp(1rem, 3vw, 1.15rem)` — comfortable reading | **Student:** Hierarchy is instant — I know what's the heading and what's the detail without thinking |
| Game mode labels (⚡ FLASH, 🪁 IMAGINE, 🎵 AUDIATE) use distinct icons + colors per mode | **Mentor:** Bertrand can name-drop these modes in lessons and students will recognize them immediately |
| Safety banner uses muted green + no-leaderboard messaging — visually distinct from game UI | **Student:** The safety message stands apart from the game. It registers as a separate, reassuring context |

#### R · Repetition — Semantic UI Tokens & Theme Continuity

*Repeat visual elements to bind disparate screens into a unified mental model.*

| Voix Vive Application | PEARL Check |
|----------------------|-------------|
| `--bard-gold: #c9a96e` appears on every screen — NeckMenu, slide labels, game headers, fretboard dots | **Student:** Gold = Voix Vive. The brand becomes subconscious |
| JetBrains Mono for all system labels. Cormorant Garamond for all contemplative body text | **Engineer:** Two font families, used consistently. No drift. No special cases |
| Every portal card (Song, Guitar, Player) uses identical structure: icon circle → title → subtitle → chevron | **Gift-Giver:** The interface looks professional and cohesive — worthy of giving as a gift |
| Phase banners (☽ YIN, ☀ YANG) repeat across all 12 chapters with identical styling | **Mentor:** Bertrand's Yin/Yang framework is visually branded into the platform |

#### A · Alignment — Grid Topologies & Visual Anchors

*Every element must have a deliberate visual connection to another element. No floating orphans.*

| Voix Vive Application | PEARL Check |
|----------------------|-------------|
| NeckMenu frets left-align on a single vertical axis. Icon circles anchor the left edge; chevrons anchor the right | **Student:** The list scans instantly top-to-bottom. No visual searching |
| Slide content centers on a single column, max-width 680px. No multi-column chaos on mobile | **Engineer:** One alignment axis = one responsive breakpoint to maintain |
| Fretboard grid uses strict CSS Grid with equal cell widths. No percentage hacks | **Student:** The fretboard looks clean and geometric — it IS the pattern they're learning |
| Game stats (Round, Stage, Score) align horizontally in a single row, evenly spaced | **Mentor:** Bertrand can point to any metric during a lesson and the student finds it instantly |

#### P · Proximity — Spatial Grouping & Attention Slicing

*Group related items close together. Separate unrelated blocks with negative space.*

| Voix Vive Application | PEARL Check |
|----------------------|-------------|
| Safety banner + Difficulty selector + Mic button are grouped as a single "pre-game setup" cluster, separated from game modes by 24px+ margin | **Student:** Setup is one thing. Game choice is another. They don't bleed together |
| Slide content: label → title → subtitle → body flows as a single visual unit with tight 8-12px gaps. Next slide is separated by a full swipe gesture | **Student:** Each slide feels like one idea, not a wall of text |
| Fretboard dots are tight to their grid cells. Color legend floats 20px below the board with a dividing line | **Engineer:** Visual clutter IS technical debt. Clean proximity = fewer support questions |
| Concept cards use tight internal padding but 16px gaps between cards — each concept is its own visual atom | **Community:** Vocabulary terms feel organized, not dumped. VaaM (§XII) is visually enforced |

---

### Phase 3: EYE — Execution, Yield, Evaluation

The live telemetry runtime loop. After ADDIE builds and CRAP polishes, EYE verifies.

| Sub-Phase | Action | Voix Vive Realization |
|-----------|--------|----------------------|
| **E · Execution** | Spin up the runtime environment. Verify visual outputs and interaction behavior | `npm run dev` → browser testing at mobile (375×812) and desktop viewports. Touch swipe, tap game, pitch gate — all manually verified |
| **Y · Yield** | Document what this cycle produced beyond the original scope | Inner Voice / Outer Voice expansion (§XI). Voice cloning roadmap. Bilingual FR/EN proposal. PEARL convergence insight: "the absence of fear" |
| **E · Evaluation** | Feed findings back into the next Analysis phase. Close the loop | Post-Thursday feedback from Bertrand → new Analysis intake → next ADDIECRAPEYE cycle begins |

### The Recursive Nature

ADDIECRAPEYE is not a waterfall — it is a factory that runs continuously. Each Yield (Y) produces new raw material that feeds the next Analysis (A). The platform never "finishes" — it matures. This is how a living textbook stays alive.

```
                    ┌──────────────────────────────────────┐
                    │                                      │
  A → D → D → I → E ═══► C → R → A → P ═══► E → Y → E ──┘
  ▲                                                        │
  └────────────────────────────────────────────────────────┘
                      The Sovereign Loop
```

### Why This Matters for Voix Vive

Standard ADDIE would stop at the first Evaluate. The product would *function* but it would look amateur, feel disconnected, and fail to communicate the depth of Bertrand's pedagogy visually. The CRAP bridge transforms structural content into visual communication that respects the student's cognitive load. The EYE loop ensures the visual system stays calibrated against real usage.

For a platform built on the axiom *"You are an instrument playing an instrument"* — the visual system IS the instrument. If the layout is cluttered, the student's mind is cluttered. If the alignment is sloppy, the student's practice feels sloppy. **Visual clutter is pedagogical debt.**

---

## X. THE PEARL — Multi-Stakeholder Perspective Analysis

> *Performance → Evidence → Activity → Reflection → Learning*

PEARL is applied here from six stakeholder perspectives. Each perspective reveals a different facet of the same platform. The "pearl" — the wisdom — is what emerges when you see all six at once.

### Perspective 1: 🎸 The Student (Adult Beginner)

> *"I tried guitar before. I stopped because I felt stupid."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | The student can play a recognizable piece of music within 30 days of starting, without performance anxiety |
| **Evidence** | Slide progress through 12 frets; vertiscale accuracy trending upward; journal entries showing reduced self-criticism |
| **Activity** | The living textbook (free, self-paced), vertiscale game (no leaderboards), breathing gate (somatic safety), adventure mode (narrative play) |
| **Reflection** | Phase 3 FHEAL journal prompts; rotating coaching cues in IMAGINE mode; "Which moment felt like music?" after freeplay |
| **Learning** | Difficulty adapts to consistency (not speed); flash duration shrinks only when accuracy stabilizes; the platform *slows down* for struggling students rather than speeding up |

**The Student's Pearl:** *The platform never tells them they're wrong. It tells them they're learning. The absence of punishment IS the pedagogy.*

---

### Perspective 2: 🎵 The Mentor (Bertrand Laurence)

> *"I love the name Voix Vive BECAUSE it's all about expression, aliveness."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | Bertrand's teaching philosophy reaches 100+ students without requiring him to be present for every interaction |
| **Evidence** | Async video reviews generating revenue; Inner Circle membership growth; student testimonials referencing his specific terminology (©SHEARL, ©PLING!, ©FHEAL) |
| **Activity** | The platform IS his teaching made digital — students interact with his protocols, not generic guitar theory; his voice (future: AI narration) guides the slides |
| **Reflection** | Thursday review calls; student submission inbox; async review queue that shows him exactly where students struggle |
| **Learning** | The à la carte model scales with his effort; the free textbook builds trust; live coaching converts the trust into revenue; the platform does not replace him — it *amplifies* him |

**The Mentor's Pearl:** *Bertrand's magic is not his technique — it's his safety. The platform must replicate the feeling of sitting in his practice nook in Houlton, Maine, where no one is watching and no one is judging. If the platform feels like a test, it has failed Bertrand's pedagogy.*

---

### Perspective 3: 🏗️ The Creator (Joshua Atkinson)

> *"I can build anything in 2 months."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | Deliver a production-ready platform that satisfies both the academic practicum (Purdue EDCI 57300) and the real-world client (Bertrand) |
| **Evidence** | Clean builds, passing browser tests, documented design decisions traceable to learning theory, platform delivered as a gift to the client |
| **Activity** | ADDIECRAPEYE lifecycle, AI-augmented development, conversation-driven iteration, this very document |
| **Reflection** | The IP boundary (Great Game vs. Masterclass) forces disciplined separation of personal philosophy from client-owned content |
| **Learning** | Every feature built for Bertrand is a case study for the practicum; every academic insight improves the platform; the creator and the creation grow together |

**The Creator's Pearl:** *The platform is not just a product — it's a thesis. The thesis is: "Constructivist learning science, applied with empathy and rigor, can turn a single music teacher's expertise into a scalable, revenue-generating, dignity-preserving digital ecosystem." If that thesis fails here, it fails everywhere.*

---

### Perspective 4: ⚙️ The Engineer (The Codebase)

> *"No mocking. No pretending to work. Every output must compile."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | Zero runtime errors; sub-200ms interaction latency; offline-first PWA reliability; one AudioContext shared across all tools |
| **Evidence** | `npm run build` passes; browser tests confirm all flows; no orphaned state; localStorage persistence verified |
| **Activity** | Singleton `audioEngine.js`; flash timer using `performance.now()` (not `Date.now()`); pitch detection via AudioWorklet (not ScriptProcessor); pattern data from single source (`vertiscalePatterns.js`) |
| **Reflection** | Design docs updated in the same session as code changes; CONTEXT.md as the system's own memory |
| **Learning** | Architecture decisions propagate: the difficulty multiplier pattern (consistency score floor) can be reused for all future adaptive mechanics; the NeckMenu component serves Song, Guitar, and Player with zero duplication |

**The Engineer's Pearl:** *Clean architecture IS pedagogy. If the code is tangled, the student's experience is tangled. A singleton audio engine means no mic conflicts. A single slide generator means no content drift. The engineer's discipline is the invisible foundation of the student's safety.*

---

### Perspective 5: 🎁 The Gift-Giver (Secondary User)

> *"I want to give my partner something that says: I believe you can do this."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | The gift-giver can purchase a meaningful, personal gift in under 3 minutes — and the recipient feels seen, not overwhelmed |
| **Evidence** | Gift certificate delivered (PDF/email); clear description of what the recipient receives; no subscription trap |
| **Activity** | StudioPage gift section; $60–$275 range; redeemable for any service; printable certificate |
| **Reflection** | The gift-giver sees: "Your loved one will receive access to Bertrand's 12-chapter curriculum (free) plus [N] private lessons with a master guitarist." — Not: "Here's a login to a web app." |
| **Learning** | Future: personalized gift messages; "Gifted by [name]" shown on the recipient's dashboard; the relationship itself becomes part of the learning ecology |

**The Gift-Giver's Pearl:** *The gift is not the platform. The gift is permission. Permission to try again, to be bad at something, to sound wrong in a safe space. The certificate's value is emotional, not transactional.*

---

### Perspective 6: 🌍 The Community (Future Inner Circle)

> *"I want to learn alongside people who understand that this is more than technique."*

| PEARL | What It Means Here |
|-------|-------------------|
| **Performance** | A self-sustaining community of 50+ adult learners sharing practice, asking questions, and supporting each other — without toxicity or competition |
| **Evidence** | Monthly group Q&A attendance; peer encouragement in shared spaces; students referencing each other's progress with warmth |
| **Activity** | Inner Circle membership ($25/mo or $199/yr); monthly group Q&A with Bertrand; downloadable Vertiscales; community practice rooms (future) |
| **Reflection** | Bertrand's presence in the community is the anchor — but the community must be able to sustain itself between his appearances; the Phase 3 journal could be optionally shared |
| **Learning** | Community norms emerge from the platform's values: no speed scoring, no leaderboards, mistakes are OK, your practice is private (unless you choose to share) |

**The Community's Pearl:** *The community IS the curriculum's final chapter. Chapter 12 is "Master of Two Worlds" — the student returns to the community with the elixir of their own practice. A healthy Inner Circle is proof that Bertrand's pedagogy works at scale.*

---

### The Convergence: What All Six Perspectives Share

When you lay all six PEARLs side by side, a single truth emerges:

> **Every stakeholder's success depends on the same thing: the absence of fear.**

- The student needs to be unafraid of wrong notes
- The mentor needs to be unafraid of scaling his intimacy
- The creator needs to be unafraid of merging academic rigor with real-world revenue
- The engineer needs to be unafraid of simplicity (fewer abstractions = fewer bugs)
- The gift-giver needs to be unafraid of giving something unconventional
- The community needs to be unafraid of vulnerability

This is why the platform's anti-dopamine, anti-leaderboard, anti-speed-scoring philosophy is not a design choice — it is the *load-bearing wall* of the entire architecture. Remove it, and every perspective collapses.

---

## XI. THE SECOND OCTAVE — Inner Voice / Outer Voice Expansion

> *"I also integrate into the practice fun-de-Mentals of the physical voice... the Inner Voice (conscious, self-talk, journaling, dreams, song writing...) with the Outer Voice (tone, timber, projection, articulation, linguistics, breath support)"*
> — Bertrand Laurence, May 19, 2026 (re: Carleton Alternative Education Project)

### The Proposal: Frets 13–24

The current 12 frets = **The Guitar Octave** (chromatic scale, Hero's Journey, instrument mastery).

Frets 13–24 = **The Voice Octave** (same fret metaphor, same slide infrastructure, but the content shifts from guitar mastery to vocal-somatic mastery — the full meaning of "Voix Vive").

```
THE INNER VOICE (Frets 13–18)
────────────────────────────────────────────────────────────────
Fret 13 · C' — Self-Talk         "Notice the words you say to yourself while playing"
Fret 14 · C#' — Journaling       "Write about your practice without judgment"
Fret 15 · D' — Dreaming          "What does your inner musician sound like?"
Fret 16 · D#' — Songwriting      "Turn your self-talk into lyrics"
Fret 17 · E' — Consciousness     "Observe your thoughts while playing — don't follow them"
Fret 18 · F' — Integration       "The inner voice guides the outer voice"

THE OUTER VOICE (Frets 19–24)
────────────────────────────────────────────────────────────────
Fret 19 · F#' — Tone & Timber    "Shape the sound of your voice alongside the guitar"
Fret 20 · G' — Projection        "Fill the room without force — breath is the engine"
Fret 21 · G#' — Articulation     "Words and notes, crisp and clear"
Fret 22 · A' — Linguistics       "Language shapes how you sing — English, French, music"
Fret 23 · A#' — Breath Support   "The diaphragm as the second instrument"
Fret 24 · B' — Full Expression   "Inner and outer unite — this is voix vive"
```

### Why This Matters

1. **Brand completion:** "Voix Vive" means "The Living Voice" — but the current 12 frets are about guitar, not voice. Frets 13–24 complete the brand promise.
2. **Carleton Project alignment:** Bertrand is already teaching this content at the alternative education school. It needs a home.
3. **Revenue expansion:** The Voice Octave can be a premium product — the first 12 frets remain free (guitar funnel), the second 12 frets become the paid Masterclass.
4. **Bilingual opportunity:** Fret 22 (Linguistics) naturally accommodates French/English bilingual content — directly serving the Francophone market.
5. **Same infrastructure:** No new components needed. `chapterData.js` already supports adding frets. `slideGenerator.js` produces slides from the same structure. The NeckMenu renders them identically.

### PEARL Analysis of the Voice Octave

| PEARL | The Voice Octave |
|-------|-----------------|
| **Performance** | Student can sing a note, match pitch, and speak/perform lyrics with clear articulation — while playing guitar simultaneously |
| **Evidence** | Mic-based pitch tracking (existing PlingTrainer); journal entries (existing Phase 3); recorded practice sessions |
| **Activity** | ©PLING! protocol expanded: sing before you play → sing WHILE you play; voice projection exercises; breath support drills |
| **Reflection** | "Which felt more alive — the guitar or your voice? Were they the same instrument?" |
| **Learning** | The Voice Octave cannot exist without the Guitar Octave. Frets 1–12 prepare the body; Frets 13–24 liberate the voice. The dependency is pedagogically intentional |

---

## XII. BILINGUAL / INTERNATIONALIZATION STRATEGY

### Why i18n?

Bertrand is already bilingual (French/English). His Duet Partner site lists "Éducation Francophone" as a service. The brand name itself — *Voix Vive* — is French. The Francophone market (Quebec, Louisiana, France, West Africa, Belgium/Switzerland) represents 180M+ potential students and is underserved by English-only guitar platforms.

### Technical Approach: `react-i18next`

The standard React internationalization library. All hardcoded strings move to `locales/en.json` and `locales/fr.json`, components use `{t('key')}` instead of inline text, and a language toggle (🇺🇸 / 🇫🇷) appears in the header.

### Implementation Phases

| Phase | Scope | Effort | Dependency |
|-------|-------|--------|-----------|
| **A: Infrastructure** | Install i18next, create locale files, add provider + toggle | 2-3 hours | None |
| **B: French Translation** | Translate curriculum (12 chapters), pricing, UI chrome | 4-6 hours | Bertrand reviews brand terms |
| **C: Spanish** (deferred) | Add `locales/es.json`, same structure | 4-6 hours | Native speaker review |

### Brand Terms Requiring Bertrand Approval

©PLING!, ©SHEARL, ©FHEAL, "You are an instrument playing an instrument", "Practice TOO SLOW", "The Living Voice", "Inner Circle" — these are Bertrand's coined terms. French equivalents must be approved by him before shipping.

### Quick Win: Bilingual Landing Section

Before full i18n, add a French welcome panel to the Landing page: *"Voix Vive — La Voix Vivante. Bertrand Laurence enseigne la guitare en français et en anglais."* Zero engineering effort, immediate signal to Francophone visitors.

---

## XIII. AI TROUBADOUR EVALUATION SYSTEM

### Concept

A premium AI-powered singing/playing evaluation system that analyzes student recordings and generates feedback in Bertrand's pedagogical voice. Positioned as a premium feature above the free textbook tier.

### Technical Stack (Built on Existing Components)

| Existing Component | Troubadour Use |
|--------------------|---------------|
| `PlingTrainer.jsx` | Core — real-time pitch detection via mic |
| `MicrotonalTracker.jsx` | Core — cents-level pitch accuracy (−50¢ to +50¢) |
| `audioEngine.js` | Infrastructure — centralized Web Audio singleton |
| `PracticeRecorder.jsx` | Storage — saves performances for analysis |
| `RhythmEngine.jsx` | Core — measures timing accuracy |

### New Modules Required

| Module | Purpose | Difficulty |
|--------|---------|-----------|
| `ToneAnalyzer.js` | MFCC extraction → vocal tone classification (warm/bright/nasal/breathy) | Medium |
| `BreathDetector.js` | Amplitude envelope → shallow vs. deep breathing patterns | Easy |
| `PhraseSegmenter.js` | Splits recording into phrases for per-phrase scoring | Medium |
| `TroubadourScorecard.jsx` | Visual radar chart (Pitch/Rhythm/Tone/Breath/Expression) | Easy |
| `BertrandFeedbackGenerator.js` | Fine-tuned LLM generating coaching notes in Bertrand's voice | Hard |

### Anti-Dopamine Evaluation Design

The Troubadour system rejects Yousician-style speed scoring. Instead of "87/100" it says "Your pitch was centered and warm." Instead of combo streaks, it says "Notice how your breathing deepened in the 2nd phrase." This aligns with Bertrand's somatic philosophy: compare only to yesterday, not to a leaderboard.

### Pricing Tiers

| Tier | Price | What Student Gets |
|------|-------|-------------------|
| **Free** | $0 | Basic pitch check (PlingTrainer — already built) |
| **Troubadour Bronze** | $5/eval | Pitch + Rhythm scorecard with AI tips |
| **Troubadour Silver** | $15/eval | Full scorecard + AI-generated Bertrand-style notes |
| **Troubadour Gold** | $35/eval | Full scorecard + actual Bertrand video reaction |

> The Gold tier is the highest-leverage offering: AI handles scoring/analysis, Bertrand spends only 5 minutes recording a personal reaction to the AI-prepared summary. 20-minute job → 5-minute job, same human touch.

---

## XIV. VOCABULARY-AS-MECHANISM — The Voix Vive Lexicon

Per the VaaM principle: language is not description — it is *scaffolding*. Introducing terms too quickly spikes cognitive load. The following lexicon is introduced in strict fret order. A student at Fret 3 should not encounter Fret 9 vocabulary.

### Fret-Locked Vocabulary

| Fret | Unlocked Terms | Plain-English Definition |
|------|---------------|------------------------|
| 1 | **Body Scan**, **Ventral Vagal** | Checking in with your body; the calm nervous system state |
| 2 | **Semitone**, **Dissonance** | The smallest step on a guitar; two notes that clash on purpose |
| 3 | **Pitch**, **Interval** | How high or low a sound is; the distance between two notes |
| 4 | **©PLING!**, **Minor 3rd**, **Beat** | Sing before you play; the sad-sounding gap; the pulse of music |
| 5 | **Major 3rd**, **Warp** | The happy-sounding gap; the B string's 1-fret shift that breaks the pattern |
| 6 | **©SHEARL**, **CAGED**, **Perfect 4th** | See-hear-feel; 5 hand shapes that cover the whole neck; the 4th gap |
| 7 | **Tritone**, **Audiation**, **Third Ear** | The "devil's interval"; hearing music in your mind before playing it; the inner listener |
| 8 | **Perfect 5th**, **Power Chord**, **Resolution** | The strongest harmony; root + fifth (no 3rd); tension released into rest |
| 9 | **Vertiscale**, **Myelination**, **©FHEAL** | Vertical scale shape; brain insulation for learned skills; feel-hear-act-listen |
| 10 | **Minor 6th**, **Vulnerability** | The bittersweet gap; being seen while learning |
| 11 | **Minor 7th**, **Multi-Key Fluency** | The bluesy gap; navigating all 12 keys without thinking |
| 12 | **Major 7th**, **Octave**, **Flow State** | The dreamy gap; the same note one loop higher; effortless absorption |

### Why This Matters

Without fret-locking, a Chapter 1 student could encounter "audiation" or "myelination" and feel instantly overwhelmed — the same cognitive overload that made them quit guitar the first time. VaaM ensures that every new term arrives at the moment the student is *ready* to receive it, not before.

---

## Appendix: Works Cited

1. `CONTEXT.md` — Voix Vive master project context
2. `ROADMAP.md` — Development phases and key decisions log
3. `Gamifying Guitar Learning with Open Source.md` — Technical research (audio, XR, licensing)
4. `09_master_architecture_doc.md` — Prior synthesis and corrections
5. User-provided rough draft (Session 2026-05-18)
6. **The Conductor's Compass** — Joshua Atkinson's isomorphic field guide to instructional design theory (Trinity ID AI OS)
7. **ADDIECRAPEYE** — Atkinson's 10-phase sovereign factory loop: ADDIE (instructional intake) + CRAP (visual systems architecture via Robin Williams' design principles) + EYE (live telemetry)
8. **PEARL** — Performance-Evidence-Activity-Reflection-Learning cycle (Atkinson, Purdue EDCI 57300)
9. **VaaM** — Vocabulary-as-a-Mechanism principle for cognitive load management (Atkinson)
10. Robin Williams, *The Non-Designer's Design Book* — Contrast, Repetition, Alignment, Proximity (the CRAP principles)
11. Bertrand Laurence, private communication (May 19, 2026) — Inner Voice / Outer Voice curriculum expansion from Carleton Alternative Education Project

