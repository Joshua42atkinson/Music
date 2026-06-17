import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioStreamingService, getAudioStreamingService } from '../audioStreamingService';

// Mock devLog
vi.mock('../devLog', () => ({
  devLog: vi.fn(),
}));

describe('AudioStreamingService', () => {
  let service;
  let mockWs;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AudioStreamingService();

    // Mock WebSocket (must be a proper constructor)
    mockWs = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: 0,
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3,
    };
    global.WebSocket = vi.fn().mockImplementation(function(url) {
      return mockWs; // Explicit return so new WebSocket() === mockWs
    });
    global.WebSocket.CONNECTING = 0;
    global.WebSocket.OPEN = 1;
    global.WebSocket.CLOSING = 2;
    global.WebSocket.CLOSED = 3;

    // Mock MediaRecorder (must be a proper constructor)
    global.MediaRecorder = vi.fn().mockImplementation(function(stream, options) {
      this.stream = stream;
      this.start = vi.fn();
      this.stop = vi.fn();
      this.ondataavailable = null;
    });
    global.MediaRecorder.isTypeSupported = vi.fn(() => true);

    // Mock navigator.mediaDevices
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    };

    // Mock AudioContext
    const mockAudioBuffer = {
      duration: 1,
      length: 44100,
      sampleRate: 44100,
      numberOfChannels: 1,
      getChannelData: vi.fn(() => new Float32Array(44100)),
    };
    global.AudioContext = vi.fn(() => ({
      state: 'running',
      destination: {},
      resume: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      decodeAudioData: vi.fn().mockResolvedValue(mockAudioBuffer),
      createBufferSource: vi.fn(() => ({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        onended: null,
      })),
      createAnalyser: vi.fn(() => ({
        fftSize: 0,
        connect: vi.fn(),
      })),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('connection lifecycle', () => {
    it('connects and resolves on open', async () => {
      const connectPromise = service.connect('ws://test');

      // Simulate WebSocket open
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();

      await expect(connectPromise).resolves.toBeUndefined();
      expect(service.ws).toBe(mockWs);
    });

    it('disconnects and cleans up', async () => {
      const connectPromise = service.connect('ws://test');
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();
      await connectPromise;

      service.disconnect();
      expect(mockWs.close).toHaveBeenCalled();
      expect(service.ws).toBeNull();
    });

    it('sends auth token on connect', async () => {
      const connectPromise = service.connect('ws://test', 'token-123');
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();

      await connectPromise;
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({ type: 'auth', token: 'token-123' })
      );
    });

    it('getState reflects connection status', async () => {
      expect(service.getState().connected).toBe(false);

      const connectPromise = service.connect('ws://test');
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();
      await connectPromise;

      expect(service.getState().connected).toBe(true);
    });
  });

  describe('text messaging', () => {
    it('sendTextMessage sends conversation item', async () => {
      const connectPromise = service.connect('ws://test');
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();
      await connectPromise;

      service.sendTextMessage('Hello');
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('conversation.item.create')
      );
    });

    it('handleTextMessage parses transcript', () => {
      const onText = vi.fn();
      service.onTextReceived = onText;

      service.handleTextMessage(JSON.stringify({
        type: 'response.audio_transcript.done',
        transcript: 'Hello world',
      }));

      expect(onText).toHaveBeenCalledWith('Hello world');
    });

    it('handleTextMessage parses paralinguistic events', () => {
      const onPara = vi.fn();
      service.onParalinguistic = onPara;

      service.handleTextMessage(JSON.stringify({
        type: 'paralinguistic.event',
        emotion: 'calm',
        confidence: 0.9,
        timestamp_offset: 1000,
      }));

      expect(onPara).toHaveBeenCalledWith({
        emotion: 'calm',
        confidence: 0.9,
        timestamp: 1000,
      });
    });

    it('handleTextMessage handles plain text fallback', () => {
      const onText = vi.fn();
      service.onTextReceived = onText;

      service.handleTextMessage('Plain text response');
      expect(onText).toHaveBeenCalledWith('Plain text response');
    });
  });

  describe('recording', () => {
    it('startRecording begins media recording', async () => {
      await service.startRecording();
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true, video: false });
      expect(service.isRecording).toBe(true);
    });

    it('stopRecording cleans up tracks', async () => {
      await service.startRecording();
      service.stopRecording();
      expect(service.isRecording).toBe(false);
    });

    it('disconnect stops recording', async () => {
      await service.startRecording();
      const connectPromise = service.connect('ws://test');
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) mockWs.onopen();
      await connectPromise;

      service.disconnect();
      expect(service.isRecording).toBe(false);
    });
  });

  describe('singleton', () => {
    it('getAudioStreamingService returns the same instance', () => {
      const a = getAudioStreamingService();
      const b = getAudioStreamingService();
      expect(a).toBe(b);
    });
  });
});
