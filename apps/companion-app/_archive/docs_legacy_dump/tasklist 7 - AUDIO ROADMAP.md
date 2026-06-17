# Audio Roadmap — Voix Vive TTS Strategy
> Last Updated: 2026-06-01
> Principle: The voice IS the product. Revenue follows quality.

## Executive Summary

**Current:** Kokoro-82M in browser (1 French voice, no cloning)  
**Target:** Qwen3-TTS 0.6B voice cloning with Bertrand's voice  
**Path:** Server-first deployment → browser-native optimization

---

## Why Server-First is the Right Architecture

The user's AMD Strix Halo has **128GB unified memory**. A 0.6B parameter TTS model is trivial on this hardware. Deploying Qwen3-TTS as a localhost service gives us:

- **Voice cloning today** — no 2-3 week WASM build
- **Zero latency** — localhost is faster than most cloud APIs
- **Still offline** — no internet required, server is local
- **Still private** — audio never leaves the machine
- **Browser stays lightweight** — ~300MB Kokoro vs ~1.65GB Qwen3

Browser-native becomes Phase 3 optimization, not a blocker.

---

## Phase 1: Revenue Now (This Week)

### Deploy Qwen3-TTS 0.6B on Local Server

```
Server: localhost:9999
Model: Qwen3-TTS-0.6B-Base (PyTorch / ONNX)
Function: Voice cloning + streaming TTS
```

**Setup:**
1. Download `Qwen/Qwen3-TTS-12Hz-0.6B-Base` via HuggingFace
2. Install: `pip install -U qwen-tts` (official Qwen package)
3. FastAPI wrapper with `/v1/audio/speech` OpenAI-compatible endpoint
4. Accept: `text`, `voice` (reference audio path/base64), `speed`, `emotion`

**Browser Integration:**
- Add `Qwen3-TTS Server` to TTS cascade in `useTroubadourAI.js`
- Priority: Qwen3 server → Kokoro browser → Web Speech API
- Stream audio via `fetch()` + `ReadableStream` → `AudioContext`

**Revenue Feature:**
- Upload Bertrand's 3-second voice sample
- All AI responses spoken in Bertrand's voice
- Students hear their mentor, not a robot

---

## Phase 2: Testing Framework (Week 2-3)

### Build TTS Evaluation Suite

Test dimensions that matter for guitar teaching:

| Test | What | Why It Matters |
|------|------|----------------|
| **French Guitar Terms** | "Doigté de l'accord de Mi majeur" | Must pronounce musical French correctly |
| **Voice Cloning Fidelity** | Bertrand says "Bonjour" → clone → compare | Revenue depends on voice accuracy |
| **Teaching Cadence** | "Placez votre index... maintenant appuyez" | Natural pauses between instructions |
| **Musical Italianisms** | "Jouez cela legato, pas staccato" | Mixed Italian/French must sound natural |
| **Whisper/Emphasis** | "Écoutez bien" (whispered) | Expression control for emphasis |
| **Latency** | Text input → first audio byte | <500ms feels instant |
| **Long-form** | 60-second guitar lesson narration | No quality degradation |
| **Offline** | No server running → fallback | Graceful degradation |

### Candidate Models to Test

| Model | Runtime | French | Cloning | Browser | Size | License |
|-------|---------|--------|---------|---------|------|---------|
| **Kokoro-82M** | ORT Web | 1 voice | ❌ | ✅ Now | 300MB | Apache 2.0 |
| **Qwen3-TTS 0.6B** | Python server | ✅ Native | ✅ 3s | ❌ (Phase 3) | 1.65GB | Apache 2.0 |
| **Supertonic 3** | ORT Web | ✅ 31 lang | ❌ (paid only) | ✅ Now | ~200MB | Unknown |
| **OuteTTS 1.0 1B** | GGUF / server | ✅ Native | ✅ 10s | ❌ (Phase 3) | ~2GB | Unknown |

### Scoring Rubric

Each model scored 1-5 on:
1. **Naturalness** — Does it sound human?
2. **French Accuracy** — Correct pronunciation?
3. **Cloning Quality** — Does it sound like Bertrand?
4. **Expression Control** — Can we whisper/shout/emphasize?
5. **Latency** — Time to first audio
6. **Offline Reliability** — Works without internet?

---

## Phase 3: Browser-Native (Month 2-3)

### Decision Matrix

After Phase 2 testing, pick ONE target:

**If Qwen3-TTS wins:**
- Build ONNX Runtime Web wrapper for Qwen3-TTS 0.6B
- ~4 weeks: model export, tokenizer JS, audio decode pipeline
- Reference: `faster-qwen3-tts` repo already streams chunks

**If OuteTTS wins:**
- Fork wllama to include `llama.cpp/tools/tts`
- ~3 weeks: C API wrapper, two-model loading, vocoder GGUF conversion
- Reference: MioTTS WASM proves this path works

**If Supertonic 3 wins:**
- Use their existing browser path (ORT Web + WebGPU)
- ~1 week: integration only
- **Trade-off:** No voice cloning. Revenue model changes.

### Fallback Strategy

Regardless of Phase 3 winner, the server-first architecture stays:
- Server = best quality, voice cloning, all features
- Browser = lightweight fallback for basic TTS
- Both use same API: `POST /v1/audio/speech`

---

## Technical Architecture

```
┌─────────────────────────────────────────┐
│  Browser (Voix Vive App)                │
│  ┌─────────────────────────────────┐   │
│  │ TTS Priority:                   │   │
│  │ 1. Qwen3 Server (localhost:9999)│   │
│  │ 2. Kokoro Browser (ORT Web)     │   │
│  │ 3. Web Speech API (OS fallback) │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │ HTTP / WebSocket
┌─────────────────▼───────────────────────┐
│  AMD Strix Halo (128GB)                 │
│  ┌─────────────────────────────────┐   │
│  │ Qwen3-TTS 0.6B Service           │   │
│  │ - Voice cloning                  │   │
│  │ - French optimization            │   │
│  │ - Streaming output               │   │
│  │ - Bertrand voice reference       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Immediate Next Steps

1. **Download Qwen3-TTS 0.6B** to AMD machine
2. **Build FastAPI TTS server** with OpenAI-compatible `/v1/audio/speech`
3. **Wire into `useTroubadourAI.js`** as primary TTS backend
4. **Record Bertrand's 3-second reference** when videos arrive
5. **Build test suite** (French guitar phrases + voice cloning benchmark)
6. **Run Phase 2 evaluation** against all candidates

---

## Why This is the Best Path

- **Revenue this week** — not in 3 months
- **Data-driven** — test before building, not after
- **Architecture future-proof** — server API stays same even if browser path changes
- **Risk-minimized** — if browser-native fails, server still works
- **Leverages existing hardware** — 128GB AMD machine is perfect for this

The voice is the product. Let's ship it.
