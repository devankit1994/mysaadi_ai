"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lock, Unlock, MessageCircle, Phone, Eye } from "lucide-react"

const features = [
  { icon: Unlock, text: "View full profile details" },
  { icon: Phone, text: "Get direct phone number" },
  { icon: MessageCircle, text: "WhatsApp contact access" },
  { icon: Eye, text: "See all photos" },
]

const comparison = [
  { feature: "Registration", mysaadi: "Free", others: "Free" },
  { feature: "Browse Profiles", mysaadi: "Free", others: "Free" },
  { feature: "Contact Unlock", mysaadi: "₹39 / profile", others: "₹500-2000 / month" },
  { feature: "Verification", mysaadi: "100% Verified", others: "Limited" },
  { feature: "Hidden Fees", mysaadi: "None", others: "Many" },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Limited Time Offer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Unlock Your Soulmate for Just <span className="text-primary">₹39</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No subscriptions. No hidden fees. Pay only when you find someone special.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
              Most Popular
            </div>

            <CardHeader className="text-center pb-0 pt-8">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground line-through">₹99</span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">₹39</span>
                <span className="text-muted-foreground">/ profile</span>
              </div>
              <p className="text-sm text-green-600 font-medium mt-2">Save 60% - Limited Time!</p>
            </CardHeader>

            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full rounded-full h-14 text-lg" asChild>
                <Link href="/login">Get Started Free</Link>
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Registration is 100% free. Pay only to unlock contacts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">How We Compare</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 font-medium text-primary">MySaadi</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-4 text-muted-foreground">{row.feature}</td>
                        <td className="p-4 text-center">
                          <span className="font-medium text-primary">{row.mysaadi}</span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">{row.others}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
