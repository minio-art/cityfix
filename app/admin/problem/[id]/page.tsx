"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import { getIssue, voteIssue, addComment, getComments, uploadAfterPhoto, updateIssueStatus } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import Image from "next/image"
import { ThumbsUp, Calendar, MapPin, AlertCircle, CheckCircle2, Clock, Camera, ChevronLeft } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: Record<string, string>; color: string; icon: any }> = {
  new: { label: { ru: "Новая", kz: "Жаңа" }, color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  confirmed: { label: { ru: "Подтверждена", kz: "Расталған" }, color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: { label: { ru: "В работе", kz: "Жұмыс барысында" }, color: "bg-orange-100 text-orange-700", icon: Clock },
  resolved: { label: { ru: "Решена", kz: "Шешілді" }, color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: { ru: "Отклонена", kz: "Қабылданбады" }, color: "bg-red-100 text-red-700", icon: AlertCircle }
}

const priorityConfig: Record<string, { label: Record<string, string>; color: string }> = {
  critical: { label: { ru: "Критический", kz: "Критикалық" }, color: "bg-red-100 text-red-700" },
  medium: { label: { ru: "Средний", kz: "Орташа" }, color: "bg-yellow-100 text-yellow-700" },
  low: { label: { ru: "Низкий", kz: "Төмен" }, color: "bg-green-100 text-green-700" }
}

const categoryNames: Record<string, Record<string, string>> = {
  roads: { ru: "Дороги", kz: "Жолдар" },
  light: { ru: "Освещение", kz: "Жарықтандыру" },
  water: { ru: "Водоснабжение", kz: "Сумен жабдықтау" },
  trash: { ru: "Мусор", kz: "Қоқыс" },
  graffiti: { ru: "Граффити", kz: "Граффити" },
  buildings: { ru: "Здания", kz: "Ғимараттар" },
  trees: { ru: "Деревья", kz: "Ағаштар" },
  other: { ru: "Другое", kz: "Басқа" }
}

export default function ProblemDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { locale, t } = useLanguage()
  const data = t?.problemDetailPage
  const [problem, setProblem] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null)
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  const requestStatusChange = (newStatus: string) => {
    if (newStatus === "resolved" && !problem.photo_after && !afterPhoto) {
      toast.error(data?.uploadPhotoFirst || "Сначала загрузите фото 'После'")
      return
    }
    setPendingStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = async () => {
    if (!pendingStatus) return
    
    setSubmitting(true)
    try {
      if (afterPhoto && pendingStatus === "resolved") {
        const formData = new FormData()
        formData.append("photo", afterPhoto)
        const result = await uploadAfterPhoto(id as string, formData)
        setProblem({ ...problem, photo_after: result.photo_url })
        setAfterPhoto(null)
        setAfterPhotoPreview(null)
      }
      
      await updateIssueStatus(id as string, pendingStatus)
      setProblem({ ...problem, status: pendingStatus })
      setSelectedStatus(pendingStatus)
      toast.success(`${data?.statusChangedTo || "Статус изменён на"} ${statusConfig[pendingStatus]?.label[locale]}`)
      
      await fetchData()
      setShowConfirmDialog(false)
      setPendingStatus(null)
    } catch (error) {
      toast.error(data?.statusChangeError || "Ошибка при изменении статуса")
    } finally {
      setSubmitting(false)
    }
  }

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      
      const response = await fetch('http://localhost:8001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.role === 'admin') {
          setIsAdmin(true)
        }
      }
    } catch (error) {
      console.error('Ошибка проверки статуса админа:', error)
    }
  }

  useEffect(() => {
    checkAdminStatus()
    if (user?.role === "admin") {
      setIsAdmin(true)
    }
    fetchData()
  }, [id, user])

  async function fetchData() {
    try {
      const issueData = await getIssue(id as string)
      setProblem(issueData)
      setSelectedStatus(issueData.status)
      
      if (issueData.photo_after) {
        setAfterPhotoPreview(`http://localhost:8001${issueData.photo_after}`)
      }
      
      const commentsData = await getComments(id as string)
      setComments(commentsData || [])
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      toast.error("Не удалось загрузить данные")
    } finally {
      setLoading(false)
    }
  }

  async function handleVote() {
    if (!user) {
      toast.error(data?.loginToVote || "Войдите чтобы голосовать")
      router.push("/login")
      return
    }

    setSubmitting(true)
    try {
      await voteIssue(id as string, user.id.toString())
      setProblem({ ...problem, votesCount: (problem.votesCount || 0) + 1 })
      toast.success(data?.voteSuccess || "Голос учтён")
    } catch (error) {
      toast.error(data?.voteError || "Ошибка при голосовании")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return
    if (!user) {
      toast.error(data?.loginToComment || "Войдите чтобы комментировать")
      router.push("/login")
      return
    }

    setSubmitting(true)
    try {
      const result = await addComment(id as string, newComment, user.id.toString())
      
      const newCommentObj = {
        id: result.id || Date.now(),
        text: newComment,
        created_at: new Date().toISOString(),
        user_id: user.id,
        author_name: user.name || user.email?.split('@')[0] || "Пользователь",
        user_email: user.email
      }
      
      setComments([newCommentObj, ...comments])
      setNewComment("")
      toast.success(data?.commentAdded || "Комментарий добавлен")
    } catch (error) {
      toast.error(data?.commentError || "Ошибка при добавлении комментария")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAfterPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAfterPhoto(file)
      setAfterPhotoPreview(URL.createObjectURL(file))
    }
  }

  async function handleUploadAfterPhoto() {
    if (!afterPhoto) {
      toast.error(data?.selectPhoto || "Выберите фото")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("photo", afterPhoto)
      const result = await uploadAfterPhoto(id as string, formData)
      const photoUrl = result.photo_url || result.url
      
      setProblem({ ...problem, photo_after: photoUrl })
      setAfterPhotoPreview(`http://localhost:8001${photoUrl}`)
      setAfterPhoto(null)
      
      toast.success(data?.photoUploaded || "Фото 'После' загружено")
      await fetchData()
    } catch (error) {
      console.error("Ошибка:", error)
      toast.error(data?.photoError || "Ошибка при загрузке фото")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12">{data?.loading || "Загрузка..."}</div>
  }

  if (!problem) {
    return <div className="text-center p-12">{data?.problemNotFound || "Проблема не найдена"}</div>
  }

  const StatusIcon = statusConfig[problem.status]?.icon || AlertCircle
  const photosBefore = problem.photo_before?.split(",").filter((p: string) => p) || []
  const hasAfterPhoto = problem.photo_after || afterPhotoPreview

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Link href="/map" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        {data?.backToMap || "Назад к карте"}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3">{problem.title}</h1>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={statusConfig[problem.status]?.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[problem.status]?.label[locale]}
          </Badge>
          <Badge className={priorityConfig[problem.priority]?.color}>
            {priorityConfig[problem.priority]?.label[locale]}
          </Badge>
          <Badge variant="outline">{categoryNames[problem.category]?.[locale] || problem.category}</Badge>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {problem.address || problem.district}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(problem.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}
          </div>
          <button onClick={handleVote} className="flex items-center hover:text-primary transition-colors">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {problem.votesCount || 0} {data?.votes || "голосов"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{data?.beforePhoto || "Фото до ремонта"}</CardTitle>
          </CardHeader>
          <CardContent>
            {photosBefore.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {photosBefore.map((photo: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={`http://localhost:8001${photo}`}
                      alt={`Фото до ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">{data?.noPhoto || "Нет фото"}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{data?.afterPhoto || "Фото после ремонта"}</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAfterPhoto ? (
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={afterPhotoPreview || `http://localhost:8001${problem.photo_after}`}
                  alt="Фото после"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">{data?.noAfterPhoto || "Фото после ремонта пока нет"}</div>
            )}
            
            {isAdmin && problem.status !== "resolved" && (
              <div className="mt-3">
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">{data?.uploadAfterPhoto || "Загрузить фото после ремонта"}</span>
                  <input type="file" accept="image/*" onChange={handleAfterPhotoChange} className="hidden" />
                </label>
                {afterPhoto && (
                  <Button onClick={handleUploadAfterPhoto} className="w-full mt-2" size="sm" disabled={submitting}>
                    {submitting ? (data?.uploading || "Загрузка...") : (data?.savePhoto || "Сохранить фото")}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{data?.description || "Описание проблемы"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{problem.description || (data?.noDescription || "Нет описания")}</p>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{data?.statusManagement || "Управление статусом"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={selectedStatus === key ? "default" : "outline"}
                  className={selectedStatus === key ? config.color : ""}
                  onClick={() => requestStatusChange(key)}
                  disabled={submitting || (key === "resolved" && !problem.photo_after && !afterPhoto)}
                >
                  <config.icon className="w-4 h-4 mr-1" />
                  {config.label[locale]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Диалог подтверждения */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{data?.confirmTitle || "Подтверждение"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data?.confirmMessage || "Вы уверены, что хотите изменить статус"} "{pendingStatus && statusConfig[pendingStatus]?.label[locale]}"?</p>
              <div className="flex gap-3 mt-4">
                <Button onClick={confirmStatusChange} disabled={submitting}>
                  {submitting ? (data?.processing || "Обработка...") : (data?.confirm || "Да, подтверждаю")}
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  {data?.cancel || "Отмена"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{data?.comments || "Комментарии"} ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Textarea
              placeholder={data?.commentPlaceholder || "Напишите комментарий..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="mb-2"
            />
            <Button onClick={handleAddComment} disabled={submitting || !newComment.trim()}>
              {submitting ? (data?.sending || "Отправка...") : (data?.send || "Отправить")}
            </Button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">{data?.noComments || "Пока нет комментариев. Будьте первым!"}</div>
            ) : (
              comments.map((comment: any) => (
                <div key={comment.id} className="border-b pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{comment.author_name?.[0] || comment.user_email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author_name || comment.user_email?.split('@')[0] || (data?.user || "Пользователь")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString(locale === 'kz' ? 'kk-KZ' : 'ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}