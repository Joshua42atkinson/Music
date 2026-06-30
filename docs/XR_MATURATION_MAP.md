# Voix Vive XR — Maturation Map

**The Tao of Potential: What XREAL Aura + Jetpack XR SDK + Bertrand's Pedagogy Can Become**

---

## The Unique Convergence

Three streams meet in this app:

1. **Bertrand's Isomorphic Pedagogy** — A 12-chapter curriculum where the structure of the learning mirrors the phenomena being taught. BE (presence) → DO (technique) → PLAY (expression). Somatic gates ensure the body is ready before the fingers move. The guitar fretboard is taught as geometry, not memorization.

2. **XREAL Aura Hardware** — Optical see-through glasses (< 95g) with 70° FOV, dual world-facing tracking cameras, 6DoF spatial anchoring, hand tracking (25 joints/hand), Snapdragon Reality Elite compute puck, Android XR OS with Gemini. The user sees their real guitar, real hands, real frets — with zero optical latency. This is not VR. This is reality, annotated.

3. **Jetpack XR SDK DP4** — Hand tracking (ARCore), spatial anchors (persistent), plane detection (tables, walls, floors), **AugmentedObject detection** (physical objects with pose + extents + category), custom OpenGL ES meshes, glTF model loading with node-level PBR material control, Compose for XR spatial panels, Gemini Live API for voice, Gemini Nano on-device AI via ML Kit.

**The insight nobody else has**: Simply Piano XR overlays notes on fixed piano keys. Guitar is fundamentally harder — the fretboard is a 2D grid with non-linear spacing, a tuning anomaly (the G-to-B pothole), and two hands doing different things. But that complexity is exactly what spatial computing was built for. The pothole — the single most important structural fact about the guitar — is a 3D geometric concept that flat screens can't teach. In XR, you can *see* the warp in the matrix. You can watch your finger cross the boundary and see the shift happen in space. This is the killer feature.

---

## Hardware Reality Check

### What XREAL Aura Gives Us

| Capability | What It Means for Voix Vive |
|---|---|
| Optical see-through (70° FOV) | User sees real guitar, real hands, real frets. Overlay floats on top. Zero passthrough latency. |
| Hand tracking (25 joints/hand) | Every finger joint tracked in 3D. Index tip → fret position. Thumb → neck grip. Wrist → hand orientation. |
| 6DoF spatial anchoring | Virtual fretboard locks to a position in real space. Stays put when user moves head. Persistable across sessions. |
| World-facing cameras ×2 | Stereo depth perception. Can detect planes, objects, surfaces. |
| Android XR OS | Full Android app ecosystem. Our Kotlin app runs natively. |
| Gemini integration | Voice interface, on-device AI coaching, multimodal perception. |
| 120Hz refresh | Smooth visual tracking, no motion sickness on overlays. |
| < 95g glasses weight | Wearable for a 30-minute practice session without fatigue. |
| Compute puck (Snapdragon Reality Elite) | Enough power for OpenGL ES 3.0 rendering + pitch detection + AI inference simultaneously. |
| No face tracking | Can't detect facial expressions. Body/hand tracking is our input. |

### What We Can't Do (Yet)

- **Detect individual strings** — The world-facing cameras have ~2mm precision at arm's length. Guitar strings are ~0.3-1.0mm thick. We can't reliably see which string the user is touching. We infer from hand position + pitch detection.
- **Detect finger pressure** — Hand tracking gives joint positions, not force. We can't directly sense how hard someone is pressing. We infer from buzz (pitch detection detects fret buzz as inharmonicity).
- **See in the dark** — Optical see-through needs ambient light. No practicing in the dark.
- **Face tracking** — Aura has no face tracking. Can't detect winces, concentration, jaw tension. Body/hand only.

---

## The Maturation Map

### Phase 0 — Scaffold (NOW ✅)

**What exists:**
- `XrFretboardRenderer.kt` — Full OpenGL ES 3.0 renderer (shaders, geometry, instanced potholes, hand joint spheres)
- `HandTrackingManager.kt` — ARCore hand joints → fret position mapping, joint collection for renderer
- `PitchDetectionEngine.kt` — Oboe 48kHz low-latency + YIN algorithm (verified working)
- `VoixViveXrApp.kt` — Compose spatial UI (note display, fret position, tuning, hand status)
- `MainActivity.kt` — Session lifecycle, permission flow, renderer wired in, pitch → renderer pipeline
- Bevy desktop emulator — working fretboard + pitch detection for demo recording

