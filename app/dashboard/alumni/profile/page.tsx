"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"

export default function AlumniProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("about")

  const stats = [
    { label: "Students Mentored", value: "28" },
    { label: "Connections", value: "156" },
    { label: "Posts Shared", value: "34" },
    { label: "Satisfaction Rate", value: "98%" },
  ]

  const expertise = [
    "Software Engineering",
    "Product Management",
    "Career Guidance",
    "Technical Interviews",
    "Startup Advice",
    "Cloud Architecture",
  ]

  const experience = [
    {
      title: "Senior Software Engineer",
      company: "Google",
      period: "2020 - Present",
      description: "Leading development of cloud infrastructure solutions",
    },
    {
      title: "Software Engineer",
      company: "Microsoft",
      period: "2016 - 2020",
      description: "Worked on Azure platform development",
    },
  ]

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
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-lg">
                <AvatarImage src="/professional-woman.png" />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">SJ</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Change Photo
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Sarah Johnson</h2>
                <p className="text-muted-foreground">Senior Software Engineer at Google</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="h-8">
                    <LinkedinIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>MIT • Class of 2016</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>8+ years experience</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>sarah.j@gmail.com</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Bio</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experienced software engineer passionate about cloud infrastructure and distributed systems. I love
                mentoring students and helping them navigate their career paths in tech. With over 8 years of industry
                experience at top tech companies, I enjoy sharing insights about technical interviews, career growth,
                and the tech industry.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertise.map((area) => (
                  <Badge key={area} variant="secondary" className="px-3 py-1">
                    {area}
                  </Badge>
                ))}
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
                    <h4 className="font-semibold text-foreground">Master of Science in Computer Science</h4>
                    <p className="text-sm text-muted-foreground">Massachusetts Institute of Technology</p>
                    <p className="text-sm text-muted-foreground">2014 - 2016</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.period}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Mentorship Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">28</div>
                  <div className="text-sm text-muted-foreground">Students Mentored</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/5">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-secondary">156</div>
                  <div className="text-sm text-muted-foreground">Messages Exchanged</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-accent-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Testimonials</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-foreground italic">
                    "Sarah's guidance was invaluable in preparing for technical interviews. Her insights helped me land
                    my dream job!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- John Doe, Software Engineer at Amazon</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-foreground italic">
                    "Amazing mentor! Sarah took the time to review my projects and provided constructive feedback that
                    really improved my skills."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- Emily Chen, Student at MIT</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
