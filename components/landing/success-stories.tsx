"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react"

const stories = [
  {
    id: 1,
    names: "Priya & Arjun",
    location: "Mumbai",
    date: "Married Dec 2025",
    image: "/happy-indian-couple-wedding-traditional.jpg",
    quote:
      "MySaadi made finding each other so easy! We matched based on our love for travel and music. Three months later, we were engaged. The ₹39 unlock was the best investment ever!",
    unlockPrice: "₹39",
  },
  {
    id: 2,
    names: "Sneha & Vikram",
    location: "Bangalore",
    date: "Engaged Oct 2025",
    image: "/happy-indian-couple-engagement-ceremony.jpg",
    quote:
      "We both were skeptical about online matrimony, but MySaadi changed everything. The verified profiles gave us confidence, and the AI matching was spot on!",
    unlockPrice: "₹39",
  },
  {
    id: 3,
    names: "Ananya & Rahul",
    location: "Delhi",
    date: "Married Jan 2026",
    image: "/indian-couple-wedding-reception-happy.jpg",
    quote:
      "Found my soulmate in just 2 weeks! MySaadi's interface is so modern and easy to use. Our families loved that all profiles were verified.",
    unlockPrice: "₹39",
  },
]

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => setActiveIndex((prev) => (prev + 1) % stories.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length)

  return (
    <section id="success-stories" className="py-20 md:py-28 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-3">Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Real Couples, Real Love</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of couples who found their perfect match on MySaadi.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-video md:aspect-auto md:h-full min-h-[300px]">
                  <Image
                    src={stories[activeIndex].image || "/placeholder.svg"}
                    alt={stories[activeIndex].names}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 md:bg-gradient-to-l" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-lg md:text-xl leading-relaxed mb-6 italic">
                    &ldquo;{stories[activeIndex].quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6 text-primary fill-primary" />
                    <div>
                      <p className="font-semibold text-lg">{stories[activeIndex].names}</p>
                      <p className="text-sm text-muted-foreground">
                        {stories[activeIndex].location} • {stories[activeIndex].date}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Started with just{" "}
                      <span className="font-semibold text-primary">{stories[activeIndex].unlockPrice}</span> unlock
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent" onClick={prev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent" onClick={next}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
