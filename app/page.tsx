"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, GraduationCap, Mail, Lock, Github, Sparkles, KeyRound } from "lucide-react"
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
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Prevent triggering sync when on same page after OTP verification
  const [justVerified, setJustVerified] = useState(false)

  // JIT Session Synchronization & Redirection Check (only for returning users)
  useEffect(() => {
    if (!isUserLoaded || !isSignedIn || justVerified) return
    setLoading(true)
    const timeout = setTimeout(() => {
      // Safety net: if syncUser hangs for 8s, unlock the page
      setLoading(false)
      setShowRoleModal(true)
    }, 8000)

    syncUser().then((res) => {
      clearTimeout(timeout)
      setLoading(false)
      if (res.success && res.profile && !res.needsSetup) {
        // Existing user with complete profile — go straight to their dashboard
        const role = res.profile.role
        router.push(`/dashboard/${role.toLowerCase()}`)
      } else {
        // New or incomplete profile — show role selection modal
        setShowRoleModal(true)
      }
    }).catch(() => {
      clearTimeout(timeout)
      setLoading(false)
      setShowRoleModal(true)
    })
  }, [isUserLoaded, isSignedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      // Headless Clerk Sign In Flow
      if (!isSignInLoaded) return
      try {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        })

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId })
          const res = await syncUser()
          if (res.success && res.profile?.role) {
            router.push(`/dashboard/${res.profile.role.toLowerCase()}`)
          } else {
            setShowRoleModal(true)
          }
        } else {
          alert("Sign-in verification incomplete. Please contact support.")
        }
      } catch (err: any) {
        console.error(err)
        alert(err.errors?.[0]?.message || "Failed to log in. Please check your credentials.")
      } finally {
        setLoading(false)
      }
    } else {
      // Headless Clerk Sign Up Flow
      if (!isSignUpLoaded) return
      try {
        await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
        })

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setVerifying(true)
      } catch (err: any) {
        console.error(err)
        alert(err.errors?.[0]?.message || "Sign up failed. Please choose another email/password.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignUpLoaded) return
    setLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignUp.status === "complete") {
        await setSignUpActive({ session: completeSignUp.createdSessionId })
        // Mark as just verified so the useEffect doesn't fire and double-redirect
        setJustVerified(true)
        setLoading(false)
        setVerifying(false)
        // Show role selection modal — this is a brand new user
        setShowRoleModal(true)
      } else {
        setLoading(false)
        alert("Verification incomplete. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      setLoading(false)
      alert(err.errors?.[0]?.message || "Failed to verify the registration code.")
    }
  }

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    try {
      if (isLogin) {
        if (!isSignInLoaded) return
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/`,
          continueSession: true,
        })
      } else {
        if (!isSignUpLoaded) return
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/`,
          continueSession: true,
        })
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to initiate social login.")
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <AnimatedBackground />
        <div className="text-center z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4 font-semibold uppercase tracking-wider text-xs">Authenticating Portal Access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
      {/* Dynamic particles and floating blurs background */}
      <AnimatedBackground />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Brand Logo & Presentation */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-105 animate-pulse" style={{ animationDuration: '4s' }}>
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary mb-1.5">
            AlumSphere
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Bridging the gap between students and alumni
          </p>
        </motion.div>

        {/* Glassmorphic Auth Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle top edge lighting gradient */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {verifying ? (
              /* OTP Verification Form */
              <motion.form
                key="verify-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Verify Your Account</h2>
                  <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
                    We've dispatched a secure verification code to <span className="text-primary font-semibold">{formData.email}</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                    One-Time Passcode
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="••••••"
                    className="bg-slate-900/40 border-border/50 text-foreground placeholder:text-muted-foreground/60 text-center text-xl font-extrabold tracking-[0.75em] focus:ring-1 focus:ring-primary/40 focus:border-primary/40 rounded-xl transition-all duration-200 py-6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground font-semibold py-5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
                >
                  Confirm Registration
                </Button>

                <button
                  type="button"
                  onClick={() => setVerifying(false)}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors mt-2"
                >
                  Cancel and Edit Details
                </button>
              </motion.form>
            ) : (
              /* Regular Login/Signup Form */
              <motion.div
                key="auth-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex gap-2 mb-6 bg-muted/30 p-1 rounded-xl border border-border/30">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    className={`flex-1 transition-all duration-300 rounded-lg text-xs font-semibold uppercase tracking-wider py-4 ${
                      isLogin ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    className={`flex-1 transition-all duration-300 rounded-lg text-xs font-semibold uppercase tracking-wider py-4 ${
                      !isLogin ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        className="pl-11 bg-slate-900/40 border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary/40 focus:border-primary/40 rounded-xl transition-all duration-200"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-11 pr-11 bg-slate-900/40 border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary/40 focus:border-primary/40 rounded-xl transition-all duration-200"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                          className="border-border/60 data-[state=checked]:bg-primary rounded"
                        />
                        <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                          Remember my credentials
                        </Label>
                      </div>
                      <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-xs font-semibold">
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground font-semibold py-5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isLogin ? "Log In" : "Get Started"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/20"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                      <span className="bg-transparent px-3 text-muted-foreground">Authorized Channels Only</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuth("oauth_google")}
                      className="bg-slate-900/30 border-border/50 text-foreground hover:bg-slate-900/60 rounded-xl transition-all text-xs font-medium py-5 gap-2"
                    >
                      <svg className="h-4 w-4 text-slate-300" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuth("oauth_github")}
                      className="bg-slate-900/30 border-border/50 text-foreground hover:bg-slate-900/60 rounded-xl transition-all text-xs font-medium py-5 gap-2"
                    >
                      <Github className="h-4 w-4 text-slate-300" />
                      GitHub
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-5"
        >
          {isLogin ? "New to the platform? " : "Already registered? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-bold transition-colors">
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
