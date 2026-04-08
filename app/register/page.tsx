"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Имя пользователя должно содержать минимум 3 символа"
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = "Введите корректный email"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        password: formData.password
      })
      
      console.log("Registration result:", result) // Для отладки
      toast.success("Регистрация успешна!")
      
      // Перенаправление на страницу входа или дашборд
      // router.push("/dashboard")
      
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // Обработка ошибок от сервера
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail
        if (typeof detail === 'string') {
          toast.error(detail)
        } else if (Array.isArray(detail)) {
          detail.forEach(err => toast.error(err.msg || err))
        }
      } else {
        toast.error(error.message || "Ошибка регистрации")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CityFix</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Регистрация</CardTitle>
            <CardDescription>Создайте аккаунт, чтобы сообщать о проблемах города</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Имя пользователя *</Label>
                <Input
                  id="username"
                  placeholder="alex"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value })
                    setErrors({ ...errors, username: "" })
                  }}
                  className={errors.username ? "border-red-500" : ""}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setErrors({ ...errors, email: "" })
                  }}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Имя (опционально)</Label>
                <Input
                  id="name"
                  placeholder="Алексей"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Телефон (опционально)</Label>
                <Input
                  id="phone"
                  placeholder="+7 (777) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setErrors({ ...errors, password: "" })
                  }}
                  className={errors.password ? "border-red-500" : ""}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    setErrors({ ...errors, confirmPassword: "" })
                  }}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
            
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}