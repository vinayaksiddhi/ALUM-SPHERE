"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Heart, ExternalLink, Edit, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    techStack: string[]
    status: string
    collaborators: number
    likes: number
    author?: string
    authorId?: string
    createdAt?: string
    githubUrl?: string | null
    liveUrl?: string | null
  }
  showEdit?: boolean
  showAuthor?: boolean
}

export default function ProjectCard({ project, showEdit, showAuthor }: ProjectCardProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(project.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  const handleConnect = async (actionText: string) => {
    if (!project.authorId) {
      import("sonner").then((mod) => mod.toast.error("Cannot connect", { description: "Project owner not found." }))
      return
    }
    setIsConnecting(true)
    try {
      const { sendConnectionRequest } = await import("@/app/actions/connection-request")
      const res = await sendConnectionRequest(project.authorId)
      
      import("sonner").then((mod) => {
        if (res.success) {
          mod.toast.success(`${actionText} Request Sent!`, {
            description: `We've sent a connection request to ${project.author || "the owner"}.`
          })
        } else {
          if (res.message?.includes("already exists")) {
             mod.toast.info("Already Connected", { description: "You are already connected or have a pending request. Go to Messages to chat!" })
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

  const handleView = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, "_blank")
    } else if (project.githubUrl) {
      window.open(project.githubUrl, "_blank")
    } else {
      import("sonner").then((mod) => {
        mod.toast.info("No Link Provided", {
          description: "This project has not linked a GitHub repository or live deployment."
        })
      })
    }
  }

  return (
    <div className="h-full p-5 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all hover:shadow-lg flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground leading-tight text-lg">{project.title}</h3>
        <Badge
          variant="outline"
          className={
            project.status === "In Progress" || project.status === "IN_PROGRESS"
              ? "bg-accent/10 text-accent border-accent/20"
              : project.status === "Completed" || project.status === "COMPLETED"
                ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-primary/10 text-primary border-primary/20"
          }
        >
          {project.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {showAuthor && project.author && (
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs">{project.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{project.author}</span>
          {project.createdAt && <span className="text-xs text-muted-foreground">• {project.createdAt}</span>}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
        {project.techStack.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{project.techStack.length - 4}
          </Badge>
        )}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.collaborators || 1}
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${hasLiked ? "text-destructive" : "hover:text-destructive"}`}
            >
              <Heart className="h-4 w-4" fill={hasLiked ? "currentColor" : "none"} />
              {likes}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {showEdit ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                onClick={() => router.push(`/dashboard/student/projects/${project.id}/edit`)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                onClick={handleView}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                disabled={isConnecting}
                onClick={() => handleConnect("Discussion")}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Discuss
              </Button>
              <Button 
                size="sm" 
                className="flex-1 gap-2" 
                disabled={isConnecting}
                onClick={() => handleConnect("Collaboration")}
              >
                <Users className="h-3.5 w-3.5" />
                Collaborate
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
