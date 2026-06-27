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
    *   **PWA implementation (✅ Done):** `useVoiceNav.js` uses Web Speech API `SpeechRecognition` with continuous mode, bilingual command matching (EN/FR: next, previous, play, stop, record, ask, menu, practice, close, read, help). Wired into `CScaleHub.jsx` via `VoiceCommandBar.jsx`.
*   **Local LLM Inference (Gemini Nano):** Instead of downloading heavy GGUF weights into a browser cache for `Wllama`, we route the STT input through the Android OS's built-in **AICore (Gemini Nano)**. This provides instant, zero-latency Socratic responses with zero battery drain.
*   **Text-to-Speech (TTS):** We utilize Android Native TTS (or an embedded local TTS engine loaded with Bertrand Laurence's "DNA" voice samples). The app speaks back to the user instantly.
    *   **PWA implementation (✅ Done):** `useVoiceNav.js` `speak()` uses Web Speech API `speechSynthesis` with locale-aware voice selection (fr-FR / en-US). Kokoro WASM TTS remains available as higher-quality fallback via `TruebadourProvider`.

### 2.2 The Native Acoustic Engine (Pitch Validation)
*   **Bypassing the Browser:** We use Android's Native Audio libraries (`AAudio` or Google `Oboe`) via C++/Rust JNI bindings.
*   **Zero-Latency Pipeline:** The microphone stream is processed natively by highly optimized Autocorrelation/YIN pitch detection algorithms. This guarantees we hit the `< 25ms` latency requirement for the "DO" phase of the Isomorphic Pedagogy loop.

### 2.3 The Hybrid UI
*   The beautiful React/Tailwind UI (C-Scale hubs, FHEAL workbook, Maturation Map) remains intact. It is served inside a highly optimized WebView via Tauri 2.
*   The UI acts purely as a display layer, while the heavy lifting (Audio, AI, Voice) is handled asynchronously by the Native NDK layer below it.

---

## 3. 2026 Research Update — Android XR + ML Kit + Tauri

### 3.1 Tauri Replaces Capacitor
The original spec mentioned Capacitor. We now use **Tauri 2** as the Android wrapper (`src-tauri/tauri.conf.json` already configured with Android target). Tauri is Rust-native, which means the Bevy spatial engine can eventually run as a native library inside the same APK — no separate process needed.

### 3.2 ML Kit GenAI APIs (Gemini Nano Access)
Google's **ML Kit GenAI APIs** provide high-level access to Gemini Nano via the AICore system service. Available now on Snapdragon, Tensor, and Dimensity devices. Key APIs:
- `GenerativeModel` — text generation with system instructions
- Supports LoRA fine-tuning (potential: train on Bertrand's teaching transcripts)
- Zero API cost, zero latency, zero download — pre-installed by Android OS
- Graceful fallback when AICore is unavailable

### 3.3 Android XR / Project Aura
Google's **Android XR** platform is the successor to Daydream. Key facts (as of Google I/O 2026):
- **Android XR SDK:** Developer Preview 3 available now
- **OpenXR 1.1:** Supported via `libopenxr.google.so` — Bevy's `bevy_mod_openxr` targets this directly
- **Project Aura:** XREAL partnership, consumer launch late 2026
- **Developer Catalyst program:** Dev kits ship summer 2026 (apply now)
- **Emulator:** Works today in Android Studio Canary — no hardware needed to start
- **Play Store:** XR apps distributed through Google Play Store

### 3.4 XREAL Air 2 Ultra (Current Hardware)
Two SDK paths exist for the Air 2 Ultra:
- **XREAL SDK 3.0** (Unity-based) — works today with current hardware via USB-C tethering
- **Android XR SDK** — for Project Aura (future, standalone)

The Bevy/OpenXR engine targets Android XR (Path B). Using the Air 2 Ultra with XREAL SDK 3.0 would require a Unity port — not recommended. Instead, use the Android XR emulator for development and apply for a Project Aura dev kit.

### 3.5 Three-Tier AI Fallback
| Tier | Engine | Platform | Cost | Latency | Status |
|---|---|---|---|---|---|
| 1 | Gemini Nano (AICore) | Android on-device | $0 | <100ms | Not built (needs Tauri plugin) |
| 2 | Gemini Flash (cloud API) | PWA + Android | ~$0.075/1M tokens | ~500ms | ✅ `useGeminiTruebadour.js` |
| 3 | wllama (Liquid LFM2.5 8B) | PWA offline | $0 | ~2s first load | ✅ `useWllamaTruebadour.js` |

> **PWA hands-free status (✅ Done):** `useVoiceNav.js` provides STT (Web Speech API) + TTS (speechSynthesis) with bilingual command matching. `VoiceCommandBar.jsx` renders a floating mic button with pulse animation and listening indicator. `CScaleHub.jsx` has a practice mode that collapses all chrome for minimal distraction. The Android native path (Gemini Nano, Oboe) remains for Phase 4.

---

## 4. The Path Forward (Updated Execution Steps)

1. **Tauri Android Build:** Run `cargo tauri android init` in `src-tauri/`. Build first APK (PWA in native wrapper).
2. **Test WebView Audio:** Verify pitch detection latency in Tauri WebView. If < 50ms, defer Oboe. If > 50ms, implement Oboe via Tauri plugin.
3. **Wire Gemini Nano:** Create a Tauri plugin that calls ML Kit GenAI API. Send Truebadour system prompt. Test response quality and latency.
4. **Wire STT/TTS:** Implement `startListening()` via Android `SpeechRecognizer` and `speakText()` via Android `TextToSpeech` — both as Tauri plugins.
5. **Android XR Emulator:** Set up in Android Studio Canary. Test Bevy engine with OpenXR feature flag against the emulator.
6. **Apply for Catalyst:** Submit application to Android XR Developer Catalyst program for Project Aura dev kit.
7. **Port IPC:** Replace WebSocket IPC with Tauri commands for Android (keep WebSocket for desktop).

> [!NOTE]
> *Updated 2026-06-25 with Android XR, ML Kit GenAI, and Tauri research. See `docs/VOIX_VIVE_TECH_PLAN.md` for the full development plan.*
