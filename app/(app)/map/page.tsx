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
  votesCount?: number
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
  votesCount: number
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
      console.log('🔄 Fetching clusters...')
      const data: ApiCluster[] = await getClusters()
      
      console.log('📊 Raw API response:', data)
      console.log('📊 Total clusters received:', data.length)
      console.log('📊 Status distribution:', data.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1
        return acc
      }, {} as Record<string, number>))
      
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
        votesCount: item.votesCount || 0,
        district: item.district,
        title: item.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      console.log('✅ Formatted clusters:', formatted.length)
      console.log('✅ Statuses in formatted:', [...new Set(formatted.map(c => c.status))])
      
      setAllClusters(formatted)
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  // Применяем фильтры к кластерам
  const filteredClusters = useMemo(() => {
    console.log('\n=== 🎯 FILTERING CLUSTERS ===')
    console.log('Total clusters before filter:', allClusters.length)
    console.log('Current filters:', {
      categories: state.filters.categories,
      statuses: state.filters.statuses,
      priorities: state.filters.priorities,
      districts: state.filters.districts,
      searchQuery: state.filters.searchQuery
    })
    
    let filtered = [...allClusters]
    
    // Фильтр по категориям
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.categories.includes(cluster.categoryId)
      )
      console.log('After category filter:', filtered.length)
    }
    
    // Фильтр по статусам
    if (state.filters.statuses.length > 0) {
      console.log('Filtering by statuses:', state.filters.statuses)
      const beforeCount = filtered.length
      filtered = filtered.filter(cluster => {
        const matches = state.filters.statuses.includes(cluster.status as any)
        if (!matches) {
          console.log(`  ❌ Filtered out cluster ${cluster.id} with status "${cluster.status}"`)
        }
        return matches
      })
      console.log('After status filter:', filtered.length, `(removed ${beforeCount - filtered.length})`)
      
      // Показать оставшиеся статусы
      const remainingStatuses = [...new Set(filtered.map(c => c.status))]
      console.log('Remaining statuses:', remainingStatuses)
    } else {
      console.log('No status filters applied, showing all statuses:', [...new Set(filtered.map(c => c.status))])
    }
    
    // Фильтр по приоритетам
    if (state.filters.priorities.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.priorities.includes(cluster.priority as any)
      )
      console.log('After priority filter:', filtered.length)
    }
    
    // Фильтр по районам
    if (state.filters.districts.length > 0) {
      filtered = filtered.filter(cluster => 
        state.filters.districts.includes(cluster.district)
      )
      console.log('After district filter:', filtered.length)
    }
    
    // Поиск по тексту
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase()
      filtered = filtered.filter(cluster => 
        cluster.title?.toLowerCase().includes(query) ||
        cluster.district?.toLowerCase().includes(query) ||
        cluster.categoryId?.toLowerCase().includes(query)
      )
      console.log('After search filter:', filtered.length)
    }
    
    console.log('🎯 Final filtered clusters:', filtered.length)
    console.log('================================\n')
    
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