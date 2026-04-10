"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
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

export default function AdminDashboardPage() {
  const { user } = useAuth()
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

  const categoryData = Object.entries(stats.byCategory)
    .map(([name, count]) => ({
      name: name.length > 12 ? name.substring(0, 12) + "..." : name,
      count
    }))
    .sort((a, b) => b.count - a.count)

  const trendData = [
    { month: "Июл", reports: 0, resolved: 0 },
    { month: "Авг", reports: 0, resolved: 0 },
    { month: "Сен", reports: 0, resolved: 0 },
    { month: "Окт", reports: 0, resolved: 0 },
    { month: "Ноя", reports: 0, resolved: 0 },
    { month: "Дек", reports: stats.totalProblems, resolved: stats.resolved },
  ]

  const statCards = [
    { title: "Всего проблем", value: stats.totalProblems, icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Активные", value: stats.activeIssues, icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { title: "Решённые", value: stats.resolved, icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Критические кластеры", value: stats.criticalClusters, icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
  ]

  if (loading) {
    return <div className="p-6">Загрузка статистики...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Обзор проблем города и активности пользователей</p>
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
            <CardTitle className="text-base">Проблемы по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Месячная динамика</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Проблемы" />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Решено" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Последние отчёты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {stats.recentReports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.category} · {report.district} · {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={report.priority === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                    {report.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {report.status}
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