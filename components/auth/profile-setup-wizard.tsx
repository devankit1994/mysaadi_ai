"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Heart,
  Camera,
  Sparkles,
  GraduationCap,
  Briefcase,
  Home,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Preferences", icon: Heart },
  { id: 3, title: "Photos", icon: Camera },
  { id: 4, title: "Lifestyle", icon: Sparkles },
  { id: 5, title: "About Me", icon: User },
]

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

const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other", "Prefer not to say"]
const educationLevels = ["High School", "Bachelor's", "Master's", "PhD", "Other"]
const professions = [
  "Software Engineer",
  "Doctor",
  "Lawyer",
  "Business Owner",
  "Teacher",
  "Designer",
  "Marketing",
  "Finance",
  "Student",
  "Other",
]

export function ProfileSetupWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
    // Preferences
    lookingFor: "",
    ageRangeMin: "21",
    ageRangeMax: "30",
    preferredReligion: "",
    preferredCity: "",
    // Photos
    photos: [] as string[],
    // Lifestyle
    education: "",
    profession: "",
    income: "",
    familyType: "",
    diet: "",
    drinking: "",
    smoking: "",
    // About
    bio: "",
    interests: [] as string[],
  })

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `/placeholder.svg?height=200&width=200&query=person portrait ${formData.photos.length + 1}`
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    localStorage.setItem("mysaadi_profile_complete", "true")
    setIsLoading(false)
    router.push("/dashboard")
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
              className={cn(
                "flex flex-col items-center gap-2 transition-colors",
                step.id <= currentStep ? "text-primary" : "text-muted-foreground",
                step.id < currentStep && "cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted",
                )}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What are you looking for?"}
                {currentStep === 3 && "Add your best photos"}
                {currentStep === 4 && "Share your lifestyle details"}
                {currentStep === 5 && "Write about yourself"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                          placeholder="Enter your city"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="westbengal">West Bengal</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Looking For</Label>
                    <RadioGroup
                      value={formData.lookingFor}
                      onValueChange={(value) => updateFormData("lookingFor", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bride" id="bride" />
                        <Label htmlFor="bride" className="font-normal">
                          Bride
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="groom" id="groom" />
                        <Label htmlFor="groom" className="font-normal">
                          Groom
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Age Range</Label>
                    <div className="flex items-center gap-4">
                      <Select
                        value={formData.ageRangeMin}
                        onValueChange={(value) => updateFormData("ageRangeMin", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => i + 18).map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={formData.ageRangeMax}
                        onValueChange={(value) => updateFormData("ageRangeMax", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => i + 21).map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Religion</Label>
                    <Select
                      value={formData.preferredReligion}
                      onValueChange={(value) => updateFormData("preferredReligion", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {religions.map((religion) => (
                          <SelectItem key={religion} value={religion.toLowerCase()}>
                            {religion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredCity">Preferred City</Label>
                    <Input
                      id="preferredCity"
                      value={formData.preferredCity}
                      onChange={(e) => updateFormData("preferredCity", e.target.value)}
                      placeholder="Enter preferred city (or leave blank for any)"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Photos */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && <Badge className="absolute bottom-2 left-2 bg-primary">Primary</Badge>}
                      </div>
                    ))}

                    {formData.photos.length < 6 && (
                      <button
                        onClick={handlePhotoUpload}
                        className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Add Photo</span>
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Add up to 6 photos. Your first photo will be your primary profile picture.
                  </p>
                </div>
              )}

              {/* Step 4: Lifestyle */}
              {currentStep === 4 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        <GraduationCap className="h-4 w-4 inline mr-2" />
                        Education
                      </Label>
                      <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map((level) => (
                            <SelectItem key={level} value={level.toLowerCase()}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        <Briefcase className="h-4 w-4 inline mr-2" />
                        Profession
                      </Label>
                      <Select
                        value={formData.profession}
                        onValueChange={(value) => updateFormData("profession", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map((profession) => (
                            <SelectItem key={profession} value={profession.toLowerCase()}>
                              {profession}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Annual Income</Label>
                      <Select value={formData.income} onValueChange={(value) => updateFormData("income", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
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

                    <div className="space-y-2">
                      <Label>
                        <Home className="h-4 w-4 inline mr-2" />
                        Family Type
                      </Label>
                      <Select
                        value={formData.familyType}
                        onValueChange={(value) => updateFormData("familyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select family type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nuclear">Nuclear Family</SelectItem>
                          <SelectItem value="joint">Joint Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Diet</Label>
                      <Select value={formData.diet} onValueChange={(value) => updateFormData("diet", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                      <Select value={formData.drinking} onValueChange={(value) => updateFormData("drinking", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                      <Select value={formData.smoking} onValueChange={(value) => updateFormData("smoking", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="regularly">Regularly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 5: About Me */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">About You</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Write a brief description about yourself, your values, and what you're looking for in a partner..."
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Interests & Hobbies</Label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            formData.interests.includes(interest)
                              ? "bg-primary hover:bg-primary/90"
                              : "hover:bg-primary/10",
                          )}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select at least 3 interests ({formData.interests.length} selected)
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={formData.photos[0] || ""} />
                      <AvatarFallback>
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {formData.firstName || "Your"} {formData.lastName || "Name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.city || "City"}, {formData.state || "State"}
                      </p>
                    </div>
                  </div>

                  {formData.profession && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{formData.profession}</span>
                    </div>
                  )}

                  {formData.education && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{formData.education}</span>
                    </div>
                  )}

                  {formData.bio && <p className="text-sm text-muted-foreground line-clamp-3">{formData.bio}</p>}

                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.interests.slice(0, 4).map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {formData.interests.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{formData.interests.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
