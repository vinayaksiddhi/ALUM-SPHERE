"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Send } from "lucide-react"

interface AskQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AskQuestionDialog({ open, onOpenChange }: AskQuestionDialogProps) {
  const [question, setQuestion] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    // Handle question submission
    console.log({ question, tags })
    onOpenChange(false)
    setQuestion("")
    setTags([])
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
                disabled={tags.length >= 5}
              />
              <Button onClick={handleAddTag} disabled={tags.length >= 5} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!question.trim() || tags.length === 0} className="flex-1 gap-2">
            <Send className="h-4 w-4" />
            Post Question
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
