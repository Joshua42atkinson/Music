# English-Only GGUF TTS Build Plan
> No ORT. No French (Phase 2). Browser-native WASM TTS.
> Target: OuteTTS 1.0 1B GGUF → WASM → English speech in browser.

## Why English-First Changes Nothing About the Build

The "French" constraint wasn't the bottleneck. The bottleneck is:
1. **No JS library exists** that loads GGUF TTS models in browser
2. **llama.cpp TTS** is CLI-only, not a callable library
3. **wllama** only compiles llama.cpp text inference, not TTS tools
4. **Two-model loading** is required (LLM + vocoder)

English vs French doesn't affect any of these. Same build. Same effort.

## What Actually Works Today (Verified)

| Component | Status | Source |
|-----------|--------|--------|
| **OuteTTS 0.2 500M → GGUF** | ✅ Works | `convert_hf_to_gguf.py` in llama.cpp |
| **WavTokenizer → GGUF** | ✅ Works | `convert_pt_to_hf.py` then `convert_hf_to_gguf.py` |
| **llama-tts binary** | ✅ Works | Native C++ CLI generates WAV from text |
| **llama.cpp TTS in WASM** | ❌ **Not built** | No one has done this |
| **Two-model C API** | ❌ **Doesn't exist** | Must be extracted from CLI code |

## The Build Steps (Scoped)

### Phase 1: C API Extraction (Week 1)

The `llama-tts` binary (`llama.cpp/tools/tts/`) does everything internally:
- Loads OuteTTS GGUF + WavTokenizer GGUF
- Tokenizes text → audio token sequences
- Runs vocoder → raw PCM
- Writes WAV file

**Task:** Extract this into reusable C functions:

```c
// tts-api.h
struct tts_context;
struct tts_context* tts_init(const char* llm_path, const char* vocoder_path);
int tts_generate(struct tts_context* ctx, const char* text, float* pcm_out, int* pcm_len);
void tts_free(struct tts_context* ctx);
```

**Files to modify:**
- `llama.cpp/tools/tts/tts-outetts.cpp` → extract inference loop
- `llama.cpp/tools/tts/tts-outetts-v1.cpp` → same for v1.0
- New: `llama.cpp/tools/tts/tts-api.cpp` → thin C wrapper

### Phase 2: WASM Compilation (Week 1-2)

**Task:** Fork wllama, add TTS code to CMakeLists.txt

```cmake
# In wllama/CMakeLists.txt, add:
set(TTS_SRC
    llama.cpp/tools/tts/tts-outetts-v1.cpp
    llama.cpp/tools/tts/tts-api.cpp
    # ... other TTS files
)

set(WLLAMA_SRC ${LLAMA_COMMON_SRC} ${LLAMA_SERVER_SRC} ${TTS_SRC}
    cpp/wllama.cpp
    cpp/glue.hpp
    cpp/tts-glue.hpp          # NEW: JS ↔ C TTS bridge
    llama.cpp/include/llama.h)
```

**Task:** Add JS TTS bridge (`cpp/tts-glue.hpp`)
- Receives text from JS
- Loads two GGUF files via MEMFS
- Calls `tts_generate()`
- Returns PCM Float32Array to JS

### Phase 3: JS API (Week 2)

```javascript
// useOuteTTS.js
const tts = await OuteTTS.load({
  llmPath: '/models/outetts-1.0-1b-q8_0.gguf',
  vocoderPath: '/models/wavtokenizer-75-f16.gguf',
});

const audioBuffer = await tts.generate('Hello, this is a guitar lesson.');
// audioBuffer is Web Audio API AudioBuffer, ready to play
```

### Phase 4: Integration (Week 2-3)

- Replace `kokoro-js` + ORT Web with OuteTTS WASM in `useTroubadourAI.js`
- TTS cascade becomes: OuteTTS WASM → Web Speech API (no Kokoro, no ORT)
- Remove `onnxruntime-web` from package.json
- Remove `kokoro-js` from package.json

## Model Sizes

| Model | Format | Size | Source |
|-------|--------|------|--------|
| OuteTTS 1.0 1B Q8_0 | GGUF | ~1.1 GB | `OuteAI/Llama-OuteTTS-1.0-1B-GGUF` |
| WavTokenizer 75-token F16 | GGUF | ~300 MB | Convert from PyTorch checkpoint |
| **Total** | | **~1.4 GB** | |

Compare to current: Kokoro 300MB + ORT Web ~50MB = ~350MB

**Trade-off:** 4x larger download for:
- No ORT dependency
- Voice cloning capability
- Higher quality (DAC encoder, two codebooks)
- Native GGUF (same format as LFM2.5)

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| WASM compilation fails | Medium | Start with `mio-tts-cpp` WASM example as reference |
| Two-model loading exceeds memory | Medium | Split model loading, stream vocoder inference |
| English quality worse than Kokoro | Low | OuteTTS 1.0 trained extensively on English |
| Build takes >3 weeks | Medium | Parallel Path A (TF.js) as insurance |

## The Honest Timeline

| Week | Deliverable |
|------|------------|
| **1** | C API extraction from llama.cpp TTS. Native build produces `libtts.so` that loads two GGUFs and generates WAV. |
| **2** | WASM compilation. `tts-wasm.js` loads in browser, generates silence or noise (proof of execution). |
| **2.5** | JS bridge working. `useOuteTTS.js` generates actual English speech in browser. |
| **3** | Integration complete. `npm run build` succeeds with zero ORT dependencies. All tests pass. |

## Decision: Start or Not?

This is 3 weeks of focused C++/CMake/Emscripten/WASM work. The output is:
- A browser-native English TTS with voice cloning
- Zero ORT dependencies
- Unified GGUF format (same as LFM2.5 LLM)
- Foundation for French Phase 2

**Alternative:** Keep Kokoro + ORT for now, revisit in 6 months when the WASM GGUF ecosystem has matured.

**My recommendation:** Start Phase 1 (C API extraction) this week. It's the fastest way to know if the full build is viable. If C API works in 2 days, commit to full build. If it's a nightmare, fall back to Kokoro.

Want me to start Phase 1?
