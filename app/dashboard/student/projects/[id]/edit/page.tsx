"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Github, Globe } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getProjectById, updateProject } from "@/app/actions/get-dashboard-data"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [techStack, setTechStack] = useState("")
  const [status, setStatus] = useState<"IN_PROGRESS" | "LOOKING_FOR_CONTRIBUTORS" | "COMPLETED">("IN_PROGRESS")
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return
      setIsLoading(true)
      const res = await getProjectById(projectId)
      if (res.success && res.project) {
        setTitle(res.project.title)
        setDescription(res.project.description)
        setTechStack(res.project.tech_stack.join(", "))
        setStatus(res.project.status as any)
        setGithubUrl(res.project.github_url || "")
        setLiveUrl(res.project.live_url || "")
      }
      setIsLoading(false)
    }
    loadProject()
  }, [projectId])

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !techStack.trim()) {
      import("sonner").then((mod) => mod.toast.error("Please fill in all required fields."))
      return
    }

    setIsSaving(true)
    const techArray = techStack.split(",").map(t => t.trim()).filter(Boolean)
    
    const res = await updateProject(projectId, title, description, techArray, status, githubUrl, liveUrl)
    
    if (res.success) {
      import("sonner").then((mod) => mod.toast.success("Project updated successfully!"))
      router.push("/dashboard/student/projects")
      router.refresh()
    } else {
      import("sonner").then((mod) => mod.toast.error("Failed to update project: " + res.error))
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-3xl mx-auto pb-12">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/student/projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Project</CardTitle>
              <CardDescription>Update your project details and links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. AlumSphere"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe your project, goals, and what you're learning..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech">Tech Stack (comma separated) <span className="text-destructive">*</span></Label>
                <Input 
                  id="tech" 
                  value={techStack} 
                  onChange={(e) => setTechStack(e.target.value)} 
                  placeholder="React, Next.js, Tailwind, Prisma..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="LOOKING_FOR_CONTRIBUTORS">Looking for Contributors</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <Label htmlFor="githubUrl" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository URL
                  </Label>
                  <Input 
                    id="githubUrl" 
                    type="url"
                    value={githubUrl} 
                    onChange={(e) => setGithubUrl(e.target.value)} 
                    placeholder="https://github.com/..."
                    className="bg-card/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="liveUrl" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Live Deployment URL
                  </Label>
                  <Input 
                    id="liveUrl" 
                    type="url"
                    value={liveUrl} 
                    onChange={(e) => setLiveUrl(e.target.value)} 
                    placeholder="https://..."
                    className="bg-card/50"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
