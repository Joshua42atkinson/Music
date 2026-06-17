# Voix Vive AI System Architecture

This document provides a high-level overview of the Artificial Intelligence architecture powering the Voix Vive platform. It is explicitly designed for our **Ages 14+ Target Audience** (High School & Adult Learners) and is aligned with Bertrand Laurence's somatic pedagogical philosophy.

## 1. Isomorphic Architecture (The Three Pillars)

To ensure infinite scalability and zero technical debt, our AI system perfectly mirrors both our daily curriculum schedule and the biological process of making music. We call this the **Isomorphic Pedagogy**.

### 1. Souffle (The Breath)
* **The Layer:** The Edge / Offline Base.
* **The Role:** Handles grounding, biometric state, offline resilience, and daily schedule parsing.
* **The Tech:** Local `tractionStore.js`, Web Speech API / Kokoro WASM fallbacks. Requires zero internet.
* **Pedagogical Phase:** Morning Meditation / Being (BE).

### 2. Voix (The Voice)
* **The Layer:** The In-Browser Edge AI (The Pearl).
* **The Role:** Conversational, fast, Socratic interaction running natively on the student's hardware.
* **The Tech:** **The Liquid Dual-Brain System** (WebGPU).
  * **The BRAIN:** `Liquid LFM-2.5-3B` runs asynchronously in a WebWorker, silently tracking the student's progress and generating pedagogical "Director's Notes."
  * **The VOICE:** `Liquid LFM-2.5-Audio-1.5B` runs on the active thread, consuming the Director's Note to immediately talk to the student with Voice Cloning, ensuring zero-latency turn-taking.
* **Pedagogical Phase:** Afternoon Theory / Doing (DO).

### 3. Chant (The Song)
* **The Layer:** The Desktop Hub (The Forge).
* **The Role:** The heavy, uncompromised audio analysis engine used for deep musical feedback and ultimate voice cloning fidelity.
* **The Tech:** **StepAudio R1** running on the Sovereign Home Server (e.g., the parent's AMD machine via vLLM). The mobile app sends requests to the Hub over the local network when maximum acoustic fidelity is required.
* **Pedagogical Phase:** Evening Guitar Practice / Playing (PLAY).

## 2. The Hub and Spoke Model

Because the EU AI Act classifies educational AI as high-risk, and because cloud compute costs ruin startup margins, Voix Vive is a **100% Sovereign Tool**.

* **The Spoke (Mobile/Web):** The student's device runs the Voix Layer (Liquid Dual-Brain) natively in the browser via WebGPU. 
* **The Hub (Desktop/Server):** The parent's computer runs the Chant Layer (StepAudio R1). 
* **The Flow:** The Spoke queries the Hub over the local WiFi network. No student voice data or learning telemetry ever leaves the family's house. 

## 3. The Troubadour Persona

The AI guide in Voix Vive is known as **The Troubadour**. The Troubadour is not a generic chatbot but an empathetic, Socratic guide designed to redirect the student back to their body, their breath, and their instrument.

- **Pedagogy-First**: Trained specifically on the ©SHEARL, ©PLING!, and ©FHEAL protocols.
- **Somatic Deflection**: The AI avoids offering technical "quick fixes" and instead prompts the student to feel what they are doing.
- **Audience Appropriate**: Operates at a High School / Adult cognitive level, capable of discussing Pythogarean mathematics, existential friction, and somatic psychology.

## 4. The Prompt Matrix

The system dynamically builds a compressed prompt injecting:
1. **The Student's State**: Current Fret, Bard Level, Streak, Polarities (`tractionStore.js`).
2. **The Dual-Brain Context**: The BRAIN model evaluates the state and generates the exact phase instruction for the VOICE model.
3. **The Persona**: Socratic, slow, breath-focused.
