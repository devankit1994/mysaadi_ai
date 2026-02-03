"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  LayoutDashboard,
  Users,
  Bookmark,
  Send,
  CreditCard,
  Settings,
  LogOut,
  User,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "My Profile", href: "/dashboard/profile" },
  { icon: Users, label: "Explore Matches", href: "/explore", badge: "New" },
  { icon: Bookmark, label: "Saved Profiles", href: "/dashboard/saved" },
  { icon: Send, label: "Requests", href: "/dashboard/requests", badge: "3" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary fill-primary" />
          <span className="text-xl font-bold">
            My<span className="text-primary">Saadi</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* User Profile Card */}
        <SidebarGroup>
          <SidebarGroupContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/beautiful-indian-woman-professional-portrait-smili.jpg" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Priya Sharma</p>
                <p className="text-xs text-muted-foreground">Mumbai, India</p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="space-y-2 p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">Complete your profile to get more matches!</p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      "transition-colors",
                      pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/15",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "New" ? "default" : "secondary"}
                          className="ml-auto h-5 px-1.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Unlock Credits */}
        <SidebarGroup>
          <SidebarGroupContent className="p-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">Unlock Balance</span>
              </div>
              <p className="text-2xl font-bold text-primary">₹0</p>
              <p className="text-xs text-muted-foreground mb-3">Add credits to unlock profiles</p>
              <Link
                href="/dashboard/payments"
                className="block w-full text-center py-2 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Credits
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/login" className="text-destructive hover:text-destructive">
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
