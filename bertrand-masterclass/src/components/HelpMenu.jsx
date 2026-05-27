import React, { useState } from 'react';
import { X, Book, Music, Gamepad2, FileText, GraduationCap, Wrench, Globe } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

const FEATURES = {
  en: [
    {
      icon: Book,
      title: 'Living Textbook',
      description: '12-chapter curriculum with Hero\'s Journey storytelling. Swipe through slides to learn guitar theory, technique, and creativity.'
    },
    {
      icon: Gamepad2,
      title: 'Troubadour Adventure',
      description: 'Pitch-gated narrative game set in Eleanor of Aquitaine\'s court. Sing to progress through the story.'
    },
    {
      icon: Music,
      title: 'Vertiscale Engine',
      description: 'Imagination training game. Three phases: Flash (speed), Imagine (stability), Audiate (pitch), Reflect (journal).'
    },
    {
      icon: FileText,
      title: 'Digital Binder',
      description: 'Practice log, tools collection, and submission history. Track your journey and submit videos for coaching.'
    },
    {
      icon: GraduationCap,
      title: 'Studio Services',
      description: 'Live lessons, async video coaching, AI evaluation, and premium curriculum. Revenue supports Bertrand\'s work.'
    },
    {
      icon: Wrench,
      title: '12 Fret Tools',
      description: 'Interactive practice tools: interval trainer, pitch detector, metronome, breathing exercises, and more.'
    },
    {
      icon: Globe,
      title: 'Bilingual',
      description: 'Full English/French support. Toggle language anytime with the button in the header.'
    }
  ],
  fr: [
    {
      icon: Book,
      title: 'Manuel Vivant',
      description: 'Curriculum de 12 chapitres avec narration du Voyage du Héros. Balayez les diapositives pour apprendre la théorie, la technique et la créativité.'
    },
    {
      icon: Gamepad2,
      title: 'Aventure Troubadour',
      description: 'Jeu narratif à portée de ton dans la cour d\'Aliénor d\'Aquitaine. Chantez pour progresser dans l\'histoire.'
    },
    {
      icon: Music,
      title: 'Moteur Vertiscale',
      description: 'Jeu d\'entraînement à l\'imagination. Trois phases : Flash (vitesse), Imagine (stabilité), Audiate (hauteur), Réfléchir (journal).'
    },
    {
      icon: FileText,
      title: 'Classeur Numérique',
      description: 'Journal de pratique, collection d\'outils et historique des soumissions. Suivez votre parcours et soumettez des vidéos pour le coaching.'
    },
    {
      icon: GraduationCap,
      title: 'Services Studio',
      description: 'Leçons en direct, coaching vidéo asynchrone, évaluation IA et curriculum premium. Les revenus soutiennent le travail de Bertrand.'
    },
    {
      icon: Wrench,
      title: '12 Outils de Frette',
      description: 'Outils de pratique interactifs : entraînement d\'intervalles, détecteur de hauteur, métronome, exercices de respiration et plus encore.'
    },
    {
      icon: Globe,
      title: 'Bilingue',
      description: 'Support complet anglais/français. Changez de langue à tout moment avec le bouton dans l\'en-tête.'
    }
  ]
};

export default function HelpMenu({ onClose }) {
  const { locale } = useLocale();
  const features = FEATURES[locale === 'fr' ? 'fr' : 'en'];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0a0a0f] border border-cf-gold/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cf-gold/10">
          <h2 className="text-2xl font-serif text-cf-gold">
            {locale === 'fr' ? "Guide de l'Application" : 'App Guide'}
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
              {locale === 'fr' ? 'Voix Vive — La Voix Vivante' : 'Voix Vive — The Living Voice'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
