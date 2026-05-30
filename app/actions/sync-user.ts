"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"

export async function syncUser() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated", needsSetup: false }
    }

    const email = user.email
    if (!email) {
      return { success: false, error: "No email address found", needsSetup: false }
    }

    // Look up by Supabase auth user ID (stored in clerk_id column)
    let profile = await db.profiles.findUnique({
      where: { clerk_id: user.id },
      include: {
        student_profiles: true,
        alumni_profiles: true,
      },
    })

    const needsSetup = !profile || (!profile.student_profiles && !profile.alumni_profiles)

    if (!profile) {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0] || "New User"
      const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

      profile = await db.profiles.create({
        data: {
          clerk_id: user.id, // reusing clerk_id column for Supabase auth UID
          email,
          name,
          avatar_url: avatar,
          role: "STUDENT",
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
