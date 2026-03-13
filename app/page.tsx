import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Advantages } from "@/components/landing/advantages"
import { StatsSection } from "@/components/landing/stats-section"
import { CtaSection } from "@/components/landing/cta-section"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <Advantages />
        <StatsSection />
        <CtaSection />
      </main>
      <PublicFooter />
    </div>
  )
}
