"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Edit,
  Share2,
  MessageSquare,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("about")

  const stats = [
    { label: "Connections", value: "45" },
    { label: "Questions Asked", value: "12" },
    { label: "Projects", value: "8" },
    { label: "Answers Received", value: "89" },
  ]

  const skills = ["React", "TypeScript", "Node.js", "Python", "Machine Learning", "SQL", "AWS", "Git"]

  const projects = [
    {
      title: "AI-Powered Task Manager",
      description: "A smart task management app using GPT-4 for intelligent scheduling",
      tech: ["React", "TypeScript", "OpenAI"],
      likes: 45,
    },
    {
      title: "Real-time Collaboration Tool",
      description: "WebRTC-based collaboration platform for remote teams",
      tech: ["Next.js", "WebRTC", "Socket.io"],
      likes: 32,
    },
  ]

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/student/settings")}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-lg">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Change Photo
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
                <p className="text-muted-foreground">Computer Science Student</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Massachusetts Institute of Technology</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Class of 2025</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Boston, MA</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>john.doe@mit.edu</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bio</h3>
              <p className="text-muted-foreground leading-relaxed">
                Passionate computer science student with a keen interest in artificial intelligence and machine
                learning. Currently working on innovative projects that combine cutting-edge technology with real-world
                applications. Always eager to learn from experienced professionals and contribute to meaningful
                projects.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Education</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Bachelor of Science in Computer Science</h4>
                    <p className="text-sm text-muted-foreground">Massachusetts Institute of Technology</p>
                    <p className="text-sm text-muted-foreground">2021 - 2025 • GPA: 3.8/4.0</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {["AI/ML", "Web Development", "Cloud Computing", "Open Source", "Startups"].map((interest) => (
                  <Badge key={interest} variant="outline" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{project.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>12 comments</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      Asked a question about <span className="font-medium">React Server Components</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3 pb-4 border-b border-border">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      Published a new project <span className="font-medium">AI Task Manager</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      Connected with <span className="font-medium">Sarah Johnson</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
