// ═══════════════════════════════════════════════════════════
// USE AUTH — Manages Supabase auth state across the app
// Returns: user, session, signIn, signOut, loading
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase not configured');
    // Save where the user was so we can redirect back after auth
    const returnTo = window.location.pathname + window.location.search;
    if (returnTo !== '/auth/callback') {
      localStorage.setItem('voixvive_auth_return_to', returnTo);
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('[useAuth] Starting OAuth...');
    console.log('[useAuth] redirectTo:', redirectTo);
    console.log('[useAuth] origin:', window.location.origin);
    console.log('[useAuth] href:', window.location.href);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'openid email profile',
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('[useAuth] signInWithOAuth error:', error);
      throw error;
    }

    // Log the generated OAuth URL for debugging
    if (data?.url) {
      console.log('[useAuth] Generated OAuth URL:', data.url);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  }, []);

  return { user, session, loading, signInWithGoogle, signOut };
}

export default useAuth;
