"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import {
  mockTutors,
  mockBookings,
  mockReviews,
} from "@/lib/mock-data"

export default function ReviewsPage() {
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" })

  // Mock data filters
  const studentBookings = mockBookings.filter((b) => b.studentId === "student1")
  const studentReviews = mockReviews.filter((r) => r.studentId === "student1")

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đánh giá gia sư</h1>
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
                      const tutor = mockTutors.find((t) => t.id === booking.tutorId)
                      return (
                        <SelectItem key={booking.id} value={booking.id}>
                          {tutor?.name} - {booking.subject} - {formatDateTime(booking.startAt)}
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

            <Button className="w-full">Gửi đánh giá</Button>
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
                  const tutor = mockTutors.find((t) => t.id === review.tutorId)
                  return (
                    <div key={review.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{tutor?.name}</p>
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
                        Đánh giá vào {formatDateTime(review.createdAt)}
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
