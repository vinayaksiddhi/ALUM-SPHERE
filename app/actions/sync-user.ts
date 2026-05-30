"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function syncUser() {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return { success: false, error: "Not authenticated", needsSetup: false }
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return { success: false, error: "No email address found", needsSetup: false }
    }

    // Race DB lookup against a 5-second timeout to prevent hanging
    const profilePromise = db.profiles.findUnique({
      where: { clerk_id: clerkUser.id },
      include: {
        student_profiles: true,
        alumni_profiles: true,
      },
    })

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 5000)
    )

    let profile = await Promise.race([profilePromise, timeoutPromise])

    // If timed out, needsSetup = true, show role modal
    if (profile === null) {
      return { success: false, error: "DB timeout", needsSetup: true }
    }

    // New user — create a bare profile record (role will be set after role selection)
    const needsSetup = !profile || (!profile.student_profiles && !profile.alumni_profiles)

    if (!profile) {
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User"
      profile = await db.profiles.create({
        data: {
          clerk_id: clerkUser.id,
          email: email,
          name: name,
          avatar_url: clerkUser.imageUrl || null,
          role: "STUDENT", // temporary placeholder, updated on setup
        },
        include: {
          student_profiles: true,
          alumni_profiles: true,
        },
      })
    }

    return { success: true, profile, needsSetup }
  } catch (error: any) {
    console.error("Error in syncUser action:", error)
    return { success: false, error: error.message || "Failed to synchronize profile", needsSetup: true }
  }
}
