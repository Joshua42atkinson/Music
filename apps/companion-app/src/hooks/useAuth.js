import { devWarn } from '../lib/devLog';
// ═══════════════════════════════════════════════════════════
// USE AUTH — Google OAuth (no Supabase)
// Optional cloud mode: user chooses local-only or Google sync
// ═══════════════════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { vvGetJSON, vvSetJSON, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { hasGoogleClientId, GOOGLE_CLIENT_ID } from '../config/google';
import { open } from '@tauri-apps/plugin-shell';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { devError } from '../lib/devLog';

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

const isTauri = () => typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

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
  const [subscriptionTier, setSubscriptionTier] = useState(() => {
    return vvGetJSON(STORAGE_KEYS.SUBSCRIPTION_TIER) || 'free';
  });

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

  // ── Native Deep Link Handler for Tauri ──
  useEffect(() => {
    if (!isTauri()) return;

    let unlisten;
    async function setupDeepLink() {
      unlisten = await onOpenUrl((urls) => {
        const url = urls[0];
        if (url && url.includes('access_token=')) {
          // Parse hash fragment since we use response_type=token
          const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
          const token = params.get('access_token');
          const expiresIn = params.get('expires_in') || 3600;
          
          if (token) {
            handleNativeSuccess({ access_token: token, expires_in: parseInt(expiresIn, 10) });
          }
        }
      });
    }
    setupDeepLink();
    
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleNativeSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const profile = await fetchGoogleProfile(tokenResponse.access_token);
      const tokenData = {
        access_token: tokenResponse.access_token,
        expires_at: Date.now() + (tokenResponse.expires_in || 3600) * 1000,
      };

      // Merge scopes if returning from elevation
      const currentTokenData = vvGetJSON(STORAGE_KEYS.GOOGLE_TOKEN, null);
      if (currentTokenData?.access_token) {
         tokenData.scopes = currentTokenData.scopes || '';
      }

      vvSetJSON(STORAGE_KEYS.GOOGLE_TOKEN, tokenData);
      vvSetJSON(STORAGE_KEYS.GOOGLE_USER, profile);

      setAccessToken(tokenResponse.access_token);
      setUser(profile);
      // Only reset cloud if it's a completely new login
      if (!user) setCloudEnabled(false);
    } catch (err) {
      devError('[useAuth] Native login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Web Google login handler ──
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
        devError('[useAuth] Login failed:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      devError('[useAuth] Google login error:', error);
      setLoading(false);
    },
    scope: 'openid email profile https://www.googleapis.com/auth/generative-language',
  });

  const signInWithGoogle = useCallback(() => {
    if (!hasGoogleClientId()) {
      devWarn('[useAuth] Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
      return;
    }

    if (isTauri()) {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=com.voixvive.app:/oauth2redirect&` +
        `response_type=token&` +
        `scope=openid%20email%20profile%20https://www.googleapis.com/auth/generative-language`;
      open(authUrl);
      return;
    }

    setLoading(true);
    login();
  }, [login]);

  const elevateScopesWeb = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Merge the new token scopes with the existing session
      const tokenData = vvGetJSON(STORAGE_KEYS.GOOGLE_TOKEN, {});
      tokenData.access_token = tokenResponse.access_token;
      tokenData.expires_at = Date.now() + (tokenResponse.expires_in || 3600) * 1000;
      tokenData.scopes = tokenResponse.scope;
      vvSetJSON(STORAGE_KEYS.GOOGLE_TOKEN, tokenData);
      setAccessToken(tokenResponse.access_token);
    },
    onError: (error) => {
      devError('[useAuth] Scope elevation error:', error);
    },
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/youtube.upload'
  });

  const elevateScopes = useCallback(() => {
    if (isTauri()) {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=com.voixvive.app:/oauth2redirect&` +
        `response_type=token&` +
        `scope=openid%20email%20profile%20https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/youtube.upload`;
      open(authUrl);
      return;
    }
    elevateScopesWeb();
  }, [elevateScopesWeb]);

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

  const upgradeTier = useCallback(async (tier) => {
    // TODO: Stripe Checkout redirect or Google Play Billing
    // For now, persist tier locally so the UI can respond
    setSubscriptionTier(tier);
    vvSetJSON(STORAGE_KEYS.SUBSCRIPTION_TIER, tier);
  }, []);

  return {
    user,
    accessToken,
    loading,
    subscriptionTier,
    cloudEnabled,
    signInWithGoogle,
    elevateScopes,
    signOut,
    upgradeTier,
    toggleCloud,
  };
}

export default useAuth;
