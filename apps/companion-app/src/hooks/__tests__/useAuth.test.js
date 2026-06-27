import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

const storageStore = new Map();
vi.mock('../../lib/storage', () => ({
  vvGetJSON: vi.fn((key) => storageStore.get(key) || null),
  vvSetJSON: vi.fn((key, value) => storageStore.set(key, value)),
  vvRemove: vi.fn((key) => storageStore.delete(key)),
}));

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(() => vi.fn()),
  GoogleOAuthProvider: ({ children }) => children,
  googleLogout: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageStore.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip('hydrates session from storage', () => {
    storageStore.set('vv_google_user', { email: 'test@example.com' });
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual({ email: 'test@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it.skip('signOut removes session from storage and updates state', async () => {
    storageStore.set('vv_google_user', { email: 'test@example.com' });
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(storageStore.has('vv_google_user')).toBe(false);
  });
});
