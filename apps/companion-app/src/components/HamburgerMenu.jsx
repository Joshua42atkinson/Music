import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, PenTool, Layout, FolderKanban, Shield, Award } from 'lucide-react';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { initiateStripeCheckout, PLAN_PRICES } from '../lib/stripeService';


const TABS = [
  { id: 'workbook',    icon: BookOpen, en: 'Current Quest', fr: 'Quête Actuelle' },
  { id: 'projects',    icon: PenTool, en: 'Projects',      fr: 'Projets' },
  { id: 'submissions', icon: FolderKanban, en: 'Submissions',  fr: 'Soumissions' },
  { id: 'library',     icon: Layout, en: 'Resources',    fr: 'Ressources' },
  { id: 'character',   icon: Shield, en: 'Character',    fr: 'Personnage' },
];

export default function HamburgerMenu({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const { globalMode, toggleGlobalMode, aiEnabled, toggleAI, gameEnabled, toggleGame } = useScaffolding();
  const { lang: _lang } = useLocale();

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  const isDevMode = globalMode === 'open_book';

  return (
    <div className="relative z-[100]">
      <button className="bg-transparent border-none text-cf-gold cursor-pointer p-2 flex items-center justify-center" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cf-void/80 backdrop-blur-sm z-[999]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0a0a0f] border-l border-[rgba(201,169,110,0.2)] shadow-[-4px_0_20px_rgba(0,0,0,0.5)] flex flex-col p-5 z-[1000]"
            >
              <div className="flex justify-between items-center mb-[1.875rem] text-cf-gold">
                <span className="text-lg font-bold">Menu</span>
                <button className="bg-transparent border-none text-cf-gold cursor-pointer p-2 flex items-center justify-center" onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-3 bg-transparent border-none text-white/70 text-base py-3 cursor-pointer text-left w-full transition-colors hover:text-white ${isActive ? 'text-cf-gold' : ''}`}
                    >
                      <Icon size={18} />
                      {tab.en}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 mb-auto">
                <button 
                  onClick={() => initiateStripeCheckout(PLAN_PRICES.PREMIUM_MONTHLY)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cf-gold to-[#e0d0aa] text-cf-ink font-mono font-bold text-sm py-3 rounded-xl cursor-pointer hover:shadow-[0_0_15px_rgba(201,169,110,0.4)] transition-all"
                >
                  <Award size={16} />
                  Upgrade to Premium
                </button>
              </div>

              <div className="mt-auto pt-5 border-t border-white/10">
                <div className="flex items-center justify-between text-white/70 text-sm cursor-pointer mb-4" onClick={toggleAI}>
                  <span>AI Mode</span>
                  <div className={`w-9 h-5 rounded-[10px] relative transition-colors duration-300 ${aiEnabled ? 'bg-cf-gold' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-[2px] left-[2px] transition-transform duration-300 ${aiEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/70 text-sm cursor-pointer mb-4" onClick={toggleGame}>
                  <span>Game Mode</span>
                  <div className={`w-9 h-5 rounded-[10px] relative transition-colors duration-300 ${gameEnabled ? 'bg-cf-gold' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-[2px] left-[2px] transition-transform duration-300 ${gameEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/70 text-sm cursor-pointer" onClick={toggleGlobalMode}>
                  <span>Developer Mode</span>
                  <div className={`w-9 h-5 rounded-[10px] relative transition-colors duration-300 ${isDevMode ? 'bg-cf-gold' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-[2px] left-[2px] transition-transform duration-300 ${isDevMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
                <p className="text-[11px] text-white/40 mt-2">
                  {isDevMode ? 'All content unlocked.' : 'Trial of the Truebadour active.'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
