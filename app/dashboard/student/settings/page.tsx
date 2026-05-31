"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Lock, Shield, Save, Loader2 } from "lucide-react"
import { getProfile, updateAvatarUrl } from "@/app/actions/get-profile"
import { saveProfile } from "@/app/actions/save-profile"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function StudentSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [newSkill, setNewSkill] = useState("")

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    bio: "",
    college: "",
    department: "",
    graduationYear: "",
    skills: [] as string[],
    emailNotifications: true,
    pushNotifications: true,
    connectionRequests: true,
    messages: true,
    projectUpdates: true,
    weeklyDigest: false,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessagesFromAnyone: true,
  })

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true)
      const res = await getProfile()
      if (res.success && res.profile) {
        setProfile(res.profile)
        const sProfile = (res.profile.student_profiles || {}) as any
        setSettings((prev) => ({
          ...prev,
          name: res.profile.name || "",
          email: res.profile.email || "",
          bio: sProfile.biography || "",
          college: sProfile.college || "",
          department: sProfile.department || "",
          graduationYear: sProfile.passing_year ? sProfile.passing_year.toString() : "",
          skills: sProfile.skills || [],
        }))
      } else {
        toast.error("Failed to load settings profile")
      }
      setIsLoading(false)
    }
    loadSettings()
  }, [])

  const handleAvatarChange = async (url: string) => {
    const res = await updateAvatarUrl(url)
    if (res.success) {
      setProfile((prev: any) => ({
        ...prev,
        avatar_url: url
      }))
      toast.success("Profile photo updated!")
    } else {
      toast.error(res.error || "Failed to update profile photo")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await saveProfile({
      fullName: settings.name,
      email: settings.email,
      college: settings.college,
      department: settings.department,
      bio: settings.bio,
      graduationYear: settings.graduationYear,
      skills: settings.skills,
    }, "student")

    if (res.success) {
      toast.success("Profile settings saved successfully!")
    } else {
      toast.error(res.error || "Failed to save settings")
    }
    setIsSaving(false)
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault()
      if (!settings.skills.includes(newSkill.trim())) {
        setSettings((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        }))
      }
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }))
  }

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details and public information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-start gap-4">
                  <Label>Profile Picture</Label>
                  <ImageUpload
                    value={profile?.avatar_url}
                    onChange={handleAvatarChange}
                    fallback={settings.name || "S"}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="college">College</Label>
                    <Input
                      id="college"
                      value={settings.college}
                      onChange={(e) => setSettings({ ...settings, college: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={settings.department}
                      onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Input
                      id="year"
                      value={settings.graduationYear}
                      onChange={(e) => setSettings({ ...settings, graduationYear: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills (Press Enter to Add)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all gap-1 py-1"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} <span className="text-[10px] opacity-70">×</span>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add a skill and press Enter"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <select
                    id="visibility"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  >
                    <option value="public">Public - Everyone can see your profile</option>
                    <option value="connections">Connections Only - Only your connections</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Password and advanced settings are configured via your Auth Provider.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
