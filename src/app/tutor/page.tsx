"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2 } from "lucide-react"
import { BookingAPI, type Booking } from "@/lib/api/bookings"
import { TutorAPI, type Tutor } from "@/lib/api/tutors"
import { SubjectAPI, type Subject } from "@/lib/api/subjects"
import {
  mockTutors,
  mockReviews,
} from "@/lib/mock-data"

export default function StudentProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [tutors, setTutors] = useState<Map<number, Tutor>>(new Map())
  const [subjects, setSubjects] = useState<Map<number, Subject>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalBookings, setTotalBookings] = useState(0)
  const [hasFetched, setHasFetched] = useState(false)

  const currentStudent = session?.user

  // Mock data for reviews (since we don't have reviews API yet)
  const studentReviews = mockReviews.filter((r) => r.studentId === "student1")

  const fetchRecentBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      // Get actual student ID from session
      if (!currentStudent?.id) {
        setError('Không thể lấy thông tin student từ session')
        setLoading(false)
        return
      }

      const response = await BookingAPI.getBookings({
        user_type: 'student',
        user_id: parseInt(currentStudent.id),
        page: 1,
        per_page: 5 // Only get 5 recent bookings
      })

      console.log('BookingAPI.getBookings response:', response)

      if (response.success && response.data && Array.isArray(response.data.bookings)) {
        if (response.data.bookings.length === 0) {
          console.warn('No recent bookings found for this student.')
        }
        setRecentBookings(response.data.bookings)
        setTotalBookings(response.data.total)

        // Fetch tutor and subject details for these bookings
        const tutorIds = [...new Set(response.data.bookings.map(b => b.tutor_id))]
        const subjectIds = [...new Set(response.data.bookings.map(b => b.subject_id))]

        // Fetch tutors
        const tutorPromises = tutorIds.map(async (id) => {
          try {
            const tutorResponse = await TutorAPI.getTutorById(id)
            if (tutorResponse.success) {
              return [id, tutorResponse.data.tutor] as [number, Tutor]
            }
          } catch (error) {
            console.error(`Error fetching tutor ${id}:`, error)
          }
          return [id, { id, name: 'Unknown', email: '' }] as [number, Tutor]
        })

        // Fetch subjects
        const subjectPromises = subjectIds.map(async (id) => {
          try {
            const subjectResponse = await SubjectAPI.getSubjectById(id)
            if (subjectResponse.success) {
              return [id, subjectResponse.data.subject] as [number, Subject]
            }
          } catch (error) {
            console.error(`Error fetching subject ${id}:`, error)
          }
          return [id, { id, name: 'Unknown' }] as [number, Subject]
        })

        const [tutorResults, subjectResults] = await Promise.all([
          Promise.all(tutorPromises),
          Promise.all(subjectPromises)
        ])

        setTutors(new Map(tutorResults))
        setSubjects(new Map(subjectResults))
        setHasFetched(true)
      } else {
        setError(
          response.message ||
          'Failed to fetch bookings or response format invalid. Debug: ' + JSON.stringify(response)
        )
        console.error('BookingAPI.getBookings unexpected response:', response)
      }
    } catch (err) {
      setError('An error occurred while fetching bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentStudent?.id && !hasFetched) {
      fetchRecentBookings()
    } else if (!currentStudent?.id) {
      setLoading(false)
    }
  }, [currentStudent?.id, hasFetched])

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "secondary",
      Confirmed: "default",
      Completed: "outline",
      Canceled: "destructive",
      InProgress: "default",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Bảng tổng quan</h1>
        <p className="text-muted-foreground">
          Chào mừng {currentStudent?.name || currentStudent?.email}! Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStudent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Họ và tên</Label>
                <p className="text-lg font-medium">{currentStudent.name || "Chưa cập nhật"}</p>
              </div>
              <div>
                <Label>ID</Label>
                <p className="text-lg">{currentStudent.id}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-lg">{currentStudent.email}</p>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Badge variant="outline">Đang hoạt động</Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không thể tải thông tin người dùng</p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Thử lại
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
