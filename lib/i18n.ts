// lib/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Ресурсы с переводами
const resources = {
  ru: {
    translation: {
      welcome: "Добро пожаловать",
      howItWorks: "Как это работает",
      advantages: "Преимущества",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      profile: "Профиль",
      settings: "Настройки"
    }
  },
  kk: {
    translation: {
      welcome: "Қош келдіңіз",
      howItWorks: "Қалай жұмыс істейді",
      advantages: "Артықшылықтар",
      login: "Кіру",
      register: "Тіркелу",
      logout: "Шығу",
      profile: "Профиль",
      settings: "Баптаулар"
    }
  }
};

// Инициализация i18n
if (typeof window !== 'undefined') {
  i18n.use(initReactI18next).init({
    resources,
    lng: "ru", // язык по умолчанию
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });
}

// Default export
export default i18n;

// Также можно экспортировать отдельные функции
export const getCurrentLanguage = () => {
  if (typeof window !== 'undefined') {
    return i18n.language;
  }
  return 'ru';
};

export const changeLanguage = async (lang: string) => {
  if (typeof window !== 'undefined') {
    await i18n.changeLanguage(lang);
  }
};