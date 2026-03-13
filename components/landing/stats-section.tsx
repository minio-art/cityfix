"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { label: "Problems Reported", value: 12450, suffix: "+" },
  { label: "Problems Resolved", value: 8320, suffix: "+" },
  { label: "Active Citizens", value: 34200, suffix: "+" },
  { label: "Cities Covered", value: 48, suffix: "" },
]

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number
  suffix: string
}) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const start = performance.now()

          function animate(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayed(Math.floor(eased * value))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [value])

  return (
    <div ref={ref} className="text-4xl font-bold text-foreground tabular-nums md:text-5xl">
      {displayed.toLocaleString()}
      {suffix}
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Impact
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Making a real difference
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
