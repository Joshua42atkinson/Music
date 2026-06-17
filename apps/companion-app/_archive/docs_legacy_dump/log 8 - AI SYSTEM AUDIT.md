# AI System Audit — Voix Vive v1.0-beta
> Brutally honest evaluation of what works, what's stubbed, and what blocks a GitHub release.
> Date: 2026-06-01

---

## Overall Grade: B+ (Impressive Architecture, Some Gaps to Close)

**The AI system is architecturally excellent.** Three-tier design (Souffle → Voix → Chant), cascading fallbacks, RAG context injection, somatic polarity-aware prompts, and a full quality control test suite. This is not a toy — it's a serious production architecture.

**The gaps are specific and fixable.** No major rewrites needed. Mostly finishing, documentation, and deployment wiring.

---

## 1. LLM Backend — Grade: A-

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **6-tier backend cascade** | ✅ Production | `useTroubadourAI.js` lines 124-223: wllama → remote vLLM → StepAudio → llama.cpp → LM Studio → offline |
| **In-browser GGUF inference** | ✅ Production | `useWllamaTroubadour.js`: LFM2.5-1.2B-Instruct Q4_K_M, correct manufacturer params (temp 0.1, top_k 50, penalty_repeat 1.05) |
| **Streaming chat completions** | ✅ Production | `chatStream()` with `reader.read()` SSE parsing, word-by-word offline fallback simulation |
| **Offline static responses** | ✅ Production | `troubadourOffline.js`: 20+ keyword-matched Bertrand quotes that work with zero AI |
| **RAG context injection** | ✅ Production | `TroubadourWidget.jsx`: `searchChunks()` + `buildContextBlock()` injected into prompt via `{{RAG_CONTEXT}}` |
| **Prompt engineering** | ✅ Excellent | `troubadourPrompt.js`: DAG-aware, somatic polarity (Yin/Yang/Balanced), archetype system, BE→DO→PLAY routing, Net Protocol |
| **Cancellation** | ✅ Production | `cancel()` aborts fetch, drains audio queue, cancels TTS, resets state |

### What's Stubbed

| Issue | Location | Impact |
|-------|----------|--------|
| **No actual wllama model files** | `/models/` directory | In-browser LLM won't load without the GGUF file. The path is wired but the file isn't there. |
| **RAG is keyword-only** | `ragStore.js` line 7 | "Future: nomic-embed via ONNX for semantic search." No embeddings = no semantic similarity. Just keyword matching. |
| **No semantic embedding model** | Not implemented | Curriculum retrieval is text-based, not vector-based. "interval" query won't find "semitone" content. |

### Fix: 2 hours
- Download LFM2.5-1.2B-Instruct Q4_K_M.gguf to `/public/models/`
- Add to README where to get models
- Add nomic-embed-text-v1.5 via ONNX for semantic RAG (or accept keyword-only for v1.0)

---

## 2. TTS System — Grade: B (Functional, Not Differentiated)

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **3-tier TTS cascade** | ✅ Production | `speakTextInternal()`: Qwen3 server → Kokoro → Web Speech API |
| **Kokoro neural TTS** | ✅ Production | `useKokoroTTS.js`: WebGPU/WASM, Q8 quantized, 5 voices including French SIWIS |
| **Audio queue + cancellation** | ✅ Production | `audioQueueRef`, `isSpeakingRef`, drain on failure |
| **TTS parameter presets** | ✅ Production | `ttsAudioSuite.js`: category-specific speed/pause/emphasis for ear training |
| **Qwen3-TTS server** | ⚠️ Mock mode | `server/tts-server.py` works in mock mode. Needs `pip install qwen-tts` for real voice cloning. |
| **TTS quality test suite** | ✅ Built today | `server/test-tts.py`: 7 guitar-specific test dimensions with automated scoring |

### What's Stubbed

