import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MySaadi",
  description:
    "Learn how MySaadi collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when
                you create an account, create a profile, communicate with other
                users, or contact customer support. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Personal identification information (Name, email address,
                  phone number)
                </li>
                <li>
                  Profile information (Photos, religious/social details,
                  preferences)
                </li>
                <li>
                  Payment information (processed securely by our third-party
                  payment providers)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support messages
                </li>
                <li>
                  Match you with potential partners based on your preferences
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your
                information with other users as part of the matchmaking process
                (according to your privacy settings) and with third-party
                vendors who perform services on our behalf (e.g., payment
                processing, cloud hosting).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                4. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                5. Your Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You may update, correct, or delete your account information at
                any time by logging into your account or contacting us. You may
                also opt out of receiving promotional communications from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                6. Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track the
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                7. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at privacy@mysaadi.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
