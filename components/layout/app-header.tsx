"use client"

import { useApp } from "@/lib/store"
import { useTheme } from "next-themes"
import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function AppHeader() {
  const { state, dispatch } = useApp()
  const { setTheme, resolvedTheme } = useTheme()
  const unreadCount = state.notifications.filter((n) => !n.read).length

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {state.currentUser ? `Welcome, ${state.currentUser.name}` : "CityFix"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {state.currentUser?.city || "San Francisco"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-[10px] text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {state.notifications.length === 0 ? (
              <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
            ) : (
              state.notifications.slice(0, 5).map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notif.id })}
                  className="flex flex-col items-start gap-1"
                >
                  <span className="text-sm font-medium">{notif.title}</span>
                  <span className="text-xs text-muted-foreground">{notif.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
