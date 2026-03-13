import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center md:px-16 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(1_0_0/0.05),transparent_70%)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to make your city better?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80">
              Join thousands of active citizens already making a difference. Report your first problem in under a minute.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 px-8"
              >
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
