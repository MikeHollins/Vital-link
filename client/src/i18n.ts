import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language from browser
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en',
    debug: false, // Disable debug in production

    interpolation: {
      escapeValue: false, // React already protects from XSS
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-cache'
      }
    },
    
    ns: ['common', 'dashboard', 'health', 'privacy', 'settings'],
    defaultNS: 'common',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // Support for health verification platform languages
    supportedLngs: ['en', 'es', 'zh', 'ms', 'ta', 'ru', 'de'],
    nonExplicitSupportedLngs: true,
  });

export default i18n;