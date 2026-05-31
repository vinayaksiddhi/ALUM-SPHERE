"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Star, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Lightbulb, 
  BookOpen, 
  ArrowRight,
  Zap,
  Award,
  Loader2
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ConnectionRequestCard from "@/components/connection-request-card"
import StudentProjectFeedCard from "@/components/student-project-feed-card"
import CreatePostDialog from "@/components/create-post-dialog"
import AlumniNetworkCard from "@/components/alumni-network-card"
import { useRouter } from "next/navigation"
import { getProfile } from "@/app/actions/get-profile"
import { getConnections } from "@/app/actions/get-connections"
import { getDiscoverProjects } from "@/app/actions/get-dashboard-data"
import { searchAlumni } from "@/app/actions/search-alumni"
import { createClient } from "@/lib/supabase"

export default function AlumniDashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [connectionRequests, setConnectionRequests] = useState<any[]>([])
  const [studentProjects, setStudentProjects] = useState<any[]>([])
  const [alumniNetwork, setAlumniNetwork] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadAlumniDashboardData() {
      setIsLoading(true)
      try {
        const profileRes = await getProfile()
        if (profileRes.success && profileRes.profile) {
          const currentProfile = profileRes.profile
          setProfile(currentProfile)

          // Fetch connection requests for this alumni
          try {
            const rawConnections = await getConnections()
            if (rawConnections) {
              const formattedRequests = rawConnections
                .filter((conn: any) => conn.status === "PENDING" && conn.receiver_id === currentProfile.id)
                .map((conn: any) => {
                  const senderProfile = conn.profiles_connection_requests_sender_idToprofiles
                  const studentInfo = senderProfile?.student_profiles
                  return {
                    id: conn.id,
                    student: {
                      name: senderProfile?.name || "Student",
                      avatar: senderProfile?.avatar_url || "/placeholder.svg",
                      department: studentInfo?.department || "Engineering",
                      year: studentInfo?.passing_year ? `${studentInfo.passing_year} Grad` : "Student",
                      college: studentInfo?.college || "College",
                    },
                    message: conn.message || "Hi! I would love to connect with you.",
                    interests: studentInfo?.skills || ["Technology"],
                    requestedAt: conn.created_at ? new Date(conn.created_at).toLocaleDateString() : "Recently",
                  }
                })
              setConnectionRequests(formattedRequests)
            }
          } catch (err) {
            console.error("Failed to load connection requests:", err)
          }

          // Fetch student projects from DB
          try {
            const projectsRes = await getDiscoverProjects()
            if (projectsRes.success && projectsRes.projects) {
              const formattedProjects = projectsRes.projects.map((p: any) => ({
                id: p.id,
                student: p.author,
                avatar: "/placeholder.svg",
                title: p.title,
                description: p.description,
                techStack: p.techStack,
                likes: p.likes,
                comments: p.collaborators,
                timeAgo: p.createdAt,
              }))
              setStudentProjects(formattedProjects)
            }
          } catch (err) {
            console.error("Failed to load student projects:", err)
          }

          // Fetch neighboring alumni network profiles
          try {
            const alumniRes = await searchAlumni()
            if (alumniRes) {
              const formattedNetwork = alumniRes
                .filter((a: any) => a.id !== currentProfile.id)
                .map((a: any) => ({
                  id: a.id,
                  name: a.name,
                  role: a.role || "Alumni Mentor",
                  company: a.company || "Technology Leader",
                  passingYear: a.passingYear || "2020",
                  expertise: a.expertise || [],
                  avatar: a.avatar || "/placeholder.svg",
                  mutualConnections: 2,
                }))
              setAlumniNetwork(formattedNetwork.slice(0, 3))
            }
          } catch (err) {
            console.error("Failed to load alumni directory:", err)
          }
        }
      } catch (err) {
        console.error("AlumniDashboard data load error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAlumniDashboardData()

    // 🌐 WebSockets real-time updates — debounced to prevent flooding
    const supabase = createClient()
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        loadAlumniDashboardData()
      }, 2000)
    }

    const channel = supabase
      .channel("alumni-dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "connection_requests" }, debouncedReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, debouncedReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, debouncedReload)
      .subscribe()

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  const stats = [
    {
      label: "Mentorship Requests",
      value: connectionRequests.length.toString(),
      icon: Users,
      change: "Pending review",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      label: "Student Projects",
      value: studentProjects.length.toString(),
      icon: BookOpen,
      change: "Active prototypes",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Alumni Network",
      value: alumniNetwork.length.toString(),
      icon: Star,
      change: "Colleagues active",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      label: "Response Status",
      value: "100%",
      icon: Clock,
      change: "Real-time active",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
  ]

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-8 max-w-[1400px] mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25"
            >
              <Award className="h-3.5 w-3.5 animate-pulse" />
              Verified Collegiate Mentor
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary/80">
              Welcome back, {profile?.name ? profile.name.split(" ")[0] : "Mentor"}!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              You are making an immense difference in student lives. Review new mentorship requests and view ongoing student collegiate projects.
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button 
              onClick={() => setShowCreatePost(true)} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Share Insights
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mentorship Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="bg-card/40 border border-border/40 hover:border-primary/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                          <p className="text-3xl font-extrabold tracking-tight text-foreground transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
                            {stat.value}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-primary animate-pulse" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br border ${stat.color} shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column - Connection Requests & Feed (Span 2) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Connection Requests Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                            <Users className="h-5 w-5 text-primary animate-pulse" />
                            Mentorship Requests
                          </CardTitle>
                          <CardDescription>Motivated students seeking technical & career direction</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push("/dashboard/alumni/connections")}
                          className="bg-transparent hover:bg-primary/10 border-border/60 rounded-xl"
                        >
                          View All ({connectionRequests.length})
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {connectionRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6">
                          <Users className="h-10 w-10 text-primary/40 mb-3" />
                          <p className="text-base font-semibold text-foreground">No pending mentorship requests</p>
                          <p className="text-sm max-w-sm mt-1">Students seeking mentorship will appear here once they send a connection request!</p>
                        </div>
                      ) : (
                        connectionRequests.map((request, index) => (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.08 }}
                            className="group border border-border/30 hover:border-primary/30 bg-card/50 rounded-2xl p-4 transition-all duration-300"
                          >
                            <ConnectionRequestCard request={request} />
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Knowledge Vault & Live Events */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                            <Lightbulb className="h-5 w-5 text-secondary" />
                            Knowledge & Session Hub
                          </CardTitle>
                          <CardDescription>Publish technical guidance articles or schedule AMA workshops</CardDescription>
                        </div>
                        <Button 
                          onClick={() => setShowCreatePost(true)} 
                          className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:scale-[1.02] transition-transform"
                        >
                          <Plus className="h-4 w-4" />
                          Create Post
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="posts" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl">
                          <TabsTrigger value="posts" className="rounded-lg font-medium">Your Publications</TabsTrigger>
                          <TabsTrigger value="sessions" className="rounded-lg font-medium">Scheduled Sessions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="posts" className="space-y-4 outline-none">
                          <div className="p-5 rounded-2xl bg-card/60 border border-border/30 hover:border-primary/20 transition-all duration-300 group relative">
                            <div className="absolute top-4 right-4 text-xs font-semibold text-primary px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20">
                              System Architecture
                            </div>
                            <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                              5 Tips for Scaling PostgreSQL Platforms
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              An actionable system blueprint that covers horizontal read-replicas, index optimization, and connection pooling. Helpful for final projects.
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Published Just Now</span>
                              <div className="flex items-center gap-4">
                                <span>Real-time Sync</span>
                                <span className="text-primary font-medium">Active</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="sessions" className="space-y-4 outline-none">
                          <div className="p-5 rounded-2xl bg-card/60 border border-border/30 flex items-start justify-between relative overflow-hidden group">
                            <div className="space-y-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/25 rounded-full px-2.5 py-0.5 uppercase tracking-wider animate-pulse">
                                Live Workshop
                              </span>
                              <h3 className="font-bold text-foreground text-lg">System Design Blueprint: Microservices</h3>
                              <p className="text-sm text-muted-foreground">Live architectural walkthrough on fault tolerance and microservice patterns.</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                <span>Dec 20, 2026 • 6:00 PM</span>
                                <span>•</span>
                                <span className="text-primary font-semibold">15 students registered</span>
                              </div>
                            </div>
                            <Calendar className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                          </div>

                          <Button
                            variant="outline"
                            className="w-full gap-2 bg-card/40 border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 rounded-xl transition-all duration-300 py-6"
                            onClick={() => alert("Live session scheduler coming in Phase 3!")}
                          >
                            <Calendar className="h-4 w-4 text-primary" />
                            Schedule Live Workshop
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Student Projects Feed */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                            <BookOpen className="h-5 w-5 text-accent" />
                            Student Innovation Hub
                          </CardTitle>
                          <CardDescription>Audit and provide architectural review on active student prototypes</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push("/dashboard/alumni/projects")}
                          className="bg-transparent hover:bg-accent/10 border-border/60 rounded-xl"
                        >
                          Browse All Feed
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {studentProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-4">
                          <BookOpen className="h-8 w-8 text-accent/40 mb-2" />
                          <p className="text-sm font-semibold text-foreground">No student projects shared yet</p>
                          <p className="text-xs mt-1">Collegiate student projects will be displayed here for your audit.</p>
                        </div>
                      ) : (
                        studentProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.08 }}
                            className="group border border-border/30 hover:border-accent/30 bg-card/50 rounded-2xl p-4 transition-all duration-300"
                          >
                            <StudentProjectFeedCard project={project} />
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Alumni Network & Impact Cockpit (Span 1) */}
              <div className="space-y-6">
                
                {/* Alumni Network */}
                <motion.div 
                  initial={{ opacity: 0, x: 15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                            <Users className="h-5 w-5 text-secondary animate-pulse" />
                            Alumni Directory
                          </CardTitle>
                          <CardDescription>Network with fellow collegiate alumni</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {alumniNetwork.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground">
                          No neighboring alumni found in college.
                        </div>
                      ) : (
                        alumniNetwork.map((alumni, index) => (
                          <motion.div
                            key={alumni.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.08 }}
                            className="group border border-border/30 hover:border-secondary/30 bg-card/50 rounded-2xl p-3.5 transition-all duration-300"
                          >
                            <AlumniNetworkCard alumni={alumni} />
                          </motion.div>
                        ))
                      )}
                      <Button
                        variant="outline"
                        className="w-full bg-card/40 border-border/50 text-foreground hover:bg-secondary/10 hover:border-secondary/40 rounded-xl transition-all duration-300 py-5 text-xs font-semibold"
                        onClick={() => router.push("/dashboard/alumni/connections")}
                      >
                        Explore Connections Directory
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mentorship Impact Dashboard */}
                <motion.div 
                  initial={{ opacity: 0, x: 15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                    <CardHeader>
                      <CardTitle className="text-lg font-bold tracking-tight">Your Mentorship Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Successful Connections</span>
                          <span className="font-bold text-primary">94% Success</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: "94%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Student Satisfaction</span>
                          <span className="font-bold text-accent">4.8 / 5 Rating</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent to-secondary" style={{ width: "96%" }} />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-card/60 border border-border/30 mt-4 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-full pointer-events-none" />
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          "Dynamic engineering feedback on architecture saves weeks of refactoring."
                        </p>
                        <p className="text-[10px] text-primary font-bold mt-2.5 text-right">- MIT CS Alumni Network</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions Cockpit */}
                <motion.div 
                  initial={{ opacity: 0, x: 15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.45 }}
                >
                  <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold tracking-tight">Quick Actions Cockpit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 bg-card/40 border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 rounded-xl transition-all duration-300 py-6"
                        onClick={() => router.push("/dashboard/alumni/messages")}
                      >
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Open Message Center
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 bg-card/40 border-border/50 text-foreground hover:bg-accent/10 hover:border-accent/40 rounded-xl transition-all duration-300 py-6"
                        onClick={() => alert("Session Scheduler coming in Phase 3!")}
                      >
                        <Calendar className="h-4 w-4 text-accent" />
                        Schedule AMA Session
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </DashboardLayout>
  )
}
