"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Download, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getIssues } from "@/lib/api"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 8

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700"
}

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700"
}

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

export default function AdminProblemsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { locale, t } = useLanguage()
  const data = t?.adminProblemsPage
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(0)

  // Функции для получения переведенных названий
  const getCategoryName = (categoryId: string) => {
    return categoryLabels[categoryId]?.[locale] || categoryId
  }

  const getPriorityName = (priority: string) => {
    return priorityLabels[priority]?.[locale] || priority
  }

  const getStatusName = (status: string) => {
    return statusLabels[status]?.[locale] || status
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  async function fetchProblems() {
    try {
      const data = await getIssues()
      setProblems(data)
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(problemId: number, newStatus: string) {
    try {
      const response = await fetch(`http://localhost:8001/api/issues/${problemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        toast.success(data?.statusUpdated || "Статус обновлен")
        await fetchProblems()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('status-updated'))
        }
      } else {
        toast.error(data?.updateError || "Ошибка обновления")
      }
    } catch (error) {
      toast.error(data?.connectionError || "Ошибка соединения")
    }
  }

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false
      if (statusFilter !== "all" && p.status !== statusFilter) return false
      if (priorityFilter !== "all" && p.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.title?.toLowerCase().includes(q) ||
          p.district?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [problems, catFilter, statusFilter, priorityFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedIds.length === pageData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(pageData.map((p) => p.id))
    }
  }

  function bulkChangeStatus(status: string) {
    selectedIds.forEach(async (id) => {
      await updateStatus(id, status)
    })
    toast.success(`${selectedIds.length} ${data?.problemsUpdated || "проблем обновлено"}`)
    setSelectedIds([])
  }

  function exportCSV() {
    const headers = [
      data?.csvId || "ID", 
      data?.csvTitle || "Заголовок", 
      data?.csvCategory || "Категория", 
      data?.csvStatus || "Статус", 
      data?.csvPriority || "Приоритет", 
      data?.csvDistrict || "Район", 
      data?.csvVotes || "Голосов", 
      data?.csvDate || "Дата"
    ]
    const rows = filtered.map((p) => [
      p.id,
      p.title,
      getCategoryName(p.category),
      getStatusName(p.status),
      getPriorityName(p.priority),
      p.district,
      p.votesCount || 0,
      new Date(p.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU'),
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cityfix-${data?.csvFilename || "проблемы"}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(data?.csvExported || "CSV экспортирован")
  }

  if (loading) {
    return <div className="p-6">{data?.loading || "Загрузка проблем..."}</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data?.title || "Проблемы"}</h1>
          <p className="text-muted-foreground">
            {data?.subtitle || "Управление и просмотр всех зарегистрированных проблем"}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" />
          {data?.exportButton || "Экспорт CSV"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={data?.searchPlaceholder || "Поиск проблем..."}
              className="h-9 pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            />
          </div>
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder={data?.categoryFilter || "Категория"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{data?.allCategories || "Все категории"}</SelectItem>
              <SelectItem value="roads">{categoryLabels.roads[locale]}</SelectItem>
              <SelectItem value="light">{categoryLabels.light[locale]}</SelectItem>
              <SelectItem value="water">{categoryLabels.water[locale]}</SelectItem>
              <SelectItem value="trash">{categoryLabels.trash[locale]}</SelectItem>
              <SelectItem value="graffiti">{categoryLabels.graffiti[locale]}</SelectItem>
              <SelectItem value="buildings">{categoryLabels.buildings[locale]}</SelectItem>
              <SelectItem value="trees">{categoryLabels.trees[locale]}</SelectItem>
              <SelectItem value="other">{categoryLabels.other[locale]}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder={data?.statusFilter || "Статус"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{data?.allStatuses || "Все статусы"}</SelectItem>
              <SelectItem value="new">{statusLabels.new[locale]}</SelectItem>
              <SelectItem value="confirmed">{statusLabels.confirmed[locale]}</SelectItem>
              <SelectItem value="in_progress">{statusLabels.in_progress[locale]}</SelectItem>
              <SelectItem value="resolved">{statusLabels.resolved[locale]}</SelectItem>
              <SelectItem value="rejected">{statusLabels.rejected[locale]}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder={data?.priorityFilter || "Приоритет"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{data?.allPriorities || "Все приоритеты"}</SelectItem>
              <SelectItem value="critical">{priorityLabels.critical[locale]}</SelectItem>
              <SelectItem value="medium">{priorityLabels.medium[locale]}</SelectItem>
              <SelectItem value="low">{priorityLabels.low[locale]}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center gap-3 py-3">
            <span className="text-sm font-medium">
              {data?.selectedCount || "Выбрано"}: {selectedIds.length}
            </span>
            <Select onValueChange={(v) => bulkChangeStatus(v)}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder={data?.changeStatus || "Изменить статус..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">{statusLabels.new[locale]}</SelectItem>
                <SelectItem value="confirmed">{statusLabels.confirmed[locale]}</SelectItem>
                <SelectItem value="in_progress">{statusLabels.in_progress[locale]}</SelectItem>
                <SelectItem value="resolved">{statusLabels.resolved[locale]}</SelectItem>
                <SelectItem value="rejected">{statusLabels.rejected[locale]}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedIds([])}>
              {data?.clearSelection || "Очистить выбор"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={selectedIds.length === pageData.length && pageData.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>{data?.tableProblem || "Проблема"}</TableHead>
                <TableHead>{data?.tableCategory || "Категория"}</TableHead>
                <TableHead>{data?.tableStatus || "Статус"}</TableHead>
                <TableHead>{data?.tablePriority || "Приоритет"}</TableHead>
                <TableHead>{data?.tableDistrict || "Район"}</TableHead>
                <TableHead className="text-right">{data?.tableVotes || "Голосов"}</TableHead>
                <TableHead>{data?.tableDate || "Дата"}</TableHead>
                <TableHead>{data?.tableAction || "Действие"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((p) => (
                <TableRow 
                  key={p.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/problem/${p.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={() => toggleSelect(p.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{getCategoryName(p.category)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[p.status]}>
                      {getStatusName(p.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[p.priority]}>
                      {getPriorityName(p.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell className="text-right">{p.votesCount || 0}</TableCell>
                  <TableCell>
                    {new Date(p.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{statusLabels.new[locale]}</SelectItem>
                        <SelectItem value="confirmed">{statusLabels.confirmed[locale]}</SelectItem>
                        <SelectItem value="in_progress">{statusLabels.in_progress[locale]}</SelectItem>
                        <SelectItem value="resolved">{statusLabels.resolved[locale]}</SelectItem>
                        <SelectItem value="rejected">{statusLabels.rejected[locale]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data?.showing || "Показано"} {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} {data?.of || "из"} {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{data?.page || "Страница"} {page + 1} {data?.of || "из"} {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}