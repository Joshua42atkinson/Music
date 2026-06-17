// ═══════════════════════════════════════════════════════════
// USE AUTH — Google OAuth (no Supabase)
// Optional cloud mode: user chooses local-only or Google sync
// ═══════════════════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { vvGetJSON, vvSetJSON, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { hasGoogleClientId } from '../config/google';

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

/** Fetch Google profile with access token */
async function fetchGoogleProfile(accessToken) {
  const res = await fetch(`${GOOGLE_USERINFO_URL}&access_token=${accessToken}`);
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const [subscriptionTier] = useState('free');

  // ── Restore session from storage on mount ──
  useEffect(() => {
    const tokenData = vvGetJSON(STORAGE_KEYS.GOOGLE_TOKEN, null);
    const userData = vvGetJSON(STORAGE_KEYS.GOOGLE_USER, null);
    const cloud = vvGetJSON(STORAGE_KEYS.CLOUD_ENABLED, false);

    if (tokenData?.access_token && tokenData?.expires_at > Date.now()) {
      setAccessToken(tokenData.access_token);
      setUser(userData);
      setCloudEnabled(cloud);
    } else if (tokenData) {
      // Token expired — clear it
      vvRemove(STORAGE_KEYS.GOOGLE_TOKEN);
      vvRemove(STORAGE_KEYS.GOOGLE_USER);
    }

    setLoading(false);
  }, []);

  // ── Google login handler ──
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const profile = await fetchGoogleProfile(tokenResponse.access_token);
        const tokenData = {
          access_token: tokenResponse.access_token,
          expires_at: Date.now() + (tokenResponse.expires_in || 3600) * 1000,
        };

        vvSetJSON(STORAGE_KEYS.GOOGLE_TOKEN, tokenData);
        vvSetJSON(STORAGE_KEYS.GOOGLE_USER, profile);

        setAccessToken(tokenResponse.access_token);
        setUser(profile);
        setCloudEnabled(false); // user must explicitly enable
      } catch (err) {
        console.error('[useAuth] Login failed:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('[useAuth] Google login error:', error);
      setLoading(false);
    },
    scope: 'openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar',
  });

  const signInWithGoogle = useCallback(() => {
    if (!hasGoogleClientId()) {
      console.warn('[useAuth] Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
      return;
    }
    setLoading(true);
    login();
  }, [login]);

  const signOut = useCallback(() => {
    googleLogout();
    vvRemove(STORAGE_KEYS.GOOGLE_TOKEN);
    vvRemove(STORAGE_KEYS.GOOGLE_USER);
    setAccessToken(null);
    setUser(null);
    setCloudEnabled(false);
  }, []);

  const toggleCloud = useCallback(() => {
    const next = !cloudEnabled;
    setCloudEnabled(next);
    vvSetJSON(STORAGE_KEYS.CLOUD_ENABLED, next);
  }, [cloudEnabled]);

  const upgradeTier = useCallback(async () => {
    // TODO: Google Play Billing or Stripe integration
    console.warn('[useAuth] Payment integration not yet configured');
  }, []);

  return {
    user,
    accessToken,
    loading,
    subscriptionTier,
    cloudEnabled,
    signInWithGoogle,
    signOut,
    upgradeTier,
    toggleCloud,
  };
}

export default useAuth;
