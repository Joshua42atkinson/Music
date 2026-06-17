# Voix Vive — Minimum AI Mode: Three-Layer Troubadour Architecture

> **Purpose:** Define the always-on, progressively-enhanced AI system. Audio is the product. The LLM teaches. No student is ever without a guide.
> **Last Updated:** 2026-06-01
> **Source:** Codebase audit + LFM2.5 research + Kokoro-82M + Qwen3-TTS + Voxtral + StepAudio TTS research
> **Kriya Principle:** The workbook IS the guru. The lowest tier must still teach.
> **Brand Principle:** "Voix Vive" = "Living Voice." The voice IS the product. Cheap TTS kills the app.

---

## 1. The Three Layers

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 1: SOUFFLE — Always On (0 MB, no server, no download)│
│  Offline static prompts + Web Speech API TTS               │
│  Every student gets this. No exceptions. No toggle needed.  │
├──────────────────────────────────────────────────────────────┤
│  LAYER 2: VOIX — Living Voice (~2.5 GB, in-browser, toggle) │
│  LFM2.5-1.2B-Instruct GGUF + Qwen3-TTS 0.6B (GGUF+ONNX)  │
│  Student toggles 🔮/🤫. Audio stays on. LLM chats on/off.  │
├──────────────────────────────────────────────────────────────┤
│  LAYER 3: CHANT — Full Troubadour (server-required)          │
│  StepAudio R1.1 33B + full prompt engineering + voice stream│
│  The Troubadour speaks with Bertrand's full pedagogy.       │
│  Requires local server (Strix Halo or cloud vLLM).          │
└──────────────────────────────────────────────────────────────┘
```

**Naming:** Souffle → Voix → Chant. These are French (matching the app name "Voix Vive"). They map to Kriya's three mantra levels, Boethius's three musics, and the three portals. The student always has at least a Souffle (breath). They can choose to hear the Voix (voice). The Chant (song) is the full experience.

---

## 2. Layer Details

### Layer 1: SOUFFLE — The Offline Guru

**Kriya parallel:** The workbook IS the guru. Lahiri Mahasaya: *"Do not wait for advice to practice Kriya."* The book alone suffices. So must Voix Vive's lowest tier.

| Component | File | Status |
|-----------|------|--------|
| Offline keyword responses | `src/data/troubadourOffline.js` | ✅ Working — 18 keyword groups + fallback |
| Web Speech API TTS | `src/hooks/useTroubadourAI.js:23-44` | ✅ Working — auto-speaks all responses |
| `aiEnabled === false` gate | `src/hooks/useTroubadourAI.js:55` | ✅ Working — routes to offline |
| Toggle UI (🔮/🤫) | `src/pages/OrientationHub.jsx:341` | ✅ Working |
| Savestate download | `src/data/saveState.js` | ✅ Working — .voixvive export/import |
| Game audio cues | BreathingGate, PitchRoom, SlideViewer | ✅ Working |

**What the student experiences:**
- Types a question → gets a keyword-matched response from Bertrand's actual pedagogy
- Response is spoken aloud via Web Speech API (browser voice, no download)
- Game phases (BE breathing, DO pitch match, PLAY recording) all work with audio cues
- Progress saves locally, exportable as .voixvive file
- **No server, no download, no API key, no network required**

**Limitations:**
- Keyword matching, not generative — can't handle novel questions
- Browser TTS voice quality varies by OS (macOS voices are good, Linux voices are robotic)
- No context awareness — doesn't know the student's bard level or current fret
- No voice interaction — text in, text-to-speech out only

### Layer 2: VOIX — The In-Browser Troubadour

**Kriya parallel:** The mantra spoken aloud (Level 1). The practice has a voice now — it speaks the student's language, adapts to their fret, but it's still a simplified form. The full depth comes later.

| Component | File | Status |
|-----------|------|--------|
| wllama GGUF inference | `src/hooks/useWllamaTroubadour.js` | ✅ Created |
| LFM2.5-1.2B-Instruct GGUF Q4 | `public/models/` (~700 MB) | 🟡 Code ready, model downloaded 2026-06-01 |
| Compressed system prompt | `src/data/troubadourPrompt.js` | ✅ `buildCompressedPrompt()` ~500 tokens |
| Qwen3-TTS 0.6B (GGUF + ONNX) | Not yet implemented | ❌ Next phase |
| Kokoro-82M TTS (fallback) | `src/hooks/useKokoroTTS.js` | ✅ Created (1 French voice) |
| `aiEnabled` toggle | `src/data/tractionStore.js:49` | ✅ Working |

**Model: LiquidAI/LFM2.5-1.2B-Instruct** (primary Voix tier LLM)
- 1.2B parameters, hybrid LFM architecture — **outperforms Qwen3-1.7B** (47% bigger)
- Q4_K_M GGUF ≈ 700 MB — fits in-browser via wllama within 4 GB budget
- Instruct-tuned for tool use, agentic tasks, and reasoning
- LFM2.5-1.2B-Thinking variant: on-device chain-of-thought under 1 GB
- Day-one support: llama.cpp GGUF, ONNX WebGPU, MLX, vLLM, LM Studio
- **Why 1.2B?** Sweet spot: competitive with 1.7B models, fits in-browser, has instruct tuning for pedagogical dialogue, and Liquid4All cookbook has browser demo already working

**LLM Budget Analysis (4 GB max):**

| Model | Params | GGUF Q4 Size | Instruct? | Browser? | Quality vs Size |
|-------|--------|-------------|-----------|----------|----------------|
| **LFM2.5-1.2B-Instruct** | 1.2B | ~700 MB | ✅ Apache 2.0 | ✅ wllama + ONNX WebGPU | ⭐ Best per-byte |
| Qwen3-1.7B-Instruct | 1.7B | ~1.0 GB | ✅ Apache 2.0 | ✅ wllama | Good but 47% bigger for same perf |
| Qwen3-4B-Instruct | 4B | ~2.5 GB | ✅ Apache 2.0 | ✅ wllama | Overkill for pedagogical chat |
| Gemma-3-1B-Instruct | 1B | ~700 MB | ✅ Gemma license | ✅ wllama | LFM2.5 outperforms |
| LFM2.5-350M | 350M | ~229 MB | ❌ Base only | ✅ wllama | Too weak for dialogue |
| Phi-4-mini (3.8B) | 3.8B | ~2.2 GB | ✅ MIT | ✅ wllama | Good but LFM2.5-1.2B wins per-byte |

**Decision: LFM2.5-1.2B-Instruct Q4** — the best in-browser LLM for our budget. Leaves ~3.3 GB for TTS.

**Why GGUF over ONNX for in-browser LLM:**
- wllama loads model directly from OPFS to GPU — 49% less memory than WebLLM, 41% less than Transformers.js
- Decode throughput: wllama 54% faster than WebLLM, 69% faster than ONNX (LlamaWeb paper, May 2026)
- Single file deployment vs sharded ONNX
- Project already has wllama working (`useWllamaTroubadour.js`)

**Why ONNX for TTS (not GGUF):**
- TTS pipelines have multiple components (tokenizer, encoder, decoder, vocoder) — each is a separate model
- GGUF is designed for autoregressive LLM text generation — it doesn't natively support the codec/vocoder components
- ONNX Runtime Web + WebGPU handles each component independently with optimal dispatch
- The Qwen3-TTS 0.6B ONNX INT4 files are already quantized and split (~1.65 GB total)
- **Hybrid approach:** GGUF for the LLM backbone (wllama), ONNX for the codec/vocoder (ORT Web)

**What the student experiences:**
- Types a question → gets a generative AI response adapted to their current fret, phase, and mastery
- Response is spoken aloud via Qwen3-TTS (10 languages, voice cloning) or Kokoro-82M (fallback) or Web Speech API (zero-download)
- Troubadour knows: current fret, phase (BE/DO/PLAY), bard level, streak, completed nodes
- Can toggle LLM off (🤫) — audio cues and offline prompts still work
- ~2.5 GB download on first use (700 MB LLM + 1.65 GB TTS), cached in OPFS
- **No server required after initial model download**

**The Compressed Prompt — Compartmentalized for Teaching:**

The `buildCompressedPrompt()` generates ~500 tokens of structured context. Each section is self-contained so the model knows WHY it responds:

| Section | Purpose | Content |
|---------|---------|--------|
| **Identity** | Who am I? | "You are the Troubadour, a Socratic guitar mentor." |
| **Curriculum** | Where is the student? | Fret number, interval name, polarity, phase-specific coaching |
| **Protocol** | How do I teach? | SHEARL (BE), PLING (DO), FHEAL (PLAY) |
| **Student** | Who am I teaching? | Bard level, streak, momentum state |
| **Rules** | What are my constraints? | Language, length, "Over.", no scores, breath-first |

This is NOT a truncated version of the 33B prompt. It's a **different architecture** — compartmentalized so a 1.2B model can use each section independently without getting confused by too much context.

**Tool Use (Future):**

LFM2.5-1.2B-Instruct supports function calls via `<|tool_call_start|>/<|tool_call_end|>` tokens. This lets it:
- `speak_text(text, locale)` → dispatch to TTS engine
- `navigate_to(node_id)` → move student in DAG
- `set_metronome(bpm)` → control game tools
- `get_student_state()` → pull traction data on demand

This replaces the "inject everything into system prompt" approach with a "pull what you need" approach — much more efficient for a small model.

### Layer 3: CHANT — The Full Troubadour

**Kriya parallel:** The mantra running autonomously (Level 3). The practice has become the practitioner. The Troubadour speaks with full depth, full context, full voice — Bertrand's pedagogy embodied in AI.

**Model: StepAudio R1.1 (33B)**
- Full 33B parameter model with voice synthesis
- OpenAI-compatible API on localhost:9998
- Supports text + audio modalities (voice interaction via WebSocket)
- The prompt engineering is already complete — `buildTroubadourPrompt()` compiles the full student state

**What the student experiences:**
- Speaks or types → gets a voiced AI response with Bertrand's full pedagogical depth
- The Troubadour knows everything: fret, phase, mastery level, archetype, polarity, streak, completed nodes, kid mode
- Voice interaction: speak to the Troubadour, it speaks back (WebSocket streaming)
- Net Protocol: "Over." turns, "Copy. Go ahead." confirmations
- Phase-aware: BE = visualization prompts, DO = "hum this interval", PLAY = "start now"
- **Requires local server (Strix Halo desktop or cloud vLLM)**

---

## 3. Detection Cascade — The Wiring

Current `useTroubadourAI.js` detection order:

```
aiEnabled=false → offline
  ↓
