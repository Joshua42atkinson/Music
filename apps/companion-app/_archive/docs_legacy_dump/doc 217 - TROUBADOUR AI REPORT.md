# Troubadour AI — Technical Report & Research Questions

**Date**: May 20, 2026  
**Purpose**: Comprehensive technical documentation for embedding/downloadable distribution of the Troubadour AI model

---

## 1. Model Specifications

### Base Model
- **Name**: `google/gemma-4-E2B`
- **Type**: 2B parameter multimodal model (vision + audio + text)
- **Precision**: bfloat16 (fine-tuning), INT4 (quantized)
- **Architecture**: Gemma 4 with vision/audio towers

### Fine-Tuning Configuration
- **Method**: PEFT (Parameter-Efficient Fine-Tuning) with LoRA
- **LoRA Rank (r)**: 32
- **LoRA Alpha**: 64
- **Target Modules**: Text decoder layers only (nn.Linear)
  - Specifically: `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`
  - Skipped: vision_tower and audio_tower (ClippableLinear modules)
- **Max Sequence Length**: 4096 tokens
- **Training Epochs**: 2
- **Learning Rate**: 1e-4
- **Batch Size**: 2 (per device) × 4 (gradient accumulation) = 8 effective
- **Optimizer**: bf16 training with gradient checkpointing

### Training Data
- **Training File**: `training/voix_vive_training.jsonl`
- **Evaluation File**: `training/voix_vive_eval.jsonl`
- **Format**: JSONL with chat-style messages (system/user/assistant)
- **Content**: Somatic guitar instruction, Bertrand Laurence's pedagogical methods (©PLING!, ©SHEARL, ©FHEAL)
- **Chat Template**: Gemma-style with `<start_of_turn>` and `<end_of_turn>` tokens

### Output Locations
- **LoRA Adapter**: `training/outputs_v2/`
- **Merged Model**: `training/merged_model_v2/` (full model with LoRA merged)
- **Quantized GGUF**: `training/quantized/gguf/troubadour-q4.gguf` (3.2GB)
- **Web-Serving Copy**: `public/models/troubadour-q4.gguf` (3.2GB)

---

## 2. Quantization Details

### GGUF Q4_K_M (Desktop)
- **Library**: AMD Quark
- **Quantization**: INT4 asymmetric per-group
- **Group Size**: 32
- **Calibration**: AWQ (Activation-aware Weight Quantization)
- **Calibration Samples**: 32 from training data
- **Output Size**: 3.2GB
- **Compatibility**: llama.cpp, Ollama
- **Status**: ✅ Complete and tested with Ollama

### ONNX INT4 (Browser) - FAILED
- **Library**: AMD Quark ONNX
- **Quantization**: INT4 weight-only
- **Calibration**: MinMax
- **Error**: `RuntimeError: Found <class 'transformers.cache_utils.DynamicCache'> in output` during torch.onnx.export
- **Cause**: Gemma 4 E2B uses DynamicCache which is not compatible with PyTorch ONNX export
- **Status**: ❌ Abandoned - switched to wllama (GGUF-native browser inference)

---

## 3. Current Web Implementation

### Technology Stack
- **Library**: `@wllama/wllama` (WebAssembly binding for llama.cpp)
- **Format**: GGUF Q4_K_M (same as desktop)
- **Runtime**: WebAssembly + WebGPU (optional acceleration)
- **Location**: `src/hooks/useWebLLM.js`

### Implementation Details
```javascript
// Current approach
const wllama = new Wllama({
  default: 'https://cdn.jsdelivr.net/npm/@wllama/wllama@latest/dist/wllama.wasm',
});

await wllama.loadModelFromUrl('/models/troubadour-q4.gguf', {
  progressCallback,
  n_gpu_layers: 20, // Offload 20 layers to GPU if WebGPU available
});
```

