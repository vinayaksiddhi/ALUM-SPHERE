"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Mail, Lock, Github, Sparkles, Eye, EyeOff, KeyRound } from "lucide-react"
import RoleSelectionModal from "@/components/role-selection-modal"
import AnimatedBackground from "@/components/animated-background"
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { syncUser } from "@/app/actions/sync-user"

export default function AuthPage() {
  const router = useRouter()
  const { isLoaded: isUserLoaded, isSignedIn } = useUser()
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn() as any
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp() as any

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [justVerified, setJustVerified] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect already-logged-in returning users
  useEffect(() => {
    if (!isUserLoaded || !isSignedIn || justVerified) return

    syncUser().then((res) => {
      if (res.success && res.profile && !res.needsSetup) {
        router.push(`/dashboard/${res.profile.role.toLowerCase()}`)
      } else {
        setShowRoleModal(true)
      }
    }).catch(() => {
      setShowRoleModal(true)
    })
  }, [isUserLoaded, isSignedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      if (!isSignInLoaded || !signIn) { setError("Auth not ready yet. Please wait."); return }
      setIsSubmitting(true)
      try {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        })

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId })
          const res = await syncUser()
          if (res.success && res.profile && !res.needsSetup) {
            router.push(`/dashboard/${res.profile.role.toLowerCase()}`)
          } else {
            setJustVerified(true)
            setShowRoleModal(true)
          }
        } else {
          setError("Sign-in needs additional verification. Please try again.")
        }
      } catch (err: any) {
        const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Incorrect email or password."
        setError(msg)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      if (!isSignUpLoaded || !signUp) { setError("Auth not ready yet. Please wait."); return }
      setIsSubmitting(true)
      try {
        await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
        })
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setVerifying(true)
      } catch (err: any) {
        const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Sign up failed. Try a different email or stronger password."
        setError(msg)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!isSignUpLoaded || !signUp) return
    setIsSubmitting(true)

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId })
        setJustVerified(true)
        setVerifying(false)
        setShowRoleModal(true)
      } else {
        setError("Verification incomplete. Please try again.")
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Wrong code. Please double-check the email."
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    setError("")
    try {
      if (isLogin) {
        if (!isSignInLoaded || !signIn) return
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/`,
        })
      } else {
        if (!isSignUpLoaded || !signUp) return
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/`,
        })
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate social login.")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Brand */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 animate-pulse" style={{ animationDuration: "4s" }}>
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary mb-1.5">AlumSphere</h1>
          <p className="text-muted-foreground text-sm font-medium">Bridging the gap between students and alumni</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <AnimatePresence mode="wait">
            {verifying ? (
              /* OTP Verification */
              <motion.form key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerify} className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Check Your Email</h2>
                  <p className="text-xs text-muted-foreground">
                    We sent a 6-digit code to <span className="text-primary font-semibold">{formData.email}</span>
                  </p>
                  <p className="text-xs text-amber-400/80 bg-amber-400/10 rounded-lg p-2">
                    📬 Check your spam/junk folder too!
                  </p>
                </div>

                {error && <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 text-center">{error}</p>}

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    className="bg-slate-900/40 border-border/50 text-foreground text-center text-2xl font-extrabold tracking-[0.5em] focus:ring-1 focus:ring-primary/40 rounded-xl py-6"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting || code.length < 6} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-5 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                  {isSubmitting ? "Verifying..." : "Confirm & Continue"}
                </Button>

                <button type="button" onClick={() => { setVerifying(false); setCode(""); setError("") }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Back to sign up
                </button>
              </motion.form>
            ) : (
              /* Login / Sign Up */
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Tab Toggle */}
                <div className="flex gap-2 mb-6 bg-muted/30 p-1 rounded-xl border border-border/30">
                  {["Login", "Sign Up"].map((tab, i) => (
                    <Button
                      key={tab}
                      variant={(!i) === isLogin ? "default" : "ghost"}
                      onClick={() => { setIsLogin(!i); setError("") }}
                      className={`flex-1 rounded-lg text-xs font-semibold uppercase tracking-wider py-4 transition-all duration-300 ${(!i) === isLogin ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                {error && <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@university.edu" className="pl-11 bg-slate-900/40 border-border/50 text-foreground rounded-xl" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 bg-slate-900/40 border-border/50 text-foreground rounded-xl" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2 text-center">
                      A 6-digit verification code will be emailed to you
                    </p>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 disabled:opacity-50">
                    <Sparkles className="h-4 w-4" />
                    {isSubmitting ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Log In" : "Get Started")}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/20" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                      <span className="bg-transparent px-3 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" onClick={() => handleOAuth("oauth_google")} className="bg-slate-900/30 border-border/50 hover:bg-slate-900/60 rounded-xl text-xs font-medium py-5 gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button type="button" variant="outline" onClick={() => handleOAuth("oauth_github")} className="bg-slate-900/30 border-border/50 hover:bg-slate-900/60 rounded-xl text-xs font-medium py-5 gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-xs text-muted-foreground mt-5">
          {isLogin ? "New to the platform? " : "Already registered? "}
          <button onClick={() => { setIsLogin(!isLogin); setError("") }} className="text-primary hover:underline font-bold">
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {showRoleModal && <RoleSelectionModal onClose={() => setShowRoleModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
