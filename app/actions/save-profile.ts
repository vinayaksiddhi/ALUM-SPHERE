"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { user_role } from "@prisma/client"

export async function saveProfile(
  formData: {
    fullName: string
    email: string
    college: string
    department: string
    bio: string
    // Student
    graduationYear?: string
    skills?: string[]
    // Alumni
    passingYear?: string
    company?: string
    jobRole?: string
    expertise?: string[]
  },
  role: "student" | "alumni"
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" }
    }

    const email = formData.email || clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return { success: false, error: "Email address is required" }
    }

    const targetRole: user_role = role === "alumni" ? "ALUMNI" : "STUDENT"

    // 1. Upsert base profiles record
    const profile = await db.profiles.upsert({
      where: { clerk_id: clerkUser.id },
      update: {
        name: formData.fullName,
        email: email,
        role: targetRole,
      },
      create: {
        clerk_id: clerkUser.id,
        name: formData.fullName,
        email: email,
        avatar_url: clerkUser.imageUrl || null,
        role: targetRole,
      },
    })

    // 2. Upsert specific detail sheet
    if (targetRole === "STUDENT") {
      await db.student_profiles.upsert({
        where: { profile_id: profile.id },
        update: {
          college: formData.college,
          department: formData.department,
          passing_year: parseInt(formData.graduationYear || new Date().getFullYear().toString(), 10),
          biography: formData.bio,
          skills: formData.skills || [],
        },
        create: {
          profile_id: profile.id,
          college: formData.college,
          department: formData.department,
          passing_year: parseInt(formData.graduationYear || new Date().getFullYear().toString(), 10),
          biography: formData.bio,
          skills: formData.skills || [],
        },
      })
    } else {
      await db.alumni_profiles.upsert({
        where: { profile_id: profile.id },
        update: {
          college: formData.college,
          department: formData.department,
          passing_year: parseInt(formData.passingYear || (new Date().getFullYear() - 4).toString(), 10),
          company: formData.company || "",
          job_title: formData.jobRole || "",
          biography: formData.bio,
          expertise: formData.expertise || [],
        },
        create: {
          profile_id: profile.id,
          college: formData.college,
          department: formData.department,
          passing_year: parseInt(formData.passingYear || (new Date().getFullYear() - 4).toString(), 10),
          company: formData.company || "",
          job_title: formData.jobRole || "",
          biography: formData.bio,
          expertise: formData.expertise || [],
        },
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in saveProfile action:", error)
    return { success: false, error: error.message || "Failed to save profile details" }
  }
}
