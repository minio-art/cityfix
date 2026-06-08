"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import { useLanguage } from "@/contexts/LanguageContext"
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
  const { locale, t } = useLanguage()
  const data = t?.createProblem
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

  // Функция для получения названия категории на текущем языке
  const getCategoryName = (category: typeof categories[0]) => {
    return category.name[locale as keyof typeof category.name] || category.name.ru
  }

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
        const resData = await response.json()
        if (resData.category) {
          setAiSuggestion({
            category: resData.category,
            confidence: resData.confidence
          })
          
          if (resData.confidence > 0.7) {
            setCategoryId(resData.category)
            const category = categories.find(c => c.id === resData.category)
            toast.success(`${data?.aiDetected || "AI определил категорию"}: ${category ? getCategoryName(category) : resData.category}`)
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
      toast.error(data?.locationRequired || "Пожалуйста, укажите местоположение на карте")
      return
    }

    if (photos.length === 0) {
      toast.error(data?.photoRequired || "Пожалуйста, загрузите хотя бы одно фото")
      return
    }

    if (!categoryId) {
      toast.error(data?.categoryRequired || "Пожалуйста, выберите категорию")
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
        toast.success(data?.successMessage || "Проблема успешно отправлена!")
        router.push("/map")
      } else {
        toast.error(data?.errorMessage || "Ошибка при отправке")
      }
    } catch (error) {
      console.error("Ошибка:", error)
      toast.error(data?.errorMessage || "Произошла ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{data?.title || "Сообщить о проблеме"}</h1>
        <p className="mt-1 text-muted-foreground">
          {data?.subtitle || "Помогите улучшить ваш город, сообщая о замеченных проблемах"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{data?.problemDetails || "Детали проблемы"}</CardTitle>
              <CardDescription>{data?.problemDescription || "Опишите проблему, которую хотите сообщить"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">{data?.titleLabel || "Название"}</Label>
                <Input
                  id="title"
                  placeholder={data?.titlePlaceholder || "Например: Большая яма на улице Абая"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category">{data?.categoryLabel || "Категория"}</Label>
                <Select onValueChange={setCategoryId} value={categoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder={data?.categoryPlaceholder || "Выберите категорию"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex items-center gap-2">
                          <span>{c.icon}</span>
                          <span>{getCategoryName(c)}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {isAnalyzing && (
                  <p className="text-xs text-blue-600">{data?.analyzing || "AI анализирует фото..."}</p>
                )}
                
                {aiSuggestion && !categoryId && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">{data?.aiRecommendation || "AI рекомендация:"}</p>
                    <p className="text-sm text-blue-600">
                      {data?.category || "Категория"}: {getCategoryName(categories.find(c => c.id === aiSuggestion.category) || categories[0])}
                      <br />
                      {data?.confidence || "Уверенность"}: {Math.round(aiSuggestion.confidence * 100)}%
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
                      {data?.useCategory || "Использовать эту категорию"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">{data?.descriptionLabel || "Описание"}</Label>
                <Textarea
                  id="description"
                  placeholder={data?.descriptionPlaceholder || "Предоставьте детали проблемы..."}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>{data?.photosLabel || "Фотографии (обязательно)"}</Label>
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
              <CardTitle className="text-base">{data?.locationLabel || "Местоположение"}</CardTitle>
              <CardDescription>
                {data?.locationDescription || "Найдите адрес на карте или кликните для установки метки"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-hidden rounded-lg border border-border">
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </div>
              {location && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>📍 {location.address}</p>
                  <p>{data?.districtLabel || "🏙️ Район"}: {location.district}</p>
                  <p>{data?.coordinatesLabel || "Координаты"}: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (data?.submitting || "Отправка...") : (data?.submitButton || "Отправить")}
          </Button>
        </div>
      </form>
    </div>
  )
}