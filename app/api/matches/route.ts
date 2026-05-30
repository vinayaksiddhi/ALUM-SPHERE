import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { getTopMatches, UserProfile } from "@/lib/matching-algorithm"

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch current student profile
    const student = await db.profiles.findUnique({
      where: { clerk_id: clerkId },
      include: { student_profiles: true },
    })

    if (!student || !student.student_profiles) {
      return NextResponse.json({ matches: [], total: 0 })
    }

    // 2. Fetch all alumni profiles
    const alumniListRaw = await db.alumni_profiles.findMany({
      include: { profiles: true },
    })

    // Convert database models to UserProfile interfaces expected by matching-algorithm
    const studentProfile: UserProfile = {
      id: student.id,
      name: student.name,
      college: student.student_profiles.college,
      department: student.student_profiles.department,
      skills: student.student_profiles.skills,
    }

    const alumniList: (UserProfile & { company?: string; role?: string })[] = alumniListRaw.map((al) => ({
      id: al.profiles.id,
      name: al.profiles.name,
      college: al.college,
      department: al.department,
      expertise: al.expertise,
      company: al.company || undefined,
      role: al.job_title || undefined,
      passingYear: al.passing_year?.toString(),
    }))

    // 3. Compute top matches using the mathematical matching algorithm
    const matches = getTopMatches(studentProfile, alumniList, 5) as unknown as {
      alumni: UserProfile & { company?: string; role?: string }
      score: number
      reasons: string[]
    }[]

    // Re-format to match frontend card presentation specifications
    const formattedMatches = matches.map((m) => ({
      id: m.alumni.id,
      score: m.score,
      alumni: {
        id: m.alumni.id,
        name: m.alumni.name,
        college: m.alumni.college,
        department: m.alumni.department,
        company: m.alumni.company || "Google",
        role: m.alumni.role || "Software Engineer",
        expertise: m.alumni.expertise || [],
        avatar: "/placeholder.svg",
      },
      reasons: m.reasons,
    }))

    return NextResponse.json({ matches: formattedMatches, total: formattedMatches.length })
  } catch (error: any) {
    console.error("Error in matches GET API:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { alumniId, message } = body

    if (!alumniId) {
      return NextResponse.json({ error: "Alumni ID is required" }, { status: 400 })
    }

    // 1. Fetch sender profile
    const sender = await db.profiles.findUnique({
      where: { clerk_id: clerkId },
    })

    if (!sender) {
      return NextResponse.json({ error: "Sender profile not found" }, { status: 404 })
    }

    // 2. Create connection request in the database
    const connReq = await db.connection_requests.upsert({
      where: {
        sender_id_receiver_id: {
          sender_id: sender.id,
          receiver_id: alumniId,
        },
      },
      update: {
        message: message || "",
        status: "PENDING",
      },
      create: {
        sender_id: sender.id,
        receiver_id: alumniId,
        message: message || "",
        status: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Connection request sent successfully",
      requestId: connReq.id,
    })
  } catch (error: any) {
    console.error("Error in matches POST API:", error)
    return NextResponse.json({ error: error.message || "Failed to create connection request" }, { status: 500 })
  }
}
