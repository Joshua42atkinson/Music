import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';

// ═══════════════════════════════════════════════════════════
// PIN VERIFICATION MODAL — Extracted from LandingScreen
// Glassmorphic numeric keypad with 4-digit PIN entry
// ═══════════════════════════════════════════════════════════

export default function PinModal({
  show,
  pinTargetName,
  enteredPin,
  setEnteredPin,
  pinError,
  setPinError,
  onSubmit,
  onClose,
}) {
  const { t } = useLocale();

  const handleDigit = (digit) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      setPinError(false);
      if (newPin.length === 4) {
        onSubmit(newPin);
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={{
            position: 'fixed', inset: 0, zIndex: 600,
            background: 'rgba(0,0,0,0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            style={{
              background: '#0a0a0f',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '24px',
              padding: '28px', width: '100%', maxWidth: '320px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
          >
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem', color: '#f0e6d2', margin: '0 0 4px'
              }}>
                {t('verifyIdentity')}
              </h3>
              <p style={{
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(255,255,255,0.4)', margin: 0
              }}>
                {t('enterPinFor')} {pinTargetName}
              </p>
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: '12px', margin: '10px 0' }}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: enteredPin.length > idx ? '#c9a96e' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${enteredPin.length > idx ? '#c9a96e' : 'rgba(201,169,110,0.25)'}`,
                    boxShadow: enteredPin.length > idx ? '0 0 12px #c9a96e' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>

            {pinError && (
              <motion.p
                animate={{ x: [-10, 10, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                style={{
                  color: '#ff6b6b', fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace", margin: 0
                }}
              >
                {t('incorrectPin')}
              </motion.p>
            )}

            {/* Numeric keypad */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px', width: '100%'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDigit(String(num))}
                  style={{
                    padding: '16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(201,169,110,0.1)',
                    color: '#f0e6d2', fontSize: '1.25rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer', outline: 'none'
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => { setEnteredPin(''); setPinError(false); }}
                style={{
                  padding: '16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(201,169,110,0.1)',
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer', outline: 'none'
                }}
              >
                {t('clear')}
              </button>
              <button
                onClick={() => handleDigit('0')}
                style={{
                  padding: '16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(201,169,110,0.1)',
                  color: '#f0e6d2', fontSize: '1.25rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer', outline: 'none'
                }}
              >
                0
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '16px', borderRadius: '12px',
                  background: 'rgba(255,40,40,0.04)',
                  border: '1px solid rgba(255,40,40,0.15)',
                  color: '#ff6b6b', fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer', outline: 'none'
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
