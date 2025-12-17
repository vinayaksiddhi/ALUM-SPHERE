"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface ConnectionRequestCardProps {
  request: {
    id: string
    student: {
      name: string
      avatar: string
      department: string
      year: string
      college: string
    }
    message: string
    interests: string[]
    requestedAt: string
  }
}

export default function ConnectionRequestCard({ request }: ConnectionRequestCardProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage src={request.student.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {request.student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{request.student.name}</h3>
          <p className="text-sm text-muted-foreground">
            {request.student.year} • {request.student.department}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {request.requestedAt}
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground mb-3 leading-relaxed">{request.message}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {request.interests.map((interest) => (
          <Badge key={interest} variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
            {interest}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
          <CheckCircle2 className="h-4 w-4" />
          Accept
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 bg-transparent border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <XCircle className="h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  )
}
