"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Lock, Shield, Eye, EyeOff, Save, Camera, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AlumniSettingsPage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Profile
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    bio: "Software Engineer at TechCorp, passionate about mentoring the next generation",
    college: "MIT",
    department: "Computer Science",
    graduationYear: "2018",
    company: "TechCorp",
    position: "Senior Software Engineer",
    expertise: ["Web Development", "Cloud Architecture", "Team Leadership"],

    // Mentorship
    availableForMentorship: true,
    maxStudents: 5,
    preferredTopics: ["Career Advice", "Technical Skills", "Interview Prep"],

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    connectionRequests: true,
    messages: true,
    studentQuestions: true,
    weeklyReport: true,

    // Privacy
    profileVisibility: "public",
    showEmail: false,
    showCompany: true,
    allowMessagesFromAnyone: false,
  })

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <DashboardLayout role="alumni">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and mentorship preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Mentorship</span>
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
                <CardDescription>Update your professional profile and public information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/professional-woman.png" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    placeholder="Tell students about your professional journey..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Current Company</Label>
                    <Input
                      id="company"
                      value={settings.company}
                      onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={settings.position}
                      onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                    />
                  </div>
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
                  <Label>Areas of Expertise</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add an expertise area (press Enter)" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentorship Settings */}
          <TabsContent value="mentorship" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Mentorship Preferences</CardTitle>
                <CardDescription>Configure your mentorship availability and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="mentorship-available">Available for Mentorship</Label>
                    <p className="text-sm text-muted-foreground">Allow students to connect with you for mentorship</p>
                  </div>
                  <Switch
                    id="mentorship-available"
                    checked={settings.availableForMentorship}
                    onCheckedChange={(checked) => setSettings({ ...settings, availableForMentorship: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-students">Maximum Active Mentees</Label>
                  <Input
                    id="max-students"
                    type="number"
                    value={settings.maxStudents}
                    onChange={(e) => setSettings({ ...settings, maxStudents: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Limit the number of students you can mentor simultaneously
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Mentorship Topics</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.preferredTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add a topic (press Enter)" />
                  <p className="text-sm text-muted-foreground">
                    Topics you're most comfortable discussing with students
                  </p>
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

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <h4 className="font-medium">Activity Notifications</h4>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="conn-req">Connection Requests</Label>
                      <p className="text-sm text-muted-foreground">When a student wants to connect</p>
                    </div>
                    <Switch
                      id="conn-req"
                      checked={settings.connectionRequests}
                      onCheckedChange={(checked) => setSettings({ ...settings, connectionRequests: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">When you receive a new message</p>
                    </div>
                    <Switch
                      id="messages"
                      checked={settings.messages}
                      onCheckedChange={(checked) => setSettings({ ...settings, messages: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="questions">Student Questions</Label>
                      <p className="text-sm text-muted-foreground">When students ask questions in your areas</p>
                    </div>
                    <Switch
                      id="questions"
                      checked={settings.studentQuestions}
                      onCheckedChange={(checked) => setSettings({ ...settings, studentQuestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="report">Weekly Impact Report</Label>
                      <p className="text-sm text-muted-foreground">Summary of your mentorship impact</p>
                    </div>
                    <Switch
                      id="report"
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
                    />
                  </div>
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
                    <option value="public">Public - All students can see your profile</option>
                    <option value="same-college">Same College - Only students from your college</option>
                    <option value="connections">Connections Only - Only your connections</option>
                  </select>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Display your email on your profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-company">Show Company Details</Label>
                    <p className="text-sm text-muted-foreground">Display your company and position</p>
                  </div>
                  <Switch
                    id="show-company"
                    checked={settings.showCompany}
                    onCheckedChange={(checked) => setSettings({ ...settings, showCompany: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="allow-messages">Allow Messages from Anyone</Label>
                    <p className="text-sm text-muted-foreground">Let any student send you messages</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={settings.allowMessagesFromAnyone}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowMessagesFromAnyone: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                  </div>

                  <Button className="w-full sm:w-auto">Update Password</Button>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">Manage devices where you're currently logged in</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">MacBook Pro</p>
                        <p className="text-sm text-muted-foreground">Seattle, WA • Active now</p>
                      </div>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">iPad Pro</p>
                        <p className="text-sm text-muted-foreground">Seattle, WA • 1 day ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