**What's missing:**
- Has never run on actual XR hardware (no dev kit yet)
- No spatial anchor calibration (fretboard floats at arbitrary position)
- No curriculum integration (chapters not loaded into XR app)
- No AI coaching (Gemini Nano not wired in)
- No voice navigation

**Status:** Ready for dev kit. Code compiles, architecture is sound, all APIs are called correctly per DP4 docs.

---

### Phase 1 — First Light (Dev Kit Arrival → Month 2)

**Goal:** User puts on Aura, sees a holographic fretboard floating in space, plays a note, and a pothole lights up.

**Work items:**

1. **Hardware validation**
   - Build and deploy APK to Aura dev kit
   - Verify Session.create() succeeds, hand tracking permission flow works
   - Confirm OpenGL ES 3.0 context creates on Aura's display
   - Test pitch detection via Aura's microphone (compute puck audio input)

2. **Spatial anchor placement**
   - User looks at a flat surface (table, lap), tap to place fretboard anchor
   - Use `Plane.createAnchor()` with `PlaneLabel.TABLE` or manual pose
   - Fretboard renders at anchored position, stays locked when head moves
   - Persist anchor with `Anchor.persist()` so fretboard returns to same spot next session

3. **Hand visualization**
   - All 25 joints per hand rendered as small gold spheres (already in renderer)
   - Verify tracking accuracy: do the spheres match real finger positions?
   - Calibrate offset between tracked joint position and actual fingertip contact point

4. **Pitch → Pothole pipeline**
   - Play a note on real guitar → pitch detection → MIDI note → pothole lights up
   - Verify latency: Oboe buffer → YIN → renderer update < 100ms target
   - Color states: active (pulsing gold), root (gold), scale (blue), inactive (dim)

5. **Minimal UI**
   - Compose spatial panel showing: detected note name, frequency, cents deviation
   - Hand tracking status indicator
   - "Press trigger to place fretboard" instruction

**Deliverable:** A working demo. User wears Aura, places fretboard, plays guitar, sees notes light up. This is the Catalyst program proof-of-concept.

---

### Phase 2 — Guitar Alignment (Month 3 → 4)

**Goal:** The virtual fretboard matches the real guitar's position and orientation. Hand tracking maps to actual string/fret positions.

**Work items:**

1. **Guitar neck detection**
   - Investigate `AugmentedObject` API — can the XR system detect a guitar as a physical object?
   - If not, use manual calibration: user pinches headstock and body with tracked fingers → define fretboard axis
   - Alternative: user places their guitar on a detected table plane, app measures plane + hand positions to infer neck angle
   - Fallback: user manually adjusts fretboard position with hand drag (always available)

2. **Fret position calibration**
   - Map hand tracking coordinates to the virtual fretboard's local space
   - Account for guitar being held at an angle (not flat, not vertical)
   - Use wrist joint orientation to determine neck angle
   - Index tip position projected onto fretboard plane → fret index + string index

3. **The Pothole visualization (Chapter 3)**
   - When user crosses G-to-B string boundary, visually highlight the shift
   - Show a "warp zone" between G and B strings — a translucent band showing the 1-fret offset
   - This is the **killer demo feature** — something impossible on flat screens

4. **String inference**
   - Since we can't see individual strings, infer from:
     - Right hand index tip Y-position relative to fretboard → which string region
     - Pitch detection → which note was played → which string it likely came from
     - Combine both signals for string identification

**Deliverable:** Fretboard aligns to real guitar. User's fingers appear on the right frets. The G-to-B pothole is visible in 3D space.

---

### Phase 3 — Curriculum in Space (Month 5 → 6)

**Goal:** All 12 chapters of the C Scale Journey are playable in XR. BE/DO/PLAY gates function. Bertrand's voice guides the student.

**Work items:**

1. **Chapter data port**
   - Port `cScaleCurriculum.js` to Kotlin (data class with all 12 chapters)
   - Each chapter has: bePhase (content + action), doPhase (exercise type + targets), deepDive, practiceTips, commonMistakes, practicePlan, pillar, protocol, color, ratio

2. **BE Phase — Bertrand speaks**
   - TTS reads chapter content (Android TextToSpeech or Gemini TTS)
   - Spatial panel shows chapter title, Pythagorean ratio, pillar icon
   - User closes eyes, breathes, visualizes (somatic gate)
   - Optional: use Gemini Nano to generate personalized BE phase guidance based on student's progress

