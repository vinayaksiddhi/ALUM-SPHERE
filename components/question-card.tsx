"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getCommentsForQuestion, addCommentToQuestion, likeQuestion } from "@/app/actions/get-dashboard-data"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timeAgo: string
  likes: number
}

interface QuestionCardProps {
  question: {
    id: string
    author: string
    avatar: string
    question: string
    tags: string[]
    likes: number
    comments: number
    timeAgo: string
    likedByMe?: boolean
  }
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [likes, setLikes] = useState(question.likes)
  const [hasLiked, setHasLiked] = useState(question.likedByMe || false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentCount, setCommentCount] = useState(question.comments)

  // Load comments dynamically
  const fetchComments = async () => {
    const res = await getCommentsForQuestion(question.id)
    if (res.success && res.comments) {
      setComments(res.comments)
      setCommentCount(res.comments.length)
    }
  }

  useEffect(() => {
    if (showComments) {
      fetchComments()

      // 🌐 WebSockets real-time comments updates — debounced
      const supabase = createClient()
      let debounceTimer: ReturnType<typeof setTimeout> | null = null
      const debouncedReload = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => { fetchComments() }, 1500)
      }

      const channel = supabase
        .channel(`question-comments-${question.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "comments", filter: `question_id=eq.${question.id}` },
          debouncedReload
        )
        .subscribe()

      return () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        supabase.removeChannel(channel)
      }
    }
  }, [showComments, question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLike = async () => {
    try {
      const res = await likeQuestion(question.id)
      if (res.success) {
        setHasLiked(res.liked || false)
        setLikes((prev) => (res.liked ? prev + 1 : Math.max(0, prev - 1)))
        toast.success(res.liked ? "Liked question" : "Unliked question")
      }
    } catch (err) {
      toast.error("Failed to update like status")
    }
  }

  const handleComment = () => {
    setShowComments(!showComments)
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return
    const content = newComment
    setNewComment("")

    try {
      const res = await addCommentToQuestion(question.id, content)
      if (res.success) {
        toast.success("Comment posted successfully")
        fetchComments()
      } else {
        toast.error("Failed to post comment")
      }
    } catch (err) {
      toast.error("An error occurred while posting comment")
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/student?q=${question.id}`)
    toast.success("Question link copied to clipboard!")
  }

  return (
    <div className="p-5 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/30 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10 border border-border/60 shadow-sm">
          <AvatarImage src={question.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-foreground">{question.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{question.author}</p>
          <p className="text-[11px] text-muted-foreground">{question.timeAgo}</p>
        </div>
      </div>

      <p className="text-foreground text-sm mb-3 leading-relaxed font-medium">{question.question}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-muted/60 text-muted-foreground border-none">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 rounded-xl text-xs ${hasLiked ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          {likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 rounded-xl text-xs ${showComments ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-accent hover:bg-accent/5"}`}
          onClick={handleComment}
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount}
        </Button>
        <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground hover:text-foreground rounded-xl" onClick={handleShare}>
          <Share2 className="h-4.5 w-4.5" />
        </Button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-border/30 space-y-4"
          >
            {/* Comment Input */}
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-students-studying.png" />
                <AvatarFallback className="text-foreground">Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a helpful response..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePostComment()
                    }
                  }}
                  className="bg-background/40 border-border/60 rounded-xl"
                />
                <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()} className="rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-2"
                >
                  <Avatar className="h-8 w-8 border border-border/60">
                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-foreground">{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/40 border border-border/25 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-foreground">{comment.author}</p>
                      <p className="text-[10px] text-muted-foreground">{comment.timeAgo}</p>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-normal">{comment.content}</p>
                  </div>
                </motion.div>
              ))}

              {comments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No helpful answers yet. Be the first to answer!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
