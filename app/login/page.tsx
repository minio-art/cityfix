"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useApp } from "@/lib/store"
import { users } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { dispatch } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const user = users.find((u) => u.email === email)
    if (!user) {
      setError("User not found. Try alex@example.com or admin@cityfix.com")
      return
    }

    dispatch({ type: "LOGIN", payload: user })
    if (user.role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/map")
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
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Any password works (mock)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="mt-2 w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-6 space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Demo accounts:
              </p>
              <div className="flex flex-col gap-1 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <span>Resident: alex@example.com</span>
                <span>Admin: admin@cityfix.com</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
