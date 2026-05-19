# VOIX VIVE
## Master Pedagogical Design Document
### *The TAO of Living Music*

> **Version:** 2.0 — Assembled 2026-05-18  
> **Author:** Joshua Atkinson (Platform Architect) | SME: Bertrand Laurence  
> **Source Batches:** `10_design_doc_01–04.md` in `/research/`  
> **Status:** Living document — update when architectural decisions are made

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

| # | Tone | Stage | Chapter Focus | Protocol | Tool |
|---|------|-------|---------------|----------|------|
| 1 | C — Root | Call to Adventure | The Root Note. Body Scan. Ventral Vagal state. *"Am I safe here?"* | ©SHEARL | Breathing Gate |
| 2 | C# — m2 | Refusal of the Call | *"I don't have time."* Timer reframes time from enemy to ally. | ©SHEARL | Practice Timer |
| 3 | D — M2 | Meeting the Mentor | The Ear Awakens. The mentor is the student's own capacity to hear. | ©PLING! | Pitch Room |
| 4 | D# — m3 | Crossing the Threshold | Committing to the Beat. The metronome does not negotiate. First surrender. | ©SHEARL | Metronome |
| 5 | E — M3 | Tests, Allies, Enemies | Brightness and the Warp. G/B anomaly. The map lies — learn it anyway. | ©SHEARL | Interval Visualizer |
| 6 | F — P4 | Approach to the Inmost Cave | The Full Neck. CAGED System. The thing they most fear: the entire fretboard at once. | ©SHEARL | Fretboard Explorer |
| 7 | F# — Tritone | The Ordeal | The Devil in Music. Sing the tritone before playing it. The mic does not lie. | ©PLING! | PLING! Trainer |
| 8 | G — P5 | The Reward | Precision as Gift. Sub-cent resolution reveals what was invisible. Vibrato becomes intentional. | ©FHEAL | Microtonal Tracker |
| 9 | G# — m6 | The Road Back | Force Threshold. Half pressure. Economy replaces speed. **Vertiscale Phase 1.** | ©FHEAL | **Vertiscale Engine** ⭐ |
| 10 | A — M6 | The Resurrection | Submitting to the Mirror. Practice visible to another person for the first time. | ©SHEARL + ©PLING! | Async Assessor |
| 11 | A# — m7 | Return with the Elixir | Fluency. All 12 keys at once. Navigate keys like rooms — without thinking about the door. | ©FHEAL | Multi-Key Hub |
| 12 | B — M7 | Master of Two Worlds | Rubedo. Free improvisation. No map. No rules. Mastery is silence of the inner critic. | ©FHEAL | Rhythm Engine (Freeplay) |

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
  Fret 6:  Fretboard Explorer   — "Can I face the whole neck?"

INTEGRATION & PRECISION (Frets 7–8)
  Fret 7:  PLING! Trainer       — "Can I sing and play?"
  Fret 8:  Microtonal Tracker   — "How precise am I really?"

MASTERY & FREEDOM (Frets 9–12)
  Fret 9:  Vertiscale Engine    — ⭐ THE GAME
  Fret 10: Async Assessor       — "Can I be seen?"
  Fret 11: Multi-Key Hub        — "Can I see the whole?"
  Fret 12: Rhythm Engine        — "Can I play free?"
```

---

## IV. THE GAME ⭐ — Vertiscale Engine (Fret 9)

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

**Revenue:** 50/50 split on subscriptions after hosting costs. Joshua owns platform code. Bertrand owns curriculum + trademarks.

### License Compatibility (Apache 2.0 Core)

| Library | License | Status |
|---|---|---|
| JS-Hero, fretboard-js, Glicol, pitchlite | MIT | ✅ Compile directly |
| FretPath | Apache 2.0 | ✅ Compile in; document modifications |
| GPLv3 polyphonic detectors | GPLv3 | ⚠️ Isolate as microservice |
| Any GPLv2 library | GPLv2 | ❌ Reject entirely |

**Why Apache 2.0:** Explicit patent grant + Defensive Patent Termination protects DSP algorithms. Trademark Limitations protect ©SHEARL, ©PLING!, ©FHEAL even with open-source code.

---

## VIII. THURSDAY MEETING PREP — Bertrand Sync

> **Meeting date:** Thursday, May 22, 2026
> **Attendees:** Joshua + Bertrand
> **Goal:** Walkthrough of the finished platform, pricing confirmation, domain launch

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
- **50/50 revenue split** — Already documented and agreed.
- **Apache 2.0 open source** — The platform code is open. Bertrand's curriculum content and trademarks are protected separately.

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

---

## Appendix: Works Cited

1. `CONTEXT.md` — Voix Vive master project context
2. `ROADMAP.md` — Development phases and key decisions log
3. `Gamifying Guitar Learning with Open Source.md` — Technical research (audio, XR, licensing)
4. `09_master_architecture_doc.md` — Prior synthesis and corrections
5. User-provided rough draft (Session 2026-05-18)
