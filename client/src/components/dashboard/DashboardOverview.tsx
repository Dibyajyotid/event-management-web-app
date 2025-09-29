"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";

export function DashboardOverview() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Upcoming Events",
      value: "3",
      description: "Events you're attending",
      icon: Calendar,
      href: "/dashboard/events",
    },
    {
      title: "Total Bookings",
      value: "12",
      description: "All-time bookings",
      icon: Ticket,
      href: "/dashboard/bookings",
    },
    {
      title: "Saved Events",
      value: "8",
      description: "Events in your wishlist",
      icon: Heart,
      href: "/dashboard/favorites",
    },
    {
      title: "Events Attended",
      value: "25",
      description: "Completed events",
      icon: TrendingUp,
      href: "/dashboard/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your events
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Link href={stat.href}>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                  View details →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/events">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Browse Events
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Ticket className="mr-2 h-4 w-4" />
                View My Bookings
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Heart className="mr-2 h-4 w-4" />
                Update Preferences
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest event interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Booked: Tech Conference 2024
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-chart-2 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Saved: Design Workshop</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-chart-3 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Attended: Networking Event
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
