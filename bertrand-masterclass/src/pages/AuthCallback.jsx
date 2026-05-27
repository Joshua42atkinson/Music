// ═══════════════════════════════════════════════════════════
// AUTH CALLBACK — Handles OAuth redirect from Supabase
// Route: /auth/callback
//
// Supabase with detectSessionInUrl:true auto-processes the URL hash.
// We listen for onAuthStateChange SIGNED_IN event, then route.
// Timeout fallback: poll getSession() with retries.
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (!supabase) {
      navigate('/');
      return;
    }

    // ── Primary: wait for onAuthStateChange ──
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (handled.current) return;
      console.log('[AuthCallback] Event:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        handled.current = true;
        console.log('[AuthCallback] SIGNED_IN — routing to /song');
        navigate('/song', { replace: true });
      }
    });

    // ── Fallback: poll getSession for up to 6 seconds ──
    let attempts = 0;
    const maxAttempts = 12;
    const poll = setInterval(async () => {
      if (handled.current) return;
      attempts++;

      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        handled.current = true;
        console.log('[AuthCallback] Fallback poll found session — routing to /song');
        clearInterval(poll);
        navigate('/song', { replace: true });
      } else if (attempts >= maxAttempts) {
        handled.current = true;
        console.warn('[AuthCallback] No session after 6s — routing to /');
        clearInterval(poll);
        navigate('/', { replace: true });
      }
    }, 500);

    return () => {
      listener.subscription.unsubscribe();
      clearInterval(poll);
    };
  }, [navigate]);

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
      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Signing you in...</p>
      <style>{`
        @keyframes loadBreath {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
