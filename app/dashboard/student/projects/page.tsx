"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, TrendingUp, Users, Heart, Briefcase } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ProjectCard from "@/components/project-card"
import CreateProjectDialog from "@/components/create-project-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockProjects = [
  {
    id: "1",
    title: "AI-Powered Code Review Tool",
    description: "Automated code review using machine learning to detect bugs and suggest improvements",
    techStack: ["Python", "TensorFlow", "React", "FastAPI"],
    status: "In Progress",
    collaborators: 3,
    likes: 45,
    author: "You",
    createdAt: "2 weeks ago",
  },
  {
    id: "2",
    title: "Campus Event Management System",
    description: "Platform for organizing and managing college events with real-time updates",
    techStack: ["Next.js", "Firebase", "Tailwind"],
    status: "Looking for Contributors",
    collaborators: 2,
    likes: 32,
    author: "You",
    createdAt: "1 month ago",
  },
  {
    id: "3",
    title: "Smart Study Planner",
    description: "AI-driven study schedule optimizer based on learning patterns",
    techStack: ["React Native", "Node.js", "MongoDB"],
    status: "Completed",
    collaborators: 1,
    likes: 28,
    author: "You",
    createdAt: "3 months ago",
  },
]

const mockDiscoverProjects = [
  {
    id: "4",
    title: "Blockchain Voting System",
    description: "Secure and transparent voting platform using blockchain technology",
    techStack: ["Solidity", "Web3.js", "React"],
    status: "Looking for Contributors",
    collaborators: 4,
    likes: 67,
    author: "Alex Kumar",
    createdAt: "1 week ago",
  },
  {
    id: "5",
    title: "Mental Health Chatbot",
    description: "AI chatbot providing mental health support and resources for students",
    techStack: ["Python", "NLP", "Flask", "React"],
    status: "In Progress",
    collaborators: 5,
    likes: 89,
    author: "Emma Wilson",
    createdAt: "3 days ago",
  },
]

export default function ProjectsPage() {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [techFilter, setTechFilter] = useState("all")

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Projects</p>
                    <p className="text-3xl font-bold text-foreground">{mockProjects.length}</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Total Collaborators</p>
                    <p className="text-3xl font-bold text-foreground">6</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Total Likes</p>
                    <p className="text-3xl font-bold text-foreground">105</p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <ProjectCard project={project} showEdit />
                  </motion.div>
                ))}
              </div>
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
                    <Select value={techFilter} onValueChange={setTechFilter}>
                      <SelectTrigger className="w-48 bg-background">
                        <SelectValue placeholder="Technology" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tech</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="node">Node.js</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Projects */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trending Projects
                  </CardTitle>
                  <CardDescription>Popular projects from the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockDiscoverProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <ProjectCard project={project} showAuthor />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <CreateProjectDialog open={showCreateProject} onOpenChange={setShowCreateProject} />
    </DashboardLayout>
  )
}
