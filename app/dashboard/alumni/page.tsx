"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Clock, Star, TrendingUp, Plus, Calendar, Lightbulb, BookOpen } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ConnectionRequestCard from "@/components/connection-request-card"
import StudentProjectFeedCard from "@/components/student-project-feed-card"
import CreatePostDialog from "@/components/create-post-dialog"
import AlumniNetworkCard from "@/components/alumni-network-card"
import { useRouter } from "next/navigation"

const mockConnectionRequests = [
  {
    id: "1",
    student: {
      name: "Alex Kumar",
      avatar: "/diverse-students-studying.png",
      department: "Computer Science",
      year: "3rd Year",
      college: "MIT",
    },
    message: "Hi! I'm interested in learning about system design and would love to connect with you.",
    interests: ["System Design", "Cloud Computing", "Backend Development"],
    requestedAt: "2 hours ago",
  },
  {
    id: "2",
    student: {
      name: "Emma Wilson",
      avatar: "/asian-woman-student.jpg",
      department: "Computer Science",
      year: "4th Year",
      college: "MIT",
    },
    message: "I'm preparing for interviews at tech companies and would appreciate your guidance.",
    interests: ["Career Guidance", "Interview Prep", "Product Management"],
    requestedAt: "5 hours ago",
  },
  {
    id: "3",
    student: {
      name: "Raj Patel",
      avatar: "/abstract-geometric-shapes.png",
      department: "Computer Science",
      year: "2nd Year",
      college: "MIT",
    },
    message: "Looking for mentorship in machine learning and AI. Your experience at Google would be invaluable!",
    interests: ["Machine Learning", "AI", "Python"],
    requestedAt: "1 day ago",
  },
]

const mockStudentProjects = [
  {
    id: "1",
    student: "Lisa Chen",
    avatar: "/asian-woman-student.jpg",
    title: "Real-time Collaborative Code Editor",
    description: "Built with WebSockets, React, and Node.js. Looking for feedback on architecture.",
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
    description: "Uses NLP to analyze resumes and provide improvement suggestions. Seeking collaboration.",
    techStack: ["Python", "TensorFlow", "FastAPI", "React"],
    likes: 18,
    comments: 8,
    timeAgo: "6 hours ago",
  },
]

const mockAlumniNetwork = [
  {
    id: "1",
    name: "David Martinez",
    role: "Engineering Manager",
    company: "Amazon",
    passingYear: "2016",
    expertise: ["Team Leadership", "Distributed Systems", "AWS"],
    avatar: "/asian-professional-man.png",
    mutualConnections: 5,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "UX Design Lead",
    company: "Apple",
    passingYear: "2018",
    expertise: ["Design Systems", "User Research", "Prototyping"],
    avatar: "/professional-woman.png",
    mutualConnections: 3,
  },
]

export default function AlumniDashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const router = useRouter()

  const stats = [
    {
      label: "Students Mentored",
      value: "24",
      icon: Users,
      change: "+6 this month",
      color: "text-primary",
    },
    {
      label: "Questions Answered",
      value: "156",
      icon: MessageSquare,
      change: "+12 this week",
      color: "text-accent",
    },
    {
      label: "Avg Response Time",
      value: "2.5h",
      icon: Clock,
      change: "Improved 30%",
      color: "text-secondary",
    },
    {
      label: "Satisfaction Rating",
      value: "4.8",
      icon: Star,
      change: "Top 10% mentor",
      color: "text-chart-4",
    },
  ]

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground text-lg">You're making a difference in students' lives.</p>
        </motion.div>

        {/* Mentorship Stats */}
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
          {/* Left Column - Connection Requests & Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Requests */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Connection Requests
                      </CardTitle>
                      <CardDescription>Students want to connect with you</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/alumni/connections")}>
                      View All ({mockConnectionRequests.length})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockConnectionRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <ConnectionRequestCard request={request} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Guidance Posts & Resources */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-secondary" />
                        Share Your Knowledge
                      </CardTitle>
                      <CardDescription>Post guidance articles and schedule sessions</CardDescription>
                    </div>
                    <Button onClick={() => setShowCreatePost(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="posts" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="posts">Your Posts</TabsTrigger>
                      <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts" className="space-y-3">
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <h3 className="font-semibold text-foreground mb-2">5 Tips for Cracking Tech Interviews</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Essential strategies I learned from conducting 100+ interviews...
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Posted 2 days ago</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">45 views</span>
                            <span className="text-muted-foreground">12 likes</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Career Growth in Tech: My Journey</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          From junior developer to senior engineer in 5 years...
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Posted 1 week ago</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">89 views</span>
                            <span className="text-muted-foreground">23 likes</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="sessions" className="space-y-3">
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">System Design Workshop</h3>
                            <p className="text-sm text-muted-foreground">Live Q&A on distributed systems</p>
                          </div>
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Dec 20, 2024 • 6:00 PM</span>
                          <span>•</span>
                          <span>15 registered</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 bg-transparent"
                        onClick={() => alert("Session scheduling coming soon!")}
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule New Session
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Student Projects Feed */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-accent" />
                        Student Projects
                      </CardTitle>
                      <CardDescription>Discover and help students with their projects</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/alumni/projects")}>
                      Browse All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStudentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
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

          {/* Right Column - Alumni Network & Quick Actions */}
          <div className="space-y-6">
            {/* Alumni Network */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-secondary" />
                        Alumni Network
                      </CardTitle>
                      <CardDescription>Connect with fellow alumni</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAlumniNetwork.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <AlumniNetworkCard alumni={alumni} />
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/dashboard/alumni/connections")}
                  >
                    Explore Network
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mentorship Impact */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="glass border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Connection Success Rate</span>
                      <span className="font-semibold text-foreground">94%</span>
                    </div>
                    <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Student Satisfaction</span>
                      <span className="font-semibold text-foreground">4.8/5</span>
                    </div>
                    <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: "96%" }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-card/50 border border-border/50 mt-4">
                    <p className="text-sm text-muted-foreground italic">
                      "Sarah's guidance was instrumental in landing my dream job at Google. Thank you!"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">- Alex K., CS '24</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => router.push("/dashboard/alumni/messages")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    View All Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => alert("Session scheduling coming soon!")}
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Session
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="lg"
                    onClick={() => alert("Resource sharing coming soon!")}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Share Resources
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </DashboardLayout>
  )
}
