// ═══════════════════════════════════════════════════════════
// AUDIO STREAMING SERVICE — StepAudio 2.5 Realtime abstraction
// Phase 1 of the voice AI migration.
// Hides transport complexity from React UI.
// Supports: LM Studio fallback (text), DaaS (text), StepAudio via Java middleware (voice)
// ═══════════════════════════════════════════════════════════

import { devLog } from './devLog';

const STEP_MIDDLEWARE_URL = import.meta.env.VITE_STEP_MIDDLEWARE_URL || 'ws://localhost:8081/ws/truebadour';

class AudioStreamingService {
  constructor() {
    this.ws = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.playbackQueue = [];
    this.isRecording = false;
    this.isPlaying = false;

    // Callbacks (set by consumer)
    this.onAudioReceived = null;
    this.onTextReceived = null;
    this.onParalinguistic = null;
    this.onConnectionChange = null;
    this.onError = null;
  }

  // ── Connection ──
  async connect(url = STEP_MIDDLEWARE_URL, authToken = null) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          devLog('[AudioStreaming] Connected to', url);
          // Send auth + session.update
          if (authToken) {
            this.ws.send(JSON.stringify({ type: 'auth', token: authToken }));
          }
          this.onConnectionChange?.(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            this.handleTextMessage(event.data);
          } else if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
            this.handleAudioMessage(event.data);
          }
        };

        this.ws.onclose = () => {
          devLog('[AudioStreaming] Disconnected');
          this.onConnectionChange?.(false);
          this.ws = null;
        };

        this.ws.onerror = (err) => {
          console.error('[AudioStreaming] WebSocket error:', err);
          this.onError?.(err);
          reject(err);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect() {
    this.stopRecording();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.onConnectionChange?.(false);
  }

  // ── Recording (mic → WebSocket) ──
  async startRecording() {
    if (this.isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(e.data);
        }
      };
      this.mediaRecorder.start(100); // 100ms chunks for low latency
      this.isRecording = true;
    } catch (err) {
      console.error('[AudioStreaming] Mic access denied:', err);
      this.onError?.(err);
    }
  }

  stopRecording() {
    if (!this.isRecording) return;
    this.mediaRecorder?.stop();
    this.mediaRecorder?.stream?.getTracks().forEach(t => t.stop());
    this.mediaRecorder = null;
    this.isRecording = false;
  }

  // ── Text input ──
  sendTextMessage(text) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }],
        },
      }));
    }
  }

  // ── Session configuration ──
  updateSession({ persona = 'truebadour', fretId: _fretId = 1, modalities = ['text', 'audio'] }) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    const personas = {
      truebadour: "You are the Truebadour, a Socratic guitar mentor. Teach using ©SHEARL, ©PLING!, ©FHEAL. Speak slowly, contemplatively. Help students discover, not just instruct.",
      bernard: "You are Bernard de Ventadorn, 12th-century truebadour. You speak in poetic metaphors about music, love, and the soul. You are gentle, wise, and slightly melancholic.",
      bertrand: "You are Bertrand Laurence, a Somatic Mystic guitar instructor. Focus on body awareness, breath, and visualization. Help the student feel the music in their body.",
    };

    this.ws.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities,
        instructions: personas[persona] || personas.truebadour,
        voice: 'alloy', // StepAudio voice preset
        turn_detection: { type: 'server_vad', threshold: 0.5 },
      },
    }));
  }

  // ── Message handling ──
  handleTextMessage(raw) {
    try {
      const msg = JSON.parse(raw);
      switch (msg.type) {
        case 'response.audio_transcript.done':
        case 'conversation.item.input_audio_transcription.completed':
          this.onTextReceived?.(msg.transcript || msg.item?.content?.[0]?.text || '');
          break;
        case 'response.text.done':
          this.onTextReceived?.(msg.text || '');
          break;
        case 'paralinguistic.event':
          this.onParalinguistic?.({
            emotion: msg.emotion,
            confidence: msg.confidence,
            timestamp: msg.timestamp_offset,
          });
          break;
        case 'error':
          this.onError?.(new Error(msg.error?.message || 'StepAudio error'));
          break;
        default:
          // Unhandled event types — log for debugging
          // console.log('[AudioStreaming] Event:', msg.type);
      }
    } catch {
      // Not JSON — treat as raw text
      this.onTextReceived?.(raw);
    }
  }

  async handleAudioMessage(data) {
    try {
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'audio/wav' });
      this.onAudioReceived?.(blob);
      await this.playAudio(blob);
    } catch (err) {
      console.error('[AudioStreaming] Audio decode error:', err);
    }
  }

  // ── Audio playback ──
  async playAudio(blob) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.onended = () => { this.isPlaying = false; };
    source.start(0);
    this.isPlaying = true;
  }

  // ── Visualizer support ──
  getAnalyser() {
    if (!this.audioContext) return null;
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;
    return analyser;
  }

  // ── State ──
  getState() {
    return {
      connected: this.ws?.readyState === WebSocket.OPEN,
      recording: this.isRecording,
      playing: this.isPlaying,
    };
  }
}

// Singleton instance
let instance = null;
export function getAudioStreamingService() {
  if (!instance) instance = new AudioStreamingService();
  return instance;
}

export { AudioStreamingService };