### User Flow
1. User clicks "Troubadour AI" in ambient player widget
2. Consent screen shown (explains 3.2GB download, privacy, one-time)
3. User consents → model downloads from localhost:5174
4. Wllama loads model into browser IndexedDB/WebStorage
5. Model runs entirely in-browser (no server calls)
6. Chat interface for guitar instruction

### File Size & Memory
- **Model File**: 3.2GB (GGUF Q4_K_M)
- **Browser Storage**: IndexedDB (persistent across sessions)
- **Runtime Memory**: ~2-3GB (depends on WebGPU offloading)
- **Browser Limit**: 4GB workable memory (within limits)

---

## 4. Integration Points

### Current Integration
- **Component**: `AmbientPlayer.jsx` (ambient music widget)
- **Mode**: Third mode "Troubadour AI" alongside Music/Metronome
- **Hook**: `useWebLLM.js` (custom React hook)
- **UI**: Chat interface with consent screen, loading progress, error handling

### Alternative Integration (Songwriting)
- **Component**: `SongwritingCompanion.jsx` (Fret 4 in DigitalBinder)
- **Original Plan**: Use DaaS backend → switched to WebLLM
- **Status**: Code updated but not tested (useWebLLM hook integrated)

---

## 5. Research Questions & Information Requests

### A. Model Distribution Strategy

**Question 1**: Should we offer multiple distribution methods?
- Option A: Browser-only (current - wllama + GGUF)
- Option B: Desktop-only (Ollama + GGUF)
- Option C: Hybrid (user chooses browser or desktop)
- Option D: Progressive enhancement (try browser, fallback to desktop)

**Information Needed**:
- What percentage of users have WebGPU-capable browsers?
- What are the performance differences between WebAssembly vs native Ollama?
- Can we detect WebGPU capability and offer appropriate option?

**Question 2**: Can we optimize the browser download process?
- Current: Downloads from localhost → browser storage (essentially copying 3.2GB)
- Can we use Service Worker caching to avoid re-download?
- Can we use File System Access API to let user choose local file?
- Can we use IndexedDB quota management to prevent storage issues?

**Information Needed**:
- How does wllama handle cached models?
- Can we detect if model is already in browser storage?
- What is the browser storage quota for IndexedDB?
- How do we handle partial downloads/interrupted downloads?

### B. Model Size Optimization

**Question 3**: Can we reduce model size further?
- Current: 3.2GB (Q4_K_M)
- Alternative quantizations: Q3_K_M (~2.4GB), Q2_K (~1.6GB)
- Trade-off: Quality vs size vs performance
- Can we use model pruning/distillation?

**Information Needed**:
- What is the quality degradation at Q3 vs Q4?
- Can we quantize to Q2_K_M for mobile?
- What are the inference speed differences?
- Can we use dynamic quantization (different layers different precision)?

**Question 4**: Can we use model sharding/splitting?
- Split model into chunks (e.g., 512MB each)
- Load chunks on-demand
- Progressive loading (start with smaller model, upgrade later)
- Similar to how some mobile games download assets

**Information Needed**:
- Does wllama support split GGUF files?
- Can we implement lazy loading of model chunks?
- What is the overhead of chunked loading?
- Can we prioritize loading "essential" layers first?

### C. Alternative Browser Runtimes

**Question 5**: Is wllama the best option for browser inference?
- Current: wllama (WebAssembly llama.cpp)
- Alternatives:
  - WebLLM (@mlc-ai/web-llm) - requires MLC compilation (not GGUF)
  - Transformers.js - runs ONNX models
  - ONNX Runtime Web - requires ONNX format
  - WebGPU-native implementations

**Information Needed**:
- Performance benchmarks between wllama, WebLLM, Transformers.js
- Model format compatibility (GGUF vs MLC vs ONNX)
- Browser support matrix (WebGPU vs WebAssembly)
- Development complexity and maintenance burden

**Question 6**: Should we compile to MLC format for WebLLM?
- Pros: Optimized for WebGPU, potentially faster
- Cons: Requires MLC compilation, not GGUF-native
- Effort: Need to compile with mlc_llm
- Trade-off: Better performance vs additional build step

