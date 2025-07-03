"use client"

import { BarChart3, Package, ShoppingCart, Phone, Settings, Home, FileText, LogOut,BookHeart  } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { signOut } from 'next-auth/react';
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Consultations",
    url: "/dashboard/consultations",
    icon: Phone,
  },
  {
    title: "Reels",
    url: "/dashboard/reels",
    icon: BookHeart,
  },
  // {
  //   title: "Reports",
  //   url: "/dashboard/reports",
  //   icon: FileText,
  // },
  {
    title: "Logout",
    url: "/dashboard/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // Optionally, you can redirect to the login page or show a success message
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Sunita Gemstone </span>
            <span className="truncate text-xs text-muted-foreground">Management Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                 {/* If the item is "Logout", handle sign out differently */
                    item.title === "Logout" ? (
                      <button onClick={handleLogout} className="flex cursor-pointer items-center gap-2 w-full">
                        <item.icon className="size-4" />
                        <span >{item.title}</span>
                      </button>
                    ) : (
                      <Link href={item.url} className="flex items-center  cursor-pointer gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
