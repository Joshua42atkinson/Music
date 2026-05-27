// ═══════════════════════════════════════════════════════════
// AUTH CALLBACK — Handles OAuth redirect from Supabase
// Route: /auth/callback
//
// STRATEGY (in order):
// 1. Immediate getSession() — session may already be in localStorage
// 2. onAuthStateChange listener — catches Supabase processing the URL
// 3. Aggressive polling — retries every 300ms for 15s
// 4. getUser() fallback — sometimes more reliable than getSession()
// 5. Manual URL parsing — if code= param exists, force exchange
// 6. Page reload — if session was stored but we missed it, reload once
//
// NEVER silently redirect home on failure — show error instead.
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const STRATEGIES = [
  'Checking existing session...',
  'Waiting for auth event...',
  'Polling for session...',
  'Trying user lookup...',
  'Checking URL params...',
  'Reloading to recover...',
];

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);
  const [status, setStatus] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured on this deployment');
      return;
    }

    const routeToSong = (source) => {
      if (handled.current) return;
      handled.current = true;
      console.log('[AuthCallback] Success via:', source);
      navigate('/song', { replace: true });
    };

    // ── Strategy 1: Immediate getSession ──
    const checkImmediate = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          routeToSong('immediate getSession');
          return true;
        }
      } catch (e) {
        console.warn('[AuthCallback] getSession error:', e);
      }
      return false;
    };

    // ── Strategy 2: onAuthStateChange listener ──
    let listener = null;
    const setupListener = () => {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('[AuthCallback] Event:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          routeToSong('onAuthStateChange SIGNED_IN');
        }
        if (event === 'INITIAL_SESSION' && session?.user) {
          routeToSong('onAuthStateChange INITIAL_SESSION');
        }
      });
      listener = data.subscription;
    };

    // ── Strategy 3: Aggressive polling ──
    let pollInterval = null;
    const startPolling = () => {
      let attempts = 0;
      const maxAttempts = 50; // 50 × 300ms = 15 seconds
      pollInterval = setInterval(async () => {
        if (handled.current) return;
        attempts++;
        setStatus(2);

        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            routeToSong('poll getSession');
            clearInterval(pollInterval);
            return;
          }
        } catch (e) {
          console.warn('[AuthCallback] Poll error:', e);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          // Move to next strategy
          tryGetUser();
        }
      }, 300);
    };

    // ── Strategy 4: getUser() fallback ──
    const tryGetUser = async () => {
      if (handled.current) return;
      setStatus(3);
      try {
        const { data, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (data.user) {
          routeToSong('getUser');
          return;
        }
      } catch (e) {
        console.warn('[AuthCallback] getUser failed:', e);
      }
      // Move to next strategy
      tryUrlParams();
    };

    // ── Strategy 5: Manual URL hash parsing (PKCE code or implicit token) ──
    const tryUrlParams = async () => {
      if (handled.current) return;
      setStatus(4);
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      // PKCE flow: exchange code for session
      if (code) {
        console.log('[AuthCallback] Found PKCE code, exchanging...');
        try {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
          if (data.session?.user) {
            routeToSong('exchangeCodeForSession');
            return;
          }
        } catch (e) {
          console.warn('[AuthCallback] Code exchange failed:', e);
        }
      }

      // Implicit flow: parse hash fragment manually
      // Supabase detectSessionInUrl is unreliable with implicit flow (#455)
      const hash = url.hash;
      console.log('[AuthCallback] Checking hash for implicit tokens...');
      if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresAt = params.get('expires_at');
        const tokenType = params.get('token_type') || 'bearer';

        console.log('[AuthCallback] Hash tokens found — access:', !!accessToken, 'refresh:', !!refreshToken);

        if (accessToken) {
          try {
            const { data, error: setErr } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            if (setErr) throw setErr;
            if (data.session?.user) {
              // Clean hash from URL so it doesn't re-trigger
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              routeToSong('manual hash setSession');
              return;
            }
          } catch (e) {
            console.warn('[AuthCallback] setSession failed:', e);
          }
        }
      }

      // Move to final strategy
      tryReload();
    };

    // ── Strategy 6: Page reload (session may be in localStorage) ──
    const tryReload = () => {
      if (handled.current) return;
      const hasReloaded = sessionStorage.getItem('vv_auth_reload');
      if (!hasReloaded) {
        setStatus(5);
        sessionStorage.setItem('vv_auth_reload', '1');
        console.log('[AuthCallback] Reloading page to recover session...');
        window.location.reload();
      } else {
        setError('Could not establish session. Please try signing in again.');
      }
    };

    // ── Execute sequence ──
    const run = async () => {
      const found = await checkImmediate();
      if (found) return;

      setStatus(1);
      setupListener();
      startPolling();
    };

    run();

    return () => {
      listener?.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [navigate]);

  // ── UI ──
  if (error) {
    return (
      <div style={{
        minHeight: '100svh',
        background: '#050508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        color: '#c9a96e',
        padding: 24,
      }}>
        <span style={{ fontSize: '2rem' }}>⚠️</span>
        <p style={{ fontSize: '1rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>
        <button
          onClick={() => { sessionStorage.removeItem('vv_auth_reload'); window.location.href = '/'; }}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.3)',
            color: '#c9a96e',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: '#050508',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      color: '#c9a96e',
    }}>
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        border: '1px solid rgba(201,169,110,0.3)',
        animation: 'loadBreath 3s ease-in-out infinite',
      }} />
      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{STRATEGIES[status] || 'Signing you in...'}</p>
      <p style={{ fontSize: '0.6rem', opacity: 0.3, fontFamily: "'JetBrains Mono', monospace" }}>
        Strategy {status + 1}/6
      </p>
      <style>{`
        @keyframes loadBreath {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
