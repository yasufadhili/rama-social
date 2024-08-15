import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from './laguageDetector';

// Import all language JSON files
const languageFiles = require.context('./locales', true, /\.json$/);

const resources = languageFiles.keys().reduce((acc, path) => {
  const lang = path.replace(/\.\/(.*)\.json$/, '$1');
  acc[lang] = { translation: languageFiles(path) };
  return acc;
}, {} as { [key: string]: { translation: any } });

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;