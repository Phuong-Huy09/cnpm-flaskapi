"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserManagement } from "@/lib/api/users"

interface UserEditProps {
  open: boolean
  onClose: () => void
  user?: UserManagement | null
  onSave: (payload: { id: string; name?: string; email?: string; role?: string; status?: string }) => Promise<boolean>
}

export function UserEditModal({ open, onClose, user, onSave }: UserEditProps) {
  const [name, setName] = React.useState(user?.name ?? "")
  const [email, setEmail] = React.useState(user?.email ?? "")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setName(user?.name ?? "")
    setEmail(user?.email ?? "")
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const ok = await onSave({ id: user.id, name, email })
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
            <Label htmlFor="user-name">Tên</Label>
            <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserEditModal
