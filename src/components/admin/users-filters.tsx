import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UsersFiltersProps {
  onSearch: (filters: {
    keyword?: string
    status?: string
    page?: number
    per_page?: number
  }) => void
  isLoading?: boolean
}

export function UsersFilters({ onSearch, isLoading }: UsersFiltersProps) {
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState("all")
  const [perPage, setPerPage] = useState("10")

  const handleSearch = () => {
    onSearch({
      keyword: keyword.trim() || undefined,
      status: status === "all" ? undefined : status,
      per_page: parseInt(perPage),
      page: 1, // Reset to first page when searching
    })
  }

  const handleReset = () => {
    setKeyword("")
    setStatus("all")
    setPerPage("10")
    onSearch({
      page: 1,
      per_page: 10,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo email hoặc tên người dùng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <Select value={status} onValueChange={setStatus} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="suspended">Bị đình chỉ</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Per Page Filter */}
        <div className="min-w-[120px]">
          <Select value={perPage} onValueChange={setPerPage} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Số lượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / trang</SelectItem>
              <SelectItem value="10">10 / trang</SelectItem>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isLoading}
          >
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  )
}