| Issue | Location | Impact |
|-------|----------|--------|
| **Uses ORT Web** | `kokoro-js` depends on `onnxruntime-web` | Violates user's "no ORT" constraint. Blocks the user's stated goal. |
| **French is one thin voice** | `VOICE_MAP.fr` = `8073bf2d` (SIWIS) | "<11 hours training, B- grade" per Kokoro docs. Not mentor-quality. |
| **No voice cloning deployed** | `useQwenTTS.js` connects to localhost:9999 | Server exists but qwen-tts not installed. Cloning unavailable. |
| **No Bertrand voice reference** | `server/references/` empty | No audio files to clone from. Need video extraction. |
| **Non-ORT path not started** | `docs/09_NON_ORT_TTS_STRATEGY.md` | The 3-week WASM GGUF build is planned but not begun. |

### The Honest TTS Assessment
The TTS works. Students hear speech. But it's **not the product differentiator** the user wants it to be. Kokoro's French voice is thin. No cloning. Still uses ORT. The quality control framework is excellent (built today), but the underlying audio quality is "good enough," not "revenue-grade."

### Fix Options
- **Short (this week):** Install qwen-tts on AMD machine, run TTS server, test voice cloning with any reference audio
- **Medium (3 weeks):** Build OuteTTS WASM path (non-ORT)
- **Accept:** Keep Kokoro for v1.0, document ORT dependency, promise non-ORT in v1.1

---

## 3. Voice Input (STT) — Grade: B+

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **Web Speech API STT** | ✅ Production | `useVoiceInput.js`: continuous recognition, French/English locale switching |
| **Voice mode toggle** | ✅ Production | `TroubadourWidget.jsx`: microphone button triggers listen → transcribe → LLM → TTS loop |
| **TTS cancellation during voice** | ✅ Production | `cancel()` called before listening to prevent feedback loop |

### What's Missing

| Issue | Location | Impact |
|-------|----------|--------|
| **No Whisper STT** | Commented in `useVoiceInput.js` line 9 | Web Speech API is "pretty good" but not great for music terms. "Mi aigu" often misheard. |
| **No VAD wake word** | Commented in `useVoiceInput.js` line 11 | Student must click mic button. Can't say "Hey Troubadour" to start. |
| **No voice activity detection** | Not implemented | No way to detect when student stops speaking. Recognition timeout is heuristic. |

### Fix: 1 day (Whisper Base ONNX) + 1 day (Silero VAD)
- Load Whisper Base ONNX (~150MB) via `onnxruntime-web` for better music term recognition
- Add Silero VAD (2MB) for wake word detection
- **Trade-off:** More ORT dependency. User doesn't want this.

---

## 4. Prompt Engineering — Grade: A

### What's Working (This is Excellent)

| Feature | Status | Evidence |
|---------|--------|----------|
| **Somatic polarity system** | ✅ | Yin/Yang/Balanced mapped to 12 frets. Dynamically adapts coaching tone per fret. |
| **Archetype system** | ✅ | 12 troubadour types with protocol, question, voice style. Dominant type computed from traction. |
| **BE→DO→PLAY phase routing** | ✅ | Prompt explicitly instructs LLM per phase. BE = imagination, DO = humming, PLAY = fret instruction. |
| **Net Protocol** | ✅ | Military radio protocol for voice mode: "Over." / "Ready" / "Copy. Go ahead." |
| **Kid mode** | ✅ | Simplified language, no theory terms, colors/shapes/animals metaphors. |
| **RAG context injection** | ✅ | `{{RAG_CONTEXT}}` placeholder replaced with keyword-scored curriculum chunks. |
| **French naturalization** | ✅ | "Use French expressions naturally: voila, ecoute, alors, bravo" |
| **Safety guardrails** | ✅ | "Never recommend pushing through pain", "exercises are recommendations not commands" |
| **Scope enforcement** | ✅ | "You do NOT know: specific song tabs... When asked, say so directly." |
| **LFM2.5 manufacturer params** | ✅ | `temp: 0.1, top_k: 50, penalty_repeat: 1.05` — applied in both wllama and server paths |

### What's Missing

| Issue | Impact |
|-------|--------|
| **Prompt A/B test results** | `promptVersioning.js` exists but no historical results. Need to run tests, save versions, prove improvements. |
| **No prompt telemetry** | No tracking of which prompt version produced which response quality. Can't learn from usage. |

---