3. **DO Phase — Technical fidelity**
   - Exercise types implemented:
     - `sequence` — play target MIDI notes in order, pitch detection verifies each
     - `match-unison` — play fretted note + open string, detect unison
     - `find-note` — play a specific note anywhere on the fretboard
     - `open-strings` — play all 6 open strings with relaxed shoulders
     - `scale-hunt` — play N valid notes from the C major scale
   - Potholes for target notes glow with chapter color
   - Correct note → green flash + chime. Wrong note → dim pulse
   - DO-pass: ≤5 cents average error across 3 consecutive attempts (per pedagogy doc)

4. **PLAY Phase — Expression**
   - User improvises within the chapter's affective frame
   - All C scale notes highlighted on fretboard as available palette
   - Record audio for later review (by AI and/or Bertrand)
   - Spatial panel shows "PLAY mode — express yourself"

5. **Progress tracking**
   - Local storage: which chapters are complete (SharedPreferences or DataStore)
   - Sync with companion app backend (future — Phase 5)
   - Chapter completion requires BE + DO + PLAY tri-tuple pass

6. **Navigation**
   - Voice commands: "next", "previous", "repeat", "practice", "play", "stop", "where"
   - Hand gesture: pinch to advance, open palm to go back
   - Spatial menu: floating chapter selector (12 orbs in a circle)

**Deliverable:** Full 12-chapter curriculum playable in XR. Student can complete the C Scale Journey wearing Aura glasses.

---

### Phase 4 — Truebadour AI Coach (Month 7 → 8)

**Goal:** Gemini Nano lives on the device as Bertrand's AI apprentice — the Truebadour. It coaches in real-time, hands-free, offline.

**Work items:**

1. **Gemini Nano integration**
   - ML Kit GenAI Prompt API for on-device inference
   - System prompt: Bertrand's teaching philosophy + current chapter context + student progress
   - Fallback: Firebase AI Logic hybrid inference (Nano → Flash cloud if unavailable)
   - Inference quota management (exponential backoff on BUSY)

2. **Truebadour personality**
   - Socratic questioning, not lecturing ("What is the color of this chord?")
   - References the Pythagorean ratios, the Five Pillars, the protocols
   - Knows which chapter the student is on, what note they just played, their accuracy
   - Responds in English or French (i18n)

3. **Voice interface**
   - Gemini Live API for real-time speech-to-speech conversation
   - Student says "ask" → Truebadour activates → conversation begins
   - Function calling: Truebadour can emit [TOOL:XXX] tags to navigate chapters, start/stop pitch detection, toggle practice mode
   - Hands-free: student never touches a controller while holding guitar

4. **Contextual coaching**
   - "You just played B natural — that's the 7th. How does it feel? Does it want to go somewhere?"
   - "Your pitch is 12 cents sharp on that F. Try releasing some thumb pressure."
   - "You've been on Chapter 7 for 3 days. Want to review, or are you ready to move on?"
   - "I notice your right hand is tense. Shake it out. The hand must be relaxed."

5. **Assessment literacy (future improvement)**
   - Track metaphor complexity in student responses over time
   - Detect avoidance vs. genuine insight in journal entries
   - Flag patterns for Bertrand's human review

**Deliverable:** Student talks to the Truebadour while playing. AI coaches in real-time, on-device, offline. No controller needed.

---

### Phase 5 — Somatic Layer (Month 9 → 10)

**Goal:** The app senses the student's body state and gates progression on somatic readiness, not just technical accuracy.

**Work items:**

1. **Body scan (BE gate)**
   - Before each session: 2-minute guided breath + posture scan
   - Hand tracking detects: shoulder tension (joint stiffness), hand tremor (position jitter), breathing rhythm (chest movement via wrist position oscillation)
   - BE-score: 0-1 based on detected tension levels
   - BE-pass requires score ≥ 0.85 (per pedagogy doc)

2. **Tension detection**
   - Hand tracking joint angles → grip tension estimate
   - Wrist + forearm joint spacing → muscle engagement
   - Compare to baseline (calibrated during relaxed open strings exercise)
   - Visual feedback: hand spheres turn red when tense, gold when relaxed

3. **Silent Protocol**
   - Student plays exercise 3x without mistake
   - Pitch detection verifies each repetition
   - If any note is wrong → reset counter
   - 3x clean → chapter complete
   - "Practice before bed for best neuropathways" — schedule reminder

