import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import '../i18n'; // Ensure i18n is initialized

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
  const { t: i18nT, i18n } = useTranslation();
  const locale = i18n.language;

  const setLocale = useCallback((newLocale) => {
    const loc = newLocale === 'fr' ? 'fr' : 'en';
    i18n.changeLanguage(loc);
    try {
      vvSet(STORAGE_KEYS.LOCALE, loc);
    } catch {
      // Ignore localStorage errors
    }
  }, [i18n]);

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'en' ? 'fr' : 'en';
    setLocale(newLocale);
  }, [locale, setLocale]);

  // Translation helper
  const t = useCallback((key, options) => {
    return i18nT(key, { defaultValue: key, ...options });
  }, [i18nT]);

  // Localized somatic concepts
  const somatic = useCallback((term) => {
    try {
      const activeSomatic = SOMATIC_TERMS[locale] || SOMATIC_TERMS.en;
      return activeSomatic[term] || SOMATIC_TERMS.en[term] || term;
    } catch (error) {
      console.error('[useLocale] Somatic translation error:', error);
      return term;
    }
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
