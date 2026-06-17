import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vvGet } from './lib/storage';
import { STORAGE_KEYS } from './lib/storageKeys';

import en from './locales/en.json';
import fr from './locales/fr.json';

const getInitialLocale = () => {
  try {
    const saved = vvGet(STORAGE_KEYS.LOCALE);
    return saved === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr
    },
    lng: getInitialLocale(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
