"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ProfileSetupWizard,
  type ProfileFormData,
} from "@/components/auth/profile-setup-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userEmail = session?.user?.email;
        if (!userEmail) {
          setIsAuthenticated(false);
          return;
        }

        const { data: isAdmin } = await supabase.rpc("check_is_admin", {
          email_input: userEmail,
        });

        setIsAuthenticated(!!isAdmin);
        if (!isAdmin) {
          await supabase.auth.signOut();
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to verify admin session");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const handleCreateUser = async (profile: ProfileFormData, photos: File[]) => {
    setIsSubmitting(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("Missing admin session. Please sign in again.");
      }

      if (!email) {
        throw new Error("Email is required");
      }

      const form = new FormData();
      form.append(
        "payload",
        JSON.stringify({
          email,
          phone: phone || undefined,
          ...profile,
          isComplete: true,
          photos: [],
        }),
      );
      for (const file of photos) {
        form.append("photos", file);
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to create user");
      }

      toast.success("User created");
      router.push("/admin");
    } catch (e: any) {
      const msg = e?.message || "Failed to create user";
      setError(msg);
      toast.error(msg);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Admin access required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              Please sign in via the admin login.
            </p>
            <Button asChild>
              <Link href="/admin">Go to Admin Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <span className="text-xl font-bold">
                My<span className="text-primary">Saadi</span>
              </span>
            </Link>
            <Badge variant="secondary">Admin Panel</Badge>
          </div>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a new user</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-create-email">Email</Label>
                <Input
                  id="admin-create-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-create-phone">Phone (optional)</Label>
                <Input
                  id="admin-create-phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <ProfileSetupWizard
          title="Profile details"
          submitLabel={isSubmitting ? "Creating..." : "Create user"}
          deferPhotoUpload
          onSubmitProfileWithFiles={handleCreateUser}
        />
      </main>
    </div>
  );
}
