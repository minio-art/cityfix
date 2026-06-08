// components/AppHeader.tsx (альтернативная версия с текстом)
"use client"

import Link from "next/link"
import { useApp } from "@/lib/store"
import { useTheme } from "next-themes"
import { Bell, Moon, Sun, Languages, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"

export function AppHeader() {
  const { state, dispatch } = useApp()
  const { setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, t } = useLanguage()
  const unreadCount = state.notifications.filter((n) => !n.read).length

  const toggleLanguage = () => {
    setLocale(locale === "ru" ? "kz" : "ru")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* Логотип */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CityFix</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Приветствие */}
          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-foreground">
              {state.currentUser
                ? `${t?.header?.welcome || 'Добро пожаловать'}, ${state.currentUser.name}`
                : t?.header?.title || "CityFix"}
            </h2>
          </div>

          {/* Кнопка переключения языка с текстом */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {locale === "ru" ? "Рус" : "Қаз"}
            </span>
          </Button>

          {/* Переключатель темы */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t?.header?.themeToggle || 'Сменить тему'}</span>
          </Button>

          {/* Уведомления */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => {
              // Здесь можно открыть попап с уведомлениями
              console.log("Open notifications")
            }}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-[10px] text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">{t?.header?.notifications || 'Уведомления'}</span>
          </Button>
        </div>

      </div>
    </header>
  )
}