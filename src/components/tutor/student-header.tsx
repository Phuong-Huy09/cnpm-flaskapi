"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Search, 
  Calendar, 
  MessageCircle, 
  Star, 
  LogOut,
  Settings,
  Bell
} from "lucide-react"

const navigationItems = [
  {
    href: "/tutor",
    label: "Hồ sơ",
    icon: User,
  },
  {
    href: "/tutor/bookings",
    label: "Quản lý buổi dạy",
    icon: Calendar,
  },
  {
    href: "/tutor/chat",
    label: "Chat",
    icon: MessageCircle,
  }
]

export function StudentHeader() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const currentStudent = session?.user

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="font-bold text-xl">TutorApp</div>
            <Badge variant="secondary">Gia sư</Badge>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentStudent?.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {currentStudent?.name?.charAt(0) || currentStudent?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentStudent?.name || "Người dùng"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentStudent?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/student')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/tutor/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto space-x-1 py-2 scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push(item.href)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
