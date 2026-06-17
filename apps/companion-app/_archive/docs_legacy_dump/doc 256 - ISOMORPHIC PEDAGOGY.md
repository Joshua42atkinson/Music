# Isomorphic Pedagogy: The Three Pillars

To build an educational system that scales effortlessly (like the Homeschool pivot), the architecture, the daily schedule, and the terminology must be **isomorphic**. This means the structure of the code exactly mirrors the structure of the human experience.

We use the biological progression of sound—from the lungs, to the throat, to the world—as our isomorphic map.

## 1. Souffle (The Breath)
* **Biological**: The foundation of all sound. Involuntary, necessary, grounded in the body.
* **Daily Schedule**: **Morning (Meditation & Breathing)**. The student grounds themselves. They spend 5-15 minutes using the Biometric/Meditation tools to center their nervous system.
* **Software Architecture**: **The Edge/Offline Layer**. The fastest, most foundational layer of the code. (e.g., Kokoro WASM fallback, local state tracking in `tractionStore.js`). It requires no internet and is always available.
* **Pedagogical Protocol**: ©FHEAL (Feel, Heal).

## 2. Voix (The Voice)
* **Biological**: The shaping of breath into meaning and cognition. It is where thought meets air.
* **Daily Schedule**: **Afternoon (Curriculum Review)**. The student logs in for ~15 minutes of cognitive learning. They review the playbook, watch Bertrand's video, and engage with the Troubadour AI to understand the *theory*.
* **Software Architecture**: **The Browser AI Layer (Liquid LFM-2.5-Audio)**. The intelligent, conversational AI running natively in the browser via WebGPU. It handles the interactive Q&A and curriculum pacing.
* **Pedagogical Protocol**: ©SHEARL (Socratic Heuristic).

## 3. Chant (The Song)
* **Biological**: The ultimate expression. Breath and voice combined into art, interacting with an instrument (the guitar).
* **Daily Schedule**: **Evening (Guitar Practice)**. The student picks up the instrument. They apply the morning's grounding and the afternoon's theory into physical execution.
* **Software Architecture**: **The Hub / Desktop Layer (StepAudio R1 / vLLM)**. The heavy, uncompromised, premium AI engine. This is where the highest fidelity Voice Cloning and pedagogical deep-thinking occurs, running on the sovereign home server.
* **Pedagogical Protocol**: ©PLING! (Physical Execution).

---

## Why this solves the complexity:
When everything is isomorphic, you never have to guess where a feature belongs.
* Does a new breathing timer belong on the server? No, it belongs in the **Souffle** (Local/Morning) layer.
* Does the Liquid WebGPU model handle heavy music generation? No, it handles the **Voix** (Afternoon/Browser) conversational layer.
* If a parent wants to add a new curriculum chapter, how long should it take? **15 minutes**. Because it fits perfectly into the *Voix* slot of the daily calendar.

By strictly adhering to this naming convention across the UI, the codebase, and the marketing, the system explains itself.
