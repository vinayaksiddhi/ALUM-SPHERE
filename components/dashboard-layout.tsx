"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  Sun,
  Moon,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
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
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Dashboard", icon: Home, href: `/dashboard/${role}` },
    ...(role === "student" ? [{ name: "Search Alumni", icon: Search, href: `/dashboard/${role}/search` }] : []),
    { name: "Connections", icon: Users, href: `/dashboard/${role}/connections` },
    { name: "Messages", icon: MessageSquare, href: `/dashboard/${role}/messages`, badge: 3 },
    { name: "Projects", icon: Briefcase, href: `/dashboard/${role}/projects` },
    { name: "Settings", icon: Settings, href: `/dashboard/${role}/settings` },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Abstract Glowing Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 transition-all duration-300">
        <div className="container flex h-16 items-center gap-4 px-4 mx-auto">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-accent/10"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => router.push(`/dashboard/${role}`)}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary hidden sm:inline-block text-lg">
              AlumSphere
            </span>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search alumni, matching profiles, projects..."
                className="pl-10 bg-card/40 border-border/50 text-foreground cursor-pointer rounded-xl group-hover:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
                readOnly
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-mono">
                <span>Ctrl</span><span>K</span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:bg-accent/10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-accent/10 rounded-xl"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400 transition-all duration-300" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 transition-all duration-300" />
                )}
              </Button>
            )}

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:bg-accent/10 rounded-xl"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground font-semibold text-[10px] animate-bounce">
                5
              </Badge>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-foreground hover:bg-accent/10 rounded-xl px-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={role === "alumni" ? "/professional-woman.png" : "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {role === "alumni" ? "SJ" : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block font-medium">
                    {role === "alumni" ? "Sarah Johnson" : "John Doe"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border border-border/40 rounded-2xl p-2 shadow-2xl">
                <DropdownMenuLabel className="font-semibold text-foreground/80 px-2 py-1.5">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/${role}/profile`)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/${role}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl transition-colors cursor-pointer" onClick={() => router.push("/")}>
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

      <div className="flex max-w-[1600px] mx-auto w-full">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="hidden lg:block w-64 border-r border-border/40 bg-card/20 backdrop-blur-sm min-h-[calc(100vh-4rem)] sticky top-16 self-start z-10"
        >
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group cursor-pointer ${
                    isActive 
                      ? "text-primary-foreground shadow-md shadow-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 duration-300 ${isActive ? "text-primary-foreground" : "group-hover:text-primary"}`} />
                  <span className="relative z-10">{item.name}</span>
                  {item.badge && (
                    <Badge className={`ml-auto relative z-10 font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-white text-primary" : "bg-primary/15 text-primary"}`} variant="secondary">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              )
            })}
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
                className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 z-50 h-full w-64 bg-card/95 backdrop-blur-md border-r border-border/40 shadow-2xl lg:hidden p-4 flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold tracking-wider text-foreground">AlumSphere</span>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-1.5 flex-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <button
                        key={item.name}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group cursor-pointer ${
                          isActive 
                            ? "text-primary-foreground shadow-md shadow-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                        }`}
                        onClick={() => {
                          router.push(item.href)
                          setIsSidebarOpen(false)
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicatorMobile"
                            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge className="ml-auto" variant="secondary">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 transition-all duration-300 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