**Information Needed**:
- How to compile Gemma 4 E2B with MLC LLM?
- What are the MLC compilation requirements?
- Can we automate MLC compilation in CI/CD?
- What is the performance improvement over wllama?

### D. Desktop Distribution

**Question 7**: Should we offer a desktop application?
- Current: Ollama-compatible GGUF (3.2GB)
- Options:
  - Standalone Ollama model file
  - Desktop app with embedded Ollama
  - Tauri/Electron app with local inference
  - CLI tool for power users

**Information Needed**:
- What are the system requirements for Ollama inference?
- Can we bundle Ollama in a desktop app?
- What is the licensing for redistributing Ollama?
- How do we handle updates to the model?

### E. Hybrid Approach

**Question 8**: Can we use a hybrid cloud/local approach?
- Small model in browser (Q2_K, ~1.6GB) for quick responses
- Large model on server (full precision) for complex queries
- Fallback mechanism when browser model fails
- Progressive enhancement based on device capabilities

**Information Needed**:
- What is the minimum viable model size for basic guitar instruction?
- Can we distill the model to a smaller variant?
- How do we handle context switching between models?
- What are the latency differences between local vs cloud?

### F. User Experience & Onboarding

**Question 9**: How do we optimize first-time experience?
- Current: 3.2GB download on first use (with consent)
- Alternatives:
  - Background download while user explores app
  - Streaming model (use while downloading)
  - Progressive disclosure (start with text-only, add AI later)
  - Pre-installed option (download from website before using app)

**Information Needed**:
- Can wllama stream model while downloading?
- What is the minimum data needed to start inference?
- How do we handle slow connections?
- Can we offer a "lite" version for quick trial?

**Question 10**: How do we handle model updates?
- Current: Manual replacement of GGUF file
- Need: Automatic update mechanism
- Considerations:
  - Versioning of model files
  - Delta updates (only download changed weights)
  - Rollback capability
  - User notification of updates

**Information Needed**:
- How does wllama handle model versioning?
- Can we implement delta updates for GGUF?
- What is the update frequency expected?
- How do we handle breaking changes?

### G. Performance & Optimization

**Question 11**: What are the performance characteristics?
- Current: No benchmarks collected
- Need to measure:
  - Cold start time (model loading)
  - Warm start time (cached model)
  - Token generation speed (tokens/second)
  - Memory usage during inference
  - Battery impact on mobile devices

**Information Needed**:
- Run benchmarks on target devices (desktop, laptop, mobile)
- Compare WebGPU vs WebAssembly performance
- Measure impact of n_gpu_layers parameter
- Profile memory usage patterns

**Question 12**: Can we optimize inference speed?
- Techniques:
  - KV cache optimization
  - Speculative decoding
  - Batch processing (multiple requests)
  - Model parallelism (if supported)
  - Quantization-aware training

**Information Needed**:
- Does wllama support KV cache?
- Can we implement speculative decoding?
- What is the overhead of batch processing?
- Can we retrain with quantization-aware training?

### H. Security & Privacy

**Question 13**: What are the security implications?
- Current: Model runs entirely in-browser (good for privacy)
- Concerns:
  - Model file integrity (tampering)
  - Prompt injection attacks
  - Output filtering/moderation
  - User data privacy (chat history)

**Information Needed**:
- How do we verify model file integrity?
- Can we implement prompt filtering?
- Should we store chat history locally or in cloud?
- How do we handle sensitive user data?

### I. Cost & Infrastructure

**Question 14**: What are the infrastructure costs?
- Current: Model served from Vercel (CDN)
- Costs:
  - Bandwidth (3.2GB per download)
  - Storage (model file in Vercel)
  - CDN edge caching
  - Potential cloud backup for hybrid approach

**Information Needed**:
- What is Vercel's bandwidth pricing?
- Can we use a CDN with better pricing?
- Should we use GitHub Releases for model distribution?
- What are the costs of alternative distribution methods?

