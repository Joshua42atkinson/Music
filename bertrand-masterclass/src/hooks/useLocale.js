import { useState, useEffect, useCallback } from 'react';

const TRANSLATIONS = {
  en: {
    // Top Bar & Navigation
    exit: '← Exit',
    home: '← Home',
    coachPortal: 'Seeker Coach Portal',
    sovereignLocal: '🎙️ sovereign local-first',
    offlinePreview: '💤 offline preview',
    activeBrain: 'Active Local AI Brain',
    switchLanguage: 'Langue: Français',

    // Mentor Dashboard
    mentorTitle: 'Sovereign Mentor Dashboard',
    mentorSubtitle: "Review student submissions, trigger Pythagoras acoustics analysis, and draft Socratic somatic responses offline.",
    selectStudent: 'Select a student submission to review:',
    noSubmissions: 'No student submissions found in local database.',
    exercise: 'Exercise',
    status: 'Status',
    date: 'Date',
    activeReview: 'Active Review Desk',
    studentVideo: 'Student Practice Video',
    triggerSocratic: 'Trigger Socratic AI Diagnostics',
    processingAI: '🧠 Running FFmpeg and Socratic AI...',
    somaticFeedback: 'Troubadour Somatic Feedback Draft',
    diagnosticScorecard: 'Pythagoras Diagnostic Scorecard',
    stampMacro: 'Somatic Stamp Macros (click to insert):',
    saveFinalReview: 'Save & Submit Somatic Review',
    stampPling: '©PLING! Stamp',
    stampShearl: '©SHEARL Stamp',
    stampFheal: '©FHEAL Stamp',

    // Vertiscale & Tavern Game
    vertiscaleEngine: '⚡ VERTISCALE ENGINE',
    howToPlay: '🎯 HOW TO PLAY',
    enableMic: '🎤 Enable Microphone',
    micActive: '🎤 Mic active — breath tracking enabled',
    vocalTrackingActive: '🎤 LISTENING FOR PITCH...',
    plingLocked: '✨ RESONANT GOLD ©PLING! LOCKED',
    tensionWarning: '⚠️ NECK TENSION DETECTED (+cents)',
    yourResponse: 'YOUR RESPONSE',
    singResponse: 'Sing your response...',
    viewSummary: 'View Journey Summary',
    exitGame: 'Exit Game',
  },
  fr: {
    // Top Bar & Navigation
    exit: '← Quitter',
    home: '← Accueil',
    coachPortal: 'Portail de Mentorat',
    sovereignLocal: '🎙️ souverain local-first',
    offlinePreview: '💤 aperçu hors-ligne',
    activeBrain: 'Cerveau IA local actif',
    switchLanguage: 'Language: English',

    // Mentor Dashboard
    mentorTitle: 'Tableau de Mentorat Souverain',
    mentorSubtitle: "Examinez les sessions d'élèves, déclenchez l'analyse acoustique Pythagore et rédigez des retours somatiques socratiques en local.",
    selectStudent: 'Sélectionnez une session d\'élève à examiner :',
    noSubmissions: 'Aucune session d\'élève trouvée dans la base locale.',
    exercise: 'Exercice',
    status: 'Statut',
    date: 'Date',
    activeReview: 'Pupitre d\'Analyse Active',
    studentVideo: 'Vidéo de Pratique de l\'Élève',
    triggerSocratic: 'Déclencher l\'IA Socratique',
    processingAI: '🧠 Traitement FFmpeg et IA Socratique...',
    somaticFeedback: 'Brouillon Somatique du Troubadour',
    diagnosticScorecard: 'Fiche de Diagnostic de Pythagore',
    stampMacro: 'Macros de Timbres Somatiques (cliquez pour insérer) :',
    saveFinalReview: 'Enregistrer et Soumettre l\'Évaluation',
    stampPling: 'Timbre ©Le PLING!',
    stampShearl: 'Timbre ©Le CISAILLEMENT',
    stampFheal: 'Timbre ©La GUÉRISON',

    // Vertiscale & Tavern Game
    vertiscaleEngine: '⚡ MOTEUR VERTISCALE',
    howToPlay: '🎯 COMMENT JOUER',
    enableMic: '🎤 Activer le Microphone',
    micActive: '🎤 Micro actif — suivi respiratoire activé',
    vocalTrackingActive: '🎤 ANALYSE DE LA VOIX...',
    plingLocked: '✨ GOLD RESONANCE ©Le PLING! VÉRROUILLÉ',
    tensionWarning: '⚠️ TENSION DU COU DÉTECTÉE (+cents)',
    yourResponse: 'VOTRE RÉPONSE',
    singResponse: 'Chantez votre réponse...',
    viewSummary: 'Voir le Résumé du Voyage',
    exitGame: 'Quitter le Jeu',
  }
};

const SOMATIC_TERMS = {
  en: {
    PLING: '©PLING!',
    SHEARL: '©SHEARL',
    FHEAL: '©FHEAL'
  },
  fr: {
    PLING: '©Le PLING!',
    SHEARL: '©Le CISAILLEMENT',
    FHEAL: '©La GUÉRISON'
  }
};

export function useLocale() {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem('voixvive_locale');
      return saved === 'fr' ? 'fr' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLocale = useCallback((newLocale) => {
    const loc = newLocale === 'fr' ? 'fr' : 'en';
    setLocaleState(loc);
    try {
      localStorage.setItem('voixvive_locale', loc);
      // Dispatch custom event to let other components know language changed
      window.dispatchEvent(new CustomEvent('locale:changed', { detail: { locale: loc } }));
    } catch (e) {}
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'fr' : 'en');
  }, [locale, setLocale]);

  // Translation helper
  const t = useCallback((key) => {
    const activeDict = TRANSLATIONS[locale] || TRANSLATIONS.en;
    return activeDict[key] || TRANSLATIONS.en[key] || key;
  }, [locale]);

  // Localized somatic concepts
  const somatic = useCallback((term) => {
    const activeSomatic = SOMATIC_TERMS[locale] || SOMATIC_TERMS.en;
    return activeSomatic[term] || SOMATIC_TERMS.en[term] || term;
  }, [locale]);

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    somatic,
    isFrench: locale === 'fr',
  };
}
