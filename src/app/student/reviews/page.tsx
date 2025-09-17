"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { BookingAPI, type Booking } from "@/lib/api/bookings"
import { ReviewAPI, type Review } from "@/lib/api/reviews"
import { TutorAPI, type Tutor } from "@/lib/api/tutors"

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" })
  const [studentBookings, setStudentBookings] = useState<Booking[]>([])
  const [studentReviews, setStudentReviews] = useState<Review[]>([])
  const [tutors, setTutors] = useState<Map<number, Tutor>>(new Map())
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStudent = session?.user

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const fetchInitialData = async () => {
    if (!currentStudent?.id) return
    try {
      setLoading(true)
      setError(null)

      // bookings (completed only for review dropdown)
      const bookingsRes = await BookingAPI.getBookings({
        user_type: 'student',
        user_id: parseInt(currentStudent.id),
        status: 'Completed',
        page: 1,
        per_page: 50,
      })
      const bookings = bookingsRes?.data?.bookings || []
      setStudentBookings(bookings)

      // reviews
      const reviewsRes = await ReviewAPI.getReviews({
        student_id: parseInt(currentStudent.id),
        page: 1,
        per_page: 50,
      })
      const reviews = reviewsRes?.data?.reviews || []
      setStudentReviews(reviews)

      // prefetch tutor info present in bookings or reviews
      const tutorIds = Array.from(new Set([
        ...bookings.map(b => b.tutor_id),
        ...reviews.map(r => r.tutor_id),
      ]))
      const pairs = await Promise.all(tutorIds.map(async (id) => {
        try {
          const tRes = await TutorAPI.getTutorById(id)
          if (tRes.success) return [id, tRes.data.tutor as Tutor] as [number, Tutor]
        } catch (e) {
          console.error('Error fetching tutor', id, e)
        }
        return [id, { id, name: 'Unknown', email: '' } as Tutor] as [number, Tutor]
      }))
      setTutors(new Map(pairs))
    } catch (e: any) {
      setError(e?.message || 'Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentStudent?.id) {
      fetchInitialData()
    }
  }, [currentStudent?.id])

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Đánh giá gia sư</h1>
        <p className="text-muted-foreground">
          Viết đánh giá và xem lại các đánh giá đã gửi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Write Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>Viết đánh giá mới</CardTitle>
            <CardDescription>Đánh giá gia sư sau khi hoàn thành buổi học</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="booking">Chọn booking</Label>
              <Select
                value={reviewForm.bookingId}
                onValueChange={(value) => setReviewForm({ ...reviewForm, bookingId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn buổi học đã hoàn thành" />
                </SelectTrigger>
                <SelectContent>
                  {studentBookings
                    .filter((b) => b.status === "Completed")
                    .map((booking) => {
                      const tutor = tutors.get(booking.tutor_id)
                      const tutorName = tutor?.name || tutor?.email || tutor?.username || 'Unknown'
                      return (
                        <SelectItem key={booking.id} value={String(booking.id)}>
                          {tutorName} - {formatDateTime(booking.start_at)}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Đánh giá (1-5 sao)</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Nhận xét</Label>
              <Textarea
                id="comment"
                placeholder="Chia sẻ trải nghiệm của bạn với gia sư..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
              />
            </div>

            <Button
              className="w-full"
              disabled={submitting || !reviewForm.bookingId}
              onClick={async () => {
                if (!currentStudent?.id) return
                try {
                  setSubmitting(true)
                  setError(null)
                  const booking = studentBookings.find(b => String(b.id) === reviewForm.bookingId)
                  if (!booking) {
                    setError('Không tìm thấy booking hợp lệ')
                    return
                  }
                  const payload = {
                    booking_id: booking.id,
                    student_id: parseInt(currentStudent.id),
                    tutor_id: booking.tutor_id,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment || undefined,
                  }
                  const res = await ReviewAPI.createReview(payload)
                  if (res.success) {
                    // refresh reviews
                    const reviewsRes = await ReviewAPI.getReviews({ student_id: parseInt(currentStudent.id), page: 1, per_page: 50 })
                    setStudentReviews(reviewsRes?.data?.reviews || [])
                    // reset form
                    setReviewForm({ bookingId: "", rating: 5, comment: "" })
                  } else {
                    setError(res.message || 'Gửi đánh giá thất bại')
                  }
                } catch (e: any) {
                  setError(e?.message || 'Gửi đánh giá thất bại')
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </CardContent>
        </Card>

        {/* Previous Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Đánh giá đã viết</CardTitle>
            <CardDescription>Lịch sử các đánh giá bạn đã gửi</CardDescription>
          </CardHeader>
          <CardContent>
            {studentReviews.length > 0 ? (
              <div className="space-y-4">
                  {studentReviews.map((review) => {
                    const tutor = tutors.get(review.tutor_id)
                  return (
                    <div key={review.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{tutor?.name || tutor?.email || tutor?.username || 'Unknown'}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">
                        Đánh giá vào {formatDateTime(review.created_at)}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Bạn chưa viết đánh giá nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
