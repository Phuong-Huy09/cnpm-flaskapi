"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export interface UserCreateModalProps {
  open: boolean
  onClose: () => void
  onCreate: (payload: { email: string; username: string; password: string; status?: "active" | "suspended" | "pending"; role?: string }) => Promise<boolean>
}

export default function UserCreateModal({ open, onClose, onCreate }: UserCreateModalProps) {
  const [email, setEmail] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [status, setStatus] = React.useState<"active" | "suspended" | "pending">("pending")
  const [role, setRole] = React.useState("Student")
  const [saving, setSaving] = React.useState(false)

  const reset = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    setStatus("pending")
    setRole("Student")
  }

  const handleCreate = async () => {
    if (!email || !username || !password) return
    setSaving(true)
    try {
      const ok = await onCreate({ email, username, password, status, role })
      if (ok) {
        reset()
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div>
            <Label htmlFor="create-email">Email</Label>
            <Input id="create-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <Label htmlFor="create-username">Username</Label>
            <Input id="create-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          </div>
          <div>
            <Label htmlFor="create-password">Mật khẩu</Label>
            <Input id="create-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Trạng thái</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vai trò</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Tutor">Tutor</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="System Handler">System Handler</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => { reset(); onClose() }}>Hủy</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={saving || !email || !username || !password}>
            {saving ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
