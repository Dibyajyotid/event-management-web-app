"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { Sparkles, RefreshCw, User, Zap, Brain, Rocket } from "lucide-react";
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants: Variants = {
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"
          />
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 animate-pulse" />

          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
                <Skeleton className="h-7 w-48 bg-gradient-to-r from-gray-700 to-gray-600" />
              </div>
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-gray-700 to-gray-600" />
            </div>
            <Skeleton className="h-4 w-72 bg-gradient-to-r from-gray-700 to-gray-600 mt-3" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative">
                  <Skeleton className="h-96 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700" />
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="float"
          className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <Card className="bg-gray-900/80 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        {/* Animated Border Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg -z-10"
        />

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-md" />
                <Sparkles className="h-7 w-7 text-white relative z-10" />
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  AI Recommendations
                </CardTitle>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-cyan-300/80 flex items-center gap-2 mt-1"
                >
                  <Brain className="h-3 w-3" />
                  Powered by machine learning
                </motion.p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm relative overflow-hidden group"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Analyzing..." : "Refresh AI"}
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {recommendations.preferences.categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl border border-cyan-400/10 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 text-sm">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <User className="h-4 w-4 text-cyan-400" />
                  </motion.div>
                  <span className="text-cyan-300/90 font-medium">
                    Personalized based on your interests:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.preferences.categories.map(
                      (category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 backdrop-blur-sm">
                            <Zap className="h-3 w-3 mr-1" />
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
        </CardHeader>

        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {recommendations.recommendations
                .slice(0, 6)
                .map((event, index) => (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      y: -12,
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      },
                    }}
                    onHoverStart={() => setHoveredCard(event._id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="relative group"
                  >
                    {/* Holographic Glow Effect */}
                    <motion.div
                      animate={{
                        opacity: hoveredCard === event._id ? 0.4 : 0,
                        scale: hoveredCard === event._id ? 1.05 : 1,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl blur-xl -z-10 transition-all duration-500"
                    />

                    {/* Animated Border */}
                    <motion.div
                      animate={{
                        opacity: hoveredCard === event._id ? 1 : 0.3,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl opacity-30 -z-10"
                      style={{
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "subtract",
                        padding: "2px",
                      }}
                    />

                    <EventCard
                      event={{ ...event }}
                      className="bg-gray-800/60 backdrop-blur-xl border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-500 shadow-xl"
                    />

                    {/* Priority Indicator */}
                    {index < 2 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: index * 0.2 + 0.5,
                          type: "spring",
                        }}
                        className="absolute -top-2 -right-2 z-20"
                      >
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black text-xs font-bold shadow-lg">
                          <Rocket className="h-3 w-3" />
                          TOP {index + 1}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* View More with Futuristic Design */}
          {recommendations.recommendations.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Explore All AI Suggestions
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 ml-2" />
                    </motion.div>
                  </span>

                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </motion.div>
  );
}
