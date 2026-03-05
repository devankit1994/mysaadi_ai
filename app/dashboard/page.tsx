"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Eye,
  Send,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Briefcase,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

type DashboardStat = {
  icon: any;
  label: string;
  value: string;
  change: string;
  color: string;
};

type MatchSuggestion = {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  profession: string | null;
  compatibility: number;
  image: string | null;
  verified: boolean;
};

type RecentView = {
  id: string;
  profileId: string | null;
  name: string;
  age: number | null;
  city: string | null;
  image: string | null;
  time: string;
};

type PendingAction = {
  type: string;
  description: string;
  icon: any;
  action: string;
};

function formatPercentChange(current: number, previous: number) {
  if (previous <= 0) {
    if (current <= 0) return "0%";
    return "+100%";
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>("");
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
    [],
  );
  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  const welcomeName = useMemo(() => {
    if (firstName) return firstName;
    const fromMeta =
      (user?.user_metadata?.first_name as string | undefined) ||
      (user?.user_metadata?.full_name as string | undefined) ||
      (user?.user_metadata?.name as string | undefined) ||
      "";
    if (fromMeta) return fromMeta.split(" ").filter(Boolean)[0] || fromMeta;
    return "";
  }, [firstName, user?.user_metadata]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        if (!user?.id) {
          if (!active) return;
          setFirstName("");
          setStats([]);
          setMatchSuggestions([]);
          setRecentViews([]);
          setPendingActions([]);
          return;
        }

        // Fetch current user's profile (for greeting + pending actions)
        const { data: myProfile } = await supabase
          .from("profiles")
          .select(
            "id, first_name, last_name, is_complete, phone, photos, preferred_city, looking_for, interests",
          )
          .eq("id", user.id)
          .single();

        if (!active) return;
        setFirstName(myProfile?.first_name || "");

        // Stats: compare last 7 days vs previous 7 days
        const now = new Date();
        const last7 = new Date(now);
        last7.setDate(now.getDate() - 7);
        const prev14 = new Date(now);
        prev14.setDate(now.getDate() - 14);

        const [
          viewsLast7,
          viewsPrev7,
          receivedLast7,
          receivedPrev7,
          sentLast7,
          sentPrev7,
          matchesLast7,
          matchesPrev7,
        ] = await Promise.all([
          supabase
            .from("profile_views")
            .select("id", { count: "exact", head: true })
            .eq("viewed_id", user.id)
            .gte("created_at", last7.toISOString()),
          supabase
            .from("profile_views")
            .select("id", { count: "exact", head: true })
            .eq("viewed_id", user.id)
            .gte("created_at", prev14.toISOString())
            .lt("created_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .eq("to_user", user.id)
            .eq("status", "pending")
            .gte("created_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .eq("to_user", user.id)
            .eq("status", "pending")
            .gte("created_at", prev14.toISOString())
            .lt("created_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .eq("from_user", user.id)
            .eq("status", "pending")
            .gte("created_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .eq("from_user", user.id)
            .eq("status", "pending")
            .gte("created_at", prev14.toISOString())
            .lt("created_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .or(`from_user.eq.${user.id},to_user.eq.${user.id}`)
            .eq("status", "accepted")
            .gte("responded_at", last7.toISOString()),
          supabase
            .from("interests")
            .select("id", { count: "exact", head: true })
            .or(`from_user.eq.${user.id},to_user.eq.${user.id}`)
            .eq("status", "accepted")
            .gte("responded_at", prev14.toISOString())
            .lt("responded_at", last7.toISOString()),
        ]);

        if (!active) return;

        const viewsLast7Count = viewsLast7.count ?? 0;
        const viewsPrev7Count = viewsPrev7.count ?? 0;
        const receivedLast7Count = receivedLast7.count ?? 0;
        const receivedPrev7Count = receivedPrev7.count ?? 0;
        const sentLast7Count = sentLast7.count ?? 0;
        const sentPrev7Count = sentPrev7.count ?? 0;
        const matchesLast7Count = matchesLast7.count ?? 0;
        const matchesPrev7Count = matchesPrev7.count ?? 0;

        setStats([
          {
            icon: Eye,
            label: "Profile Views",
            value: String(viewsLast7Count),
            change: formatPercentChange(viewsLast7Count, viewsPrev7Count),
            color: "text-blue-500",
          },
          {
            icon: Heart,
            label: "Interests Received",
            value: String(receivedLast7Count),
            change: formatPercentChange(receivedLast7Count, receivedPrev7Count),
            color: "text-primary",
          },
          {
            icon: Send,
            label: "Interests Sent",
            value: String(sentLast7Count),
            change: formatPercentChange(sentLast7Count, sentPrev7Count),
            color: "text-green-500",
          },
          {
            icon: Users,
            label: "Matches",
            value: String(matchesLast7Count),
            change: formatPercentChange(matchesLast7Count, matchesPrev7Count),
            color: "text-amber-500",
          },
        ]);

        // Match suggestions via RPC
        const { data: suggestions } = await supabase.rpc(
          "get_match_suggestions",
          { limit_input: 3 },
        );

        if (!active) return;

        setMatchSuggestions(
          (suggestions ?? []).map((row: any) => {
            const name =
              `${row.first_name || ""} ${row.last_name || ""}`.trim() || "User";
            return {
              id: row.id,
              name,
              age: typeof row.age === "number" ? row.age : null,
              city: row.city ?? null,
              profession: row.profession ?? null,
              compatibility: Number(row.compatibility ?? 0),
              image: row.photo ?? null,
              verified: !!row.verified,
            } satisfies MatchSuggestion;
          }),
        );

        // Recent views (join viewer profile via FK)
        const { data: views } = await supabase
          .from("profile_views")
          .select(
            "id, created_at, viewer:viewer_id ( id, first_name, last_name, city, date_of_birth, photos )",
          )
          .eq("viewed_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!active) return;

        setRecentViews(
          (views ?? []).map((v: any) => {
            const viewer = v.viewer;
            const name =
              `${viewer?.first_name || ""} ${viewer?.last_name || ""}`.trim() ||
              "Someone";
            const dob = viewer?.date_of_birth
              ? new Date(viewer.date_of_birth)
              : null;
            const age = dob
              ? Math.max(0, new Date().getFullYear() - dob.getFullYear())
              : null;
            const photo = viewer?.photos?.[0] || null;
            return {
              id: String(v.id),
              profileId: viewer?.id ? String(viewer.id) : null,
              name,
              age,
              city: viewer?.city ?? null,
              image: photo,
              time: v.created_at ? timeAgo(v.created_at) : "",
            } satisfies RecentView;
          }),
        );

        // Pending actions (derived from profile)
        const actions: PendingAction[] = [];
        const photoCount = Array.isArray(myProfile?.photos)
          ? myProfile.photos.length
          : 0;
        if (!myProfile?.is_complete || photoCount < 2) {
          actions.push({
            type: "Complete Profile",
            description: "Add more details/photos to increase visibility",
            icon: Sparkles,
            action: "Complete",
          });
        }

        if (!myProfile?.phone) {
          actions.push({
            type: "Verify Phone",
            description: "Verify your phone number for trust badge",
            icon: Star,
            action: "Verify",
          });
        }

        setPendingActions(actions);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    setLoading(true);
    load();

    return () => {
      active = false;
    };
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back{welcomeName ? `, ${welcomeName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your profile today.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/explore">
            <Users className="mr-2 h-4 w-4" />
            Explore Matches
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(loading
          ? [
              {
                icon: Eye,
                label: "Profile Views",
                value: "…",
                change: "…",
                color: "text-blue-500",
              },
              {
                icon: Heart,
                label: "Interests Received",
                value: "…",
                change: "…",
                color: "text-primary",
              },
              {
                icon: Send,
                label: "Interests Sent",
                value: "…",
                change: "…",
                color: "text-green-500",
              },
              {
                icon: Users,
                label: "Matches",
                value: "…",
                change: "…",
                color: "text-amber-500",
              },
            ]
          : stats
        ).map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Match Suggestions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Today&apos;s Top Matches
              </CardTitle>
              <CardDescription>Based on your preferences</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-4">
              {(loading ? [] : matchSuggestions).map((match) => (
                <Link
                  key={match.id}
                  href={`/profile/${match.id}`}
                  className="group relative rounded-xl overflow-hidden"
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={match.image || "/placeholder.svg"}
                      alt={match.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Compatibility badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 hover:bg-primary">
                        {match.compatibility}% Match
                      </Badge>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">
                        {match.name}
                        {typeof match.age === "number" ? `, ${match.age}` : ""}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="h-3 w-3" />
                        <span>{match.city || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Briefcase className="h-3 w-3" />
                        <span>{match.profession || "—"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {!loading && matchSuggestions.length === 0 ? (
                <div className="md:col-span-3 text-sm text-muted-foreground">
                  No suggestions yet.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Ready to Connect?</h3>
                <p className="text-muted-foreground">
                  Unlock profiles for just ₹39 and start chatting!
                </p>
              </div>
            </div>
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/explore">
                Find Your Match
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
