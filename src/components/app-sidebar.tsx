"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Users,
  BookOpen,
  GraduationCap,
  UserRound,
  CalendarCheck,
  Star,
  Settings,
} from "lucide-react"

// Move nav data ra file riêng nếu muốn reuse
const navData = {
  navMain: [
    {
      title: "Menu",
      items: [
        { title: "Quản lý người dùng", url: "/admin/users", icon: Users },
        { title: "Quản lý Môn học", url: "/admin/subjects", icon: BookOpen },
        { title: "Quản lý booking", url: "/admin/bookings", icon: CalendarCheck },
        { title: "Quản lý đánh giá", url: "/admin/reviews", icon: Star },
        { title: "Cài đặt hệ thống", url: "/admin/settings", icon: Settings },
      ],
    },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.url)
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
