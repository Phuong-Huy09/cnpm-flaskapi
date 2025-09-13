// Authentication utilities and types
export type UserRole = "guest" | "student" | "tutor" | "moderator" | "admin"

export interface User {
  id: string
  email: string
  username?: string
  role: UserRole
  status: string
  avatar?: string
  createdAt: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem("access_token", token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("user")
}

// API client with auth headers
const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
}

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      const { access_token, user: rawUser } = data.data
      
      // Map API response to frontend User interface
      const user: User = {
        id: rawUser.id?.toString() || '',
        email: rawUser.email || '',
        username: rawUser.username || '',
        role: (rawUser.role?.toLowerCase() || 'student') as UserRole,
        status: rawUser.status || '',
        avatar: rawUser.avatar,
        createdAt: rawUser.created_at || rawUser.createdAt || '',
        updatedAt: rawUser.updated_at || rawUser.updatedAt
      }
      
      setAuthToken(access_token)
      localStorage.setItem("user", JSON.stringify(user))
      return user
    }
    
    throw new Error(data.message || 'Login failed')
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export const logout = () => {
  removeAuthToken()
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === "undefined") return null
  
  const token = getAuthToken()
  console.log('getCurrentUser - token:', token ? 'exists' : 'not found')
  
  if (!token) return null

  try {
    console.log('getCurrentUser - calling API /auth/me...')
    const response = await apiClient('/auth/me')
    const data = await response.json()
    
    console.log('getCurrentUser - API response:', { status: response.status, success: data.success })

    if (response.ok && data.success) {
      const rawUser = data.data.user
      console.log('getCurrentUser - raw user data from API:', rawUser)
      
      // Map API response to frontend User interface
      const user: User = {
        id: rawUser.id?.toString() || '',
        email: rawUser.email || '',
        username: rawUser.username || '',
        role: (rawUser.role?.toLowerCase() || 'student') as UserRole,
        status: rawUser.status || '',
        avatar: rawUser.avatar,
        createdAt: rawUser.created_at || rawUser.createdAt || '',
        updatedAt: rawUser.updated_at || rawUser.updatedAt
      }
      
      console.log('getCurrentUser - mapped user data:', user)
      localStorage.setItem("user", JSON.stringify(user))
      return user
    } else {
      console.log('getCurrentUser - API failed:', data)
      // Token might be invalid, remove it
      removeAuthToken()
      return null
    }
  } catch (error) {
    console.error('Get current user error:', error)
    removeAuthToken()
    return null
  }
}

// Get user from localStorage (for initial load)
export const getCachedUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}
