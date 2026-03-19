const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function createProblem(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/issues`, {
      method: "POST",
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
  try {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.skip) params.append("skip", filters.skip.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())
    
    const response = await fetch(`${API_URL}/api/issues?${params.toString()}`)
    
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
  try {
    const response = await fetch(`${API_URL}/api/issues/${id}`)
    
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
  try {
    const response = await fetch(`${API_URL}/api/issues/${issueId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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