"use client"

import dynamic from "next/dynamic"
import type { Cluster } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const ClusterMap = dynamic(
  () => import("./cluster-map").then((mod) => ({ default: mod.ClusterMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  }
)

interface MapContainerProps {
  clusters: Cluster[]
  center?: [number, number]
  zoom?: number
  onClusterClick?: (cluster: Cluster) => void
  className?: string
  clickToPlace?: boolean
  onMapClick?: (lat: number, lng: number) => void
  placedMarker?: [number, number] | null
  searchQuery?: string  // ДОБАВЛЯЕМ
}

export function MapContainer(props: MapContainerProps) {
  return <ClusterMap {...props} />
}