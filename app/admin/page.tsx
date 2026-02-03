"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Users,
  CreditCard,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  UserCheck,
  Calendar,
  IndianRupee,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react"

const stats = [
  { label: "Total Users", value: "52,847", change: "+12%", trend: "up", icon: Users },
  { label: "Active Today", value: "8,392", change: "+8%", trend: "up", icon: UserCheck },
  { label: "Revenue (Month)", value: "₹4,82,350", change: "+23%", trend: "up", icon: IndianRupee },
  { label: "Profile Unlocks", value: "12,456", change: "+5%", trend: "up", icon: CreditCard },
]

const recentUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
    joinDate: "Jan 15, 2026",
    status: "active",
    verified: true,
    image: "/beautiful-indian-woman-professional-portrait-smili.jpg",
    profileComplete: 85,
  },
  {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    phone: "+91 98765 43211",
    city: "Delhi",
    joinDate: "Jan 14, 2026",
    status: "active",
    verified: true,
    image: "/handsome-indian-man-professional-portrait-smiling.jpg",
    profileComplete: 92,
  },
  {
    id: 3,
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "+91 98765 43212",
    city: "Bangalore",
    joinDate: "Jan 14, 2026",
    status: "pending",
    verified: false,
    image: "/indian-woman-marketing-professional-portrait-smili.jpg",
    profileComplete: 45,
  },
  {
    id: 4,
    name: "Arjun Singh",
    email: "arjun@gmail.com",
    phone: "+91 98765 43213",
    city: "Chennai",
    joinDate: "Jan 13, 2026",
    status: "active",
    verified: true,
    image: "/indian-man-tech-professional-portrait.jpg",
    profileComplete: 78,
  },
  {
    id: 5,
    name: "Ananya Reddy",
    email: "ananya@gmail.com",
    phone: "+91 98765 43214",
    city: "Hyderabad",
    joinDate: "Jan 12, 2026",
    status: "suspended",
    verified: false,
    image: "/indian-woman-creative-professional-portrait.jpg",
    profileComplete: 60,
  },
]

const recentPayments = [
  { id: 1, user: "Priya Sharma", amount: 175, type: "5 Credits Pack", date: "Jan 15, 2026", status: "completed" },
  { id: 2, user: "Rahul Kumar", amount: 39, type: "Profile Unlock", date: "Jan 15, 2026", status: "completed" },
  { id: 3, user: "Vikram Patel", amount: 299, type: "10 Credits Pack", date: "Jan 14, 2026", status: "completed" },
  { id: 4, user: "Sneha Patel", amount: 39, type: "Profile Unlock", date: "Jan 14, 2026", status: "pending" },
  { id: 5, user: "Arjun Singh", amount: 625, type: "25 Credits Pack", date: "Jan 13, 2026", status: "completed" },
]

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
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
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Avatar>
              <AvatarImage src="/admin-avatar-profile.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary" className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Shield className="h-4 w-4 mr-2" />
              Moderation
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all registered users</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="bg-transparent">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.image || "/placeholder.svg"} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {user.name}
                                {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.phone}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${user.profileComplete}%` }} />
                            </div>
                            <span className="text-sm">{user.profileComplete}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All transactions and payments</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last 7 days
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">TXN{payment.id.toString().padStart(6, "0")}</TableCell>
                        <TableCell>{payment.user}</TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review flagged profiles and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No pending reviews</p>
                  <p className="text-muted-foreground">All flagged content has been reviewed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