remote vLLM → StepAudio → llama.cpp → LM Studio → offline
```

New detection order:

```
aiEnabled=false → Layer 1 (Souffle: offline + Web Speech)
  ↓
wllama model loaded in OPFS? → Layer 2 (Voix: LFM2.5-1.2B + Kokoro-82M TTS)
  ↓                              uses compressed prompt (~500 tokens)
StepAudio :9998 alive? → Layer 3 (Chant: 33B full prompt + voice stream)
  ↓                        uses full prompt (~2000 tokens)
fallback → Layer 1 (Souffle)
```

**Key change:** Insert wllama detection between the `aiEnabled` check and the external server probes. When wllama is loaded, it becomes the backend. When StepAudio is also available, StepAudio handles TTS while wllama handles text generation.

**Code insertion point:** `src/hooks/useTroubadourAI.js:47-137` (the `detectBackend` function)

```javascript
// After aiEnabled check (line 55), before remote vLLM (line 66):

// 1.5. Try in-browser wllama (LFM2.5-1.2B GGUF)
if (wllamaRef.current?.isReady()) {
  setIsReady(true);
  setBackend('wllama');
  return { connected: true, backend: 'wllama', model: { id: 'LFM2.5-1.2B-Q4' } };
}
```

---

## 4. Audio Architecture — The Voice IS the Product

**"Voix Vive" = "Living Voice."** The app's name is its promise. If the Troubadour sounds robotic, the entire experience collapses. Audio quality is not a feature — it's the foundation.

**Principle:** Audio is NOT toggleable. It is part of the game system. The breathing gate has audio cues. The pitch room requires audio. The metronome is audio. The Troubadour's voice is audio.

The `aiEnabled` toggle controls the **LLM chat** only. Audio continues regardless.

### 4.1 TTS Research — What We Found

| TTS Engine | Quality | Size | In-Browser? | French? | License |
|-----------|---------|------|-------------|---------|--------|
| **Qwen3-TTS 0.6B** | ⭐⭐ SOTA, 10 langs, voice cloning, 97ms streaming | ~1.65 GB (ONNX INT4) | ✅ ONNX Runtime Web (WebGPU+WASM) | ✅ Native French | Apache 2.0 |
| **Kokoro-82M** | ⭐ #1 TTS Arena (beat models 10-100x its size) | ~300 MB (q8 ONNX) | ✅ WebGPU/WASM via `kokoro-js` | ⚠️ 1 voice (SIWIS, <11hrs) | Apache 2.0 |
| **Voxtral 4B TTS** | ⭐⭐ Best French TTS, 20 voices, voice cloning | 2.67 GB (Q4 GGUF) | ✅ Rust/Burn WebGPU | ✅ 9 langs, 20 voices | ⚠️ CC BY-NC 4.0 |
| **Piper TTS** | Good (not SOTA) | 5-100 MB per voice | ✅ WASM/CPU only | ✅ `fr_FR-siwis-medium` | MIT |
| **Web Speech API** | OS-dependent | 0 MB | ✅ Built-in | ✅ OS voices | Free |
| **StepAudio TTS 3B** | SOTA, rap + humming | 9.26 GB BF16 | ❌ Server-only (vLLM) | ✅ | Apache 2.0 |
| **StepAudio 2 Mini** | 8B speech-to-speech | ~4 GB Q4 | ❌ Server-only (vLLM) | ✅ | Apache 2.0 |
| **Orpheus 3B** | SOTA emotional control | 6-8 GB VRAM | ❌ Server-only | ❌ English only | Apache 2.0 |
| **XTTS v2** | Voice cloning from 6s audio | Server-side | ❌ | ✅ 14+ languages | AGPL |

**Decision: Qwen3-TTS 0.6B is the primary in-browser TTS. Kokoro-82M is the lightweight fallback.**

**Why Qwen3-TTS over Kokoro for French:**
- 10 languages natively (including French) vs Kokoro's 1 French voice trained on <11 hours
- Voice cloning from 3 seconds of audio — clone Bertrand's French voice directly
- Cross-lingual: clone a French voice, generate English with French accent (or vice versa)
- Natural language emotion control: "speak with warmth", "whisper softly"
- 97ms first-audio latency with streaming
- Apache 2.0 — fully commercial-use compatible
- ONNX INT4 already quantized: `sivasub987/Qwen3-TTS-0.6B-ONNX-INT8`
- GGUF path also exists: `HaujetZhao/Qwen3-TTS-GGUF` + `predict-woo/qwen3-tts.cpp`

**Why not Voxtral 4B TTS:** Best French TTS available (20 voices, 9 languages, voice cloning from 3s, 2.67 GB Q4 GGUF, runs in-browser via Rust/Burn WebGPU). BUT: base model weights are **CC BY-NC 4.0** (non-commercial only). The Rust code (TrevorS/voxtral-mini-realtime-rs) is Apache 2.0, but the weights license blocks commercial deployment. If Voix Vive goes nonprofit/grant-funded, this could be revisited.

**Why not StepAudio TTS 3B in-browser:** Apache 2.0, 3B params, 9.26 GB BF16. But it requires vLLM/llama.cpp server — cannot run in-browser. The architecture is a 3-component pipeline (Tokenizer + 3B LLM + Flow Matching Decoder + Vocoder) with custom ALIBI-variant attention. No ONNX/GGUF browser path exists. Already available at Chant tier via StepAudio R1.1 33B on :9998.

**GGUF vs ONNX for TTS — the real answer:**
- GGUF is for autoregressive text LLMs — it doesn't support codec/vocoder components
- Qwen3-TTS has 9 separate ONNX components (tokenizer, encoder, decoder, vocoder, etc.)
- The `qwen3-tts.cpp` projects export the LLM backbone (Talker) to GGUF but still use ONNX for codec/vocoder
- **Hybrid is the answer:** GGUF for the LLM part (via wllama), ONNX for the codec/vocoder (via ORT Web)
- No need to build anything — the ONNX INT4 files already exist on HuggingFace

**French TTS improvement path:**
1. **Now:** Qwen3-TTS 0.6B (10 languages, voice cloning, Apache 2.0)
2. **Near-term:** Clone Bertrand's voice from 3 seconds of his French recordings
3. **Future:** Fine-tune Qwen3-TTS on Bertrand's full pedagogical corpus

### 4.2 TTS Priority Cascade

```
Qwen3-TTS 0.6B (10 langs, voice cloning) → Kokoro-82M (lightweight) → Web Speech API (zero-download)
        ↑                                       ↑                       ↑
   ~1.65 GB download                      ~300 MB download        Always available
   French native, 10 languages             1 French voice (thin)   OS-dependent quality
   Voice cloning from 3s audio             #1 TTS Arena            No GPU needed
   97ms streaming latency                   WebGPU accelerated      Robotic on Linux
   Apache 2.0                              Apache 2.0              Free
