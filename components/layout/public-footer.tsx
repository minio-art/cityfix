import Link from "next/link"
import { MapPin } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CityFix</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              CityFix empowers citizens to report problems, prioritize issues, and track resolutions in their city. Together, we make our communities better.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#advantages"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Advantages
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Contact</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            2025 CityFix. Built for better cities.
          </p>
        </div>
      </div>
    </footer>
  )
}
