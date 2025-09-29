"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Event } from "@/types/eventTypes";

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/featured/list`
      );
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching featured events:", error);
    } finally {
      setLoading(false);
    }
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4 bg-gray-700" />
            <Skeleton className="h-6 w-96 mx-auto bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-48 rounded-xl bg-gray-700" />
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-2/3 bg-gray-700" />
                <Skeleton className="h-10 rounded-lg bg-gray-700 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.12, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </motion.div>
            <span className="text-sm font-semibold text-yellow-400">
              TRENDING NOW
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Featured Events
          </h2>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover the most{" "}
            <span className="text-yellow-400 font-semibold">
              popular events
            </span>{" "}
            happening now. Curated based on trending topics and community
            engagement.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                layout
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 300 },
                }}
                onHoverStart={() => setHoveredCard(event._id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    opacity: hoveredCard === event._id ? 0.3 : 0,
                    scale: hoveredCard === event._id ? 1.02 : 1,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-xl -z-10 transition-opacity duration-300"
                />

                {/* Featured Badge for first event */}
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 -right-3 z-20"
                  >
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-xs font-bold shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      TOP PICK
                    </div>
                  </motion.div>
                )}

                <EventCard
                  event={event}
                  className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 group-hover:border-yellow-400/30 transition-all duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/events">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore All Events
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </motion.div>
                </span>

                {/* Button Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            className="text-gray-400 mt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Join{" "}
            <span className="text-yellow-400 font-semibold">
              {events
                .reduce(
                  (acc, event) =>
                    acc +
                    (event.ticketTypes?.reduce(
                      (sum, ticket) => sum + (ticket.sold || 0),
                      0
                    ) || 0),
                  0
                )
                .toLocaleString()}
              +
            </span>{" "}
            attendees across our featured events
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