4. **Resonance mode**
   - Generative drone matching the chapter's root note
   - Student plays along with drone → intonation feedback
   - Spatial audio: drone comes from the fretboard position in space
   - Beat frequencies visible as pulsing pothole intensity

5. **Breath synchronization**
   - Optional: detect breathing rhythm from chest movement
   - Potholes pulse in sync with breath
   - Play on the exhale, rest on the inhale (Bertrand's method)

**Deliverable:** The app knows if you're tense before you play. It won't let you rush. It enforces Bertrand's somatic pedagogy.

---

### Phase 6 — Performance & Connection (Month 11 → 12)

**Goal:** PLAY mode becomes a performance space. Student records for Bertrand. Community features emerge.

**Work items:**

1. **AI backing band**
   - Generative accompaniment based on chapter's scale + chord progression
   - Drum patterns, bass lines, chord pads — all synthesized on-device
   - Student plays over the backing track → real-time pitch detection verifies they're in key
   - Tempo control via voice ("slower", "faster")

2. **Recording for Bertrand**
   - Audio + hand tracking data recorded simultaneously
   - AI pre-screens: flags timing issues, pitch problems, tension patterns
   - Generates draft review with timestamps
   - Bertrand reviews AI analysis, records 2-3 min video feedback
   - This is the mentorship monetization engine (see business plan)

3. **CAGED in 3D**
   - Chapter 12 expanded: see all 5 CAGED shapes overlaid on the fretboard simultaneously
   - Each shape in a different color, translucent, showing the fractal geometry
   - User can toggle shapes on/off with voice ("show me the G shape")
   - Barre chord visualization: see the index finger as a bar across all strings

4. **Vertiscales in 3D**
   - Bertrand's original vertical scale concept rendered as floating columns
   - Each column = one string, showing the scale notes ascending
   - The G-to-B shift is visible as a step between columns 3 and 4
   - This is something flat worksheets can't show — the vertical geometry in 3D space

5. **Companion app sync**
   - Progress syncs between XR app and PWA companion app
   - Student can review chapters on phone, practice in XR
   - Bertrand can see student's XR session data in mentor dashboard

**Deliverable:** Student performs with AI backing, records for Bertrand, sees CAGED geometry in 3D. The full BE → DO → PLAY → TRANSCEND cycle.

---

## The Chapter → XR Feature Matrix

| Chapter | Title | Pillar | XR Feature |
|---|---|---|---|
| 1 | Supporting Beams (1-3-5) | Theory | Triad potholes glow in sequence — see the skeleton of harmony |
| 2 | Music By Numbers | Theory | Numbers float above each pothole (1-7) instead of note names |
| 3 | The Pothole | Fretboard | **Warp zone visualization** between G and B strings — the killer feature |
| 4 | The 7th | Ear | Tension visualization — 7th pothole vibrates, root pothole pulls it |
| 5 | Open Strings | Body | Breath sync — potholes pulse with detected breathing rhythm |
| 6 | 5th Fret Unison | Fretboard | Connection lines between matching fretted + open string potholes |
| 7 | Root Note (C) | Fretboard | All C notes on fretboard glow gold — gravitational center |
| 8 | Whole Step | Theory | Distance visualization — 2-fret gap shown as a measured span |
| 9 | 1-4 Stack | Fretboard | Vertical columns connecting root to 4th across strings (Vertiscales) |
| 10 | Major 3rd (E) | Ear | Color shift — major (bright) vs minor (dark) pothole comparison |
| 11 | Full Octave Map | Fretboard | Full fretboard grid illuminates — all C scale notes in frets 0-5 |
| 12 | CAGED Seed | Fretboard | 5 overlapping translucent chord shapes in different colors |

---

## API Usage Map

| Jetpack XR SDK API | Phase | What We Use It For |
|---|---|---|
| `Session.create()` | 0 | XR session lifecycle |
| `Hand.left/right` | 0 | 25 joints per hand → fretboard position mapping |
| `HandJointType.INDEX_TIP` | 0 | Fretting position detection |
| `Plane.detect()` + `PlaneLabel` | 1 | Find table/lap to place fretboard anchor |
| `Anchor.create()` + `persist()` | 1 | Lock fretboard to real-world position |
| `SurfaceEntity` + OpenGL ES 3.0 | 1 | Custom fretboard rendering |
| `GltfModel` + `GltfModelNode` | 2 | Load 3D guitar model for calibration reference |
| `AugmentedObject` | 2 | Detect guitar as physical object (experimental) |
| `HitTest` | 2 | Ray from hand → fretboard intersection for calibration |
| `Compose for XR` (SpatialPanel) | 3 | Note display, chapter content, progress UI |
| `ML Kit GenAI Prompt API` | 4 | Gemini Nano on-device Truebadour coaching |
| `Gemini Live API` | 4 | Real-time voice conversation with Truebadour |
| `Firebase AI Logic` | 4 | Hybrid inference fallback (Nano → Flash) |
| `KhronosPbrMaterial` | 5 | PBR materials for fretboard (wood grain, metal frets) |
| `CustomMesh` | 5 | Custom geometry for Vertiscales, CAGED shapes |
| `SpatialAudio` | 5 | Drone positioning, backing band instruments in space |
| `Geospatial API` | Future | Location-based practice environments (practice in a park) |

---

## Competitive Landscape

| App | Instrument | XR Platform | Hand Tracking | Real Instrument Overlay | AI Coach | Curriculum |
|---|---|---|---|---|---|---|
| **Voix Vive XR** | Guitar | XREAL Aura (Android XR) | ✅ 25 joints | ✅ Optical see-through | ✅ Gemini Nano on-device | ✅ 12 chapters, BE/DO/PLAY |
| Simply Piano XR | Piano | Vision Pro, Galaxy XR, Aura | ✅ | ✅ Real + virtual keyboard | ✅ Real-time feedback | ✅ Progressive |
| Fender Play | Guitar | None (phone/tablet) | ❌ | ❌ | ❌ | ✅ Video lessons |
| Yousician | Guitar/Bass | None (phone) | ❌ | ❌ | ✅ Pitch detection | ✅ Gamified |

**Our unique position:** Only guitar-focused XR app with optical see-through + hand tracking + on-device AI coaching + a structured somatic pedagogy. Simply Piano XR proved the model works for piano. Nobody has done it for guitar. The guitar's fretboard geometry (non-linear frets, G-to-B pothole, CAGED fractal) is actually *better suited* to 3D visualization than piano's linear keys.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| No Catalyst acceptance | Medium | High — no dev kit | Bevy desktop emulator still works for demo. Apply again next cycle. |
| AugmentedObject can't detect guitars | High | Low — manual calibration works | Always have manual pinch-to-calibrate fallback |
| Hand tracking precision too low for fret accuracy | Medium | High — core feature | Use pitch detection as ground truth. Hand tracking shows approximate position, pitch detection confirms exact note. |
| Gemini Nano quota limits | Medium | Medium — AI coach throttled | Hybrid inference (Nano → Flash). Cache common responses. Rate-limit proactively. |
| Guitar held at extreme angle breaks tracking | Low | Medium | Detect angle from wrist orientation. Warn user if tracking degraded. |
| Battery life limits session length | Medium | Medium | Compute puck has 4455mAh. Pitch detection + rendering + AI should fit in 30-min session. Monitor power. |
| User already wears glasses | Low | Low | Aura supports prescription lens inserts. |

---

## The Bigger Vision (Year 2+)

Once the core 12-chapter C Scale Journey works in XR:

1. **All 12 intervals** — The full chromatic curriculum (12M.md pedagogy doc) expanded from C major to all 12 keys. Each interval gets its own spatial visualization.

2. **Multi-instrument** — The fretboard renderer is guitar-first, but the same architecture works for bass (4-5 strings), ukulele (4 strings), mandolin (8 strings). The geometry engine is parameterized.

3. **Social practice** — Two Aura users in the same room see each other's fretboards. Jam together with synchronized potholes. Call-and-response exercises (the missing piece identified in the pedagogy critique).

4. **Environment modes** — Zen Garden, Studio, Stage environments from the Bevy engine, rendered as spatial backgrounds. Practice in a Japanese garden. Perform on a stage with virtual audience.

5. **Biometric integration** — Smartwatch HRV data gates practice intensity. High stress → BE mode only. Low stress → DO/PLAY unlocked. The somatic gates become data-driven, not self-reported.

6. **Mentorship at scale** — Bertrand reviews XR session recordings (audio + hand tracking data + AI pre-screen). 12 min → 5 min per review. 2.4x throughput. The business model works.

---

*This document is a living map. It will evolve as we get dev kits, test assumptions, and learn what the hardware can actually do.*
