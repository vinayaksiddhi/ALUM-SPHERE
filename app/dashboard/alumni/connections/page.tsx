"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MessageSquare, GraduationCap } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockConnectedStudents = [
  {
    id: "1",
    name: "Alex Kumar",
    year: "3rd Year",
    department: "Computer Science",
    college: "MIT",
    interests: ["Web Development", "AI/ML", "Cybersecurity"],
    avatar: "/placeholder.svg",
    lastActive: "2 hours ago",
    connectionDate: "2 weeks ago",
  },
  {
    id: "2",
    name: "Emma Wilson",
    year: "4th Year",
    department: "Computer Science",
    college: "MIT",
    interests: ["Product Management", "UX Design", "Startups"],
    avatar: "/placeholder.svg",
    lastActive: "1 day ago",
    connectionDate: "1 month ago",
  },
  {
    id: "3",
    name: "Raj Patel",
    year: "2nd Year",
    department: "Computer Science",
    college: "MIT",
    interests: ["Data Science", "Machine Learning", "Python"],
    avatar: "/placeholder.svg",
    lastActive: "5 hours ago",
    connectionDate: "3 days ago",
  },
]

const mockOtherAlumni = [
  {
    id: "4",
    name: "Robert Chen",
    role: "Tech Lead",
    company: "Apple",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2016",
    expertise: ["iOS Development", "Swift", "Mobile Architecture"],
    avatar: "/asian-professional-man.png",
    isConnected: false,
  },
  {
    id: "5",
    name: "Lisa Martinez",
    role: "Data Scientist",
    company: "Netflix",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2017",
    expertise: ["Machine Learning", "Big Data", "Python"],
    avatar: "/professional-woman.png",
    isConnected: true,
  },
  {
    id: "6",
    name: "James Taylor",
    role: "Engineering Manager",
    company: "Uber",
    college: "MIT",
    department: "Computer Science",
    passingYear: "2015",
    expertise: ["Distributed Systems", "Leadership", "Scalability"],
    avatar: "/placeholder.svg",
    isConnected: false,
  },
]

export default function AlumniConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">My Network</h1>
          <p className="text-muted-foreground text-lg">Manage your connections with students and fellow alumni</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Students Mentoring</p>
                    <p className="text-3xl font-bold text-foreground">{mockConnectedStudents.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-primary">
                    <GraduationCap className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">Alumni Connections</p>
                    <p className="text-3xl font-bold text-foreground">
                      {mockOtherAlumni.filter((a) => a.isConnected).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-accent">
                    <Users className="h-6 w-6" />
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
                    <p className="text-sm text-muted-foreground mb-1">Active Chats</p>
                    <p className="text-3xl font-bold text-foreground">8</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card text-secondary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, year, interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-40 bg-background">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="students">Students ({mockConnectedStudents.length})</TabsTrigger>
              <TabsTrigger value="alumni">Alumni ({mockOtherAlumni.filter((a) => a.isConnected).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Students You're Mentoring
                  </CardTitle>
                  <CardDescription>Students connected to you for guidance and mentorship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockConnectedStudents.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="glass border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {student.year}
                                  </Badge>
                                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                    {student.department}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{student.college}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {student.interests.map((interest) => (
                                  <Badge key={interest} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <div className="text-sm text-muted-foreground">
                                  <span>Connected {student.connectionDate}</span>
                                  <span className="mx-2">•</span>
                                  <span>Active {student.lastActive}</span>
                                </div>
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alumni" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Fellow Alumni Network
                  </CardTitle>
                  <CardDescription>Connect with other alumni from your college</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockOtherAlumni.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="glass border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={alumni.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {alumni.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg text-foreground">{alumni.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {alumni.role} at {alumni.company}
                                </p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    Class of {alumni.passingYear}
                                  </Badge>
                                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                    {alumni.department}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {alumni.expertise.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 pt-2">
                                {alumni.isConnected ? (
                                  <>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      View Profile
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                                      <Users className="h-4 w-4 mr-2" />
                                      Connect
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      View Profile
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
