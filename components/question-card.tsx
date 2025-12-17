"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  }
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [likes, setLikes] = useState(question.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      avatar: "/professional-woman.png",
      content: "Great question! I'd recommend starting with Grokking the System Design Interview.",
      timeAgo: "1 hour ago",
      likes: 5,
    },
    {
      id: "2",
      author: "Michael Chen",
      avatar: "/asian-professional-man.png",
      content: "Practice on platforms like LeetCode and System Design Primer on GitHub.",
      timeAgo: "45 mins ago",
      likes: 3,
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [commentCount, setCommentCount] = useState(question.comments)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  const handleComment = () => {
    setShowComments(!showComments)
  }

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        avatar: "/diverse-students-studying.png",
        content: newComment,
        timeAgo: "Just now",
        likes: 0,
      }
      setComments([...comments, comment])
      setCommentCount(commentCount + 1)
      setNewComment("")
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this question: ${question.question}`)
    alert("Question link copied to clipboard!")
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={question.avatar || "/placeholder.svg"} />
          <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-foreground">{question.author}</p>
          <p className="text-xs text-muted-foreground">{question.timeAgo}</p>
        </div>
      </div>

      <p className="text-foreground mb-3 leading-relaxed">{question.question}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${hasLiked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          {likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${showComments ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
          onClick={handleComment}
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount}
        </Button>
        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-border space-y-4"
          >
            {/* Comment Input */}
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-students-studying.png" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePostComment()
                    }
                  }}
                  className="bg-background/50"
                />
                <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()}>
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
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
                    </div>
                    <p className="text-sm text-foreground/90">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 mt-2 text-xs text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {comment.likes > 0 && comment.likes}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
