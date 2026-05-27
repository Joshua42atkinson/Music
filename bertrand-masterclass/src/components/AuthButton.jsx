// ═══════════════════════════════════════════════════════════
// AUTH BUTTON — Login / Logout / User Avatar
// Placed in navigation bars across all pages
// ═══════════════════════════════════════════════════════════

import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthButton({ compact = false }) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div style={{
        width: compact ? 28 : 80,
        height: 28,
        borderRadius: 8,
        background: 'rgba(201,169,110,0.08)',
        border: '1px solid rgba(201,169,110,0.15)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
    );
  }

  if (user) {
    // Logged in — show avatar or name + logout
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'You';
    const avatar = user.user_metadata?.avatar_url;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '1px solid rgba(201,169,110,0.3)',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={14} color="#c9a96e" />
          </div>
        )}
        {!compact && (
          <span style={{
            fontSize: '0.75rem', color: '#c9a96e', opacity: 0.8,
            maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{name}</span>
        )}
        <button
          onClick={signOut}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(201,169,110,0.08)',
            border: '1px solid rgba(201,169,110,0.2)',
            color: '#c9a96e',
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201,169,110,0.15)';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)';
          }}
        >
          <LogOut size={12} />
          {!compact && 'Leave'}
        </button>
      </div>
    );
  }

  // Not logged in — show login button
  const handleSignIn = async () => {
    try {
      console.log('[AuthButton] Starting Google sign-in...');
      await signInWithGoogle();
    } catch (err) {
      console.error('[AuthButton] Sign-in failed:', err);
      alert('Sign-in failed. Check browser console for details.');
    }
  };

  return (
    <button
      onClick={handleSignIn}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        background: 'rgba(201,169,110,0.12)',
        border: '1px solid rgba(201,169,110,0.3)',
        color: '#c9a96e',
        fontSize: '0.75rem',
        fontFamily: "'JetBrains Mono', monospace",
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.2)';
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.12)';
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
      }}
    >
      <LogIn size={14} />
      {compact ? 'In' : 'Sign In'}
    </button>
  );
}
