# Non-ORT Browser TTS Strategy
> Hard constraint: No ONNX Runtime. Browser-native only.
> LLM: LFM2.5 (wllama/GGUF) — decided.
> TTS: Undecided. Must match StepAudio quality aspiration.

## The Brutal Constraint Map

Every neural TTS model we researched uses ORT for browser deployment:

| Model | Browser Path | Uses ORT? | French? | Cloning? |
|-------|-------------|-----------|---------|----------|
| Kokoro-82M | `kokoro-js` + ORT Web | **YES** | 1 voice | ❌ |
| Qwen3-TTS 0.6B ONNX | ORT Web INT4 | **YES** | ✅ Native | ✅ 3s |
| Supertonic 3 | ORT Web + WebGPU | **YES** | ✅ 31 lang | ❌ (paid) |
| Piper | ORT Web WASM | **YES** | ✅ (piper-plus) | ❌ |
| Kitten TTS | ORT Web | **YES** | ❌ | ❌ |

**Result: Zero production-ready non-ORT French neural TTS exists for browsers.**

## The Only Two Paths Without ORT

### Path A: TensorFlow.js + French FastSpeech2

**What:** Convert a French TensorFlowTTS model to TF.js format.

**Proof it works:** `playerony/TensorFlowTTS-ts` runs FastSpeech2 + MB-MelGAN entirely in browser with pure TF.js. No ORT.

**French model:** TensorFlowTTS has pretrained French FastSpeech2 + MB-MelGAN checkpoints.

**Path:**
```
French FastSpeech2 checkpoint (TensorFlow)
  → SavedModel
  → tensorflowjs_converter
  → browser: tf.loadLayersModel()
  → inference in TF.js
```

**Size:** ~150MB (smaller than Kokoro)
**Quality:** ~Piper level. Functional. Not expressive.
**Voice cloning:** ❌ No. Single-speaker only.
**Build time:** ~3-5 days (conversion pipeline + JS wrapper)

**Verdict:** Works. Boring. No voice cloning. Mediocre French.

---

### Path B: WASM-compiled GGUF TTS (The Hard Way)

**What:** Compile llama.cpp TTS tools to WASM, load OuteTTS GGUF.

**Proof it works:** `mmnga/mio-tts-cpp` has a working WASM browser demo. Emscripten → `miottscpp_core.wasm`. Loads GGUF models in browser.

**French model:** `OuteAI/Llama-OuteTTS-1.0-1B-GGUF` — French is "High Training Data Language."

**Path:**
```
1. Fork wllama's CMakeLists.txt
2. Add llama.cpp/tools/tts/*.cpp to build
3. Add llama.cpp/examples/tts/*.cpp to build
4. Expose C API: tts_load_model(), tts_generate()
5. Compile with Emscripten to WASM
6. JS wrapper: load two GGUF files (LLM + vocoder)
7. Generate: text → audio tokens → PCM → AudioBuffer
```

**Size:** ~2GB (OuteTTS 1B + WavTokenizer vocoder)
**Quality:** Near StepAudio. OuteTTS 1.0 uses DAC encoder (two codebooks).
**Voice cloning:** ✅ Yes. 10-second reference.
**Build time:** 2-3 weeks (C API extraction, two-model loading, vocoder conversion)

**Verdict:** This is the only path to StepAudio-quality audio in a browser without ORT. Significant engineering. Doable.

---

### Path C: Web Speech API (The Fallback That Always Works)

**What:** Native browser `speechSynthesis`. Zero code. Zero download.

**French:** 1 voice per OS. Quality varies by platform.
**Build time:** Already done.
**Verdict:** Emergency fallback only. Not a product.

---

## The Honest Recommendation

Given your constraints (no ORT, browser-only, French, voice cloning):

### Immediate (This Week)
**Build Path B proof-of-concept.** Not production. Just prove WASM GGUF TTS works in your stack.

```bash
# 1. Clone wllama
git clone --recurse-submodules https://github.com/ngxson/wllama.git
cd wllama

# 2. Modify CMakeLists.txt: add tools/tts/*.cpp
# 3. Build with Emscripten
./scripts/build.sh

# 4. Load OuteTTS GGUF in browser
# 5. Call tts_generate("Bonjour") → AudioBuffer
```

If this PoC works → commit 2-3 weeks to full build.
If it fails → you know for certain no non-ORT path exists.

### Parallel Track (Next 2 Weeks)
**Build Path A as insurance.** Convert French FastSpeech2 to TF.js. It'll work. It'll be mediocre. But it'll be non-ORT French TTS that ships.

### Strategic Context
Your StepAudio research showed you the gold standard. StepAudio is 33B parameters, server-only, BF16. It will never run in a browser. The gap between StepAudio and browser TTS is ~50x in model size.

Path B (OuteTTS 1B WASM) is the closest bridge. 1B parameters. DAC encoder. French native. Voice cloning. Still 1/33rd of StepAudio's capacity, but it's the best that fits in a browser's memory and compute constraints.

---

## Why "No ORT" Makes This Hard

ORT Web is what HuggingFace Transformers.js, Microsoft, and every major browser ML project uses. It's not "fat and lazy" — it's the standard runtime because compiling arbitrary neural networks to browser-compatible code is hard.

Without ORT, you must:
1. Compile the model's exact operators to WASM (or WebGPU shaders)
2. Handle memory management across JS/WASM boundary
3. Implement audio preprocessing in JS
4. Debug without ORT's profiling and optimization tools

This is why Path B is 2-3 weeks, not 2-3 days.

---

## Decision Gate

**Gate 1 (This Week):** Does OuteTTS WASM PoC generate audible French speech?
- **Yes** → Full Path B build. This is your voice.
- **No** → Fall back to Path A (TF.js French TTS). Functional but no cloning.

**Gate 2 (Week 3):** Does cloned voice sound like Bertrand?
- **Yes** → Ship it. Best browser TTS in the world.
- **No** → Accept server-side Qwen3-TTS for voice cloning. Browser gets Path A.

---

## My Actual Recommendation

Build the Path B PoC this week. It's the only path that satisfies all constraints. If it works, you've built something almost no one has: a browser-native, GGUF-based, French-capable, voice-cloning TTS.

If it doesn't work, you've learned exactly where the boundary is.

The voice is the product. The constraint is real. The path exists but is hard.

Want me to start the PoC?
