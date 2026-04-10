import Link from "next/link"
import { MapPin } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        
        <div className="grid gap-8 md:grid-cols-4">
          
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                CityFix
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              CityFix помогает жителям сообщать о проблемах, расставлять приоритеты и отслеживать их решение. Вместе мы делаем наши города лучше.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Платформа
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Как это работает
                </Link>
              </li>
              <li>
                <Link
                  href="/#advantages"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Преимущества
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Правовая информация
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Политика конфиденциальности
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Условия использования
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Контакты
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 CityFix. Создано для улучшения городов.
          </p>
        </div>

      </div>
    </footer>
  )
}