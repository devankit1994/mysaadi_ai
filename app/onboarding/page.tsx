import { ProfileSetupWizard } from "@/components/auth/profile-setup-wizard"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <span className="text-xl font-bold">
                My<span className="text-primary">Saadi</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <ProfileSetupWizard />
        </div>
      </main>
    </div>
  )
}
