"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Filter, Users, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getConnections } from "@/app/actions/get-connections"
import { searchAlumni } from "@/app/actions/search-alumni"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  const [suggestedAlumni, setSuggestedAlumni] = useState<any[]>([])
  const [connectedAlumni, setConnectedAlumni] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        let currentUserProfileId = ""
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_id', user.id).single()
          if (profile) currentUserProfileId = profile.id
        }

        const [connections, allAlumni] = await Promise.all([
          getConnections(),
          searchAlumni()
        ])

        const acceptedConnections = connections.filter(c => c.status === "ACCEPTED")
        
        // Map connected alumni to AlumniCard format
        const mappedConnected = acceptedConnections.map(c => {
          const alumniUser = c.sender_id === currentUserProfileId ? c.profiles_connection_requests_receiver_idToprofiles : c.profiles_connection_requests_sender_idToprofiles
          if (!alumniUser) return null;
          const alumniData = alumniUser.alumni_profiles
          return {
            id: alumniUser.id,
            name: alumniUser.name,
            role: alumniData?.job_title || "Alumni",
            company: alumniData?.company || "Unknown Company",
            college: alumniData?.college,
            department: alumniData?.department,
            passingYear: alumniData?.passing_year?.toString() || "",
            expertise: alumniData?.expertise || [],
            avatar: alumniUser.avatar_url || "/placeholder.svg?height=100&width=100",
            isConnected: true,
            matchScore: 90
          }
        }).filter(Boolean) as any[]

        setConnectedAlumni(mappedConnected)
        
        // Exclude connected from suggested
        const connectedIds = new Set(mappedConnected.map(a => a.id))
        setSuggestedAlumni(allAlumni.filter(a => !connectedIds.has(a.id) && a.matchScore > 50).slice(0, 10))
        
      } catch (error) {
        toast.error("Failed to fetch connections")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()

    // 🌐 WebSockets real-time updates — debounced
    const supabase = createClient()
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => { fetchData() }, 2000)
    }

    const channel = supabase
      .channel("student-connections-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "connection_requests" }, debouncedReload)
      .subscribe()

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Connections</h1>
          <p className="text-muted-foreground text-lg">Discover and connect with alumni from your college</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Connected Alumni</p>
                    <p className="text-3xl font-bold text-foreground">{connectedAlumni.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-primary">
                    <Users className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">New Suggestions</p>
                    <p className="text-3xl font-bold text-foreground">{suggestedAlumni.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-accent">
                    <Sparkles className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
                    <p className="text-3xl font-bold text-foreground">
                      {suggestedAlumni.length > 0 ? Math.round(suggestedAlumni.reduce((sum, a) => sum + a.matchScore, 0) / suggestedAlumni.length) : 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-secondary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, company, expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
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
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Suggested and Connected */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="suggested" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="suggested">
                Suggested ({suggestedAlumni.length})
              </TabsTrigger>
              <TabsTrigger value="connected">Connected ({connectedAlumni.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="suggested" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Alumni matched based on your college, department, and interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                  ) : suggestedAlumni.length === 0 ? (
                     <div className="text-center p-8 text-muted-foreground">No suggestions found.</div>
                  ) : (
                  suggestedAlumni
                    .map((alumni, index) => (
                      <motion.div
                        key={alumni.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="space-y-3">
                          <AlumniCard alumni={alumni} />
                          <div className="flex items-center gap-2 px-4">
                            <div className="flex-1 bg-background rounded-lg p-3 border border-border/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">Match Score</span>
                                <span className="text-sm font-bold text-primary">{alumni.matchScore}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${alumni.matchScore}%` }}
                                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connected" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Your Network
                  </CardTitle>
                  <CardDescription>Alumni you're connected with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                  ) : connectedAlumni.length === 0 ? (
                     <div className="text-center p-8 text-muted-foreground">No alumni connected yet.</div>
                  ) : (
                  connectedAlumni.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <AlumniCard alumni={alumni} />
                    </motion.div>
                  ))
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
