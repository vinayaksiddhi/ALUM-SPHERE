"use client"

import { useState, useEffect } from "react"
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
  Target,
  Loader2
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"
import QuestionCard from "@/components/question-card"
import ProjectCard from "@/components/project-card"
import AskQuestionDialog from "@/components/ask-question-dialog"
import { useRouter } from "next/navigation"
import { getProfile } from "@/app/actions/get-profile"
import { searchAlumni } from "@/app/actions/search-alumni"
import { getQuestions, getDiscoverProjects } from "@/app/actions/get-dashboard-data"
import { createClient } from "@/lib/supabase"

export default function StudentDashboard() {
  const [showAskQuestion, setShowAskQuestion] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [alumniMatches, setAlumniMatches] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true)
      try {
        const profileRes = await getProfile()
        if (profileRes.success && profileRes.profile) {
          setProfile(profileRes.profile)
        }

        // Fetch matching alumni from database
        try {
          const alumniRes = await searchAlumni()
          if (alumniRes) {
            setAlumniMatches(alumniRes.slice(0, 3))
          }
        } catch (err) {
          console.error("Failed to load alumni recommendations:", err)
        }

        // Fetch live Q&A questions from database
        const questionsRes = await getQuestions()
        if (questionsRes.success && questionsRes.questions) {
          setQuestions(questionsRes.questions)
        }

        // Fetch live projects from database
        const projectsRes = await getDiscoverProjects()
        if (projectsRes.success && projectsRes.projects) {
          setProjects(projectsRes.projects.slice(0, 3))
        }
      } catch (err) {
        console.error("StudentDashboard data load error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()

    // 🌐 WebSockets real-time updates — debounced to prevent flooding
    const supabase = createClient()
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        loadDashboardData()
      }, 2000)
    }

    const channel = supabase
      .channel("student-dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, debouncedReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, debouncedReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "connection_requests" }, debouncedReload)
      .subscribe()

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  const stats = [
    { label: "Connected Alumni", value: alumniMatches.filter(a => a.isConnected).length.toString(), icon: Users, change: "Real-time sync", color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30" },
    { label: "Questions Asked", value: questions.length.toString(), icon: MessageSquare, change: "In discussion", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
    { label: "Projects Shared", value: projects.length.toString(), icon: Briefcase, change: "Collabs active", color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30" },
    { label: "Total Matches", value: alumniMatches.length.toString(), icon: Clock, change: "Compatible mentors", color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
  ]

  const handleQuestionSuccess = async () => {
    // Reload questions dynamically
    const questionsRes = await getQuestions()
    if (questionsRes.success && questionsRes.questions) {
      setQuestions(questionsRes.questions)
    }
  }

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
              Welcome back, {profile?.name ? profile.name.split(" ")[0] : "Student"}!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Connect with alumni who went to your college, share similar engineering expertise, and kickstart your dream career.
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

        {isLoading ? (
          <div className="flex h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                        {alumniMatches.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6">
                            <Sparkles className="h-10 w-10 text-primary/40 mb-3 animate-pulse" />
                            <p className="text-base font-semibold text-foreground">No alumni matches found yet</p>
                            <p className="text-sm max-w-sm mt-1">Once alumni from your college register, they will appear here as high-compatibility matches based on your skills & department!</p>
                          </div>
                        ) : (
                          alumniMatches.map((alumni, index) => (
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
                                <span className="italic leading-snug">
                                  Compatible match for department {alumni.department || "engineering"}{alumni.expertise?.length ? ` and skills in ${alumni.expertise.join(", ")}` : ""}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        )}
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
                          {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6">
                              <MessageSquare className="h-10 w-10 text-primary/40 mb-3" />
                              <p className="text-base font-semibold text-foreground">No questions in the forum yet</p>
                              <p className="text-sm max-w-sm mt-1">Be the first to spark a discussion! Click "Ask Question" to publish a post to the alumni network.</p>
                            </div>
                          ) : (
                            questions.map((question, index) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                              >
                                <QuestionCard question={question} />
                              </motion.div>
                            ))
                          )}
                        </TabsContent>
                        <TabsContent value="trending" className="space-y-4 outline-none">
                          {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-6">
                              <MessageSquare className="h-10 w-10 text-primary/40 mb-3" />
                              <p className="text-base font-semibold text-foreground">No trending questions yet</p>
                            </div>
                          ) : (
                            questions.slice().reverse().map((question) => (
                              <QuestionCard key={question.id} question={question} />
                            ))
                          )}
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
                      {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border border-dashed border-border/30 rounded-2xl p-4">
                          <Briefcase className="h-8 w-8 text-secondary/40 mb-2" />
                          <p className="text-sm font-semibold text-foreground">No collaborative projects</p>
                          <p className="text-xs mt-1">Publish a project to get technical mentoring & contributions.</p>
                        </div>
                      ) : (
                        projects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.08 }}
                          >
                            <ProjectCard project={project} />
                          </motion.div>
                        ))
                      )}
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
          </>
        )}
      </div>

      <AskQuestionDialog 
        open={showAskQuestion} 
        onOpenChange={setShowAskQuestion} 
        onSuccess={handleQuestionSuccess}
      />
    </DashboardLayout>
  )
}
