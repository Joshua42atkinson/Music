import { useState } from 'react';
import { LogIn, LogOut, User, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';

export default function AuthButton({ compact = false }) {
  const { user, loading, signInWithGoogle, signOut, cloudEnabled, toggleCloud } = useAuth();
  const { t } = useLocale();
  const [lastError, setLastError] = useState(null);

  if (loading) {
    return (
      <div
        className={`h-7 rounded-lg bg-cf-gold/[0.08] border border-cf-gold/15 animate-pulse ${compact ? 'w-7' : 'w-20'}`}
      />
    );
  }

  // ── Logged in ──
  if (user) {
    const name = user.name || user.email?.split('@')[0] || 'You';
    const avatar = user.picture;

    return (
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-7 h-7 rounded-full border border-cf-gold/30 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-cf-gold/[0.15] border border-cf-gold/30 flex items-center justify-center">
            <User size={14} color="var(--cf-gold)" />
          </div>
        )}
        {!compact && (
          <span className="text-[0.75rem] text-cf-gold/80 max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
        )}

        {/* Cloud sync toggle */}
        {!compact && (
          <button
            onClick={toggleCloud}
            title={cloudEnabled ? 'Cloud sync ON' : 'Cloud sync OFF'}
            className={`p-1.5 rounded-md transition-all duration-200 ${
              cloudEnabled
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-cf-gold/[0.08] text-cf-gold/60 border border-cf-gold/20 hover:bg-cf-gold/[0.15]'
            }`}
          >
            {cloudEnabled ? <Cloud size={12} /> : <CloudOff size={12} />}
          </button>
        )}

        <button
          onClick={signOut}
          className="py-1.5 px-2.5 rounded-lg bg-cf-gold/[0.08] border border-cf-gold/20 text-cf-gold text-[0.7rem] font-mono cursor-pointer flex items-center gap-1 transition-all duration-300 hover:bg-cf-gold/[0.15] hover:border-cf-gold/40"
        >
          <LogOut size={12} />
          {!compact && t('signOut')}
        </button>
      </div>
    );
  }

  // ── Not logged in ──
  const handleSignIn = async () => {
    setLastError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLastError(err?.message || String(err));
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSignIn}
        className="py-1.5 px-3.5 rounded-lg bg-white/[0.06] border border-white/10 text-white/80 text-[0.75rem] font-mono cursor-pointer flex items-center gap-1.5 transition-all duration-300 hover:bg-white/[0.10] hover:border-white/20 hover:text-white"
      >
        <LogIn size={14} />
        {compact ? 'Sign In' : 'Sign in with Google'}
      </button>
      {!compact && (
        <span className="text-[0.6rem] text-white/40 font-mono max-w-[180px] text-right leading-[1.3]">
          Optional — all data stays local by default
        </span>
      )}
      {lastError && !compact && (
        <span className="text-[0.6rem] text-red-500 font-mono max-w-[180px] text-right leading-[1.3]">
          {lastError}
        </span>
      )}
    </div>
  );
}