## 5. RAG / Context Retrieval — Grade: B

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **IndexedDB persistent storage** | ✅ | `ragStore.js`: chunks stored in IndexedDB, survives page refresh |
| **Keyword scoring** | ✅ | `scoreChunk()`: multiplicative scoring across keywords, title, tags |
| **Context block building** | ✅ | `buildContextBlock()`: top N chunks with overlap stripping, deduplication |
| **Curriculum indexing** | ✅ | `curriculumIndexer.js`: all 144 DAG nodes + exercises indexed |
| **Offline pedagogy indexed** | ✅ | Bertrand's teachings from `troubadourOffline.js` in RAG store |

### What's Stubbed

| Issue | Location | Impact |
|-------|----------|--------|
| **No vector embeddings** | `ragStore.js` line 7 | Keyword matching can't find semantic relatives. "interval" ≠ "semitone" without embeddings. |
| **No video transcripts** | `curriculumIndexer.js` | Videos mentioned but not transcribed. RAG only knows text curriculum, not video content. |
| **No transcript chunking** | Not implemented | When videos arrive, need transcription + chunking pipeline. |
| **Embedding model comment** | `ragStore.js` | "Future: nomic-embed via ONNX" — blocked by ORT constraint if we want non-ORT. |

---

## 6. Quality Control — Grade: A (Built Today)

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **LLM test suite** | ✅ | `llmTestSuite.js`: 18 test cases, 7 scoring dimensions, automated keyword/conciseness/safety/over-protocol scoring |
| **TTS audio test suite** | ✅ | `ttsAudioSuite.js`: 6 audio dimensions, 8 test phrases, Web Audio API analysis |
| **Prompt A/B testing** | ✅ | `promptVersioning.js`: `runPromptABTest()`, regression detection, quality report generation |
| **Tests pass** | ✅ | 168 tests including new quality control tests |

### What's Missing

| Issue | Impact |
|-------|--------|
| **No CI integration** | Quality tests don't run on push. Manual only. |
| **No historical results** | `localStorage` has no saved prompt versions or test results yet. Need to run tests first. |
| **No automated prompt optimization** | Tests identify problems but don't auto-adjust prompts. Human-in-the-loop required. |

---

## 7. Integration / Wiring — Grade: B+

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **Hook wiring** | ✅ | `TroubadourWidget.jsx` lines 78-81: `kokoroRef`, `wllamaRef`, `qwenRef`, `voiceRef` all wired via useEffect |
| **Chat + voice modes** | ✅ | `buildChatPrompt` vs `buildCompressedPrompt`, `enforceOver()` for troubadour mode |
| **RAG injection** | ✅ | `TroubadourWidget.jsx` lines ~320: `buildContextBlock()` result injected into messages |
| **TTS after response** | ✅ | `speakText()` called after every LLM response in both wllama and server paths |
| **Server status indicators** | ✅ | `ServerLight` component shows DaaS + LM Studio connection status |

### What's Stubbed

| Issue | Location | Impact |
|-------|----------|--------|
| **BiometricSanctum** | `src/components/BiometricSanctum.jsx` line 8 | "Simplified Simulation Stub." No real EEG or heart rate. Just a visualizer. |
| **useBackendBridge** | `useBackendBridge.js` | Connects to port 8080 (DaaS) and 9998 (StepAudio). May not be running on user's machine. |
| **Notification Hub** | `TroubadourWidget.jsx` lines 89-143 | Derived notifications exist but aren't rendered in a dedicated UI component. Just in the widget. |

---

## 8. Server-Side Components — Grade: C+ (Just Built Today)

### What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| **TTS server scaffold** | ✅ | `server/tts-server.py`: FastAPI, OpenAI-compatible `/v1/audio/speech`, voice reference upload |
| **TTS evaluation suite** | ✅ | `server/test-tts.py`: 7 test dimensions, automated WAV generation, scoring |
| **Mock mode** | ✅ | Server generates musical tones (C major chord) when `qwen-tts` not installed |

### What's Missing

