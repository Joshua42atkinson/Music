# StepAudio 2.5 + Somatic Gate Vision → Voix Vive Synthesis

**Source:** Joshua's technical report on Bevy/Rust + StepAudio 2.5 + GMKtec Evo X2 architecture
**Date:** 2026-05-28
**Purpose:** Map the target architecture to actionable Voix Vive changes

---

## 1. THE TARGET HARDWARE (You Already Have It)

| Report Spec | Current Reality |
|-------------|-----------------|
| GMKtec Evo X2, AMD Ryzen AI Max+ 395 | ✅ You have this hardware |
| 128GB LPDDR5X @ 8000MHz | ✅ Confirmed |
| ROCm 7.x + vLLM | ✅ Running (localhost:9998) |
| StepAudio R1.1 (current) | ✅ Running on the box |
| **StepAudio 2.5 Realtime** (target) | 🔴 Not yet deployed — newer model with paralinguistics + end-to-end voice |

**The gap:** You're on R1.1. The report describes 2.5. StepAudio 2.5 adds:
- True end-to-end (no ASR→LLM→TTS pipeline)
- Paralinguistic comprehension (vocal stress, hesitation, breathiness)
- Roleplay-specific RLHF (stays in character)
- Sub-second response time

**Action:** Upgrade from R1.1 → 2.5 when StepFun releases the ROCm-compatible weights.

---

## 2. THE SOMATIC GATE (What Voix Vive Already Has, Partially)

The report describes a **pitch-gated progression mechanic** where the student must sing/hum a target frequency to unlock narrative choices.

**Voix Vive already builds toward this:**

| Report Component | Voix Vive Equivalent | Status |
|-----------------|----------------------|--------|
| Low-latency audio capture (Oboe/CPAL) | `usePitchDetector.js` + Web Audio API | ✅ Working |
| McLeod pitch detection | `usePitchDetector.js` (McLeod or YIN) | ✅ Working |
| Target frequency matching | PitchRoom, PlingTrainer | ✅ Working |
| "Somatic Gate" lock/unlock | **Not implemented** — pitch match doesn't gate progression | 🔴 Missing |
| fundsp procedural audio | Web Audio OscillatorNode (Tone.js) | ✅ Working |
| "Silent Space" / audiation pause | **Not implemented** — no mandatory pause before vocalization | 🔴 Missing |

**The upgrade path for Voix Vive:**

```
Current PitchRoom flow:
  Show target note → Student hums → Pitch detected → Show accuracy → Done

Target Somatic Gate flow:
  Show target interval → Silent Space (3-5s mandatory pause)
    → Student audiates internally → Student vocalizes ("The PLING!")
    → McLeod detection confirms pitch + clarity
    → StepAudio 2.5 evaluates paralinguistics (stress, hesitation)
    → If pitch matches AND voice is steady: Gate unlocks → Advance
    → If pitch matches BUT voice shaky: Gate unlocks → AI responds with grounding prompt
    → If pitch misses: Gate stays locked → AI gives encouragement
```

---

## 3. THE 4-LEVEL MASTERY SYSTEM (Port from Day Dream)

The report formalizes Edwin Gordon's Music Learning Theory + Day Dream's mastery tiers:

| Tier | Name | Voix Vive Mapping | What Student Does |
|------|------|-------------------|-------------------|
| ★ | **Hero** — Absorb | BE phase (Imagine) | Read/listen to concept. Internalize through story. |
| ★★ | **Outlaw** — Challenge | DO phase (Hear) | Hum/sing the interval. Pitch detection confirms. |
| ★★★ | **Edge Lord** — Reflect | PLAY phase (Play) | Find interval on fretboard. CAGED mapping. |
| ★★★★ | **Best Self** — Synthesize | MILESTONE / Reflection | Create original phrase. Journal reflection. |

**Current Voix Vive:** Boolean `beCompleted/doCompleted/playCompleted`

**Target Voix Vive:** 4 levels per phase with granular tracking:

```javascript
// Current (boolean)
{ beCompleted: true, beAttempts: 3 }

// Target (4-level + depth)
{ beLevel: 'experienced',      // encountered | experienced | owned | mastered
  beTimeSpent: 420,           // seconds
  beDepthExplored: true,      // did they click "Go Deeper"?
  beAudiationScore: 0.7,      // silent space completion quality
  beParalinguisticState: 'calm', // StepAudio-evaluated
}
```

