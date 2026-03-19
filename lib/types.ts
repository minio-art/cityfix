export type Priority = "critical" | "medium" | "low"
export type Status = "new" | "confirmed" | "in_progress" | "resolved" | "rejected"
export type UserRole = "resident" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  city: string
  avatar?: string
  createdAt: string
  reportsCount: number
  votesCount: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Problem {
  id: string
  title: string
  description: string
  categoryId: string
  latitude: number
  longitude: number
  address: string
  district: string
  priority: Priority
  status: Status
  authorId: string
  photos: string[]
  votesCount: number
  commentsCount: number
  createdAt: string
  updatedAt: string
  clusterId?: string
}

export interface Cluster {
  id: string
  categoryId: string
  latitude: number
  longitude: number
  radius: number
  priority: Priority
  status: Status
  problemIds: string[]
  complaintsCount: number
  district: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  problemId: string
  authorId: string
  text: string
  createdAt: string
}

export interface Vote {
  id: string
  problemId: string
  userId: string
  createdAt: string
}

export interface StatusChange {
  id: string
  problemId: string
  fromStatus: Status
  toStatus: Status
  changedBy: string
  comment?: string
  createdAt: string
}

export interface MapFilters {
  categories: string[]
  districts: string[]
  statuses: Status[]
  priorities: Priority[]
  searchQuery: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// ===== НОВЫЕ ТИПЫ ДЛЯ API =====

export interface ApiCluster {
  id: string
  position: [number, number]
  type: string
  priority: Priority
  count: number
  status: Status
}

export interface ApiIssue {
  id: string
  title: string
  description: string
  category: string
  district: string
  latitude: number
  longitude: number
  address: string
  photo_before: string
  status: Status
  priority: Priority
  user_id: string
  cluster_id: string | null
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  warning?: string
  message?: string
  issue_id?: string
  cluster_id?: string
  ai_suggestion?: {
    category: string
    confidence: number
  }
  duplicates?: Array<{
    id: string
    title: string
    distance: number
  }>
}

export interface CreateProblemData {
  title: string
  description: string
  category: string
  district: string
  latitude: number
  longitude: number
  address: string
  user_id: string
  photos: File[]
}

export interface IssueFilters {
  category?: string
  status?: string
  skip?: number
  limit?: number
}

export interface MapBounds {
  sw: [number, number]
  ne: [number, number]
}