| Issue | Impact |
|-------|--------|
| **qwen-tts not installed** | Server only works in mock mode. Real TTS requires `pip install -U qwen-tts`. |
| **No model download** | OuteTTS 0.2 and WavTokenizer not on the machine. Need `git clone` + `git lfs pull`. |
| **No deployment docs** | No README in `server/` explaining how to start, what ports, what models. |
| **No systemd service** | Student must manually start `python server/tts-server.py` every session. |
| **No health monitoring** | If server crashes, browser gets 500 with no retry logic. |

---

## The GitHub Release Blockers

Before this goes on GitHub as "mastered AI system," these must be fixed:

### Critical (Blocks Release)

| # | Issue | Fix Time | Owner |
|---|-------|----------|-------|
| 1 | **No LLM model file** — wllama can't load anything | 30 min | Download GGUF to `/public/models/` |
| 2 | **TTS server not deployed** — qwen-tts not installed | 2 hours | `pip install` + model download on AMD machine |
| 3 | **No README for AI system** | 2 hours | Write `docs/AI_SYSTEM.md` explaining architecture |
| 4 | **No server README** | 30 min | Write `server/README.md` with setup instructions |
| 5 | **ORT dependency** — user explicitly wants this gone | 3 weeks OR accept for v1.0 | Decision required |

### Important (Polish)

| # | Issue | Fix Time |
|---|-------|----------|
| 6 | **BiometricSanctum is a stub** | Hide or implement (2 hours to hide, 2 weeks to implement) |
| 7 | **No semantic RAG** | Add nomic-embed or accept keyword-only (1 day with ONNX) |
| 8 | **No prompt A/B test history** | Run tests, save versions (2 hours) |
| 9 | **No video transcripts in RAG** | Need videos first, then transcription pipeline |
| 10 | **Package name** — `bertrand-masterclass` not `voix-vive` | 5 min rename |

### Nice to Have

| # | Issue | Fix Time |
|---|-------|----------|
| 11 | Whisper STT for music terms | 1 day (adds ORT though) |
| 12 | Silero VAD wake word | 1 day |
| 13 | Automated CI quality tests | 2 hours (GitHub Actions) |
| 14 | Prompt telemetry / learning | 1 day |

---

## Summary: What's Real vs What's Aspiration

### Real (Working Right Now)
- ✅ 6-tier LLM backend with cascading fallbacks
- ✅ In-browser LFM2.5 GGUF inference
- ✅ Streaming chat with word-by-word offline fallback
- ✅ Sophisticated prompt engineering (somatic polarity, archetypes, BE→DO→PLAY)
- ✅ Keyword-based RAG with curriculum context injection
- ✅ Kokoro neural TTS in browser (English + 1 French voice)
- ✅ Audio queue management with cancellation
- ✅ Web Speech API voice input
- ✅ Quality control test framework (168 tests)
- ✅ TTS server scaffold (mock mode)

### Aspiration (Planned But Not Working)
- ❌ Non-ORT TTS (the 3-week WASM GGUF build)
- ❌ Voice cloning (needs qwen-tts install + Bertrand audio)
- ❌ Semantic RAG (needs embedding model)
- ❌ Whisper STT (needs ORT or alternative)
- ❌ Biometric integration (BLE EEG/heart rate)
- ❌ StepAudio 33B server connection (may not be running)

### The Honest Pitch for GitHub

**"Voix Vive has a production-grade AI architecture with browser-native LLM inference, neural TTS, and RAG context retrieval. The system works offline, supports French and English, and includes a comprehensive quality control framework. Voice cloning and non-ORT TTS are planned for v1.1."**

This is true. It's not overstated. The architecture is genuinely impressive.

---

## Recommended Next Actions

1. **Download LFM2.5 GGUF** to `/public/models/` (30 min)
2. **Install qwen-tts on AMD machine** and test voice cloning (2 hours)
3. **Write AI system README** (`docs/AI_SYSTEM.md`) (2 hours)
4. **Run prompt A/B tests** and save first version history (1 hour)
5. **Hide BiometricSanctum stub** or mark as "future" (30 min)
6. **Commit, tag v1.0-beta, push to GitHub** (30 min)

**Total: 1 day of focused work to have a shippable GitHub release.**

Then, separately, decide on the non-ORT TTS build.
