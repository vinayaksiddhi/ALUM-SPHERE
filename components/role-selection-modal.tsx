"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="glass rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Role</h2>
          <p className="text-muted-foreground">Select how you want to connect with the community</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("student")}
            className={`relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === "student"
                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 transition-colors ${
                  selectedRole === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-sidebar-border text-muted-foreground"
                }`}
              >
                <GraduationCap className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mb-3">Student</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect with alumni from your college, seek guidance, collaborate on projects, and build your
                professional network
              </p>
            </div>

            {selectedRole === "student" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Alumni Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("alumni")}
            className={`relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === "alumni"
                ? "border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-lg shadow-secondary/20"
                : "border-border bg-card hover:border-secondary/50 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 transition-colors ${
                  selectedRole === "alumni"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-sidebar-border text-muted-foreground"
                }`}
              >
                <Briefcase className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mb-3">Alumni</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Give back to your alma mater by mentoring students, sharing experiences, offering career guidance, and
                staying connected
              </p>
            </div>

            {selectedRole === "alumni" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-secondary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedRole
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-sidebar-border text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
