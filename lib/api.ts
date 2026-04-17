const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

// ========== АУТЕНТИФИКАЦИЯ ==========

let authToken: string | null = null

export function setAuthToken(token: string) {
  authToken = token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export function clearAuthToken() {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
  return fetch(url, { ...options, headers })
}

export async function register(data: {
  email: string
  username: string
  name: string
  phone: string
  password: string
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Registration failed')
  }
  
  const result = await response.json()
  setAuthToken(result.access_token)
  return result
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Login failed')
  }
  
  const result = await response.json()
  setAuthToken(result.access_token)
  return result
}

export async function getCurrentUser() {
  const token = getAuthToken()
  if (!token) return null
  
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) {
    clearAuthToken()
    return null
  }
  
  return response.json()
}

export async function logout() {
  clearAuthToken()
}

// ========== ПРОБЛЕМЫ ==========

export async function createProblem(formData: FormData) {
  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${API_URL}/api/issues`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Ошибка при создании проблемы")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export async function getClusters(bounds?: { sw: [number, number]; ne: [number, number] }) {
  try {
    let url = `${API_URL}/api/clusters`
    
    if (bounds) {
      const { sw, ne } = bounds
      url += `?bounds=${sw[0]},${sw[1]},${ne[0]},${ne[1]}`
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error("Ошибка при получении кластеров")
    }
    
    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    return []
  }
}

export async function getIssues(filters?: {
  category?: string
  status?: string
  skip?: number
  limit?: number
}) {
  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.skip) params.append("skip", filters.skip.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())
    
    const response = await fetch(`${API_URL}/api/issues?${params.toString()}`, { headers })
    
    if (!response.ok) {
      throw new Error("Ошибка при получении проблем")
    }
    
    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    return []
  }
}

export async function getIssue(id: string) {
  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${API_URL}/api/issues/${id}`, { headers })
    
    if (!response.ok) {
      throw new Error("Ошибка при получении проблемы")
    }
    
    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    return null
  }
}

export async function voteIssue(issueId: string, userId: string) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${API_URL}/api/issues/${issueId}/vote`, {
      method: "POST",
      headers,
      body: JSON.stringify({ user_id: userId }),
    })
    
    if (!response.ok) {
      throw new Error("Ошибка при голосовании")
    }
    
    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}