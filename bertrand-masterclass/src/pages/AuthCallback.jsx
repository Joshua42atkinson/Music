// ═══════════════════════════════════════════════════════════
// AUTH CALLBACK — Handles OAuth redirect from Supabase
// Route: /auth/callback
//
// Supabase detectSessionInUrl is DISABLED in supabase.js.
// This component is now the ONLY place that processes auth tokens.
// No polling, no race conditions — just parse hash, set session, route.
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured');
      return;
    }

    const handleAuth = async () => {
      const url = new URL(window.location.href);
      const hash = url.hash;
      console.log('[AuthCallback] URL:', window.location.href);
      console.log('[AuthCallback] Hash:', hash);
      console.log('[AuthCallback] Search:', window.location.search);
      console.log('[AuthCallback] Code:', url.searchParams.get('code'));
      console.log('[AuthCallback] Error:', url.searchParams.get('error'));
      console.log('[AuthCallback] Error desc:', url.searchParams.get('error_description'));

      // ── CASE 1: Implicit flow (#access_token in hash) ──
      if (hash && hash.includes('access_token=')) {
        setStatus('Processing tokens...');
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken) {
          setError('No access token found in URL');
          return;
        }

        try {
          const { data, error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (setErr) throw setErr;

          if (data.session?.user) {
            // Clean the hash from URL
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            setStatus('Signed in!');
            // Redirect back to where the user came from, or default to /song
            const returnTo = localStorage.getItem('voixvive_auth_return_to');
            localStorage.removeItem('voixvive_auth_return_to');
            const dest = returnTo && returnTo !== '/auth/callback' ? returnTo : '/song';
            setTimeout(() => navigate(dest, { replace: true }), 300);
            return;
          }
        } catch (e) {
          console.error('[AuthCallback] setSession failed:', e);
          setError(`Token processing failed: ${e.message || e}`);
          return;
        }
      }

      // ── CASE 2: PKCE flow (?code= query param) ──
      const code = url.searchParams.get('code');
      if (code) {
        setStatus('Exchanging code...');
        try {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
          if (data.session?.user) {
            setStatus('Signed in!');
            const returnTo = localStorage.getItem('voixvive_auth_return_to');
            localStorage.removeItem('voixvive_auth_return_to');
            const dest = returnTo && returnTo !== '/auth/callback' ? returnTo : '/song';
            setTimeout(() => navigate(dest, { replace: true }), 300);
            return;
          }
        } catch (e) {
          console.error('[AuthCallback] Code exchange failed:', e);
          setError(`Code exchange failed: ${e.message || e}`);
          return;
        }
      }

      // ── CASE 3: Already have session (returning user) ──
      setStatus('Checking session...');
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setStatus('Signed in!');
          const returnTo = localStorage.getItem('voixvive_auth_return_to');
          localStorage.removeItem('voixvive_auth_return_to');
          const dest = returnTo && returnTo !== '/auth/callback' ? returnTo : '/song';
          setTimeout(() => navigate(dest, { replace: true }), 300);
          return;
        }
      } catch (e) {
        console.warn('[AuthCallback] getSession error:', e);
      }

      // ── CASE 4: OAuth returned an error ──
      const oauthError = url.searchParams.get('error');
      const oauthErrorDesc = url.searchParams.get('error_description');
      if (oauthError) {
        console.error('[AuthCallback] OAuth error from provider:', oauthError, oauthErrorDesc);
        setError(`OAuth error: ${oauthError}${oauthErrorDesc ? ' — ' + oauthErrorDesc : ''}`);
        return;
      }

      // ── Nothing worked ──
      setError('Could not sign in. No token or session found.');
    };

    handleAuth();
  }, [navigate]);

  // ── Error UI ──
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
        <p style={{ fontSize: '1rem', color: '#ef4444', textAlign: 'center', maxWidth: 400 }}>{error}</p>
        <button
          onClick={() => { window.location.href = '/'; }}
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

  // ── Loading UI ──
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
      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{status}</p>
      <style>{`
        @keyframes loadBreath {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
