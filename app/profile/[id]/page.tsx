"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  Verified,
  Calendar,
  Ruler,
  Users,
  Home,
  Utensils,
  Wine,
  Cigarette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock profile data
const profile = {
  id: 1,
  name: "Rahul Sharma",
  age: 28,
  city: "Delhi",
  state: "Delhi NCR",
  profession: "Product Manager",
  company: "Google",
  education: "MBA - IIM Ahmedabad",
  college: "B.Tech - IIT Delhi",
  images: [
    "/handsome-indian-man-professional-portrait-smiling.jpg",
    "/indian-man-casual-outdoor-portrait.jpg",
    "/indian-man-formal-event-portrait.jpg",
    "/indian-man-travel-adventure-portrait.jpg",
  ],
  interests: ["Fitness", "Movies", "Cricket", "Travel", "Music", "Photography"],
  compatibility: 95,
  verified: true,
  religion: "Hindu",
  height: "5'10\"",
  weight: "75 kg",
  maritalStatus: "Never Married",
  motherTongue: "Hindi",
  familyType: "Nuclear Family",
  familyStatus: "Upper Middle Class",
  fatherOccupation: "Businessman",
  motherOccupation: "Homemaker",
  siblings: "1 Brother (Married)",
  diet: "Non-Vegetarian",
  drinking: "Occasionally",
  smoking: "Never",
  bio: "Hey there! I'm a passionate product manager who believes in building products that make a difference. When I'm not crunching numbers or leading sprints, you'll find me at the gym, exploring new hiking trails, or catching up on the latest cricket match. I value genuine connections and am looking for someone who shares my love for adventure and meaningful conversations. Let's build something beautiful together!",
  lookingFor:
    "I'm looking for a partner who is ambitious, kind-hearted, and has a great sense of humor. Someone who values family, enjoys traveling, and is open to new experiences. Education and career are important, but so is emotional intelligence and the ability to communicate openly.",
  income: "₹25-50 LPA",
  contactLocked: true,
  phone: "+91 98XXX XXXXX",
  whatsapp: "+91 98XXX XXXXX",
}

export default function ProfilePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profile.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/explore">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-current text-primary")} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Photos & Quick Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Photo Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image
                  src={profile.images[currentImageIndex] || "/placeholder.svg"}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />

                {/* Navigation arrows */}
                {profile.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {profile.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentImageIndex ? "w-6 bg-white" : "bg-white/50",
                      )}
                    />
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-primary/90">{profile.compatibility}% Match</Badge>
                  {profile.verified && (
                    <Badge className="bg-green-500/90">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {profile.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden",
                    index === currentImageIndex && "ring-2 ring-primary",
                  )}
                >
                  <Image src={image || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Compatibility Meter */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Compatibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{profile.compatibility}%</span>
                    <Badge variant="secondary">Excellent Match</Badge>
                  </div>
                  <Progress value={profile.compatibility} className="h-3" />
                  <p className="text-xs text-muted-foreground">Based on your preferences and interests</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={cn("flex-1 bg-transparent", isLiked && "bg-primary/10 border-primary text-primary")}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("h-5 w-5 mr-2", isLiked && "fill-current")} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button className="flex-1" onClick={() => setIsUnlockModalOpen(true)}>
                {isUnlocked ? (
                  <>
                    <Unlock className="h-5 w-5 mr-2" />
                    Contact
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Unlock ₹39
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile.name}, {profile.age}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {profile.city}, {profile.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div className="text-center">
                    <Ruler className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">{profile.height}</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Religion</p>
                    <p className="font-medium">{profile.religion}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{profile.maritalStatus}</p>
                  </div>
                  <div className="text-center">
                    <Home className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Family</p>
                    <p className="font-medium">{profile.familyType}</p>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>

            {/* Career & Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Career & Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{profile.profession}</p>
                      <p className="text-sm text-muted-foreground">{profile.company}</p>
                      <p className="text-sm text-muted-foreground">Income: {profile.income}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{profile.education}</p>
                      <p className="text-sm text-muted-foreground">{profile.college}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Family Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Family Type</span>
                      <span className="font-medium">{profile.familyType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Family Status</span>
                      <span className="font-medium">{profile.familyStatus}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Father&apos;s Occupation</span>
                      <span className="font-medium">{profile.fatherOccupation}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Mother&apos;s Occupation</span>
                      <span className="font-medium">{profile.motherOccupation}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Siblings</span>
                      <span className="font-medium">{profile.siblings}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Utensils className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Diet</p>
                      <p className="font-medium text-sm">{profile.diet}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Wine className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Drinking</p>
                      <p className="font-medium text-sm">{profile.drinking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Cigarette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Smoking</p>
                      <p className="font-medium text-sm">{profile.smoking}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Interests & Hobbies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="px-4 py-2 text-sm">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partner Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Partner Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{profile.lookingFor}</p>
              </CardContent>
            </Card>

            {/* Contact Section (Locked) */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isUnlocked ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                      <Phone className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Phone Number</p>
                        <p className="font-semibold text-green-700">{profile.phone}</p>
                      </div>
                      <Button size="sm" className="ml-auto bg-green-600 hover:bg-green-700">
                        Call Now
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">WhatsApp</p>
                        <p className="font-semibold text-green-700">{profile.whatsapp}</p>
                      </div>
                      <Button size="sm" className="ml-auto bg-green-600 hover:bg-green-700">
                        Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Blurred content */}
                    <div className="blur-md select-none pointer-events-none">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                          <Phone className="h-6 w-6" />
                          <div>
                            <p className="text-sm">Phone Number</p>
                            <p className="font-semibold">+91 98765 43210</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                          <MessageCircle className="h-6 w-6" />
                          <div>
                            <p className="text-sm">WhatsApp</p>
                            <p className="font-semibold">+91 98765 43210</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unlock overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                      <Lock className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Contact Locked</h3>
                      <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
                        Unlock {profile.name.split(" ")[0]}&apos;s contact details for just ₹39
                      </p>
                      <Button onClick={() => setIsUnlockModalOpen(true)} className="rounded-full">
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock Now • ₹39
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Unlock Modal */}
      <Dialog open={isUnlockModalOpen} onOpenChange={setIsUnlockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-primary" />
              Unlock {profile.name.split(" ")[0]}&apos;s Profile
            </DialogTitle>
            <DialogDescription>Get direct access to their contact details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Price */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">₹39</div>
              <p className="text-sm text-muted-foreground">One-time payment</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "View phone number",
                "WhatsApp contact access",
                "See all photos",
                "Lifetime access to this profile",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-muted-foreground">Secure payment via UPI</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-12 rounded-full"
                onClick={() => {
                  setIsUnlocked(true)
                  setIsUnlockModalOpen(false)
                }}
              >
                Pay ₹39 & Unlock
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsUnlockModalOpen(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
