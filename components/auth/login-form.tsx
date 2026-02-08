"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Step = "phone" | "otp" | "success";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/");
      }
    };

    checkUser();
  }, [router]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: "+91" + phone,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setStep("otp");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete OTP");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: "+91" + phone,
        token: otp,
        type: "sms",
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setStep("success");

      // Redirect after success animation
      setTimeout(async () => {
        if (!data.session?.user) {
          router.push("/login");
          return;
        }

        try {
          // Check if profile exists
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (!profile) {
            // Create new profile
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: data.session.user.id,
                phone: data.session.user.phone,
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
            }
            router.push("/onboarding");
          } else {
            // Profile exists, check if complete
            if (profile.is_complete) {
              router.push("/dashboard");
            } else {
              router.push("/onboarding");
            }
          }
        } catch (error) {
          console.error("Error checking profile:", error);
          router.push("/onboarding");
        }
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: "+91" + phone,
      });

      if (error) {
        setError(error.message);
      } else {
        setOtp("");
      }
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step: Phone Number */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          step === "phone"
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[-100%] absolute pointer-events-none",
        )}
      >
        {step === "phone" && (
          <div className="space-y-6">
            {/* <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhone(value);
                    setError("");
                  }}
                  className="pl-20 h-12"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div> */}

            {/* <Button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full h-12 rounded-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button> */}

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}

            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-full"
              size="lg"
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </Button>
          </div>
        )}
      </div>

      {/* Step: OTP Verification */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          step === "otp"
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[100%] absolute pointer-events-none",
        )}
      >
        {step === "otp" && (
          <div className="space-y-6">
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Change number
            </button>

            <Card className="bg-secondary/50">
              <CardContent className="p-4">
                <p className="text-sm">
                  We&apos;ve sent a 6-digit OTP to{" "}
                  <span className="font-semibold">+91 {phone}</span>
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2 w-full justify-center">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full h-12 rounded-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                Didn&apos;t receive OTP? Resend
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step: Success */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          step === "success"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 absolute pointer-events-none",
        )}
      >
        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-in zoom-in duration-300">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome to MySaadi!
              </h2>
              <p className="text-muted-foreground">
                Taking you to your dashboard...
              </p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
