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
import { useEffect, useState } from "react";
import { StatsResponse } from "@/types/analyticsTypes";

interface StatCard {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  href: string;
}

interface RecentActivity {
  id: string;
  type: "booked" | "saved" | "attended";
  eventName: string;
  timeAgo: string;
}

// interface ApiStatsResponse {
//   overview: {
//     totalUsers: number;
//     totalEvents: number;
//     totalBookings: number;
//     totalRevenue: number;
//     newUsers: number;
//     newEvents: number;
//     newBookings: number;
//     revenueInRange: number;
//   };
//   charts: {
//     dailyStats: any[];
//     categoryStats: Array<{ _id: string; count: number }>;
//     topEvents: Array<{ _id: string; name: string; date: string }>;
//   };
// }

export function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data: StatsResponse = await res.json();

      // Map API data to stat cards
      const mappedStats: StatCard[] = [
        {
          title: "Upcoming Events",
          value: data.charts.topEvents.length,
          description: "Events you're attending",
          icon: Calendar,
          href: "/dashboard/events",
        },
        {
          title: "Total Bookings",
          value: data.overview.totalBookings,
          description: "All-time bookings",
          icon: Ticket,
          href: "/dashboard/bookings",
        },
        {
          title: "Saved Events",
          value: 0, // Could fetch user's wishlist if available
          description: "Events in your wishlist",
          icon: Heart,
          href: "/dashboard/favorites",
        },
        {
          title: "Events Attended",
          value: 0, // Could calculate from completed events if available
          description: "Completed events",
          icon: TrendingUp,
          href: "/dashboard/analytics",
        },
      ];

      // Map recent activities from topEvents
      const mappedActivities: RecentActivity[] = data.charts.topEvents
        .slice(0, 5)
        .map((event, idx) => ({
          id: event._id || idx.toString(),
          type: "booked",
          eventName: event.name,
          timeAgo: "Recently", // You can enhance this with actual timestamps
        }));

      setStats(mappedStats);
      setRecentActivities(mappedActivities);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "booked":
        return "bg-primary";
      case "saved":
        return "bg-chart-2";
      case "attended":
        return "bg-chart-3";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your events
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

      {/* Quick Actions & Recent Activity */}
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
              {recentActivities.length ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${getActivityColor(
                        activity.type
                      )}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                        : {activity.eventName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timeAgo}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
