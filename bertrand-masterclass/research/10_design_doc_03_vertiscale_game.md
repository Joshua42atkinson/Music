# VOIX VIVE — Design Document | Batch 03: The Vertiscale Engine
*Fret 9 — The Game Mode | ©SHEARL → ©PLING! → ©FHEAL*

---

## IV. THE GAME — The Vertiscale Engine (Fret 9)

### What Is a Vertiscale?

Before it was a digital tool, the Vertiscale was a **paper chart** Bertrand drew by hand for his students. It solved a specific cognitive problem: most guitar pedagogy teaches scales horizontally (moving up one string), but real playing is vertical (moving across all six strings at once). The paper chart showed the full vertical cross-section of a scale position — all six strings, all the notes, in the actual spatial relationship the fingers encounter.

Bertrand called it the **"Rosetta Stone of the fretboard"**: once a student truly sees it, they cannot unsee it. The vertical pattern permanently rewires how they read the neck.

The Vertiscale Engine takes this paper chart and makes it a living, three-phase learning game — tied directly to Chapter 9 (The Road Back) and available as the culminating tool for the full curriculum.

---

### The Three-Phase Architecture

The game has three sequential unlockable phases. **They are not difficulty levels — they are developmental stages.** A student cannot reach Phase 3 by being fast. They reach it by demonstrating the biological markers of myelination: slow, accurate, breath-sustained repetition.

```
PHASE 1: SHEARL — See It, Map It
  Protocol: ©SHEARL (Perception)
  Mode:     Vertiscale Flash
  Goal:     Spatial memory formation
  Metric:   Accuracy of finger placement, NOT speed

PHASE 2: PLING! — Sing It, Play It  
  Protocol: ©PLING! (Embodiment)
  Mode:     Note Drops with mic validation
  Goal:     Vocal-motor integration under time pressure
  Metric:   Pitch accuracy before placement (must sing → then tap)

PHASE 3: FHEAL — Feel It, Play Free
  Protocol: ©FHEAL (Expression)
  Mode:     Freeplay over backing track
  Goal:     Bypass analytical brain; express creative impulse
  Metric:   Tracking only (no score) — pure session logging
```

---

### Phase 1: Vertiscale Flash (©SHEARL)

**Concept:** A vertical scale pattern illuminates on the virtual fretboard for a constrained window. The student studies it. The pattern vanishes. They must recreate it from spatial memory by tapping the correct fret positions.

**Game Loop:**

```
1. REVEAL    — Scale pattern lights up on all 6 strings
               Display duration: 2.0s (beginner) → 0.5s (advanced)
               Pattern includes: note names, finger numbers, string labels

2. DARKNESS  — Screen goes dark (or fretboard goes neutral)
               Student has 8 seconds to reproduce the pattern

3. TAP       — Student taps fret positions (mobile touch or fretboard UI clicks)
               Each tap: instant visual feedback (correct = glow, wrong = pulse-red-then-fade)

4. REVEAL    — Correct pattern re-illuminates, overlaid with student's taps
               Diff view: missed notes in amber, correct in green

5. SCORE     — Points awarded (see Scoring Philosophy below)
               Next round begins with same or adjacent pattern
```

**Pattern Library:**
The 12 scale patterns currently supported by FretboardExplorer become the Vertiscale Flash pattern library. Starter patterns:
- Major scale (C, G, D — open position)
- Natural minor (A, E)
- Minor pentatonic (A — the universal entry point)
- CAGED shapes (C-shape, A-shape, G-shape, E-shape, D-shape)

**Progression Logic:**
- Start with 5-note patterns (pentatonic — 2 strings initially)
- Expand to full 6-string patterns as accuracy stabilizes
- Reduce flash window from 2.0s → 1.0s → 0.5s based on `consistencyScore` (not raw speed)
- Unlock adjacent keys (same pattern, new root) before introducing new pattern shapes

---

### Phase 2: Note Drops with Mic Validation (©PLING!)

**Concept:** Glowing orbs descend onto the virtual fretboard in a continuous flow. Before the student can tap a note, they must **sing it** (mic validates pitch) — then tap the correct position. This implements the ©PLING! protocol in real-time: hear internally → vocalize → execute physically.

**Game Loop:**

