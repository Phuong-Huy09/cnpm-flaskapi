"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Search, MessageCircle, Calendar, User, Loader2 } from "lucide-react"
import {
  mockTutors,
  mockBookings,
  mockReviews,
  mockChatThreads,
  mockMessages,
  mockSubjects,
} from "@/lib/mock-data"
import { TutorCard } from "@/components/tutor-card"

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [minRate, setMinRate] = useState("")
  const [maxRate, setMaxRate] = useState("")
  const [minRating, setMinRating] = useState("all")
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" })

  // Get current user from NextAuth session
  const currentStudent = session?.user
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  // Debug logs
  console.log('StudentDashboard - NextAuth session:', {
    status,
    isAuthenticated,
    user: session?.user ? 'exists' : 'null',
    session
  })

  useEffect(() => {
    // No need for additional loading logic with NextAuth
  }, [])

  // Mock data filters remain the same until we integrate other APIs
  const studentBookings = mockBookings.filter((b) => b.studentId === "student1")
  const studentReviews = mockReviews.filter((r) => r.studentId === "student1")
  const studentThreads = mockChatThreads.filter((t) => t.studentId === "student1")

  // Filter tutors based on search criteria
  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch =
      !searchQuery ||
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSubject = selectedSubject === "all" || tutor.subjects.includes(selectedSubject)
    const matchesMinRate = !minRate || tutor.hourlyRate >= Number.parseInt(minRate)
    const matchesMaxRate = !maxRate || tutor.hourlyRate <= Number.parseInt(maxRate)
    const matchesRating = minRating === "all" || tutor.rating >= Number.parseFloat(minRating)

    return matchesSearch && matchesSubject && matchesMinRate && matchesMaxRate && matchesRating
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "secondary",
      Confirmed: "default",
      Completed: "outline",
      Canceled: "destructive",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Đang tải dashboard...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <p className="text-muted-foreground mb-4">Bạn cần đăng nhập để truy cập dashboard học viên</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Đăng nhập
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Học viên</h1>
            <p className="text-muted-foreground">
              Chào mừng {currentStudent?.name || currentStudent?.email}! Quản lý học tập và tương tác với gia sư
            </p>
          </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="find-tutor" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Tìm gia sư
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Quản lý booking
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Đánh giá
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStudent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Họ và tên</Label>
                      <p className="text-lg font-medium">{currentStudent.name || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <Label>ID</Label>
                      <p className="text-lg">{currentStudent.id}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-lg">{currentStudent.email}</p>
                    </div>
                    <div>
                      <Label>Trạng thái</Label>
                      <Badge variant="outline">Đang hoạt động</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không thể tải thông tin người dùng</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="mt-4"
                      variant="outline"
                    >
                      Thử lại
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentBookings.map((booking) => {
                      const tutor = mockTutors.find((t) => t.id === booking.tutorId)
                      return (
                        <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{tutor?.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.subject}</p>
                            <p className="text-sm">{formatDateTime(booking.startAt)}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá đã viết</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentReviews.map((review) => {
                      const tutor = mockTutors.find((t) => t.id === review.tutorId)
                      return (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
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
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Find Tutor Tab */}
          <TabsContent value="find-tutor" className="space-y-6">
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
                        {mockSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))}
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
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý booking</CardTitle>
                <CardDescription>Danh sách các buổi học đã đặt</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Gia sư</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Thời gian bắt đầu</TableHead>
                      <TableHead>Thời gian kết thúc</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentBookings.map((booking) => {
                      const tutor = mockTutors.find((t) => t.id === booking.tutorId)
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{tutor?.name}</TableCell>
                          <TableCell>{booking.subject}</TableCell>
                          <TableCell>{formatDateTime(booking.startAt)}</TableCell>
                          <TableCell>{formatDateTime(booking.endAt)}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Cuộc trò chuyện</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {studentThreads.map((thread) => {
                      const tutor = mockTutors.find((t) => t.id === thread.tutorId)
                      return (
                        <div
                          key={thread.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${selectedThread === thread.id ? "bg-muted" : ""}`}
                          onClick={() => setSelectedThread(thread.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={tutor?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{tutor?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{tutor?.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                            </div>
                            {thread.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {thread.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedThread
                      ? mockTutors.find((t) => t.id === studentThreads.find((th) => th.id === selectedThread)?.tutorId)
                          ?.name
                      : "Chọn cuộc trò chuyện"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[500px]">
                  {selectedThread ? (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {mockMessages
                          .filter((m) => m.threadId === selectedThread)
                          .map((message) => {
                            const isFromStudent = message.senderId === "student1"
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isFromStudent ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${isFromStudent ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                                >
                                  <p>{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">{formatDateTime(message.createdAt)}</p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập tin nhắn..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && setNewMessage("")}
                        />
                        <Button onClick={() => setNewMessage("")}>Gửi</Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Viết đánh giá</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
      )}
    </div>
  )
}
