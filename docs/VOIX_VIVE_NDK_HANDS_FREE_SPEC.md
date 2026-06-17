# Voix Vive: The Native Hands-Free Paradigm (NDK Specification)

> [!IMPORTANT]
> **PURPOSE OF THIS DOCUMENT**
> This document captures the strategic decision to migrate Voix Vive from a browser-based WebAssembly (WASM) architecture to a Native Android NDK architecture. It serves to permanently cache our research and competitive analysis so that future development can proceed without redundant brainstorming.

---

## 1. The Market Gap & Competitive Analysis

A comprehensive analysis of top Android guitar learning apps (Yousician, JustinGuitar, Fender Play, Simply Guitar) reveals a massive, unaddressed market opportunity:

### The Illusion of "Hands-Free"
Current apps claim to be "hands-free" because they use basic **Audio Recognition** to automatically advance a lesson when the student plays the correct note. 
**The Failure:** They are entirely passive. If a student needs to repeat a section, slow down the tempo, or ask a pedagogical question, they are forced to take their hands off the guitar and physically interact with the screen.

### The Voix Vive Differentiator
No major guitar app on the market uses **Conversational Voice Control (STT/TTS)** as the primary UI navigation and instructional layer. 
By integrating a Socratic AI (Truebadour) with native Speech-to-Text and Text-to-Speech, Voix Vive becomes the world's first **100% Hands-Free Guitar Instructor**. The user never has to stop playing to receive guidance or adjust the app state.

---

## 2. The NDK System Architecture

To achieve this 100% hands-free paradigm and meet the strict constraints of the `VOIX_VIVE_MASTER_THESIS.md` (specifically the `< 25ms` pitch validation requirement), the app must move away from the browser. Web Audio API latency and browser RAM constraints (4GB limit for `Wllama`) are fatal bottlenecks.

The solution is wrapping the Voix Vive "Theory Binder" inside a **Native Android NDK Shell** (using the `MiniTrinity` JNI architecture pattern).

### 2.1 The Native Conversational Engine (Truebadour)
*   **Speech-to-Text (STT):** We utilize Android's native `SpeechRecognizer` via JNI. It listens continuously or via wake-word, allowing the student to ask questions mid-riff (e.g., *"Bertrand, my wrist hurts on this G chord."*).
*   **Local LLM Inference (Gemini Nano):** Instead of downloading heavy GGUF weights into a browser cache for `Wllama`, we route the STT input through the Android OS's built-in **AICore (Gemini Nano)**. This provides instant, zero-latency Socratic responses with zero battery drain.
*   **Text-to-Speech (TTS):** We utilize Android Native TTS (or an embedded local TTS engine loaded with Bertrand Laurence's "DNA" voice samples). The app speaks back to the user instantly.

### 2.2 The Native Acoustic Engine (Pitch Validation)
*   **Bypassing the Browser:** We use Android's Native Audio libraries (`AAudio` or Google `Oboe`) via C++/Rust JNI bindings.
*   **Zero-Latency Pipeline:** The microphone stream is processed natively by highly optimized Autocorrelation/YIN pitch detection algorithms. This guarantees we hit the `< 25ms` latency requirement for the "DO" phase of the Isomorphic Pedagogy loop.

### 2.3 The Hybrid UI
*   The beautiful React/Tailwind UI (C-Scale hubs, FHEAL workbook, Maturation Map) remains intact. It is served inside a highly optimized WebView or Capacitor wrapper.
*   The UI acts purely as a display layer, while the heavy lifting (Audio, AI, Voice) is handled asynchronously by the Native NDK layer below it.

---

## 3. The Path Forward (Next Steps for Execution)

When development on this phase begins, the immediate engineering steps are:

1. **Scaffold the NDK Wrapper:** Create `apps/voix-vive-android`, using the `MiniTrinity` Bevy + AndroidNativeActivity blueprint.
2. **Wire the Audio JNI:** Connect the microphone stream to an `Oboe` C++ engine for pitch detection, bypassing WebView audio.
3. **Wire the Voice JNI:** Implement the `startListening()` STT hook and the `speakText(String)` TTS hook using Bertrand's voice model.
4. **Wire AICore:** Connect the conversational inputs to Gemini Nano for on-device Truebadour inference.

> [!NOTE]
> *This concludes the strategic brainstorming phase. This document serves as the permanent blueprint for the Hands-Free NDK Guitar App.*
