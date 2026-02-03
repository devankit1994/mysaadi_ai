"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Filter,
  Grid3X3,
  LayoutList,
  Search,
  Lock,
  Verified,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const profiles = [
  {
    id: 1,
    name: "Rahul",
    age: 28,
    city: "Delhi",
    profession: "Product Manager",
    education: "IIM Ahmedabad",
    image: "/handsome-indian-man-professional-portrait-smiling.jpg",
    interests: ["Fitness", "Movies", "Cricket"],
    compatibility: 95,
    verified: true,
    religion: "Hindu",
    height: "5'10\"",
  },
  {
    id: 2,
    name: "Arjun",
    age: 29,
    city: "Bangalore",
    profession: "Data Scientist",
    education: "BITS Pilani",
    image: "/indian-man-tech-professional-portrait.jpg",
    interests: ["Tech", "Gaming", "Music"],
    compatibility: 92,
    verified: true,
    religion: "Hindu",
    height: "5'11\"",
  },
  {
    id: 3,
    name: "Vikram",
    age: 30,
    city: "Mumbai",
    profession: "Entrepreneur",
    education: "ISB",
    image: "/indian-man-entrepreneur-professional-portrait.jpg",
    interests: ["Business", "Tennis", "Reading"],
    compatibility: 88,
    verified: true,
    religion: "Jain",
    height: "5'9\"",
  },
  {
    id: 4,
    name: "Karan",
    age: 27,
    city: "Pune",
    profession: "Software Engineer",
    education: "IIT Bombay",
    image: "/indian-man-software-engineer-professional-portrait.jpg",
    interests: ["Travel", "Photography", "Cooking"],
    compatibility: 85,
    verified: true,
    religion: "Hindu",
    height: "5'8\"",
  },
  {
    id: 5,
    name: "Aditya",
    age: 31,
    city: "Hyderabad",
    profession: "Doctor",
    education: "AIIMS",
    image: "/indian-man-doctor-professional-portrait.jpg",
    interests: ["Music", "Reading", "Fitness"],
    compatibility: 82,
    verified: true,
    religion: "Hindu",
    height: "6'0\"",
  },
  {
    id: 6,
    name: "Rohan",
    age: 28,
    city: "Chennai",
    profession: "Finance Analyst",
    education: "XLRI",
    image: "/indian-man-finance-professional-portrait.jpg",
    interests: ["Cricket", "Movies", "Travel"],
    compatibility: 80,
    verified: true,
    religion: "Hindu",
    height: "5'10\"",
  },
  {
    id: 7,
    name: "Siddharth",
    age: 29,
    city: "Kolkata",
    profession: "Marketing Manager",
    education: "MICA",
    image: "/indian-man-marketing-professional-portrait.jpg",
    interests: ["Art", "Music", "Food"],
    compatibility: 78,
    verified: false,
    religion: "Hindu",
    height: "5'11\"",
  },
  {
    id: 8,
    name: "Ankit",
    age: 26,
    city: "Jaipur",
    profession: "Architect",
    education: "SPA Delhi",
    image: "/indian-man-architect-professional-portrait.jpg",
    interests: ["Design", "Travel", "Photography"],
    compatibility: 75,
    verified: true,
    religion: "Hindu",
    height: "5'9\"",
  },
]

