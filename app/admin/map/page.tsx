"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { MapContainer } from "@/components/map/map-container"
import { MapFilters } from "@/components/map/map-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, X } from "lucide-react"
import type { Cluster, Priority, Status } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import { getPriorityColor, getPriorityLabel, getStatusLabel } from "@/lib/geo"
import { toast } from "sonner"

export default function AdminMapPage() {
  const { state, dispatch } = useApp()
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)

  const filteredClusters = state.clusters.filter((cluster) => {
    const f = state.filters
    if (f.categories.length > 0 && !f.categories.includes(cluster.categoryId)) return false
    if (f.districts.length > 0 && !f.districts.includes(cluster.district)) return false
    if (f.statuses.length > 0 && !f.statuses.includes(cluster.status)) return false
    if (f.priorities.length > 0 && !f.priorities.includes(cluster.priority)) return false
    return true
  })

  function handlePriorityChange(clusterId: string, priority: Priority) {
    const cluster = state.clusters.find((c) => c.id === clusterId)
    if (cluster) {
      dispatch({ type: "UPDATE_CLUSTER", payload: { ...cluster, priority } })
      toast.success(`Priority updated to ${getPriorityLabel(priority)}`)
    }
    setSelectedCluster(null)
  }

  function handleStatusChange(clusterId: string, status: Status) {
    const cluster = state.clusters.find((c) => c.id === clusterId)
    if (cluster) {
      dispatch({ type: "UPDATE_CLUSTER", payload: { ...cluster, status } })
      toast.success(`Status updated to ${getStatusLabel(status)}`)
    }
    setSelectedCluster(null)
  }

  const cat = selectedCluster
    ? categories.find((c) => c.id === selectedCluster.categoryId)
    : null

  return (
    <div className="relative flex h-full">
      <div className="hidden w-72 shrink-0 border-r border-border lg:block">
        <MapFilters />
      </div>

      <div className="relative flex-1">
        <MapContainer
          clusters={filteredClusters}
          onClusterClick={(c) => setSelectedCluster(c)}
        />

        <div className="absolute left-3 top-3 z-[1000] lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="gap-2 shadow-lg">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <MapFilters />
            </SheetContent>
          </Sheet>
        </div>

        {/* Admin cluster management panel */}
        {selectedCluster && (
          <div className="absolute bottom-6 left-1/2 z-[1000] w-[calc(100%-3rem)] max-w-lg -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0">
            <Card className="shadow-xl">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{selectedCluster.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {cat?.name} &middot; {selectedCluster.district} &middot;{" "}
                    {selectedCluster.complaintsCount} complaints
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge
                    style={{ backgroundColor: getPriorityColor(selectedCluster.priority), color: "white" }}
                  >
                    {getPriorityLabel(selectedCluster.priority)}
                  </Badge>
                  <Badge variant="outline">{getStatusLabel(selectedCluster.status)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Change Priority
                    </label>
                    <Select
                      value={selectedCluster.priority}
                      onValueChange={(v) =>
                        handlePriorityChange(selectedCluster.id, v as Priority)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Change Status
                    </label>
                    <Select
                      value={selectedCluster.status}
                      onValueChange={(v) =>
                        handleStatusChange(selectedCluster.id, v as Status)
                      }
                    >
                      <SelectTrigger className="h-9">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
