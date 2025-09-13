// Admin dashboard types and mock data
import { Subject, mockSubjects } from "@/lib/mock-data"

export interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalTutors: number
  totalBookings: number
  totalRevenue: number
  activeConversations: number
  pendingReviews: number
  recentSignups: number
}

export interface UserManagement {
  id: string
  name: string
  email: string
  role: "student" | "tutor" | "moderator" | "admin"
  status: "active" | "suspended" | "pending"
  joinDate: Date
  lastActive: Date
  totalBookings?: number
  totalEarnings?: number
}

export interface BookingManagement {
  id: string
  studentName: string
  tutorName: string
  subject: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  amount: number
  createdAt: Date
  scheduledAt?: Date
}

export interface RevenueData {
  month: string
  revenue: number
  bookings: number
}

// Mock data
export const mockSystemStats: SystemStats = {
  totalUsers: 1247,
  totalStudents: 892,
  totalTutors: 355,
  totalBookings: 2156,
  totalRevenue: 45600000, // VND
  activeConversations: 89,
  pendingReviews: 23,
  recentSignups: 47,
}

export const mockUsers: UserManagement[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "student@example.com",
    role: "student",
    status: "active",
    joinDate: new Date("2024-01-15"),
    lastActive: new Date("2024-01-20"),
    totalBookings: 12,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tutor@example.com",
    role: "tutor",
    status: "active",
    joinDate: new Date("2024-01-10"),
    lastActive: new Date("2024-01-19"),
    totalBookings: 45,
    totalEarnings: 9000000,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "moderator@example.com",
    role: "moderator",
    status: "active",
    joinDate: new Date("2024-01-05"),
    lastActive: new Date("2024-01-20"),
  },
]

export const mockBookings: BookingManagement[] = [
  {
    id: "1",
    studentName: "Nguyễn Văn A",
    tutorName: "Trần Thị B",
    subject: "Toán học",
    status: "completed",
    amount: 200000,
    createdAt: new Date("2024-01-15"),
    scheduledAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    studentName: "Phạm Thị D",
    tutorName: "Lê Văn E",
    subject: "Tiếng Anh",
    status: "pending",
    amount: 150000,
    createdAt: new Date("2024-01-20"),
    scheduledAt: new Date("2024-01-22"),
  },
]

export const mockRevenueData: RevenueData[] = [
  { month: "T1", revenue: 3200000, bookings: 156 },
  { month: "T2", revenue: 3800000, bookings: 189 },
  { month: "T3", revenue: 4200000, bookings: 203 },
  { month: "T4", revenue: 3900000, bookings: 178 },
  { month: "T5", revenue: 4500000, bookings: 221 },
  { month: "T6", revenue: 5100000, bookings: 245 },
]

// Mock functions
export const getSystemStats = (): SystemStats => {
  return mockSystemStats
}

export const getUsers = (role?: string, status?: string): UserManagement[] => {
  return mockUsers.filter((user) => {
    if (role && user.role !== role) return false
    if (status && user.status !== status) return false
    return true
  })
}

export const getBookings = (status?: string): BookingManagement[] => {
  return mockBookings.filter((booking) => {
    if (status && booking.status !== status) return false
    return true
  })
}

export const updateUserStatus = (userId: string, status: "active" | "suspended" | "pending"): boolean => {
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.status = status
    return true
  }
  return false
}

export const getRevenueData = (): RevenueData[] => {
  return mockRevenueData
}

// Subject management functions
let subjectsData = [...mockSubjects]

export const getSubjects = (): Subject[] => {
  return subjectsData
}

export const addSubject = (subject: Omit<Subject, "id">): Subject => {
  const newId = Math.max(...subjectsData.map(s => parseInt(s.id)), 0) + 1
  const newSubject: Subject = {
    ...subject,
    id: newId.toString()
  }
  subjectsData.push(newSubject)
  return newSubject
}

export const updateSubject = (id: string, subject: Omit<Subject, "id">): boolean => {
  const index = subjectsData.findIndex(s => s.id === id)
  if (index !== -1) {
    subjectsData[index] = { ...subject, id }
    return true
  }
  return false
}

export const deleteSubject = (id: string): boolean => {
  const index = subjectsData.findIndex(s => s.id === id)
  if (index !== -1) {
    subjectsData.splice(index, 1)
    return true
  }
  return false
}
