"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, UserCheck, UserX, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { UserManagement } from "@/lib/api/users"

type Role = "student" | "tutor" | "moderator" | "admin"
type Status = "active" | "suspended" | "pending"

const ROLE_LABEL: Record<Role, string> = {
    student: "Học sinh",
    tutor: "Gia sư",
    moderator: "Kiểm duyệt viên",
    admin: "Quản trị viên",
}

const STATUS_BADGE: Record<Status, { variant: "default" | "destructive" | "secondary"; label: string }> = {
    active: { variant: "default", label: "Hoạt động" },
    suspended: { variant: "destructive", label: "Tạm khóa" },
    pending: { variant: "secondary", label: "Chờ duyệt" },
}

function formatDateSafe(d?: Date | string) {
    if (!d) return "-"
    const date = d instanceof Date ? d : new Date(d)
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("vi-VN")
}

function formatVND(amount?: number) {
    if (!amount && amount !== 0) return "-"
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount)
}

interface UserManagementProps {
    users: UserManagement[]
    onUpdateStatus: (userId: string, status: Status) => void
    onViewUser: (userId: string) => void
}

export function UserManagementTable({ users, onUpdateStatus, onViewUser }: UserManagementProps) {
    return (
        <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Người dùng</TableHead>
                            <TableHead className="hidden md:table-cell">Vai trò</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="hidden lg:table-cell">Ngày tham gia</TableHead>
                            <TableHead className="hidden lg:table-cell">Hoạt động cuối</TableHead>
                            <TableHead className="hidden md:table-cell">Thống kê</TableHead>
                            <TableHead className="w-[48px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                    Không tìm thấy người dùng nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const statusCfg = STATUS_BADGE[user.status as Status] ?? { variant: "secondary", label: user.status }
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">
                                                        {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5">
                                                    <div className="font-medium leading-none">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell">
                                            {ROLE_LABEL[(user.role as Role)] ?? user.role}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                                        </TableCell>

                                        <TableCell className="hidden lg:table-cell">
                                            {formatDateSafe(user.joinDate)}
                                        </TableCell>

                                        <TableCell className="hidden lg:table-cell">
                                            {formatDateSafe(user.lastActive)}
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell">
                                            <div className="text-sm leading-5">
                                                {typeof user.totalBookings === "number" && (
                                                    <div>Booking: {user.totalBookings}</div>
                                                )}
                                                {typeof user.totalEarnings === "number" && (
                                                    <div>Thu nhập: {formatVND(user.totalEarnings)}</div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Hành động">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuItem onClick={() => onViewUser(user.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>

                                                    {user.status !== "active" && (
                                                        <DropdownMenuItem onClick={() => onUpdateStatus(user.id, "active")}>
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            Kích hoạt
                                                        </DropdownMenuItem>
                                                    )}

                                                    {user.status !== "suspended" && (
                                                        <DropdownMenuItem onClick={() => onUpdateStatus(user.id, "suspended")}>
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Tạm khóa
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
    )
}
