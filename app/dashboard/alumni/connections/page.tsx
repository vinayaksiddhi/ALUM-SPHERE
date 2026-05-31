"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MessageSquare, GraduationCap } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getConnections, updateConnectionStatus } from "@/app/actions/get-connections"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"

export default function AlumniConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  
  const [connections, setConnections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserProfileId, setCurrentUserProfileId] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch current user's profile ID
        const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_id', user.id).single()
        if (profile) setCurrentUserProfileId(profile.id)
      }
      
      const data = await getConnections()
      setConnections(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load connections.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // 🌐 WebSockets real-time updates — debounced
    const supabase = createClient()
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => { fetchData() }, 2000)
    }

    const channel = supabase
      .channel("alumni-connections-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "connection_requests" }, debouncedReload)
      .subscribe()

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  const handleUpdateStatus = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await updateConnectionStatus(id, status)
      if (res.success) {
        toast.success(`Request ${status.toLowerCase()}`)
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const incomingRequests = connections.filter(c => c.receiver_id === currentUserProfileId && c.status === "PENDING")
  const acceptedConnections = connections.filter(c => c.status === "ACCEPTED")

  const mentoringStudents = acceptedConnections.filter(c => {
    const otherPerson = c.sender_id === currentUserProfileId ? c.profiles_connection_requests_receiver_idToprofiles : c.profiles_connection_requests_sender_idToprofiles
    return otherPerson?.role === "STUDENT"
  })

  const otherAlumni = acceptedConnections.filter(c => {
    const otherPerson = c.sender_id === currentUserProfileId ? c.profiles_connection_requests_receiver_idToprofiles : c.profiles_connection_requests_sender_idToprofiles
    return otherPerson?.role === "ALUMNI"
  })

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">My Network</h1>
          <p className="text-muted-foreground text-lg">Manage your connections with students and fellow alumni</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Students Mentoring</p>
                    <p className="text-3xl font-bold text-foreground">{mentoringStudents.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Alumni Connections</p>
                    <p className="text-3xl font-bold text-foreground">
                      {otherAlumni.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-accent">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Chats</p>
                    <p className="text-3xl font-bold text-foreground">{acceptedConnections.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-secondary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, year, interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-40 bg-background">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="requests">Requests ({incomingRequests.length})</TabsTrigger>
              <TabsTrigger value="students">Students ({mentoringStudents.length})</TabsTrigger>
              <TabsTrigger value="alumni">Alumni ({otherAlumni.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Incoming Requests
                  </CardTitle>
                  <CardDescription>People who want to connect with you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                  ) : incomingRequests.length === 0 ? (
                     <div className="text-center p-8 text-muted-foreground">No pending requests.</div>
                  ) : (
                    incomingRequests.map((req, index) => {
                      const sender = req.profiles_connection_requests_sender_idToprofiles
                      const senderProfile = sender.role === "STUDENT" ? sender.student_profiles : sender.alumni_profiles
                      return (
                      <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                        <Card className="glass border-border/50">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={sender?.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">{sender?.name}</h3>
                                <p className="text-sm text-muted-foreground">{sender?.role === "STUDENT" ? "Student" : "Alumni"} at {senderProfile?.college}</p>
                                <div className="mt-2 flex gap-2">
                                   <Button size="sm" onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}>Accept</Button>
                                   <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(req.id, "REJECTED")}>Decline</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )})
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Students You're Mentoring
                  </CardTitle>
                  <CardDescription>Students connected to you for guidance and mentorship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                  ) : mentoringStudents.length === 0 ? (
                     <div className="text-center p-8 text-muted-foreground">No students connected yet.</div>
                  ) : (
                    mentoringStudents.map((conn, index) => {
                      const studentUser = conn.sender_id === currentUserProfileId ? conn.profiles_connection_requests_receiver_idToprofiles : conn.profiles_connection_requests_sender_idToprofiles
                      const studentData = studentUser.student_profiles
                      return (
                      <motion.div
                        key={conn.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className="glass border-border/50 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={studentUser.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {studentUser.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground">{studentUser.name}</h3>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                      {studentData?.department}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">{studentData?.college}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {studentData?.skills?.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )})
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alumni" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Fellow Alumni Network
                  </CardTitle>
                  <CardDescription>Connect with other alumni from your college</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                  ) : otherAlumni.length === 0 ? (
                     <div className="text-center p-8 text-muted-foreground">No alumni connected yet.</div>
                  ) : (
                    otherAlumni.map((conn, index) => {
                      const alumniUser = conn.sender_id === currentUserProfileId ? conn.profiles_connection_requests_receiver_idToprofiles : conn.profiles_connection_requests_sender_idToprofiles
                      const alumniData = alumniUser.alumni_profiles
                      return (
                      <motion.div
                        key={conn.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className="glass border-border/50 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={alumniUser.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {alumniUser.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground">{alumniUser.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {alumniData?.job_title} at {alumniData?.company}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                      Class of {alumniData?.passing_year}
                                    </Badge>
                                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                      {alumniData?.department}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {alumniData?.expertise?.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      View Profile
                                    </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )})
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
