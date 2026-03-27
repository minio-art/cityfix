"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '@/lib/api'

interface User {
  id: number
  email: string
  username: string
  name: string
  role: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(username: string, password: string) {
    const result = await apiLogin(username, password)
    setUser(result.user)
    
    // Редирект в зависимости от роли
    if (result.user.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/map')
    }
  }

  async function register(data: any) {
    const result = await apiRegister(data)
    setUser(result.user)
    router.push('/map')
  }

  function logout() {
    apiLogout()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}