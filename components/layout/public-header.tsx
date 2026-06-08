// components/landing/PublicHeader.tsx
"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Menu, Moon, Sun, Languages } from "lucide-react"
import { useState } from "react"

export function PublicHeader() {
  const { setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)

  const toggleLanguage = () => {
    setLocale(locale === "ru" ? "kz" : "ru")
  }

  // Текст для кнопки языка
  const languageButtonText = locale === "ru" ? "Рус" : "Қаз"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CityFix</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t?.publicHeader?.howItWorks || "Как это работает"}
          </Link>

          <Link
            href="/#advantages"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t?.publicHeader?.advantages || "Преимущества"}
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t?.publicHeader?.login || "Войти"}
          </Link>

          <Button asChild size="sm">
            <Link href="/register">
              {t?.publicHeader?.start || "Начать"}
            </Link>
          </Button>

          {/* Кнопка переключения языка с показом текущего языка */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {languageButtonText}
            </span>
          </Button>

          {/* Кнопка переключения темы */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t?.publicHeader?.themeToggle || "Сменить тему"}</span>
          </Button>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Кнопка переключения языка для мобильной версии */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {languageButtonText}
            </span>
          </Button>

          {/* Кнопка переключения темы для мобильной версии */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/#how-it-works"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground"
                >
                  {t?.publicHeader?.howItWorks || "Как это работает"}
                </Link>

                <Link
                  href="/#advantages"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground"
                >
                  {t?.publicHeader?.advantages || "Преимущества"}
                </Link>

                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground"
                >
                  {t?.publicHeader?.login || "Войти"}
                </Link>

                <Button asChild className="mt-2">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    {t?.publicHeader?.start || "Начать"}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}