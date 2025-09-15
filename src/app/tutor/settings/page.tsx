"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { fetchSubjects } from "@/lib/api/subjects"

export default function SettingsPage() {
  const { data: session } = useSession()
  const currentStudent = session?.user

  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // form state
  const [name, setName] = useState<string>(currentStudent?.name || '')
  const [phone, setPhone] = useState<string>('')
  const [bio, setBio] = useState<string>('')

  // subjects management
  const [availableSubjects, setAvailableSubjects] = useState<Array<{id:number,name:string}>>([])
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([])
  const [subjectToAdd, setSubjectToAdd] = useState<number | ''>('')

  // load current profile/preferences and subjects on mount
  useEffect(() => {
    async function load() {
      if (!currentStudent?.id) return
      setLoading(true)
      setError(null)
      try {
        const [userRes, subsRes] = await Promise.all([
          fetch(`${apiBase}/users/${currentStudent.id}`),
          fetchSubjects()
        ])

        if (!userRes.ok) throw new Error(`Failed to load profile: ${userRes.status}`)

        const userJson = await userRes.json()
        const subsJson = subsRes

        const data = userJson.data || userJson
        setName(data.full_name || data.name || '')
        setPhone(data.phone || '')
        setBio(data.bio || '')

        // subjects: fetch tutor's subjects from dedicated endpoint (more authoritative)
        try {
          const tutorSubsRes = await fetch(`${apiBase}/tutors/${currentStudent.id}/subjects`)
          if (tutorSubsRes.ok) {
            const tutorSubsJson = await tutorSubsRes.json()
            const tutorSubs = (tutorSubsJson.data && tutorSubsJson.data.subjects) ? tutorSubsJson.data.subjects : (tutorSubsJson.data || tutorSubsJson)
            setSelectedSubjectIds(Array.isArray(tutorSubs) ? tutorSubs.map((s:any) => s.id) : [])
          } else {
            // fallback to user payload
            const tutorSubjects = (data.tutor_profile && data.tutor_profile.subjects) || data.subjects || []
            setSelectedSubjectIds(tutorSubjects.map((s:any) => s.id))
          }
        } catch (e) {
          const tutorSubjects = (data.tutor_profile && data.tutor_profile.subjects) || data.subjects || []
          setSelectedSubjectIds(tutorSubjects.map((s:any) => s.id))
        }

        // available subjects list (subjects may be under subsJson.data.subjects)
        const subsList = (subsJson && subsJson.data && subsJson.data.subjects) ? subsJson.data.subjects : (subsJson.data || subsJson)
        setAvailableSubjects(Array.isArray(subsList) ? subsList.map((s:any) => ({ id: s.id, name: s.name })) : [])

      } catch (err: any) {
        setError(err.message || 'Error loading profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentStudent?.id])

  async function handleSaveProfile() {
    if (!currentStudent?.id) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        full_name: name,
        phone,
        bio
      }

      const res = await fetch(`${apiBase}/users/${currentStudent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Save failed: ${res.status} ${text}`)
      }

    } catch (err: any) {
      setError(err.message || 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  // subjects handlers
  function addSelectedSubject() {
    if (!subjectToAdd) return
    const id = Number(subjectToAdd)
    if (!selectedSubjectIds.includes(id)) {
      setSelectedSubjectIds(prev => [...prev, id])
    }
    setSubjectToAdd('')
  }

  function removeSubject(id:number) {
    setSelectedSubjectIds(prev => prev.filter(x => x !== id))
  }

  async function saveSubjects() {
    if (!currentStudent?.id) return
    setSaving(true)
    setError(null)
    try {
      // call tutors subjects PATCH endpoint
      const res = await fetch(`${apiBase}/tutors/${currentStudent.id}/subjects`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_ids: selectedSubjectIds })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Save failed: ${res.status} ${text}`)
      }
    } catch (err:any) {
      setError(err.message || 'Error saving subjects')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản và tùy chọn cá nhân
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu</Label>
              <Input
                id="bio"
                placeholder="Viết vài dòng về bản thân..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleSaveProfile} disabled={saving || loading}>
              {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
            </Button>
          </CardContent>
        </Card>

        {/* Subjects management */}
        <Card>
          <CardHeader>
            <CardTitle>Môn học</CardTitle>
            <CardDescription>Quản lý các môn bạn dạy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject-select">Thêm môn học</Label>
              <div className="flex gap-2 mt-2">
                <select id="subject-select" className="flex-1" value={subjectToAdd as any}
                  onChange={(e) => setSubjectToAdd(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">-- Chọn môn --</option>
                  {availableSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <Button onClick={addSelectedSubject}>Thêm</Button>
              </div>
            </div>

            <div>
              <Label>Danh sách môn học</Label>
              <div className="mt-2 space-y-2">
                {selectedSubjectIds.length === 0 && <div className="text-sm text-muted-foreground">Chưa có môn học nào</div>}
                {selectedSubjectIds.map(id => {
                  const s = availableSubjects.find(x => x.id === id)
                  return (
                    <div key={id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>{s ? s.name : `ID ${id}`}</div>
                      <Button variant="outline" onClick={() => removeSubject(id)}>Xóa</Button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveSubjects} disabled={saving || loading}>{saving ? 'Đang lưu...' : 'Lưu môn học'}</Button>
              <Button variant="outline" onClick={() => { setSelectedSubjectIds([]) }}>Xóa tất cả</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
