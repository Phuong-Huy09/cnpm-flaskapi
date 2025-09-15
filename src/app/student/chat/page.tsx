"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  mockTutors,
  mockChatThreads,
  mockMessages,
} from "@/lib/mock-data"

export default function ChatPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  // Mock data filters
  const studentThreads = mockChatThreads.filter((t) => t.studentId === "student1")

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat với gia sư</h1>
        <p className="text-muted-foreground">
          Trao đổi và thảo luận với gia sư của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cuộc trò chuyện</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {studentThreads.length > 0 ? (
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
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Chưa có cuộc trò chuyện nào
              </div>
            )}
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
    </div>
  )
}
