"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, BookOpen } from "lucide-react"
import type { Tutor } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

interface TutorCardProps {
  tutor: Tutor
  showBookButton?: boolean
}

export function TutorCard({ tutor, showBookButton = false }: TutorCardProps) {
  const router = useRouter()
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
            <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{tutor.name}</h3>
              <div className="text-right">
                <div className="font-bold text-primary">{tutor.hourlyRate.toLocaleString("vi-VN")}đ/giờ</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{tutor.rating}</span>
                <span className="text-muted-foreground text-sm">({tutor.reviewCount} đánh giá)</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{tutor.bio}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {tutor.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tutor.yearsExperience} năm kinh nghiệm</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{tutor.credentials.filter((c) => c.status === "Verified").length} chứng chỉ</span>
              </div>
            </div>

            {showBookButton && (
              <Button className="w-full" onClick={() => router.push(`/student/bookings?with_tutor=${tutor.id}`)}>
                Xem hồ sơ & Đặt lịch
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
