"use client";

import { useState, useEffect, useCallback } from "react";

export function useLanguage() {
  const [language, setLanguage] = useState<string>("ru");
  const [loading, setLoading] = useState(true);

  const fetchLanguage = useCallback(async () => {
    try {
      const response = await fetch("/api/language/current");
      const data = await response.json();
      setLanguage(data.language);
    } catch (error) {
      console.error("Error fetching language:", error);
      // Fallback to cookie
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1];
      if (cookieLang && (cookieLang === 'ru' || cookieLang === 'kk')) {
        setLanguage(cookieLang);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguage();
    
    // Слушаем изменения языка
    const handleLanguageChange = () => {
      fetchLanguage();
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [fetchLanguage]);

  const changeLanguage = async (langCode: string) => {
    if (langCode === language) return;
    
    try {
      const response = await fetch("/api/language/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: langCode }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLanguage(langCode);
        // Сохраняем в localStorage для быстрого доступа
        localStorage.setItem('language', langCode);
        // Триггерим событие для обновления других компонентов
        window.dispatchEvent(new Event('languageChanged'));
        return true;
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
    return false;
  };

  return { language, loading, changeLanguage };
}