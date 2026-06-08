"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { getIssues, getClusters } from "@/lib/api"

// Переводы для категорий
const categoryLabels: Record<string, Record<string, string>> = {
  roads: { ru: "Дороги", kz: "Жолдар" },
  light: { ru: "Освещение", kz: "Жарықтандыру" },
  water: { ru: "Водоснабжение", kz: "Сумен жабдықтау" },
  trash: { ru: "Мусор", kz: "Қоқыс" },
  graffiti: { ru: "Граффити", kz: "Граффити" },
  buildings: { ru: "Здания", kz: "Ғимараттар" },
  trees: { ru: "Деревья", kz: "Ағаштар" },
  other: { ru: "Другое", kz: "Басқа" }
}

// Переводы для приоритетов
const priorityLabels: Record<string, Record<string, string>> = {
  critical: { ru: "Критический", kz: "Критикалық" },
  medium: { ru: "Средний", kz: "Орташа" },
  low: { ru: "Низкий", kz: "Төмен" }
}

// Переводы для статусов
const statusLabels: Record<string, Record<string, string>> = {
  new: { ru: "Новая", kz: "Жаңа" },
  confirmed: { ru: "Подтверждена", kz: "Расталған" },
  in_progress: { ru: "В работе", kz: "Жұмыс барысында" },
  resolved: { ru: "Решена", kz: "Шешілді" },
  rejected: { ru: "Отклонена", kz: "Қабылданбады" }
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { locale, t } = useLanguage()
  const data = t?.adminDashboardPage
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProblems: 0,
    activeIssues: 0,
    resolved: 0,
    criticalClusters: 0,
    byCategory: {} as Record<string, number>,
    recentReports: [] as any[]
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const issues = await getIssues()
      const clusters = await getClusters()

      const active = issues.filter((i: any) => i.status !== 'resolved')
      const resolved = issues.filter((i: any) => i.status === 'resolved')
      const critical = clusters.filter((c: any) => c.priority === 'critical')

      const byCat: Record<string, number> = {}
      issues.forEach((i: any) => {
        byCat[i.category] = (byCat[i.category] || 0) + 1
      })

      setStats({
        totalProblems: issues.length,
        activeIssues: active.length,
        resolved: resolved.length,
        criticalClusters: critical.length,
        byCategory: byCat,
        recentReports: issues.slice(0, 5)
      })
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    } finally {
      setLoading(false)
    }
  }

  // Функция для получения названия категории на текущем языке
  const getCategoryName = (categoryId: string) => {
    return categoryLabels[categoryId]?.[locale] || categoryId
  }

  // Функция для получения названия приоритета на текущем языке
  const getPriorityName = (priority: string) => {
    return priorityLabels[priority]?.[locale] || priority
  }

  // Функция для получения названия статуса на текущем языке
  const getStatusName = (status: string) => {
    return statusLabels[status]?.[locale] || status
  }

  const categoryData = Object.entries(stats.byCategory)
    .map(([name, count]) => ({
      name: getCategoryName(name),
      originalName: name,
      count
    }))
    .sort((a, b) => b.count - a.count)

  const trendData = [
    { month: data?.jul || "Июл", reports: 0, resolved: 0 },
    { month: data?.aug || "Авг", reports: 0, resolved: 0 },
    { month: data?.sep || "Сен", reports: 0, resolved: 0 },
    { month: data?.oct || "Окт", reports: 0, resolved: 0 },
    { month: data?.nov || "Ноя", reports: 0, resolved: 0 },
    { month: data?.dec || "Дек", reports: stats.totalProblems, resolved: stats.resolved },
  ]

  const statCards = [
    { 
      title: data?.totalProblems || "Всего проблем", 
      value: stats.totalProblems, 
      icon: FileText, 
      color: "text-primary", 
      bgColor: "bg-primary/10" 
    },
    { 
      title: data?.activeIssues || "Активные", 
      value: stats.activeIssues, 
      icon: Clock, 
      color: "text-amber-500", 
      bgColor: "bg-amber-500/10" 
    },
    { 
      title: data?.resolved || "Решённые", 
      value: stats.resolved, 
      icon: CheckCircle2, 
      color: "text-green-500", 
      bgColor: "bg-green-500/10" 
    },
    { 
      title: data?.criticalClusters || "Критические кластеры", 
      value: stats.criticalClusters, 
      icon: AlertTriangle, 
      color: "text-red-500", 
      bgColor: "bg-red-500/10" 
    },
  ]

  if (loading) {
    return <div className="p-6">{data?.loading || "Загрузка статистики..."}</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{data?.title || "Панель управления"}</h1>
        <p className="text-muted-foreground">
          {data?.subtitle || "Обзор проблем города и активности пользователей"}
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {data?.problemsByCategory || "Проблемы по категориям"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }} 
                  stroke="#888" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" />
                <Tooltip 
                  formatter={(value: number) => [value, data?.count || "Количество"]}
                  labelFormatter={(label) => `${data?.category || "Категория"}: ${label}`}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {data?.monthlyTrend || "Месячная динамика"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value, 
                    name === "reports" ? (data?.problems || "Проблемы") : (data?.resolvedShort || "Решено")
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  name={data?.problems || "Проблемы"} 
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  name={data?.resolvedShort || "Решено"} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            {data?.recentReports || "Последние отчёты"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {stats.recentReports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(report.category)} · {report.district} · {new Date(report.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={report.priority === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                    {getPriorityName(report.priority)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getStatusName(report.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}