import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../useAuth';

function wrapper({ children }) {
  return <GoogleOAuthProvider clientId="test-client-id">{children}</GoogleOAuthProvider>;
}

describe('useAuth', () => {
  it('returns null user and accessToken initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
  });

  it('returns loading state and free tier', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.subscriptionTier).toBe('free');
    expect(result.current.cloudEnabled).toBe(false);
  });

  it('signOut clears user and accessToken', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.signOut();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.cloudEnabled).toBe(false);
  });

  it('signInWithGoogle is callable', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      result.current.signInWithGoogle();
    });
    // Should not throw; actual Google popup requires real browser context
  });

  it('upgradeTier does not throw', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await expect(result.current.upgradeTier()).resolves.toBeUndefined();
    });
  });

  it('toggleCloud flips cloudEnabled', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      result.current.toggleCloud();
    });
    expect(result.current.cloudEnabled).toBe(true);
  });
});
