# StepAudio Mini WebGPU Implementation Plan
> **Objective**: Compile and deploy StepAudio-TTS-3B directly into the browser using WebGPU/WASM, enabling SOTA text-to-speech with voice cloning at zero latency, fully offline.
> **Estimated Time**: 2 days

## Phase 1: Environment & Model Preparation (Backend)

### 1. Repository Setup
We need the official forks that contain the custom dual-codebook logic.
```bash
# Create working directory outside the main repo to keep it clean
mkdir -p ~/Workflow/Other/StepAudio-Web
cd ~/Workflow/Other/StepAudio-Web

# Clone StepFun's custom llama.cpp fork
git clone https://github.com/stepfun-ai/llama.cpp.git step-llama-cpp
cd step-llama-cpp
```

### 2. Model Download & Quantization
We need the 3B model weights and to convert them to GGUF format so they fit in browser memory (WebGPU 4GB limit).
* **Task 2.1**: Download `stepfun-ai/Step-Audio-TTS-3B` from HuggingFace.
* **Task 2.2**: Run `pip install -r requirements.txt` in the `step-llama-cpp` repo.
* **Task 2.3**: Execute `python3 convert_hf_to_gguf.py /path/to/Step-Audio-TTS-3B --outfile step-audio-3b-q4_k_m.gguf --outtype q4_k_m`.

## Phase 2: The Vocoder Pipeline (The Hard Problem)

The LLM outputs discrete audio tokens. We must decode these tokens into continuous PCM waveforms.
* **Task 3.1**: Inspect `stepfun-ai/llama.cpp` to see if they have already ported the flow-matching vocoder to C++.
* **Task 3.2**: If NOT in C++, we will export the PyTorch vocoder (from `stepfun-ai/Step-Audio2`) to an ONNX model (`step_vocoder_int8.onnx`).
* **Task 3.3**: We will use `ONNX Runtime Web` (ORT Web) strictly and exclusively for this vocoder step, while keeping the heavy 3B LLM in pure WebGPU via `llama.cpp`.

## Phase 3: Emscripten Compilation (WASM + WebGPU)

We must compile the C++ LLM engine into a browser-executable WebAssembly module with GPU acceleration.
* **Task 4.1**: Install the Emscripten SDK (`emsdk`).
* **Task 4.2**: Configure CMake for WebGPU:
  ```bash
  emcmake cmake -B build-wasm -DGGML_WEBGPU=ON -DBUILD_SHARED_LIBS=OFF
  ```
* **Task 4.3**: Compile the JS bindings (`make -C build-wasm`). This will generate `step_llama.js` and `step_llama.wasm`.

## Phase 4: Browser Integration & Wiring (Frontend)

We bring the compiled engine into the Voix Vive React application.
* **Task 5.1**: Create `public/stepaudio/` and move `step-audio-3b-q4_k_m.gguf`, `step_vocoder_int8.onnx`, `step_llama.wasm`, and `step_llama.js` into it.
* **Task 5.2**: Create `src/workers/stepAudioWorker.js`. This WebWorker will:
  - Load the WASM module.
  - Mount the OPFS (Origin Private File System) to read the GGUF file without eating RAM.
  - Expose a `generate(text, referenceAudio)` function.
* **Task 5.3**: Create `src/hooks/useStepAudio.js` to manage the Worker state (Loading, Ready, Generating).
* **Task 5.4**: Update `src/hooks/useTroubadourAI.js` to strip out Kokoro/Qwen and route all browser TTS exclusively to `useStepAudio.js`.

## Phase 5: Voice Cloning & Autopoiesis
* **Task 6.1**: Implement the UI to capture a 3-second reference audio snippet of Bertrand (or the student).
* **Task 6.2**: Pass the reference audio buffer into the WebWorker to act as the acoustic prompt for the dual-codebook LLM.

---

## Next Action
To begin, we need to set up the working directory and clone the `stepfun-ai/llama.cpp` fork. Should we execute **Phase 1** now?
