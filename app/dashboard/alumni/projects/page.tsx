"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, TrendingUp, HandHeart, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import StudentProjectFeedCard from "@/components/student-project-feed-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockStudentProjects = [
  {
    id: "1",
    student: "Lisa Chen",
    avatar: "/asian-woman-student.jpg",
    title: "Real-time Collaborative Code Editor",
    description: "Built with WebSockets, React, and Node.js. Looking for feedback on architecture and scalability.",
    techStack: ["React", "Node.js", "WebSocket", "MongoDB"],
    likes: 23,
    comments: 5,
    timeAgo: "3 hours ago",
  },
  {
    id: "2",
    student: "Michael Brown",
    avatar: "/diverse-students-studying.png",
    title: "AI-Powered Resume Analyzer",
    description:
      "Uses NLP to analyze resumes and provide improvement suggestions. Need help with ML model optimization.",
    techStack: ["Python", "TensorFlow", "FastAPI", "React"],
    likes: 18,
    comments: 8,
    timeAgo: "6 hours ago",
  },
  {
    id: "3",
    student: "Raj Patel",
    avatar: "/abstract-geometric-shapes.png",
    title: "Blockchain Voting System",
    description: "Secure and transparent voting platform. Seeking guidance on smart contract security best practices.",
    techStack: ["Solidity", "Web3.js", "React", "Hardhat"],
    likes: 34,
    comments: 12,
    timeAgo: "1 day ago",
  },
  {
    id: "4",
    student: "Emma Wilson",
    avatar: "/asian-woman-student.jpg",
    title: "Mental Health Support Bot",
    description: "AI chatbot for mental health support. Looking for feedback on conversation design and ethics.",
    techStack: ["Python", "NLP", "Flask", "React"],
    likes: 45,
    comments: 15,
    timeAgo: "2 days ago",
  },
]

export default function AlumniProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [techFilter, setTechFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

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
                    <p className="text-sm text-muted-foreground mb-1">Projects Reviewed</p>
                    <p className="text-3xl font-bold text-foreground">28</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Feedback Given</p>
                    <p className="text-3xl font-bold text-foreground">156</p>
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
                    <p className="text-sm text-muted-foreground mb-1">New This Week</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
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
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={techFilter} onValueChange={setTechFilter}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tech</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="ai">AI/ML</SelectItem>
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
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription>Help students improve their projects with your expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStudentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <StudentProjectFeedCard project={project} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
