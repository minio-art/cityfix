"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/lib/store"
import { categories } from "@/lib/mock-data"
import { getPriorityColor, getPriorityLabel, getStatusLabel, getStatusColor } from "@/lib/geo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, FileText, ThumbsUp, Bell, Loader2 } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, getUserReports, getUserVotes } from "@/lib/api"

interface UserProfile {
  id: number
  email: string
  username: string
  name: string
  role: string
  created_at: string
}

interface Report {
  id: number
  title: string
  description: string
  category: string
  district: string
  latitude: number
  longitude: number
  address: string
  status: string
  votesCount: number
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [myReports, setMyReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [votedReports, setVotedReports] = useState<Report[]>([])
  const [activeTab, setActiveTab] = useState("reports")

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // Получаем данные пользователя
      const userData = await getCurrentUser()
      setUser(userData)

      // Получаем отчеты пользователя
      const reports = await getUserReports()
      setMyReports(reports)

      // Получаем проголосованные отчеты
      const votes = await getUserVotes()
      setVotedReports(votes)
    } catch (error) {
      console.error("Ошибка загрузки данных профиля:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <Card>
          <CardContent className="py-12">
            <p className="text-muted-foreground">Пожалуйста, войдите чтобы просмотреть профиль</p>
            <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
              Войти
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Карточка профиля */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl text-primary">
              {user.name?.charAt(0) || user.username?.charAt(0) || "П"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-foreground">{user.name || user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Присоединился {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : "Недавно"}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {myReports.length} сообщений
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                Проголосовано: {votedReports.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="reports" className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            Мои сообщения ({myReports.length})
          </TabsTrigger>
          <TabsTrigger value="voted" className="gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            Отмеченные ({votedReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4">
          <div className="flex flex-col gap-3">
            {myReports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Вы еще не сообщили ни о каких проблемах.
                  <Link href="/problem/create" className="ml-2 text-primary hover:underline">
                    Создать первое сообщение
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myReports.map((report) => (
                <ProblemRow key={report.id} problem={report} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="voted" className="mt-4">
          <div className="flex flex-col gap-3">
            {votedReports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Вы еще не голосовали ни за одну проблему.
                </CardContent>
              </Card>
            ) : (
              votedReports.map((report) => (
                <ProblemRow key={report.id} problem={report} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProblemRow({ problem }: { problem: Report }) {
  const cat = categories.find((c) => c.id === problem.category) || categories[0]
  
  return (
    <Link href={`/problem/${problem.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{problem.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                style={{ 
                  borderColor: getPriorityColor(problem.priority as "critical" | "medium" | "low"), 
                  color: getPriorityColor(problem.priority as "critical" | "medium" | "low") 
                }}
                className="text-xs"
              >
                {getPriorityLabel(problem.priority as "critical" | "medium" | "low")}
              </Badge>
              <span className="text-xs text-muted-foreground">{cat?.name || problem.category}</span>
              <span className="text-xs text-muted-foreground">{problem.district}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(problem.status)}`} />
              {getStatusLabel(problem.status)}
            </Badge>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {problem.votesCount || 0}
            </span>
            <span className="text-xs">
              {new Date(problem.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}