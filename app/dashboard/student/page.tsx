"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Award,
  Zap,
  Target
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"
import QuestionCard from "@/components/question-card"
import ProjectCard from "@/components/project-card"
import AskQuestionDialog from "@/components/ask-question-dialog"
import { useRouter } from "next/navigation"

// Mock highly compatible alumni with Match Scores for the AI-matching engine UI
const mockAIMatches = [
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
    matchScore: 98,
    matchReason: "Shares 3 high-demand skills & same MIT Computer Science background"
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
    matchScore: 94,
    matchReason: "Shares Python interest & 2 successful joint student-alumni hackathons"
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
    matchScore: 89,
    matchReason: "Perfect match for your interest in product engineering & tech product management"
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
    { label: "Connected Alumni", value: "12", icon: Users, change: "+3 this week", color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30" },
    { label: "Questions Asked", value: "8", icon: MessageSquare, change: "2 answered", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
    { label: "Projects Shared", value: "3", icon: Briefcase, change: "1 new collab", color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30" },
    { label: "Pending Requests", value: "5", icon: Clock, change: "2 responses", color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
  ]

  return (
    <DashboardLayout role="student">
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
              <Sparkles className="h-3.5 w-3.5" />
              AI Matcher Active
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary/80">
              Welcome back, John!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Connect with alumni who went to MIT, share similar engineering expertise, and kickstart your dream career.
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button 
              onClick={() => router.push("/dashboard/student/search")} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Find Alumni
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
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
          
          {/* Left Column - AI Recommendation Engine & Discussions (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Smart Matcher Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Zap className="h-4 w-4 text-primary animate-pulse" />
                        </div>
                        AI Smart-Match Recommendations
                      </CardTitle>
                      <CardDescription>Intelligent compatibility suggestions based on your profile interests</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push("/dashboard/student/search")}
                      className="bg-transparent hover:bg-primary/10 border-border/60 rounded-xl"
                    >
                      Refine Interests
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {mockAIMatches.map((alumni, index) => (
                      <motion.div
                        key={alumni.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.08 }}
                        className="relative group border border-border/30 hover:border-primary/40 bg-card/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
                      >
                        {/* Match Score Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 py-1 px-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/20 shadow-sm">
                          <Target className="h-3 w-3 text-primary" />
                          <span className="text-xs font-bold text-primary">{alumni.matchScore}% Match</span>
                        </div>
                        
                        <AlumniCard alumni={alumni} />
                        
                        {/* AI Match reasoning sub-text */}
                        <div className="mt-3 pt-3 border-t border-border/20 flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-3 py-2 rounded-xl">
                          <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="italic leading-snug">{alumni.matchReason}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Community & Discussions */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold tracking-tight">Q&A Discussion Forum</CardTitle>
                      <CardDescription>Get expert career advice directly from alumni engineers</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowAskQuestion(true)} 
                      className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:scale-[1.02] transition-transform"
                    >
                      <Plus className="h-4 w-4" />
                      Ask Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recent" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl">
                      <TabsTrigger value="recent" className="rounded-lg font-medium">Recent Questions</TabsTrigger>
                      <TabsTrigger value="trending" className="rounded-lg font-medium">Trending Debates</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recent" className="space-y-4 outline-none">
                      {mockQuestions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                        >
                          <QuestionCard question={question} />
                        </motion.div>
                      ))}
                    </TabsContent>
                    <TabsContent value="trending" className="space-y-4 outline-none">
                      {mockQuestions.slice().reverse().map((question) => (
                        <QuestionCard key={question.id} question={question} />
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Projects & Quick Actions (Span 1) */}
          <div className="space-y-6">
            
            {/* Student Projects Hub */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.35 }}
            >
              <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                        <Briefcase className="h-5 w-5 text-secondary" />
                        Collaborative Projects
                      </CardTitle>
                      <CardDescription>Showcase portfolio ideas for alumni feedback</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent hover:bg-secondary/10 border-border/60 rounded-xl"
                      onClick={() => router.push("/dashboard/student/projects")}
                    >
                      <Plus className="h-4 w-4 text-secondary" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions Cockpit */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card/30 border border-border/40 backdrop-blur-sm shadow-xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold tracking-tight">Quick Actions Cockpit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 bg-card/40 border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 rounded-xl transition-all duration-300 py-6"
                    onClick={() => router.push("/dashboard/student/search")}
                  >
                    <Users className="h-4 w-4 text-primary" />
                    Browse Alumni Network
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 bg-card/40 border-border/50 text-foreground hover:bg-accent/10 hover:border-accent/40 rounded-xl transition-all duration-300 py-6"
                    onClick={() => alert("Career Resource Vault coming in Phase 3!")}
                  >
                    <BookOpen className="h-4 w-4 text-accent" />
                    Career Resource Vault
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 bg-card/40 border-border/50 text-foreground hover:bg-secondary/10 hover:border-secondary/40 rounded-xl transition-all duration-300 py-6"
                    onClick={() => router.push("/dashboard/student/messages")}
                  >
                    <MessageSquare className="h-4 w-4 text-secondary" />
                    Chat Inbox
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
