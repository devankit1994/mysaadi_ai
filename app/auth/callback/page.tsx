"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();

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
      });
    };

    handleSession();
  }, []);

  return <p>Logging you in...</p>;
}
