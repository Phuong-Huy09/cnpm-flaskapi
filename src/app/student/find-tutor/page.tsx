"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import {
  // mockTutors,
} from "@/lib/mock-data"
import { TutorCard } from "@/components/tutor-card"
import { fetchSubjects, type ApiSubject } from "@/lib/api/subjects"
import { TutorAPI } from "@/lib/api/tutors"
import type { Tutor as MockTutor } from "@/lib/mock-data"

export default function FindTutorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [minRate, setMinRate] = useState("")
  const [maxRate, setMaxRate] = useState("")
  const [minRating, setMinRating] = useState("all")
  const [subjects, setSubjects] = useState<ApiSubject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [tutors, setTutors] = useState<MockTutor[]>([])
  const [loadingTutors, setLoadingTutors] = useState(false)
  const [tutorsError, setTutorsError] = useState<string | null>(null)

  // Fetch subjects from API
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true)
        const response = await fetchSubjects({ per_page: 100 })
        setSubjects(response.data.subjects)
      } catch (error) {
        console.error('Failed to fetch subjects:', error)
        // You might want to show a toast notification here
      } finally {
        setLoadingSubjects(false)
      }
    }

    loadSubjects()
  }, [])

  // Fetch tutors from backend when filters change
  useEffect(() => {
    const loadTutors = async () => {
      try {
        setLoadingTutors(true)
        setTutorsError(null)

        const params: Record<string, any> = {
          keyword: searchQuery || undefined,
          page: 1,
          per_page: 24,
        }

        // subject: the backend expects subject_id; frontend selects by name currently
        if (selectedSubject && selectedSubject !== "all") {
          // Try to find subject id from subjects list
          const found = subjects.find((s) => s.name === selectedSubject)
          if (found) params.subject_id = found.id
        }

        if (minRate) params.min_rate = minRate
        if (maxRate) params.max_rate = maxRate
        if (minRating && minRating !== "all") params.min_rating = minRating

        const resp = await TutorAPI.getTutors(params)
        if (resp && resp.success && resp.data && resp.data.tutors) {
          // Map backend tutor items to frontend mock Tutor shape
          const mapped = resp.data.tutors.map((t: any) => ({
            id: String(t.user_id),
            name: t.full_name || "",
            avatar: "/placeholder.svg",
            bio: t.bio || "",
            subjects: t.subjects || [],
            hourlyRate: Number(t.hourly_rate || t.hourlyRate || 0),
            rating: Number(t.rating_avg || t.rating || 0),
            reviewCount: Number(t.rating_count || t.reviewCount || 0),
            yearsExperience: Number(t.years_experience || t.yearsExperience || 0),
            credentials: t.credentials || [],
            availability: t.availability || [],
          })) as MockTutor[]

          setTutors(mapped)
        } else if (resp && resp.data && resp.data.tutors) {
          setTutors(resp.data.tutors)
        } else {
          // Fallback: set empty
          setTutors([])
        }
      } catch (err: any) {
        console.error("Failed to fetch tutors:", err)
        setTutorsError(err?.message || "Failed to fetch tutors")
        setTutors([])
      } finally {
        setLoadingTutors(false)
      }
    }

    loadTutors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedSubject, minRate, maxRate, minRating, subjects])

  // Tutors are fetched from backend via TutorAPI and stored in `tutors` state

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tìm gia sư</h1>
        <p className="text-muted-foreground">
          Tìm kiếm gia sư phù hợp với nhu cầu học tập của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                placeholder="Tên gia sư hoặc môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label>Môn học</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {loadingSubjects ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tải...</span>
                      </div>
                    </SelectItem>
                  ) : (
                    subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minRate">Giá tối thiểu</Label>
              <Input
                id="minRate"
                type="number"
                placeholder="VND/giờ"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxRate">Giá tối đa</Label>
              <Input
                id="maxRate"
                type="number"
                placeholder="VND/giờ"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="minRating">Đánh giá tối thiểu</Label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="4.5">4.5+ sao</SelectItem>
                  <SelectItem value="4.0">4.0+ sao</SelectItem>
                  <SelectItem value="3.5">3.5+ sao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingTutors ? (
          <div className="col-span-full text-center py-8">Đang tải gia sư...</div>
        ) : tutorsError ? (
          <div className="col-span-full text-center py-8 text-destructive">{tutorsError}</div>
        ) : tutors.length > 0 ? (
          tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy gia sư phù hợp với tiêu chí tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  )
}
