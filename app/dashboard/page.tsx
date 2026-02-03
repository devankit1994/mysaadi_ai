import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const stats = [
  { icon: Eye, label: "Profile Views", value: "128", change: "+12%", color: "text-blue-500" },
  { icon: Heart, label: "Interests Received", value: "24", change: "+8%", color: "text-primary" },
  { icon: Send, label: "Interests Sent", value: "15", change: "+5%", color: "text-green-500" },
  { icon: Users, label: "Matches", value: "8", change: "+2", color: "text-amber-500" },
]

const matchSuggestions = [
  {
    id: 1,
    name: "Rahul",
    age: 28,
    city: "Delhi",
    profession: "Product Manager",
    compatibility: 95,
    image: "/handsome-indian-man-professional-portrait-smiling.jpg",
    verified: true,
  },
  {
    id: 2,
    name: "Arjun",
    age: 29,
    city: "Bangalore",
    profession: "Data Scientist",
    compatibility: 92,
    image: "/indian-man-tech-professional-portrait.jpg",
    verified: true,
  },
  {
    id: 3,
    name: "Vikram",
    age: 30,
    city: "Mumbai",
    profession: "Entrepreneur",
    compatibility: 88,
    image: "/indian-man-entrepreneur-professional-portrait.jpg",
    verified: true,
  },
]

const recentViews = [
  {
    id: 1,
    name: "Sneha",
    age: 27,
    city: "Pune",
    image: "/indian-woman-marketing-professional-portrait-smili.jpg",
    time: "2h ago",
  },
  {
    id: 2,
    name: "Ananya",
    age: 25,
    city: "Chennai",
    image: "/indian-woman-creative-professional-portrait.jpg",
    time: "5h ago",
  },
  {
    id: 3,
    name: "Priya M.",
    age: 26,
    city: "Hyderabad",
    image: "/indian-woman-professional-portrait-smiling.jpg",
    time: "1d ago",
  },
]

const pendingActions = [
  {
    type: "Complete Profile",
    description: "Add more photos to increase visibility",
    icon: Sparkles,
    action: "Complete",
  },
  { type: "Verify Phone", description: "Verify your phone number for trust badge", icon: Star, action: "Verify" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Priya!</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your profile today.</p>
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
        {stats.map((stat, index) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
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
            <div className="grid md:grid-cols-3 gap-4">
              {matchSuggestions.map((match) => (
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
                      <Badge className="bg-primary/90 hover:bg-primary">{match.compatibility}% Match</Badge>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">
                        {match.name}, {match.age}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="h-3 w-3" />
                        <span>{match.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Briefcase className="h-3 w-3" />
                        <span>{match.profession}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Profile Views */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Who Viewed You
            </CardTitle>
            <CardDescription>People who checked your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentViews.map((view) => (
              <Link
                key={view.id}
                href={`/profile/${view.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Avatar>
                  <AvatarImage src={view.image || "/placeholder.svg"} />
                  <AvatarFallback>{view.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {view.name}, {view.age}
                  </p>
                  <p className="text-sm text-muted-foreground">{view.city}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {view.time}
                </div>
              </Link>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/views">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Take these actions to improve your match rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {pendingActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.type}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <Button size="sm">{action.action}</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <p className="text-muted-foreground">Unlock profiles for just ₹39 and start chatting!</p>
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
  )
}
