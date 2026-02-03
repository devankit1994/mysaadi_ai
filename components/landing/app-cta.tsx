"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Star, Smartphone } from "lucide-react"

export function AppCTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Smartphone className="h-4 w-4 mr-2" />
              Available on All Devices
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
              Ready to Find <span className="text-primary">Your Person</span>?
            </h2>

            <p className="text-lg text-muted-foreground max-w-lg">
              Join 50,000+ users who are already finding meaningful connections on MySaadi. Your soulmate might be just
              one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg group">
                <Link href="/login">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                    <Image
                      src={`/indian-person-headshot-.jpg?height=40&width=40&query=indian person headshot ${i}`}
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Rated 4.9/5 by 10,000+ users</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Phone mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-[500px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
                  <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    <Image src="/mobile-app-matrimony-profile-cards-interface.jpg" alt="MySaadi App" fill className="object-cover" />
                  </div>
                  {/* Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground rounded-full" />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-16 -left-4 glass rounded-2xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary fill-primary" />
                  <span className="font-semibold">It&apos;s a Match!</span>
                </div>
              </div>

              <div className="absolute bottom-24 -right-4 glass rounded-2xl p-4 shadow-lg animate-float delay-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">₹39</p>
                  <p className="text-xs text-muted-foreground">Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
