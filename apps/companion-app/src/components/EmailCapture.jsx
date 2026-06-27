// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : EmailCapture.jsx                                     ║
// ║ WHAT    : Email capture form for launch notifications          ║
// ║ WHY     : Collect interest before full launch, build audience  ║
// ║ WHO     : Landing page visitors (free tier prospects)          ║
// ║ OWNS    : Email input, submit, success state                   ║
// ║ NEEDS   : useLocale for i18n, localStorage for persistence     ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';
import { vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

export default function EmailCapture() {
  const { t, isFrench } = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      // Store locally — will sync to backend when available
      vvSet(STORAGE_KEYS.EMAIL_CAPTURE, { email, capturedAt: new Date().toISOString() });

      // TODO: Replace with real API endpoint when backend is ready
      // For now, simulate success
      await new Promise(r => setTimeout(r, 800));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-[rgba(122,170,136,0.06)] border border-[rgba(122,170,136,0.2)] p-6 text-center max-w-[440px] mx-auto">
        <CheckCircle2 size={28} className="text-[#7aaa88] mx-auto mb-3" />
        <p className="font-[EB_Garamond] text-[1rem] text-[#7aaa88] italic m-0">
          {isFrench
            ? 'Merci ! Nous vous préviendrons quand le mentorship sera ouvert.'
            : 'Thank you! We\'ll let you know when mentorship opens up.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[440px] mx-auto">
      <div className="flex items-center gap-2 mb-3 justify-center">
        <Mail size={16} className="text-cf-gold" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-cf-gold">
          {isFrench ? 'Restez informé' : 'Stay in the loop'}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder={isFrench ? 'votre@email.com' : 'your@email.com'}
          disabled={status === 'submitting'}
          className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-[0.85rem] text-[#e0d8c8] placeholder:text-[#5a6a7a] outline-none focus:border-[rgba(var(--cf-gold-rgb),0.4)] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-5 py-3 rounded-xl bg-cf-gold text-[#0d0d14] font-mono text-[0.75rem] font-bold uppercase tracking-[0.06em] border-none cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(var(--cf-gold-rgb),0.3)] disabled:opacity-50 flex items-center gap-1.5"
        >
          {status === 'submitting'
            ? '...'
            : (isFrench ? 'S\'inscrire' : 'Notify Me')}
          {status !== 'submitting' && <ArrowRight size={14} />}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-[0.7rem] text-[#e07070] mt-2 text-center">
          {isFrench ? 'Veuillez entrer un email valide' : 'Please enter a valid email'}
        </p>
      )}
      <p className="text-[0.6rem] text-[#5a6a7a] mt-2 text-center">
        {isFrench ? 'Pas de spam. Juste une notification au lancement.' : 'No spam. Just a launch notification.'}
      </p>
    </form>
  );
}
