"use client"

import { useState, useEffect } from "react"
import { MapContainer } from "@/components/map/map-container"
import { MapFilters } from "@/components/map/map-filters"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import type { Cluster } from "@/lib/types"

export default function MapPage() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)

  // Загружаем кластеры с бэкенда
  useEffect(() => {
    fetchClusters()
  }, [])

  const fetchClusters = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/clusters')
      const data = await response.json()
      
      // Преобразуем данные из API в формат Cluster
      const formattedClusters: Cluster[] = data.map((item: any) => ({
        id: item.id.toString(),
        categoryId: item.type,
        latitude: item.position[0],
        longitude: item.position[1],
        radius: 2,
        priority: item.priority,
        status: item.status,
        problemIds: [],
        complaintsCount: item.count,
        district: item.district || "Алматы",
        title: item.title || "Проблема",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      setClusters(formattedClusters)
    } catch (error) {
      console.error('Ошибка загрузки кластеров:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClusterClick = (cluster: Cluster) => {
    setSelectedCluster(cluster)
    // TODO: открыть детали проблемы
  }

  return (
    <div className="relative flex h-full">
      {/* Фильтры для десктопа */}
      <div className="hidden w-72 shrink-0 border-r border-border lg:block">
        <MapFilters />
      </div>

      {/* Карта */}
      <div className="relative flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p>Загрузка карты...</p>
          </div>
        ) : (
          <MapContainer
            clusters={clusters}
            center={[43.2389, 76.8897]} // Алматы
            zoom={12}
            onClusterClick={handleClusterClick}
          />
        )}

        {/* Кнопка фильтров для мобильных */}
        <div className="absolute left-3 top-3 z-[1000] lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="gap-2 shadow-lg">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
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