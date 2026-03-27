"use client"

import { useState, useEffect, useMemo } from "react"
import { useApp } from "@/lib/store"
import { MapContainer } from "@/components/map/map-container"
import { MapFilters } from "@/components/map/map-filters"
import { getClusters } from "@/lib/api"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

interface ApiCluster {
  id: number
  position: [number, number]
  type: string
  priority: string
  count: number
  status: string
  title: string
  district: string
}

interface MapCluster {
  id: string
  categoryId: string
  latitude: number
  longitude: number
  radius: number
  priority: string
  status: string
  problemIds: string[]
  complaintsCount: number
  district: string
  title: string
  address?: string
  createdAt: string
  updatedAt: string
}

export default function MapPage() {
  const { state, dispatch } = useApp()
  const [allClusters, setAllClusters] = useState<MapCluster[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClusters()
  }, [])

  async function fetchClusters() {
    try {
      const data: ApiCluster[] = await getClusters()
      
      const formatted: MapCluster[] = data.map((item) => ({
        id: String(item.id),
        categoryId: item.type,
        latitude: item.position[0],
        longitude: item.position[1],
        radius: 2,
        priority: item.priority,
        status: item.status,
        problemIds: [],
        complaintsCount: item.count,
        district: item.district,
        title: item.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      setAllClusters(formatted)
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  // Применяем фильтры к кластерам
  const filteredClusters = useMemo(() => {
    let filtered = [...allClusters]
    
    // Фильтр по категориям
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.categories.includes(cluster.categoryId)
      )
    }
    
    // Фильтр по статусам
    if (state.filters.statuses.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.statuses.includes(cluster.status as any)
      )
    }
    
    // Фильтр по приоритетам
    if (state.filters.priorities.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.priorities.includes(cluster.priority as any)
      )
    }
    
    // Фильтр по районам
    if (state.filters.districts.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.districts.includes(cluster.district)
      )
    }
    
    // Поиск по тексту
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase()
      filtered = filtered.filter(cluster => 
        cluster.title?.toLowerCase().includes(query) ||
        cluster.district?.toLowerCase().includes(query) ||
        cluster.categoryId?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [allClusters, state.filters])

  if (loading) {
    return <div className="flex h-full items-center justify-center">Загрузка карты...</div>
  }

  return (
    <div className="relative flex h-full">
      <div className="hidden w-72 shrink-0 border-r border-border lg:block">
        <MapFilters />
      </div>

      <div className="relative flex-1">
        <MapContainer
          clusters={filteredClusters}
          center={[43.2389, 76.8897]}
          zoom={12}
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
      </div>
    </div>
  )
}