**Question 15**: Should we use peer-to-peer distribution?
- WebRTC-based model sharing
- BitTorrent-style distribution
- IPFS / decentralized storage
- Reduce CDN bandwidth costs

**Information Needed**:
- Can we implement WebRTC model sharing?
- What are the legal implications of P2P distribution?
- How do we handle version control in P2P?
- What is the user experience impact?

---

## 6. Technical Debt & Known Issues

### Current Issues
1. **ONNX Export Failed**: DynamicCache incompatibility with torch.onnx.export
2. **No Auto-Detection**: Model doesn't check if already in browser storage
3. **Partial Downloads**: No handling of interrupted downloads
4. **No Benchmarks**: No performance data collected
5. **No Update Mechanism**: Manual model replacement only
6. **No Versioning**: Model files not versioned
7. **No Delta Updates**: Full 3.2GB re-download for updates

### Code Quality
- **useWebLLM.js**: Basic implementation, no error recovery
- **AmbientPlayer.jsx**: UI complete, but consent flow could be improved
- **No Service Worker**: No offline capability
- **No IndexedDB Management**: No quota handling or cleanup

---

## 7. File Inventory

### Model Files
```
training/
├── merged_model_v2/              # Full fine-tuned model (merged)
│   ├── config.json
│   ├── model.safetensors
│   └── tokenizer files
├── quantized/
│   └── gguf/
│       ├── troubadour-q4.gguf   # 3.2GB quantized model
│       └── Modelfile            # Ollama configuration
├── outputs_v2/                  # LoRA adapter only
└── voix_vive_training.jsonl     # Training data

public/models/
└── troubadour-q4.gguf           # 3.2GB copy for web serving
```

### Code Files
```
src/
├── hooks/
│   └── useWebLLM.js             # WebLLM integration hook
├── components/
│   ├── AmbientPlayer.jsx         # Widget with AI chat mode
│   └── SongwritingCompanion.jsx # Songwriting AI (updated but untested)
training/
├── finetune.py                  # Fine-tuning script
└── quantize_quark.py            # Quantization script
```

---

## 8. Next Steps & Recommendations

### Immediate (High Priority)
1. **Add browser storage detection** - Check if model already in IndexedDB before download
2. **Implement partial download handling** - Resume interrupted downloads
3. **Add performance benchmarks** - Measure token/sec, memory usage, startup time
4. **Add model versioning** - Version model files and implement update checks
5. **Test SongwritingCompanion** - Verify WebLLM integration works

### Short Term (Medium Priority)
1. **Research alternative runtimes** - Benchmark wllama vs WebLLM vs Transformers.js
2. **Implement Service Worker** - Enable offline capability and better caching
3. **Add progress indicators** - Show detailed download progress
4. **Implement error recovery** - Handle download failures gracefully
5. **Add telemetry** - Collect anonymous usage data for optimization

### Long Term (Low Priority)
1. **Explore model sharding** - Split model into chunks for progressive loading
2. **Research smaller quantizations** - Q3_K_M, Q2_K for mobile
3. **Consider hybrid approach** - Small local model + cloud fallback
4. **Implement delta updates** - Only download changed weights
5. **Explore P2P distribution** - Reduce CDN bandwidth costs

---

## 9. Contact & Resources

### Model Training
- **Base Model**: google/gemma-4-E2B
- **Training Framework**: transformers + PEFT + trl
- **Quantization Library**: AMD Quark
- **Browser Runtime**: @wllama/wllama

### Documentation
- **Project Context**: `CONTEXT.md`
- **Roadmap**: `ROADMAP.md`
- **Gamification**: `Gamifying Guitar Learning with Open Source.md`

### Key Commands
```bash
# Fine-tune
python3 training/finetune.py

# Quantize to GGUF
python3 training/quantize_quark.py --format gguf

# Run with Ollama
ollama create troubadour -f training/quantized/gguf/Modelfile
ollama run troubadour

# Web development
npm run dev
```

---

**Report Generated**: May 20, 2026  
**Status**: Draft - Ready for review and research planning