const cities = ["All Cities", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur"]
const religions = ["All", "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"]
const educations = ["All", "IIT", "IIM", "NIT", "AIIMS", "BITS", "Other Premier", "Any"]
const professions = [
  "All",
  "Software Engineer",
  "Doctor",
  "Entrepreneur",
  "Finance",
  "Marketing",
  "Architect",
  "Data Scientist",
]

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [ageRange, setAgeRange] = useState([21, 35])
  const [selectedCity, setSelectedCity] = useState("All Cities")
  const [selectedReligion, setSelectedReligion] = useState("All")
  const [selectedEducation, setSelectedEducation] = useState("All")
  const [selectedProfession, setSelectedProfession] = useState("All")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilters = [
    ageRange[0] !== 21 || ageRange[1] !== 35 ? `Age: ${ageRange[0]}-${ageRange[1]}` : null,
    selectedCity !== "All Cities" ? selectedCity : null,
    selectedReligion !== "All" ? selectedReligion : null,
    selectedEducation !== "All" ? selectedEducation : null,
    selectedProfession !== "All" ? selectedProfession : null,
    verifiedOnly ? "Verified Only" : null,
  ].filter(Boolean)

  const clearFilter = (filter: string) => {
    if (filter.startsWith("Age:")) setAgeRange([21, 35])
    else if (cities.includes(filter)) setSelectedCity("All Cities")
    else if (religions.includes(filter)) setSelectedReligion("All")
    else if (educations.includes(filter)) setSelectedEducation("All")
    else if (professions.includes(filter)) setSelectedProfession("All")
    else if (filter === "Verified Only") setVerifiedOnly(false)
  }

  const clearAllFilters = () => {
    setAgeRange([21, 35])
    setSelectedCity("All Cities")
    setSelectedReligion("All")
    setSelectedEducation("All")
    setSelectedProfession("All")
    setVerifiedOnly(false)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Age Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Age Range</Label>
        <Slider value={ageRange} onValueChange={setAgeRange} min={18} max={50} step={1} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{ageRange[0]} years</span>
          <span>{ageRange[1]} years</span>
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">City</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Religion</Label>
        <Select value={selectedReligion} onValueChange={setSelectedReligion}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {religions.map((religion) => (
              <SelectItem key={religion} value={religion}>
                {religion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Education</Label>
        <Select value={selectedEducation} onValueChange={setSelectedEducation}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {educations.map((edu) => (
              <SelectItem key={edu} value={edu}>
                {edu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Profession */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Profession</Label>
        <Select value={selectedProfession} onValueChange={setSelectedProfession}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {professions.map((profession) => (
              <SelectItem key={profession} value={profession}>
                {profession}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
        />
        <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
          Show verified profiles only
        </Label>
      </div>

      {/* Clear Filters */}
      {activeFilters.length > 0 && (
        <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-72 border-r border-border p-6 bg-card">
        <div className="sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Explore Matches</h1>
              <p className="text-muted-foreground">{profiles.length} profiles match your preferences</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => clearFilter(filter as string)}
                >
                  {filter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Profiles Grid */}
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1",
          )}
        >
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={cn(
                "group overflow-hidden hover:shadow-xl transition-all duration-300",
                viewMode === "list" && "flex flex-row",
              )}
            >
              {/* Image */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  viewMode === "grid" ? "aspect-[3/4]" : "w-40 md:w-56 shrink-0",
                )}
              >
                <Image
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge className="bg-primary/90 hover:bg-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {profile.compatibility}%
                  </Badge>
                  {profile.verified && (
                    <Badge className="bg-green-500/90 hover:bg-green-500">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Like button */}
                <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="h-5 w-5 text-white" />
                </button>

                {/* Info overlay (grid view) */}
                {viewMode === "grid" && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">
                      {profile.name}, {profile.age}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.city}</span>
                      <span>•</span>
                      <span>{profile.height}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className={cn("p-4", viewMode === "list" && "flex-1")}>
                {viewMode === "list" && (
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold">
                      {profile.name}, {profile.age}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.city}</span>
                      <span>•</span>
                      <span>{profile.height}</span>
                      <span>•</span>
                      <span>{profile.religion}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.education}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <Button
                  className={cn("w-full rounded-full", viewMode === "list" && "md:w-auto")}
                  variant="outline"
                  asChild
                >
                  <Link href={`/profile/${profile.id}`}>
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Profile • ₹39
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg" className="rounded-full bg-transparent">
            Load More Profiles
          </Button>
        </div>
      </div>
    </div>
  )
}
