"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MessageSquare } from "lucide-react"

interface AlumniNetworkCardProps {
  alumni: {
    id: string
    name: string
    role: string
    company: string
    passingYear: string
    expertise: string[]
    avatar: string
    mutualConnections: number
  }
}

export default function AlumniNetworkCard({ alumni }: AlumniNetworkCardProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 ring-2 ring-secondary/20">
          <AvatarImage src={alumni.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-secondary/10 text-secondary">
            {alumni.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{alumni.name}</h3>
          <p className="text-sm text-muted-foreground">{alumni.role}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {alumni.company}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {alumni.expertise.slice(0, 2).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs bg-secondary/10 text-secondary border-secondary/20">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {alumni.mutualConnections} mutual
        </div>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <MessageSquare className="h-3.5 w-3.5" />
          Connect
        </Button>
      </div>
    </div>
  )
}
