import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';

export default function ProfileModal({ show, newProfileName, setNewProfileName, newProfileStyle, setNewProfileStyle, newProfilePin, setNewProfilePin, onClose, onCreate }) {
  const { t } = useLocale();
  if (!show) return null;

  const fieldClass = "w-full bg-[#050508] border border-cf-gold/20 rounded-lg py-2.5 px-2.5 text-[0.8rem] font-mono text-white outline-none";
  const labelClass = "text-[0.65rem] font-mono text-cf-gold/60 uppercase";

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[500] bg-black/92 backdrop-blur-[8px] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-[#0d0d14] border border-cf-gold/25 rounded-[20px] p-6 w-full max-w-[360px] flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
          <h3 className="font-heading text-[1.5rem] text-vv-text border-b border-cf-gold/15 pb-2 m-0">{t('createZenProfile')}</h3>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t('studentName')}</label>
            <input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} className={fieldClass} placeholder={t('namePlaceholder')} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t('guitarStyleTarget')}</label>
            <select value={newProfileStyle} onChange={(e) => setNewProfileStyle(e.target.value)} className={`${fieldClass} cursor-pointer`}>
              <option value="Acoustic">{t('acousticMelody')}</option>
              <option value="Classical">{t('classicalPolyphony')}</option>
              <option value="Flamenco">{t('flamencoAutonomic')}</option>
              <option value="Jazz">{t('jazzChordFlow')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>{t('securityPin')}</label>
            <input type="password" maxLength={4} value={newProfilePin} onChange={(e) => setNewProfilePin(e.target.value.replace(/[^0-9]/g, ''))} className={`${fieldClass} tracking-[0.3em]`} placeholder="e.g. 1234" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-[10px] bg-white/5 border border-white/10 text-[#8a9aaa] text-[0.75rem] font-mono cursor-pointer hover:bg-white/10 transition-colors">{t('cancel')}</button>
            <button onClick={onCreate} className="flex-1 py-3 rounded-[10px] bg-cf-gold border-none text-[#0d0d14] text-[0.75rem] font-mono font-bold cursor-pointer hover:bg-cf-gold/90 transition-colors">{t('create')}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
