import { Layers, Zap, BarChart3, Eye, Globe, Shield } from "lucide-react"

const advantages = [
  {
    icon: Layers,
    title: "Smart Clustering",
    description:
      "Similar problems within a 2km radius are automatically grouped into clusters for efficient resolution.",
  },
  {
    icon: Zap,
    title: "Priority System",
    description:
      "Color-coded markers (red, yellow, green) show urgency at a glance. Bigger markers mean more complaints.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description:
      "Admin dashboard with real-time analytics helps city officials allocate resources where they matter most.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Track every status change, from initial report to resolution. See exactly what is being done.",
  },
  {
    icon: Globe,
    title: "Interactive Map",
    description:
      "Zoom in to see individual reports, zoom out to see city-wide patterns. Filter by category, district, or priority.",
  },
  {
    icon: Shield,
    title: "Community Power",
    description:
      "Vote on problems that affect you. The more votes a cluster gets, the higher it moves on the priority list.",
  },
]

export function Advantages() {
  return (
    <section id="advantages" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Advantages
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why CityFix works
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
