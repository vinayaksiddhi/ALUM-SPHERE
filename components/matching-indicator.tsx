"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface MatchingIndicatorProps {
  score: number
  size?: "sm" | "md" | "lg"
}

export default function MatchingIndicator({ score, size = "md" }: MatchingIndicatorProps) {
  const getColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 75) return "text-accent"
    if (score >= 60) return "text-secondary"
    return "text-muted-foreground"
  }

  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-8 w-8"
      default:
        return "h-6 w-6"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      >
        <Sparkles className={`${getSize()} ${getColor(score)}`} />
      </motion.div>
      <span className={`font-semibold ${getColor(score)}`}>{score}%</span>
    </div>
  )
}