```
1. ORB SPAWNS     — Note orb appears at top of fretboard column, begins descending
                    Descent speed: slow (120 BPM equivalent) by default
                    Each orb displays: note name, string number, optional finger hint

2. MIC WINDOW     — When orb is 50% of the way down, mic detection activates
                    Student must sing/hum the correct pitch within ±20 cents tolerance
                    Visual indicator: pitch needle animates toward target zone

3. GATE CHECK     — If pitch confirmed: orb turns green, tap window opens (2 bars)
                    If pitch missed:    orb turns amber, tap window opens anyway (penalty)
                    If orb reaches bottom without tap: miss registered

4. TAP            — Student taps the correct fret position on the interactive neck
                    Fretboard responds: string vibration animation + Web Audio note preview

5. FEEDBACK       — Accuracy composite: pitch accuracy + tap timing + breath state
                    (Breath state: did the student hold their breath during mic window? — detect via amplitude dip)
```

**Why the mic gate matters:**
Without the vocal gate, the student defaults to visual pattern matching — they see the orb coming and tap by spatial memory alone. The mic gate forces the pitch to live in their throat **before** it lives in their fingers. This is the neurological core of Bertrand's method.

**Difficulty Parameters (all adjustable, never called "difficulty"):**
| Parameter | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Descent speed | 80 BPM | 120 BPM | 160 BPM |
| Pitch tolerance | ±35 cents | ±20 cents | ±10 cents |
| Orb density | 1 per 4 beats | 1 per 2 beats | 1 per beat |
| Mic window | 3 seconds | 2 seconds | 1.5 seconds |

**Note: Never call these "Easy / Medium / Hard."** Label them by Bertrand's language: "Kinesthetic Awakening / Applied Practice / Flow State"

---

### Phase 3: Freeplay Mode (©FHEAL)

