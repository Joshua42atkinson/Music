# VOIX VIVE: MASTER THESIS & ARCHITECTURE BLUEPRINT (10/10 SPEC)

> [!IMPORTANT]
> **THE SINGLE SOURCE OF TRUTH**
> This document consolidates the entire intellectual property, pedagogical framework, hardware constraints, and software architecture of the Voix Vive project. Any future AI agents or developers must read this document first.

---

## 1. THE PEDAGOGICAL FRAMEWORK (The Maturation Map)

### 1.1 The Core Philosophy: "Ego as Egg & Shell"
The curriculum bridges somatic trauma treatment, body-centered awareness, neurology, and psychology with guitar learning. We provide temporary structure for systematic growth until the learner outgrows it. Sound must make a physical, emotional impression—learners must pause between notes to observe their internal state.

### 1.2 The Pedagogical Loop (Somatic Studio Prompter)
Every interaction must adhere to the Isomorphic Pedagogy loop, forming a strict Directed Acyclic Graph (DAG) progression:
1. **BE (Somatic Centering):** Anchor breath and release physical tension. (Requires BE-score ≥ 0.85 via breath/posture analysis).
2. **DO (Active Imagination):** Visualize pitch internally before execution. (PitchRoom requires ≤ 5 cents average error).
3. **PLAY (Unscripted Fun):** Open improvisation.
4. **PRODUCE (Share):** Reflect and log the artifact in the FHEAL workbook.

### 1.3 The C-Scale Foundation & 1-4-44 Logic
The journey maps the first five frets across all six strings, bypassing the cognitive overload of the full 12-fret chromatic system.
*   **Stage 1: The Open Map:** Matching the 5th fret to the open strings below it.
*   **Stage 2: The C-Scale Seed:** Fret 0-5 Diatonic mapping (White keys only).
*   **Stage 3: The "Pothole" & Triads:** 
    *   Navigating the G→B glitch: In standard tuning, the G-to-B string transition is a Major 3rd (not a Perfect 4th). The UI must visually warn the user of this "Pothole".
    *   Understanding the supporting beams (1, 3, 5 scale degrees).
*   **Stage 4: CAGED System:** The Rosetta Stone—5 interlocking chord shapes moving up the neck.

---

## 2. THE TRUEBADOUR AI PERSONA (System 1)

### 2.1 Narrative & Mystical Context
The Truebadour is a 33B local model that acts as a Socratic, mystical guide. Its persona is rooted in:
*   Robert Fludd's 1617 Rosicrucian cosmology (The Divine Monochord).
*   Pythagorean mathematics ("Number Five").
*   Leibniz's "Unconscious arithmetic in music".
*   Dream Yoga and somatic awareness.

### 2.2 Socratic Rules of Engagement
*   **No Direct Answers:** The Truebadour never spoon-feeds music theory. If asked "Is this note right?", it must reply with a somatic inquiry (e.g., *"What does correctness feel like in your jaw today? Over."*)
*   **Jungian Archetype Coloring:** Prompting language shifts based on the user's archetype (Sage = analytical, Jester = playful, Caregiver = gentle, Hero = action-oriented).
*   **Ghost Train Detection:** If the user logs 3+ "frustrated" BE check-ins, the AI enters *Maintenance Mode*, shifting to emotional triage rather than technical progression.

---

## 3. THE CORE CLAIMS & RED HAT SAFETY GATES

### 3.1 The Four Core Claims
1. **Geometric String Mastery:** The system teaches the guitar neck as a continuous geometric coordinate plane.
2. **Somatic Acoustic Validation:** The system validates playing in real-time using acoustic pitch validation.
3. **Psychophysiological Pacing:** The system monitors the student's nervous system and dynamically adjusts curriculum pacing (The "Friction" penalty).
4. **Spatial Fretboard Anchoring:** The system projects the coordinate plane directly onto the physical instrument via the Vive XR Elite.

### 3.2 "Red Hat" Safety Testing Gates
A feature cannot proceed to production unless it passes these strict testing gates:

| Gate | Requirement | Testing Methodology |
| :--- | :--- | :--- |
| **Gate 1: Acoustic Latency** | Pitch detection processing and visual render must be `< 25ms`. | Profile WASM Autocorrelation loop under load. |
| **Gate 2: Biometric Privacy** | All HRV/Breath data must remain strictly on-device. | Network packet sniffing; block external API egress. |
| **Gate 3: Spatial Drift** | The digital AR fretboard must not drift more than `2mm` from the physical wood. | Vive depth-sensor SLAM stress testing in Bevy. |
| **Gate 4: XR Elite Compatibility** | The AR Passthrough must achieve 90Hz native on the HTC Vive XR Elite. | Deploy Bevy build directly to WiVRn; measure frame drops. |

---

## 4. THE DUAL-SYSTEM SOFTWARE ARCHITECTURE

### 4.1 System 1: The Theory Binder (React / Tauri)
The React application serves as the **Companion App** and **Theory Binder**. It runs on desktop/mobile and provides the UI, progression tracking, and the "C-Scale Hub".
*   **Aesthetics:** Utilizes Glassmorphism and Mesh Gradients to create a premium, immersive UI.
*   **Role:** Handles all text, video playback, portfolio management, and IP presentation.
*   **Data Sovereignty:** Uses Dexie.js for local IndexedDB storage, ensuring biometric and learning data remains strictly on the user's device.

### 4.2 System 3: The Spatial Player (Native Rust Bevy / OpenXR)
The primary AR experience is built natively in Rust using the **Bevy Engine**.
*   **Hardware Access:** By using `bevy_mod_openxr`, it gains direct access to the HTC Vive XR Elite's 16MP passthrough cameras, 25-joint bare hand tracking, and depth sensor mesh generation.
*   **The WiVRn Bridge:** The Bevy app runs on the desktop and streams wirelessly to the headset via the `io.github.wivrn.wivrn` server.

---

## 5. THE MONETIZATION PIPELINE (The Async Review)
Voix Vive utilizes a "Freemium + High-Touch Mentorship" isomorphic economy.
*   **The Flow:** The Free tier provides Information (the Curriculum). Paid tiers provide Transformation (Human Feedback).
*   **The $45 Async Video Review Workflow:**
    1. Student submits a video via the Fret 10 Coaching Portal.
    2. The mentor queue is hard-capped at a depth of 10 to protect cognitive bandwidth.
    3. Mentor executes a 4-step review: Watch without notes, isolate 3 observations (strength, tension, invitation), record a 60-second voice memo, write FHEAL journal prompts.
*   **SLA:** 7-day turnaround requirement.
