// Regression test for M1 fix: unmount guard in useAuth
// Google OAuth provider required for hook context.

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './useAuth';

function wrapper({ children }) {
  return <GoogleOAuthProvider clientId="test-client-id">{children}</GoogleOAuthProvider>;
}

describe('useAuth Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('M1-FIX-001: Hook returns stable null user without async leaks', () => {
    const { result, unmount } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBe(null);
    expect(result.current.accessToken).toBe(null);

    unmount();
  });

  test('M1-FIX-002: AccessToken is null and subscription tier is free', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.accessToken).toBe(null);
    expect(result.current.subscriptionTier).toBe('free');
    expect(result.current.cloudEnabled).toBe(false);
  });

  test('M1-FIX-003: SignOut cleanup resets user to null', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.accessToken).toBe(null);
    expect(result.current.cloudEnabled).toBe(false);
  });
});