---

## 4. CAGED → SEMANTIC CHANNEL MAPPING (Formalize Existing Colors)

The report maps CAGED shapes and harmonic intervals to the four somatic channels. Voix Vive already has the channels (from Day Dream's influence via CharacterSheet) but doesn't use them pedagogically.

| CAGED / Interval | Channel | Color | Troubadour Archetype | Core Question |
|------------------|---------|-------|---------------------|---------------|
| Extended intervals (Maj7, 9, 11) | Mind | 🟢 #4a9e6e | The Oracle | "What does this mean?" |
| Minor 3rds, dim, sus4 | Heart | 🟠 #d4783c | The Bard | "Where is the love here?" |
| Root notes, Perfect 5ths, Octaves | Body | 🔵 #4a7eb5 | The Cultivator | "What is my body telling me?" |
| Dominant 7ths, Power chords | Action | 🟡 #c4a43c | The Templar | "How do I make this real?" |

**Voix Vive currently uses these colors in:**
- `CharacterSheet.jsx` (Troubadour Types)
- `TOOLS_CATALOG` protocol colors (SHEARL/PLING!/FHEAL)

**Missing:** The colors are not mapped to intervals or CAGED shapes. Each fret/node should declare its dominant channel, and the UI should reflect this.

---

## 5. THE "GREAT RECYCLER" LOOP (Already Named in Voix Vive)

The report's pedagogical loop:
```
Encounter → Experience → Own
```

Voix Vive's current loop:
```
Read slides → Use tool → Record practice → See progress
```

**The gap:** No explicit "Encounter → Experience → Own" framing in the UI. Students don't know they're in a 3-phase mastery loop.

**Fix:** Add visual badges/animations:
- **Encountered:** Node appears on map
- **Experienced:** Node glows after first tool use
- **Owned:** Node pulses after pitch detection success
- **Mastered:** Node transforms (golden border) after reflection

---

## 6. STEP-AUDIO 2.5 WEBSOCKET INTEGRATION (For Voix Vive)

The report describes a Bevy + tokio-tungstenite architecture. Voix Vive is React/JavaScript, so the pattern translates differently:

| Report (Bevy/Rust) | Voix Vive (React/JS) |
|--------------------|----------------------|
| Isolated tokio thread for WebSocket | WebSocket in Web Worker or Service Worker |
| crossbeam_channel to ECS | postMessage() between Worker and main thread |
| cpal audio thread | Web Audio API AudioWorklet |
| McLeod pitch detection in Rust | `pitch-detection` npm package or WebAssembly |
| fundsp procedural audio | Tone.js / Web Audio OscillatorNode |
| StepAudio 2.5 Realtime API | Native WebSocket to ws://localhost:9998/v1/realtime |

**Key insight:** The report's WebSocket + channel pattern is Bevy-specific, but the OpenAI-compatible Realtime API is language-agnostic. Voix Vive can connect directly via browser WebSocket.

---

## 7. PARALINGUISTIC AI EVALUATION (The Game-Changer)

StepAudio 2.5 doesn't just hear WHAT the student says — it analyzes HOW they say it:

| Vocal Quality | What AI Detects | Pedagogical Response |
|---------------|----------------|---------------------|
| Steady, clear tone | Confidence, readiness | Normal progression |
| Hesitant, breathy | Uncertainty, anxiety | "Take a breath. The note is already inside you." |
| Sharp, rushed | Impatience, force | "Slow down. Listen before you play." |
| Flat, monotone | Disconnection | "Close your eyes. Imagine the sound first." |
| Vibrato, expressive | Flow state | "Beautiful. That is the PLING!" |

**Voix Vive integration:**
- Stream audio chunks to StepAudio during PitchRoom/PlingTrainer
- Receive paralinguistic analysis alongside transcription
- Adjust next prompt based on detected emotional state
- Store paralinguistic state in tractionStore for mentor review

---

## 8. EDWIN GORDON'S AUDIATION ("Silent Space")

The report's most radical pedagogical feature:

> "Before they can act, the player must hold their breath, regulate their nervous system, and actively audiate the target pitch in their mind."

**Implementation in Voix Vive:**

```
Slide: "The Minor Third — The Longing"
  ↓
[Show interval symbol, play reference tone]
  ↓
"Close your eyes. Hear the minor third in the silence."
  ↓
[3-5 second mandatory pause — screen fades, breathing cue]
  ↓
"When you hear it clearly inside, open your eyes and hum it."
  ↓
[Somatic Gate activates — pitch detection + paralinguistics]
  ↓
[Gate unlocks → next slide or tool opens]
```

**Current Voix Vive:** No mandatory pause. Students immediately start humming.

**Fix:** Add an `audiationPhase` boolean to each node. When true, the UI enforces:
1. Breathing cue (from BreathingGate)
2. 3-5 second countdown with fading visual
3. "Hear it first. Then sing it."
4. Only then activate pitch detection

---

## 9. ACTIONABLE PRIORITY LIST

Based on the report + current codebase status:

### This Week (Mechanical, No AI)

| # | Task | From Report | Effort |
|---|------|-------------|--------|
| 1 | **Wire BEWorkbook into Playbook** | 4-level mastery visibility | 1 hr |
| 2 | **Add "Mark Complete" to SlideViewer** | Encounter → Experience → Own tracking | 2 hrs |
| 3 | **Add mandatory audiation pause** | Silent Space mechanic | 3 hrs |
| 4 | **Add depth prompts per node** | Socratic "dig deeper" | 4 hrs |
| 5 | **Formalize CAGED→Channel colors** | Semantic mapping | 2 hrs |

### Next Week (AI-Ready)

| # | Task | From Report | Effort |
|---|------|-------------|--------|
| 6 | **Test buildSystemPrompt() with StepAudio** | Realtime API context injection | 1 day |
| 7 | **Add WebSocket client to Voix Vive** | Direct browser→StepAudio connection | 2 days |
| 8 | **Port pitch detection to Web Worker** | Non-blocking audio processing | 1 day |
| 9 | **Add paralinguistic state tracking** | Store AI-evaluated vocal state | 1 day |

### This Month (StepAudio 2.5)

| # | Task | From Report | Effort |
|---|------|-------------|--------|
| 10 | **Deploy StepAudio 2.5 on GMKtec** | Upgrade from R1.1 | 2-3 days |
| 11 | **Build Somatic Gate UI** | Pitch-locked progression | 3 days |
| 12 | **Add "The PLING!" celebration** | Audiation success feedback | 1 day |
| 13 | **Mentor dashboard paralinguistics** | Bertrand sees vocal stress patterns | 2 days |

---

## 10. THE HONEST ASSESSMENT

**What's already true:**
- ✅ Hardware is ready (GMKtec + ROCm + vLLM)
- ✅ StepAudio R1.1 runs on the box
- ✅ Voix Vive has pitch detection, pitch room, pling trainer
- ✅ Voix Vive has 3-tier persistence (localStorage, IndexedDB, Supabase)
- ✅ Voix Vive is live and used by students

**What's one architecture upgrade away:**
- 🟡 StepAudio 2.5 deployment (waiting on model release/ROCm compatibility)
- 🟡 WebSocket Realtime API client in browser
- 🟡 Somatic Gate mechanic (pitch detection + progression gating)
- 🟡 Audiation pause (3-5 second mandatory silence)
- 🟡 4-level mastery (port from Day Dream)

**What's months away:**
- 🔴 True end-to-end voice (no text transcription step)
- 🔴 Paralinguistic response adaptation (AI changes based on vocal stress)
- 🔴 Bevy/Rust client (separate from current React web app)
- 🔴 Parent authoring tool (node canvas for curriculum design)

**The convergence path:**
The report describes the **final form**. Voix Vive is the **current form**. The bridge is:
1. Port Day Dream's 4-level mastery + depth prompts → Voix Vive React app
2. Add Somatic Gate + audiation pause → Mechanical mode
3. Connect StepAudio 2.5 WebSocket → AI mode
4. Eventually, consider a Bevy/Rust client for the full experience

**Don't rebuild Voix Vive in Bevy.** Enhance Voix Vive with the pedagogical patterns from the report. The Bevy engine is a separate project (Day Dream) that can converge later.
