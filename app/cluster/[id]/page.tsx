"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getIssues, getClusters, updateIssueStatus } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { MapPin, Calendar, AlertCircle, CheckCircle2, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: "Новая", color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  confirmed: { label: "Подтверждена", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: { label: "В работе", color: "bg-orange-100 text-orange-700", icon: Clock },
  resolved: { label: "Решена", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Отклонена", color: "bg-red-100 text-red-700", icon: AlertCircle }
}

export default function ClusterDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [cluster, setCluster] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      // Получаем все кластеры и находим нужный
      const clusters = await getClusters()
      const currentCluster = clusters.find((c: any) => c.id === parseInt(id as string))
      setCluster(currentCluster)
      
      // Получаем все проблемы и фильтруем по cluster_id
      const allIssues = await getIssues()
      const clusterIssues = allIssues.filter((issue: any) => issue.cluster_id === parseInt(id as string))
      setIssues(clusterIssues)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      toast.error("Не удалось загрузить данные")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(issueId: number, newStatus: string) {
    if (!isAdmin) return
    
    setSubmitting(true)
    try {
      await updateIssueStatus(issueId.toString(), newStatus)
      toast.success("Статус обновлён")
      await fetchData()
    } catch (error) {
      toast.error("Ошибка")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12">Загрузка...</div>
  }

  if (!cluster) {
    return <div className="text-center p-12">Кластер не найден</div>
  }

  const resolvedCount = issues.filter(i => i.status === "resolved").length
  const allResolved = resolvedCount === issues.length && issues.length > 0

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Link href="/map" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Назад к карте
      </Link>

      {/* Информация о кластере */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{cluster.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={statusConfig[cluster.status]?.color}>
              {statusConfig[cluster.status]?.label}
            </Badge>
            <Badge variant="outline">{cluster.type}</Badge>
            <Badge variant="outline">{cluster.district}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Координаты: {cluster.position?.[0]?.toFixed(5)}, {cluster.position?.[1]?.toFixed(5)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Создан: {new Date(cluster.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Всего жалоб в кластере:</strong> {cluster.count || issues.length}
            </p>
            <p className="text-sm">
              <strong>Решено:</strong> {resolvedCount} из {issues.length}
            </p>
            {allResolved && (
              <p className="text-sm text-green-600 mt-1">✅ Все проблемы в этом кластере решены!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Список проблем в кластере */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Проблемы в этом кластере ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Нет проблем в этом кластере
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge className={statusConfig[issue.status]?.color}>
                          {statusConfig[issue.status]?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description || "Нет описания"}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>📍 {issue.address || issue.district}</span>
                        <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>
                        <span>👍 {issue.votesCount || 0} голосов</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/problem/${issue.id}`)}
                      >
                        Подробнее
                      </Button>
                      {isAdmin && (
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          disabled={submitting}
                        >
                          <option value="new">Новая</option>
                          <option value="confirmed">Подтверждена</option>
                          <option value="in_progress">В работе</option>
                          <option value="resolved">Решена</option>
                          <option value="rejected">Отклонена</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}