"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Camera,
  Upload,
  X,
  Save,
  Check,
  Loader2,
  MapPin,
  Briefcase,
  Heart,
  Home,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const interests = [
  "Travel",
  "Music",
  "Reading",
  "Fitness",
  "Movies",
  "Cooking",
  "Photography",
  "Art",
  "Gaming",
  "Sports",
  "Dancing",
  "Yoga",
  "Tech",
  "Fashion",
  "Food",
  "Nature",
]

export default function EditProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [photos, setPhotos] = useState([
    "/beautiful-indian-woman-professional-portrait-smili.jpg",
    "/indian-woman-creative-professional-portrait.jpg",
    "",
    "",
    "",
    "",
  ])

  const [selectedInterests, setSelectedInterests] = useState(["Travel", "Music", "Reading", "Fitness"])

  const [formData, setFormData] = useState({
    firstName: "Priya",
    lastName: "Sharma",
    dateOfBirth: "1999-05-15",
    gender: "female",
    city: "Mumbai",
    state: "Maharashtra",
    religion: "hindu",
    motherTongue: "hindi",
    height: "5'4\"",
    maritalStatus: "never-married",
    education: "master",
    profession: "software-engineer",
    company: "Google",
    income: "20-50",
    familyType: "nuclear",
    familyStatus: "upper-middle",
    fatherOccupation: "Businessman",
    motherOccupation: "Teacher",
    siblings: "1 Sister (Unmarried)",
    diet: "vegetarian",
    drinking: "never",
    smoking: "never",
    bio: "Hey there! I'm a passionate software engineer who loves building products that make a difference. When I'm not coding, you'll find me exploring new places, reading books, or catching up on the latest music. I value genuine connections and am looking for someone who shares my love for adventure and meaningful conversations.",
    lookingFor:
      "Looking for a partner who is ambitious, kind-hearted, and has a great sense of humor. Someone who values family, enjoys traveling, and is open to new experiences.",
    showProfile: true,
    showLastActive: true,
    emailNotifications: true,
  })

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handlePhotoUpload = (index: number) => {
    const newPhotos = [...photos]
    newPhotos[index] = `/placeholder.svg?height=300&width=300&query=person portrait ${index + 1}`
    setPhotos(newPhotos)
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos[index] = ""
    setPhotos(newPhotos)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <User className="h-4 w-4 mr-2" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Camera className="h-4 w-4 mr-2" />
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="career"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Career
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Home className="h-4 w-4 mr-2" />
            Family
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Heart className="h-4 w-4 mr-2" />
            About & Interests
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Telangana">Telangana</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Religion</Label>
                  <Select value={formData.religion} onValueChange={(v) => setFormData({ ...formData, religion: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                      <SelectItem value="buddhist">Buddhist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Select value={formData.height} onValueChange={(v) => setFormData({ ...formData, height: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\""].map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(v) => setFormData({ ...formData, maritalStatus: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never-married">Never Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Profile Photos
              </CardTitle>
              <CardDescription>Add up to 6 photos. First photo will be your main profile picture.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 border-dashed",
                      photo ? "border-transparent" : "border-muted-foreground/30",
                      index === 0 && "md:col-span-1 md:row-span-2 aspect-auto md:aspect-[3/4]",
                    )}
                  >
                    {photo ? (
                      <>
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && <Badge className="absolute bottom-2 left-2 bg-primary">Primary</Badge>}
                      </>
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload(index)}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Add Photo</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Photo Guidelines</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-amber-700">
                    <li>Clear, recent photos of yourself</li>
                    <li>Face should be clearly visible</li>
                    <li>No group photos as primary image</li>
                    <li>Avoid excessive filters</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Tab */}
        <TabsContent value="career">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Career & Education
              </CardTitle>
              <CardDescription>Your professional background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Highest Education</Label>
                  <Select value={formData.education} onValueChange={(v) => setFormData({ ...formData, education: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelor">Bachelor&apos;s</SelectItem>
                      <SelectItem value="master">Master&apos;s</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Profession</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={(v) => setFormData({ ...formData, profession: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Where do you work?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Income</Label>
                  <Select value={formData.income} onValueChange={(v) => setFormData({ ...formData, income: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below5">Below ₹5 LPA</SelectItem>
                      <SelectItem value="5-10">₹5-10 LPA</SelectItem>
                      <SelectItem value="10-20">₹10-20 LPA</SelectItem>
                      <SelectItem value="20-50">₹20-50 LPA</SelectItem>
                      <SelectItem value="above50">Above ₹50 LPA</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Family Details
              </CardTitle>
              <CardDescription>Tell us about your family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Family Type</Label>
                  <Select
                    value={formData.familyType}
                    onValueChange={(v) => setFormData({ ...formData, familyType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuclear">Nuclear Family</SelectItem>
                      <SelectItem value="joint">Joint Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Family Status</Label>
                  <Select
                    value={formData.familyStatus}
                    onValueChange={(v) => setFormData({ ...formData, familyStatus: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="middle">Middle Class</SelectItem>
                      <SelectItem value="upper-middle">Upper Middle Class</SelectItem>
                      <SelectItem value="affluent">Affluent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherOccupation">Father&apos;s Occupation</Label>
                  <Input
                    id="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherOccupation">Mother&apos;s Occupation</Label>
                  <Input
                    id="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siblings">Siblings</Label>
                <Input
                  id="siblings"
                  value={formData.siblings}
                  onChange={(e) => setFormData({ ...formData, siblings: e.target.value })}
                  placeholder="e.g., 1 Brother (Married), 1 Sister (Unmarried)"
                />
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Diet</Label>
                  <Select value={formData.diet} onValueChange={(v) => setFormData({ ...formData, diet: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="eggetarian">Eggetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Drinking</Label>
                  <Select value={formData.drinking} onValueChange={(v) => setFormData({ ...formData, drinking: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="socially">Socially</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Smoking</Label>
                  <Select value={formData.smoking} onValueChange={(v) => setFormData({ ...formData, smoking: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About & Interests Tab */}
        <TabsContent value="about">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  About You
                </CardTitle>
                <CardDescription>Write a compelling bio and describe your ideal partner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                    className="resize-none"
                    placeholder="Write about yourself, your values, and what makes you unique..."
                  />
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lookingFor">Partner Preferences</Label>
                  <Textarea
                    id="lookingFor"
                    value={formData.lookingFor}
                    onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                    rows={4}
                    className="resize-none"
                    placeholder="Describe what you're looking for in a life partner..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests & Hobbies</CardTitle>
                <CardDescription>Select at least 3 interests that describe you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all px-4 py-2",
                        selectedInterests.includes(interest)
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-primary/10 hover:text-primary",
                      )}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">{selectedInterests.length} interests selected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show my profile</p>
                    <p className="text-sm text-muted-foreground">Allow others to discover your profile</p>
                  </div>
                  <Switch
                    checked={formData.showProfile}
                    onCheckedChange={(checked) => setFormData({ ...formData, showProfile: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show last active time</p>
                    <p className="text-sm text-muted-foreground">Let others see when you were last online</p>
                  </div>
                  <Switch
                    checked={formData.showLastActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, showLastActive: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about matches and messages</p>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
