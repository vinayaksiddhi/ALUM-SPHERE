"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Building2,
  GraduationCap,
  Calendar,
  Mail,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import { syncUser } from "@/app/actions/sync-user"
import { saveProfile } from "@/app/actions/save-profile"

export default function SetupPage() {
  const router = useRouter()
  const params = useParams()
  const role = params?.role as "student" | "alumni" | undefined

  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(4)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    department: "",
    profilePhoto: "",
    bio: "",
    // Student specific
    graduationYear: "",
    currentSemester: "",
    skills: [] as string[],
    lookingFor: [] as string[],
    // Alumni specific
    passingYear: "",
    company: "",
    jobRole: "",
    yearsOfExperience: "",
    expertise: [] as string[],
    willingToMentor: [] as string[],
  })

  useEffect(() => {
    async function loadUser() {
      if (!role) return
      setLoading(true)
      const res = await syncUser()
      if (res.success && res.profile) {
        const p = res.profile
        setFormData((prev) => ({
          ...prev,
          fullName: p.name || "",
          email: p.email || "",
          profilePhoto: p.avatar_url || "",
          bio: p.student_profiles?.biography || p.alumni_profiles?.biography || "",
          college: p.student_profiles?.college || p.alumni_profiles?.college || "",
          department: p.student_profiles?.department || p.alumni_profiles?.department || "",
          graduationYear: p.student_profiles?.passing_year?.toString() || "",
          passingYear: p.alumni_profiles?.passing_year?.toString() || "",
          company: p.alumni_profiles?.company || "",
          jobRole: p.alumni_profiles?.job_title || "",
          skills: p.student_profiles?.skills || [],
          expertise: p.alumni_profiles?.expertise || [],
        }))
      }
      setLoading(false)
    }
    loadUser()
  }, [role])

  const [newTag, setNewTag] = useState("")

  const handleAddTag = (field: "skills" | "lookingFor" | "expertise" | "willingToMentor") => {
    if (newTag.trim() && !formData[field].includes(newTag.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (field: "skills" | "lookingFor" | "expertise" | "willingToMentor", tag: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((t) => t !== tag),
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!role) return
    setIsSubmitting(true)
    const res = await saveProfile(formData, role)
    if (res.success) {
      router.push(`/dashboard/${role}`)
    } else {
      alert(res.error || "Failed to save profile.")
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  if (!role || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading your profile details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 dark py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sidebar-foreground mb-2">
            Complete Your {role === "student" ? "Student" : "Alumni"} Profile
          </h1>
          <p className="text-muted-foreground">Help us personalize your experience</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: currentStep >= index + 1 ? 1 : 0.8,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > index + 1
                      ? "bg-primary text-primary-foreground"
                      : currentStep === index + 1
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-sidebar-accent text-muted-foreground"
                  }`}
                >
                  {currentStep > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                </motion.div>
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-sidebar-accent rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: currentStep > index + 1 ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
            />
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-2xl p-8 mb-6"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-sidebar-foreground">Basic Information</h2>
                </div>

                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                    <AvatarImage src={formData.profilePhoto || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {formData.fullName.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-sidebar-accent border-sidebar-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Introduction</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border min-h-24 resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.bio.length} / 500</p>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-sidebar-foreground">Academic Details</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College / University</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="college"
                      placeholder="MIT, Stanford, IIT..."
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="pl-10 bg-sidebar-accent border-sidebar-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department / Stream</Label>
                  <Input
                    id="department"
                    placeholder="Computer Science, Mechanical, etc."
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border"
                  />
                </div>

                {role === "student" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="graduationYear"
                            type="number"
                            placeholder="2026"
                            value={formData.graduationYear}
                            onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                            className="pl-10 bg-sidebar-accent border-sidebar-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentSemester">Current Semester</Label>
                        <Input
                          id="currentSemester"
                          type="number"
                          placeholder="5"
                          value={formData.currentSemester}
                          onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                          className="bg-sidebar-accent border-sidebar-border"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="passingYear">Passing Year</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="passingYear"
                        type="number"
                        placeholder="2015"
                        value={formData.passingYear}
                        onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                        className="pl-10 bg-sidebar-accent border-sidebar-border"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && role === "alumni" && (
              <motion.div
                key="step3-alumni"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-sidebar-foreground">Professional Details</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Current Company / Organization</Label>
                  <Input
                    id="company"
                    placeholder="Google, Microsoft, Startup Inc..."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role / Position</Label>
                  <Input
                    id="jobRole"
                    placeholder="Senior Software Engineer, Product Manager..."
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="5"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className="bg-sidebar-accent border-sidebar-border"
                  />
                </div>
              </motion.div>
            )}

            {((currentStep === 3 && role === "student") || (currentStep === 4 && role === "alumni")) && (
              <motion.div
                key={`step${currentStep}-skills`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-sidebar-foreground">
                    {role === "student" ? "Skills & Interests" : "Expertise & Mentoring"}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label>{role === "student" ? "Your Skills" : "Areas of Expertise"}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., React, Python, Machine Learning..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag(role === "student" ? "skills" : "expertise")
                        }
                      }}
                      className="bg-sidebar-accent border-sidebar-border"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddTag(role === "student" ? "skills" : "expertise")}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(role === "student" ? formData.skills : formData.expertise).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(role === "student" ? "skills" : "expertise", tag)}
                          className="ml-2 hover:text-primary-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{role === "student" ? "Looking for guidance in:" : "Willing to mentor in:"}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Career advice, Interview prep..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag(role === "student" ? "lookingFor" : "willingToMentor")
                        }
                      }}
                      className="bg-sidebar-accent border-sidebar-border"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddTag(role === "student" ? "lookingFor" : "willingToMentor")}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(role === "student" ? formData.lookingFor : formData.willingToMentor).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(role === "student" ? "lookingFor" : "willingToMentor", tag)}
                          className="ml-2 hover:text-accent-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && role === "student" && (
              <motion.div
                key="step4-student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-sidebar-foreground mb-2">All Set!</h2>
                  <p className="text-muted-foreground">Your profile is ready. Let's connect you with alumni!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="flex-1 gap-2 bg-sidebar-accent border-sidebar-border disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
              Next
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button disabled={isSubmitting} onClick={handleComplete} className="flex-1 gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Complete Setup"}
              {!isSubmitting && <Check className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
