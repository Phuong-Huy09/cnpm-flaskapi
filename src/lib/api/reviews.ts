const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export interface Review {
  id: number
  booking_id: number
  student_id: number
  tutor_id: number
  rating: number
  comment?: string | null
  created_at: string
  updated_at: string
}

export interface ReviewListResponse {
  success: boolean
  message: string
  data: {
    reviews: Review[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export class ReviewAPI {
  static async getReviews(params: {
    student_id?: number
    tutor_id?: number
    booking_id?: number
    page?: number
    per_page?: number
  } = {}): Promise<ReviewListResponse> {
    const searchParams = new URLSearchParams()
    if (params.student_id) searchParams.append('student_id', params.student_id.toString())
    if (params.tutor_id) searchParams.append('tutor_id', params.tutor_id.toString())
    if (params.booking_id) searchParams.append('booking_id', params.booking_id.toString())
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())

    const response = await fetch(`${API_BASE_URL}/reviews/?${searchParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async createReview(data: {
    booking_id: number
    student_id: number
    tutor_id: number
    rating: number
    comment?: string
  }): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}
