"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Briefcase, Clock, TrendingUp, Plus, Sparkles, BookOpen } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"
import QuestionCard from "@/components/question-card"
import ProjectCard from "@/components/project-card"
import AskQuestionDialog from "@/components/ask-question-dialog"
import { useRouter } from "next/navigation"

// Mock data
const mockAlumni = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2018",
    expertise: ["React", "System Design", "Cloud Architecture"],
    avatar: "/professional-woman.png",
    isConnected: false,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2017",
    expertise: ["Product Strategy", "User Research", "Agile"],
    avatar: "/asian-professional-man.png",
    isConnected: false,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Machine Learning Engineer",
    company: "Tesla",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2019",
    expertise: ["Deep Learning", "Python", "TensorFlow"],
    avatar: "/woman-engineer-at-work.png",
    isConnected: true,
  },
]

const mockQuestions = [
  {
    id: "1",
    author: "Alex Kumar",
    avatar: "/diverse-students-studying.png",
    question: "How do I prepare for system design interviews at FAANG companies?",
    tags: ["Career", "Interviews", "System Design"],
    likes: 24,
    comments: 8,
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    author: "Lisa Park",
    avatar: "/asian-woman-student.jpg",
    question: "What are the best practices for contributing to open source projects?",
    tags: ["Open Source", "GitHub", "Career"],
    likes: 15,
    comments: 5,
    timeAgo: "5 hours ago",
  },
]

const mockProjects = [
  {
    id: "1",
    title: "AI-Powered Code Review Tool",
    description: "Automated code review using machine learning to detect bugs and suggest improvements",
    techStack: ["Python", "TensorFlow", "React", "FastAPI"],
    status: "In Progress",
    collaborators: 3,
    likes: 45,
  },
  {
    id: "2",
    title: "Campus Event Management System",
    description: "Platform for organizing and managing college events with real-time updates",
    techStack: ["Next.js", "Firebase", "Tailwind"],
    status: "Looking for Contributors",
    collaborators: 2,
    likes: 32,
  },
]

export default function StudentDashboard() {
  const [showAskQuestion, setShowAskQuestion] = useState(false)
  const router = useRouter()

  const stats = [
    { label: "Connected Alumni", value: "12", icon: Users, change: "+3 this week", color: "text-primary" },
    { label: "Questions Asked", value: "8", icon: MessageSquare, change: "2 answered", color: "text-accent" },
    { label: "Projects Shared", value: "3", icon: Briefcase, change: "1 new collab", color: "text-secondary" },
    { label: "Pending Requests", value: "5", icon: Clock, change: "2 responses", color: "text-chart-3" },
  ]

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground text-lg">Here's what's happening with your connections today.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-card ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Alumni Connections & Questions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auto-Connection Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Alumni from Your College
                      </CardTitle>
                      <CardDescription>Connect with alumni who share your background</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/student/connections")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlumni.map((alumni, index) => (
                      <motion.div
                        key={alumni.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <AlumniCard alumni={alumni} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ask Question & Recent Discussions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Discussion Forum</CardTitle>
                      <CardDescription>Ask questions and engage with the community</CardDescription>
                    </div>
                    <Button onClick={() => setShowAskQuestion(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ask Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recent" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recent" className="space-y-4">
                      {mockQuestions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <QuestionCard question={question} />
                        </motion.div>
                      ))}
                    </TabsContent>
                    <TabsContent value="trending" className="space-y-4">
                      {mockQuestions.map((question) => (
                        <QuestionCard key={question.id} question={question} />
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Projects */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-secondary" />
                        Your Projects
                      </CardTitle>
                      <CardDescription>Showcase your work</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push("/dashboard/student/projects")}
                    >
                      <Plus className="h-4 w-4" />
                      New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="glass border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => router.push("/dashboard/student/connections")}
                  >
                    <Users className="h-4 w-4" />
                    Browse Alumni Network
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => alert("Resources page coming soon!")}
                  >
                    <BookOpen className="h-4 w-4" />
                    View Resources
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => router.push("/dashboard/student/messages")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    My Messages
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <AskQuestionDialog open={showAskQuestion} onOpenChange={setShowAskQuestion} />
    </DashboardLayout>
  )
}
