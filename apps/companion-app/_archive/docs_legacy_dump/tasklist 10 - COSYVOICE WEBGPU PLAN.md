# CosyVoice WebGPU Implementation Plan (0.5B)
> **Objective**: Deploy FunAudioLLM's CosyVoice-0.5B directly into the browser using Transformers.js and WebGPU for zero-latency, offline voice cloning. This replaces the heavier StepAudio-3B plan to ensure compatibility with mobile edge constraints alongside the Liquid-350M text model.
> **Date**: June 2026

## Phase 1: Model Acquisition & ONNX Export (Offline / Local Prep)
We must convert the PyTorch-based CosyVoice 0.5B weights into optimized ONNX format for browser execution.
*   **Task 1.1**: Leverage community-maintained ONNX exports (e.g., `ayousanz/cosy-voice3-onnx`) which have already stripped PyTorch dependencies and solved the Flow Matching export issues.
*   **Task 1.2**: If community exports lack the specific 0.5B target, set up a custom export pipeline modifying the Flow and HiFT modules to handle TorchScript/ONNX compatibility (removing streaming support/complex tensor ops).
*   **Task 1.3**: Quantize the ONNX models to `q8` (8-bit integer) to reduce the total size from ~1GB to ~250MB, ensuring the total browser memory footprint (Text + Voice) stays under 1GB.

## Phase 2: WebWorker Integration (React Frontend)
Since `transformers.js` does not natively support the complex multi-stage pipeline of CosyVoice out of the box, we will build a custom pipeline around `onnxruntime-web`.
*   **Task 2.1**: Install `@huggingface/transformers` and `onnxruntime-web`.
*   **Task 2.2**: Create `src/workers/cosyVoiceWorker.js`. This WebWorker will:
    *   Load the multiple ONNX graphs (LLM, Flow Matching, HiFi-GAN Vocoder).
    *   Initialize WebGPU device execution via ONNX Runtime Web opsets.
    *   Accept a reference audio buffer (`seg_6_02_27.wav`) for Bertrand's voice prompt.
    *   Generate and return audio PCM buffers.
*   **Task 2.3**: Update `src/hooks/useKokoroTTS.js` or create `useCosyVoice.js` to manage the asynchronous messaging with the Worker.

## Phase 3: The "Brain" Download UX
The UI must handle the initial download gracefully.
*   **Task 3.1**: When the user clicks "Load Brain", trigger the simultaneous download of the Liquid GGUF and the CosyVoice ONNX files.
*   **Task 3.2**: Utilize the browser's Cache API to permanently store the models.
*   **Task 3.3**: Provide a unified progress bar in the `TroubadourWidget` that shows combined download progress.

## Phase 4: Development Workflow Automation
To maintain stability during this complex integration, we implement CI/CD.
*   **Task 4.1**: Set up `.github/workflows/build-test.yml` to run standard React builds.
*   **Task 4.2**: Implement strict memory profiling tests in a staging environment to catch OOM (Out of Memory) errors on simulated mobile devices before main branch merges.
