"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, RefreshCw } from "lucide-react"
import { BookingAPI, type Booking } from "@/lib/api/bookings"

export default function BookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })

  const currentStudent = session?.user
  const didFetch = useRef(false)

  const fetchBookings = async () => {
    if (!currentStudent?.id) return
    try {
      setLoading(true)
      setError(null)

      const response = await BookingAPI.getBookings({
        user_type: "student",
        user_id: parseInt(currentStudent.id),
        page: pagination.page,
        per_page: pagination.per_page,
      })

      if (response.success) {
        setBookings(response.data.bookings)
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
          total_pages: response.data.total_pages,
        }))

       
      } else {
        setError(response.message || "Failed to fetch bookings")
      }
    } catch (err) {
      setError("An error occurred while fetching bookings")
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!currentStudent?.id) return
    if (didFetch.current) return
    didFetch.current = true
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, currentStudent?.id])

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await BookingAPI.cancelBooking(bookingId)
      if (response.success) {
        fetchBookings()
      } else {
        setError(response.message || "Failed to cancel booking")
      }
    } catch (err) {
      setError("An error occurred while canceling booking")
      console.error("Error canceling booking:", err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Quản lý booking</h1>
          <p className="text-muted-foreground">
            Danh sách các buổi học đã đặt và trạng thái của chúng
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải danh sách booking...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý booking</h1>
            <p className="text-muted-foreground">
              Danh sách các buổi học đã đặt và trạng thái của chúng
            </p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchBookings} variant="outline" size="sm" className="mt-2">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử booking</CardTitle>
          <CardDescription>
            Tổng cộng: {pagination.total} booking{pagination.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Gia sư</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Thời gian bắt đầu</TableHead>
                    <TableHead>Thời gian kết thúc</TableHead>
                    <TableHead>Số giờ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.tutor?.full_name || "Loading..."}</TableCell>
                        <TableCell>{booking.subject?.name || "Loading..."}</TableCell>
                        <TableCell>{formatDateTime(booking.start_at)}</TableCell>
                        <TableCell>{formatDateTime(booking.end_at)}</TableCell>
                        <TableCell>{booking.hours}h</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{formatCurrency(booking.total_amount)}</TableCell>
                        <TableCell>
                          {booking.status === "Pending" && (
                            <Button
                              onClick={() => handleCancelBooking(booking.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Hủy
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {pagination.page} / {pagination.total_pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                      disabled={pagination.page <= 1}
                      variant="outline"
                      size="sm"
                    >
                      Trước
                    </Button>
                    <Button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                      disabled={pagination.page >= pagination.total_pages}
                      variant="outline"
                      size="sm"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Bạn chưa có booking nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
