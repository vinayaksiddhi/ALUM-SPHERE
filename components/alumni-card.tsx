"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, UserPlus, MessageSquare, Clock } from "lucide-react"
import { sendConnectionRequest } from "@/app/actions/connection-request"
import { toast } from "sonner"

interface AlumniCardProps {
  alumni: {
    id: string
    name: string
    role: string
    company: string
    college: string
    department: string
    passingYear: string
    expertise: string[]
    avatar: string
    isConnected: boolean
    connectionStatus?: string | null
  }
}

export default function AlumniCard({ alumni }: AlumniCardProps) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(alumni.isConnected)
  const [connectionStatus, setConnectionStatus] = useState(alumni.connectionStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const res = await sendConnectionRequest(alumni.id)
      if (res.success) {
        setConnectionStatus("PENDING")
        toast.success("Connection request sent!")
      } else {
        toast.error(res.message || "Failed to send request")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = () => {
    router.push(`/dashboard/student/messages?user=${alumni.id}`)
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
      <Avatar className="h-14 w-14 ring-2 ring-primary/20">
        <AvatarImage src={alumni.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {alumni.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-lg">{alumni.name}</h3>
        <p className="text-sm text-muted-foreground">{alumni.role}</p>

        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {alumni.company}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Class of {alumni.passingYear}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {alumni.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {isConnected || connectionStatus === "ACCEPTED" ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 whitespace-nowrap bg-transparent text-primary hover:text-primary"
            onClick={handleMessage}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </Button>
        ) : connectionStatus === "PENDING" ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 whitespace-nowrap bg-transparent text-primary hover:text-primary"
            disabled={true}
          >
            <Clock className="h-3.5 w-3.5" />
            Pending
          </Button>
        ) : (
          <Button size="sm" className="gap-2 whitespace-nowrap" onClick={handleConnect} disabled={isLoading}>
            <UserPlus className="h-3.5 w-3.5" />
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        )}
      </div>
    </div>
  )
}
