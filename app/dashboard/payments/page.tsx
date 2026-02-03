"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Wallet,
  Plus,
  Shield,
  Sparkles,
  Clock,
  ArrowRight,
  QrCode,
  Smartphone,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const creditPackages = [
  { id: 1, credits: 1, price: 39, perCredit: 39, popular: false },
  { id: 2, credits: 5, price: 175, perCredit: 35, popular: true, save: "10%" },
  { id: 3, credits: 10, price: 299, perCredit: 29.9, popular: false, save: "23%" },
  { id: 4, credits: 25, price: 625, perCredit: 25, popular: false, save: "36%" },
]

const transactions = [
  {
    id: 1,
    type: "unlock",
    name: "Rahul Sharma",
    amount: 39,
    date: "Jan 15, 2026",
    status: "completed",
  },
  {
    id: 2,
    type: "purchase",
    name: "5 Credits Pack",
    amount: 175,
    date: "Jan 10, 2026",
    status: "completed",
  },
  {
    id: 3,
    type: "unlock",
    name: "Vikram Patel",
    amount: 39,
    date: "Jan 8, 2026",
    status: "completed",
  },
  {
    id: 4,
    type: "unlock",
    name: "Arjun Singh",
    amount: 39,
    date: "Jan 5, 2026",
    status: "completed",
  },
]

export default function PaymentsPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"qr" | "processing" | "success">("qr")
  const [balance, setBalance] = useState(0)

  const handleBuyCredits = (packageId: number) => {
    setSelectedPackage(packageId)
    setPaymentStep("qr")
    setIsPaymentModalOpen(true)
  }

  const handlePaymentComplete = () => {
    setPaymentStep("processing")
    setTimeout(() => {
      setPaymentStep("success")
      const pkg = creditPackages.find((p) => p.id === selectedPackage)
      if (pkg) {
        setBalance((prev) => prev + pkg.credits * 39)
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Credits</h1>
        <p className="text-muted-foreground">Manage your unlock credits and view transaction history</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">₹{balance}</p>
                <p className="text-sm text-muted-foreground">{Math.floor(balance / 39)} profile unlocks available</p>
              </div>
            </div>
            <Button size="lg" className="rounded-full" onClick={() => handleBuyCredits(2)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Buy Unlock Credits
          </CardTitle>
          <CardDescription>Choose a package that suits your needs. More credits = bigger savings!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  "relative rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg",
                  pkg.popular ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  selectedPackage === pkg.id && "ring-2 ring-primary",
                )}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      {pkg.credits} {pkg.credits === 1 ? "Credit" : "Credits"}
                    </p>
                    {pkg.save && (
                      <Badge variant="secondary" className="mt-1">
                        Save {pkg.save}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-primary">₹{pkg.price}</p>
                    <p className="text-xs text-muted-foreground">₹{pkg.perCredit.toFixed(0)} per unlock</p>
                  </div>

                  <Button
                    className={cn(
                      "w-full rounded-full",
                      pkg.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                    onClick={() => handleBuyCredits(pkg.id)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocks">Unlocks</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === "unlock" ? "bg-primary/10" : "bg-green-100",
                        )}
                      >
                        {tx.type === "unlock" ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Plus className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.name}</p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", tx.type === "unlock" ? "text-primary" : "text-green-600")}>
                        {tx.type === "unlock" ? "-" : "+"}₹{tx.amount}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unlocks">
              {transactions.filter((tx) => tx.type === "unlock").length > 0 ? (
                transactions
                  .filter((tx) => tx.type === "unlock")
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors mb-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.name}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-primary">-₹{tx.amount}</p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No unlocks yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchases">
              {transactions.filter((tx) => tx.type === "purchase").length > 0 ? (
                transactions
                  .filter((tx) => tx.type === "purchase")
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors mb-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Plus className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.name}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">+₹{tx.amount}</p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No purchases yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          {paymentStep === "qr" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Pay via UPI
                </DialogTitle>
                <DialogDescription>Scan the QR code or use UPI ID to pay</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Amount to pay</p>
                  <p className="text-4xl font-bold text-primary">
                    ₹{creditPackages.find((p) => p.id === selectedPackage)?.price || 0}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-inner">
                    <Image
                      src="/upi-qr-code-payment.jpg"
                      alt="UPI QR Code"
                      width={160}
                      height={160}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Or pay using UPI ID</p>
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <code className="font-mono">mysaadi@upi</code>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">100% Secure Payment</span>
                </div>

                <Button className="w-full h-12 rounded-full" onClick={handlePaymentComplete}>
                  I&apos;ve Completed Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {paymentStep === "processing" && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <p className="font-semibold text-lg">Verifying Payment...</p>
                <p className="text-sm text-muted-foreground">Please wait while we confirm your payment</p>
              </div>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-xl">Payment Successful!</p>
                <p className="text-muted-foreground">
                  {creditPackages.find((p) => p.id === selectedPackage)?.credits} credits have been added to your
                  account
                </p>
              </div>
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  setIsPaymentModalOpen(false)
                  setPaymentStep("qr")
                }}
              >
                Continue
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
