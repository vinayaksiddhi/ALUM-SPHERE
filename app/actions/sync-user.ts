"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function syncUser() {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" }
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return { success: false, error: "No email address found" }
    }

    // Check if the user profile already exists
    let profile = await db.profiles.findUnique({
      where: { clerk_id: clerkUser.id },
      include: {
        student_profiles: true,
        alumni_profiles: true,
      },
    })

    // If profile does not exist, provision it in the database
    if (!profile) {
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User"
      
      profile = await db.profiles.create({
        data: {
          clerk_id: clerkUser.id,
          email: email,
          name: name,
          avatar_url: clerkUser.imageUrl || null,
          role: "STUDENT", // Default fallback role
        },
        include: {
          student_profiles: true,
          alumni_profiles: true,
        },
      })
    }

    return { success: true, profile }
  } catch (error: any) {
    console.error("Error in syncUser action:", error)
    return { success: false, error: error.message || "Failed to synchronize profile" }
  }
}
