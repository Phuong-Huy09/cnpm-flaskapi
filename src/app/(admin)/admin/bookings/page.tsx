"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubjectsPagination as Pagination } from "@/components/admin/subjects-pagination"
import { BookingAPI, type Booking } from "@/lib/api/bookings"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type UserType = "student" | "tutor"

const STATUS_COLORS: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
	Pending: { variant: "outline", label: "Chờ xác nhận" },
	Confirmed: { variant: "secondary", label: "Đã xác nhận" },
	InProgress: { variant: "default", label: "Đang diễn ra" },
	Completed: { variant: "secondary", label: "Hoàn thành" },
	Canceled: { variant: "outline", label: "Đã hủy" },
	Refunded: { variant: "outline", label: "Hoàn tiền" },
}

export default function AdminBookingsPage() {
	const router = useRouter()
	const [items, setItems] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, total_pages: 0 })
	const [filters, setFilters] = useState<{ user_type: UserType; user_id?: number; status?: string; page?: number; per_page?: number }>({
		user_type: "student",
		page: 1,
		per_page: 10,
	})

		// Edit Modal state
		const [isEditOpen, setIsEditOpen] = useState(false)
		const [editing, setEditing] = useState<Booking | null>(null)
		const [editForm, setEditForm] = useState<{ start_at: string; end_at: string; status: string }>({
			start_at: "",
			end_at: "",
			status: "Pending",
		})

	const loadBookings = async (params?: Partial<typeof filters>) => {
		try {
			setLoading(true)
			setError(null)
			const next = { ...filters, ...params }
			setFilters(next)
			const res = await BookingAPI.getBookings(next)
			if (res.success) {
				setItems(res.data.bookings)
				setPagination({ page: res.data.page, per_page: res.data.per_page, total: res.data.total, total_pages: res.data.total_pages })
			} else {
				setError(res.message || "Không thể tải danh sách booking")
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Đã xảy ra lỗi")
			// eslint-disable-next-line no-console
			console.error("Error loading bookings:", e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadBookings()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onPageChange = (page: number) => {
		loadBookings({ page })
	}

	const statusBadge = (status: string) => {
		const meta = STATUS_COLORS[status] || { variant: "outline" as const, label: status }
		return <Badge variant={meta.variant}>{meta.label}</Badge>
	}

		// Helpers for datetime-local values
		const toLocalInputValue = (iso: string | undefined) => {
			if (!iso) return ""
			const d = new Date(iso)
			// format YYYY-MM-DDTHH:mm for input[type=datetime-local]
			const pad = (n: number) => String(n).padStart(2, "0")
			const yyyy = d.getFullYear()
			const mm = pad(d.getMonth() + 1)
			const dd = pad(d.getDate())
			const hh = pad(d.getHours())
			const min = pad(d.getMinutes())
			return `${yyyy}-${mm}-${dd}T${hh}:${min}`
		}

		const openEdit = (b: Booking) => {
			setEditing(b)
			setEditForm({
				start_at: toLocalInputValue(b.start_at),
				end_at: toLocalInputValue(b.end_at),
				status: b.status,
			})
			setIsEditOpen(true)
		}

  const saveEdit = async () => {
    if (!editing) return
    try {
      setLoading(true)
      setError(null)

      const payload: any = {
        start_at: editForm.start_at ? new Date(editForm.start_at).toISOString() : undefined,
        end_at: editForm.end_at ? new Date(editForm.end_at).toISOString() : undefined,
        status: editForm.status || undefined,
      }

      await BookingAPI.updateBooking(editing.id, payload as any)

      setIsEditOpen(false)
      setEditing(null)

      // reload list preserving filters & page
      await loadBookings({})

      // 👉 bật toastr thành công
      toast.success("Cập nhật booking thành công!")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật thất bại")
      toast.error("Cập nhật thất bại!") // cũng có thể hiện toastr fail luôn
    } finally {
      setLoading(false)
    }
  }
  
	return (
		<>
			{/* Breadcrumb + Title */}
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
				<h1 className="text-lg font-semibold tracking-tight">Quản lý đặt lịch</h1>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col gap-4 p-4">
				{/* Filters */}
     
				    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="space-y-2">
						<Label>Loại người dùng</Label>
						<Select
							value={filters.user_type}
							onValueChange={(val: UserType) => loadBookings({ user_type: val, page: 1 })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn loại" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="student">Học sinh</SelectItem>
								<SelectItem value="tutor">Gia sư</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>ID người dùng</Label>
						<Input
							type="number"
							placeholder="Nhập ID..."
							value={filters.user_id ?? ""}
							onChange={(e) => loadBookings({ user_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
						/>
					</div>

					<div className="space-y-2">
						<Label>Trạng thái</Label>
						<Select
							value={filters.status ?? ""}
							onValueChange={(val: string) => loadBookings({ status: val || undefined, page: 1 })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Tất cả" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value=" ">Tất cả</SelectItem>
								<SelectItem value="Pending">Chờ xác nhận</SelectItem>
								<SelectItem value="Confirmed">Đã xác nhận</SelectItem>
								<SelectItem value="InProgress">Đang diễn ra</SelectItem>
								<SelectItem value="Completed">Hoàn thành</SelectItem>
								<SelectItem value="Canceled">Đã hủy</SelectItem>
								<SelectItem value="Refunded">Hoàn tiền</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
        </div>        </div>


				{error && (
					<div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-200">
						<p className="text-sm font-medium">Lỗi: {error}</p>
					</div>
				)}

				{/* Table */}
				<div className="border rounded-md overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Học sinh</TableHead>
								<TableHead>Gia sư</TableHead>
								<TableHead>Môn học</TableHead>
								<TableHead>Thời gian</TableHead>
								<TableHead>Số giờ</TableHead>
								<TableHead>Số tiền</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead className="text-right">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
										{loading ? "Đang tải..." : "Không có booking nào"}
									</TableCell>
								</TableRow>
							) : (
								items.map((b) => (
									<TableRow key={b.id}>
										<TableCell className="font-medium">{b.id}</TableCell>
										<TableCell className="font-medium">
											{b.student?.full_name ?? b.student_id}
										</TableCell>
										<TableCell>{b.tutor?.full_name ?? b.tutor_id}</TableCell>
										<TableCell>{b.subject?.name ?? b.subject_id}</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span>{new Date(b.start_at).toLocaleString()}</span>
												<span className="text-xs text-muted-foreground">→ {new Date(b.end_at).toLocaleString()}</span>
											</div>
										</TableCell>
										<TableCell>{b.hours}</TableCell>
										<TableCell>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(b.total_amount)}</TableCell>
										<TableCell>{statusBadge(b.status)}</TableCell>
														<TableCell className="text-right">
															<Button size="sm" variant="outline" onClick={() => openEdit(b)}>Chỉnh sửa</Button>
														</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				{!loading && items.length > 0 && (
					<Pagination
						currentPage={pagination.page}
						totalPages={pagination.total_pages}
						total={pagination.total}
						perPage={pagination.per_page}
						onPageChange={onPageChange}
					/>
				)}
			</div>

					{/* Edit Dialog */}
					<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Chỉnh sửa booking #{editing?.id}</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Thời gian bắt đầu</Label>
										<Input
											type="datetime-local"
											value={editForm.start_at}
											onChange={(e) => setEditForm((f) => ({ ...f, start_at: e.target.value }))}
										/>
									</div>
									<div className="space-y-2">
										<Label>Thời gian kết thúc</Label>
										<Input
											type="datetime-local"
											value={editForm.end_at}
											onChange={(e) => setEditForm((f) => ({ ...f, end_at: e.target.value }))}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Trạng thái</Label>
									<Select value={editForm.status} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Pending">Chờ xác nhận</SelectItem>
											<SelectItem value="Confirmed">Đã xác nhận</SelectItem>
											<SelectItem value="InProgress">Đang diễn ra</SelectItem>
											<SelectItem value="Completed">Hoàn thành</SelectItem>
											<SelectItem value="Canceled">Đã hủy</SelectItem>
											<SelectItem value="Refunded">Hoàn tiền</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex justify-end gap-2">
									<Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
									<Button onClick={saveEdit} disabled={loading}>Lưu</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
		</>
	)
}
