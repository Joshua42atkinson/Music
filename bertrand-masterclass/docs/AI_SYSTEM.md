# Voix Vive AI System Architecture

This document provides a high-level overview of the Artificial Intelligence architecture powering the Voix Vive platform, designed to align with Bertrand Laurence's somatic pedagogical philosophy.

## 1. The Troubadour Persona

The AI guide in Voix Vive is known as **The Troubadour**. The Troubadour is not a generic chatbot but an empathetic, Socratic guide designed to redirect the student back to their body, their breath, and their instrument.

- **Pedagogy-First**: Trained specifically on the ©SHEARL, ©PLING!, and ©FHEAL protocols.
- **Somatic Deflection**: The AI avoids offering technical "quick fixes" and instead prompts the student to feel what they are doing ("Where do you feel that tension?").
- **Fret-Aware**: The Troubadour knows the student's current position on the 12-fret Hero's Journey.

## 2. Three-Layer AI Architecture

To ensure resilience, privacy, and accessibility, Voix Vive implements a **Three-Layer AI Cascade**:

### Tier 1: Souffle (Always On, Offline)
- **What**: Rule-based keyword fallback system (`troubadourOffline.js`).
- **Cost/Size**: 0 MB, zero compute cost.
- **Function**: Guarantees that the student always receives guidance, even with no internet connection. Uses Web Speech API for zero-download TTS.

### Tier 2: Voix (In-Browser GGUF)
- **What**: Fully local, in-browser inference using `wllama`.
- **Model**: LFM2.5-1.2B-Instruct-Q4_K_M (~700 MB download).
- **TTS**: Kokoro-82M (~300 MB) running locally.
- **Function**: Provides contextual, LLM-powered responses without sending any data to a server. High privacy, moderate hardware requirements.

### Tier 3: Chant (Server-Side / Dev Mode)
- **What**: Server-backed inference for advanced reasoning.
- **Model**: StepAudio R1.1 33B or Qwen Coder 32B via LM Studio (localhost:1234).
- **TTS**: Qwen3-TTS 0.6B for state-of-the-art voice cloning of Bertrand's voice.
- **Function**: Used for heavy pedagogical analysis or development.

## 3. The Prompt Matrix

The system dynamically builds a compressed prompt (~500 tokens) injecting:
1. **The Student's State**: Current Fret, Bard Level, Streak, Polarities.
2. **The Goal**: The exact phase of practice the student is in (e.g., Flash, Audiate, Reflect).
3. **The Persona**: Socratic, slow, breath-focused.

## 4. Voice Input and Output (TTS/STT)

**Speech-to-Text (STT):**
- Handled primarily by the browser's native Web Speech API (`useVoiceInput.js`).
- Allows hands-free operation while the student is holding a guitar.

**Text-to-Speech (TTS) Cascade:**
1. **Qwen3-TTS 0.6B**: Primary local server TTS for voice cloning.
2. **Kokoro-82M**: Fallback in-browser WASM TTS for French/English.
3. **Web Speech API**: Final fallback utilizing OS voices.

## 5. Extensibility

The AI system is built with future expansions in mind:
- **Fine-Tuning**: A planned Gemma 4 or Qwen 2.5 model fine-tuned entirely on Bertrand's session transcripts.
- **Biometric Sanctuaries**: Using webcam rPPG to dynamically adjust prompt style based on student stress levels (currently mocked).

*For detailed audit and claims mapping, see `11_AI_SYSTEM_AUDIT.md` and `CLAIMS_MAP.md`.*
