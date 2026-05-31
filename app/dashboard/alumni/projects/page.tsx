"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, TrendingUp, HandHeart, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import StudentProjectFeedCard from "@/components/student-project-feed-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDiscoverProjects } from "@/app/actions/get-dashboard-data"
import { createClient } from "@/lib/supabase"

export default function AlumniProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [techFilter, setTechFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchProjects = async () => {
    try {
      const res = await getDiscoverProjects()
      if (res.success && res.projects) {
        setProjects(res.projects)
      }
    } catch (err) {
      console.error("Alumni projects load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()

    // 🌐 WebSockets real-time updates for projects
    const channel = supabase
      .channel("alumni-projects-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchProjects()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech: string) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTech =
      techFilter === "all" ||
      project.techStack.some((tech: string) => tech.toLowerCase() === techFilter.toLowerCase())

    return matchesSearch && matchesTech
  })

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Student Projects</h1>
          <p className="text-muted-foreground text-lg">Discover innovative projects and offer your guidance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Projects Shared</p>
                    <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-primary">
                    <HandHeart className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">Total Tech Stacks</p>
                    <p className="text-3xl font-bold text-foreground">
                      {Array.from(new Set(projects.flatMap((p) => p.techStack))).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-accent">
                    <MessageSquare className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">Live Updates</p>
                    <p className="text-3xl font-bold text-foreground">Realtime</p>
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
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search projects by title, technology, or student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={techFilter} onValueChange={setTechFilter}>
                    <SelectTrigger className="w-48 bg-background text-foreground">
                      <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tech</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="ai">AI/ML</SelectItem>
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

        {/* Projects Feed */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription>Help students improve their projects with your expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">No student projects found.</p>
              ) : (
                filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StudentProjectFeedCard
                      project={{
                        id: project.id,
                        student: project.author,
                        authorId: project.authorId,
                        avatar: "/placeholder.svg",
                        title: project.title,
                        description: project.description,
                        techStack: project.techStack,
                        likes: project.likes,
                        comments: 0,
                        timeAgo: project.createdAt,
                      }}
                    />
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
