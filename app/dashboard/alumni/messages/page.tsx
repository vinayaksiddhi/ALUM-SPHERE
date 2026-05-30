"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Info } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ChatMessage from "@/components/chat-message"
import TypingIndicator from "@/components/typing-indicator"

// Mock conversations for alumni
const mockConversations = [
  {
    id: "1",
    participant: {
      name: "Alex Kumar",
      avatar: "/diverse-students-studying.png",
      role: "CS Student, 3rd Year",
      online: true,
    },
    lastMessage: "Thank you so much for the advice!",
    timestamp: "5 min ago",
    unread: 1,
  },
  {
    id: "2",
    participant: {
      name: "Emma Wilson",
      avatar: "/asian-woman-student.jpg",
      role: "CS Student, 4th Year",
      online: false,
    },
    lastMessage: "I'll prepare the questions for our call",
    timestamp: "2 hours ago",
    unread: 0,
  },
  {
    id: "3",
    participant: {
      name: "Raj Patel",
      avatar: "/abstract-geometric-shapes.png",
      role: "CS Student, 2nd Year",
      online: true,
    },
    lastMessage: "Could we schedule a session next week?",
    timestamp: "Yesterday",
    unread: 2,
  },
]

const mockMessages: {
  id: string
  senderId: string
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
}[] = [
  {
    id: "1",
    senderId: "student",
    content: "Hi! Thank you for accepting my connection request. I really admire your work at Google.",
    timestamp: new Date(Date.now() - 7200000),
    status: "read",
  },
  {
    id: "2",
    senderId: "alumni",
    content: "Thank you! I'm happy to help. What would you like to know about?",
    timestamp: new Date(Date.now() - 7100000),
    status: "read",
  },
  {
    id: "3",
    senderId: "student",
    content: "I'm curious about your career path and how you transitioned from college to Google.",
    timestamp: new Date(Date.now() - 7000000),
    status: "read",
  },
  {
    id: "4",
    senderId: "alumni",
    content:
      "It's a great question! After graduating, I started at a startup which gave me hands-on experience. That experience was crucial when I applied to Google.",
    timestamp: new Date(Date.now() - 6900000),
    status: "read",
  },
  {
    id: "5",
    senderId: "student",
    content: "Thank you so much for the advice!",
    timestamp: new Date(Date.now() - 300000),
    status: "read",
  },
]

export default function AlumniMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      senderId: "alumni",
      content: newMessage,
      timestamp: new Date(),
      status: "sent" as const,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate typing indicator and response
    setTimeout(() => setIsTyping(true), 1000)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderId: "student",
          content: "That makes perfect sense. Thank you!",
          timestamp: new Date(),
          status: "sent",
        },
      ])
    }, 3000)
  }

  return (
    <DashboardLayout role="alumni">
      <div className="h-[calc(100vh-8rem)]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-lg">Connect with your mentees</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glass border-border/50 h-full flex flex-col">
              <div className="p-4 border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {mockConversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedConversation.id === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-card border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.participant.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-foreground truncate">{conversation.participant.name}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground">{conversation.unread}</Badge>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass border-border/50 h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedConversation.participant.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedConversation.participant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedConversation.participant.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedConversation.participant.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ChatMessage
                        message={message}
                        isOwn={message.senderId === "alumni"}
                        participant={selectedConversation.participant}
                      />
                    </motion.div>
                  ))}
                  <AnimatePresence>
                    {isTyping && (
                      <TypingIndicator
                        name={selectedConversation.participant.name}
                        avatar={selectedConversation.participant.avatar}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="bg-background border-border pr-10"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="shrink-0 gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
