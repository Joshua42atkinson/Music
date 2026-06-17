import React, { useState } from 'react';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ═══════════════════════════════════════════════════════════════════
// BetaGate — Simple PIN gate for Truebadour AI beta testing
// No Supabase dependency. PIN stored in localStorage.
// ═══════════════════════════════════════════════════════════════════

const BETA_PINS = [
  'TROUbadour2026', // Master PIN
  'BERTRAND99',     // Friend/family
  'VOIXVIVE42',     // Early testers
  'MUSICIAN88',     // Music community
];

// eslint-disable-next-line react-refresh/only-export-components
export function isBetaUnlocked() {
  return vvGet(STORAGE_KEYS.BETA_UNLOCKED) === 'true';
}

export default function BetaGate({ children }) {
  const [unlocked, setUnlocked] = useState(isBetaUnlocked());
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (unlocked) return children;

  const tryUnlock = () => {
    if (BETA_PINS.includes(pin.trim())) {
      vvSet(STORAGE_KEYS.BETA_UNLOCKED, 'true');
      setUnlocked(true);
    } else {
      setError('Invalid PIN. Contact Joshua for access.');
    }
  };

  return (
    <div className="fixed inset-0 bg-cf-void/92 flex items-center justify-center z-[9999]">
      <div className="bg-[#0a0a12] border border-amber-400/20 rounded-2xl py-8 px-7 max-w-[400px] w-[90%] text-center">
        <h2 className="font-heading text-amber-400 m-0 mb-3 text-[1.4rem]">The Truebadour AI — Beta</h2>
        <p className="text-white/55 text-[0.85rem] leading-[1.5] m-0 mb-5">
          This feature is in closed testing. Enter your beta PIN to access
          the AI mentor trained on Bertrand Laurence's pedagogy.
        </p>
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="Enter beta PIN"
          className="w-full py-3 px-3.5 rounded-lg border border-white/15 bg-white/5 text-vv-text text-[0.9rem] mb-3 outline-none focus:border-white/25 transition-colors"
        />
        {error && <p className="text-red-500 text-[0.75rem] m-0 mb-2.5">{error}</p>}
        <button onClick={tryUnlock} className="w-full py-3 rounded-lg border-none bg-gradient-to-br from-amber-400 to-cf-gold text-cf-void font-bold text-[0.85rem] cursor-pointer mb-3">
          Unlock
        </button>
        <p className="text-white/30 text-[0.7rem] leading-[1.4] m-0">
          Not a beta tester? The full workbook and all practice tools are free.
          The AI will be available to all when testing is complete.
        </p>
      </div>
    </div>
  );
}
