import { ProfileSetupWizard } from "@/components/auth/profile-setup-wizard";
import { Header } from "@/components/landing/header";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto px-4">
          <ProfileSetupWizard />
        </div>
      </main>
    </div>
  );
}
