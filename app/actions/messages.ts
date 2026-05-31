"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function getConversations() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const currentUserProfile = await db.profiles.findUnique({
    where: { clerk_id: user.id }
  })

  if (!currentUserProfile) throw new Error("Profile not found")

  const conversations = await db.conversations.findMany({
    where: {
      conversation_participants: {
        some: { profile_id: currentUserProfile.id }
      }
    },
    include: {
      conversation_participants: {
        include: {
          profiles: {
            include: {
              alumni_profiles: true,
              student_profiles: true
            }
          }
        }
      },
      messages: {
        orderBy: { created_at: 'desc' },
        take: 1
      }
    }
  })

  return conversations.map(conv => {
    const otherParticipant = conv.conversation_participants.find(p => p.profile_id !== currentUserProfile.id)?.profiles
    const lastMessage = conv.messages[0]

    let roleDisplay = "User"
    if (otherParticipant?.role === "ALUMNI" && otherParticipant.alumni_profiles) {
      roleDisplay = `${otherParticipant.alumni_profiles.job_title} at ${otherParticipant.alumni_profiles.company}`
    } else if (otherParticipant?.role === "STUDENT" && otherParticipant.student_profiles) {
      roleDisplay = `${otherParticipant.student_profiles.department} Student`
    }

    return {
      id: conv.id,
      participant: {
        id: otherParticipant?.id,
        name: otherParticipant?.name,
        avatar: otherParticipant?.avatar_url || "/placeholder.svg?height=100&width=100",
        role: roleDisplay,
        online: false,
      },
      lastMessage: lastMessage?.content || "No messages yet",
      timestamp: lastMessage?.created_at,
      unread: 0
    }
  })
}

export async function getMessages(conversationId: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const messages = await db.messages.findMany({
    where: { conversation_id: conversationId },
    orderBy: { created_at: 'asc' },
    include: { profiles: true }
  })

  return messages
}

// Uses Supabase client directly so Realtime picks up the INSERT event
export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const currentUserProfile = await db.profiles.findUnique({
    where: { clerk_id: user.id }
  })

  if (!currentUserProfile) throw new Error("Profile not found")

  const newMessage = await db.messages.create({
    data: {
      conversation_id: conversationId,
      sender_id: currentUserProfile.id,
      content,
    }
  })

  return newMessage
}
