"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import type { UserManagement } from "@/lib/api/users"

interface UserEditProps {
  open: boolean
  onClose: () => void
  user?: UserManagement | null
  onSave: (payload: {
    id: string
    username?: string
    name?: string
    email?: string
    role?: string
    status?: string
  }) => Promise<boolean>
}

export function UserEditModal({ open, onClose, user, onSave }: UserEditProps) {
  const [username, setUsername] = React.useState(user?.username ?? "")
  const [email, setEmail] = React.useState(user?.email ?? "")
  const [role, setRole] = React.useState(user?.role ?? "Student")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setUsername(user?.username ?? "")
    setEmail(user?.email ?? "")
    setRole(user?.role ?? "Student")
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const ok = await onSave({ id: user.id, username, email, role })
      if (ok) onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <div>
            <Label htmlFor="user-username">Username</Label>
            <Input
              id="user-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Role</Label>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserEditModal
