import * as ort from 'onnxruntime-web/webgpu';

// Configure ONNX Runtime to use the correct WASM paths for fallback
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/';
ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;

class CosyVoiceWebGPU {
  constructor() {
    this.sessions = {
      llm: null,
      flow: null,
      hift: null
    };
    this.sampleRate = 22050; // Standard for CosyVoice HiFi-GAN
    this.isReady = false;
  }

  async loadModels(progressCallback) {
    try {
      const options = {
        executionProviders: ['webgpu', 'wasm'],
        graphOptimizationLevel: 'all'
      };

      // In production, these URLs will point to the downloaded models in the Origin Private File System (OPFS)
      // or a CDN bucket hosting the ayousanz/cosy-voice3-onnx models.
      const baseUrl = 'https://huggingface.co/ayousanz/cosy-voice3-onnx/resolve/main/';
      
      progressCallback(10);
      this.sessions.llm = await ort.InferenceSession.create(`${baseUrl}llm.onnx`, options);
      
      progressCallback(40);
      this.sessions.flow = await ort.InferenceSession.create(`${baseUrl}flow.onnx`, options);
      
      progressCallback(70);
      this.sessions.hift = await ort.InferenceSession.create(`${baseUrl}hift.onnx`, options);
      
      progressCallback(100);
      this.isReady = true;
    } catch (error) {
      console.error("Failed to load CosyVoice ONNX models:", error);
      throw error;
    }
  }

  async generateSpeech(_text, _referenceAudioData) {
    if (!this.isReady) throw new Error("Models not loaded yet.");

    // ── HONEST SCAFFOLDING FLAG ──
    // The WebGPU ONNX graphs for CosyVoice are not fully exported/optimized yet.
    // Instead of faking generation with mock tensors, we explicitly throw so the
    // useCosyVoice hook can gracefully fall back to Kokoro or Web Speech.
    // TODO: Implement when ayousanz/cosy-voice3-onnx models are fully exported.
    // Params _text and _referenceAudioData are reserved for that implementation.
    throw new Error("WEBGPU_NOT_IMPLEMENTED: WebGPU ONNX model not yet exported. Please use server mode.");
  }
}

const cosyVoice = new CosyVoiceWebGPU();

self.addEventListener('message', async (event) => {
  const { type, text, referenceAudio } = event.data;

  if (type === 'load') {
    try {
      await cosyVoice.loadModels((progress) => {
        self.postMessage({ status: 'progress', progress });
      });
      self.postMessage({ status: 'ready' });
    } catch (err) {
      self.postMessage({ status: 'error', error: err.message });
    }
  }

  if (type === 'generate') {
    try {
      const output = await cosyVoice.generateSpeech(text, referenceAudio);
      self.postMessage({ 
        status: 'complete', 
        audio: output.audio, 
        sampling_rate: output.samplingRate 
      });
    } catch (err) {
      self.postMessage({ status: 'error', error: err.message });
    }
  }
});
