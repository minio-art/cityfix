"use client"

import { Layers, Zap, BarChart3, Eye, Globe, Shield } from "lucide-react"

const advantages = [
  {
    icon: Layers,
    title: "Умная кластеризация",
    description:
      "Похожие проблемы в радиусе 2 км автоматически объединяются в кластеры для более эффективного решения.",
  },
  {
    icon: Zap,
    title: "Система приоритетов",
    description:
      "Цветные маркеры (красный, жёлтый, зелёный) показывают срочность. Чем больше жалоб — тем больше маркер.",
  },
  {
    icon: BarChart3,
    title: "Решения на основе данных",
    description:
      "Панель администратора с аналитикой в реальном времени помогает эффективно распределять ресурсы.",
  },
  {
    icon: Eye,
    title: "Полная прозрачность",
    description:
      "Отслеживайте все изменения статуса — от создания заявки до её решения. Видно всё, что происходит.",
  },
  {
    icon: Globe,
    title: "Интерактивная карта",
    description:
      "Приближайте карту для просмотра отдельных проблем или отдаляйте для анализа по всему городу. Фильтруйте по категориям и районам.",
  },
  {
    icon: Shield,
    title: "Сила сообщества",
    description:
      "Голосуйте за важные проблемы. Чем больше голосов — тем выше приоритет у кластера.",
  },
]

export function Advantages() {
  return (
    <section id="advantages" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Преимущества
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Почему CityFix работает
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}