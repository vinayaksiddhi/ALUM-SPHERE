"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MessageSquare, Briefcase, Send, Plus, X, MapPin, Sparkles, Hash } from "lucide-react"
import { motion } from "framer-motion"

interface GlobalSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: "student" | "alumni"
}

export default function GlobalSearchModal({ open, onOpenChange, role }: GlobalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("search")
  const [questionText, setQuestionText] = useState("")
  const [postContent, setPostContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Mock search results
  const searchResults = {
    alumni: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Senior Software Engineer",
        company: "Google",
        location: "San Francisco, CA",
        avatar: "/professional-woman.png",
        matchScore: 95,
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Product Manager",
        company: "Microsoft",
        location: "Seattle, WA",
        avatar: "/asian-professional-man.png",
        matchScore: 88,
      },
    ],
    questions: [
      {
        id: "1",
        author: "Alex Kumar",
        avatar: "/diverse-students-studying.png",
        question: "How to prepare for system design interviews?",
        tags: ["Career", "Interviews"],
        likes: 24,
        timeAgo: "2h ago",
      },
    ],
    projects: [
      {
        id: "1",
        title: "AI Code Review Tool",
        author: "Emma Wilson",
        description: "Automated code review using ML",
        tags: ["Python", "AI"],
        likes: 45,
      },
    ],
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handlePostQuestion = () => {
    console.log("[v0] Posting question:", { questionText, tags })
    // Reset form
    setQuestionText("")
    setTags([])
    setActiveTab("search")
    alert("Question posted successfully! It's now visible to all users.")
  }

  const handleCreatePost = () => {
    console.log("[v0] Creating post:", { postContent, tags })
    // Reset form
    setPostContent("")
    setTags([])
    setActiveTab("search")
    alert("Post created successfully! It's now visible to all users.")
  }

  const filteredAlumni = searchQuery
    ? searchResults.alumni.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchResults.alumni

  const filteredQuestions = searchQuery
    ? searchResults.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : searchResults.questions

  const filteredProjects = searchQuery
    ? searchResults.projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchResults.projects

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 glass border-border/50 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header with Search */}
          <div className="p-6 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search alumni, questions, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-muted/50 border-border"
                autoFocus
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 pt-4 border-b border-border/50">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="search" className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </TabsTrigger>
                <TabsTrigger value="ask" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ask Question
                </TabsTrigger>
                <TabsTrigger value="post" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create Post
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              {/* Search Tab */}
              <TabsContent value="search" className="p-6 space-y-6 mt-0">
                {/* Alumni Results */}
                {filteredAlumni.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Alumni ({filteredAlumni.length})
                    </h3>
                    {filteredAlumni.map((alumni) => (
                      <motion.div
                        key={alumni.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={alumni.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              {alumni.name}
                              <Badge variant="secondary" className="text-xs">
                                {alumni.matchScore}% Match
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              {alumni.role} at {alumni.company}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {alumni.location}
                            </p>
                          </div>
                        </div>
                        <Button size="sm">View Profile</Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Questions Results */}
                {filteredQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-accent" />
                      Questions ({filteredQuestions.length})
                    </h3>
                    {filteredQuestions.map((question) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-accent/50 transition-all cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={question.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{question.question}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {question.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {question.likes} likes · {question.timeAgo}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Projects Results */}
                {filteredProjects.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-secondary" />
                      Projects ({filteredProjects.length})
                    </h3>
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-secondary/50 transition-all cursor-pointer"
                      >
                        <h4 className="font-semibold text-foreground">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{project.likes} likes</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {searchQuery &&
                  filteredAlumni.length === 0 &&
                  filteredQuestions.length === 0 &&
                  filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground">No results found</h3>
                      <p className="text-muted-foreground">Try different keywords or filters</p>
                    </div>
                  )}
              </TabsContent>

              {/* Ask Question Tab */}
              <TabsContent value="ask" className="p-6 mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Ask the Community</h3>
                    <p className="text-muted-foreground">Your question will be visible to all students and alumni</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-text">Your Question</Label>
                      <Textarea
                        id="question-text"
                        placeholder="What would you like to know? Be specific and clear..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="min-h-32 resize-none bg-muted/50 border-border"
                      />
                      <p className="text-xs text-muted-foreground text-right">{questionText.length} / 500</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="question-tags">Tags (Max 5)</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="question-tags"
                            placeholder="e.g., Career, Coding, Interview"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTag()
                              }
                            }}
                            className="pl-9 bg-muted/50 border-border"
                            disabled={tags.length >= 5}
                          />
                        </div>
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
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 hover:text-primary-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handlePostQuestion}
                    disabled={!questionText.trim() || tags.length === 0}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Send className="h-4 w-4" />
                    Post Question Globally
                  </Button>
                </div>
              </TabsContent>

              {/* Create Post Tab */}
              <TabsContent value="post" className="p-6 mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Create a Post</h3>
                    <p className="text-muted-foreground">
                      Share updates, achievements, or resources with the entire community
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="post-content">Post Content</Label>
                      <Textarea
                        id="post-content"
                        placeholder="Share something with the community..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="min-h-40 resize-none bg-muted/50 border-border"
                      />
                      <p className="text-xs text-muted-foreground text-right">{postContent.length} / 1000</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-tags">Tags (Optional, Max 5)</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="post-tags"
                            placeholder="e.g., Achievement, Resource, Event"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTag()
                              }
                            }}
                            className="pl-9 bg-muted/50 border-border"
                            disabled={tags.length >= 5}
                          />
                        </div>
                        <Button onClick={handleAddTag} disabled={tags.length >= 5} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1.5 bg-secondary/10 text-secondary">
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)} className="ml-2">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreatePost}
                    disabled={!postContent.trim()}
                    className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Share with Community
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
