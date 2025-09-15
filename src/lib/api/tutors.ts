const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export interface Tutor {
  id: number
  name?: string
  email?: string
  username?: string
  // Add more fields as needed
}

export interface TutorResponse {
  success: boolean
  message: string
  data: {
    tutor: Tutor
  }
}

export class TutorAPI {
  static async getTutorById(id: number): Promise<TutorResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    // Nếu backend trả về data.tutor thì lấy tutor, nếu trả về data là user object thì lấy luôn data
    let tutor: Tutor | undefined = undefined
    if (json.data) {
      if (json.data.tutor) {
        tutor = json.data.tutor
      } else {
        tutor = json.data
      }
    }
    return {
      ...json,
      data: {
        tutor: tutor
      }
    }
  }

  static async getTutors(params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${API_BASE_URL}/tutors`)
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined && params[k] !== null) url.searchParams.append(k, String(params[k]))
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    return response.json()
  }
}
