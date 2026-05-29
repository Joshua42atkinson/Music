import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// BetaGate — Simple PIN gate for Troubadour AI beta testing
// No Supabase dependency. PIN stored in localStorage.
// ═══════════════════════════════════════════════════════════════════

const BETA_PINS = [
  'TROUbadour2026', // Master PIN
  'BERTRAND99',     // Friend/family
  'VOIXVIVE42',     // Early testers
  'MUSICIAN88',     // Music community
];

export function isBetaUnlocked() {
  return localStorage.getItem('voixvive_beta_unlocked') === 'true';
}

export default function BetaGate({ children }) {
  const [unlocked, setUnlocked] = useState(isBetaUnlocked());
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (unlocked) return children;

  const tryUnlock = () => {
    if (BETA_PINS.includes(pin.trim())) {
      localStorage.setItem('voixvive_beta_unlocked', 'true');
      setUnlocked(true);
    } else {
      setError('Invalid PIN. Contact Joshua for access.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>The Troubadour AI — Beta</h2>
        <p style={styles.desc}>
          This feature is in closed testing. Enter your beta PIN to access
          the AI mentor trained on Bertrand Laurence's pedagogy.
        </p>
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="Enter beta PIN"
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={tryUnlock} style={styles.button}>
          Unlock
        </button>
        <p style={styles.footer}>
          Not a beta tester? The full workbook and all practice tools are free.
          The AI will be available to all when testing is complete.
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5,5,8,0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    background: '#0a0a12',
    border: '1px solid rgba(251,191,36,0.2)',
    borderRadius: 16,
    padding: '32px 28px',
    maxWidth: 400,
    width: '90%',
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#fbbf24',
    margin: '0 0 12px',
    fontSize: '1.4rem',
  },
  desc: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)',
    color: '#f0e6d2',
    fontSize: '0.9rem',
    marginBottom: 12,
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #fbbf24, #c9a96e)',
    color: '#050508',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginBottom: 12,
  },
  error: {
    color: '#ef4444',
    fontSize: '0.75rem',
    margin: '0 0 10px',
  },
  footer: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.7rem',
    lineHeight: 1.4,
    margin: 0,
  },
};
