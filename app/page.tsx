"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  Sparkles, 
  Users, 
  MessageSquare, 
  Briefcase, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Globe,
  Star
} from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsAuthenticated(true)
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("clerk_id", session.user.id)
            .single()
          if (data) {
            setUserRole(data.role.toLowerCase())
          }
        }
      } catch (err) {
        console.error("Session check error on landing page:", err)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [])

  const handleAction = () => {
    if (isAuthenticated && userRole) {
      router.push(`/dashboard/${userRole}`)
    } else {
      router.push("/login")
    }
  }

  const features = [
    {
      icon: Zap,
      title: "AI Smart-Matching Recommendation Engine",
      description: "Instantly match with verified alumni from your exact department and college who share overlapping skillsets and career paths.",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30"
    },
    {
      icon: MessageSquare,
      title: "Live Q&A Career Discussions",
      description: "Ask technical guidance questions directly to seasoned alumni engineers who have cracked FAANG companies and top startups.",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      icon: Briefcase,
      title: "Collaborative Student Innovation Hub",
      description: "Showcase your portfolio side-projects, solicit dynamic code review, and collaborate with verified mentors on real-world engineering.",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-primary selection:text-primary-foreground">
      <AnimatedBackground />
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Navigation bar */}
      <header className="relative z-20 border-b border-border/40 bg-slate-950/60 backdrop-blur-md sticky top-0">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-extrabold tracking-wider text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary">
              AlumSphere
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button 
                    onClick={() => router.push(`/dashboard/${userRole}`)}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 rounded-xl transition-all shadow-md"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push("/login")}
                      className="text-muted-foreground hover:text-foreground text-sm font-semibold"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => router.push("/login")}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 rounded-xl transition-all shadow-lg shadow-primary/20"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25 shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Where Aspirations Meet Accomplishments
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary"
        >
          Bridging Collegiate Students with Verified Industry Alumni
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-medium"
        >
          AlumSphere creates an exclusive high-fidelity network for your institution, automatically matching student innovators with seasoned corporate mentors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Button 
            size="lg"
            onClick={handleAction}
            className="bg-gradient-to-r from-primary to-accent hover:scale-[1.02] active:scale-[0.98] text-primary-foreground font-semibold px-8 py-7 rounded-2xl shadow-xl shadow-primary/25 transition-all text-base flex items-center gap-2"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-card/45 backdrop-blur-xl border border-border/30 rounded-3xl p-8 hover:border-primary/45 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] group h-full relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br border inline-block ${feature.color} shadow-inner`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-12 bg-slate-950/80">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm text-foreground">AlumSphere © {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Empowering the next generation of industry leaders. Fully integrated with Supabase & Next.js.
          </p>
        </div>
      </footer>
    </div>
  )
}
