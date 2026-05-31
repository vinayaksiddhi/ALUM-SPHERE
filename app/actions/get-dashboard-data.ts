"use server"

import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function getQuestions() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const rawQuestions = await db.questions.findMany({
      orderBy: { created_at: "desc" },
      include: {
        profiles: true,
        comments: {
          include: {
            profiles: true
          }
        },
        question_likes: true,
      }
    })

    const questions = rawQuestions.map((q) => {
      // Formatted relative time
      let relativeTime = "Just now"
      if (q.created_at) {
        const diffMs = Date.now() - new Date(q.created_at).getTime()
        const diffMin = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMin / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffDays > 0) relativeTime = `${diffDays}d ago`
        else if (diffHours > 0) relativeTime = `${diffHours}h ago`
        else if (diffMin > 0) relativeTime = `${diffMin}m ago`
      }

      return {
        id: q.id,
        author: q.profiles?.name || "Anonymous",
        avatar: q.profiles?.avatar_url || "/placeholder.svg",
        question: q.question_text,
        tags: q.tags || [],
        likes: q.question_likes.length,
        comments: q.comments.length,
        timeAgo: relativeTime,
        likedByMe: q.question_likes.some(like => like.profile_id === q.author_id),
      }
    })

    return { success: true, questions }
  } catch (error: any) {
    console.error("getQuestions error:", error)
    return { success: false, error: error.message }
  }
}

export async function askQuestion(questionText: string, tags: string[]) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const profile = await db.profiles.findUnique({
      where: { clerk_id: user.id }
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    const newQuestion = await db.questions.create({
      data: {
        author_id: profile.id,
        question_text: questionText,
        tags,
      }
    })

    return { success: true, question: newQuestion }
  } catch (error: any) {
    console.error("askQuestion error:", error)
    return { success: false, error: error.message }
  }
}

export async function getDiscoverProjects() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const rawProjects = await db.projects.findMany({
      orderBy: { created_at: "desc" },
      include: {
        profiles: true,
        project_likes: true,
      }
    })

    const projects = rawProjects.map((p) => {
      let relativeTime = "Just now"
      if (p.created_at) {
        const diffMs = Date.now() - new Date(p.created_at).getTime()
        const diffMin = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMin / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffDays > 0) relativeTime = `${diffDays}d ago`
        else if (diffHours > 0) relativeTime = `${diffHours}h ago`
        else if (diffMin > 0) relativeTime = `${diffMin}m ago`
      }

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        techStack: p.tech_stack || [],
        status: p.status === "COMPLETED" ? "Completed" : p.status === "LOOKING_FOR_CONTRIBUTORS" ? "Looking for Contributors" : "In Progress",
        collaborators: 1, // Can be extended with a collaborators table in future
        likes: p.project_likes.length,
        author: p.profiles?.name || "Anonymous",
        createdAt: relativeTime,
      }
    })

    return { success: true, projects }
  } catch (error: any) {
    console.error("getDiscoverProjects error:", error)
    return { success: false, error: error.message }
  }
}

export async function createProject(title: string, description: string, techStack: string[], status: "IN_PROGRESS" | "LOOKING_FOR_CONTRIBUTORS" | "COMPLETED") {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const profile = await db.profiles.findUnique({
      where: { clerk_id: user.id }
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    const newProject = await db.projects.create({
      data: {
        owner_id: profile.id,
        title,
        description,
        tech_stack: techStack,
        status,
      }
    })

    return { success: true, project: newProject }
  } catch (error: any) {
    console.error("createProject error:", error)
    return { success: false, error: error.message }
  }
}

export async function getCommentsForQuestion(questionId: string) {
  try {
    const rawComments = await db.comments.findMany({
      where: { question_id: questionId },
      orderBy: { created_at: "asc" },
      include: {
        profiles: true,
      }
    })

    const comments = rawComments.map((c) => {
      let relativeTime = "Just now"
      if (c.created_at) {
        const diffMs = Date.now() - new Date(c.created_at).getTime()
        const diffMin = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMin / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffDays > 0) relativeTime = `${diffDays}d ago`
        else if (diffHours > 0) relativeTime = `${diffHours}h ago`
        else if (diffMin > 0) relativeTime = `${diffMin}m ago`
      }

      return {
        id: c.id,
        author: c.profiles?.name || "Anonymous",
        avatar: c.profiles?.avatar_url || "/placeholder.svg",
        content: c.content,
        timeAgo: relativeTime,
        likes: 0,
      }
    })

    return { success: true, comments }
  } catch (error: any) {
    console.error("getCommentsForQuestion error:", error)
    return { success: false, error: error.message }
  }
}

export async function addCommentToQuestion(questionId: string, content: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const profile = await db.profiles.findUnique({
      where: { clerk_id: user.id }
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    const newComment = await db.comments.create({
      data: {
        question_id: questionId,
        author_id: profile.id,
        content,
      },
      include: {
        profiles: true,
      }
    })

    return { success: true, comment: newComment }
  } catch (error: any) {
    console.error("addCommentToQuestion error:", error)
    return { success: false, error: error.message }
  }
}

export async function likeQuestion(questionId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const profile = await db.profiles.findUnique({
      where: { clerk_id: user.id }
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    const existingLike = await db.question_likes.findUnique({
      where: {
        question_id_profile_id: {
          question_id: questionId,
          profile_id: profile.id,
        }
      }
    })

    if (existingLike) {
      await db.question_likes.delete({
        where: { id: existingLike.id }
      })
      return { success: true, liked: false }
    } else {
      await db.question_likes.create({
        data: {
          question_id: questionId,
          profile_id: profile.id,
        }
      })
      return { success: true, liked: true }
    }
  } catch (error: any) {
    console.error("likeQuestion error:", error)
    return { success: false, error: error.message }
  }
}
