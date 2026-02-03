import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustBar } from "@/components/landing/trust-bar"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturedProfiles } from "@/components/landing/featured-profiles"
import { WhyMySaadi } from "@/components/landing/why-mysaadi"
import { SuccessStories } from "@/components/landing/success-stories"
import { PricingSection } from "@/components/landing/pricing-section"
import { AppCTA } from "@/components/landing/app-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <FeaturedProfiles />
      <WhyMySaadi />
      <SuccessStories />
      <PricingSection />
      <AppCTA />
      <Footer />
    </main>
  )
}
