// components/mobile-menu.tsx
"use client"

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

const Sheet = dynamic(
  () => import('@/components/ui/sheet').then(mod => mod.Sheet),
  { ssr: false }
)

const SheetContent = dynamic(
  () => import('@/components/ui/sheet').then(mod => mod.SheetContent),
  { ssr: false }
)

const SheetTrigger = dynamic(
  () => import('@/components/ui/sheet').then(mod => mod.SheetTrigger),
  { ssr: false }
)

const AppSidebar = dynamic(
  () => import('@/components/layout/app-sidebar').then(mod => mod.AppSidebar),
  { ssr: false }
)

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-3 z-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  )
}