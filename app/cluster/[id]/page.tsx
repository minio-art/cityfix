"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import { getIssues, getClusters, updateIssueStatus } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { MapPin, Calendar, AlertCircle, CheckCircle2, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: Record<string, string>; color: string; icon: any }> = {
  new: { label: { ru: "Новая", kz: "Жаңа" }, color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  confirmed: { label: { ru: "Подтверждена", kz: "Расталған" }, color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: { label: { ru: "В работе", kz: "Жұмыс барысында" }, color: "bg-orange-100 text-orange-700", icon: Clock },
  resolved: { label: { ru: "Решена", kz: "Шешілді" }, color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: { ru: "Отклонена", kz: "Қабылданбады" }, color: "bg-red-100 text-red-700", icon: AlertCircle }
}

const statusOptions = [
  { value: "new", label: { ru: "Новая", kz: "Жаңа" } },
  { value: "confirmed", label: { ru: "Подтверждена", kz: "Расталған" } },
  { value: "in_progress", label: { ru: "В работе", kz: "Жұмыс барысында" } },
  { value: "resolved", label: { ru: "Решена", kz: "Шешілді" } },
  { value: "rejected", label: { ru: "Отклонена", kz: "Қабылданбады" } }
]

export default function ClusterDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { locale, t } = useLanguage()
  const data = t?.clusterDetailPage
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
      toast.error(data?.loadError || "Не удалось загрузить данные")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(issueId: number, newStatus: string) {
    if (!isAdmin) return
    
    setSubmitting(true)
    try {
      await updateIssueStatus(issueId.toString(), newStatus)
      toast.success(data?.statusUpdated || "Статус обновлён")
      await fetchData()
    } catch (error) {
      toast.error(data?.statusError || "Ошибка")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12">{data?.loading || "Загрузка..."}</div>
  }

  if (!cluster) {
    return <div className="text-center p-12">{data?.clusterNotFound || "Кластер не найден"}</div>
  }

  const resolvedCount = issues.filter(i => i.status === "resolved").length
  const allResolved = resolvedCount === issues.length && issues.length > 0

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Link href="/map" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        {data?.backToMap || "Назад к карте"}
      </Link>

      {/* Информация о кластере */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{cluster.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={statusConfig[cluster.status]?.color}>
              {statusConfig[cluster.status]?.label[locale]}
            </Badge>
            <Badge variant="outline">{cluster.type}</Badge>
            <Badge variant="outline">{cluster.district}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{data?.coordinates || "Координаты"}: {cluster.position?.[0]?.toFixed(5)}, {cluster.position?.[1]?.toFixed(5)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{data?.created || "Создан"}: {new Date(cluster.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>{data?.totalComplaints || "Всего жалоб в кластере"}:</strong> {cluster.count || issues.length}
            </p>
            <p className="text-sm">
              <strong>{data?.resolvedCount || "Решено"}:</strong> {resolvedCount} {data?.of || "из"} {issues.length}
            </p>
            {allResolved && (
              <p className="text-sm text-green-600 mt-1">✅ {data?.allResolved || "Все проблемы в этом кластере решены!"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Список проблем в кластере */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{data?.problemsInCluster || "Проблемы в этом кластере"} ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {data?.noProblems || "Нет проблем в этом кластере"}
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
                          {statusConfig[issue.status]?.label[locale]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description || (data?.noDescription || "Нет описания")}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>📍 {issue.address || issue.district}</span>
                        <span>📅 {new Date(issue.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
                        <span>👍 {issue.votesCount || 0} {data?.votes || "голосов"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            isAdmin
                              ? `/admin/problem/${issue.id}`
                              : `/problem/${issue.id}`
                          )
                        }
                      >
                        {data?.detailsButton || "Подробнее"}
                      </Button>
                      {isAdmin && (
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          disabled={submitting}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label[locale]}
                            </option>
                          ))}
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