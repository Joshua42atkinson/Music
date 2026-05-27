// ═══════════════════════════════════════════════════════════
// AUTH CALLBACK — Handles OAuth redirect from Supabase
// Route: /auth/callback
// ═══════════════════════════════════════════════════════════

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      navigate('/');
      return;
    }

    // Supabase handles the hash fragment automatically
    // We just need to wait a tick for the session to be established
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/song'); // Send logged-in users to the Song portal
      } else {
        navigate('/');
      }
    };

    // Small delay to let Supabase process the auth code
    const timer = setTimeout(checkSession, 500);
    return () => clearTimeout(timer);
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
