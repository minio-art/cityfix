"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/lib/store"
import { categories, districts } from "@/lib/mock-data"
import { getPriorityColor, getPriorityLabel, getStatusLabel, getStatusColor } from "@/lib/geo"
import type { Priority, Status } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const PAGE_SIZE = 8

export default function AdminProblemsPage() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    return state.problems.filter((p) => {
      if (catFilter !== "all" && p.categoryId !== catFilter) return false
      if (statusFilter !== "all" && p.status !== statusFilter) return false
      if (priorityFilter !== "all" && p.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [state.problems, catFilter, statusFilter, priorityFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSelect(id: string) {
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

  function bulkChangeStatus(status: Status) {
    selectedIds.forEach((id) => {
      const problem = state.problems.find((p) => p.id === id)
      if (problem) {
        dispatch({ type: "UPDATE_PROBLEM", payload: { ...problem, status } })
      }
    })
    toast.success(`${selectedIds.length} problems updated to ${getStatusLabel(status)}`)
    setSelectedIds([])
  }

  function bulkChangePriority(priority: Priority) {
    selectedIds.forEach((id) => {
      const problem = state.problems.find((p) => p.id === id)
      if (problem) {
        dispatch({ type: "UPDATE_PROBLEM", payload: { ...problem, priority } })
      }
    })
    toast.success(`${selectedIds.length} problems updated to ${getPriorityLabel(priority)}`)
    setSelectedIds([])
  }

  function exportCSV() {
    const headers = ["ID", "Title", "Category", "Status", "Priority", "District", "Votes", "Date"]
    const rows = filtered.map((p) => [
      p.id,
      p.title,
      categories.find((c) => c.id === p.categoryId)?.name || p.categoryId,
      p.status,
      p.priority,
      p.district,
      p.votesCount,
      new Date(p.createdAt).toLocaleDateString(),
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cityfix-problems.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported successfully")
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Problems</h1>
          <p className="text-muted-foreground">
            Manage and review all reported problems
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="h-9 pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
            />
          </div>
          <Select
            value={catFilter}
            onValueChange={(v) => {
              setCatFilter(v)
              setPage(0)
            }}
          >
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v)
              setPage(0)
            }}
          >
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
          <Select
            value={priorityFilter}
            onValueChange={(v) => {
              setPriorityFilter(v)
              setPage(0)
            }}
          >
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

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center gap-3 py-3">
            <span className="text-sm font-medium text-foreground">
              {selectedIds.length} selected
            </span>
            <Select onValueChange={(v) => bulkChangeStatus(v as Status)}>
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
            <Select onValueChange={(v) => bulkChangePriority(v as Priority)}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Change priority..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setSelectedIds([])}
            >
              Clear selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.length === pageData.length && pageData.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No problems found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId)
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(p.id)}
                          onCheckedChange={() => toggleSelect(p.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-foreground">
                          {p.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {cat?.name || p.categoryId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 text-xs">
                          <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(p.status)}`} />
                          {getStatusLabel(p.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: getPriorityColor(p.priority) + "20",
                            color: getPriorityColor(p.priority),
                            border: `1px solid ${getPriorityColor(p.priority)}40`,
                          }}
                        >
                          {getPriorityLabel(p.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.district}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-foreground">
                        {p.votesCount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
