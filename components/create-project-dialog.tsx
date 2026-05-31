"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Send, Github, Globe, Loader2 } from "lucide-react"
import { createProject } from "@/app/actions/get-dashboard-data"
import { toast } from "sonner"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function CreateProjectDialog({ open, onOpenChange, onSuccess }: CreateProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("in-progress")
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Map frontend status string to backend enum
      let backendStatus: "IN_PROGRESS" | "LOOKING_FOR_CONTRIBUTORS" | "COMPLETED" = "IN_PROGRESS"
      if (status === "completed") {
        backendStatus = "COMPLETED"
      } else if (status === "looking") {
        backendStatus = "LOOKING_FOR_CONTRIBUTORS"
      }

      const res = await createProject(title, description, techStack, backendStatus)
      if (res.success) {
        toast.success("Project shared successfully!")
        onOpenChange(false)
        // Reset form
        setTitle("")
        setDescription("")
        setStatus("in-progress")
        setTechStack([])
        setGithubUrl("")
        setLiveUrl("")
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(res.error || "Failed to share project")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-dark max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Project</DialogTitle>
          <DialogDescription>Share your project with the community and find collaborators</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., AI-Powered Code Review Tool"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-sidebar-accent border-sidebar-border"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, what it does, and what makes it unique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 resize-none bg-sidebar-accent border-sidebar-border"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length} / 500</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
              <SelectTrigger className="bg-sidebar-accent border-sidebar-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="looking">Looking for Contributors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Python, Node.js..."
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTech()
                  }
                }}
                className="bg-sidebar-accent border-sidebar-border"
                disabled={isSubmitting}
              />
              <Button type="button" onClick={handleAddTech} disabled={isSubmitting} className="shrink-0 gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary">
                    {tech}
                    <button onClick={() => handleRemoveTech(tech)} disabled={isSubmitting} className="ml-2 hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Repository (Optional)</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="pl-10 bg-sidebar-accent border-sidebar-border"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="live">Live Demo (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="live"
                  placeholder="https://yourproject.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="pl-10 bg-sidebar-accent border-sidebar-border"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !description.trim() || isSubmitting} className="flex-1 gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
