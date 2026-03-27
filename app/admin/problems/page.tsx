"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
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

export default function AdminProblemsPage() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(0)

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
      const response = await fetch(`http://localhost:8000/api/issues/${problemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        toast.success("Статус обновлен")
        await fetchProblems()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('status-updated'))
        }
      } else {
        toast.error("Ошибка обновления")
      }
    } catch (error) {
      toast.error("Ошибка соединения")
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
    toast.success(`${selectedIds.length} problems updated`)
    setSelectedIds([])
  }

  function exportCSV() {
    const headers = ["ID", "Title", "Category", "Status", "Priority", "District", "Votes", "Date"]
    const rows = filtered.map((p) => [
      p.id,
      p.title,
      p.category,
      p.status,
      p.priority,
      p.district,
      p.votesCount || 0,
      new Date(p.created_at).toLocaleDateString(),
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cityfix-problems.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported")
  }

  if (loading) {
    return <div className="p-6">Загрузка проблем...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-muted-foreground">Manage and review all reported problems</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="h-9 pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            />
          </div>
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="roads">Дороги</SelectItem>
              <SelectItem value="light">Освещение</SelectItem>
              <SelectItem value="water">Водоснабжение</SelectItem>
              <SelectItem value="trash">Мусор</SelectItem>
              <SelectItem value="graffiti">Граффити</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(0) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center gap-3 py-3">
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
            <Select onValueChange={(v) => bulkChangeStatus(v)}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Change status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedIds([])}>
              Clear selection
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
                <TableHead>Problem</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[p.status] || "bg-gray-100"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[p.priority] || "bg-gray-100"}>{p.priority}</Badge>
                  </TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell className="text-right">{p.votesCount || 0}</TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
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
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {page + 1} of {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}