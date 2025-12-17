"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  name: string
  avatar?: string
}

export default function TypingIndicator({ name, avatar }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      {avatar && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatar || "/placeholder.svg"} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div className="px-4 py-3 rounded-2xl bg-card border border-border rounded-bl-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
