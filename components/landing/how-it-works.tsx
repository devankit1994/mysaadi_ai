"use client"

import { UserPlus, Search, Unlock, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up with your mobile number in 60 seconds. Add your photos, interests, and preferences.",
    color: "bg-blue-500",
  },
  {
    icon: Search,
    title: "Explore Matches",
    description: "Browse thousands of verified profiles filtered by your preferences - location, education, interests.",
    color: "bg-primary",
  },
  {
    icon: Unlock,
    title: "Unlock for ₹39",
    description: "Found someone special? Unlock their contact details for just ₹39 - the lowest price in India.",
    color: "bg-green-500",
  },
  {
    icon: MessageCircle,
    title: "Connect & Chat",
    description: "Start your conversation directly via WhatsApp or call. No middlemen, no delays.",
    color: "bg-amber-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-3">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">How MySaadi Works</h2>
          <p className="text-muted-foreground text-lg">
            Finding your life partner shouldn&apos;t be complicated. Our streamlined process gets you connected in
            minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">{index + 1}</div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
