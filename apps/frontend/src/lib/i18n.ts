import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../../translation/en.json';
import ko from '../../../../translation/ko.json';

export const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
};

export const createI18nInstance = (lang: string) => {
  const instance = i18n.createInstance();
  instance
    .use(initReactI18next)
    .init({
      lng: lang,
      fallbackLng: 'en',
      resources,
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
    });
  return instance;
};

// Default instance for usage outside of components if needed, 
// though we'll rely on the Provider for the app.
const defaultInstance = createI18nInstance('en');
export default defaultInstance;
