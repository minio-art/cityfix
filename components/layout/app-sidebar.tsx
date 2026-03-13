"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApp } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Map, PlusCircle, User, MapPin, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/problem/create", label: "Report Problem", icon: PlusCircle },
  { href: "/profile", label: "My Profile", icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { dispatch } = useApp()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Link href="/map" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <MapPin className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">CityFix</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={() => {
            dispatch({ type: "LOGOUT" })
            window.location.href = "/"
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
