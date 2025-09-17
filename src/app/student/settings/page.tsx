"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const currentStudent = session?.user

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản và tùy chọn cá nhân
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên"
                defaultValue={currentStudent?.name || ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                defaultValue={currentStudent?.email || ""}
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email không thể thay đổi
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu</Label>
              <Input
                id="bio"
                placeholder="Viết vài dòng về bản thân..."
              />
            </div>
            <Button className="w-full">Cập nhật thông tin</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Thông báo qua email</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo về booking và tin nhắn qua email
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="booking-reminders">Nhắc nhở booking</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận nhắc nhở trước khi có buổi học
                </p>
              </div>
              <Switch id="booking-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chat-notifications">Thông báo chat</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo khi có tin nhắn mới
                </p>
              </div>
              <Switch id="chat-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Thông báo quảng cáo</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông tin về các ưu đãi và tính năng mới
                </p>
              </div>
              <Switch id="marketing" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quyền riêng tư</CardTitle>
            <CardDescription>Kiểm soát quyền riêng tư của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-visibility">Hiển thị hồ sơ</Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép gia sư xem hồ sơ của bạn
                </p>
              </div>
              <Switch id="profile-visibility" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="contact-info">Thông tin liên hệ</Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép chia sẻ thông tin liên hệ với gia sư đã booking
                </p>
              </div>
              <Switch id="contact-info" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>Quản lý tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Thay đổi mật khẩu
            </Button>
            <Button variant="outline" className="w-full">
              Tải xuống dữ liệu
            </Button>
            <Button variant="destructive" className="w-full">
              Xóa tài khoản
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
