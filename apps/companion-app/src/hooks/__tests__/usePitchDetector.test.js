import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import usePitchDetector from '../usePitchDetector';
import * as audioEngine from '../../audio/audioEngine';
import { emitNotePlayed } from '../../lib/bevyEventBus';

vi.mock('../../audio/audioEngine', () => ({
  getAudioContext: vi.fn(),
  initMicrophone: vi.fn(),
  closeMicrophone: vi.fn(),
}));

vi.mock('../../lib/bevyEventBus', () => ({
  emitNotePlayed: vi.fn(),
}));

describe('usePitchDetector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts inactive with default state', () => {
    const { result } = renderHook(() => usePitchDetector());
    
    expect(result.current.isListening).toBe(false);
    expect(result.current.pitch).toBe(null);
    expect(result.current.volume).toBe(0);
    expect(result.current.breathState).toBe('free');
  });

  it('sets error if microphone fails', async () => {
    audioEngine.initMicrophone.mockRejectedValue(new Error('Denied'));
    audioEngine.getAudioContext.mockReturnValue({ state: 'running' });

    const { result } = renderHook(() => usePitchDetector());

    await act(async () => {
      await result.current.startListening();
    });

    expect(result.current.isListening).toBe(false);
    expect(result.current.error).toBe('Please allow microphone access to use this feature.');
  });

  it('handles suspended audio context', async () => {
    const mockResume = vi.fn().mockRejectedValue(new Error('User gesture required'));
    audioEngine.getAudioContext.mockReturnValue({ 
      state: 'suspended',
      resume: mockResume
    });

    const { result } = renderHook(() => usePitchDetector());

    await act(async () => {
      await result.current.startListening();
    });

    expect(mockResume).toHaveBeenCalled();
    expect(result.current.error).toBe('Click to enable pitch detection — browser autoplay policy requires a user gesture.');
    expect(result.current.isListening).toBe(false);
  });
});
