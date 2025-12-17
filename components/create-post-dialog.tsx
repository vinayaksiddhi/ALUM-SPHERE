"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Upload } from "lucide-react"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    // Handle post submission
    console.log({ title, content })
    onOpenChange(false)
    setTitle("")
    setContent("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-dark">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share Your Knowledge</DialogTitle>
          <DialogDescription>Create a guidance post or schedule a mentorship session</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="post" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">Guidance Post</TabsTrigger>
            <TabsTrigger value="session">Schedule Session</TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="e.g., 5 Tips for Tech Interviews"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-sidebar-accent border-sidebar-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your insights, experiences, and advice..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-48 resize-none bg-sidebar-accent border-sidebar-border"
              />
              <p className="text-xs text-muted-foreground text-right">{content.length} / 2000</p>
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Upload Resources
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTitle">Session Title</Label>
              <Input
                id="sessionTitle"
                placeholder="e.g., System Design Workshop"
                className="bg-sidebar-accent border-sidebar-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDesc">Description</Label>
              <Textarea
                id="sessionDesc"
                placeholder="What will you cover in this session?"
                className="min-h-24 resize-none bg-sidebar-accent border-sidebar-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" className="bg-sidebar-accent border-sidebar-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" className="bg-sidebar-accent border-sidebar-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Max Participants</Label>
              <Input id="capacity" type="number" placeholder="20" className="bg-sidebar-accent border-sidebar-border" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 gap-2">
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
