"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import { categories } from "@/lib/mock-data"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { createProblem } from "@/lib/api"
import type { LocationSearchProps } from "@/components/map/location-search"

// Динамический импорт карты с правильной типизацией
const LocationSearch = dynamic<LocationSearchProps>(
  () => import("@/components/map/location-search").then(mod => mod.LocationSearch),
  { 
    ssr: false,
    loading: () => <div className="h-80 flex items-center justify-center bg-muted rounded-lg">Загрузка карты...</div>
  }
)

export default function CreateProblemPage() {
  const router = useRouter()
  const { state } = useApp()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [location, setLocation] = useState<{ 
    lat: number; 
    lng: number; 
    address: string; 
    district: string;
  } | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // AI состояния
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; confidence: number } | null>(null)

  // Получаем район с карты
  const handleLocationSelect = (lat: number, lng: number, address: string, district: string) => {
    setLocation({ lat, lng, address, district })
    console.log('📍 Район с карты:', district)
  }

  // AI анализ фото
  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true)
    
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const response = await fetch('http://localhost:8001/api/ai/analyze', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.category) {
          setAiSuggestion({
            category: data.category,
            confidence: data.confidence
          })
          
          if (data.confidence > 0.7) {
            setCategoryId(data.category)
            toast.success(`AI определил категорию: ${categories.find(c => c.id === data.category)?.name}`)
          }
        }
      }
    } catch (error) {
      console.error('Ошибка AI анализа:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePhotosChange = (files: File[]) => {
    setPhotos(files)
    
    if (files.length > 0 && !categoryId) {
      analyzePhoto(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location) {
      toast.error("Пожалуйста, укажите местоположение на карте")
      return
    }

    if (photos.length === 0) {
      toast.error("Пожалуйста, загрузите хотя бы одно фото")
      return
    }

    if (!categoryId) {
      toast.error("Пожалуйста, выберите категорию")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", categoryId)
      formData.append("district", location.district)
      formData.append("latitude", location.lat.toString())
      formData.append("longitude", location.lng.toString())
      formData.append("address", location.address)
      formData.append("user_id", state.currentUser?.id || "1")
      
      photos.forEach((photo) => {
        formData.append("photos", photo)
      })

      const result = await createProblem(formData)
      
      if (result.success) {
        toast.success("Проблема успешно отправлена!")
        router.push("/map")
      } else {
        toast.error("Ошибка при отправке")
      }
    } catch (error) {
      console.error("Ошибка:", error)
      toast.error("Произошла ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Сообщить о проблеме</h1>
        <p className="mt-1 text-muted-foreground">
          Помогите улучшить ваш город, сообщая о замеченных проблемах
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Детали проблемы</CardTitle>
              <CardDescription>Опишите проблему, которую хотите сообщить</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  placeholder="Например: Большая яма на улице Абая"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Категория</Label>
                <Select onValueChange={setCategoryId} value={categoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {isAnalyzing && (
                  <p className="text-xs text-blue-600">AI анализирует фото...</p>
                )}
                
                {aiSuggestion && !categoryId && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">AI рекомендация:</p>
                    <p className="text-sm text-blue-600">
                      Категория: {categories.find(c => c.id === aiSuggestion.category)?.name || aiSuggestion.category}
                      <br />
                      Уверенность: {Math.round(aiSuggestion.confidence * 100)}%
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setCategoryId(aiSuggestion.category)
                        setAiSuggestion(null)
                      }}
                    >
                      Использовать эту категорию
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Предоставьте детали проблемы..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Фотографии (обязательно)</Label>
                <FileUpload
                  onChange={handlePhotosChange}
                  maxFiles={5}
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Местоположение</CardTitle>
              <CardDescription>
                Найдите адрес на карте или кликните для установки метки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-hidden rounded-lg border border-border">
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </div>
              {location && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>📍 {location.address}</p>
                  <p>🏙️ Район: {location.district}</p>
                  <p>Координаты: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </div>
      </form>
    </div>
  )
}