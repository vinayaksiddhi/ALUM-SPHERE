"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, MapPin, Briefcase, GraduationCap, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import DashboardLayout from "@/components/dashboard-layout"
import AlumniCard from "@/components/alumni-card"

export default function SearchAlumniPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [filters, setFilters] = useState({
    companies: [] as string[],
    departments: [] as string[],
    passingYears: [] as string[],
    locations: [] as string[],
    availability: false,
    matchScore: [0],
  })

  // Mock alumni data
  const allAlumni = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Software Engineer",
      company: "Google",
      college: "Stanford University",
      department: "Computer Science",
      passingYear: "2018",
      location: "San Francisco, CA",
      expertise: ["React", "Node.js", "Cloud Architecture"],
      avatar: "/professional-woman.png",
      isConnected: false,
      matchScore: 95,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Product Manager",
      company: "Microsoft",
      college: "Stanford University",
      department: "Business Administration",
      passingYear: "2019",
      location: "Seattle, WA",
      expertise: ["Product Strategy", "Data Analytics", "Agile"],
      avatar: "/asian-professional-man.png",
      isConnected: true,
      matchScore: 88,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "UX Design Lead",
      company: "Apple",
      college: "Stanford University",
      department: "Design",
      passingYear: "2017",
      location: "Cupertino, CA",
      expertise: ["UI/UX Design", "Figma", "Design Systems"],
      avatar: "/woman-engineer-at-work.png",
      isConnected: false,
      matchScore: 92,
    },
    {
      id: "4",
      name: "David Kim",
      role: "Data Scientist",
      company: "Amazon",
      college: "Stanford University",
      department: "Computer Science",
      passingYear: "2020",
      location: "Seattle, WA",
      expertise: ["Machine Learning", "Python", "Big Data"],
      avatar: "/placeholder.svg?height=100&width=100",
      isConnected: false,
      matchScore: 85,
    },
    {
      id: "5",
      name: "Jessica Brown",
      role: "Marketing Director",
      company: "Meta",
      college: "Stanford University",
      department: "Marketing",
      passingYear: "2016",
      location: "Menlo Park, CA",
      expertise: ["Digital Marketing", "Brand Strategy", "SEO"],
      avatar: "/placeholder.svg?height=100&width=100",
      isConnected: false,
      matchScore: 78,
    },
    {
      id: "6",
      name: "Robert Taylor",
      role: "DevOps Engineer",
      company: "Netflix",
      college: "Stanford University",
      department: "Computer Science",
      passingYear: "2019",
      location: "Los Gatos, CA",
      expertise: ["AWS", "Docker", "Kubernetes"],
      avatar: "/placeholder.svg?height=100&width=100",
      isConnected: true,
      matchScore: 90,
    },
  ]

  // Filter alumni based on search and filters
  const filteredAlumni = allAlumni.filter((alumni) => {
    const matchesSearch =
      searchQuery === "" ||
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCompany = filters.companies.length === 0 || filters.companies.includes(alumni.company)

    const matchesDepartment = filters.departments.length === 0 || filters.departments.includes(alumni.department)

    const matchesYear = filters.passingYears.length === 0 || filters.passingYears.includes(alumni.passingYear)

    const matchesLocation = filters.locations.length === 0 || filters.locations.includes(alumni.location)

    const matchesScore = alumni.matchScore >= filters.matchScore[0]

    return matchesSearch && matchesCompany && matchesDepartment && matchesYear && matchesLocation && matchesScore
  })

  // Sort alumni
  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    switch (sortBy) {
      case "matchScore":
        return b.matchScore - a.matchScore
      case "name":
        return a.name.localeCompare(b.name)
      case "passingYear":
        return Number.parseInt(b.passingYear) - Number.parseInt(a.passingYear)
      default:
        return b.matchScore - a.matchScore
    }
  })

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value)
        ? (prev[category] as string[]).filter((item) => item !== value)
        : [...(prev[category] as string[]), value],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      companies: [],
      departments: [],
      passingYears: [],
      locations: [],
      availability: false,
      matchScore: [0],
    })
  }

  const activeFilterCount =
    filters.companies.length +
    filters.departments.length +
    filters.passingYears.length +
    filters.locations.length +
    (filters.availability ? 1 : 0) +
    (filters.matchScore[0] > 0 ? 1 : 0)

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Search Alumni</h1>
          <p className="text-muted-foreground mt-1">Find and connect with alumni from your college</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, role, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border text-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12 bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="matchScore">Match Score</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="passingYear">Recent Graduates</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Alumni</SheetTitle>
                  <SheetDescription>Refine your search with advanced filters</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Match Score Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Match Score</Label>
                      <Badge variant="secondary">{filters.matchScore[0]}%+</Badge>
                    </div>
                    <Slider
                      value={filters.matchScore}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, matchScore: value }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Company
                    </Label>
                    <div className="space-y-2">
                      {["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix"].map((company) => (
                        <div key={company} className="flex items-center space-x-2">
                          <Checkbox
                            id={`company-${company}`}
                            checked={filters.companies.includes(company)}
                            onCheckedChange={() => toggleFilter("companies", company)}
                          />
                          <label
                            htmlFor={`company-${company}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {company}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Department
                    </Label>
                    <div className="space-y-2">
                      {["Computer Science", "Business Administration", "Design", "Marketing", "Engineering"].map(
                        (dept) => (
                          <div key={dept} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dept-${dept}`}
                              checked={filters.departments.includes(dept)}
                              onCheckedChange={() => toggleFilter("departments", dept)}
                            />
                            <label
                              htmlFor={`dept-${dept}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {dept}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Passing Year Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Passing Year</Label>
                    <div className="space-y-2">
                      {["2016", "2017", "2018", "2019", "2020", "2021"].map((year) => (
                        <div key={year} className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${year}`}
                            checked={filters.passingYears.includes(year)}
                            onCheckedChange={() => toggleFilter("passingYears", year)}
                          />
                          <label
                            htmlFor={`year-${year}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Class of {year}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <div className="space-y-2">
                      {["San Francisco, CA", "Seattle, WA", "Cupertino, CA", "Menlo Park, CA", "Los Gatos, CA"].map(
                        (location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={filters.locations.includes(location)}
                              onCheckedChange={() => toggleFilter("locations", location)}
                            />
                            <label
                              htmlFor={`location-${location}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {location}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {activeFilterCount > 0 && (
                    <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.companies.map((company) => (
              <Badge key={company} variant="secondary" className="gap-1 pr-1">
                {company}
                <button
                  onClick={() => toggleFilter("companies", company)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.departments.map((dept) => (
              <Badge key={dept} variant="secondary" className="gap-1 pr-1">
                {dept}
                <button
                  onClick={() => toggleFilter("departments", dept)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.passingYears.map((year) => (
              <Badge key={year} variant="secondary" className="gap-1 pr-1">
                Class of {year}
                <button
                  onClick={() => toggleFilter("passingYears", year)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.locations.map((location) => (
              <Badge key={location} variant="secondary" className="gap-1 pr-1">
                {location}
                <button
                  onClick={() => toggleFilter("locations", location)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{sortedAlumni.length}</span> alumni
          </p>
        </div>

        {/* Alumni Grid */}
        <div className="space-y-4">
          {sortedAlumni.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No alumni found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find more results</p>
            </motion.div>
          ) : (
            sortedAlumni.map((alumni, index) => (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <AlumniCard alumni={alumni} />
                  <div className="flex flex-col items-center gap-1 px-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">{alumni.matchScore}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Match</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
