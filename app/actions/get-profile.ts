"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const profile = await db.profiles.findUnique({
      where: { clerk_id: user.id },
      include: {
        student_profiles: {
          include: {
            profiles: true
          }
        },
        alumni_profiles: {
          include: {
            profiles: true
          }
        }
      }
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    return { success: true, profile }
  } catch (error: any) {
    console.error("Error in getProfile action:", error)
    return { success: false, error: error.message || "Failed to fetch profile" }
  }
}

export async function updateAvatarUrl(url: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await db.profiles.update({
      where: { clerk_id: user.id },
      data: { avatar_url: url }
    })

    revalidatePath("/dashboard/student/profile")
    revalidatePath("/dashboard/alumni/profile")
    return { success: true }
  } catch (error: any) {
    console.error("Error in updateAvatarUrl action:", error)
    return { success: false, error: error.message || "Failed to update avatar" }
  }
}
