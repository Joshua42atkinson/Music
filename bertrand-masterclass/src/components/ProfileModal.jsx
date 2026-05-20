import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';

export default function ProfileModal({ show, newProfileName, setNewProfileName, newProfileStyle, setNewProfileStyle, newProfilePin, setNewProfilePin, onClose, onCreate }) {
  const { t } = useLocale();
  if (!show) return null;

  const fieldStyle = { width: '100%', background: '#050508', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', padding: '10px', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace", color: 'white', outline: 'none' };
  const labelStyle = { fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(201,169,110,0.6)', textTransform: 'uppercase' };

  return (
    <AnimatePresence>
      <motion.div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div style={{ background: '#0d0d14', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0e6d2', borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '8px', margin: 0 }}>{t('createZenProfile')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={labelStyle}>{t('studentName')}</label>
            <input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} style={fieldStyle} placeholder={t('namePlaceholder')} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={labelStyle}>{t('guitarStyleTarget')}</label>
            <select value={newProfileStyle} onChange={(e) => setNewProfileStyle(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
              <option value="Acoustic">{t('acousticMelody')}</option>
              <option value="Classical">{t('classicalPolyphony')}</option>
              <option value="Flamenco">{t('flamencoAutonomic')}</option>
              <option value="Jazz">{t('jazzChordFlow')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={labelStyle}>{t('securityPin')}</label>
            <input type="password" maxLength={4} value={newProfilePin} onChange={(e) => setNewProfilePin(e.target.value.replace(/[^0-9]/g, ''))} style={{ ...fieldStyle, letterSpacing: '0.3em' }} placeholder="e.g. 1234" />
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8a9aaa', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer' }}>{t('cancel')}</button>
            <button onClick={onCreate} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#c9a96e', border: 'none', color: '#0d0d14', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold', cursor: 'pointer' }}>{t('create')}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
