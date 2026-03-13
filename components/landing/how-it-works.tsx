import { MapPin, Users, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    step: "01",
    title: "Report a Problem",
    description:
      "Pin the issue on the map, choose a category, add a description and photo. It takes less than a minute.",
  },
  {
    icon: Users,
    step: "02",
    title: "Community Votes",
    description:
      "Neighbors see your report and vote to support it. Similar issues are automatically clustered together.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "City Takes Action",
    description:
      "City officials prioritize clusters by vote count and severity. Track real-time status updates.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            How it Works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three simple steps to a better city
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col items-center rounded-2xl border border-border bg-background p-8 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mb-2 text-xs font-bold text-primary/60">
                Step {item.step}
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
