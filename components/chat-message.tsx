"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, CheckCheck } from "lucide-react"
import { format } from "date-fns"

interface ChatMessageProps {
  message: {
    id: string
    senderId: string
    content: string
    timestamp: Date
    status?: "sent" | "delivered" | "read"
  }
  isOwn: boolean
  participant?: {
    name: string
    avatar: string
  }
}

export default function ChatMessage({ message, isOwn, participant }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {!isOwn && participant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">{format(message.timestamp, "HH:mm")}</span>
          {isOwn && (
            <span className="text-muted-foreground">
              {message.status === "read" ? (
                <CheckCheck className="h-3 w-3 text-accent" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
