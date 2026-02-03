"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Heart, Shield, Users } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`space-y-8 ${mounted ? "animate-in fade-in slide-in-from-left-10 duration-700" : "opacity-0"}`}
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium rounded-full">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Trusted by 50,000+ Users
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Find Your{" "}
              <span className="text-primary relative">
                Soulmate
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/30"
                  />
                </svg>
              </span>{" "}
              in Just <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">₹39</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              The modern matrimony platform built for Gen-Z. Discover meaningful connections with verified profiles,
              smart AI matching, and the most affordable unlock pricing in India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg group">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-14 text-lg bg-transparent">
                <Link href="#profiles">Explore Matches</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-green-500" />
                <span>100% Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-5 w-5 text-primary" />
                <span>10,000+ Matches Made</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Active in 500+ Cities</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Cards */}
          <div
            className={`relative ${mounted ? "animate-in fade-in slide-in-from-right-10 duration-700 delay-300" : "opacity-0"}`}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main profile card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image src="/beautiful-indian-woman-smiling-portrait-profession.jpg" alt="Featured profile" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="font-semibold text-xl">Priya, 26</p>
                    <p className="text-white/80 text-sm">Software Engineer • Mumbai</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-white/20 text-white hover:bg-white/30">Travel</Badge>
                      <Badge className="bg-white/20 text-white hover:bg-white/30">Music</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-10 -left-4 w-48 glass rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">New Match!</p>
                    <p className="text-xs text-muted-foreground">98% Compatible</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 w-52 glass rounded-2xl p-4 shadow-xl animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src="/indian-man-headshot.png"
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Rahul sent a request</p>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
