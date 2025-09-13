export interface Tutor {
  id: string
  name: string
  avatar: string
  bio: string
  subjects: string[]
  hourlyRate: number
  rating: number
  reviewCount: number
  yearsExperience: number
  credentials: {
    title: string
    status: "Verified" | "Pending" | "Unverified" | "Rejected"
  }[]
  availability: {
    weekday: string
    startTime: string
    endTime: string
  }[]
}

export interface Subject {
  id: string
  name: string
  level: "K12" | "Undergrad" | "Graduate" | "Other"
}

export interface Booking {
  id: string
  studentId: string
  tutorId: string
  subject: string
  startAt: string
  endAt: string
  status: "Pending" | "Confirmed" | "Completed" | "Canceled"
  totalAmount: number
}

export interface User {
  id: string
  email: string
  fullName: string
  role: "student" | "tutor" | "admin" | "moderator"
  status: "active" | "suspended" | "banned"
  createdAt: string
  dateOfBirth?: string
}

export interface Complaint {
  id: string
  raisedBy: string
  againstUser: string
  type: "Content" | "Behavior" | "Payment"
  status: "Open" | "UnderReview" | "Resolved" | "Rejected"
  description: string
  createdAt: string
}

export interface Payout {
  id: string
  tutorId: string
  amount: number
  status: "Pending" | "Processing" | "Paid" | "Failed"
  createdAt: string
}

export interface Review {
  id: string
  bookingId: string
  studentId: string
  tutorId: string
  rating: number
  comment: string
  createdAt: string
}

export interface ChatThread {
  id: string
  studentId: string
  tutorId: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
}

// Mock data
export const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Nguyễn Thị Mai",
    avatar: "/female-teacher.png",
    bio: "Giáo viên Toán với 8 năm kinh nghiệm, chuyên dạy học sinh THCS và THPT",
    subjects: ["Toán học", "Vật lý"],
    hourlyRate: 200000,
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 8,
    credentials: [
      { title: "Cử nhân Toán học - ĐH Sư phạm Hà Nội", status: "Verified" },
      { title: "Chứng chỉ giảng dạy", status: "Verified" },
    ],
    availability: [
      { weekday: "Thứ 2", startTime: "18:00", endTime: "21:00" },
      { weekday: "Thứ 4", startTime: "18:00", endTime: "21:00" },
    ],
  },
  {
    id: "2",
    name: "Trần Văn Hùng",
    avatar: "/male-teacher.png",
    bio: "Thạc sĩ Tiếng Anh, có kinh nghiệm dạy IELTS và giao tiếp",
    subjects: ["Tiếng Anh", "IELTS"],
    hourlyRate: 250000,
    rating: 4.8,
    reviewCount: 89,
    yearsExperience: 6,
    credentials: [
      { title: "Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ", status: "Verified" },
      { title: "Chứng chỉ IELTS 8.0", status: "Verified" },
    ],
    availability: [
      { weekday: "Thứ 3", startTime: "19:00", endTime: "22:00" },
      { weekday: "Thứ 6", startTime: "19:00", endTime: "22:00" },
    ],
  },
  {
    id: "3",
    name: "Lê Thị Hoa",
    avatar: "/female-chemistry-teacher.png",
    bio: "Tiến sĩ Hóa học, chuyên dạy Hóa học THPT và luyện thi đại học",
    subjects: ["Hóa học", "Sinh học"],
    hourlyRate: 300000,
    rating: 4.9,
    reviewCount: 156,
    yearsExperience: 12,
    credentials: [
      { title: "Tiến sĩ Hóa học - ĐH Bách khoa Hà Nội", status: "Verified" },
      { title: "Giải thưởng giáo viên xuất sắc", status: "Verified" },
    ],
    availability: [{ weekday: "Chủ nhật", startTime: "14:00", endTime: "18:00" }],
  },
]

export const mockSubjects: Subject[] = [
  { id: "1", name: "Toán học", level: "K12" },
  { id: "2", name: "Tiếng Anh", level: "K12" },
  { id: "3", name: "Vật lý", level: "K12" },
  { id: "4", name: "Hóa học", level: "K12" },
  { id: "5", name: "Sinh học", level: "K12" },
  { id: "6", name: "Lập trình", level: "Undergrad" },
  { id: "7", name: "Kinh tế", level: "Undergrad" },
  { id: "8", name: "IELTS", level: "Graduate" },
]

export const mockBookings: Booking[] = [
  {
    id: "1",
    studentId: "student1",
    tutorId: "1",
    subject: "Toán học",
    startAt: "2024-01-15T18:00:00",
    endAt: "2024-01-15T20:00:00",
    status: "Confirmed",
    totalAmount: 400000,
  },
  {
    id: "2",
    studentId: "student1",
    tutorId: "2",
    subject: "Tiếng Anh",
    startAt: "2024-01-16T19:00:00",
    endAt: "2024-01-16T21:00:00",
    status: "Pending",
    totalAmount: 500000,
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    email: "student@example.com",
    fullName: "Nguyễn Văn An",
    role: "student",
    status: "active",
    createdAt: "2024-01-01T00:00:00",
    dateOfBirth: "2005-03-15",
  },
  {
    id: "2",
    email: "tutor@example.com",
    fullName: "Nguyễn Thị Mai",
    role: "tutor",
    status: "active",
    createdAt: "2024-01-01T00:00:00",
  },
]

export const mockComplaints: Complaint[] = [
  {
    id: "1",
    raisedBy: "Nguyễn Văn An",
    againstUser: "Trần Văn B",
    type: "Behavior",
    status: "Open",
    description: "Gia sư không đến đúng giờ và thái độ không chuyên nghiệp",
    createdAt: "2024-01-10T10:00:00",
  },
]

export const mockPayouts: Payout[] = [
  {
    id: "1",
    tutorId: "1",
    amount: 1800000,
    status: "Paid",
    createdAt: "2024-01-01T00:00:00",
  },
  {
    id: "2",
    tutorId: "2",
    amount: 2250000,
    status: "Processing",
    createdAt: "2024-01-05T00:00:00",
  },
]

export const mockReviews: Review[] = [
  {
    id: "1",
    bookingId: "1",
    studentId: "student1",
    tutorId: "1",
    rating: 5,
    comment: "Cô Mai dạy rất tận tâm và dễ hiểu. Em đã hiểu được nhiều bài tập khó.",
    createdAt: "2024-01-16T10:00:00",
  },
]

export const mockChatThreads: ChatThread[] = [
  {
    id: "1",
    studentId: "student1",
    tutorId: "1",
    lastMessage: "Em cảm ơn cô đã dạy hôm nay!",
    lastMessageAt: "2024-01-15T20:30:00",
    unreadCount: 0,
  },
  {
    id: "2",
    studentId: "student1",
    tutorId: "2",
    lastMessage: "Anh có thể dạy thêm về grammar không?",
    lastMessageAt: "2024-01-14T19:45:00",
    unreadCount: 2,
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    threadId: "1",
    senderId: "1",
    content: "Chào em! Hôm nay chúng ta sẽ học về phương trình bậc hai nhé.",
    createdAt: "2024-01-15T18:00:00",
    isRead: true,
  },
  {
    id: "2",
    threadId: "1",
    senderId: "student1",
    content: "Dạ em cảm ơn cô!",
    createdAt: "2024-01-15T18:05:00",
    isRead: true,
  },
]
