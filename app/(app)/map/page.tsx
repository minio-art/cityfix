"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFilteredClusters } from "@/lib/store"
import { MapContainer } from "@/components/map/map-container"
import { MapFilters } from "@/components/map/map-filters"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, SlidersHorizontal } from "lucide-react"
import type { Cluster } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import { getPriorityLabel, getStatusLabel, getPriorityColor } from "@/lib/geo"
import Link from "next/link"

export default function MapPage() {
  const clusters = useFilteredClusters()
  const router = useRouter()
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)

  function handleClusterClick(cluster: Cluster) {
    setSelectedCluster(cluster)
  }

  const cat = selectedCluster
    ? categories.find((c) => c.id === selectedCluster.categoryId)
    : null

  return (
    <div className="relative flex h-full">
      {/* Desktop filters sidebar */}
      <div className="hidden w-72 shrink-0 border-r border-border lg:block">
        <MapFilters />
      </div>

      {/* Map area */}
      <div className="relative flex-1">
        <MapContainer
          clusters={clusters}
          onClusterClick={handleClusterClick}
        />

        {/* Mobile filter trigger */}
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

        {/* Add Problem FAB */}
        <div className="absolute bottom-6 right-6 z-[1000]">
          <Button asChild size="lg" className="gap-2 rounded-full shadow-lg">
            <Link href="/problem/create">
              <PlusCircle className="h-5 w-5" />
              Report Problem
            </Link>
          </Button>
        </div>

        {/* Selected cluster card */}
        {selectedCluster && (
          <div className="absolute bottom-6 left-1/2 z-[1000] w-[calc(100%-3rem)] max-w-md -translate-x-1/2 rounded-xl border border-border bg-card p-4 shadow-xl lg:left-auto lg:right-6 lg:translate-x-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {selectedCluster.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat?.name} &middot; {selectedCluster.district}
                </p>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge
                style={{
                  backgroundColor: getPriorityColor(selectedCluster.priority),
                  color: "white",
                }}
              >
                {getPriorityLabel(selectedCluster.priority)}
              </Badge>
              <Badge variant="outline">
                {getStatusLabel(selectedCluster.status)}
              </Badge>
              <span className="text-sm font-medium text-foreground">
                {selectedCluster.complaintsCount} complaints
              </span>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                className="w-full"
                onClick={() =>
                  router.push(
                    `/problem/${selectedCluster.problemIds[0]}`
                  )
                }
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