**Concept:** No rules. No orbs. No flash. A backing track plays (generated or from Bertrand's library). The student plays anything they want on the fretboard. The system **listens and records** without judging.

**What's tracked (invisibly, not displayed during play):**
- Notes played vs. scale/mode of backing track (in-key vs. chromatic)
- Note durations (are they rushing? sitting on notes?)
- Gaps (rest is intentional — track silence)
- Pitch bends and microtonal expression (MicrotonalTracker data piped in)

**What's shown after the session:**
- A simple session "impression" — not a score
- Language like: "You spent most of this session in the upper register" or "You played 47 notes. 38 were in key. 9 were chromatic choices — that's interesting."
- One question from "Bertrand" (the AI reflection prompt): *"Which moment felt the most like music to you?"*

**Why no score in Phase 3:**
©FHEAL is specifically engineered to deactivate the prefrontal cortex's analytical interference. A score during or after freeplay would immediately re-engage the inner critic. The reflection prompt replaces the score — it invites reflection without judgment.

---

### Scoring Philosophy (Applies to Phases 1 & 2)

This is not Guitar Hero. Speed is never rewarded. The scoring engine measures **quality of attention**, not rate of execution.

**Score Components:**

| Component | Weight | What It Measures |
|---|---|---|
| **Placement Accuracy** | 35% | Correct fret + correct string |
| **Pitch Accuracy (Phase 2)** | 25% | Cents deviation from target during mic window |
| **Breath Continuity** | 20% | No amplitude spikes or holds during execution (mic tracks this) |
| **Consistency Ratio** | 20% | Variance across a 5-round window — lower variance = higher score |

**What is explicitly NOT scored:**
- Speed of response (only used to unlock next pattern at minimum threshold)
- Number of attempts per session
- Comparing to other students (no leaderboard exists)

**The Streak Mechanic (Anti-Dopamine):**
Streaks in Voix Vive do NOT reward daily logins. They reward **slow practice intervals**. A "streak" is triggered when a student completes 3 consecutive rounds with `breathContinuity > 80%` and `placementAccuracy > 85%`. The reward is not a badge — it is a soft, ambient glow on the practice nook UI and a one-line note from "Bertrand": *"That's the myelination window. Stay here."*

---

### Technical Architecture (Fret 9 — Web Phase)

**Component: `VertiscaleEngine.jsx`**

```
State:
  - phase: 1 | 2 | 3
  - currentPattern: PatternObject (from FretboardExplorer scale library)
  - sessionScores: []
  - micActive: boolean
  - breathState: 'free' | 'held' | 'shallow'
  - orbQueue: OrbObject[]
  - flashVisible: boolean

Dependencies:
  - FretboardExplorer (for scale pattern data + fretboard rendering)
  - PlingTrainer (for mic pipeline — Phase 2 pitch gate)
  - MicrotonalTracker (for cents deviation in Phase 2 + freeplay logging)
  - Metronome (for orb timing grid in Phase 2)
  - AmbientPlayer (backing track in Phase 3 — must be mutually exclusive with metronome)
  - tractionStore (session logging, bardLevel progression)
  - localDatabase (Dexie — store session impressions for PracticeRecorder)

Rendering:
  - Phase 1: FretboardExplorer in "flash mode" (pattern overlay, then dark, then tap-input mode)
  - Phase 2: Custom orb lane component overlaid on fretboard (CSS animation, requestAnimationFrame timing)
  - Phase 3: FretboardExplorer in "freeplay mode" + backing track visualizer
```

**Key Engineering Constraints:**
- Orb timing must use `requestAnimationFrame` + `AudioContext.currentTime` for sub-frame accuracy — NOT `setInterval`
- Mic pipeline (Phase 2) reuses PlingTrainer's Web Audio worklet — do NOT duplicate the AudioContext
- Flash duration timer uses `performance.now()` — NOT `Date.now()` (avoids clock skew)
- Pattern data: extend `FretboardExplorer`'s existing scale state rather than creating a new data source
- Breath detection: amplitude envelope from mic stream; sustained amplitude drop below threshold for 1+ seconds = "held breath" flag

**Phase 2 Mic Integration Sequence:**
```
1. User enters Phase 2
2. Request mic permission (if not already granted from PlingTrainer session)
3. Initialize AudioWorkletNode (reuse existing worklet from PlingTrainer context)
4. On orb spawn: begin buffering pitch data
5. At 50% descent: open mic gate window
6. Compare detected fundamental (Hz) to expected note Hz (from @tonaljs/tonal)
7. Map Hz delta to cents: cents = 1200 × log2(detected / target)
8. If |cents| < threshold: gate passes → green orb
9. Close mic gate; student taps
10. Log: {pitchCents, tapAccuracy, breathState, timestamp}
```

---

### Curriculum Integration

The Vertiscale Engine is not isolated to Fret 9. It runs as a sub-mode in two chapters:

**Chapter 9 (The Road Back — G# / Minor 6th):**
- Phase 1 only (Vertiscale Flash)
- Pattern: Minor pentatonic (A shape — 5 frets only)
- Goal: Student learns the vertical shape without speed pressure
- Exit criteria: 3 consecutive rounds with `consistencyRatio > 0.85`

**Chapter 12 (Master of Two Worlds — B / Major 7th):**
- Phase 3 only (Freeplay)
- No fretboard map visible
- Goal: Student plays freely; session logged to PracticeRecorder for async review
- This is the Rubedo moment — the platform provides the space, Bertrand provides the response

**All Chapters (via Digital Binder, Fret 9):**
- All three phases available in the Binder once Chapter 9 is reached
- Phase 2 unlocks after 5 successful Phase 1 sessions
- Phase 3 unlocks after 3 successful Phase 2 sessions (or manually by reaching Chapter 12)

---

### Future: Android XR Vertiscale (Phase 3 Platform)

When the platform reaches the Bevy/OpenXR build, the Vertiscale Engine transforms from a 2D fretboard into a 3D Mixed Reality experience:

**"Note Drops"** → Glowing orbs descend from above and land on the student's *physical* guitar strings, tracked via camera passthrough

**"Vertiscale Flash"** → The scale pattern is projected onto the student's actual fretboard for 0.5s, then the MR overlay fades — student must play from memory while still *seeing the real guitar*

**"Pitch Darkness"** → All visual overlays removed entirely. Student plays in complete darkness (metaphorically — passthrough still shows the room). Pure ©FHEAL. Only the mic is active.

**Technical requirements for XR phase:**
- `bevy_oxr` for OpenXR runtime
- `oboe` crate (not `cpal`) for sub-millisecond Android audio
- Passthrough camera → fretboard geometry detection (string tracking via CV)
- SharedArrayBuffer ring buffer between Bevy audio thread and Web Audio worklet bridge

---

*Next: Batch 04 — Platform Architecture & Technical Stack*
