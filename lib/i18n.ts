import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '@/locales/en.json';
import es from '@/locales/es.json';

const LANG_KEY = 'app.lang';

function detectLocale(): 'en' | 'es' {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'en';
  return tag.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export async function initI18n() {
  const stored = await AsyncStorage.getItem(LANG_KEY);
  const lng = (stored as 'en' | 'es' | null) ?? detectLocale();

  await i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, es: { translation: es } },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
}

export async function setLanguage(lng: 'en' | 'es') {
  await AsyncStorage.setItem(LANG_KEY, lng);
  await i18n.changeLanguage(lng);
}

export default i18n;
