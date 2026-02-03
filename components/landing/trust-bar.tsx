"use client"

import { Shield, Users, MapPin, Heart, Star, CheckCircle } from "lucide-react"

const stats = [
  { icon: Users, value: "50,000+", label: "Active Users", color: "text-blue-500" },
  { icon: Heart, value: "10,000+", label: "Successful Matches", color: "text-primary" },
  { icon: MapPin, value: "500+", label: "Cities Covered", color: "text-green-500" },
  { icon: Star, value: "4.9/5", label: "User Rating", color: "text-amber-500" },
]

const badges = [
  { icon: Shield, label: "SSL Secured" },
  { icon: CheckCircle, label: "Verified Profiles" },
  { icon: Shield, label: "Privacy Protected" },
]

export function TrustBar() {
  return (
    <section className="py-12 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <stat.icon className={`h-8 w-8 ${stat.color} mb-3 transition-transform group-hover:scale-110`} />
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className="h-4 w-4" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
