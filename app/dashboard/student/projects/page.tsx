"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, TrendingUp, Users, Heart, Briefcase, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ProjectCard from "@/components/project-card"
import CreateProjectDialog from "@/components/create-project-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDiscoverProjects } from "@/app/actions/get-dashboard-data"
import { getProfile } from "@/app/actions/get-profile"

export default function ProjectsPage() {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [techFilter, setTechFilter] = useState("all")
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadProjects() {
    setIsLoading(true)
    try {
      const profileRes = await getProfile()
      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile)
      }

      const res = await getDiscoverProjects()
      if (res.success && res.projects) {
        setProjects(res.projects)
      }
    } catch (err) {
      console.error("Failed to load projects:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreateSuccess = () => {
    loadProjects()
  }

  // Filter project lists
  const myName = profile?.name || ""
  const myProjects = projects.filter(p => p.author === myName)
  const discoverProjects = projects.filter(p => p.author !== myName)

  const filteredMyProjects = myProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "in-progress") return matchesSearch && p.status === "In Progress"
    if (statusFilter === "completed") return matchesSearch && p.status === "Completed"
    if (statusFilter === "looking") return matchesSearch && p.status === "Looking for Contributors"
    return matchesSearch
  })

  const filteredDiscoverProjects = discoverProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.techStack.some((tech: string) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground text-lg">Showcase your work and collaborate with peers</p>
            </div>
            <Button onClick={() => setShowCreateProject(true)} className="gap-2" size="lg">
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Your Projects</p>
                        <p className="text-3xl font-bold text-foreground">{myProjects.length}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-card text-primary">
                        <Briefcase className="h-6 w-6" />
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
                        <p className="text-sm text-muted-foreground mb-1">Discoverable Hub</p>
                        <p className="text-3xl font-bold text-foreground">{discoverProjects.length}</p>
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
                        <p className="text-sm text-muted-foreground mb-1">Total Network Projects</p>
                        <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-card text-secondary">
                        <Heart className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Tabs defaultValue="my-projects" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>

                <TabsContent value="my-projects" className="space-y-4">
                  {/* Search and Filters */}
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Search your projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background border-border"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48 bg-background">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="looking">Looking for Contributors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects Grid */}
                  {filteredMyProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6 bg-card/10">
                      <Briefcase className="h-12 w-12 text-primary/30 mb-3" />
                      <p className="text-base font-semibold text-foreground">No projects found</p>
                      <p className="text-sm max-w-xs mt-1">Get started by sharing your first project idea to find partners!</p>
                      <Button onClick={() => setShowCreateProject(true)} className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Create Project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMyProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProjectCard project={project} showEdit />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="discover" className="space-y-4">
                  {/* Search and Filters */}
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Search projects by title, tech stack..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background border-border"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Discover Projects */}
                  {filteredDiscoverProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6 bg-card/10">
                      <Users className="h-12 w-12 text-accent/30 mb-3" />
                      <p className="text-base font-semibold text-foreground">No community projects found</p>
                      <p className="text-sm max-w-xs mt-1">Check back later or search for other keywords.</p>
                    </div>
                  ) : (
                    <Card className="glass border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Trending Projects
                        </CardTitle>
                        <CardDescription>Popular projects shared by the community</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {filteredDiscoverProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <ProjectCard project={project} showAuthor />
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </div>

      <CreateProjectDialog 
        open={showCreateProject} 
        onOpenChange={setShowCreateProject} 
        onSuccess={handleCreateSuccess}
      />
    </DashboardLayout>
  )
}
