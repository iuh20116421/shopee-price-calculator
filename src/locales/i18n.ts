import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import vi from './vi.json';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    lng: 'vi', // Set Vietnamese as default language
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
      lookupQuerystring: 'lng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
  });

// Force Vietnamese as default language on first load
if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'vi');
  i18n.changeLanguage('vi');
}

export default i18n; 