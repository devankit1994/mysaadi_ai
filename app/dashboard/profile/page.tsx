"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { validateProfileField, validateProfileForm } from "@/lib/validations";
import {
  validateImageFile,
  uploadPhotoToSupabase,
  setupFilePickerFocusListener,
} from "@/lib/upload-utils";

import {
  interests,
  genderOptions,
  religions,
  educationLevels,
  professions,
  states,
  incomeRanges,
  familyTypes,
  familyStatuses,
  dietOptions,
  drinkingOptions,
  smokingOptions,
  heightOptions,
  maritalStatuses,
} from "@/lib/profile-constants";
import { useProfileValidation } from "@/hooks/use-profile-validation";
import {
  ProfileInput,
  ProfileSelect,
} from "@/components/profile/profile-form-fields";

export default function EditProfilePage() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [photos, setPhotos] = useState<string[]>(Array(6).fill(""));

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    updateFormData,
    handleBlur,
  } = useProfileValidation(
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      city: "",
      state: "",
      religion: "",
      motherTongue: "",
      height: "",
      maritalStatus: "",
      education: "",
      profession: "",
      company: "",
      income: "",
      familyType: "",
      familyStatus: "",
      fatherOccupation: "",
      motherOccupation: "",
      siblings: "",
      diet: "",
      drinking: "",
      smoking: "",
      bio: "",
      lookingFor: "",
      showProfile: true,
      showLastActive: true,
      emailNotifications: true,
    },
    () => {
      if (loadError === "Please correct the highlighted fields.") {
        setLoadError("");
      }
    },
  );

  useEffect(() => {
    let mounted = true;

    const padPhotos = (arr: string[] | null | undefined) => {
      const out = (arr ?? []).slice(0, 6);
      while (out.length < 6) out.push("");
      return out;
    };

    const load = async () => {
      setIsLoadingProfile(true);
      setLoadError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be signed in to edit your profile");
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (!mounted) return;

        setFormData((prev) => ({
          ...prev,
          firstName: profile?.first_name ?? "",
          lastName: profile?.last_name ?? "",
          dateOfBirth: profile?.date_of_birth ?? "",
          gender: profile?.gender ?? "",
          city: profile?.city ?? "",
          state: profile?.state ?? "",
          religion: profile?.religion ?? "",
          height: profile?.height ?? "",
          maritalStatus: profile?.marital_status ?? "",
          education: profile?.education ?? "",
          profession: profile?.profession ?? "",
          income: profile?.income ?? "",
          familyType: profile?.family_type ?? "",
          diet: profile?.diet ?? "",
          drinking: profile?.drinking ?? "",
          smoking: profile?.smoking ?? "",
          bio: profile?.bio ?? "",
          lookingFor: profile?.looking_for ?? "",
        }));

        setPhotos(padPhotos(profile?.photos));
        setSelectedInterests(profile?.interests ?? []);
      } catch (e: any) {
        console.error("Error loading profile:", e);
        if (!mounted) return;
        setLoadError(e?.message || "Failed to load profile");
      } finally {
        if (!mounted) return;
        setIsLoadingProfile(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [selectingIndex, setSelectingIndex] = useState<number | null>(null);
  const targetIndexRef = useRef<number | null>(null);

  const handlePhotoUpload = (index: number) => {
    targetIndexRef.current = index;
    setSelectingIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";

      setupFilePickerFocusListener(() => {
        setSelectingIndex(null);
      });

      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectingIndex(null);
    const file = event.target.files?.[0];
    const index = targetIndexRef.current;
    if (!file || index === null) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setUploadingIndex(index);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const publicUrl = await uploadPhotoToSupabase(file, user.id);

      const newPhotos = [...photos];
      newPhotos[index as number] = publicUrl;
      setPhotos(newPhotos);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploadingIndex(null);
      targetIndexRef.current = null;
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = "";
    setPhotos(newPhotos);
  };

  const handleSave = async () => {
    const formErrors = validateProfileForm(formData);
    if (formErrors) {
      setErrors(formErrors);
      setLoadError("Please correct the highlighted fields.");

      const firstErrorField = Object.keys(formErrors)[0];
      const elementId =
        firstErrorField === "dateOfBirth" ? "dob" : firstErrorField;
      const element = document.getElementById(elementId);

      // We also might need to ensure the correct tab is selected, but for now we'll just focus.
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setLoadError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to save your profile");
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        religion: formData.religion || null,
        height: formData.height || null,
        marital_status: formData.maritalStatus || null,
        looking_for: formData.lookingFor,
        photos,
        education: formData.education,
        profession: formData.profession,
        income: formData.income,
        family_type: formData.familyType,
        diet: formData.diet,
        drinking: formData.drinking,
        smoking: formData.smoking,
        bio: formData.bio,
        interests: selectedInterests,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      console.error("Error saving profile:", e);
      setLoadError(e?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const ProfileFormSkeleton = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm text-destructive">
            <p className="font-medium">
              {loadError === "Please correct the highlighted fields."
                ? "Please correct the highlighted fields."
                : "Something went wrong"}
            </p>
            {loadError !== "Please correct the highlighted fields." && (
              <p className="mt-1">{loadError}</p>
            )}
          </div>
        </div>
      ) : null}

      {isLoadingProfile ? (
        <ProfileFormSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">
                Update your profile information and preferences
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full"
            >
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
                    <ProfileInput
                      id="firstName"
                      label="First Name"
                      requiredField
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      onBlur={() => handleBlur("firstName")}
                      error={errors.firstName}
                    />
                    <ProfileInput
                      id="lastName"
                      label="Last Name"
                      requiredField
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      onBlur={() => handleBlur("lastName")}
                      error={errors.lastName}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <ProfileInput
                      id="dob"
                      type="date"
                      label="Date of Birth"
                      requiredField
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateFormData("dateOfBirth", e.target.value)
                      }
                      onBlur={() => handleBlur("dateOfBirth")}
                      error={errors.dateOfBirth}
                    />
                    <ProfileSelect
                      id="gender"
                      label="Gender"
                      requiredField
                      value={formData.gender}
                      onValueChange={(v) => updateFormData("gender", v)}
                      options={genderOptions}
                      error={errors.gender}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <ProfileInput
                      id="city"
                      label="City"
                      requiredField
                      icon={<MapPin className="h-4 w-4" />}
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      error={errors.city}
                    />
                    <ProfileSelect
                      label="State"
                      value={formData.state}
                      onValueChange={(v) => updateFormData("state", v)}
                      options={states}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <ProfileSelect
                      label="Religion"
                      value={formData.religion}
                      onValueChange={(v) => updateFormData("religion", v)}
                      options={religions.filter(
                        (r) => r.value !== "other" && r.value !== "prefer-not",
                      )}
                    />
                    <ProfileSelect
                      label="Height"
                      value={formData.height}
                      onValueChange={(v) => updateFormData("height", v)}
                      options={heightOptions}
                    />
                    <ProfileSelect
                      label="Marital Status"
                      value={formData.maritalStatus}
                      onValueChange={(v) => updateFormData("maritalStatus", v)}
                      options={maritalStatuses}
                    />
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
                  <CardDescription>
                    Add up to 6 photos. First photo will be your main profile
                    picture.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 border-dashed",
                          photo
                            ? "border-transparent"
                            : "border-muted-foreground/30",
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
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 bg-primary">
                                Primary
                              </Badge>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handlePhotoUpload(index)}
                            disabled={
                              uploadingIndex === index ||
                              selectingIndex === index
                            }
                            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingIndex === index ||
                            selectingIndex === index ? (
                              <>
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="text-sm">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8" />
                                <span className="text-sm">Add Photo</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

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
                  <CardDescription>
                    Your professional background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ProfileSelect
                      label="Highest Education"
                      value={formData.education}
                      onValueChange={(v) => updateFormData("education", v)}
                      options={educationLevels}
                    />
                    <ProfileSelect
                      label="Profession"
                      value={formData.profession}
                      onValueChange={(v) => updateFormData("profession", v)}
                      options={professions}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <ProfileInput
                      id="company"
                      label="Company/Organization"
                      value={formData.company}
                      onChange={(e) =>
                        updateFormData("company", e.target.value)
                      }
                      placeholder="Where do you work?"
                    />
                    <ProfileSelect
                      label="Annual Income"
                      value={formData.income}
                      onValueChange={(v) => updateFormData("income", v)}
                      options={incomeRanges}
                    />
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
                    <ProfileSelect
                      label="Family Type"
                      value={formData.familyType}
                      onValueChange={(v) => updateFormData("familyType", v)}
                      options={familyTypes}
                    />
                    <ProfileSelect
                      label="Family Status"
                      value={formData.familyStatus}
                      onValueChange={(v) => updateFormData("familyStatus", v)}
                      options={familyStatuses}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <ProfileInput
                      id="fatherOccupation"
                      label="Father's Occupation"
                      value={formData.fatherOccupation}
                      onChange={(e) =>
                        updateFormData("fatherOccupation", e.target.value)
                      }
                    />
                    <ProfileInput
                      id="motherOccupation"
                      label="Mother's Occupation"
                      value={formData.motherOccupation}
                      onChange={(e) =>
                        updateFormData("motherOccupation", e.target.value)
                      }
                    />
                  </div>

                  <ProfileInput
                    id="siblings"
                    label="Siblings"
                    value={formData.siblings}
                    onChange={(e) => updateFormData("siblings", e.target.value)}
                    placeholder="e.g., 1 Brother (Married), 1 Sister (Unmarried)"
                  />

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-4">
                    <ProfileSelect
                      label="Diet"
                      value={formData.diet}
                      onValueChange={(v) => updateFormData("diet", v)}
                      options={dietOptions}
                    />
                    <ProfileSelect
                      label="Drinking"
                      value={formData.drinking}
                      onValueChange={(v) => updateFormData("drinking", v)}
                      options={drinkingOptions}
                    />
                    <ProfileSelect
                      label="Smoking"
                      value={formData.smoking}
                      onValueChange={(v) => updateFormData("smoking", v)}
                      options={smokingOptions}
                    />
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
                    <CardDescription>
                      Write a compelling bio and describe your ideal partner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => updateFormData("bio", e.target.value)}
                        rows={5}
                        className="resize-none"
                        placeholder="Write about yourself, your values, and what makes you unique..."
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lookingFor">Partner Preferences</Label>
                      <Textarea
                        id="lookingFor"
                        value={formData.lookingFor}
                        onChange={(e) =>
                          updateFormData("lookingFor", e.target.value)
                        }
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
                    <CardDescription>
                      Select at least 3 interests that describe you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            selectedInterests.includes(interest)
                              ? "default"
                              : "outline"
                          }
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
                    <p className="text-sm text-muted-foreground mt-4">
                      {selectedInterests.length} interests selected
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control who can see your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show my profile</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to discover your profile
                        </p>
                      </div>
                      <Switch
                        checked={formData.showProfile}
                        onCheckedChange={(checked) =>
                          updateFormData("showProfile", checked)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show last active time</p>
                        <p className="text-sm text-muted-foreground">
                          Let others see when you were last online
                        </p>
                      </div>
                      <Switch
                        checked={formData.showLastActive}
                        onCheckedChange={(checked) =>
                          updateFormData("showLastActive", checked)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about matches and messages
                        </p>
                      </div>
                      <Switch
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateFormData("emailNotifications", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
