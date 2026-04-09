"use client"

import { useState, useEffect, useMemo } from "react"
import { useApp } from "@/lib/store"
import { MapContainer } from "@/components/map/map-container"
import { getClusters } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MapFilters } from "@/components/map/map-filters"
import { SlidersHorizontal, X } from "lucide-react"
import { toast } from "sonner"

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
  createdAt: string
  updatedAt: string
}

export default function AdminMapPage() {
  const { state, dispatch } = useApp()
  const [allClusters, setAllClusters] = useState<MapCluster[]>([])
  const [selectedCluster, setSelectedCluster] = useState<MapCluster | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    
    const handleStatusUpdate = () => {
      fetchData()
    }
    window.addEventListener('status-updated', handleStatusUpdate)
    return () => window.removeEventListener('status-updated', handleStatusUpdate)
  }, [])

  async function fetchData() {
    try {
      const data: ApiCluster[] = await getClusters()
      
      const formattedClusters: MapCluster[] = data.map((item) => ({
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
      
      setAllClusters(formattedClusters)
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

  async function updateClusterStatus(clusterId: number, newStatus: string) {
    try {
      const response = await fetch(`http://localhost:8001/api/clusters/${clusterId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        toast.success("Статус кластера обновлен")
        fetchData()
        setSelectedCluster(null)
      } else {
        toast.error("Ошибка обновления")
      }
    } catch (error) {
      toast.error("Ошибка соединения")
    }
  }

  if (loading) {
    return <div className="p-6">Загрузка карты...</div>
  }

  return (
    <div className="relative flex h-full">
      <div className="hidden w-72 shrink-0 border-r lg:block">
        <MapFilters />
      </div>

      <div className="relative flex-1">
        <MapContainer
          clusters={filteredClusters}
          center={[43.2389, 76.8897]}
          zoom={12}
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

        {selectedCluster && (
          <div className="absolute bottom-6 left-1/2 z-[1000] w-96 -translate-x-1/2">
            <Card className="shadow-xl">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selectedCluster.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedCluster.categoryId} · {selectedCluster.district} · {selectedCluster.complaintsCount} complaints
                  </p>
                </div>
                <button onClick={() => setSelectedCluster(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Badge className={
                    selectedCluster.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    selectedCluster.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {selectedCluster.priority}
                  </Badge>
                  <Badge variant="outline">{selectedCluster.status}</Badge>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Change Status</label>
                  <Select 
                    value={selectedCluster.status}
                    onValueChange={(v) => updateClusterStatus(Number(selectedCluster.id), v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
  

  
}
