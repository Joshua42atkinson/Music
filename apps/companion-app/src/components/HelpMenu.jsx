import React from 'react';
import { X, Book, Music, Gamepad2, FileText, GraduationCap, Wrench, Globe } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

const FEATURE_KEYS = [
  { icon: Book, key: 'isomorphic' },
  { icon: Music, key: 'bedoplay' },
  { icon: Gamepad2, key: 'truebadour' },
  { icon: FileText, key: 'slowweb' },
  { icon: GraduationCap, key: 'symbiosis' },
  { icon: Wrench, key: 'sandbox' },
  { icon: Globe, key: 'bilingual' }
];

export default function HelpMenu({ onClose }) {
  const { t } = useLocale();
  const features = FEATURE_KEYS.map(f => ({
    icon: f.icon,
    title: t(`help_${f.key}_title`),
    description: t(`help_${f.key}_desc`)
  }));

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0a0a0f] border border-cf-gold/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cf-gold/10">
          <h2 className="text-2xl font-serif text-cf-gold">
            {t('helpMenuTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-cf-slate hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cf-gold/30 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-cf-gold/10 flex items-center justify-center text-cf-gold">
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-cf-slate leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-cf-gold/10 text-center">
            <p className="text-xs text-cf-slate/60 font-mono">
              {t('helpMenuFooter')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
