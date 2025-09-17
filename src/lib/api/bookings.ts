const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export interface StudentProfileLite {
  id: number
  full_name: string
  dob?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TutorProfileLite {
  id: number
  full_name: string
  bio?: string | null
  years_experience?: number | null
  hourly_rate?: number | null
  verification_status?: string | null
  rating_avg?: number | null
  rating_count?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Booking {
  id: number
  student_id: number
  tutor_id: number
  service_id: number
  subject_id: number
  start_at: string
  end_at: string
  hours: number
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  student?: StudentProfileLite | null
  tutor?: TutorProfileLite | null
  subject?: { id: number; name: string } | null
}

export interface BookingListResponse {
  success: boolean
  message: string
  data: {
    bookings: Booking[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface BookingDetailsResponse {
  success: boolean
  message: string
  data: {
    booking: Booking
  }
}

export interface CreateBookingRequest {
  tutor_id: number
  service_id: number
  subject_id: number
  start_at: string
  end_at: string
}

export class BookingAPI {
  static async getBookings(params: {
    user_type?: 'student' | 'tutor'
    user_id?: number
    status?: string
    page?: number
    per_page?: number
  } = {}): Promise<BookingListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.user_type) searchParams.append('user_type', params.user_type)
    if (params.user_id) searchParams.append('user_id', params.user_id.toString())
    if (params.status) searchParams.append('status', params.status)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())

    const response = await fetch(`${API_BASE_URL}/bookings/?${searchParams}`, {
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

  static async getBookingById(id: number): Promise<BookingDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
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

  static async createBooking(data: CreateBookingRequest, studentId: number): Promise<BookingDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  ...data, student_id: studentId }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async updateBooking(id: number, data: Partial<CreateBookingRequest>): Promise<BookingDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async cancelBooking(id: number): Promise<BookingDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async completeBooking(id: number): Promise<BookingDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async deleteBooking(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}
