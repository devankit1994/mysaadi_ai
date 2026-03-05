"use client";

import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

const notifications = [
  {
    id: 1,
    title: "New match found!",
    message: "Rahul from Delhi matches your preferences",
    time: "2m ago",
  },
  {
    id: 2,
    title: "Profile viewed",
    message: "Sneha viewed your profile",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Request received",
    message: "Arjun sent you a connection request",
    time: "3h ago",
  },
];

export function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        if (!user?.id) {
          if (!active) return;
          setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (error) {
          setProfile(null);
          return;
        }

        setProfile(data ?? null);
      } catch (e) {
        if (!active) return;
        setProfile(null);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    setLoading(true);
    fetchProfile();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const fullName = useMemo(() => {
    const fromProfile = profile
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : "";
    if (fromProfile) return fromProfile;

    const fromMeta =
      (user?.user_metadata?.full_name as string | undefined) ||
      (user?.user_metadata?.name as string | undefined) ||
      "";
    if (fromMeta) return fromMeta;

    return user?.email || "User";
  }, [profile, user?.email, user?.user_metadata]);

  const initials = useMemo(() => {
    const parts = fullName.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return `${first}${second}`.toUpperCase();
  }, [fullName]);

  const avatarUrl =
    profile?.photos?.[0] ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    "/placeholder-user.jpg";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      <div className="flex items-center gap-3">
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {loading ? "Loading…" : fullName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left"
              >
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
