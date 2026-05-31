"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Send, Loader2 } from "lucide-react"
import { askQuestion } from "@/app/actions/get-dashboard-data"
import { toast } from "sonner"

interface AskQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AskQuestionDialog({ open, onOpenChange, onSuccess }: AskQuestionDialogProps) {
  const [question, setQuestion] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await askQuestion(question, tags)
      if (res.success) {
        toast.success("Question published successfully!")
        onOpenChange(false)
        setQuestion("")
        setTags([])
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(res.error || "Failed to publish question")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-dark">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
          <DialogDescription>Get help from alumni and fellow students in your network</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="What would you like to know? Be specific and clear..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-32 resize-none bg-sidebar-accent border-sidebar-border"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground text-right">{question.length} / 500</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Max 5)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="e.g., Career, Coding, Interview"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="bg-sidebar-accent border-sidebar-border"
                disabled={tags.length >= 5 || isSubmitting}
              />
              <Button onClick={handleAddTag} disabled={tags.length >= 5 || isSubmitting} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} disabled={isSubmitting} className="ml-2 hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!question.trim() || tags.length === 0 || isSubmitting} className="flex-1 gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? "Publishing..." : "Post Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
