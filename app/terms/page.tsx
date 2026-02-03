import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - MySaadi",
  description:
    "Read our Terms of Service to understand the rules and regulations for using MySaadi.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using MySaadi ("the Platform"), you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our services. MySaadi is a matrimony
                platform designed to help individuals find life partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                2. Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years of age (or the legal marriageable
                age in your jurisdiction) to register on MySaadi. By creating an
                account, you represent and warrant that you have the right,
                authority, and capacity to enter into this agreement and to
                abide by all of the terms and conditions of this Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                3. Account Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                login credentials. You agree to immediately notify us of any
                unauthorized use or suspected unauthorized use of your account
                or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                4. User Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to post, transmit, or share content that is
                illegal, abusive, harassing, threatening, defamatory, or
                otherwise objectionable. MySaadi reserves the right to terminate
                accounts that violate community guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                5. Subscription and Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                MySaadi offers premium services for a fee. All payments are
                final and non-refundable unless otherwise stated in our Refund
                Policy. We reserve the right to change our pricing at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                MySaadi is not responsible for any incorrect or inaccurate
                content posted on the website or in connection with the service.
                We do not guarantee the accuracy of user profiles or the success
                of any match.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                7. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us
                at support@mysaadi.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
