// Auto-connection matching algorithm

export interface UserProfile {
  id: string
  name: string
  college: string
  department: string
  skills?: string[]
  interests?: string[]
  expertise?: string[]
  passingYear?: string
  graduationYear?: string
}

export interface MatchResult {
  alumni: UserProfile
  score: number
  reasons: string[]
}

/**
 * Calculate match score between a student and alumni
 * Scoring breakdown:
 * - Same college: 40 points
 * - Same department: 30 points
 * - Skill/expertise overlap: 20 points (max)
 * - Recent graduate (within 5 years): 10 points
 */
export function calculateMatchScore(student: UserProfile, alumni: UserProfile): MatchResult {
  let score = 0
  const reasons: string[] = []

  // College match (40 points)
  if (student.college.toLowerCase() === alumni.college.toLowerCase()) {
    score += 40
    reasons.push("Same college")
  }

  // Department match (30 points)
  if (student.department.toLowerCase() === alumni.department.toLowerCase()) {
    score += 30
    reasons.push("Same department")
  }

  // Skills/expertise overlap (max 20 points)
  const studentSkills = new Set([...(student.skills || []), ...(student.interests || [])].map((s) => s.toLowerCase()))
  const alumniExpertise = new Set((alumni.expertise || []).map((e) => e.toLowerCase()))

  const overlap = [...studentSkills].filter((skill) => alumniExpertise.has(skill))
  if (overlap.length > 0) {
    const overlapScore = Math.min(overlap.length * 5, 20)
    score += overlapScore
    reasons.push(`Expertise match: ${overlap[0]}`)
  }

  // Recent graduate bonus (10 points if graduated within 5 years)
  if (alumni.passingYear) {
    const yearsSinceGraduation = new Date().getFullYear() - Number.parseInt(alumni.passingYear)
    if (yearsSinceGraduation <= 5) {
      score += 10
      reasons.push("Recently graduated")
    }
  }

  // Activity bonus (placeholder - would come from actual activity data)
  // For now, add 5 points randomly to simulate active mentors
  if (Math.random() > 0.5) {
    score += 5
    reasons.push("Active mentor")
  }

  return {
    alumni,
    score,
    reasons,
  }
}

/**
 * Get top N alumni matches for a student
 */
export function getTopMatches(student: UserProfile, alumniList: UserProfile[], topN = 10): MatchResult[] {
  const matches = alumniList.map((alumni) => calculateMatchScore(student, alumni))

  // Sort by score descending and return top N
  return matches.sort((a, b) => b.score - a.score).slice(0, topN)
}

/**
 * Filter alumni by criteria
 */
export function filterAlumni(
  alumniList: UserProfile[],
  filters: {
    department?: string
    company?: string
    expertise?: string[]
    passingYearRange?: { min: number; max: number }
  },
): UserProfile[] {
  return alumniList.filter((alumni) => {
    if (filters.department && alumni.department !== filters.department) {
      return false
    }

    // Additional filters can be added here
    // (company filter would require company field in profile)

    if (filters.expertise && filters.expertise.length > 0) {
      const hasExpertise = filters.expertise.some((exp) =>
        (alumni.expertise || []).some((e) => e.toLowerCase().includes(exp.toLowerCase())),
      )
      if (!hasExpertise) return false
    }

    if (filters.passingYearRange && alumni.passingYear) {
      const year = Number.parseInt(alumni.passingYear)
      if (year < filters.passingYearRange.min || year > filters.passingYearRange.max) {
        return false
      }
    }

    return true
  })
}

/**
 * Real-time notification when new matches become available
 */
export function subscribeToNewMatches(studentId: string, callback: (newMatches: MatchResult[]) => void): () => void {
  // This would connect to a real-time database in production
  // For now, simulate with a simple interval
  const interval = setInterval(() => {
    // Check for new alumni or updated profiles
    // Call callback with new matches if found
  }, 60000) // Check every minute

  // Return unsubscribe function
  return () => clearInterval(interval)
}
