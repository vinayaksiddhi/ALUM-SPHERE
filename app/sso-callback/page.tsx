"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import AnimatedBackground from "@/components/animated-background"

export default function SSOCallbackPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">
          Completing Secure Authentication...
        </p>
      </div>
      {/* This component handles the OAuth token exchange and redirects to redirectUrlComplete */}
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
