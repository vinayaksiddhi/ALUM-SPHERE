"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Filter, Users, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data with matching scores
const mockSuggestedAlumni = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2018",
    expertise: ["React", "System Design", "Cloud Architecture"],
    avatar: "/professional-woman.png",
    isConnected: false,
    matchScore: 95,
    matchReasons: ["Same college", "Same department", "Expertise match: React"],
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2017",
    expertise: ["Product Strategy", "User Research", "Agile"],
    avatar: "/asian-professional-man.png",
    isConnected: false,
    matchScore: 92,
    matchReasons: ["Same college", "Same department", "Active mentor"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Machine Learning Engineer",
    company: "Tesla",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2019",
    expertise: ["Deep Learning", "Python", "TensorFlow"],
    avatar: "/woman-engineer-at-work.png",
    isConnected: true,
    matchScore: 88,
    matchReasons: ["Same college", "Expertise match: Machine Learning"],
  },
  {
    id: "4",
    name: "David Park",
    role: "Full Stack Developer",
    company: "Amazon",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2020",
    expertise: ["JavaScript", "Node.js", "AWS"],
    avatar: "/asian-professional-man.png",
    isConnected: false,
    matchScore: 85,
    matchReasons: ["Same college", "Same department", "Recently graduated"],
  },
]

const mockConnectedAlumni = mockSuggestedAlumni.filter((a) => a.isConnected)

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Connections</h1>
          <p className="text-muted-foreground text-lg">Discover and connect with alumni from your college</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Connected Alumni</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">New Suggestions</p>
                    <p className="text-3xl font-bold text-foreground">8</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-accent">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
                    <p className="text-3xl font-bold text-foreground">89%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-secondary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, company, expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Suggested and Connected */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="suggested" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="suggested">
                Suggested ({mockSuggestedAlumni.filter((a) => !a.isConnected).length})
              </TabsTrigger>
              <TabsTrigger value="connected">Connected ({mockConnectedAlumni.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="suggested" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Alumni matched based on your college, department, and interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSuggestedAlumni
                    .filter((a) => !a.isConnected)
                    .map((alumni, index) => (
                      <motion.div
                        key={alumni.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="space-y-3">
                          <AlumniCard alumni={alumni} />
                          <div className="flex items-center gap-2 px-4">
                            <div className="flex-1 bg-background rounded-lg p-3 border border-border/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">Match Score</span>
                                <span className="text-sm font-bold text-primary">{alumni.matchScore}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${alumni.matchScore}%` }}
                                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                                />
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {alumni.matchReasons.map((reason) => (
                                  <Badge
                                    key={reason}
                                    variant="secondary"
                                    className="text-xs bg-primary/10 text-primary"
                                  >
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connected" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Your Network
                  </CardTitle>
                  <CardDescription>Alumni you're connected with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockConnectedAlumni.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <AlumniCard alumni={alumni} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
