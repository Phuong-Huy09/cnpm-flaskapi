"use client"

import { useState, useEffect } from "react"
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
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  })

  // Assume tutor id comes from session.user.id (adjust if different shape)
  const tutorId = (session?.user as any)?.id || 1 // fallback demo

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await BookingAPI.getBookings({
        user_type: 'tutor',
        user_id: tutorId,
        page: pagination.page,
        per_page: pagination.per_page
      })

      if (response.success) {
        setBookings(response.data.bookings)
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          total_pages: response.data.total_pages
        }))
      } else {
        setError(response.message || 'Không thể tải danh sách buổi dạy')
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải danh sách buổi dạy')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [pagination.page, tutorId])

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "secondary",
      Confirmed: "default",
      Completed: "outline",
      Canceled: "destructive",
      InProgress: "default",
    } as const
    const labels: Record<string,string> = {
      Pending: 'Chờ xác nhận',
      Confirmed: 'Đã xác nhận',
      Completed: 'Hoàn thành',
      Canceled: 'Đã hủy',
      InProgress: 'Đang diễn ra'
    }
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{labels[status] || status}</Badge>
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString("vi-VN")

  const handleAction = async (bookingId: number, action: 'cancel' | 'accept' | 'complete') => {
    try {
      setActionLoading(bookingId)
      if (action === 'cancel') await BookingAPI.cancelBooking(bookingId)
      if (action === 'accept') await BookingAPI.acceptBooking(bookingId)
      if (action === 'complete') await BookingAPI.completeBooking(bookingId)
      await fetchBookings()
    } catch (err) {
      console.error('Booking action error', err)
      setError('Thao tác thất bại')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Quản lý buổi dạy</h1>
          <p className="text-muted-foreground">Danh sách các buổi học từ học sinh</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải danh sách...</p>
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
            <h1 className="text-2xl font-bold mb-2">Quản lý buổi dạy</h1>
            <p className="text-muted-foreground">Theo dõi và xử lý các yêu cầu đặt lịch từ học sinh</p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />Làm mới
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchBookings} variant="outline" size="sm" className="mt-2">Thử lại</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đặt lịch</CardTitle>
          <CardDescription>Tổng cộng: {pagination.total} buổi</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Bắt đầu</TableHead>
                    <TableHead>Kết thúc</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thù lao</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(b => {
                    const studentName = b.student?.full_name || 'Không rõ'
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.id}</TableCell>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{b.subject?.name || '...'}</TableCell>
                        <TableCell>{formatDateTime(b.start_at)}</TableCell>
                        <TableCell>{formatDateTime(b.end_at)}</TableCell>
                        <TableCell>{b.hours}h</TableCell>
                        <TableCell>{getStatusBadge(b.status)}</TableCell>
                        <TableCell>{formatCurrency(b.total_amount)}</TableCell>
                        <TableCell className="space-x-2">
                          {b.status === 'Pending' && (
                            <Button disabled={actionLoading===b.id} onClick={() => handleAction(b.id,'accept')} size="sm">{actionLoading===b.id? <Loader2 className="w-4 h-4 animate-spin" /> : 'Chấp nhận'}</Button>
                          )}
                          {b.status === 'Pending' && (
                            <Button disabled={actionLoading===b.id} onClick={() => handleAction(b.id,'cancel')} variant="destructive" size="sm">Hủy</Button>
                          )}
                          {['Confirmed','InProgress'].includes(b.status) && (
                            <Button disabled={actionLoading===b.id} onClick={() => handleAction(b.id,'complete')} variant="secondary" size="sm">Hoàn thành</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Trang {pagination.page} / {pagination.total_pages}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => setPagination(p => ({...p, page: p.page - 1}))} disabled={pagination.page<=1} variant="outline" size="sm">Trước</Button>
                    <Button onClick={() => setPagination(p => ({...p, page: p.page + 1}))} disabled={pagination.page>=pagination.total_pages} variant="outline" size="sm">Sau</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8"><p className="text-muted-foreground">Chưa có yêu cầu nào</p></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
