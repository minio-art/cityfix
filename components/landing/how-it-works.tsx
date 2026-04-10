import { MapPin, Users, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    step: "01",
    title: "Сообщите о проблеме",
    description:
      "Отметьте проблему на карте, выберите категорию, добавьте описание и фото. Это займет меньше минуты.",
  },
  {
    icon: Users,
    step: "02",
    title: "Голосование сообщества",
    description:
      "Жители видят вашу заявку и голосуют за неё. Похожие проблемы автоматически объединяются в кластеры.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Город решает проблему",
    description:
      "Городские службы расставляют приоритеты по количеству голосов и срочности. Отслеживайте статус в реальном времени.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Как это работает
          </p>

          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Три простых шага к лучшему городу
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col items-center rounded-2xl border border-border bg-background p-8 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mb-2 text-xs font-bold text-primary/60">
                Шаг {item.step}
              </div>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}