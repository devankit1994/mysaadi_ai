"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Lock,
  Verified,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const profiles = [
  {
    id: 1,
    name: "Priya",
    age: 26,
    city: "Mumbai",
    profession: "Software Engineer",
    education: "IIT Bombay",
    image: "/beautiful-indian-woman-professional-portrait-smili.jpg",
    interests: ["Travel", "Music", "Reading"],
    verified: true,
  },
  {
    id: 2,
    name: "Rahul",
    age: 28,
    city: "Delhi",
    profession: "Product Manager",
    education: "IIM Ahmedabad",
    image: "/handsome-indian-man-professional-portrait-smiling.jpg",
    interests: ["Fitness", "Movies", "Cricket"],
    verified: true,
  },
  {
    id: 3,
    name: "Ananya",
    age: 25,
    city: "Bangalore",
    profession: "UX Designer",
    education: "NID",
    image: "/indian-woman-creative-professional-portrait.jpg",
    interests: ["Art", "Photography", "Yoga"],
    verified: true,
  },
  {
    id: 4,
    name: "Arjun",
    age: 29,
    city: "Hyderabad",
    profession: "Data Scientist",
    education: "BITS Pilani",
    image: "/indian-man-tech-professional-portrait.jpg",
    interests: ["Tech", "Gaming", "Music"],
    verified: true,
  },
  {
    id: 5,
    name: "Sneha",
    age: 27,
    city: "Pune",
    profession: "Marketing Manager",
    education: "MICA",
    image: "/indian-woman-marketing-professional-portrait-smili.jpg",
    interests: ["Dance", "Cooking", "Travel"],
    verified: true,
  },
  {
    id: 6,
    name: "Vikram",
    age: 30,
    city: "Chennai",
    profession: "Entrepreneur",
    education: "ISB",
    image: "/indian-man-entrepreneur-professional-portrait.jpg",
    interests: ["Business", "Tennis", "Reading"],
    verified: true,
  },
];

export function FeaturedProfiles() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("profiles-container");
    if (container) {
      const scrollAmount = 320;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <section id="profiles" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-primary font-semibold mb-3">Featured Profiles</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Meet Your Potential Match
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Handpicked profiles based on compatibility and preferences. All
              profiles are 100% verified.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profiles Carousel */}
        <div
          id="profiles-container"
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="flex-shrink-0 w-72 group hover:shadow-xl transition-all duration-300 overflow-hidden snap-start"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Verified badge */}
                {profile.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}

                {/* Like button */}
                <button className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
                  <Heart className="h-5 w-5 text-white" />
                </button>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">
                    {profile.name}, {profile.age}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.city}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.education}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full mt-4 rounded-full bg-transparent"
                  variant="outline"
                  asChild
                >
                  <Link href={`/profile/${profile.id}`}>
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Button size="lg" asChild className="rounded-full px-8">
            <Link href="/explore">View All Profiles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
