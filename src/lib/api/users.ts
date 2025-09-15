// API service for users management
export interface ApiUser {
  id: number
  email: string
  username: string | null
  status: "active" | "suspended" | "pending"
  role: "student" | "tutor" | "moderator" | "admin" | null
  created_at: string
  updated_at: string
}

export interface UsersApiResponse {
  success: boolean
  message: string
  data: {
    users: ApiUser[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface UserManagement {
  id: string
  name: string
  username: string | null
  email: string
  role: "student" | "tutor" | "moderator" | "admin"
  status: "active" | "suspended" | "pending"
  joinDate: Date
  lastActive: Date
  totalBookings?: number
  totalEarnings?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export async function fetchUsers(params?: {
  keyword?: string
  status?: string
  page?: number
  per_page?: number
}): Promise<UsersApiResponse> {
  const searchParams = new URLSearchParams()
  
  if (params?.keyword) {
    searchParams.append('keyword', params.keyword)
  }
  if (params?.status && params.status !== 'all') {
    searchParams.append('status', params.status)
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString())
  }
  if (params?.per_page) {
    searchParams.append('per_page', params.per_page.toString())
  }

  const url = `${API_BASE_URL}/users/?${searchParams.toString()}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function updateUserStatus(
  userId: string,
  status: "active" | "suspended" | "pending"
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error updating user status:', error)
    return false
  }
}

// Convert API user to UserManagement format
export function convertApiUserToUserManagement(apiUser: ApiUser): UserManagement {
  return {
    id: apiUser.id.toString(),
    name: apiUser.username || apiUser.email.split('@')[0] || 'N/A',
    email: apiUser.email,
    role: apiUser.role || 'student', // Default role, you might want to add role field to API
    status: apiUser.status,
    joinDate: new Date(apiUser.created_at),
    lastActive: new Date(apiUser.updated_at),
  }
}

export async function updateUser(
  userId: string,
  payload: { username?: string; email?: string; role?: string; status?: string }
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const result = await response.json()
    return result.success ?? true
  } catch (err) {
    console.error('Error updating user:', err)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const result = await response.json()
    return result.success ?? true
  } catch (err) {
    console.error('Error deleting user:', err)
    return false
  }
}
