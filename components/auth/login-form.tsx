"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Phone, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "phone" | "otp" | "success"

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete OTP")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("success")

    // Redirect after success animation
    setTimeout(() => {
      // Check if user is new (simulate with localStorage)
      const isNewUser = !localStorage.getItem("mysaadi_profile_complete")
      if (isNewUser) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    }, 2000)
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setOtp("")
  }

  return (
    <div className="space-y-6">
      {/* Step: Phone Number */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          step === "phone" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-100%] absolute pointer-events-none",
        )}
      >
        {step === "phone" && (
          <div className="space-y-6">
            <div className="space-y-2">
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
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setPhone(value)
                    setError("")
                  }}
                  className="pl-20 h-12"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button onClick={handleSendOTP} disabled={isLoading} className="w-full h-12 rounded-full" size="lg">
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
            </Button>
          </div>
        )}
      </div>

      {/* Step: OTP Verification */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          step === "otp" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[100%] absolute pointer-events-none",
        )}
      >
        {step === "otp" && (
          <div className="space-y-6">
            <button
              onClick={() => {
                setStep("phone")
                setOtp("")
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Change number
            </button>

            <Card className="bg-secondary/50">
              <CardContent className="p-4">
                <p className="text-sm">
                  We&apos;ve sent a 6-digit OTP to <span className="font-semibold">+91 {phone}</span>
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup className="gap-2 w-full justify-center">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </div>

            <Button onClick={handleVerifyOTP} disabled={isLoading} className="w-full h-12 rounded-full" size="lg">
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
          step === "success" ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute pointer-events-none",
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
              <h2 className="text-xl font-semibold mb-2">Welcome to MySaadi!</h2>
              <p className="text-muted-foreground">Taking you to your dashboard...</p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
