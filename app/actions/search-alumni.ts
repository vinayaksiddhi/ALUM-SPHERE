"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function searchAlumni(filters?: {
  searchQuery?: string;
  companies?: string[];
  departments?: string[];
  passingYears?: string[];
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Find the current user's profile to get their college and profile ID
  const currentUserProfile = await db.profiles.findUnique({
    where: { clerk_id: user.id },
    include: { student_profiles: true, alumni_profiles: true }
  })

  if (!currentUserProfile) {
    throw new Error("Profile not found")
  }

  const userCollege = currentUserProfile.student_profiles?.college || currentUserProfile.alumni_profiles?.college

  // Base query: All alumni from the same college
  let whereClause: any = {
    college: userCollege
  }

  // Apply filters
  if (filters?.companies && filters.companies.length > 0) {
    whereClause.company = { in: filters.companies }
  }

  if (filters?.departments && filters.departments.length > 0) {
    whereClause.department = { in: filters.departments }
  }

  if (filters?.passingYears && filters.passingYears.length > 0) {
    // Convert string years to numbers
    whereClause.passing_year = { in: filters.passingYears.map(y => parseInt(y)) }
  }

  if (filters?.searchQuery) {
    const q = filters.searchQuery
    whereClause.OR = [
      { company: { contains: q, mode: 'insensitive' } },
      { job_title: { contains: q, mode: 'insensitive' } },
      { department: { contains: q, mode: 'insensitive' } },
      { profiles: { name: { contains: q, mode: 'insensitive' } } },
      { expertise: { hasSome: [q] } } // If user searches exactly a skill
    ]
  }

  // Query the database
  const rawAlumni = await db.alumni_profiles.findMany({
    where: whereClause,
    include: {
      profiles: true,
    }
  })

  // Also query connection requests to determine isConnected status
  const connectionRequests = await db.connection_requests.findMany({
    where: {
      sender_id: currentUserProfile.id
    }
  })

  const connectionMap = new Map()
  connectionRequests.forEach(req => {
    connectionMap.set(req.receiver_id, req.status)
  })

  // Map to the format expected by the frontend
  return rawAlumni.map((alumni) => {
    // Basic match score algorithm (can be improved)
    let matchScore = 50
    if (alumni.department === currentUserProfile.student_profiles?.department) matchScore += 20
    if (currentUserProfile.student_profiles?.skills) {
       const commonSkills = alumni.expertise.filter(skill => currentUserProfile.student_profiles?.skills.includes(skill))
       matchScore += Math.min(30, commonSkills.length * 10)
    }

    return {
      id: alumni.profiles.id, // Using the global profile ID for connections
      alumni_profile_id: alumni.id,
      name: alumni.profiles.name,
      role: alumni.job_title || "Alumni",
      company: alumni.company || "Unknown Company",
      college: alumni.college,
      department: alumni.department,
      passingYear: alumni.passing_year.toString(),
      location: "Remote", // Location is not in DB currently
      expertise: alumni.expertise,
      avatar: alumni.profiles.avatar_url || "/placeholder.svg?height=100&width=100",
      isConnected: connectionMap.get(alumni.profiles.id) === "ACCEPTED",
      connectionStatus: connectionMap.get(alumni.profiles.id) || null,
      matchScore: Math.min(100, matchScore),
    }
  })
}
