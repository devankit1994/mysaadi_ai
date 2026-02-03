import { LoginForm } from "@/components/auth/login-form";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold">
              My<span className="text-primary">Saadi</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in with your mobile number to continue
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <Image
          src="/happy-couple.avif"
          alt="Happy couple"
          fill
          className="object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Soulmate in Just ₹39
          </h2>
          <p className="text-white/80 text-lg">
            Join 50,000+ users who found meaningful connections on MySaadi.
          </p>
        </div>
      </div>
    </div>
  );
}
