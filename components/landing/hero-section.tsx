import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.45_0.18_255/0.08),transparent_60%)]" />
      
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center md:pb-32 md:pt-32">
        
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Умная система сообщений о проблемах города
          </span>
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Сообщай. Приоритизируй.{" "}
          <span className="text-primary">Улучшай свой город.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          CityFix автоматически объединяет похожие жалобы, показывает приоритеты на интерактивной карте и помогает быстрее решать городские проблемы.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/register">
              Начать
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/#how-it-works">Узнать больше</Link>
          </Button>
        </div>

        <div className="mt-16 w-full max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">
                cityfix.app/map
              </span>
            </div>

            <div className="relative aspect-[16/9] bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full bg-[oklch(0.92_0.01_200)] dark:bg-[oklch(0.22_0.01_200)]">
                  
                  {/* Маркеры на карте */}
                  <div className="absolute left-[20%] top-[30%] flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-primary-foreground shadow-lg">
                    47
                  </div>
                  <div className="absolute left-[55%] top-[45%] flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-primary-foreground shadow-lg">
                    89
                  </div>
                  <div className="absolute left-[35%] top-[60%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-primary-foreground shadow-lg">
                    15
                  </div>
                  <div className="absolute left-[70%] top-[25%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-primary-foreground shadow-lg">
                    28
                  </div>
                  <div className="absolute left-[80%] top-[55%] flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-primary-foreground shadow-lg">
                    8
                  </div>
                  <div className="absolute left-[45%] top-[20%] flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-primary-foreground shadow-lg">
                    11
                  </div>

                  {/* Сетка */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}