```

When Kokoro is loaded, ALL Troubadour responses use it — regardless of which LLM tier generated the text. The TTS engine is independent of the LLM engine.

### 4.3 TTS Voice Selection

**Qwen3-TTS 0.6B Voices (primary):**
- 9 built-in preset speakers across 10 languages
- Voice cloning: provide 3s of Bertrand's French recordings → clone his voice
- Cross-lingual: Bertrand's cloned French voice can speak English with French accent
- Natural language control: "Speak with warmth and patience"

**Kokoro-82M Voices (fallback):**

| Context | Voice ID | Description |
|---------|----------|-------------|
| Default (English) | `af_bella` | Warm female, American English |
| Mentor mode (English) | `am_adam` | Male mentor voice |
| French | `8073bf2d` | SIWIS dataset, only French voice available |
| Warm | `af_nicole` | Warm, thoughtful female |
| Calm | `bf_alice` | British English, calm |

**Kokoro French limitation:** Only 1 French voice trained on <11 hours of SIWIS data. Qwen3-TTS solves this.

### 4.4 Audio Sources by Tier

| Audio Source | Souffle | Voix | Chant |
|-------------|---------|------|-------|
| Game audio cues (breath, metronome, pitch) | ✅ Always | ✅ Always | ✅ Always |
| Web Speech API TTS | ✅ Primary | ✅ Fallback | ✅ Fallback |
| Kokoro-82M neural TTS | — | ✅ Fallback | ✅ Available |
| Qwen3-TTS 0.6B (10 langs, cloning) | — | ✅ Primary | ✅ Available |
| StepAudio voice stream | — | — | ✅ Primary |
| **Voice input (STT)** | — | ✅ Whisper/Wllama | ✅ StepAudio |

---

## 5. Kriya Yoga Workbook Contrast

The three-layer architecture mirrors Kriya's three levels of mantra practice:

| Kriya Level | Mantra Practice | Voix Vive Layer | AI Practice |
|-------------|----------------|-----------------|-------------|
| **Level 1** | Mantra spoken aloud (5 min) — external sound guides practice | **Souffle** | Static prompts spoken via Web Speech — the book speaks |
| **Level 2** | Mantra silent (10 min) — internalized, adapts to the moment | **Voix** | Generative LLM + Kokoro TTS in-browser — the living voice adapts |
| **Level 3** | Mantra autonomous (75%+ waking) — the practice IS the practitioner | **Chant** | Full 33B Troubadour + StepAudio voice stream — Bertrand embodied |

**The workbook parallel:** Kriya's workbook is designed so a sincere student can progress alone (Level 1). Voix Vive's Souffle tier must do the same — a student with no server, no download, no AI toggle should still receive meaningful pedagogical guidance from the static prompts.

**The mantra-as-notification parallel:** Kriya engineers an internal notification system (the mantra becomes autonomous). Voix Vive's game audio cues serve the same function — the breathing timer, the metronome click, the pitch reference tone. These are always-on "notifications" that don't require an LLM. They are the game's mantra.

---

## 6. Implementation Plan

### Phase A: Resurrect wllama (Layer 2 foundation)

| Step | What | File | Effort |
|------|------|------|--------|
| A1 | Install `@wllama/wllama` npm package | `package.json` | ✅ Done |
| A2 | Create `useWllamaTroubadour.js` | `src/hooks/` | ✅ Done |
| A3 | Download LFM2.5-1.2B-GGUF Q4_K_M to `public/models/` | ~700 MB | ✅ Done 2026-06-01 |
| A4 | Add wllama detection to `useTroubadourAI.js` cascade | `src/hooks/useTroubadourAI.js` | ✅ Done |
| A5 | Create compressed prompt builder `buildCompressedPrompt()` | `src/data/troubadourPrompt.js` | ✅ Done |
| A6 | Wire wllama backend to TroubadourWidget | `src/components/TroubadourWidget.jsx` | ✅ Done |

**Total:** ~6 hours

### Phase B: StepAudio Mini integration (Layer 2 TTS)

| Step | What | File | Effort |
|------|------|------|--------|
| B1 | Define StepAudio Mini API contract (smaller model, same endpoint) | Design doc | 1 hr |
| B2 | Add StepAudio Mini detection to audioStreamingService | `src/lib/audioStreamingService.js` | 2 hr |
| B3 | Wire Mini TTS as preferred over Web Speech when available | `src/hooks/useTroubadourAI.js` | 1 hr |

**Total:** ~4 hours (depends on StepAudio Mini availability)

### Phase C: Layer 3 already works

StepAudio R1.1 33B is already fully wired. No changes needed for Layer 3.

---

## 7. Model Size Budget

| Layer | LLM Size | TTS Engine | Total Client | Server Required? |
|-------|----------|-----------|-------------|-----------------|
| Souffle | 0 MB | Web Speech API | **0 MB** | No |
| Voix | ~700 MB (GGUF) | Qwen3-TTS (~1.65 GB) + Kokoro (~300 MB) fallback | **~2.65 GB** | No |
| Chant | 0 MB (client) | StepAudio (streamed) | **0 MB** | Yes (:9998) |

All tiers stay well under the 4 GB web inference budget. Voix tier at ~2.65 GB leaves ~1.35 GB headroom.

---

## 8. What This Unlocks

| Before (current) | After (three-layer) |
|-------------------|---------------------|
| AI only works when a server is running | AI always works — at minimum as Souffle |
| Student sees "AI offline" and gets nothing | Student always gets pedagogical guidance |
| No in-browser inference path | 700 MB GGUF + 1.65 GB Qwen3-TTS runs in-browser |
| StepAudio 33B or nothing | Three quality levels, graceful degradation |
| `aiEnabled` toggle kills all audio | Toggle kills LLM chat only, audio stays on |
| One-size-fits-all prompt | Compartmentalized prompt for 1.2B, full prompt for 33B |
| Web Speech API is the only TTS | Qwen3-TTS (10 langs, cloning) primary, Kokoro fallback, Web Speech zero-download |
| 1 thin French voice (Kokoro SIWIS) | Native French + voice cloning from Bertrand's recordings |
| Robotic voice on Linux | Neural voice on all platforms (after ~2.65 GB download) |
| No voice input (text only) | Hands-free: Whisper STT → LLM → Qwen3-TTS (full voice loop) |

**The Kriya test:** Can a sincere student progress using only Layer 1 (Souffle)? If yes, the architecture is correct. The workbook must be the guru.

---

## 9. Hands-Free Voice Architecture

**Goal:** The student should be able to use Voix Vive entirely hands-free. Guitar in lap, no keyboard. Speak → AI responds → speaks back. Navigate the curriculum by voice.

### 9.1 The Voice Loop

```
┌─────────────────────────────────────────────────────────┐
│                    VOICE LOOP                           │
│                                                         │
│  🎤 Student speaks ──► STT (Whisper/wllama)            │
│                           │                             │
│                      Transcribed text                   │
│                           │                             │
│                      LLM (LFM2.5-1.2B)                  │
│                      or StepAudio 33B                   │
│                           │                             │
│                      Response text                      │
│                           │                             │
│                      TTS (Qwen3-TTS)                    │
│                      or Kokoro / Web Speech             │
│                           │                             │
│  🔊 AI speaks back ──► Audio playback                  │
│                           │                             │
│                      Command detection                  │
│                      (navigate, repeat, etc.)           │
│                           │                             │
│                      DAG navigation                     │
│                      / UI action                        │
└─────────────────────────────────────────────────────────┘
```

### 9.2 STT Options for In-Browser

| STT Engine | Size | In-Browser? | French? | License |
|-----------|------|-------------|---------|--------|
| **Whisper Tiny** (ONNX) | ~40 MB | ✅ Transformers.js WebGPU | ✅ | MIT |
| **Whisper Base** (ONNX) | ~150 MB | ✅ Transformers.js WebGPU | ✅ | MIT |
| **Voxtral Mini 4B** (Q4 GGUF) | ~2.5 GB | ✅ Rust/Burn WebGPU | ✅ 13 langs | Apache 2.0 |
| **Web Speech API** (recognition) | 0 MB | ✅ Built-in | ✅ OS-dependent | Free |
| **Silero VAD** | ~2 MB | ✅ ONNX WASM | N/A (detector only) | MIT |

**Recommended:** Whisper Base ONNX (~150 MB) via Transformers.js for Voix tier. Web Speech API recognition for Souffle tier (zero download). Silero VAD for always-on wake word detection.

### 9.3 Voice Commands

The LLM parses intent from natural speech. No rigid command grammar needed:

| Intent | Example Speech | Action |
|--------|---------------|--------|
| Navigate | "Take me to the next fret" / "Go to fret 5" | DAG navigate |
| Repeat | "Say that again" / "Répète" | Replay last TTS |
| Slow down | "Plus lentement" / "Slower" | Reduce TTS speed |
| Switch language | "Parle en français" / "Speak French" | Toggle locale |
| Phase action | "Start breathing" / "Commence la respiration" | Enter BE phase |
| Help | "What should I practice?" | Context-aware guidance |
| Metronome | "Set metronome to 60" | BPM control |

**Implementation:** The LLM's tool-use capability (`<|tool_call_start|>`) dispatches these as function calls. The compressed prompt includes available tools. No separate NLU layer needed — the LLM IS the command parser.

### 9.4 Always-On Listening with VAD

```
Silero VAD (2 MB, always on) ──► detects speech ──► activates Whisper STT
                                                          │
                                                    transcribed text
                                                          │
                                                    LLM processes
                                                          │
                                              ┌───────────┴───────────┐
                                              │                       │
                                         Voice command            Pedagogical query
                                              │                       │
                                         Tool call              Chat response
                                              │                       │
                                         DAG/UI action          TTS speaks back
```

**Key principle:** VAD is always on (2 MB, WASM, negligible CPU). Whisper activates only when speech is detected. LLM processes only when transcription completes. This keeps CPU/GPU usage minimal during silence.

### 9.5 Wake Word (Future)

For true hands-free: "Hey Troubadour" wake word using a small custom keyword model (~500 KB). Trained on "Hey Troubadour" / "Bonjour Troubadour" samples. Opens VAD → full pipeline.
