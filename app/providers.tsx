// app/providers.tsx
"use client"

import { ReactNode } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/lib/store"
import { AuthProvider } from "@/hooks/useAuth"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </AuthProvider>
  )
}