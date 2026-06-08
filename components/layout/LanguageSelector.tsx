"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Language {
  code: string;
  name: string;
  native_name: string;
  flag: string;
}

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<string>("ru");
  const [languages, setLanguages] = useState<Language[]>([
    { code: "ru", name: "Русский", native_name: "Русский", flag: "🇷🇺" },
    { code: "kk", name: "Қазақша", native_name: "Қазақша", flag: "🇰🇿" }
  ]);

  useEffect(() => {
    // Загружаем текущий язык из cookie
    const getLanguageFromCookie = () => {
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1];
      
      if (cookieLang === "ru" || cookieLang === "kk") {
        setCurrentLang(cookieLang);
      }
    };
    
    getLanguageFromCookie();
  }, []);

  const changeLanguage = async (langCode: string) => {
    if (langCode === currentLang) return;

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
        setCurrentLang(langCode);
        // Сохраняем в localStorage
        localStorage.setItem('language', langCode);
        // Триггерим событие для других компонентов
        window.dispatchEvent(new Event('languageChanged'));
        // Перезагружаем страницу
        window.location.reload();
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Выбрать язык</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLang === lang.code ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm">{lang.native_name}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {currentLang === lang.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}