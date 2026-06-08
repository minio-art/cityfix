export const translations = {
  ru: {
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      back: "Назад",
      next: "Далее",
      search: "Поиск",
      filter: "Фильтр"
    },
    navigation: {
      home: "Главная",
      issues: "Проблемы",
      profile: "Профиль",
      settings: "Настройки",
      logout: "Выйти",
      login: "Войти",
      register: "Регистрация"
    },
    howItWorks: {
      title: "Как это работает",
      subtitle: "Три простых шага к лучшему городу",
      step1_title: "Сообщите о проблеме",
      step1_desc: "Отметьте проблему на карте, выберите категорию, добавьте описание и фото. Это займет меньше минуты.",
      step2_title: "Голосование сообщества",
      step2_desc: "Жители видят вашу заявку и голосуют за неё. Похожие проблемы автоматически объединяются в кластеры.",
      step3_title: "Город решает проблему",
      step3_desc: "Городские службы расставляют приоритеты по количеству голосов и срочности. Отслеживайте статус в реальном времени.",
      step_prefix: "Шаг"
    }
  },
  kk: {
    common: {
      loading: "Жүктелуде...",
      error: "Қате",
      success: "Сәтті",
      save: "Сақтау",
      cancel: "Болдырмау",
      delete: "Жою",
      edit: "Өңдеу",
      back: "Артқа",
      next: "Келесі",
      search: "Іздеу",
      filter: "Сүзгі"
    },
    navigation: {
      home: "Басты бет",
      issues: "Мәселелер",
      profile: "Профиль",
      settings: "Баптаулар",
      logout: "Шығу",
      login: "Кіру",
      register: "Тіркелу"
    },
    howItWorks: {
      title: "Қалай жұмыс істейді",
      subtitle: "Жақсы қалаға үш қарапайым қадам",
      step1_title: "Мәселені хабарлаңыз",
      step1_desc: "Картадағы мәселені белгілеңіз, санатты таңдаңыз, сипаттама мен фото қосыңыз. Бір минуттан аз уақытты алады.",
      step2_title: "Қауымдастық дауыс беру",
      step2_desc: "Тұрғындар сіздің өтінішіңізді көріп, оған дауыс береді. Ұқсас мәселелер автоматты түрде кластерлерге біріктіріледі.",
      step3_title: "Қала мәселені шешеді",
      step3_desc: "Қала қызметтері дауыс саны мен шұғылдығы бойынша басымдықтарды белгілейді. Статусты нақты уақытта бақылаңыз.",
      step_prefix: "Қадам"
    }
  }
};

// Типы для переводов
export type Language = keyof typeof translations;
export type Category = keyof typeof translations.ru;
export type TranslationKey = keyof typeof translations.ru.common;

// Упрощенная и типобезопасная функция перевода
export function translate(lang: string, category: string, key: string): string {
  // Проверяем существует ли язык
  if (!translations[lang as Language]) {
    lang = 'ru';
  }
  
  const langData = translations[lang as Language];
  const categoryData = langData[category as Category];
  
  // Если категория существует, возвращаем перевод
  if (categoryData && categoryData[key as keyof typeof categoryData]) {
    return categoryData[key as keyof typeof categoryData];
  }
  
  // Fallback на русский язык
  const ruCategoryData = translations.ru[category as Category];
  if (ruCategoryData && ruCategoryData[key as keyof typeof ruCategoryData]) {
    return ruCategoryData[key as keyof typeof ruCategoryData];
  }
  
  // Если ничего не найдено, возвращаем ключ
  return key;
}

// Альтернативная версия с использованием строковых шаблонов
export function useTranslation(lang: string) {
  return {
    t: (category: Category, key: string): string => {
      return translate(lang, category, key);
    },
    language: lang,
    translations: translations[lang as Language] || translations.ru
  };
}