"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  MessageSquare,
  Edit,
  Share2,
  LinkedinIcon,
  Globe,
  Loader2,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"
import { getProfile, updateAvatarUrl } from "@/app/actions/get-profile"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"

export default function AlumniProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("about")
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      const res = await getProfile()
      if (res.success && res.profile) {
        setProfile(res.profile)
      } else {
        toast.error("Failed to load profile details")
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  const handleAvatarChange = async (url: string) => {
    const res = await updateAvatarUrl(url)
    if (res.success) {
      setProfile((prev: any) => ({
        ...prev,
        avatar_url: url
      }))
      toast.success("Profile photo updated successfully!")
    } else {
      toast.error(res.error || "Failed to update profile photo")
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role="alumni">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout role="alumni">
        <div className="text-center py-10">
          <p className="text-muted-foreground">No profile details found. Please complete your settings.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/alumni/settings")}>
            Go to Settings
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const alumniProfile = profile.alumni_profiles || {}
  const name = profile.name || "Anonymous User"
  const email = profile.email || "No email"
  const college = alumniProfile.college || "No College Listed"
  const department = alumniProfile.department || "No Department Listed"
  const company = alumniProfile.company || "Company N/A"
  const jobTitle = alumniProfile.job_title || "Alumni Member"
  const passingYear = alumniProfile.passing_year ? `Class of ${alumniProfile.passing_year}` : "Graduation Year N/A"
  const bio = alumniProfile.biography || "No biography added yet. Introduce yourself in your profile settings!"
  const expertise = alumniProfile.expertise || []

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/alumni/settings")}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start shrink-0">
              <ImageUpload
                value={profile.avatar_url}
                onChange={handleAvatarChange}
                fallback={name}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                <p className="text-muted-foreground">{jobTitle} at {company}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>{college} • {passingYear}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>{department} Department</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{email}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bio</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{bio}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertise.length > 0 ? (
                  expertise.map((area: string) => (
                    <Badge key={area} variant="secondary" className="px-3 py-1">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No expertise tags added yet.</span>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Education</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{department}</h4>
                    <p className="text-sm text-muted-foreground">{college}</p>
                    <p className="text-sm text-muted-foreground">{passingYear}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
