"use client"

import { Layers, Zap, BarChart3, Eye, Globe, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Advantages() {
  const { t } = useLanguage()
  const data = t?.advantages

  // Маппинг иконок
  const iconMap = [Layers, Zap, BarChart3, Eye, Globe, Shield]

  return (
    <section id="advantages" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            {data?.badge || "Преимущества"}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {data?.title || "Почему CityFix работает"}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.advantages?.map((item: any, index: number) => {
            const Icon = iconMap[index % iconMap.length]
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
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
            )
          })}
        </div>
      </div>
    </section>
  )
}