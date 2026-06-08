// components/HowItWorks.tsx
"use client"

import { MapPin, Users, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function HowItWorks() {
  const { t } = useLanguage()
  const data = t.howItWorks
  
  // Маппинг иконок для каждого шага
  const icons = [MapPin, Users, CheckCircle]

  return (
    <section id="how-it-works" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            {data.badge}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {data.title}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {data.steps.map((step, index) => {
            const Icon = icons[index]
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center rounded-2xl border border-border bg-background p-8 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mb-2 text-xs font-bold text-primary/60">
                  {index === 0 ? "01" : index === 1 ? "02" : "03"}
                </div>

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}