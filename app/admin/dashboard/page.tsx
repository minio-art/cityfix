"use client"

import { useApp } from "@/lib/store"
import { categories } from "@/lib/mock-data"
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

export default function AdminDashboard() {
  const { state } = useApp()
  const { problems, clusters } = state

  const totalProblems = problems.length
  const activeProblems = problems.filter(
    (p) => p.status !== "resolved" && p.status !== "rejected"
  ).length
  const resolvedProblems = problems.filter((p) => p.status === "resolved").length
  const criticalCount = clusters.filter((c) => c.priority === "critical").length

  // Category breakdown for bar chart
  const categoryData = categories
    .map((cat) => ({
      name: cat.name.length > 12 ? cat.name.substring(0, 12) + "..." : cat.name,
      count: problems.filter((p) => p.categoryId === cat.id).length,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)

  // Monthly trend data (mock)
  const trendData = [
    { month: "Jul", reports: 18, resolved: 12 },
    { month: "Aug", reports: 24, resolved: 15 },
    { month: "Sep", reports: 32, resolved: 22 },
    { month: "Oct", reports: 28, resolved: 20 },
    { month: "Nov", reports: 35, resolved: 18 },
    { month: "Dec", reports: 22, resolved: 25 },
  ]

  // Recent activity
  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const statCards = [
    {
      title: "Total Problems",
      value: totalProblems,
      icon: FileText,
      description: "All reported issues",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Issues",
      value: activeProblems,
      icon: Clock,
      description: "Awaiting resolution",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Resolved",
      value: resolvedProblems,
      icon: CheckCircle2,
      description: "Successfully fixed",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Critical Clusters",
      value: criticalCount,
      icon: AlertTriangle,
      description: "Need immediate attention",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of city problems and activity</p>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart - Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Problems by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0 0 / 0.5)"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0 0 / 0.5)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="oklch(0.45 0.18 255)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line chart - Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0 0 / 0.5)"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0 0 / 0.5)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="oklch(0.45 0.18 255)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Reports"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {recentProblems.map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId)
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat?.name} &middot; {p.district} &middot;{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        p.priority === "critical"
                          ? "destructive"
                          : p.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {p.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {p.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
