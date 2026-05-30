"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RoleSelectionModalProps {
  onClose: () => void
}

export default function RoleSelectionModal({ onClose }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "alumni" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/setup/${selectedRole}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-card/90 backdrop-blur-2xl border border-border/40 rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative subtle top line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary mb-3"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Initialization Gateway
          </motion.div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Select Your Interface</h2>
          <p className="text-muted-foreground text-sm mt-1.5">Configure your AlumSphere portal settings</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("student")}
            className={`relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === "student"
                ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-xl shadow-primary/10"
                : "border-border/40 bg-slate-900/30 hover:border-primary/40 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                  selectedRole === "student"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <GraduationCap className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Student Cockpit</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[240px]">
                Connect with collegiate alumni, seek industry mentorship, exchange active hackathon projects, and build network nodes.
              </p>
            </div>

            {selectedRole === "student" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20"
              >
                <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Alumni Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("alumni")}
            className={`relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === "alumni"
                ? "border-accent bg-gradient-to-br from-accent/15 to-accent/5 shadow-xl shadow-accent/10"
                : "border-border/40 bg-slate-900/30 hover:border-accent/40 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                  selectedRole === "alumni"
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Briefcase className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Alumni Gateway</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[240px]">
                Give back to your alma mater by offering professional critiques, responding to discussion cards, and guiding tomorrow's leaders.
              </p>
            </div>

            {selectedRole === "alumni" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-md shadow-accent/20"
              >
                <svg
                  className="w-3.5 h-3.5 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-xl border border-border/40 text-foreground hover:bg-muted/40 transition-colors text-sm font-semibold"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
              selectedRole
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Deploy Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
