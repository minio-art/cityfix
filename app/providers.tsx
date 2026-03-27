"use client"

import { ReactNode } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/lib/store"
import { AuthProvider } from "@/hooks/useAuth"  // теперь .tsx
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}