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
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookingAPI } from "@/lib/api/bookings"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function FindTutorPage() {
  const router = useRouter()
  const { data: session } = useSession()
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

  // Quick book dialog state
  const [quickBookOpen, setQuickBookOpen] = useState(false)
  const [bookingTutor, setBookingTutor] = useState<MockTutor | null>(null)
  const [bookingSubjectId, setBookingSubjectId] = useState<string>("")
  const [bookingStart, setBookingStart] = useState<string>("")
  const [bookingEnd, setBookingEnd] = useState<string>("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingServiceId, setBookingServiceId] = useState<number | null>(1)
  const [bookingError, setBookingError] = useState<string | null>(null)

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
            subjects: Array.isArray(t.subjects)
              ? t.subjects.map((s: any) =>
                  typeof s === "string"
                    ? s
                    : s?.name || s?.subject_name || s?.title || ""
                ).filter((s: string) => s && s.length > 0)
              : [],
            hourlyRate: Number(t.hourly_rate || t.hourlyRate || 0),
            rating: Number(t.rating_avg || t.rating || 0),
            reviewCount: Number(t.rating_count || t.reviewCount || 0),
            yearsExperience: Number(t.years_experience || t.yearsExperience || 0),
            credentials: t.credentials || [],
            availability: t.availability || [],
          })) as MockTutor[]

          setTutors(mapped)

          // Enrich subjects for tutors missing them by calling per-tutor subjects API
          const tutorsNeedingSubjects = mapped.filter((t) => !t.subjects || t.subjects.length === 0)
          if (tutorsNeedingSubjects.length > 0) {
            try {
              const results = await Promise.all(
                tutorsNeedingSubjects.map(async (t) => {
                  try {
                    const subResp = await TutorAPI.getTutorSubjects(Number(t.id))
                    if (subResp?.success && subResp.data?.subjects) {
                      const names = subResp.data.subjects
                        .map((s) => s?.name)
                        .filter((n): n is string => Boolean(n))
                      return { id: t.id, subjects: names }
                    }
                  } catch (e) {
                    console.warn("Failed to fetch subjects for tutor", t.id, e)
                  }
                  return { id: t.id, subjects: [] as string[] }
                })
              )

              if (results.length > 0) {
                setTutors((prev) =>
                  prev.map((pt) => {
                    const found = results.find((r) => r.id === pt.id)
                    if (found && found.subjects.length > 0) {
                      return { ...pt, subjects: found.subjects }
                    }
                    return pt
                  })
                )
              }
            } catch (e) {
              console.warn("Subject enrichment failed", e)
            }
          }
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
        <h1 className="text-2xl font-bold mb-2">Tìm gia sư</h1>
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
          tutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              showBookButton
              onBook={async (t) => {
                setBookingTutor(t)
                setBookingError(null)
                setBookingServiceId(1)
                // preselect subject if filter chosen
                if (selectedSubject !== "all") {
                  const subj = subjects.find((s) => s.name === selectedSubject)
                  setBookingSubjectId(subj ? String(subj.id) : "")
                } else if (t.subjects && t.subjects.length > 0) {
                  // Try to match first subject name to id list
                  const subj = subjects.find((s) => s.name === t.subjects[0])
                  setBookingSubjectId(subj ? String(subj.id) : "")
                } else {
                  setBookingSubjectId("")
                }
                // default time: now to +1 hour in local timezone as ISO without seconds
                const now = new Date()
                const in1h = new Date(now.getTime() + 60 * 60 * 1000)
                const toLocalInput = (d: Date) => {
                  const pad = (n: number) => String(n).padStart(2, "0")
                  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
                }
                setBookingStart(toLocalInput(now))
                setBookingEnd(toLocalInput(in1h))
                // fetch tutor services to get a valid service_id
                try {
                  const svc = await TutorAPI.getTutorServices(Number(t.id))
                  const first = svc?.data?.services?.find((s) => s.active)
                  if (first) setBookingServiceId(first.id)
                } catch (e) {
                  // silently ignore; backend will use default rate if needed
                }
                setQuickBookOpen(true)
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy gia sư phù hợp với tiêu chí tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Quick Book Dialog */}
      <Dialog open={quickBookOpen} onOpenChange={setQuickBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt lịch nhanh {bookingTutor ? `với ${bookingTutor.name}` : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {bookingError && (
              <p className="text-sm text-destructive">{bookingError}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Môn học</Label>
                <Select value={bookingSubjectId} onValueChange={setBookingSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bắt đầu</Label>
                <Input type="datetime-local" value={bookingStart} onChange={(e) => setBookingStart(e.target.value)} />
              </div>
              <div>
                <Label>Kết thúc</Label>
                <Input type="datetime-local" value={bookingEnd} onChange={(e) => setBookingEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setQuickBookOpen(false)} disabled={bookingLoading}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                if (!bookingTutor) return
                if (!bookingSubjectId) {
                  setBookingError("Vui lòng chọn môn học")
                  return
                }
                if (!bookingStart || !bookingEnd) {
                  setBookingError("Vui lòng chọn thời gian bắt đầu/kết thúc")
                  return
                }
                const start = new Date(bookingStart)
                const end = new Date(bookingEnd)
                if (end <= start) {
                  setBookingError("Thời gian kết thúc phải sau thời gian bắt đầu")
                  return
                }
                // if (!bookingServiceId) {
                //   setBookingError("Gia sư chưa có dịch vụ khả dụng. Vui lòng thử gia sư khác hoặc liên hệ hỗ trợ.")
                //   return
                // }
                const studentId = session?.user?.id ? parseInt(String(session.user.id)) : undefined
                if (!studentId) {
                  setBookingError("Bạn cần đăng nhập để đặt lịch")
                  return
                }
                try {
                  setBookingLoading(true)
                  setBookingError(null)
                  const payload = {
                    tutor_id: parseInt(String(bookingTutor.id)),
                    service_id: 1,
                    subject_id: parseInt(bookingSubjectId),
                    start_at: start.toISOString(),
                    end_at: end.toISOString(),
                  }
                  const resp = await BookingAPI.createBooking(payload, studentId)
                  if (resp.success) {
                    setQuickBookOpen(false)
                    toast.success("Tạo booking thành công!")
                    // Reset form
                    setBookingTutor(null)
                    setBookingSubjectId("")
                    setBookingStart("")
                    setBookingEnd("")
                    setBookingServiceId(null)
                    setBookingError(null)
                    // Optionally, you might want to redirect to bookings page or booking details
                    // Optional: redirect to bookings page
                    router.push('/student/bookings')
                  } else {
                    setBookingError(resp.message || "Không thể tạo booking")
                  }
                } catch (e: any) {
                  setBookingError(e?.message || "Có lỗi khi tạo booking")
                } finally {
                  setBookingLoading(false)
                }
              }}
              disabled={bookingLoading}
            >
              {bookingLoading ? (
                <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tạo...</span>
              ) : (
                "Đặt lịch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
