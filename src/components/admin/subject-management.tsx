"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Subject } from "@/lib/mock-data"

type Level = "K12" | "Undergrad" | "Graduate" | "Other"

const LEVEL_BADGE: Record<Level, { variant: "default" | "secondary" | "outline"; label: string }> = {
    K12: { variant: "default", label: "Phổ thông" },
    Undergrad: { variant: "secondary", label: "Đại học" },
    Graduate: { variant: "outline", label: "Sau đại học" },
    Other: { variant: "outline", label: "Khác" },
}

interface SubjectFormData {
    name: string
    level: Level
}

interface SubjectManagementTableProps {
    subjects: Subject[]
    onAddSubject: (subject: Omit<Subject, "id">) => void
    onUpdateSubject: (id: string, subject: Omit<Subject, "id">) => void
    onDeleteSubject: (id: string) => void
}

export function SubjectManagementTable({ 
    subjects, 
    onAddSubject, 
    onUpdateSubject, 
    onDeleteSubject 
}: SubjectManagementTableProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null)
    const [formData, setFormData] = React.useState<SubjectFormData>({
        name: "",
        level: "K12"
    })

    const handleAdd = () => {
        if (formData.name.trim()) {
            onAddSubject({
                name: formData.name.trim(),
                level: formData.level
            })
            setFormData({ name: "", level: "K12" })
            setIsAddDialogOpen(false)
        }
    }

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject)
        setFormData({
            name: subject.name,
            level: subject.level
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdate = () => {
        if (editingSubject && formData.name.trim()) {
            onUpdateSubject(editingSubject.id, {
                name: formData.name.trim(),
                level: formData.level
            })
            setEditingSubject(null)
            setFormData({ name: "", level: "K12" })
            setIsEditDialogOpen(false)
        }
    }

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
            onDeleteSubject(id)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", level: "K12" })
        setEditingSubject(null)
    }

    return (
        <div className="space-y-4">
            {/* Header with Add Subject Button */}
            <div className="flex justify-end">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm môn học
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm môn học mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Tên môn học</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập tên môn học..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="level">Cấp độ</Label>
                                <Select 
                                    value={formData.level} 
                                    onValueChange={(value: Level) => setFormData({ ...formData, level: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="K12">Phổ thông</SelectItem>
                                        <SelectItem value="Undergrad">Đại học</SelectItem>
                                        <SelectItem value="Graduate">Sau đại học</SelectItem>
                                        <SelectItem value="Other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button onClick={handleAdd}>Thêm môn học</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Subject Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa môn học</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Tên môn học</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên môn học..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-level">Cấp độ</Label>
                            <Select 
                                value={formData.level} 
                                onValueChange={(value: Level) => setFormData({ ...formData, level: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="K12">Phổ thông</SelectItem>
                                    <SelectItem value="Undergrad">Đại học</SelectItem>
                                    <SelectItem value="Graduate">Sau đại học</SelectItem>
                                    <SelectItem value="Other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate}>Cập nhật</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Subjects Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tên môn học</TableHead>
                            <TableHead>Cấp độ</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy môn học nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            subjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-medium">{subject.id}</TableCell>
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={LEVEL_BADGE[subject.level as Level].variant}>
                                            {LEVEL_BADGE[subject.level as Level].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(subject)}
                                                    className="cursor-pointer"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(subject.id)}
                                                    className="cursor-pointer text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
