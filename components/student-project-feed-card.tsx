"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, HandHeart } from "lucide-react"

interface StudentProjectFeedCardProps {
  project: {
    id: string
    student: string
    authorId?: string
    avatar: string
    title: string
    description: string
    techStack: string[]
    likes: number
    comments: number
    timeAgo: string
  }
}

export default function StudentProjectFeedCard({ project }: StudentProjectFeedCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!project.authorId) {
      import("sonner").then((mod) => mod.toast.error("Cannot connect", { description: "Student profile not found." }))
      return
    }
    setIsConnecting(true)
    try {
      const { sendConnectionRequest } = await import("@/app/actions/connection-request")
      const res = await sendConnectionRequest(project.authorId)
      
      import("sonner").then((mod) => {
        if (res.success) {
          mod.toast.success("Offer Sent!", {
            description: `We've sent a connection request to ${project.student}.`
          })
        } else {
          if (res.message?.includes("already exists")) {
             mod.toast.info("Already Connected", { description: "You are already connected. Go to Messages to chat!" })
          } else {
             mod.toast.error("Failed to send request", { description: res.message })
          }
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={project.avatar || "/placeholder.svg"} />
          <AvatarFallback>{project.student.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-foreground">{project.student}</p>
          <p className="text-xs text-muted-foreground">{project.timeAgo}</p>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {project.likes}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {project.comments}
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 bg-transparent"
          disabled={isConnecting}
          onClick={handleConnect}
        >
          <HandHeart className="h-4 w-4" />
          Offer Help
        </Button>
      </div>
    </div>
  )
}
