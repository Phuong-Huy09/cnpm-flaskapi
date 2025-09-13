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
import { SubjectManagementTable } from "@/components/admin/subject-management"
import { SubjectsFilters } from "@/components/admin/subjects-filters"
import { SubjectsPagination } from "@/components/admin/subjects-pagination"
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  convertApiSubjectToSubjectManagement,
  convertSubjectManagementToSubject,
  type SubjectManagement,
  type CreateSubjectRequest,
  type UpdateSubjectRequest,
} from "@/lib/api/subjects"
import type { Subject } from "@/lib/mock-data"

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
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
    level?: string
    page?: number
    per_page?: number
  }>({
    page: 1,
    per_page: 10
  })

  // Load subjects from API
  const loadSubjects = async (params?: {
    keyword?: string
    level?: string
    page?: number
    per_page?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      // Update current filters
      const newFilters = { ...currentFilters, ...params }
      setCurrentFilters(newFilters)
      
      const response = await fetchSubjects(newFilters)
      
      if (response.success) {
        const convertedSubjects = response.data.subjects.map(apiSubject => {
          const subjectManagement = convertApiSubjectToSubjectManagement(apiSubject)
          return convertSubjectManagementToSubject(subjectManagement)
        })
        setSubjects(convertedSubjects)
        setPagination({
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total,
          total_pages: response.data.total_pages
        })
      } else {
        setError(response.message || 'Failed to load subjects')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error loading subjects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects()
  }, [])

  const handleAddSubject = async (subject: Omit<Subject, "id">) => {
    try {
      const createRequest: CreateSubjectRequest = {
        name: subject.name,
        level: subject.level
      }
      
      const response = await createSubject(createRequest)
      
      if (response.success) {
        // Reload subjects to get updated data
        await loadSubjects({
          page: pagination.page,
          per_page: pagination.per_page,
          keyword: currentFilters.keyword,
          level: currentFilters.level
        })
        console.log(`Subject ${response.data.name} added successfully`)
      } else {
        setError(response.message || 'Failed to add subject')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding subject')
      console.error("Error adding subject:", err)
    }
  }

  const handleUpdateSubject = async (id: string, subject: Omit<Subject, "id">) => {
    try {
      const updateRequest: UpdateSubjectRequest = {
        name: subject.name,
        level: subject.level
      }
      
      const response = await updateSubject(id, updateRequest)
      
      if (response.success) {
        // Reload subjects to get updated data
        await loadSubjects({
          page: pagination.page,
          per_page: pagination.per_page,
          keyword: currentFilters.keyword,
          level: currentFilters.level
        })
        console.log(`Subject ${id} updated successfully`)
      } else {
        setError(response.message || 'Failed to update subject')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating subject')
      console.error("Error updating subject:", err)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    try {
      const success = await deleteSubject(id)
      
      if (success) {
        // Reload subjects to get updated data
        await loadSubjects({
          page: pagination.page,
          per_page: pagination.per_page,
          keyword: currentFilters.keyword,
          level: currentFilters.level
        })
        console.log(`Subject ${id} deleted successfully`)
      } else {
        setError('Failed to delete subject')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting subject')
      console.error("Error deleting subject:", err)
    }
  }

  const handleSearch = (filters: {
    keyword?: string
    level?: string
    page?: number
    per_page?: number
  }) => {
    loadSubjects(filters)
  }

  const handlePageChange = (page: number) => {
    loadSubjects({
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
              <BreadcrumbPage>Môn học</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold tracking-tight">
          Quản lý môn học
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Search and Filters */}
        <SubjectsFilters onSearch={handleSearch} isLoading={loading} />
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-200">
            <p className="text-sm font-medium">Lỗi: {error}</p>
          </div>
        )}
        
        <SubjectManagementTable
          subjects={subjects}
          onAddSubject={handleAddSubject}
          onUpdateSubject={handleUpdateSubject}
          onDeleteSubject={handleDeleteSubject}
        />
        
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>
          </div>
        )}

        {/* Pagination */}
        {!loading && subjects.length > 0 && (
          <SubjectsPagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            total={pagination.total}
            perPage={pagination.per_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  )
}
