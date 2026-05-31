"use client"

import { useState, useEffect } from "react"
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
import { getConversations, getMessages, sendMessage } from "@/app/actions/messages"
import { createClient } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUserProfileId, setCurrentUserProfileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const searchParams = useSearchParams()
  const preselectedUserId = searchParams.get('user')

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_id', user.id).single()
          if (profile) setCurrentUserProfileId(profile.id)
        }

        const convos = await getConversations()
        setConversations(convos)
        
        if (convos.length > 0) {
          // If a user is preselected via URL, try to find that conversation
          let toSelect = convos[0]
          if (preselectedUserId) {
             const pre = convos.find((c: any) => c.participant.id === preselectedUserId)
             if (pre) toSelect = pre
          }
          setSelectedConversation(toSelect)
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialData()
  }, [preselectedUserId])

  // Use a stable string ID to prevent re-subscription loops
  const selectedConversationId = selectedConversation?.id || null

  useEffect(() => {
    if (!selectedConversationId) return

    let cancelled = false

    const fetchMsgs = async () => {
      const msgs = await getMessages(selectedConversationId)
      if (cancelled) return
      setMessages(msgs.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        content: m.content,
        timestamp: m.created_at,
        status: "read",
      })))
    }
    fetchMsgs()

    // 🌐 WebSocket real-time chat using Supabase Broadcast for instant delivery
    const supabase = createClient()
    const channel = supabase.channel(`chat-${selectedConversationId}`, {
      config: { broadcast: { self: false } }
    })
    
    channel.on('broadcast', { event: 'new_message' }, (payload) => {
      const newMsg = payload.payload
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev
        return [
          ...prev,
          {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            content: newMsg.content,
            timestamp: newMsg.created_at,
            status: "read",
          }
        ]
      })
    }).subscribe()

    // Save channel to ref so we can broadcast from handleSendMessage
    // @ts-ignore
    window.__chatChannel = channel

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
      // @ts-ignore
      delete window.__chatChannel
    }
  }, [selectedConversationId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const content = newMessage
    setNewMessage("")
    
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: currentUserProfileId,
        content: content,
        timestamp: new Date(),
        status: "sent" as const,
      }
    ])

    try {
      const newMsg = await sendMessage(selectedConversation.id, content)
      
      // Update our own UI with the real database ID
      setMessages((prev) => prev.map(m => m.id === tempId ? {
        id: newMsg.id,
        senderId: newMsg.sender_id || "",
        content: newMsg.content,
        timestamp: newMsg.created_at || new Date(),
        status: "read"
      } : m))

      // 🌐 Instantly broadcast to the other user!
      // @ts-ignore
      if (window.__chatChannel) {
        // @ts-ignore
        window.__chatChannel.send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMsg
        })
      }
      
    } catch (error) {
      console.error("Failed to send message", error)
      setMessages((prev) => prev.filter(m => m.id !== tempId))
    }
  }

  return (
    <DashboardLayout role="student">
      <div className="h-[calc(100vh-8rem)]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-lg">Chat with your alumni mentors</p>
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
                  {isLoading ? (
                    <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">No conversations yet</div>
                  ) : conversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedConversation?.id === conversation.id
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
                              {conversation.timestamp ? new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
              {selectedConversation ? (
                <>
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
                        isOwn={message.senderId === currentUserProfileId}
                        participant={selectedConversation.participant}
                      />
                    </motion.div>
                  ))}
                  <AnimatePresence>
                    {isTyping && <TypingIndicator name={selectedConversation.participant.name} />}
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
              </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a conversation to start messaging
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
