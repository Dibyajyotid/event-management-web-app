"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export function CTA() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Dark Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {/* Icon Section */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
              <span className="text-sm font-semibold text-yellow-400">
                JOIN THE COMMUNITY
              </span>
            </div>
          </motion.div>

          {/* Main Icon */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl inline-block"
            >
              <Calendar className="h-16 w-16 text-white" />
            </motion.div>
            {/* Floating particles */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
            />
            <motion.div
              animate={{
                y: [5, -5, 5],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-1 -left-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg"
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
          >
            Ready to Discover Your Next Event?
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join{" "}
            <span className="text-yellow-400 font-semibold">
              thousands of professionals
            </span>{" "}
            who use EventHub to find amazing events, network with peers, and
            advance their careers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/events">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Browse Events
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </motion.div>
                  </span>

                  {/* Button Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-300 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 font-semibold transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    Create Free Account
                  </span>

                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Trusted by professionals from{" "}
              <span className="text-gray-400">Google, Microsoft, Apple</span>{" "}
              and more
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
