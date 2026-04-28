"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { validateProfileField, validateProfileForm } from "@/lib/validations";

import {
  interests,
  religions,
  educationLevels,
  professions,
  states,
  incomeRanges,
  familyTypes,
  dietOptions,
  drinkingOptions,
  smokingOptions,
} from "@/lib/profile-constants";
import { useProfileValidation } from "@/hooks/use-profile-validation";
import { ProfileInput, ProfileSelect } from "@/components/profile/profile-form-fields";

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Preferences", icon: Heart },
  { id: 3, title: "Photos", icon: Camera },
  { id: 4, title: "Lifestyle", icon: Sparkles },
  { id: 5, title: "About Me", icon: User },
];

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  state: string;
  lookingFor: string;
  ageRangeMin: string;
  ageRangeMax: string;
  preferredReligion: string;
  preferredCity: string;
  photos: string[];
  education: string;
  profession: string;
  income: string;
  familyType: string;
  diet: string;
  drinking: string;
  smoking: string;
  bio: string;
  interests: string[];
};

type ProfileSetupWizardProps = {
  /**
   * Optional override to reuse the wizard UI for non-onboarding flows.
   * If set, the wizard will call this instead of writing to Supabase + redirecting.
   */
  onSubmitProfile?: (data: ProfileFormData) => Promise<void>;
  /**
   * Like `onSubmitProfile`, but also provides selected photo Files (in order).
   * Useful for admin flows where photos must be uploaded server-side.
   */
  onSubmitProfileWithFiles?: (
    data: ProfileFormData,
    photos: File[],
  ) => Promise<void>;
  /** Defaults to true. For admin-created profiles, you likely want false. */
  allowPhotoUpload?: boolean;
  /**
   * If true, the Photos step will allow selecting images but won't upload them
   * to Supabase Storage. Selected files will be provided via
   * `onSubmitProfileWithFiles`.
   */
  deferPhotoUpload?: boolean;
  /** Defaults to true. Useful when embedding inside a dialog. */
  showPreview?: boolean;
  title?: string;
  /** Label for the final submit button. Defaults to "Complete Profile". */
  submitLabel?: string;
  initialData?: Partial<ProfileFormData>;
};

const defaultFormData: ProfileFormData = {
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
  photos: [],
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
  interests: [],
};

