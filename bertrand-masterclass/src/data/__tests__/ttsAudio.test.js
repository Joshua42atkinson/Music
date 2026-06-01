// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : ttsAudio.test.js                                    ║
// ║ WHAT    : TTS audio quality tests for ear training           ║
// ║ WHY     : Audio must serve musical pedagogy, not just speech  ║
// ║ RUN     : npx vitest run ttsAudio                             ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import {
  TTS_AUDIO_TEST_CASES,
  getTTSParametersForCategory,
  analyzeAudioBuffer,
  detectPauses,
  scoreCadenceNaturalness,
} from '../ttsAudioSuite';

describe('TTS Audio Quality — Ear Training Requirements', () => {
  test('all audio test cases have required fields', () => {
    expect(TTS_AUDIO_TEST_CASES.length).toBeGreaterThan(0);

    for (const tc of TTS_AUDIO_TEST_CASES) {
      expect(tc.id).toBeDefined();
      expect(tc.text).toBeDefined();
      expect(tc.category).toBeDefined();
      expect(tc.why).toBeDefined();
      expect(tc.expected_duration).toBeGreaterThan(0);
    }
  });

  test('every category has a TTS parameter preset', () => {
    const categories = [...new Set(TTS_AUDIO_TEST_CASES.map(tc => tc.category))];
    for (const cat of categories) {
      const params = getTTSParametersForCategory(cat);
      expect(params).toBeDefined();
      expect(params.speed).toBeGreaterThan(0);
      expect(params.speed).toBeLessThanOrEqual(2);
      expect(params.why).toBeDefined();
    }
  });

  test('note names category requires slower speed', () => {
    const params = getTTSParametersForCategory('note_names');
    expect(params.speed).toBeLessThan(0.9); // Must be slower than normal
    expect(params.pause_between_words).toBeGreaterThan(0.1);
  });

  test('somatic guidance requires slowest speed', () => {
    const somatic = getTTSParametersForCategory('somatic_whisper');
    const technical = getTTSParametersForCategory('technical_french');
    expect(somatic.speed).toBeLessThan(technical.speed);
    expect(somatic.pause_between_words).toBeGreaterThan(technical.pause_between_words);
  });

  test('counting requires metronomic precision', () => {
    const params = getTTSParametersForCategory('counting');
    expect(params.speed).toBe(1.0); // Normal speed
    expect(params.emphasis).toBe('steady');
  });

  test('cadence scoring detects natural vs robotic speech', () => {
    // Natural speech: varied pauses
    const naturalPauses = [
      { start: 0.5, end: 0.7, duration: 0.2 },
      { start: 1.2, end: 1.6, duration: 0.4 },
      { start: 2.0, end: 2.15, duration: 0.15 },
    ];
    const naturalScore = scoreCadenceNaturalness(naturalPauses);
    expect(naturalScore).toBeGreaterThanOrEqual(3);

    // Robot speech: identical pauses
    const robotPauses = [
      { start: 0.5, end: 0.6, duration: 0.1 },
      { start: 1.0, end: 1.1, duration: 0.1 },
      { start: 1.5, end: 1.6, duration: 0.1 },
    ];
    const robotScore = scoreCadenceNaturalness(robotPauses);
    expect(robotScore).toBeLessThanOrEqual(2);
  });

  test('pause detection finds silent gaps', () => {
    // Create synthetic audio: 1 second of silence, 1 second of tone
    const sampleRate = 24000;
    const data = new Float32Array(sampleRate * 2);
    // First second: silence (0)
    // Second second: sine wave
    for (let i = sampleRate; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * 440 * (i - sampleRate) / sampleRate) * 0.5;
    }

    const mockBuffer = {
      getChannelData: () => data,
      sampleRate,
      duration: 2,
    };

    const pauses = detectPauses(mockBuffer, -40);
    expect(pauses.length).toBeGreaterThan(0);

    // The first second should be detected as a pause
    const firstPause = pauses[0];
    expect(firstPause.start).toBeCloseTo(0, 1);
    expect(firstPause.duration).toBeCloseTo(1.0, 1);
  });

  test('audio analysis returns all metrics', () => {
    // Create synthetic audio buffer
    const sampleRate = 24000;
    const duration = 2;
    const data = new Float32Array(sampleRate * duration);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
    }

    const mockBuffer = {
      getChannelData: () => data,
      sampleRate,
      duration,
    };

    const result = analyzeAudioBuffer(mockBuffer);
    expect(result.raw.duration).toBe(duration);
    expect(result.raw.sampleRate).toBe(sampleRate);
    expect(result.raw.rms).toBeGreaterThan(0);
    expect(result.raw.dynamicRange_dB).toBeGreaterThan(0);
    expect(result.scores).toBeDefined();
  });

  test('emphasis guidance needs dynamic parameters', () => {
    const params = getTTSParametersForCategory('emphasis_guidance');
    expect(params.emphasis).toBe('dynamic');
    expect(params.speed).toBeLessThan(1.0); // Slower for emphasis words
  });
});
