"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getConnections() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const currentUserProfile = await db.profiles.findUnique({
    where: { clerk_id: user.id },
    include: {
      student_profiles: true,
      alumni_profiles: true,
    }
  })

  if (!currentUserProfile) {
    throw new Error("Profile not found")
  }

  // Get all connection requests where user is either sender or receiver
  const connections = await db.connection_requests.findMany({
    where: {
      OR: [
        { sender_id: currentUserProfile.id },
        { receiver_id: currentUserProfile.id },
      ]
    },
    include: {
      profiles_connection_requests_sender_idToprofiles: {
        include: { student_profiles: true, alumni_profiles: true }
      },
      profiles_connection_requests_receiver_idToprofiles: {
        include: { student_profiles: true, alumni_profiles: true }
      }
    }
  })

  return connections
}

export async function updateConnectionStatus(connectionId: string, status: "ACCEPTED" | "REJECTED") {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const currentUserProfile = await db.profiles.findUnique({
    where: { clerk_id: user.id }
  })

  if (!currentUserProfile) {
    throw new Error("Profile not found")
  }

  // Find the connection to ensure the user is the receiver
  const connection = await db.connection_requests.findUnique({
    where: { id: connectionId }
  })

  if (!connection || connection.receiver_id !== currentUserProfile.id) {
    throw new Error("Not authorized to update this connection")
  }

  // Update the status
  await db.connection_requests.update({
    where: { id: connectionId },
    data: { status }
  })

  // If ACCEPTED, create a conversation automatically
  if (status === "ACCEPTED") {
    const newConversation = await db.conversations.create({
      data: {}
    })

    await db.conversation_participants.createMany({
      data: [
        { conversation_id: newConversation.id, profile_id: connection.sender_id },
        { conversation_id: newConversation.id, profile_id: connection.receiver_id },
      ]
    })
  }

  revalidatePath("/dashboard/alumni/connections")
  revalidatePath("/dashboard/student/connections")
  return { success: true }
}
