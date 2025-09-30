"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { Sparkles, RefreshCw, User } from "lucide-react";
import { Event } from "@/types/eventTypes";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationsData {
  recommendations: Event[];
  preferences: {
    categories: string[];
    tags: string[];
  };
}

export function EventRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] =
    useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data: RecommendationsData = await response.json();
        setRecommendations(data);
      } else if (response.status === 204) {
        console.warn("Unauthorized: user may need to login again");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-700" />
              <Skeleton className="h-6 w-48 bg-gray-700" />
            </div>
            <Skeleton className="h-9 w-24 bg-gray-700" />
          </div>
          <Skeleton className="h-4 w-64 bg-gray-700 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-gray-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl overflow-hidden">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Recommended for You
              </CardTitle>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-300 bg-gray-800/50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {recommendations.preferences.categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <User className="h-4 w-4 text-blue-400" />
                  <span>Based on your interests:</span>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.preferences.categories.map(
                      (category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30"
                          >
                            {category}
                          </Badge>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl -z-10" />
        </CardHeader>

        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {recommendations.recommendations
                .slice(0, 6)
                .map((event, index) => (
                  <motion.div
                    whileHover={{
                      y: -8,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    className="relative group"
                  >
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                    <EventCard
                      event={{ ...event }}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 group-hover:border-yellow-400/30 transition-all duration-300"
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* View more section */}
          {recommendations.recommendations.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20"
                >
                  View All Recommendations
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
