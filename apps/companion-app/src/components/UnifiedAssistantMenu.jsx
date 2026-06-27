import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Guitar, BookOpen, MessageSquare, ChevronUp, X } from 'lucide-react';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { useLocale } from '../hooks/useLocale';
import useMobileDetect from '../hooks/useMobileDetect';

export default function UnifiedAssistantMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openRift, openBinder, activeWidget } = useTruebadour();
  const { locale } = useLocale();
  const isMobile = useMobileDetect();

  // If either widget is currently active (expanded), we might want to hide the FAB or show it differently.
  // Actually, since the widgets cover the screen (or panel), we can hide the FAB when a widget is open.
  if (activeWidget) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="fixed bottom-4 right-4 z-[2000] flex flex-col items-end gap-3">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-3 mb-2"
          >
            {/* AI Mentor Button */}
            <button
              onClick={() => {
                setMenuOpen(false);
                openRift();
              }}
              className="flex items-center gap-3 px-5 py-3.5 bg-[#12100e]/95 backdrop-blur-md border border-[#cc3333]/50 rounded-2xl shadow-[0_8px_30px_rgba(204,51,51,0.25)] hover:bg-[#cc3333]/20 transition-all text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#cc3333]/20 text-[#ff6666]">
                <Guitar size={24} />
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-mono text-[0.8rem] tracking-[0.1em] text-[#ff6666] uppercase">
                  {locale === 'fr' ? 'Le Mentor IA' : 'AI Mentor'}
                </span>
                <span className="text-[0.7rem] text-white/50">
                  {locale === 'fr' ? 'Pratique vocale' : 'Voice practice'}
                </span>
              </div>
            </button>

            {/* Binder Button */}
            <button
              onClick={() => {
                setMenuOpen(false);
                openBinder();
              }}
              className="flex items-center gap-3 px-5 py-3.5 bg-[#12100e]/95 backdrop-blur-md border border-[#4488ff]/50 rounded-2xl shadow-[0_8px_30px_rgba(34,85,204,0.25)] hover:bg-[#4488ff]/20 transition-all text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4488ff]/20 text-[#4488ff]">
                <BookOpen size={24} />
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-mono text-[0.8rem] tracking-[0.1em] text-[#4488ff] uppercase">
                  {locale === 'fr' ? 'Le Livre' : 'Academy Library'}
                </span>
                <span className="text-[0.7rem] text-white/50">
                  {locale === 'fr' ? 'Étude & réglages' : 'Study & settings'}
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`flex items-center gap-2 px-5 h-[56px] rounded-full backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-2 transition-all duration-300 ${
          menuOpen 
            ? 'bg-[#12100e]/95 border-white/20 text-white' 
            : 'bg-[#2255cc]/20 border-[#4488ff]/50 text-[#4488ff] hover:bg-[#2255cc]/40'
        }`}
      >
        {menuOpen ? <X size={24} /> : <MessageSquare size={24} />}
        <span className="font-mono text-[0.85rem] font-bold tracking-[0.1em] uppercase">
          {menuOpen ? (locale === 'fr' ? 'Fermer' : 'Close') : (locale === 'fr' ? 'Assistant' : 'Assistant')}
        </span>
      </button>
    </div>
  );
}
