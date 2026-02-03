"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, IndianRupee, Users, Smartphone, Lock, Heart, Clock } from "lucide-react"

const benefits = [
  {
    icon: IndianRupee,
    title: "₹39 Per Unlock",
    description: "The most affordable contact unlock in India. No hidden fees, no subscriptions.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "100% Verified Profiles",
    description: "Every profile is manually verified with ID proof and photos for your safety.",
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Our smart algorithm finds compatible matches based on 50+ parameters.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Experience",
    description: "Designed for Gen-Z. Swipe, match, and connect right from your phone.",
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Your data is encrypted and never shared. You control who sees your profile.",
  },
  {
    icon: Clock,
    title: "Quick Registration",
    description: "Sign up in 60 seconds with just your mobile number. Start matching instantly.",
  },
  {
    icon: Users,
    title: "Large User Base",
    description: "50,000+ active users across 500+ cities. Find matches near you.",
  },
  {
    icon: Heart,
    title: "Real Connections",
    description: "No fake profiles or bots. Every match is a real person looking for love.",
  },
]

export function WhyMySaadi() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">The Modern Way to Find Love</h2>
          <p className="text-muted-foreground text-lg">
            MySaadi is built different. We&apos;re not your parents&apos; matrimony site. We&apos;re designed for a
            generation that values authenticity, affordability, and speed.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 ${
                benefit.highlight ? "border-primary bg-primary/5 hover:bg-primary/10" : "hover:border-primary/20"
              }`}
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    benefit.highlight ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
