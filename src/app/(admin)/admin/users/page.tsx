"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UserManagementTable } from "@/components/admin/user-management"
import { UsersFilters } from "@/components/admin/users-filters"
import { UsersPagination } from "@/components/admin/users-pagination"
import {
  fetchUsers,
  updateUserStatus,
  updateUser,
  convertApiUserToUserManagement,
  deleteUser,
  type UserManagement,
} from "@/lib/api/users"
import UserEditModal from "@/components/admin/user-edit"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  })
  const [currentFilters, setCurrentFilters] = useState<{
    keyword?: string
    status?: string
    page?: number
    per_page?: number
  }>({
    page: 1,
    per_page: 10
  })

  // Load users from API
  const loadUsers = async (params?: {
    keyword?: string
    status?: string
    page?: number
    per_page?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      // Update current filters
      const newFilters = { ...currentFilters, ...params }
      setCurrentFilters(newFilters)
      
      const response = await fetchUsers(newFilters)
      
      if (response.success) {
        const convertedUsers = response.data.users.map(convertApiUserToUserManagement)
        setUsers(convertedUsers)
        setPagination({
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total,
          total_pages: response.data.total_pages
        })
      } else {
        setError(response.message || 'Failed to load users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const handleUpdateUserStatus = async (
    userId: string,
    status: "active" | "suspended" | "pending"
  ) => {
    try {
      const success = await updateUserStatus(userId, status)
      if (success) {
        // Reload users to get updated data
        await loadUsers({
          page: pagination.page,
          per_page: pagination.per_page,
          keyword: currentFilters.keyword,
          status: currentFilters.status
        })
        console.log(`User ${userId} status updated to ${status}`)
      } else {
        setError('Failed to update user status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status')
      console.error('Error updating user status:', err)
    }
  }

  const handleViewUser = (userId: string) => {
    // Open edit modal for the user
    const u = users.find((x) => x.id === userId)
    if (u) {
      setEditingUser(u)
      setIsEditOpen(true)
    }
  }

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null)

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setEditingUser(null)
  }

  const handleSaveUser = async (payload: { id: string; name?: string; email?: string }) => {
    try {
      const ok = await updateUser(payload.id, { name: payload.name, email: payload.email })
      if (ok) {
        await loadUsers({ page: pagination.page, per_page: pagination.per_page, keyword: currentFilters.keyword, status: currentFilters.status })
      }
      return ok
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const ok = await deleteUser(userId)
    if (ok) {
      await loadUsers({ page: pagination.page, per_page: pagination.per_page })
    } else {
      setError('Không thể xóa người dùng')
    }
  }

  const handleSearch = (filters: {
    keyword?: string
    status?: string
    page?: number
    per_page?: number
  }) => {
    loadUsers(filters)
  }

  const handlePageChange = (page: number) => {
    loadUsers({
      ...currentFilters,
      page
    })
  }

  return (
    <>
      {/* Breadcrumb + Page Title */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Người dùng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold tracking-tight">
          Quản lý người dùng
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Search and Filters */}
        <UsersFilters onSearch={handleSearch} isLoading={loading} />
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-200">
            <p className="text-sm font-medium">Lỗi: {error}</p>
          </div>
        )}
        
        <UserManagementTable
          users={users}
          onUpdateStatus={handleUpdateUserStatus}
          onEditUser={(id) => handleViewUser(id)}
          onDeleteUser={(id) => handleDeleteUser(id)}
        />
        
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <UsersPagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            total={pagination.total}
            perPage={pagination.per_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
  <UserEditModal open={isEditOpen} onClose={handleCloseEdit} user={editingUser ?? undefined} onSave={handleSaveUser} />
    </>
  )
}
