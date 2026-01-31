import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../../translation/en.json';
import ko from '../../../../translation/ko.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // Force initial language to match server
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: en,
      },
      ko: {
        translation: ko,
      },
    },
  });

export default i18n;