export function ProfileSetupWizard(props: ProfileSetupWizardProps = {}) {
  const {
    onSubmitProfile,
    onSubmitProfileWithFiles,
    allowPhotoUpload = true,
    deferPhotoUpload = false,
    showPreview = true,
    title = "Complete Your Profile",
    submitLabel = "Complete Profile",
    initialData,
  } = props;

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pendingPhotos, setPendingPhotos] = useState<Record<string, File>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    updateFormData,
    handleBlur,
  } = useProfileValidation<ProfileFormData>(
    {
      ...defaultFormData,
      ...(initialData || {}),
    },
    () => {
      if (submitError === "Please correct the highlighted fields.") {
        setSubmitError("");
      }
    }
  );

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPendingPhotos((prev) => ({ ...prev, [objectUrl]: file }));
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, objectUrl],
    }));

    // Reset input value to allow uploading same file again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    const photoUrl = formData.photos[index];
    if (pendingPhotos[photoUrl]) {
      URL.revokeObjectURL(photoUrl);
      const newPending = { ...pendingPhotos };
      delete newPending[photoUrl];
      setPendingPhotos(newPending);
    }

    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const nextStep = async () => {
    setSubmitError("");
    if (currentStep === 1) {
      const formErrors = validateProfileForm(formData);
      if (formErrors) {
        setErrors(formErrors);
        setSubmitError("Please correct the highlighted fields.");
        
        const firstErrorField = Object.keys(formErrors)[0];
        const elementId = firstErrorField === "dateOfBirth" ? "dob" : firstErrorField;
        const element = document.getElementById(elementId);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    if (currentStep === 3 && allowPhotoUpload && !deferPhotoUpload) {
      // Check if there are any pending photos to upload
      const pendingUrls = Object.keys(pendingPhotos);
      if (pendingUrls.length > 0) {
        setIsUploading(true);
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          const newPhotos = [...formData.photos];

          // Process uploads
          for (const url of pendingUrls) {
            // Check if this specific URL is still in formData.photos (user might have removed it but we haven't cleaned up perfectly)
            if (!newPhotos.includes(url)) continue;

            const file = pendingPhotos[url];
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("photos")
              .upload(fileName, file);

            if (uploadError) throw uploadError;

            const {
              data: { publicUrl },
            } = supabase.storage.from("photos").getPublicUrl(fileName);

            // Replace the blob URL with the actual Supabase URL
            const index = newPhotos.indexOf(url);
            if (index !== -1) {
              newPhotos[index] = publicUrl;
              // Clean up object URL
              URL.revokeObjectURL(url);
            }
          }

          // Update form data with real URLs
          setFormData((prev) => ({ ...prev, photos: newPhotos }));
          // Clear pending photos
          setPendingPhotos({});
        } catch (error) {
          console.error("Error uploading photos:", error);
          alert("Error uploading photos. Please try again.");
          setIsUploading(false);
          return; // Stop navigation if upload fails
        } finally {
          setIsUploading(false);
        }
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateProfileForm(formData);
    if (formErrors) {
      setErrors(formErrors);
      setSubmitError("Please correct the highlighted fields.");
      setCurrentStep(1); // Go back to step 1 where the required fields are
      
      setTimeout(() => {
        const firstErrorField = Object.keys(formErrors)[0];
        const elementId = firstErrorField === "dateOfBirth" ? "dob" : firstErrorField;
        const element = document.getElementById(elementId);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setIsLoading(true);
    setSubmitError("");
    try {
      if (onSubmitProfileWithFiles) {
        const orderedPhotoFiles = formData.photos
          .map((url) => pendingPhotos[url])
          .filter(Boolean) as File[];

        await onSubmitProfileWithFiles(formData, orderedPhotoFiles);
        return;
      }

      if (onSubmitProfile) {
        await onSubmitProfile(formData);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        looking_for: formData.lookingFor,
        age_range_min: Number.parseInt(formData.ageRangeMin),
        age_range_max: Number.parseInt(formData.ageRangeMax),
        preferred_religion: formData.preferredReligion,
        preferred_city: formData.preferredCity,
        photos: formData.photos,
        education: formData.education,
        profession: formData.profession,
        income: formData.income,
        family_type: formData.familyType,
        diet: formData.diet,
        drinking: formData.drinking,
        smoking: formData.smoking,
        bio: formData.bio,
        interests: formData.interests,
        is_complete: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      localStorage.setItem("mysaadi_profile_complete", "true");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setSubmitError(error?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
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
                step.id <= currentStep
                  ? "text-primary"
                  : "text-muted-foreground",
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
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className={cn("grid gap-8", showPreview && "lg:grid-cols-3")}>
        {/* Form */}
        <div className={cn(showPreview && "lg:col-span-2")}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What are you looking for?"}
                {currentStep === 3 &&
                  (allowPhotoUpload
                    ? "Add your best photos"
                    : "Photos (disabled in this flow)")}
                {currentStep === 4 && "Share your lifestyle details"}
                {currentStep === 5 && "Write about yourself"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ProfileInput
                      id="firstName"
                      label="First Name"
                      requiredField
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      error={errors.firstName}
                      placeholder="Enter your first name"
                    />
                    <ProfileInput
                      id="lastName"
                      label="Last Name"
                      requiredField
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      error={errors.lastName}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <ProfileInput
                    id="dob"
                    type="date"
                    label="Date of Birth"
                    requiredField
                    icon={<Calendar className="h-4 w-4" />}
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    onBlur={() => handleBlur("dateOfBirth")}
                    error={errors.dateOfBirth}
                  />

                  <div className="space-y-2">
                    <Label>
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      id="gender"
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                      onBlur={() => handleBlur("gender")}
                      className={cn("flex gap-4 p-1", errors.gender ? "rounded-md border border-destructive" : "")}
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
                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <ProfileInput
                      id="city"
                      label="City"
                      requiredField
                      icon={<MapPin className="h-4 w-4" />}
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      error={errors.city}
                      placeholder="Enter your city"
                    />
                    <ProfileSelect
                      label="State"
                      value={formData.state}
                      onValueChange={(v) => updateFormData("state", v)}
                      options={states}
                      placeholder="Select state"
                    />
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
                      onValueChange={(value) =>
                        updateFormData("lookingFor", value)
                      }
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
                        onValueChange={(value) =>
                          updateFormData("ageRangeMin", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => i + 18).map(
                            (age) => (
                              <SelectItem key={age} value={age.toString()}>
                                {age}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={formData.ageRangeMax}
                        onValueChange={(value) =>
                          updateFormData("ageRangeMax", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => i + 21).map(
                            (age) => (
                              <SelectItem key={age} value={age.toString()}>
                                {age}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <ProfileSelect
                    label="Preferred Religion"
                    value={formData.preferredReligion}
                    onValueChange={(v) => updateFormData("preferredReligion", v)}
                    options={religions}
                    placeholder="Select religion"
                  />

                  <ProfileInput
                    id="preferredCity"
                    label="Preferred City"
                    value={formData.preferredCity}
                    onChange={(e) => updateFormData("preferredCity", e.target.value)}
                    placeholder="Enter preferred city (or leave blank for any)"
                  />
                </>
              )}

              {/* Step 3: Photos */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {!allowPhotoUpload && (
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Photo upload is disabled in this flow.
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
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
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-primary">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}

                    {allowPhotoUpload && formData.photos.length < 6 && (
                      <button
                        onClick={handlePhotoUpload}
                        disabled={isUploading}
                        className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                          <Upload className="h-8 w-8" />
                        )}
                        <span className="text-sm">
                          {isUploading ? "Uploading..." : "Add Photo"}
                        </span>
                      </button>
                    )}
                    {allowPhotoUpload && (
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Add up to 6 photos. Your first photo will be your primary
                    profile picture.
                  </p>
                </div>
              )}

              {/* Step 4: Lifestyle */}
              {currentStep === 4 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ProfileSelect
                      label={<><GraduationCap className="h-4 w-4 inline mr-2" />Education</>}
                      value={formData.education}
                      onValueChange={(v) => updateFormData("education", v)}
                      options={educationLevels}
                      placeholder="Select education"
                    />

                    <ProfileSelect
                      label={<><Briefcase className="h-4 w-4 inline mr-2" />Profession</>}
                      value={formData.profession}
                      onValueChange={(v) => updateFormData("profession", v)}
                      options={professions}
                      placeholder="Select profession"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <ProfileSelect
                      label="Annual Income"
                      value={formData.income}
                      onValueChange={(v) => updateFormData("income", v)}
                      options={incomeRanges}
                      placeholder="Select income range"
                    />

                    <ProfileSelect
                      label={<><Home className="h-4 w-4 inline mr-2" />Family Type</>}
                      value={formData.familyType}
                      onValueChange={(v) => updateFormData("familyType", v)}
                      options={familyTypes}
                      placeholder="Select family type"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <ProfileSelect
                      label="Diet"
                      value={formData.diet}
                      onValueChange={(v) => updateFormData("diet", v)}
                      options={dietOptions}
                      placeholder="Select"
                    />

                    <ProfileSelect
                      label="Drinking"
                      value={formData.drinking}
                      onValueChange={(v) => updateFormData("drinking", v)}
                      options={drinkingOptions}
                      placeholder="Select"
                    />

                    <ProfileSelect
                      label="Smoking"
                      value={formData.smoking}
                      onValueChange={(v) => updateFormData("smoking", v)}
                      options={smokingOptions}
                      placeholder="Select"
                    />
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
                    <p className="text-xs text-muted-foreground">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Interests & Hobbies</Label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            formData.interests.includes(interest)
                              ? "default"
                              : "outline"
                          }
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
                      Select at least 3 interests ({formData.interests.length}{" "}
                      selected)
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={nextStep} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
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
                        {submitLabel}
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
        {showPreview && (
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
                          {formData.firstName || "Your"}{" "}
                          {formData.lastName || "Name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.city || "City"},{" "}
                          {states.find(
                            (s) => s.value === formData.state,
                          )?.label ||
                            formData.state ||
                            "State"}
                        </p>
                      </div>
                    </div>

                    {formData.profession && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">
                          {formData.profession}
                        </span>
                      </div>
                    )}

                    {formData.education && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{formData.education}</span>
                      </div>
                    )}

                    {formData.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.bio}
                      </p>
                    )}

                    {formData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.interests.slice(0, 4).map((interest) => (
                          <Badge
                            key={interest}
                            variant="secondary"
                            className="text-xs"
                          >
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
        )}
      </div>
    </div>
  );
}
