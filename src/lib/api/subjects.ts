// API service for subjects management
export interface ApiSubject {
  id: number
  name: string
  level: "K12" | "Undergrad" | "Graduate" | "Other"
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  name: string
  level?: string
  code?: string
}

export interface SubjectsApiResponse {
  success: boolean
  message: string
  data: {
    subjects: ApiSubject[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface SubjectApiResponse {
  success: boolean
  message: string
  data: {
    subject: ApiSubject
  }
}

export interface SubjectManagement {
  id: string
  name: string
  level: "K12" | "Undergrad" | "Graduate" | "Other"
  createdAt: Date
  updatedAt: Date
  studentsCount?: number
  tutorsCount?: number
}

export interface CreateSubjectRequest {
  name: string
  level: "K12" | "Undergrad" | "Graduate" | "Other"
}

export interface UpdateSubjectRequest {
  name?: string
  level?: "K12" | "Undergrad" | "Graduate" | "Other"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export async function fetchSubjects(params?: {
  keyword?: string
  level?: string
  page?: number
  per_page?: number
}): Promise<SubjectsApiResponse> {
  const searchParams = new URLSearchParams()
  
  if (params?.keyword) {
    searchParams.append('keyword', params.keyword)
  }
  if (params?.level && params.level !== 'all') {
    searchParams.append('level', params.level)
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString())
  }
  if (params?.per_page) {
    searchParams.append('per_page', params.per_page.toString())
  }

  const url = `${API_BASE_URL}/subjects/?${searchParams.toString()}`
  
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

export async function fetchSubject(subjectId: string): Promise<SubjectApiResponse> {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
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

export async function createSubject(subjectData: CreateSubjectRequest): Promise<SubjectApiResponse> {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subjectData),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function updateSubject(
  subjectId: string,
  subjectData: UpdateSubjectRequest
): Promise<SubjectApiResponse> {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subjectData),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function deleteSubject(subjectId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error deleting subject:', error)
    return false
  }
}

export async function fetchSubjectsByLevel(level: string): Promise<SubjectsApiResponse> {
  const response = await fetch(`${API_BASE_URL}/subjects/level/${level}`, {
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

export async function searchSubjects(name: string): Promise<SubjectsApiResponse> {
  const searchParams = new URLSearchParams()
  searchParams.append('name', name)
  
  const response = await fetch(`${API_BASE_URL}/subjects/search?${searchParams.toString()}`, {
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

export async function fetchSubjectStatistics(): Promise<{
  success: boolean
  message: string
  data: {
    total_subjects: number
    by_level: Record<string, number>
  }
}> {
  const response = await fetch(`${API_BASE_URL}/subjects/stats`, {
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

// Convert API subject to SubjectManagement format
export function convertApiSubjectToSubjectManagement(apiSubject: ApiSubject): SubjectManagement {
  return {
    id: apiSubject.id.toString(),
    name: apiSubject.name,
    level: apiSubject.level,
    createdAt: new Date(apiSubject.created_at),
    updatedAt: new Date(apiSubject.updated_at),
  }
}

// Convert SubjectManagement to Subject (mock data format) for backward compatibility
export function convertSubjectManagementToSubject(subjectManagement: SubjectManagement): {
  id: string
  name: string
  level: "K12" | "Undergrad" | "Graduate" | "Other"
} {
  return {
    id: subjectManagement.id,
    name: subjectManagement.name,
    level: subjectManagement.level,
  }
}

// SubjectAPI class for consistent API interface
export class SubjectAPI {
  static async getSubjectById(id: number): Promise<SubjectApiResponse> {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    // Nếu backend trả về data.subject thì lấy subject, nếu trả về data là object subject thì lấy luôn data
    let subject: Subject | undefined = undefined
    if (json.data) {
      if (json.data.subject) {
        subject = json.data.subject
      } else {
        subject = json.data
      }
    }
    return {
      ...json,
      data: {
        subject: subject
      }
    }
  }

  static async getSubjects(params?: {
    keyword?: string
    level?: string
    page?: number
    per_page?: number
  }): Promise<SubjectsApiResponse> {
    return fetchSubjects(params)
  }
}
