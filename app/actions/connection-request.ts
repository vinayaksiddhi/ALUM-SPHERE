"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function sendConnectionRequest(receiverId: string) {
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

  // Check if a request already exists
  const existingRequest = await db.connection_requests.findFirst({
    where: {
      OR: [
        { sender_id: currentUserProfile.id, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: currentUserProfile.id },
      ]
    }
  })

  if (existingRequest) {
    return { success: false, message: "Connection request already exists or you are already connected." }
  }

  await db.connection_requests.create({
    data: {
      sender_id: currentUserProfile.id,
      receiver_id: receiverId,
      status: "PENDING",
    }
  })

  revalidatePath("/dashboard/student/search")
  return { success: true }
}
