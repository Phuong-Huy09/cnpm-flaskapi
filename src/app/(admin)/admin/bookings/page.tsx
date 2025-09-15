"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { BookingAPI, type Booking } from "@/lib/api/bookings"

export default function AdminBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0 })

  const [currentFilters, setCurrentFilters] = useState<{ keyword?: string; page?: number; per_page?: number }>({ page: 1, per_page: 10 })

  const fetchBookings = async (params?: { keyword?: string; page?: number; per_page?: number }) => {
    try {
      setLoading(true)
      setError(null)

      const newFilters = { ...currentFilters, ...params }
      setCurrentFilters(newFilters)

      const response = await BookingAPI.getBookings({ page: newFilters.page, per_page: newFilters.per_page })

      if (response && response.success && response.data && Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings)
        setPagination({ page: response.data.page ?? 1, per_page: response.data.per_page ?? 10, total: response.data.total ?? 0 })
      } else {
        setError(response.message || 'Failed to fetch bookings')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await BookingAPI.cancelBooking(bookingId)
      if (response && response.success) {
        toast.success('Hủy booking thành công')
        fetchBookings({ page: pagination.page })
      } else {
        toast.error(response.message || 'Không thể hủy booking')
      }
    } catch (err) {
      toast.error('Lỗi khi hủy booking')
      console.error('Error canceling booking:', err)
    }
  }

  const handlePageChange = (page: number) => {
    fetchBookings({ ...currentFilters, page })
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bookings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold tracking-tight">Quản lý booking</h1>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div />
          <Button variant="outline" size="sm" onClick={() => fetchBookings()}>Refresh</Button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-200">
            <p className="text-sm font-medium">Lỗi: {error}</p>
          </div>
        )}

        <Card>
          <CardTitle>Lịch sử booking</CardTitle>
          <div className="p-4">
            {loading && <p className="text-muted-foreground">Đang tải danh sách booking...</p>}

            {!loading && bookings.length === 0 && <p className="text-muted-foreground">Không có booking nào</p>}

            {!loading && bookings.length > 0 && (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{b.subject ?? 'Subject'}</div>
                      <div className="text-sm text-muted-foreground">{b.tutor_name ?? b.tutor_id}</div>
                      <div className="text-sm">{b.start_at}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{b.status}</div>
                      {b.status !== 'cancelled' && (
                        <Button size="sm" variant="destructive" onClick={() => handleCancelBooking(Number(b.id))}>Hủy</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Pagination simple controls */}
        {!loading && pagination.total > pagination.per_page && (
          <div className="flex justify-end items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}>Prev</Button>
            <div>Trang {pagination.page} / {Math.ceil(pagination.total / pagination.per_page)}</div>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </>
  )
}
