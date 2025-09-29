"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Presentation,
  Users,
  GraduationCap,
  Handshake,
  Music,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Categories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const categories = [
    {
      name: "Conference",
      value: "conference",
      icon: Presentation,
      description: "Professional conferences and summits",
      count: "120+ events",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      name: "Workshop",
      value: "workshop",
      icon: GraduationCap,
      description: "Hands-on learning experiences",
      count: "85+ events",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      name: "Networking",
      value: "networking",
      icon: Handshake,
      description: "Connect with like-minded professionals",
      count: "95+ events",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      name: "Seminar",
      value: "seminar",
      icon: Users,
      description: "Educational seminars and talks",
      count: "60+ events",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
    {
      name: "Entertainment",
      value: "entertainment",
      icon: Music,
      description: "Concerts, shows, and entertainment",
      count: "75+ events",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-400",
    },
    {
      name: "Sports",
      value: "sports",
      icon: Trophy,
      description: "Sports events and competitions",
      count: "40+ events",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-400",
    },
  ];

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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants:Variants = {
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

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.05, 0.07, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">
              EXPLORE CATEGORIES
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
            Browse by Category
          </h2>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover events that match your{" "}
            <span className="text-blue-400 font-semibold">passions</span> and{" "}
            <span className="text-purple-400 font-semibold">interests</span>
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/events?category=${category.value}`}>
                <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 overflow-hidden group cursor-pointer h-full transition-all duration-300 hover:border-gray-600/70 hover:shadow-2xl hover:shadow-blue-500/10">
                  <CardContent className="p-6 relative">
                    {/* Gradient Background Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    {/* Animated Border Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                      style={{
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "subtract",
                        padding: "1px",
                      }}
                    />

                    <div className="relative z-10">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`p-3 rounded-xl ${category.bgColor} backdrop-blur-sm border border-gray-600/30 group-hover:border-gray-500/50 transition-all duration-300`}
                        >
                          <category.icon
                            className={`h-6 w-6 ${category.iconColor}`}
                          />
                        </motion.div>

                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                          {category.name}
                        </h3>

                        <p className="text-gray-300 leading-relaxed">
                          {category.description}
                        </p>

                        {/* Event Count Badge */}
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge
                            variant="secondary"
                            className={`bg-gradient-to-r ${category.color} text-white border-0 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            {category.count}
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Hover Indicator */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-300 bg-gray-900/50 backdrop-blur-sm font-semibold group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  View All Categories
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </span>

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
