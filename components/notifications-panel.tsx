"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, MessageSquare, UserPlus, Briefcase, ThumbsUp, CheckCheck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase"
import { getProfile } from "@/app/actions/get-profile"

interface Notification {
  id: string
  type: "message" | "connection" | "project" | "like"
  title: string
  description: string
  time: string
  avatar?: string
  isRead: boolean
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  role: "student" | "alumni"
}

export default function NotificationsPanel({ isOpen, onClose, role }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [profileId, setProfileId] = useState<string | null>(null)

  const supabase = createClient()

  const fetchLiveNotifications = async () => {
    try {
      const profileRes = await getProfile()
      if (!profileRes.success || !profileRes.profile) return
      
      const currentProfileId = profileRes.profile.id
      setProfileId(currentProfileId)

      const activeNotifications: Notification[] = []

      // 1. Fetch pending connection requests for the user
      const { data: requests } = await supabase
        .from("connection_requests")
        .select(`
          id,
          created_at,
          profiles_connection_requests_sender_idToprofiles (
            id,
            name,
            avatar_url
          )
        `)
        .eq("receiver_id", currentProfileId)
        .eq("status", "PENDING")

      if (requests) {
        requests.forEach((req: any) => {
          activeNotifications.push({
            id: req.id,
            type: "connection",
            title: "New Connection Request",
            description: `${req.profiles_connection_requests_sender_idToprofiles?.name || "Someone"} wants to connect with you`,
            time: "Recently",
            avatar: req.profiles_connection_requests_sender_idToprofiles?.avatar_url || "/placeholder.svg",
            isRead: false,
          })
        })
      }

      // 2. Fetch recent questions in AlumSphere
      const { data: questions } = await supabase
        .from("questions")
        .select(`
          id,
          question_text,
          created_at,
          profiles (
            name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3)

      if (questions) {
        questions.forEach((q: any) => {
          activeNotifications.push({
            id: q.id,
            type: "like",
            title: "New Discussion Post",
            description: `${q.profiles?.name || "A member"} posted: "${q.question_text.substring(0, 40)}..."`,
            time: "Recently",
            avatar: q.profiles?.avatar_url || "/placeholder.svg",
            isRead: true,
          })
        })
      }

      // 3. Fetch recent student projects
      const { data: projects } = await supabase
        .from("projects")
        .select(`
          id,
          title,
          created_at,
          profiles (
            name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3)

      if (projects) {
        projects.forEach((proj: any) => {
          activeNotifications.push({
            id: proj.id,
            type: "project",
            title: "New Project Submission",
            description: `${proj.profiles?.name || "Student"} published a prototype: "${proj.title}"`,
            time: "Recently",
            avatar: proj.profiles?.avatar_url || "/placeholder.svg",
            isRead: true,
          })
        })
      }

      setNotifications(activeNotifications)
    } catch (err) {
      console.error("Failed to load notifications:", err)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    fetchLiveNotifications()

    // 🌐 WebSockets real-time subscriptions — debounced
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => { fetchLiveNotifications() }, 2000)
    }

    const requestsChannel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "connection_requests" }, debouncedReload)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "questions" }, debouncedReload)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "projects" }, debouncedReload)
      .subscribe()

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      supabase.removeChannel(requestsChannel)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "connection":
        return <UserPlus className="h-4 w-4" />
      case "project":
        return <Briefcase className="h-4 w-4" />
      case "like":
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => !n.isRead)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-96 bg-background border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} unread</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all" className="text-foreground">All</TabsTrigger>
                  <TabsTrigger value="unread" className="text-foreground">
                    Unread
                    {unreadCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0" variant="secondary">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <div className="px-4 pt-2">
                  <Button variant="ghost" size="sm" className="w-full text-foreground" onClick={markAllAsRead}>
                    <CheckCheck className="mr-2 h-4 w-4 text-foreground" />
                    Mark all as read
                  </Button>
                </div>
              )}

              {/* Notifications List */}
              <TabsContent value={activeTab} className="m-0">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                          !notification.isRead ? "bg-primary/5" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          {notification.avatar ? (
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-foreground">{notification.title.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {getIcon(notification.type)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm text-foreground">{notification.title}</p>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <CheckCheck className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">All caught up!</p>
                      <p className="text-sm text-muted-foreground mt-1">No new notifications</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
