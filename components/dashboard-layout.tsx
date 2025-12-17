"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import NotificationsPanel from "./notifications-panel"
import GlobalSearchModal from "./global-search-modal"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "student" | "alumni"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", icon: Home, href: `/dashboard/${role}` },
    ...(role === "student" ? [{ name: "Search Alumni", icon: Search, href: `/dashboard/${role}/search` }] : []),
    { name: "Connections", icon: Users, href: `/dashboard/${role}/connections` },
    { name: "Messages", icon: MessageSquare, href: `/dashboard/${role}/messages`, badge: 3 },
    { name: "Projects", icon: Briefcase, href: `/dashboard/${role}/projects` },
    { name: "Settings", icon: Settings, href: `/dashboard/${role}/settings` },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container flex h-16 items-center gap-4 px-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/dashboard/${role}`)}>
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-sidebar-foreground hidden sm:inline-block">AlumSphere</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative cursor-pointer" onClick={() => setIsSearchOpen(true)}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search alumni, ask questions, share posts..."
                className="pl-10 bg-muted/50 border-border text-foreground cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sidebar-foreground"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-sidebar-foreground"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                5
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-sidebar-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={role === "alumni" ? "/professional-woman.png" : "/placeholder.svg"} />
                    <AvatarFallback>{role === "alumni" ? "SJ" : "JD"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">{role === "alumni" ? "Sarah Johnson" : "John Doe"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${role}/profile`)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${role}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => router.push("/")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} role={role} />
      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} role={role} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="hidden lg:block w-64 border-r border-border/50 bg-white min-h-[calc(100vh-4rem)] sticky top-16"
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start gap-3 relative"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.badge && (
                  <Badge className="ml-auto" variant="secondary">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-border shadow-2xl lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-sidebar-foreground">AlumSphere</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="p-4 space-y-2">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        router.push(item.href)
                        setIsSidebarOpen(false)
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                      {item.badge && (
                        <Badge className="ml-auto" variant="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
